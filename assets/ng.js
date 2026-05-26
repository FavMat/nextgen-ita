/* ═══════════════════════════════════════════════════════════════════
   CIAO MIRTA + NEXTGEN ITA — UX ENGINE (v2)

   - Custom cursor (dot + ring + 4-point trail) with magnet on links
   - Background canvas:
       · default      → organic particle field that REACTS to cursor
                        (slows + bends, doesn't accelerate)
       · body.ng-mag  → slow radio-wave / spectrogram strands
   - Nav shrink, hamburger menu
   - Scroll reveal + split-line reveal
   - Card tilt + magnetic buttons (stronger)
   - Counter, typewriter
   - Cookie banner (EN)
   - Live clock (CET)
   - Logo AI reveal pulse
═══════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  const isDesktop = window.matchMedia('(min-width: 901px) and (pointer: fine)').matches;
  const reduced   = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMag     = document.body.classList.contains('ng-mag');

  /* ── Inject mesh + light-leak layers (depth stack) ─────────── */
  function injectDepthLayers() {
    if (!document.querySelector('.bg-mesh')) {
      const mesh = document.createElement('div');
      mesh.className = 'bg-mesh';
      mesh.setAttribute('aria-hidden', 'true');
      mesh.innerHTML = '<div class="blob b1"></div><div class="blob b2"></div><div class="blob b3"></div>';
      document.body.prepend(mesh);
    }
    if (!document.querySelector('.light-leak') && !reduced) {
      const leak = document.createElement('div');
      leak.className = 'light-leak';
      leak.setAttribute('aria-hidden', 'true');
      document.body.appendChild(leak);
    }
  }
  injectDepthLayers();

  /* ── Custom cursor ─────────────────────────────────────────── */
  let cursorState = { mx: -100, my: -100, rx: -100, ry: -100 };
  let dot, ring, trails = [];

  if (isDesktop && !reduced) {
    document.body.classList.add('has-cursor');
    dot  = document.createElement('div'); dot.className  = 'cursor-dot';
    ring = document.createElement('div'); ring.className = 'cursor-ring';
    document.body.appendChild(dot);
    document.body.appendChild(ring);

    // 4-point trail
    for (let i = 0; i < 4; i++) {
      const t = document.createElement('div');
      t.className = 'cursor-trail';
      document.body.appendChild(t);
      trails.push({ el: t, x: -100, y: -100 });
    }

    window.addEventListener('mousemove', e => {
      cursorState.mx = e.clientX; cursorState.my = e.clientY;
      dot.style.transform = `translate(${cursorState.mx}px, ${cursorState.my}px) translate(-50%, -50%)`;
    }, { passive: true });

    let lastMove = performance.now();
    window.addEventListener('mousemove', () => { lastMove = performance.now(); }, { passive: true });

    (function tick() {
      cursorState.rx += (cursorState.mx - cursorState.rx) * .18;
      cursorState.ry += (cursorState.my - cursorState.ry) * .18;
      ring.style.transform = `translate(${cursorState.rx}px, ${cursorState.ry}px) translate(-50%, -50%)`;

      // trail chain
      let px = cursorState.mx, py = cursorState.my;
      for (let i = 0; i < trails.length; i++) {
        const t = trails[i];
        const k = .35 - i * .06;
        t.x += (px - t.x) * k;
        t.y += (py - t.y) * k;
        const idle = performance.now() - lastMove;
        const showT = idle < 250 ? 1 - i * .22 : 0;
        t.el.style.opacity = showT.toFixed(2);
        t.el.style.transform = `translate(${t.x}px, ${t.y}px) translate(-50%, -50%) scale(${1 - i * .15})`;
        px = t.x; py = t.y;
      }
      requestAnimationFrame(tick);
    })();

    // Hover / magnet state for cursor
    const hoverSel = 'a, button, input, textarea, [data-hover]';
    document.addEventListener('mouseover', e => {
      const tgt = e.target.closest(hoverSel);
      if (tgt) {
        dot.classList.add('hov'); ring.classList.add('hov');
        // magnet pull on small link/buttons (under 240px wide)
        const r = tgt.getBoundingClientRect();
        if (r.width < 260 && r.height < 120 && tgt.dataset.magnet !== undefined) {
          tgt._magnetActive = true;
        }
      }
    });
    document.addEventListener('mouseout', e => {
      const tgt = e.target.closest(hoverSel);
      if (tgt) {
        dot.classList.remove('hov'); ring.classList.remove('hov');
        if (tgt._magnetActive) { tgt._magnetActive = false; tgt.style.transform = ''; }
      }
    });
  }

  /* ── Background canvas ─────────────────────────────────────── */
  function initCanvas() {
    const canvas = document.querySelector('.bg-canvas');
    if (!canvas || reduced) return;
    const ctx = canvas.getContext('2d');
    let W, H;
    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    let mp = { x: -9999, y: -9999 };

    window.addEventListener('mousemove', e => { mp.x = e.clientX; mp.y = e.clientY; }, { passive: true });
    window.addEventListener('mouseleave', () => { mp.x = -9999; mp.y = -9999; });

    // Read theme colors fresh
    function color(prop, fallback) {
      const v = getComputedStyle(document.documentElement).getPropertyValue(prop).trim();
      return v || fallback;
    }

    /* ═════ MAGAZINE MODE: radio-wave / spectrogram strands ═════ */
    if (isMag) {
      let strands = [];
      const NSTRANDS = 6;
      let phase = 0;

      function resize() {
        W = window.innerWidth; H = window.innerHeight;
        canvas.width = W * DPR; canvas.height = H * DPR;
        canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
        ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

        strands = [];
        for (let i = 0; i < NSTRANDS; i++) {
          strands.push({
            yBase: H * (0.18 + 0.13 * i),
            amp: 26 + Math.random() * 22,
            freq: 0.0018 + Math.random() * 0.0016,
            speed: 0.0003 + Math.random() * 0.0004,
            offset: Math.random() * Math.PI * 2,
            hue: i % 3 === 1 ? 'gold' : 'blue'
          });
        }
      }
      resize();
      window.addEventListener('resize', resize);

      function draw() {
        ctx.clearRect(0, 0, W, H);
        phase += 1;

        for (let s = 0; s < strands.length; s++) {
          const st = strands[s];
          const yB = st.yBase;
          const isGold = st.hue === 'gold';
          ctx.beginPath();
          for (let x = 0; x <= W; x += 6) {
            // distance from mouse along x
            const dxm = mp.x - x;
            const dym = mp.y - yB;
            const dd  = Math.sqrt(dxm * dxm + dym * dym);
            const mAmp = dd < 240 ? (1 - dd / 240) * 60 : 0;
            const y = yB
              + Math.sin(x * st.freq + phase * st.speed * 60 + st.offset) * st.amp
              + Math.sin(x * st.freq * 2.3 + phase * st.speed * 32 + st.offset) * (st.amp * .35)
              - mAmp * Math.sin((x - mp.x) * 0.012);
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.lineWidth = isGold ? 1.1 : 0.7;
          ctx.strokeStyle = isGold
            ? 'rgba(201, 169, 97, .26)'
            : 'rgba(61, 90, 128, .32)';
          ctx.stroke();

          // dot pulses along strand
          for (let i = 0; i < 4; i++) {
            const dx = (W / 4) * i + ((phase * (0.3 + s * 0.07)) % (W / 4));
            const dy = yB
              + Math.sin(dx * st.freq + phase * st.speed * 60 + st.offset) * st.amp;
            ctx.beginPath();
            ctx.arc(dx, dy, 1.4, 0, Math.PI * 2);
            ctx.fillStyle = isGold ? 'rgba(201, 169, 97, .65)' : 'rgba(237, 230, 214, .35)';
            ctx.fill();
          }
        }
        requestAnimationFrame(draw);
      }
      draw();
      return;
    }

    /* ═════ DEFAULT (Ciao Mirta): organic particle field ═════ */
    let nodes = [];
    function resize() {
      W = window.innerWidth; H = window.innerHeight;
      canvas.width = W * DPR; canvas.height = H * DPR;
      canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      nodes = [];
      const n = Math.min(95, Math.floor((W * H) / 16000));
      for (let i = 0; i < n; i++) {
        nodes.push({
          x: Math.random() * W, y: Math.random() * H,
          vx: (Math.random() - .5) * .22,
          vy: (Math.random() - .5) * .22,
          r: Math.random() * 1.3 + .35,
          hue: Math.random() > .92 ? 'bordeaux' : 'green',
          baseV: 0
        });
      }
    }
    resize();
    window.addEventListener('resize', resize);

    function draw() {
      ctx.clearRect(0, 0, W, H);
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];

        // organic mouse interaction: SLOW DOWN + curl toward cursor (gravity), not accelerate
        const dx = mp.x - a.x, dy = mp.y - a.y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < 260 && d > 0) {
          const pull = (1 - d / 260) * .035;
          a.vx += (dx / d) * pull;
          a.vy += (dy / d) * pull;
          // perpendicular curl for organic feel
          a.vx += (-dy / d) * pull * .25;
          a.vy += ( dx / d) * pull * .25;
          // damping (slow down near cursor)
          a.vx *= .94; a.vy *= .94;
        } else {
          // weak ambient drift
          a.vx *= .995; a.vy *= .995;
        }
        // clamp
        const sp = Math.sqrt(a.vx * a.vx + a.vy * a.vy);
        if (sp > .9) { a.vx = a.vx / sp * .9; a.vy = a.vy / sp * .9; }
        if (sp < .04 && d > 260) {
          // re-energize
          a.vx += (Math.random() - .5) * .04;
          a.vy += (Math.random() - .5) * .04;
        }

        a.x += a.vx; a.y += a.vy;
        if (a.x < 0) { a.x = 0; a.vx *= -1; }
        if (a.x > W) { a.x = W; a.vx *= -1; }
        if (a.y < 0) { a.y = 0; a.vy *= -1; }
        if (a.y > H) { a.y = H; a.vy *= -1; }

        // connections
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const ex = a.x - b.x, ey = a.y - b.y;
          const dd = Math.sqrt(ex * ex + ey * ey);
          if (dd < 130) {
            const al = (1 - dd / 130) * .22;
            ctx.strokeStyle = (a.hue === 'bordeaux' || b.hue === 'bordeaux')
              ? `rgba(122, 42, 61, ${al})`
              : `rgba(29, 158, 117, ${al})`;
            ctx.lineWidth = .55;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }

        // line to cursor
        if (d < 180) {
          const al = (1 - d / 180) * .42;
          ctx.strokeStyle = `rgba(29, 158, 117, ${al})`;
          ctx.lineWidth = .7;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(mp.x, mp.y); ctx.stroke();
        }

        // node
        const glow = d < 260 ? .45 + (1 - d / 260) * .55 : .38;
        ctx.beginPath();
        ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
        ctx.fillStyle = a.hue === 'bordeaux'
          ? `rgba(122, 42, 61, ${glow})`
          : `rgba(29, 158, 117, ${glow})`;
        ctx.fill();
      }
      requestAnimationFrame(draw);
    }
    draw();
  }
  initCanvas();

  /* ── Nav shrink + hamburger menu ───────────────────────────── */
  const nav = document.querySelector('.ng-nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) nav.classList.add('shrunk');
      else nav.classList.remove('shrunk');
    }, { passive: true });

    const btn = document.createElement('button');
    btn.className = 'hamburger';
    btn.setAttribute('aria-label', 'Menu');
    btn.innerHTML = '<span></span><span></span><span></span>';
    nav.appendChild(btn);

    const menu = document.createElement('div');
    menu.className = 'mobile-menu';
    const navLinks = nav.querySelector('.ng-links');
    if (navLinks) {
      navLinks.querySelectorAll('a').forEach(a => menu.appendChild(a.cloneNode(true)));
    }
    const cta = nav.querySelector('.ng-cta');
    if (cta) {
      const c = cta.cloneNode(true);
      c.classList.add('m-cta');
      c.style.transform = '';
      menu.appendChild(c);
    }
    document.body.appendChild(menu);

    function toggleMenu(open) {
      btn.classList.toggle('open', open);
      menu.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    }
    btn.addEventListener('click', () => toggleMenu(!menu.classList.contains('open')));
    menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => toggleMenu(false)));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') toggleMenu(false); });
  }

  /* ── Scroll reveal ─────────────────────────────────────────── */
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('vis'); revealObs.unobserve(e.target); }
    });
  }, { threshold: .12, rootMargin: '0px 0px -60px 0px' });
  document.querySelectorAll('.reveal, .split-line').forEach(el => revealObs.observe(el));

  /* ── Split-line letter reveal (mega title) ─────────────────── */
  document.querySelectorAll('[data-split-letters]').forEach(el => {
    const txt = el.textContent;
    el.innerHTML = '';
    const words = txt.split(' ');
    words.forEach((word, wi) => {
      const wspan = document.createElement('span');
      wspan.style.display = 'inline-block';
      wspan.style.whiteSpace = 'nowrap';
      word.split('').forEach((ch, ci) => {
        const s = document.createElement('span');
        s.textContent = ch;
        s.style.display = 'inline-block';
        s.style.opacity = '0';
        s.style.transform = 'translateY(60%)';
        const delay = (wi * 6 + ci) * 22;
        s.style.transition = `opacity .85s var(--ease-out) ${delay}ms, transform .85s var(--ease-out) ${delay}ms`;
        wspan.appendChild(s);
      });
      el.appendChild(wspan);
      if (wi < words.length - 1) el.appendChild(document.createTextNode(' '));
    });
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.querySelectorAll('span > span').forEach(s => { s.style.opacity = '1'; s.style.transform = 'none'; });
          obs.unobserve(e.target);
        }
      });
    }, { threshold: .25 });
    obs.observe(el);
  });

  /* ── Card tilt + magnetic buttons ──────────────────────────── */
  if (isDesktop && !reduced) {
    document.querySelectorAll('[data-tilt]').forEach(card => {
      card.addEventListener('mousemove', e => {
        const r  = card.getBoundingClientRect();
        const cx = e.clientX - r.left - r.width  / 2;
        const cy = e.clientY - r.top  - r.height / 2;
        const rx = (cy / r.height) * -5;
        const ry = (cx / r.width)  *  5;
        card.style.transform = `perspective(1200px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
        // specular
        card.style.setProperty('--mx', `${e.clientX - r.left}px`);
        card.style.setProperty('--my', `${e.clientY - r.top}px`);
      });
      card.addEventListener('mouseleave', () => { card.style.transform = ''; });
    });

    document.querySelectorAll('[data-magnet]').forEach(el => {
      el.addEventListener('mousemove', e => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left - r.width  / 2;
        const y = e.clientY - r.top  - r.height / 2;
        el.style.transform = `translate(${x * .28}px, ${y * .38}px)`;
      });
      el.addEventListener('mouseleave', () => { el.style.transform = ''; });
    });
  }

  /* ── Counter ───────────────────────────────────────────────── */
  document.querySelectorAll('[data-count]').forEach(el => {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          let t0 = null, dur = 1500;
          function frame(t) {
            if (!t0) t0 = t;
            const p = Math.min((t - t0) / dur, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.floor(eased * target) + suffix;
            if (p < 1) requestAnimationFrame(frame);
            else el.textContent = target + suffix;
          }
          requestAnimationFrame(frame);
          obs.unobserve(e.target);
        }
      });
    }, { threshold: .5 });
    obs.observe(el);
  });

  /* ── Typewriter ────────────────────────────────────────────── */
  const tw = document.querySelector('[data-typewriter]');
  if (tw) {
    const phrases = JSON.parse(tw.dataset.typewriter);
    let pi = 0, ci = 0, del = false;
    function type() {
      const p = phrases[pi];
      if (!del) {
        tw.textContent = p.slice(0, ++ci);
        if (ci === p.length) { del = true; setTimeout(type, 2400); return; }
      } else {
        tw.textContent = p.slice(0, --ci);
        if (ci === 0) { del = false; pi = (pi + 1) % phrases.length; }
      }
      setTimeout(type, del ? 28 : 60);
    }
    type();
  }

  /* ── Cookie consent banner (EN) ───────────────────────────── */
  (function () {
    if (localStorage.getItem('ng_cookie')) return;
    const bar = document.createElement('div');
    bar.className = 'cookie-bar';
    bar.innerHTML =
      '<p>This site uses essential cookies and third-party services (Google Fonts, Spotify) that may process your IP address. ' +
      'No personal data is collected directly. ' +
      '<a href="privacy.html">Privacy &amp; Cookie Policy</a></p>' +
      '<div class="cookie-bar-btns">' +
      '<button class="cookie-btn-no" id="cookie-no">Decline</button>' +
      '<button class="cookie-btn-ok" id="cookie-ok">Accept</button>' +
      '</div>';
    document.body.appendChild(bar);
    requestAnimationFrame(() => bar.classList.add('show'));
    function dismiss(val) {
      localStorage.setItem('ng_cookie', val);
      bar.style.transform = 'translateY(100%)';
      setTimeout(() => bar.remove(), 400);
    }
    bar.querySelector('#cookie-ok').addEventListener('click', () => dismiss('ok'));
    bar.querySelector('#cookie-no').addEventListener('click', () => dismiss('no'));
  })();

  /* ── Live clock (Italy / CET) ─────────────────────────────── */
  const clocks = document.querySelectorAll('[data-clock]');
  if (clocks.length) {
    function tick() {
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, '0');
      const mm = String(now.getMinutes()).padStart(2, '0');
      const ss = String(now.getSeconds()).padStart(2, '0');
      const s = `${hh}:${mm}:${ss} CET`;
      clocks.forEach(c => c.textContent = s);
    }
    tick();
    setInterval(tick, 1000);
  }

  /* ── Logo AI reveal pulse ─────────────────────────────────── */
  try {
    const logos = document.querySelectorAll('.ng-logo:has(.ng-logo-text)');
    if (logos.length) {
      function pulseAI() {
        logos.forEach(l => l.classList.add('show-ai'));
        setTimeout(() => logos.forEach(l => l.classList.remove('show-ai')), 1400);
      }
      setTimeout(() => { pulseAI(); setInterval(pulseAI, 7000); }, 3000);
    }
  } catch (e) { /* :has() unsupported, skip */ }

})();
