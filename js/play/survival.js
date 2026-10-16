/* Survival - game logic + its own look. Layout lives in style.css; page shell lives in the HTML. */
(function(){"use strict";
var gm=document.getElementById("gm"),poster=document.getElementById("poster"),booted=false;
var LOOK=".gm *{box-sizing:border-box}.gm button{font:inherit}.gm button{touch-action:none}.gm .game-layout{display:grid;grid-template-columns:minmax(0,1fr) 260px;gap:22px;align-items:start}.gm .game-card,.gm .mission-card{background:#fff;border:1px solid #E5E7EF;border-radius:18px;box-shadow:0 12px 34px rgba(23,27,45,.06)}.gm .game-card{overflow:hidden}.gm .hud{display:grid;grid-template-columns:110px 90px minmax(190px,1fr) 110px;gap:1px;background:#E5E7EF;border-bottom:1px solid #E5E7EF}.gm .stat{background:#fff;padding:12px 16px;display:flex;align-items:center;justify-content:space-between;gap:10px}.gm .stat span{font-size:13px;color:#667085;font-weight:700;text-transform:uppercase;letter-spacing:.06em}.gm .stat strong{font-size:21px}.gm .health-stat{justify-content:flex-start}.gm .health-track{height:9px;background:#E5E7EF;border-radius:20px;overflow:hidden;flex:1;min-width:70px}.gm .health-bar{width:100%;height:100%;background:#22C55E;transition:width .15s ease}.gm .canvas-wrap{position:relative;background:#111827;aspect-ratio:5/3;overflow:hidden}.gm canvas{display:block;width:100%;height:100%;outline:none}.gm .overlay{position:absolute;inset:0;background:rgba(9,14,25,.72);display:grid;place-items:center;padding:22px;z-index:4}.gm .overlay.hidden{display:none}.gm .overlay-panel{width:min(430px,100%);text-align:center;background:rgba(17,24,39,.94);border:1px solid rgba(255,255,255,.12);border-radius:18px;padding:30px;color:#fff;box-shadow:0 20px 50px rgba(0,0,0,.3)}.gm .overlay-panel.compact{max-width:350px}.gm .overlay-panel h2{font-size:30px;line-height:1.15;margin:8px 0}.gm .overlay-panel p{margin:0 0 20px;color:#D1D5DB}.gm .danger-text{color:#EF5B5B}.gm .primary-button,.gm .secondary-button{border:0;border-radius:12px;min-height:46px;padding:0 20px;font-weight:800;cursor:pointer}.gm .primary-button{background:#FFB84D;color:#171B2D}.gm .primary-button:hover{filter:brightness(.96)}.gm .secondary-button{background:#F0F1F7;color:#4546B8}.gm .secondary-button:disabled{opacity:.45;cursor:not-allowed}.gm .primary-button:focus-visible,.gm .secondary-button:focus-visible,.gm .control:focus-visible,.gm summary:focus-visible,.gm canvas:focus-visible{outline:3px solid #16B8C4;outline-offset:3px}.gm .game-actions{padding:14px 16px;display:flex;align-items:center;gap:10px}.gm .status-text{margin-left:auto;color:#667085;font-size:14px}.gm .mobile-controls{display:none;padding:14px 16px 18px;grid-template-columns:repeat(3,58px);grid-template-rows:repeat(2,54px);justify-content:center;gap:7px;border-top:1px solid #E5E7EF}.gm .control{border:1px solid #D8DAE6;background:#F6F7FB;color:#4546B8;border-radius:12px;font-size:20px;font-weight:800}.gm .control.up{grid-column:2}.gm .control.left{grid-column:1;grid-row:2}.gm .control.down{grid-column:2;grid-row:2}.gm .control.right{grid-column:3;grid-row:2}.gm .mission-card{padding:22px}.gm .mission-card h2{font-size:25px;line-height:1.2;margin:7px 0 20px}.gm .legend{display:grid;gap:15px}.gm .legend>div{display:flex;gap:12px;align-items:center}.gm .legend p{font-size:14px;line-height:1.35;margin:0;color:#667085}.gm .legend p strong{color:#171B2D}.gm .legend-icon{width:30px;height:30px;flex:0 0 30px;border-radius:9px;display:block}.gm .legend-icon.food{background:#FFB84D}.gm .legend-icon.med{background:#22C55E;position:relative}.gm .legend-icon.med:after,.gm .legend-icon.med:before{content:\"\";position:absolute;background:#fff;border-radius:2px;left:7px;right:7px;top:13px;height:4px}.gm .legend-icon.med:after{top:7px;bottom:7px;left:13px;width:4px;height:auto}.gm .legend-icon.enemy{background:#EF5B5B;border-radius:50%}.gm .mission-note{border-top:1px solid #E5E7EF;margin:20px 0 0;padding-top:18px;color:#667085;font-size:14px}@media(max-width:900px){.gm .game-layout{grid-template-columns:1fr}.gm .mission-card{display:none}.gm .hud{grid-template-columns:repeat(2,1fr)}.gm .health-stat{grid-column:span 2}.gm .mobile-controls{display:grid}}@media(max-width:600px){.gm .game-card{border-radius:14px}.gm .hud{grid-template-columns:1fr 1fr}.gm .stat{padding:9px 11px}.gm .stat strong{font-size:18px}.gm .health-stat{grid-column:span 2}.gm .canvas-wrap{aspect-ratio:1/1}.gm .game-actions{flex-wrap:wrap}.gm .status-text{width:100%;margin:2px 0 0}.gm .overlay-panel{padding:22px 16px}.gm .overlay-panel h2{font-size:26px}}@media(prefers-reduced-motion:reduce){.gm *{scroll-behavior:auto!important;transition:none!important}}";
function __ready(f){f()}
function boot(){
(() => {
  "use strict";

  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");
  const scoreEl = document.getElementById("score");
  const waveEl = document.getElementById("wave");
  const bestScoreEl = document.getElementById("bestScore");
  const healthBar = document.getElementById("healthBar");
  const healthText = document.getElementById("healthText");
  const startOverlay = document.getElementById("startOverlay");
  const gameOverOverlay = document.getElementById("gameOverOverlay");
  const pauseOverlay = document.getElementById("pauseOverlay");
  const startButton = document.getElementById("startButton");
  const restartButton = document.getElementById("restartButton");
  const newGameButton = document.getElementById("newGameButton");
  const pauseButton = document.getElementById("pauseButton");
  const resumeButton = document.getElementById("resumeButton");
  const finalScoreEl = document.getElementById("finalScore");
  const finalWaveEl = document.getElementById("finalWave");
  const statusText = document.getElementById("statusText");
  const controlButtons = [...document.querySelectorAll(".control")];

  const W = canvas.width, H = canvas.height;
  const keys = Object.create(null);
  let touchDir = null, animationId = 0, lastTime = 0;
  let running = false, paused = false, score = 0, wave = 1, elapsed = 0, spawnClock = 0, supplyClock = 0;
  let bestScore = Number(localStorage.getItem("survivalBest") || 0);

  const player = { x: W/2, y: H/2, r: 14, speed: 245, health: 100, invuln: 0 };
  let enemies = [], supplies = [], particles = [];

  const rand = (min, max) => Math.random() * (max - min) + min;
  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
  const dist = (a,b) => Math.hypot(a.x-b.x,a.y-b.y);

  function resetGame() {
    score = 0; wave = 1; elapsed = 0; spawnClock = 0; supplyClock = 0;
    player.x = W/2; player.y = H/2; player.health = 100; player.invuln = 0;
    enemies = []; supplies = []; particles = [];
    for (let i=0;i<3;i++) spawnEnemy();
    spawnSupply("food");
    updateHUD();
  }

  function startGame() {
    cancelAnimationFrame(animationId);
    resetGame();
    running = true; paused = false; lastTime = performance.now();
    startOverlay.classList.add("hidden");
    gameOverOverlay.classList.add("hidden");
    pauseOverlay.classList.add("hidden");
    pauseButton.disabled = false;
    pauseButton.textContent = "Pause";
    statusText.textContent = "Survive. Supplies are scattered nearby.";
    canvas.focus();
    animationId = requestAnimationFrame(loop);
  }

  function endGame() {
    running = false; paused = false;
    cancelAnimationFrame(animationId);
    const final = Math.floor(score);
    if (final > bestScore) {
      bestScore = final;
      localStorage.setItem("survivalBest", String(bestScore));
    }
    updateHUD();
    finalScoreEl.textContent = final;
    finalWaveEl.textContent = wave;
    gameOverOverlay.classList.remove("hidden");
    pauseButton.disabled = true;
    statusText.textContent = "Run ended. Try another route.";
  }

  function togglePause(forceResume=false) {
    if (!running) return;
    paused = forceResume ? false : !paused;
    pauseOverlay.classList.toggle("hidden", !paused);
    pauseButton.textContent = paused ? "Resume" : "Pause";
    statusText.textContent = paused ? "Game paused." : "Back in the wilderness.";
    if (!paused) {
      lastTime = performance.now();
      animationId = requestAnimationFrame(loop);
      canvas.focus();
    } else {
      cancelAnimationFrame(animationId);
    }
  }

  function spawnEnemy() {
    const edge = Math.floor(Math.random()*4);
    let x, y;
    if (edge===0) { x=rand(20,W-20); y=-25; }
    if (edge===1) { x=W+25; y=rand(20,H-20); }
    if (edge===2) { x=rand(20,W-20); y=H+25; }
    if (edge===3) { x=-25; y=rand(20,H-20); }
    enemies.push({
      x,y,r:rand(12,18),
      speed: rand(62,88) + wave*7,
      phase: rand(0,Math.PI*2)
    });
  }

  function spawnSupply(type = Math.random() < .72 ? "food" : "med") {
    for (let tries=0;tries<30;tries++) {
      const item = { x:rand(45,W-45), y:rand(45,H-45), r:12, type, pulse:rand(0,6) };
      if (dist(item,player)>100 && enemies.every(e=>dist(item,e)>60)) {
        supplies.push(item); return;
      }
    }
  }

  function burst(x,y,color,count=8) {
    for(let i=0;i<count;i++) particles.push({
      x,y,vx:rand(-80,80),vy:rand(-80,80),life:rand(.25,.55),max:.55,color
    });
  }

  function update(dt) {
    elapsed += dt;
    score += dt * (10 + wave * 1.5);
    player.invuln = Math.max(0, player.invuln-dt);

    const nextWave = Math.floor(elapsed/20)+1;
    if (nextWave !== wave) {
      wave = nextWave;
      spawnEnemy(); spawnEnemy();
      statusText.textContent = `Wave ${wave}: creatures are getting faster.`;
    }

    let dx=0,dy=0;
    if(keys.ArrowLeft||keys.a||keys.A||touchDir==="left") dx--;
    if(keys.ArrowRight||keys.d||keys.D||touchDir==="right") dx++;
    if(keys.ArrowUp||keys.w||keys.W||touchDir==="up") dy--;
    if(keys.ArrowDown||keys.s||keys.S||touchDir==="down") dy++;
    if(dx||dy){
      const len=Math.hypot(dx,dy); dx/=len; dy/=len;
      player.x=clamp(player.x+dx*player.speed*dt,player.r,W-player.r);
      player.y=clamp(player.y+dy*player.speed*dt,player.r,H-player.r);
    }

    spawnClock += dt;
    const enemyInterval = Math.max(2.6, 5.2-wave*.22);
    if(spawnClock >= enemyInterval && enemies.length < 5 + wave*2){
      spawnClock=0; spawnEnemy();
    }

    supplyClock += dt;
    if(supplyClock >= 5.3 && supplies.length < 5){
      supplyClock=0; spawnSupply();
    }

    for(const e of enemies){
      const angle=Math.atan2(player.y-e.y,player.x-e.x);
      e.x += Math.cos(angle)*e.speed*dt;
      e.y += Math.sin(angle)*e.speed*dt;
      e.phase += dt*4;
      if(dist(e,player)<e.r+player.r && player.invuln<=0){
        player.health -= 18;
        player.invuln=.85;
        burst(player.x,player.y,"#EF5B5B",12);
        statusText.textContent = "Hit! Find a medkit and create some distance.";
        const knock=32;
        player.x=clamp(player.x-Math.cos(angle)*knock,player.r,W-player.r);
        player.y=clamp(player.y-Math.sin(angle)*knock,player.r,H-player.r);
        if(player.health<=0){ player.health=0; updateHUD(); endGame(); return; }
      }
    }

    for(let i=supplies.length-1;i>=0;i--){
      const s=supplies[i]; s.pulse+=dt*4;
      if(dist(s,player)<s.r+player.r+2){
        if(s.type==="food"){
          score += 125;
          player.health=Math.min(100,player.health+5);
          burst(s.x,s.y,"#FFB84D");
          statusText.textContent = "Food collected: +125 points.";
        } else {
          player.health=Math.min(100,player.health+30);
          burst(s.x,s.y,"#22C55E");
          statusText.textContent = "Medkit collected: health restored.";
        }
        supplies.splice(i,1);
      }
    }

    for(let i=particles.length-1;i>=0;i--){
      const p=particles[i]; p.life-=dt; p.x+=p.vx*dt; p.y+=p.vy*dt;
      if(p.life<=0) particles.splice(i,1);
    }
    updateHUD();
  }

  function updateHUD(){
    scoreEl.textContent=Math.floor(score);
    waveEl.textContent=wave;
    bestScoreEl.textContent=Math.max(bestScore,Math.floor(score));
    healthText.textContent=Math.ceil(player.health);
    healthBar.style.width=`${player.health}%`;
    healthBar.style.background=player.health>55?"#22C55E":player.health>25?"#FFB84D":"#EF5B5B";
  }

  function drawBackground(){
    ctx.fillStyle="#111827";ctx.fillRect(0,0,W,H);
    ctx.strokeStyle="rgba(255,255,255,.035)";ctx.lineWidth=1;
    for(let x=0;x<W;x+=45){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}
    for(let y=0;y<H;y+=45){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
    ctx.fillStyle="rgba(22,184,196,.05)";
    for(let i=0;i<18;i++){
      const x=(i*137)%W,y=(i*83)%H;
      ctx.beginPath();ctx.arc(x,y,randStatic(i,8,20),0,Math.PI*2);ctx.fill();
    }
  }
  function randStatic(seed,min,max){ const n=Math.sin(seed*999)*43758.5453; return min+(n-Math.floor(n))*(max-min); }

  function draw(){
    drawBackground();

    for(const s of supplies){
      const pulse=1+Math.sin(s.pulse)*.08;
      ctx.save();ctx.translate(s.x,s.y);ctx.scale(pulse,pulse);
      if(s.type==="food"){
        ctx.fillStyle="#FFB84D";ctx.beginPath();ctx.arc(0,0,s.r,0,Math.PI*2);ctx.fill();
        ctx.fillStyle="#6B4F2A";ctx.fillRect(-2,-15,4,6);
        ctx.fillStyle="#22C55E";ctx.beginPath();ctx.ellipse(5,-10,5,3,-.5,0,Math.PI*2);ctx.fill();
      }else{
        ctx.fillStyle="#22C55E";roundRect(-13,-13,26,26,7);ctx.fill();
        ctx.fillStyle="#fff";ctx.fillRect(-3,-9,6,18);ctx.fillRect(-9,-3,18,6);
      }
      ctx.restore();
    }

    for(const e of enemies){
      ctx.save();ctx.translate(e.x,e.y);
      ctx.fillStyle="#EF5B5B";ctx.beginPath();ctx.arc(0,0,e.r,0,Math.PI*2);ctx.fill();
      ctx.fillStyle="#111827";
      const eyeY=-2, eyeX=e.r*.34;
      ctx.beginPath();ctx.arc(-eyeX,eyeY,2.2,0,Math.PI*2);ctx.arc(eyeX,eyeY,2.2,0,Math.PI*2);ctx.fill();
      ctx.strokeStyle="#111827";ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,5,5,.15*Math.PI,.85*Math.PI,true);ctx.stroke();
      ctx.restore();
    }

    if(player.invuln<=0 || Math.floor(player.invuln*12)%2===0){
      ctx.save();ctx.translate(player.x,player.y);
      ctx.shadowColor="rgba(22,184,196,.5)";ctx.shadowBlur=16;
      ctx.fillStyle="#16B8C4";ctx.beginPath();ctx.arc(0,0,player.r,0,Math.PI*2);ctx.fill();
      ctx.shadowBlur=0;ctx.fillStyle="#fff";ctx.beginPath();ctx.arc(4,-4,3.2,0,Math.PI*2);ctx.fill();
      ctx.restore();
    }

    for(const p of particles){
      ctx.globalAlpha=Math.max(0,p.life/p.max);ctx.fillStyle=p.color;
      ctx.fillRect(p.x-2,p.y-2,4,4);
    }
    ctx.globalAlpha=1;
  }

  function roundRect(x,y,w,h,r){
    ctx.beginPath();ctx.roundRect(x,y,w,h,r);
  }

  function loop(now){
    if(!running||paused) return;
    const dt=Math.min((now-lastTime)/1000,.034);lastTime=now;
    update(dt);draw();
    if(running&&!paused) animationId=requestAnimationFrame(loop);
  }

  function setKey(e,value){
    const gameKeys=["ArrowUp","ArrowDown","ArrowLeft","ArrowRight","w","a","s","d","W","A","S","D"];
    if(gameKeys.includes(e.key)){ e.preventDefault(); keys[e.key]=value; }
  }
  window.addEventListener("keydown",e=>{
    if(e.key==="p"||e.key==="P"){ if(!e.repeat) togglePause(); return; }
    setKey(e,true);
  },{passive:false});
  window.addEventListener("keyup",e=>setKey(e,false),{passive:false});

  controlButtons.forEach(btn=>{
    const begin=e=>{e.preventDefault();touchDir=btn.dataset.dir;};
    const end=e=>{e.preventDefault();if(touchDir===btn.dataset.dir)touchDir=null;};
    btn.addEventListener("pointerdown",begin);
    btn.addEventListener("pointerup",end);
    btn.addEventListener("pointercancel",end);
    btn.addEventListener("pointerleave",end);
  });

  startButton.addEventListener("click",startGame);
  restartButton.addEventListener("click",startGame);
  newGameButton.addEventListener("click",startGame);
  pauseButton.addEventListener("click",()=>togglePause());
  resumeButton.addEventListener("click",()=>togglePause(true));
  document.addEventListener("visibilitychange",()=>{if(document.hidden&&running&&!paused)togglePause();});

  bestScoreEl.textContent=bestScore;
  resetGame();
  draw();
})();

}
function begin(){poster.hidden=true;gm.hidden=false;if(!booted){booted=true;var s=document.createElement("style");s.textContent=LOOK;document.head.appendChild(s);boot();}else{var r=document.getElementById("startButton");if(r)r.click();}}
poster.addEventListener("click",begin);
var nb=document.getElementById("new");if(nb)nb.addEventListener("click",begin);
})();
