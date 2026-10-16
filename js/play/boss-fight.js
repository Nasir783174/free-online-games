/* Boss Fight - game logic + its own look. Layout lives in style.css; page shell lives in the HTML. */
(function(){"use strict";
var gm=document.getElementById("gm"),poster=document.getElementById("poster"),booted=false;
var LOOK=".gm *{box-sizing:border-box}.gm{font-family:\"Nunito Sans\",system-ui,sans-serif;color:#171B2D;background:#F6F7FB}.gm .back-link{font-size:15px;font-weight:700;color:#4546B8;text-decoration:none}.gm .page-shell{max-width:1160px;margin:0 auto;padding:28px 24px 72px}.gm h2{font-size:30px;line-height:1.2;margin:0 0 14px;font-weight:700}.gm .info-section p{font-size:17px;line-height:1.65;color:#667085;margin:0}.gm .game-card{background:#fff;border:1px solid #E5E7EF;border-radius:20px;padding:18px;box-shadow:0 12px 30px rgba(23,27,45,.06)}.gm .game-topbar{display:grid;grid-template-columns:130px 1fr 130px;gap:18px;align-items:center;margin-bottom:14px}.gm .stat,.gm .boss-stat{background:#F6F7FB;border:1px solid #E5E7EF;border-radius:12px;padding:10px 13px}.gm .stat span,.gm .boss-stat>span{display:block;color:#667085;font-size:13px;font-weight:700}.gm .stat strong{font-size:23px;line-height:1.2}.gm .boss-stat{text-align:center}.gm .health-track{height:11px;background:#E5E7EF;border-radius:99px;overflow:hidden;margin:7px 0 3px}.gm .health-fill{height:100%;width:100%;background:#EF5B5B;border-radius:inherit;transition:width .12s linear}.gm .boss-stat strong{font-size:13px}.gm .canvas-wrap{position:relative;background:#111827;border-radius:16px;overflow:hidden;width:100%;aspect-ratio:16/9}.gm canvas{display:block;width:100%;height:100%;touch-action:none}.gm .overlay{position:absolute;inset:0;display:grid;place-items:center;background:rgba(17,24,39,.72);padding:20px}.gm .overlay.hidden{display:none}.gm .overlay-panel{width:min(440px,100%);text-align:center;background:#fff;border-radius:18px;padding:28px 26px;box-shadow:0 20px 60px rgba(0,0,0,.25)}.gm .overlay-icon{font-size:38px;margin-bottom:4px}.gm .overlay-panel h2{margin-bottom:8px}.gm .overlay-panel p{color:#667085;font-size:16px;line-height:1.55;margin:0 0 20px}.gm .primary-btn,.gm .secondary-btn,.gm .fire-btn,.gm .dpad button{font-family:inherit;font-weight:800;border:0;cursor:pointer;touch-action:none}.gm .primary-btn{height:48px;padding:0 24px;border-radius:10px;background:#5B5CE2;color:#fff;font-size:16px}.gm .primary-btn:hover{background:#4546B8}.gm .game-controls{display:flex;justify-content:space-between;align-items:center;gap:20px;padding:16px 2px 2px}.gm .control-copy{display:flex;align-items:center;flex-wrap:wrap;gap:10px 16px;color:#667085;font-size:14px}.gm .control-copy strong{color:#171B2D;font-size:15px}.gm kbd{font-family:inherit;background:#F6F7FB;border:1px solid #D9DCE7;border-bottom-width:2px;border-radius:6px;padding:2px 7px;color:#171B2D;font-weight:800}.gm .secondary-btn{height:44px;padding:0 18px;border-radius:10px;background:#fff;border:1px solid #E5E7EF;color:#4546B8;font-size:15px}.gm .secondary-btn:hover{background:#F6F7FB}.gm .touch-controls{display:none;justify-content:center;align-items:center;gap:38px;margin-top:16px}.gm .dpad{display:grid;grid-template-columns:52px 52px 52px;grid-template-rows:52px 52px;gap:6px}.gm .dpad button{background:#1F2937;color:#fff;border-radius:10px;font-size:19px;border:1px solid #374151}.gm .dpad button:first-child{grid-column:2}.gm .dpad button:nth-child(2){grid-column:1;grid-row:2}.gm .dpad button:nth-child(3){grid-column:2;grid-row:2}.gm .dpad button:nth-child(4){grid-column:3;grid-row:2}.gm .fire-btn{width:112px;height:112px;border-radius:50%;background:#FFB84D;color:#171B2D;font-size:17px;border:6px solid #fff;box-shadow:0 5px 0 #D99735}.gm .info-section{background:#fff;border:1px solid #E5E7EF;border-radius:16px;padding:26px}.gm .info-section{margin-top:24px}.gm details{border-top:1px solid #E5E7EF;padding:15px 0}.gm details:first-of-type{border-top:0}.gm summary{cursor:pointer;font-weight:700;font-size:16px}.gm button:focus-visible,.gm summary:focus-visible{outline:3px solid rgba(91,92,226,.35);outline-offset:3px}@media(max-width:760px){.gm .page-shell{padding:22px 14px 52px}.gm .info-section p{font-size:16px}.gm .game-card{padding:12px;border-radius:16px}.gm .game-topbar{grid-template-columns:1fr 1.5fr 1fr;gap:7px}.gm .stat,.gm .boss-stat{padding:8px 7px}.gm .stat strong{font-size:19px}.gm .stat span,.gm .boss-stat>span{font-size:11px}.gm .canvas-wrap{border-radius:12px}.gm .game-controls{align-items:flex-start}.gm .control-copy{gap:7px 10px}.gm .control-copy span:nth-child(4){width:100%}.gm .touch-controls{display:flex}.gm .info-section{padding:21px}.gm h2{font-size:26px}}@media(max-width:430px){.gm .back-link{font-size:13px}.gm .game-controls{display:block}.gm .secondary-btn{margin-top:12px;width:100%}.gm .touch-controls{gap:20px}.gm .dpad{grid-template-columns:48px 48px 48px;grid-template-rows:48px 48px}.gm .fire-btn{width:100px;height:100px}}";
function __ready(f){f()}
function boot(){
(() => {
  "use strict";

  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");
  const overlay = document.getElementById("overlay");
  const overlayTitle = document.getElementById("overlayTitle");
  const overlayText = document.getElementById("overlayText");
  const overlayIcon = document.getElementById("overlayIcon");
  const startBtn = document.getElementById("startBtn");
  const restartBtn = document.getElementById("restartBtn");
  const scoreEl = document.getElementById("score");
  const bestEl = document.getElementById("best");
  const bossHealthEl = document.getElementById("bossHealth");
  const bossHealthText = document.getElementById("bossHealthText");
  const fireBtn = document.getElementById("fireBtn");

  const W = canvas.width, H = canvas.height;
  const keys = Object.create(null);
  const touch = { up:false, down:false, left:false, right:false, fire:false };

  let state = "ready";
  let last = 0;
  let elapsed = 0;
  let score = 0;
  let best = Number(localStorage.getItem("bossFightBest") || 0);
  let player, boss, bullets, enemyBullets, particles, stars, spawnTimer, shotTimer, hitFlash;

  bestEl.textContent = best;

  function resetGame() {
    player = { x:130, y:H/2, r:17, speed:270, hp:3, inv:0 };
    boss = { x:W-155, y:H/2, r:62, hp:100, maxHp:100, phase:0, attackTimer:1.0 };
    bullets = [];
    enemyBullets = [];
    particles = [];
    stars = Array.from({length:70}, () => ({x:Math.random()*W,y:Math.random()*H,s:Math.random()*2+0.4,a:Math.random()*.7+.2}));
    spawnTimer = 0;
    shotTimer = 0;
    hitFlash = 0;
    elapsed = 0;
    score = 0;
    updateUI();
  }

  function startGame() {
    resetGame();
    state = "playing";
    overlay.classList.add("hidden");
    last = performance.now();
    requestAnimationFrame(loop);
  }

  function endGame(won) {
    state = won ? "won" : "lost";
    const timeBonus = won ? Math.max(0, Math.floor(600 - elapsed * 12)) : 0;
    score += won ? 1000 + timeBonus + player.hp * 250 : 0;
    if (score > best) {
      best = score;
      localStorage.setItem("bossFightBest", String(best));
    }
    updateUI();
    overlayIcon.textContent = won ? "🏆" : "💥";
    overlayTitle.textContent = won ? "Boss Defeated!" : "Battle Over";
    overlayText.textContent = won
      ? `Final score: ${score}. You defeated the boss in ${elapsed.toFixed(1)} seconds.`
      : `Final score: ${score}. The boss still had ${Math.ceil(boss.hp)}% health.`;
    startBtn.textContent = "Play Again";
    overlay.classList.remove("hidden");
    draw();
  }

  function updateUI() {
    scoreEl.textContent = score;
    bestEl.textContent = best;
    const hp = Math.max(0, boss ? boss.hp : 100);
    bossHealthEl.style.width = hp + "%";
    bossHealthText.textContent = Math.ceil(hp) + "%";
  }

  function fire() {
    if (state !== "playing" || shotTimer > 0) return;
    const dx = boss.x - player.x, dy = boss.y - player.y;
    const len = Math.hypot(dx, dy) || 1;
    bullets.push({x:player.x+dx/len*20,y:player.y+dy/len*20,vx:dx/len*520,vy:dy/len*520,r:5});
    shotTimer = .16;
  }

  function enemyFire() {
    const count = boss.hp < 50 ? 5 : 3;
    const base = Math.atan2(player.y-boss.y, player.x-boss.x);
    const spread = boss.hp < 50 ? 0.72 : 0.5;
    for (let i=0;i<count;i++) {
      const t = count === 1 ? 0 : i/(count-1)-0.5;
      const a = base + t*spread;
      const speed = 180 + (100-boss.hp)*1.05;
      enemyBullets.push({x:boss.x,y:boss.y,vx:Math.cos(a)*speed,vy:Math.sin(a)*speed,r:8});
    }
    boss.attackTimer = Math.max(.42, 1.05 - (100-boss.hp)*.005);
  }

  function addParticles(x,y,n,life=0.5) {
    for(let i=0;i<n;i++){
      const a=Math.random()*Math.PI*2, s=Math.random()*170+40;
      particles.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,life,max:life,r:Math.random()*3+1});
    }
  }

  function update(dt) {
    elapsed += dt;
    shotTimer = Math.max(0, shotTimer-dt);
    hitFlash = Math.max(0, hitFlash-dt);
    player.inv = Math.max(0, player.inv-dt);

    let dx=(keys.ArrowRight||keys.d||touch.right?1:0)-(keys.ArrowLeft||keys.a||touch.left?1:0);
    let dy=(keys.ArrowDown||keys.s||touch.down?1:0)-(keys.ArrowUp||keys.w||touch.up?1:0);
    const len=Math.hypot(dx,dy)||1;
    if(dx||dy){player.x += dx/len*player.speed*dt; player.y += dy/len*player.speed*dt;}
    player.x=Math.max(28,Math.min(W-28,player.x));
    player.y=Math.max(28,Math.min(H-28,player.y));

    if(keys[" "]||keys.j||touch.fire) fire();

    boss.phase += dt;
    boss.y = H/2 + Math.sin(boss.phase*1.25)*150;
    boss.x = W-150 + Math.cos(boss.phase*.7)*18;
    boss.attackTimer -= dt;
    if(boss.attackTimer<=0) enemyFire();

    for(const b of bullets){b.x+=b.vx*dt;b.y+=b.vy*dt;}
    bullets=bullets.filter(b=>b.x>-20&&b.x<W+20&&b.y>-20&&b.y<H+20);

    for(const b of enemyBullets){b.x+=b.vx*dt;b.y+=b.vy*dt;}
    enemyBullets=enemyBullets.filter(b=>b.x>-30&&b.x<W+30&&b.y>-30&&b.y<H+30);

    for(let i=bullets.length-1;i>=0;i--){
      const b=bullets[i];
      if(Math.hypot(b.x-boss.x,b.y-boss.y)<b.r+boss.r){
        bullets.splice(i,1);
        boss.hp=Math.max(0,boss.hp-2);
        score+=10;
        addParticles(b.x,b.y,5,.25);
        if(boss.hp<=0){ addParticles(boss.x,boss.y,60,1); endGame(true); return; }
      }
    }

    for(let i=enemyBullets.length-1;i>=0;i--){
      const b=enemyBullets[i];
      if(Math.hypot(b.x-player.x,b.y-player.y)<b.r+player.r){
        enemyBullets.splice(i,1);
        if(player.inv<=0){
          player.hp--;
          player.inv=1.1;
          hitFlash=.18;
          addParticles(player.x,player.y,14,.45);
          if(player.hp<=0){ endGame(false); return; }
        }
      }
    }

    for(let i=particles.length-1;i>=0;i--){
      const p=particles[i]; p.x+=p.vx*dt;p.y+=p.vy*dt;p.vx*=.97;p.vy*=.97;p.life-=dt;
      if(p.life<=0) particles.splice(i,1);
    }
    updateUI();
  }

  function draw() {
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle="#111827";ctx.fillRect(0,0,W,H);

    for(const s of stars){
      ctx.globalAlpha=s.a;
      ctx.fillStyle="#94A3B8";ctx.fillRect(s.x,s.y,s.s,s.s);
    }
    ctx.globalAlpha=1;

    ctx.strokeStyle="rgba(148,163,184,.10)";ctx.lineWidth=1;
    for(let x=40;x<W;x+=40){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}
    for(let y=40;y<H;y+=40){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}

    // Arena boundary
    ctx.strokeStyle="#374151";ctx.lineWidth=3;ctx.strokeRect(18,18,W-36,H-36);

    // Boss
    const pulse=1+Math.sin(boss.phase*5)*.035;
    ctx.save();ctx.translate(boss.x,boss.y);ctx.scale(pulse,pulse);
    ctx.fillStyle="rgba(239,91,91,.16)";ctx.beginPath();ctx.arc(0,0,boss.r+18,0,Math.PI*2);ctx.fill();
    ctx.fillStyle="#EF5B5B";ctx.beginPath();ctx.arc(0,0,boss.r,0,Math.PI*2);ctx.fill();
    ctx.fillStyle="#7F1D1D";ctx.beginPath();ctx.arc(0,0,boss.r*.7,0,Math.PI*2);ctx.fill();
    ctx.fillStyle="#fff";ctx.beginPath();ctx.arc(-21,-12,9,0,Math.PI*2);ctx.arc(21,-12,9,0,Math.PI*2);ctx.fill();
    ctx.fillStyle="#171B2D";ctx.beginPath();ctx.arc(-21,-12,4,0,Math.PI*2);ctx.arc(21,-12,4,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle="#fff";ctx.lineWidth=5;ctx.beginPath();ctx.arc(0,9,27,.15,Math.PI-.15);ctx.stroke();
    ctx.restore();

    // Projectiles
    for(const b of enemyBullets){
      ctx.fillStyle="#FFB84D";ctx.beginPath();ctx.arc(b.x,b.y,b.r,0,Math.PI*2);ctx.fill();
      ctx.fillStyle="rgba(255,184,77,.18)";ctx.beginPath();ctx.arc(b.x,b.y,b.r+8,0,Math.PI*2);ctx.fill();
    }
    for(const b of bullets){
      ctx.fillStyle="#16B8C4";ctx.beginPath();ctx.arc(b.x,b.y,b.r,0,Math.PI*2);ctx.fill();
    }

    // Player
    if(player.inv===0 || Math.floor(player.inv*12)%2===0){
      ctx.save();ctx.translate(player.x,player.y);
      ctx.fillStyle="#5B5CE2";ctx.beginPath();ctx.arc(0,0,player.r,0,Math.PI*2);ctx.fill();
      ctx.fillStyle="#fff";ctx.beginPath();ctx.arc(5,-5,4,0,Math.PI*2);ctx.fill();
      ctx.strokeStyle="#16B8C4";ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(0,18);ctx.lineTo(0,27);ctx.stroke();
      ctx.restore();
    }

    // Player lives
    ctx.font="800 17px 'Nunito Sans', sans-serif";ctx.fillStyle="#fff";ctx.fillText("Lives: "+player.hp,32,45);

    for(const p of particles){
      ctx.globalAlpha=Math.max(0,p.life/p.max);ctx.fillStyle="#FFE658";ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill();
    }
    ctx.globalAlpha=1;
    if(hitFlash>0){ctx.fillStyle="rgba(239,91,91,.2)";ctx.fillRect(0,0,W,H);}
  }

  function loop(now){
    if(state!=="playing") return;
    const dt=Math.min(.033,(now-last)/1000); last=now;
    update(dt); draw();
    if(state==="playing") requestAnimationFrame(loop);
  }

  window.addEventListener("keydown",e=>{
    if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"," ","w","a","s","d","j"].includes(e.key)) e.preventDefault();
    keys[e.key]=true;
    if(state==="ready" && e.key==="Enter") startGame();
  });
  window.addEventListener("keyup",e=>{keys[e.key]=false;});

  document.querySelectorAll("[data-key]").forEach(btn=>{
    const k=btn.dataset.key;
    const on=ev=>{ev.preventDefault();touch[k]=true;};
    const off=ev=>{ev.preventDefault();touch[k]=false;};
    btn.addEventListener("pointerdown",on);
    btn.addEventListener("pointerup",off);
    btn.addEventListener("pointercancel",off);
    btn.addEventListener("pointerleave",off);
  });
  ["pointerdown","touchstart"].forEach(ev=>fireBtn.addEventListener(ev,e=>{e.preventDefault();touch.fire=true;}));
  ["pointerup","pointercancel","pointerleave","touchend"].forEach(ev=>fireBtn.addEventListener(ev,e=>{e.preventDefault();touch.fire=false;}));

  startBtn.addEventListener("click",startGame);
  restartBtn.addEventListener("click",startGame);

  resetGame();
  draw();
})();


}
function begin(){poster.hidden=true;gm.hidden=false;if(!booted){booted=true;var s=document.createElement("style");s.textContent=LOOK;document.head.appendChild(s);boot();}else{var r=document.getElementById("startBtn");if(r)r.click();}}
poster.addEventListener("click",begin);
var nb=document.getElementById("new");if(nb)nb.addEventListener("click",begin);
})();
