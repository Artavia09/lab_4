import { createServer } from 'http';
import { createReadStream } from 'fs';
import { stat } from 'fs/promises';
import { extname, join, normalize } from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = normalize(__filename.substring(0, __filename.lastIndexOf('/')));
const HOST = process.env.HOST || '0.0.0.0';
const PORT = process.env.PORT || 8080;
const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon"
};
function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}
const server = createServer(async (req, res) => {
  try {
    setCors(res);
    if (req.method === 'OPTIONS') { res.statusCode = 204; res.end(); return; }
    let url = req.url || '/';
    if (url === '/') url = '/public/index.html';
    const safePath = normalize(url).replace(/^\.+/, '');
    const filePath = join(__dirname, safePath);
    const st = await stat(filePath).catch(() => null);
    if (!st || !st.isFile()) {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.end('Not found');
      return;
    }
    const ext = extname(filePath).toLowerCase();
    res.setHeader('Content-Type', MIME[ext] || 'application/octet-stream');
    createReadStream(filePath).pipe(res);
  } catch (err) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.end('Internal Server Error');
    console.error(err);
  }
});
server.listen(PORT, HOST, () => {
  console.log(`Servidor estático en http://${HOST}:${PORT}`);
  console.log('Sirviendo /public/index.html');
});
