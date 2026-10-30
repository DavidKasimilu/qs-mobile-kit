// Copies the web app into ./www and bundles Lucide icons with an SRI hash.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const root = process.cwd();
const out = path.join(root, 'www');
const LUCIDE_URL = 'https://unpkg.com/lucide@0.468.0/dist/umd/lucide.min.js';
const items = ['index.html', 'manifest.json', 'sw.js', 'css', 'js', 'assets'];

fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });

for (const item of items) {
  if (fs.existsSync(item)) {
    fs.cpSync(item, path.join(out, item), { recursive: true });
    console.log('copied', item);
  } else {
    console.warn('WARNING: missing', item);
  }
}

(async () => {
  try {
    const res = await fetch(LUCIDE_URL);
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const buf = Buffer.from(await res.arrayBuffer());
    const integrity = 'sha384-' + crypto.createHash('sha384').update(buf).digest('base64');

    fs.mkdirSync(path.join(out, 'vendor'), { recursive: true });
    fs.writeFileSync(path.join(out, 'vendor', 'lucide.min.js'), buf);

    const htmlPath = path.join(out, 'index.html');
    let html = fs.readFileSync(htmlPath, 'utf8');
    html = html.replace(/<script[^>]*lucide[^>]*>\s*<\/script>/gi, '');
    const tag = `<script src="vendor/lucide.min.js" integrity="${integrity}" crossorigin="anonymous"></script>`;
    html = html.replace('</head>', `  ${tag}\n</head>`);
    fs.writeFileSync(htmlPath, html);

    console.log('Lucide bundled with integrity', integrity);
  } catch (err) {
    console.warn('Lucide step skipped, using original index.html:', err.message);
  }
})();
