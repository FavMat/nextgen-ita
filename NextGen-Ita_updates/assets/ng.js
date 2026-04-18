/* ═══════════════════════════════════════════════════════════════════
   NEXTGEN ITA — SHARED UX ENGINE
   Custom cursor, global particle field, nav shrink, scroll reveal,
   card magnet, split-letter reveal, marquee helpers.
═══════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  const isDesktop = window.matchMedia('(min-width: 901px) and (pointer: fine)').matches;
  const reduced   = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Custom cursor ─────────────────────────────────────────── */
  if (isDesktop && !reduced) {
    document.body.classList.add('has-cursor');
    const dot  = document.createElement('div'); dot.className  = 'cursor-dot';
    const ring = document.createElement('div'); ring.className = 'cursor-ring';
    document.body.appendChild(dot); document.body.appendChild(ring);

    let mx = -100, my = -100, rx = -100, ry = -100;
    window.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
    }, { passive: true });

    (function tick() {
      rx += (mx - rx) * .18;
      ry += (my - ry) * .18;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      requestAnimationFrame(tick);
    })();

    const hoverSel = 'a, button, input, textarea, [data-hover]';
    document.addEventListener('mouseover', e => {
      if (e.target.closest(hoverSel)) { dot.classList.add('hov'); ring.classList.add('hov'); }
    });
    document.addEventListener('mouseout', e => {
      if (e.target.closest(hoverSel)) { dot.classList.remove('hov'); ring.classList.remove('hov'); }
    });
  }

  /* ── Global particle field (reacts to cursor) ──────────────── */
  function initParticleField() {
    const canvas = document.querySelector('.bg-canvas');
    if (!canvas || reduced) return;
    const ctx = canvas.getContext('2d');
    let W, H, nodes = [];
    let mp = { x: -9999, y: -9999 };
    const DPR = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      W = window.innerWidth; H = window.innerHeight;
      canvas.width = W * DPR; canvas.height = H * DPR;
      canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      nodes = [];
      const n = Math.min(110, Math.floor((W * H) / 14000));
      for (let i = 0; i < n; i++) {
        nodes.push({
          x: Math.random() * W, y: Math.random() * H,
          vx: (Math.random() - .5) * .28,
          vy: (Math.random() - .5) * .28,
          r: Math.random() * 1.4 + .4,
          hue: Math.random() > .88 ? 'amber' : 'green'
        });
      }
    }
    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', e => { mp.x = e.clientX; mp.y = e.clientY; }, { passive: true });
    window.addEventListener('mouseleave', () => { mp.x = -9999; mp.y = -9999; });

    function draw() {
      ctx.clearRect(0, 0, W, H);

      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];

        // mouse attraction
        const dx = mp.x - a.x, dy = mp.y - a.y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < 260 && d > 0) {
          a.vx += (dx / d) * .015;
          a.vy += (dy / d) * .015;
        }
        // clamp speed
        const sp = Math.sqrt(a.vx * a.vx + a.vy * a.vy);
        if (sp > 1.1) { a.vx = a.vx / sp * 1.1; a.vy = a.vy / sp * 1.1; }
        // damping
        a.vx *= .992; a.vy *= .992;

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
          if (dd < 140) {
            const al = (1 - dd / 140) * .28;
            ctx.strokeStyle = a.hue === 'amber' || b.hue === 'amber'
              ? `rgba(245, 184, 74, ${al})`
              : `rgba(45, 212, 160, ${al})`;
            ctx.lineWidth = .6;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }

        // line to cursor
        if (d < 180) {
          const al = (1 - d / 180) * .4;
          ctx.strokeStyle = `rgba(45, 212, 160, ${al})`;
          ctx.lineWidth = .7;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(mp.x, mp.y); ctx.stroke();
        }

        // node
        const glow = d < 260 ? .4 + (1 - d / 260) * .5 : .35;
        ctx.beginPath();
        ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
        ctx.fillStyle = a.hue === 'amber'
          ? `rgba(245, 184, 74, ${glow})`
          : `rgba(45, 212, 160, ${glow})`;
        ctx.fill();
      }

      requestAnimationFrame(draw);
    }
    draw();
  }
  initParticleField();

  /* ── Nav shrink on scroll ──────────────────────────────────── */
  const nav = document.querySelector('.ng-nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) nav.classList.add('shrunk');
      else nav.classList.remove('shrunk');
    }, { passive: true });
  }

  /* ── Scroll reveal ─────────────────────────────────────────── */
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('vis'); revealObs.unobserve(e.target); }
    });
  }, { threshold: .12, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

  /* ── Card magnetic tilt ────────────────────────────────────── */
  if (isDesktop && !reduced) {
    document.querySelectorAll('[data-tilt]').forEach(card => {
      card.addEventListener('mousemove', e => {
        const r  = card.getBoundingClientRect();
        const cx = e.clientX - r.left - r.width  / 2;
        const cy = e.clientY - r.top  - r.height / 2;
        const rx = (cy / r.height) * -6;
        const ry = (cx / r.width)  *  6;
        card.style.transform = `perspective(1100px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
      });
      card.addEventListener('mouseleave', () => { card.style.transform = ''; });
    });

    /* Magnetic buttons */
    document.querySelectorAll('[data-magnet]').forEach(el => {
      el.addEventListener('mousemove', e => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left - r.width  / 2;
        const y = e.clientY - r.top  - r.height / 2;
        el.style.transform = `translate(${x * .2}px, ${y * .3}px)`;
      });
      el.addEventListener('mouseleave', () => { el.style.transform = ''; });
    });
  }

  /* ── Split letter reveal ───────────────────────────────────── */
  document.querySelectorAll('[data-split]').forEach(el => {
    const txt = el.textContent;
    el.innerHTML = '';
    txt.split('').forEach((ch, i) => {
      const s = document.createElement('span');
      s.textContent = ch === ' ' ? '\u00A0' : ch;
      s.style.display = 'inline-block';
      s.style.opacity = '0';
      s.style.transform = 'translateY(80%)';
      s.style.transition = `opacity .7s var(--ease-out) ${i * 22}ms, transform .7s var(--ease-out) ${i * 22}ms`;
      el.appendChild(s);
    });
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.querySelectorAll('span').forEach(s => { s.style.opacity = '1'; s.style.transform = 'none'; });
          obs.unobserve(e.target);
        }
      });
    }, { threshold: .4 });
    obs.observe(el);
  });

  /* ── Counter ───────────────────────────────────────────────── */
  document.querySelectorAll('[data-count]').forEach(el => {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          let start = 0, dur = 1400, t0 = null;
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
        if (ci === p.length) { del = true; setTimeout(type, 2200); return; }
      } else {
        tw.textContent = p.slice(0, --ci);
        if (ci === 0) { del = false; pi = (pi + 1) % phrases.length; }
      }
      setTimeout(type, del ? 32 : 65);
    }
    type();
  }

  /* ── Clock (live Italy time) ───────────────────────────────── */
  const clock = document.querySelector('[data-clock]');
  if (clock) {
    function tickClock() {
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, '0');
      const mm = String(now.getMinutes()).padStart(2, '0');
      const ss = String(now.getSeconds()).padStart(2, '0');
      clock.textContent = `${hh}:${mm}:${ss} CET`;
    }
    tickClock();
    setInterval(tickClock, 1000);
  }

})();
