/* Endless Runner - game logic + its own look. Layout lives in style.css; page shell lives in the HTML. */
(function(){"use strict";
var gm=document.getElementById("gm"),poster=document.getElementById("poster"),booted=false;
var LOOK=".gm{\n  --primary: #5b5ce2;\n  --primary-dark: #4546b8;\n  --secondary: #16b8c4;\n  --action: #ffb84d;\n  --danger: #ef5b5b;\n  --background: #f6f7fb;\n  \n  \n  \n  \n  \n}.gm *{ box-sizing: border-box; }.gm button{ font: inherit; }.gm button{ -webkit-tap-highlight-color: transparent; }.gm .all-games-link{ font-weight: 700; text-decoration: none; }.gm h2,.gm h3{ margin-top: 0; line-height: 1.14; }.gm h2{ margin-bottom: 18px; font-size: clamp(27px, 3vw, 35px); font-weight: 700; letter-spacing: -0.02em; }.gm .game-section{ margin-bottom: 76px; }.gm .scorebar{\n  position: relative;\n  z-index: 2;\n  display: flex;\n  align-items: center;\n  gap: 14px;\n  width: min(720px, calc(100% - 32px));\n  margin: 0 auto -22px;\n  padding: 14px 18px;\n  border: 1px solid var(--border);\n  border-radius: 16px;\n  background: var(--card);\n  box-shadow: 0 10px 28px rgba(30, 35, 90, 0.12);\n}.gm .stat{ min-width: 78px; padding-right: 14px; border-right: 1px solid var(--border); }.gm .stat span{ display: block; color: var(--muted); font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; }.gm .stat strong{ display: block; font-size: 23px; line-height: 1.2; }.gm .icon-button{ margin-left: auto; display: inline-flex; min-height: 44px; align-items: center; gap: 8px; padding: 0 16px; border: 1px solid var(--border); border-radius: 11px; color: var(--text); background: #fff; font-weight: 700; cursor: pointer; }.gm .icon-button:disabled{ opacity: 0.5; cursor: not-allowed; }.gm .game-shell{\n  position: relative;\n  overflow: hidden;\n  width: 100%;\n  aspect-ratio: 9 / 4;\n  min-height: 300px;\n  max-height: 510px;\n  border: 8px solid #fff;\n  border-radius: 22px;\n  background: #18213b;\n  box-shadow: var(--shadow);\n  touch-action: manipulation;\n}.gm #game-canvas{ display: block; width: 100%; height: 100%; }.gm .game-overlay{ position: absolute; inset: 0; display: grid; place-items: center; padding: 24px; background: rgba(16, 24, 50, 0.48); backdrop-filter: blur(3px); }.gm .game-overlay[hidden]{ display: none; }.gm .overlay-card{ width: min(440px, 100%); padding: 28px; border-radius: 18px; text-align: center; background: rgba(255, 255, 255, 0.96); box-shadow: 0 18px 42px rgba(15, 20, 45, 0.2); }.gm .overlay-card h2{ margin-bottom: 10px; font-size: clamp(28px, 4vw, 38px); }.gm .overlay-card p{ margin-top: 0; color: var(--muted); }.gm .overlay-card .eyebrow{ margin-bottom: 6px; color: var(--primary-dark); font-size: 14px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; }.gm .primary-button{ min-height: 48px; padding: 0 26px; border: 0; border-radius: 12px; color: #fff; background: var(--primary); font-size: 17px; font-weight: 800; cursor: pointer; box-shadow: 0 8px 20px rgba(91, 92, 226, 0.3); transition: transform 150ms ease, background 150ms ease; }.gm .primary-button:hover{ background: var(--primary-dark); transform: translateY(-1px); }.gm .shortcut-hint{ margin: 12px 0 0 !important; font-size: 14px; }.gm .mobile-controls{ display: flex; justify-content: center; margin-top: 18px; }.gm .control-button{ display: inline-flex; min-width: 190px; min-height: 56px; align-items: center; justify-content: center; gap: 10px; border: 0; border-radius: 14px; color: var(--text); background: var(--action); font-size: 17px; font-weight: 800; cursor: pointer; box-shadow: 0 7px 0 #d98d1d; touch-action: manipulation; }.gm .control-button:active,.gm .control-button.is-pressed{ transform: translateY(5px); box-shadow: 0 2px 0 #d98d1d; }.gm .control-icon{ font-size: 25px; line-height: 1; }.gm .game-status{ min-height: 26px; margin: 18px 0 0; color: var(--muted); text-align: center; font-size: 15px; }.gm .wide-card{ padding: 28px; border: 1px solid var(--border); border-radius: 18px; background: var(--card); }.gm .wide-card p:last-child{ margin-bottom: 0; }.gm .wide-card{ margin-top: 22px; }.gm .steps{ margin: 22px 0 0; padding-left: 24px; }.gm .steps li + li{ margin-top: 10px; }.gm .control-row{ display: flex; flex-wrap: wrap; align-items: center; gap: 8px; padding: 12px 0; border-bottom: 1px solid var(--border); }.gm .control-row span{ margin-right: auto; font-weight: 700; }.gm kbd{ min-width: 34px; padding: 4px 9px; border: 1px solid #cfd3df; border-bottom-width: 3px; border-radius: 7px; color: var(--text); background: #f8f9fc; font-family: inherit; font-size: 14px; font-weight: 800; text-align: center; }.gm .tip-list{ display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px 32px; margin-bottom: 0; padding-left: 22px; }.gm button:focus-visible,.gm summary:focus-visible{ outline: 3px solid rgba(22, 184, 196, 0.55); outline-offset: 3px; }@media (max-width: 760px){.gm .scorebar{ width: calc(100% - 16px); gap: 8px; padding: 11px 12px; }.gm .stat{ min-width: 54px; padding-right: 8px; }.gm .stat span{ font-size: 11px; }.gm .stat strong{ font-size: 20px; }.gm .button-label{ display: none; }.gm .icon-button{ min-width: 44px; justify-content: center; padding: 0 10px; }.gm .game-shell{ min-height: 280px; aspect-ratio: 4 / 5; border-width: 5px; border-radius: 18px; }.gm .game-overlay{ padding: 16px; }.gm .overlay-card{ padding: 22px 18px; }.gm .shortcut-hint{ display: none; }.gm .tip-list{ grid-template-columns: 1fr; }.gm .wide-card{ padding: 22px 18px; }.gm .game-section{ margin-bottom: 58px; }}@media (prefers-reduced-motion: reduce){.gm *,.gm *::before,.gm *::after{ scroll-behavior: auto !important; transition-duration: 0.01ms !important; }}";
function __ready(f){f()}
function boot(){
"use strict";

(() => {
  const canvas = document.getElementById("game-canvas");
  const ctx = canvas.getContext("2d");
  const overlay = document.getElementById("game-overlay");
  const overlayEyebrow = document.getElementById("overlay-eyebrow");
  const overlayTitle = document.getElementById("overlay-title");
  const overlayMessage = document.getElementById("overlay-message");
  const startButton = document.getElementById("start-button");
  const jumpButton = document.getElementById("jump-button");
  const pauseButton = document.getElementById("pause-button");
  const scoreElement = document.getElementById("score");
  const coinsElement = document.getElementById("coins");
  const bestScoreElement = document.getElementById("best-score");
  const statusElement = document.getElementById("game-status");

  const game = {
    state: "ready",
    width: 900,
    height: 400,
    groundY: 320,
    speed: 340,
    distance: 0,
    score: 0,
    coins: 0,
    lastTime: 0,
    obstacleTimer: 0,
    nextObstacle: 1.15,
    coinTimer: 0,
    nextCoin: 1.35,
    sceneryOffset: 0,
    obstacles: [],
    coinItems: [],
    particles: [],
    best: readBestScore()
  };

  const runner = {
    x: 110,
    y: 0,
    width: 42,
    height: 58,
    velocityY: 0,
    jumpsUsed: 0,
    runPhase: 0
  };

  function readBestScore() {
    try { return Number(localStorage.getItem("endlessRunnerBest")) || 0; }
    catch (error) { return 0; }
  }

  function saveBestScore() {
    try { localStorage.setItem("endlessRunnerBest", String(game.best)); }
    catch (error) { /* The game remains playable if storage is unavailable. */ }
  }

  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    game.width = Math.max(280, rect.width);
    game.height = Math.max(260, rect.height);
    game.groundY = game.height * (game.width < 560 ? 0.78 : 0.8);
    canvas.width = Math.round(game.width * dpr);
    canvas.height = Math.round(game.height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    runner.x = Math.max(54, game.width * 0.12);
    if (game.state !== "running" || runner.y + runner.height > game.groundY) {
      runner.y = game.groundY - runner.height;
    }
    draw();
  }

  function resetGame() {
    game.speed = game.width < 560 ? 270 : 340;
    game.distance = 0;
    game.score = 0;
    game.coins = 0;
    game.obstacleTimer = 0;
    game.nextObstacle = 1.05;
    game.coinTimer = 0;
    game.nextCoin = 1.25;
    game.sceneryOffset = 0;
    game.obstacles.length = 0;
    game.coinItems.length = 0;
    game.particles.length = 0;
    runner.y = game.groundY - runner.height;
    runner.velocityY = 0;
    runner.jumpsUsed = 0;
    runner.runPhase = 0;
    updateScoreboard();
  }

  function startGame() {
    resetGame();
    game.state = "running";
    game.lastTime = performance.now();
    overlay.hidden = true;
    pauseButton.disabled = false;
    pauseButton.setAttribute("aria-label", "Pause game");
    pauseButton.querySelector("[aria-hidden]").textContent = "Ⅱ";
    statusElement.textContent = "Run started.";
    requestAnimationFrame(loop);
  }

  function endGame() {
    game.state = "gameover";
    pauseButton.disabled = true;
    if (game.score > game.best) {
      game.best = game.score;
      saveBestScore();
    }
    updateScoreboard();
    overlayEyebrow.textContent = game.score === game.best && game.score > 0 ? "New best score!" : "Run over";
    overlayTitle.textContent = `Score: ${game.score}`;
    overlayMessage.textContent = `You collected ${game.coins} ${game.coins === 1 ? "coin" : "coins"}. Ready to try again?`;
    startButton.textContent = "Run Again";
    overlay.hidden = false;
    statusElement.textContent = `Game over. Final score ${game.score}.`;
  }

  function togglePause() {
    if (game.state === "running") {
      game.state = "paused";
      overlayEyebrow.textContent = "Take a breather";
      overlayTitle.textContent = "Game Paused";
      overlayMessage.textContent = "Your run is waiting. Resume when you are ready.";
      startButton.textContent = "Resume Run";
      overlay.hidden = false;
      pauseButton.setAttribute("aria-label", "Resume game");
      pauseButton.querySelector("[aria-hidden]").textContent = "▶";
      statusElement.textContent = "Game paused.";
    } else if (game.state === "paused") {
      game.state = "running";
      game.lastTime = performance.now();
      overlay.hidden = true;
      pauseButton.setAttribute("aria-label", "Pause game");
      pauseButton.querySelector("[aria-hidden]").textContent = "Ⅱ";
      statusElement.textContent = "Game resumed.";
      requestAnimationFrame(loop);
    }
  }

  function jump() {
    if (game.state === "ready" || game.state === "gameover") {
      startGame();
      runner.velocityY = -Math.max(610, game.height * 1.58);
      runner.jumpsUsed = 1;
      return;
    }
    if (game.state !== "running" || runner.jumpsUsed >= 2) return;
    runner.velocityY = -Math.max(570, game.height * 1.48);
    runner.jumpsUsed += 1;
    spawnDust(runner.x + runner.width / 2, runner.y + runner.height, "#f4d6a0", 5);
  }

  function spawnObstacle() {
    const scale = game.width < 560 ? 0.86 : 1;
    const tall = Math.random() > 0.62;
    const width = (tall ? 38 : 48 + Math.random() * 18) * scale;
    const height = (tall ? 72 + Math.random() * 18 : 42 + Math.random() * 18) * scale;
    game.obstacles.push({ x: game.width + 30, y: game.groundY - height, width, height, tall });
    game.nextObstacle = Math.max(0.72, 1.2 + Math.random() * 0.78 - (game.speed - 340) / 950);
  }

  function spawnCoinGroup() {
    const count = 2 + Math.floor(Math.random() * 3);
    const baseY = game.groundY - (82 + Math.random() * Math.min(100, game.height * 0.22));
    for (let i = 0; i < count; i += 1) {
      game.coinItems.push({ x: game.width + 30 + i * 44, y: baseY - Math.sin((i / Math.max(1, count - 1)) * Math.PI) * 28, radius: 12, spin: Math.random() * Math.PI });
    }
    game.nextCoin = 1.5 + Math.random() * 1.7;
  }

  function spawnDust(x, y, color, count) {
    for (let i = 0; i < count; i += 1) {
      game.particles.push({ x, y, vx: -30 - Math.random() * 90, vy: -20 - Math.random() * 55, life: 0.45 + Math.random() * 0.25, maxLife: 0.7, color });
    }
  }

  function update(dt) {
    game.speed = Math.min(690, game.speed + dt * 6.2);
    game.distance += game.speed * dt;
    game.score = Math.floor(game.distance / 18) + game.coins * 25;
    game.sceneryOffset = (game.sceneryOffset + game.speed * dt) % 1600;
    runner.runPhase += dt * (game.speed / 35);

    const gravity = Math.max(1700, game.height * 4.4);
    runner.velocityY += gravity * dt;
    runner.y += runner.velocityY * dt;
    if (runner.y + runner.height >= game.groundY) {
      if (runner.velocityY > 340) spawnDust(runner.x + runner.width / 2, game.groundY, "#f4d6a0", 6);
      runner.y = game.groundY - runner.height;
      runner.velocityY = 0;
      runner.jumpsUsed = 0;
    }

    game.obstacleTimer += dt;
    if (game.obstacleTimer >= game.nextObstacle) {
      game.obstacleTimer = 0;
      spawnObstacle();
    }
    game.coinTimer += dt;
    if (game.coinTimer >= game.nextCoin) {
      game.coinTimer = 0;
      spawnCoinGroup();
    }

    for (const obstacle of game.obstacles) obstacle.x -= game.speed * dt;
    for (const coin of game.coinItems) { coin.x -= game.speed * dt; coin.spin += dt * 9; }
    game.obstacles = game.obstacles.filter((item) => item.x + item.width > -30);
    game.coinItems = game.coinItems.filter((item) => item.x + item.radius > -30 && !item.collected);

    for (const particle of game.particles) {
      particle.x += particle.vx * dt;
      particle.y += particle.vy * dt;
      particle.vy += 220 * dt;
      particle.life -= dt;
    }
    game.particles = game.particles.filter((particle) => particle.life > 0);

    const runnerHitbox = { x: runner.x + 7, y: runner.y + 5, width: runner.width - 14, height: runner.height - 7 };
    for (const obstacle of game.obstacles) {
      const hitbox = { x: obstacle.x + 4, y: obstacle.y + 3, width: obstacle.width - 8, height: obstacle.height - 3 };
      if (rectsOverlap(runnerHitbox, hitbox)) { endGame(); return; }
    }

    for (const coin of game.coinItems) {
      const nearestX = Math.max(runnerHitbox.x, Math.min(coin.x, runnerHitbox.x + runnerHitbox.width));
      const nearestY = Math.max(runnerHitbox.y, Math.min(coin.y, runnerHitbox.y + runnerHitbox.height));
      if ((coin.x - nearestX) ** 2 + (coin.y - nearestY) ** 2 < coin.radius ** 2) {
        coin.collected = true;
        game.coins += 1;
        spawnDust(coin.x, coin.y, "#ffcf5c", 9);
      }
    }
    updateScoreboard();
  }

  function rectsOverlap(a, b) {
    return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
  }

  function updateScoreboard() {
    scoreElement.textContent = String(game.score);
    coinsElement.textContent = String(game.coins);
    bestScoreElement.textContent = String(game.best);
  }

  function roundedRect(x, y, width, height, radius) {
    const r = Math.min(radius, width / 2, height / 2);
    ctx.beginPath();
    ctx.roundRect(x, y, width, height, r);
  }

  function drawBackground() {
    const sky = ctx.createLinearGradient(0, 0, 0, game.height);
    sky.addColorStop(0, "#26366f");
    sky.addColorStop(0.57, "#f28b72");
    sky.addColorStop(1, "#f8c477");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, game.width, game.height);

    ctx.fillStyle = "rgba(255, 225, 155, 0.88)";
    ctx.beginPath();
    ctx.arc(game.width * 0.78, game.height * 0.25, Math.min(48, game.width * 0.08), 0, Math.PI * 2);
    ctx.fill();

    drawHills(0.12, game.groundY - 54, "#6c5d83", 85, 300);
    drawHills(0.26, game.groundY - 18, "#3f466f", 62, 225);

    ctx.fillStyle = "#202b45";
    ctx.fillRect(0, game.groundY, game.width, game.height - game.groundY);
    ctx.fillStyle = "#f3b65b";
    ctx.fillRect(0, game.groundY, game.width, 5);

    ctx.strokeStyle = "rgba(255,255,255,0.14)";
    ctx.lineWidth = 3;
    const roadOffset = -(game.sceneryOffset % 90);
    for (let x = roadOffset; x < game.width + 90; x += 90) {
      ctx.beginPath();
      ctx.moveTo(x, game.groundY + 48);
      ctx.lineTo(x + 45, game.groundY + 48);
      ctx.stroke();
    }
  }

  function drawHills(rate, baseY, color, height, spacing) {
    const offset = -((game.sceneryOffset * rate) % spacing);
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(0, game.groundY);
    for (let x = offset - spacing; x <= game.width + spacing; x += spacing) {
      ctx.lineTo(x, baseY);
      ctx.quadraticCurveTo(x + spacing * 0.5, baseY - height, x + spacing, baseY);
    }
    ctx.lineTo(game.width, game.groundY);
    ctx.closePath();
    ctx.fill();
  }

  function drawRunner() {
    const airborne = runner.y + runner.height < game.groundY - 1;
    const legSwing = airborne ? 1 : Math.sin(runner.runPhase) * 7;
    ctx.save();
    ctx.translate(runner.x, runner.y);

    ctx.strokeStyle = "#171b2d";
    ctx.lineWidth = 8;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(19, 43);
    ctx.lineTo(13 - legSwing, 56);
    ctx.moveTo(25, 43);
    ctx.lineTo(31 + legSwing, 56);
    ctx.stroke();

    ctx.fillStyle = "#5b5ce2";
    roundedRect(8, 17, 31, 32, 10);
    ctx.fill();
    ctx.fillStyle = "#ffcf9d";
    ctx.beginPath();
    ctx.arc(25, 12, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#171b2d";
    ctx.beginPath();
    ctx.arc(28, 9, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#ffcf9d";
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.moveTo(10, 26);
    ctx.lineTo(-1 - legSwing * 0.45, 37);
    ctx.moveTo(37, 27);
    ctx.lineTo(45 + legSwing * 0.45, 18);
    ctx.stroke();

    ctx.restore();
  }

  function drawObstacle(obstacle) {
    ctx.save();
    ctx.fillStyle = obstacle.tall ? "#ef5b5b" : "#cc663f";
    roundedRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height, 6);
    ctx.fill();
    ctx.strokeStyle = "rgba(55,28,25,0.35)";
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.strokeStyle = "rgba(255,255,255,0.3)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(obstacle.x + 7, obstacle.y + 8);
    ctx.lineTo(obstacle.x + obstacle.width - 7, obstacle.y + obstacle.height - 8);
    ctx.moveTo(obstacle.x + obstacle.width - 7, obstacle.y + 8);
    ctx.lineTo(obstacle.x + 7, obstacle.y + obstacle.height - 8);
    ctx.stroke();
    ctx.restore();
  }

  function drawCoin(coin) {
    const horizontalScale = Math.max(0.28, Math.abs(Math.cos(coin.spin)));
    ctx.save();
    ctx.translate(coin.x, coin.y);
    ctx.scale(horizontalScale, 1);
    ctx.fillStyle = "#ffd45f";
    ctx.strokeStyle = "#c78120";
    ctx.lineWidth = 3 / horizontalScale;
    ctx.beginPath();
    ctx.arc(0, 0, coin.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  function drawParticles() {
    for (const particle of game.particles) {
      ctx.globalAlpha = Math.max(0, particle.life / particle.maxLife);
      ctx.fillStyle = particle.color;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, 3.5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  function draw() {
    ctx.clearRect(0, 0, game.width, game.height);
    drawBackground();
    for (const coin of game.coinItems) if (!coin.collected) drawCoin(coin);
    for (const obstacle of game.obstacles) drawObstacle(obstacle);
    drawParticles();
    drawRunner();
  }

  function loop(timestamp) {
    if (game.state !== "running") return;
    const dt = Math.min((timestamp - game.lastTime) / 1000, 0.033);
    game.lastTime = timestamp;
    update(dt);
    draw();
    if (game.state === "running") requestAnimationFrame(loop);
  }

  startButton.addEventListener("click", () => {
    if (game.state === "paused") togglePause();
    else startGame();
  });
  pauseButton.addEventListener("click", togglePause);
  jumpButton.addEventListener("pointerdown", (event) => { event.preventDefault(); jumpButton.classList.add("is-pressed"); jump(); });
  jumpButton.addEventListener("pointerup", () => jumpButton.classList.remove("is-pressed"));
  jumpButton.addEventListener("pointercancel", () => jumpButton.classList.remove("is-pressed"));
  canvas.addEventListener("pointerdown", (event) => { event.preventDefault(); jump(); });

  window.addEventListener("keydown", (event) => {
    if (["Space", "ArrowUp"].includes(event.code)) { event.preventDefault(); if (!event.repeat) jump(); }
    if (event.code === "KeyP" && !event.repeat && (game.state === "running" || game.state === "paused")) togglePause();
    if (event.code === "KeyR" && !event.repeat && game.state === "gameover") startGame();
  });
  document.addEventListener("visibilitychange", () => { if (document.hidden && game.state === "running") togglePause(); });
  window.addEventListener("resize", resizeCanvas);

  bestScoreElement.textContent = String(game.best);
  document.getElementById("current-year").textContent = String(new Date().getFullYear());
  resizeCanvas();
})();


}
function begin(){poster.hidden=true;gm.hidden=false;if(!booted){booted=true;var s=document.createElement("style");s.textContent=LOOK;document.head.appendChild(s);boot();}else{var r=document.getElementById("start-button");if(r)r.click();}}
poster.addEventListener("click",begin);
var nb=document.getElementById("new");if(nb)nb.addEventListener("click",begin);
})();
