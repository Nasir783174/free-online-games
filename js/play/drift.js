/* Drift - game logic + its own look. Layout lives in style.css; page shell lives in the HTML. */
(function(){"use strict";
var gm=document.getElementById("gm"),poster=document.getElementById("poster"),booted=false;
var LOOK=".gm *{box-sizing:border-box}.gm{font-family:\"Nunito Sans\",system-ui,sans-serif;color:#171B2D;background:#F6F7FB}.gm button{font:inherit}.gm button{cursor:pointer}.gm .home-link{color:#4546B8;text-decoration:none;font-weight:700}.gm .page{width:min(1120px,calc(100% - 32px));margin:auto;padding:28px 0 70px}.gm .best-card{min-width:150px;background:#fff;border:1px solid #E5E7EF;border-radius:16px;padding:15px 20px;text-align:center}.gm .best-card span{display:block;color:#667085;font-size:12px;font-weight:800;letter-spacing:.08em}.gm .best-card strong{font-size:28px}.gm .game-shell{background:#111827;border-radius:20px;padding:14px;box-shadow:0 18px 45px rgba(17,24,39,.14)}.gm .hud{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:10px}.gm .stat{background:#1F2937;border-radius:12px;padding:9px 12px;text-align:center;color:#fff}.gm .stat span{display:block;color:#9CA3AF;font-size:12px;font-weight:700}.gm .stat strong{font-size:21px;line-height:1.1}.gm .combo-stat strong{color:#FFB84D}.gm .canvas-wrap{position:relative;overflow:hidden;border-radius:14px;background:#16202c}.gm canvas{display:block;width:100%;height:auto;max-height:620px}.gm .overlay{position:absolute;inset:0;display:grid;place-items:center;background:rgba(17,24,39,.68);padding:20px}.gm .overlay.hidden{display:none}.gm .overlay-card{width:min(390px,100%);background:#fff;border-radius:18px;padding:30px;text-align:center;box-shadow:0 20px 50px rgba(0,0,0,.25)}.gm .car-icon{width:52px;height:52px;margin:0 auto 15px;border-radius:14px;background:#FFB84D;color:#171B2D;display:grid;place-items:center;font-size:30px;font-weight:800}.gm .overlay h2{font-size:32px;margin:0 0 8px}.gm .overlay p:not(.eyebrow){color:#667085;line-height:1.55;margin:0 0 20px}.gm #startBtn,.gm .restart-btn{border:0;border-radius:11px;background:#5B5CE2;color:#fff;padding:12px 22px;font-weight:800;min-height:46px}.gm .game-controls{display:flex;justify-content:space-between;align-items:center;padding:12px 2px 2px;color:#D1D5DB}.gm .control-help{display:flex;gap:14px;align-items:center;flex-wrap:wrap;font-size:14px}.gm .control-help strong{color:#fff}.gm kbd{background:#374151;border:1px solid #4B5563;border-radius:5px;padding:2px 7px;color:#fff;margin-right:3px;font-size:12px}.gm .restart-btn{background:#fff;color:#171B2D}.gm .touch-controls{display:none;grid-template-columns:1fr 1.4fr 1fr;gap:10px;padding-top:10px}.gm .touch-btn{height:54px;border:0;border-radius:12px;background:#374151;color:#fff;font-size:25px;font-weight:800;touch-action:none}.gm .drift-btn{background:#FFB84D;color:#171B2D;font-size:16px}.gm h2{font-size:30px;line-height:1.2;margin:0 0 13px}.gm h3{font-size:21px;margin:24px 0 5px}.gm .tips{display:grid;gap:12px;margin-top:22px}.gm .tips div{display:flex;gap:14px;align-items:flex-start}.gm .tips span{flex:none;width:34px;height:34px;border-radius:10px;background:#EEF0FF;color:#4546B8;display:grid;place-items:center;font-weight:800}.gm .tips p{margin:4px 0 0}.gm .mini-icon{font-size:27px}@media(max-width:720px){.gm .page{width:min(100% - 20px,1120px);padding-top:20px}.gm .best-card{width:100%}.gm .game-shell{padding:8px;border-radius:15px}.gm .hud{grid-template-columns:repeat(2,1fr)}.gm .canvas-wrap{border-radius:10px}.gm .control-help{display:none}.gm .game-controls{justify-content:flex-end}.gm .touch-controls{display:grid}.gm h2{font-size:27px}}";
function __ready(f){f()}
function boot(){
(() => {
  "use strict";

  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");
  const overlay = document.getElementById("overlay");
  const overlayTitle = document.getElementById("overlayTitle");
  const overlayText = document.getElementById("overlayText");
  const startBtn = document.getElementById("startBtn");
  const restartBtn = document.getElementById("restartBtn");
  const scoreEl = document.getElementById("score");
  const comboEl = document.getElementById("combo");
  const speedEl = document.getElementById("speed");
  const bestEl = document.getElementById("bestScore");
  const hudBestEl = document.getElementById("hudBest");

  const W = 900, H = 560;
  canvas.width = W; canvas.height = H;

  let best = Number(localStorage.getItem("driftBest") || 0);
  bestEl.textContent = hudBestEl.textContent = best;

  const input = { left:false, right:false, drift:false };
  let running = false, gameOver = false, last = 0, elapsed = 0;
  let score = 0, combo = 1, comboCharge = 0, distance = 0;
  let car = { x:450, y:440, vx:0, angle:0, width:24, height:42 };
  let road = [], particles = [], skidMarks = [];
  let shake = 0, driftTime = 0, driftActive = false;

  function makeRoad() {
    road = [];
    const segs = 160;
    for (let i=0;i<segs;i++) {
      const y = H + 90 - i * 5.2;
      const center = W/2 + Math.sin(i*.105)*125 + Math.sin(i*.031+1.5)*70;
      const width = 300 + Math.sin(i*.047)*18;
      road.push({ y, center, width });
    }
  }

  function roadAt(y) {
    const i = Math.max(0, Math.min(road.length-1, Math.round((H+90-y)/5.2)));
    return road[i] || road[0];
  }

  function reset() {
    makeRoad();
    score = 0; combo = 1; comboCharge = 0; distance = 0; elapsed = 0;
    particles = []; skidMarks = [];
    car = {x:450,y:435,vx:0,angle:0,width:24,height:42};
    driftTime = 0; driftActive = false; shake = 0; gameOver = false;
    updateHud();
    draw();
  }

  function start() {
    reset(); running = true; overlay.classList.add("hidden");
    last = performance.now();
    requestAnimationFrame(loop);
  }

  function endGame(reason="Crash!") {
    running = false; gameOver = true;
    const finalScore = Math.floor(score);
    if (finalScore > best) {
      best = finalScore;
      localStorage.setItem("driftBest", String(best));
      bestEl.textContent = hudBestEl.textContent = best;
    }
    overlayTitle.textContent = reason;
    overlayText.textContent = `Run score: ${finalScore.toLocaleString()}. ${finalScore >= best && finalScore > 0 ? "New best score!" : "Try a cleaner line and longer drifts."}`;
    startBtn.textContent = "Race Again";
    overlay.classList.remove("hidden");
  }

  function updateHud() {
    scoreEl.textContent = Math.floor(score).toLocaleString();
    comboEl.textContent = `x${combo}`;
    speedEl.textContent = `${Math.round(150 + Math.abs(car.vx)*1.7)}`;
  }

  function loop(now) {
    if (!running) return;
    const dt = Math.min((now-last)/1000, .033);
    last = now;
    elapsed += dt;
    update(dt);
    draw();
    requestAnimationFrame(loop);
  }

  function update(dt) {
    const steer = (input.right?1:0) - (input.left?1:0);
    const targetVx = steer * (input.drift ? 270 : 205);
    car.vx += (targetVx-car.vx) * Math.min(1, dt*(input.drift?4.5:8));
    car.vx *= Math.pow(.988, dt*60);
    car.x += car.vx * dt;
    car.angle += ((car.vx/230)*.36 - car.angle) * Math.min(1,dt*7);
    distance += dt * (input.drift ? 165 : 190);
    score += dt * (input.drift ? 7*combo : 5);

    const r = roadAt(car.y);
    const leftEdge = r.center - r.width/2 + 25;
    const rightEdge = r.center + r.width/2 - 25;
    const offRoad = car.x < leftEdge || car.x > rightEdge;

    if (offRoad) {
      car.vx *= Math.pow(.92, dt*60);
      score = Math.max(0, score - dt*18);
    }

    const turning = Math.abs(car.vx) > 80 && Math.abs(steer) > 0;
    driftActive = input.drift && turning && !offRoad;
    if (driftActive) {
      driftTime += dt;
      comboCharge += dt;
      if (comboCharge > 1.5 && combo < 8) {
        combo++;
        comboCharge = 0;
      }
      if (Math.random() < dt*20) {
        particles.push({x:car.x+(Math.random()-.5)*20,y:car.y+20,vx:-car.vx*.2,vy:40+Math.random()*40,life:.35});
      }
      if (Math.random() < dt*18) skidMarks.push({x:car.x-8,y:car.y+17,life:1});
      score += dt * 22 * combo;
    } else if (driftTime > .25) {
      score += Math.min(350, driftTime*70*combo);
      comboCharge += driftTime*.15;
      driftTime = 0;
    }

    if (!driftActive && comboCharge <= 0) combo = Math.max(1, combo-1);
    if (!driftActive) comboCharge = Math.max(0, comboCharge-dt*.4);

    // Moving road scenery gives the feeling of forward motion.
    for (const p of particles) { p.x += p.vx*dt; p.y += p.vy*dt; p.life -= dt; }
    particles = particles.filter(p=>p.life>0);
    for (const s of skidMarks) s.y += 170*dt, s.life -= dt*.42;
    skidMarks = skidMarks.filter(s=>s.life>0);

    // A hard barrier hit ends the run.
    if (car.x < r.center-r.width/2+8 || car.x > r.center+r.width/2-8) {
      shake = .18;
      endGame("You Hit the Barrier");
      return;
    }
    updateHud();
  }

  function draw() {
    ctx.save();
    if (shake > 0) { ctx.translate((Math.random()-.5)*10,(Math.random()-.5)*10); shake -= .016; }
    drawBackground();
    drawRoad();
    drawMarks();
    drawParticles();
    drawCar();
    ctx.restore();
  }

  function drawBackground() {
    ctx.fillStyle = "#3b6646"; ctx.fillRect(0,0,W,H);
    // Simple repeating grass texture.
    ctx.fillStyle = "rgba(255,255,255,.035)";
    for(let y=0;y<H;y+=28) for(let x=(y%56);x<W;x+=56) ctx.fillRect(x,y,18,2);
  }

  function drawRoad() {
    // Road polygons using visible road samples.
    const pts = road.filter(p=>p.y>-40 && p.y<H+50);
    ctx.beginPath();
    pts.forEach((p,i)=>{const l=p.center-p.width/2,r=p.center+p.width/2;if(i===0)ctx.moveTo(l,p.y);else ctx.lineTo(l,p.y)});
    for(let i=pts.length-1;i>=0;i--){const p=pts[i];ctx.lineTo(p.center+p.width/2,p.y)}
    ctx.closePath(); ctx.fillStyle="#3C424B"; ctx.fill();

    // Outer edge.
    ctx.lineWidth=7; ctx.strokeStyle="#F5F1D7";
    ctx.beginPath(); pts.forEach((p,i)=>{const l=p.center-p.width/2;if(i===0)ctx.moveTo(l,p.y);else ctx.lineTo(l,p.y)}); ctx.stroke();
    ctx.beginPath(); pts.forEach((p,i)=>{const r=p.center+p.width/2;if(i===0)ctx.moveTo(r,p.y);else ctx.lineTo(r,p.y)}); ctx.stroke();

    // Center dashes.
    ctx.strokeStyle="rgba(255,255,255,.45)"; ctx.lineWidth=4; ctx.setLineDash([25,22]);
    ctx.beginPath(); pts.forEach((p,i)=>{if(i===0)ctx.moveTo(p.center,p.y);else ctx.lineTo(p.center,p.y)}); ctx.stroke();
    ctx.setLineDash([]);

    // Roadside markers.
    for(let i=5;i<pts.length;i+=9){
      const p=pts[i];
      for(const side of [-1,1]){
        const x=p.center+side*(p.width/2+15);
        ctx.fillStyle = i%18===0 ? "#FFB84D" : "#F5F5F5";
        ctx.fillRect(x-3,p.y-7,6,14);
      }
    }
  }

  function drawMarks() {
    for(const s of skidMarks){
      ctx.fillStyle=`rgba(20,20,20,${Math.max(0,s.life)*.35})`;
      ctx.fillRect(s.x-2,s.y-10,4,20);
    }
  }

  function drawParticles() {
    for(const p of particles){
      ctx.fillStyle=`rgba(225,225,225,${Math.max(0,p.life)*.65})`;
      ctx.beginPath();ctx.arc(p.x,p.y,2.5,0,Math.PI*2);ctx.fill();
    }
  }

  function drawCar() {
    ctx.save(); ctx.translate(car.x,car.y); ctx.rotate(car.angle);
    // shadow
    ctx.fillStyle="rgba(0,0,0,.3)";ctx.beginPath();ctx.ellipse(0,5,17,27,0,0,Math.PI*2);ctx.fill();
    // body
    ctx.fillStyle="#E95454";ctx.beginPath();ctx.roundRect(-12,-23,24,46,7);ctx.fill();
    ctx.fillStyle="#F7F7F7";ctx.beginPath();ctx.roundRect(-8,-13,16,12,4);ctx.fill();
    ctx.fillStyle="#232936";ctx.beginPath();ctx.roundRect(-8,3,16,10,4);ctx.fill();
    // headlights
    ctx.fillStyle="#FFF3B0";ctx.fillRect(-9,-23,6,4);ctx.fillRect(3,-23,6,4);
    // wheels
    ctx.fillStyle="#111827";ctx.fillRect(-15,-15,5,12);ctx.fillRect(10,-15,5,12);ctx.fillRect(-15,7,5,12);ctx.fillRect(10,7,5,12);
    ctx.restore();
  }

  function setKey(code,down) {
    if(code==="ArrowLeft"||code==="KeyA") input.left=down;
    if(code==="ArrowRight"||code==="KeyD") input.right=down;
    if(code==="Space") { input.drift=down; if(down) startIfNeeded(); }
    if(code==="KeyR" && down) start();
  }
  function startIfNeeded(){ if(!running && !gameOver) start(); }

  window.addEventListener("keydown",e=>{
    if(["ArrowLeft","ArrowRight","Space"].includes(e.code)) e.preventDefault();
    setKey(e.code,true);
  });
  window.addEventListener("keyup",e=>setKey(e.code,false));

  function bindHold(id,prop){
    const el=document.getElementById(id);
    const down=e=>{e.preventDefault();input[prop]=true;if(!running)start()};
    const up=e=>{e.preventDefault();input[prop]=false};
    ["pointerdown","touchstart"].forEach(ev=>el.addEventListener(ev,down,{passive:false}));
    ["pointerup","pointercancel","pointerleave","touchend"].forEach(ev=>el.addEventListener(ev,up,{passive:false}));
  }
  bindHold("leftBtn","left"); bindHold("rightBtn","right"); bindHold("driftBtn","drift");
  startBtn.addEventListener("click",start);
  restartBtn.addEventListener("click",start);

  reset();
})();

}
function begin(){poster.hidden=true;gm.hidden=false;if(!booted){booted=true;var s=document.createElement("style");s.textContent=LOOK;document.head.appendChild(s);boot();}else{var r=document.getElementById("startBtn");if(r)r.click();}}
poster.addEventListener("click",begin);
var nb=document.getElementById("new");if(nb)nb.addEventListener("click",begin);
})();
