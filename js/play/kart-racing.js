/* Kart Racing - game logic + its own look. Layout lives in style.css; page shell lives in the HTML. */
(function(){"use strict";
var gm=document.getElementById("gm"),poster=document.getElementById("poster"),booted=false;
var LOOK=".gm{\n  --cyan:#16B8C4;--orange:#FFB84D;\n  --green:#22C55E;--danger:#EF5B5B;\n  --game:#111827;\n}.gm *{box-sizing:border-box}.gm button{font:inherit}.gm .page{width:min(1160px,calc(100% - 32px));margin:auto}.gm h2{font-size:32px;line-height:1.15;margin:0 0 15px;font-weight:800}.gm h3{font-size:21px;line-height:1.2;margin:0 0 8px}.gm .lead{max-width:760px;color:var(--muted);margin:0;font-size:18px}.gm .game-card{background:var(--game);border-radius:20px;overflow:hidden;box-shadow:0 14px 35px rgba(17,24,39,.12)}.gm .game-topbar{display:grid;grid-template-columns:repeat(5,1fr);background:#1F2937;border-bottom:1px solid #374151}.gm .stat{padding:14px 16px;border-right:1px solid #374151}.gm .stat:last-child{border-right:0}.gm .stat span{display:block;color:#AEB6C5;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.07em}.gm .stat strong{display:block;color:#fff;font-size:22px;line-height:1.25}.gm .canvas-wrap{position:relative;background:#111827}.gm canvas{display:block;width:100%;height:auto;max-height:70vh;touch-action:none}.gm .countdown{position:absolute;inset:0;display:grid;place-items:center;color:#fff;font-size:76px;font-weight:800;text-shadow:0 4px 18px rgba(0,0,0,.45);pointer-events:none}.gm .game-message{position:absolute;inset:0;background:rgba(17,24,39,.72);display:grid;place-items:center;padding:20px}.gm .game-message.hidden{display:none}.gm .message-box{width:min(420px,100%);background:#fff;border-radius:18px;padding:28px;text-align:center;box-shadow:0 20px 50px rgba(0,0,0,.25)}.gm .message-box h2{margin-bottom:8px}.gm .message-box p:not(.eyebrow){color:var(--muted);margin:0 0 20px}.gm .primary-btn,.gm .secondary-btn,.gm .touch-btn{border:0;cursor:pointer;font-weight:800;transition:transform .12s ease,background .12s ease}.gm .primary-btn{height:48px;padding:0 22px;background:var(--brand);color:#fff;border-radius:12px}.gm .primary-btn:hover{background:var(--brand-dark)}.gm .secondary-btn{height:46px;padding:0 18px;background:#fff;color:var(--text);border-radius:11px}.gm .secondary-btn:hover{background:#F0F1F8}.gm .primary-btn:active,.gm .secondary-btn:active,.gm .touch-btn:active{transform:scale(.97)}.gm button:focus-visible{outline:3px solid var(--cyan);outline-offset:2px}.gm .controls-row{display:flex;justify-content:space-between;align-items:center;gap:20px;padding:15px 18px;background:#1F2937}.gm .control-copy{display:flex;align-items:center;flex-wrap:wrap;gap:8px 16px;color:#B9C1CF;font-size:14px}.gm .control-copy strong{color:#fff}.gm .touch-controls{display:none;grid-template-columns:repeat(4,1fr);gap:10px;padding:12px;background:#111827}.gm .touch-btn{height:52px;border-radius:12px;background:#374151;color:#fff;font-size:23px;touch-action:none;user-select:none}.gm .touch-boost{background:#4546B8}.gm .tips-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;margin-top:22px}.gm .tips-grid article{background:#fff;border:1px solid var(--border);border-radius:16px;padding:20px}.gm .tips-grid p{color:var(--muted);margin:0;font-size:16px}.gm .tips-list{color:var(--muted);padding-left:22px;margin:0}@media(max-width:760px){.gm .page{width:min(100% - 20px,1160px)}.gm .game-topbar{grid-template-columns:repeat(3,1fr)}.gm .stat:nth-child(3){border-right:0}.gm .stat{padding:11px 12px}.gm .stat strong{font-size:18px}.gm .stat span{font-size:10px}.gm .timer-stat{grid-column:span 2}.gm .controls-row{padding:12px}.gm .control-copy{font-size:12px;gap:3px 9px}.gm .control-copy span:nth-last-child(-n+2){display:none}.gm .secondary-btn{height:42px;padding:0 13px;font-size:14px}.gm .touch-controls{display:grid}.gm .tips-grid{grid-template-columns:1fr}.gm h2{font-size:28px}}@media(max-width:440px){.gm .lead{font-size:16px}.gm .game-topbar{grid-template-columns:repeat(2,1fr)}.gm .stat:nth-child(2){border-right:0}.gm .stat:nth-child(3){border-right:1px solid #374151}.gm .timer-stat{grid-column:auto}.gm .controls-row{align-items:flex-start}.gm .control-copy strong{width:100%}.gm .secondary-btn{margin-top:2px}}";
function __ready(f){f()}
function boot(){
(() => {
  "use strict";

  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");
  const lapEl = document.getElementById("lap");
  const positionEl = document.getElementById("position");
  const speedEl = document.getElementById("speed");
  const coinsEl = document.getElementById("coins");
  const timerEl = document.getElementById("timer");
  const countdownEl = document.getElementById("countdown");
  const messageEl = document.getElementById("gameMessage");
  const messageTitle = document.getElementById("messageTitle");
  const messageText = document.getElementById("messageText");
  const messageEyebrow = document.getElementById("messageEyebrow");
  const restartBtn = document.getElementById("restartBtn");
  const newRaceBtn = document.getElementById("newRaceBtn");

  const W = canvas.width, H = canvas.height;
  const CX = 500, CY = 310;
  const RX = 355, RY = 205;
  const INNER_RX = 210, INNER_RY = 100;
  const ROAD_WIDTH = 105;
  const TOTAL_LAPS = 3;
  const keys = {left:false,right:false,accelerate:false,brake:false,drift:false};

  let player, coins, opponents, particles, race, lastTime = 0, raf = 0;

  function clamp(v,a,b){ return Math.max(a,Math.min(b,v)); }
  function wrapAngle(a){ while(a > Math.PI) a -= Math.PI*2; while(a < -Math.PI) a += Math.PI*2; return a; }
  function formatTime(ms){
    const total = Math.max(0,ms);
    const m = Math.floor(total/60000);
    const s = Math.floor(total/1000)%60;
    const d = Math.floor(total/100)%10;
    return String(m).padStart(2,"0")+":"+String(s).padStart(2,"0")+"."+d;
  }
  function trackPoint(t, lane=0){
    return {x:CX+(RX-lane)*Math.cos(t), y:CY+(RY-lane*.58)*Math.sin(t)};
  }
  function progressAt(x,y){
    let t = Math.atan2((y-CY)/RY,(x-CX)/RX);
    if(t < 0) t += Math.PI*2;
    return t/(Math.PI*2);
  }
  function roadCheck(x,y){
    const outer = ((x-CX)/RX)**2 + ((y-CY)/RY)**2;
    const inner = ((x-CX)/INNER_RX)**2 + ((y-CY)/INNER_RY)**2;
    return outer <= 1.03 && inner >= 1;
  }
  function resetGame(){
    cancelAnimationFrame(raf);
    player = {x:CX+RX,y:CY,angle:Math.PI/2,speed:0,lap:1,progress:0,lastProgress:0,coins:0,score:0,offroad:0,crashes:0};
    coins = [];
    opponents = [];
    particles = [];
    for(let i=0;i<12;i++){
      const t = .35 + i*(Math.PI*2/12);
      const p = trackPoint(t, 6);
      coins.push({x:p.x,y:p.y,got:false,bob:i*.5});
    }
    const colors = ["#FFB84D","#16B8C4","#EF5B5B"];
    for(let i=0;i<3;i++){
      const t = .14 + i*.11;
      const p = trackPoint(t, 15);
      opponents.push({x:p.x,y:p.y,angle:t+Math.PI/2,speed:2.0+i*.12,progress:t/(Math.PI*2),lap:1,color:colors[i]});
    }
    race = {state:"countdown",start:0,elapsed:0,count:3,lastLapProgress:0};
    countdownEl.textContent = "3";
    messageEl.classList.add("hidden");
    updateHud();
    setTimeout(()=>{ countdownEl.textContent="2"; },700);
    setTimeout(()=>{ countdownEl.textContent="1"; },1400);
    setTimeout(()=>{ countdownEl.textContent="GO!"; race.state="running"; race.start=performance.now(); },2100);
    setTimeout(()=>{ countdownEl.textContent=""; },2700);
    lastTime = performance.now();
    raf = requestAnimationFrame(loop);
  }

  function updateHud(){
    lapEl.textContent = `${Math.min(player.lap,TOTAL_LAPS)} / ${TOTAL_LAPS}`;
    positionEl.textContent = getPosition();
    speedEl.textContent = `${Math.round(Math.abs(player.speed)*46)} km/h`;
    coinsEl.textContent = player.coins;
    timerEl.textContent = formatTime(race.elapsed);
  }

  function getPosition(){
    const playerTotal = (player.lap-1)+player.progress;
    const ahead = opponents.filter(o => (o.lap-1)+o.progress > playerTotal).length;
    return `${ahead+1}${ahead===0?"st":ahead===1?"nd":ahead===2?"rd":"th"}`;
  }

  function update(dt, now){
    if(race.state !== "running") return;
    race.elapsed = now-race.start;

    const accel = keys.accelerate ? .00015 : 0;
    const brake = keys.brake ? .00024 : 0;
    player.speed += accel*dt;
    player.speed -= brake*dt;
    player.speed -= .000055*dt;
    if(keys.drift) player.speed -= .000018*dt;
    player.speed = clamp(player.speed,0,0.105);

    const turnPower = (0.00095 + player.speed*.011) * dt;
    if(keys.left) player.angle -= turnPower*(keys.drift?1.25:1);
    if(keys.right) player.angle += turnPower*(keys.drift?1.25:1);

    player.x += Math.cos(player.angle-Math.PI/2)*player.speed*dt;
    player.y += Math.sin(player.angle-Math.PI/2)*player.speed*dt;

    if(!roadCheck(player.x,player.y)){
      player.offroad += dt;
      player.speed *= Math.pow(.992,dt/16);
    } else {
      player.offroad = Math.max(0,player.offroad-dt);
    }

    if(player.offroad > 650){
      const p=trackPoint(player.progress*Math.PI*2,0);
      player.x += (p.x-player.x)*.025;
      player.y += (p.y-player.y)*.025;
    }

    const newProgress = progressAt(player.x,player.y);
    if(player.lastProgress > .82 && newProgress < .18 && player.speed > .012){
      player.lap++;
      if(player.lap > TOTAL_LAPS){
        finishRace();
        return;
      }
    }
    player.progress = newProgress;
    player.lastProgress = newProgress;

    for(const c of coins){
      c.bob += dt*.004;
      if(!c.got && Math.hypot(player.x-c.x,player.y-c.y)<25){
        c.got=true; player.coins++;
        for(let i=0;i<7;i++) particles.push({x:c.x,y:c.y,life:1,vx:(Math.random()-.5)*.12,vy:(Math.random()-.5)*.12});
      }
    }

    for(const o of opponents){
      const old=o.progress;
      o.progress += o.speed*dt/3000;
      if(o.progress>=1){o.progress-=1;o.lap++;}
      const p=trackPoint(o.progress*Math.PI*2,15);
      o.x=p.x;o.y=p.y;o.angle=o.progress*Math.PI*2+Math.PI/2;
      if(Math.hypot(player.x-o.x,player.y-o.y)<31 && player.speed>.025){
        player.speed*=.45; player.crashes++;
        player.x -= Math.cos(player.angle-Math.PI/2)*12;
        player.y -= Math.sin(player.angle-Math.PI/2)*12;
      }
    }

    player.score = Math.max(0, Math.round(10000 - race.elapsed/10 + player.coins*250 - player.crashes*180));
    particles.forEach(p=>{p.x+=p.vx*dt;p.y+=p.vy*dt;p.life-=dt*.002});
    particles=particles.filter(p=>p.life>0);
    updateHud();
  }

  function finishRace(){
    race.state="finished";
    const bonus = Math.max(0,10000-Math.floor(race.elapsed/10));
    player.score = bonus + player.coins*250 - player.crashes*180;
    if(player.score<0) player.score=0;
    messageEyebrow.textContent="RACE COMPLETE";
    messageTitle.textContent="You finished!";
    messageText.textContent=`Time ${formatTime(race.elapsed)} · ${player.coins} coins · Score ${player.score.toLocaleString()}`;
    messageEl.classList.remove("hidden");
    updateHud();
  }

  function drawTrack(){
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle="#6D9C55";ctx.fillRect(0,0,W,H);
    // subtle grass stripes
    ctx.globalAlpha=.12;
    for(let y=0;y<H;y+=24){ctx.fillStyle=y%48===0?"#fff":"#172";ctx.fillRect(0,y,W,12);}
    ctx.globalAlpha=1;

    ctx.save();
    ctx.translate(CX,CY);
    ctx.scale(RX,RY);
    ctx.beginPath();ctx.arc(0,0,1,0,Math.PI*2);ctx.fillStyle="#D8DADF";ctx.fill();
    ctx.restore();

    ctx.save();ctx.translate(CX,CY);ctx.scale(INNER_RX,INNER_RY);
    ctx.beginPath();ctx.arc(0,0,1,0,Math.PI*2);ctx.fillStyle="#6D9C55";ctx.fill();
    ctx.restore();

    // curbs
    ctx.save();ctx.translate(CX,CY);ctx.scale(RX+8,RY+8);
    ctx.beginPath();ctx.arc(0,0,1,0,Math.PI*2);ctx.strokeStyle="#EF5B5B";ctx.lineWidth=.028;ctx.setLineDash([.07,.07]);ctx.stroke();ctx.restore();
    ctx.save();ctx.translate(CX,CY);ctx.scale(INNER_RX-4,INNER_RY-4);
    ctx.beginPath();ctx.arc(0,0,1,0,Math.PI*2);ctx.strokeStyle="#EF5B5B";ctx.lineWidth=.055;ctx.setLineDash([.11,.08]);ctx.stroke();ctx.restore();

    // lane markings
    ctx.save();ctx.translate(CX,CY);ctx.scale((RX+INNER_RX)/2,(RY+INNER_RY)/2);
    ctx.beginPath();ctx.arc(0,0,1,0,Math.PI*2);ctx.strokeStyle="rgba(255,255,255,.75)";ctx.lineWidth=.008;ctx.setLineDash([.05,.045]);ctx.stroke();ctx.restore();

    // start/finish line
    const x=CX+RX, y=CY;
    for(let i=0;i<7;i++){
      ctx.fillStyle=i%2?"#111827":"#fff";
      ctx.fillRect(x-8+i*10,y-18,10,36);
    }
  }

  function drawCoin(c){
    if(c.got)return;
    ctx.save();ctx.translate(c.x,c.y+Math.sin(c.bob)*3);
    ctx.beginPath();ctx.arc(0,0,9,0,Math.PI*2);ctx.fillStyle="#FFB84D";ctx.fill();
    ctx.lineWidth=3;ctx.strokeStyle="#FFF1C7";ctx.stroke();
    ctx.fillStyle="#8A5A00";ctx.font="800 10px Nunito Sans";ctx.textAlign="center";ctx.textBaseline="middle";ctx.fillText("$",0,1);
    ctx.restore();
  }

  function drawKart(k,color,isPlayer=false){
    ctx.save();ctx.translate(k.x,k.y);ctx.rotate(k.angle);
    // shadow
    ctx.fillStyle="rgba(0,0,0,.25)";ctx.beginPath();ctx.ellipse(0,9,16,8,0,0,Math.PI*2);ctx.fill();
    // wheels
    ctx.fillStyle="#171B2D";ctx.fillRect(-14,-11,7,8);ctx.fillRect(7,-11,7,8);ctx.fillRect(-14,5,7,8);ctx.fillRect(7,5,7,8);
    // body
    ctx.fillStyle=color;ctx.beginPath();ctx.roundRect(-12,-15,24,30,7);ctx.fill();
    ctx.fillStyle="#fff";ctx.beginPath();ctx.roundRect(-7,-7,14,10,4);ctx.fill();
    ctx.fillStyle="#263244";ctx.beginPath();ctx.roundRect(-5,-5,10,6,3);ctx.fill();
    ctx.fillStyle="#111827";ctx.fillRect(-16,-2,4,8);ctx.fillRect(12,-2,4,8);
    if(isPlayer){ctx.strokeStyle="#fff";ctx.lineWidth=2;ctx.stroke();}
    ctx.restore();
  }

  function drawParticles(){
    particles.forEach(p=>{ctx.globalAlpha=p.life;ctx.fillStyle="#FFB84D";ctx.beginPath();ctx.arc(p.x,p.y,3,0,Math.PI*2);ctx.fill();});
    ctx.globalAlpha=1;
  }

  function draw(){
    drawTrack();
    coins.forEach(drawCoin);
    opponents.forEach(o=>drawKart(o,o.color));
    drawKart(player,"#5B5CE2",true);
    drawParticles();
  }

  function loop(now){
    const dt=Math.min(34,now-lastTime);lastTime=now;
    update(dt,now);draw();
    raf=requestAnimationFrame(loop);
  }

  function setKey(name,val){ keys[name]=val; }
  window.addEventListener("keydown",e=>{
    const k=e.key.toLowerCase();
    if(["arrowleft","arrowright","arrowup","arrowdown"," ","w","a","s","d"].includes(k)) e.preventDefault();
    if(k==="arrowleft"||k==="a")setKey("left",true);
    if(k==="arrowright"||k==="d")setKey("right",true);
    if(k==="arrowup"||k==="w")setKey("accelerate",true);
    if(k==="arrowdown"||k==="s")setKey("brake",true);
    if(k===" ")setKey("drift",true);
    if(k==="r")resetGame();
  });
  window.addEventListener("keyup",e=>{
    const k=e.key.toLowerCase();
    if(k==="arrowleft"||k==="a")setKey("left",false);
    if(k==="arrowright"||k==="d")setKey("right",false);
    if(k==="arrowup"||k==="w")setKey("accelerate",false);
    if(k==="arrowdown"||k==="s")setKey("brake",false);
    if(k===" ")setKey("drift",false);
  });

  document.querySelectorAll(".touch-btn").forEach(btn=>{
    const control=btn.dataset.control;
    const on=ev=>{ev.preventDefault();setKey(control,true)};
    const off=ev=>{ev.preventDefault();setKey(control,false)};
    btn.addEventListener("pointerdown",on);
    btn.addEventListener("pointerup",off);
    btn.addEventListener("pointercancel",off);
    btn.addEventListener("pointerleave",off);
  });

  restartBtn.addEventListener("click",resetGame);
  newRaceBtn.addEventListener("click",resetGame);
  resetGame();
})();


}
function begin(){poster.hidden=true;gm.hidden=false;if(!booted){booted=true;var s=document.createElement("style");s.textContent=LOOK;document.head.appendChild(s);boot();}else{var r=document.getElementById("restartBtn");if(r)r.click();}}
poster.addEventListener("click",begin);
var nb=document.getElementById("new");if(nb)nb.addEventListener("click",begin);
})();
