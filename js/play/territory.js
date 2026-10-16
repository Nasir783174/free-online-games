/* Territory - game logic + its own look. Layout lives in style.css; page shell lives in the HTML. */
(function(){"use strict";
var gm=document.getElementById("gm"),poster=document.getElementById("poster"),booted=false;
var LOOK=".gm *{box-sizing:border-box}.gm{--primary:#5B5CE2;--dark:#4546B8;--teal:#16B8C4;--orange:#FFB84D;--green:#22C55E;--danger:#EF5B5B;--game:#111827}.gm .page{width:min(1200px,calc(100% - 32px));margin:auto;padding:28px 0 72px}.gm h2{font-size:32px;line-height:1.15;margin:0 0 14px;font-weight:700}.gm .lead{max-width:720px;color:var(--muted);margin:0;font-size:18px}.gm .score-card{display:flex;gap:20px;background:#fff;border:1px solid var(--border);border-radius:16px;padding:15px 18px;min-width:255px;box-shadow:0 8px 25px rgba(23,27,45,.05)}.gm .score-card div{display:grid;gap:1px}.gm .score-card span{font-size:13px;color:var(--muted)}.gm .score-card strong{font-size:24px}.gm .game-shell{background:#fff;border:1px solid var(--border);border-radius:20px;overflow:hidden;box-shadow:0 14px 35px rgba(23,27,45,.08)}.gm .game-topbar{min-height:62px;display:flex;align-items:center;justify-content:space-between;padding:12px 18px;border-bottom:1px solid var(--border);gap:15px}.gm .status{font-weight:700;font-size:15px}.gm .mini-stats{display:flex;gap:18px;color:var(--muted);font-size:14px;white-space:nowrap}.gm .mini-stats b{color:var(--text)}.gm .canvas-wrap{position:relative;background:var(--game);width:100%;aspect-ratio:16/9;min-height:400px}.gm canvas{display:block;width:100%;height:100%;touch-action:none}.gm .game-overlay{position:absolute;inset:0;display:grid;place-items:center;background:rgba(17,24,39,.72);padding:20px}.gm .overlay-card{background:#fff;border-radius:18px;max-width:430px;padding:28px;text-align:center;box-shadow:0 18px 50px rgba(0,0,0,.2)}.gm .overlay-card h2{margin-bottom:8px}.gm .overlay-card p:not(.eyebrow){color:var(--muted);margin:0 0 20px}.gm kbd{background:#F0F1F7;border:1px solid var(--border);border-bottom-width:2px;border-radius:5px;padding:1px 6px;font-size:13px;font-weight:700}.gm button{font:inherit;cursor:pointer;border:0}.gm .primary-btn,.gm .secondary-btn{height:46px;border-radius:10px;padding:0 20px;font-weight:800}.gm .primary-btn{background:var(--primary);color:#fff}.gm .primary-btn:hover{background:var(--dark)}.gm .secondary-btn{background:#fff;border:1px solid var(--border);color:var(--text)}.gm .controls{display:flex;align-items:center;gap:18px;padding:16px 18px}.gm .control-copy{display:grid;gap:1px;flex:1}.gm .control-copy span{font-size:14px;color:var(--muted)}.gm .dpad{display:grid;grid-template-columns:46px 46px 46px;grid-template-rows:46px 46px;gap:4px}.gm .dpad button{background:#F0F1F7;border:1px solid var(--border);border-radius:9px;font-size:16px;font-weight:800;touch-action:manipulation}.gm .dpad button:nth-child(1){grid-column:2}.gm .dpad button:nth-child(2){grid-column:1;grid-row:2}.gm .dpad button:nth-child(3){grid-column:2;grid-row:2}.gm .dpad button:nth-child(4){grid-column:3;grid-row:2}.gm .dpad button:active{background:#DCDDF5}.gm li{margin:7px 0}.gm details{border-top:1px solid var(--border);padding:16px 0}.gm details:last-child{padding-bottom:0}.gm summary{cursor:pointer;font-weight:700}@media(max-width:760px){.gm .page{padding-top:20px}.gm .score-card{margin-top:18px;min-width:0;width:max-content}.gm .canvas-wrap{aspect-ratio:1/1;min-height:0}.gm .game-topbar{align-items:flex-start}.gm .mini-stats{gap:10px}.gm .controls{flex-wrap:wrap}.gm .control-copy{min-width:100%;order:0}.gm .dpad{margin-left:auto}.gm .secondary-btn{margin-left:0}.gm h2{font-size:27px}}@media(max-width:430px){.gm .page{width:min(100% - 20px,1200px)}.gm .score-card{width:100%;justify-content:space-around}.gm .game-topbar{padding:10px 12px}.gm .status{font-size:14px}.gm .mini-stats{font-size:12px}.gm .controls{padding:13px}.gm .secondary-btn{flex:1}.gm .dpad{margin:auto}}";
function __ready(f){f()}
function boot(){
(() => {
"use strict";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const overlay = document.getElementById("overlay");
const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");
const statusEl = document.getElementById("status");
const playerPercentEl = document.getElementById("playerPercent");
const enemyPercentEl = document.getElementById("enemyPercent");
const roundEl = document.getElementById("round");
const bestEl = document.getElementById("best");

const COLS = 48, ROWS = 30;
let cell = 16, board = [];
let player, enemy, trail = [];
let running = false, gameOver = false, lastTime = 0, accumulator = 0;
let playerMoveMs = 105, enemyMoveMs = 125, enemyAcc = 0;
let round = 1, best = Number(localStorage.getItem("territoryBest") || 0);
let currentDir = {x:1,y:0}, queuedDir = {x:1,y:0};
let enemyDir = {x:-1,y:0}, enemyQueued = {x:-1,y:0};

const EMPTY=0, P=1, E=2, PT=3, ET=4;
const dirs = {
  up:{x:0,y:-1}, down:{x:0,y:1}, left:{x:-1,y:0}, right:{x:1,y:0}
};

function resize(){
  const rect=canvas.getBoundingClientRect();
  const dpr=Math.min(window.devicePixelRatio||1,2);
  canvas.width=Math.floor(rect.width*dpr); canvas.height=Math.floor(rect.height*dpr);
  ctx.setTransform(dpr,0,0,dpr,0,0);
  cell=Math.min(rect.width/COLS, rect.height/ROWS);
  draw();
}
window.addEventListener("resize",resize);

function resetBoard(){
  board=Array.from({length:ROWS},()=>Array(COLS).fill(EMPTY));
  // Player base: left side; enemy base: right side.
  for(let y=10;y<20;y++) for(let x=2;x<9;x++) board[y][x]=P;
  for(let y=10;y<20;y++) for(let x=COLS-9;x<COLS-2;x++) board[y][x]=E;
  player={x:8,y:15}; enemy={x:COLS-9,y:15};
  trail=[]; currentDir={x:1,y:0}; queuedDir={x:1,y:0};
  enemyDir={x:-1,y:0}; enemyQueued={x:-1,y:0};
  accumulator=0; enemyAcc=0; gameOver=false;
  updateScore(); draw();
}
function start(){
  resetBoard(); running=true; overlay.style.display="none";
  statusEl.textContent="Your turn — draw a path and return to your territory.";
  lastTime=performance.now(); requestAnimationFrame(loop);
}
function restart(){ start(); }

function isOpposite(a,b){return a.x===-b.x && a.y===-b.y}
function setDir(d){
  if(!running || gameOver || isOpposite(d,currentDir)) return;
  queuedDir=d;
}
function stepPlayer(){
  currentDir=queuedDir;
  const nx=player.x+currentDir.x, ny=player.y+currentDir.y;
  if(nx<0||nx>=COLS||ny<0||ny>=ROWS){lose("You hit the edge. Try a safer route.");return}
  const target=board[ny][nx];

  if(target===PT){lose("You crossed your own exposed trail.");return}
  if(target===ET){lose("The opponent cut your trail.");return}
  if(target===E){lose("Your path was blocked by the opponent.");return}

  player={x:nx,y:ny};
  if(target===P){
    if(trail.length) capture();
  } else {
    board[ny][nx]=PT;
    trail.push({x:nx,y:ny});
    if(target===E){lose("You reached the opponent's territory.");}
  }
}
function capture(){
  // Mark trail as player territory.
  for(const p of trail) board[p.y][p.x]=P;
  // Flood fill empty regions. Regions touching border are outside; the opponent
  // can remain inside captured territory only if enclosed, so claim every
  // non-border region not connected to the opponent's base/trail.
  const seen=Array.from({length:ROWS},()=>Array(COLS).fill(false));
  const regions=[];
  for(let y=0;y<ROWS;y++) for(let x=0;x<COLS;x++){
    if(board[y][x]!==EMPTY || seen[y][x]) continue;
    const q=[[x,y]], cells=[], touchesBorder=false; seen[y][x]=true;
    for(let i=0;i<q.length;i++){
      const [cx,cy]=q[i]; cells.push([cx,cy]);
      if(cx===0||cy===0||cx===COLS-1||cy===ROWS-1) touchesBorder=true;
      for(const d of Object.values(dirs)){
        const xx=cx+d.x, yy=cy+d.y;
        if(xx>=0&&xx<COLS&&yy>=0&&yy<ROWS&&!seen[yy][xx]&&board[yy][xx]===EMPTY){
          seen[yy][xx]=true;q.push([xx,yy]);
        }
      }
    }
    regions.push({cells,touchesBorder});
  }
  for(const r of regions) if(!r.touchesBorder) for(const [x,y] of r.cells) board[y][x]=P;
  trail=[];
  updateScore();
  statusEl.textContent="Territory captured! Keep expanding.";
  checkWin();
}
function moveEnemy(){
  // Simple AI: favor movement toward the player's exposed trail or its border,
  // while avoiding its own territory and edges.
  const choices=Object.values(dirs).filter(d=>!isOpposite(d,enemyDir));
  let valid=choices.filter(d=>{
    const x=enemy.x+d.x,y=enemy.y+d.y;
    return x>=0&&x<COLS&&y>=0&&y<ROWS&&board[y][x]!==ET;
  });
  if(!valid.length){valid=choices}
  const target=trail.length?trail[Math.floor(trail.length/2)]:{x:player.x,y:player.y};
  valid.sort((a,b)=>{
    const ax=enemy.x+a.x, ay=enemy.y+a.y, bx=enemy.x+b.x, by=enemy.y+b.y;
    const da=Math.abs(ax-target.x)+Math.abs(ay-target.y), db=Math.abs(bx-target.x)+Math.abs(by-target.y);
    return da-db;
  });
  // Don't always chase perfectly.
  if(Math.random()<0.32) enemyQueued=valid[Math.floor(Math.random()*valid.length)];
  else enemyQueued=valid[0];
  enemyDir=enemyQueued;
  const nx=enemy.x+enemyDir.x, ny=enemy.y+enemyDir.y;
  if(nx<0||nx>=COLS||ny<0||ny>=ROWS)return;
  const targetCell=board[ny][nx];
  if(targetCell===PT){lose("The opponent reached your exposed trail.");return}
  if(targetCell===ET)return;
  enemy={x:nx,y:ny};
  if(targetCell===EMPTY){board[ny][nx]=ET}
  else if(targetCell===P && trail.length){ // enters player's land: keep moving
    // No immediate loss; it can only threaten exposed trail.
  }
}
function checkWin(){
  let pc=0,ec=0,empty=0;
  for(const row of board) for(const v of row){if(v===P||v===PT)pc++;else if(v===E||v===ET)ec++;else empty++}
  if(empty<Math.floor(COLS*ROWS*.035)){
    end(pc>=ec ? "You control more territory. You win!" : "The opponent controls more territory.");
  }
}
function lose(msg){end(msg,false)}
function end(msg,win){
  running=false;gameOver=true;
  statusEl.textContent=msg;
  if(win!==false){round++;roundEl.textContent=round}
  const p=percent(P), e=percent(E);
  if(p>best){best=p;localStorage.setItem("territoryBest",best);bestEl.textContent=best+"%"}
  document.querySelector(".overlay-card h2").textContent=win===false?"Game Over":(p>=e?"You Win!":"Round Over");
  document.querySelector(".overlay-card p:not(.eyebrow)").textContent=msg+" Start a new round to play again.";
  startBtn.textContent="Play Again";
  overlay.style.display="grid"; draw();
}
function percent(type){
  let n=0;for(const row of board)for(const v of row)if(v===type||v===(type===P?PT:ET))n++;
  return Math.round(n/(COLS*ROWS)*100);
}
function updateScore(){
  const p=percent(P),e=percent(E);
  playerPercentEl.textContent=p+"%";enemyPercentEl.textContent=e+"%";
  if(p>best){best=p;localStorage.setItem("territoryBest",best)}
  bestEl.textContent=best+"%";
}
function draw(){
  const w=canvas.clientWidth,h=canvas.clientHeight;
  ctx.clearRect(0,0,w,h);
  ctx.fillStyle="#111827";ctx.fillRect(0,0,w,h);
  const ox=(w-COLS*cell)/2, oy=(h-ROWS*cell)/2;
  // subtle grid
  ctx.strokeStyle="rgba(255,255,255,.045)";ctx.lineWidth=1;
  for(let x=0;x<=COLS;x++){ctx.beginPath();ctx.moveTo(ox+x*cell,oy);ctx.lineTo(ox+x*cell,oy+ROWS*cell);ctx.stroke()}
  for(let y=0;y<=ROWS;y++){ctx.beginPath();ctx.moveTo(ox,oy+y*cell);ctx.lineTo(ox+COLS*cell,oy+y*cell);ctx.stroke()}
  for(let y=0;y<ROWS;y++)for(let x=0;x<COLS;x++){
    const v=board[y][x]; if(v===EMPTY)continue;
    ctx.fillStyle=v===P?"#5B5CE2":v===E?"#EF5B5B":v===PT?"#8C8DF0":"#F58A8A";
    const pad=v===PT||v===ET?cell*.25:cell*.06;
    ctx.fillRect(ox+x*cell+pad,oy+y*cell+pad,cell-pad*2,cell-pad*2);
  }
  // players
  drawDot(player.x,player.y,"#FFFFFF","#5B5CE2",ox,oy);
  drawDot(enemy.x,enemy.y,"#FFFFFF","#EF5B5B",ox,oy);
}
function drawDot(x,y,stroke,fill,ox,oy){
  ctx.beginPath();ctx.arc(ox+(x+.5)*cell,oy+(y+.5)*cell,Math.max(3,cell*.32),0,Math.PI*2);
  ctx.fillStyle=fill;ctx.fill();ctx.lineWidth=Math.max(1,cell*.09);ctx.strokeStyle=stroke;ctx.stroke();
}
function loop(t){
  if(!running)return;
  const dt=Math.min(60,t-lastTime);lastTime=t;accumulator+=dt;enemyAcc+=dt;
  if(accumulator>=playerMoveMs){accumulator=0;stepPlayer();updateScore()}
  if(enemyAcc>=enemyMoveMs){enemyAcc=0;moveEnemy();updateScore()}
  draw();if(running)requestAnimationFrame(loop);
}
document.addEventListener("keydown",e=>{
  const map={ArrowUp:dirs.up,ArrowDown:dirs.down,ArrowLeft:dirs.left,ArrowRight:dirs.right,w:dirs.up,a:dirs.left,s:dirs.down,d:dirs.right};
  const d=map[e.key]||map[e.key.toLowerCase()];
  if(d){e.preventDefault();setDir(d)}
});
document.querySelectorAll(".dpad button").forEach(btn=>{
  const handler=e=>{e.preventDefault();setDir(dirs[btn.dataset.dir])};
  btn.addEventListener("pointerdown",handler);
  btn.addEventListener("click",handler);
});
startBtn.addEventListener("click",start);restartBtn.addEventListener("click",restart);
resetBoard();resize();
})();

}
function begin(){poster.hidden=true;gm.hidden=false;if(!booted){booted=true;var s=document.createElement("style");s.textContent=LOOK;document.head.appendChild(s);boot();}else{var r=document.getElementById("startBtn");if(r)r.click();}}
poster.addEventListener("click",begin);
var nb=document.getElementById("new");if(nb)nb.addEventListener("click",begin);
})();
