export const config = {
  matcher: ['/admin', '/admin.html', '/admin/:path*']
};

export default function middleware(request) {
  const auth = request.headers.get('authorization');
  const expectedUser = 'admin';
  const expectedPass = process.env.ADMIN_PASSWORD;

  if (!expectedPass) {
    return new Response('Server misconfiguration: ADMIN_PASSWORD not set', { status: 500 });
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
