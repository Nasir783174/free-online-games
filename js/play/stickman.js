/* Stickman - game logic + its own look. Layout lives in style.css; page shell lives in the HTML. */
(function(){"use strict";
var gm=document.getElementById("gm"),poster=document.getElementById("poster"),booted=false;
var LOOK=".gm *{ box-sizing: border-box; }.gm button{ font: inherit; }.gm button{ cursor: pointer; }.gm .game-label{\n  color: var(--muted);\n  font-size: 15px;\n  font-weight: 700;\n}.gm .page{\n  width: min(1120px, calc(100% - 40px));\n  margin: 0 auto;\n  padding: 28px 0 70px;\n}.gm h2,.gm h3{ margin-top: 0; line-height: 1.15; }.gm h2{ font-size: 32px; font-weight: 700; margin-bottom: 16px; }.gm h3{ font-size: 22px; font-weight: 700; margin: 26px 0 10px; }.gm .lead{\n  max-width: 720px;\n  margin: 0;\n  color: var(--muted);\n  font-size: 18px;\n}.gm .game-shell{\n  background: var(--card);\n  border: 1px solid var(--border);\n  border-radius: 20px;\n  padding: 14px;\n  box-shadow: 0 10px 30px rgba(23, 27, 45, .06);\n}.gm .hud{\n  display: flex;\n  gap: 10px;\n  margin-bottom: 12px;\n}.gm .stat{\n  min-width: 110px;\n  padding: 8px 14px;\n  border: 1px solid var(--border);\n  border-radius: 12px;\n  background: #fff;\n}.gm .stat span{\n  display: block;\n  color: var(--muted);\n  font-size: 13px;\n  line-height: 1.2;\n}.gm .stat strong{\n  display: block;\n  font-size: 22px;\n  line-height: 1.2;\n  margin-top: 2px;\n}.gm .canvas-wrap{\n  position: relative;\n  overflow: hidden;\n  border-radius: 16px;\n  background: var(--game);\n  aspect-ratio: 16 / 9;\n}.gm canvas{\n  width: 100%;\n  height: 100%;\n  display: block;\n  touch-action: none;\n}.gm .overlay{\n  position: absolute;\n  inset: 0;\n  display: grid;\n  place-items: center;\n  padding: 20px;\n  background: rgba(17, 24, 39, .72);\n  backdrop-filter: blur(4px);\n}.gm .hidden{ display: none; }.gm .panel{\n  width: min(430px, 100%);\n  padding: 30px;\n  border-radius: 18px;\n  background: #fff;\n  text-align: center;\n  box-shadow: 0 18px 50px rgba(0,0,0,.22);\n}.gm .panel h2{ margin-bottom: 10px; }.gm .panel p{ color: var(--muted); margin: 7px 0; }.gm .stickman-icon{\n  width: 58px;\n  height: 58px;\n  display: grid;\n  place-items: center;\n  margin: 0 auto 15px;\n  border-radius: 50%;\n  background: #EEF0FF;\n  color: var(--primary);\n  font-size: 26px;\n}.gm .primary-btn{\n  border: 0;\n  min-height: 48px;\n  padding: 10px 24px;\n  margin-top: 15px;\n  border-radius: 12px;\n  background: var(--primary);\n  color: #fff;\n  font-size: 16px;\n  font-weight: 800;\n  transition: transform .15s ease, background .15s ease;\n}.gm .primary-btn:hover{ background: var(--primary-dark); transform: translateY(-1px); }.gm .primary-btn:focus-visible,.gm .control-btn:focus-visible{ outline: 3px solid rgba(91, 92, 226, .35); outline-offset: 3px; }.gm .controls-hint{\n  font-size: 13px;\n  margin-top: 16px !important;\n}.gm .mobile-controls{\n  display: flex;\n  justify-content: center;\n  padding-top: 12px;\n}.gm .control-btn{\n  min-width: 150px;\n  min-height: 50px;\n  border: 1px solid var(--border);\n  border-radius: 13px;\n  background: #fff;\n  color: var(--text);\n  font-weight: 800;\n}.gm .control-btn:active{ transform: translateY(1px); }.gm .about{ margin-top: 20px; }.gm details{\n  border-top: 1px solid var(--border);\n  padding: 15px 0;\n}.gm details:last-child{ border-bottom: 1px solid var(--border); }.gm summary{\n  cursor: pointer;\n  font-weight: 700;\n}.gm details p{\n  color: var(--muted);\n  margin: 10px 0 0;\n}@media (max-width: 760px){.gm .page{ width: min(100% - 24px, 1120px); }.gm .page{ padding-top: 20px; }.gm h2{ font-size: 28px; }.gm .lead{ font-size: 17px; }.gm .game-shell{ padding: 9px; border-radius: 16px; }.gm .hud{ gap: 6px; }.gm .stat{ flex: 1; min-width: 0; padding: 7px 9px; }.gm .stat strong{ font-size: 20px; }.gm .panel{ padding: 24px 18px; }}@media (max-width: 420px){.gm .game-label{ display: none; }.gm .stat span{ font-size: 12px; }.gm .stat strong{ font-size: 18px; }}";
function __ready(f){f()}
function boot(){
(() => {
  "use strict";

  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");

  const scoreEl = document.getElementById("score");
  const coinsEl = document.getElementById("coins");
  const bestEl = document.getElementById("best");
  const startOverlay = document.getElementById("startOverlay");
  const gameOverOverlay = document.getElementById("gameOverOverlay");
  const startBtn = document.getElementById("startBtn");
  const restartBtn = document.getElementById("restartBtn");
  const jumpBtn = document.getElementById("jumpBtn");
  const finalScore = document.getElementById("finalScore");
  const finalCoins = document.getElementById("finalCoins");

  const W = canvas.width;
  const H = canvas.height;
  const groundY = 455;

  let state = "ready";
  let score = 0;
  let coins = 0;
  let best = Number(localStorage.getItem("stickmanBest") || 0);
  let speed = 330;
  let spawnTimer = 0;
  let coinTimer = 0;
  let lastTime = 0;
  let raf = 0;

  const player = {
    x: 145,
    y: groundY - 74,
    w: 42,
    h: 74,
    vy: 0,
    onGround: true,
    jumpPower: -710,
    gravity: 1900
  };

  let obstacles = [];
  let coinItems = [];
  let dust = [];

  bestEl.textContent = best;

  function resetGame() {
    score = 0;
    coins = 0;
    speed = 330;
    spawnTimer = 1.05;
    coinTimer = 1.5;
    obstacles = [];
    coinItems = [];
    dust = [];
    player.y = groundY - player.h;
    player.vy = 0;
    player.onGround = true;
    updateHud();
  }

  function startGame() {
    resetGame();
    state = "playing";
    startOverlay.classList.add("hidden");
    gameOverOverlay.classList.add("hidden");
    lastTime = performance.now();
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(loop);
  }

  function endGame() {
    state = "gameover";
    const final = Math.floor(score);
    if (final > best) {
      best = final;
      localStorage.setItem("stickmanBest", String(best));
    }
    finalScore.textContent = final;
    finalCoins.textContent = coins;
    bestEl.textContent = best;
    gameOverOverlay.classList.remove("hidden");
  }

  function updateHud() {
    scoreEl.textContent = Math.floor(score);
    coinsEl.textContent = coins;
    bestEl.textContent = best;
  }

  function jump() {
    if (state !== "playing") return;
    if (player.onGround) {
      player.vy = player.jumpPower;
      player.onGround = false;
      for (let i = 0; i < 5; i++) {
        dust.push({
          x: player.x + 16,
          y: groundY - 4,
          vx: -40 - Math.random() * 60,
          vy: -30 - Math.random() * 70,
          life: .35
        });
      }
    }
  }

  function spawnObstacle() {
    const type = Math.random() < 0.72 ? "block" : "barrier";
    const h = type === "block" ? 44 + Math.random() * 20 : 62;
    const w = type === "block" ? 34 + Math.random() * 18 : 24;
    obstacles.push({
      x: W + 30,
      y: groundY - h,
      w,
      h,
      type
    });
  }

  function spawnCoin() {
    const high = Math.random() < 0.45;
    coinItems.push({
      x: W + 30,
      y: high ? groundY - 145 - Math.random() * 55 : groundY - 75,
      r: 11,
      spin: Math.random() * Math.PI
    });
  }

  function circleRectCollision(circle, rect) {
    const nearestX = Math.max(rect.x, Math.min(circle.x, rect.x + rect.w));
    const nearestY = Math.max(rect.y, Math.min(circle.y, rect.y + rect.h));
    const dx = circle.x - nearestX;
    const dy = circle.y - nearestY;
    return dx * dx + dy * dy < circle.r * circle.r;
  }

  function playerHitbox() {
    return {
      x: player.x + 9,
      y: player.y + 5,
      w: player.w - 16,
      h: player.h - 8
    };
  }

  function update(dt) {
    speed += dt * 5.2;
    score += dt * speed * .075;

    player.vy += player.gravity * dt;
    player.y += player.vy * dt;

    if (player.y >= groundY - player.h) {
      player.y = groundY - player.h;
      player.vy = 0;
      player.onGround = true;
    }

    spawnTimer -= dt;
    if (spawnTimer <= 0) {
      spawnObstacle();
      spawnTimer = Math.max(.72, 1.35 - (speed - 330) / 800) + Math.random() * .55;
    }

    coinTimer -= dt;
    if (coinTimer <= 0) {
      spawnCoin();
      coinTimer = 1.0 + Math.random() * 1.25;
    }

    obstacles.forEach(o => o.x -= speed * dt);
    coinItems.forEach(c => {
      c.x -= speed * dt;
      c.spin += dt * 7;
    });

    obstacles = obstacles.filter(o => o.x + o.w > -30);
    coinItems = coinItems.filter(c => c.x + c.r > -30);

    const hit = playerHitbox();
    for (const o of obstacles) {
      if (hit.x < o.x + o.w && hit.x + hit.w > o.x && hit.y < o.y + o.h && hit.y + hit.h > o.y) {
        endGame();
        return;
      }
    }

    for (let i = coinItems.length - 1; i >= 0; i--) {
      if (circleRectCollision(coinItems[i], hit)) {
        coins++;
        score += 35;
        coinItems.splice(i, 1);
      }
    }

    dust.forEach(p => {
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += 180 * dt;
      p.life -= dt;
    });
    dust = dust.filter(p => p.life > 0);

    updateHud();
  }

  function drawBackground() {
    ctx.fillStyle = "#111827";
    ctx.fillRect(0, 0, W, H);

    ctx.fillStyle = "#182235";
    ctx.fillRect(0, 0, W, groundY);

    // Simple sky accents.
    ctx.fillStyle = "rgba(255,255,255,.05)";
    for (let x = -50; x < W; x += 160) {
      ctx.beginPath();
      ctx.arc(x + 60, 95, 34, 0, Math.PI * 2);
      ctx.fill();
    }

    // Distant skyline.
    ctx.fillStyle = "#202C40";
    for (let x = 0; x < W; x += 78) {
      const h = 35 + ((x * 17) % 65);
      ctx.fillRect(x, groundY - 48 - h, 58, h);
    }

    ctx.fillStyle = "#0C1320";
    ctx.fillRect(0, groundY, W, H - groundY);

    // Road line.
    ctx.fillStyle = "#2D394B";
    ctx.fillRect(0, groundY + 4, W, 4);

    const offset = (performance.now() / 1000 * speed) % 70;
    ctx.fillStyle = "#667085";
    for (let x = -70 + offset; x < W; x += 70) {
      ctx.fillRect(x, groundY + 43, 34, 4);
    }

    ctx.fillStyle = "rgba(255,255,255,.65)";
    ctx.font = "700 13px 'Nunito Sans', sans-serif";
    ctx.fillText("RUN", 28, 35);
  }

  function drawStickman() {
    const cx = player.x + player.w / 2;
    const top = player.y;

    ctx.save();
    ctx.strokeStyle = "#F8FAFC";
    ctx.fillStyle = "#F8FAFC";
    ctx.lineWidth = 6;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    // Head.
    ctx.beginPath();
    ctx.arc(cx, top + 12, 10, 0, Math.PI * 2);
    ctx.fill();

    // Body.
    ctx.beginPath();
    ctx.moveTo(cx, top + 23);
    ctx.lineTo(cx, top + 48);
    ctx.stroke();

    const running = player.onGround ? Math.sin(performance.now() / 80) : 0;
    // Arms.
    ctx.beginPath();
    ctx.moveTo(cx, top + 28);
    ctx.lineTo(cx - 17, top + 39 + running * 2);
    ctx.moveTo(cx, top + 28);
    ctx.lineTo(cx + 17, top + 37 - running * 2);
    ctx.stroke();

    // Legs.
    ctx.beginPath();
    ctx.moveTo(cx, top + 48);
    ctx.lineTo(cx - 15, top + 69 - running * 3);
    ctx.moveTo(cx, top + 48);
    ctx.lineTo(cx + 15, top + 69 + running * 3);
    ctx.stroke();

    ctx.restore();
  }

  function drawObstacles() {
    obstacles.forEach(o => {
      ctx.fillStyle = o.type === "barrier" ? "#EF5B5B" : "#FFB84D";
      ctx.fillRect(o.x, o.y, o.w, o.h);
      ctx.fillStyle = "rgba(255,255,255,.22)";
      ctx.fillRect(o.x + 5, o.y + 6, Math.max(3, o.w - 10), 5);
    });
  }

  function drawCoins() {
    coinItems.forEach(c => {
      const squash = Math.abs(Math.cos(c.spin)) * .65 + .35;
      ctx.save();
      ctx.translate(c.x, c.y);
      ctx.scale(squash, 1);
      ctx.fillStyle = "#FFE08A";
      ctx.beginPath();
      ctx.arc(0, 0, c.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#FFB84D";
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.restore();
    });
  }

  function drawDust() {
    ctx.fillStyle = "rgba(255,255,255,.55)";
    dust.forEach(p => {
      ctx.globalAlpha = Math.max(0, p.life / .35);
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
  }

  function draw() {
    drawBackground();
    drawCoins();
    drawObstacles();
    drawDust();
    drawStickman();
  }

  function loop(now) {
    if (state !== "playing") {
      draw();
      return;
    }

    const dt = Math.min((now - lastTime) / 1000, .032);
    lastTime = now;

    update(dt);
    draw();

    if (state === "playing") {
      raf = requestAnimationFrame(loop);
    }
  }

  function handleKey(e) {
    if (e.code === "Space" || e.code === "ArrowUp") {
      e.preventDefault();
      if (state === "ready" || state === "gameover") startGame();
      else jump();
    }
  }

  startBtn.addEventListener("click", startGame);
  restartBtn.addEventListener("click", startGame);
  jumpBtn.addEventListener("pointerdown", e => {
    e.preventDefault();
    if (state === "ready" || state === "gameover") startGame();
    else jump();
  });
  window.addEventListener("keydown", handleKey);

  canvas.addEventListener("pointerdown", () => {
    if (state === "playing") jump();
  });

  // Initial scene.
  draw();
})();


}
function begin(){poster.hidden=true;gm.hidden=false;if(!booted){booted=true;var s=document.createElement("style");s.textContent=LOOK;document.head.appendChild(s);boot();}else{var r=document.getElementById("startBtn");if(r)r.click();}}
poster.addEventListener("click",begin);
var nb=document.getElementById("new");if(nb)nb.addEventListener("click",begin);
})();
