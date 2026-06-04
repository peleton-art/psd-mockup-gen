import express from 'express';
import multer from 'multer';
import sharp from 'sharp';
import Psd from '@webtoon/psd';
import JSZip from 'jszip';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { tmpdir } from 'os';
import { randomUUID } from 'crypto';
import { mkdirSync, statSync, existsSync, createReadStream, createWriteStream, rmSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 200 * 1024 * 1024 } });

// Where chunk zips are staged on disk, and the per-chunk size budget.
const JOBS_DIR    = join(tmpdir(), 'mockup-jobs');
const CHUNK_BYTES = 1024 * 1024 * 1024; // ~1 GB of mockups per zip
const JOB_TTL_MS  = 60 * 60 * 1000;     // delete a job's files 1h after creation

// In-flight + finished jobs, polled by the client for progress/ETA.
// jobId -> { total, done, chunks, errors, finished, error }
const jobs = new Map();

// Stream a JSZip to disk so we never hold a whole >2GB buffer in memory.
function writeZipToFile(zip, filePath) {
  return new Promise((resolve, reject) => {
    zip.generateNodeStream({ type: 'nodebuffer', streamFiles: true })
      .pipe(createWriteStream(filePath))
      .on('finish', resolve)
      .on('error', reject);
  });
}

// no-store: prevent the browser from serving a stale cached index.html
app.use(express.static(join(__dirname, 'public'), {
  etag: false,
  lastModified: false,
  setHeaders: res => res.setHeader('Cache-Control', 'no-store'),
}));

const BLEND = {
  'norm': 'over', 'diss': 'over',
  'dark': 'darken', 'mul ': 'multiply', 'idiv': 'colour-burn', 'lbrn': 'colour-burn',
  'lite': 'lighten', 'scrn': 'screen', 'div ': 'colour-dodge', 'lddg': 'colour-dodge',
  'over': 'overlay', 'sLit': 'soft-light', 'hLit': 'hard-light',
  'diff': 'difference', 'smud': 'exclusion',
};

function flattenLayers(children = []) {
  const out = [];
  for (const child of children) {
    if (child.type === 'Group') out.push(...flattenLayers(child.children));
    else out.push(child);
  }
  return out;
}

function isSmartObject(layer) {
  const props = layer.layerFrame?.layerProperties?.additionalLayerProperties || [];
  return Array.isArray(props) && props.some(p => p.key === 'SoLd' || p.key === 'PlLd');
}

// Read source document dimensions from PlLd: finds "Rght" and "Btom" descriptor keys.
// Returns { srcW, srcH } or null.
function parsePlLdSourceDims(data) {
  const RGHT = [0x52,0x67,0x68,0x74]; // "Rght"
  const BTOM = [0x42,0x74,0x6f,0x6d]; // "Btom"
  function findKey(key, after = 0) {
    outer: for (let i = after; i <= data.length - 4; i++) {
      for (let k = 0; k < 4; k++) if (data[i+k] !== key[k]) continue outer;
      return i;
    }
    return -1;
  }
  function readDoubleAfterKey(pos) {
    if (pos < 0 || pos + 16 > data.length) return null;
    const dv = new DataView(data.buffer, data.byteOffset, data.byteLength);
    const type = String.fromCharCode(data[pos+4], data[pos+5], data[pos+6], data[pos+7]);
    const off = type === 'UntF' ? pos + 12 : pos + 8;
    if (off + 8 > data.length) return null;
    const v = dv.getFloat64(off, false);
    return isFinite(v) && v > 0 ? v : null;
  }
  const w = readDoubleAfterKey(findKey(RGHT));
  const h = readDoubleAfterKey(findKey(BTOM));
  return (w && h) ? { srcW: w, srcH: h } : null;
}

