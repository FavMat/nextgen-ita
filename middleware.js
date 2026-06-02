export const config = {
  matcher: ['/admin', '/admin.html', '/admin/:path*']
};

export default function middleware(request) {
  const auth = request.headers.get('authorization');
  const expectedUser = 'admin';
  const expectedPass = process.env.ADMIN_PASSWORD;

  if (!expectedPass) {
    const keys = Object.keys(process.env || {}).filter(k => !k.startsWith('VERCEL') && !k.startsWith('AWS')).join(',');
    return new Response('DEBUG env keys visible: ' + keys, { status: 500 });
  }

  if (auth) {
    const [scheme, encoded] = auth.split(' ');
    if (scheme === 'Basic' && encoded) {
      try {
        const decoded = atob(encoded);
        const sep = decoded.indexOf(':');
        const user = decoded.slice(0, sep);
        const pass = decoded.slice(sep + 1);
        if (user === expectedUser && pass === expectedPass) {
          return;
        }
      } catch {}
    }
  }

  return new Response('Authentication required.', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Ciao Mirta Admin", charset="UTF-8"',
      'Cache-Control': 'no-store'
    }
  });
}
