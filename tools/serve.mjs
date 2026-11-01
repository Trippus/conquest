// Zero-dependency static server for local development.
// Listens on all interfaces so you can open the game on your iPhone over Wi-Fi.
import http from 'node:http';
import os from 'node:os';
import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const port = Number(process.env.PORT) || 5183;
const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json',
  '.webmanifest': 'application/manifest+json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.mp3': 'audio/mpeg',
  '.svg': 'image/svg+xml',
};

http
  .createServer(async (req, res) => {
    let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    if (p.endsWith('/')) p += 'index.html';
    const file = path.join(root, p);
    if (!file.startsWith(root) || p.split('/').some((s) => s.startsWith('.'))) {
      res.writeHead(404).end('Not found');
      return;
    }
    try {
      const data = await readFile(file);
      const head = { 'content-type': types[path.extname(file)] || 'application/octet-stream', 'cache-control': 'no-cache', 'accept-ranges': 'bytes' };
      // Byte ranges, as GitHub Pages serves them: the music seeks and loops with them.
      const range = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range ?? '');
      if (range && (range[1] || range[2])) {
        const start = range[1] ? Number(range[1]) : Math.max(0, data.length - Number(range[2]));
        const end = range[1] && range[2] ? Math.min(Number(range[2]), data.length - 1) : data.length - 1;
        if (start > end) {
          res.writeHead(416, { 'content-range': `bytes */${data.length}` }).end();
          return;
        }
        res.writeHead(206, { ...head, 'content-range': `bytes ${start}-${end}/${data.length}` });
        res.end(data.subarray(start, end + 1));
        return;
      }
      res.writeHead(200, head);
      res.end(data);
    } catch {
      res.writeHead(404).end('Not found');
    }
  })
  .listen(port, '0.0.0.0', () => {
    console.log(`Conquest running at http://localhost:${port}`);
    for (const nets of Object.values(os.networkInterfaces())) {
      for (const n of nets || []) if (n.family === 'IPv4' && !n.internal) console.log(`  on your phone: http://${n.address}:${port}`);
    }
  });