// Extract 4 corner points (TL, TR, BR, BL) from PlLd binary descriptor.
// Returns [[x,y],[x,y],[x,y],[x,y]] in canvas coordinates, or null.
function parsePlLdCorners(data, layer) {
  if (!data || data.length < 125) return null;
  const dv = new DataView(data.buffer, data.byteOffset, data.byteLength);
  const L = layer.left, T = layer.top;
  const R = L + layer.width, B = T + layer.height;

  // Corners are stored as 8 big-endian doubles starting at offset 61:
  // x1,y1 (TL), x2,y2 (TR), x3,y3 (BR), x4,y4 (BL)
  // Validate by checking bounding box against layer bounds.
  for (const start of [61]) {
    if (start + 64 > data.length) continue;
    const vals = [];
    let ok = true;
    for (let i = 0; i < 8; i++) {
      const v = dv.getFloat64(start + i * 8, false);
      if (!isFinite(v)) { ok = false; break; }
      vals.push(v);
    }
    if (!ok) continue;
    const xs = [vals[0], vals[2], vals[4], vals[6]];
    const ys = [vals[1], vals[3], vals[5], vals[7]];
    const minX = Math.min(...xs), maxX = Math.max(...xs);
    const minY = Math.min(...ys), maxY = Math.max(...ys);
    if (Math.abs(minX - L) < 60 && Math.abs(maxX - R) < 60 &&
        Math.abs(minY - T) < 60 && Math.abs(maxY - B) < 60) {
      return [[vals[0],vals[1]],[vals[2],vals[3]],[vals[4],vals[5]],[vals[6],vals[7]]];
    }
  }
  return null;
}

// Compute homography H mapping src[i] → dst[i] (4 point correspondences).
// Returns flat 9-element array (row-major, h[8]=1).
function computeHomography(src, dst) {
  const A = [];
  const b = [];
  for (let i = 0; i < 4; i++) {
    const [sx, sy] = src[i];
    const [dx, dy] = dst[i];
    A.push([sx, sy, 1, 0, 0, 0, -sx*dx, -sy*dx]);
    b.push(dx);
    A.push([0, 0, 0, sx, sy, 1, -sx*dy, -sy*dy]);
    b.push(dy);
  }
  // Gaussian elimination with partial pivoting
  const n = 8;
  for (let col = 0; col < n; col++) {
    let maxRow = col;
    for (let row = col + 1; row < n; row++)
      if (Math.abs(A[row][col]) > Math.abs(A[maxRow][col])) maxRow = row;
    [A[col], A[maxRow]] = [A[maxRow], A[col]];
    [b[col], b[maxRow]] = [b[maxRow], b[col]];
    for (let row = col + 1; row < n; row++) {
      const f = A[row][col] / A[col][col];
      for (let c = col; c < n; c++) A[row][c] -= f * A[col][c];
      b[row] -= f * b[col];
    }
  }
  const h = new Array(n);
  for (let row = n - 1; row >= 0; row--) {
    h[row] = b[row];
    for (let col = row + 1; col < n; col++) h[row] -= A[row][col] * h[col];
    h[row] /= A[row][row];
  }
  return [...h, 1];
}

