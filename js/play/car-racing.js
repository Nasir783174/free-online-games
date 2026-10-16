/* Car Racing - game logic + its own look. Layout lives in style.css; page shell lives in the HTML. */
(function(){"use strict";
var gm=document.getElementById("gm"),poster=document.getElementById("poster"),booted=false;
var LOOK=".gm{\n  --accent:#16B8C4;--action:#FFB84D;\n  --success:#22C55E;--danger:#EF5B5B;\n  --road:#111827;--road2:#1F2937;\n}.gm *{box-sizing:border-box}.gm button{font:inherit}.gm button{cursor:pointer}.gm .page{width:min(1160px,calc(100% - 40px));margin:0 auto;padding:28px 0 70px}.gm .game-card{background:#fff;border:1px solid var(--border);border-radius:20px;padding:18px;box-shadow:0 12px 35px rgba(23,27,45,.07)}.gm .game-topbar{display:flex;gap:12px;margin-bottom:14px}.gm .stat{flex:1;background:#F6F7FB;border:1px solid var(--border);border-radius:13px;padding:8px 14px;display:flex;align-items:center;justify-content:space-between;min-height:56px}.gm .stat span{color:var(--muted);font-size:14px;font-weight:700}.gm .stat strong{font-size:22px}.gm .game-wrap{position:relative;background:var(--road);border-radius:16px;overflow:hidden;max-width:720px;margin:0 auto}.gm canvas{display:block;width:100%;height:auto;aspect-ratio:3/5;outline:none}.gm .overlay{position:absolute;inset:0;background:rgba(17,24,39,.76);display:none;align-items:center;justify-content:center;padding:20px;text-align:center}.gm .overlay.show{display:flex}.gm .overlay-panel{width:min(420px,100%);background:#fff;border-radius:18px;padding:30px 24px;box-shadow:0 18px 45px rgba(0,0,0,.25)}.gm .overlay h2{font-size:34px;line-height:1.1;margin:5px 0 8px}.gm .overlay p{color:var(--muted);margin:7px 0 18px}.gm .primary-btn,.gm .secondary-btn,.gm .control-btn{border:0;border-radius:12px;font-weight:800;transition:transform .12s ease,background .12s ease}.gm .primary-btn{background:var(--brand);color:#fff;padding:13px 22px;min-height:48px}.gm .primary-btn:hover{background:var(--brand-dark);transform:translateY(-1px)}.gm .control-hint{font-size:13px!important;margin:15px 0 0!important}.gm .new-best{color:var(--success)!important;font-weight:800}.gm .touch-controls{display:flex;gap:12px;justify-content:center;margin:16px auto 10px;max-width:720px}.gm .control-btn{height:54px;flex:1;background:#EEF0FF;color:var(--brand);font-size:25px;border:1px solid #DDE0FF}.gm .control-btn:nth-child(2){max-width:100px;background:#F3F4F6;color:var(--text)}.gm .control-btn:active{transform:scale(.96)}.gm .game-actions{display:flex;justify-content:center;gap:10px;margin-top:4px}.gm .secondary-btn{background:#fff;border:1px solid var(--border);color:var(--text);padding:9px 17px;min-height:42px}.gm .secondary-btn:hover{background:#F6F7FB}.gm .instruction-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-top:20px}.gm .instruction-grid div{background:#fff;border:1px solid var(--border);border-radius:14px;padding:18px}.gm .instruction-grid strong{display:block;margin-bottom:5px}.gm .instruction-grid span{display:block;color:var(--muted);font-size:15px}.gm li{margin:8px 0;color:var(--muted)}@media (max-width:700px){.gm .page{width:min(100% - 24px,1160px)}.gm .page{padding-top:20px}.gm .game-card{padding:10px;border-radius:16px}.gm .game-topbar{gap:7px}.gm .stat{padding:7px 9px;min-height:50px}.gm .stat span{font-size:12px}.gm .stat strong{font-size:19px}.gm .game-wrap{border-radius:13px}.gm .instruction-grid{grid-template-columns:1fr}}@media (min-width:701px){.gm .touch-controls{display:none}}@media (max-width:420px){.gm .page{width:calc(100% - 16px)}.gm .overlay-panel{padding:24px 18px}.gm .overlay h2{font-size:30px}}.gm button:focus-visible,.gm canvas:focus-visible{outline:3px solid var(--action);outline-offset:2px}";
function __ready(f){f()}
function boot(){
(() => {
  "use strict";

  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");
  const scoreEl = document.getElementById("score");
  const bestEl = document.getElementById("best");
  const speedEl = document.getElementById("speed");
  const startOverlay = document.getElementById("startOverlay");
  const gameOverOverlay = document.getElementById("gameOverOverlay");
  const finalScoreEl = document.getElementById("finalScore");
  const newBestEl = document.getElementById("newBest");
  const startBtn = document.getElementById("startBtn");
  const restartBtn = document.getElementById("restartBtn");
  const leftBtn = document.getElementById("leftBtn");
  const rightBtn = document.getElementById("rightBtn");
  const pauseBtn = document.getElementById("pauseBtn");
  const pauseTextBtn = document.getElementById("pauseTextBtn");
  const resetBtn = document.getElementById("resetBtn");

  const W = 480, H = 800;
  const lanes = 3;
  const laneCenters = [120, 240, 360];
  const player = { lane: 1, x: laneCenters[1], y: 670, w: 58, h: 108 };
  let traffic = [], pickups = [], particles = [];
  let running = false, paused = false, gameOver = false;
  let score = 0, distance = 0, roadOffset = 0, spawnTimer = 0, pickupTimer = 0, lastTime = 0;
  let best = Number(localStorage.getItem("carRacingBest") || 0);
  bestEl.textContent = best;

  function resizeCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  function resetState() {
    traffic = []; pickups = []; particles = [];
    player.lane = 1; player.x = laneCenters[1];
    score = 0; distance = 0; roadOffset = 0; spawnTimer = 0; pickupTimer = 0;
    running = false; paused = false; gameOver = false;
    scoreEl.textContent = "0"; speedEl.textContent = "1x";
    pauseTextBtn.textContent = "Pause"; pauseBtn.textContent = "Ⅱ";
  }

  function startGame() {
    resetState();
    running = true;
    startOverlay.classList.remove("show");
    gameOverOverlay.classList.remove("show");
    canvas.focus();
    lastTime = performance.now();
    requestAnimationFrame(loop);
  }

  function endGame() {
    running = false; gameOver = true;
    finalScoreEl.textContent = score;
    const isNew = score > best;
    if (isNew) {
      best = score;
      localStorage.setItem("carRacingBest", String(best));
      bestEl.textContent = best;
    }
    newBestEl.hidden = !isNew;
    gameOverOverlay.classList.add("show");
  }

  function togglePause() {
    if (!running || gameOver) return;
    paused = !paused;
    pauseTextBtn.textContent = paused ? "Resume" : "Pause";
    pauseBtn.textContent = paused ? "▶" : "Ⅱ";
    if (!paused) {
      lastTime = performance.now();
      requestAnimationFrame(loop);
    }
  }

  function move(dir) {
    if (!running || paused || gameOver) return;
    const next = Math.max(0, Math.min(lanes - 1, player.lane + dir));
    if (next !== player.lane) {
      player.lane = next;
      burst(player.x, player.y + player.h * .35, 5);
    }
  }

  function difficulty() {
    return 1 + Math.min(2.3, distance / 1800);
  }

  function spawnTraffic() {
    const lane = Math.floor(Math.random() * lanes);
    const colors = ["#EF5B5B", "#FFB84D", "#16B8C4", "#8B7CF6", "#E5E7EF"];
    const w = 56, h = 104;
    traffic.push({ lane, x: laneCenters[lane], y: -h - 20, w, h, color: colors[Math.floor(Math.random()*colors.length)], speed: 90 + Math.random()*35 });
  }

  function spawnPickup() {
    const lane = Math.floor(Math.random() * lanes);
    pickups.push({ lane, x: laneCenters[lane], y: -35, r: 15, spin: 0 });
  }

  function rectHit(a, b, pad = 7) {
    return Math.abs(a.x - b.x) < (a.w + b.w)/2 - pad &&
           Math.abs(a.y - b.y) < (a.h + b.h)/2 - pad;
  }

  function pickupHit(p) {
    const dx = p.x - player.x, dy = p.y - (player.y + player.h/2);
    return Math.hypot(dx, dy) < p.r + 25;
  }

  function burst(x, y, count) {
    for (let i=0;i<count;i++) particles.push({
      x,y,vx:(Math.random()-.5)*90,vy:(Math.random()-.5)*90,life:.45+Math.random()*.35
    });
  }

  function update(dt) {
    const diff = difficulty();
    const worldSpeed = 250 * diff;
    distance += worldSpeed * dt;
    score = Math.floor(distance / 10);
    scoreEl.textContent = score;
    speedEl.textContent = diff.toFixed(1).replace(".0","") + "x";
    roadOffset = (roadOffset + worldSpeed * dt) % 100;

    player.x += (laneCenters[player.lane] - player.x) * Math.min(1, dt * 12);

    spawnTimer += dt;
    const spawnEvery = Math.max(.42, .88 - distance/9000);
    if (spawnTimer >= spawnEvery) {
      spawnTimer = 0;
      spawnTraffic();
      if (Math.random() < .16) spawnTraffic();
    }

    pickupTimer += dt;
    if (pickupTimer >= 2.7) {
      pickupTimer = 0;
      if (Math.random() < .78) spawnPickup();
    }

    for (let i=traffic.length-1;i>=0;i--) {
      const car = traffic[i];
      car.y += (worldSpeed + car.speed) * dt;
      if (rectHit(player, {...car, y: car.y - 1}, 9)) { endGame(); return; }
      if (car.y > H + 130) traffic.splice(i,1);
    }

    for (let i=pickups.length-1;i>=0;i--) {
      const p = pickups[i];
      p.y += worldSpeed * dt;
      p.spin += dt * 6;
      if (pickupHit(p)) {
        score += 75;
        distance += 750;
        burst(p.x,p.y,14);
        pickups.splice(i,1);
      } else if (p.y > H+50) pickups.splice(i,1);
    }

    for (let i=particles.length-1;i>=0;i--) {
      const p=particles[i]; p.x+=p.vx*dt; p.y+=p.vy*dt; p.life-=dt;
      if(p.life<=0) particles.splice(i,1);
    }
  }

  function roundedRect(x,y,w,h,r) {
    const rr=Math.min(r,w/2,h/2);
    ctx.beginPath(); ctx.moveTo(x+rr,y); ctx.arcTo(x+w,y,x+w,y+h,rr);
    ctx.arcTo(x+w,y+h,x,y+h,rr); ctx.arcTo(x,y+h,x,y,rr); ctx.arcTo(x,y,x+w,y,rr); ctx.closePath();
  }

  function drawCar(x,y,w,h,color,playerCar=false) {
    ctx.save(); ctx.translate(x,y);
    roundedRect(-w/2,-h/2,w,h,12); ctx.fillStyle=color; ctx.fill();
    ctx.fillStyle="#0B1220"; roundedRect(-w*.31,-h*.33,w*.62,h*.26,8); ctx.fill();
    ctx.fillStyle="#CBD5E1"; roundedRect(-w*.27,-h*.29,w*.54,h*.16,5); ctx.fill();
    ctx.fillStyle="#0B1220"; roundedRect(-w*.30,h*.18,w*.60,h*.20,7); ctx.fill();
    ctx.fillStyle="#111827";
    ctx.fillRect(-w/2-4,-h*.28,7,h*.19); ctx.fillRect(w/2-3,-h*.28,7,h*.19);
    ctx.fillRect(-w/2-4,h*.12,7,h*.19); ctx.fillRect(w/2-3,h*.12,7,h*.19);
    if(playerCar){
      ctx.fillStyle="#FFE658"; ctx.fillRect(-w*.33,-h*.44,w*.18,7); ctx.fillRect(w*.15,-h*.44,w*.18,7);
      ctx.fillStyle="#EF5B5B"; ctx.fillRect(-w*.32,h*.37,w*.17,7); ctx.fillRect(w*.15,h*.37,w*.17,7);
    }
    ctx.restore();
  }

  function draw() {
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle="#0B1220"; ctx.fillRect(0,0,W,H);

    // Road shoulders
    ctx.fillStyle="#374151"; ctx.fillRect(45,0,390,H);
    ctx.fillStyle="#F3F4F6"; ctx.fillRect(45,0,5,H); ctx.fillRect(430,0,5,H);
    ctx.fillStyle="#171B2D"; ctx.fillRect(52,0,376,H);

    // Lane dividers
    ctx.setLineDash([48,52]); ctx.lineWidth=6; ctx.strokeStyle="rgba(255,255,255,.48)";
    ctx.lineDashOffset=-roadOffset;
    [180,300].forEach(x=>{ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();});
    ctx.setLineDash([]);

    traffic.forEach(c=>drawCar(c.x,c.y,c.w,c.h,c.color,false));
    pickups.forEach(p=>{
      ctx.save();ctx.translate(p.x,p.y);ctx.rotate(Math.sin(p.spin)*.08);
      ctx.fillStyle="#16B8C4";roundedRect(-14,-20,28,40,7);ctx.fill();
      ctx.fillStyle="#fff";ctx.fillRect(-4,-13,8,26);ctx.fillRect(-10,-5,20,8);
      ctx.restore();
    });

    // Player shadow and car
    ctx.fillStyle="rgba(0,0,0,.35)"; ctx.beginPath();ctx.ellipse(player.x,player.y+player.h*.48,38,12,0,0,Math.PI*2);ctx.fill();
    drawCar(player.x,player.y,player.w,player.h,"#5B5CE2",true);

    particles.forEach(p=>{ctx.globalAlpha=Math.max(0,p.life/.75);ctx.fillStyle="#FFB84D";ctx.beginPath();ctx.arc(p.x,p.y,3,0,Math.PI*2);ctx.fill();});
    ctx.globalAlpha=1;

    if(paused && running){
      ctx.fillStyle="rgba(17,24,39,.42)";ctx.fillRect(0,0,W,H);
      ctx.fillStyle="#fff";ctx.font="800 36px Nunito Sans";ctx.textAlign="center";ctx.fillText("Paused",W/2,H/2);
      ctx.font="600 16px Nunito Sans";ctx.fillText("Press P or tap Resume",W/2,H/2+34);
    }
  }

  function loop(now) {
    if (!running) { draw(); return; }
    if (paused) { draw(); return; }
    const dt = Math.min(.033, (now-lastTime)/1000);
    lastTime = now;
    update(dt);
    draw();
    if (running) requestAnimationFrame(loop);
  }

  function handleKey(e) {
    const key=e.key.toLowerCase();
    if(["arrowleft","arrowright","a","d","p"," "].includes(key)) e.preventDefault();
    if(key==="arrowleft"||key==="a") move(-1);
    if(key==="arrowright"||key==="d") move(1);
    if(key==="p"||key===" ") togglePause();
  }

  startBtn.addEventListener("click", startGame);
  restartBtn.addEventListener("click", startGame);
  pauseBtn.addEventListener("click", togglePause);
  pauseTextBtn.addEventListener("click", togglePause);
  resetBtn.addEventListener("click", () => {
    resetState(); startOverlay.classList.add("show"); gameOverOverlay.classList.remove("show"); draw();
  });
  leftBtn.addEventListener("pointerdown", e=>{e.preventDefault();move(-1)});
  rightBtn.addEventListener("pointerdown", e=>{e.preventDefault();move(1)});
  document.addEventListener("keydown", handleKey);

  // Swipe support for mobile.
  let touchX=0;
  canvas.addEventListener("touchstart",e=>{touchX=e.changedTouches[0].clientX},{passive:true});
  canvas.addEventListener("touchend",e=>{
    const dx=e.changedTouches[0].clientX-touchX;
    if(Math.abs(dx)>30) move(dx>0?1:-1);
  },{passive:true});

  resetState();
  draw();
})();

}
function begin(){poster.hidden=true;gm.hidden=false;if(!booted){booted=true;var s=document.createElement("style");s.textContent=LOOK;document.head.appendChild(s);boot();}else{var r=document.getElementById("startBtn");if(r)r.click();}}
poster.addEventListener("click",begin);
var nb=document.getElementById("new");if(nb)nb.addEventListener("click",begin);
})();
