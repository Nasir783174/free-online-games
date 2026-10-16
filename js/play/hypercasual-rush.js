/* Hypercasual Rush - game logic + its own look. Layout lives in style.css; page shell lives in the HTML. */
(function(){"use strict";
var gm=document.getElementById("gm"),poster=document.getElementById("poster"),booted=false;
var LOOK=".gm{\n  \n  \n  --accent: #16b8c4;\n  --action: #ffb84d;\n  --success: #22c55e;\n  --danger: #ef5b5b;\n  --background: #f6f7fb;\n  \n  \n  \n  \n  --game: #111827;\n  --game-secondary: #1f2937;\n  \n}.gm *{ box-sizing: border-box; }.gm button{ -webkit-tap-highlight-color: transparent; }.gm button{ font: inherit; }.gm .page-shell{\n  width: min(1160px, calc(100% - 40px));\n  margin: 0 auto;\n}.gm .category-pill,.gm .status-chip,.gm .coming-soon{\n  border-radius: 999px;\n  font-size: 14px;\n  font-weight: 700;\n}.gm .category-pill{\n  padding: 7px 13px;\n  color: var(--brand-dark);\n  background: #eeeeff;\n}.gm h2,.gm h3{ margin-top: 0; line-height: 1.15; }.gm h2{ font-size: clamp(28px, 3.5vw, 36px); font-weight: 700; letter-spacing: -0.025em; }.gm h3{ font-size: 22px; font-weight: 700; }.gm .game-card{\n  overflow: hidden;\n  background: var(--card);\n  border: 1px solid var(--border);\n  border-radius: 20px;\n  box-shadow: var(--shadow);\n}.gm .scorebar{\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  padding: 14px 18px;\n  background: #fff;\n  border-bottom: 1px solid var(--border);\n}.gm .score-item{\n  min-width: 100px;\n  padding: 4px 14px;\n  border-right: 1px solid var(--border);\n}.gm .score-item span,.gm .score-item strong{ display: block; }.gm .score-item span{ color: var(--muted); font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; }.gm .score-item strong{ font-size: 24px; line-height: 1.2; font-variant-numeric: tabular-nums; }.gm .icon-button{\n  width: 46px;\n  height: 46px;\n  margin-left: auto;\n  color: var(--text);\n  background: var(--background);\n  border: 1px solid var(--border);\n  border-radius: 12px;\n  font-weight: 800;\n  cursor: pointer;\n}.gm .icon-button:disabled{ opacity: 0.45; cursor: not-allowed; }.gm .game-stage{\n  position: relative;\n  overflow: hidden;\n  width: 100%;\n  min-height: 420px;\n  background: var(--game);\n  touch-action: none;\n  user-select: none;\n}.gm #game-canvas{\n  display: block;\n  width: 100%;\n  height: auto;\n  min-height: 420px;\n  max-height: 68vh;\n  object-fit: contain;\n  background: var(--game);\n}.gm .status-chip{\n  position: absolute;\n  top: 16px;\n  right: 16px;\n  z-index: 2;\n  padding: 7px 12px;\n  color: #fff;\n  background: rgba(17, 24, 39, 0.72);\n  border: 1px solid rgba(255, 255, 255, 0.18);\n  backdrop-filter: blur(8px);\n}.gm .status-chip.pop{ animation: chip-pop 240ms ease; }@keyframes chip-pop{\n  50% { transform: scale(1.12); background: rgba(34, 197, 94, 0.86); }\n}.gm .game-overlay{\n  position: absolute;\n  inset: 0;\n  z-index: 3;\n  display: grid;\n  place-items: center;\n  padding: 24px;\n  background: rgba(7, 12, 24, 0.76);\n  backdrop-filter: blur(5px);\n}.gm .game-overlay[hidden]{ display: none; }.gm .overlay-panel{\n  width: min(440px, 100%);\n  padding: 30px;\n  color: #fff;\n  text-align: center;\n  background: rgba(31, 41, 55, 0.97);\n  border: 1px solid rgba(255, 255, 255, 0.14);\n  border-radius: 20px;\n  box-shadow: 0 24px 70px rgba(0, 0, 0, 0.32);\n}.gm .overlay-panel.compact{ max-width: 370px; }.gm .overlay-panel h2{ margin: 10px 0; font-size: 30px; }.gm .overlay-panel p{ margin: 0 0 22px; color: #cfd5e1; }.gm .overlay-icon{\n  display: inline-grid;\n  place-items: center;\n  width: 48px;\n  height: 48px;\n  color: #111827;\n  background: var(--action);\n  border-radius: 14px;\n  font-size: 24px;\n  font-weight: 800;\n  transform: rotate(8deg);\n}.gm .danger-icon{ color: #fff; background: var(--danger); transform: none; }.gm .primary-button{\n  min-width: 170px;\n  min-height: 48px;\n  padding: 11px 22px;\n  color: #fff;\n  background: var(--brand);\n  border: 0;\n  border-radius: 12px;\n  box-shadow: 0 10px 24px rgba(91, 92, 226, 0.35);\n  font-size: 16px;\n  font-weight: 800;\n  cursor: pointer;\n  transition: transform 150ms ease, background 150ms ease;\n}.gm .primary-button:hover{ background: #6b6cf0; transform: translateY(-1px); }.gm .primary-button:active{ transform: translateY(1px); }.gm .shortcut-note{ display: block; margin-top: 14px; color: #98a2b3; font-size: 13px; }.gm .result-label{ margin-bottom: 4px !important; color: var(--action) !important; font-size: 13px; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; }.gm .result-grid{\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 10px;\n  margin: 20px 0;\n}.gm .result-grid div{ padding: 12px; background: rgba(255,255,255,0.07); border-radius: 12px; }.gm .result-grid span,.gm .result-grid strong{ display: block; }.gm .result-grid span{ color: #98a2b3; font-size: 13px; }.gm .result-grid strong{ font-size: 24px; }.gm .mobile-controls{\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 12px;\n  padding: 14px 18px 0;\n}.gm .mobile-controls button{\n  min-height: 58px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 10px;\n  color: var(--brand-dark);\n  background: #f0f0ff;\n  border: 1px solid #dadafb;\n  border-radius: 13px;\n  font-size: 24px;\n  font-weight: 800;\n  cursor: pointer;\n}.gm .mobile-controls button:active{ background: #dfdfff; transform: scale(0.985); }.gm .mobile-controls small{ font-size: 14px; font-weight: 800; }.gm .game-help{\n  margin: 0;\n  padding: 12px 18px 16px;\n  color: var(--muted);\n  text-align: center;\n  font-size: 14px;\n}.gm .steps-list{ margin: 24px 0 0; padding-left: 23px; }.gm .steps-list li{ margin: 11px 0; padding-left: 6px; }.gm .control-row{\n  display: flex;\n  justify-content: space-between;\n  gap: 18px;\n  padding: 13px 0;\n  border-bottom: 1px solid var(--border);\n}.gm .control-row span{ color: var(--muted); }.gm .controls-card p{ margin-bottom: 0; font-size: 15px; }.gm .info-section,.gm .tips-section{ margin-top: 78px; }.gm .info-section{ max-width: 850px; }.gm .info-section p{ color: var(--muted); }.gm .tips-section{\n  padding: 34px;\n  background: #ececff;\n  border-radius: 20px;\n}.gm .tips-grid{\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 18px;\n  margin-top: 26px;\n}.gm .tips-grid article{\n  padding: 22px;\n  background: rgba(255,255,255,0.78);\n  border: 1px solid rgba(91,92,226,0.1);\n  border-radius: 15px;\n}.gm .tips-grid span{ color: var(--brand); font-size: 13px; font-weight: 800; }.gm .tips-grid h3{ margin: 9px 0 8px; }.gm .tips-grid p{ margin: 0; color: var(--muted); font-size: 15px; }.gm .section-heading{\n  display: flex;\n  justify-content: space-between;\n  align-items: end;\n  gap: 20px;\n  margin-bottom: 24px;\n}.gm .section-heading h2{ margin-bottom: 0; }.gm .section-heading > span{ color: var(--muted); font-size: 14px; }.gm .game-thumb{\n  min-height: 150px;\n  display: grid;\n  place-items: center;\n  border-radius: 12px;\n  color: white;\n  font-size: 36px;\n  font-weight: 800;\n}.gm .thumb-purple{ background: #5b5ce2; }.gm .thumb-teal{ background: #1699a5; }.gm .thumb-orange{ background: #e78b27; }.gm .coming-soon{ display: inline-block; padding: 4px 9px; color: var(--muted); background: var(--background); }.gm details{\n  background: var(--card);\n  border: 1px solid var(--border);\n  border-radius: 14px;\n  margin: 12px 0;\n}.gm summary{\n  padding: 18px 20px;\n  font-weight: 700;\n  cursor: pointer;\n}.gm details p{ margin: 0; padding: 0 20px 18px; color: var(--muted); }.gm button:focus-visible,.gm summary:focus-visible{\n  outline: 3px solid rgba(22, 184, 196, 0.55);\n  outline-offset: 3px;\n}@media (min-width: 800px){.gm .mobile-controls{ max-width: 480px; margin: 0 auto; }}@media (max-width: 760px){.gm .page-shell{ width: min(100% - 24px, 1160px); }.gm .category-pill{ display: none; }.gm h2{ font-size: 28px; }.gm .game-card{ border-radius: 16px; }.gm .scorebar{ padding: 10px; }.gm .score-item{ min-width: 0; flex: 1; padding: 2px 8px; }.gm .score-item strong{ font-size: 20px; }.gm .icon-button{ width: 42px; height: 42px; flex: 0 0 42px; }.gm .game-stage,.gm #game-canvas{ min-height: 390px; }.gm #game-canvas{ height: min(62vh, 500px); object-fit: cover; }.gm .overlay-panel{ padding: 24px 18px; }.gm .overlay-panel h2{ font-size: 27px; }.gm .game-overlay{ padding: 16px; }.gm .status-chip{ top: 10px; right: 10px; }.gm .mobile-controls{ padding: 12px 12px 0; }.gm .info-section,.gm .tips-section{ margin-top: 60px; }.gm .tips-section{ padding: 24px 18px; }.gm .tips-grid{ grid-template-columns: 1fr; }.gm .game-thumb{ min-height: 130px; }.gm .section-heading{ align-items: start; flex-direction: column; }}@media (max-width: 390px){.gm .score-item span{ font-size: 11px; }.gm .score-item strong{ font-size: 18px; }.gm .score-item{ padding-left: 5px; padding-right: 5px; }.gm .game-stage,.gm #game-canvas{ min-height: 370px; }}@media (prefers-reduced-motion: reduce){.gm *,.gm *::before,.gm *::after{ animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }}";
function __ready(f){f()}
function boot(){
"use strict";

(() => {
  const canvas = document.getElementById("game-canvas");
  const ctx = canvas.getContext("2d");

  const scoreElement = document.getElementById("score");
  const starsElement = document.getElementById("stars");
  const bestScoreElement = document.getElementById("best-score");
  const multiplierChip = document.getElementById("multiplier-chip");
  const statusElement = document.getElementById("game-status");
  const finalScoreElement = document.getElementById("final-score");
  const finalStarsElement = document.getElementById("final-stars");
  const gameOverTitle = document.getElementById("game-over-title");

  const startOverlay = document.getElementById("start-overlay");
  const pauseOverlay = document.getElementById("pause-overlay");
  const gameOverOverlay = document.getElementById("game-over-overlay");
  const startButton = document.getElementById("start-button");
  const pauseButton = document.getElementById("pause-button");
  const pauseIcon = document.getElementById("pause-icon");
  const resumeButton = document.getElementById("resume-button");
  const restartButton = document.getElementById("restart-button");
  const leftButton = document.getElementById("move-left");
  const rightButton = document.getElementById("move-right");

  const WORLD_WIDTH = 900;
  const WORLD_HEIGHT = 560;
  const ROAD_TOP = 92;
  const ROAD_BOTTOM = 560;
  const ROAD_TOP_HALF = 178;
  const ROAD_BOTTOM_HALF = 410;
  const PLAYER_Y = 448;
  const PLAYER_RADIUS = 25;
  const STORAGE_KEY = "gamesHubHypercasualRushBest";
  const lanes = [-1, 0, 1];

  let state = "ready";
  let animationId = null;
  let lastTime = 0;
  let elapsed = 0;
  let distanceScore = 0;
  let bonusScore = 0;
  let displayedScore = 0;
  let collectedStars = 0;
  let streak = 0;
  let multiplier = 1;
  let speed = 235;
  let spawnTimer = 0;
  let spawnInterval = 0.9;
  let roadOffset = 0;
  let flash = 0;
  let objects = [];
  let particles = [];
  let touchStartX = null;
  let touchStartY = null;
  let audioContext = null;

  const player = {
    lane: 0,
    x: WORLD_WIDTH / 2,
    targetX: WORLD_WIDTH / 2,
    lean: 0
  };

  let bestScore = loadBestScore();
  bestScoreElement.textContent = bestScore.toLocaleString();
  pauseButton.disabled = true;
  document.getElementById("current-year").textContent = new Date().getFullYear();

  function loadBestScore() {
    try {
      const value = Number.parseInt(localStorage.getItem(STORAGE_KEY), 10);
      return Number.isFinite(value) && value > 0 ? value : 0;
    } catch (error) {
      return 0;
    }
  }

  function saveBestScore(value) {
    try {
      localStorage.setItem(STORAGE_KEY, String(value));
    } catch (error) {
      // The game remains fully playable when browser storage is unavailable.
    }
  }

  function roadHalfWidthAt(y) {
    const progress = Math.max(0, Math.min(1, (y - ROAD_TOP) / (ROAD_BOTTOM - ROAD_TOP)));
    return ROAD_TOP_HALF + (ROAD_BOTTOM_HALF - ROAD_TOP_HALF) * progress;
  }

  function laneX(lane, y) {
    const spacing = roadHalfWidthAt(y) * 0.56;
    return WORLD_WIDTH / 2 + lane * spacing;
  }

  function scaleAt(y) {
    const progress = Math.max(0, Math.min(1, (y - ROAD_TOP) / (ROAD_BOTTOM - ROAD_TOP)));
    return 0.45 + progress * 0.7;
  }

  function resetGame() {
    elapsed = 0;
    distanceScore = 0;
    bonusScore = 0;
    displayedScore = 0;
    collectedStars = 0;
    streak = 0;
    multiplier = 1;
    speed = 235;
    spawnTimer = 0;
    spawnInterval = 0.9;
    roadOffset = 0;
    flash = 0;
    objects = [];
    particles = [];
    player.lane = 0;
    player.x = laneX(0, PLAYER_Y);
    player.targetX = player.x;
    player.lean = 0;
    updateHud();
  }

  function startGame() {
    if (animationId !== null) cancelAnimationFrame(animationId);
    resetGame();
    state = "running";
    startOverlay.hidden = true;
    pauseOverlay.hidden = true;
    gameOverOverlay.hidden = true;
    pauseButton.disabled = false;
    pauseIcon.textContent = "Ⅱ";
    pauseButton.setAttribute("aria-label", "Pause game");
    statusElement.textContent = "Run in progress. Dodge barriers and collect stars.";
    lastTime = performance.now();
    animationId = requestAnimationFrame(loop);
  }

  function togglePause() {
    if (state === "running") {
      state = "paused";
      pauseOverlay.hidden = false;
      pauseIcon.textContent = "▶";
      pauseButton.setAttribute("aria-label", "Resume game");
      statusElement.textContent = "Game paused.";
      if (animationId !== null) cancelAnimationFrame(animationId);
      animationId = null;
    } else if (state === "paused") {
      state = "running";
      pauseOverlay.hidden = true;
      pauseIcon.textContent = "Ⅱ";
      pauseButton.setAttribute("aria-label", "Pause game");
      statusElement.textContent = "Run in progress. Dodge barriers and collect stars.";
      lastTime = performance.now();
      animationId = requestAnimationFrame(loop);
    }
  }

  function endGame() {
    state = "over";
    animationId = null;
    pauseButton.disabled = true;
    const finalScore = Math.floor(distanceScore + bonusScore);
    let isNewBest = false;
    if (finalScore > bestScore) {
      bestScore = finalScore;
      saveBestScore(bestScore);
      isNewBest = true;
    }
    updateHud();
    finalScoreElement.textContent = finalScore.toLocaleString();
    finalStarsElement.textContent = collectedStars.toLocaleString();
    gameOverTitle.textContent = isNewBest ? "New best score!" : "Nice run!";
    gameOverOverlay.hidden = false;
    statusElement.textContent = `Game over. Final score: ${finalScore.toLocaleString()}.`;
    playTone(115, 0.16, "sawtooth", 0.035);
  }

  function move(direction) {
    if (state !== "running") return;
    const nextLane = Math.max(-1, Math.min(1, player.lane + direction));
    if (nextLane === player.lane) return;
    player.lane = nextLane;
    player.targetX = laneX(player.lane, PLAYER_Y);
    player.lean = direction * 1;
    playTone(220, 0.04, "sine", 0.018);
  }

  function spawnPattern() {
    const obstacleCount = Math.random() < Math.min(0.18 + elapsed / 150, 0.37) ? 2 : 1;
    const shuffled = [...lanes].sort(() => Math.random() - 0.5);
    const blocked = shuffled.slice(0, obstacleCount);

    blocked.forEach((lane, index) => {
      objects.push({
        type: "barrier",
        lane,
        y: ROAD_TOP - 50 - index * 8,
        checked: false,
        wobble: Math.random() * Math.PI * 2
      });
    });

    const safeLanes = lanes.filter(lane => !blocked.includes(lane));
    if (Math.random() < 0.78 && safeLanes.length) {
      const starLane = safeLanes[Math.floor(Math.random() * safeLanes.length)];
      objects.push({
        type: "star",
        lane: starLane,
        y: ROAD_TOP - 102,
        rotation: Math.random() * Math.PI * 2,
        checked: false
      });
    }
  }

  function update(delta) {
    elapsed += delta;
    speed = Math.min(515, 235 + elapsed * 5.2);
    distanceScore += delta * (10 + speed * 0.018);
    roadOffset = (roadOffset + speed * delta) % 100;
    spawnInterval = Math.max(0.54, 0.95 - elapsed * 0.0045);
    spawnTimer += delta;

    if (spawnTimer >= spawnInterval) {
      spawnTimer -= spawnInterval;
      spawnPattern();
    }

    player.x += (player.targetX - player.x) * Math.min(1, delta * 15);
    player.lean *= Math.max(0, 1 - delta * 8);

    for (const object of objects) {
      object.y += speed * delta;
      if (object.type === "star") object.rotation += delta * 3.8;

      if (!object.checked && object.type === "barrier" && object.y >= PLAYER_Y - 26) {
        object.checked = true;
        if (object.lane === player.lane) {
          createBurst(player.x, PLAYER_Y, "#ef5b5b", 22);
          flash = 1;
          endGame();
          return;
        }
      }

      if (!object.checked && object.type === "star") {
        if (object.lane === player.lane && object.y >= PLAYER_Y - 28) {
          object.checked = true;
          collectStar(object);
        } else if (object.y > PLAYER_Y + 28) {
          object.checked = true;
          streak = 0;
          multiplier = 1;
          updateMultiplier();
        }
      }
    }

    objects = objects.filter(object => object.y < WORLD_HEIGHT + 90 && !(object.type === "star" && object.collected));
    updateParticles(delta);
    if (flash > 0) flash = Math.max(0, flash - delta * 3.5);
    updateHud();
  }

  function collectStar(object) {
    object.collected = true;
    collectedStars += 1;
    streak += 1;
    multiplier = Math.min(5, 1 + Math.floor(streak / 3));
    bonusScore += 25 * multiplier;
    const x = laneX(object.lane, object.y);
    createBurst(x, object.y, "#ffcf5a", 14);
    updateMultiplier(true);
    playTone(520 + multiplier * 70, 0.07, "triangle", 0.035);
  }

  function createBurst(x, y, color, count) {
    for (let i = 0; i < count; i += 1) {
      const angle = Math.random() * Math.PI * 2;
      const force = 50 + Math.random() * 130;
      particles.push({
        x,
        y,
        vx: Math.cos(angle) * force,
        vy: Math.sin(angle) * force,
        life: 0.45 + Math.random() * 0.35,
        maxLife: 0.8,
        size: 3 + Math.random() * 5,
        color
      });
    }
  }

  function updateParticles(delta) {
    for (const particle of particles) {
      particle.life -= delta;
      particle.x += particle.vx * delta;
      particle.y += particle.vy * delta;
      particle.vy += 95 * delta;
    }
    particles = particles.filter(particle => particle.life > 0);
  }

  function updateMultiplier(animate = false) {
    multiplierChip.textContent = `x${multiplier} streak`;
    if (animate) {
      multiplierChip.classList.remove("pop");
      void multiplierChip.offsetWidth;
      multiplierChip.classList.add("pop");
    }
  }

  function updateHud() {
    displayedScore = Math.floor(distanceScore + bonusScore);
    scoreElement.textContent = displayedScore.toLocaleString();
    starsElement.textContent = collectedStars.toLocaleString();
    bestScoreElement.textContent = Math.max(bestScore, displayedScore).toLocaleString();
    updateMultiplier();
  }

  function draw() {
    ctx.clearRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
    drawBackground();
    drawRoad();
    drawObjects();
    drawPlayer();
    drawParticles();
    if (flash > 0) {
      ctx.fillStyle = `rgba(239, 91, 91, ${flash * 0.34})`;
      ctx.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
    }
  }

  function drawBackground() {
    const gradient = ctx.createLinearGradient(0, 0, 0, WORLD_HEIGHT);
    gradient.addColorStop(0, "#172033");
    gradient.addColorStop(1, "#0b1020");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

    ctx.fillStyle = "rgba(91, 92, 226, 0.12)";
    for (let i = 0; i < 11; i += 1) {
      const x = (i * 127 + 45) % WORLD_WIDTH;
      const y = 30 + (i * 47) % 205;
      ctx.beginPath();
      ctx.arc(x, y, 2 + (i % 3), 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = "#10182a";
    for (let i = 0; i < 12; i += 1) {
      const width = 42 + (i % 4) * 14;
      const height = 42 + (i % 5) * 18;
      const x = i * 82 - 20;
      ctx.fillRect(x, ROAD_TOP - height + 28, width, height);
    }

    ctx.fillStyle = "#ffc857";
    for (let i = 0; i < 18; i += 1) {
      const x = 18 + (i * 53) % WORLD_WIDTH;
      const y = 45 + (i * 37) % 70;
      ctx.globalAlpha = 0.25 + (i % 3) * 0.12;
      ctx.fillRect(x, y, 4, 7);
    }
    ctx.globalAlpha = 1;
  }

  function drawRoad() {
    ctx.beginPath();
    ctx.moveTo(WORLD_WIDTH / 2 - ROAD_TOP_HALF, ROAD_TOP);
    ctx.lineTo(WORLD_WIDTH / 2 + ROAD_TOP_HALF, ROAD_TOP);
    ctx.lineTo(WORLD_WIDTH / 2 + ROAD_BOTTOM_HALF, ROAD_BOTTOM);
    ctx.lineTo(WORLD_WIDTH / 2 - ROAD_BOTTOM_HALF, ROAD_BOTTOM);
    ctx.closePath();
    const roadGradient = ctx.createLinearGradient(0, ROAD_TOP, 0, ROAD_BOTTOM);
    roadGradient.addColorStop(0, "#263247");
    roadGradient.addColorStop(1, "#172033");
    ctx.fillStyle = roadGradient;
    ctx.fill();

    ctx.strokeStyle = "rgba(22, 184, 196, 0.62)";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(WORLD_WIDTH / 2 - ROAD_TOP_HALF, ROAD_TOP);
    ctx.lineTo(WORLD_WIDTH / 2 - ROAD_BOTTOM_HALF, ROAD_BOTTOM);
    ctx.moveTo(WORLD_WIDTH / 2 + ROAD_TOP_HALF, ROAD_TOP);
    ctx.lineTo(WORLD_WIDTH / 2 + ROAD_BOTTOM_HALF, ROAD_BOTTOM);
    ctx.stroke();

    for (const fraction of [-0.28, 0.28]) {
      for (let y = ROAD_TOP - 90 + roadOffset; y < ROAD_BOTTOM; y += 100) {
        const y2 = Math.min(y + 48, ROAD_BOTTOM);
        if (y2 < ROAD_TOP) continue;
        const startY = Math.max(y, ROAD_TOP);
        const x1 = WORLD_WIDTH / 2 + roadHalfWidthAt(startY) * fraction * 2;
        const x2 = WORLD_WIDTH / 2 + roadHalfWidthAt(y2) * fraction * 2;
        ctx.strokeStyle = "rgba(255,255,255,0.22)";
        ctx.lineWidth = 3 + scaleAt(startY) * 2;
        ctx.beginPath();
        ctx.moveTo(x1, startY);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }
    }

    const glow = ctx.createLinearGradient(0, 370, 0, WORLD_HEIGHT);
    glow.addColorStop(0, "rgba(91,92,226,0)");
    glow.addColorStop(1, "rgba(91,92,226,0.12)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 330, WORLD_WIDTH, WORLD_HEIGHT - 330);
  }

  function drawObjects() {
    const ordered = [...objects].sort((a, b) => a.y - b.y);
    for (const object of ordered) {
      if (object.collected) continue;
      const x = laneX(object.lane, object.y);
      const scale = scaleAt(object.y);
      if (object.type === "barrier") drawBarrier(x, object.y, scale, object.wobble);
      else drawStar(x, object.y, 17 * scale, object.rotation);
    }
  }

  function drawBarrier(x, y, scale, wobble) {
    const width = 68 * scale;
    const height = 54 * scale;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(Math.sin(elapsed * 2 + wobble) * 0.012);
    ctx.shadowColor = "rgba(239,91,91,0.38)";
    ctx.shadowBlur = 18 * scale;
    ctx.fillStyle = "#ef5b5b";
    roundedRect(ctx, -width / 2, -height / 2, width, height, 10 * scale);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle = "rgba(255,255,255,0.82)";
    const stripeWidth = 10 * scale;
    for (let i = -2; i <= 2; i += 2) {
      ctx.save();
      ctx.rotate(-0.42);
      ctx.fillRect(i * stripeWidth - stripeWidth / 2, -height * 0.56, stripeWidth, height * 1.12);
      ctx.restore();
    }
    ctx.fillStyle = "#bf3f4c";
    ctx.fillRect(-width * 0.38, height * 0.45, width * 0.12, height * 0.26);
    ctx.fillRect(width * 0.26, height * 0.45, width * 0.12, height * 0.26);
    ctx.restore();
  }

  function drawStar(x, y, radius, rotation) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.shadowColor = "rgba(255,184,77,0.8)";
    ctx.shadowBlur = radius * 1.25;
    ctx.fillStyle = "#ffca50";
    ctx.beginPath();
    for (let i = 0; i < 10; i += 1) {
      const angle = -Math.PI / 2 + i * Math.PI / 5;
      const currentRadius = i % 2 === 0 ? radius : radius * 0.46;
      const px = Math.cos(angle) * currentRadius;
      const py = Math.sin(angle) * currentRadius;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  function drawPlayer() {
    const bob = state === "running" ? Math.sin(elapsed * 9) * 3 : 0;
    ctx.save();
    ctx.translate(player.x, PLAYER_Y + bob);
    ctx.rotate(player.lean * 0.13);

    ctx.fillStyle = "rgba(0,0,0,0.32)";
    ctx.beginPath();
    ctx.ellipse(0, 30, 32, 10, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.shadowColor = "rgba(91,92,226,0.75)";
    ctx.shadowBlur = 25;
    const playerGradient = ctx.createLinearGradient(-25, -25, 25, 26);
    playerGradient.addColorStop(0, "#7475f2");
    playerGradient.addColorStop(1, "#4546b8");
    ctx.fillStyle = playerGradient;
    ctx.beginPath();
    ctx.moveTo(0, -33);
    ctx.quadraticCurveTo(28, -18, 25, 13);
    ctx.quadraticCurveTo(20, 30, 0, 31);
    ctx.quadraticCurveTo(-20, 30, -25, 13);
    ctx.quadraticCurveTo(-28, -18, 0, -33);
    ctx.closePath();
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.fillStyle = "#dffbff";
    ctx.beginPath();
    ctx.ellipse(0, -5, 12, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#16b8c4";
    ctx.beginPath();
    ctx.arc(0, -5, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#ffb84d";
    ctx.beginPath();
    ctx.moveTo(-12, 31);
    ctx.lineTo(-3, 31);
    ctx.lineTo(-8, 44 + Math.random() * 4);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(3, 31);
    ctx.lineTo(12, 31);
    ctx.lineTo(8, 44 + Math.random() * 4);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  function drawParticles() {
    for (const particle of particles) {
      ctx.globalAlpha = Math.max(0, particle.life / particle.maxLife);
      ctx.fillStyle = particle.color;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  function roundedRect(context, x, y, width, height, radius) {
    const safeRadius = Math.min(radius, width / 2, height / 2);
    context.beginPath();
    context.moveTo(x + safeRadius, y);
    context.arcTo(x + width, y, x + width, y + height, safeRadius);
    context.arcTo(x + width, y + height, x, y + height, safeRadius);
    context.arcTo(x, y + height, x, y, safeRadius);
    context.arcTo(x, y, x + width, y, safeRadius);
    context.closePath();
  }

  function playTone(frequency, duration, type, volume) {
    try {
      if (!audioContext) audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      oscillator.type = type;
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(volume, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + duration);
      oscillator.connect(gain);
      gain.connect(audioContext.destination);
      oscillator.start();
      oscillator.stop(audioContext.currentTime + duration);
    } catch (error) {
      // Audio feedback is optional; input and gameplay never depend on it.
    }
  }

  function loop(timestamp) {
    if (state !== "running") return;
    const delta = Math.min((timestamp - lastTime) / 1000, 0.034);
    lastTime = timestamp;
    update(delta);
    draw();
    if (state === "running") animationId = requestAnimationFrame(loop);
  }

  function handleKeydown(event) {
    const key = event.key.toLowerCase();
    if (["arrowleft", "arrowright", " "].includes(key)) event.preventDefault();
    if (key === "arrowleft" || key === "a") move(-1);
    if (key === "arrowright" || key === "d") move(1);
    if (key === "p" || key === " ") {
      if (state === "running" || state === "paused") togglePause();
    }
    if (key === "enter" && (state === "ready" || state === "over")) startGame();
  }

  function handleTouchStart(event) {
    const touch = event.changedTouches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
  }

  function handleTouchEnd(event) {
    if (touchStartX === null || touchStartY === null || state !== "running") return;
    const touch = event.changedTouches[0];
    const dx = touch.clientX - touchStartX;
    const dy = touch.clientY - touchStartY;
    if (Math.abs(dx) > 32 && Math.abs(dx) > Math.abs(dy) * 1.15) move(dx > 0 ? 1 : -1);
    touchStartX = null;
    touchStartY = null;
  }

  startButton.addEventListener("click", startGame);
  restartButton.addEventListener("click", startGame);
  pauseButton.addEventListener("click", togglePause);
  resumeButton.addEventListener("click", togglePause);
  leftButton.addEventListener("pointerdown", event => { event.preventDefault(); move(-1); });
  rightButton.addEventListener("pointerdown", event => { event.preventDefault(); move(1); });
  document.addEventListener("keydown", handleKeydown);
  canvas.addEventListener("touchstart", handleTouchStart, { passive: true });
  canvas.addEventListener("touchend", handleTouchEnd, { passive: true });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden && state === "running") togglePause();
  });

  draw();
})();


}
function begin(){poster.hidden=true;gm.hidden=false;if(!booted){booted=true;var s=document.createElement("style");s.textContent=LOOK;document.head.appendChild(s);boot();}else{var r=document.getElementById("start-button");if(r)r.click();}}
poster.addEventListener("click",begin);
var nb=document.getElementById("new");if(nb)nb.addEventListener("click",begin);
})();