// Perspective-warp imgBuffer to fill the soWidth×soHeight bounding box.
// corners: [[x,y]×4] TL,TR,BR,BL in canvas coordinates.
// srcDims: { srcW, srcH } from PlLd source document size (or null to compute from edges).
async function perspectiveWarpDesign(imgBuffer, corners, soLeft, soTop, soWidth, soHeight, srcDims) {
  // Use source document dimensions from PlLd when available; fall back to edge-length estimate.
  let srcW, srcH;
  if (srcDims) {
    srcW = Math.round(srcDims.srcW);
    srcH = Math.round(srcDims.srcH);
  } else {
    const dist = ([ax,ay],[bx,by]) => Math.hypot(bx-ax, by-ay);
    srcW = Math.max(1, Math.round(Math.max(dist(corners[0],corners[1]), dist(corners[3],corners[2]))));
    srcH = Math.max(1, Math.round(Math.max(dist(corners[0],corners[3]), dist(corners[1],corners[2]))));
  }

  // Destination corners relative to the bounding box origin
  const dst = corners.map(([x, y]) => [x - soLeft, y - soTop]);
  // Source corners (axis-aligned rectangle)
  const src = [[0,0],[srcW,0],[srcW,srcH],[0,srcH]];

  // Inverse homography: output pixel → source pixel
  const H = computeHomography(dst, src);
  const [h0,h1,h2,h3,h4,h5,h6,h7,h8] = H;

  // Get raw RGBA pixels of the design scaled to source dimensions
  const srcRaw = await sharp(imgBuffer)
    .resize(srcW, srcH, { fit: 'cover', position: 'centre' })
    .ensureAlpha()
    .raw()
    .toBuffer();

  const outRaw = Buffer.alloc(soWidth * soHeight * 4, 0);
  const srcW4 = srcW * 4;

  for (let oy = 0; oy < soHeight; oy++) {
    for (let ox = 0; ox < soWidth; ox++) {
      const w = h6*ox + h7*oy + h8;
      const sx = (h0*ox + h1*oy + h2) / w;
      const sy = (h3*ox + h4*oy + h5) / w;
      if (sx < 0 || sy < 0 || sx >= srcW - 1 || sy >= srcH - 1) continue;

      const x0 = sx | 0, y0 = sy | 0;
      const fx = sx - x0, fy = sy - y0;
      const ifx = 1 - fx, ify = 1 - fy;
      const s00 = y0 * srcW4 + x0 * 4;
      const s10 = s00 + 4;
      const s01 = s00 + srcW4;
      const s11 = s01 + 4;
      const outIdx = (oy * soWidth + ox) * 4;

      outRaw[outIdx]   = (srcRaw[s00]   * ifx * ify + srcRaw[s10]   * fx * ify + srcRaw[s01]   * ifx * fy + srcRaw[s11]   * fx * fy) | 0;
      outRaw[outIdx+1] = (srcRaw[s00+1] * ifx * ify + srcRaw[s10+1] * fx * ify + srcRaw[s01+1] * ifx * fy + srcRaw[s11+1] * fx * fy) | 0;
      outRaw[outIdx+2] = (srcRaw[s00+2] * ifx * ify + srcRaw[s10+2] * fx * ify + srcRaw[s01+2] * ifx * fy + srcRaw[s11+2] * fx * fy) | 0;
      outRaw[outIdx+3] = (srcRaw[s00+3] * ifx * ify + srcRaw[s10+3] * fx * ify + srcRaw[s01+3] * ifx * fy + srcRaw[s11+3] * fx * fy) | 0;
    }
  }

  return sharp(outRaw, { raw: { width: soWidth, height: soHeight, channels: 4 } }).png().toBuffer();
}

async function layerToOp(layer, canvasW, canvasH) {
  if (layer.isHidden || layer.width <= 0 || layer.height <= 0) return null;

  // Clip layer to canvas bounds (layers can extend outside canvas)
  const srcLeft = Math.max(0, -layer.left);
  const srcTop  = Math.max(0, -layer.top);
  const dstLeft = Math.max(0, layer.left);
  const dstTop  = Math.max(0, layer.top);
  const clipW   = Math.min(layer.width  - srcLeft, canvasW - dstLeft);
  const clipH   = Math.min(layer.height - srcTop,  canvasH - dstTop);
  if (clipW <= 0 || clipH <= 0) return null;

  try {
    const pixels = await layer.composite();
    const pixelBuf = Buffer.from(pixels.buffer, pixels.byteOffset, pixels.byteLength);
    let pipe = sharp(pixelBuf, { raw: { width: layer.width, height: layer.height, channels: 4 } });
    if (srcLeft > 0 || srcTop > 0 || clipW < layer.width || clipH < layer.height) {
      pipe = pipe.extract({ left: srcLeft, top: srcTop, width: clipW, height: clipH });
    }
    const buf = await pipe.png().toBuffer();

    const lp      = layer.layerFrame?.layerProperties;
    const blendKey = lp?.blendMode ?? 'norm';
    const opacity  = lp?.opacity != null ? lp.opacity / 255 : 1;

    return { input: buf, left: dstLeft, top: dstTop, blend: BLEND[blendKey] || 'over', premultiplied: false, ...(opacity < 1 && { opacity }) };
  } catch(e) {
    console.error('layerToOp failed:', layer.name, e.message);
    return null;
  }
}

