import { readFileSync } from 'fs';
import { join } from 'path';

const EXPECTED_USER = 'admin';

export default function handler(req, res) {
  const expectedPass = process.env.ADMIN_PASSWORD;
  if (!expectedPass) {
    res.status(500).send('Server misconfiguration: ADMIN_PASSWORD not set');
    return;
  }

  const auth = req.headers['authorization'];
  let ok = false;
  if (auth && auth.startsWith('Basic ')) {
    try {
      const decoded = Buffer.from(auth.slice(6), 'base64').toString('utf8');
      const sep = decoded.indexOf(':');
      const user = decoded.slice(0, sep);
      const pass = decoded.slice(sep + 1);
      if (user === EXPECTED_USER && pass === expectedPass) ok = true;
    } catch {}
  }

  if (!ok) {
    res.setHeader('WWW-Authenticate', 'Basic realm="Ciao Mirta Admin", charset="UTF-8"');
    res.setHeader('Cache-Control', 'no-store');
    res.status(401).send('Authentication required.');
    return;
  }

  try {
    const html = readFileSync(join(process.cwd(), 'admin.html'), 'utf8');
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('X-Robots-Tag', 'noindex, nofollow');
    res.status(200).send(html);
  } catch (err) {
    console.error('admin.html read failed:', err.message);
    res.status(500).send('Could not load admin.');
  }
}
