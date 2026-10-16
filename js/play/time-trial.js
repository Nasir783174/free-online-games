/* Time Trial - game logic + its own look. Layout lives in style.css; page shell lives in the HTML. */
(function(){"use strict";
var gm=document.getElementById("gm"),poster=document.getElementById("poster"),booted=false;
var LOOK=".gm *{box-sizing:border-box}.gm{font-family:\"Nunito Sans\",system-ui,sans-serif;color:#171B2D;background:#F6F7FB}.gm button{font:inherit}.gm button{cursor:pointer}.gm .page{max-width:1180px;margin:auto;padding:28px 20px 70px}.gm .best-card{min-width:160px;background:#fff;border:1px solid #E5E7EF;border-radius:16px;padding:14px 18px;box-shadow:0 5px 18px rgba(23,27,45,.05)}.gm .best-card span{display:block;color:#667085;font-size:13px;font-weight:700}.gm .best-card strong{font-size:25px}.gm .game-shell{background:#111827;border-radius:20px;overflow:hidden;box-shadow:0 12px 35px rgba(17,24,39,.18)}.gm .hud{display:grid;grid-template-columns:repeat(4,1fr);background:#1F2937;border-bottom:1px solid #374151}.gm .hud-item{padding:14px 18px;border-right:1px solid #374151}.gm .hud-item:last-child{border-right:0}.gm .hud-item span{display:block;color:#9CA3AF;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.06em}.gm .hud-item strong{display:block;color:#fff;font-size:23px;margin-top:2px}.gm .canvas-wrap{position:relative;width:100%;background:#111827}.gm canvas{display:block;width:100%;height:auto;touch-action:none}.gm .state-panel{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;padding:24px;background:rgba(17,24,39,.76);color:#fff}.gm .state-panel.hidden{display:none}.gm .panel-icon{font-size:42px;margin-bottom:8px}.gm .state-panel h2{font-size:32px;margin:0 0 7px}.gm .state-panel p{max-width:480px;color:#D1D5DB;margin:0 0 18px;line-height:1.55}.gm .primary-btn,.gm .secondary-btn{border:0;border-radius:11px;min-height:46px;padding:0 22px;font-weight:800}.gm .primary-btn{background:#FFB84D;color:#171B2D}.gm .primary-btn:hover{filter:brightness(.96)}.gm .game-actions{min-height:66px;padding:10px 16px;display:flex;align-items:center;justify-content:space-between;gap:16px}.gm .secondary-btn{background:#fff;color:#171B2D}.gm .control-note{color:#9CA3AF;font-size:14px}.gm .key{display:inline-grid;place-items:center;min-width:26px;height:26px;margin:0 2px;padding:0 5px;border:1px solid #4B5563;border-radius:6px;color:#E5E7EB;font-weight:800}.gm .touch-controls{display:none;grid-template-columns:repeat(3,1fr);grid-template-areas:\". up .\" \"left brake right\";gap:8px;padding:12px 20px 20px}.gm .touch-btn{height:58px;border:1px solid #4B5563;border-radius:12px;background:#1F2937;color:#fff;font-size:22px;font-weight:800;touch-action:none;user-select:none}.gm .touch-btn:active{background:#374151;transform:scale(.98)}.gm .up{grid-area:up}.gm .left{grid-area:left}.gm .brake{grid-area:brake}.gm .right{grid-area:right}.gm .control-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:12px}.gm .control-grid div{display:flex;justify-content:space-between;gap:16px;padding:17px 18px;background:#fff;border:1px solid #E5E7EF;border-radius:14px}.gm .control-grid span{color:#667085}@media(max-width:760px){.gm .page{padding:20px 14px 50px}.gm .best-card{min-width:0}.gm .hud-item{padding:11px 10px}.gm .hud-item strong{font-size:18px}.gm .hud-item span{font-size:10px}.gm .game-actions{align-items:stretch;flex-direction:column}.gm .control-note{text-align:center}.gm .touch-controls{display:grid}.gm .control-grid{grid-template-columns:1fr}}@media(max-width:430px){.gm .hud-item{padding:10px 7px}.gm .hud-item strong{font-size:16px}.gm .state-panel h2{font-size:27px}.gm .state-panel p{font-size:14px}}";
function __ready(f){f()}
function boot(){
(() => {
  "use strict";

  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");
  const statePanel = document.getElementById("statePanel");
  const panelTitle = document.getElementById("panelTitle");
  const panelText = document.getElementById("panelText");
  const startBtn = document.getElementById("startBtn");
  const restartBtn = document.getElementById("restartBtn");
  const timeValue = document.getElementById("timeValue");
  const lapValue = document.getElementById("lapValue");
  const checkpointValue = document.getElementById("checkpointValue");
  const scoreValue = document.getElementById("scoreValue");
  const bestTimeEl = document.getElementById("bestTime");

  const W = 900, H = 520;
  const TRACK_W = 112;
  const TOTAL_LAPS = 3;
  const CHECKPOINTS_PER_LAP = 8;
  const START_TIME = 30;

  const outer = [
    [110,120],[190,70],[340,48],[500,70],[680,64],[790,130],
    [825,245],[790,365],[690,435],[535,465],[365,458],[205,430],
    [100,350],[70,245]
  ];
  const inner = [
    [225,180],[285,135],[395,125],[495,142],[625,135],[695,185],
    [705,245],[675,310],[610,350],[510,370],[390,360],[285,340],
    [205,295],[190,240]
  ];
  const center = outer.map((p,i)=>[(p[0]+inner[i][0])/2,(p[1]+inner[i][1])/2]);

  const checkpoints = [
    {x:690,y:110},{x:790,y:205},{x:735,y:345},{x:620,y:420},
    {x:430,y:410},{x:240,y:390},{x:120,y:300},{x:105,y:185}
  ];

  const keys = {up:false,down:false,left:false,right:false};
  let running = false, finished = false, last = 0, raf = 0;
  let timeLeft = START_TIME, score = 0, lap = 1, checkpoint = 0;
  let car = {x:center[0][0], y:center[0][1], angle:0, speed:0};
  let particles = [];
  let bestTime = Number(localStorage.getItem("timeTrialBest") || 0);

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = W*dpr; canvas.height = H*dpr;
    canvas.style.aspectRatio = `${W}/${H}`;
    ctx.setTransform(dpr,0,0,dpr,0,0);
    draw();
  }
  window.addEventListener("resize", resize);

  function fmtTime(t) {
    if (!t) return "--:---";
    const sec = Math.floor(t);
    const ms = Math.floor((t-sec)*1000).toString().padStart(3,"0");
    return `${String(sec).padStart(2,"0")}:${ms}`;
  }
  function updateHud() {
    timeValue.textContent = Math.max(0,timeLeft).toFixed(3);
    lapValue.textContent = `${Math.min(lap,TOTAL_LAPS)} / ${TOTAL_LAPS}`;
    checkpointValue.textContent = `${checkpoint} / ${CHECKPOINTS_PER_LAP}`;
    scoreValue.textContent = score.toLocaleString();
    bestTimeEl.textContent = fmtTime(bestTime);
  }

  function resetGame() {
    running = false; finished = false;
    timeLeft = START_TIME; score = 0; lap = 1; checkpoint = 0;
    car = {x:center[0][0], y:center[0][1], angle:0, speed:0};
    particles = [];
    updateHud();
  }

  function showPanel(title,text,buttonText) {
    panelTitle.textContent = title; panelText.textContent = text;
    startBtn.textContent = buttonText; statePanel.classList.remove("hidden");
  }
  function hidePanel(){ statePanel.classList.add("hidden"); }

  function startRace() {
    resetGame(); running = true; hidePanel(); last = performance.now();
    cancelAnimationFrame(raf); raf = requestAnimationFrame(loop);
  }

  function endRace(win) {
    running = false; finished = win;
    if (win) {
      const elapsed = START_TIME - timeLeft;
      if (!bestTime || elapsed < bestTime) {
        bestTime = elapsed;
        localStorage.setItem("timeTrialBest", String(bestTime));
      }
      score += Math.floor(timeLeft * 100);
      showPanel("Lap Complete! 🏁", `You finished all ${TOTAL_LAPS} laps with ${timeLeft.toFixed(2)} seconds left. Final score: ${score.toLocaleString()}.`, "Race Again");
    } else {
      showPanel("Time's Up", `You reached lap ${lap} with ${checkpoint} checkpoints in the current lap. Try a smoother racing line and go again.`, "Try Again");
    }
    updateHud(); draw();
  }

  function dist(a,b){ return Math.hypot(a.x-b.x,a.y-b.y); }

  function isOnTrack(x,y) {
    let min = Infinity;
    for (let i=0;i<center.length;i++) {
      const a=center[i], b=center[(i+1)%center.length];
      const vx=b[0]-a[0], vy=b[1]-a[1];
      const len2=vx*vx+vy*vy;
      let t=((x-a[0])*vx+(y-a[1])*vy)/len2;
      t=Math.max(0,Math.min(1,t));
      const px=a[0]+t*vx, py=a[1]+t*vy;
      min=Math.min(min,Math.hypot(x-px,y-py));
    }
    return min < TRACK_W/2-7;
  }

  function addCheckpoint() {
    const cp = checkpoints[checkpoint];
    if (Math.hypot(car.x-cp.x, car.y-cp.y) < 31) {
      checkpoint++;
      score += 100;
      if (checkpoint >= CHECKPOINTS_PER_LAP) {
        score += 500;
        if (lap >= TOTAL_LAPS) { endRace(true); return; }
        lap++; checkpoint=0;
        timeLeft += 2.5;
      }
    }
  }

  function update(dt) {
    const accel = 250, brake = 320, maxSpeed = 285;
    if (keys.up) car.speed += accel*dt;
    else car.speed -= 38*dt;
    if (keys.down) car.speed -= brake*dt;
    car.speed = Math.max(-65,Math.min(maxSpeed,car.speed));

    const steer = 2.7;
    const steerFactor = Math.min(1,Math.abs(car.speed)/100);
    if (keys.left) car.angle -= steer*dt*steerFactor;
    if (keys.right) car.angle += steer*dt*steerFactor;

    car.x += Math.cos(car.angle)*car.speed*dt;
    car.y += Math.sin(car.angle)*car.speed*dt;

    if (!isOnTrack(car.x,car.y)) {
      car.speed *= Math.pow(.91,dt*60);
      timeLeft -= dt*1.35;
    }

    car.x = Math.max(38,Math.min(W-38,car.x));
    car.y = Math.max(38,Math.min(H-38,car.y));

    timeLeft -= dt;
    if (car.speed > 80 && Math.random()<dt*10) {
      particles.push({x:car.x-Math.cos(car.angle)*17,y:car.y-Math.sin(car.angle)*17,life:.45});
    }
    particles.forEach(p=>p.life-=dt);
    particles=particles.filter(p=>p.life>0);
    addCheckpoint();
    if (timeLeft <= 0 && running) endRace(false);
    updateHud();
  }

  function pathPolygon(points, fill, stroke, width) {
    ctx.beginPath(); ctx.moveTo(points[0][0],points[0][1]);
    for(let i=1;i<points.length;i++) ctx.lineTo(points[i][0],points[i][1]);
    ctx.closePath(); ctx.fillStyle=fill; ctx.fill();
    if(stroke){ctx.lineWidth=width;ctx.strokeStyle=stroke;ctx.stroke();}
  }

  function drawTrack() {
    ctx.fillStyle="#172033"; ctx.fillRect(0,0,W,H);
    ctx.fillStyle="#263244";
    for(let x=0;x<W;x+=42) for(let y=0;y<H;y+=42) ctx.fillRect(x,y,1,1);

    pathPolygon(outer,"#3B4250","#111827",5);
    pathPolygon(inner,"#172033","#111827",5);

    ctx.setLineDash([20,18]); ctx.lineWidth=3; ctx.strokeStyle="#9CA3AF";
    ctx.beginPath(); ctx.moveTo(center[0][0],center[0][1]);
    for(let i=1;i<center.length;i++) ctx.lineTo(center[i][0],center[i][1]);
    ctx.closePath(); ctx.stroke(); ctx.setLineDash([]);

    // Start/finish stripes
    ctx.save(); ctx.translate(center[0][0],center[0][1]); ctx.rotate(.2);
    for(let i=-3;i<3;i++){ctx.fillStyle=i%2===0?"#fff":"#111827";ctx.fillRect(i*12,-8,12,16);}
    ctx.restore();

    checkpoints.forEach((p,i)=>{
      const active=i===checkpoint;
      ctx.beginPath();ctx.arc(p.x,p.y,active?25:18,0,Math.PI*2);
      ctx.fillStyle=active?"rgba(255,184,77,.20)":"rgba(91,92,226,.13)";ctx.fill();
      ctx.lineWidth=active?4:2;ctx.strokeStyle=active?"#FFB84D":"#5B5CE2";ctx.stroke();
      ctx.fillStyle="#fff";ctx.font="800 14px Nunito Sans";ctx.textAlign="center";ctx.textBaseline="middle";
      ctx.fillText(String(i+1),p.x,p.y);
    });
  }

  function drawCar() {
    particles.forEach(p=>{
      ctx.globalAlpha=Math.max(0,p.life/.45);
      ctx.fillStyle="#FFB84D";ctx.beginPath();ctx.arc(p.x,p.y,3,0,Math.PI*2);ctx.fill();
    });
    ctx.globalAlpha=1;
    ctx.save();ctx.translate(car.x,car.y);ctx.rotate(car.angle);
    ctx.fillStyle="rgba(0,0,0,.35)";ctx.fillRect(-16,-8,34,20);
    ctx.fillStyle="#EF5B5B";ctx.fillRect(-17,-9,34,18);
    ctx.fillStyle="#F9FAFB";ctx.fillRect(-4,-7,11,14);
    ctx.fillStyle="#111827";ctx.fillRect(9,-7,7,14);
    ctx.fillStyle="#111827";ctx.fillRect(-13,-11,8,4);ctx.fillRect(-13,7,8,4);
    ctx.restore();
  }

  function draw() {
    drawTrack(); drawCar();
    ctx.fillStyle="rgba(255,255,255,.8)";ctx.font="700 13px Nunito Sans";ctx.textAlign="left";
    ctx.fillText("CHECKPOINTS → LAP → SPEED",18,24);
  }

  function loop(now) {
    if (!running) return;
    const dt=Math.min(.035,(now-last)/1000); last=now;
    update(dt); draw();
    if(running) raf=requestAnimationFrame(loop);
  }

  window.addEventListener("keydown",e=>{
    const k=e.key.toLowerCase();
    if(["arrowup","arrowdown","arrowleft","arrowright"," ","w","a","s","d"].includes(k)) e.preventDefault();
    if(k==="w"||k==="arrowup") keys.up=true;
    if(k==="s"||k==="arrowdown") keys.down=true;
    if(k==="a"||k==="arrowleft") keys.left=true;
    if(k==="d"||k==="arrowright") keys.right=true;
    if(k===" " && !running) startRace();
  });
  window.addEventListener("keyup",e=>{
    const k=e.key.toLowerCase();
    if(k==="w"||k==="arrowup") keys.up=false;
    if(k==="s"||k==="arrowdown") keys.down=false;
    if(k==="a"||k==="arrowleft") keys.left=false;
    if(k==="d"||k==="arrowright") keys.right=false;
  });

  document.querySelectorAll(".touch-btn").forEach(btn=>{
    const c=btn.dataset.control;
    const press=e=>{e.preventDefault();keys[c]=true};
    const release=e=>{e.preventDefault();keys[c]=false};
    btn.addEventListener("pointerdown",press);
    btn.addEventListener("pointerup",release);
    btn.addEventListener("pointercancel",release);
    btn.addEventListener("pointerleave",release);
  });
  startBtn.addEventListener("click",startRace);
  restartBtn.addEventListener("click",startRace);

  updateHud(); resize();
  showPanel("Ready to Race?","Drive through every checkpoint and complete 3 laps before the timer expires.","Start Race");
})();

}
function begin(){poster.hidden=true;gm.hidden=false;if(!booted){booted=true;var s=document.createElement("style");s.textContent=LOOK;document.head.appendChild(s);boot();}else{var r=document.getElementById("startBtn");if(r)r.click();}}
poster.addEventListener("click",begin);
var nb=document.getElementById("new");if(nb)nb.addEventListener("click",begin);
})();