app.post('/generate', upload.fields([
  { name: 'psds', maxCount: 50 },
  { name: 'images', maxCount: 200 },
]), async (req, res) => {
  const psdFiles = req.files?.psds || [];
  const imgFiles = req.files?.images || [];
  const format   = req.body?.format === 'png' ? 'png' : 'jpg';
  const quality  = Math.min(100, Math.max(1, parseInt(req.body?.quality || '90')));

  // multer/busboy decodes multipart filenames as latin1, turning UTF-8 bytes into
  // mojibake (e.g. "ø" → "Ã¸"). Re-interpret as UTF-8 so Danish characters survive
  // into the output folder/file names. A no-op for ASCII names.
  for (const f of [...psdFiles, ...imgFiles]) {
    f.originalname = Buffer.from(f.originalname, 'latin1').toString('utf8');
  }

  if (!psdFiles.length || !imgFiles.length) {
    return res.status(400).json({ error: 'Upload mindst én PSD og ét billede' });
  }

  // Register the job and respond immediately; the client polls /progress for ETA.
  const jobId  = randomUUID();
  const jobDir = join(JOBS_DIR, jobId);
  mkdirSync(jobDir, { recursive: true });
  const job = { total: psdFiles.length * imgFiles.length, done: 0, chunks: [], errors: [], finished: false, error: null };
  jobs.set(jobId, job);
  setTimeout(() => { jobs.delete(jobId); rmSync(jobDir, { recursive: true, force: true }); }, JOB_TTL_MS).unref();

  res.json({ jobId, total: job.total });

  // Process in the background, updating job.done after each mockup.
  generateMockups(job, jobDir, psdFiles, imgFiles, format, quality)
    .catch(err => { console.error(err); job.error = err.message; })
    .finally(() => { job.finished = true; });
});

