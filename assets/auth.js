/**
 * Ciao Mirta — Unified Auth client (Supabase)
 * Loads Supabase JS via ESM CDN. Session persists in cookies on .ciaomirta.it
 * so it's shared across all subpaths (toolbox, cgt-radar, agentry, etc.).
 *
 * Public surface:
 *   window.ciaomirtaAuth.signInWithGoogle()
 *   window.ciaomirtaAuth.signInWithMagicLink(email)
 *   window.ciaomirtaAuth.signInWithPassword(email, password)
 *   window.ciaomirtaAuth.signUpWithPassword(email, password, firstName?, lastName?)
 *   window.ciaomirtaAuth.signOut()
 *   window.ciaomirtaAuth.getSession()
 *   window.ciaomirtaAuth.getProfile()
 *   window.ciaomirtaAuth.updateProfile(fields)
 *   window.ciaomirtaAuth.logConsent(type, granted, version)
 *   window.ciaomirtaAuth.onAuthChange(cb)
 */
(function () {
  const SUPABASE_URL = 'https://vpqnyogmsipugvdhgaxj.supabase.co';
  const SUPABASE_KEY = 'sb_publishable_BzaZRDvC9bq4_VQc75R30w_ml7E2ZZQ';
  const PROJECT_REF = 'vpqnyogmsipugvdhgaxj';

  const isLocalhost = /^(localhost|127\.0\.0\.1)$/i.test(location.hostname);
  const cookieDomain = isLocalhost ? undefined : '.ciaomirta.it';

  async function init() {
    const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2.45.0');

    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
      auth: {
        flowType: 'pkce',
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        storage: cookieStorage(cookieDomain, PROJECT_REF),
        storageKey: `sb-${PROJECT_REF}-auth-token`
      }
    });

    const origin = location.origin;
    const callback = `${origin}/auth/callback.html`;

    const api = {
      supabase,

      async signInWithGoogle(returnTo) {
        const next = returnTo ? `?return_to=${encodeURIComponent(returnTo)}` : '';
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: { redirectTo: callback + next, queryParams: { access_type: 'offline', prompt: 'consent' } }
        });
        if (error) throw error;
      },

      async signInWithMagicLink(email, returnTo) {
        const next = returnTo ? `?return_to=${encodeURIComponent(returnTo)}` : '';
        const { error } = await supabase.auth.signInWithOtp({
          email: email.trim().toLowerCase(),
          options: { emailRedirectTo: callback + next, shouldCreateUser: true }
        });
        if (error) throw error;
      },

      async signInWithPassword(email, password) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim().toLowerCase(),
          password
        });
        if (error) throw error;
        return data;
      },

      async signUpWithPassword(email, password, firstName, lastName) {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim().toLowerCase(),
          password,
          options: {
            emailRedirectTo: callback,
            data: {
              first_name: firstName || null,
              last_name: lastName || null
            }
          }
        });
        if (error) throw error;
        return data;
      },

      async signOut() {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
      },

      async getSession() {
        const { data } = await supabase.auth.getSession();
        return data.session || null;
      },

      async getUser() {
        const { data } = await supabase.auth.getUser();
        return data.user || null;
      },

      async getProfile() {
        const session = await this.getSession();
        if (!session) return null;
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        if (error && error.code !== 'PGRST116') {
          console.error('getProfile error', error);
          return null;
        }
        return data;
      },

      async updateProfile(fields) {
        const session = await this.getSession();
        if (!session) throw new Error('Not authenticated');
        const allowed = ['first_name', 'last_name', 'role', 'lang', 'company',
                         'institution', 'industry', 'linkedin_url', 'cgt_focus',
                         'interests', 'avatar_url', 'onboarded'];
        const patch = {};
        for (const k of allowed) if (k in fields) patch[k] = fields[k];
        const { data, error } = await supabase
          .from('profiles')
          .update(patch)
          .eq('id', session.user.id)
          .select()
          .single();
        if (error) throw error;
        return data;
      },

      async logConsent(consent_type, granted, policy_version) {
        const session = await this.getSession();
        if (!session) return;
        const { error } = await supabase.from('consent_log').insert([{
          user_id: session.user.id,
          consent_type,
          granted: !!granted,
          policy_version: policy_version || '1.1',
          user_agent: navigator.userAgent.slice(0, 250)
        }]);
        if (error) console.warn('consent log failed', error.message);
      },

      onAuthChange(cb) {
        const { data } = supabase.auth.onAuthStateChange((event, session) => cb(event, session));
        return () => data.subscription.unsubscribe();
      }
    };

    window.ciaomirtaAuth = api;
    window.dispatchEvent(new Event('ciaomirta:auth-ready'));
    return api;
  }

  /**
   * Cookie-based storage adapter for Supabase Auth.
   * Splits long JWTs across multiple cookies if needed (>4KB limit).
   */
  function cookieStorage(domain, ref) {
    const MAX_CHUNK = 3200;
    const flag = (k, v, expires) => {
      let s = `${k}=${encodeURIComponent(v)}; path=/; SameSite=Lax`;
      if (domain) s += `; Domain=${domain}`;
      if (location.protocol === 'https:') s += '; Secure';
      if (expires) s += `; Expires=${expires}`;
      return s;
    };
    const readAll = () => Object.fromEntries(
      document.cookie.split(/;\s*/).filter(Boolean).map(c => {
        const i = c.indexOf('=');
        return [c.slice(0, i), decodeURIComponent(c.slice(i + 1))];
      })
    );
    return {
      getItem(key) {
        const all = readAll();
        if (all[key] !== undefined) return all[key];
        // Try chunked
        const chunks = [];
        let i = 0;
        while (all[`${key}.${i}`] !== undefined) { chunks.push(all[`${key}.${i}`]); i++; }
        return chunks.length ? chunks.join('') : null;
      },
      setItem(key, value) {
        const expires = new Date(Date.now() + 30 * 24 * 3600 * 1000).toUTCString();
        // Remove old chunked variants
        let i = 0;
        while (document.cookie.includes(`${key}.${i}=`)) {
          document.cookie = flag(`${key}.${i}`, '', 'Thu, 01 Jan 1970 00:00:00 GMT');
          i++;
        }
        if (value.length <= MAX_CHUNK) {
          document.cookie = flag(key, value, expires);
        } else {
          document.cookie = flag(key, '', 'Thu, 01 Jan 1970 00:00:00 GMT');
          for (let j = 0; j * MAX_CHUNK < value.length; j++) {
            document.cookie = flag(`${key}.${j}`, value.slice(j * MAX_CHUNK, (j + 1) * MAX_CHUNK), expires);
          }
        }
      },
      removeItem(key) {
        document.cookie = flag(key, '', 'Thu, 01 Jan 1970 00:00:00 GMT');
        let i = 0;
        while (document.cookie.includes(`${key}.${i}=`)) {
          document.cookie = flag(`${key}.${i}`, '', 'Thu, 01 Jan 1970 00:00:00 GMT');
          i++;
        }
      }
    };
  }

  // Bootstrap
  init().catch(err => console.error('[ciaomirta-auth] init failed', err));
})();
