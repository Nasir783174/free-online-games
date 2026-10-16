/* Traffic Racing - game logic + its own look. Layout lives in style.css; page shell lives in the HTML. */
(function(){"use strict";
var gm=document.getElementById("gm"),poster=document.getElementById("poster"),booted=false;
var LOOK=".gm{\n  \n  \n  --cyan: #16B8C4;\n  --action: #FFB84D;\n  --success: #22C55E;\n  --danger: #EF5B5B;\n  --page: #F6F7FB;\n  \n  \n  \n  \n  --game: #111827;\n  --game-2: #1F2937;\n}.gm *{ box-sizing: border-box; }.gm button{ font: inherit; }.gm button{ cursor: pointer; }.gm .page{\n  width: min(1180px, calc(100% - 32px));\n  margin: 0 auto;\n  padding: 28px 0 72px;\n}.gm h2{ line-height: 1.12; letter-spacing: -.035em; }.gm h2{\n  font-size: 30px;\n  margin: 0 0 14px;\n}.gm .game-card{\n  background: var(--card);\n  border: 1px solid var(--border);\n  border-radius: 18px;\n  padding: 18px;\n  box-shadow: 0 12px 36px rgba(23,27,45,.07);\n}.gm .hud{\n  display: grid;\n  grid-template-columns: 1fr 1fr 1fr;\n  gap: 12px;\n  margin-bottom: 14px;\n}.gm .hud-item{\n  background: #F8F9FD;\n  border: 1px solid var(--border);\n  border-radius: 12px;\n  padding: 9px 14px;\n}.gm .hud-item span{\n  display: block;\n  color: var(--muted);\n  font-size: 13px;\n  font-weight: 700;\n}.gm .hud-item strong{\n  display: block;\n  font-size: 23px;\n  line-height: 1.25;\n}.gm .hud-item.status strong{ color: var(--brand-dark); }.gm .game-shell{\n  width: 100%;\n  max-width: 760px;\n  margin: auto;\n  position: relative;\n  overflow: hidden;\n  border-radius: 15px;\n  background: var(--game);\n  aspect-ratio: 3 / 5;\n  max-height: 700px;\n}.gm canvas{\n  width: 100%;\n  height: 100%;\n  display: block;\n  touch-action: none;\n}.gm .overlay{\n  position: absolute;\n  inset: 0;\n  display: grid;\n  place-items: center;\n  padding: 24px;\n  background: rgba(17,24,39,.56);\n  transition: opacity .2s ease;\n}.gm .overlay.hidden{\n  opacity: 0;\n  pointer-events: none;\n}.gm .overlay-panel{\n  width: min(440px, 100%);\n  padding: 30px;\n  text-align: center;\n  border-radius: 18px;\n  background: rgba(255,255,255,.97);\n  box-shadow: 0 18px 50px rgba(0,0,0,.25);\n}.gm .overlay-kicker{\n  margin: 0 0 7px;\n  color: var(--brand);\n  font-weight: 800;\n  letter-spacing: .1em;\n  font-size: 12px;\n}.gm .overlay-panel h2{\n  margin-bottom: 9px;\n  font-size: 32px;\n}.gm .overlay-panel p:not(.overlay-kicker){\n  margin: 0 0 20px;\n  color: var(--muted);\n}.gm .primary-btn,.gm .secondary-btn,.gm .control-btn{\n  border: 0;\n  border-radius: 11px;\n  font-weight: 800;\n  transition: transform .15s ease, background .15s ease;\n}.gm .primary-btn{\n  min-height: 48px;\n  padding: 0 24px;\n  color: white;\n  background: var(--brand);\n}.gm .primary-btn:hover{ background: var(--brand-dark); }.gm .secondary-btn{\n  min-height: 46px;\n  padding: 0 18px;\n  color: var(--text);\n  background: #EEF0F7;\n  border: 1px solid var(--border);\n}.gm .primary-btn:hover,.gm .secondary-btn:hover,.gm .control-btn:hover{ transform: translateY(-1px); }.gm .controls{\n  max-width: 760px;\n  margin: 14px auto 0;\n  display: flex;\n  align-items: center;\n  gap: 12px;\n}.gm .control-copy{\n  display: grid;\n  gap: 1px;\n  flex: 1;\n}.gm .control-copy strong{ font-size: 15px; }.gm .control-copy span{ color: var(--muted); font-size: 14px; }.gm .touch-controls{ display: flex; gap: 8px; }.gm .control-btn{\n  width: 54px;\n  height: 48px;\n  color: white;\n  background: var(--game);\n  font-size: 23px;\n}.gm details{\n  border-top: 1px solid var(--border);\n  padding: 15px 0;\n}.gm details:first-of-type{ border-top: 0; }.gm summary{\n  cursor: pointer;\n  font-weight: 700;\n}.gm details p{ margin: 9px 0 0; }.gm button:focus-visible,.gm summary:focus-visible{\n  outline: 3px solid rgba(91,92,226,.35);\n  outline-offset: 3px;\n}@media (max-width: 720px){.gm .page{\n    width: min(100% - 20px, 1180px);\n    padding-top: 20px;\n  }.gm .game-card{ padding: 10px; border-radius: 15px; }.gm .hud{ gap: 7px; }.gm .hud-item{ padding: 7px 9px; }.gm .hud-item strong{ font-size: 20px; }.gm .game-shell{\n    border-radius: 12px;\n    aspect-ratio: 3 / 5;\n    max-height: none;\n  }.gm .controls{\n    flex-wrap: wrap;\n    padding: 2px 2px 4px;\n  }.gm .control-copy{ min-width: 100%; }.gm .touch-controls{ order: 2; flex: 1; }.gm .control-btn{\n    flex: 1;\n    height: 52px;\n  }.gm .secondary-btn{ order: 3; }.gm h2{ font-size: 27px; }}@media (prefers-reduced-motion: reduce){.gm *,.gm *::before,.gm *::after{ scroll-behavior: auto !important; transition: none !important; }}";
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
  const overlayKicker = document.getElementById("overlayKicker");
  const overlayTitle = document.getElementById("overlayTitle");
  const overlayText = document.getElementById("overlayText");
  const startBtn = document.getElementById("startBtn");
  const restartBtn = document.getElementById("restartBtn");
  const leftBtn = document.getElementById("leftBtn");
  const rightBtn = document.getElementById("rightBtn");

  const ROAD_WIDTH_RATIO = 0.68;
  const LANES = 3;
  const PLAYER_COLOR = "#5B5CE2";
  const CAR_COLORS = ["#EF5B5B", "#16B8C4", "#FFB84D", "#F3F4F6", "#8B9CF6"];

  let width = 360;
  let height = 600;
  let dpr = 1;
  let roadLeft = 0;
  let roadWidth = 0;
  let laneWidth = 0;
  let laneCenters = [];
  let animationId = 0;
  let lastTime = 0;
  let roadOffset = 0;
  let spawnTimer = 0;
  let score = 0;
  let best = Number(localStorage.getItem("trafficRacingBest") || 0);
  let state = "ready";
  let traffic = [];
  let particles = [];
  let player = { lane: 1, x: 0, y: 0, w: 42, h: 76, targetX: 0 };

  bestEl.textContent = best;

  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    width = Math.max(280, rect.width);
    height = Math.max(420, rect.height);
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    roadWidth = width * ROAD_WIDTH_RATIO;
    roadLeft = (width - roadWidth) / 2;
    laneWidth = roadWidth / LANES;
    laneCenters = Array.from({ length: LANES }, (_, i) => roadLeft + laneWidth * (i + 0.5));

    player.w = Math.max(34, laneWidth * 0.52);
    player.h = player.w * 1.72;
    player.y = height - player.h - Math.max(24, height * 0.055);
    player.x = laneCenters[player.lane] - player.w / 2;
    player.targetX = player.x;
    draw();
  }

  function resetGame() {
    cancelAnimationFrame(animationId);
    score = 0;
    roadOffset = 0;
    spawnTimer = 0;
    traffic = [];
    particles = [];
    player.lane = 1;
    player.x = laneCenters[player.lane] - player.w / 2;
    player.targetX = player.x;
    scoreEl.textContent = "0";
    statusEl.textContent = "Ready";
    state = "ready";
    showOverlay("TRAFFIC RACING", "Ready to drive?", "Dodge cars, stay on the road, and survive as the speed increases.", "Start Game");
    draw();
  }

  function startGame() {
    if (state === "running") return;
    score = 0;
    roadOffset = 0;
    spawnTimer = 0;
    traffic = [];
    particles = [];
    player.lane = 1;
    player.x = laneCenters[player.lane] - player.w / 2;
    player.targetX = player.x;
    scoreEl.textContent = "0";
    statusEl.textContent = "Driving";
    state = "running";
    overlay.classList.add("hidden");
    lastTime = performance.now();
    animationId = requestAnimationFrame(loop);
  }

  function gameOver() {
    state = "gameover";
    statusEl.textContent = "Game Over";

    if (score > best) {
      best = score;
      localStorage.setItem("trafficRacingBest", String(best));
      bestEl.textContent = best;
    }

    for (let i = 0; i < 22; i++) {
      particles.push({
        x: player.x + player.w / 2,
        y: player.y + player.h / 2,
        vx: (Math.random() - .5) * 260,
        vy: (Math.random() - .5) * 260,
        life: .5 + Math.random() * .55,
        size: 2 + Math.random() * 5
      });
    }

    showOverlay("RUN ENDED", `Score: ${score}`, score >= best && score > 0 ? "New best score! Ready for another run?" : "Traffic got you. Try moving earlier and aim for a higher score.", "Play Again");
    draw();
  }

  function showOverlay(kicker, title, text, buttonText) {
    overlayKicker.textContent = kicker;
    overlayTitle.textContent = title;
    overlayText.textContent = text;
    startBtn.textContent = buttonText;
    overlay.classList.remove("hidden");
  }

  function movePlayer(direction) {
    if (state === "ready" || state === "gameover") {
      startGame();
    }
    if (state !== "running") return;

    player.lane = Math.max(0, Math.min(LANES - 1, player.lane + direction));
    player.targetX = laneCenters[player.lane] - player.w / 2;
  }

  function spawnTraffic() {
    const available = [];
    for (let lane = 0; lane < LANES; lane++) {
      const blocked = traffic.some(car => car.lane === lane && car.y < height * 0.25);
      if (!blocked) available.push(lane);
    }
    if (!available.length) return;

    const lane = available[Math.floor(Math.random() * available.length)];
    const w = Math.max(31, laneWidth * (0.48 + Math.random() * .08));
    const h = w * (1.58 + Math.random() * .18);
    traffic.push({
      lane,
      x: laneCenters[lane] - w / 2,
      y: -h - 20,
      w,
      h,
      speedFactor: .88 + Math.random() * .25,
      color: CAR_COLORS[Math.floor(Math.random() * CAR_COLORS.length)],
      counted: false
    });
  }

  function getSpeed() {
    return Math.min(720, 300 + score * 6);
  }

  function update(dt) {
    const speed = getSpeed();
    roadOffset = (roadOffset + speed * dt) % 70;

    const move = Math.min(1, dt * 13);
    player.x += (player.targetX - player.x) * move;

    spawnTimer += dt;
    const spawnEvery = Math.max(.43, .9 - score * .006);
    if (spawnTimer >= spawnEvery) {
      spawnTimer = 0;
      spawnTraffic();
    }

    for (let i = traffic.length - 1; i >= 0; i--) {
      const car = traffic[i];
      car.y += speed * car.speedFactor * dt;

      if (!car.counted && car.y > player.y + player.h) {
        car.counted = true;
        score++;
        scoreEl.textContent = String(score);
      }

      if (car.y > height + car.h + 20) {
        traffic.splice(i, 1);
        continue;
      }

      if (rectsOverlap(player, car, .12)) {
        gameOver();
        return;
      }
    }

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.life -= dt;
      if (p.life <= 0) particles.splice(i, 1);
    }
  }

  function rectsOverlap(a, b, paddingRatio) {
    const padX = Math.min(a.w, b.w) * paddingRatio;
    const padY = Math.min(a.h, b.h) * paddingRatio;
    return (
      a.x + padX < b.x + b.w - padX &&
      a.x + a.w - padX > b.x + padX &&
      a.y + padY < b.y + b.h - padY &&
      a.y + a.h - padY > b.y + padY
    );
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    drawWorld();
    drawTraffic();
    drawPlayer();
    drawParticles();
  }

  function drawWorld() {
    ctx.fillStyle = "#0B5E45";
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = "#D8B27A";
    ctx.fillRect(0, 0, roadLeft, height);
    ctx.fillRect(roadLeft + roadWidth, 0, width - roadLeft - roadWidth, height);

    ctx.fillStyle = "#111827";
    ctx.fillRect(roadLeft, 0, roadWidth, height);

    ctx.fillStyle = "#374151";
    ctx.fillRect(roadLeft + 6, 0, roadWidth - 12, height);

    ctx.fillStyle = "#F9FAFB";
    ctx.fillRect(roadLeft + 4, 0, 4, height);
    ctx.fillRect(roadLeft + roadWidth - 8, 0, 4, height);

    ctx.strokeStyle = "rgba(255,255,255,.74)";
    ctx.lineWidth = Math.max(3, laneWidth * .035);
    ctx.setLineDash([28, 42]);
    ctx.lineDashOffset = roadOffset;

    for (let i = 1; i < LANES; i++) {
      const x = roadLeft + laneWidth * i;
      ctx.beginPath();
      ctx.moveTo(x, -80);
      ctx.lineTo(x, height + 80);
      ctx.stroke();
    }
    ctx.setLineDash([]);

    // Roadside lane markers / simple scenery.
    const markerGap = 80;
    const markerOffset = roadOffset % markerGap;
    for (let y = -markerGap + markerOffset; y < height; y += markerGap) {
      drawRoadsideMarker(roadLeft - 17, y);
      drawRoadsideMarker(roadLeft + roadWidth + 17, y);
    }
  }

  function drawRoadsideMarker(x, y) {
    ctx.fillStyle = "#F7F7F2";
    ctx.fillRect(x - 4, y, 8, 25);
    ctx.fillStyle = "#EF5B5B";
    ctx.fillRect(x - 4, y, 8, 8);
  }

  function roundedRect(x, y, w, h, r) {
    const radius = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.arcTo(x + w, y, x + w, y + h, radius);
    ctx.arcTo(x + w, y + h, x, y + h, radius);
    ctx.arcTo(x, y + h, x, y, radius);
    ctx.arcTo(x, y, x + w, y, radius);
    ctx.closePath();
  }

  function drawCar(car, playerCar = false) {
    const { x, y, w, h } = car;
    ctx.save();

    // Shadow
    ctx.fillStyle = "rgba(0,0,0,.28)";
    roundedRect(x + w * .07, y + h * .035, w * .86, h * .94, w * .12);
    ctx.fill();

    // Body
    ctx.fillStyle = playerCar ? PLAYER_COLOR : car.color;
    roundedRect(x, y, w, h, w * .15);
    ctx.fill();

    // Hood / roof separation
    ctx.fillStyle = "rgba(255,255,255,.13)";
    roundedRect(x + w * .12, y + h * .08, w * .76, h * .28, w * .1);
    ctx.fill();

    // Windows
    ctx.fillStyle = playerCar ? "#C9D8FF" : "#26364B";
    roundedRect(x + w * .18, y + h * .17, w * .64, h * .28, w * .08);
    ctx.fill();

    ctx.fillStyle = "rgba(255,255,255,.2)";
    ctx.fillRect(x + w * .48, y + h * .18, Math.max(1, w * .035), h * .25);

    // Wheels
    ctx.fillStyle = "#111111";
    const wheelW = w * .16;
    const wheelH = h * .22;
    roundedRect(x - wheelW * .18, y + h * .17, wheelW, wheelH, wheelW * .3);
    ctx.fill();
    roundedRect(x + w - wheelW * .82, y + h * .17, wheelW, wheelH, wheelW * .3);
    ctx.fill();
    roundedRect(x - wheelW * .18, y + h * .62, wheelW, wheelH, wheelW * .3);
    ctx.fill();
    roundedRect(x + w - wheelW * .82, y + h * .62, wheelW, wheelH, wheelW * .3);
    ctx.fill();

    // Lights
    ctx.fillStyle = playerCar ? "#FFEB99" : "#FF5D5D";
    roundedRect(x + w * .14, y + h * .06, w * .18, h * .07, w * .025);
    ctx.fill();
    roundedRect(x + w * .68, y + h * .06, w * .18, h * .07, w * .025);
    ctx.fill();

    ctx.fillStyle = playerCar ? "#EF5B5B" : "#FFF0B5";
    roundedRect(x + w * .14, y + h * .86, w * .18, h * .06, w * .02);
    ctx.fill();
    roundedRect(x + w * .68, y + h * .86, w * .18, h * .06, w * .02);
    ctx.fill();

    if (playerCar) {
      ctx.fillStyle = "rgba(255,255,255,.28)";
      ctx.fillRect(x + w * .47, y + h * .46, w * .06, h * .29);
    }

    ctx.restore();
  }

  function drawTraffic() {
    traffic.forEach(car => drawCar(car));
  }

  function drawPlayer() {
    drawCar({
      x: player.x,
      y: player.y,
      w: player.w,
      h: player.h,
      color: PLAYER_COLOR
    }, true);
  }

  function drawParticles() {
    particles.forEach(p => {
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.fillStyle = "#FFB84D";
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
  }

  function loop(time) {
    if (state !== "running") {
      draw();
      return;
    }
    const dt = Math.min(.035, (time - lastTime) / 1000 || .016);
    lastTime = time;
    update(dt);
    draw();
    if (state === "running") animationId = requestAnimationFrame(loop);
  }

  function keyHandler(event) {
    const key = event.key.toLowerCase();
    if (["arrowleft", "arrowright", "a", "d", " "].includes(key)) {
      event.preventDefault();
    }
    if (key === "arrowleft" || key === "a") movePlayer(-1);
    if (key === "arrowright" || key === "d") movePlayer(1);
    if (key === " " && state !== "running") startGame();
  }

  function bindPress(button, direction) {
    button.addEventListener("pointerdown", event => {
      event.preventDefault();
      movePlayer(direction);
    });
  }

  startBtn.addEventListener("click", startGame);
  restartBtn.addEventListener("click", startGame);
  window.addEventListener("keydown", keyHandler);
  bindPress(leftBtn, -1);
  bindPress(rightBtn, 1);
  window.addEventListener("resize", resizeCanvas);

  // Swipe support for mobile.
  let touchStartX = null;
  canvas.addEventListener("touchstart", event => {
    if (event.changedTouches.length) touchStartX = event.changedTouches[0].clientX;
  }, { passive: true });

  canvas.addEventListener("touchend", event => {
    if (touchStartX === null || !event.changedTouches.length) return;
    const dx = event.changedTouches[0].clientX - touchStartX;
    touchStartX = null;
    if (Math.abs(dx) > 30) movePlayer(dx > 0 ? 1 : -1);
  }, { passive: true });

  resizeCanvas();
  resetGame();
})();


}
function begin(){poster.hidden=true;gm.hidden=false;if(!booted){booted=true;var s=document.createElement("style");s.textContent=LOOK;document.head.appendChild(s);boot();}else{var r=document.getElementById("startBtn");if(r)r.click();}}
poster.addEventListener("click",begin);
var nb=document.getElementById("new");if(nb)nb.addEventListener("click",begin);
})();
