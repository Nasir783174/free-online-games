/* Classic Arcade - game logic + its own look. Layout lives in style.css; page shell lives in the HTML. */
(function(){"use strict";
var gm=document.getElementById("gm"),poster=document.getElementById("poster"),booted=false;
var LOOK=".gm{\n  \n  \n  --accent: #16b8c4;\n  --action: #ffb84d;\n  --success: #22c55e;\n  --danger: #ef5b5b;\n  \n  \n  \n  \n  \n  --game: #111827;\n  --game-secondary: #1f2937;\n  \n}.gm *{ box-sizing: border-box; }.gm button{ -webkit-tap-highlight-color: transparent; }.gm button{ font: inherit; }.gm .game-kicker,.gm .overlay-kicker{ margin: 0 0 8px; color: var(--brand); font-weight: 800; font-size: 14px; letter-spacing: .08em; text-transform: uppercase; }.gm h2{ margin: 0; font-size: clamp(28px, 4vw, 35px); line-height: 1.2; letter-spacing: -.02em; }.gm h3{ line-height: 1.3; }.gm .game-card{ max-width: 940px; margin: 0 auto; padding: 24px; border: 1px solid var(--border); border-radius: 20px; background: var(--card); box-shadow: var(--shadow); }.gm .game-toolbar{ display: flex; align-items: center; justify-content: space-between; gap: 20px; margin-bottom: 18px; }.gm .game-toolbar h2{ font-size: 27px; }.gm .game-kicker{ margin-bottom: 1px; color: var(--accent); font-size: 12px; }.gm .sound-button,.gm .secondary-button,.gm .primary-button,.gm .mobile-controls button{ min-height: 46px; border-radius: 12px; border: 1px solid var(--border); cursor: pointer; font-weight: 800; transition: transform .15s ease, background .15s ease, border-color .15s ease; }.gm .sound-button{ padding: 0 15px; background: #f7f7fd; color: var(--brand-dark); font-size: 14px; }.gm .sound-button:hover,.gm .secondary-button:hover{ border-color: #c9caed; background: #f0f0fb; }.gm button:focus-visible,.gm summary:focus-visible{ outline: 3px solid rgba(22,184,196,.38); outline-offset: 3px; }.gm button:active{ transform: translateY(1px); }.gm button:disabled{ cursor: not-allowed; opacity: .52; }.gm .stats{ display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 12px; }.gm .stat{ display: flex; align-items: baseline; justify-content: space-between; gap: 6px; padding: 10px 14px; border: 1px solid #2c384b; border-radius: 12px; background: var(--game-secondary); color: #aeb8c8; }.gm .stat span{ font-size: 12px; font-weight: 800; letter-spacing: .04em; text-transform: uppercase; }.gm .stat strong{ color: white; font-size: 22px; line-height: 1.2; font-variant-numeric: tabular-nums; }.gm .canvas-wrap{ position: relative; overflow: hidden; width: 100%; aspect-ratio: 800 / 620; border-radius: 16px; background: var(--game); border: 1px solid #2a3548; touch-action: none; }.gm canvas{ display: block; width: 100%; height: 100%; }.gm .game-overlay{ position: absolute; inset: 0; display: grid; place-items: center; padding: 20px; background: rgba(8, 14, 27, .76); transition: opacity .2s ease; }.gm .game-overlay.hidden{ pointer-events: none; opacity: 0; }.gm .overlay-panel{ width: min(430px, 100%); padding: 30px; border: 1px solid rgba(255,255,255,.15); border-radius: 18px; background: rgba(31,41,55,.96); color: white; text-align: center; box-shadow: 0 16px 40px rgba(0,0,0,.25); }.gm .overlay-panel h3{ margin: 0; font-size: clamp(25px, 5vw, 34px); }.gm .overlay-panel > p:not(.overlay-kicker){ margin: 12px 0 22px; color: #cbd5e1; }.gm .primary-button{ border-color: transparent; background: var(--action); color: #362708; padding: 0 22px; }.gm .primary-button:hover{ background: #ffc66d; }.gm .primary-button.compact,.gm .secondary-button{ min-height: 44px; padding: 0 17px; font-size: 15px; }.gm .secondary-button{ background: white; color: var(--text); }.gm .mobile-controls{ display: none; grid-template-columns: 1fr 1.35fr 1fr; gap: 10px; margin-top: 12px; user-select: none; }.gm .mobile-controls button{ min-height: 58px; border-color: #303e53; background: var(--game-secondary); color: white; font-size: 24px; touch-action: manipulation; }.gm .mobile-controls .fire-button{ background: var(--brand); border-color: var(--brand); font-size: 15px; letter-spacing: .05em; }.gm .mobile-controls button.active{ transform: translateY(1px); background: #34435a; }.gm .mobile-controls .fire-button.active{ background: var(--brand-dark); }.gm .game-actions{ display: flex; align-items: center; justify-content: space-between; gap: 18px; margin-top: 17px; }.gm .game-actions p{ display: flex; align-items: center; gap: 9px; margin: 0; color: var(--muted); font-size: 15px; font-weight: 700; }.gm .game-actions > div{ display: flex; gap: 10px; }.gm .status-dot{ width: 9px; height: 9px; border-radius: 50%; background: var(--success); box-shadow: 0 0 0 4px rgba(34,197,94,.12); }.gm .status-dot.paused{ background: var(--action); box-shadow: 0 0 0 4px rgba(255,184,77,.15); }.gm .status-dot.ended{ background: var(--danger); box-shadow: 0 0 0 4px rgba(239,91,91,.14); }.gm .steps{ display: grid; gap: 18px; margin: 24px 0 0; padding: 0; list-style: none; }.gm .steps li{ display: flex; align-items: flex-start; gap: 14px; }.gm .steps li > span{ flex: 0 0 auto; display: grid; place-items: center; width: 34px; height: 34px; border-radius: 10px; background: #eeeeff; color: var(--brand-dark); font-size: 14px; font-weight: 800; }.gm .steps strong{ display: block; }.gm .steps p{ margin: 2px 0 0; color: var(--muted); font-size: 16px; }.gm .control-row{ display: flex; align-items: center; justify-content: space-between; gap: 10px; padding: 14px 0; border-bottom: 1px solid var(--border); }.gm .control-row > span{ font-weight: 700; }.gm .control-row div{ display: flex; align-items: center; gap: 5px; color: var(--muted); font-size: 13px; }.gm kbd{ display: inline-grid; min-width: 32px; min-height: 32px; place-items: center; padding: 2px 7px; border: 1px solid #ced2dd; border-bottom-width: 3px; border-radius: 7px; background: #fff; color: var(--text); font-family: inherit; font-weight: 800; }.gm .controls-card > p{ margin: 18px 0 0; font-size: 15px; }.gm .tips-grid{ display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; margin-top: 24px; }.gm .tips-grid article{ padding: 23px; background: white; border: 1px solid var(--border); border-radius: 16px; }.gm .tips-grid article > span{ color: var(--brand); font-size: 13px; font-weight: 800; }.gm .tips-grid h3{ margin: 7px 0 4px; font-size: 21px; }.gm .tips-grid p{ margin: 0; color: var(--muted); font-size: 16px; }.gm .coming-soon{ margin-left: auto; color: var(--muted); font-size: 12px; font-weight: 700; white-space: nowrap; }.gm details{ border-top: 1px solid var(--border); background: transparent; }.gm details:last-child{ border-bottom: 1px solid var(--border); }.gm summary{ position: relative; padding: 18px 38px 18px 0; cursor: pointer; list-style: none; font-weight: 800; }.gm summary::-webkit-details-marker{ display: none; }.gm summary::after{ content: \"+\"; position: absolute; right: 5px; top: 15px; color: var(--brand); font-size: 25px; line-height: 1; }.gm details[open] summary::after{ content: \"\u2212\"; }.gm details p{ margin: -5px 0 19px; max-width: 760px; color: var(--muted); }.gm .sr-only{ position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; }@media (max-width: 760px){.gm .game-card{ margin-inline: -4px; padding: 14px; border-radius: 17px; }.gm .game-toolbar{ margin: 2px 2px 13px; }.gm .game-toolbar h2{ font-size: 23px; }.gm .sound-button{ min-height: 42px; padding: 0 11px; }.gm .stats{ grid-template-columns: repeat(2, 1fr); gap: 7px; }.gm .stat{ padding: 8px 11px; }.gm .stat strong{ font-size: 20px; }.gm .canvas-wrap{ border-radius: 13px; }.gm .overlay-panel{ padding: 22px 18px; }.gm .mobile-controls{ display: grid; }.gm .game-actions{ align-items: flex-start; flex-direction: column; }.gm .game-actions > div{ width: 100%; }.gm .game-actions button{ flex: 1; }.gm .tips-grid{ grid-template-columns: 1fr; }}@media (max-width: 390px){.gm .game-card{ margin-inline: -7px; padding: 10px; }.gm .stat span{ font-size: 11px; }.gm .mobile-controls button{ min-height: 54px; }.gm .sound-button span{ font-size: 0; }.gm .sound-button span::after{ content: \"Audio\"; font-size: 13px; }}@media (prefers-reduced-motion: reduce){.gm *,.gm *::before,.gm *::after{ animation-duration: .01ms !important; transition-duration: .01ms !important; }}";
function __ready(f){f()}
function boot(){
"use strict";

(() => {
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");
  const scoreElement = document.getElementById("score");
  const highScoreElement = document.getElementById("highScore");
  const waveElement = document.getElementById("wave");
  const livesElement = document.getElementById("lives");
  const overlay = document.getElementById("gameOverlay");
  const overlayKicker = document.getElementById("overlayKicker");
  const overlayTitle = document.getElementById("overlayTitle");
  const overlayMessage = document.getElementById("overlayMessage");
  const startButton = document.getElementById("startButton");
  const restartButton = document.getElementById("restartButton");
  const pauseButton = document.getElementById("pauseButton");
  const soundButton = document.getElementById("soundButton");
  const soundIcon = document.getElementById("soundIcon");
  const gameStatus = document.getElementById("gameStatus");
  const liveStatus = document.getElementById("liveStatus");
  const leftButton = document.getElementById("leftButton");
  const rightButton = document.getElementById("rightButton");
  const fireButton = document.getElementById("fireButton");

  const WIDTH = canvas.width;
  const HEIGHT = canvas.height;
  const DEFENSE_LINE = HEIGHT - 82;
  const keys = { left: false, right: false, fire: false };

  let state = "ready";
  let score = 0;
  let wave = 1;
  let lives = 3;
  let highScore = readHighScore();
  let player;
  let enemies = [];
  let playerBullets = [];
  let enemyBullets = [];
  let particles = [];
  let stars = [];
  let enemyDirection = 1;
  let enemySpeed = 31;
  let enemyShootTimer = 0;
  let waveDelay = 0;
  let lastTime = 0;
  let animationId = null;
  let muted = false;
  let audioContext = null;

  function readHighScore() {
    try { return Number.parseInt(localStorage.getItem("classicArcadeHighScore"), 10) || 0; }
    catch (_) { return 0; }
  }

  function saveHighScore() {
    if (score <= highScore) return;
    highScore = score;
    try { localStorage.setItem("classicArcadeHighScore", String(highScore)); }
    catch (_) { /* The game still works when browser storage is unavailable. */ }
  }

  function createStars() {
    stars = Array.from({ length: 78 }, (_, index) => ({
      x: (index * 97 + 31) % WIDTH,
      y: (index * 61 + 19) % HEIGHT,
      size: 1 + (index % 3) * .45,
      alpha: .24 + (index % 5) * .1
    }));
  }

  function resetGame() {
    score = 0;
    wave = 1;
    lives = 3;
    player = { x: WIDTH / 2 - 25, y: HEIGHT - 58, width: 50, height: 27, speed: 365, cooldown: 0, invulnerable: 0 };
    playerBullets = [];
    enemyBullets = [];
    particles = [];
    waveDelay = 0;
    createWave();
    updateHud();
  }

  function createWave() {
    enemies = [];
    const rows = 4;
    const columns = 8;
    const enemyWidth = 44;
    const enemyHeight = 28;
    const gapX = 26;
    const gapY = 23;
    const formationWidth = columns * enemyWidth + (columns - 1) * gapX;
    const startX = (WIDTH - formationWidth) / 2;

    for (let row = 0; row < rows; row += 1) {
      for (let column = 0; column < columns; column += 1) {
        enemies.push({
          x: startX + column * (enemyWidth + gapX),
          y: 72 + row * (enemyHeight + gapY),
          width: enemyWidth,
          height: enemyHeight,
          row,
          column,
          alive: true,
          phase: (row * columns + column) * .32
        });
      }
    }
    enemyDirection = 1;
    enemySpeed = Math.min(31 + (wave - 1) * 8, 92);
    enemyShootTimer = .7;
    waveElement.textContent = String(wave);
  }

  function startGame() {
    if (state === "gameover") resetGame();
    if (state === "ready") resetGame();
    state = "playing";
    overlay.classList.add("hidden");
    pauseButton.disabled = false;
    pauseButton.textContent = "Pause";
    setStatus("Wave " + wave + " in progress", "active");
    liveStatus.textContent = "Game started. Wave " + wave + ".";
    ensureAudio();
    lastTime = performance.now();
    if (animationId === null) animationId = requestAnimationFrame(gameLoop);
  }

  function restartGame() {
    resetGame();
    state = "playing";
    overlay.classList.add("hidden");
    pauseButton.disabled = false;
    pauseButton.textContent = "Pause";
    setStatus("Wave 1 in progress", "active");
    liveStatus.textContent = "New game started.";
    ensureAudio();
    lastTime = performance.now();
    if (animationId === null) animationId = requestAnimationFrame(gameLoop);
  }

  function togglePause() {
    if (state === "playing") {
      state = "paused";
      overlayKicker.textContent = "Game paused";
      overlayTitle.textContent = "Take a breather";
      overlayMessage.textContent = "Your sector is frozen until you are ready to continue.";
      startButton.textContent = "Resume game";
      overlay.classList.remove("hidden");
      pauseButton.textContent = "Resume";
      setStatus("Game paused", "paused");
      liveStatus.textContent = "Game paused.";
    } else if (state === "paused") {
      state = "playing";
      overlay.classList.add("hidden");
      pauseButton.textContent = "Pause";
      setStatus("Wave " + wave + " in progress", "active");
      liveStatus.textContent = "Game resumed.";
      lastTime = performance.now();
    }
  }

  function endGame(reason) {
    state = "gameover";
    saveHighScore();
    updateHud();
    overlayKicker.textContent = "Mission over";
    overlayTitle.textContent = "Final score: " + score.toLocaleString();
    overlayMessage.textContent = reason + " You reached wave " + wave + ". Ready for another run?";
    startButton.textContent = "Play again";
    overlay.classList.remove("hidden");
    pauseButton.disabled = true;
    setStatus("Game over", "ended");
    liveStatus.textContent = "Game over. Final score " + score + ".";
    playTone(96, .22, "sawtooth", .06);
  }

  function updateHud() {
    scoreElement.textContent = score.toLocaleString();
    highScoreElement.textContent = Math.max(score, highScore).toLocaleString();
    waveElement.textContent = String(wave);
    livesElement.textContent = String(lives);
    livesElement.setAttribute("aria-label", lives + (lives === 1 ? " life" : " lives"));
  }

  function setStatus(text, kind) {
    const className = kind === "paused" ? "paused" : kind === "ended" ? "ended" : "";
    gameStatus.innerHTML = '<span class="status-dot ' + className + '" aria-hidden="true"></span>' + text;
  }

  function ensureAudio() {
    if (muted || audioContext) return;
    const AudioCtor = window.AudioContext || window.webkitAudioContext;
    if (AudioCtor) audioContext = new AudioCtor();
  }

  function playTone(frequency, duration, type = "square", volume = .025) {
    if (muted) return;
    ensureAudio();
    if (!audioContext) return;
    if (audioContext.state === "suspended") audioContext.resume();
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    gain.gain.setValueAtTime(volume, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(.0001, audioContext.currentTime + duration);
    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + duration);
  }

  function shootPlayerBullet() {
    if (player.cooldown > 0 || state !== "playing") return;
    playerBullets.push({ x: player.x + player.width / 2 - 2, y: player.y - 11, width: 4, height: 15, speed: 560 });
    player.cooldown = .22;
    playTone(410, .05, "square", .018);
  }

  function shootEnemyBullet() {
    const bottomShooters = [];
    for (let column = 0; column < 8; column += 1) {
      const candidates = enemies.filter(enemy => enemy.alive && enemy.column === column);
      if (candidates.length) bottomShooters.push(candidates.reduce((lowest, enemy) => enemy.y > lowest.y ? enemy : lowest));
    }
    if (!bottomShooters.length) return;
    const shooter = bottomShooters[Math.floor(Math.random() * bottomShooters.length)];
    enemyBullets.push({ x: shooter.x + shooter.width / 2 - 2.5, y: shooter.y + shooter.height, width: 5, height: 14, speed: 185 + wave * 14 });
  }

  function update(delta) {
    if (waveDelay > 0) {
      waveDelay -= delta;
      updateParticles(delta);
      if (waveDelay <= 0) {
        wave += 1;
        score += 100;
        createWave();
        updateHud();
        setStatus("Wave " + wave + " in progress", "active");
        liveStatus.textContent = "Wave " + wave + " started. 100 point clear bonus.";
        playTone(620, .16, "sine", .035);
      }
      return;
    }

    let movement = 0;
    if (keys.left) movement -= 1;
    if (keys.right) movement += 1;
    player.x = clamp(player.x + movement * player.speed * delta, 10, WIDTH - player.width - 10);
    player.cooldown = Math.max(0, player.cooldown - delta);
    player.invulnerable = Math.max(0, player.invulnerable - delta);
    if (keys.fire) shootPlayerBullet();

    let shiftDown = false;
    const livingEnemies = enemies.filter(enemy => enemy.alive);
    for (const enemy of livingEnemies) {
      const nextX = enemy.x + enemyDirection * enemySpeed * delta;
      if (nextX < 16 || nextX + enemy.width > WIDTH - 16) shiftDown = true;
    }
    if (shiftDown) {
      enemyDirection *= -1;
      for (const enemy of livingEnemies) enemy.y += 19;
      enemySpeed = Math.min(enemySpeed + 1.8, 110);
    } else {
      for (const enemy of livingEnemies) enemy.x += enemyDirection * enemySpeed * delta;
    }

    if (livingEnemies.some(enemy => enemy.y + enemy.height >= DEFENSE_LINE)) {
      endGame("The fleet crossed the defense line.");
      return;
    }

    enemyShootTimer -= delta;
    if (enemyShootTimer <= 0) {
      shootEnemyBullet();
      enemyShootTimer = Math.max(.32, 1.1 - wave * .055) * (.65 + Math.random() * .7);
    }

    for (const bullet of playerBullets) bullet.y -= bullet.speed * delta;
    for (const bullet of enemyBullets) bullet.y += bullet.speed * delta;

    handleCollisions();
    playerBullets = playerBullets.filter(bullet => bullet.y + bullet.height > 0 && !bullet.remove);
    enemyBullets = enemyBullets.filter(bullet => bullet.y < HEIGHT && !bullet.remove);
    updateParticles(delta);

    if (!enemies.some(enemy => enemy.alive) && waveDelay <= 0) {
      waveDelay = 1.25;
      enemyBullets = [];
      setStatus("Sector clear", "active");
      liveStatus.textContent = "Wave " + wave + " cleared.";
    }
  }

  function handleCollisions() {
    for (const bullet of playerBullets) {
      if (bullet.remove) continue;
      for (const enemy of enemies) {
        if (!enemy.alive || !rectanglesOverlap(bullet, enemy)) continue;
        bullet.remove = true;
        enemy.alive = false;
        const points = enemy.row === 0 ? 30 : enemy.row === 1 ? 20 : 10;
        score += points;
        saveHighScore();
        addExplosion(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, enemyColor(enemy.row));
        playTone(150 + points * 5, .07, "square", .022);
        updateHud();
        break;
      }
    }

    if (player.invulnerable > 0) return;
    for (const bullet of enemyBullets) {
      if (!rectanglesOverlap(bullet, player)) continue;
      bullet.remove = true;
      lives -= 1;
      addExplosion(player.x + player.width / 2, player.y + player.height / 2, "#ffb84d", 18);
      updateHud();
      if (lives <= 0) {
        endGame("Your ship ran out of lives.");
      } else {
        player.invulnerable = 1.65;
        player.x = WIDTH / 2 - player.width / 2;
        enemyBullets = [];
        liveStatus.textContent = "Ship hit. " + lives + (lives === 1 ? " life remains." : " lives remain.");
        playTone(115, .18, "sawtooth", .05);
      }
      break;
    }
  }

  function rectanglesOverlap(a, b) {
    return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
  }

  function addExplosion(x, y, color, amount = 10) {
    for (let index = 0; index < amount; index += 1) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 45 + Math.random() * 115;
      particles.push({ x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, life: .35 + Math.random() * .35, color, size: 2 + Math.random() * 3 });
    }
  }

  function updateParticles(delta) {
    for (const particle of particles) {
      particle.x += particle.vx * delta;
      particle.y += particle.vy * delta;
      particle.life -= delta;
    }
    particles = particles.filter(particle => particle.life > 0);
  }

  function enemyColor(row) {
    return row === 0 ? "#ffb84d" : row === 1 ? "#16b8c4" : "#818cf8";
  }

  function draw(time) {
    const seconds = time / 1000;
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    const backdrop = ctx.createLinearGradient(0, 0, 0, HEIGHT);
    backdrop.addColorStop(0, "#0b1220");
    backdrop.addColorStop(1, "#111827");
    ctx.fillStyle = backdrop;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    drawStars(seconds);
    drawDefenseLine();
    drawEnemies(seconds);
    drawBullets();
    drawPlayer(seconds);
    drawParticles();
    if (waveDelay > 0 && state === "playing") drawWaveClear();
  }

  function drawStars(seconds) {
    for (let index = 0; index < stars.length; index += 1) {
      const star = stars[index];
      const twinkle = .15 * Math.sin(seconds * 1.8 + index);
      ctx.globalAlpha = clamp(star.alpha + twinkle, .1, .85);
      ctx.fillStyle = index % 8 === 0 ? "#b9c5ff" : "#ffffff";
      ctx.fillRect(star.x, star.y, star.size, star.size);
    }
    ctx.globalAlpha = 1;
  }

  function drawDefenseLine() {
    ctx.save();
    ctx.setLineDash([9, 9]);
    ctx.strokeStyle = "rgba(239,91,91,.58)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, DEFENSE_LINE);
    ctx.lineTo(WIDTH, DEFENSE_LINE);
    ctx.stroke();
    ctx.restore();
  }

  function drawPlayer(seconds) {
    if (!player) return;
    if (player.invulnerable > 0 && Math.floor(seconds * 12) % 2 === 0) return;
    const x = player.x;
    const y = player.y;
    ctx.save();
    ctx.fillStyle = "#eef2ff";
    ctx.beginPath();
    ctx.moveTo(x + 25, y);
    ctx.lineTo(x + 50, y + 26);
    ctx.lineTo(x + 34, y + 23);
    ctx.lineTo(x + 29, y + 14);
    ctx.lineTo(x + 21, y + 14);
    ctx.lineTo(x + 16, y + 23);
    ctx.lineTo(x, y + 26);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#16b8c4";
    ctx.fillRect(x + 21, y + 15, 8, 8);
    ctx.fillStyle = "#ffb84d";
    ctx.beginPath();
    ctx.moveTo(x + 20, y + 25);
    ctx.lineTo(x + 25, y + 34 + Math.sin(seconds * 20) * 2);
    ctx.lineTo(x + 30, y + 25);
    ctx.fill();
    ctx.restore();
  }

  function drawEnemies(seconds) {
    for (const enemy of enemies) {
      if (!enemy.alive) continue;
      const bob = Math.sin(seconds * 3 + enemy.phase) * 2;
      const x = enemy.x;
      const y = enemy.y + bob;
      ctx.save();
      ctx.fillStyle = enemyColor(enemy.row);
      ctx.beginPath();
      ctx.roundRect(x + 7, y + 6, enemy.width - 14, enemy.height - 7, 5);
      ctx.fill();
      ctx.fillRect(x, y + 13, 9, 8);
      ctx.fillRect(x + enemy.width - 9, y + 13, 9, 8);
      ctx.fillRect(x + 9, y + enemy.height - 4, 7, 4);
      ctx.fillRect(x + enemy.width - 16, y + enemy.height - 4, 7, 4);
      ctx.fillStyle = "#111827";
      ctx.fillRect(x + 14, y + 13, 5, 5);
      ctx.fillRect(x + enemy.width - 19, y + 13, 5, 5);
      ctx.restore();
    }
  }

  function drawBullets() {
    ctx.fillStyle = "#f8fafc";
    for (const bullet of playerBullets) {
      ctx.shadowColor = "#16b8c4";
      ctx.shadowBlur = 9;
      ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    }
    ctx.shadowBlur = 0;
    ctx.fillStyle = "#ef5b5b";
    for (const bullet of enemyBullets) {
      ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
      ctx.fillStyle = "#ffb4b4";
      ctx.fillRect(bullet.x + 1, bullet.y, 2, 5);
      ctx.fillStyle = "#ef5b5b";
    }
  }

  function drawParticles() {
    for (const particle of particles) {
      ctx.globalAlpha = clamp(particle.life * 2, 0, 1);
      ctx.fillStyle = particle.color;
      ctx.fillRect(particle.x, particle.y, particle.size, particle.size);
    }
    ctx.globalAlpha = 1;
  }

  function drawWaveClear() {
    ctx.save();
    ctx.fillStyle = "rgba(11,18,32,.7)";
    ctx.fillRect(0, HEIGHT / 2 - 45, WIDTH, 90);
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.font = "800 30px 'Nunito Sans', sans-serif";
    ctx.fillText("SECTOR CLEAR", WIDTH / 2, HEIGHT / 2 - 2);
    ctx.fillStyle = "#ffb84d";
    ctx.font = "700 16px 'Nunito Sans', sans-serif";
    ctx.fillText("+100 WAVE BONUS", WIDTH / 2, HEIGHT / 2 + 25);
    ctx.restore();
  }

  function gameLoop(time) {
    const delta = Math.min((time - lastTime) / 1000, .034);
    lastTime = time;
    if (state === "playing") update(delta);
    draw(time);
    animationId = requestAnimationFrame(gameLoop);
  }

  function clamp(value, minimum, maximum) {
    return Math.max(minimum, Math.min(maximum, value));
  }

  function keyAction(code, isPressed) {
    if (code === "ArrowLeft" || code === "KeyA") keys.left = isPressed;
    if (code === "ArrowRight" || code === "KeyD") keys.right = isPressed;
    if (code === "Space") keys.fire = isPressed;
  }

  window.addEventListener("keydown", event => {
    const gameKeys = ["ArrowLeft", "ArrowRight", "KeyA", "KeyD", "Space", "KeyP"];
    if (gameKeys.includes(event.code)) event.preventDefault();
    if (event.code === "KeyP" && !event.repeat && (state === "playing" || state === "paused")) togglePause();
    keyAction(event.code, true);
  });
  window.addEventListener("keyup", event => keyAction(event.code, false));
  window.addEventListener("blur", () => {
    keys.left = false;
    keys.right = false;
    keys.fire = false;
    if (state === "playing") togglePause();
  });

  function bindHoldButton(button, keyName) {
    const press = event => {
      event.preventDefault();
      keys[keyName] = true;
      button.classList.add("active");
      button.setPointerCapture?.(event.pointerId);
    };
    const release = event => {
      event.preventDefault();
      keys[keyName] = false;
      button.classList.remove("active");
    };
    button.addEventListener("pointerdown", press);
    button.addEventListener("pointerup", release);
    button.addEventListener("pointercancel", release);
    button.addEventListener("lostpointercapture", release);
  }

  bindHoldButton(leftButton, "left");
  bindHoldButton(rightButton, "right");
  bindHoldButton(fireButton, "fire");

  startButton.addEventListener("click", () => {
    if (state === "paused") togglePause();
    else startGame();
  });
  restartButton.addEventListener("click", restartGame);
  pauseButton.addEventListener("click", togglePause);
  soundButton.addEventListener("click", () => {
    muted = !muted;
    soundButton.setAttribute("aria-pressed", String(muted));
    soundButton.setAttribute("aria-label", muted ? "Turn game sound on" : "Mute game sound");
    soundIcon.textContent = muted ? "Sound off" : "Sound on";
    if (!muted) playTone(520, .08, "sine", .025);
  });

  document.getElementById("year").textContent = String(new Date().getFullYear());
  createStars();
  resetGame();
  highScoreElement.textContent = highScore.toLocaleString();
  draw(0);
})();


}
function begin(){poster.hidden=true;gm.hidden=false;if(!booted){booted=true;var s=document.createElement("style");s.textContent=LOOK;document.head.appendChild(s);boot();}else{var r=document.getElementById("startButton");if(r)r.click();}}
poster.addEventListener("click",begin);
var nb=document.getElementById("new");if(nb)nb.addEventListener("click",begin);
})();
