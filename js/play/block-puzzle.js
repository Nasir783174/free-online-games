/* Block Puzzle - game logic + its own look. Layout lives in style.css; page shell lives in the HTML. */
(function(){"use strict";
var gm=document.getElementById("gm"),poster=document.getElementById("poster"),booted=false;
var LOOK=".gm *{box-sizing:border-box}.gm{--teal:#16B8C4;--action:#FFB84D;--success:#22C55E;--danger:#EF5B5B;--game:#111827;--game2:#1F2937}.gm .page{max-width:1180px;margin:auto;padding:28px 24px 80px}.gm .stats{display:flex;background:#fff;border:1px solid var(--border);border-radius:16px;padding:12px}.gm .stats div{min-width:82px;text-align:center;padding:4px 13px;border-right:1px solid var(--border)}.gm .stats div:last-child{border:0}.gm .stats span{display:block;font-size:12px;color:var(--muted);font-weight:800;text-transform:uppercase}.gm .stats strong{font-size:23px}.gm .game-card{background:#fff;border:1px solid var(--border);border-radius:20px;overflow:hidden;box-shadow:0 12px 35px rgba(23,27,45,.07)}.gm .game-toolbar{min-height:66px;padding:12px 18px;display:flex;align-items:center;justify-content:space-between;gap:15px;border-bottom:1px solid var(--border)}.gm .status{font-size:15px;color:var(--muted);font-weight:700}.gm .btn{border:0;border-radius:12px;min-height:44px;padding:0 18px;font:700 15px inherit;cursor:pointer}.gm .btn:focus-visible,.gm .piece:focus-visible,.gm .cell:focus-visible,.gm summary:focus-visible{outline:3px solid rgba(91,92,226,.3);outline-offset:2px}.gm .btn-secondary{background:#F0F1FF;color:var(--brand-dark)}.gm .btn-primary{background:var(--brand);color:#fff}.gm .btn:hover{filter:brightness(.97)}.gm .game-shell{background:var(--game);padding:clamp(18px,4vw,38px);display:grid;grid-template-columns:minmax(300px,600px) minmax(260px,1fr);gap:clamp(24px,4vw,48px);align-items:center}.gm .board{width:min(100%,600px);aspect-ratio:1;display:grid;grid-template-columns:repeat(10,1fr);gap:4px;background:#0B1220;padding:8px;border-radius:18px;touch-action:none;user-select:none}.gm .cell{border:0;padding:0;border-radius:5px;background:#273449;min-width:0;transition:transform .12s,background .12s}.gm .cell.filled{background:var(--cell-color,#5B5CE2);box-shadow:inset 0 -2px 0 rgba(0,0,0,.14)}.gm .cell.preview-valid{background:#43506a;box-shadow:inset 0 0 0 2px rgba(255,255,255,.32)}.gm .cell.preview-invalid{background:#5b303a}.gm .cell.clearing{animation:clear .24s ease}@keyframes clear{50%{transform:scale(.55);filter:brightness(1.8)}}.gm .tray-wrap{color:#fff}.gm .tray-heading{display:flex;justify-content:space-between;align-items:end;margin-bottom:18px}.gm .tray-heading strong{display:block;font-size:22px}.gm .mini-label{display:block;color:#9CA3AF;font-size:12px;text-transform:uppercase;font-weight:800;letter-spacing:.08em}.gm .tray-heading>span{color:#9CA3AF;font-size:14px}.gm .tray{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}.gm .piece{height:118px;border:1px solid #374151;background:var(--game2);border-radius:14px;display:grid;place-items:center;cursor:grab;padding:10px;touch-action:none;transition:border-color .15s,transform .15s,background .15s}.gm .piece:hover{border-color:#6B7280}.gm .piece.selected{border-color:var(--action);background:#283345;transform:translateY(-2px)}.gm .piece.used{opacity:.18;pointer-events:none}.gm .shape{display:grid;gap:4px}.gm .block{width:clamp(16px,2.1vw,25px);aspect-ratio:1;border-radius:4px;background:var(--piece-color);box-shadow:inset 0 -2px 0 rgba(0,0,0,.16)}.gm .control-hint{font-size:14px;line-height:1.55;color:#9CA3AF;margin:18px 0 0}.gm .wide{margin-top:22px}.gm .wide details{border-top:1px solid var(--border);padding:17px 0}.gm .wide summary{cursor:pointer;font-size:17px;font-weight:800}.gm .wide details p{margin-bottom:0}.gm .modal{position:fixed;inset:0;background:rgba(11,18,32,.72);display:grid;place-items:center;padding:20px;z-index:20}.gm .modal[hidden]{display:none}.gm .modal-card{width:min(420px,100%);background:#fff;border-radius:20px;padding:34px;text-align:center;box-shadow:0 24px 70px rgba(0,0,0,.28)}.gm .modal-card h2{font-size:32px;margin:10px 0}.gm .modal-card p{color:var(--muted);font-size:17px}.gm .modal-icon{font-size:36px;color:var(--brand)}.gm .drag-ghost{position:fixed;pointer-events:none;z-index:30;opacity:.9;transform:translate(-50%,-100%);background:rgba(31,41,55,.9);padding:10px;border-radius:12px}@media(max-width:850px){.gm .stats{justify-self:start}.gm .game-shell{grid-template-columns:1fr}.gm .board{margin:auto}.gm .tray-wrap{max-width:600px;width:100%;margin:auto}}@media(max-width:560px){.gm .page{padding:20px 14px 60px}.gm .stats{width:100%}.gm .stats div{flex:1;min-width:0;padding-inline:7px}.gm .game-toolbar{align-items:flex-start}.gm .status{max-width:65%}.gm .game-shell{padding:14px;gap:20px}.gm .board{gap:3px;padding:6px;border-radius:14px}.gm .cell{border-radius:3px}.gm .piece{height:92px;padding:6px}.gm .block{width:18px}}@media(prefers-reduced-motion:reduce){.gm *{scroll-behavior:auto!important;animation-duration:.01ms!important;transition-duration:.01ms!important}}";
function __ready(f){f()}
function boot(){
"use strict";
const SIZE=10;
const boardEl=document.getElementById("board"), trayEl=document.getElementById("tray");
const scoreEl=document.getElementById("score"),bestEl=document.getElementById("best"),comboEl=document.getElementById("combo");
const statusEl=document.getElementById("status"),roundHint=document.getElementById("roundHint");
const modal=document.getElementById("gameOver"),finalScore=document.getElementById("finalScore");
const COLORS=["#5B5CE2","#16B8C4","#FFB84D","#22C55E","#EF5B5B","#A66CE8"];
const SHAPES=[
 [[0,0]],[[0,0],[1,0]],[[0,0],[1,0],[2,0]],[[0,0],[1,0],[2,0],[3,0]],[[0,0],[1,0],[2,0],[3,0],[4,0]],
 [[0,0],[0,1]],[[0,0],[0,1],[0,2]],[[0,0],[0,1],[0,2],[0,3]],[[0,0],[0,1],[0,2],[0,3],[0,4]],
 [[0,0],[1,0],[0,1],[1,1]],[[0,0],[1,0],[2,0],[0,1]],[[0,0],[1,0],[2,0],[2,1]],[[0,0],[0,1],[1,1],[2,1]],[[2,0],[0,1],[1,1],[2,1]],
 [[0,0],[1,0],[0,1]],[[0,0],[1,0],[1,1]],[[0,0],[0,1],[1,1]],[[1,0],[0,1],[1,1]],
 [[0,0],[1,0],[2,0],[1,1]],[[1,0],[0,1],[1,1],[2,1]],[[0,0],[0,1],[1,1],[0,2]],[[1,0],[0,1],[1,1],[1,2]],
 [[0,0],[1,0],[1,1],[2,1]],[[1,0],[2,0],[0,1],[1,1]],[[0,0],[1,0],[2,0],[0,1],[1,1],[2,1]]
];
let grid,score,best,combo,pieces,selected=null,drag=null,cells=[];

function init(){
 grid=Array.from({length:SIZE},()=>Array(SIZE).fill(null)); score=0;combo=0;selected=null;
 best=Number(localStorage.getItem("blockPuzzleBest")||0); modal.hidden=true; buildBoard(); newTray(); updateHUD(); renderBoard();
 statusEl.textContent="Choose a shape, then place it on the board.";
}
function buildBoard(){
 boardEl.innerHTML="";cells=[];
 for(let r=0;r<SIZE;r++){cells[r]=[];for(let c=0;c<SIZE;c++){
  const b=document.createElement("button");b.type="button";b.className="cell";b.dataset.r=r;b.dataset.c=c;b.setAttribute("role","gridcell");b.setAttribute("aria-label",`Row ${r+1}, column ${c+1}`);
  b.addEventListener("click",()=>{if(selected!==null) tryPlace(selected,r,c)});
  b.addEventListener("mouseenter",()=>{if(selected!==null) preview(selected,r,c)});
  boardEl.appendChild(b);cells[r][c]=b;
 }}
 boardEl.addEventListener("mouseleave",clearPreview);
}
function randomShape(){return SHAPES[Math.floor(Math.random()*SHAPES.length)].map(p=>[...p])}
function newTray(){
 pieces=Array.from({length:3},(_,i)=>({shape:randomShape(),color:COLORS[Math.floor(Math.random()*COLORS.length)],used:false,id:i}));
 renderTray();
}
function renderTray(){
 trayEl.innerHTML="";
 pieces.forEach((p,i)=>{
  const btn=document.createElement("button");btn.type="button";btn.className="piece"+(p.used?" used":"")+(selected===i?" selected":"");btn.disabled=p.used;btn.setAttribute("aria-label",p.used?"Used block shape":"Select block shape");
  const sh=document.createElement("span");sh.className="shape";const maxX=Math.max(...p.shape.map(x=>x[0])),maxY=Math.max(...p.shape.map(x=>x[1]));
  sh.style.gridTemplateColumns=`repeat(${maxX+1},auto)`;sh.style.gridTemplateRows=`repeat(${maxY+1},auto)`;
  p.shape.forEach(([x,y])=>{const q=document.createElement("i");q.className="block";q.style.gridColumn=x+1;q.style.gridRow=y+1;q.style.setProperty("--piece-color",p.color);sh.appendChild(q)});
  btn.appendChild(sh);btn.addEventListener("click",()=>selectPiece(i));btn.addEventListener("pointerdown",e=>startDrag(e,i,sh));
  trayEl.appendChild(btn);
 });
 roundHint.textContent=`${pieces.filter(p=>!p.used).length} shape${pieces.filter(p=>!p.used).length===1?"":"s"}`;
}
function selectPiece(i){if(pieces[i].used)return;selected=selected===i?null:i;renderTray();clearPreview();statusEl.textContent=selected===null?"Choose a shape.":"Selected. Tap a valid board position."}
function validAt(shape,r,c){return shape.every(([x,y])=>r+y>=0&&r+y<SIZE&&c+x>=0&&c+x<SIZE&&!grid[r+y][c+x])}
function preview(i,r,c){clearPreview();if(i===null||pieces[i].used)return;const p=pieces[i],ok=validAt(p.shape,r,c);p.shape.forEach(([x,y])=>{if(c+x>=0&&c+x<SIZE&&r+y>=0&&r+y<SIZE&&!grid[r+y][c+x])cells[r+y][c+x].classList.add(ok?"preview-valid":"preview-invalid")})}
function clearPreview(){document.querySelectorAll(".preview-valid,.preview-invalid").forEach(x=>x.classList.remove("preview-valid","preview-invalid"))}
function tryPlace(i,r,c){
 const p=pieces[i];if(!p||p.used||!validAt(p.shape,r,c)){statusEl.textContent="That shape does not fit there.";return false}
 p.shape.forEach(([x,y])=>grid[r+y][c+x]=p.color);p.used=true;score+=p.shape.length;selected=null;clearPreview();renderBoard();
 const lines=findLines(); if(lines.rows.length||lines.cols.length){combo++;const n=lines.rows.length+lines.cols.length;score+=n*10+(n>1?(n-1)*15:0)+Math.max(0,combo-1)*5;animateAndClear(lines);statusEl.textContent=n>1?`${n} lines cleared! Combo ×${combo}.`:`Line cleared! Combo ×${combo}.`}
 else{combo=0;statusEl.textContent="Nice placement. Keep the board open."}
 if(pieces.every(x=>x.used)){newTray();statusEl.textContent="Fresh shapes! Plan your next three moves."}else renderTray();
 updateHUD();setTimeout(checkGameOver,270);return true;
}
function findLines(){const rows=[],cols=[];for(let r=0;r<SIZE;r++)if(grid[r].every(Boolean))rows.push(r);for(let c=0;c<SIZE;c++)if(grid.every(row=>row[c]))cols.push(c);return{rows,cols}}
function animateAndClear({rows,cols}){rows.forEach(r=>cells[r].forEach(x=>x.classList.add("clearing")));cols.forEach(c=>cells.forEach(row=>row[c].classList.add("clearing")));setTimeout(()=>{rows.forEach(r=>{for(let c=0;c<SIZE;c++)grid[r][c]=null});cols.forEach(c=>{for(let r=0;r<SIZE;r++)grid[r][c]=null});renderBoard()},210)}
function renderBoard(){for(let r=0;r<SIZE;r++)for(let c=0;c<SIZE;c++){const el=cells[r][c],v=grid[r][c];el.className="cell"+(v?" filled":"");if(v)el.style.setProperty("--cell-color",v);else el.style.removeProperty("--cell-color")}}
function updateHUD(){if(score>best){best=score;localStorage.setItem("blockPuzzleBest",best)}scoreEl.textContent=score;bestEl.textContent=best;comboEl.textContent="×"+combo}
function canFit(p){for(let r=0;r<SIZE;r++)for(let c=0;c<SIZE;c++)if(validAt(p.shape,r,c))return true;return false}
function checkGameOver(){if(pieces.filter(p=>!p.used).some(canFit))return;finalScore.textContent=score;modal.hidden=false;statusEl.textContent="Game over. No available shape can fit."}
function startDrag(e,i,shapeNode){
 if(e.pointerType==="touch"||pieces[i].used)return;drag={i,ghost:shapeNode.cloneNode(true)};drag.ghost.classList.add("drag-ghost");document.body.appendChild(drag.ghost);moveDrag(e);window.addEventListener("pointermove",moveDrag);window.addEventListener("pointerup",endDrag,{once:true});
}
function moveDrag(e){if(!drag)return;drag.ghost.style.left=e.clientX+"px";drag.ghost.style.top=(e.clientY-8)+"px";const hit=document.elementFromPoint(e.clientX,e.clientY);const cell=hit&&hit.closest(".cell");if(cell)preview(drag.i,+cell.dataset.r,+cell.dataset.c);else clearPreview()}
function endDrag(e){if(!drag)return;const hit=document.elementFromPoint(e.clientX,e.clientY),cell=hit&&hit.closest(".cell");if(cell)tryPlace(drag.i,+cell.dataset.r,+cell.dataset.c);drag.ghost.remove();drag=null;clearPreview();window.removeEventListener("pointermove",moveDrag)}
document.getElementById("newGame").addEventListener("click",init);document.getElementById("playAgain").addEventListener("click",init);
init();

}
function begin(){poster.hidden=true;gm.hidden=false;if(!booted){booted=true;var s=document.createElement("style");s.textContent=LOOK;document.head.appendChild(s);boot();}else{var r=document.getElementById("newGame");if(r)r.click();}}
poster.addEventListener("click",begin);
var nb=document.getElementById("new");if(nb)nb.addEventListener("click",begin);
})();
