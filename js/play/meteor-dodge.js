/* Meteor Dodge - game logic + its own look. Layout lives in style.css; page shell lives in the HTML. */
(function(){"use strict";
var gm=document.getElementById("gm"),poster=document.getElementById("poster"),booted=false;
var LOOK=".gm{\n  --primary: #5b5ce2;\n  --primary-dark: #4546b8;\n  --secondary: #16b8c4;\n  --action: #ffb84d;\n  --success: #22c55e;\n  --danger: #ef5b5b;\n  --background: #f6f7fb;\n  \n  \n  \n  \n  --game: #111827;\n  --game-secondary: #1f2937;\n  \n}.gm *{ box-sizing: border-box; }.gm button{ font: inherit; }.gm button{ -webkit-tap-highlight-color: transparent; }.gm .sr-only{\n  position: absolute;\n  width: 1px;\n  height: 1px;\n  padding: 0;\n  margin: -1px;\n  overflow: hidden;\n  clip: rect(0, 0, 0, 0);\n  white-space: nowrap;\n  border: 0;\n}.gm .page-shell{\n  width: min(1160px, calc(100% - 40px));\n  margin-inline: auto;\n}.gm .all-games-link,.gm .section-heading > a{\n  color: var(--primary-dark);\n  font-weight: 700;\n  text-decoration: none;\n}.gm .all-games-link:hover,.gm .section-heading > a:hover{ text-decoration: underline; }.gm h2,.gm h3{ margin-top: 0; line-height: 1.15; }.gm h2{ font-size: clamp(27px, 3vw, 36px); font-weight: 700; }.gm h3{ font-size: 21px; font-weight: 700; }.gm .game-card{\n  padding: 22px;\n  background: var(--card);\n  border: 1px solid var(--border);\n  border-radius: 20px;\n  box-shadow: var(--shadow);\n}.gm .game-toolbar{\n  display: grid;\n  grid-template-columns: repeat(4, minmax(85px, 1fr)) auto;\n  align-items: center;\n  gap: 12px;\n  padding-bottom: 18px;\n}.gm .stat{\n  min-height: 56px;\n  padding: 6px 14px;\n  border-left: 3px solid var(--border);\n}.gm .stat:first-child{ border-color: var(--primary); }.gm .stat:nth-child(2){ border-color: var(--secondary); }.gm .stat:nth-child(3){ border-color: var(--action); }.gm .stat:nth-child(4){ border-color: var(--danger); }.gm .stat-label{\n  display: block;\n  color: var(--muted);\n  font-size: 13px;\n  font-weight: 700;\n  line-height: 1.2;\n  text-transform: uppercase;\n}.gm .stat strong{ font-size: 23px; line-height: 1.3; }.gm #lives{ color: var(--danger); font-size: 17px; letter-spacing: 2px; }.gm .toolbar-button{\n  min-height: 46px;\n  padding: 0 18px;\n  border: 1px solid var(--border);\n  border-radius: 12px;\n  color: var(--text);\n  background: #fff;\n  font-weight: 700;\n  cursor: pointer;\n}.gm .toolbar-button:hover:not(:disabled){ border-color: var(--primary); color: var(--primary-dark); }.gm .toolbar-button:disabled{ opacity: 0.45; cursor: not-allowed; }.gm .canvas-wrap{\n  position: relative;\n  width: 100%;\n  aspect-ratio: 900 / 520;\n  overflow: hidden;\n  border-radius: 17px;\n  background: var(--game);\n  touch-action: none;\n}.gm #game-canvas{\n  display: block;\n  width: 100%;\n  height: 100%;\n}.gm .game-overlay{\n  position: absolute;\n  inset: 0;\n  display: grid;\n  place-items: center;\n  padding: 20px;\n  color: #fff;\n  background: rgba(10, 17, 31, 0.74);\n  backdrop-filter: blur(4px);\n}.gm .game-overlay[hidden]{ display: none; }.gm .overlay-panel{ max-width: 450px; text-align: center; }.gm .overlay-icon{\n  width: 58px;\n  height: 58px;\n  margin: 0 auto 16px;\n  display: grid;\n  place-items: center;\n  border-radius: 18px;\n  color: #151b2d;\n  background: var(--action);\n  font-size: 28px;\n  transform: rotate(45deg);\n}.gm .overlay-icon::first-letter{ transform: rotate(-45deg); }.gm .overlay-panel h2{ margin-bottom: 10px; font-size: clamp(30px, 5vw, 44px); }.gm .overlay-panel > p{ margin: 0 auto 22px; color: #dbe4f3; }.gm .primary-button{\n  min-width: 160px;\n  min-height: 50px;\n  padding: 10px 24px;\n  border: 0;\n  border-radius: 13px;\n  color: #fff;\n  background: var(--primary);\n  box-shadow: 0 5px 0 var(--primary-dark);\n  font-weight: 800;\n  cursor: pointer;\n  transition: transform 150ms ease, box-shadow 150ms ease;\n}.gm .primary-button:hover{ transform: translateY(-2px); box-shadow: 0 7px 0 var(--primary-dark); }.gm .primary-button:active{ transform: translateY(3px); box-shadow: 0 2px 0 var(--primary-dark); }.gm .overlay-hint{ margin-top: 18px !important; margin-bottom: 0 !important; font-size: 14px; }.gm .mobile-controls{\n  display: none;\n  grid-template-columns: repeat(3, 58px);\n  grid-template-areas: \". up .\" \"left down right\";\n  justify-content: center;\n  gap: 8px;\n  padding: 18px 0 2px;\n}.gm .control-button{\n  width: 58px;\n  height: 52px;\n  border: 1px solid #d4d7e4;\n  border-radius: 13px;\n  color: var(--primary-dark);\n  background: #f1f2ff;\n  font-size: 24px;\n  font-weight: 800;\n  cursor: pointer;\n  user-select: none;\n  touch-action: none;\n}.gm .control-button:active,.gm .control-button.active{ color: #fff; background: var(--primary); }.gm .control-button.up{ grid-area: up; }.gm .control-button.left{ grid-area: left; }.gm .control-button.down{ grid-area: down; }.gm .control-button.right{ grid-area: right; }.gm .game-legend{\n  display: flex;\n  justify-content: center;\n  flex-wrap: wrap;\n  gap: 26px;\n  padding-top: 17px;\n  color: var(--muted);\n  font-size: 14px;\n  font-weight: 700;\n}.gm .game-legend span{ display: inline-flex; align-items: center; gap: 8px; }.gm .game-legend i{ display: inline-block; width: 15px; height: 15px; }.gm .legend-ship{ background: var(--secondary); clip-path: polygon(50% 0, 100% 100%, 50% 75%, 0 100%); }.gm .legend-meteor{ border-radius: 50%; background: #f47b55; box-shadow: inset -3px -3px 0 #a83d32; }.gm .legend-star{ color: var(--action); font-style: normal; font-size: 18px; line-height: 1; }.gm .steps{ margin: 24px 0 0; padding-left: 22px; }.gm .steps li{ padding-left: 7px; margin-bottom: 13px; }.gm .control-list{ margin: 0; }.gm .control-list div{\n  display: flex;\n  justify-content: space-between;\n  gap: 20px;\n  padding: 12px 0;\n  border-bottom: 1px solid var(--border);\n}.gm .control-list dt{ font-weight: 800; }.gm .control-list dd{ margin: 0; color: var(--muted); text-align: right; }.gm .tip-box{\n  margin-top: 22px;\n  padding: 17px;\n  border-radius: 13px;\n  border-left: 4px solid var(--action);\n  background: #fff8e8;\n}.gm .tip-box p{ margin: 3px 0 0; font-size: 15px; }.gm .tips-grid{\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 20px;\n  max-width: 1160px;\n}.gm .tips-grid > div{\n  padding: 24px;\n  border: 1px solid var(--border);\n  border-radius: 16px;\n  background: var(--card);\n}.gm .tips-grid span{ color: var(--primary); font-size: 14px; font-weight: 800; }.gm .tips-grid h3{ margin: 8px 0; }.gm .tips-grid p{ margin: 0; color: var(--muted); font-size: 16px; }.gm .section-heading{ display: flex; align-items: end; justify-content: space-between; gap: 25px; }.gm .section-heading h2{ margin: 6px 0 0; }.gm button:focus-visible,.gm summary:focus-visible{\n  outline: 3px solid rgba(91, 92, 226, 0.35);\n  outline-offset: 3px;\n}@media (max-width: 780px){.gm .page-shell{ width: min(100% - 24px, 1160px); }.gm .all-games-link{ font-size: 15px; }.gm .game-card{ padding: 12px; border-radius: 17px; }.gm .game-toolbar{ grid-template-columns: repeat(4, 1fr); gap: 5px; }.gm .stat{ min-width: 0; min-height: 51px; padding: 5px 7px; }.gm .stat strong{ font-size: 19px; }.gm #lives{ font-size: 12px; letter-spacing: 0; }.gm .toolbar-button{ grid-column: 1 / -1; width: 100%; min-height: 44px; margin-top: 4px; }.gm .canvas-wrap{ aspect-ratio: 4 / 5; min-height: 420px; max-height: 620px; }.gm .overlay-panel h2{ font-size: 34px; }.gm .overlay-hint{ display: none; }.gm .mobile-controls{ display: grid; }.gm .game-legend{ gap: 12px 18px; }.gm .tips-grid{ grid-template-columns: 1fr; }.gm .section-heading{ align-items: start; }}@media (max-width: 390px){.gm .all-games-link{ font-size: 14px; }.gm .game-toolbar{ grid-template-columns: repeat(2, 1fr); }.gm .toolbar-button{ grid-column: 1 / -1; }.gm .canvas-wrap{ min-height: 390px; }}@media (prefers-reduced-motion: reduce){.gm *,.gm *::before,.gm *::after{ transition-duration: 0.01ms !important; }}";
function __ready(f){f()}
function boot(){
"use strict";

(() => {
  const canvas = document.getElementById("game-canvas");
  const ctx = canvas.getContext("2d");
  const canvasWrap = document.getElementById("canvas-wrap");
  const scoreEl = document.getElementById("score");
  const bestScoreEl = document.getElementById("best-score");
  const levelEl = document.getElementById("level");
  const livesEl = document.getElementById("lives");
  const pauseButton = document.getElementById("pause-button");
  const overlay = document.getElementById("game-overlay");
  const overlayIcon = document.getElementById("overlay-icon");
  const overlayTitle = document.getElementById("overlay-title");
  const overlayMessage = document.getElementById("overlay-message");
  const primaryButton = document.getElementById("primary-button");
  const announcer = document.getElementById("status-announcer");
  const controlButtons = [...document.querySelectorAll(".control-button")];

  const WORLD = { width: 900, height: 520 };
  const keys = { left: false, right: false, up: false, down: false };
  const starPoints = 100;
  const nearMissPoints = 35;
  let state = "ready";
  let score = 0;
  let bestScore = readBestScore();
  let level = 1;
  let lives = 3;
  let elapsed = 0;
  let spawnTimer = 0;
  let starTimer = 0;
  let lastTime = 0;
  let animationId = 0;
  let meteors = [];
  let stars = [];
  let particles = [];
  let touchTarget = null;
  let touchPointerId = null;

  const player = {
    x: WORLD.width / 2,
    y: WORLD.height - 72,
    radius: 18,
    speed: 330,
    invulnerable: 0
  };

  bestScoreEl.textContent = bestScore.toLocaleString();
  resizeCanvas();
  drawScene();

  function readBestScore() {
    try {
      const saved = Number.parseInt(localStorage.getItem("avoidanceMeteorBest"), 10);
      return Number.isFinite(saved) && saved > 0 ? saved : 0;
    } catch {
      return 0;
    }
  }

  function saveBestScore() {
    try {
      localStorage.setItem("avoidanceMeteorBest", String(bestScore));
    } catch {
      // The game remains fully playable when browser storage is unavailable.
    }
  }

  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.max(1, Math.round(rect.width * dpr));
    canvas.height = Math.max(1, Math.round(rect.height * dpr));
    ctx.setTransform(canvas.width / WORLD.width, 0, 0, canvas.height / WORLD.height, 0, 0);
    if (state !== "running") drawScene();
  }

  function resetGame() {
    score = 0;
    level = 1;
    lives = 3;
    elapsed = 0;
    spawnTimer = 0.45;
    starTimer = 3.5;
    meteors = [];
    stars = [];
    particles = [];
    player.x = WORLD.width / 2;
    player.y = WORLD.height - 72;
    player.invulnerable = 0;
    clearInputs();
    updateHud();
  }

  function startGame() {
    cancelAnimationFrame(animationId);
    resetGame();
    state = "running";
    overlay.hidden = true;
    pauseButton.disabled = false;
    pauseButton.innerHTML = '<span aria-hidden="true">Ⅱ</span> Pause';
    pauseButton.setAttribute("aria-label", "Pause game");
    announcer.textContent = "Game started";
    lastTime = performance.now();
    animationId = requestAnimationFrame(loop);
  }

  function loop(now) {
    if (state !== "running") return;
    const delta = Math.min((now - lastTime) / 1000, 0.034);
    lastTime = now;
    update(delta);
    drawScene();
    animationId = requestAnimationFrame(loop);
  }

  function update(delta) {
    elapsed += delta;
    level = Math.min(12, Math.floor(elapsed / 13) + 1);
    score += delta * (10 + level * 1.4);
    player.invulnerable = Math.max(0, player.invulnerable - delta);

    let dx = Number(keys.right) - Number(keys.left);
    let dy = Number(keys.down) - Number(keys.up);
    if (dx !== 0 && dy !== 0) {
      dx *= Math.SQRT1_2;
      dy *= Math.SQRT1_2;
    }
    if (touchTarget) {
      const targetDx = touchTarget.x - player.x;
      const targetDy = touchTarget.y - player.y;
      const distance = Math.hypot(targetDx, targetDy);
      if (distance > 4) {
        dx = targetDx / distance;
        dy = targetDy / distance;
      }
    }
    player.x = clamp(player.x + dx * player.speed * delta, player.radius + 5, WORLD.width - player.radius - 5);
    player.y = clamp(player.y + dy * player.speed * delta, player.radius + 5, WORLD.height - player.radius - 5);

    spawnTimer -= delta;
    if (spawnTimer <= 0) {
      spawnMeteor();
      const baseInterval = Math.max(0.23, 0.78 - level * 0.045);
      spawnTimer = baseInterval * (0.78 + Math.random() * 0.44);
    }

    starTimer -= delta;
    if (starTimer <= 0 && stars.length === 0) {
      spawnStar();
      starTimer = 5 + Math.random() * 4;
    }

    const meteorSpeedBoost = (level - 1) * 18;
    for (let i = meteors.length - 1; i >= 0; i -= 1) {
      const meteor = meteors[i];
      meteor.y += (meteor.speed + meteorSpeedBoost) * delta;
      meteor.x += Math.sin(elapsed * meteor.wobble + meteor.phase) * meteor.drift * delta;
      meteor.rotation += meteor.spin * delta;

      const distance = Math.hypot(player.x - meteor.x, player.y - meteor.y);
      if (distance < player.radius + meteor.radius - 3 && player.invulnerable <= 0) {
        hitPlayer(meteor);
        meteors.splice(i, 1);
        continue;
      }
      if (!meteor.nearMissed && meteor.y > player.y + meteor.radius && distance < player.radius + meteor.radius + 42) {
        meteor.nearMissed = true;
        score += nearMissPoints;
        burst(player.x, player.y, "#16b8c4", 7);
      }
      if (meteor.y - meteor.radius > WORLD.height + 10 || meteor.x < -80 || meteor.x > WORLD.width + 80) {
        meteors.splice(i, 1);
      }
    }

    for (let i = stars.length - 1; i >= 0; i -= 1) {
      const star = stars[i];
      star.y += star.speed * delta;
      star.rotation += delta * 2.5;
      if (Math.hypot(player.x - star.x, player.y - star.y) < player.radius + star.radius) {
        score += starPoints;
        burst(star.x, star.y, "#ffcf5c", 14);
        stars.splice(i, 1);
        announcer.textContent = "Star collected. 100 bonus points.";
      } else if (star.y - star.radius > WORLD.height) {
        stars.splice(i, 1);
      }
    }

    for (let i = particles.length - 1; i >= 0; i -= 1) {
      const particle = particles[i];
      particle.x += particle.vx * delta;
      particle.y += particle.vy * delta;
      particle.life -= delta;
      particle.vx *= 0.98;
      particle.vy *= 0.98;
      if (particle.life <= 0) particles.splice(i, 1);
    }
    updateHud();
  }

  function spawnMeteor() {
    const radius = 15 + Math.random() * 18;
    meteors.push({
      x: radius + Math.random() * (WORLD.width - radius * 2),
      y: -radius - 8,
      radius,
      speed: 135 + Math.random() * 105,
      drift: 8 + Math.random() * 28,
      wobble: 1.1 + Math.random() * 1.8,
      phase: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 2.8,
      rotation: Math.random() * Math.PI,
      craters: makeCraters(radius),
      nearMissed: false
    });
  }

  function makeCraters(radius) {
    return Array.from({ length: radius > 24 ? 3 : 2 }, () => ({
      x: (Math.random() - 0.5) * radius,
      y: (Math.random() - 0.5) * radius,
      r: Math.max(2.5, radius * (0.1 + Math.random() * 0.1))
    }));
  }

  function spawnStar() {
    stars.push({
      x: 45 + Math.random() * (WORLD.width - 90),
      y: -25,
      radius: 14,
      speed: 105 + level * 5,
      rotation: 0
    });
  }

  function hitPlayer(meteor) {
    lives -= 1;
    player.invulnerable = 1.65;
    burst(meteor.x, meteor.y, "#ef5b5b", 18);
    updateHud();
    if (navigator.vibrate) navigator.vibrate(80);
    announcer.textContent = lives > 0 ? `Collision. ${lives} ${lives === 1 ? "life" : "lives"} remaining.` : "Game over.";
    if (lives <= 0) endGame();
  }

  function endGame() {
    state = "gameover";
    cancelAnimationFrame(animationId);
    const finalScore = Math.floor(score);
    const isNewBest = finalScore > bestScore;
    if (isNewBest) {
      bestScore = finalScore;
      saveBestScore();
    }
    updateHud();
    overlayIcon.textContent = isNewBest ? "★" : "◆";
    overlayTitle.textContent = isNewBest ? "New Best Score!" : "Game Over";
    overlayMessage.textContent = `You scored ${finalScore.toLocaleString()} points and reached level ${level}.`;
    primaryButton.textContent = "Play Again";
    overlay.hidden = false;
    pauseButton.disabled = true;
    primaryButton.focus();
  }

  function togglePause() {
    if (state === "running") {
      state = "paused";
      cancelAnimationFrame(animationId);
      clearInputs();
      overlayIcon.textContent = "Ⅱ";
      overlayTitle.textContent = "Game Paused";
      overlayMessage.textContent = "Take a break. Your score and position are safe.";
      primaryButton.textContent = "Resume Game";
      overlay.hidden = false;
      pauseButton.innerHTML = '<span aria-hidden="true">▶</span> Resume';
      pauseButton.setAttribute("aria-label", "Resume game");
      announcer.textContent = "Game paused";
    } else if (state === "paused") {
      resumeGame();
    }
  }

  function resumeGame() {
    state = "running";
    overlay.hidden = true;
    pauseButton.innerHTML = '<span aria-hidden="true">Ⅱ</span> Pause';
    pauseButton.setAttribute("aria-label", "Pause game");
    announcer.textContent = "Game resumed";
    lastTime = performance.now();
    animationId = requestAnimationFrame(loop);
  }

  function updateHud() {
    const displayScore = Math.floor(score);
    scoreEl.textContent = displayScore.toLocaleString();
    bestScoreEl.textContent = Math.max(bestScore, displayScore).toLocaleString();
    levelEl.textContent = String(level);
    livesEl.textContent = Array.from({ length: 3 }, (_, index) => index < lives ? "●" : "○").join(" ");
    livesEl.setAttribute("aria-label", `${lives} ${lives === 1 ? "life" : "lives"} remaining`);
  }

  function drawScene() {
    ctx.clearRect(0, 0, WORLD.width, WORLD.height);
    const gradient = ctx.createLinearGradient(0, 0, 0, WORLD.height);
    gradient.addColorStop(0, "#111827");
    gradient.addColorStop(1, "#17233a");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, WORLD.width, WORLD.height);
    drawBackgroundStars();
    stars.forEach(drawCollectible);
    meteors.forEach(drawMeteor);
    particles.forEach(drawParticle);
    drawPlayer();
  }

  function drawBackgroundStars() {
    const timeOffset = state === "running" ? elapsed * 8 : 0;
    ctx.fillStyle = "rgba(219, 230, 255, 0.48)";
    for (let i = 0; i < 44; i += 1) {
      const x = (i * 193 + 37) % WORLD.width;
      const y = (i * 97 + timeOffset) % WORLD.height;
      const size = i % 7 === 0 ? 1.8 : 1;
      ctx.fillRect(x, y, size, size);
    }
    ctx.strokeStyle = "rgba(91, 92, 226, 0.13)";
    ctx.lineWidth = 1;
    for (let y = 65; y < WORLD.height; y += 65) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(WORLD.width, y);
      ctx.stroke();
    }
  }

  function drawPlayer() {
    if (player.invulnerable > 0 && Math.floor(player.invulnerable * 10) % 2 === 0) return;
    ctx.save();
    ctx.translate(player.x, player.y);
    ctx.shadowColor = "rgba(22, 184, 196, 0.65)";
    ctx.shadowBlur = 16;
    ctx.fillStyle = "#42d4de";
    ctx.beginPath();
    ctx.moveTo(0, -23);
    ctx.lineTo(19, 19);
    ctx.lineTo(0, 12);
    ctx.lineTo(-19, 19);
    ctx.closePath();
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle = "#eefcff";
    ctx.beginPath();
    ctx.moveTo(0, -12);
    ctx.lineTo(7, 7);
    ctx.lineTo(-7, 7);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#ffb84d";
    ctx.beginPath();
    ctx.moveTo(-6, 17);
    ctx.lineTo(0, 30 + Math.random() * 4);
    ctx.lineTo(6, 17);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  function drawMeteor(meteor) {
    ctx.save();
    ctx.translate(meteor.x, meteor.y);
    ctx.rotate(meteor.rotation);
    ctx.shadowColor = "rgba(239, 91, 91, 0.28)";
    ctx.shadowBlur = 12;
    ctx.fillStyle = "#d7654d";
    ctx.beginPath();
    const points = 10;
    for (let i = 0; i < points; i += 1) {
      const angle = (i / points) * Math.PI * 2;
      const roughRadius = meteor.radius * (0.87 + ((i * 7) % 4) * 0.045);
      const x = Math.cos(angle) * roughRadius;
      const y = Math.sin(angle) * roughRadius;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle = "#9f4139";
    meteor.craters.forEach(crater => {
      ctx.beginPath();
      ctx.arc(crater.x, crater.y, crater.r, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();
  }

  function drawCollectible(star) {
    ctx.save();
    ctx.translate(star.x, star.y);
    ctx.rotate(star.rotation);
    ctx.shadowColor = "#ffcf5c";
    ctx.shadowBlur = 14;
    ctx.fillStyle = "#ffcf5c";
    drawStarPath(0, 0, 5, star.radius, star.radius * 0.46);
    ctx.fill();
    ctx.restore();
  }

  function drawStarPath(x, y, points, outerRadius, innerRadius) {
    ctx.beginPath();
    for (let i = 0; i < points * 2; i += 1) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const angle = -Math.PI / 2 + (i * Math.PI) / points;
      const px = x + Math.cos(angle) * radius;
      const py = y + Math.sin(angle) * radius;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
  }

  function burst(x, y, color, count) {
    for (let i = 0; i < count; i += 1) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 45 + Math.random() * 115;
      particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color,
        radius: 2 + Math.random() * 3,
        life: 0.35 + Math.random() * 0.45,
        maxLife: 0.8
      });
    }
  }

  function drawParticle(particle) {
    ctx.globalAlpha = Math.max(0, particle.life / particle.maxLife);
    ctx.fillStyle = particle.color;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  function setDirection(direction, active) {
    if (Object.hasOwn(keys, direction)) keys[direction] = active;
    if (active) touchTarget = null;
  }

  function clearInputs() {
    Object.keys(keys).forEach(key => { keys[key] = false; });
    touchTarget = null;
    controlButtons.forEach(button => button.classList.remove("active"));
  }

  function pointerToWorld(event) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) / rect.width) * WORLD.width,
      y: ((event.clientY - rect.top) / rect.height) * WORLD.height
    };
  }

  function handleKey(event, active) {
    const mapping = {
      ArrowLeft: "left", a: "left", A: "left",
      ArrowRight: "right", d: "right", D: "right",
      ArrowUp: "up", w: "up", W: "up",
      ArrowDown: "down", s: "down", S: "down"
    };
    const direction = mapping[event.key];
    if (direction) {
      event.preventDefault();
      setDirection(direction, active);
    }
    if (active && (event.key === "p" || event.key === "P") && (state === "running" || state === "paused")) {
      event.preventDefault();
      togglePause();
    }
    if (active && (event.key === "Enter" || event.key === " ") && !overlay.hidden) {
      event.preventDefault();
      if (state === "paused") resumeGame();
      else startGame();
    }
  }

  primaryButton.addEventListener("click", () => {
    if (state === "paused") resumeGame();
    else startGame();
  });
  pauseButton.addEventListener("click", togglePause);
  window.addEventListener("keydown", event => handleKey(event, true), { passive: false });
  window.addEventListener("keyup", event => handleKey(event, false), { passive: false });
  window.addEventListener("blur", () => {
    if (state === "running") togglePause();
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden && state === "running") togglePause();
  });
  window.addEventListener("resize", resizeCanvas);

  canvas.addEventListener("pointerdown", event => {
    if (state !== "running") return;
    touchPointerId = event.pointerId;
    canvas.setPointerCapture(event.pointerId);
    touchTarget = pointerToWorld(event);
  });
  canvas.addEventListener("pointermove", event => {
    if (state === "running" && event.pointerId === touchPointerId) touchTarget = pointerToWorld(event);
  });
  canvas.addEventListener("pointerup", event => {
    if (event.pointerId === touchPointerId) {
      touchPointerId = null;
      touchTarget = null;
    }
  });
  canvas.addEventListener("pointercancel", () => {
    touchPointerId = null;
    touchTarget = null;
  });

  controlButtons.forEach(button => {
    const direction = button.dataset.direction;
    const press = event => {
      event.preventDefault();
      button.setPointerCapture?.(event.pointerId);
      button.classList.add("active");
      setDirection(direction, true);
    };
    const release = event => {
      event.preventDefault();
      button.classList.remove("active");
      setDirection(direction, false);
    };
    button.addEventListener("pointerdown", press);
    button.addEventListener("pointerup", release);
    button.addEventListener("pointercancel", release);
    button.addEventListener("pointerleave", event => {
      if (event.buttons === 1) release(event);
    });
  });

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }
})();


}
function begin(){poster.hidden=true;gm.hidden=false;if(!booted){booted=true;var s=document.createElement("style");s.textContent=LOOK;document.head.appendChild(s);boot();}else{var r=document.getElementById("primary-button");if(r)r.click();}}
poster.addEventListener("click",begin);
var nb=document.getElementById("new");if(nb)nb.addEventListener("click",begin);
})();
