/* War Strategy - game logic + its own look. Layout lives in style.css; page shell lives in the HTML. */
(function(){"use strict";
var gm=document.getElementById("gm"),poster=document.getElementById("poster"),booted=false;
var LOOK=".gm *{box-sizing:border-box}.gm{font-family:\"Nunito Sans\",Arial,sans-serif;color:#171B2D;background:#F6F7FB}.gm .genre{font-size:14px;font-weight:700;color:#667085;background:#F1F2FA;padding:8px 12px;border-radius:999px}.gm .page{max-width:1180px;margin:auto;padding:28px 20px 70px}.gm .mission-pill{font-size:13px;font-weight:800;color:#4546B8;background:#E9E9FF;padding:9px 13px;border-radius:999px;white-space:nowrap}.gm .game-shell{display:grid;grid-template-columns:270px 1fr;gap:18px;background:#fff;border:1px solid #E5E7EF;border-radius:18px;padding:18px;box-shadow:0 10px 35px rgba(23,27,45,.06)}.gm .sidebar{display:flex;flex-direction:column;gap:14px}.gm .panel{border:1px solid #E5E7EF;border-radius:14px;padding:15px;background:#fff}.gm .panel-title{font-size:12px;letter-spacing:.12em;font-weight:800;color:#667085;margin-bottom:12px}.gm .stat-grid{display:grid;grid-template-columns:1fr 1fr;gap:9px}.gm .stat-grid div{background:#F6F7FB;border-radius:10px;padding:10px}.gm .stat-grid span{display:block;font-size:12px;color:#667085}.gm .stat-grid b{font-size:21px}.gm .selected-info{font-size:14px;line-height:1.5;color:#667085;min-height:55px}.gm .selected-info strong{color:#171B2D}.gm .action-btn{width:100%;height:46px;border:1px solid #E5E7EF;background:#fff;border-radius:10px;font:700 15px inherit;color:#171B2D;cursor:pointer;margin-top:8px;transition:.15s}.gm .action-btn:hover:not(:disabled){transform:translateY(-1px);border-color:#5B5CE2}.gm .action-btn:focus-visible{outline:3px solid rgba(91,92,226,.25)}.gm .action-btn.primary{background:#5B5CE2;color:#fff;border-color:#5B5CE2}.gm .action-btn.danger{color:#C73E3E}.gm .action-btn:disabled{opacity:.42;cursor:not-allowed}.gm .action-btn.large{width:180px;margin-top:18px}.gm .log-panel{flex:1;min-height:160px}.gm .log{font-size:12px;line-height:1.45;color:#667085;max-height:180px;overflow:auto}.gm .log div{padding:7px 0;border-bottom:1px solid #F0F1F5}.gm .log b{color:#171B2D}.gm .board-wrap{min-width:0;background:#111827;border-radius:15px;padding:15px;color:white;display:flex;flex-direction:column}.gm .board-top{display:flex;justify-content:space-between;align-items:center;gap:12px;padding:3px 4px 14px}.gm .board-top strong{display:block;font-size:18px}.gm .board-top span{display:block;font-size:12px;color:#AAB2C2;margin-top:3px}.gm .turn-indicator{font-size:11px!important;font-weight:800;letter-spacing:.08em;padding:7px 9px;border-radius:999px;background:#26334A;color:#fff!important;white-space:nowrap}.gm .board{display:grid;grid-template-columns:repeat(5,1fr);gap:7px;aspect-ratio:1.35;background:#1F2937;padding:8px;border-radius:12px}.gm .cell{position:relative;border:1px solid rgba(255,255,255,.09);border-radius:9px;min-width:0;cursor:pointer;display:flex;flex-direction:column;align-items:center;justify-content:center;transition:.15s;user-select:none}.gm .cell:hover{filter:brightness(1.08);transform:translateY(-1px)}.gm .cell.player{background:#3439A4}.gm .cell.enemy{background:#8E3C45}.gm .cell.neutral{background:#596273}.gm .cell.selected{outline:3px solid #FFB84D;z-index:2}.gm .cell.fortified:after{content:\"\";position:absolute;right:6px;top:5px;width:8px;height:8px;border-radius:50%;background:#FFB84D}.gm .cell .name{font-size:clamp(9px,1.2vw,13px);font-weight:800;text-align:center}.gm .cell .units{font-size:clamp(15px,2vw,23px);font-weight:800;margin-top:3px}.gm .cell .owner{font-size:9px;opacity:.7;margin-top:1px}.gm .legend{display:flex;flex-wrap:wrap;gap:14px;padding:13px 4px 2px;font-size:11px;color:#AAB2C2}.gm .legend span{display:flex;align-items:center;gap:6px}.gm .legend i{width:9px;height:9px;border-radius:3px;display:inline-block}.gm .player-dot{background:#5B5CE2}.gm .enemy-dot{background:#8E3C45}.gm .neutral-dot{background:#596273}.gm .fort-dot{background:#FFB84D}.gm .tips{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-top:18px}.gm .tips article{background:#fff;border:1px solid #E5E7EF;border-radius:14px;padding:18px}.gm .tips b{display:block;margin-bottom:8px}.gm .tips span{font-size:14px;color:#667085;line-height:1.55}.gm details{background:#fff;border:1px solid #E5E7EF;border-radius:12px;padding:14px 16px;margin:9px 0}.gm summary{font-weight:700;cursor:pointer}.gm details p{margin-bottom:0}.gm .modal{position:fixed;inset:0;background:rgba(17,24,39,.62);display:grid;place-items:center;padding:20px;z-index:10}.gm .modal.hidden{display:none}.gm .modal-card{background:#fff;border-radius:20px;padding:35px;text-align:center;max-width:410px;width:100%;box-shadow:0 20px 60px rgba(0,0,0,.2)}.gm .result-icon{font-size:40px;color:#FFB84D}.gm .modal-card h2{font-size:32px;margin:8px 0}.gm .modal-card p{color:#667085;line-height:1.6}@media(max-width:800px){.gm .game-shell{grid-template-columns:1fr}.gm .sidebar{order:2}.gm .board-wrap{order:1}.gm .log-panel{min-height:120px}.gm .log{max-height:110px}.gm .tips{grid-template-columns:1fr}}@media(max-width:520px){.gm .page{padding:20px 12px 50px}.gm .mission-pill{display:inline-block;margin-top:14px}.gm .game-shell{padding:9px;border-radius:14px}.gm .board-wrap{padding:10px}.gm .board{gap:4px;padding:5px}.gm .cell{border-radius:6px}.gm .legend{gap:9px}.gm .tips{grid-template-columns:1fr}}";
function __ready(f){f()}
function boot(){
const boardEl = document.getElementById("board");
const goldEl = document.getElementById("gold");
const suppliesEl = document.getElementById("supplies");
const armyEl = document.getElementById("army");
const turnsEl = document.getElementById("turns");
const selectedInfo = document.getElementById("selectedInfo");
const logEl = document.getElementById("log");
const attackBtn = document.getElementById("attackBtn");
const fortifyBtn = document.getElementById("fortifyBtn");
const endTurnBtn = document.getElementById("endTurnBtn");
const restartBtn = document.getElementById("restartBtn");
const resultModal = document.getElementById("resultModal");
const resultTitle = document.getElementById("resultTitle");
const resultText = document.getElementById("resultText");
const resultIcon = document.getElementById("resultIcon");
const playAgainBtn = document.getElementById("playAgainBtn");
const turnIndicator = document.getElementById("turnIndicator");
const objective = document.getElementById("objective");

const MAP = [
  ["North Ridge","Pine Pass","Iron Hill","East Gate","Coast"],
  ["West Fort","River Bend","Stonefield","Red Valley","Harbor"],
  ["Old Road","Crossroads","Highland","Watchtower","Delta"],
  ["Westport","Central Plain","Oak Woods","Eastport","Marsh"],
  ["South Fort","Farmland","Supply Base","Hilltop","Enemy HQ"]
];

let cells, selected, gameOver, playerTurn, gold, supplies, army, turns, score, mission;

function initialState(){
  cells = MAP.flatMap((row, i) => row.map((name, j) => {
    const idx = i * 5 + j;
    let owner = "neutral", units = 5;
    if (idx === 0 || idx === 5 || idx === 10 || idx === 15 || idx === 20) owner = "player";
    if ([4,8,9,14,19,24].includes(idx)) owner = "enemy";
    if (owner === "player") units = idx === 0 ? 9 : 6;
    if (owner === "enemy") units = idx === 24 ? 10 : 7;
    return {name, owner, units, fortified:false, x:j, y:i};
  }));
  selected = null; gameOver = false; playerTurn = true;
  gold = 120; supplies = 90; army = 18; turns = 30; score = 0; mission = 1;
  resultModal.classList.add("hidden");
  logEl.innerHTML = "";
  addLog("Mission started. Capture every enemy region.");
  render();
}

function neighbors(index){
  const x = cells[index].x, y = cells[index].y;
  return cells.map((c,i) => (Math.abs(c.x-x)+Math.abs(c.y-y)===1 ? i : -1)).filter(i=>i>=0);
}

function addLog(message){
  const div=document.createElement("div");
  div.textContent=message;
  logEl.prepend(div);
  while(logEl.children.length>8) logEl.lastChild.remove();
}

function render(){
  boardEl.innerHTML="";
  cells.forEach((cell,index)=>{
    const el=document.createElement("button");
    el.className=`cell ${cell.owner}${selected===index?" selected":""}${cell.fortified?" fortified":""}`;
    el.setAttribute("role","gridcell");
    el.setAttribute("aria-label",`${cell.name}, ${cell.owner}, ${cell.units} units${cell.fortified?", fortified":""}`);
    el.innerHTML=`<span class="name">${cell.name}</span><span class="units">${cell.units}</span><span class="owner">${cell.owner==="player"?"YOU":cell.owner.toUpperCase()}</span>`;
    el.addEventListener("click",()=>selectCell(index));
    boardEl.appendChild(el);
  });
  goldEl.textContent=gold; suppliesEl.textContent=supplies; armyEl.textContent=army; turnsEl.textContent=turns;
  updateSelection();
}

function selectCell(index){
  if(gameOver || !playerTurn) return;
  if(cells[index].owner==="player"){
    selected=index;
    updateSelection();
    render();
  } else if(selected!==null && neighbors(selected).includes(index)){
    attack(index);
  } else {
    addLog("Select one of your adjacent territories.");
  }
}

function updateSelection(){
  const validTargets = selected===null ? [] : neighbors(selected).filter(i=>cells[i].owner!=="player");
  if(selected===null){
    selectedInfo.textContent="Select one of your territories.";
    attackBtn.disabled=true; fortifyBtn.disabled=true;
    return;
  }
  const c=cells[selected];
  selectedInfo.innerHTML=`<strong>${c.name}</strong><br>${c.units} units · ${c.fortified?"Fortified":"Standard"}<br><small>${validTargets.length} adjacent target${validTargets.length===1?"":"s"}</small>`;
  attackBtn.disabled=gameOver || !validTargets.length || c.units<2 || supplies<8;
  fortifyBtn.disabled=gameOver || c.fortified || gold<15;
}

function attack(targetIndex){
  if(gameOver || !playerTurn || selected===null) return;
  const from=cells[selected], target=cells[targetIndex];
  if(!neighbors(selected).includes(targetIndex) || from.owner!=="player") return;
  if(from.units<2 || supplies<8) { addLog("Not enough army or supplies to attack."); return; }
  supplies-=8; gold=Math.max(0,gold-5);
  const attackerPower=from.units + Math.floor(Math.random()*7);
  const defenderPower=target.units + (target.fortified?3:0) + Math.floor(Math.random()*5);
  const loss=Math.max(1,Math.floor(target.units/3)+Math.floor(Math.random()*2));
  if(attackerPower>=defenderPower){
    const moved=Math.max(1,Math.floor(from.units/2));
    from.units-=moved;
    target.owner="player"; target.units=Math.max(2,moved-1); target.fortified=false;
    score+=100; army=Math.max(0,army-1);
    addLog(`Victory at ${target.name}. Territory captured.`);
  }else{
    from.units=Math.max(1,from.units-loss);
    army=Math.max(0,army-loss);
    addLog(`Attack failed at ${target.name}. Your force lost ${loss} units.`);
  }
  selected=null;
  checkWin();
  if(!gameOver) enemyTurn();
  render();
}

function fortify(){
  if(selected===null || gameOver || !playerTurn) return;
  const c=cells[selected];
  if(c.owner!=="player" || c.fortified || gold<15) return;
  gold-=15; c.fortified=true; c.units=Math.min(14,c.units+2);
  addLog(`${c.name} fortified. Defense increased.`);
  selected=null;
  render();
}

function enemyTurn(){
  playerTurn=false; turnIndicator.textContent="ENEMY TURN"; endTurnBtn.disabled=true;
  setTimeout(()=>{
    if(gameOver) return;
    const enemyIndexes=cells.map((c,i)=>c.owner==="enemy"?i:-1).filter(i=>i>=0);
    let attackOptions=[];
    enemyIndexes.forEach(i=>neighbors(i).forEach(n=>{
      if(cells[n].owner==="player") attackOptions.push([i,n]);
    }));
    if(attackOptions.length){
      const [fromIndex,targetIndex]=attackOptions[Math.floor(Math.random()*attackOptions.length)];
      const from=cells[fromIndex], target=cells[targetIndex];
      const power=from.units+Math.floor(Math.random()*5);
      const defense=target.units+(target.fortified?3:0)+Math.floor(Math.random()*4);
      if(power>defense){
        const loss=Math.min(target.units,Math.max(1,Math.floor(from.units/3)));
        target.owner="enemy"; target.units=Math.max(2,loss); target.fortified=false;
        addLog(`Enemy captured ${target.name}.`);
      }else{
        from.units=Math.max(1,from.units-1);
        addLog(`Enemy attack on ${target.name} was repelled.`);
      }
    } else addLog("Enemy is regrouping.");
    turns--;
    gold=Math.min(160,gold+12); supplies=Math.min(120,supplies+15);
    army=cells.filter(c=>c.owner==="player").reduce((s,c)=>s+c.units,0);
    if(turns<=0){lose("Your campaign ran out of turns.");return;}
    if(cells.filter(c=>c.owner==="player").length===0){lose("Your army has lost all territory.");return;}
    playerTurn=true; turnIndicator.textContent="YOUR TURN"; endTurnBtn.disabled=false;
    render();
  },450);
}

function endTurn(){
  if(gameOver || !playerTurn) return;
  selected=null; enemyTurn();
}

function checkWin(){
  if(cells.every(c=>c.owner==="player")) win();
}

function win(){
  gameOver=true; playerTurn=false; score += turns*10;
  resultIcon.textContent="★"; resultTitle.textContent="Victory!";
  resultText.textContent=`You captured the entire frontier with a final score of ${score}.`;
  resultModal.classList.remove("hidden");
  turnIndicator.textContent="MISSION COMPLETE"; objective.textContent="All enemy territory captured.";
}

function lose(reason){
  gameOver=true; playerTurn=false;
  resultIcon.textContent="!"; resultTitle.textContent="Defeat";
  resultText.textContent=`${reason} Final score: ${score}.`;
  resultModal.classList.remove("hidden");
  turnIndicator.textContent="MISSION FAILED"; objective.textContent="Restart the mission and try a new strategy.";
}

attackBtn.addEventListener("click",()=>{
  if(selected===null) return;
  const target=neighbors(selected).find(i=>cells[i].owner!=="player");
  if(target!==undefined) attack(target);
});
fortifyBtn.addEventListener("click",fortify);
endTurnBtn.addEventListener("click",endTurn);
restartBtn.addEventListener("click",initialState);
playAgainBtn.addEventListener("click",initialState);

document.addEventListener("keydown",(e)=>{
  if(gameOver) return;
  if(e.key.toLowerCase()==="r") initialState();
  if(e.key==="Enter" && selected!==null && !attackBtn.disabled) attackBtn.click();
  if(e.key.toLowerCase()==="f" && !fortifyBtn.disabled) fortify();
  if(e.key.toLowerCase()==="e" && !endTurnBtn.disabled) endTurn();
});

initialState();


}
function begin(){poster.hidden=true;gm.hidden=false;if(!booted){booted=true;var s=document.createElement("style");s.textContent=LOOK;document.head.appendChild(s);boot();}else{var r=document.getElementById("restartBtn");if(r)r.click();}}
poster.addEventListener("click",begin);
var nb=document.getElementById("new");if(nb)nb.addEventListener("click",begin);
})();
