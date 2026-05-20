export function initSwarm() {
  const canvas = document.getElementById('swarm');
  const ctx    = canvas.getContext('2d');
  let W, H, dpr;
  let particles = [];
  let targets   = [];
  let mouseX = -9999, mouseY = -9999;
  let heroActive = true;
  // 0=flock 1=converge 2=hold 3=release
  const PHASE_DUR = [580, 300, 260, 180];
  let phase = 0, phaseF = 0;
  let gatherW = 0;

  const N         = 210;
  const MAX_SPEED = 2.1;
  const TRAIL_A   = 0.13;

  function jit(r) { return (Math.random() - .5) * r; }

  function resize() {
    dpr = window.devicePixelRatio || 1;
    W = window.innerWidth; H = window.innerHeight;
    canvas.width  = W * dpr; canvas.height = H * dpr;
    canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
    ctx.scale(dpr, dpr);
    buildLetterK();
    if (!particles.length) initParticles();
    else particles.forEach(assignTarget);
  }

  function buildLetterK() {
    targets = [];
    const cx = W / 2, cy = H / 2, S = H * 0.27, sx = cx - S * 0.17;
    for (let i = 0; i < 22; i++) targets.push({ x: sx, y: cy - S + i / 21 * S * 2 });
    for (let i = 0; i < 15; i++) { const t = i / 14; targets.push({ x: sx + t * S * 0.68, y: cy - t * S }); }
    for (let i = 0; i < 15; i++) { const t = i / 14; targets.push({ x: sx + t * S * 0.68, y: cy + t * S }); }
  }

  function assignTarget(p, i) {
    const t = targets[i % targets.length];
    p.tx = t.x + jit(12);
    p.ty = t.y + jit(12);
  }

  function initParticles() {
    particles = [];
    for (let i = 0; i < N; i++) {
      const p = {
        x: Math.random() * W, y: Math.random() * H,
        vx: jit(3.2), vy: jit(3.2),
        s: 1.1 + Math.random() * .85,
        op: .28 + Math.random() * .44,
        tx: W / 2, ty: H / 2
      };
      particles.push(p);
      assignTarget(p, i);
    }
  }

  function update(p) {
    const SEP2 = 22 * 22, NBR2 = 52 * 52;
    let sx = 0, sy = 0, sc = 0, ax = 0, ay = 0, cxx = 0, cyy = 0, nc = 0;

    for (const o of particles) {
      if (o === p) continue;
      const dx = p.x - o.x, dy = p.y - o.y, d2 = dx * dx + dy * dy;
      if (d2 < SEP2 && d2 > 0) { const d = Math.sqrt(d2); sx += dx / d; sy += dy / d; sc++; }
      if (d2 < NBR2) { ax += o.vx; ay += o.vy; cxx += o.x; cyy += o.y; nc++; }
    }

    let fx = 0, fy = 0;
    if (sc > 0) { fx += sx / sc * 1.05; fy += sy / sc * 1.05; }
    if (nc > 0) {
      fx += (ax / nc - p.vx) * .055; fy += (ay / nc - p.vy) * .055;
      fx += (cxx / nc - p.x) * .0022; fy += (cyy / nc - p.y) * .0022;
    }

    const mdx = p.x - mouseX, mdy = p.y - mouseY, md2 = mdx * mdx + mdy * mdy;
    if (md2 < 7200 && md2 > 0) { const md = Math.sqrt(md2); fx += mdx / md * 68 / md; fy += mdy / md * 68 / md; }

    if (gatherW > 0) { fx += (p.tx - p.x) * .0028 * gatherW; fy += (p.ty - p.y) * .0028 * gatherW; }

    p.vx += fx; p.vy += fy;
    const spd = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
    const mspd = phase === 2 ? 0.9 : MAX_SPEED;
    if (spd > mspd) { p.vx = p.vx / spd * mspd; p.vy = p.vy / spd * mspd; }
    p.x += p.vx; p.y += p.vy;
    if (p.x < -12) p.x = W + 12; else if (p.x > W + 12) p.x = -12;
    if (p.y < -12) p.y = H + 12; else if (p.y > H + 12) p.y = -12;
  }

  function frame() {
    if (!heroActive) { requestAnimationFrame(frame); return; }

    ctx.fillStyle = `rgba(10,7,4,${TRAIL_A})`;
    ctx.fillRect(0, 0, W, H);

    phaseF++;
    const dur = PHASE_DUR[phase];
    if (phaseF >= dur) { phaseF = 0; phase = (phase + 1) % 4; }
    const t = phaseF / dur;

    if (phase === 0)      gatherW = 0;
    else if (phase === 1) gatherW = t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    else if (phase === 2) gatherW = 1;
    else                  gatherW = 1 - (t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

    for (const p of particles) {
      update(p);
      const bright = gatherW > .05 ? p.op + gatherW * .2 : p.op;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.s, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(222,210,190,${Math.min(bright, .78)})`;
      ctx.fill();
    }

    requestAnimationFrame(frame);
  }

  const hero = document.getElementById('hero');
  hero.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; }, { passive: true });
  hero.addEventListener('mouseleave', () => { mouseX = -9999; mouseY = -9999; });

  new IntersectionObserver(es => heroActive = es[0].isIntersecting, { threshold: 0 }).observe(hero);

  resize();
  window.addEventListener('resize', resize, { passive: true });
  requestAnimationFrame(frame);
}
