/* Space Shooter - game logic + its own look. Layout lives in style.css; page shell lives in the HTML. */
(function(){"use strict";
var gm=document.getElementById("gm"),poster=document.getElementById("poster"),booted=false;
var LOOK=".gm{\n  --primary: #5b5ce2;\n  --primary-dark: #4546b8;\n  --accent: #16b8c4;\n  --action: #ffb84d;\n  --success: #22c55e;\n  --danger: #ef5b5b;\n  --background: #f6f7fb;\n  \n  \n  \n  \n  --space: #080e1d;\n  --space-secondary: #111a2f;\n  \n}.gm *{ box-sizing: border-box; }.gm button,.gm input{ font: inherit; }.gm .sr-only{\n  position: absolute;\n  width: 1px;\n  height: 1px;\n  padding: 0;\n  margin: -1px;\n  overflow: hidden;\n  clip: rect(0, 0, 0, 0);\n  white-space: nowrap;\n  border: 0;\n}.gm h2,.gm h3{ margin-top: 0; line-height: 1.12; }.gm h2{ margin-bottom: 16px; font-size: clamp(28px, 3vw, 36px); font-weight: 800; letter-spacing: -0.02em; }.gm h3{ margin-bottom: 9px; font-size: 22px; font-weight: 700; }.gm p{ margin-top: 0; }.gm .game-card{ position: relative; overflow: hidden; border: 1px solid var(--border); border-radius: 20px; background: var(--card); box-shadow: var(--shadow); }.gm .game-toolbar{ min-height: 76px; display: grid; grid-template-columns: repeat(4, minmax(78px, 1fr)) auto; align-items: center; gap: 18px; padding: 12px 20px; border-bottom: 1px solid var(--border); }.gm .stat{ display: flex; flex-direction: column; }.gm .stat span:first-child{ color: var(--muted); font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; }.gm .stat strong{ font-size: 23px; line-height: 1.2; font-variant-numeric: tabular-nums; }.gm .lives-stat strong{ color: var(--danger); letter-spacing: 2px; }.gm .toolbar-button,.gm .secondary-button,.gm .primary-button,.gm .move-button{ min-height: 46px; border: 0; border-radius: 12px; font-weight: 800; cursor: pointer; transition: transform 160ms ease, background-color 160ms ease, box-shadow 160ms ease; }.gm button:hover:not(:disabled){ transform: translateY(-1px); }.gm button:focus-visible,.gm summary:focus-visible{ outline: 3px solid rgba(91, 92, 226, 0.35); outline-offset: 3px; }.gm button:disabled{ cursor: not-allowed; opacity: 0.52; }.gm .toolbar-button{ min-width: 96px; padding: 0 18px; background: #edf0f6; color: var(--text); }.gm .game-stage{ position: relative; width: 100%; aspect-ratio: 16 / 10; max-height: 650px; overflow: hidden; background: var(--space); touch-action: none; user-select: none; }.gm #game-canvas{ display: block; width: 100%; height: 100%; }.gm .game-overlay{ position: absolute; inset: 0; display: grid; place-items: center; padding: 24px; background: rgba(5, 10, 24, 0.68); backdrop-filter: blur(3px); transition: opacity 180ms ease; }.gm .game-overlay[hidden]{ display: none; }.gm .overlay-panel{ width: min(480px, 100%); padding: 30px; border: 1px solid rgba(255,255,255,0.16); border-radius: 18px; background: rgba(17, 26, 47, 0.95); color: white; text-align: center; box-shadow: 0 24px 80px rgba(0,0,0,0.34); }.gm .overlay-panel h2{ margin-bottom: 10px; font-size: clamp(28px, 5vw, 40px); }.gm .overlay-panel p{ color: #bec9df; }.gm .overlay-kicker{ margin-bottom: 5px !important; color: #75e3eb !important; font-size: 13px; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; }.gm .primary-button{ min-width: 170px; padding: 0 24px; background: var(--action); color: #2b200a; box-shadow: 0 8px 22px rgba(255, 184, 77, 0.22); }.gm .overlay-hint{ margin: 14px 0 0; font-size: 14px; }.gm .game-footer{ min-height: 72px; display: flex; align-items: center; justify-content: space-between; gap: 20px; padding: 12px 20px; }.gm .game-footer p{ margin: 0; color: var(--muted); font-size: 15px; }.gm .secondary-button{ min-width: 112px; padding: 0 18px; background: var(--primary); color: white; }.gm .secondary-button:hover{ background: var(--primary-dark); }.gm .mobile-controls{ display: none; grid-template-columns: 58px 58px 58px; justify-content: center; gap: 8px; padding: 14px 20px 2px; background: white; }.gm .vertical-controls{ display: grid; gap: 8px; }.gm .move-button{ min-width: 58px; height: 52px; background: #edf0f6; color: var(--text); font-size: 22px; touch-action: none; }.gm .move-button.active{ background: var(--primary); color: white; transform: scale(0.97); }.gm .instruction-grid{ display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-top: 30px; }.gm .instruction-grid article{ padding: 24px; border: 1px solid var(--border); border-radius: 16px; background: var(--card); }.gm .instruction-grid p{ margin-bottom: 0; color: var(--muted); font-size: 16px; }.gm .step-number{ display: inline-block; margin-bottom: 24px; color: var(--primary); font-size: 14px; font-weight: 800; }.gm .tips-card{ padding: 28px; border-radius: 18px; background: #ececff; }.gm .tips-card h2{ font-size: 26px; }.gm .tips-card ul{ margin: 0; padding-left: 20px; }.gm .tips-card li + li{ margin-top: 10px; }.gm .game-icon{ display: grid; place-items: center; flex: 0 0 50px; height: 50px; border-radius: 14px; background: #eef0ff; color: var(--primary); font-size: 25px; }.gm details{ border-top: 1px solid var(--border); }.gm details:last-child{ border-bottom: 1px solid var(--border); }.gm summary{ padding: 21px 36px 21px 0; font-weight: 800; cursor: pointer; }.gm details p{ max-width: 760px; padding: 0 0 20px; margin: 0; color: var(--muted); }@media (max-width: 820px){.gm .instruction-grid{ grid-template-columns: repeat(2, 1fr); }.gm .mobile-controls{ display: grid; }}@media (max-width: 600px){.gm .game-card{ border-radius: 16px; }.gm .game-toolbar{ grid-template-columns: repeat(4, 1fr); gap: 8px; padding: 11px 12px; }.gm .stat{ align-items: center; }.gm .stat span:first-child{ font-size: 11px; }.gm .stat strong{ font-size: 18px; }.gm .toolbar-button{ position: absolute; z-index: 3; top: 84px; right: 22px; min-width: 76px; min-height: 40px; background: rgba(237, 240, 246, 0.9); }.gm .game-stage{ aspect-ratio: 4 / 5; max-height: min(660px, 72vh); }.gm .overlay-panel{ padding: 24px 18px; }.gm .overlay-hint{ display: none; }.gm .game-footer{ align-items: stretch; flex-direction: column; gap: 10px; padding: 14px; }.gm .secondary-button{ width: 100%; }.gm .instruction-grid{ grid-template-columns: 1fr; }.gm .instruction-grid article{ padding: 20px; }.gm .step-number{ margin-bottom: 16px; }}@media (prefers-reduced-motion: reduce){.gm *,.gm *::before,.gm *::after{ scroll-behavior: auto !important; transition-duration: 0.01ms !important; }}";
function __ready(f){f()}
function boot(){
"use strict";

(() => {
  const canvas = document.getElementById("game-canvas");
  const ctx = canvas.getContext("2d");
  const stage = document.getElementById("game-stage");
  const scoreEl = document.getElementById("score");
  const bestEl = document.getElementById("best-score");
  const waveEl = document.getElementById("wave");
  const livesEl = document.getElementById("lives");
  const pauseButton = document.getElementById("pause-button");
  const restartButton = document.getElementById("restart-button");
  const overlay = document.getElementById("game-overlay");
  const overlayKicker = document.getElementById("overlay-kicker");
  const overlayTitle = document.getElementById("overlay-title");
  const overlayMessage = document.getElementById("overlay-message");
  const primaryAction = document.getElementById("primary-action");
  const announcer = document.getElementById("announcer");

  const WORLD = { width: 960, height: 600 };
  const MAX_WAVES = 5;
  const keys = new Set();
  const touchDirections = new Set();
  let stars = [];
  let player;
  let bullets = [];
  let enemyBullets = [];
  let enemies = [];
  let particles = [];
  let powerUps = [];
  let score = 0;
  let bestScore = getBestScore();
  let wave = 1;
  let lives = 3;
  let state = "ready";
  let lastTime = 0;
  let animationId = 0;
  let waveDelay = 0;
  let screenShake = 0;
  let pointerActive = false;
  let pointerTarget = { x: WORLD.width / 2, y: WORLD.height - 80 };

  function getBestScore() {
    try { return Number(localStorage.getItem("spaceShooterBest")) || 0; }
    catch (_error) { return 0; }
  }

  function saveBestScore() {
    if (score <= bestScore) return;
    bestScore = score;
    try { localStorage.setItem("spaceShooterBest", String(bestScore)); }
    catch (_error) { /* Storage can be blocked; gameplay still works. */ }
  }

  function createPlayer() {
    return {
      x: WORLD.width / 2,
      y: WORLD.height - 62,
      width: 38,
      height: 48,
      speed: 360,
      fireTimer: 0,
      invulnerable: 0,
      rapidFire: 0
    };
  }

  function makeStars() {
    stars = Array.from({ length: 95 }, () => ({
      x: Math.random() * WORLD.width,
      y: Math.random() * WORLD.height,
      size: Math.random() * 1.8 + 0.4,
      speed: Math.random() * 38 + 14,
      alpha: Math.random() * 0.65 + 0.25
    }));
  }

  function resetGame() {
    score = 0;
    wave = 1;
    lives = 3;
    bullets = [];
    enemyBullets = [];
    enemies = [];
    particles = [];
    powerUps = [];
    player = createPlayer();
    waveDelay = 0;
    screenShake = 0;
    pointerActive = false;
    updateHud();
  }

  function startGame() {
    resetGame();
    state = "playing";
    overlay.hidden = true;
    pauseButton.disabled = false;
    pauseButton.textContent = "Pause";
    spawnWave();
    announce("Mission started. Wave 1.");
    lastTime = performance.now();
    cancelAnimationFrame(animationId);
    animationId = requestAnimationFrame(gameLoop);
  }

  function spawnWave() {
    enemies = [];
    enemyBullets = [];
    if (wave === MAX_WAVES) {
      enemies.push(createEnemy(WORLD.width / 2, 92, "boss", 0));
      announce("Final wave. Command ship detected.");
      return;
    }

    const rows = wave >= 3 ? 3 : 2;
    const columns = 5 + Math.min(wave, 2);
    const gapX = 94;
    const startX = WORLD.width / 2 - ((columns - 1) * gapX) / 2;
    for (let row = 0; row < rows; row += 1) {
      for (let col = 0; col < columns; col += 1) {
        const type = row === 0 && wave >= 2 ? "zigzag" : (row === rows - 1 && wave >= 3 ? "tank" : "scout");
        enemies.push(createEnemy(startX + col * gapX, 72 + row * 68, type, enemies.length));
      }
    }
  }

  function createEnemy(x, y, type, index) {
    const settings = {
      scout: { width: 34, height: 28, hp: 1, points: 100, speed: 34, color: "#ffb84d", fire: 2.5 },
      zigzag: { width: 38, height: 32, hp: 2, points: 180, speed: 45, color: "#9d7cff", fire: 2.1 },
      tank: { width: 44, height: 36, hp: 3, points: 260, speed: 26, color: "#ef5b5b", fire: 1.8 },
      boss: { width: 132, height: 72, hp: 45, points: 3000, speed: 58, color: "#a78bfa", fire: 0.72 }
    }[type];
    return {
      x, y, type, index,
      width: settings.width,
      height: settings.height,
      hp: settings.hp,
      maxHp: settings.hp,
      points: settings.points,
      speed: settings.speed,
      color: settings.color,
      fireTimer: Math.random() * settings.fire + 0.5,
      fireRate: settings.fire,
      phase: Math.random() * Math.PI * 2,
      age: 0
    };
  }

  function gameLoop(timestamp) {
    const dt = Math.min((timestamp - lastTime) / 1000, 0.034);
    lastTime = timestamp;
    if (state === "playing") update(dt);
    draw();
    if (state === "playing" || state === "paused") animationId = requestAnimationFrame(gameLoop);
  }

  function update(dt) {
    updateStars(dt);
    updatePlayer(dt);
    updateBullets(dt);
    updateEnemies(dt);
    updateEnemyBullets(dt);
    updateParticles(dt);
    updatePowerUps(dt);
    detectCollisions();
    screenShake = Math.max(0, screenShake - 24 * dt);

    if (enemies.length === 0 && waveDelay <= 0 && state === "playing") {
      if (wave >= MAX_WAVES) {
        endGame(true);
      } else {
        waveDelay = 1.35;
        score += wave * 500;
        updateHud();
        announce(`Wave ${wave} cleared.`);
      }
    }

    if (waveDelay > 0) {
      waveDelay -= dt;
      if (waveDelay <= 0) {
        wave += 1;
        waveEl.textContent = String(wave);
        spawnWave();
        announce(`Wave ${wave}.`);
      }
    }
  }

  function updateStars(dt) {
    for (const star of stars) {
      star.y += star.speed * dt;
      if (star.y > WORLD.height) { star.y = -3; star.x = Math.random() * WORLD.width; }
    }
  }

  function updatePlayer(dt) {
    let dx = 0;
    let dy = 0;
    if (keys.has("arrowleft") || keys.has("a") || touchDirections.has("left")) dx -= 1;
    if (keys.has("arrowright") || keys.has("d") || touchDirections.has("right")) dx += 1;
    if (keys.has("arrowup") || keys.has("w") || touchDirections.has("up")) dy -= 1;
    if (keys.has("arrowdown") || keys.has("s") || touchDirections.has("down")) dy += 1;
    if (dx && dy) { dx *= Math.SQRT1_2; dy *= Math.SQRT1_2; }

    if (pointerActive) {
      const follow = Math.min(1, 11 * dt);
      player.x += (pointerTarget.x - player.x) * follow;
      player.y += (pointerTarget.y - player.y) * follow;
    } else {
      player.x += dx * player.speed * dt;
      player.y += dy * player.speed * dt;
    }

    player.x = clamp(player.x, player.width / 2 + 10, WORLD.width - player.width / 2 - 10);
    player.y = clamp(player.y, WORLD.height * 0.38, WORLD.height - player.height / 2 - 12);
    player.invulnerable = Math.max(0, player.invulnerable - dt);
    player.rapidFire = Math.max(0, player.rapidFire - dt);
    player.fireTimer -= dt;
    const fireRate = player.rapidFire > 0 || keys.has(" ") ? 0.12 : 0.25;
    if (player.fireTimer <= 0) {
      firePlayerBullet();
      player.fireTimer = fireRate;
    }
  }

  function firePlayerBullet() {
    bullets.push({ x: player.x, y: player.y - player.height / 2, width: 5, height: 16, speed: 610 });
    if (player.rapidFire > 0) {
      bullets.push({ x: player.x - 14, y: player.y - 12, width: 4, height: 14, speed: 590 });
      bullets.push({ x: player.x + 14, y: player.y - 12, width: 4, height: 14, speed: 590 });
    }
  }

  function updateBullets(dt) {
    for (const bullet of bullets) bullet.y -= bullet.speed * dt;
    bullets = bullets.filter((bullet) => bullet.y > -30);
  }

  function updateEnemies(dt) {
    const formationTime = performance.now() / 1000;
    for (const enemy of enemies) {
      enemy.age += dt;
      if (enemy.type === "boss") {
        enemy.x += Math.sin(enemy.age * 1.25) * enemy.speed * dt;
        enemy.x = clamp(enemy.x, enemy.width / 2 + 24, WORLD.width - enemy.width / 2 - 24);
        enemy.y = 88 + Math.sin(enemy.age * 1.8) * 16;
      } else {
        const sway = enemy.type === "zigzag" ? 52 : 24;
        enemy.x += Math.sin(formationTime * 1.1 + enemy.phase) * sway * dt;
        enemy.y += (8 + wave * 1.8) * dt;
      }

      enemy.fireTimer -= dt;
      if (enemy.fireTimer <= 0 && enemy.y < WORLD.height * 0.66) {
        fireEnemyBullet(enemy);
        const difficulty = Math.max(0.58, 1 - wave * 0.065);
        enemy.fireTimer = enemy.fireRate * difficulty + Math.random() * 1.15;
      }

      if (enemy.y > WORLD.height + 40) {
        enemy.hp = 0;
        damagePlayer();
      }
    }
    enemies = enemies.filter((enemy) => enemy.hp > 0);
  }

  function fireEnemyBullet(enemy) {
    const angle = Math.atan2(player.y - enemy.y, player.x - enemy.x);
    const speed = enemy.type === "boss" ? 250 : 205 + wave * 10;
    enemyBullets.push({
      x: enemy.x,
      y: enemy.y + enemy.height / 2,
      vx: Math.cos(angle) * speed * (enemy.type === "boss" ? 0.62 : 0.35),
      vy: Math.max(150, Math.sin(angle) * speed),
      radius: enemy.type === "boss" ? 6 : 5
    });
    if (enemy.type === "boss" && Math.random() < 0.48) {
      enemyBullets.push({ x: enemy.x - 34, y: enemy.y + 18, vx: -75, vy: 220, radius: 5 });
      enemyBullets.push({ x: enemy.x + 34, y: enemy.y + 18, vx: 75, vy: 220, radius: 5 });
    }
  }

  function updateEnemyBullets(dt) {
    for (const bullet of enemyBullets) { bullet.x += bullet.vx * dt; bullet.y += bullet.vy * dt; }
    enemyBullets = enemyBullets.filter((bullet) => bullet.y < WORLD.height + 25 && bullet.x > -25 && bullet.x < WORLD.width + 25);
  }

  function updateParticles(dt) {
    for (const particle of particles) {
      particle.x += particle.vx * dt;
      particle.y += particle.vy * dt;
      particle.life -= dt;
      particle.vx *= 0.985;
      particle.vy *= 0.985;
    }
    particles = particles.filter((particle) => particle.life > 0);
  }

  function updatePowerUps(dt) {
    for (const item of powerUps) {
      item.y += 105 * dt;
      item.rotation += 2.4 * dt;
    }
    powerUps = powerUps.filter((item) => item.y < WORLD.height + 30);
  }

  function detectCollisions() {
    for (const bullet of bullets) {
      for (const enemy of enemies) {
        if (bullet.dead || enemy.hp <= 0 || !rectsOverlap(bullet, enemy)) continue;
        bullet.dead = true;
        enemy.hp -= 1;
        createBurst(bullet.x, bullet.y, enemy.color, 4);
        if (enemy.hp <= 0) destroyEnemy(enemy);
      }
    }
    bullets = bullets.filter((bullet) => !bullet.dead);

    for (const bullet of enemyBullets) {
      if (!bullet.dead && circleHitsRect(bullet, player) && player.invulnerable <= 0) {
        bullet.dead = true;
        damagePlayer();
      }
    }
    enemyBullets = enemyBullets.filter((bullet) => !bullet.dead);

    for (const enemy of enemies) {
      if (enemy.hp > 0 && rectsOverlap(enemy, player) && player.invulnerable <= 0) {
        enemy.hp = 0;
        createBurst(enemy.x, enemy.y, enemy.color, 12);
        damagePlayer();
      }
    }
    enemies = enemies.filter((enemy) => enemy.hp > 0);

    for (const item of powerUps) {
      if (!item.collected && circleHitsRect({ x: item.x, y: item.y, radius: 14 }, player)) {
        item.collected = true;
        if (item.type === "repair") {
          lives = Math.min(3, lives + 1);
          announce("Repair core collected. One life restored.");
        } else {
          player.rapidFire = 8;
          announce("Rapid fire active for eight seconds.");
        }
        score += 150;
        createBurst(item.x, item.y, item.type === "repair" ? "#22c55e" : "#16b8c4", 12);
        updateHud();
      }
    }
    powerUps = powerUps.filter((item) => !item.collected);
  }

  function destroyEnemy(enemy) {
    score += enemy.points;
    screenShake = enemy.type === "boss" ? 14 : 4;
    createBurst(enemy.x, enemy.y, enemy.color, enemy.type === "boss" ? 42 : 15);
    if (enemy.type !== "boss" && Math.random() < 0.1) {
      const type = lives < 3 && Math.random() < 0.42 ? "repair" : "rapid";
      powerUps.push({ x: enemy.x, y: enemy.y, type, rotation: 0 });
    }
    updateHud();
  }

  function damagePlayer() {
    if (state !== "playing" || player.invulnerable > 0) return;
    lives -= 1;
    player.invulnerable = 1.7;
    screenShake = 11;
    createBurst(player.x, player.y, "#75e3eb", 22);
    updateHud();
    if (lives <= 0) endGame(false);
    else announce(`${lives} ${lives === 1 ? "life" : "lives"} remaining.`);
  }

  function endGame(victory) {
    if (state === "won" || state === "gameover") return;
    if (victory) score += 2500 + lives * 750;
    saveBestScore();
    updateHud();
    state = victory ? "won" : "gameover";
    pauseButton.disabled = true;
    overlayKicker.textContent = victory ? "Mission complete" : "Mission failed";
    overlayTitle.textContent = victory ? "Galaxy defended!" : "Your ship was lost";
    overlayMessage.textContent = victory
      ? `Final score: ${score.toLocaleString()}. The command ship has been destroyed.`
      : `Final score: ${score.toLocaleString()}. Regroup and launch another mission.`;
    primaryAction.textContent = "Play again";
    overlay.hidden = false;
    announce(victory ? "Mission complete." : "Game over.");
  }

  function togglePause(forcePause = false) {
    if (state !== "playing" && state !== "paused") return;
    if (state === "playing" || forcePause) {
      state = "paused";
      overlayKicker.textContent = "Mission paused";
      overlayTitle.textContent = "Take a breather";
      overlayMessage.textContent = "Your position is safe. Continue when you are ready.";
      primaryAction.textContent = "Resume mission";
      overlay.hidden = false;
      pauseButton.textContent = "Resume";
      announce("Game paused.");
    } else {
      state = "playing";
      overlay.hidden = true;
      pauseButton.textContent = "Pause";
      lastTime = performance.now();
      announce("Game resumed.");
    }
  }

  function updateHud() {
    scoreEl.textContent = score.toLocaleString();
    bestEl.textContent = bestScore.toLocaleString();
    waveEl.textContent = String(wave);
    livesEl.textContent = lives > 0 ? Array(lives).fill("●").join(" ") : "None";
    livesEl.setAttribute("aria-label", `${lives} ${lives === 1 ? "life" : "lives"}`);
  }

  function createBurst(x, y, color, count) {
    for (let i = 0; i < count; i += 1) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 145 + 45;
      particles.push({ x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, color, life: Math.random() * 0.55 + 0.25, maxLife: 0.8, size: Math.random() * 3.5 + 1.5 });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, WORLD.width, WORLD.height);
    const shakeX = screenShake ? (Math.random() - 0.5) * screenShake : 0;
    const shakeY = screenShake ? (Math.random() - 0.5) * screenShake : 0;
    ctx.save();
    ctx.translate(shakeX, shakeY);
    drawBackground();
    drawPowerUps();
    drawBullets();
    drawEnemies();
    drawEnemyBullets();
    drawPlayer();
    drawParticles();
    if (waveDelay > 0 && state === "playing") drawWaveComplete();
    ctx.restore();
  }

  function drawBackground() {
    const gradient = ctx.createLinearGradient(0, 0, 0, WORLD.height);
    gradient.addColorStop(0, "#080e1d");
    gradient.addColorStop(1, "#111a2f");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, WORLD.width, WORLD.height);
    ctx.fillStyle = "rgba(91, 92, 226, 0.08)";
    ctx.beginPath(); ctx.arc(135, 120, 180, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "rgba(22, 184, 196, 0.05)";
    ctx.beginPath(); ctx.arc(825, 420, 230, 0, Math.PI * 2); ctx.fill();
    for (const star of stars) {
      ctx.globalAlpha = star.alpha;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(star.x, star.y, star.size, star.size);
    }
    ctx.globalAlpha = 1;
  }

  function drawPlayer() {
    if (!player) return;
    if (player.invulnerable > 0 && Math.floor(player.invulnerable * 10) % 2 === 0) return;
    ctx.save();
    ctx.translate(player.x, player.y);
    ctx.fillStyle = "rgba(22, 184, 196, 0.28)";
    ctx.beginPath(); ctx.moveTo(-9, 20); ctx.lineTo(0, 38 + Math.random() * 8); ctx.lineTo(9, 20); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#f4f7ff";
    ctx.beginPath(); ctx.moveTo(0, -26); ctx.lineTo(20, 20); ctx.lineTo(7, 15); ctx.lineTo(0, 23); ctx.lineTo(-7, 15); ctx.lineTo(-20, 20); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#5b5ce2";
    ctx.beginPath(); ctx.moveTo(0, -15); ctx.lineTo(7, 7); ctx.lineTo(0, 13); ctx.lineTo(-7, 7); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#75e3eb";
    ctx.beginPath(); ctx.arc(0, -2, 4, 0, Math.PI * 2); ctx.fill();
    if (player.rapidFire > 0) {
      ctx.strokeStyle = "rgba(117, 227, 235, 0.65)"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(0, 0, 30 + Math.sin(performance.now() / 100) * 2, 0, Math.PI * 2); ctx.stroke();
    }
    ctx.restore();
  }

  function drawEnemies() {
    for (const enemy of enemies) {
      ctx.save();
      ctx.translate(enemy.x, enemy.y);
      if (enemy.type === "boss") drawBoss(enemy);
      else drawSmallEnemy(enemy);
      ctx.restore();
    }
  }

  function drawSmallEnemy(enemy) {
    ctx.fillStyle = enemy.color;
    ctx.beginPath();
    ctx.moveTo(-enemy.width / 2, -5); ctx.lineTo(-10, -enemy.height / 2); ctx.lineTo(0, -7); ctx.lineTo(10, -enemy.height / 2); ctx.lineTo(enemy.width / 2, -5); ctx.lineTo(13, enemy.height / 2); ctx.lineTo(-13, enemy.height / 2); ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#111827";
    ctx.fillRect(-8, -2, 16, 7);
    ctx.fillStyle = "#d8fdff";
    ctx.fillRect(-5, 0, 10, 3);
    if (enemy.maxHp > 1) {
      ctx.fillStyle = "rgba(255,255,255,0.18)"; ctx.fillRect(-enemy.width / 2, enemy.height / 2 + 6, enemy.width, 3);
      ctx.fillStyle = "#75e3eb"; ctx.fillRect(-enemy.width / 2, enemy.height / 2 + 6, enemy.width * (enemy.hp / enemy.maxHp), 3);
    }
  }

  function drawBoss(enemy) {
    ctx.fillStyle = "#725bd2";
    ctx.beginPath(); ctx.moveTo(-66, 2); ctx.lineTo(-42, -30); ctx.lineTo(-17, -22); ctx.lineTo(0, -38); ctx.lineTo(17, -22); ctx.lineTo(42, -30); ctx.lineTo(66, 2); ctx.lineTo(46, 31); ctx.lineTo(-46, 31); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#a78bfa"; ctx.fillRect(-28, -17, 56, 34);
    ctx.fillStyle = "#75e3eb"; ctx.fillRect(-15, -8, 30, 11);
    ctx.fillStyle = "rgba(255,255,255,0.2)"; ctx.fillRect(-66, 43, 132, 8);
    ctx.fillStyle = "#ef5b5b"; ctx.fillRect(-66, 43, 132 * (enemy.hp / enemy.maxHp), 8);
  }

  function drawBullets() {
    ctx.fillStyle = "#75e3eb";
    ctx.shadowColor = "#16b8c4"; ctx.shadowBlur = 10;
    for (const bullet of bullets) ctx.fillRect(bullet.x - bullet.width / 2, bullet.y - bullet.height / 2, bullet.width, bullet.height);
    ctx.shadowBlur = 0;
  }

  function drawEnemyBullets() {
    ctx.fillStyle = "#ff6f70";
    ctx.shadowColor = "#ef5b5b"; ctx.shadowBlur = 9;
    for (const bullet of enemyBullets) { ctx.beginPath(); ctx.arc(bullet.x, bullet.y, bullet.radius, 0, Math.PI * 2); ctx.fill(); }
    ctx.shadowBlur = 0;
  }

  function drawParticles() {
    for (const particle of particles) {
      ctx.globalAlpha = Math.max(0, particle.life / particle.maxLife);
      ctx.fillStyle = particle.color;
      ctx.fillRect(particle.x, particle.y, particle.size, particle.size);
    }
    ctx.globalAlpha = 1;
  }

  function drawPowerUps() {
    for (const item of powerUps) {
      ctx.save(); ctx.translate(item.x, item.y); ctx.rotate(item.rotation);
      ctx.fillStyle = item.type === "repair" ? "#22c55e" : "#16b8c4";
      ctx.beginPath();
      for (let i = 0; i < 6; i += 1) {
        const angle = (Math.PI * 2 * i) / 6 - Math.PI / 2;
        const x = Math.cos(angle) * 14; const y = Math.sin(angle) * 14;
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.closePath(); ctx.fill();
      ctx.fillStyle = "#ffffff"; ctx.font = "800 15px Nunito Sans"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(item.type === "repair" ? "+" : "R", 0, 1);
      ctx.restore();
    }
  }

  function drawWaveComplete() {
    ctx.fillStyle = "rgba(8,14,29,0.64)"; ctx.fillRect(0, WORLD.height / 2 - 54, WORLD.width, 108);
    ctx.fillStyle = "#ffffff"; ctx.textAlign = "center"; ctx.font = "800 34px Nunito Sans"; ctx.fillText(`Wave ${wave} cleared`, WORLD.width / 2, WORLD.height / 2 + 3);
    ctx.fillStyle = "#75e3eb"; ctx.font = "700 16px Nunito Sans"; ctx.fillText(`+${(wave * 500).toLocaleString()} bonus`, WORLD.width / 2, WORLD.height / 2 + 31);
  }

  function rectsOverlap(a, b) {
    return Math.abs(a.x - b.x) * 2 < (a.width + b.width) && Math.abs(a.y - b.y) * 2 < (a.height + b.height);
  }

  function circleHitsRect(circle, rect) {
    const nearestX = clamp(circle.x, rect.x - rect.width / 2, rect.x + rect.width / 2);
    const nearestY = clamp(circle.y, rect.y - rect.height / 2, rect.y + rect.height / 2);
    return (circle.x - nearestX) ** 2 + (circle.y - nearestY) ** 2 < circle.radius ** 2;
  }

  function clamp(value, min, max) { return Math.max(min, Math.min(max, value)); }
  function announce(message) { announcer.textContent = message; }

  function pointerPosition(event) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) / rect.width) * WORLD.width,
      y: ((event.clientY - rect.top) / rect.height) * WORLD.height
    };
  }

  window.addEventListener("keydown", (event) => {
    const key = event.key.toLowerCase();
    if (["arrowup", "arrowdown", "arrowleft", "arrowright", " "].includes(key)) event.preventDefault();
    if (key === "p" || key === "escape") { togglePause(); return; }
    keys.add(key);
    pointerActive = false;
  });
  window.addEventListener("keyup", (event) => keys.delete(event.key.toLowerCase()));
  window.addEventListener("blur", () => { keys.clear(); touchDirections.clear(); if (state === "playing") togglePause(true); });

  stage.addEventListener("pointerdown", (event) => {
    if (state !== "playing" || event.target.closest("button")) return;
    pointerActive = true;
    pointerTarget = pointerPosition(event);
    stage.setPointerCapture?.(event.pointerId);
  });
  stage.addEventListener("pointermove", (event) => {
    if (!pointerActive || state !== "playing") return;
    pointerTarget = pointerPosition(event);
  });
  stage.addEventListener("pointerup", () => { pointerActive = false; });
  stage.addEventListener("pointercancel", () => { pointerActive = false; });

  document.querySelectorAll(".move-button").forEach((button) => {
    const direction = button.dataset.direction;
    const start = (event) => { event.preventDefault(); touchDirections.add(direction); pointerActive = false; button.classList.add("active"); };
    const stop = () => { touchDirections.delete(direction); button.classList.remove("active"); };
    button.addEventListener("pointerdown", start);
    button.addEventListener("pointerup", stop);
    button.addEventListener("pointercancel", stop);
    button.addEventListener("pointerleave", stop);
  });

  primaryAction.addEventListener("click", () => {
    if (state === "paused") togglePause();
    else startGame();
  });
  pauseButton.addEventListener("click", () => togglePause());
  restartButton.addEventListener("click", startGame);
  document.querySelectorAll(".placeholder-link").forEach((link) => link.addEventListener("click", (event) => event.preventDefault()));
  document.getElementById("current-year").textContent = String(new Date().getFullYear());

  function setupCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = WORLD.width * dpr;
    canvas.height = WORLD.height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  setupCanvas();
  makeStars();
  resetGame();
  bestEl.textContent = bestScore.toLocaleString();
  draw();
})();


}
function begin(){poster.hidden=true;gm.hidden=false;if(!booted){booted=true;var s=document.createElement("style");s.textContent=LOOK;document.head.appendChild(s);boot();}else{var r=document.getElementById("primary-action");if(r)r.click();}}
poster.addEventListener("click",begin);
var nb=document.getElementById("new");if(nb)nb.addEventListener("click",begin);
})();
