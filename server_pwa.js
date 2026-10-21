const http = require('http');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const os = require('os');

const PORT = parseInt(process.env.PORT || '4567', 10);
const BASE_DIR = __dirname;
const PERMANENT_URL = 'https://rizki2204.github.io/wordkeep/';

const MIME_MAP = {
  '.html': 'text/html; charset=utf-8',
  '.json': 'application/manifest+json; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.png': 'image/png',
  '.ico': 'image/x-icon'
};

function getRealLanUrls(port) {
  const nets = os.networkInterfaces();
  const wifiUrls = [];
  const otherUrls = [];
  for (const [name, addrs] of Object.entries(nets)) {
    if (/wsl|hyper-v|vethernet|virtualbox|vmware|loopback|docker|tunnel/i.test(name)) continue;
    for (const addr of addrs) {
      if (addr.family === 'IPv4' && !addr.internal && !addr.address.startsWith('169.254.')) {
        const url = `http://${addr.address}:${port}`;
        if (/wi-?fi|wlan|wireless/i.test(name)) wifiUrls.push(url);
        else otherUrls.push(url);
      }
    }
  }
  const combined = [...wifiUrls, ...otherUrls];
  return combined.length ? combined : [`http://localhost:${port}`];
}

const server = http.createServer((req, res) => {
  const urlPath = decodeURIComponent((req.url || '/').split('?')[0]);

  if (urlPath === '/__lan_info') {
    const payload = JSON.stringify({
      port: PORT,
      urls: getRealLanUrls(PORT),
      publicUrl: PERMANENT_URL
    });
    res.writeHead(200, {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store'
    });
    res.end(payload);
    return;
  }

  let relFile = 'index.html';
  if (urlPath === '/' || urlPath === '/index.html') {
    relFile = 'index.html';
  } else if (urlPath.toLowerCase() === '/bahasainggris_v2.html') {
    relFile = 'BahasaInggris_v2.html';
  } else if (urlPath.toLowerCase() === '/manifest.json') {
    relFile = 'manifest.json';
  } else if (urlPath.toLowerCase() === '/sw.js') {
    relFile = 'sw.js';
  } else if (urlPath.toLowerCase() === '/icon-192.png') {
    relFile = 'icon-192.png';
  } else if (urlPath.toLowerCase() === '/icon-512.png') {
    relFile = 'icon-512.png';
  } else if (urlPath.toLowerCase() === '/wordkeep.ico' || urlPath.toLowerCase() === '/favicon.ico') {
    relFile = 'wordkeep.ico';
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
    return;
  }

  const fullPath = path.join(BASE_DIR, relFile);
  if (!fs.existsSync(fullPath)) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('File Not Found');
    return;
  }

  const ext = path.extname(relFile).toLowerCase();
  const mime = MIME_MAP[ext] || 'application/octet-stream';
  const acceptEncoding = req.headers['accept-encoding'] || '';

  const raw = fs.readFileSync(fullPath);
  if (/\bgzip\b/.test(acceptEncoding) && (ext === '.html' || ext === '.js' || ext === '.json')) {
    zlib.gzip(raw, (err, compressed) => {
      if (err) {
        res.writeHead(200, { 'Content-Type': mime, 'Content-Length': raw.length, 'Cache-Control': 'no-cache' });
        res.end(raw);
      } else {
        res.writeHead(200, {
          'Content-Type': mime,
          'Content-Encoding': 'gzip',
          'Content-Length': compressed.length,
          'Cache-Control': 'no-cache'
        });
        res.end(compressed);
      }
    });
  } else {
    res.writeHead(200, { 'Content-Type': mime, 'Content-Length': raw.length, 'Cache-Control': 'no-cache' });
    res.end(raw);
  }
});

server.listen(PORT, '0.0.0.0', () => {
  const urls = getRealLanUrls(PORT);
  console.log(`\n=======================================================`);
  console.log(`Wordkeep PWA Server aktif!`);
  console.log(`=======================================================`);
  console.log(`🌐 LINK RESMI HP (BISA DIBUKA KAPAN PUN & DI MANA PUN):`);
  console.log(`   ${PERMANENT_URL}`);
  console.log(`=======================================================`);
  console.log(`- Desktop Lokal: http://localhost:${PORT}/`);
  urls.forEach(u => console.log(`- Wi-Fi HP Lokal: ${u}`));
  console.log(`=======================================================\n`);
});
