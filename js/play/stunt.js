/* Stunt - game logic + its own look. Layout lives in style.css; page shell lives in the HTML. */
(function(){"use strict";
var gm=document.getElementById("gm"),poster=document.getElementById("poster"),booted=false;
var LOOK=".gm{\n  \n  \n  --cyan:#16B8C4;\n  --orange:#FFB84D;\n  --green:#22C55E;\n  --danger:#EF5B5B;\n  \n  \n  \n  \n  \n  --dark:#111827;\n  --dark2:#1F2937;\n}.gm *{box-sizing:border-box}.gm button{font:inherit}.gm .home-link{\n  text-decoration:none;\n  font-weight:700;\n  color:var(--muted);\n}.gm .home-link:hover{color:var(--brand)}.gm .page{max-width:1180px;margin:auto;padding:30px 20px 80px}.gm h2{line-height:1.15;letter-spacing:-.025em}.gm h2{font-size:32px;margin:0 0 14px;font-weight:700}.gm .game-shell{\n  background:var(--card);\n  border:1px solid var(--border);\n  border-radius:20px;\n  padding:16px;\n  box-shadow:0 10px 35px rgba(23,27,45,.07);\n}.gm .hud{\n  display:grid;\n  grid-template-columns:repeat(4,1fr);\n  gap:10px;\n  margin-bottom:14px;\n}.gm .hud>div{\n  min-height:72px;\n  padding:11px 14px;\n  border:1px solid var(--border);\n  border-radius:14px;\n  background:#fff;\n}.gm .hud span{display:block;color:var(--muted);font-size:13px;font-weight:700}.gm .hud strong{display:block;font-size:23px;line-height:1.25}.gm .canvas-wrap{\n  position:relative;\n  overflow:hidden;\n  border-radius:16px;\n  background:var(--dark);\n}.gm canvas{\n  display:block;\n  width:100%;\n  height:auto;\n  aspect-ratio:1100/620;\n  touch-action:none;\n}.gm .overlay{\n  position:absolute;inset:0;\n  display:grid;place-items:center;\n  padding:20px;\n  background:rgba(17,24,39,.52);\n}.gm .overlay.hidden{display:none}.gm .overlay-card{\n  width:min(470px,100%);\n  padding:30px;\n  border-radius:18px;\n  background:#fff;\n  text-align:center;\n  box-shadow:0 18px 60px rgba(0,0,0,.28);\n}.gm .overlay-kicker{margin:0 0 6px;color:var(--brand);font-weight:800;letter-spacing:.14em}.gm .overlay-card h2{font-size:34px;margin:0 0 10px}.gm .overlay-card p:not(.overlay-kicker){color:var(--muted);margin:0 0 20px}.gm button{\n  border:0;\n  cursor:pointer;\n  transition:transform .15s ease,box-shadow .15s ease,background .15s ease;\n}.gm button:focus-visible{outline:3px solid rgba(91,92,226,.35);outline-offset:3px}.gm button:active{transform:translateY(1px)}.gm .primary-btn,.gm .secondary-btn{\n  min-height:48px;padding:0 20px;border-radius:12px;font-weight:800;text-decoration:none;display:inline-flex;align-items:center;justify-content:center\n}.gm .primary-btn{background:var(--brand);color:#fff;box-shadow:0 7px 18px rgba(91,92,226,.25)}.gm .primary-btn:hover{background:var(--brand-dark)}.gm .secondary-btn{background:#fff;border:1px solid var(--border);color:var(--text)}.gm .secondary-btn:hover{border-color:var(--brand);color:var(--brand)}.gm .controls{\n  display:flex;align-items:center;gap:18px;\n  padding:18px 4px 2px;\n}.gm .control-copy{flex:1}.gm .control-copy h2{font-size:20px;margin:0 0 5px}.gm .control-copy p{margin:0;color:var(--muted);font-size:15px}.gm .mobile-hint{display:none!important}.gm kbd{\n  display:inline-block;\n  min-width:28px;padding:2px 7px;\n  border:1px solid var(--border);\n  border-bottom-width:2px;\n  border-radius:6px;background:#fff;\n  color:var(--text);font-weight:800;text-align:center;\n}.gm .touch-controls{display:grid;grid-template-columns:repeat(4,54px);gap:8px}.gm .touch-btn{\n  width:54px;height:48px;border-radius:11px;\n  background:var(--dark2);color:#fff;font-size:23px;font-weight:800;\n  touch-action:none;user-select:none;-webkit-user-select:none;\n}.gm .touch-btn.gas{background:var(--green)}.gm .touch-btn.brake{background:var(--danger)}.gm .touch-btn.rotate{background:var(--brand)}.gm details{border-top:1px solid var(--border);padding:14px 0}.gm details:last-child{border-bottom:1px solid var(--border)}.gm summary{cursor:pointer;font-weight:800}.gm details p{margin:9px 0 0}@media(max-width:760px){.gm .page{padding:22px 14px 60px}.gm h2{font-size:27px}.gm .hud{grid-template-columns:repeat(2,1fr)}.gm .hud>div{min-height:64px}.gm .hud strong{font-size:20px}.gm .game-shell{padding:10px;border-radius:16px}.gm .canvas-wrap{border-radius:12px}.gm .controls{flex-wrap:wrap;gap:12px}.gm .control-copy{flex-basis:100%}.gm .control-copy p:first-of-type{display:none}.gm .mobile-hint{display:block!important}.gm .touch-controls{order:2;grid-template-columns:repeat(4,1fr);width:100%}.gm .touch-btn{width:100%;height:52px}.gm .controls>.secondary-btn{order:3;width:100%}}@media(max-width:430px){.gm .home-link{font-size:14px}.gm .overlay-card{padding:24px 18px}.gm .overlay-card h2{font-size:28px}}";
function __ready(f){f()}
function boot(){
(() => {
  "use strict";

  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");
  const scoreEl = document.getElementById("score");
  const bestEl = document.getElementById("best");
  const distanceEl = document.getElementById("distance");
  const statusEl = document.getElementById("status");
  const overlay = document.getElementById("overlay");
  const overlayTitle = document.getElementById("overlayTitle");
  const overlayText = document.getElementById("overlayText");
  const startBtn = document.getElementById("startBtn");
  const restartBtn = document.getElementById("restartBtn");

  const W = canvas.width;
  const H = canvas.height;
  const GROUND = 505;
  const GRAVITY = 1450;
  const MAX_SPEED = 470;
  const ACCEL = 290;
  const BRAKE = 520;
  const AIR_ROTATE = 3.25;
  const TAU = Math.PI * 2;

  let keys = Object.create(null);
  let state = "ready";
  let lastTime = 0;
  let elapsed = 0;
  let score = 0;
  let distance = 0;
  let best = Number(localStorage.getItem("stunt-best") || 0);
  let cameraX = 0;
  let spawnX = 0;
  let nextRamp = 760;
  let terrain = [];
  let stars = [];
  let particles = [];
  let bike;
  let lastGroundAngle = 0;
  let stuntRotation = 0;
  let stuntTurns = 0;
  let stuntAirTime = 0;
  let flash = 0;

  bestEl.textContent = best;

  function resetWorld() {
    terrain = [
      {x:0,y:GROUND},
      {x:360,y:GROUND},
      {x:520,y:470},
      {x:690,y:GROUND},
      {x:840,y:GROUND}
    ];
    stars = [];
    particles = [];
    spawnX = 840;
    nextRamp = 940;
    cameraX = 0;
    score = 0;
    distance = 0;
    elapsed = 0;
    flash = 0;
    stuntRotation = 0;
    stuntTurns = 0;
    stuntAirTime = 0;
    lastGroundAngle = 0;

    bike = {
      x: 170, y: GROUND - 29,
      vx: 0, vy: 0,
      angle: 0,
      angularVelocity: 0,
      grounded: true,
      wheelBase: 58,
      wheelR: 15,
      radius: 26
    };

    for (let x = 520; x < 5200; x += 230 + Math.random() * 210) {
      stars.push({x, y: 0, r: 10, collected:false, bob:Math.random()*TAU});
    }
    ensureWorld(6000);
    updateStarHeights();
    updateHUD();
  }

  function ensureWorld(limitX) {
    while (spawnX < limitX) {
      const gap = 150 + Math.random() * 190;
      const rampLen = 110 + Math.random() * 70;
      const rampRise = 65 + Math.random() * 80;
      const baseY = GROUND - Math.random() * 55;
      terrain.push({x:spawnX, y:baseY});
      terrain.push({x:spawnX + rampLen, y:baseY - rampRise});
      terrain.push({x:spawnX + rampLen + gap, y:baseY + 15});
      terrain.push({x:spawnX + rampLen + gap + 140, y:GROUND - Math.random()*35});
      spawnX += rampLen + gap + 280;
    }
    // keep adding stars until they reach limitX (the old for-of loop pushed into the array it was iterating -> infinite loop)
    while (stars.length && stars[stars.length-1].x < limitX) {
      const last = stars[stars.length-1];
      const star = {x:last.x + 240 + Math.random()*180,y:0,r:10,collected:false,bob:Math.random()*TAU};
      star.y = terrainY(star.x) - 85;
      stars.push(star);
    }
  }

  function terrainY(x) {
    if (x <= terrain[0].x) return terrain[0].y;
    for (let i=1;i<terrain.length;i++) {
      const a = terrain[i-1], b = terrain[i];
      if (x <= b.x) {
        const t = (x-a.x)/(b.x-a.x);
        return a.y + (b.y-a.y)*t;
      }
    }
    return terrain[terrain.length-1].y;
  }

  function terrainAngle(x) {
    const d = 5;
    return Math.atan2(terrainY(x+d)-terrainY(x-d), d*2);
  }

  function updateStarHeights() {
    for (const s of stars) s.y = terrainY(s.x) - 85;
  }

  function startGame() {
    resetWorld();
    state = "playing";
    overlay.classList.add("hidden");
    statusEl.textContent = "Riding";
    lastTime = performance.now();
    requestAnimationFrame(loop);
  }

  function endGame(reason) {
    if (state !== "playing") return;
    state = "gameover";
    const finalScore = Math.max(0, Math.floor(score));
    if (finalScore > best) {
      best = finalScore;
      localStorage.setItem("stunt-best", String(best));
      bestEl.textContent = best;
    }
    statusEl.textContent = "Game Over";
    overlayTitle.textContent = "Run Over";
    overlayText.textContent = `${reason} Final score: ${finalScore}. Try again and beat your best.`;
    startBtn.textContent = "Play Again";
    overlay.classList.remove("hidden");
  }

  function addParticles(x,y,count=8) {
    for(let i=0;i<count;i++){
      particles.push({
        x,y,
        vx:(Math.random()-.5)*170,
        vy:-Math.random()*180,
        life:.4+Math.random()*.5
      });
    }
  }

  function collectStars() {
    for (const s of stars) {
      if (s.collected) continue;
      const dx = s.x - bike.x;
      const dy = s.y - bike.y;
      if (dx*dx + dy*dy < 42*42) {
        s.collected = true;
        score += 250;
        flash = .22;
        addParticles(s.x,s.y,12);
      }
    }
  }

  function update(dt) {
    elapsed += dt;
    ensureWorld(bike.x + 3500);
    updateStarHeights();

    const accelerating = keys.ArrowRight;
    const braking = keys.ArrowLeft;
    const rotatingBack = keys.ArrowUp;
    const rotatingForward = keys.ArrowDown;

    if (accelerating) bike.vx += ACCEL * dt;
    if (braking) bike.vx -= BRAKE * dt;
    bike.vx *= Math.pow(.992, dt*60);
    bike.vx = Math.max(70, Math.min(MAX_SPEED, bike.vx));

    if (bike.grounded) {
      const ground = terrainY(bike.x);
      const targetAngle = terrainAngle(bike.x);
      bike.angle += (targetAngle - bike.angle) * Math.min(1, dt*12);
      bike.angularVelocity = 0;
      bike.y = ground - bike.wheelR - 13;
      lastGroundAngle = targetAngle;
      bike.vy = 0;

      if (Math.abs(bike.angle-targetAngle) > .7) {
        endGame("You hit the slope at a bad angle.");
        return;
      }
      if (bike.x > 350 && Math.abs(terrainY(bike.x+28)-terrainY(bike.x-28)) > 35) {
        bike.grounded = false;
        bike.vy = -390;
        stuntRotation = 0;
        stuntTurns = 0;
        stuntAirTime = 0;
      }
    } else {
      stuntAirTime += dt;
      bike.vy += GRAVITY * dt;
      if (rotatingBack) bike.angularVelocity -= AIR_ROTATE * dt;
      if (rotatingForward) bike.angularVelocity += AIR_ROTATE * dt;
      bike.angularVelocity *= Math.pow(.97, dt*60);
      bike.angle += bike.angularVelocity * dt;
      stuntRotation += bike.angularVelocity * dt;
      const fullTurns = Math.floor(Math.abs(stuntRotation) / TAU);
      if (fullTurns > stuntTurns) {
        stuntTurns = fullTurns;
        score += 400 * stuntTurns;
        flash = .15;
      }
      bike.y += bike.vy * dt;
      if (bike.y > terrainY(bike.x) - bike.wheelR - 13) {
        bike.y = terrainY(bike.x) - bike.wheelR - 13;
        const landingAngle = terrainAngle(bike.x);
        const normalized = normalizeAngle(bike.angle - landingAngle);
        if (Math.abs(normalized) > .62 || Math.abs(bike.vy) > 760) {
          endGame("The landing was too hard.");
          return;
        }
        if (stuntTurns > 0) {
          score += stuntTurns * 500;
          addParticles(bike.x, bike.y+18, 16);
        }
        bike.grounded = true;
        bike.angle = landingAngle;
        bike.angularVelocity = 0;
        stuntRotation = 0;
        stuntTurns = 0;
        stuntAirTime = 0;
      }
    }

    bike.x += bike.vx * dt;
    distance = Math.max(distance, bike.x / 10);
    score += bike.vx * dt * .07;
    collectStars();

    if (bike.y > H + 150) {
      endGame("You missed the track.");
      return;
    }

    for (const p of particles) {
      p.x += p.vx*dt; p.y += p.vy*dt; p.vy += 500*dt; p.life -= dt;
    }
    particles = particles.filter(p=>p.life>0);

    cameraX += ((bike.x - 260) - cameraX) * Math.min(1, dt*5);
    flash = Math.max(0, flash-dt);
    updateHUD();
  }

  function normalizeAngle(a) {
    while(a > Math.PI) a -= TAU;
    while(a < -Math.PI) a += TAU;
    return a;
  }

  function updateHUD() {
    scoreEl.textContent = Math.floor(score);
    distanceEl.textContent = `${Math.floor(distance)} m`;
  }

  function draw() {
    ctx.clearRect(0,0,W,H);
    drawSky();
    drawTerrain();
    drawStars();
    drawBike();
    drawParticles();
    if (flash > 0) {
      ctx.fillStyle = `rgba(255,184,77,${Math.min(.18,flash)})`;
      ctx.fillRect(0,0,W,H);
    }
  }

  function drawSky() {
    ctx.fillStyle = "#111827";
    ctx.fillRect(0,0,W,H);
    ctx.fillStyle = "#1f2937";
    for(let i=0;i<8;i++){
      const x = (i*210 - cameraX*.18)%1200;
      ctx.beginPath();
      ctx.moveTo(x-180,GROUND+20);
      ctx.lineTo(x+20,260);
      ctx.lineTo(x+230,GROUND+20);
      ctx.closePath();
      ctx.fill();
    }
    ctx.fillStyle = "#334155";
    for(let i=0;i<6;i++){
      const x=(i*270-cameraX*.35)%1250;
      ctx.beginPath();
      ctx.arc(x,105+(i%2)*35,34,0,TAU);
      ctx.fill();
    }
    ctx.fillStyle="#FFB84D";
    ctx.beginPath();ctx.arc(900-cameraX*.06,95,34,0,TAU);ctx.fill();
  }

  function drawTerrain() {
    ctx.save();
    ctx.translate(-cameraX,0);
    const start = Math.max(0,cameraX-80);
    const end = cameraX+W+100;
    ctx.beginPath();
    ctx.moveTo(start,GROUND+80);
    for(let x=start;x<=end;x+=8) ctx.lineTo(x,terrainY(x));
    ctx.lineTo(end,GROUND+100);
    ctx.closePath();
    ctx.fillStyle="#263244";
    ctx.fill();

    ctx.beginPath();
    for(let x=start;x<=end;x+=8){
      if(x===start) ctx.moveTo(x,terrainY(x));
      else ctx.lineTo(x,terrainY(x));
    }
    ctx.strokeStyle="#16B8C4";
    ctx.lineWidth=5;
    ctx.stroke();

    for(let x=Math.floor(start/80)*80;x<end;x+=80){
      const y=terrainY(x);
      ctx.fillStyle="#1f2937";
      ctx.fillRect(x,y+12,3,45);
    }
    ctx.restore();
  }

  function drawStars() {
    ctx.save();
    ctx.translate(-cameraX,0);
    for(const s of stars){
      if(s.collected || s.x<cameraX-50 || s.x>cameraX+W+50) continue;
      const y=s.y + Math.sin(elapsed*3+s.bob)*5;
      ctx.save();
      ctx.translate(s.x,y);
      ctx.rotate(elapsed*1.5+s.bob);
      ctx.fillStyle="#FFB84D";
      ctx.beginPath();
      for(let i=0;i<10;i++){
        const r=i%2===0?s.r:s.r*.42;
        const a=-Math.PI/2+i*Math.PI/5;
        ctx.lineTo(Math.cos(a)*r,Math.sin(a)*r);
      }
      ctx.closePath();ctx.fill();
      ctx.restore();
    }
    ctx.restore();
  }

  function drawBike() {
    const sx=bike.x-cameraX, sy=bike.y;
    ctx.save();
    ctx.translate(sx,sy);
    ctx.rotate(bike.angle);

    // shadow
    if(bike.grounded){
      ctx.save();ctx.rotate(-bike.angle);
      ctx.fillStyle="rgba(0,0,0,.22)";
      ctx.beginPath();ctx.ellipse(0,35,48,8,0,0,TAU);ctx.fill();
      ctx.restore();
    }

    // wheels
    for(const wx of [-bike.wheelBase/2,bike.wheelBase/2]){
      ctx.fillStyle="#0b0f18";ctx.beginPath();ctx.arc(wx,16,bike.wheelR,0,TAU);ctx.fill();
      ctx.strokeStyle="#94a3b8";ctx.lineWidth=3;ctx.stroke();
      ctx.fillStyle="#475569";ctx.beginPath();ctx.arc(wx,16,5,0,TAU);ctx.fill();
    }

    // frame
    ctx.strokeStyle="#FFB84D";ctx.lineWidth=7;ctx.lineCap="round";
    ctx.beginPath();
    ctx.moveTo(-29,10);ctx.lineTo(-8,-15);ctx.lineTo(27,10);ctx.lineTo(-29,10);
    ctx.moveTo(-8,-15);ctx.lineTo(4,10);ctx.stroke();

    // seat and handlebar
    ctx.strokeStyle="#f8fafc";ctx.lineWidth=5;
    ctx.beginPath();ctx.moveTo(-16,-20);ctx.lineTo(-2,-20);ctx.moveTo(25,10);ctx.lineTo(36,-9);ctx.lineTo(29,-14);ctx.stroke();

    // rider
    ctx.fillStyle="#5B5CE2";ctx.beginPath();ctx.arc(-1,-43,12,0,TAU);ctx.fill();
    ctx.strokeStyle="#f8fafc";ctx.lineWidth=6;
    ctx.beginPath();ctx.moveTo(-4,-31);ctx.lineTo(-8,-8);ctx.moveTo(-4,-27);ctx.lineTo(18,-15);ctx.moveTo(-7,-10);ctx.lineTo(-20,7);ctx.moveTo(-4,-10);ctx.lineTo(18,7);ctx.stroke();

    ctx.restore();
  }

  function drawParticles() {
    ctx.save();
    ctx.translate(-cameraX,0);
    for(const p of particles){
      ctx.globalAlpha=Math.max(0,p.life/.9);
      ctx.fillStyle="#FFB84D";
      ctx.fillRect(p.x,p.y,5,5);
    }
    ctx.restore();
  }

  function loop(now) {
    if(state !== "playing") { draw(); return; }
    const dt=Math.min(.032,(now-lastTime)/1000 || .016);
    lastTime=now;
    update(dt);
    draw();
    if(state==="playing") requestAnimationFrame(loop);
  }

  function setKey(key, value) {
    keys[key]=value;
  }

  window.addEventListener("keydown", e => {
    if(["ArrowLeft","ArrowRight","ArrowUp","ArrowDown"," "].includes(e.key)) e.preventDefault();
    if(e.key==="r" || e.key==="R"){
      if(state!=="playing") startGame();
      return;
    }
    setKey(e.key,true);
  }, {passive:false});

  window.addEventListener("keyup", e => setKey(e.key,false));

  document.querySelectorAll(".touch-btn").forEach(btn=>{
    const key=btn.dataset.key;
    const press=e=>{e.preventDefault();setKey(key,true);};
    const release=e=>{e.preventDefault();setKey(key,false);};
    btn.addEventListener("pointerdown",press);
    btn.addEventListener("pointerup",release);
    btn.addEventListener("pointercancel",release);
    btn.addEventListener("pointerleave",release);
  });

  startBtn.addEventListener("click",startGame);
  restartBtn.addEventListener("click",startGame);

  resetWorld();
  draw();
})();


}
function begin(){poster.hidden=true;gm.hidden=false;if(!booted){booted=true;var s=document.createElement("style");s.textContent=LOOK;document.head.appendChild(s);boot();}else{var r=document.getElementById("startBtn");if(r)r.click();}}
poster.addEventListener("click",begin);
var nb=document.getElementById("new");if(nb)nb.addEventListener("click",begin);
})();
