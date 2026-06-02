/**
 * POST /api/account-delete
 * Deletes the calling user's auth.users record (cascades to public.profiles).
 * Requires: Authorization: Bearer <access_token> from the user's session.
 * Uses the Supabase secret key server-side (never exposed to browser).
 */
import { createClient } from '@supabase/supabase-js';

const URL = process.env.CIAOMIRTA_SUPABASE_URL;
const SECRET = process.env.CIAOMIRTA_SUPABASE_SECRET_KEY;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!URL || !SECRET) {
    return res.status(500).json({ error: 'Server misconfigured (missing CIAOMIRTA_SUPABASE_SECRET_KEY).' });
  }

  const auth = req.headers['authorization'] || '';
  const m = /^Bearer\s+(.+)$/i.exec(auth);
  if (!m) return res.status(401).json({ error: 'Missing bearer token' });
  const accessToken = m[1];

  // Verify the token belongs to a real user (using anon client + getUser).
  const publishable = process.env.CIAOMIRTA_SUPABASE_PUBLISHABLE_KEY;
  if (!publishable) return res.status(500).json({ error: 'Server misconfigured (publishable key).' });

  const userClient = createClient(URL, publishable, {
    global: { headers: { Authorization: `Bearer ${accessToken}` } }
  });
  const { data: userData, error: userErr } = await userClient.auth.getUser(accessToken);
  if (userErr || !userData?.user) {
    return res.status(401).json({ error: 'Invalid session' });
  }
  const uid = userData.user.id;

  // Admin client to delete the auth user (cascades to profiles via FK on delete cascade)
  const admin = createClient(URL, SECRET, {
    auth: { autoRefreshToken: false, persistSession: false }
  });
  const { error: delErr } = await admin.auth.admin.deleteUser(uid);
  if (delErr) {
    console.error('account-delete failed:', delErr.message);
    return res.status(500).json({ error: 'Could not delete account.' });
  }

  return res.status(200).json({ ok: true });
}
