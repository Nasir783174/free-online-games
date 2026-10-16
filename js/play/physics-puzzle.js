/* Physics Puzzle - game logic + its own look. Layout lives in style.css; page shell lives in the HTML. */
(function(){"use strict";
var gm=document.getElementById("gm"),poster=document.getElementById("poster"),booted=false;
var LOOK=".gm *{box-sizing:border-box}.gm button{font:inherit}.gm button{cursor:pointer}.gm button:focus-visible,.gm summary:focus-visible{outline:3px solid rgba(91,92,226,.35);outline-offset:3px}.gm .game-card{background:var(--card);border:1px solid var(--border);border-radius:20px;overflow:hidden;box-shadow:0 18px 50px rgba(23,27,45,.07)}.gm .game-toolbar{display:grid;grid-template-columns:90px 90px 90px minmax(170px,1fr) auto;align-items:center;gap:16px;padding:16px 18px;border-bottom:1px solid var(--border)}.gm .stat span,.gm .ink-label span{display:block;font-size:12px;text-transform:uppercase;letter-spacing:.07em;color:var(--muted);font-weight:800}.gm .stat strong{font-size:20px}.gm .ink-label{display:flex;justify-content:space-between;align-items:center;font-size:14px}.gm .ink-track{height:8px;background:#ECEEF5;border-radius:999px;overflow:hidden;margin-top:5px}.gm .ink-track span{display:block;width:100%;height:100%;background:var(--secondary);border-radius:inherit;transition:width .18s}.gm .button{min-height:46px;border:0;border-radius:12px;padding:10px 17px;font-size:15px;font-weight:800;transition:transform .15s,box-shadow .15s,background .15s}.gm .button:hover{transform:translateY(-1px)}.gm .button:disabled{opacity:.48;cursor:not-allowed;transform:none}.gm .button-primary{background:var(--primary);color:white;box-shadow:0 8px 20px rgba(91,92,226,.24)}.gm .button-primary:hover{background:var(--primary-dark)}.gm .button-secondary{background:#EEF0F7;color:var(--text)}.gm .button-action{background:var(--action);color:#4B3511;box-shadow:0 8px 20px rgba(255,184,77,.22)}.gm .button-ghost{background:white;border:1px solid var(--border);color:var(--text)}.gm .game-stage{position:relative;background:var(--game);width:100%;aspect-ratio:16/9;min-height:330px;max-height:650px;overflow:hidden;touch-action:none;user-select:none}.gm #gameCanvas{display:block;width:100%;height:100%;touch-action:none}.gm .overlay{position:absolute;inset:0;display:grid;place-items:center;background:rgba(10,16,29,.62);padding:24px;z-index:5}.gm .overlay.hidden{display:none}.gm .overlay-card{width:min(430px,100%);text-align:center;background:white;border-radius:18px;padding:28px;box-shadow:0 24px 60px rgba(0,0,0,.25)}.gm .overlay-card h2{margin:8px 0 8px;font-size:30px;line-height:1.15}.gm .overlay-card p{margin:0 0 20px;color:var(--muted)}.gm .overlay-icon{font-size:32px;color:var(--primary);font-weight:800}.gm .stars{font-size:31px;letter-spacing:5px;color:#E0A125;margin:-4px 0 16px}.gm .result-actions{display:flex;justify-content:center;gap:10px}.gm .game-actions{display:flex;align-items:center;justify-content:space-between;gap:18px;padding:16px 18px;border-top:1px solid var(--border)}.gm .mode-status{display:flex;align-items:center;gap:9px;color:var(--muted);font-size:15px;font-weight:700}.gm .status-dot{width:9px;height:9px;border-radius:50%;background:var(--secondary);box-shadow:0 0 0 5px rgba(22,184,196,.1)}.gm .action-buttons{display:flex;gap:10px}.gm .touch-hint{text-align:center;padding:0 18px 15px;color:var(--muted);font-size:13px}.gm .about{background:white;border:1px solid var(--border);border-radius:18px;padding:28px}.gm h2{font-size:34px;line-height:1.2;margin:0 0 15px;font-weight:700;letter-spacing:-.02em}.gm .about p{color:var(--muted)}.gm .tips-card ul{padding-left:22px}.gm .about{margin-bottom:22px}@media (max-width:800px){.gm .game-toolbar{grid-template-columns:repeat(3,1fr);gap:10px}.gm .ink-wrap{grid-column:1/-2}.gm .game-toolbar>.button{grid-column:-2/-1}.gm .game-stage{aspect-ratio:4/3;min-height:360px}}@media (max-width:560px){.gm .game-toolbar{grid-template-columns:repeat(3,1fr);padding:12px}.gm .stat strong{font-size:17px}.gm .ink-wrap{grid-column:1/-1}.gm .game-toolbar>.button{grid-column:1/-1;min-height:42px}.gm .game-stage{aspect-ratio:3/4;min-height:500px}.gm .game-actions{align-items:stretch;flex-direction:column;padding:12px}.gm .action-buttons{display:grid;grid-template-columns:1fr 1.3fr}.gm .button{min-height:48px}.gm .overlay-card{padding:22px 18px}.gm .overlay-card h2{font-size:27px}.gm .about{padding:22px}.gm h2{font-size:28px}}";
function __ready(f){f()}
function boot(){
(() => {
"use strict";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const stage = document.getElementById("gameStage");
const levelValue = document.getElementById("levelValue");
const scoreValue = document.getElementById("scoreValue");
const bestValue = document.getElementById("bestValue");
const inkValue = document.getElementById("inkValue");
const inkBar = document.getElementById("inkBar");
const statusText = document.getElementById("statusText");
const startOverlay = document.getElementById("startOverlay");
const resultOverlay = document.getElementById("resultOverlay");
const resultTitle = document.getElementById("resultTitle");
const resultText = document.getElementById("resultText");
const resultIcon = document.getElementById("resultIcon");
const starsEl = document.getElementById("stars");
const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");
const undoBtn = document.getElementById("undoBtn");
const releaseBtn = document.getElementById("releaseBtn");
const retryBtn = document.getElementById("retryBtn");
const nextBtn = document.getElementById("nextBtn");

const W = 960, H = 540, BALL_R = 13, GRAVITY = 640, RESTITUTION = 0.46, FRICTION = 0.992;
const MAX_SEGMENT = 180;
const levels = [
  {name:"First Bridge", start:[90,110], goal:[820,455,54], ink:430, platforms:[[0,490,230,490],[700,490,960,490]], hazards:[]},
  {name:"Gentle Slope", start:[95,105], goal:[820,430,52], ink:380, platforms:[[0,475,260,475],[660,470,960,470]], hazards:[]},
  {name:"Mind the Gap", start:[110,360], goal:[820,405,50], ink:360, platforms:[[0,430,260,430],[710,455,960,455]], hazards:[[420,500,160,24]]},
  {name:"Step Down", start:[100,100], goal:[835,450,50], ink:410, platforms:[[0,300,240,300],[700,490,960,490]], hazards:[[400,505,130,20]]},
  {name:"Red Floor", start:[105,100], goal:[835,190,48], ink:440, platforms:[[0,275,240,275],[700,245,960,245]], hazards:[[245,500,455,28]]},
  {name:"Twin Islands", start:[100,150], goal:[845,390,50], ink:390, platforms:[[0,350,220,350],[400,430,545,430],[745,445,960,445]], hazards:[[250,505,140,22],[565,505,155,22]]},
  {name:"High Goal", start:[95,360], goal:[840,150,50], ink:500, platforms:[[0,430,230,430],[720,210,960,210]], hazards:[[310,500,300,25]]},
  {name:"Narrow Landing", start:[90,95], goal:[835,430,46], ink:390, platforms:[[0,300,220,300],[780,475,960,475]], hazards:[[330,500,340,24]]},
  {name:"Center Block", start:[100,115], goal:[840,390,50], ink:460, platforms:[[0,330,235,330],[725,445,960,445]], blocks:[[430,255,105,170]], hazards:[]},
  {name:"Two Hazards", start:[100,130], goal:[840,400,50], ink:470, platforms:[[0,350,220,350],[740,455,960,455]], blocks:[[465,360,80,150]], hazards:[[260,505,170,22],[580,505,125,22]]},
  {name:"Precision Run", start:[100,100], goal:[845,145,46], ink:520, platforms:[[0,285,220,285],[765,200,960,200]], blocks:[[380,335,90,170],[575,285,75,220]], hazards:[[235,505,130,22]]},
  {name:"Final Experiment", start:[90,120], goal:[850,120,48], ink:560, platforms:[[0,315,205,315],[755,180,960,180]], blocks:[[330,375,80,130],[545,315,80,190]], hazards:[[220,510,100,20],[425,510,105,20],[640,510,105,20]]}
];

let dpr=1, scaleX=1, scaleY=1, currentLevel=0, score=0, state="intro";
let lines=[], currentStroke=null, inkUsed=0, ball=null, lastTime=0, animationId=0, settledTime=0;

function safeStorageGet(key, fallback) {
  try { const v = localStorage.getItem(key); return v === null ? fallback : v; } catch(e) { return fallback; }
}
function safeStorageSet(key, value) { try { localStorage.setItem(key, value); } catch(e) {} }

function resizeCanvas(){
  const rect=stage.getBoundingClientRect();
  dpr=Math.min(window.devicePixelRatio||1,2);
  canvas.width=Math.max(1,Math.round(rect.width*dpr));
  canvas.height=Math.max(1,Math.round(rect.height*dpr));
  scaleX=rect.width/W; scaleY=rect.height/H;
  draw();
}
window.addEventListener("resize", resizeCanvas);

function level(){ return levels[currentLevel]; }
function resetBall(){
  const [x,y]=level().start;
  ball={x,y,vx:0,vy:0,r:BALL_R,active:false};
}
function updateUI(){
  levelValue.textContent=`${currentLevel+1} / ${levels.length}`;
  scoreValue.textContent=score.toLocaleString();
  const best=Number(safeStorageGet("physicsPuzzleBest","0"));
  bestValue.textContent=best ? best.toLocaleString() : "—";
  const pct=Math.max(0,Math.round((1-inkUsed/level().ink)*100));
  inkValue.textContent=`${pct}%`;
  inkBar.style.width=`${pct}%`;
  undoBtn.disabled=state!=="drawing" || !lines.length;
  releaseBtn.disabled=state!=="drawing";
}
function beginLevel(showIntro=false){
  cancelAnimationFrame(animationId);
  lines=[]; currentStroke=null; inkUsed=0; state=showIntro?"intro":"drawing"; settledTime=0;
  resetBall();
  resultOverlay.classList.add("hidden");
  startOverlay.classList.toggle("hidden", !showIntro);
  startBtn.textContent=`Start Level ${currentLevel+1}`;
  statusText.textContent="Draw platforms, then release the ball.";
  releaseBtn.textContent="Release Ball";
  updateUI(); draw();
}
function startLevel(){
  state="drawing"; startOverlay.classList.add("hidden"); updateUI(); draw();
}
function resetLevel(){ beginLevel(false); }

function pointerPos(e){
  const r=canvas.getBoundingClientRect();
  return {x:(e.clientX-r.left)/r.width*W, y:(e.clientY-r.top)/r.height*H};
}
function insideBoard(p){ return p.x>=8&&p.x<=W-8&&p.y>=8&&p.y<=H-8; }
function distance(a,b){ return Math.hypot(a.x-b.x,a.y-b.y); }

canvas.addEventListener("pointerdown", e=>{
  if(state!=="drawing") return;
  const p=pointerPos(e); if(!insideBoard(p)) return;
  canvas.setPointerCapture?.(e.pointerId);
  currentStroke=[p]; draw();
});
canvas.addEventListener("pointermove", e=>{
  if(state!=="drawing" || !currentStroke) return;
  const p=pointerPos(e), last=currentStroke[currentStroke.length-1];
  if(!insideBoard(p) || distance(last,p)<5) return;
  const remaining=level().ink-inkUsed;
  if(remaining<=0) return;
  let d=distance(last,p);
  if(d>MAX_SEGMENT){
    const t=MAX_SEGMENT/d; p.x=last.x+(p.x-last.x)*t; p.y=last.y+(p.y-last.y)*t; d=MAX_SEGMENT;
  }
  if(d>remaining){
    const t=remaining/d; p.x=last.x+(p.x-last.x)*t; p.y=last.y+(p.y-last.y)*t; d=remaining;
  }
  currentStroke.push(p); inkUsed+=d; updateUI(); draw();
});
function endStroke(){
  if(!currentStroke) return;
  if(currentStroke.length>1) lines.push(currentStroke);
  currentStroke=null; updateUI(); draw();
}
canvas.addEventListener("pointerup", endStroke);
canvas.addEventListener("pointercancel", endStroke);
canvas.addEventListener("contextmenu", e=>e.preventDefault());

function undo(){
  if(state!=="drawing" || !lines.length) return;
  const s=lines.pop();
  for(let i=1;i<s.length;i++) inkUsed-=distance(s[i-1],s[i]);
  inkUsed=Math.max(0,inkUsed); updateUI(); draw();
}
function release(){
  if(state!=="drawing") return;
  state="running"; ball.active=true; ball.vx=0; ball.vy=0; lastTime=performance.now();
  statusText.textContent="Ball released. Watch the physics!";
  releaseBtn.disabled=true; undoBtn.disabled=true;
  animationId=requestAnimationFrame(loop);
}

function allSegments(){
  const segs=[];
  level().platforms.forEach(p=>segs.push({a:{x:p[0],y:p[1]},b:{x:p[2],y:p[3]},fixed:true}));
  lines.forEach(stroke=>{ for(let i=1;i<stroke.length;i++) segs.push({a:stroke[i-1],b:stroke[i],fixed:false}); });
  return segs;
}
function closestPoint(px,py,a,b){
  const abx=b.x-a.x, aby=b.y-a.y, len2=abx*abx+aby*aby || 1;
  let t=((px-a.x)*abx+(py-a.y)*aby)/len2; t=Math.max(0,Math.min(1,t));
  return {x:a.x+abx*t,y:a.y+aby*t,t};
}
function collideSegment(seg){
  const cp=closestPoint(ball.x,ball.y,seg.a,seg.b);
  let dx=ball.x-cp.x, dy=ball.y-cp.y, dist=Math.hypot(dx,dy);
  if(dist>=ball.r+3 || dist===0) return;
  let nx=dx/dist, ny=dy/dist;
  const rel=ball.vx*nx+ball.vy*ny;
  if(rel<0 || dist<ball.r-1){
    const push=ball.r+3-dist; ball.x+=nx*push; ball.y+=ny*push;
    if(rel<0){ ball.vx-=(1+RESTITUTION)*rel*nx; ball.vy-=(1+RESTITUTION)*rel*ny; }
    const tx=-ny, ty=nx, tang=ball.vx*tx+ball.vy*ty;
    ball.vx-=tang*.012*tx; ball.vy-=tang*.012*ty;
  }
}
function collideRect(r){
  const [x,y,w,h]=r;
  const cx=Math.max(x,Math.min(ball.x,x+w)), cy=Math.max(y,Math.min(ball.y,y+h));
  let dx=ball.x-cx,dy=ball.y-cy,dist=Math.hypot(dx,dy);
  if(dist>=ball.r || dist===0) return;
  const nx=dx/dist,ny=dy/dist,rel=ball.vx*nx+ball.vy*ny;
  ball.x+=nx*(ball.r-dist); ball.y+=ny*(ball.r-dist);
  if(rel<0){ball.vx-=(1+RESTITUTION)*rel*nx;ball.vy-=(1+RESTITUTION)*rel*ny;}
}
function inRectCircle(r){
  const [x,y,w,h]=r, cx=Math.max(x,Math.min(ball.x,x+w)),cy=Math.max(y,Math.min(ball.y,y+h));
  return Math.hypot(ball.x-cx,ball.y-cy)<ball.r;
}
function checkGoal(){
  const [gx,gy,gr]=level().goal;
  return Math.hypot(ball.x-gx,ball.y-gy) < gr-ball.r*.25;
}
function finish(success){
  state=success?"won":"lost"; ball.active=false;
  if(success){
    const ratio=inkUsed/level().ink;
    const stars=ratio<=.42?3:ratio<=.72?2:1;
    const points=500+stars*350+Math.round(Math.max(0,level().ink-inkUsed)*2);
    score+=points;
    const best=Math.max(Number(safeStorageGet("physicsPuzzleBest","0")),score);
    safeStorageSet("physicsPuzzleBest",String(best));
    resultIcon.textContent="★"; resultTitle.textContent=currentLevel===levels.length-1?"Puzzle master!":"Level complete!";
    resultText.textContent=`${level().name} solved. +${points.toLocaleString()} points`;
    starsEl.textContent="★".repeat(stars)+"☆".repeat(3-stars);
    nextBtn.textContent=currentLevel===levels.length-1?"Play Again":"Next level";
  }else{
    resultIcon.textContent="↻"; resultTitle.textContent="Try again";
    resultText.textContent="The ball missed the goal or touched a red hazard.";
    starsEl.textContent="";
    nextBtn.textContent="Reset level";
  }
  resultOverlay.classList.remove("hidden"); updateUI(); draw();
}
function loop(t){
  if(state!=="running") return;
  const dt=Math.min(.022,(t-lastTime)/1000||.016); lastTime=t;
  const steps=2, sdt=dt/steps;
  for(let s=0;s<steps;s++){
    ball.vy+=GRAVITY*sdt; ball.vx*=FRICTION; ball.vy*=.9995;
    ball.x+=ball.vx*sdt; ball.y+=ball.vy*sdt;
    allSegments().forEach(collideSegment);
    (level().blocks||[]).forEach(collideRect);
    if(checkGoal()){ finish(true); return; }
    if((level().hazards||[]).some(inRectCircle)){ finish(false); return; }
    if(ball.y>H+80 || ball.x<-100 || ball.x>W+100){ finish(false); return; }
    const speed=Math.hypot(ball.vx,ball.vy);
    if(speed<9 && ball.y>80) settledTime+=sdt; else settledTime=0;
    if(settledTime>4.2){ finish(false); return; }
  }
  draw(); animationId=requestAnimationFrame(loop);
}

function roundedRect(x,y,w,h,r,fill){
  ctx.beginPath(); ctx.roundRect(x,y,w,h,r); ctx.fillStyle=fill; ctx.fill();
}
function drawGrid(){
  ctx.strokeStyle="rgba(255,255,255,.045)";ctx.lineWidth=1;
  for(let x=0;x<=W;x+=40){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}
  for(let y=0;y<=H;y+=40){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
}
function draw(){
  if(!ctx) return;
  ctx.setTransform(canvas.width/W,0,0,canvas.height/H,0,0);
  ctx.clearRect(0,0,W,H);
  const grad=ctx.createLinearGradient(0,0,0,H); grad.addColorStop(0,"#111827");grad.addColorStop(1,"#182235");
  ctx.fillStyle=grad;ctx.fillRect(0,0,W,H); drawGrid();

  (level().hazards||[]).forEach(r=>{
    roundedRect(r[0],r[1],r[2],r[3],7,"#EF5B5B");
    ctx.fillStyle="rgba(255,255,255,.25)";
    for(let x=r[0]+8;x<r[0]+r[2]-4;x+=20){ctx.beginPath();ctx.moveTo(x,r[1]+r[3]);ctx.lineTo(x+10,r[1]);ctx.lineTo(x+16,r[1]);ctx.lineTo(x+6,r[1]+r[3]);ctx.fill();}
  });
  (level().blocks||[]).forEach(r=>{
    roundedRect(r[0],r[1],r[2],r[3],10,"#374151");
    ctx.strokeStyle="#4B5563";ctx.lineWidth=2;ctx.strokeRect(r[0]+1,r[1]+1,r[2]-2,r[3]-2);
  });
  level().platforms.forEach(p=>{
    ctx.lineCap="round";ctx.strokeStyle="#A7B0C0";ctx.lineWidth=14;ctx.beginPath();ctx.moveTo(p[0],p[1]);ctx.lineTo(p[2],p[3]);ctx.stroke();
    ctx.strokeStyle="#E5E7EB";ctx.lineWidth=4;ctx.stroke();
  });

  const [gx,gy,gr]=level().goal;
  ctx.beginPath();ctx.arc(gx,gy,gr,0,Math.PI*2);ctx.fillStyle="rgba(34,197,94,.16)";ctx.fill();
  ctx.strokeStyle="#22C55E";ctx.lineWidth=7;ctx.stroke();
  ctx.beginPath();ctx.arc(gx,gy,gr-14,0,Math.PI*2);ctx.strokeStyle="rgba(34,197,94,.55)";ctx.lineWidth=3;ctx.stroke();
  ctx.fillStyle="#86EFAC";ctx.font="800 15px 'Nunito Sans',sans-serif";ctx.textAlign="center";ctx.fillText("GOAL",gx,gy+5);

  const strokes=currentStroke?[...lines,currentStroke]:lines;
  strokes.forEach(stroke=>{
    if(stroke.length<2)return;
    ctx.lineCap="round";ctx.lineJoin="round";ctx.strokeStyle="#16B8C4";ctx.lineWidth=12;ctx.beginPath();ctx.moveTo(stroke[0].x,stroke[0].y);
    for(let i=1;i<stroke.length;i++)ctx.lineTo(stroke[i].x,stroke[i].y);ctx.stroke();
    ctx.strokeStyle="#6EE7EE";ctx.lineWidth=3;ctx.stroke();
  });

  if(ball){
    ctx.beginPath();ctx.arc(ball.x+4,ball.y+7,ball.r+2,0,Math.PI*2);ctx.fillStyle="rgba(0,0,0,.25)";ctx.fill();
    const bg=ctx.createRadialGradient(ball.x-5,ball.y-6,2,ball.x,ball.y,ball.r+2);bg.addColorStop(0,"#A5B4FC");bg.addColorStop(1,"#5B5CE2");
    ctx.beginPath();ctx.arc(ball.x,ball.y,ball.r,0,Math.PI*2);ctx.fillStyle=bg;ctx.fill();ctx.strokeStyle="#C7D2FE";ctx.lineWidth=2;ctx.stroke();
  }

  ctx.fillStyle="rgba(255,255,255,.72)";ctx.font="700 14px 'Nunito Sans',sans-serif";ctx.textAlign="left";
  ctx.fillText(level().name,20,28);
}
startBtn.addEventListener("click",startLevel);
resetBtn.addEventListener("click",resetLevel);
undoBtn.addEventListener("click",undo);
releaseBtn.addEventListener("click",release);
retryBtn.addEventListener("click",resetLevel);
nextBtn.addEventListener("click",()=>{
  if(state==="won"){
    if(currentLevel===levels.length-1){currentLevel=0;score=0;}else currentLevel++;
    beginLevel(false);
  } else resetLevel();
});
document.addEventListener("keydown",e=>{
  if(e.key.toLowerCase()==="r") resetLevel();
  if((e.key==="Enter"||e.key===" ") && state==="drawing"){e.preventDefault();release();}
  if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="z"){e.preventDefault();undo();}
});
resetBall(); resizeCanvas(); beginLevel(true);
})();

}
function begin(){poster.hidden=true;gm.hidden=false;if(!booted){booted=true;var s=document.createElement("style");s.textContent=LOOK;document.head.appendChild(s);boot();}else{var r=document.getElementById("resetBtn");if(r)r.click();}}
poster.addEventListener("click",begin);
var nb=document.getElementById("new");if(nb)nb.addEventListener("click",begin);
})();
