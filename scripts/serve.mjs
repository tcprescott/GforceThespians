// Minimal static file server for the built app — no Sec-Fetch security
// middleware (unlike `vite preview`), so the headless smoke test can load
// module scripts exactly like GitHub Pages will. Serves dist/ under the
// production base path /GforceThespians/.
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';

const ROOT = new URL('../dist/', import.meta.url).pathname;
const BASE = '/GforceThespians/';
const PORT = Number(process.argv[2] ?? 4190);

const TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.json': 'application/json',
  '.ico': 'image/x-icon',
};

createServer(async (req, res) => {
  let path = decodeURIComponent((req.url ?? '/').split('?')[0]);
  if (path.startsWith(BASE)) path = path.slice(BASE.length);
  else if (path === '/' || path === BASE.slice(0, -1)) path = '';
  if (path === '' || path.endsWith('/')) path += 'index.html';

  const file = normalize(join(ROOT, path));
  if (!file.startsWith(ROOT)) {
    res.writeHead(403).end('forbidden');
    return;
  }
  try {
    const data = await readFile(file);
    res.writeHead(200, { 'content-type': TYPES[extname(file)] ?? 'application/octet-stream' });
    res.end(data);
  } catch {
    // SPA fallback to index.html
    try {
      const html = await readFile(join(ROOT, 'index.html'));
      res.writeHead(200, { 'content-type': 'text/html' }).end(html);
    } catch {
      res.writeHead(404).end('not found');
    }
  }
}).listen(PORT, () => console.log(`static server on http://localhost:${PORT}${BASE}`));
