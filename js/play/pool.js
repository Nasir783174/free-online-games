/* Pool - game logic + its own look. Layout lives in style.css; page shell lives in the HTML. */
(function(){"use strict";
var gm=document.getElementById("gm"),poster=document.getElementById("poster"),booted=false;
var LOOK=".gm{\n  \n  \n  --accent: #16b8c4;\n  --action: #ffb84d;\n  --success: #22c55e;\n  --danger: #ef5b5b;\n  --page: #f6f7fb;\n  \n  \n  \n  \n  --felt: #146b4a;\n  --felt-dark: #0e5138;\n  --rail: #6b3f24;\n  \n}.gm *{ box-sizing: border-box; }.gm button{ font: inherit; }.gm .section-kicker{\n  margin: 0 0 7px;\n  color: var(--brand-dark);\n  font-size: 14px;\n  font-weight: 800;\n  letter-spacing: 0.09em;\n  text-transform: uppercase;\n}.gm h2,.gm h3,.gm p{ margin-top: 0; }.gm h2{\n  margin-bottom: 16px;\n  font-size: clamp(28px, 4vw, 36px);\n  font-weight: 700;\n  line-height: 1.2;\n  letter-spacing: -0.025em;\n}.gm h3{\n  margin-bottom: 6px;\n  font-size: 21px;\n  line-height: 1.3;\n}.gm .scorebar{\n  display: grid;\n  grid-template-columns: repeat(3, minmax(90px, 120px)) minmax(250px, 1fr) auto;\n  align-items: center;\n  gap: 14px;\n  padding: 15px;\n  background: var(--card);\n  border: 1px solid var(--border);\n  border-radius: 18px 18px 0 0;\n  box-shadow: var(--shadow);\n}.gm .stat{\n  min-height: 56px;\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  padding: 6px 14px;\n  background: #f8f9fc;\n  border: 1px solid var(--border);\n  border-radius: 12px;\n}.gm .stat-label{\n  color: var(--muted);\n  font-size: 13px;\n  font-weight: 700;\n  line-height: 1.2;\n}.gm .stat strong{ font-size: 24px; line-height: 1.25; }.gm .status-wrap{\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  min-width: 0;\n  color: #344054;\n  font-size: 15px;\n  font-weight: 700;\n}.gm .status-dot{\n  width: 10px;\n  height: 10px;\n  flex: 0 0 auto;\n  border-radius: 999px;\n  background: var(--success);\n  box-shadow: 0 0 0 4px rgba(34, 197, 94, 0.13);\n}.gm .status-dot.busy{ background: var(--action); box-shadow: 0 0 0 4px rgba(255, 184, 77, 0.15); }.gm .status-dot.danger{ background: var(--danger); box-shadow: 0 0 0 4px rgba(239, 91, 91, 0.14); }.gm .button{\n  min-height: 46px;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  padding: 0 20px;\n  border: 0;\n  border-radius: 12px;\n  font-size: 16px;\n  font-weight: 800;\n  cursor: pointer;\n  transition: transform 160ms ease, background 160ms ease, box-shadow 160ms ease;\n}.gm .button:hover{ transform: translateY(-1px); }.gm .button:active{ transform: translateY(0); }.gm .button:focus-visible,.gm summary:focus-visible{ outline: 3px solid rgba(22, 184, 196, 0.42); outline-offset: 3px; }.gm .button-primary{\n  color: #fff;\n  background: var(--brand);\n  box-shadow: 0 8px 18px rgba(91, 92, 226, 0.25);\n}.gm .button-primary:hover{ background: var(--brand-dark); }.gm .button-secondary{ color: var(--brand-dark); background: #efefff; }.gm .button-secondary:hover{ background: #e5e5ff; }.gm .game-card{\n  overflow: hidden;\n  background: #121a27;\n  border-radius: 0 0 18px 18px;\n  box-shadow: var(--shadow);\n}.gm .canvas-wrap{\n  position: relative;\n  width: 100%;\n  background: #0c151f;\n  user-select: none;\n  -webkit-user-select: none;\n}.gm #pool-canvas{\n  width: 100%;\n  height: auto;\n  display: block;\n  aspect-ratio: 16 / 9;\n  cursor: crosshair;\n  touch-action: none;\n}.gm #pool-canvas.is-aiming{ cursor: grabbing; }.gm .game-overlay{\n  position: absolute;\n  inset: 0;\n  display: grid;\n  place-items: center;\n  padding: 24px;\n  background: rgba(6, 14, 22, 0.72);\n  backdrop-filter: blur(4px);\n  transition: opacity 180ms ease;\n}.gm .game-overlay.is-hidden{ opacity: 0; pointer-events: none; }.gm .overlay-panel{\n  width: min(390px, 100%);\n  padding: 28px;\n  text-align: center;\n  background: #fff;\n  border-radius: 18px;\n  box-shadow: 0 22px 60px rgba(0, 0, 0, 0.3);\n}.gm .overlay-icon{\n  width: 54px;\n  height: 54px;\n  display: grid;\n  place-items: center;\n  margin: 0 auto 13px;\n  color: #fff;\n  background: var(--success);\n  border-radius: 50%;\n  font-size: 25px;\n}.gm .overlay-icon.lose{ background: var(--danger); }.gm .overlay-panel h2{ margin-bottom: 8px; font-size: 30px; }.gm .overlay-panel p{ margin-bottom: 20px; color: var(--muted); }.gm .game-toolbar{\n  min-height: 92px;\n  display: grid;\n  grid-template-columns: minmax(250px, 340px) 1fr;\n  align-items: center;\n  gap: 30px;\n  padding: 18px 24px 20px;\n  color: #f8fafc;\n  background: #111827;\n  border-top: 1px solid rgba(255, 255, 255, 0.08);\n}.gm .power-copy{\n  display: flex;\n  justify-content: space-between;\n  margin-bottom: 7px;\n  font-size: 14px;\n  font-weight: 800;\n}.gm .power-copy strong{ color: var(--action); }.gm .power-track{\n  height: 9px;\n  overflow: hidden;\n  background: #293446;\n  border-radius: 999px;\n}.gm .power-track span{\n  width: 0;\n  height: 100%;\n  display: block;\n  background: linear-gradient(90deg, var(--accent), var(--action), var(--danger));\n  border-radius: inherit;\n  transition: width 60ms linear;\n}.gm .control-hint{ margin: 0; color: #cbd5e1; font-size: 15px; text-align: right; }.gm .touch-hint{ display: none; }.gm .noscript-message{\n  margin: 20px 0 0;\n  padding: 16px;\n  color: #8c2c2c;\n  background: #fff0f0;\n  border: 1px solid #ffc8c8;\n  border-radius: 12px;\n}.gm .steps{ display: grid; gap: 14px; margin-top: 26px; }.gm .step{\n  display: grid;\n  grid-template-columns: 42px 1fr;\n  gap: 14px;\n  align-items: start;\n  padding: 16px;\n  background: #f8f9fc;\n  border-radius: 13px;\n}.gm .step > span{\n  width: 42px;\n  height: 42px;\n  display: grid;\n  place-items: center;\n  color: #fff;\n  background: var(--brand);\n  border-radius: 12px;\n  font-weight: 800;\n}.gm .step p{ margin: 0; color: var(--muted); font-size: 16px; }.gm .rules-card{ color: #fff; background: #17263c; border-color: #17263c; }.gm .rules-card .section-kicker{ color: #7ce2d8; }.gm .rules-card h2{ color: #fff; }.gm .rule-list,.gm .tips-list{\n  margin: 0;\n  padding: 0;\n  list-style: none;\n}.gm .rule-list{ display: grid; gap: 4px; }.gm .rule-list li{\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  padding: 13px 0;\n  color: #dbe4ef;\n  border-bottom: 1px solid rgba(255, 255, 255, 0.1);\n}.gm .rule-list li:last-child{ border-bottom: 0; }.gm .rule-points{\n  min-width: 55px;\n  padding: 4px 8px;\n  border-radius: 8px;\n  text-align: center;\n  font-size: 14px;\n  font-weight: 800;\n}.gm .rule-points.positive{ color: #72ed9c; background: rgba(34, 197, 94, 0.14); }.gm .rule-points.negative{ color: #ff9292; background: rgba(239, 91, 91, 0.14); }.gm .rule-points.win{ color: #ffd27f; background: rgba(255, 184, 77, 0.14); }.gm .alt-section{ background: #fff; border-block: 1px solid var(--border); }.gm .two-column{ display: grid; grid-template-columns: 1fr 1fr; gap: 70px; }.gm .two-column p:not(.section-kicker),.gm .tips-list{ color: var(--muted); }.gm .tips-list{ display: grid; gap: 15px; }.gm .tips-list li{ position: relative; padding-left: 22px; }.gm .tips-list li::before{ content: \"\"; position: absolute; top: 0.67em; left: 0; width: 8px; height: 8px; background: var(--accent); border-radius: 50%; }.gm .tips-list strong{ color: var(--text); }.gm .visually-hidden{\n  position: absolute !important;\n  width: 1px !important;\n  height: 1px !important;\n  padding: 0 !important;\n  margin: -1px !important;\n  overflow: hidden !important;\n  clip: rect(0, 0, 0, 0) !important;\n  white-space: nowrap !important;\n  border: 0 !important;\n}@media (max-width: 900px){.gm .scorebar{ grid-template-columns: repeat(3, 1fr); }.gm .status-wrap{ grid-column: 1 / 3; min-height: 46px; }.gm .scorebar .button{ grid-column: 3; }.gm .two-column{ gap: 45px; }}@media (max-width: 680px){.gm h2{ font-size: 28px; }.gm .scorebar{ gap: 8px; padding: 10px; border-radius: 15px 15px 0 0; }.gm .stat{ min-height: 52px; padding: 6px 9px; }.gm .stat-label{ font-size: 12px; }.gm .stat strong{ font-size: 21px; }.gm .status-wrap{ grid-column: 1 / -1; order: 2; min-height: 34px; padding-inline: 4px; }.gm .scorebar .button{ grid-column: 1 / -1; order: 3; min-height: 44px; }.gm .game-card{ border-radius: 0 0 15px 15px; }.gm .game-toolbar{ min-height: 0; grid-template-columns: 1fr; gap: 12px; padding: 15px; }.gm .control-hint{ font-size: 14px; text-align: left; }.gm .mouse-hint{ display: none; }.gm .touch-hint{ display: inline; }.gm .step{ grid-template-columns: 36px 1fr; padding: 14px; }.gm .step > span{ width: 36px; height: 36px; }.gm .two-column{ grid-template-columns: 1fr; gap: 38px; }.gm .overlay-panel{ padding: 22px; }.gm .overlay-panel h2{ font-size: 26px; }}@media (prefers-reduced-motion: reduce){.gm *,.gm *::before,.gm *::after{ scroll-behavior: auto !important; transition: none !important; }}";
function __ready(f){f()}
function boot(){
"use strict";

(() => {
  const canvas = document.getElementById("pool-canvas");
  const ctx = canvas.getContext("2d");

  const ui = {
    score: document.getElementById("score"),
    shots: document.getElementById("shots"),
    ballsLeft: document.getElementById("balls-left"),
    status: document.getElementById("game-status"),
    statusDot: document.getElementById("status-dot"),
    powerValue: document.getElementById("power-value"),
    powerFill: document.getElementById("power-fill"),
    overlay: document.getElementById("game-overlay"),
    overlayIcon: document.getElementById("overlay-icon"),
    overlayTitle: document.getElementById("overlay-title"),
    overlayMessage: document.getElementById("overlay-message"),
    restart: document.getElementById("restart-button"),
    playAgain: document.getElementById("play-again-button")
  };

  const WIDTH = canvas.width;
  const HEIGHT = canvas.height;
  const TABLE = { left: 62, right: 898, top: 58, bottom: 482 };
  const BALL_RADIUS = 13;
  const POCKET_RADIUS = 24;
  const STOP_SPEED = 0.055;
  const MAX_POWER_DRAG = 180;
  const MAX_SHOT_SPEED = 18;
  const FRICTION_PER_FRAME = 0.987;
  const RAIL_BOUNCE = 0.91;
  const BALL_BOUNCE = 0.98;

  const pockets = [
    { x: TABLE.left, y: TABLE.top },
    { x: (TABLE.left + TABLE.right) / 2, y: TABLE.top - 2 },
    { x: TABLE.right, y: TABLE.top },
    { x: TABLE.left, y: TABLE.bottom },
    { x: (TABLE.left + TABLE.right) / 2, y: TABLE.bottom + 2 },
    { x: TABLE.right, y: TABLE.bottom }
  ];

  const ballStyles = {
    1: { color: "#f3c943", stripe: false },
    2: { color: "#3973d2", stripe: false },
    3: { color: "#d74845", stripe: false },
    4: { color: "#7353a6", stripe: false },
    5: { color: "#ea8533", stripe: false },
    6: { color: "#278a58", stripe: false },
    7: { color: "#8f3438", stripe: false },
    8: { color: "#1b1c20", stripe: false },
    9: { color: "#f3c943", stripe: true },
    10: { color: "#3973d2", stripe: true }
  };

  let balls = [];
  let score = 0;
  let shots = 0;
  let state = "ready";
  let aiming = false;
  let aimPoint = { x: 0, y: 0 };
  let shotPocketCount = 0;
  let cueNeedsRespawn = false;
  let lastTime = performance.now();

  class Ball {
    constructor(x, y, number = 0) {
      this.x = x;
      this.y = y;
      this.vx = 0;
      this.vy = 0;
      this.number = number;
      this.isCue = number === 0;
      this.pocketed = false;
    }

    get speed() {
      return Math.hypot(this.vx, this.vy);
    }
  }

  function rackBalls() {
    balls = [new Ball(255, HEIGHT / 2, 0)];

    const rackX = 650;
    const rackY = HEIGHT / 2;
    const gapX = BALL_RADIUS * 1.78;
    const gapY = BALL_RADIUS * 2.04;
    const rows = [1, 2, 3, 4];
    const numbers = [1, 3, 9, 2, 8, 5, 10, 4, 6, 7];
    let index = 0;

    rows.forEach((count, row) => {
      const x = rackX + row * gapX;
      const startY = rackY - ((count - 1) * gapY) / 2;
      for (let col = 0; col < count; col += 1) {
        balls.push(new Ball(x, startY + col * gapY, numbers[index]));
        index += 1;
      }
    });
  }

  function newGame() {
    rackBalls();
    score = 0;
    shots = 0;
    state = "ready";
    aiming = false;
    shotPocketCount = 0;
    cueNeedsRespawn = false;
    hideOverlay();
    setStatus("Drag from the cue ball to aim", "ready");
    setPower(0);
    updateStats();
  }

  function getCueBall() {
    return balls.find((ball) => ball.isCue);
  }

  function objectBallsLeft() {
    return balls.filter((ball) => !ball.isCue && ball.number !== 8 && !ball.pocketed).length;
  }

  function updateStats() {
    ui.score.textContent = score.toLocaleString();
    ui.shots.textContent = shots.toString();
    ui.ballsLeft.textContent = balls.filter((ball) => !ball.isCue && !ball.pocketed).length.toString();
  }

  function setStatus(message, type) {
    ui.status.textContent = message;
    ui.statusDot.className = "status-dot";
    if (type === "busy") ui.statusDot.classList.add("busy");
    if (type === "danger") ui.statusDot.classList.add("danger");
  }

  function setPower(percent) {
    const safePercent = Math.max(0, Math.min(100, Math.round(percent)));
    ui.powerValue.textContent = `${safePercent}%`;
    ui.powerFill.style.width = `${safePercent}%`;
  }

  function showOverlay(won, title, message) {
    ui.overlayIcon.textContent = won ? "★" : "×";
    ui.overlayIcon.classList.toggle("lose", !won);
    ui.overlayTitle.textContent = title;
    ui.overlayMessage.textContent = message;
    ui.overlay.classList.remove("is-hidden");
    ui.overlay.setAttribute("aria-hidden", "false");
    window.setTimeout(() => ui.playAgain.focus(), 100);
  }

  function hideOverlay() {
    ui.overlay.classList.add("is-hidden");
    ui.overlay.setAttribute("aria-hidden", "true");
  }

  function canvasPoint(event) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) / rect.width) * WIDTH,
      y: ((event.clientY - rect.top) / rect.height) * HEIGHT
    };
  }

  function onPointerDown(event) {
    if (state !== "ready") return;
    const cue = getCueBall();
    if (!cue || cue.pocketed) return;

    const point = canvasPoint(event);
    if (Math.hypot(point.x - cue.x, point.y - cue.y) <= BALL_RADIUS * 2.25) {
      aiming = true;
      aimPoint = point;
      canvas.classList.add("is-aiming");
      canvas.setPointerCapture(event.pointerId);
      setStatus("Release to shoot", "ready");
      event.preventDefault();
    }
  }

  function onPointerMove(event) {
    if (!aiming) return;
    aimPoint = canvasPoint(event);
    const cue = getCueBall();
    const drag = Math.min(MAX_POWER_DRAG, Math.hypot(aimPoint.x - cue.x, aimPoint.y - cue.y));
    setPower((drag / MAX_POWER_DRAG) * 100);
    event.preventDefault();
  }

  function onPointerUp(event) {
    if (!aiming) return;
    const cue = getCueBall();
    aimPoint = canvasPoint(event);
    const dx = cue.x - aimPoint.x;
    const dy = cue.y - aimPoint.y;
    const drag = Math.min(MAX_POWER_DRAG, Math.hypot(dx, dy));

    aiming = false;
    canvas.classList.remove("is-aiming");
    if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);

    if (drag >= 8) {
      const speed = (drag / MAX_POWER_DRAG) * MAX_SHOT_SPEED;
      const length = Math.hypot(dx, dy) || 1;
      cue.vx = (dx / length) * speed;
      cue.vy = (dy / length) * speed;
      shots += 1;
      shotPocketCount = 0;
      state = "moving";
      setStatus("Balls in motion", "busy");
      updateStats();
    } else {
      setStatus("Drag farther to add shot power", "danger");
    }

    setPower(0);
    event.preventDefault();
  }

  function onPointerCancel(event) {
    if (!aiming) return;
    aiming = false;
    canvas.classList.remove("is-aiming");
    if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
    setPower(0);
    setStatus("Drag from the cue ball to aim", "ready");
  }

  function physicsStep(scale) {
    const movingBalls = balls.filter((ball) => !ball.pocketed);

    movingBalls.forEach((ball) => {
      ball.x += ball.vx * scale;
      ball.y += ball.vy * scale;

      const friction = Math.pow(FRICTION_PER_FRAME, scale);
      ball.vx *= friction;
      ball.vy *= friction;

      if (ball.speed < STOP_SPEED) {
        ball.vx = 0;
        ball.vy = 0;
      }

      checkPocket(ball);
      if (!ball.pocketed) resolveRailCollision(ball);
    });

    for (let i = 0; i < movingBalls.length; i += 1) {
      const a = movingBalls[i];
      if (a.pocketed) continue;
      for (let j = i + 1; j < movingBalls.length; j += 1) {
        const b = movingBalls[j];
        if (!b.pocketed) resolveBallCollision(a, b);
      }
    }
  }

  function checkPocket(ball) {
    const pocket = pockets.find((item) => Math.hypot(ball.x - item.x, ball.y - item.y) < POCKET_RADIUS);
    if (!pocket) return;

    ball.pocketed = true;
    ball.vx = 0;
    ball.vy = 0;

    if (ball.isCue) {
      score = Math.max(0, score - 75);
      cueNeedsRespawn = true;
      setStatus("Scratch! Cue ball will return", "danger");
    } else if (ball.number === 8) {
      if (objectBallsLeft() === 0 && !cueNeedsRespawn) {
        score += 500;
        state = "won";
        updateStats();
        showOverlay(true, "Table cleared!", `You won in ${shots} ${shots === 1 ? "shot" : "shots"} with ${score.toLocaleString()} points.`);
      } else {
        state = "lost";
        updateStats();
        const message = cueNeedsRespawn
          ? "The cue ball was scratched while the 8-ball was pocketed. Try the final shot again."
          : "Clear every other numbered ball before sinking the 8-ball.";
        showOverlay(false, cueNeedsRespawn ? "Scratch on the 8-ball" : "8-ball pocketed early", message);
      }
    } else {
      shotPocketCount += 1;
      score += 100 + Math.max(0, shotPocketCount - 1) * 50;
      setStatus(shotPocketCount > 1 ? `${shotPocketCount}-ball combo!` : `Ball ${ball.number} pocketed`, "ready");
    }

    updateStats();
  }

  function resolveRailCollision(ball) {
    if (ball.x - BALL_RADIUS < TABLE.left) {
      ball.x = TABLE.left + BALL_RADIUS;
      ball.vx = Math.abs(ball.vx) * RAIL_BOUNCE;
    } else if (ball.x + BALL_RADIUS > TABLE.right) {
      ball.x = TABLE.right - BALL_RADIUS;
      ball.vx = -Math.abs(ball.vx) * RAIL_BOUNCE;
    }

    if (ball.y - BALL_RADIUS < TABLE.top) {
      ball.y = TABLE.top + BALL_RADIUS;
      ball.vy = Math.abs(ball.vy) * RAIL_BOUNCE;
    } else if (ball.y + BALL_RADIUS > TABLE.bottom) {
      ball.y = TABLE.bottom - BALL_RADIUS;
      ball.vy = -Math.abs(ball.vy) * RAIL_BOUNCE;
    }
  }

  function resolveBallCollision(a, b) {
    let dx = b.x - a.x;
    let dy = b.y - a.y;
    let distance = Math.hypot(dx, dy);
    const minimum = BALL_RADIUS * 2;
    if (distance >= minimum) return;

    if (distance === 0) {
      dx = 0.01;
      dy = 0;
      distance = 0.01;
    }

    const nx = dx / distance;
    const ny = dy / distance;
    const overlap = minimum - distance;
    a.x -= nx * overlap * 0.5;
    a.y -= ny * overlap * 0.5;
    b.x += nx * overlap * 0.5;
    b.y += ny * overlap * 0.5;

    const relativeVelocity = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny;
    if (relativeVelocity >= 0) return;

    const impulse = -((1 + BALL_BOUNCE) * relativeVelocity) / 2;
    a.vx -= impulse * nx;
    a.vy -= impulse * ny;
    b.vx += impulse * nx;
    b.vy += impulse * ny;
  }

  function allBallsStopped() {
    return balls.every((ball) => ball.pocketed || ball.speed === 0);
  }

  function findCueRespawn() {
    const candidates = [
      { x: 255, y: HEIGHT / 2 },
      { x: 220, y: HEIGHT / 2 - 65 },
      { x: 220, y: HEIGHT / 2 + 65 },
      { x: 300, y: HEIGHT / 2 }
    ];

    return candidates.find((point) => balls.every((ball) => {
      return ball.isCue || ball.pocketed || Math.hypot(point.x - ball.x, point.y - ball.y) > BALL_RADIUS * 2.2;
    })) || { x: 200, y: HEIGHT / 2 };
  }

  function finishShot() {
    if (state !== "moving" || !allBallsStopped()) return;

    if (cueNeedsRespawn) {
      const cue = getCueBall();
      const position = findCueRespawn();
      cue.x = position.x;
      cue.y = position.y;
      cue.pocketed = false;
      cueNeedsRespawn = false;
      setStatus("Scratch penalty: −75. Aim your next shot", "danger");
    } else if (shotPocketCount > 0) {
      setStatus("Nice shot! Aim again", "ready");
    } else {
      setStatus("All balls stopped. Aim your next shot", "ready");
    }

    state = "ready";
  }

  function roundedRect(context, x, y, width, height, radius) {
    const r = Math.min(radius, width / 2, height / 2);
    context.beginPath();
    context.roundRect(x, y, width, height, r);
    context.closePath();
  }

  function drawTable() {
    const background = ctx.createLinearGradient(0, 0, 0, HEIGHT);
    background.addColorStop(0, "#101d28");
    background.addColorStop(1, "#09131d");
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    ctx.save();
    ctx.shadowColor = "rgba(0, 0, 0, 0.48)";
    ctx.shadowBlur = 26;
    ctx.shadowOffsetY = 12;
    roundedRect(ctx, 26, 22, WIDTH - 52, HEIGHT - 44, 34);
    const wood = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT);
    wood.addColorStop(0, "#815032");
    wood.addColorStop(0.5, "#57311e");
    wood.addColorStop(1, "#78472b");
    ctx.fillStyle = wood;
    ctx.fill();
    ctx.restore();

    roundedRect(ctx, 43, 39, WIDTH - 86, HEIGHT - 78, 24);
    ctx.fillStyle = "#0b3f2c";
    ctx.fill();

    const felt = ctx.createRadialGradient(WIDTH / 2, HEIGHT / 2, 40, WIDTH / 2, HEIGHT / 2, 530);
    felt.addColorStop(0, "#1b805a");
    felt.addColorStop(1, "#105d41");
    ctx.fillStyle = felt;
    ctx.fillRect(TABLE.left, TABLE.top, TABLE.right - TABLE.left, TABLE.bottom - TABLE.top);

    ctx.strokeStyle = "rgba(255, 255, 255, 0.11)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(285, TABLE.top + 4);
    ctx.lineTo(285, TABLE.bottom - 4);
    ctx.stroke();

    ctx.fillStyle = "rgba(255, 255, 255, 0.35)";
    ctx.beginPath();
    ctx.arc(285, HEIGHT / 2, 3.3, 0, Math.PI * 2);
    ctx.fill();

    pockets.forEach((pocket) => {
      ctx.save();
      ctx.shadowColor = "rgba(0, 0, 0, 0.7)";
      ctx.shadowBlur = 8;
      ctx.fillStyle = "#04080b";
      ctx.beginPath();
      ctx.arc(pocket.x, pocket.y, POCKET_RADIUS, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    const diamonds = [150, 270, 390, 570, 690, 810];
    ctx.fillStyle = "#d7b978";
    diamonds.forEach((x) => {
      drawDiamond(x, 40);
      drawDiamond(x, 500);
    });
    [150, 270, 370].forEach((y) => {
      drawDiamond(43, y);
      drawDiamond(917, y);
    });
  }

  function drawDiamond(x, y) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(Math.PI / 4);
    ctx.fillRect(-3, -3, 6, 6);
    ctx.restore();
  }

  function drawBall(ball) {
    if (ball.pocketed) return;
    ctx.save();
    ctx.translate(ball.x, ball.y);
    ctx.shadowColor = "rgba(0, 0, 0, 0.42)";
    ctx.shadowBlur = 7;
    ctx.shadowOffsetY = 4;

    ctx.beginPath();
    ctx.arc(0, 0, BALL_RADIUS, 0, Math.PI * 2);

    if (ball.isCue) {
      const cueGradient = ctx.createRadialGradient(-5, -6, 1, 0, 0, BALL_RADIUS);
      cueGradient.addColorStop(0, "#ffffff");
      cueGradient.addColorStop(1, "#dfe4e8");
      ctx.fillStyle = cueGradient;
      ctx.fill();
      ctx.restore();
      return;
    }

    const style = ballStyles[ball.number];
    ctx.fillStyle = style.stripe ? "#f5f1e8" : style.color;
    ctx.fill();

    if (style.stripe) {
      ctx.save();
      ctx.clip();
      ctx.fillStyle = style.color;
      ctx.fillRect(-BALL_RADIUS, -6.3, BALL_RADIUS * 2, 12.6);
      ctx.restore();
    }

    const shine = ctx.createRadialGradient(-5, -6, 1, -2, -3, 12);
    shine.addColorStop(0, "rgba(255,255,255,0.48)");
    shine.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = shine;
    ctx.beginPath();
    ctx.arc(0, 0, BALL_RADIUS, 0, Math.PI * 2);
    ctx.fill();

    ctx.shadowColor = "transparent";
    ctx.fillStyle = "#f8fafc";
    ctx.beginPath();
    ctx.arc(0, 0, 6.6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#151820";
    ctx.font = "700 8.5px Nunito Sans, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(ball.number.toString(), 0, 0.5);
    ctx.restore();
  }

  function rayCircleIntersection(origin, direction, ball) {
    const ox = origin.x - ball.x;
    const oy = origin.y - ball.y;
    const projection = ox * direction.x + oy * direction.y;
    const c = ox * ox + oy * oy - (BALL_RADIUS * 2) ** 2;
    const discriminant = projection * projection - c;
    if (discriminant < 0) return null;
    const distance = -projection - Math.sqrt(discriminant);
    return distance > 0 ? distance : null;
  }

  function drawAimGuide() {
    if (!aiming || state !== "ready") return;
    const cue = getCueBall();
    const dx = cue.x - aimPoint.x;
    const dy = cue.y - aimPoint.y;
    const length = Math.hypot(dx, dy);
    if (length < 1) return;

    const direction = { x: dx / length, y: dy / length };
    let guideLength = 280;
    balls.forEach((ball) => {
      if (ball.isCue || ball.pocketed) return;
      const hit = rayCircleIntersection(cue, direction, ball);
      if (hit !== null) guideLength = Math.min(guideLength, hit);
    });

    ctx.save();
    ctx.setLineDash([8, 8]);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.78)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cue.x, cue.y);
    ctx.lineTo(cue.x + direction.x * guideLength, cue.y + direction.y * guideLength);
    ctx.stroke();

    const pullLength = Math.min(length, MAX_POWER_DRAG);
    const backX = cue.x - direction.x * (pullLength + 24);
    const backY = cue.y - direction.y * (pullLength + 24);
    ctx.setLineDash([]);
    ctx.strokeStyle = "#d9b87a";
    ctx.lineWidth = 6;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(cue.x - direction.x * 22, cue.y - direction.y * 22);
    ctx.lineTo(backX - direction.x * 115, backY - direction.y * 115);
    ctx.stroke();

    ctx.strokeStyle = "#4f2d1e";
    ctx.lineWidth = 9;
    ctx.beginPath();
    ctx.moveTo(backX - direction.x * 112, backY - direction.y * 112);
    ctx.lineTo(backX - direction.x * 184, backY - direction.y * 184);
    ctx.stroke();
    ctx.restore();
  }

  function render() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    drawTable();
    balls.filter((ball) => !ball.isCue).forEach(drawBall);
    const cue = getCueBall();
    if (cue) drawBall(cue);
    drawAimGuide();
  }

  function loop(now) {
    const elapsed = Math.min(34, now - lastTime);
    lastTime = now;

    if (state === "moving") {
      const frameScale = elapsed / (1000 / 60);
      const steps = Math.max(1, Math.ceil(frameScale * 2));
      for (let index = 0; index < steps; index += 1) {
        physicsStep(frameScale / steps);
        if (state === "won" || state === "lost") break;
      }
      finishShot();
    }

    render();
    requestAnimationFrame(loop);
  }

  canvas.addEventListener("pointerdown", onPointerDown);
  canvas.addEventListener("pointermove", onPointerMove);
  canvas.addEventListener("pointerup", onPointerUp);
  canvas.addEventListener("pointercancel", onPointerCancel);
  ui.restart.addEventListener("click", newGame);
  ui.playAgain.addEventListener("click", newGame);

  newGame();
  requestAnimationFrame(loop);
})();


}
function begin(){poster.hidden=true;gm.hidden=false;if(!booted){booted=true;var s=document.createElement("style");s.textContent=LOOK;document.head.appendChild(s);boot();}else{var r=document.getElementById("restart-button");if(r)r.click();}}
poster.addEventListener("click",begin);
var nb=document.getElementById("new");if(nb)nb.addEventListener("click",begin);
})();
