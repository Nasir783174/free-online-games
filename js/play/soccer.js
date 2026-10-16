/* Soccer - game logic + its own look. Layout lives in style.css; page shell lives in the HTML. */
(function(){"use strict";
var gm=document.getElementById("gm"),poster=document.getElementById("poster"),booted=false;
var LOOK=".gm *{ box-sizing: border-box; }.gm{\n  --primary: #5B5CE2;\n  --primary-dark: #4546B8;\n  --cyan: #16B8C4;\n  --orange: #FFB84D;\n  --green: #22C55E;\n  --danger: #EF5B5B;\n  \n  \n  \n  \n  \n  --dark: #111827;\n  --dark-2: #1F2937;\n}.gm button,.gm input{ font: inherit; }.gm .page{ max-width: 1160px; margin: auto; padding: 28px 22px 70px; }.gm h2{ font-size: 28px; line-height: 1.2; margin: 0 0 12px; font-weight: 700; }.gm .game-card{\n  background: var(--card);\n  border: 1px solid var(--border);\n  border-radius: 18px;\n  box-shadow: 0 10px 30px rgba(23, 27, 45, .06);\n}.gm .game-card{ overflow: hidden; }.gm .scorebar{\n  display: grid;\n  grid-template-columns: 150px 1fr 150px;\n  align-items: center;\n  min-height: 78px;\n  padding: 12px 20px;\n  border-bottom: 1px solid var(--border);\n}.gm .stat{ display: flex; flex-direction: column; }.gm .stat.right{ align-items: flex-end; }.gm .stat-label{ color: var(--muted); font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: .05em; }.gm .stat strong{ font-size: 25px; line-height: 1.15; }.gm .status{ text-align: center; font-weight: 800; color: var(--primary); }.gm .game-wrap{\n  position: relative;\n  background: var(--dark);\n  width: 100%;\n  aspect-ratio: 16 / 8.7;\n  min-height: 330px;\n  touch-action: none;\n  overflow: hidden;\n}.gm canvas{ width: 100%; height: 100%; display: block; cursor: crosshair; }.gm .game-overlay{\n  position: absolute; inset: 0; display: grid; place-items: center;\n  background: rgba(17, 24, 39, .56);\n  padding: 20px;\n}.gm .game-overlay.hidden{ display: none; }.gm .overlay-panel{\n  max-width: 390px; width: 100%; text-align: center;\n  background: rgba(255,255,255,.97);\n  padding: 28px 26px;\n  border-radius: 18px;\n  box-shadow: 0 20px 50px rgba(0,0,0,.2);\n}.gm .ball-icon{ font-size: 44px; line-height: 1; margin-bottom: 8px; }.gm .overlay-panel h2{ margin-bottom: 5px; }.gm .overlay-panel p{ color: var(--muted); margin: 0 0 20px; }.gm .primary-btn,.gm .shoot-btn,.gm .secondary-btn{\n  border: 0; min-height: 48px; padding: 0 20px; border-radius: 12px;\n  font-weight: 800; cursor: pointer; transition: transform .15s, filter .15s, opacity .15s;\n}.gm .primary-btn,.gm .shoot-btn{ color: #fff; background: var(--primary); }.gm .primary-btn:hover,.gm .shoot-btn:hover,.gm .secondary-btn:hover{ filter: brightness(.96); transform: translateY(-1px); }.gm .primary-btn:focus-visible,.gm .shoot-btn:focus-visible,.gm .secondary-btn:focus-visible,.gm input:focus-visible{\n  outline: 3px solid rgba(91,92,226,.3); outline-offset: 2px;\n}.gm .shoot-btn:disabled{ opacity: .45; cursor: not-allowed; transform: none; }.gm .controls-panel{\n  padding: 20px;\n  display: grid;\n  grid-template-columns: 1.5fr 1fr auto auto;\n  gap: 18px;\n  align-items: end;\n  border-top: 1px solid var(--border);\n}.gm .control-copy p{ color: var(--muted); margin: 0; font-size: 15px; }.gm .power-area label{ display: flex; justify-content: space-between; margin-bottom: 7px; font-weight: 700; font-size: 14px; }.gm input[type=\"range\"]{ width: 100%; accent-color: var(--primary); cursor: pointer; }.gm .secondary-btn{ background: #fff; color: var(--text); border: 1px solid var(--border); }.gm .about{ margin-top: 20px; }.gm details{ border-top: 1px solid var(--border); padding: 15px 0; }.gm details:last-child{ border-bottom: 1px solid var(--border); }.gm summary{ cursor: pointer; font-weight: 700; }.gm details p{ margin: 8px 0 0; }.gm kbd{ border: 1px solid var(--border); background: var(--bg); border-radius: 5px; padding: 1px 6px; font-size: .85em; }@media (max-width: 800px){.gm .page{ padding-top: 22px; }.gm .scorebar{ grid-template-columns: 100px 1fr 100px; }.gm .game-wrap{ min-height: 260px; }.gm .controls-panel{ grid-template-columns: 1fr 1fr; }.gm .control-copy{ grid-column: 1 / -1; }.gm .power-area{ grid-column: 1 / -1; }.gm .shoot-btn,.gm .secondary-btn{ width: 100%; }}@media (max-width: 500px){.gm .page{ padding-left: 14px; padding-right: 14px; }.gm .scorebar{ grid-template-columns: 75px 1fr 85px; padding: 10px 12px; min-height: 68px; }.gm .stat strong{ font-size: 21px; }.gm .status{ font-size: 14px; }.gm .game-wrap{ min-height: 235px; aspect-ratio: 1.45; }.gm .controls-panel{ padding: 18px; }.gm .overlay-panel{ padding: 22px 18px; }}";
function __ready(f){f()}
function boot(){
(() => {
  "use strict";

  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");
  const overlay = document.getElementById("gameOverlay");
  const overlayTitle = document.getElementById("overlayTitle");
  const overlayText = document.getElementById("overlayText");
  const startBtn = document.getElementById("startBtn");
  const shootBtn = document.getElementById("shootBtn");
  const restartBtn = document.getElementById("restartBtn");
  const scoreEl = document.getElementById("score");
  const shotsEl = document.getElementById("shots");
  const statusEl = document.getElementById("status");
  const powerRange = document.getElementById("powerRange");
  const powerValue = document.getElementById("powerValue");

  let W = 900, H = 490, dpr = 1;
  let running = false, shooting = false;
  let score = 0, shots = 10;
  let aimX = 0.5, aimY = 0.35;
  let keeperX = 0.5, keeperTarget = 0.5;
  let keeperDir = 1;
  let ball = null;
  let lastTime = 0;
  let messageTimer = 0;
  let particles = [];

  function resize() {
    const rect = canvas.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = Math.max(320, rect.width);
    H = Math.max(230, rect.height);
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (!shooting) draw();
  }

  function updateHud() {
    scoreEl.textContent = score;
    shotsEl.textContent = shots;
  }

  function setMessage(text, temporary = false) {
    statusEl.textContent = text;
    if (temporary) messageTimer = 1.3;
  }

  function resetGame(showOverlay = true) {
    running = false;
    shooting = false;
    score = 0;
    shots = 10;
    aimX = 0.5;
    aimY = 0.35;
    keeperX = 0.5;
    keeperTarget = 0.5;
    keeperDir = 1;
    ball = null;
    particles = [];
    updateHud();
    setMessage("Ready to play");
    shootBtn.disabled = true;
    overlay.classList.toggle("hidden", !showOverlay);
    if (showOverlay) {
      overlayTitle.textContent = "Ready?";
      overlayText.textContent = "Aim at the goal and take your first shot.";
      startBtn.textContent = "Start Game";
    }
    draw();
  }

  function startGame() {
    running = true;
    shooting = false;
    score = 0;
    shots = 10;
    keeperX = 0.5;
    keeperTarget = 0.5;
    ball = null;
    particles = [];
    updateHud();
    overlay.classList.add("hidden");
    shootBtn.disabled = false;
    setMessage("Aim and shoot");
    lastTime = performance.now();
    requestAnimationFrame(loop);
  }

  function finishGame() {
    running = false;
    shooting = false;
    shootBtn.disabled = true;
    overlay.classList.remove("hidden");
    overlayTitle.textContent = score >= 7 ? "Great Shooting!" : score >= 4 ? "Nice Game!" : "Final Score";
    overlayText.textContent = `You scored ${score} goal${score === 1 ? "" : "s"} out of 10 shots.`;
    startBtn.textContent = "Play Again";
    setMessage("Game complete");
  }

  function fieldGeometry() {
    const goalW = W * 0.52;
    const goalH = Math.min(H * 0.27, 135);
    const goalX = (W - goalW) / 2;
    const goalY = H * 0.085;
    const spotX = W / 2;
    const spotY = H * 0.79;
    return { goalW, goalH, goalX, goalY, spotX, spotY };
  }

  function setAim(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    const x = (clientX - rect.left) / rect.width;
    const y = (clientY - rect.top) / rect.height;
    aimX = Math.max(0.08, Math.min(0.92, x));
    aimY = Math.max(0.08, Math.min(0.62, y));
    if (!shooting && running) draw();
  }

  function randomizeKeeper() {
    keeperTarget = 0.2 + Math.random() * 0.6;
  }

  function shoot() {
    if (!running || shooting || shots <= 0) return;

    const g = fieldGeometry();
    const power = Number(powerRange.value) / 100;
    const targetX = aimX * W;
    const targetY = g.goalY + Math.max(18, aimY * g.goalH * 1.2);
    const startX = g.spotX;
    const startY = g.spotY;
    const endX = targetX;
    const endY = Math.min(g.goalY + g.goalH - 10, Math.max(g.goalY + 12, targetY));

    shots--;
    updateHud();
    shooting = true;
    setMessage("Shot in progress...");

    const dx = endX - startX;
    const dy = endY - startY;
    ball = {
      x: startX, y: startY, r: Math.max(8, W * 0.012),
      sx: startX, sy: startY, ex: endX, ey: endY,
      t: 0, duration: 0.62 - power * 0.18,
      power, saved: false
    };

    randomizeKeeper();
    requestAnimationFrame(loop);
  }

  function createBurst(x, y, success) {
    for (let i = 0; i < 18; i++) {
      const a = Math.random() * Math.PI * 2;
      const speed = 35 + Math.random() * 100;
      particles.push({
        x, y, vx: Math.cos(a) * speed, vy: Math.sin(a) * speed,
        life: .7 + Math.random() * .5, max: 1.2,
        success
      });
    }
  }

  function resolveShot() {
    const g = fieldGeometry();
    const goalLeft = g.goalX + 7;
    const goalRight = g.goalX + g.goalW - 7;
    const goalTop = g.goalY + 8;
    const goalBottom = g.goalY + g.goalH - 8;
    const inside = ball.ex > goalLeft && ball.ex < goalRight && ball.ey > goalTop && ball.ey < goalBottom;

    const keeperCenter = g.goalX + keeperX * g.goalW;
    const keeperW = g.goalW * 0.18;
    const keeperY = g.goalY + g.goalH * 0.47;
    const keeperH = g.goalH * 0.34;
    const nearKeeper = Math.abs(ball.ex - keeperCenter) < keeperW / 2 + ball.r &&
                        ball.ey > keeperY - keeperH / 2 && ball.ey < keeperY + keeperH / 2;

    const difficulty = 0.10 + (1 - ball.power) * 0.05;
    const saved = nearKeeper || (inside && Math.random() < difficulty);

    if (inside && !saved) {
      score++;
      createBurst(ball.ex, ball.ey, true);
      setMessage("GOAL! ⚽", true);
    } else {
      createBurst(ball.ex, ball.ey, false);
      setMessage(saved ? "Saved by the goalkeeper!" : "Missed the goal!", true);
    }

    updateHud();
    shooting = false;
    ball = null;

    if (shots <= 0) {
      setTimeout(finishGame, 700);
    } else {
      setTimeout(() => {
        if (running) {
          setMessage("Aim and shoot");
          draw();
        }
      }, 450);
    }
  }

  function update(dt) {
    if (messageTimer > 0) {
      messageTimer -= dt;
      if (messageTimer <= 0 && running && !shooting) setMessage(shots > 0 ? "Aim and shoot" : "Game complete");
    }

    if (running && !shooting) {
      keeperX += keeperDir * dt * 0.17;
      if (keeperX > 0.76) { keeperX = 0.76; keeperDir = -1; }
      if (keeperX < 0.24) { keeperX = 0.24; keeperDir = 1; }
    }

    particles = particles.filter(p => {
      p.life -= dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += 75 * dt;
      return p.life > 0;
    });

    if (ball) {
      ball.t += dt / ball.duration;
      const t = Math.min(1, ball.t);
      const ease = 1 - Math.pow(1 - t, 3);
      ball.x = ball.sx + (ball.ex - ball.sx) * ease;
      ball.y = ball.sy + (ball.ey - ball.sy) * ease - Math.sin(t * Math.PI) * H * 0.13 * ball.power;
      ball.r = Math.max(5, W * 0.012 * (1 - t * .25));
      if (t >= 1) resolveShot();
    }
  }

  function roundedRect(x, y, w, h, r) {
    const rr = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + rr, y);
    ctx.arcTo(x + w, y, x + w, y + h, rr);
    ctx.arcTo(x + w, y + h, x, y + h, rr);
    ctx.arcTo(x, y + h, x, y, rr);
    ctx.arcTo(x, y, x + w, y, rr);
    ctx.closePath();
  }

  function drawField() {
    const g = fieldGeometry();

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "#1b7a43";
    ctx.fillRect(0, 0, W, H);

    for (let i = 0; i < 8; i++) {
      ctx.fillStyle = i % 2 ? "rgba(255,255,255,.035)" : "rgba(0,0,0,.025)";
      ctx.fillRect(i * W / 8, 0, W / 8, H);
    }

    ctx.strokeStyle = "rgba(255,255,255,.7)";
    ctx.lineWidth = Math.max(2, W * .003);
    ctx.strokeRect(W * .035, H * .035, W * .93, H * .93);

    const boxW = W * .62, boxH = H * .48;
    const boxX = (W - boxW) / 2, boxY = H * .52;
    ctx.strokeRect(boxX, boxY, boxW, boxH);
    ctx.beginPath();
    ctx.arc(W / 2, H * .52, W * .10, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(W / 2, H * .79, Math.max(3, W * .006), 0, Math.PI * 2);
    ctx.fill();

    // Goal frame and net.
    ctx.fillStyle = "rgba(255,255,255,.10)";
    ctx.fillRect(g.goalX, g.goalY, g.goalW, g.goalH);
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = Math.max(4, W * .008);
    ctx.strokeRect(g.goalX, g.goalY, g.goalW, g.goalH);

    ctx.strokeStyle = "rgba(255,255,255,.25)";
    ctx.lineWidth = 1;
    for (let x = g.goalX; x <= g.goalX + g.goalW; x += Math.max(12, g.goalW / 16)) {
      ctx.beginPath(); ctx.moveTo(x, g.goalY); ctx.lineTo(x, g.goalY + g.goalH); ctx.stroke();
    }
    for (let y = g.goalY; y <= g.goalY + g.goalH; y += Math.max(10, g.goalH / 7)) {
      ctx.beginPath(); ctx.moveTo(g.goalX, y); ctx.lineTo(g.goalX + g.goalW, y); ctx.stroke();
    }
  }

  function drawKeeper() {
    const g = fieldGeometry();
    const cx = g.goalX + keeperX * g.goalW;
    const bodyW = g.goalW * .12;
    const bodyH = g.goalH * .32;
    const bodyY = g.goalY + g.goalH * .48;

    ctx.save();
    ctx.fillStyle = "#EF5B5B";
    roundedRect(cx - bodyW / 2, bodyY - bodyH / 2, bodyW, bodyH, bodyW * .18);
    ctx.fill();

    ctx.fillStyle = "#F5C7A9";
    ctx.beginPath();
    ctx.arc(cx, bodyY - bodyH * .65, bodyW * .28, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "#F5C7A9";
    ctx.lineWidth = Math.max(5, bodyW * .13);
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(cx - bodyW * .38, bodyY - bodyH * .25);
    ctx.lineTo(cx - bodyW * .78, bodyY - bodyH * .48);
    ctx.moveTo(cx + bodyW * .38, bodyY - bodyH * .25);
    ctx.lineTo(cx + bodyW * .78, bodyY - bodyH * .48);
    ctx.stroke();

    ctx.restore();
  }

  function drawAim() {
    if (!running || shooting) return;
    const g = fieldGeometry();
    const x = aimX * W;
    const y = g.goalY + aimY * g.goalH;

    ctx.save();
    ctx.strokeStyle = "rgba(255,255,255,.78)";
    ctx.lineWidth = 2;
    ctx.setLineDash([7, 7]);
    ctx.beginPath();
    ctx.moveTo(g.spotX, g.spotY);
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.strokeStyle = "#FFB84D";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(x, y, Math.max(10, W * .017), 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x - 15, y); ctx.lineTo(x + 15, y);
    ctx.moveTo(x, y - 15); ctx.lineTo(x, y + 15);
    ctx.stroke();
    ctx.restore();
  }

  function drawBall() {
    if (!ball) {
      const g = fieldGeometry();
      drawSoccerBall(g.spotX, g.spotY, Math.max(10, W * .015));
      return;
    }
    drawSoccerBall(ball.x, ball.y, ball.r);
  }

  function drawSoccerBall(x, y, r) {
    ctx.save();
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(0,0,0,.3)";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = "#171B2D";
    ctx.beginPath();
    ctx.arc(x, y, r * .27, 0, Math.PI * 2);
    ctx.fill();

    for (let i = 0; i < 5; i++) {
      const a = i * Math.PI * 2 / 5;
      ctx.beginPath();
      ctx.arc(x + Math.cos(a) * r * .58, y + Math.sin(a) * r * .58, r * .11, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  function drawParticles() {
    particles.forEach(p => {
      ctx.save();
      ctx.globalAlpha = Math.max(0, p.life / p.max);
      ctx.fillStyle = p.success ? "#FFB84D" : "#fff";
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
  }

  function draw() {
    drawField();
    drawKeeper();
    drawAim();
    drawBall();
    drawParticles();
  }

  function loop(now) {
    if (!running && !shooting && particles.length === 0) {
      draw();
      return;
    }
    const dt = Math.min(.035, (now - lastTime) / 1000 || .016);
    lastTime = now;
    update(dt);
    draw();
    if (running || shooting || particles.length) requestAnimationFrame(loop);
  }

  canvas.addEventListener("pointermove", e => setAim(e.clientX, e.clientY));
  canvas.addEventListener("pointerdown", e => {
    setAim(e.clientX, e.clientY);
    if (running && !shooting) shoot();
  });
  shootBtn.addEventListener("click", shoot);
  startBtn.addEventListener("click", startGame);
  restartBtn.addEventListener("click", () => resetGame(true));
  powerRange.addEventListener("input", () => {
    powerValue.textContent = `${powerRange.value}%`;
  });
  window.addEventListener("resize", resize);
  window.addEventListener("keydown", e => {
    if (e.code === "Space") {
      e.preventDefault();
      if (!running) startGame();
      else shoot();
    }
    if (e.code === "ArrowLeft") aimX = Math.max(.08, aimX - .035);
    if (e.code === "ArrowRight") aimX = Math.min(.92, aimX + .035);
    if (e.code === "ArrowUp") aimY = Math.max(.08, aimY - .035);
    if (e.code === "ArrowDown") aimY = Math.min(.62, aimY + .035);
    if (running && !shooting && e.code.startsWith("Arrow")) draw();
  });

  resize();
  resetGame(true);
})();

}
function begin(){poster.hidden=true;gm.hidden=false;if(!booted){booted=true;var s=document.createElement("style");s.textContent=LOOK;document.head.appendChild(s);boot();}else{var r=document.getElementById("startBtn");if(r)r.click();}}
poster.addEventListener("click",begin);
var nb=document.getElementById("new");if(nb)nb.addEventListener("click",begin);
})();
