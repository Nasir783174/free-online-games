/* Dodging - game logic + its own look. Layout lives in style.css; page shell lives in the HTML. */
(function(){"use strict";
var gm=document.getElementById("gm"),poster=document.getElementById("poster"),booted=false;
var LOOK=".gm{\n  --primary: #5B5CE2;\n  --primary-dark: #4546B8;\n  --cyan: #16B8C4;\n  --orange: #FFB84D;\n  --success: #22C55E;\n  --danger: #EF5B5B;\n  \n  \n  \n  \n  \n  --game: #111827;\n  --game-2: #1F2937;\n}.gm *{ box-sizing: border-box; }.gm button{ font: inherit; }.gm .page{\n  width: min(1000px, calc(100% - 32px));\n  margin: 0 auto;\n  padding: 28px 0 72px;\n}.gm h2{\n  font-size: 32px;\n  line-height: 1.15;\n  margin: 0 0 16px;\n  font-weight: 700;\n}.gm .game-card{\n  background: var(--card);\n  border: 1px solid var(--border);\n  border-radius: 20px;\n  padding: 18px;\n  box-shadow: 0 12px 35px rgba(23, 27, 45, .07);\n}.gm .game-topbar{\n  display: flex;\n  align-items: center;\n  gap: 22px;\n  padding: 2px 4px 15px;\n}.gm .stat{\n  min-width: 90px;\n  display: flex;\n  flex-direction: column;\n}.gm .stat span{\n  color: var(--muted);\n  font-size: 13px;\n  font-weight: 700;\n  text-transform: uppercase;\n  letter-spacing: .06em;\n}.gm .stat strong{\n  font-size: 24px;\n  line-height: 1.2;\n}.gm .status{\n  margin-left: auto;\n  color: var(--primary);\n  background: #F0F0FF;\n  padding: 7px 12px;\n  border-radius: 999px;\n  font-size: 14px;\n  font-weight: 800;\n}.gm .canvas-wrap{\n  position: relative;\n  width: 100%;\n  aspect-ratio: 16 / 9;\n  max-height: 620px;\n  overflow: hidden;\n  border-radius: 16px;\n  background: var(--game);\n}.gm canvas{\n  width: 100%;\n  height: 100%;\n  display: block;\n  touch-action: none;\n}.gm .overlay{\n  position: absolute;\n  inset: 0;\n  display: grid;\n  place-items: center;\n  padding: 24px;\n  background: rgba(17, 24, 39, .72);\n  backdrop-filter: blur(3px);\n}.gm .overlay.hidden{ display: none; }.gm .overlay-box{\n  width: min(430px, 100%);\n  padding: 28px;\n  border-radius: 18px;\n  text-align: center;\n  background: #fff;\n  box-shadow: 0 18px 55px rgba(0, 0, 0, .25);\n}.gm .overlay-icon{\n  width: 48px;\n  height: 48px;\n  margin: 0 auto 12px;\n  display: grid;\n  place-items: center;\n  border-radius: 14px;\n  color: #fff;\n  background: var(--primary);\n  font-size: 22px;\n}.gm .overlay h2{ margin-bottom: 8px; }.gm .overlay p{ color: var(--muted); margin: 0 0 20px; }.gm button{\n  border: 0;\n  cursor: pointer;\n  transition: transform .15s ease, box-shadow .15s ease, background .15s ease;\n}.gm button:focus-visible,.gm summary:focus-visible{\n  outline: 3px solid rgba(91, 92, 226, .35);\n  outline-offset: 3px;\n}.gm button:hover{ transform: translateY(-1px); }.gm #startBtn,.gm .restart-btn{\n  min-height: 48px;\n  padding: 0 22px;\n  border-radius: 12px;\n  background: var(--primary);\n  color: #fff;\n  font-weight: 800;\n  box-shadow: 0 7px 18px rgba(91, 92, 226, .22);\n}.gm #startBtn:hover,.gm .restart-btn:hover{ background: var(--primary-dark); }.gm .controls{\n  display: flex;\n  justify-content: center;\n  gap: 14px;\n  padding: 18px 0 10px;\n}.gm .control-btn{\n  width: 64px;\n  height: 52px;\n  border-radius: 13px;\n  color: var(--text);\n  background: #EEF0F6;\n  font-size: 25px;\n  font-weight: 800;\n}.gm .control-btn:hover{ background: #E3E6F0; }.gm .pause-btn{ color: var(--primary); }.gm .restart-btn{\n  display: block;\n  margin: 0 auto 2px;\n  background: var(--text);\n  box-shadow: none;\n}.gm .instruction-grid{\n  display: grid;\n  grid-template-columns: repeat(4, 1fr);\n  gap: 12px;\n  margin-top: 22px;\n}.gm .instruction-grid div{\n  padding: 17px;\n  border: 1px solid var(--border);\n  border-radius: 14px;\n  background: #fff;\n}.gm .instruction-grid strong,.gm .instruction-grid span{\n  display: block;\n}.gm .instruction-grid strong{ font-size: 15px; margin-bottom: 4px; }.gm .instruction-grid span{ color: var(--muted); font-size: 14px; line-height: 1.45; }.gm ul{ padding-left: 22px; color: var(--muted); }@media (max-width: 760px){.gm .page{ width: min(100% - 20px, 1000px); padding-top: 20px; }.gm .game-card{ padding: 10px; border-radius: 16px; }.gm .game-topbar{ gap: 12px; padding: 4px 3px 10px; }.gm .stat{ min-width: 70px; }.gm .stat strong{ font-size: 21px; }.gm .status{ font-size: 12px; padding: 6px 9px; }.gm .canvas-wrap{ border-radius: 12px; }.gm .instruction-grid{ grid-template-columns: repeat(2, 1fr); }.gm h2{ font-size: 28px; }}@media (max-width: 430px){.gm .overlay-box{ padding: 22px 18px; }.gm .controls{ gap: 10px; }.gm .control-btn{ width: 76px; height: 54px; }}";
function __ready(f){f()}
function boot(){
(() => {
  "use strict";

  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");
  const scoreEl = document.getElementById("score");
  const bestEl = document.getElementById("best");
  const statusEl = document.getElementById("status");
  const overlay = document.getElementById("overlay");
  const overlayTitle = document.getElementById("overlayTitle");
  const overlayText = document.getElementById("overlayText");
  const startBtn = document.getElementById("startBtn");
  const restartBtn = document.getElementById("restartBtn");
  const pauseBtn = document.getElementById("pauseBtn");
  const leftBtn = document.getElementById("leftBtn");
  const rightBtn = document.getElementById("rightBtn");

  let W = 900, H = 506, dpr = 1;
  let animationId = 0;
  let lastTime = 0;
  let spawnTimer = 0;
  let score = 0;
  let best = Number(localStorage.getItem("dodgingBest") || 0);
  let state = "ready";
  let leftHeld = false;
  let rightHeld = false;
  let obstacles = [];

  const player = {
    x: 0, y: 0, width: 42, height: 42, speed: 430
  };

  bestEl.textContent = best;

  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = Math.max(320, rect.width);
    H = Math.max(220, rect.height);
    canvas.width = Math.floor(W * dpr);
    canvas.height = Math.floor(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    player.width = Math.max(30, Math.min(44, W * 0.047));
    player.height = player.width;
    player.y = H - player.height - Math.max(20, H * 0.055);
    player.x = Math.min(Math.max(player.x, 0), W - player.width);
    draw();
  }

  function resetGame() {
    cancelAnimationFrame(animationId);
    score = 0;
    spawnTimer = 0;
    obstacles = [];
    player.x = (W - player.width) / 2;
    scoreEl.textContent = "0";
    statusEl.textContent = "Ready";
    state = "ready";
    showOverlay("Ready?", "Use the arrow keys, A/D, or the touch controls to move. Avoid every falling obstacle.", "Start Game");
    draw();
  }

  function startGame() {
    cancelAnimationFrame(animationId);
    score = 0;
    spawnTimer = 0;
    obstacles = [];
    player.x = (W - player.width) / 2;
    scoreEl.textContent = "0";
    state = "playing";
    statusEl.textContent = "Playing";
    overlay.classList.add("hidden");
    lastTime = performance.now();
    animationId = requestAnimationFrame(loop);
  }

  function pauseGame() {
    if (state === "playing") {
      state = "paused";
      statusEl.textContent = "Paused";
      showOverlay("Paused", "Take a breath. Continue when you're ready.", "Continue");
      cancelAnimationFrame(animationId);
    } else if (state === "paused") {
      state = "playing";
      statusEl.textContent = "Playing";
      overlay.classList.add("hidden");
      lastTime = performance.now();
      animationId = requestAnimationFrame(loop);
    }
  }

  function gameOver() {
    state = "gameover";
    cancelAnimationFrame(animationId);
    if (score > best) {
      best = score;
      localStorage.setItem("dodgingBest", String(best));
      bestEl.textContent = best;
    }
    statusEl.textContent = "Game Over";
    showOverlay("Game Over", `You scored ${score}. Avoid the obstacles and try again.`, "Play Again");
    draw();
  }

  function showOverlay(title, text, buttonText) {
    overlayTitle.textContent = title;
    overlayText.textContent = text;
    startBtn.textContent = buttonText;
    overlay.classList.remove("hidden");
  }

  function spawnObstacle() {
    const size = Math.max(22, Math.min(46, W * (0.035 + Math.random() * 0.025)));
    const margin = 12;
    const x = margin + Math.random() * Math.max(1, W - size - margin * 2);
    const difficulty = Math.min(score / 80, 1);
    const speed = H * (0.42 + Math.random() * 0.24) + difficulty * H * 0.24;

    obstacles.push({
      x, y: -size - 10,
      width: size,
      height: size,
      speed,
      rotation: Math.random() * Math.PI,
      spin: (Math.random() - 0.5) * 2.5
    });
  }

  function update(dt) {
    const move = (rightHeld ? 1 : 0) - (leftHeld ? 1 : 0);
    player.x += move * player.speed * dt;
    player.x = Math.max(0, Math.min(W - player.width, player.x));

    const difficulty = Math.min(score / 100, 1);
    const spawnEvery = Math.max(0.27, 0.72 - difficulty * 0.32);
    spawnTimer += dt;
    if (spawnTimer >= spawnEvery) {
      spawnTimer = 0;
      spawnObstacle();
      if (Math.random() < 0.12 + difficulty * 0.12) spawnObstacle();
    }

    for (let i = obstacles.length - 1; i >= 0; i--) {
      const o = obstacles[i];
      o.y += o.speed * dt;
      o.rotation += o.spin * dt;

      if (isColliding(player, o)) {
        gameOver();
        return;
      }

      if (o.y > H + o.height) {
        obstacles.splice(i, 1);
        score++;
        scoreEl.textContent = score;
        if (score > best) {
          best = score;
          bestEl.textContent = best;
        }
      }
    }
  }

  function isColliding(a, b) {
    const pad = 5;
    return (
      a.x + pad < b.x + b.width - pad &&
      a.x + a.width - pad > b.x + pad &&
      a.y + pad < b.y + b.height - pad &&
      a.y + a.height - pad > b.y + pad
    );
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    const gradient = ctx.createLinearGradient(0, 0, 0, H);
    gradient.addColorStop(0, "#111827");
    gradient.addColorStop(1, "#1F2937");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, W, H);

    // Subtle lanes
    ctx.strokeStyle = "rgba(255,255,255,.055)";
    ctx.lineWidth = 1;
    const laneGap = Math.max(70, W / 8);
    for (let x = laneGap; x < W; x += laneGap) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, H);
      ctx.stroke();
    }

    // Falling obstacles
    obstacles.forEach(o => {
      ctx.save();
      ctx.translate(o.x + o.width / 2, o.y + o.height / 2);
      ctx.rotate(o.rotation);
      ctx.fillStyle = "#EF5B5B";
      ctx.beginPath();
      ctx.roundRect(-o.width / 2, -o.height / 2, o.width, o.height, 8);
      ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,.22)";
      ctx.fillRect(-o.width * .22, -o.height * .22, o.width * .44, o.height * .12);
      ctx.restore();
    });

    // Player
    ctx.save();
    ctx.translate(player.x + player.width / 2, player.y + player.height / 2);
    ctx.fillStyle = "#16B8C4";
    ctx.beginPath();
    ctx.roundRect(-player.width / 2, -player.height / 2, player.width, player.height, 10);
    ctx.fill();
    ctx.fillStyle = "#FFFFFF";
    ctx.beginPath();
    ctx.arc(-player.width * .17, -player.height * .09, player.width * .07, 0, Math.PI * 2);
    ctx.arc(player.width * .17, -player.height * .09, player.width * .07, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#111827";
    ctx.beginPath();
    ctx.arc(-player.width * .17, -player.height * .09, player.width * .035, 0, Math.PI * 2);
    ctx.arc(player.width * .17, -player.height * .09, player.width * .035, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function loop(time) {
    if (state !== "playing") return;
    const dt = Math.min((time - lastTime) / 1000, 0.033);
    lastTime = time;
    update(dt);
    draw();
    if (state === "playing") animationId = requestAnimationFrame(loop);
  }

  function setDirection(button, down) {
    if (button === "left") leftHeld = down;
    if (button === "right") rightHeld = down;
  }

  function bindHold(el, direction) {
    el.addEventListener("pointerdown", e => {
      e.preventDefault();
      el.setPointerCapture?.(e.pointerId);
      setDirection(direction, true);
    });
    ["pointerup", "pointercancel", "pointerleave"].forEach(type => {
      el.addEventListener(type, () => setDirection(direction, false));
    });
  }

  document.addEventListener("keydown", e => {
    const key = e.key.toLowerCase();
    if (["arrowleft", "arrowright", "a", "d", "p", " "].includes(key)) e.preventDefault();

    if (key === "arrowleft" || key === "a") leftHeld = true;
    if (key === "arrowright" || key === "d") rightHeld = true;
    if (key === "p") pauseGame();

    if (key === " " && (state === "ready" || state === "gameover")) startGame();
    if (key === "enter" && (state === "ready" || state === "gameover")) startGame();
  });

  document.addEventListener("keyup", e => {
    const key = e.key.toLowerCase();
    if (key === "arrowleft" || key === "a") leftHeld = false;
    if (key === "arrowright" || key === "d") rightHeld = false;
  });

  startBtn.addEventListener("click", () => {
    if (state === "paused") pauseGame();
    else startGame();
  });
  restartBtn.addEventListener("click", startGame);
  pauseBtn.addEventListener("click", pauseGame);
  bindHold(leftBtn, "left");
  bindHold(rightBtn, "right");

  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();
  resetGame();
})();


}
function begin(){poster.hidden=true;gm.hidden=false;if(!booted){booted=true;var s=document.createElement("style");s.textContent=LOOK;document.head.appendChild(s);boot();}else{var r=document.getElementById("startBtn");if(r)r.click();}}
poster.addEventListener("click",begin);
var nb=document.getElementById("new");if(nb)nb.addEventListener("click",begin);
})();
