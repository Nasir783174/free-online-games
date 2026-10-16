/* Tactical - game logic + its own look. Layout lives in style.css; page shell lives in the HTML. */
(function(){"use strict";
var gm=document.getElementById("gm"),poster=document.getElementById("poster"),booted=false;
var LOOK=".gm *{box-sizing:border-box}.gm{--primary:#5B5CE2;--primary-dark:#4546B8;--accent:#16B8C4;--action:#FFB84D;--success:#22C55E;--danger:#EF5B5B;--game:#111827;--game2:#1F2937}.gm button{font:inherit}.gm button{cursor:pointer}.gm .page{width:min(1120px,calc(100% - 40px));margin:0 auto;padding:28px 0 80px}.gm h2{font-size:30px;line-height:1.2;margin:0 0 14px;font-weight:700}.gm .mission-chip{background:#fff;border:1px solid var(--border);border-radius:999px;padding:10px 15px;white-space:nowrap;font-weight:700;font-size:14px}.gm .chip-dot{display:inline-block;width:8px;height:8px;background:var(--success);border-radius:50%;margin-right:8px}.gm .game-shell{background:var(--card);border:1px solid var(--border);border-radius:18px;overflow:hidden;box-shadow:0 12px 30px rgba(23,27,45,.07)}.gm .game-topbar{display:grid;grid-template-columns:repeat(4,1fr);border-bottom:1px solid var(--border)}.gm .stat{padding:15px 20px;display:flex;justify-content:space-between;align-items:center;gap:10px}.gm .stat+ .stat{border-left:1px solid var(--border)}.gm .stat span{color:var(--muted);font-size:14px;font-weight:700}.gm .stat strong{font-size:23px}.gm .canvas-wrap{position:relative;background:var(--game);display:grid;place-items:center;padding:18px;min-height:500px}.gm canvas{display:block;max-width:100%;width:720px;height:auto;outline:none;border-radius:10px}.gm .game-message{position:absolute;inset:0;background:rgba(17,24,39,.72);display:grid;place-items:center;padding:20px}.gm .hidden{display:none}.gm .message-card{width:min(390px,100%);background:#fff;border-radius:18px;padding:30px;text-align:center;box-shadow:0 20px 50px rgba(0,0,0,.25)}.gm .message-icon{width:48px;height:48px;margin:0 auto 12px;border-radius:50%;display:grid;place-items:center;background:#EEF0FF;color:var(--primary);font-size:24px;font-weight:800}.gm .message-card h2{margin-bottom:8px}.gm .message-card p{color:var(--muted);margin:0 0 20px}.gm .primary-btn,.gm .secondary-btn{border:0;border-radius:11px;height:46px;padding:0 20px;font-weight:800}.gm .primary-btn{background:var(--primary);color:#fff}.gm .primary-btn:hover{background:var(--primary-dark)}.gm .secondary-btn{background:#fff;border:1px solid var(--border);color:var(--text)}.gm .controls{display:flex;align-items:center;justify-content:space-between;gap:20px;padding:18px 20px;border-top:1px solid var(--border)}.gm .control-copy{display:flex;flex-direction:column}.gm .control-copy strong{font-size:16px}.gm .control-copy span{color:var(--muted);font-size:14px}.gm .dpad{display:flex;align-items:center;gap:5px}.gm .dpad>div{display:flex;gap:5px}.gm .dpad button{width:43px;height:43px;border:1px solid var(--border);background:#fff;border-radius:9px;color:var(--text);font-weight:800;touch-action:manipulation}.gm .dpad button:active{transform:scale(.95);background:#EEF0FF}.gm .about{margin-top:20px}@media(max-width:760px){.gm .page{width:min(100% - 24px,1120px);padding-top:20px}.gm .mission-chip{display:inline-block;margin-top:15px}.gm .game-topbar{grid-template-columns:repeat(2,1fr)}.gm .stat{padding:12px 15px}.gm .stat:nth-child(3){border-left:0;border-top:1px solid var(--border)}.gm .stat:nth-child(4){border-top:1px solid var(--border)}.gm .canvas-wrap{padding:8px;min-height:0}.gm .controls{flex-wrap:wrap}.gm .control-copy{width:100%}.gm .dpad{margin:auto}.gm .secondary-btn{flex:1}.gm h2{font-size:26px}}@media(max-width:420px){.gm .game-topbar .stat{padding:10px 12px}.gm .stat strong{font-size:20px}.gm .dpad button{width:46px;height:46px}.gm .controls{padding:15px 12px}}.gm button:focus-visible,.gm canvas:focus-visible,.gm summary:focus-visible{outline:3px solid rgba(91,92,226,.35);outline-offset:2px}";
function __ready(f){f()}
function boot(){
(() => {
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');
  const scoreEl = document.getElementById('score');
  const turnEl = document.getElementById('turn');
  const targetsEl = document.getElementById('targets');
  const healthEl = document.getElementById('health');
  const message = document.getElementById('message');
  const messageTitle = document.getElementById('messageTitle');
  const messageText = document.getElementById('messageText');
  const messageIcon = document.getElementById('messageIcon');

  const COLS = 12, ROWS = 9;
  let cell = 50;
  let state;

  const level = {
    walls: [
      [2,1],[3,1],[4,1],[7,1],[8,1],
      [2,2],[4,2],[8,2],
      [5,3],[6,3],[8,3],[9,3],
      [1,4],[2,4],[6,4],
      [6,5],[9,5],[10,5],
      [1,6],[3,6],[6,6],[7,6],
      [3,7],[7,7],[8,7],[9,7]
    ],
    targets: [[10,1],[10,7],[4,5],[1,8]],
    enemies: [[10,2],[7,4],[2,6]]
  };

  function key(x,y){ return `${x},${y}`; }
  function isWall(x,y){ return level.walls.some(p => p[0]===x && p[1]===y); }
  function resize(){
    const maxWidth = Math.min(720, canvas.parentElement.clientWidth - 16);
    cell = Math.floor(maxWidth / COLS);
    const w = cell * COLS, h = cell * ROWS;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.style.width = `${w}px`; canvas.style.height = `${h}px`;
    canvas.width = w*dpr; canvas.height = h*dpr;
    ctx.setTransform(dpr,0,0,dpr,0,0);
    draw();
  }

  function reset(){
    state = {
      player:{x:1,y:1},
      targets: new Set(level.targets.map(p=>key(...p))),
      enemies: level.enemies.map(p=>({x:p[0],y:p[1]})),
      health:3, score:0, turn:1, over:false
    };
    message.classList.add('hidden');
    updateUI();
    resize();
    canvas.focus({preventScroll:true});
  }

  function updateUI(){
    scoreEl.textContent = state.score;
    turnEl.textContent = state.turn;
    targetsEl.textContent = state.targets.size;
    healthEl.textContent = state.health;
  }

  function draw(){
    if(!state) return;
    const w=cell*COLS,h=cell*ROWS;
    ctx.clearRect(0,0,w,h);
    ctx.fillStyle='#111827';ctx.fillRect(0,0,w,h);

    for(let y=0;y<ROWS;y++) for(let x=0;x<COLS;x++){
      ctx.fillStyle=(x+y)%2===0?'#182233':'#1B2637';
      ctx.fillRect(x*cell,y*cell,cell,cell);
      ctx.strokeStyle='rgba(255,255,255,.045)';ctx.strokeRect(x*cell+.5,y*cell+.5,cell,cell);
    }

    level.walls.forEach(([x,y])=>{
      const px=x*cell,py=y*cell;
      ctx.fillStyle='#394454';ctx.fillRect(px+3,py+3,cell-6,cell-6);
      ctx.fillStyle='#465264';ctx.fillRect(px+7,py+7,cell-14,cell*.18);
    });

    state.targets.forEach(s=>{
      const [x,y]=s.split(',').map(Number), cx=x*cell+cell/2,cy=y*cell+cell/2;
      ctx.fillStyle='#FFB84D';ctx.beginPath();ctx.arc(cx,cy,cell*.23,0,Math.PI*2);ctx.fill();
      ctx.strokeStyle='#FFF2D6';ctx.lineWidth=2;ctx.beginPath();ctx.arc(cx,cy,cell*.31,0,Math.PI*2);ctx.stroke();
      ctx.fillStyle='#fff';ctx.fillRect(cx-2,cy-cell*.12,4,cell*.24);ctx.fillRect(cx-cell*.12,cy-2,cell*.24,4);
    });

    state.enemies.forEach(e=>{
      const cx=e.x*cell+cell/2,cy=e.y*cell+cell/2,r=cell*.24;
      ctx.fillStyle='#EF5B5B';ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(cx-r*.3,cy-r*.15,r*.18,0,Math.PI*2);ctx.fill();
      ctx.beginPath();ctx.arc(cx+r*.3,cy-r*.15,r*.18,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='#EF5B5B';ctx.beginPath();ctx.arc(cx-r*.3,cy-r*.15,r*.08,0,Math.PI*2);ctx.fill();
      ctx.beginPath();ctx.arc(cx+r*.3,cy-r*.15,r*.08,0,Math.PI*2);ctx.fill();
    });

    const p=state.player,cx=p.x*cell+cell/2,cy=p.y*cell+cell/2;
    ctx.fillStyle='#5B5CE2';ctx.beginPath();ctx.arc(cx,cy,cell*.28,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#DDE0FF';ctx.beginPath();ctx.arc(cx,cy,cell*.11,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#16B8C4';ctx.fillRect(cx+cell*.12,cy-cell*.06,cell*.19,cell*.12);
  }

  function enemyAt(x,y){ return state.enemies.find(e=>e.x===x&&e.y===y); }

  function move(dx,dy){
    if(state.over) return;
    const nx=state.player.x+dx, ny=state.player.y+dy;
    if(nx<0||nx>=COLS||ny<0||ny>=ROWS||isWall(nx,ny)) return;
    if(enemyAt(nx,ny)) return;

    state.player.x=nx;state.player.y=ny;state.turn++;
    const k=key(nx,ny);
    if(state.targets.delete(k)) state.score += 100;

    enemyTurn();
    checkEnd();
    updateUI();draw();
  }

  function enemyTurn(){
    state.enemies.forEach(e=>{
      const distance=Math.abs(e.x-state.player.x)+Math.abs(e.y-state.player.y);
      if(distance===1){ state.health--; state.score=Math.max(0,state.score-25); return; }
      if(distance<=5){
        const choices=[];
        const dx=Math.sign(state.player.x-e.x),dy=Math.sign(state.player.y-e.y);
        if(Math.abs(state.player.x-e.x)>=Math.abs(state.player.y-e.y)) choices.push([dx,0],[0,dy]);
        else choices.push([0,dy],[dx,0]);
        choices.push([0,0]);
        for(const [mx,my] of choices){
          const nx=e.x+mx,ny=e.y+my;
          if(nx>=0&&nx<COLS&&ny>=0&&ny<ROWS&&!isWall(nx,ny)&&!enemyAt(nx,ny)&&!(nx===state.player.x&&ny===state.player.y)){
            e.x=nx;e.y=ny;break;
          }
        }
      }
    });
    state.enemies.forEach(e=>{
      if(Math.abs(e.x-state.player.x)+Math.abs(e.y-state.player.y)===1){
        state.health--; state.score=Math.max(0,state.score-25);
      }
    });
  }

  function checkEnd(){
    if(state.targets.size===0){
      state.over=true; state.score += Math.max(0, (60-state.turn)*5);
      showMessage('✓','Mission complete',`All objectives captured in ${state.turn} turns. Final score: ${state.score}.`);
    }else if(state.health<=0){
      state.over=true;
      showMessage('!','Mission failed','Your unit ran out of health. Plan a safer route and try again.');
    }
  }

  function showMessage(icon,title,text){
    messageIcon.textContent=icon;messageTitle.textContent=title;messageText.textContent=text;
    message.classList.remove('hidden');
  }

  document.addEventListener('keydown',e=>{
    const map={ArrowUp:[0,-1],w:[0,-1],W:[0,-1],ArrowDown:[0,1],s:[0,1],S:[0,1],ArrowLeft:[-1,0],a:[-1,0],A:[-1,0],ArrowRight:[1,0],d:[1,0],D:[1,0]};
    if(map[e.key]){e.preventDefault();move(...map[e.key]);}
    if((e.key==='r'||e.key==='R')&&state.over) reset();
  });

  document.querySelectorAll('[data-dir]').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const dirs={up:[0,-1],down:[0,1],left:[-1,0],right:[1,0]};
      move(...dirs[btn.dataset.dir]);
    });
  });
  document.getElementById('restart').addEventListener('click',reset);
  document.getElementById('restartOverlay').addEventListener('click',reset);
  window.addEventListener('resize',resize);
  reset();
})();


}
function begin(){poster.hidden=true;gm.hidden=false;if(!booted){booted=true;var s=document.createElement("style");s.textContent=LOOK;document.head.appendChild(s);boot();}else{var r=document.getElementById("restartOverlay");if(r)r.click();}}
poster.addEventListener("click",begin);
var nb=document.getElementById("new");if(nb)nb.addEventListener("click",begin);
})();
