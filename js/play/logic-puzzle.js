/* Logic Puzzle - game logic + its own look. Layout lives in style.css; page shell lives in the HTML. */
(function(){"use strict";
var gm=document.getElementById("gm"),poster=document.getElementById("poster"),booted=false;
var LOOK=".gm{--primary:#5B5CE2;--primary-dark:#4546B8;--teal:#16B8C4;--amber:#FFB84D;--success:#22C55E;--danger:#EF5B5B;--ink:#111827;--radius:18px}.gm *{box-sizing:border-box}.gm .game-card{background:var(--card);border:1px solid var(--border);border-radius:20px;box-shadow:0 12px 40px rgba(23,27,45,.06);overflow:hidden}.gm .game-toolbar{padding:20px 24px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;gap:20px}.gm .label,.gm .stats span{display:block;color:var(--muted);font-size:13px}.gm .game-toolbar strong{font-size:20px}.gm .stats{display:flex;gap:10px}.gm .stats>div{min-width:84px;background:var(--bg);padding:7px 12px;border-radius:12px;text-align:center}.gm .stats strong{font-size:19px}.gm .message{padding:10px 24px;background:#f0f0ff;color:var(--primary-dark);font-size:15px;font-weight:700}.gm .message.success{background:#ecfdf3;color:#147a3a}.gm .message.error{background:#fff1f1;color:#b83232}.gm .game-layout{display:grid;grid-template-columns:minmax(260px,340px) 1fr;gap:26px;padding:24px}.gm .clues{background:var(--bg);border:1px solid var(--border);border-radius:16px;padding:18px}.gm .panel-title{display:flex;justify-content:space-between;align-items:center}.gm .panel-title h2{font-size:24px;margin:0}.gm .text-btn{border:0;background:transparent;color:var(--primary);font:inherit;font-weight:800;cursor:pointer}.gm .clues ol{padding-left:24px;margin:16px 0}.gm .clues li{margin:0 0 12px}.gm .legend{font-size:14px;color:var(--muted);margin-bottom:0}.gm .mark{display:inline-grid;place-items:center;width:24px;height:24px;border-radius:6px;margin:0 4px;font-weight:800}.gm .mark.yes{background:#dcfce7;color:#16803d}.gm .mark.no{background:#fee2e2;color:#b91c1c}.gm .boards{display:grid;gap:24px;min-width:0}.gm .grid-wrap{overflow-x:auto;padding-bottom:3px}.gm .grid-title{font-size:18px;margin:0 0 8px}.gm .logic-grid{border-collapse:separate;border-spacing:4px;min-width:470px;width:100%;table-layout:fixed}.gm .logic-grid th{font-size:13px;line-height:1.2;padding:7px 4px;color:var(--muted);font-weight:800}.gm .logic-grid th.row-head{text-align:right;padding-right:10px;color:var(--text);width:90px}.gm .cell{height:48px;border:1px solid #d9dce7;background:#fff;border-radius:9px;cursor:pointer;font-size:25px;font-weight:800;color:transparent;transition:transform .12s,background .12s,border .12s}.gm .cell:hover{border-color:#a9aaf0;transform:translateY(-1px)}.gm .cell:focus-visible,.gm .btn:focus-visible,.gm .text-btn:focus-visible,.gm summary:focus-visible{outline:3px solid rgba(91,92,226,.25);outline-offset:2px}.gm .cell.yes{background:#e9fbef;border-color:#9be2b3;color:#15803d}.gm .cell.no{background:#fff0f0;border-color:#f6b8b8;color:#c93636}.gm .cell.hint{animation:pulse .7s 2}@keyframes pulse{50%{box-shadow:0 0 0 5px rgba(255,184,77,.28);border-color:var(--amber)}}.gm .controls{display:flex;gap:10px;flex-wrap:wrap;padding:0 24px 24px}.gm .btn{height:48px;padding:0 20px;border:1px solid var(--border);border-radius:12px;background:#fff;color:var(--text);font:inherit;font-size:16px;font-weight:800;cursor:pointer}.gm .btn.primary{background:var(--primary);border-color:var(--primary);color:#fff}.gm .btn:hover{filter:brightness(.98)}@media(max-width:820px){.gm .game-layout{grid-template-columns:1fr}.gm .game-toolbar{align-items:flex-start;flex-direction:column}.gm .stats{width:100%}.gm .stats>div{flex:1;min-width:0}}@media(max-width:520px){.gm .game-toolbar,.gm .game-layout{padding:16px}.gm .message{padding:10px 16px}.gm .controls{padding:0 16px 16px}.gm .stats{gap:6px}.gm .stats>div{padding:7px 5px}.gm .stats strong{font-size:17px}.gm .clues{padding:15px}.gm .logic-grid{min-width:430px}.gm .cell{height:46px}}";
function __ready(f){f()}
function boot(){
(() => {
  'use strict';
  const PEOPLE=['Ava','Ben','Chloe','Diego'];
  const PETS=['Cat','Dog','Fish','Rabbit'];
  const DRINKS=['Coffee','Juice','Tea','Water'];
  const boardsEl=document.getElementById('boards'), clueList=document.getElementById('clueList'), timerEl=document.getElementById('timer'), mistakesEl=document.getElementById('mistakes'), scoreEl=document.getElementById('score'), messageEl=document.getElementById('message'), titleEl=document.getElementById('puzzle-title');
  let solution,state,startTime,timer,mistakes=0,hints=0,finished=false,puzzleNo=0;
  const shuffle=a=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
  function makeSolution(){const pets=shuffle(PETS),drinks=shuffle(DRINKS);return PEOPLE.map((person,i)=>({person,pet:pets[i],drink:drinks[i]}));}
  function generateClues(sol){
    const clues=[];
    // Direct facts for two people, plus cross-category and exclusions. Together these yield a practical, deterministic puzzle.
    const directPeople=shuffle([0,1,2,3]).slice(0,2);
    directPeople.forEach((i,k)=>clues.push(k===0?`${sol[i].person} has the ${sol[i].pet}.`:`${sol[i].person} drinks ${sol[i].drink}.`));
    const cross=shuffle([0,1,2,3]).slice(0,2); cross.forEach(i=>clues.push(`The person with the ${sol[i].pet} drinks ${sol[i].drink}.`));
    const used=new Set();
    while(clues.length<7){const i=Math.floor(Math.random()*4), wrong=shuffle(PETS.filter(p=>p!==sol[i].pet))[0], key=i+wrong;if(used.has(key))continue;used.add(key);clues.push(`${sol[i].person} does not have the ${wrong}.`)}
    // Ensure sufficient explicit information by adding one more direct clue.
    const remaining=[0,1,2,3].filter(i=>!directPeople.includes(i)); const i=remaining[0]; clues.push(`${sol[i].person} has the ${sol[i].pet}.`);
    return shuffle(clues);
  }
  function emptyMatrix(){return Array.from({length:4},()=>Array(4).fill(0));}
  function renderBoard(key,items,label){
    const wrap=document.createElement('div');wrap.className='grid-wrap';wrap.innerHTML=`<h3 class="grid-title">People × ${label}</h3>`;
    const table=document.createElement('table');table.className='logic-grid';
    let html='<thead><tr><th></th>'+items.map(x=>`<th scope="col">${x}</th>`).join('')+'</tr></thead><tbody>';
    PEOPLE.forEach((p,r)=>{html+=`<tr><th scope="row" class="row-head">${p}</th>`;items.forEach((x,c)=>html+=`<td><button class="cell" data-board="${key}" data-r="${r}" data-c="${c}" aria-label="${p} and ${x}: unknown"></button></td>`);html+='</tr>'});
    table.innerHTML=html+'</tbody>';wrap.appendChild(table);boardsEl.appendChild(wrap);
  }
  function render(){boardsEl.innerHTML='';renderBoard('pet',PETS,'Pets');renderBoard('drink',DRINKS,'Drinks');updateCells();}
  function setCell(board,r,c,value,auto=false){
    const m=state[board];
    if(value===1){for(let x=0;x<4;x++)if(x!==c)m[r][x]=-1;for(let y=0;y<4;y++)if(y!==r)m[y][c]=-1;m[r][c]=1;} else m[r][c]=value;
    if(!auto) updateCells();
  }
  function updateCells(){document.querySelectorAll('.cell').forEach(btn=>{const v=state[btn.dataset.board][+btn.dataset.r][+btn.dataset.c];btn.classList.toggle('yes',v===1);btn.classList.toggle('no',v===-1);btn.textContent=v===1?'✓':v===-1?'×':'';const item=(btn.dataset.board==='pet'?PETS:DRINKS)[+btn.dataset.c];btn.setAttribute('aria-label',`${PEOPLE[+btn.dataset.r]} and ${item}: ${v===1?'match':v===-1?'not a match':'unknown'}`)});updateScore();}
  function handleCell(e){const b=e.target.closest('.cell');if(!b||finished)return;const board=b.dataset.board,r=+b.dataset.r,c=+b.dataset.c,current=state[board][r][c];setCell(board,r,c,current===0?1:current===1?-1:0);}
  function correctIndex(board,r){const value=solution[r][board];return (board==='pet'?PETS:DRINKS).indexOf(value);}
  function check(){if(finished)return;let wrong=0,missing=0;['pet','drink'].forEach(board=>state[board].forEach((row,r)=>{const ci=correctIndex(board,r);if(row[ci]!==1)missing++;row.forEach((v,c)=>{if(v===1&&c!==ci)wrong++})}));if(wrong){mistakes++;mistakesEl.textContent=mistakes;show(`Not quite. ${wrong} confirmed ${wrong===1?'match is':'matches are'} incorrect.`, 'error');updateScore();return;}if(missing){show(`Your confirmed matches are consistent. ${missing} ${missing===1?'match remains':'matches remain'} to solve.`);return;}finished=true;clearInterval(timer);show('Solved! Excellent deduction.', 'success');updateScore();}
  function hint(){if(finished)return;const candidates=[];['pet','drink'].forEach(board=>state[board].forEach((row,r)=>{const c=correctIndex(board,r);if(row[c]!==1)candidates.push([board,r,c])}));if(!candidates.length)return;const [board,r,c]=candidates[Math.floor(Math.random()*candidates.length)];setCell(board,r,c,1);hints++;const el=document.querySelector(`.cell[data-board="${board}"][data-r="${r}"][data-c="${c}"]`);el.classList.add('hint');setTimeout(()=>el.classList.remove('hint'),1500);show(`Hint revealed: ${PEOPLE[r]} matches ${board==='pet'?PETS[c]:DRINKS[c]}.`);}
  function score(){const seconds=Math.floor((Date.now()-startTime)/1000);return Math.max(100,1000-seconds*2-mistakes*100-hints*75)}
  function updateScore(){scoreEl.textContent=score()}
  function show(text,type=''){messageEl.textContent=text;messageEl.className='message'+(type?' '+type:'')}
  function tick(){const s=Math.floor((Date.now()-startTime)/1000),m=Math.floor(s/60);timerEl.textContent=String(m).padStart(2,'0')+':'+String(s%60).padStart(2,'0');updateScore()}
  function reset(){state={pet:emptyMatrix(),drink:emptyMatrix()};mistakes=0;hints=0;finished=false;mistakesEl.textContent='0';startTime=Date.now();clearInterval(timer);timer=setInterval(tick,1000);tick();render();show('Read the clues, then fill the grids.');}
  function newPuzzle(){puzzleNo++;solution=makeSolution();const clues=generateClues(solution);clueList.innerHTML=clues.map(c=>`<li>${c}</li>`).join('');titleEl.textContent=`Deduction Grid #${puzzleNo}`;reset();}
  boardsEl.addEventListener('click',handleCell);document.getElementById('checkBtn').addEventListener('click',check);document.getElementById('resetBtn').addEventListener('click',reset);document.getElementById('newBtn').addEventListener('click',newPuzzle);document.getElementById('hintBtn').addEventListener('click',hint);
  newPuzzle();
})();


}
function begin(){poster.hidden=true;gm.hidden=false;if(!booted){booted=true;var s=document.createElement("style");s.textContent=LOOK;document.head.appendChild(s);boot();}else{var r=document.getElementById("resetBtn");if(r)r.click();}}
poster.addEventListener("click",begin);
var nb=document.getElementById("new");if(nb)nb.addEventListener("click",begin);
})();
