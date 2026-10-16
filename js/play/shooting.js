/* Shooting - game logic + its own look. Layout lives in style.css; page shell lives in the HTML. */
(function(){"use strict";
var gm=document.getElementById("gm"),poster=document.getElementById("poster"),booted=false;
var LOOK=".gm{\n  --primary:#5B5CE2; --primary-dark:#4546B8; --secondary:#16B8C4;\n  --action:#FFB84D; --success:#22C55E; --danger:#EF5B5B;\n     \n   --game:#111827; --game2:#1F2937;\n}.gm *{box-sizing:border-box}.gm button{font:inherit}.gm button{touch-action:manipulation}.gm h2{font-size:34px;line-height:1.2;margin:0 0 18px}.gm h3{font-size:22px;line-height:1.3;margin:26px 0 10px}.gm .game-card{background:var(--card);border:1px solid var(--border);border-radius:18px;padding:20px;box-shadow:0 12px 34px rgba(23,27,45,.06)}.gm .game-topbar{display:flex;justify-content:space-between;gap:24px;align-items:center;margin-bottom:16px}.gm .game-topbar>div:first-child{display:flex;flex-direction:column}.gm .top-label{font-size:14px;color:var(--muted);font-weight:700}.gm #statusText{font-size:20px}.gm .stats{display:flex;gap:10px}.gm .stat{min-width:78px;padding:7px 12px;border:1px solid var(--border);border-radius:12px;text-align:center;background:#fafafe}.gm .stat span{display:block;color:var(--muted);font-size:12px;font-weight:700;text-transform:uppercase}.gm .stat strong{font-size:22px;line-height:1.2}.gm .canvas-wrap{position:relative;overflow:hidden;border-radius:16px;background:var(--game);aspect-ratio:16/9;cursor:crosshair}.gm canvas{display:block;width:100%;height:100%;touch-action:none}.gm .game-overlay{position:absolute;inset:0;display:grid;place-items:center;background:rgba(17,24,39,.72);padding:20px}.gm .game-overlay.hidden{display:none}.gm .overlay-panel{max-width:480px;text-align:center;color:#fff}.gm .target-icon{display:grid;place-items:center;width:70px;height:70px;margin:0 auto 14px;border-radius:50%;background:rgba(255,255,255,.1);font-size:48px;color:var(--action)}.gm .overlay-panel h2{font-size:32px;margin-bottom:8px}.gm .overlay-panel p{color:#d4d8e2;margin:0 0 20px}.gm .primary-btn,.gm .secondary-btn{min-height:46px;border:0;border-radius:12px;padding:10px 20px;font-weight:800;cursor:pointer}.gm .primary-btn{background:var(--action);color:#352408}.gm .primary-btn:hover{filter:brightness(.96)}.gm .secondary-btn{background:#eef0ff;color:var(--primary-dark)}.gm .primary-btn:focus-visible,.gm .secondary-btn:focus-visible,.gm .mobile-controls button:focus-visible{outline:3px solid var(--secondary);outline-offset:3px}.gm .game-actions{display:flex;justify-content:space-between;align-items:center;gap:16px;margin-top:16px}.gm .control-hint{font-size:14px;color:var(--muted);font-weight:700}.gm .mobile-hint{display:none}.gm .mobile-controls{display:none;text-align:center;margin-top:16px}.gm .mobile-controls>button,.gm .mobile-controls div button{width:54px;height:48px;border:1px solid var(--border);border-radius:11px;background:#f4f5fb;color:var(--text);font-weight:800}.gm .mobile-controls div{display:flex;justify-content:center;gap:8px;margin:8px 0}.gm .mobile-controls .fire-btn{width:86px;background:var(--danger);color:#fff;border-color:transparent}.gm .info-section{background:#fff;border:1px solid var(--border);border-radius:16px;padding:28px}.gm .info-section p{color:#4f586b}.gm ul{padding-left:22px}.gm li+li{margin-top:8px}.gm .tips-card{background:#fbfbff}.gm .info-section{margin-top:24px}.gm details{border-top:1px solid var(--border);padding:16px 0}.gm details:last-child{padding-bottom:0}.gm summary{font-weight:800;cursor:pointer}.gm details p{color:var(--muted);margin-bottom:0}@media(max-width:760px){.gm h2{font-size:28px}.gm .game-card{padding:12px;border-radius:16px}.gm .game-topbar{align-items:flex-start;flex-direction:column;gap:12px}.gm .stats{display:grid;grid-template-columns:repeat(4,1fr);width:100%;gap:6px}.gm .stat{min-width:0;padding:6px 4px}.gm .stat strong{font-size:18px}.gm .stat span{font-size:10px}.gm .game-actions{align-items:stretch;flex-direction:column}.gm .secondary-btn{width:100%}.gm .desktop-hint{display:none}.gm .mobile-hint{display:inline}.gm .mobile-controls{display:block}.gm .info-section{padding:22px}.gm .overlay-panel h2{font-size:26px}.gm .target-icon{width:58px;height:58px;font-size:40px}}@media(max-width:420px){.gm .stats{grid-template-columns:repeat(2,1fr)}.gm .canvas-wrap{aspect-ratio:4/3}.gm .overlay-panel p{font-size:14px;line-height:1.45}}@media(prefers-reduced-motion:reduce){.gm *{scroll-behavior:auto!important}}";
function __ready(f){f()}
function boot(){
(() => {
  "use strict";

  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");
  const wrap = document.getElementById("canvasWrap");
  const overlay = document.getElementById("overlay");
  const overlayTitle = document.getElementById("overlayTitle");
  const overlayText = document.getElementById("overlayText");
  const startBtn = document.getElementById("startBtn");
  const restartBtn = document.getElementById("restartBtn");
  const scoreEl = document.getElementById("score");
  const timeEl = document.getElementById("time");
  const livesEl = document.getElementById("lives");
  const comboEl = document.getElementById("combo");
  const statusEl = document.getElementById("statusText");
  const fireBtn = document.getElementById("fireBtn");

  const W = 960, H = 540;
  let targets = [], particles = [];
  let score = 0, lives = 3, combo = 1, hits = 0, shots = 0;
  let running = false, last = 0, elapsed = 0, spawnClock = 0, remaining = 60;
  let animationId = 0;
  const crosshair = { x: W / 2, y: H / 2, visible: true };
  const keys = new Set();

  const colors = ["#FFB84D", "#16B8C4", "#5B5CE2", "#22C55E", "#EF5B5B"];

  function resetGame() {
    targets = []; particles = [];
    score = 0; lives = 3; combo = 1; hits = 0; shots = 0;
    elapsed = 0; spawnClock = 0; remaining = 60;
    crosshair.x = W / 2; crosshair.y = H / 2;
    updateHUD();
  }

  function startGame() {
    cancelAnimationFrame(animationId);
    resetGame();
    running = true;
    overlay.classList.add("hidden");
    statusEl.textContent = "Round in progress";
    last = performance.now();
    spawnTarget();
    animationId = requestAnimationFrame(loop);
  }

  function endGame(reason) {
    running = false;
    cancelAnimationFrame(animationId);
    const accuracy = shots ? Math.round((hits / shots) * 100) : 0;
    statusEl.textContent = "Game over";
    overlayTitle.textContent = reason === "lives" ? "Range Closed!" : "Time's Up!";
    overlayText.textContent = `Final score: ${score.toLocaleString()} • Accuracy: ${accuracy}% • Hits: ${hits}`;
    startBtn.textContent = "Play Again";
    overlay.classList.remove("hidden");
  }

  function updateHUD() {
    scoreEl.textContent = score.toLocaleString();
    timeEl.textContent = Math.max(0, Math.ceil(remaining));
    livesEl.textContent = lives;
    comboEl.textContent = `x${combo}`;
  }

  function difficulty() {
    return Math.min(1, elapsed / 50);
  }

  function spawnTarget() {
    const d = difficulty();
    const radius = 24 + Math.random() * (24 - d * 8);
    const edge = Math.floor(Math.random() * 4);
    let x, y, vx, vy;
    const speed = 75 + Math.random() * 70 + d * 65;

    if (edge === 0) { x = -radius; y = 70 + Math.random() * (H - 140); vx = speed; vy = (Math.random() - .5) * 45; }
    if (edge === 1) { x = W + radius; y = 70 + Math.random() * (H - 140); vx = -speed; vy = (Math.random() - .5) * 45; }
    if (edge === 2) { x = 70 + Math.random() * (W - 140); y = -radius; vx = (Math.random() - .5) * 45; vy = speed; }
    if (edge === 3) { x = 70 + Math.random() * (W - 140); y = H + radius; vx = (Math.random() - .5) * 45; vy = -speed; }

    const base = radius < 31 ? 30 : radius < 39 ? 20 : 10;
    targets.push({ x, y, vx, vy, r: radius, color: colors[Math.floor(Math.random() * colors.length)], points: base, age: 0 });
  }

  function update(dt) {
    elapsed += dt;
    remaining = 60 - elapsed;
    if (remaining <= 0) return endGame("time");

    const moveSpeed = 340;
    if (keys.has("arrowleft") || keys.has("a")) crosshair.x -= moveSpeed * dt;
    if (keys.has("arrowright") || keys.has("d")) crosshair.x += moveSpeed * dt;
    if (keys.has("arrowup") || keys.has("w")) crosshair.y -= moveSpeed * dt;
    if (keys.has("arrowdown") || keys.has("s")) crosshair.y += moveSpeed * dt;
    crosshair.x = Math.max(0, Math.min(W, crosshair.x));
    crosshair.y = Math.max(0, Math.min(H, crosshair.y));

    spawnClock += dt;
    const interval = Math.max(.42, 1.05 - difficulty() * .5);
    if (spawnClock >= interval) {
      spawnClock = 0;
      spawnTarget();
      if (difficulty() > .55 && Math.random() < .25) spawnTarget();
    }

    for (let i = targets.length - 1; i >= 0; i--) {
      const t = targets[i];
      t.x += t.vx * dt; t.y += t.vy * dt; t.age += dt;
      const margin = t.r + 20;
      if ((t.vx > 0 && t.x > W + margin) || (t.vx < 0 && t.x < -margin) ||
          (t.vy > 0 && t.y > H + margin) || (t.vy < 0 && t.y < -margin)) {
        targets.splice(i, 1);
        lives--;
        combo = 1;
        burst(Math.max(20, Math.min(W - 20, t.x)), Math.max(20, Math.min(H - 20, t.y)), "#EF5B5B", 8);
        updateHUD();
        if (lives <= 0) return endGame("lives");
      }
    }

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.life -= dt; p.x += p.vx * dt; p.y += p.vy * dt; p.vy += 80 * dt;
      if (p.life <= 0) particles.splice(i, 1);
    }
    updateHUD();
  }

  function burst(x, y, color, count = 12) {
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2, s = 45 + Math.random() * 130;
      particles.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: .35 + Math.random() * .35, max: .7, color });
    }
  }

  function shoot(x, y) {
    if (!running) return;
    shots++;
    let hitIndex = -1;
    for (let i = targets.length - 1; i >= 0; i--) {
      const t = targets[i];
      if (Math.hypot(x - t.x, y - t.y) <= t.r) { hitIndex = i; break; }
    }
    if (hitIndex >= 0) {
      const t = targets[hitIndex];
      hits++;
      score += t.points * combo;
      combo = Math.min(5, combo + 1);
      burst(t.x, t.y, t.color, 15);
      targets.splice(hitIndex, 1);
      statusEl.textContent = `Hit! +${t.points * (combo - 1 || 1)}`;
    } else {
      combo = 1;
      burst(x, y, "#FFFFFF", 4);
      statusEl.textContent = "Miss — combo reset";
    }
    updateHUD();
  }

  function drawBackground() {
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, "#111827"); g.addColorStop(1, "#1F2937");
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);

    ctx.strokeStyle = "rgba(255,255,255,.055)";
    ctx.lineWidth = 1;
    for (let x = 0; x <= W; x += 60) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    for (let y = 0; y <= H; y += 60) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

    ctx.fillStyle = "rgba(255,255,255,.05)";
    ctx.font = "700 18px 'Nunito Sans', sans-serif";
    ctx.fillText("TARGET RANGE", 28, 38);
  }

  function drawTarget(t) {
    ctx.save();
    ctx.translate(t.x, t.y);
    ctx.shadowColor = "rgba(0,0,0,.35)"; ctx.shadowBlur = 12;
    ctx.fillStyle = t.color; ctx.beginPath(); ctx.arc(0, 0, t.r, 0, Math.PI * 2); ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(0, 0, t.r * .65, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = t.color; ctx.beginPath(); ctx.arc(0, 0, t.r * .34, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#111827"; ctx.beginPath(); ctx.arc(0, 0, Math.max(4, t.r * .11), 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }

  function drawCrosshair() {
    const {x,y} = crosshair;
    ctx.save();
    ctx.strokeStyle = "rgba(255,255,255,.92)"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(x, y, 16, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x - 25, y); ctx.lineTo(x - 7, y); ctx.moveTo(x + 7, y); ctx.lineTo(x + 25, y);
    ctx.moveTo(x, y - 25); ctx.lineTo(x, y - 7); ctx.moveTo(x, y + 7); ctx.lineTo(x, y + 25); ctx.stroke();
    ctx.restore();
  }

  function draw() {
    drawBackground();
    targets.forEach(drawTarget);
    particles.forEach(p => {
      ctx.globalAlpha = Math.max(0, p.life / p.max);
      ctx.fillStyle = p.color; ctx.beginPath(); ctx.arc(p.x, p.y, 3, 0, Math.PI * 2); ctx.fill();
    });
    ctx.globalAlpha = 1;
    drawCrosshair();
  }

  function loop(now) {
    if (!running) return;
    const dt = Math.min(.035, (now - last) / 1000);
    last = now;
    update(dt);
    draw();
    if (running) animationId = requestAnimationFrame(loop);
  }

  function pointerPosition(e) {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX, clientY = e.clientY;
    return { x: (clientX - rect.left) * W / rect.width, y: (clientY - rect.top) * H / rect.height };
  }

  canvas.addEventListener("pointermove", e => {
    const p = pointerPosition(e); crosshair.x = p.x; crosshair.y = p.y;
    if (!running) draw();
  });
  canvas.addEventListener("pointerdown", e => {
    e.preventDefault();
    const p = pointerPosition(e); crosshair.x = p.x; crosshair.y = p.y; shoot(p.x, p.y);
  });

  window.addEventListener("keydown", e => {
    const k = e.key.toLowerCase();
    if (["arrowleft","arrowright","arrowup","arrowdown"," ","w","a","s","d"].includes(k)) e.preventDefault();
    if (k === " " && running && !e.repeat) shoot(crosshair.x, crosshair.y);
    keys.add(k);
  });
  window.addEventListener("keyup", e => keys.delete(e.key.toLowerCase()));
  window.addEventListener("blur", () => keys.clear());

  document.querySelectorAll("[data-move]").forEach(btn => {
    const map = {left:[-34,0],right:[34,0],up:[0,-34],down:[0,34]};
    const move = () => {
      if (!running) return;
      const [dx,dy] = map[btn.dataset.move];
      crosshair.x = Math.max(0, Math.min(W, crosshair.x + dx));
      crosshair.y = Math.max(0, Math.min(H, crosshair.y + dy));
    };
    btn.addEventListener("pointerdown", e => { e.preventDefault(); move(); });
  });
  fireBtn.addEventListener("click", () => shoot(crosshair.x, crosshair.y));
  startBtn.addEventListener("click", startGame);
  restartBtn.addEventListener("click", startGame);

  updateHUD();
  draw();
})();


}
function begin(){poster.hidden=true;gm.hidden=false;if(!booted){booted=true;var s=document.createElement("style");s.textContent=LOOK;document.head.appendChild(s);boot();}else{var r=document.getElementById("startBtn");if(r)r.click();}}
poster.addEventListener("click",begin);
var nb=document.getElementById("new");if(nb)nb.addEventListener("click",begin);
})();
