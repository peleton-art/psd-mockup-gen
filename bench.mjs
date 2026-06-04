import { readdirSync, readFileSync, statSync } from 'fs';
import { join, basename } from 'path';

const nPsd = parseInt(process.argv[2] || '8');
const nImg = parseInt(process.argv[3] || '8');
const fmt  = (process.argv[4] || 'jpg');

const psdDir = 'C:\\Users\\kebab\\Desktop\\sletmiggg';
const imgDir = 'G:\\Shared drives\\Peleton\\Alle plakater samlet\\Nye plakater';

const psds = readdirSync(psdDir).filter(f => f.toLowerCase().endsWith('.psd')).slice(0, nPsd).map(f => join(psdDir, f));
const imgs = readdirSync(imgDir).filter(f => /\.(jpg|jpeg|png)$/i.test(f)).slice(0, nImg).map(f => join(imgDir, f));

const fd = new FormData();
for (const p of psds) fd.append('psds', new Blob([readFileSync(p)]), basename(p));
for (const i of imgs) fd.append('images', new Blob([readFileSync(i)]), basename(i));
fd.append('format', fmt);
fd.append('quality', '90');

const combos = psds.length * imgs.length;
console.log(`${psds.length} PSDs x ${imgs.length} images = ${combos} mockups (${fmt})`);
const t0 = performance.now();

const start = await (await fetch('http://localhost:3001/generate', { method: 'POST', body: fd })).json();
console.log('jobId:', start.jobId, '| total:', start.total);

let last = -1, result;
while (true) {
  const p = await (await fetch('http://localhost:3001/progress/' + start.jobId)).json();
  if (p.done !== last) {
    const el = (performance.now() - t0) / 1000;
    const eta = p.done > 0 ? (p.total - p.done) * (el / p.done) : 0;
    process.stdout.write(`\r  ${p.done}/${p.total}  elapsed ${el.toFixed(0)}s  ETA ${eta.toFixed(0)}s   `);
    last = p.done;
  }
  if (p.error) { console.log('\nJOB ERROR:', p.error); break; }
  if (p.finished) { result = p; break; }
  await new Promise(r => setTimeout(r, 400));
}

if (result) {
  const secs = (performance.now() - t0) / 1000;
  const totalZip = result.chunks.reduce((s, c) => s + c.size, 0);
  console.log(`\nFinished in ${secs.toFixed(1)}s | ${(secs/combos).toFixed(2)}s/mockup`);
  console.log(`Chunks: ${result.chunks.length} ->`, result.chunks.map(c => `${c.name} ${(c.size/1024/1024).toFixed(0)}MB`).join(', '));
  console.log(`Total zip: ${(totalZip/1024/1024).toFixed(0)} MB`);
  if (result.errors?.length) console.log(`Errors: ${result.errors.length}`, result.errors.slice(0,3));
  // verify first chunk downloads
  const dl = await fetch(`http://localhost:3001/download/${start.jobId}/${result.chunks[0].name}`);
  const buf = Buffer.from(await dl.arrayBuffer());
  console.log(`Download ${result.chunks[0].name}: HTTP ${dl.status}, got ${(buf.length/1024/1024).toFixed(0)} MB`);
}
