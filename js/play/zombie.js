/* Zombie - game logic + its own look. Layout lives in style.css; page shell lives in the HTML. */
(function(){"use strict";
var gm=document.getElementById("gm"),poster=document.getElementById("poster"),booted=false;
var LOOK=".gm{\n  --primary: #5B5CE2;\n  --primary-dark: #4546B8;\n  --cyan: #16B8C4;\n  --orange: #FFB84D;\n  --success: #22C55E;\n  --danger: #EF5B5B;\n  \n  \n  \n  \n  \n  --game: #111827;\n  --game2: #1F2937;\n}.gm *{ box-sizing: border-box; }.gm button{ font: inherit; }.gm button{ cursor: pointer; }.gm .page{ max-width: 1160px; margin: auto; padding: 28px 20px 70px; }.gm .game-card{\n  background: var(--card);\n  border: 1px solid var(--border);\n  border-radius: 18px;\n  padding: 16px;\n  box-shadow: 0 8px 28px rgba(23,27,45,.06);\n}.gm .hud{\n  display: grid;\n  grid-template-columns: repeat(4, 1fr);\n  gap: 10px;\n  margin-bottom: 14px;\n}.gm .hud-stat{\n  background: var(--bg);\n  border: 1px solid var(--border);\n  border-radius: 12px;\n  padding: 9px 13px;\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n}.gm .hud-stat span{ color: var(--muted); font-size: 13px; font-weight: 700; }.gm .hud-stat strong{ font-size: 20px; line-height: 1.2; }.gm .canvas-wrap{\n  position: relative;\n  width: 100%;\n  overflow: hidden;\n  border-radius: 15px;\n  background: var(--game);\n}.gm canvas{ display: block; width: 100%; height: auto; touch-action: none; }.gm .game-overlay{\n  position: absolute; inset: 0;\n  display: grid; place-items: center;\n  background: rgba(17,24,39,.76);\n  padding: 20px;\n}.gm .game-overlay.hidden{ display: none; }.gm .overlay-panel{\n  max-width: 430px;\n  text-align: center;\n  background: #fff;\n  border-radius: 18px;\n  padding: 30px 28px;\n  box-shadow: 0 15px 45px rgba(0,0,0,.25);\n}.gm .skull{ font-size: 46px; line-height: 1; margin-bottom: 10px; }.gm .overlay-panel h2{ margin: 0 0 8px; font-size: 30px; }.gm .overlay-panel p{ color: var(--muted); margin: 0 0 20px; }.gm .primary-btn,.gm .secondary-btn,.gm .fire-btn,.gm .touch-btn{\n  border: 0;\n  font-weight: 800;\n}.gm .primary-btn{\n  min-height: 48px; padding: 0 24px; border-radius: 12px;\n  background: var(--primary); color: #fff;\n}.gm .primary-btn:hover{ background: var(--primary-dark); }.gm .controls-panel{\n  display: flex; align-items: center; justify-content: space-between;\n  gap: 18px; padding: 16px 4px 2px;\n}.gm .control-copy{ display: grid; gap: 2px; }.gm .control-copy strong{ font-size: 15px; }.gm .control-copy span{ color: var(--muted); font-size: 14px; }.gm .secondary-btn{\n  min-height: 44px; padding: 0 19px; border-radius: 10px;\n  background: #fff; color: var(--text); border: 1px solid var(--border);\n}.gm .secondary-btn:hover{ border-color: var(--primary); color: var(--primary); }.gm .mobile-controls{ display: none; }.gm .tips-grid{ display: grid; grid-template-columns: repeat(3,1fr); gap: 18px; }.gm .tips-grid article{\n  background: #fff; border: 1px solid var(--border); border-radius: 14px; padding: 20px;\n}.gm .tips-grid h3{ margin: 0 0 6px; font-size: 21px; }.gm .tips-grid p{ margin: 0; font-size: 15px; }@media (max-width: 700px){.gm .page{ padding: 20px 14px 55px; }.gm .game-card{ padding: 10px; border-radius: 15px; }.gm .hud{ grid-template-columns: repeat(2,1fr); }.gm .hud-stat strong{ font-size: 18px; }.gm .controls-panel{ align-items: flex-start; }.gm .control-copy span{ font-size: 12px; }.gm .controls-panel .secondary-btn{ flex: 0 0 auto; }.gm .mobile-controls{\n    display: flex; align-items: center; justify-content: space-between;\n    padding: 16px 8px 4px; gap: 20px;\n  }.gm .dpad{\n    width: 150px; height: 120px; position: relative;\n  }.gm .touch-btn{\n    position: absolute; width: 48px; height: 48px;\n    border-radius: 12px; background: var(--game2); color: #fff;\n    border: 1px solid #374151; touch-action: none;\n  }.gm .touch-btn:active{ background: var(--primary); }.gm .touch-btn.up{ left: 51px; top: 0; }.gm .touch-btn.left{ left: 0; top: 54px; }.gm .touch-btn.down{ left: 51px; top: 54px; }.gm .touch-btn.right{ right: 0; top: 54px; }.gm .fire-btn{\n    width: 90px; height: 90px; border-radius: 50%;\n    background: var(--danger); color: #fff;\n    box-shadow: 0 5px 0 #c84343;\n  }.gm .fire-btn:active{ transform: translateY(2px); box-shadow: 0 3px 0 #c84343; }.gm .tips-grid{ grid-template-columns: 1fr; }}";
function __ready(f){f()}
function boot(){
(() => {
  "use strict";

  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");
  const scoreEl = document.getElementById("score");
  const waveEl = document.getElementById("wave");
  const baseHealthEl = document.getElementById("baseHealth");
  const highScoreEl = document.getElementById("highScore");
  const overlay = document.getElementById("overlay");
  const overlayTitle = document.getElementById("overlayTitle");
  const overlayText = document.getElementById("overlayText");
  const startBtn = document.getElementById("startBtn");
  const restartBtn = document.getElementById("restartBtn");
  const fireBtn = document.getElementById("fireBtn");

  const WORLD = { w: 900, h: 560 };
  const keys = new Set();
  const mouse = { x: WORLD.w / 2 + 140, y: WORLD.h / 2, active: false };
  let animationId = 0;
  let lastTime = 0;
  let spawnTimer = 0;
  let waveTimer = 0;
  let shotTimer = 0;
  let running = false;
  let gameOver = false;
  let score = 0;
  let wave = 1;
  let baseHealth = 100;
  let highScore = Number(localStorage.getItem("zombieHighScore") || 0);
  let zombies = [];
  let bullets = [];
  let particles = [];

  const player = {
    x: 290, y: WORLD.h / 2, r: 17, speed: 235,
    angle: 0, fireCooldown: 0
  };
  const base = { x: 105, y: WORLD.h / 2, r: 54 };

  highScoreEl.textContent = highScore;

  function resizeCanvas() {
    const width = Math.min(canvas.parentElement.clientWidth, WORLD.w);
    canvas.width = WORLD.w;
    canvas.height = WORLD.h;
    canvas.style.width = "100%";
  }

  function resetGame() {
    score = 0; wave = 1; baseHealth = 100;
    zombies = []; bullets = []; particles = [];
    player.x = 290; player.y = WORLD.h / 2; player.angle = 0;
    spawnTimer = 0.4; waveTimer = 0; shotTimer = 0;
    updateHUD();
  }

  function startGame() {
    resetGame();
    running = true;
    gameOver = false;
    overlay.classList.add("hidden");
    lastTime = performance.now();
    cancelAnimationFrame(animationId);
    animationId = requestAnimationFrame(loop);
  }

  function endGame() {
    running = false;
    gameOver = true;
    if (score > highScore) {
      highScore = score;
      localStorage.setItem("zombieHighScore", String(highScore));
    }
    highScoreEl.textContent = highScore;
    overlayTitle.textContent = "Base Overrun";
    overlayText.textContent = `You survived to wave ${wave} with ${score} points. Ready for another run?`;
    startBtn.textContent = "Play Again";
    overlay.classList.remove("hidden");
  }

  function updateHUD() {
    scoreEl.textContent = score;
    waveEl.textContent = wave;
    baseHealthEl.textContent = `${Math.max(0, Math.round(baseHealth))}%`;
  }

  function setKey(key, down) {
    if (down) keys.add(key);
    else keys.delete(key);
  }

  window.addEventListener("keydown", e => {
    if (["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"," ","w","a","s","d","W","A","S","D"].includes(e.key)) {
      e.preventDefault();
    }
    setKey(e.key, true);
    if (e.key === " " && !running && !gameOver) startGame();
    if (e.key === "Enter" && !running) startGame();
  });
  window.addEventListener("keyup", e => setKey(e.key, false));

  function pointerPosition(e) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) * WORLD.w / rect.width,
      y: (e.clientY - rect.top) * WORLD.h / rect.height
    };
  }

  canvas.addEventListener("pointermove", e => {
    const p = pointerPosition(e);
    mouse.x = p.x; mouse.y = p.y; mouse.active = true;
    if (e.pointerType === "touch" && running) shoot();
  });
  canvas.addEventListener("pointerdown", e => {
    const p = pointerPosition(e);
    mouse.x = p.x; mouse.y = p.y; mouse.active = true;
    if (running) shoot();
  });

  function touchButton(button) {
    const key = button.dataset.key;
    const down = e => { e.preventDefault(); setKey(key, true); };
    const up = e => { e.preventDefault(); setKey(key, false); };
    button.addEventListener("pointerdown", down);
    button.addEventListener("pointerup", up);
    button.addEventListener("pointercancel", up);
    button.addEventListener("pointerleave", up);
  }
  document.querySelectorAll(".touch-btn").forEach(touchButton);
  fireBtn.addEventListener("pointerdown", e => { e.preventDefault(); shoot(); });

  startBtn.addEventListener("click", startGame);
  restartBtn.addEventListener("click", startGame);

  function shoot() {
    if (!running || player.fireCooldown > 0) return;
    let angle = player.angle;
    if (mouse.active) angle = Math.atan2(mouse.y - player.y, mouse.x - player.x);
    bullets.push({
      x: player.x + Math.cos(angle) * 23,
      y: player.y + Math.sin(angle) * 23,
      vx: Math.cos(angle) * 620,
      vy: Math.sin(angle) * 620,
      life: 1.0
    });
    player.fireCooldown = 0.16;
    for (let i = 0; i < 3; i++) {
      particles.push({
        x: player.x + Math.cos(angle) * 25,
        y: player.y + Math.sin(angle) * 25,
        vx: (Math.random()-.5)*80,
        vy: (Math.random()-.5)*80,
        life: .15,
        max: .15,
        size: 3
      });
    }
  }

  function spawnZombie() {
    const side = Math.floor(Math.random() * 4);
    let x, y;
    if (side === 0) { x = -30; y = Math.random() * WORLD.h; }
    else if (side === 1) { x = WORLD.w + 30; y = Math.random() * WORLD.h; }
    else if (side === 2) { x = Math.random() * WORLD.w; y = -30; }
    else { x = Math.random() * WORLD.w; y = WORLD.h + 30; }

    const tough = Math.random() < Math.min(0.18 + wave * 0.025, .48);
    zombies.push({
      x, y,
      r: tough ? 19 : 15,
      speed: (tough ? 46 : 58) + wave * 4 + Math.random() * 18,
      hp: tough ? 3 : 1,
      maxHp: tough ? 3 : 1,
      damage: tough ? 10 : 6,
      hitFlash: 0
    });
  }

  function update(dt) {
    waveTimer += dt;
    if (waveTimer >= 24) {
      wave++;
      waveTimer = 0;
      for (let i = 0; i < 2 + Math.floor(wave / 3); i++) spawnZombie();
    }

    spawnTimer -= dt;
    const interval = Math.max(.32, 1.15 - wave * .075);
    if (spawnTimer <= 0) {
      spawnZombie();
      spawnTimer = interval * (.7 + Math.random() * .55);
    }

    let dx = 0, dy = 0;
    if (keys.has("ArrowLeft") || keys.has("a") || keys.has("A")) dx--;
    if (keys.has("ArrowRight") || keys.has("d") || keys.has("D")) dx++;
    if (keys.has("ArrowUp") || keys.has("w") || keys.has("W")) dy--;
    if (keys.has("ArrowDown") || keys.has("s") || keys.has("S")) dy++;
    if (dx || dy) {
      const len = Math.hypot(dx, dy);
      player.x += dx / len * player.speed * dt;
      player.y += dy / len * player.speed * dt;
    }
    player.x = Math.max(40, Math.min(WORLD.w - 40, player.x));
    player.y = Math.max(40, Math.min(WORLD.h - 40, player.y));

    if (mouse.active) player.angle = Math.atan2(mouse.y - player.y, mouse.x - player.x);
    player.fireCooldown = Math.max(0, player.fireCooldown - dt);

    for (let i = bullets.length - 1; i >= 0; i--) {
      const b = bullets[i];
      b.x += b.vx * dt; b.y += b.vy * dt; b.life -= dt;
      if (b.life <= 0 || b.x < -20 || b.x > WORLD.w+20 || b.y < -20 || b.y > WORLD.h+20) {
        bullets.splice(i, 1); continue;
      }
      for (let j = zombies.length - 1; j >= 0; j--) {
        const z = zombies[j];
        if (Math.hypot(b.x-z.x, b.y-z.y) < z.r + 5) {
          z.hp--; z.hitFlash = .08; bullets.splice(i, 1);
          if (z.hp <= 0) {
            score += z.maxHp === 3 ? 30 : 10;
            burst(z.x, z.y, z.maxHp === 3 ? 12 : 7);
            zombies.splice(j, 1);
          }
          break;
        }
      }
    }

    for (let i = zombies.length - 1; i >= 0; i--) {
      const z = zombies[i];
      z.hitFlash = Math.max(0, z.hitFlash - dt);
      const angle = Math.atan2(base.y - z.y, base.x - z.x);
      const distBase = Math.hypot(base.x-z.x, base.y-z.y);
      if (distBase > base.r + z.r - 3) {
        z.x += Math.cos(angle) * z.speed * dt;
        z.y += Math.sin(angle) * z.speed * dt;
      } else {
        baseHealth -= z.damage * dt;
        if (baseHealth <= 0) {
          baseHealth = 0; updateHUD(); endGame(); return;
        }
      }
      const pd = Math.hypot(player.x-z.x, player.y-z.y);
      if (pd < player.r + z.r) {
        const push = (player.r + z.r - pd + 1);
        const a = Math.atan2(player.y-z.y, player.x-z.x);
        player.x += Math.cos(a) * push;
        player.y += Math.sin(a) * push;
      }
    }

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx * dt; p.y += p.vy * dt; p.life -= dt;
      if (p.life <= 0) particles.splice(i, 1);
    }
    updateHUD();
  }

  function burst(x, y, count) {
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2;
      const s = 30 + Math.random() * 130;
      particles.push({ x, y, vx: Math.cos(a)*s, vy: Math.sin(a)*s, life: .35 + Math.random()*.35, max: .7, size: 2+Math.random()*3 });
    }
  }

  function draw() {
    ctx.clearRect(0,0,WORLD.w,WORLD.h);
    ctx.fillStyle = "#111827";
    ctx.fillRect(0,0,WORLD.w,WORLD.h);

    // Subtle arena grid.
    ctx.strokeStyle = "rgba(255,255,255,.045)";
    ctx.lineWidth = 1;
    for (let x=0; x<WORLD.w; x+=45) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,WORLD.h); ctx.stroke(); }
    for (let y=0; y<WORLD.h; y+=45) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(WORLD.w,y); ctx.stroke(); }

    // Base.
    ctx.beginPath(); ctx.arc(base.x, base.y, base.r+8, 0, Math.PI*2);
    ctx.fillStyle = "rgba(22,184,196,.12)"; ctx.fill();
    ctx.beginPath(); ctx.arc(base.x, base.y, base.r, 0, Math.PI*2);
    ctx.fillStyle = "#1F2937"; ctx.fill();
    ctx.strokeStyle = "#16B8C4"; ctx.lineWidth = 4; ctx.stroke();
    ctx.fillStyle = "#16B8C4"; ctx.fillRect(base.x-23, base.y-23, 46, 46);
    ctx.fillStyle = "#111827"; ctx.fillRect(base.x-6, base.y-18, 12, 36);
    ctx.fillRect(base.x-18, base.y-6, 36, 12);
    ctx.fillStyle = "#fff"; ctx.font = "700 13px Nunito Sans, sans-serif"; ctx.textAlign="center";
    ctx.fillText("BASE", base.x, base.y+82);

    // Health bar.
    ctx.fillStyle = "rgba(255,255,255,.12)"; ctx.fillRect(base.x-55, base.y-82, 110, 8);
    ctx.fillStyle = "#22C55E"; ctx.fillRect(base.x-55, base.y-82, 110*(baseHealth/100), 8);

    // Bullets.
    bullets.forEach(b => {
      ctx.beginPath(); ctx.arc(b.x,b.y,4,0,Math.PI*2);
      ctx.fillStyle="#FFB84D"; ctx.fill();
    });

    // Zombies.
    zombies.forEach(z => {
      const a = Math.atan2(player.y-z.y, player.x-z.x);
      ctx.save(); ctx.translate(z.x,z.y);
      ctx.fillStyle = z.hitFlash > 0 ? "#fff" : (z.maxHp === 3 ? "#9A7BCB" : "#65A87B");
      ctx.beginPath(); ctx.arc(0,0,z.r,0,Math.PI*2); ctx.fill();
      ctx.fillStyle = "#172033";
      ctx.beginPath(); ctx.arc(-5,-3,3,0,Math.PI*2); ctx.arc(5,-3,3,0,Math.PI*2); ctx.fill();
      ctx.strokeStyle="#172033"; ctx.lineWidth=2;
      ctx.beginPath(); ctx.moveTo(-6,7); ctx.lineTo(6,7); ctx.stroke();
      if (z.maxHp === 3) {
        ctx.fillStyle="rgba(255,255,255,.2)"; ctx.fillRect(-18,-27,36,4);
        ctx.fillStyle="#EF5B5B"; ctx.fillRect(-18,-27,36*(z.hp/z.maxHp),4);
      }
      ctx.restore();
    });

    // Player.
    ctx.save(); ctx.translate(player.x,player.y); ctx.rotate(player.angle);
    ctx.fillStyle="rgba(91,92,226,.22)"; ctx.beginPath(); ctx.arc(0,0,25,0,Math.PI*2); ctx.fill();
    ctx.fillStyle="#5B5CE2"; ctx.beginPath(); ctx.arc(0,0,player.r,0,Math.PI*2); ctx.fill();
    ctx.fillStyle="#fff"; ctx.beginPath(); ctx.arc(5,-5,4,0,Math.PI*2); ctx.fill();
    ctx.fillStyle="#D8D9FF"; ctx.fillRect(9,-5,24,10);
    ctx.fillStyle="#fff"; ctx.beginPath(); ctx.arc(-3,-5,3,0,Math.PI*2); ctx.fill();
    ctx.restore();

    particles.forEach(p => {
      ctx.globalAlpha = Math.max(0,p.life/p.max);
      ctx.fillStyle="#FFB84D"; ctx.beginPath(); ctx.arc(p.x,p.y,p.size,0,Math.PI*2); ctx.fill();
      ctx.globalAlpha=1;
    });

    // Wave timer.
    ctx.fillStyle="rgba(255,255,255,.08)";
    ctx.fillRect(WORLD.w-190,18,160,7);
    ctx.fillStyle="#5B5CE2";
    ctx.fillRect(WORLD.w-190,18,160*Math.min(1,waveTimer/24),7);
    ctx.fillStyle="rgba(255,255,255,.65)";
    ctx.font="600 12px Nunito Sans, sans-serif"; ctx.textAlign="right";
    ctx.fillText(`Next wave`, WORLD.w-30, 42);
  }

  function loop(now) {
    if (!running) return;
    const dt = Math.min(.033, (now-lastTime)/1000);
    lastTime = now;
    update(dt);
    draw();
    animationId = requestAnimationFrame(loop);
  }

  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);
  draw();
})();


}
function begin(){poster.hidden=true;gm.hidden=false;if(!booted){booted=true;var s=document.createElement("style");s.textContent=LOOK;document.head.appendChild(s);boot();}else{var r=document.getElementById("startBtn");if(r)r.click();}}
poster.addEventListener("click",begin);
var nb=document.getElementById("new");if(nb)nb.addEventListener("click",begin);
})();
