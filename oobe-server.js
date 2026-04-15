const http = require('http');
const fs = require('fs');
const path = require('path');
const ROOT = 'C:\\Users\\joale\\AI-Maker\\Projects\\OOBE_V2\\OOBE_Theming_FRE';
const PORT = 5500;
const MIME = {
  '.html':'text/html','.css':'text/css','.js':'application/javascript',
  '.json':'application/json','.png':'image/png','.jpg':'image/jpeg',
  '.jpeg':'image/jpeg','.gif':'image/gif','.svg':'image/svg+xml',
  '.webp':'image/webp','.ico':'image/x-icon','.woff':'font/woff',
  '.woff2':'font/woff2','.ttf':'font/ttf','.mp4':'video/mp4',
  '.webm':'video/webm','.lottie':'application/json'
};
http.createServer((req, res) => {
  let url = req.url.split('?')[0];
  if (url === '/' || url === '') url = '/index.html';
  if (url.endsWith('/')) url += 'index.html';
  const filePath = path.join(ROOT, url);
  fs.readFile(filePath, (err, data) => {
    if (err) { res.writeHead(404); res.end('Not found: ' + url); return; }
    const ext = path.extname(filePath).toLowerCase();
    const isWallpaper = url.includes('/assets/wallpaper/');
    const isSW = url === '/sw.js';
    const headers = {
      'Content-Type': MIME[ext] || 'application/octet-stream',
      'Access-Control-Allow-Origin': '*',
      // Wallpapers: cache for 1 hour (browser cache complements the SW cache)
      // SW itself: no-cache so updates are picked up immediately
      'Cache-Control': isSW ? 'no-cache' : isWallpaper ? 'public, max-age=3600' : 'no-cache',
    };
    res.writeHead(200, headers);
    res.end(data);
  });
}).listen(PORT, () => console.log('OOBE server running on http://localhost:' + PORT));
