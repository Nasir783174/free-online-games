/* Relaxing - game logic + its own look. Layout lives in style.css; page shell lives in the HTML. */
(function(){"use strict";
var gm=document.getElementById("gm"),poster=document.getElementById("poster"),booted=false;
var LOOK=".gm *{box-sizing:border-box}.gm{font-family:\"Nunito Sans\",system-ui,sans-serif;color:#171B2D;background:#F6F7FB}.gm .back-link{text-decoration:none;font-weight:700;color:#667085}.gm .page{max-width:1160px;margin:auto;padding:30px 20px 70px}.gm h2{font-size:30px;line-height:1.2;margin:0 0 12px}.gm .lead{font-size:18px;line-height:1.65;color:#667085;margin:0}.gm .game-shell{background:#fff;border:1px solid #E5E7EF;border-radius:20px;overflow:hidden;box-shadow:0 12px 35px rgba(23,27,45,.07)}.gm .game-topbar{height:70px;display:grid;grid-template-columns:1fr auto 1fr;align-items:center;padding:0 22px;border-bottom:1px solid #E5E7EF}.gm .stat{display:flex;flex-direction:column;gap:1px}.gm .stat:last-child{text-align:right}.gm .stat span{font-size:13px;color:#667085;font-weight:700}.gm .stat strong{font-size:23px}.gm .status{font-weight:800;color:#4546B8;text-align:center}.gm .canvas-wrap{position:relative;background:#111827;width:100%;height:min(62vw,650px);min-height:430px;overflow:hidden}.gm canvas{display:block;width:100%;height:100%;touch-action:none}.gm .start-card,.gm .end-card{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:min(430px,calc(100% - 34px));padding:30px;text-align:center;background:rgba(255,255,255,.96);border:1px solid rgba(255,255,255,.7);border-radius:20px;box-shadow:0 18px 55px rgba(0,0,0,.25)}.gm .start-icon,.gm .end-icon{width:58px;height:58px;border-radius:50%;margin:0 auto 15px;display:grid;place-items:center;background:#FFF3D9;color:#D98A16;font-size:28px}.gm .end-icon{background:#DCFCE7;color:#16803C}.gm .start-card p,.gm .end-card p{color:#667085;line-height:1.55;margin:0 0 21px}.gm .hidden{display:none!important}.gm .primary-btn{border:0;border-radius:12px;padding:13px 20px;background:#5B5CE2;color:#fff;font:700 16px inherit;cursor:pointer;min-height:48px;box-shadow:0 5px 12px rgba(91,92,226,.22)}.gm .primary-btn:hover{background:#4546B8}.gm .primary-btn:focus-visible,.gm .touch-pad button:focus-visible,.gm .back-link:focus-visible{outline:3px solid #FFB84D;outline-offset:3px}.gm .controls{display:flex;justify-content:space-between;align-items:center;gap:25px;padding:22px}.gm .controls h2{font-size:21px;margin-bottom:5px}.gm .controls p{margin:0;color:#667085;line-height:1.55}.gm .touch-pad{display:none}.gm .touch-pad>div{display:flex;gap:8px}.gm .touch-pad button{width:48px;height:44px;border:1px solid #E5E7EF;background:#F6F7FB;border-radius:10px;font-size:20px;font-weight:800;color:#4546B8;cursor:pointer}.gm .small-heading{font-size:21px;margin-top:24px}.gm details{border-top:1px solid #E5E7EF;padding:16px 0}.gm details:last-child{border-bottom:1px solid #E5E7EF}.gm summary{cursor:pointer;font-weight:700;font-size:17px}@media(max-width:700px){.gm .back-link{font-size:14px}.gm .page{padding:22px 14px 55px}.gm .lead{font-size:16px}.gm .game-topbar{height:64px;padding:0 15px}.gm .stat strong{font-size:21px}.gm .canvas-wrap{height:82vw;min-height:330px;max-height:520px}.gm .controls{align-items:flex-start;padding:18px 15px}.gm .controls p{font-size:14px}.gm .touch-pad{display:block;flex:0 0 auto}.gm .touch-pad button{width:44px;height:42px}.gm h2{font-size:26px}}@media(max-width:470px){.gm .controls{flex-direction:column}.gm .touch-pad{margin:0 auto}.gm .canvas-wrap{min-height:300px}.gm .start-card,.gm .end-card{padding:24px}}";
function __ready(f){f()}
function boot(){
(() => {
  "use strict";

  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");
  const scoreEl = document.getElementById("score");
  const timeEl = document.getElementById("time");
  const statusEl = document.getElementById("status");
  const startCard = document.getElementById("startCard");
  const endCard = document.getElementById("endCard");
  const startBtn = document.getElementById("startBtn");
  const restartBtn = document.getElementById("restartBtn");
  const finalScoreEl = document.getElementById("finalScore");

  const DURATION = 60;
  let W = 0, H = 0, dpr = 1;
  let running = false, score = 0, timeLeft = DURATION, lastTime = 0;
  let animationId = 0, spawnTimer = 0, particles = [];
  let keys = Object.create(null);
  let target = null;
  const orb = { x: 0, y: 0, r: 15, vx: 0, vy: 0, speed: 260 };

  function resize() {
    const rect = canvas.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = Math.max(1, rect.width);
    H = Math.max(1, rect.height);
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    orb.x = Math.min(Math.max(orb.x || W / 2, orb.r), W - orb.r);
    orb.y = Math.min(Math.max(orb.y || H / 2, orb.r), H - orb.r);
    if (target) {
      target.x = Math.min(Math.max(target.x, 28), W - 28);
      target.y = Math.min(Math.max(target.y, 28), H - 28);
    }
    draw();
  }

  function randomTarget() {
    const margin = Math.min(70, Math.max(38, Math.min(W, H) * 0.1));
    target = {
      x: margin + Math.random() * Math.max(1, W - margin * 2),
      y: margin + Math.random() * Math.max(1, H - margin * 2),
      r: 11,
      pulse: Math.random() * Math.PI * 2
    };
  }

  function reset() {
    score = 0;
    timeLeft = DURATION;
    spawnTimer = 0;
    particles = [];
    orb.x = W / 2;
    orb.y = H / 2;
    orb.vx = orb.vy = 0;
    randomTarget();
    scoreEl.textContent = score;
    timeEl.textContent = timeLeft;
    statusEl.textContent = "Breathe in";
  }

  function start() {
    cancelAnimationFrame(animationId);
    reset();
    running = true;
    startCard.classList.add("hidden");
    endCard.classList.add("hidden");
    lastTime = performance.now();
    animationId = requestAnimationFrame(loop);
  }

  function finish() {
    running = false;
    finalScoreEl.textContent = score;
    endCard.classList.remove("hidden");
    statusEl.textContent = "Session complete";
    draw();
  }

  function setDirection(dx, dy) {
    if (!running) return;
    orb.vx = dx;
    orb.vy = dy;
  }

  function handleKey(e) {
    const k = e.key.toLowerCase();
    const map = {
      arrowup: [0, -1], w: [0, -1],
      arrowdown: [0, 1], s: [0, 1],
      arrowleft: [-1, 0], a: [-1, 0],
      arrowright: [1, 0], d: [1, 0]
    };
    if (map[k]) {
      e.preventDefault();
      setDirection(map[k][0], map[k][1]);
      keys[k] = true;
    }
    if ((k === " " || k === "enter") && !running && !startCard.classList.contains("hidden")) start();
  }

  function handleKeyUp(e) {
    delete keys[e.key.toLowerCase()];
  }

  function collect() {
    score++;
    scoreEl.textContent = score;
    for (let i = 0; i < 16; i++) {
      const a = Math.random() * Math.PI * 2;
      particles.push({
        x: target.x, y: target.y,
        vx: Math.cos(a) * (30 + Math.random() * 90),
        vy: Math.sin(a) * (30 + Math.random() * 90),
        life: .65 + Math.random() * .45,
        max: .65 + Math.random() * .45,
        r: 2 + Math.random() * 3
      });
    }
    randomTarget();
  }

  function update(dt) {
    const len = Math.hypot(orb.vx, orb.vy);
    if (len > 0) {
      orb.x += (orb.vx / len) * orb.speed * dt;
      orb.y += (orb.vy / len) * orb.speed * dt;
    }
    orb.x = Math.max(orb.r, Math.min(W - orb.r, orb.x));
    orb.y = Math.max(orb.r, Math.min(H - orb.r, orb.y));

    const dx = target.x - orb.x, dy = target.y - orb.y;
    if (Math.hypot(dx, dy) < orb.r + target.r + 4) collect();

    timeLeft = Math.max(0, timeLeft - dt);
    timeEl.textContent = Math.ceil(timeLeft);
    const phase = Math.sin((DURATION - timeLeft) * Math.PI / 4);
    statusEl.textContent = phase > .35 ? "Breathe out" : "Breathe in";

    spawnTimer += dt;
    if (spawnTimer > 0.12) {
      spawnTimer = 0;
      particles.forEach(p => { p.x += p.vx * .12; p.y += p.vy * .12; p.vx *= .92; p.vy *= .92; p.life -= .12; });
      particles = particles.filter(p => p.life > 0);
    }
    if (timeLeft <= 0) finish();
  }

  function drawBackground(t) {
    const g = ctx.createLinearGradient(0, 0, W, H);
    g.addColorStop(0, "#13283A");
    g.addColorStop(1, "#1F2937");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    const glow = ctx.createRadialGradient(W * .5, H * .52, 10, W * .5, H * .52, Math.max(W, H) * .65);
    glow.addColorStop(0, "rgba(73, 145, 132, .18)");
    glow.addColorStop(1, "rgba(73, 145, 132, 0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, W, H);

    ctx.strokeStyle = "rgba(255,255,255,.045)";
    ctx.lineWidth = 1;
    const gap = 54;
    for (let x = gap; x < W; x += gap) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    for (let y = gap; y < H; y += gap) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

    const breathe = 1 + Math.sin(t * Math.PI / 2) * .08;
    ctx.strokeStyle = "rgba(190, 235, 214, .07)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(W/2, H/2, Math.min(W,H)*.22*breathe, 0, Math.PI*2);
    ctx.stroke();
  }

  function draw(t = 0) {
    drawBackground(t / 1000);
    if (!target) return;

    const pulse = 1 + Math.sin(t / 500 + target.pulse) * .13;
    const tg = ctx.createRadialGradient(target.x, target.y, 1, target.x, target.y, 30);
    tg.addColorStop(0, "rgba(255, 232, 164, .95)");
    tg.addColorStop(.25, "rgba(255, 210, 120, .5)");
    tg.addColorStop(1, "rgba(255, 210, 120, 0)");
    ctx.fillStyle = tg;
    ctx.beginPath(); ctx.arc(target.x, target.y, 31*pulse, 0, Math.PI*2); ctx.fill();

    ctx.fillStyle = "#FFE8A3";
    ctx.beginPath(); ctx.arc(target.x, target.y, target.r*pulse, 0, Math.PI*2); ctx.fill();

    particles.forEach(p => {
      ctx.globalAlpha = Math.max(0, p.life / p.max);
      ctx.fillStyle = "#FFE8A3";
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2); ctx.fill();
    });
    ctx.globalAlpha = 1;

    const og = ctx.createRadialGradient(orb.x-5, orb.y-6, 2, orb.x, orb.y, 28);
    og.addColorStop(0, "#FFFFFF");
    og.addColorStop(.2, "#CFF7E6");
    og.addColorStop(1, "rgba(207,247,230,0)");
    ctx.fillStyle = og;
    ctx.beginPath(); ctx.arc(orb.x, orb.y, 29, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = "#D9FBEA";
    ctx.beginPath(); ctx.arc(orb.x, orb.y, orb.r, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,.75)";
    ctx.beginPath(); ctx.arc(orb.x-5, orb.y-5, 5, 0, Math.PI*2); ctx.fill();
  }

  function loop(now) {
    if (!running) return;
    const dt = Math.min(.033, (now - lastTime) / 1000);
    lastTime = now;
    update(dt);
    draw(now);
    if (running) animationId = requestAnimationFrame(loop);
  }

  startBtn.addEventListener("click", start);
  restartBtn.addEventListener("click", start);
  window.addEventListener("keydown", handleKey, { passive: false });
  window.addEventListener("keyup", handleKeyUp);
  window.addEventListener("resize", resize);

  document.querySelectorAll("[data-dir]").forEach(btn => {
    const press = e => {
      e.preventDefault();
      const dirs = { up:[0,-1], down:[0,1], left:[-1,0], right:[1,0] };
      const [dx,dy] = dirs[btn.dataset.dir];
      setDirection(dx,dy);
    };
    btn.addEventListener("pointerdown", press);
  });

  reset();
  resize();
})();


}
function begin(){poster.hidden=true;gm.hidden=false;if(!booted){booted=true;var s=document.createElement("style");s.textContent=LOOK;document.head.appendChild(s);boot();}else{var r=document.getElementById("startBtn");if(r)r.click();}}
poster.addEventListener("click",begin);
var nb=document.getElementById("new");if(nb)nb.addEventListener("click",begin);
})();
