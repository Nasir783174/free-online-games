/* Volleyball - game logic + its own look. Layout lives in style.css; page shell lives in the HTML. */
(function(){"use strict";
var gm=document.getElementById("gm"),poster=document.getElementById("poster"),booted=false;
var LOOK=".gm{\n  \n  \n  --accent: #16b8c4;\n  --action: #ffb84d;\n  --danger: #ef5b5b;\n  --background: #f6f7fb;\n  \n  \n  \n  \n  --court-sky: #bfe9f2;\n  --court-sand: #f4cf7b;\n  \n}.gm *{\n  box-sizing: border-box;\n}.gm button{\n  font: inherit;\n}.gm button{\n  -webkit-tap-highlight-color: transparent;\n}.gm .page-shell{\n  width: min(1160px, calc(100% - 40px));\n  margin-inline: auto;\n}.gm .page-shell{\n  padding-block: 24px 80px;\n}.gm h2,.gm h3,.gm p{\n  margin-top: 0;\n}.gm h2{\n  margin-bottom: 16px;\n  font-size: clamp(28px, 4vw, 35px);\n  font-weight: 800;\n  line-height: 1.2;\n  letter-spacing: -0.025em;\n}.gm .game-section{\n  scroll-margin-top: 20px;\n}.gm .scoreboard{\n  display: grid;\n  grid-template-columns: 1fr auto 1fr;\n  align-items: center;\n  min-height: 88px;\n  padding: 14px 24px;\n  border: 1px solid var(--border);\n  border-radius: 18px 18px 0 0;\n  background: var(--card);\n}.gm .team-score{\n  display: flex;\n  gap: 18px;\n  align-items: center;\n}.gm .cpu-score{\n  justify-content: flex-end;\n}.gm .team-score strong{\n  font-size: 32px;\n  font-weight: 800;\n  line-height: 1;\n  font-variant-numeric: tabular-nums;\n}.gm .team-label{\n  display: inline-flex;\n  gap: 8px;\n  align-items: center;\n  font-weight: 800;\n}.gm .team-dot{\n  width: 11px;\n  height: 11px;\n  border-radius: 50%;\n}.gm .player-dot{\n  background: var(--brand);\n}.gm .cpu-dot{\n  background: var(--danger);\n}.gm .match-status{\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  text-align: center;\n}.gm .match-status span{\n  color: var(--muted);\n  font-size: 13px;\n  font-weight: 800;\n  letter-spacing: 0.06em;\n  text-transform: uppercase;\n}.gm .match-status strong{\n  max-width: 260px;\n  font-size: 17px;\n  line-height: 1.35;\n}.gm .game-card{\n  overflow: hidden;\n  border: 1px solid var(--border);\n  border-top: 0;\n  border-radius: 0 0 18px 18px;\n  background: var(--card);\n  box-shadow: var(--shadow);\n}.gm .canvas-wrap{\n  position: relative;\n  overflow: hidden;\n  width: 100%;\n  aspect-ratio: 16 / 9;\n  background: #111827;\n}.gm canvas{\n  display: block;\n  width: 100%;\n  height: 100%;\n  outline: none;\n  touch-action: none;\n}.gm canvas:focus-visible{\n  box-shadow: inset 0 0 0 4px var(--action);\n}.gm .game-overlay{\n  position: absolute;\n  inset: 0;\n  display: grid;\n  padding: 24px;\n  place-items: center;\n  background: rgba(17, 24, 39, 0.68);\n  backdrop-filter: blur(4px);\n  transition: opacity 180ms ease;\n}.gm .game-overlay.is-hidden{\n  visibility: hidden;\n  opacity: 0;\n  pointer-events: none;\n}.gm .overlay-panel{\n  width: min(440px, 100%);\n  padding: 30px;\n  border: 1px solid rgba(255, 255, 255, 0.35);\n  border-radius: 18px;\n  color: #fff;\n  background: rgba(31, 41, 55, 0.93);\n  text-align: center;\n}.gm .overlay-icon{\n  display: block;\n  margin-bottom: 8px;\n  font-size: 46px;\n  line-height: 1;\n}.gm .overlay-panel h2{\n  margin-bottom: 8px;\n  font-size: 32px;\n}.gm .overlay-panel p{\n  margin-bottom: 22px;\n  color: #d5dae5;\n}.gm .button{\n  min-height: 46px;\n  padding: 0 20px;\n  border: 0;\n  border-radius: 12px;\n  font-size: 16px;\n  font-weight: 800;\n  cursor: pointer;\n  transition: transform 120ms ease, background-color 120ms ease, box-shadow 120ms ease;\n}.gm .button:hover{\n  transform: translateY(-1px);\n}.gm .button:active{\n  transform: translateY(0);\n}.gm .button:focus-visible,.gm .touch-button:focus-visible,.gm summary:focus-visible{\n  outline: 3px solid var(--action);\n  outline-offset: 3px;\n}.gm .button-primary{\n  color: #fff;\n  background: var(--brand);\n  box-shadow: 0 8px 22px rgba(91, 92, 226, 0.35);\n}.gm .button-primary:hover{\n  background: var(--brand-dark);\n}.gm .button-secondary{\n  color: var(--text);\n  background: #eef0f6;\n}.gm .button-secondary:hover{\n  background: #e3e6f0;\n}.gm .game-toolbar{\n  display: flex;\n  gap: 20px;\n  align-items: center;\n  justify-content: space-between;\n  padding: 18px 20px;\n}.gm .control-hint,.gm .toolbar-actions{\n  display: flex;\n  flex-wrap: wrap;\n  gap: 10px;\n  align-items: center;\n}.gm .control-hint{\n  gap: 18px;\n  color: var(--muted);\n  font-size: 14px;\n  font-weight: 700;\n}.gm kbd{\n  display: inline-grid;\n  min-width: 27px;\n  min-height: 27px;\n  margin-right: 3px;\n  padding: 2px 6px;\n  place-items: center;\n  border: 1px solid #ced2dd;\n  border-bottom-width: 3px;\n  border-radius: 7px;\n  color: var(--text);\n  background: #fff;\n  font-family: inherit;\n  font-size: 13px;\n  line-height: 1;\n}.gm .touch-controls{\n  display: none;\n  grid-template-columns: 1fr 1.25fr 1fr;\n  gap: 12px;\n  max-width: 520px;\n  margin: 18px auto 0;\n  padding-bottom: env(safe-area-inset-bottom);\n}.gm .touch-button{\n  min-height: 58px;\n  border: 1px solid #d6d9e4;\n  border-bottom-width: 4px;\n  border-radius: 14px;\n  color: var(--text);\n  background: #fff;\n  font-size: 23px;\n  font-weight: 800;\n  user-select: none;\n  touch-action: none;\n}.gm .touch-button.is-pressed,.gm .touch-button:active{\n  border-bottom-width: 1px;\n  transform: translateY(3px);\n  background: #ececff;\n}.gm .jump-button{\n  color: #fff;\n  border-color: var(--brand-dark);\n  background: var(--brand);\n  font-size: 17px;\n}.gm .jump-button.is-pressed,.gm .jump-button:active{\n  background: var(--brand-dark);\n}.gm .primary-content{\n  border-top: 4px solid var(--brand);\n}.gm .steps{\n  display: grid;\n  gap: 13px;\n  margin: 24px 0 0;\n  padding-left: 24px;\n}.gm .steps li::marker{\n  color: var(--brand);\n  font-weight: 800;\n}.gm .controls-card{\n  color: #fff;\n  border-color: #253249;\n  background: #1f2937;\n}.gm .controls-card h2{\n  color: #fff;\n  font-size: 27px;\n}.gm .controls-card p{\n  margin: 20px 0 0;\n  color: #c9d0dc;\n  font-size: 15px;\n}.gm .control-row{\n  display: flex;\n  gap: 12px;\n  justify-content: space-between;\n  padding: 12px 0;\n  border-bottom: 1px solid #39465a;\n}.gm .control-row span{\n  color: #c9d0dc;\n}.gm .tips-list{\n  color: var(--muted);\n}.gm .tips-list{\n  display: grid;\n  gap: 11px;\n  margin: 0;\n  padding-left: 22px;\n}.gm .tips-list li::marker{\n  color: var(--accent);\n}.gm .section-heading{\n  display: flex;\n  gap: 30px;\n  align-items: end;\n  justify-content: space-between;\n  margin-bottom: 24px;\n}.gm .section-heading h2,.gm .section-heading p{\n  margin-bottom: 0;\n}.gm .section-heading > p{\n  max-width: 420px;\n  color: var(--muted);\n  text-align: right;\n}.gm details{\n  margin-top: 12px;\n  padding: 0 20px;\n  border: 1px solid var(--border);\n  border-radius: 14px;\n  background: var(--card);\n}.gm summary{\n  padding: 18px 32px 18px 0;\n  font-weight: 800;\n  cursor: pointer;\n}.gm details p{\n  padding-right: 28px;\n  color: var(--muted);\n}.gm .sr-only{\n  position: absolute;\n  width: 1px;\n  height: 1px;\n  padding: 0;\n  margin: -1px;\n  overflow: hidden;\n  clip: rect(0, 0, 0, 0);\n  white-space: nowrap;\n  border: 0;\n}@media (max-width: 820px){.gm .touch-controls{\n    display: grid;\n  }.gm .control-hint{\n    display: none;\n  }.gm .game-toolbar{\n    justify-content: center;\n  }}@media (max-width: 620px){.gm .page-shell{\n    width: min(100% - 24px, 1160px);\n  }.gm .page-shell{\n    padding-block: 18px 60px;\n  }.gm .scoreboard{\n    min-height: 74px;\n    padding: 10px 14px;\n    border-radius: 14px 14px 0 0;\n  }.gm .team-score{\n    gap: 8px;\n  }.gm .team-label{\n    font-size: 14px;\n  }.gm .team-score strong{\n    font-size: 26px;\n  }.gm .match-status span{\n    font-size: 10px;\n  }.gm .match-status strong{\n    max-width: 128px;\n    font-size: 13px;\n  }.gm .game-card{\n    border-radius: 0 0 14px 14px;\n  }.gm .canvas-wrap{\n    min-height: 230px;\n    aspect-ratio: auto;\n  }.gm .game-toolbar{\n    padding: 14px;\n  }.gm .button{\n    min-height: 44px;\n    padding-inline: 16px;\n    font-size: 15px;\n  }.gm .overlay-panel{\n    padding: 20px;\n  }.gm .overlay-icon{\n    font-size: 34px;\n  }.gm .overlay-panel h2{\n    font-size: 25px;\n  }.gm .overlay-panel p{\n    margin-bottom: 16px;\n    font-size: 14px;\n    line-height: 1.45;\n  }.gm .section-heading{\n    display: block;\n  }.gm .section-heading > p{\n    margin-top: 8px;\n    text-align: left;\n  }}@media (prefers-reduced-motion: reduce){.gm *,.gm *::before,.gm *::after{\n    scroll-behavior: auto !important;\n    transition-duration: 0.01ms !important;\n  }}";
function __ready(f){f()}
function boot(){
"use strict";

(() => {
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");
  const playerScoreEl = document.getElementById("playerScore");
  const cpuScoreEl = document.getElementById("cpuScore");
  const statusText = document.getElementById("statusText");
  const liveStatus = document.getElementById("liveStatus");
  const overlay = document.getElementById("gameOverlay");
  const overlayIcon = document.getElementById("overlayIcon");
  const overlayTitle = document.getElementById("overlayTitle");
  const overlayMessage = document.getElementById("overlayMessage");
  const overlayButton = document.getElementById("overlayButton");
  const pauseButton = document.getElementById("pauseButton");
  const restartButton = document.getElementById("restartButton");
  const leftButton = document.getElementById("moveLeft");
  const rightButton = document.getElementById("moveRight");
  const jumpButton = document.getElementById("jump");

  const WORLD = {
    width: 960,
    height: 540,
    floorY: 460,
    netX: 480,
    netTop: 235,
    netWidth: 14,
    gravity: 0.48,
    playerGravity: 0.62,
    winningScore: 7,
    winningLead: 2
  };

  const keys = { left: false, right: false, jump: false };
  const state = {
    mode: "ready",
    playerScore: 0,
    cpuScore: 0,
    servingSide: "player",
    rallyDelay: 0,
    lastTime: 0,
    accumulator: 0,
    flash: 0,
    message: "Ready to serve?",
    particles: []
  };

  const player = createPlayer(185, "#5B5CE2", "#4546B8");
  const cpu = createPlayer(775, "#EF5B5B", "#C83F4B");
  const ball = {
    x: 245,
    y: 175,
    vx: 0,
    vy: 0,
    radius: 17,
    rotation: 0,
    spin: 0,
    active: false
  };

  function createPlayer(x, color, darkColor) {
    return {
      x,
      y: WORLD.floorY - 35,
      vx: 0,
      vy: 0,
      radius: 35,
      color,
      darkColor,
      onGround: true,
      jumpHeld: false
    };
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function resetPositions(side = state.servingSide) {
    Object.assign(player, { x: 185, y: WORLD.floorY - player.radius, vx: 0, vy: 0, onGround: true });
    Object.assign(cpu, { x: 775, y: WORLD.floorY - cpu.radius, vx: 0, vy: 0, onGround: true });
    ball.x = side === "player" ? 250 : 710;
    ball.y = 170;
    ball.vx = 0;
    ball.vy = 0;
    ball.spin = 0;
    ball.rotation = 0;
    ball.active = false;
  }

  function serveBall() {
    const fromPlayer = state.servingSide === "player";
    ball.x = fromPlayer ? 250 : 710;
    ball.y = 175;
    ball.vx = fromPlayer ? 4.25 : -4.25;
    ball.vy = -3.3;
    ball.spin = fromPlayer ? 0.055 : -0.055;
    ball.active = true;
    state.message = fromPlayer ? "Your serve" : "CPU serves";
    statusText.textContent = state.message;
  }

  function startMatch() {
    state.playerScore = 0;
    state.cpuScore = 0;
    state.mode = "playing";
    state.servingSide = "player";
    state.rallyDelay = 42;
    state.message = "Get ready";
    state.particles.length = 0;
    resetPositions("player");
    updateScoreboard();
    hideOverlay();
    pauseButton.textContent = "Pause";
    pauseButton.setAttribute("aria-pressed", "false");
    canvas.focus({ preventScroll: true });
  }

  function showOverlay(icon, title, message, buttonText) {
    overlayIcon.textContent = icon;
    overlayTitle.textContent = title;
    overlayMessage.textContent = message;
    overlayButton.textContent = buttonText;
    overlay.classList.remove("is-hidden");
  }

  function hideOverlay() {
    overlay.classList.add("is-hidden");
  }

  function togglePause(forcePause = false) {
    if (state.mode === "ready" || state.mode === "gameover") return;

    if (state.mode === "paused" && !forcePause) {
      state.mode = "playing";
      state.lastTime = performance.now();
      hideOverlay();
      pauseButton.textContent = "Pause";
      pauseButton.setAttribute("aria-pressed", "false");
      statusText.textContent = state.message;
      canvas.focus({ preventScroll: true });
      return;
    }

    if (state.mode === "playing") {
      state.mode = "paused";
      clearInputs();
      showOverlay("⏸", "Match Paused", "Take a break. Your score and the current rally are saved.", "Resume Match");
      pauseButton.textContent = "Resume";
      pauseButton.setAttribute("aria-pressed", "true");
      statusText.textContent = "Paused";
    }
  }

  function updateScoreboard() {
    playerScoreEl.textContent = String(state.playerScore);
    cpuScoreEl.textContent = String(state.cpuScore);
    statusText.textContent = state.message;
  }

  function announce(message) {
    liveStatus.textContent = "";
    window.setTimeout(() => {
      liveStatus.textContent = message;
    }, 20);
  }

  function clearInputs() {
    keys.left = false;
    keys.right = false;
    keys.jump = false;
    [leftButton, rightButton, jumpButton].forEach((button) => button.classList.remove("is-pressed"));
  }

  function updatePlayer(p, direction, wantsJump, minX, maxX, speed) {
    const targetVx = direction * speed;
    p.vx += (targetVx - p.vx) * (p.onGround ? 0.27 : 0.11);

    if (direction === 0 && p.onGround) p.vx *= 0.78;

    if (wantsJump && p.onGround && !p.jumpHeld) {
      p.vy = -11.8;
      p.onGround = false;
    }
    p.jumpHeld = wantsJump;

    p.vy += WORLD.playerGravity;
    p.x += p.vx;
    p.y += p.vy;
    p.x = clamp(p.x, minX + p.radius, maxX - p.radius);

    const groundY = WORLD.floorY - p.radius;
    if (p.y >= groundY) {
      p.y = groundY;
      p.vy = 0;
      p.onGround = true;
    }
  }

  function updateCpu() {
    let targetX = 765;
    if (ball.active) {
      if (ball.x > WORLD.netX || ball.vx > 0) {
        targetX = clamp(ball.x + ball.vx * 7, WORLD.netX + 58, WORLD.width - 48);
      } else {
        targetX = 740;
      }
    }

    const difference = targetX - cpu.x;
    const direction = Math.abs(difference) < 9 ? 0 : Math.sign(difference);
    const ballNear = ball.active && ball.x > WORLD.netX - 25 && Math.abs(ball.x - cpu.x) < 98;
    const descending = ball.vy > -1.4;
    const jumpHeight = ball.y < cpu.y + 24 && ball.y > 245;
    const wantsJump = ballNear && descending && jumpHeight;
    updatePlayer(cpu, direction, wantsJump, WORLD.netX + WORLD.netWidth / 2, WORLD.width, 4.65);
  }

  function collideBallWithPlayer(p) {
    const dx = ball.x - p.x;
    const dy = ball.y - p.y;
    const minDistance = ball.radius + p.radius;
    const distanceSquared = dx * dx + dy * dy;

    if (distanceSquared >= minDistance * minDistance || distanceSquared === 0) return;

    const distance = Math.sqrt(distanceSquared);
    const nx = dx / distance;
    const ny = dy / distance;
    const overlap = minDistance - distance;
    ball.x += nx * overlap;
    ball.y += ny * overlap;

    const relativeVx = ball.vx - p.vx;
    const relativeVy = ball.vy - p.vy;
    const closingSpeed = relativeVx * nx + relativeVy * ny;

    if (closingSpeed < 0) {
      const impulse = -(1.7 * closingSpeed);
      ball.vx += impulse * nx + p.vx * 0.16;
      ball.vy += impulse * ny + p.vy * 0.16;
    }

    ball.vx = clamp(ball.vx, -9.4, 9.4);
    ball.vy = clamp(ball.vy, -13.5, 10);
    ball.spin += p.vx * 0.008;
  }

  function collideBallWithNet() {
    const halfWidth = WORLD.netWidth / 2;
    const left = WORLD.netX - halfWidth;
    const right = WORLD.netX + halfWidth;

    const topDx = ball.x - WORLD.netX;
    const topDy = ball.y - WORLD.netTop;
    const postRadius = ball.radius + 8;
    if (topDx * topDx + topDy * topDy < postRadius * postRadius && ball.y < WORLD.netTop + 18) {
      const distance = Math.max(0.001, Math.hypot(topDx, topDy));
      const nx = topDx / distance;
      const ny = topDy / distance;
      ball.x = WORLD.netX + nx * postRadius;
      ball.y = WORLD.netTop + ny * postRadius;
      const dot = ball.vx * nx + ball.vy * ny;
      if (dot < 0) {
        ball.vx -= 1.65 * dot * nx;
        ball.vy -= 1.65 * dot * ny;
      }
      return;
    }

    if (ball.y + ball.radius > WORLD.netTop && ball.y - ball.radius < WORLD.floorY && ball.x + ball.radius > left && ball.x - ball.radius < right) {
      if (ball.x < WORLD.netX) {
        ball.x = left - ball.radius;
        ball.vx = -Math.abs(ball.vx) * 0.72;
      } else {
        ball.x = right + ball.radius;
        ball.vx = Math.abs(ball.vx) * 0.72;
      }
    }
  }

  function updateBall() {
    if (!ball.active) return;

    ball.vy += WORLD.gravity;
    ball.x += ball.vx;
    ball.y += ball.vy;
    ball.rotation += ball.vx * 0.018 + ball.spin;
    ball.vx *= 0.999;
    ball.spin *= 0.995;

    if (ball.x - ball.radius < 0) {
      ball.x = ball.radius;
      ball.vx = Math.abs(ball.vx) * 0.84;
    } else if (ball.x + ball.radius > WORLD.width) {
      ball.x = WORLD.width - ball.radius;
      ball.vx = -Math.abs(ball.vx) * 0.84;
    }

    if (ball.y - ball.radius < 12) {
      ball.y = 12 + ball.radius;
      ball.vy = Math.abs(ball.vy) * 0.82;
    }

    collideBallWithNet();
    collideBallWithPlayer(player);
    collideBallWithPlayer(cpu);

    if (ball.y + ball.radius >= WORLD.floorY) {
      scorePoint(ball.x < WORLD.netX ? "cpu" : "player");
    }
  }

  function scorePoint(winner) {
    ball.active = false;
    state.servingSide = winner;
    state.rallyDelay = 88;
    state.flash = 18;

    if (winner === "player") {
      state.playerScore += 1;
      state.message = "Point for you!";
      createCelebration(ball.x, WORLD.floorY - 20, "#5B5CE2");
      announce(`Point for you. Score ${state.playerScore} to ${state.cpuScore}.`);
    } else {
      state.cpuScore += 1;
      state.message = "Point for CPU";
      createCelebration(ball.x, WORLD.floorY - 20, "#EF5B5B");
      announce(`Point for CPU. Score ${state.playerScore} to ${state.cpuScore}.`);
    }

    updateScoreboard();
    if (hasWon(state.playerScore, state.cpuScore) || hasWon(state.cpuScore, state.playerScore)) {
      finishMatch(state.playerScore > state.cpuScore ? "player" : "cpu");
    }
  }

  function hasWon(score, otherScore) {
    return score >= WORLD.winningScore && score - otherScore >= WORLD.winningLead;
  }

  function finishMatch(winner) {
    state.mode = "gameover";
    state.rallyDelay = 0;
    clearInputs();

    if (winner === "player") {
      state.message = "You won the match!";
      showOverlay("🏆", "You Win!", `Final score: ${state.playerScore}–${state.cpuScore}. Excellent timing at the net.`, "Play Again");
      announce(`You won the volleyball match ${state.playerScore} to ${state.cpuScore}.`);
    } else {
      state.message = "CPU won the match";
      showOverlay("🏐", "Good Match", `Final score: ${state.playerScore}–${state.cpuScore}. Try returning to the center after each shot.`, "Try Again");
      announce(`The CPU won the volleyball match ${state.cpuScore} to ${state.playerScore}.`);
    }
    updateScoreboard();
  }

  function createCelebration(x, y, color) {
    for (let index = 0; index < 18; index += 1) {
      const angle = (Math.PI * 2 * index) / 18 + Math.random() * 0.25;
      const speed = 2 + Math.random() * 4;
      state.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        life: 42 + Math.random() * 18,
        color
      });
    }
  }

  function updateParticles() {
    state.particles.forEach((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.vy += 0.12;
      particle.life -= 1;
    });
    state.particles = state.particles.filter((particle) => particle.life > 0);
  }

  function update() {
    if (state.rallyDelay > 0) {
      state.rallyDelay -= 1;
      if (state.rallyDelay === 55) resetPositions(state.servingSide);
      if (state.rallyDelay === 1) serveBall();
    }

    const direction = Number(keys.right) - Number(keys.left);
    updatePlayer(player, direction, keys.jump, 0, WORLD.netX - WORLD.netWidth / 2, 5.4);
    updateCpu();
    updateBall();
    updateParticles();
    if (state.flash > 0) state.flash -= 1;
  }

  function drawCourt() {
    const sky = ctx.createLinearGradient(0, 0, 0, WORLD.floorY);
    sky.addColorStop(0, "#94d7e7");
    sky.addColorStop(1, "#d9f2f3");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, WORLD.width, WORLD.floorY);

    ctx.fillStyle = "rgba(255,255,255,0.72)";
    drawCloud(120, 92, 1);
    drawCloud(770, 115, 0.8);

    ctx.fillStyle = "#f4cf7b";
    ctx.fillRect(0, WORLD.floorY, WORLD.width, WORLD.height - WORLD.floorY);

    ctx.fillStyle = "#e8b85d";
    ctx.fillRect(0, WORLD.floorY, WORLD.width, 5);

    ctx.strokeStyle = "rgba(126, 80, 28, 0.26)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(100, WORLD.floorY + 38);
    ctx.lineTo(860, WORLD.floorY + 38);
    ctx.stroke();

    drawNet();
  }

  function drawCloud(x, y, scale) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    ctx.beginPath();
    ctx.arc(0, 12, 24, 0, Math.PI * 2);
    ctx.arc(28, 0, 31, 0, Math.PI * 2);
    ctx.arc(62, 14, 22, 0, Math.PI * 2);
    ctx.rect(0, 12, 62, 24);
    ctx.fill();
    ctx.restore();
  }

  function drawNet() {
    const left = WORLD.netX - WORLD.netWidth / 2;
    ctx.fillStyle = "#334155";
    ctx.fillRect(left, WORLD.netTop - 9, WORLD.netWidth, WORLD.floorY - WORLD.netTop + 15);

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(left - 5, WORLD.netTop - 11, WORLD.netWidth + 10, 12);

    ctx.strokeStyle = "rgba(255,255,255,0.78)";
    ctx.lineWidth = 2;
    const netLeft = WORLD.netX - 5;
    const netRight = WORLD.netX + 5;
    for (let y = WORLD.netTop + 8; y < WORLD.floorY; y += 17) {
      ctx.beginPath();
      ctx.moveTo(netLeft, y);
      ctx.lineTo(netRight, y);
      ctx.stroke();
    }
  }

  function drawPlayer(p, facing) {
    ctx.save();
    ctx.translate(p.x, p.y);

    ctx.fillStyle = "rgba(17, 24, 39, 0.16)";
    ctx.beginPath();
    ctx.ellipse(0, p.radius + 9, 35, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    const bodyGradient = ctx.createLinearGradient(-20, -28, 22, 30);
    bodyGradient.addColorStop(0, p.color);
    bodyGradient.addColorStop(1, p.darkColor);
    ctx.fillStyle = bodyGradient;
    ctx.beginPath();
    ctx.arc(0, 0, p.radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "rgba(255,255,255,0.2)";
    ctx.beginPath();
    ctx.arc(-10, -13, 12, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(facing * 11, -7, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#171B2D";
    ctx.beginPath();
    ctx.arc(facing * 13, -7, 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  function drawBall() {
    ctx.save();
    ctx.translate(ball.x, ball.y);
    ctx.rotate(ball.rotation);

    ctx.fillStyle = "rgba(17,24,39,0.16)";
    ctx.beginPath();
    ctx.ellipse(4, ball.radius + 7, 17, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(0, 0, ball.radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "#26314a";
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.arc(0, 0, ball.radius, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = "#5B5CE2";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(-8, -2, 15, -1.2, 0.8);
    ctx.stroke();
    ctx.strokeStyle = "#FFB84D";
    ctx.beginPath();
    ctx.arc(8, 3, 14, 1.9, 4.1);
    ctx.stroke();
    ctx.restore();
  }

  function drawParticles() {
    state.particles.forEach((particle) => {
      ctx.globalAlpha = clamp(particle.life / 45, 0, 1);
      ctx.fillStyle = particle.color;
      ctx.fillRect(particle.x - 3, particle.y - 3, 6, 6);
    });
    ctx.globalAlpha = 1;
  }

  function draw() {
    ctx.clearRect(0, 0, WORLD.width, WORLD.height);
    drawCourt();
    drawPlayer(player, 1);
    drawPlayer(cpu, -1);
    drawBall();
    drawParticles();

    if (state.flash > 0) {
      ctx.fillStyle = `rgba(255,255,255,${state.flash / 70})`;
      ctx.fillRect(0, 0, WORLD.width, WORLD.height);
    }
  }

  function frame(timestamp) {
    if (!state.lastTime) state.lastTime = timestamp;
    const elapsed = Math.min(50, timestamp - state.lastTime);
    state.lastTime = timestamp;

    if (state.mode === "playing") {
      state.accumulator += elapsed;
      const fixedStep = 1000 / 60;
      while (state.accumulator >= fixedStep) {
        update();
        state.accumulator -= fixedStep;
      }
    }

    draw();
    window.requestAnimationFrame(frame);
  }

  function handleKey(event, pressed) {
    const key = event.key.toLowerCase();
    const gameKeys = ["a", "d", "w", "arrowleft", "arrowright", "arrowup", " ", "p", "escape"];
    if (gameKeys.includes(key)) event.preventDefault();

    if ((key === "p" || key === "escape") && pressed && !event.repeat) {
      togglePause();
      return;
    }

    if (state.mode !== "playing") return;
    if (key === "a" || key === "arrowleft") keys.left = pressed;
    if (key === "d" || key === "arrowright") keys.right = pressed;
    if (key === "w" || key === "arrowup" || key === " ") keys.jump = pressed;
  }

  function bindHoldButton(button, inputName) {
    const press = (event) => {
      event.preventDefault();
      if (state.mode !== "playing") return;
      button.setPointerCapture?.(event.pointerId);
      keys[inputName] = true;
      button.classList.add("is-pressed");
    };
    const release = (event) => {
      event.preventDefault();
      keys[inputName] = false;
      button.classList.remove("is-pressed");
    };
    button.addEventListener("pointerdown", press);
    button.addEventListener("pointerup", release);
    button.addEventListener("pointercancel", release);
    button.addEventListener("lostpointercapture", release);
  }

  overlayButton.addEventListener("click", () => {
    if (state.mode === "paused") togglePause();
    else startMatch();
  });
  pauseButton.addEventListener("click", () => togglePause());
  restartButton.addEventListener("click", startMatch);
  window.addEventListener("keydown", (event) => handleKey(event, true), { passive: false });
  window.addEventListener("keyup", (event) => handleKey(event, false), { passive: false });
  window.addEventListener("blur", () => togglePause(true));
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) togglePause(true);
  });

  bindHoldButton(leftButton, "left");
  bindHoldButton(rightButton, "right");
  bindHoldButton(jumpButton, "jump");

  resetPositions("player");
  updateScoreboard();
  draw();
  window.requestAnimationFrame(frame);
})();


}
function begin(){poster.hidden=true;gm.hidden=false;if(!booted){booted=true;var s=document.createElement("style");s.textContent=LOOK;document.head.appendChild(s);boot();}else{var r=document.getElementById("overlayButton");if(r)r.click();}}
poster.addEventListener("click",begin);
var nb=document.getElementById("new");if(nb)nb.addEventListener("click",begin);
})();
