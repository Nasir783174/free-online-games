/* Archery - game logic + its own look. Layout lives in style.css; page shell lives in the HTML. */
(function(){"use strict";
var gm=document.getElementById("gm"),poster=document.getElementById("poster"),booted=false;
var LOOK=".gm{\n  \n  \n  --accent: #16b8c4;\n  --action: #ffb84d;\n  --success: #22c55e;\n  --danger: #ef5b5b;\n  \n  \n  \n  \n  \n  --game: #16251f;\n  \n}.gm *{ box-sizing: border-box; }.gm button,.gm canvas{ -webkit-tap-highlight-color: transparent; }.gm button,.gm input{ font: inherit; }.gm h2,.gm h3,.gm p{ margin-top: 0; }.gm h2{ margin-bottom: 16px; font-size: clamp(28px, 4vw, 36px); line-height: 1.18; letter-spacing: -.02em; }.gm h3{ line-height: 1.3; }.gm .game-card{ overflow: hidden; border: 1px solid var(--border); border-radius: 20px; background: var(--card); box-shadow: var(--shadow); }.gm .game-toolbar{ min-height: 72px; padding: 10px 18px; display: flex; align-items: center; gap: 26px; border-bottom: 1px solid rgba(255,255,255,.12); color: #fff; background: #111b17; }.gm .stat{ min-width: 80px; display: flex; flex-direction: column; line-height: 1.18; }.gm .stat-label{ color: #b9c6bf; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; }.gm .stat strong{ font-size: 24px; font-weight: 800; font-variant-numeric: tabular-nums; }.gm .stat-total{ color: #89968f; font-size: 17px; }.gm .icon-button{ margin-left: auto; width: 44px; height: 44px; border: 1px solid rgba(255,255,255,.2); border-radius: 12px; background: rgba(255,255,255,.08); color: #fff; cursor: pointer; font-weight: 800; }.gm .icon-button + .icon-button{ margin-left: -16px; }.gm .icon-button:hover{ background: rgba(255,255,255,.16); }.gm .icon-button:focus-visible,.gm .primary-button:focus-visible,.gm .secondary-button:focus-visible,.gm summary:focus-visible{ outline: 3px solid var(--action); outline-offset: 3px; }.gm .canvas-wrap{ position: relative; aspect-ratio: 16 / 10; min-height: 360px; max-height: 680px; overflow: hidden; background: var(--game); touch-action: none; user-select: none; }.gm #game-canvas{ display: block; width: 100%; height: 100%; cursor: crosshair; }.gm #game-canvas:focus-visible{ outline: 3px solid var(--action); outline-offset: -4px; }.gm .wind-card{ position: absolute; z-index: 2; top: 18px; left: 18px; min-width: 108px; padding: 9px 12px; border: 1px solid rgba(255,255,255,.2); border-radius: 12px; background: rgba(13,25,20,.74); backdrop-filter: blur(8px); color: #fff; line-height: 1.2; pointer-events: none; }.gm .wind-card > span{ display: block; color: #bdc9c1; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; }.gm .wind-card strong{ font-size: 18px; font-variant-numeric: tabular-nums; }.gm .power-panel{ position: absolute; z-index: 2; left: 18px; bottom: 18px; width: min(260px, calc(100% - 36px)); display: grid; grid-template-columns: auto 1fr 44px; align-items: center; gap: 10px; padding: 9px 12px; border: 1px solid rgba(255,255,255,.2); border-radius: 12px; background: rgba(13,25,20,.78); color: #fff; pointer-events: none; }.gm .power-panel > span{ font-size: 12px; color: #bdc9c1; font-weight: 800; text-transform: uppercase; letter-spacing: .07em; }.gm .power-track{ height: 8px; overflow: hidden; border-radius: 999px; background: rgba(255,255,255,.18); }.gm #power-fill{ height: 100%; width: 0; border-radius: inherit; background: var(--action); transition: width 45ms linear, background .2s; }.gm #power-value{ font-size: 13px; font-variant-numeric: tabular-nums; text-align: right; }.gm .game-message{ position: absolute; z-index: 2; top: 18px; left: 50%; transform: translateX(-50%) translateY(-12px); opacity: 0; display: flex; flex-direction: column; align-items: center; min-width: 180px; padding: 7px 14px; border-radius: 11px; color: #fff; background: rgba(13,25,20,.82); pointer-events: none; transition: .2s ease; }.gm .game-message.show{ transform: translateX(-50%) translateY(0); opacity: 1; }.gm .game-message strong{ font-size: 17px; line-height: 1.25; }.gm .game-message span{ color: #d4ddd7; font-size: 12px; line-height: 1.3; }.gm .game-overlay{ position: absolute; z-index: 5; inset: 0; display: grid; place-items: center; padding: 24px; background: rgba(10,18,15,.72); opacity: 0; visibility: hidden; transition: opacity .2s ease, visibility .2s ease; }.gm .game-overlay.is-visible{ opacity: 1; visibility: visible; }.gm .overlay-panel{ width: min(430px, 100%); padding: 30px; border: 1px solid rgba(255,255,255,.22); border-radius: 20px; background: rgba(255,255,255,.96); text-align: center; box-shadow: 0 20px 70px rgba(0,0,0,.28); }.gm .overlay-icon{ width: 54px; height: 54px; margin: 0 auto 12px; display: grid; place-items: center; border-radius: 16px; background: #f0f0ff; color: var(--brand); font-size: 27px; font-weight: 800; }.gm .overlay-panel h2{ margin-bottom: 8px; font-size: 30px; }.gm .overlay-panel p{ margin-bottom: 20px; color: var(--muted); }.gm .primary-button,.gm .secondary-button{ min-height: 48px; padding: 10px 21px; border-radius: 12px; border: 0; cursor: pointer; font-size: 16px; font-weight: 800; }.gm .primary-button{ background: var(--brand); color: #fff; box-shadow: 0 7px 18px rgba(91,92,226,.26); }.gm .primary-button:hover{ background: var(--brand-dark); transform: translateY(-1px); }.gm .secondary-button{ border: 1px solid var(--border); background: #fff; color: var(--text); }.gm .secondary-button:hover{ border-color: var(--brand); color: var(--brand); }.gm .result-kicker{ margin-bottom: 4px !important; color: var(--brand-dark) !important; font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: .08em; }.gm .result-grid{ display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin: 20px 0; }.gm .result-grid div{ padding: 10px 5px; border-radius: 12px; background: #f4f5f9; }.gm .result-grid strong,.gm .result-grid span{ display: block; }.gm .result-grid strong{ font-size: 22px; font-variant-numeric: tabular-nums; }.gm .result-grid span{ color: var(--muted); font-size: 12px; }.gm .control-strip{ padding: 17px 20px; display: flex; align-items: center; justify-content: space-between; gap: 22px; }.gm .control-copy{ display: flex; flex-direction: column; line-height: 1.4; }.gm .control-copy strong{ font-size: 16px; }.gm .control-copy span{ color: var(--muted); font-size: 14px; }.gm .steps{ display: grid; gap: 14px; padding: 0; margin: 0; list-style: none; }.gm .steps li{ display: flex; gap: 16px; padding: 18px; border: 1px solid var(--border); border-radius: 15px; background: #fff; }.gm .steps li > span{ flex: 0 0 38px; width: 38px; height: 38px; display: grid; place-items: center; border-radius: 11px; background: #ededff; color: var(--brand-dark); font-weight: 800; }.gm .steps strong{ display: block; margin-bottom: 2px; }.gm .steps p{ margin: 0; font-size: 15px; }.gm .controls-list{ margin: 0; }.gm .controls-list div{ display: grid; grid-template-columns: 100px 1fr; gap: 15px; padding: 10px 0; border-bottom: 1px solid var(--border); }.gm .controls-list div:last-child{ border-bottom: 0; }.gm .controls-list dt{ font-weight: 800; }.gm .controls-list dd{ margin: 0; color: var(--muted); }.gm .rings-key{ display: flex; gap: 10px; margin: 20px 0; flex-wrap: wrap; }.gm .ring{ width: 44px; height: 44px; display: grid; place-items: center; border-radius: 50%; font-size: 14px; font-weight: 800; box-shadow: inset 0 0 0 2px rgba(0,0,0,.12); }.gm .ring-10{ background: #f8d447; color: #413500; }.gm .ring-8{ background: #ef5b5b; color: #fff; }.gm .ring-6{ background: #4f8ed8; color: #fff; }.gm .ring-4{ background: #1e252b; color: #fff; }.gm .ring-2{ background: #f7f3e7; color: #222; }.gm .tip-card{ padding: 26px; border-radius: 18px; background: #17251f; color: #fff; }.gm .tip-card h3{ margin-bottom: 14px; font-size: 22px; }.gm .tip-card ul{ padding-left: 20px; margin: 0; color: #d6dfda; }.gm .tip-card li + li{ margin-top: 7px; }.gm .section-heading{ display: flex; justify-content: space-between; align-items: end; margin-bottom: 24px; }.gm .section-heading h2{ margin-bottom: 0; }.gm .section-heading > span{ color: var(--muted); font-size: 15px; }.gm .game-symbol{ width: 48px; height: 48px; display: grid; place-items: center; border-radius: 13px; background: #f0f0ff; font-size: 25px; }.gm .soon{ color: var(--brand-dark); font-size: 13px; font-weight: 800; }@media (max-width: 760px){.gm .game-card{ border-radius: 16px; }.gm .game-toolbar{ min-height: 64px; gap: 14px; padding: 8px 12px; }.gm .stat{ min-width: 62px; }.gm .stat strong{ font-size: 21px; }.gm .hide-small{ display: none; }.gm .icon-button{ width: 42px; height: 42px; }.gm .icon-button + .icon-button{ margin-left: -8px; }.gm .canvas-wrap{ min-height: 430px; aspect-ratio: 4 / 5; }.gm .wind-card{ top: 12px; left: 12px; }.gm .game-message{ top: 12px; left: auto; right: 12px; transform: translateY(-12px); min-width: 154px; align-items: flex-end; }.gm .game-message.show{ transform: translateY(0); }.gm .game-message span{ display: none; }.gm .power-panel{ left: 12px; bottom: 12px; width: calc(100% - 24px); }.gm .control-strip{ align-items: stretch; flex-direction: column; gap: 12px; }.gm .secondary-button{ width: 100%; }.gm .section-heading{ align-items: start; flex-direction: column; gap: 6px; }}@media (max-width: 420px){.gm .game-toolbar{ gap: 9px; }.gm .icon-button{ margin-left: auto; }.gm .icon-button + .icon-button{ margin-left: -3px; }.gm .overlay-panel{ padding: 23px 17px; }.gm .overlay-panel h2{ font-size: 27px; }.gm .result-grid strong{ font-size: 19px; }.gm .controls-list div{ grid-template-columns: 82px 1fr; gap: 10px; }}@media (prefers-reduced-motion: reduce){.gm *,.gm *::before,.gm *::after{ animation-duration: .01ms !important; animation-iteration-count: 1 !important; transition-duration: .01ms !important; }}";
function __ready(f){f()}
function boot(){
"use strict";

(() => {
  const canvas = document.getElementById("game-canvas");
  const ctx = canvas.getContext("2d");
  const ui = {
    score: document.getElementById("score"),
    arrows: document.getElementById("arrows"),
    best: document.getElementById("best-score"),
    windArrow: document.getElementById("wind-arrow"),
    windValue: document.getElementById("wind-value"),
    powerFill: document.getElementById("power-fill"),
    powerValue: document.getElementById("power-value"),
    message: document.getElementById("game-message"),
    messageTitle: document.getElementById("message-title"),
    messageText: document.getElementById("message-text"),
    startOverlay: document.getElementById("start-overlay"),
    pauseOverlay: document.getElementById("pause-overlay"),
    resultOverlay: document.getElementById("result-overlay"),
    pauseButton: document.getElementById("pause-button"),
    pauseIcon: document.getElementById("pause-icon"),
    soundButton: document.getElementById("sound-button"),
    soundIcon: document.getElementById("sound-icon"),
    finalScore: document.getElementById("final-score"),
    finalAccuracy: document.getElementById("final-accuracy"),
    finalBullseyes: document.getElementById("final-bullseyes"),
    resultTitle: document.getElementById("result-title"),
    bestMessage: document.getElementById("best-message")
  };

  const WORLD = { width: 960, height: 600 };
  const TOTAL_ARROWS = 10;
  const state = {
    mode: "ready",
    score: 0,
    arrowsLeft: TOTAL_ARROWS,
    hits: 0,
    bullseyes: 0,
    best: readBest(),
    wind: 0,
    power: 0,
    charging: false,
    chargeDirection: 1,
    aim: { x: 650, y: 260 },
    target: { x: 655, y: 245, radius: 78, direction: 1, speed: 48 },
    arrow: null,
    impactMarks: [],
    lastTime: 0,
    dpr: 1,
    muted: false,
    audio: null,
    messageTimer: 0
  };

  function readBest() {
    try { return Number(localStorage.getItem("gamesHubArcheryBest")) || 0; }
    catch (_) { return 0; }
  }

  function saveBest(value) {
    try { localStorage.setItem("gamesHubArcheryBest", String(value)); }
    catch (_) { /* The game remains playable when storage is unavailable. */ }
  }

  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    state.dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.max(1, Math.round(rect.width * state.dpr));
    canvas.height = Math.max(1, Math.round(rect.height * state.dpr));
    ctx.setTransform((rect.width / WORLD.width) * state.dpr, 0, 0, (rect.height / WORLD.height) * state.dpr, 0, 0);
  }

  function canvasPoint(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((clientX - rect.left) / rect.width) * WORLD.width,
      y: ((clientY - rect.top) / rect.height) * WORLD.height
    };
  }

  function clampAim(point) {
    state.aim.x = Math.max(220, Math.min(WORLD.width - 38, point.x));
    state.aim.y = Math.max(65, Math.min(WORLD.height - 100, point.y));
  }

  function setOverlay(element, visible) {
    element.classList.toggle("is-visible", visible);
    element.setAttribute("aria-hidden", String(!visible));
  }

  function updateHud() {
    ui.score.textContent = state.score;
    ui.arrows.textContent = state.arrowsLeft;
    ui.best.textContent = state.best;
    ui.windArrow.textContent = state.wind < -0.15 ? "←" : state.wind > 0.15 ? "→" : "·";
    ui.windValue.textContent = Math.abs(state.wind).toFixed(1);
    ui.powerValue.textContent = `${Math.round(state.power)}%`;
    ui.powerFill.style.width = `${state.power}%`;
    ui.powerFill.style.background = state.power > 82 ? "#ef5b5b" : state.power > 55 ? "#ffb84d" : "#22c55e";
  }

  function resetRound() {
    state.mode = "playing";
    state.score = 0;
    state.arrowsLeft = TOTAL_ARROWS;
    state.hits = 0;
    state.bullseyes = 0;
    state.power = 0;
    state.charging = false;
    state.arrow = null;
    state.impactMarks = [];
    state.target.x = 655;
    state.target.y = 245;
    state.target.direction = 1;
    state.target.speed = 48;
    state.aim.x = state.target.x;
    state.aim.y = state.target.y;
    setWind();
    setOverlay(ui.startOverlay, false);
    setOverlay(ui.pauseOverlay, false);
    setOverlay(ui.resultOverlay, false);
    ui.pauseButton.setAttribute("aria-pressed", "false");
    ui.pauseButton.setAttribute("aria-label", "Pause game");
    ui.pauseIcon.textContent = "Ⅱ";
    showMessage("Round started", "Aim, hold, and release.", 1300);
    updateHud();
  }

  function beginRound() {
    resetRound();
    canvas.focus({ preventScroll: true });
  }

  function setWind() {
    const magnitude = Math.random() < 0.14 ? 0 : 0.4 + Math.random() * 3.7;
    state.wind = magnitude * (Math.random() < 0.5 ? -1 : 1);
  }

  function startCharge() {
    if (state.mode !== "playing" || state.arrow || state.charging) return;
    state.charging = true;
    state.chargeDirection = 1;
    if (state.power < 12) state.power = 12;
    playTone(220, .04, "sine", .025);
  }

  function releaseShot() {
    if (!state.charging || state.mode !== "playing" || state.arrow) return;
    state.charging = false;
    const shotPower = Math.max(12, state.power);
    const start = { x: 142, y: 435 };
    const travel = 1.18 - (shotPower / 100) * .62;
    const windDrift = state.wind * travel * 17;
    const verticalDrop = (100 - shotPower) * .34;
    state.arrow = {
      start,
      control: { x: (start.x + state.aim.x) / 2, y: Math.min(start.y, state.aim.y) - 70 + verticalDrop * .2 },
      end: { x: state.aim.x + windDrift, y: state.aim.y + verticalDrop },
      t: 0,
      duration: travel,
      power: shotPower
    };
    state.arrowsLeft -= 1;
    playTone(150, .11, "triangle", .04, 330);
    updateHud();
  }

  function resolveShot() {
    if (!state.arrow) return;
    const impact = state.arrow.end;
    const dx = impact.x - state.target.x;
    const dy = impact.y - state.target.y;
    const distance = Math.hypot(dx, dy);
    const ratio = distance / state.target.radius;
    let points = 0;
    if (ratio <= .16) points = 10;
    else if (ratio <= .34) points = 8;
    else if (ratio <= .54) points = 6;
    else if (ratio <= .76) points = 4;
    else if (ratio <= 1) points = 2;

    if (points > 0) state.hits += 1;
    if (points === 10) state.bullseyes += 1;
    state.score += points;
    state.impactMarks.push({ x: impact.x, y: impact.y, points, life: 1 });
    if (state.impactMarks.length > 7) state.impactMarks.shift();

    const feedback = points === 10 ? ["Bullseye!", "+10 points"]
      : points >= 6 ? ["Great shot!", `+${points} points`]
      : points > 0 ? ["On target", `+${points} points`]
      : ["Missed", "Adjust for wind and power"];
    showMessage(feedback[0], feedback[1], 1200);
    playTone(points === 10 ? 700 : points ? 480 : 115, points ? .14 : .2, points ? "sine" : "sawtooth", .045);

    state.power = 0;
    state.arrow = null;
    state.target.speed = 48 + (TOTAL_ARROWS - state.arrowsLeft) * 5;
    setWind();
    updateHud();

    if (state.arrowsLeft <= 0) {
      window.setTimeout(endRound, 650);
    }
  }

  function endRound() {
    if (state.mode !== "playing") return;
    state.mode = "finished";
    const oldBest = state.best;
    if (state.score > state.best) {
      state.best = state.score;
      saveBest(state.best);
    }
    const accuracy = Math.round((state.hits / TOTAL_ARROWS) * 100);
    ui.finalScore.textContent = state.score;
    ui.finalAccuracy.textContent = `${accuracy}%`;
    ui.finalBullseyes.textContent = state.bullseyes;
    ui.resultTitle.textContent = state.score >= 80 ? "Master Archer!" : state.score >= 55 ? "Sharp Shooting!" : state.score >= 30 ? "Nice Shooting!" : "Keep Practicing!";
    ui.bestMessage.textContent = state.score > oldBest ? `New best score: ${state.score}!` : `Your best score is ${state.best}.`;
    setOverlay(ui.resultOverlay, true);
    updateHud();
  }

  function togglePause(forceResume = false) {
    if (state.mode === "ready" || state.mode === "finished") return;
    if (state.mode === "paused" || forceResume) {
      state.mode = "playing";
      state.lastTime = performance.now();
      setOverlay(ui.pauseOverlay, false);
      ui.pauseButton.setAttribute("aria-pressed", "false");
      ui.pauseButton.setAttribute("aria-label", "Pause game");
      ui.pauseIcon.textContent = "Ⅱ";
    } else {
      state.mode = "paused";
      state.charging = false;
      setOverlay(ui.pauseOverlay, true);
      ui.pauseButton.setAttribute("aria-pressed", "true");
      ui.pauseButton.setAttribute("aria-label", "Resume game");
      ui.pauseIcon.textContent = "▶";
    }
  }

  function showMessage(title, text, duration) {
    window.clearTimeout(state.messageTimer);
    ui.messageTitle.textContent = title;
    ui.messageText.textContent = text;
    ui.message.classList.add("show");
    state.messageTimer = window.setTimeout(() => ui.message.classList.remove("show"), duration);
  }

  function setupAudio() {
    if (!state.audio) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) state.audio = new AudioContextClass();
    }
    if (state.audio?.state === "suspended") state.audio.resume();
  }

  function playTone(frequency, duration, type = "sine", volume = .04, endFrequency = null) {
    if (state.muted) return;
    setupAudio();
    if (!state.audio) return;
    const oscillator = state.audio.createOscillator();
    const gain = state.audio.createGain();
    const now = state.audio.currentTime;
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, now);
    if (endFrequency) oscillator.frequency.exponentialRampToValueAtTime(endFrequency, now + duration);
    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(.0001, now + duration);
    oscillator.connect(gain).connect(state.audio.destination);
    oscillator.start(now);
    oscillator.stop(now + duration);
  }

  function update(dt) {
    if (state.mode !== "playing") return;
    if (state.charging) {
      state.power += state.chargeDirection * 72 * dt;
      if (state.power >= 100) { state.power = 100; state.chargeDirection = -1; }
      if (state.power <= 18) { state.power = 18; state.chargeDirection = 1; }
      updateHud();
    }

    if (!state.arrow) {
      state.target.x += state.target.direction * state.target.speed * dt;
      const minX = WORLD.width * .55;
      const maxX = WORLD.width - state.target.radius - 34;
      if (state.target.x > maxX) { state.target.x = maxX; state.target.direction = -1; }
      if (state.target.x < minX) { state.target.x = minX; state.target.direction = 1; }
    } else {
      state.arrow.t = Math.min(1, state.arrow.t + dt / state.arrow.duration);
      if (state.arrow.t >= 1) resolveShot();
    }

    state.impactMarks.forEach(mark => { mark.life = Math.max(.25, mark.life - dt * .1); });
  }

  function draw() {
    ctx.clearRect(0, 0, WORLD.width, WORLD.height);
    drawBackground();
    drawTarget();
    drawImpactMarks();
    drawArcher();
    if (state.arrow) drawFlyingArrow();
    if (state.mode === "playing" && !state.arrow) drawCrosshair();
  }

  function drawBackground() {
    const sky = ctx.createLinearGradient(0, 0, 0, WORLD.height);
    sky.addColorStop(0, "#94c7be");
    sky.addColorStop(.56, "#c7ddd0");
    sky.addColorStop(.57, "#6f8e5a");
    sky.addColorStop(1, "#344b35");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, WORLD.width, WORLD.height);

    ctx.fillStyle = "rgba(255,248,214,.75)";
    ctx.beginPath(); ctx.arc(795, 92, 42, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "rgba(55,83,60,.36)";
    for (let i = 0; i < 10; i += 1) {
      const x = i * 112 - 25;
      ctx.beginPath();
      ctx.moveTo(x, 355); ctx.lineTo(x + 58, 185 + (i % 3) * 20); ctx.lineTo(x + 118, 355); ctx.fill();
    }
    ctx.fillStyle = "rgba(24,55,35,.34)";
    for (let i = 0; i < 13; i += 1) {
      const x = i * 82 - 15;
      ctx.beginPath();
      ctx.moveTo(x, 392); ctx.lineTo(x + 44, 242 + (i % 2) * 24); ctx.lineTo(x + 89, 392); ctx.fill();
    }
    ctx.fillStyle = "rgba(255,255,255,.1)";
    ctx.beginPath(); ctx.ellipse(570, 555, 410, 72, 0, 0, Math.PI * 2); ctx.fill();

    ctx.strokeStyle = "rgba(255,255,255,.18)";
    ctx.lineWidth = 2;
    for (let i = 0; i < 4; i += 1) {
      ctx.beginPath(); ctx.moveTo(360 + i * 120, 410); ctx.lineTo(330 + i * 155, 600); ctx.stroke();
    }
  }

  function drawTarget() {
    const { x, y, radius } = state.target;
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = "#72543e";
    ctx.fillRect(-7, radius - 3, 14, 180);
    ctx.fillStyle = "#593f2e";
    ctx.beginPath(); ctx.moveTo(-7, radius + 95); ctx.lineTo(-52, radius + 172); ctx.lineTo(-39, radius + 172); ctx.lineTo(0, radius + 113); ctx.lineTo(39, radius + 172); ctx.lineTo(52, radius + 172); ctx.lineTo(7, radius + 95); ctx.fill();

    ctx.shadowColor = "rgba(0,0,0,.28)"; ctx.shadowBlur = 18; ctx.shadowOffsetY = 8;
    const rings = [
      [1, "#f5f1e5"], [.76, "#20292f"], [.54, "#4b8bcf"], [.34, "#e65757"], [.16, "#f5cf43"]
    ];
    rings.forEach(([scale, color]) => {
      ctx.fillStyle = color;
      ctx.beginPath(); ctx.arc(0, 0, radius * scale, 0, Math.PI * 2); ctx.fill();
      ctx.shadowColor = "transparent";
    });
    ctx.strokeStyle = "rgba(19,24,28,.28)"; ctx.lineWidth = 2;
    rings.forEach(([scale]) => { ctx.beginPath(); ctx.arc(0, 0, radius * scale, 0, Math.PI * 2); ctx.stroke(); });
    ctx.restore();
  }

  function drawArcher() {
    const x = 142, y = 435;
    ctx.save();
    ctx.strokeStyle = "#e6bc73"; ctx.lineWidth = 7; ctx.lineCap = "round";
    ctx.beginPath(); ctx.arc(x - 14, y - 85, 18, 0, Math.PI * 2); ctx.fillStyle = "#c88754"; ctx.fill();
    ctx.strokeStyle = "#253229"; ctx.lineWidth = 18;
    ctx.beginPath(); ctx.moveTo(x - 15, y - 62); ctx.lineTo(x - 18, y + 5); ctx.stroke();
    ctx.lineWidth = 9;
    ctx.beginPath(); ctx.moveTo(x - 18, y - 45); ctx.lineTo(x + 15, y - 5); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x - 18, y + 1); ctx.lineTo(x - 46, y + 64); ctx.moveTo(x - 15, y + 1); ctx.lineTo(x + 13, y + 64); ctx.stroke();

    const angle = Math.atan2(state.aim.y - y, state.aim.x - x);
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.strokeStyle = "#e6bc73"; ctx.lineWidth = 5;
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(37, 0); ctx.stroke();
    ctx.strokeStyle = "#b9783e"; ctx.lineWidth = 5;
    ctx.beginPath(); ctx.arc(44, 0, 43, -Math.PI / 2, Math.PI / 2); ctx.stroke();
    const pull = state.charging ? state.power * .28 : 0;
    ctx.strokeStyle = "rgba(255,255,255,.86)"; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(44, -43); ctx.lineTo(44 - pull, 0); ctx.lineTo(44, 43); ctx.stroke();
    if (!state.arrow) {
      ctx.strokeStyle = "#ddd5bd"; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(19 - pull, 0); ctx.lineTo(74, 0); ctx.stroke();
      ctx.fillStyle = "#ddd5bd"; ctx.beginPath(); ctx.moveTo(78, 0); ctx.lineTo(68, -4); ctx.lineTo(68, 4); ctx.closePath(); ctx.fill();
    }
    ctx.restore();
  }

  function bezierPoint(arrow, t) {
    const inv = 1 - t;
    return {
      x: inv * inv * arrow.start.x + 2 * inv * t * arrow.control.x + t * t * arrow.end.x,
      y: inv * inv * arrow.start.y + 2 * inv * t * arrow.control.y + t * t * arrow.end.y
    };
  }

  function drawFlyingArrow() {
    const p = bezierPoint(state.arrow, state.arrow.t);
    const previous = bezierPoint(state.arrow, Math.max(0, state.arrow.t - .015));
    const angle = Math.atan2(p.y - previous.y, p.x - previous.x);
    ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(angle);
    ctx.strokeStyle = "#eee6cf"; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(-28, 0); ctx.lineTo(20, 0); ctx.stroke();
    ctx.fillStyle = "#eee6cf"; ctx.beginPath(); ctx.moveTo(27, 0); ctx.lineTo(16, -5); ctx.lineTo(16, 5); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#ef5b5b"; ctx.fillRect(-30, -5, 12, 4); ctx.fillRect(-30, 1, 12, 4);
    ctx.restore();
  }

  function drawImpactMarks() {
    state.impactMarks.forEach(mark => {
      ctx.save(); ctx.globalAlpha = mark.life;
      ctx.fillStyle = mark.points ? "#17251f" : "#ef5b5b";
      ctx.beginPath(); ctx.arc(mark.x, mark.y, 5, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = "#fff"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(mark.x - 8, mark.y - 8); ctx.lineTo(mark.x + 8, mark.y + 8); ctx.moveTo(mark.x + 8, mark.y - 8); ctx.lineTo(mark.x - 8, mark.y + 8); ctx.stroke();
      ctx.restore();
    });
  }

  function drawCrosshair() {
    const { x, y } = state.aim;
    const pulse = state.charging ? 15 - state.power * .04 : 17;
    ctx.save();
    ctx.strokeStyle = state.charging ? "#ffcf72" : "rgba(255,255,255,.9)";
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(x, y, pulse, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x - 27, y); ctx.lineTo(x - 8, y); ctx.moveTo(x + 8, y); ctx.lineTo(x + 27, y); ctx.moveTo(x, y - 27); ctx.lineTo(x, y - 8); ctx.moveTo(x, y + 8); ctx.lineTo(x, y + 27); ctx.stroke();
    ctx.fillStyle = "rgba(255,255,255,.95)"; ctx.beginPath(); ctx.arc(x, y, 2.5, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }

  function frame(time) {
    const dt = Math.min((time - state.lastTime) / 1000 || 0, .033);
    state.lastTime = time;
    update(dt);
    draw();
    requestAnimationFrame(frame);
  }

  canvas.addEventListener("pointermove", event => {
    if (state.mode !== "playing" || state.arrow) return;
    clampAim(canvasPoint(event.clientX, event.clientY));
  });
  canvas.addEventListener("pointerdown", event => {
    if (state.mode !== "playing" || state.arrow) return;
    event.preventDefault();
    canvas.setPointerCapture(event.pointerId);
    clampAim(canvasPoint(event.clientX, event.clientY));
    startCharge();
  });
  canvas.addEventListener("pointerup", event => {
    event.preventDefault();
    if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
    releaseShot();
  });
  canvas.addEventListener("pointercancel", () => { state.charging = false; state.power = 0; updateHud(); });
  canvas.addEventListener("contextmenu", event => event.preventDefault());

  window.addEventListener("keydown", event => {
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space"].includes(event.code) && state.mode === "playing") event.preventDefault();
    if (event.code === "KeyP") togglePause();
    if (state.mode !== "playing" || state.arrow) return;
    const step = event.shiftKey ? 8 : 4;
    if (event.code === "ArrowUp") clampAim({ x: state.aim.x, y: state.aim.y - step });
    if (event.code === "ArrowDown") clampAim({ x: state.aim.x, y: state.aim.y + step });
    if (event.code === "ArrowLeft") clampAim({ x: state.aim.x - step, y: state.aim.y });
    if (event.code === "ArrowRight") clampAim({ x: state.aim.x + step, y: state.aim.y });
    if (event.code === "Space" && !event.repeat) startCharge();
  });
  window.addEventListener("keyup", event => { if (event.code === "Space") releaseShot(); });
  window.addEventListener("resize", resizeCanvas);
  document.addEventListener("visibilitychange", () => { if (document.hidden && state.mode === "playing") togglePause(); });

  document.getElementById("start-button").addEventListener("click", () => { setupAudio(); beginRound(); });
  document.getElementById("replay-button").addEventListener("click", beginRound);
  document.getElementById("restart-button").addEventListener("click", beginRound);
  document.getElementById("resume-button").addEventListener("click", () => togglePause(true));
  ui.pauseButton.addEventListener("click", () => togglePause());
  ui.soundButton.addEventListener("click", () => {
    state.muted = !state.muted;
    ui.soundButton.setAttribute("aria-pressed", String(state.muted));
    ui.soundButton.setAttribute("aria-label", state.muted ? "Turn on game sound" : "Mute game sound");
    ui.soundIcon.textContent = state.muted ? "×" : "♪";
    if (!state.muted) playTone(440, .08, "sine", .03);
  });

  ui.best.textContent = state.best;
  resizeCanvas();
  updateHud();
  requestAnimationFrame(frame);
})();


}
function begin(){poster.hidden=true;gm.hidden=false;if(!booted){booted=true;var s=document.createElement("style");s.textContent=LOOK;document.head.appendChild(s);boot();}else{var r=document.getElementById("start-button");if(r)r.click();}}
poster.addEventListener("click",begin);
var nb=document.getElementById("new");if(nb)nb.addEventListener("click",begin);
})();
