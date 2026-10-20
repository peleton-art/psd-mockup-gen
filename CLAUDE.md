# Mockup Server (psd-mockup-gen)

Local batch mockup generator: upload Photoshop PSD mockup templates plus design images, get every PSD x image combination back as JPG/PNG mockups in ZIP files. Runs fully locally, no external APIs.

## Stack and running
- Node.js ESM, single file `server.js`: Express + `multer` (in-memory uploads, 200 MB per file) + `@webtoon/psd` (PSD parsing) + `sharp` (compositing/encoding) + `jszip`.
- UI: static `public/index.html`.
- Run: `npm install && npm start` (or `node server.js`), then open http://localhost:3001. Port 3001 is hardcoded. `start.bat` does the same on Windows.
- `bench.mjs` is an ad-hoc benchmark with hardcoded local Windows paths; edit the paths before using it.
- No tests, no CI, no deployment target.

## Request flow
- `POST /generate` (multipart: `psds` max 50, `images` max 200, `format` = `jpg`|`png`, `quality` 1-100) registers a job and returns `{ jobId, total }` immediately; work continues in the background.
- `GET /progress/:jobId` is polled for progress; when finished it returns the chunk list and per-mockup errors.
- `GET /download/:jobId/:name` streams one chunk ZIP (`mockups_partN.zip`).
- Output is split into ~1 GB ZIP chunks written to `$TMPDIR/mockup-jobs/<jobId>/`; the job and its files are deleted after 1 hour. Jobs live in an in-memory `Map`, so a restart loses them.
- Multipart filenames arrive as latin1 from multer/busboy and are re-decoded as UTF-8 so Danish characters (æøå) survive into output names.

## PSD handling
- The target layer is the first visible Smart Object (`SoLd`/`PlLd` layer property); if none exists, the largest visible layer is used.
- Perspective warp: Smart Object corners are read from the `PlLd` blob as 8 big-endian doubles at offset 61 (TL, TR, BR, BL), validated against the layer bounding box (±60 px). See `parsePlLdCorners`, `computeHomography` (DLT homography), `perspectiveWarpDesign` (inverse mapping with bilinear interpolation). If a new PSD renders unwarped, check whether its corner data still sits at offset 61.
- Layers may extend beyond the canvas (negative `top`/`left`, or larger than the canvas). `layerToOp` clips them with `sharp().extract()` before compositing; keep that clip when touching compositing code, or sharp will reject the overlay.
- Blend mode and opacity are taken from each layer's properties (`BLEND` map).
