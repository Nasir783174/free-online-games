/* Basketball - game logic + its own look. Layout lives in style.css; page shell lives in the HTML. */
(function(){"use strict";
var gm=document.getElementById("gm"),poster=document.getElementById("poster"),booted=false;
var LOOK=".gm *{\n  box-sizing: border-box;\n}.gm{\n  \n  \n  --cyan: #16B8C4;\n  --orange: #FFB84D;\n  --success: #22C55E;\n  --danger: #EF5B5B;\n  \n  \n  \n  \n  \n  --game: #111827;\n  --game-secondary: #1F2937;\n}.gm button{\n  font: inherit;\n}.gm button{\n  cursor: pointer;\n}.gm .page-shell{\n  width: min(1120px, calc(100% - 32px));\n  margin: 0 auto;\n  padding: 26px 0 72px;\n}.gm h2,.gm h3{\n  line-height: 1.15;\n}.gm .lead{\n  max-width: 720px;\n  color: var(--muted);\n  margin: 14px 0 0;\n  font-size: 18px;\n}.gm .game-card{\n  overflow: hidden;\n  border-radius: 20px;\n  background: var(--card);\n  border: 1px solid var(--border);\n  box-shadow: 0 14px 40px rgba(23, 27, 45, 0.08);\n}.gm .scorebar{\n  min-height: 76px;\n  padding: 12px 22px;\n  display: grid;\n  grid-template-columns: 1fr auto 1fr;\n  align-items: center;\n  gap: 16px;\n  background: white;\n}.gm .score-stat{\n  display: flex;\n  align-items: baseline;\n  gap: 10px;\n}.gm .score-stat.right{\n  justify-content: flex-end;\n}.gm .stat-label{\n  color: var(--muted);\n  font-size: 12px;\n  font-weight: 800;\n  letter-spacing: 0.1em;\n}.gm .score-stat strong{\n  font-size: 26px;\n  line-height: 1;\n  font-weight: 800;\n  min-width: 36px;\n}.gm .game-title{\n  font-size: 14px;\n  font-weight: 800;\n  color: var(--brand-dark);\n  letter-spacing: 0.06em;\n}.gm .canvas-wrap{\n  position: relative;\n  width: 100%;\n  aspect-ratio: 16 / 9;\n  min-height: 420px;\n  background: var(--game);\n  touch-action: none;\n}.gm canvas{\n  display: block;\n  width: 100%;\n  height: 100%;\n  touch-action: none;\n}.gm .overlay{\n  position: absolute;\n  inset: 0;\n  display: grid;\n  place-items: center;\n  padding: 20px;\n  background: rgba(17, 24, 39, 0.72);\n  backdrop-filter: blur(4px);\n}.gm .overlay.hidden{\n  display: none;\n}.gm .overlay-card{\n  width: min(390px, 100%);\n  text-align: center;\n  padding: 30px;\n  border-radius: 18px;\n  background: white;\n  box-shadow: 0 18px 55px rgba(0, 0, 0, 0.24);\n}.gm .ball-icon{\n  font-size: 44px;\n  line-height: 1;\n  margin-bottom: 10px;\n}.gm .overlay-card h2{\n  margin: 0 0 8px;\n  font-size: 30px;\n}.gm .overlay-card p{\n  margin: 0 0 20px;\n  color: var(--muted);\n  font-size: 16px;\n}.gm .result-kicker{\n  color: var(--brand);\n  font-size: 13px;\n  font-weight: 800;\n  letter-spacing: 0.12em;\n}.gm .final-score{\n  margin: 4px 0 6px;\n  font-size: 64px;\n  line-height: 1;\n  font-weight: 800;\n  color: var(--brand);\n}.gm .primary-btn,.gm .secondary-btn{\n  min-height: 48px;\n  border-radius: 12px;\n  padding: 10px 20px;\n  font-size: 16px;\n  font-weight: 800;\n  transition: transform 0.15s ease, background 0.15s ease;\n}.gm .primary-btn{\n  border: 0;\n  background: var(--brand);\n  color: white;\n}.gm .primary-btn:hover{\n  background: var(--brand-dark);\n  transform: translateY(-1px);\n}.gm .secondary-btn{\n  border: 1px solid var(--border);\n  background: white;\n  color: var(--text);\n}.gm .secondary-btn:hover{\n  border-color: #C8C9F4;\n  background: #F8F8FF;\n}.gm .primary-btn:focus-visible,.gm .secondary-btn:focus-visible{\n  outline: 3px solid rgba(91, 92, 226, 0.3);\n  outline-offset: 2px;\n}.gm .controls{\n  min-height: 72px;\n  padding: 12px 18px;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 20px;\n  border-top: 1px solid var(--border);\n}.gm .control-copy{\n  display: flex;\n  flex-direction: column;\n  gap: 1px;\n}.gm .control-copy strong{\n  font-size: 15px;\n}.gm .control-copy span{\n  color: var(--muted);\n  font-size: 14px;\n}.gm kbd{\n  padding: 2px 6px;\n  border: 1px solid var(--border);\n  border-bottom-width: 2px;\n  border-radius: 5px;\n  background: #F8F9FC;\n  font-size: 13px;\n}@media (max-width: 760px){.gm .page-shell{\n    width: min(100% - 20px, 1120px);\n    padding-top: 18px;\n  }.gm .lead{\n    font-size: 16px;\n  }.gm .canvas-wrap{\n    min-height: 0;\n    aspect-ratio: 4 / 5;\n  }.gm .scorebar{\n    min-height: 66px;\n    padding: 10px 14px;\n  }.gm .game-title{\n    font-size: 11px;\n  }.gm .score-stat strong{\n    font-size: 22px;\n  }}@media (max-width: 430px){.gm .game-title{\n    display: none;\n  }.gm .scorebar{\n    grid-template-columns: 1fr 1fr;\n  }.gm .score-stat.right{\n    justify-content: flex-end;\n  }.gm .controls{\n    align-items: stretch;\n  }.gm .control-copy span{\n    font-size: 13px;\n    line-height: 1.4;\n  }.gm .secondary-btn{\n    flex: 0 0 auto;\n  }}";
function __ready(f){f()}
function boot(){
(() => {
  "use strict";

  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");
  const scoreEl = document.getElementById("score");
  const timeEl = document.getElementById("time");
  const startOverlay = document.getElementById("startOverlay");
  const endOverlay = document.getElementById("endOverlay");
  const finalScoreEl = document.getElementById("finalScore");
  const resultMessageEl = document.getElementById("resultMessage");
  const startBtn = document.getElementById("startBtn");
  const restartBtn = document.getElementById("restartBtn");
  const resetBtn = document.getElementById("resetBtn");

  let W = 960;
  let H = 540;
  let dpr = 1;
  let animationId = 0;
  let lastFrame = 0;
  let state = "ready";
  let score = 0;
  let timeLeft = 45;
  let shotInProgress = false;
  let dragging = false;
  let pointerId = null;
  let shotStart = null;
  let aimPoint = null;
  let message = "";
  let messageTimer = 0;
  let hoop = null;

  const ball = {
    x: 0,
    y: 0,
    r: 18,
    vx: 0,
    vy: 0,
    rotation: 0
  };

  const gravity = 980;
  const groundY = 0;
  const shotOrigin = () => ({ x: W * 0.22, y: H * 0.77 });

  function resize() {
    const rect = canvas.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = Math.max(320, rect.width);
    H = Math.max(360, rect.height);
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    ball.r = Math.max(14, Math.min(21, W * 0.021));
    setupHoop();
    if (!shotInProgress) resetBall();
  }

  function setupHoop() {
    const margin = Math.max(44, W * 0.055);
    const backboardH = Math.max(100, H * 0.23);
    hoop = {
      rimX: W * 0.74 + (Math.random() - 0.5) * W * 0.14,
      rimY: H * 0.39 + (Math.random() - 0.5) * H * 0.08,
      rimW: Math.max(72, W * 0.105),
      rimR: Math.max(5, W * 0.006),
      boardX: Math.min(W - margin - 14, W * 0.80 + (Math.random() - 0.5) * W * 0.10),
      boardY: H * 0.21,
      boardW: Math.max(12, W * 0.018),
      boardH: backboardH,
      poleX: 0,
      poleY: 0
    };
    hoop.boardX = Math.min(W - margin, hoop.boardX);
    hoop.rimX = Math.min(hoop.boardX - hoop.rimW * 0.15, hoop.rimX);
    hoop.poleX = hoop.boardX + hoop.boardW * 0.5;
    hoop.poleY = hoop.boardY + hoop.boardH;
  }

  function resetBall() {
    const p = shotOrigin();
    ball.x = p.x;
    ball.y = p.y;
    ball.vx = 0;
    ball.vy = 0;
    ball.rotation = 0;
    shotInProgress = false;
    dragging = false;
    aimPoint = null;
  }

  function resetGame(showStart = false) {
    cancelAnimationFrame(animationId);
    score = 0;
    timeLeft = 45;
    state = showStart ? "ready" : "playing";
    message = "";
    messageTimer = 0;
    scoreEl.textContent = score;
    timeEl.textContent = timeLeft;
    setupHoop();
    resetBall();
    startOverlay.classList.toggle("hidden", !showStart);
    endOverlay.classList.add("hidden");
    lastFrame = performance.now();
    draw();
    if (!showStart) animationId = requestAnimationFrame(loop);
  }

  function startGame() {
    resetGame(false);
  }

  function endGame() {
    state = "ended";
    shotInProgress = false;
    dragging = false;
    finalScoreEl.textContent = score;
    resultMessageEl.textContent =
      score >= 20 ? "Excellent shooting! You found a great rhythm." :
      score >= 10 ? "Nice run! A little more practice and you'll be on fire." :
      "Keep practicing your release angle and timing.";
    endOverlay.classList.remove("hidden");
  }

  function loop(now) {
    if (state !== "playing") return;

    const dt = Math.min((now - lastFrame) / 1000, 0.033);
    lastFrame = now;

    timeLeft = Math.max(0, timeLeft - dt);
    timeEl.textContent = Math.ceil(timeLeft);

    update(dt);
    draw();

    if (timeLeft <= 0) {
      endGame();
      return;
    }

    animationId = requestAnimationFrame(loop);
  }

  function update(dt) {
    if (messageTimer > 0) messageTimer -= dt;

    if (!shotInProgress) return;

    ball.vy += gravity * dt;
    ball.x += ball.vx * dt;
    ball.y += ball.vy * dt;
    ball.rotation += ball.vx * dt / Math.max(ball.r, 1);

    checkScore();
    checkCollisions();

    const offscreen =
      ball.x < -100 || ball.x > W + 100 ||
      ball.y < -150 || ball.y > H + 120;

    if (offscreen) {
      resetBall();
    }

    if (ball.y > H * 0.86 && ball.vy > 0) {
      resetBall();
    }
  }

  function checkScore() {
    if (!hoop || ball._scored) return;

    const rimY = hoop.rimY;
    const left = hoop.rimX - hoop.rimW / 2;
    const right = hoop.rimX + hoop.rimW / 2;

    if (
      ball.vy > 0 &&
      ball.y >= rimY - ball.r * 0.15 &&
      ball.y <= rimY + ball.r * 0.9 &&
      ball.x > left + ball.r * 0.45 &&
      ball.x < right - ball.r * 0.45
    ) {
      ball._scored = true;
      score += 2;
      scoreEl.textContent = score;
      message = "+2  BASKET!";
      messageTimer = 1.1;

      setTimeout(() => {
        if (state === "playing") {
          setupHoop();
          resetBall();
        }
      }, 240);
    }
  }

  function checkCollisions() {
    if (!hoop) return;

    const board = {
      left: hoop.boardX,
      right: hoop.boardX + hoop.boardW,
      top: hoop.boardY,
      bottom: hoop.boardY + hoop.boardH
    };

    if (
      ball.x + ball.r > board.left &&
      ball.x - ball.r < board.right &&
      ball.y + ball.r > board.top &&
      ball.y - ball.r < board.bottom &&
      ball.vx > 0
    ) {
      ball.x = board.left - ball.r;
      ball.vx *= -0.55;
    }

    const rimY = hoop.rimY;
    const leftRim = hoop.rimX - hoop.rimW / 2;
    const rightRim = hoop.rimX + hoop.rimW / 2;

    collideWithPoint(leftRim, rimY);
    collideWithPoint(rightRim, rimY);
  }

  function collideWithPoint(px, py) {
    const dx = ball.x - px;
    const dy = ball.y - py;
    const minDist = ball.r + hoop.rimR;
    const distSq = dx * dx + dy * dy;

    if (distSq > 0 && distSq < minDist * minDist) {
      const dist = Math.sqrt(distSq);
      const nx = dx / dist;
      const ny = dy / dist;
      ball.x = px + nx * minDist;
      ball.y = py + ny * minDist;

      const dot = ball.vx * nx + ball.vy * ny;
      if (dot < 0) {
        ball.vx -= 1.65 * dot * nx;
        ball.vy -= 1.65 * dot * ny;
        ball.vx *= 0.76;
        ball.vy *= 0.76;
      }
    }
  }

  function getPointerPosition(event) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
  }

  function pointerDown(event) {
    if (state !== "playing" || shotInProgress) return;

    const p = getPointerPosition(event);
    const dx = p.x - ball.x;
    const dy = p.y - ball.y;
    const hitRadius = ball.r * 2.2;

    if (dx * dx + dy * dy <= hitRadius * hitRadius) {
      dragging = true;
      pointerId = event.pointerId;
      shotStart = { x: ball.x, y: ball.y };
      aimPoint = p;
      canvas.setPointerCapture(pointerId);
      event.preventDefault();
    }
  }

  function pointerMove(event) {
    if (!dragging || event.pointerId !== pointerId) return;
    aimPoint = getPointerPosition(event);
    event.preventDefault();
  }

  function pointerUp(event) {
    if (!dragging || event.pointerId !== pointerId) return;

    const p = getPointerPosition(event);
    const dx = shotStart.x - p.x;
    const dy = shotStart.y - p.y;
    const distance = Math.hypot(dx, dy);

    if (distance > 14) {
      const power = Math.min(distance, W * 0.48);
      const speed = 430 + power * 5.1;
      const length = Math.max(distance, 1);
      ball.vx = (dx / length) * speed;
      ball.vy = (dy / length) * speed;
      ball._scored = false;
      shotInProgress = true;
    }

    dragging = false;
    aimPoint = null;
    event.preventDefault();
  }

  function keyDown(event) {
    if (event.key.toLowerCase() === "r") {
      resetGame(false);
    }
    if ((event.key === " " || event.key === "Enter") && state === "ready") {
      event.preventDefault();
      startGame();
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    drawCourt();
    drawHoop();
    drawBall();
    if (dragging && aimPoint) drawAim();
    if (messageTimer > 0 && message) drawMessage();
  }

  function drawCourt() {
    const gradient = ctx.createLinearGradient(0, 0, 0, H);
    gradient.addColorStop(0, "#172033");
    gradient.addColorStop(1, "#0D1422");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, W, H);

    ctx.fillStyle = "#B76E36";
    ctx.fillRect(0, H * 0.78, W, H * 0.22);

    ctx.fillStyle = "rgba(255,255,255,0.13)";
    ctx.fillRect(0, H * 0.78, W, 2);

    ctx.strokeStyle = "rgba(255,255,255,0.12)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(W * 0.23, H * 0.80, H * 0.12, Math.PI, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = "rgba(255,255,255,0.06)";
    for (let x = 0; x < W; x += 46) {
      ctx.fillRect(x, H * 0.80, 2, H * 0.20);
    }
  }

  function drawHoop() {
    if (!hoop) return;

    ctx.fillStyle = "#D8DEE9";
    ctx.fillRect(hoop.boardX, hoop.boardY, hoop.boardW, hoop.boardH);

    ctx.strokeStyle = "rgba(255,255,255,0.8)";
    ctx.lineWidth = 3;
    ctx.strokeRect(
      hoop.boardX - Math.max(22, W * 0.02),
      hoop.rimY - Math.max(38, H * 0.07),
      Math.max(55, W * 0.07),
      Math.max(48, H * 0.09)
    );

    ctx.strokeStyle = "#F97316";
    ctx.lineWidth = hoop.rimR * 2;
    ctx.beginPath();
    ctx.moveTo(hoop.rimX - hoop.rimW / 2, hoop.rimY);
    ctx.lineTo(hoop.rimX + hoop.rimW / 2, hoop.rimY);
    ctx.stroke();

    ctx.fillStyle = "#E5E7EB";
    ctx.fillRect(hoop.poleX - 5, hoop.poleY, 10, H - hoop.poleY);

    ctx.strokeStyle = "rgba(255,255,255,0.45)";
    ctx.lineWidth = 1;
    const netTop = hoop.rimY + 3;
    const netBottom = netTop + Math.max(35, H * 0.065);
    for (let i = -4; i <= 4; i++) {
      const x = hoop.rimX + i * (hoop.rimW / 9);
      ctx.beginPath();
      ctx.moveTo(x, netTop);
      ctx.lineTo(hoop.rimX + i * (hoop.rimW / 14), netBottom);
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.moveTo(hoop.rimX - hoop.rimW / 2 + 3, netTop);
    ctx.quadraticCurveTo(hoop.rimX, netBottom + 5, hoop.rimX + hoop.rimW / 2 - 3, netTop);
    ctx.stroke();
  }

  function drawBall() {
    const shadowY = H * 0.81;
    if (!shotInProgress) {
      ctx.fillStyle = "rgba(0,0,0,0.2)";
      ctx.beginPath();
      ctx.ellipse(ball.x, shadowY, ball.r * 1.5, ball.r * 0.35, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    const grad = ctx.createRadialGradient(
      ball.x - ball.r * 0.35,
      ball.y - ball.r * 0.4,
      2,
      ball.x,
      ball.y,
      ball.r
    );
    grad.addColorStop(0, "#FFB84D");
    grad.addColorStop(1, "#E87518");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
    ctx.fill();

    ctx.save();
    ctx.translate(ball.x, ball.y);
    ctx.rotate(ball.rotation);
    ctx.strokeStyle = "rgba(50,30,20,0.72)";
    ctx.lineWidth = Math.max(1.5, ball.r * 0.09);

    ctx.beginPath();
    ctx.arc(0, 0, ball.r * 0.78, -Math.PI * 0.42, Math.PI * 0.42);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(0, 0, ball.r * 0.78, Math.PI * 0.58, Math.PI * 1.42);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(-ball.r * 0.96, -ball.r * 0.1);
    ctx.quadraticCurveTo(0, ball.r * 0.25, ball.r * 0.96, -ball.r * 0.1);
    ctx.stroke();
    ctx.restore();
  }

  function drawAim() {
    const dx = shotStart.x - aimPoint.x;
    const dy = shotStart.y - aimPoint.y;
    const distance = Math.min(Math.hypot(dx, dy), W * 0.48);
    const angle = Math.atan2(dy, dx);

    ctx.save();
    ctx.strokeStyle = "rgba(255,255,255,0.82)";
    ctx.lineWidth = 3;
    ctx.setLineDash([8, 8]);
    ctx.beginPath();
    ctx.moveTo(ball.x, ball.y);
    ctx.lineTo(
      ball.x + Math.cos(angle) * distance,
      ball.y + Math.sin(angle) * distance
    );
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = "rgba(255,184,77,0.9)";
    ctx.beginPath();
    ctx.arc(aimPoint.x, aimPoint.y, 7, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "rgba(255,255,255,0.82)";
    ctx.font = `700 ${Math.max(13, W * 0.017)}px "Nunito Sans", sans-serif`;
    ctx.textAlign = "center";
    ctx.fillText("RELEASE", aimPoint.x, aimPoint.y - 15);
    ctx.restore();
  }

  function drawMessage() {
    ctx.save();
    ctx.globalAlpha = Math.min(1, messageTimer * 2);
    ctx.fillStyle = "rgba(34,197,94,0.94)";
    const w = Math.min(250, W * 0.36);
    const h = 48;
    const x = W / 2 - w / 2;
    const y = 22;
    roundedRect(x, y, w, h, 12);
    ctx.fill();

    ctx.fillStyle = "#fff";
    ctx.font = `800 ${Math.max(16, W * 0.022)}px "Nunito Sans", sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(message, W / 2, y + h / 2);
    ctx.restore();
  }

  function roundedRect(x, y, w, h, r) {
    const radius = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.arcTo(x + w, y, x + w, y + h, radius);
    ctx.arcTo(x + w, y + h, x, y + h, radius);
    ctx.arcTo(x, y + h, x, y, radius);
    ctx.arcTo(x, y, x + w, y, radius);
    ctx.closePath();
  }

  startBtn.addEventListener("click", startGame);
  restartBtn.addEventListener("click", startGame);
  resetBtn.addEventListener("click", () => resetGame(false));

  canvas.addEventListener("pointerdown", pointerDown, { passive: false });
  canvas.addEventListener("pointermove", pointerMove, { passive: false });
  canvas.addEventListener("pointerup", pointerUp, { passive: false });
  canvas.addEventListener("pointercancel", pointerUp, { passive: false });
  window.addEventListener("keydown", keyDown);
  window.addEventListener("resize", resize);

  resize();
  resetGame(true);
})();


}
function begin(){poster.hidden=true;gm.hidden=false;if(!booted){booted=true;var s=document.createElement("style");s.textContent=LOOK;document.head.appendChild(s);boot();}else{var r=document.getElementById("startBtn");if(r)r.click();}}
poster.addEventListener("click",begin);
var nb=document.getElementById("new");if(nb)nb.addEventListener("click",begin);
})();
