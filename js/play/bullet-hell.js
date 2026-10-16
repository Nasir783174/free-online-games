/* Bullet Hell - game logic + its own look. Layout lives in style.css; page shell lives in the HTML. */
(function(){"use strict";
var gm=document.getElementById("gm"),poster=document.getElementById("poster"),booted=false;
var LOOK=".gm{\n  --teal:#16B8C4;--orange:#FFB84D;\n  --success:#22C55E;--danger:#EF5B5B;\n  --dark:#111827;--dark2:#1F2937;\n}.gm *{box-sizing:border-box}.gm button{font:inherit}.gm button{cursor:pointer}.gm .back-link{text-decoration:none;color:var(--muted);font-weight:700;font-size:15px}.gm .back-link:hover{text-decoration:underline}.gm .page{width:min(1160px,calc(100% - 32px));margin:auto;padding:28px 0 80px}.gm h2{font-size:30px;line-height:1.2;margin:0 0 14px;font-weight:700}.gm .game-card{background:#fff;border:1px solid var(--border);border-radius:18px;overflow:hidden;box-shadow:0 10px 30px rgba(23,27,45,.06)}.gm .game-topbar{display:grid;grid-template-columns:repeat(4,1fr);background:#fff;border-bottom:1px solid var(--border)}.gm .stat{padding:14px 18px;border-right:1px solid var(--border)}.gm .stat:last-child{border-right:0}.gm .stat span{display:block;color:var(--muted);font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.05em}.gm .stat strong{display:block;font-size:23px;line-height:1.25;margin-top:2px}.gm .status-stat strong{color:var(--brand)}.gm .canvas-wrap{position:relative;background:var(--dark);padding:18px;display:flex;justify-content:center}.gm canvas{display:block;width:min(100%,900px);height:auto;aspect-ratio:3/2;background:var(--dark);border-radius:10px;touch-action:none}.gm .overlay{position:absolute;inset:18px;display:grid;place-items:center;background:rgba(17,24,39,.72);border-radius:10px}.gm .overlay.hidden{display:none}.gm .overlay-panel{width:min(480px,calc(100% - 28px));background:rgba(255,255,255,.98);border-radius:16px;padding:28px;text-align:center;box-shadow:0 18px 50px rgba(0,0,0,.28)}.gm .overlay-kicker{margin:0 0 5px;color:var(--brand);font-weight:800;letter-spacing:.08em;font-size:13px}.gm .overlay-panel h2{font-size:32px;margin-bottom:8px}.gm .overlay-panel p:not(.overlay-kicker){color:var(--muted);margin:0 0 20px}.gm .primary-btn,.gm .secondary-btn{min-height:46px;border-radius:11px;padding:0 20px;font-weight:800;border:1px solid transparent}.gm .primary-btn{background:var(--brand);color:#fff}.gm .primary-btn:hover{background:var(--brand-dark)}.gm .secondary-btn{background:#fff;border-color:var(--border);color:var(--text)}.gm .secondary-btn:hover{border-color:#c8cad8;background:#fafaff}.gm .controls{display:flex;gap:24px;align-items:center;padding:20px 22px;border-top:1px solid var(--border)}.gm .control-copy{flex:1}.gm .control-copy h2{font-size:20px;margin-bottom:4px}.gm .control-copy p{margin:0;color:var(--muted);font-size:15px}.gm .control-list{display:flex;gap:14px;flex-wrap:wrap;color:var(--muted);font-size:14px}.gm kbd{background:#F1F2F7;border:1px solid #D9DBE5;border-bottom-width:2px;border-radius:6px;padding:2px 7px;font-size:12px;color:var(--text);font-weight:800}.gm .touch-controls{display:none;padding:8px 20px 22px;background:#fff}.gm .touch-row{display:flex;justify-content:center;gap:10px;margin-top:10px}.gm .touch-btn{width:58px;height:50px;border:1px solid var(--border);border-radius:12px;background:#F7F7FC;color:var(--text);font-weight:800;font-size:20px;touch-action:none;-webkit-user-select:none;user-select:none}.gm .touch-btn:active,.gm .touch-btn.active{background:#E7E7FB;border-color:#B9BAEE}.gm .touch-btn.shoot{color:var(--brand)}.gm details{background:#fff;border:1px solid var(--border);border-radius:12px;padding:15px 18px;margin:10px 0}.gm summary{font-weight:800;cursor:pointer}.gm details p{margin:10px 0 0;font-size:15px}@media(max-width:800px){.gm .page{width:min(100% - 20px,720px);padding-top:20px}.gm .game-topbar{grid-template-columns:repeat(2,1fr)}.gm .stat:nth-child(2){border-right:0}.gm .stat:nth-child(-n+2){border-bottom:1px solid var(--border)}.gm .canvas-wrap{padding:10px}.gm .overlay{inset:10px}.gm .controls{padding:16px;flex-wrap:wrap;gap:14px}.gm .control-copy{min-width:100%}.gm .control-list{order:3;width:100%}.gm .controls>.secondary-btn{margin-left:auto}.gm .touch-controls{display:block}}@media(max-width:480px){.gm .back-link{font-size:14px}.gm .stat{padding:11px 13px}.gm .stat strong{font-size:20px}.gm .overlay-panel{padding:22px 17px}.gm .overlay-panel h2{font-size:27px}.gm .overlay-panel p:not(.overlay-kicker){font-size:14px}.gm .touch-btn{width:62px;height:52px}}";
function __ready(f){f()}
function boot(){
(() => {
  "use strict";

  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");
  const scoreEl = document.getElementById("score");
  const highScoreEl = document.getElementById("highScore");
  const waveEl = document.getElementById("wave");
  const statusEl = document.getElementById("statusText");
  const overlay = document.getElementById("overlay");
  const overlayTitle = document.getElementById("overlayTitle");
  const overlayText = document.getElementById("overlayText");
  const overlayKicker = document.getElementById("overlayKicker");
  const startBtn = document.getElementById("startBtn");
  const restartBtn = document.getElementById("restartBtn");

  const W = canvas.width, H = canvas.height;
  const keys = new Set();
  const touch = {up:false,down:false,left:false,right:false,shoot:false};
  let animationId = 0, lastTime = 0, state = "ready";
  let score = 0, highScore = Number(localStorage.getItem("bulletHellHighScore") || 0);
  let wave = 1, elapsed = 0, waveTimer = 0, enemyTimer = 0, bulletTimer = 0;
  let enemies = [], bullets = [], playerShots = [], particles = [];
  let shake = 0;

  const player = {x:W/2,y:H-75,r:10,speed:330,fire:0,invuln:0};

  highScoreEl.textContent = highScore;

  function resetGame() {
    score = 0; wave = 1; elapsed = 0; waveTimer = 0; enemyTimer = 0; bulletTimer = 0; shake = 0;
    enemies = []; bullets = []; playerShots = []; particles = [];
    player.x = W/2; player.y = H-75; player.fire = 0; player.invuln = 1.2;
    updateUI();
  }

  function updateUI() {
    scoreEl.textContent = Math.floor(score);
    highScoreEl.textContent = highScore;
    waveEl.textContent = wave;
    statusEl.textContent = state === "playing" ? "Playing" : state === "paused" ? "Paused" : state === "gameover" ? "Game Over" : "Ready";
  }

  function startGame() {
    resetGame();
    state = "playing";
    overlay.classList.add("hidden");
    lastTime = performance.now();
    cancelAnimationFrame(animationId);
    animationId = requestAnimationFrame(loop);
    updateUI();
  }

  function endGame() {
    state = "gameover";
    if (score > highScore) {
      highScore = Math.floor(score);
      localStorage.setItem("bulletHellHighScore", highScore);
    }
    updateUI();
    overlayKicker.textContent = "RUN COMPLETE";
    overlayTitle.textContent = "Game Over";
    overlayText.textContent = `You scored ${Math.floor(score)} points and reached wave ${wave}. Dodge smarter and try again.`;
    startBtn.textContent = "Play Again";
    overlay.classList.remove("hidden");
  }

  function togglePause() {
    if (state === "playing") {
      state = "paused";
      overlayKicker.textContent = "PAUSED";
      overlayTitle.textContent = "Take a Breath";
      overlayText.textContent = "Press P to continue, or use the button below to restart.";
      startBtn.textContent = "Resume";
      overlay.classList.remove("hidden");
      updateUI();
    } else if (state === "paused") {
      state = "playing";
      overlay.classList.add("hidden");
      lastTime = performance.now();
      animationId = requestAnimationFrame(loop);
      updateUI();
    }
  }

  startBtn.addEventListener("click", () => {
    if (state === "paused") togglePause();
    else startGame();
  });
  restartBtn.addEventListener("click", startGame);

  window.addEventListener("keydown", e => {
    const k = e.key.toLowerCase();
    if (["arrowup","arrowdown","arrowleft","arrowright"," ","w","a","s","d","p"].includes(k)) e.preventDefault();
    keys.add(k);
    if (k === "p") togglePause();
    if (state === "ready" && (k === " " || k === "enter")) startGame();
  });
  window.addEventListener("keyup", e => keys.delete(e.key.toLowerCase()));

  document.querySelectorAll(".touch-btn").forEach(btn => {
    const key = btn.dataset.key;
    const set = v => { touch[key] = v; btn.classList.toggle("active", v); };
    btn.addEventListener("pointerdown", e => { e.preventDefault(); set(true); });
    btn.addEventListener("pointerup", e => { e.preventDefault(); set(false); });
    btn.addEventListener("pointercancel", () => set(false));
    btn.addEventListener("pointerleave", () => set(false));
  });

  canvas.addEventListener("pointerdown", () => {
    if (state === "ready" || state === "gameover") startGame();
  });

  function rand(a,b){ return Math.random()*(b-a)+a; }
  function clamp(v,a,b){ return Math.max(a,Math.min(b,v)); }

  function spawnEnemy() {
    const typeRoll = Math.random();
    const type = typeRoll < 0.68 ? "basic" : typeRoll < 0.9 ? "spinner" : "tank";
    const r = type === "tank" ? 22 : type === "spinner" ? 16 : 14;
    enemies.push({
      x:rand(45,W-45), y:-30, r, type,
      hp:type === "tank" ? 7 : type === "spinner" ? 3 : 2,
      maxHp:type === "tank" ? 7 : type === "spinner" ? 3 : 2,
      speed:type === "tank" ? rand(48,65) : rand(70,105),
      age:0, shoot:rand(.4,1.3), phase:rand(0,Math.PI*2)
    });
  }

  function shootEnemy(e) {
    const dx = player.x-e.x, dy = player.y-e.y;
    const base = Math.atan2(dy,dx);
    const count = e.type === "tank" ? 5 : e.type === "spinner" ? 8 : 3;
    const spread = e.type === "tank" ? .72 : e.type === "spinner" ? Math.PI*2 : .42;
    const speed = e.type === "tank" ? 120+wave*4 : 145+wave*6;
    for(let i=0;i<count;i++){
      const angle = e.type === "spinner"
        ? e.phase + i*(Math.PI*2/count)
        : base + (i-(count-1)/2)*(spread/(count-1 || 1));
      bullets.push({x:e.x,y:e.y,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed,r:e.type==="tank"?6:5});
    }
  }

  function shootPlayer() {
    playerShots.push({x:player.x,y:player.y-13,vx:0,vy:-540,r:4});
  }

  function burst(x,y,n=8,life=.45) {
    for(let i=0;i<n;i++){
      const a=rand(0,Math.PI*2), s=rand(35,150);
      particles.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,r:rand(2,4),life,maxLife:life});
    }
  }

  function circleHit(a,b) {
    const dx=a.x-b.x, dy=a.y-b.y, rr=a.r+b.r;
    return dx*dx+dy*dy<rr*rr;
  }

  function update(dt) {
    elapsed += dt; waveTimer += dt;
    if (waveTimer >= 16) { wave++; waveTimer = 0; burst(player.x,player.y,18,.7); }

    let mx=0,my=0;
    if(keys.has("arrowleft")||keys.has("a")||touch.left) mx--;
    if(keys.has("arrowright")||keys.has("d")||touch.right) mx++;
    if(keys.has("arrowup")||keys.has("w")||touch.up) my--;
    if(keys.has("arrowdown")||keys.has("s")||touch.down) my++;
    const mag=Math.hypot(mx,my)||1;
    player.x=clamp(player.x+(mx/mag)*player.speed*dt,18,W-18);
    player.y=clamp(player.y+(my/mag)*player.speed*dt,18,H-18);

    player.invuln=Math.max(0,player.invuln-dt);
    player.fire-=dt;
    const firing=keys.has(" ")||touch.shoot;
    if(firing && player.fire<=0){ shootPlayer(); player.fire=.12; }

    enemyTimer-=dt;
    const spawnRate=Math.max(.28,1.05-wave*.035);
    if(enemyTimer<=0){ spawnEnemy(); enemyTimer=spawnRate*rand(.65,1.05); }

    bulletTimer-=dt;
    if(bulletTimer<=0){
      bulletTimer=Math.max(.25,1.15-wave*.025);
      if(enemies.length>0) enemies[Math.floor(Math.random()*enemies.length)].shoot=0;
    }

    enemies.forEach(e=>{
      e.age+=dt;
      e.y+=e.speed*dt;
      if(e.type==="spinner") e.x+=Math.sin(e.age*2.2+e.phase)*35*dt;
      e.x=clamp(e.x,25,W-25);
      e.shoot-=dt;
      if(e.shoot<=0){ shootEnemy(e); e.shoot= e.type==="tank"?1.7:1.1; }
    });
    enemies=enemies.filter(e=>e.y<H+50);

    playerShots.forEach(s=>s.y+=s.vy*dt);
    playerShots=playerShots.filter(s=>s.y>-20);

    bullets.forEach(b=>{b.x+=b.vx*dt;b.y+=b.vy*dt;});
    bullets=bullets.filter(b=>b.x>-30&&b.x<W+30&&b.y>-30&&b.y<H+30);

    for(let i=enemies.length-1;i>=0;i--){
      const e=enemies[i];
      for(let j=playerShots.length-1;j>=0;j--){
        const s=playerShots[j];
        if(circleHit(e,s)){
          playerShots.splice(j,1); e.hp--; burst(s.x,s.y,4,.25);
          if(e.hp<=0){
            score += e.type==="tank"?120:e.type==="spinner"?70:45;
            burst(e.x,e.y,e.type==="tank"?22:12,.55);
            enemies.splice(i,1);
            break;
          }
        }
      }
    }

    if(player.invuln<=0){
      for(const b of bullets){
        const dx=b.x-player.x,dy=b.y-player.y;
        if(dx*dx+dy*dy < (b.r+player.r*.7)**2){ endGame(); return; }
      }
      for(const e of enemies){
        if(circleHit({x:player.x,y:player.y,r:9},e)){ endGame(); return; }
      }
    }

    score += dt*(2+wave*.55);
    particles.forEach(p=>{p.x+=p.vx*dt;p.y+=p.vy*dt;p.vx*=.97;p.vy*=.97;p.life-=dt;});
    particles=particles.filter(p=>p.life>0);
    shake=Math.max(0,shake-dt*3);
    updateUI();
  }

  function drawGrid() {
    ctx.fillStyle="#111827";ctx.fillRect(0,0,W,H);
    ctx.strokeStyle="rgba(148,163,184,.08)";ctx.lineWidth=1;
    for(let x=0;x<=W;x+=45){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}
    for(let y=0;y<=H;y+=45){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
  }

  function drawPlayer() {
    ctx.save();ctx.translate(player.x,player.y);
    if(player.invuln>0 && Math.floor(player.invuln*12)%2===0) ctx.globalAlpha=.45;
    ctx.beginPath();ctx.moveTo(0,-15);ctx.lineTo(11,11);ctx.lineTo(0,6);ctx.lineTo(-11,11);ctx.closePath();
    ctx.fillStyle="#16B8C4";ctx.fill();ctx.strokeStyle="#B9FBFF";ctx.lineWidth=2;ctx.stroke();
    ctx.beginPath();ctx.arc(0,1,3,0,Math.PI*2);ctx.fillStyle="#fff";ctx.fill();
    ctx.restore();
  }

  function drawEnemy(e) {
    ctx.save();ctx.translate(e.x,e.y);
    if(e.type==="basic"){
      ctx.beginPath();ctx.moveTo(0,15);ctx.lineTo(14,-10);ctx.lineTo(5,-15);ctx.lineTo(-5,-15);ctx.lineTo(-14,-10);ctx.closePath();
      ctx.fillStyle="#EF5B5B";ctx.fill();ctx.strokeStyle="#FFD1D1";ctx.stroke();
    } else if(e.type==="spinner"){
      ctx.rotate(e.age*1.7);ctx.fillStyle="#FFB84D";
      ctx.beginPath();for(let i=0;i<8;i++){const a=i*Math.PI/4,r=i%2?7:17;ctx.lineTo(Math.cos(a)*r,Math.sin(a)*r);}ctx.closePath();ctx.fill();
    } else {
      ctx.fillStyle="#8B7CFF";ctx.fillRect(-20,-20,40,40);
      ctx.fillStyle="#C9C5FF";ctx.fillRect(-10,-10,20,20);
    }
    ctx.restore();
    if(e.type==="tank"){
      ctx.fillStyle="rgba(255,255,255,.25)";ctx.fillRect(e.x-20,e.y-29,40,4);
      ctx.fillStyle="#8B7CFF";ctx.fillRect(e.x-20,e.y-29,40*(e.hp/e.maxHp),4);
    }
  }

  function draw() {
    ctx.save();
    if(shake>0) ctx.translate(rand(-shake*3,shake*3),rand(-shake*3,shake*3));
    drawGrid();
    particles.forEach(p=>{
      ctx.globalAlpha=Math.max(0,p.life/p.maxLife);ctx.fillStyle="#FFB84D";
      ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill();
    });
    ctx.globalAlpha=1;
    playerShots.forEach(s=>{ctx.fillStyle="#E9FEFF";ctx.fillRect(s.x-2,s.y-10,4,12);});
    bullets.forEach(b=>{
      ctx.fillStyle="#FFB84D";ctx.beginPath();ctx.arc(b.x,b.y,b.r,0,Math.PI*2);ctx.fill();
      ctx.fillStyle="rgba(255,255,255,.55)";ctx.beginPath();ctx.arc(b.x-1,b.y-1,Math.max(1,b.r*.35),0,Math.PI*2);ctx.fill();
    });
    enemies.forEach(drawEnemy);
    drawPlayer();
    ctx.restore();
  }

  function loop(now) {
    if(state!=="playing") return;
    const dt=Math.min(.033,(now-lastTime)/1000);lastTime=now;
    update(dt);draw();
    if(state==="playing") animationId=requestAnimationFrame(loop);
  }

  draw();
})();

}
function begin(){poster.hidden=true;gm.hidden=false;if(!booted){booted=true;var s=document.createElement("style");s.textContent=LOOK;document.head.appendChild(s);boot();}else{var r=document.getElementById("startBtn");if(r)r.click();}}
poster.addEventListener("click",begin);
var nb=document.getElementById("new");if(nb)nb.addEventListener("click",begin);
})();
