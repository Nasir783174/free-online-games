/* Bike Racing - game logic + its own look. Layout lives in style.css; page shell lives in the HTML. */
(function(){"use strict";
var gm=document.getElementById("gm"),poster=document.getElementById("poster"),booted=false;
var LOOK=".gm *{ box-sizing: border-box; }.gm button{ font: inherit; }.gm button{ -webkit-tap-highlight-color: transparent; }.gm .page{\n  width: min(1120px, calc(100% - 40px));\n  margin: 0 auto;\n}.gm .page{ padding: 28px 0 72px; }.gm h2{ line-height: 1.12; }.gm h2{ font-size: 32px; margin: 0 0 16px; font-weight: 700; }.gm .best-score{\n  min-width: 130px;\n  padding: 15px 18px;\n  background: #fff;\n  border: 1px solid var(--border);\n  border-radius: 16px;\n  text-align: center;\n  box-shadow: 0 8px 25px rgba(23,27,45,.05);\n}.gm .best-score span{ display:block; font-size:12px; font-weight:800; color:var(--muted); letter-spacing:.08em; }.gm .best-score strong{ font-size: 30px; line-height: 1.1; }.gm .game-shell{\n  background: var(--game);\n  border-radius: 20px;\n  padding: 18px;\n  box-shadow: 0 18px 45px rgba(17,24,39,.15);\n}.gm .hud{\n  display: grid;\n  grid-template-columns: repeat(4, 1fr);\n  gap: 10px;\n  margin-bottom: 14px;\n}.gm .hud-item{\n  background: var(--game2);\n  border: 1px solid rgba(255,255,255,.07);\n  border-radius: 12px;\n  padding: 8px 12px;\n  color: #d6d9e2;\n}.gm .hud-item span{ display:block; font-size:12px; opacity:.7; }.gm .hud-item strong{ font-size:21px; color:#fff; }.gm .hud-item.status strong{ color: var(--orange); }.gm .canvas-wrap{\n  position: relative;\n  width: 100%;\n  max-width: 900px;\n  margin: 0 auto;\n  overflow: hidden;\n  border-radius: 14px;\n  background: #8ecb68;\n  aspect-ratio: 3 / 2;\n}.gm canvas{\n  display: block;\n  width: 100%;\n  height: 100%;\n  touch-action: none;\n}.gm .overlay{\n  position: absolute;\n  inset: 0;\n  display: grid;\n  place-items: center;\n  background: rgba(10,16,28,.64);\n  padding: 20px;\n}.gm .overlay.hidden{ display: none; }.gm .overlay-card{\n  width: min(430px, 100%);\n  background: #fff;\n  color: var(--text);\n  padding: 28px;\n  border-radius: 18px;\n  text-align: center;\n  box-shadow: 0 20px 55px rgba(0,0,0,.25);\n}.gm .overlay-card h2{ margin-bottom: 10px; font-size: 34px; }.gm .overlay-card p:not(.eyebrow){ color: var(--muted); margin-top: 0; }.gm .primary-btn{\n  border: 0;\n  min-height: 48px;\n  padding: 0 24px;\n  border-radius: 12px;\n  background: var(--primary);\n  color: #fff;\n  font-weight: 800;\n  cursor: pointer;\n}.gm .primary-btn:hover{ background: var(--primary-dark); }.gm .primary-btn:focus-visible,.gm .control-btn:focus-visible{\n  outline: 3px solid #fff;\n  outline-offset: 3px;\n}.gm .controls{\n  display: flex;\n  justify-content: center;\n  gap: 12px;\n  margin: 16px auto 8px;\n}.gm .control-btn{\n  min-width: 76px;\n  min-height: 52px;\n  border: 1px solid rgba(255,255,255,.12);\n  border-radius: 13px;\n  background: #283449;\n  color: #fff;\n  font-size: 25px;\n  font-weight: 800;\n  cursor: pointer;\n  user-select: none;\n}.gm .control-btn.brake{ font-size: 15px; padding: 0 20px; color: #ffe2a6; }.gm .control-btn:active{ transform: translateY(1px); background: #34425b; }.gm .control-help{\n  text-align: center;\n  color: #aeb6c5;\n  font-size: 13px;\n  margin: 0;\n}.gm .about{\n  background: #fff;\n  border: 1px solid var(--border);\n  border-radius: 18px;\n  padding: 28px;\n}.gm .about p{ color: var(--muted); }.gm ul{ padding-left: 22px; }.gm li{ margin: 8px 0; }.gm .about{ margin-top: 24px; }@media (max-width: 760px){.gm .page{ width: min(100% - 24px, 1120px); }.gm .page{ padding-top: 20px; }.gm .best-score{ width: 100%; }.gm h2{ font-size: 27px; }.gm .game-shell{ padding: 10px; border-radius: 16px; }.gm .hud{ grid-template-columns: repeat(2, 1fr); }.gm .hud-item{ padding: 7px 10px; }.gm .hud-item strong{ font-size: 19px; }.gm .about{ padding: 22px; }.gm .control-btn{ min-width: 82px; min-height: 58px; }.gm .control-help{ font-size: 12px; }}@media (max-width: 420px){.gm .controls{ gap: 8px; }.gm .control-btn{ min-width: 74px; }.gm .control-btn.brake{ padding: 0 12px; }}";
function __ready(f){f()}
function boot(){
(() => {
  "use strict";

  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");
  const scoreEl = document.getElementById("score");
  const speedEl = document.getElementById("speed");
  const coinsEl = document.getElementById("coins");
  const statusEl = document.getElementById("status");
  const bestScoreEl = document.getElementById("bestScore");
  const startOverlay = document.getElementById("startOverlay");
  const gameOverOverlay = document.getElementById("gameOverOverlay");
  const finalText = document.getElementById("finalText");
  const startBtn = document.getElementById("startBtn");
  const restartBtn = document.getElementById("restartBtn");
  const leftBtn = document.getElementById("leftBtn");
  const rightBtn = document.getElementById("rightBtn");
  const brakeBtn = document.getElementById("brakeBtn");

  const W = canvas.width;
  const H = canvas.height;
  const road = { left: 185, right: 715, lanes: 4 };
  const laneWidth = (road.right - road.left) / road.lanes;
  const keys = { left: false, right: false, brake: false };

  let state = "ready";
  let score = 0;
  let coins = 0;
  let distance = 0;
  let speed = 0;
  let roadOffset = 0;
  let spawnTimer = 0;
  let coinTimer = 0;
  let lastTime = 0;
  let obstacles = [];
  let coinItems = [];
  let particles = [];
  let best = Number(localStorage.getItem("bikeRacingBest") || 0);

  const player = {
    x: W / 2,
    y: H - 118,
    width: 42,
    height: 76,
    vx: 0
  };

  bestScoreEl.textContent = best;

  function laneX(lane) {
    return road.left + laneWidth * lane + laneWidth / 2;
  }

  function reset() {
    state = "ready";
    score = 0;
    coins = 0;
    distance = 0;
    speed = 0;
    roadOffset = 0;
    spawnTimer = 0;
    coinTimer = 0;
    obstacles = [];
    coinItems = [];
    particles = [];
    player.x = laneX(1.5);
    player.vx = 0;
    updateHUD();
  }

  function start() {
    reset();
    state = "playing";
    startOverlay.classList.add("hidden");
    gameOverOverlay.classList.add("hidden");
    statusEl.textContent = "Racing";
    lastTime = performance.now();
    requestAnimationFrame(loop);
  }

  function endGame() {
    state = "gameover";
    speed = 0;
    const finalScore = Math.floor(score);
    if (finalScore > best) {
      best = finalScore;
      localStorage.setItem("bikeRacingBest", String(best));
      bestScoreEl.textContent = best;
    }
    statusEl.textContent = "Game Over";
    finalText.textContent = `You scored ${finalScore} points and collected ${coins} coins.`;
    gameOverOverlay.classList.remove("hidden");
  }

  function updateHUD() {
    scoreEl.textContent = Math.floor(score);
    coinsEl.textContent = coins;
    speedEl.textContent = Math.round(speed);
  }

  function spawnCar() {
    const lane = Math.floor(Math.random() * road.lanes);
    const types = [
      { w: 44, h: 76, body: "#ef5b5b", roof: "#f8c4c4" },
      { w: 46, h: 82, body: "#5b5ce2", roof: "#cfd0ff" },
      { w: 48, h: 80, body: "#16b8c4", roof: "#c7f3f5" },
      { w: 45, h: 78, body: "#ffb84d", roof: "#fff0cf" }
    ];
    const type = types[Math.floor(Math.random() * types.length)];
    obstacles.push({
      x: laneX(lane),
      y: -type.h - 15,
      width: type.w,
      height: type.h,
      body: type.body,
      roof: type.roof,
      speed: 0.75 + Math.random() * 0.8,
      passed: false
    });
  }

  function spawnCoin() {
    const lane = Math.floor(Math.random() * road.lanes);
    coinItems.push({
      x: laneX(lane),
      y: -20,
      r: 11,
      spin: Math.random() * Math.PI * 2
    });
  }

  function rectsOverlap(a, b, pad = 0) {
    return Math.abs(a.x - b.x) < (a.width + b.width) / 2 - pad &&
           Math.abs(a.y - b.y) < (a.height + b.height) / 2 - pad;
  }

  function update(dt) {
    const braking = keys.brake;
    const targetSpeed = braking ? 3.4 : Math.min(9.5, 4.2 + distance / 520);
    speed += (targetSpeed - speed) * Math.min(1, dt * 0.004);
    distance += speed * dt * 0.045;
    score += speed * dt * 0.035;
    roadOffset = (roadOffset + speed * dt * 0.11) % 80;

    const steer = (keys.left ? -1 : 0) + (keys.right ? 1 : 0);
    player.vx += steer * 0.55 * dt;
    player.vx *= Math.pow(0.0007, dt / 1000);
    player.x += player.vx * dt;
    player.x = Math.max(road.left + 30, Math.min(road.right - 30, player.x));

    spawnTimer += dt;
    coinTimer += dt;
    const spawnEvery = Math.max(410, 820 - distance * 0.75);
    if (spawnTimer > spawnEvery) {
      spawnTimer = 0;
      spawnCar();
      if (Math.random() < 0.24) spawnCar();
    }
    if (coinTimer > 850) {
      coinTimer = 0;
      spawnCoin();
    }

    for (const car of obstacles) {
      car.y += (speed * 0.8 + car.speed) * dt * 0.1;
      if (!car.passed && car.y > player.y + 55) {
        car.passed = true;
        score += 25;
        burst(car.x, player.y - 35, 5);
      }
      if (rectsOverlap(player, car, 8)) {
        burst(player.x, player.y, 22);
        endGame();
        return;
      }
    }
    obstacles = obstacles.filter(o => o.y < H + 100);

    for (const c of coinItems) {
      c.y += speed * dt * 0.11;
      c.spin += dt * 0.012;
      const dx = Math.abs(c.x - player.x);
      const dy = Math.abs(c.y - player.y);
      if (dx < 28 && dy < 45) {
        coins++;
        score += 75;
        burst(c.x, c.y, 9);
        c.collected = true;
      }
    }
    coinItems = coinItems.filter(c => !c.collected && c.y < H + 30);

    for (const p of particles) {
      p.x += p.vx * dt * 0.06;
      p.y += p.vy * dt * 0.06;
      p.life -= dt;
    }
    particles = particles.filter(p => p.life > 0);

    updateHUD();
  }

  function burst(x, y, count) {
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2;
      const v = 0.5 + Math.random() * 2.5;
      particles.push({
        x, y,
        vx: Math.cos(a) * v,
        vy: Math.sin(a) * v,
        life: 350 + Math.random() * 450,
        size: 2 + Math.random() * 4
      });
    }
  }

  function roundedRect(x, y, w, h, r, fill) {
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, r);
    ctx.fillStyle = fill;
    ctx.fill();
  }

  function drawBackground() {
    ctx.fillStyle = "#76bd5c";
    ctx.fillRect(0, 0, W, H);

    // Road shoulders
    ctx.fillStyle = "#d5b77a";
    ctx.fillRect(road.left - 28, 0, 28, H);
    ctx.fillRect(road.right, 0, 28, H);

    ctx.fillStyle = "#2b3442";
    ctx.fillRect(road.left, 0, road.right - road.left, H);

    // Edge lines
    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(road.left + 8, 0, 5, H);
    ctx.fillRect(road.right - 13, 0, 5, H);

    // Lane markings
    ctx.fillStyle = "rgba(255,255,255,.72)";
    for (let lane = 1; lane < road.lanes; lane++) {
      const x = road.left + laneWidth * lane;
      for (let y = -80 + roadOffset; y < H; y += 80) {
        ctx.fillRect(x - 2, y, 4, 42);
      }
    }

    // Simple roadside posts
    for (let y = -70 + roadOffset * 0.55; y < H; y += 105) {
      ctx.fillStyle = "#f7f7f7";
      ctx.fillRect(road.left - 20, y, 7, 27);
      ctx.fillRect(road.right + 13, y, 7, 27);
      ctx.fillStyle = "#ef5b5b";
      ctx.fillRect(road.left - 20, y, 7, 7);
      ctx.fillRect(road.right + 13, y, 7, 7);
    }
  }

  function drawCar(car) {
    ctx.save();
    ctx.translate(car.x, car.y);
    roundedRect(-car.width / 2, -car.height / 2, car.width, car.height, 9, "#101827");
    roundedRect(-car.width / 2 + 3, -car.height / 2 + 3, car.width - 6, car.height - 6, 7, car.body);

    roundedRect(-car.width * .32, -car.height * .29, car.width * .64, car.height * .26, 5, car.roof);
    ctx.fillStyle = "rgba(20,35,50,.55)";
    ctx.fillRect(-car.width * .27, -car.height * .255, car.width * .54, car.height * .16);

    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(-car.width * .37, car.height * .28, car.width * .18, 5);
    ctx.fillRect(car.width * .19, car.height * .28, car.width * .18, 5);
    ctx.fillStyle = "#ef5b5b";
    ctx.fillRect(-car.width * .37, -car.height * .34, car.width * .18, 5);
    ctx.fillRect(car.width * .19, -car.height * .34, car.width * .18, 5);
    ctx.restore();
  }

  function drawBike() {
    ctx.save();
    ctx.translate(player.x, player.y);

    // shadow
    ctx.fillStyle = "rgba(0,0,0,.25)";
    ctx.beginPath();
    ctx.ellipse(0, 34, 24, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    // wheels
    ctx.fillStyle = "#0b1019";
    ctx.beginPath(); ctx.ellipse(0, -28, 9, 16, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(0, 28, 9, 16, 0, 0, Math.PI * 2); ctx.fill();

    // bike body
    ctx.strokeStyle = "#ffb84d";
    ctx.lineWidth = 7;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(0, -23); ctx.lineTo(-13, 16); ctx.lineTo(13, 16); ctx.lineTo(0, -23);
    ctx.stroke();

    ctx.fillStyle = "#5b5ce2";
    ctx.beginPath();
    ctx.ellipse(0, -2, 13, 23, 0, 0, Math.PI * 2);
    ctx.fill();

    // rider
    ctx.fillStyle = "#f1b79a";
    ctx.beginPath(); ctx.arc(0, -36, 9, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#171b2d";
    ctx.beginPath(); ctx.arc(0, -39, 10, Math.PI, Math.PI * 2); ctx.fill();

    ctx.fillStyle = "#fff";
    ctx.fillRect(-5, -37, 4, 3);
    ctx.restore();
  }

  function drawCoin(c) {
    ctx.save();
    ctx.translate(c.x, c.y);
    const squash = Math.abs(Math.cos(c.spin));
    ctx.scale(Math.max(.18, squash), 1);
    ctx.fillStyle = "#ffb84d";
    ctx.beginPath();
    ctx.arc(0, 0, c.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#fff0bd";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = "#8a5a00";
    ctx.font = "800 12px Nunito Sans";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("$", 0, 1);
    ctx.restore();
  }

  function drawParticles() {
    for (const p of particles) {
      ctx.globalAlpha = Math.max(0, p.life / 700);
      ctx.fillStyle = "#ffb84d";
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  function draw() {
    drawBackground();
    coinItems.forEach(drawCoin);
    obstacles.forEach(drawCar);
    drawBike();
    drawParticles();

    // Speed streaks at high speed
    if (state === "playing" && speed > 7) {
      ctx.strokeStyle = "rgba(255,255,255,.12)";
      ctx.lineWidth = 2;
      for (let i = 0; i < 7; i++) {
        const x = road.left + 20 + Math.random() * (road.right - road.left - 40);
        const y = Math.random() * H;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, y + 20 + speed * 2);
        ctx.stroke();
      }
    }
  }

  function loop(now) {
    if (state !== "playing") {
      draw();
      return;
    }
    const dt = Math.min(34, now - lastTime || 16);
    lastTime = now;
    update(dt);
    draw();
    if (state === "playing") requestAnimationFrame(loop);
  }

  function setKey(name, value) {
    keys[name] = value;
  }

  function keyboard(e, down) {
    const k = e.key.toLowerCase();
    if (["arrowleft", "a"].includes(k)) { e.preventDefault(); setKey("left", down); }
    if (["arrowright", "d"].includes(k)) { e.preventDefault(); setKey("right", down); }
    if (k === " ") { e.preventDefault(); setKey("brake", down); }
    if (down && k === "enter" && state !== "playing") start();
  }

  function bindHold(btn, name) {
    const on = e => { e.preventDefault(); setKey(name, true); };
    const off = e => { e.preventDefault(); setKey(name, false); };
    btn.addEventListener("pointerdown", on);
    btn.addEventListener("pointerup", off);
    btn.addEventListener("pointercancel", off);
    btn.addEventListener("pointerleave", off);
  }

  window.addEventListener("keydown", e => keyboard(e, true), { passive: false });
  window.addEventListener("keyup", e => keyboard(e, false), { passive: false });
  bindHold(leftBtn, "left");
  bindHold(rightBtn, "right");
  bindHold(brakeBtn, "brake");

  startBtn.addEventListener("click", start);
  restartBtn.addEventListener("click", start);

  reset();
  draw();
})();


}
function begin(){poster.hidden=true;gm.hidden=false;if(!booted){booted=true;var s=document.createElement("style");s.textContent=LOOK;document.head.appendChild(s);boot();}else{var r=document.getElementById("startBtn");if(r)r.click();}}
poster.addEventListener("click",begin);
var nb=document.getElementById("new");if(nb)nb.addEventListener("click",begin);
})();
