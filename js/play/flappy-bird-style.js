/* Flappy Bird-Style - game logic + its own look. Layout lives in style.css; page shell lives in the HTML. */
(function(){"use strict";
var gm=document.getElementById("gm"),poster=document.getElementById("poster"),booted=false;
var LOOK=".gm{\n  --primary: #5b5ce2;\n  --primary-dark: #4546b8;\n  --secondary: #16b8c4;\n  --action: #ffb84d;\n  --success: #22c55e;\n  --danger: #ef5b5b;\n  --background: #f6f7fb;\n  \n  \n  \n  \n  \n}.gm *{ box-sizing: border-box; }.gm button{ font: inherit; }.gm button{ -webkit-tap-highlight-color: transparent; }.gm .section-heading-row{ display: flex; align-items: center; justify-content: space-between; gap: 24px; }.gm .all-games-link,.gm .section-heading-row > a{ color: var(--primary-dark); font-size: 15px; font-weight: 800; text-decoration: none; }.gm .all-games-link:hover,.gm .section-heading-row > a:hover{ text-decoration: underline; }.gm .section-label,.gm .guide-kicker{ color: var(--primary-dark); font-size: 14px; font-weight: 800; letter-spacing: .1em; text-transform: uppercase; }.gm h2,.gm h3,.gm p{ margin-top: 0; }.gm h2{ margin: 8px 0 20px; font-size: clamp(28px, 4vw, 36px); line-height: 1.18; letter-spacing: -.025em; }.gm h3{ font-size: 21px; line-height: 1.3; }.gm .game-layout{ display: grid; grid-template-columns: minmax(0, 760px) minmax(270px, 1fr); align-items: start; gap: 24px; }.gm .game-card,.gm .quick-guide{ border: 1px solid var(--border); border-radius: 20px; background: var(--card); box-shadow: var(--shadow); }.gm .game-card{ overflow: hidden; }.gm .game-toolbar{ min-height: 74px; display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; gap: 16px; padding: 12px 22px; border-bottom: 1px solid var(--border); }.gm .metric{ display: flex; align-items: baseline; gap: 9px; }.gm .metric-right{ justify-content: flex-end; }.gm .metric-label{ color: var(--muted); font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: .05em; }.gm .metric strong{ font-size: 25px; line-height: 1; }.gm .status-wrap{ display: flex; align-items: center; gap: 7px; color: var(--muted); font-size: 15px; font-weight: 700; }.gm .status-dot{ width: 9px; height: 9px; border-radius: 50%; background: var(--action); }.gm .status-dot.playing{ background: var(--success); }.gm .status-dot.ended{ background: var(--danger); }.gm .canvas-wrap{ position: relative; width: min(100%, 560px); margin: 24px auto; padding-inline: 18px; }.gm #gameCanvas{ display: block; width: 100%; aspect-ratio: 2 / 3; border-radius: 18px; background: #8ddcf4; touch-action: manipulation; cursor: pointer; box-shadow: inset 0 0 0 1px rgba(23,27,45,.1); }.gm .game-overlay{ position: absolute; inset: 0 18px; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 28px; border-radius: 18px; background: rgba(17, 24, 39, .58); color: #fff; text-align: center; }.gm .game-overlay[hidden]{ display: none; }.gm .overlay-icon{ display: grid; place-items: center; width: 58px; height: 58px; margin-bottom: 16px; border-radius: 18px; background: var(--action); color: #4d3511; font-size: 24px; font-weight: 800; transform: rotate(45deg); }.gm .overlay-icon::first-line{ transform: rotate(-45deg); }.gm .game-overlay h2{ margin: 0 0 8px; font-size: 30px; }.gm .game-overlay p{ margin-bottom: 20px; color: #eef2ff; font-size: 16px; }.gm .primary-button,.gm .control-button{ min-height: 48px; border: 0; border-radius: 12px; font-weight: 800; cursor: pointer; }.gm .primary-button{ padding: 0 24px; background: var(--action); color: #3d2a0c; box-shadow: 0 8px 20px rgba(0,0,0,.18); }.gm .primary-button:hover{ background: #ffc66e; transform: translateY(-1px); }.gm .game-actions{ display: grid; grid-template-columns: 1.4fr 1fr 1fr; gap: 12px; padding: 0 22px 16px; }.gm .control-button{ padding: 0 16px; border: 1px solid var(--border); background: #f7f7fb; color: var(--text); }.gm .control-button:hover:not(:disabled){ border-color: #c8c9f6; background: #eeeefe; }.gm .control-button:disabled{ opacity: .48; cursor: not-allowed; }.gm .flap-button{ border-color: var(--primary); background: var(--primary); color: #fff; }.gm .flap-button:hover:not(:disabled){ border-color: var(--primary-dark); background: var(--primary-dark); }.gm .flap-button span{ margin-right: 7px; font-size: 20px; }.gm .control-hint{ margin: 0 20px 20px; color: var(--muted); font-size: 14px; text-align: center; }.gm button:focus-visible,.gm summary:focus-visible{ outline: 3px solid rgba(91,92,226,.35); outline-offset: 3px; }.gm .quick-guide{ padding: 28px; }.gm .quick-guide h2{ font-size: 28px; }.gm .quick-guide ol{ display: grid; gap: 22px; margin: 26px 0; padding: 0; list-style: none; }.gm .quick-guide li{ display: grid; grid-template-columns: 38px 1fr; gap: 13px; }.gm .quick-guide li > span{ display: grid; place-items: center; width: 36px; height: 36px; border-radius: 11px; background: #eeeefe; color: var(--primary-dark); font-weight: 800; }.gm .quick-guide strong{ display: block; line-height: 1.3; }.gm .quick-guide li p,.gm .tip-box p{ margin: 3px 0 0; color: var(--muted); font-size: 15px; line-height: 1.5; }.gm .tip-box{ padding: 18px; border-radius: 14px; background: #fff6e7; border: 1px solid #ffe1ad; }.gm .info-cards{ display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; padding: 22px 0 10px; }.gm .info-cards article,.gm .tips-grid article{ padding: 24px; border: 1px solid var(--border); border-radius: 16px; background: var(--card); }.gm .card-icon{ display: grid; place-items: center; width: 44px; height: 44px; margin-bottom: 18px; border-radius: 12px; background: #e9fafb; color: #087e87; font-size: 20px; font-weight: 800; }.gm .info-cards h3{ margin-bottom: 8px; }.gm .info-cards p,.gm .tips-grid p{ margin-bottom: 0; color: var(--muted); font-size: 16px; }.gm .about-section{ padding-top: 76px; }.gm .tips-section{ padding: 60px 0 20px; }.gm .tips-grid{ display: grid; grid-template-columns: repeat(2, 1fr); gap: 18px; margin-top: 28px; }.gm .tips-grid strong{ font-size: 19px; }.gm .section-heading-row h2{ margin-bottom: 0; }.gm .snake-art{ background: #dff7ee; color: #15825e; }.gm .blocks-art{ background: #eeeefe; color: var(--primary); font-size: 48px; }.gm .number-art{ background: #fff1d8; color: #a66212; }@media (max-width: 900px){.gm .game-layout{ grid-template-columns: 1fr; }.gm .quick-guide{ display: none; }}@media (max-width: 640px){.gm .all-games-link{ font-size: 14px; }.gm .game-toolbar{ min-height: 66px; padding-inline: 15px; }.gm .metric{ display: grid; gap: 0; }.gm .metric-right{ justify-items: end; }.gm .metric strong{ font-size: 22px; }.gm .status-wrap{ font-size: 14px; }.gm .canvas-wrap{ margin: 14px auto 16px; padding-inline: 10px; }.gm .game-overlay{ inset-inline: 10px; }.gm .game-overlay h2{ font-size: 27px; }.gm .game-actions{ grid-template-columns: 1.3fr 1fr; padding-inline: 12px; }.gm #restartButton{ grid-column: 1 / -1; }.gm .control-hint{ margin-inline: 12px; }.gm .info-cards,.gm .tips-grid{ grid-template-columns: 1fr; }.gm .info-cards{ gap: 14px; }.gm .tips-section{ padding-top: 48px; }.gm .section-heading-row{ align-items: flex-end; }}@media (prefers-reduced-motion: reduce){.gm *,.gm *::before,.gm *::after{ transition-duration: .01ms !important; animation-duration: .01ms !important; }}";
function __ready(f){f()}
function boot(){
"use strict";

(() => {
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");
  const overlay = document.getElementById("gameOverlay");
  const overlayIcon = document.getElementById("overlayIcon");
  const overlayTitle = document.getElementById("overlayTitle");
  const overlayMessage = document.getElementById("overlayMessage");
  const startButton = document.getElementById("startButton");
  const flapButton = document.getElementById("flapButton");
  const pauseButton = document.getElementById("pauseButton");
  const restartButton = document.getElementById("restartButton");
  const scoreDisplay = document.getElementById("scoreDisplay");
  const bestDisplay = document.getElementById("bestDisplay");
  const statusText = document.getElementById("statusText");
  const statusDot = document.getElementById("statusDot");

  const WORLD = { width: 480, height: 720, groundY: 660 };
  const STATE = { READY: "ready", PLAYING: "playing", PAUSED: "paused", OVER: "over" };
  const PIPE = { width: 72, gap: 168, spacing: 230, capHeight: 28 };
  const BIRD = { x: 118, radius: 18, gravity: 1450, flap: -455, maxFall: 650 };
  const BEST_KEY = "gamesHubFlappyStyleBest";

  let state = STATE.READY;
  let bird = { y: 320, velocity: 0, rotation: 0 };
  let pipes = [];
  let particles = [];
  let score = 0;
  let best = readBest();
  let speed = 155;
  let spawnDistance = 0;
  let lastTime = 0;
  let animationId = 0;
  let readyTime = 0;

  bestDisplay.textContent = String(best);
  resizeCanvas();
  resetRound();
  animationId = requestAnimationFrame(loop);

  function readBest() {
    try {
      const value = Number.parseInt(localStorage.getItem(BEST_KEY) || "0", 10);
      return Number.isFinite(value) && value > 0 ? value : 0;
    } catch (_) {
      return 0;
    }
  }

  function saveBest() {
    try { localStorage.setItem(BEST_KEY, String(best)); } catch (_) { /* Storage can be unavailable in private mode. */ }
  }

  function resizeCanvas() {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(WORLD.width * ratio);
    canvas.height = Math.round(WORLD.height * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  function resetRound() {
    state = STATE.READY;
    bird = { y: 320, velocity: 0, rotation: 0 };
    pipes = [];
    particles = [];
    score = 0;
    speed = 155;
    spawnDistance = 145;
    scoreDisplay.textContent = "0";
    setStatus("Ready", "");
    pauseButton.disabled = true;
    pauseButton.textContent = "Pause";
    showOverlay("▲", "Ready to fly?", "Tap, click, or press Space to flap.", "Start game");
  }

  function startRound() {
    if (state === STATE.PAUSED) {
      resumeRound();
      return;
    }
    if (state === STATE.OVER) resetRound();
    state = STATE.PLAYING;
    overlay.hidden = true;
    pauseButton.disabled = false;
    setStatus("Flying", "playing");
    lastTime = performance.now();
    flap();
  }

  function flap() {
    if (state === STATE.READY || state === STATE.OVER) {
      startRound();
      return;
    }
    if (state !== STATE.PLAYING) return;
    bird.velocity = BIRD.flap;
    addFlapParticles();
  }

  function pauseRound() {
    if (state === STATE.PLAYING) {
      state = STATE.PAUSED;
      pauseButton.textContent = "Resume";
      setStatus("Paused", "");
      showOverlay("Ⅱ", "Game paused", "Your current score is safe.", "Resume game");
    } else if (state === STATE.PAUSED) {
      resumeRound();
    }
  }

  function resumeRound() {
    if (state !== STATE.PAUSED) return;
    state = STATE.PLAYING;
    overlay.hidden = true;
    pauseButton.textContent = "Pause";
    setStatus("Flying", "playing");
    lastTime = performance.now();
  }

  function endRound() {
    if (state !== STATE.PLAYING) return;
    state = STATE.OVER;
    pauseButton.disabled = true;
    setStatus("Game over", "ended");
    if (score > best) {
      best = score;
      bestDisplay.textContent = String(best);
      saveBest();
      showOverlay("★", "New best score!", `You scored ${score}. Can you beat it again?`, "Play again");
    } else {
      showOverlay("↻", "Game over", `Score: ${score} · Best: ${best}`, "Play again");
    }
  }

  function showOverlay(icon, title, message, buttonLabel) {
    overlayIcon.textContent = icon;
    overlayTitle.textContent = title;
    overlayMessage.textContent = message;
    startButton.textContent = buttonLabel;
    overlay.hidden = false;
  }

  function setStatus(text, className) {
    statusText.textContent = text;
    statusDot.className = `status-dot${className ? ` ${className}` : ""}`;
  }

  function spawnPipe() {
    const margin = 105;
    const minCenter = margin + PIPE.gap / 2;
    const maxCenter = WORLD.groundY - margin - PIPE.gap / 2;
    const center = minCenter + Math.random() * (maxCenter - minCenter);
    pipes.push({ x: WORLD.width + 12, top: center - PIPE.gap / 2, bottom: center + PIPE.gap / 2, scored: false });
  }

  function update(dt) {
    if (state !== STATE.PLAYING) return;
    speed = Math.min(225, 155 + score * 2.7);
    bird.velocity = Math.min(BIRD.maxFall, bird.velocity + BIRD.gravity * dt);
    bird.y += bird.velocity * dt;
    bird.rotation = Math.max(-0.48, Math.min(1.18, bird.velocity / 600));

    spawnDistance += speed * dt;
    if (spawnDistance >= PIPE.spacing) {
      spawnDistance -= PIPE.spacing;
      spawnPipe();
    }

    for (const pipe of pipes) {
      pipe.x -= speed * dt;
      if (!pipe.scored && pipe.x + PIPE.width < BIRD.x - BIRD.radius) {
        pipe.scored = true;
        score += 1;
        scoreDisplay.textContent = String(score);
      }
    }
    pipes = pipes.filter(pipe => pipe.x + PIPE.width > -10);

    for (const particle of particles) {
      particle.x -= (speed * .45) * dt;
      particle.y += particle.vy * dt;
      particle.life -= dt;
    }
    particles = particles.filter(particle => particle.life > 0);

    if (bird.y - BIRD.radius <= 0 || bird.y + BIRD.radius >= WORLD.groundY || pipes.some(collidesWithPipe)) {
      endRound();
    }
  }

  function collidesWithPipe(pipe) {
    const nearestX = Math.max(pipe.x, Math.min(BIRD.x, pipe.x + PIPE.width));
    const hitsHorizontal = Math.abs(BIRD.x - nearestX) < BIRD.radius - 2;
    if (!hitsHorizontal) return false;
    return bird.y - BIRD.radius + 3 < pipe.top || bird.y + BIRD.radius - 3 > pipe.bottom;
  }

  function addFlapParticles() {
    for (let index = 0; index < 4; index += 1) {
      particles.push({
        x: BIRD.x - 20,
        y: bird.y + (Math.random() - .5) * 15,
        vy: (Math.random() - .5) * 50,
        size: 3 + Math.random() * 4,
        life: .28 + Math.random() * .2
      });
    }
  }

  function loop(time) {
    const dt = Math.min((time - (lastTime || time)) / 1000, .034);
    lastTime = time;
    readyTime += dt;
    update(dt);
    draw();
    animationId = requestAnimationFrame(loop);
  }

  function draw() {
    ctx.clearRect(0, 0, WORLD.width, WORLD.height);
    drawSky();
    drawPipes();
    drawGround();
    const floatOffset = state === STATE.READY ? Math.sin(readyTime * 3.2) * 7 : 0;
    drawParticles();
    drawBird(bird.y + floatOffset, state === STATE.READY ? Math.sin(readyTime * 3.2) * .08 : bird.rotation);
  }

  function drawSky() {
    const gradient = ctx.createLinearGradient(0, 0, 0, WORLD.groundY);
    gradient.addColorStop(0, "#77d1ee");
    gradient.addColorStop(1, "#d7f4f6");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, WORLD.width, WORLD.groundY);
    drawCloud(74, 110, .9);
    drawCloud(350, 195, .7);
    drawCloud(225, 70, .48);
    ctx.fillStyle = "rgba(56, 156, 143, .16)";
    ctx.beginPath();
    ctx.moveTo(0, WORLD.groundY);
    for (let x = 0; x <= WORLD.width; x += 35) ctx.lineTo(x, 590 + Math.sin(x * .035) * 16);
    ctx.lineTo(WORLD.width, WORLD.groundY);
    ctx.closePath();
    ctx.fill();
  }

  function drawCloud(x, y, scale) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    ctx.fillStyle = "rgba(255,255,255,.68)";
    ctx.beginPath();
    ctx.arc(-25, 5, 22, 0, Math.PI * 2);
    ctx.arc(0, -5, 30, 0, Math.PI * 2);
    ctx.arc(31, 7, 20, 0, Math.PI * 2);
    ctx.fillRect(-27, 4, 60, 22);
    ctx.fill();
    ctx.restore();
  }

  function drawPipes() {
    for (const pipe of pipes) {
      drawPipeSegment(pipe.x, 0, PIPE.width, pipe.top, false);
      drawPipeSegment(pipe.x, pipe.bottom, PIPE.width, WORLD.groundY - pipe.bottom, true);
    }
  }

  function drawPipeSegment(x, y, width, height, lower) {
    const bodyGradient = ctx.createLinearGradient(x, 0, x + width, 0);
    bodyGradient.addColorStop(0, "#179b66");
    bodyGradient.addColorStop(.5, "#35cf84");
    bodyGradient.addColorStop(1, "#087a50");
    ctx.fillStyle = bodyGradient;
    ctx.fillRect(x + 6, y, width - 12, height);
    const capY = lower ? y : y + height - PIPE.capHeight;
    ctx.fillStyle = "#24b874";
    ctx.fillRect(x, capY, width, PIPE.capHeight);
    ctx.fillStyle = "rgba(255,255,255,.2)";
    ctx.fillRect(x + 10, lower ? y + PIPE.capHeight : y, 8, Math.max(0, height - PIPE.capHeight));
    ctx.strokeStyle = "#096947";
    ctx.lineWidth = 3;
    ctx.strokeRect(x, capY, width, PIPE.capHeight);
  }

  function drawGround() {
    ctx.fillStyle = "#d9b568";
    ctx.fillRect(0, WORLD.groundY, WORLD.width, WORLD.height - WORLD.groundY);
    ctx.fillStyle = "#6ec05b";
    ctx.fillRect(0, WORLD.groundY, WORLD.width, 12);
    ctx.fillStyle = "rgba(255,255,255,.28)";
    for (let x = -20; x < WORLD.width; x += 42) {
      ctx.beginPath();
      ctx.moveTo(x, WORLD.groundY + 15);
      ctx.lineTo(x + 20, WORLD.groundY + 15);
      ctx.lineTo(x + 3, WORLD.height);
      ctx.lineTo(x - 17, WORLD.height);
      ctx.closePath();
      ctx.fill();
    }
  }

  function drawParticles() {
    for (const particle of particles) {
      ctx.globalAlpha = Math.min(1, particle.life * 3);
      ctx.fillStyle = "#fff4bf";
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  function drawBird(y, rotation) {
    ctx.save();
    ctx.translate(BIRD.x, y);
    ctx.rotate(rotation);
    ctx.fillStyle = "rgba(23,27,45,.18)";
    ctx.beginPath();
    ctx.ellipse(2, 22, 22, 7, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#ffbf45";
    ctx.beginPath();
    ctx.ellipse(0, 0, 25, 20, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#9b6310";
    ctx.lineWidth = 3;
    ctx.stroke();
    const wingY = state === STATE.PLAYING && bird.velocity < 0 ? 5 : 10;
    ctx.fillStyle = "#f08c3a";
    ctx.beginPath();
    ctx.ellipse(-10, wingY, 16, 9, -.35, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(12, -6, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#171b2d";
    ctx.beginPath();
    ctx.arc(15, -6, 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#ef5b5b";
    ctx.beginPath();
    ctx.moveTo(22, 0);
    ctx.lineTo(39, 6);
    ctx.lineTo(21, 10);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  function onKeyDown(event) {
    if (["Space", "ArrowUp"].includes(event.code)) {
      event.preventDefault();
      flap();
    } else if (event.code === "KeyP" || event.code === "Escape") {
      event.preventDefault();
      pauseRound();
    } else if (event.code === "Enter" && !overlay.hidden) {
      event.preventDefault();
      startRound();
    }
  }

  canvas.addEventListener("pointerdown", event => { event.preventDefault(); flap(); });
  flapButton.addEventListener("click", flap);
  startButton.addEventListener("click", startRound);
  pauseButton.addEventListener("click", pauseRound);
  restartButton.addEventListener("click", () => { resetRound(); startRound(); });
  document.addEventListener("keydown", onKeyDown);
  window.addEventListener("resize", resizeCanvas);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden && state === STATE.PLAYING) pauseRound();
  });
  window.addEventListener("pagehide", () => cancelAnimationFrame(animationId), { once: true });
})();


}
function begin(){poster.hidden=true;gm.hidden=false;if(!booted){booted=true;var s=document.createElement("style");s.textContent=LOOK;document.head.appendChild(s);boot();}else{var r=document.getElementById("startButton");if(r)r.click();}}
poster.addEventListener("click",begin);
var nb=document.getElementById("new");if(nb)nb.addEventListener("click",begin);
})();