async function generateMockups(job, jobDir, psdFiles, imgFiles, format, quality) {
  const errors = job.errors;

  let zip        = new JSZip();
  let chunkBytes = 0;
  let chunkIndex = 0;

  // Finalize the current zip to disk and start a fresh one.
  async function flushChunk() {
    if (chunkBytes === 0) return;
    chunkIndex++;
    const name = `mockups_part${chunkIndex}.zip`;
    await writeZipToFile(zip, join(jobDir, name));
    job.chunks.push({ name, size: statSync(join(jobDir, name)).size });
    zip = new JSZip();
    chunkBytes = 0;
  }

  {
    for (const psdFile of psdFiles) {
      let psd;
      try {
        psd = Psd.parse(psdFile.buffer.buffer);
      } catch (e) {
        errors.push(`${psdFile.originalname}: parse-fejl — ${e.message}`);
        continue;
      }

      const { width, height } = psd;
      const layers = flattenLayers(psd.children);

      let soLayer = layers.find(l => !l.isHidden && isSmartObject(l) && l.width > 0 && l.height > 0);
      if (!soLayer) {
        soLayer = [...layers]
          .filter(l => !l.isHidden && l.width > 0 && l.height > 0)
          .sort((a, b) => b.width * b.height - a.width * a.height)[0];
      }
      if (!soLayer) {
        errors.push(`${psdFile.originalname}: ingen lag fundet`);
        continue;
      }

      const soIdx    = layers.indexOf(soLayer);
      const soLeft   = Math.max(0, soLayer.left);
      const soTop    = Math.max(0, soLayer.top);
      const soWidth  = Math.min(soLayer.width,  width  - soLeft);
      const soHeight = Math.min(soLayer.height, height - soTop);

      // Try to extract perspective corners and source dimensions from the SmartObject's PlLd descriptor
      const plldProps  = soLayer.layerFrame?.layerProperties?.additionalLayerProperties || [];
      const plldEntry  = Array.isArray(plldProps) ? plldProps.find(p => p.key === 'PlLd') : null;
      const corners    = plldEntry ? parsePlLdCorners(plldEntry.data, soLayer) : null;
      const srcDims    = plldEntry ? parsePlLdSourceDims(plldEntry.data) : null;
      if (corners) console.log(`${psdFile.originalname}: warp corners found, srcDims=${srcDims ? srcDims.srcW+'x'+srcDims.srcH : 'from edges'}`);

      // Inherit the SmartObject's own blend mode and opacity for the design layer
      const soLp      = soLayer.layerFrame?.layerProperties;
      const soBlend   = BLEND[soLp?.blendMode] || 'over';
      const soOpacity = soLp?.opacity != null ? soLp.opacity / 255 : 1;

      const belowOps = (await Promise.all(layers.slice(soIdx + 1).map(l => layerToOp(l, width, height)))).filter(Boolean);
      const aboveOps = (await Promise.all(layers.slice(0, soIdx).map(l => layerToOp(l, width, height)))).filter(Boolean);

      const psdBase = psdFile.originalname.replace(/\.psd$/i, '');

      for (const imgFile of imgFiles) {
        const imgBase = imgFile.originalname.replace(/\.[^.]+$/, '');
        const outName = `${imgBase}/${imgBase}_${psdBase}.${format}`;

        try {
          let designBuf;
          if (corners) {
            designBuf = await perspectiveWarpDesign(imgFile.buffer, corners, soLeft, soTop, soWidth, soHeight, srcDims);
          } else {
            designBuf = await sharp(imgFile.buffer)
              .resize(soWidth, soHeight, { fit: 'cover', position: 'centre' })
              .toBuffer();
          }

          const designOp = { input: designBuf, left: soLeft, top: soTop, blend: soBlend, premultiplied: false, ...(soOpacity < 1 && { opacity: soOpacity }) };

          const result = await sharp({
            create: { width, height, channels: 4, background: { r: 255, g: 255, b: 255, alpha: 1 } }
          })
          .composite([
            ...belowOps,
            designOp,
            ...aboveOps,
          ])
          .toFormat(format === 'png' ? 'png' : 'jpeg', format === 'jpg' ? { quality } : {})
          .toBuffer();

          zip.file(outName, result);
          chunkBytes += result.length;
          if (chunkBytes >= CHUNK_BYTES) await flushChunk();
        } catch (err) {
          errors.push(`${imgBase}_${psdBase}.${format}: ${err.message}`);
        } finally {
          job.done++;
        }
      }

      // Release this PSD's source buffer so memory doesn't grow across PSDs.
      psdFile.buffer = null;
    }

    await flushChunk(); // write any remaining mockups
  }
}

// Progress + result manifest for a job. Polled by the client to show ETA.
app.get('/progress/:jobId', (req, res) => {
  const job = jobs.get(req.params.jobId);
  if (!job) return res.status(404).json({ error: 'Job ikke fundet' });
  res.json({
    total: job.total, done: job.done,
    finished: job.finished, error: job.error,
    chunks: job.finished ? job.chunks : [],
    errors: job.finished ? job.errors : [],
  });
});

// Serve a single chunk zip. res.end (via stream pipe) avoids ETag hashing.
app.get('/download/:jobId/:name', (req, res) => {
  const { jobId, name } = req.params;
  if (!/^[0-9a-f-]{36}$/i.test(jobId) || !/^mockups_part\d+\.zip$/.test(name)) {
    return res.status(400).end();
  }
  const file = join(JOBS_DIR, jobId, name);
  if (!existsSync(file)) return res.status(404).end();
  res.setHeader('Content-Type', 'application/zip');
  res.setHeader('Content-Disposition', `attachment; filename="${name}"`);
  res.setHeader('Content-Length', statSync(file).size);
  createReadStream(file).pipe(res);
});

app.listen(3001, () => console.log('Mockup Generator → http://localhost:3001'));
