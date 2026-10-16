/* Base Building - game logic + its own look. Layout lives in style.css; page shell lives in the HTML. */
(function(){"use strict";
var gm=document.getElementById("gm"),poster=document.getElementById("poster"),booted=false;
var LOOK=".gm *{box-sizing:border-box}.gm .page{max-width:1160px;margin:auto;padding:28px 20px 70px}.gm .game-shell{background:#111827;border-radius:20px;padding:16px;box-shadow:0 12px 35px rgba(17,24,39,.12)}.gm .game-topbar{display:grid;grid-template-columns:repeat(4,1fr) 1.1fr;gap:10px;margin-bottom:12px}.gm .stat,.gm .wave-stat{background:#1F2937;border-radius:12px;padding:9px 12px;color:#fff;display:flex;justify-content:space-between;align-items:center}.gm .stat span,.gm .wave-stat span{color:#9CA3AF;font-size:13px}.gm .stat strong,.gm .wave-stat strong{font-size:20px}.gm .wave-stat{background:#5B5CE2}.gm .wave-stat span{color:#E7E7FF}.gm .game-layout{display:grid;grid-template-columns:minmax(0,1fr) 290px;gap:14px}.gm .board-wrap{min-width:0}.gm .board-header{background:#1F2937;color:#fff;border-radius:13px 13px 0 0;padding:11px 14px;display:flex;justify-content:space-between;align-items:center}.gm .board-header strong{display:block;font-size:17px}.gm .board-header span:not(.timer){color:#9CA3AF;font-size:13px}.gm .timer{font-weight:800;font-size:22px;background:#111827;padding:2px 9px;border-radius:8px}.gm .board{display:grid;grid-template-columns:repeat(10,1fr);aspect-ratio:1/0.66;background:#273548;padding:6px;gap:3px;touch-action:manipulation}.gm .tile{position:relative;border:1px solid #34445A;background:#30445B;border-radius:4px;cursor:pointer;min-width:0}.gm .tile:hover{background:#3A506A}.gm .tile.center{background:#293B50}.gm .building{position:absolute;inset:7%;display:grid;place-items:center;border-radius:5px;color:#fff;font-size:clamp(13px,2.5vw,25px);font-weight:800;box-shadow:inset 0 -4px 0 rgba(0,0,0,.16)}.gm .house{background:#B96B4D}.gm .lumber{background:#4E8B65}.gm .quarry{background:#69758A}.gm .farm{background:#D49A3A}.gm .tower{background:#5B5CE2}.gm .wall{background:#8B6B4E}.gm .building::after{content:\"\";position:absolute;inset:0;border:1px solid rgba(255,255,255,.2);border-radius:5px}.gm .game-message{min-height:42px;background:#1F2937;color:#D1D5DB;border-radius:0 0 13px 13px;padding:8px 13px;font-size:14px}.gm .controls-panel{background:#fff;border-radius:15px;padding:17px}.gm .controls-panel h2{font-size:22px;margin:0 0 10px}.gm .build-list{display:grid;gap:7px}.gm .build-btn{border:1px solid #E5E7EF;background:#fff;border-radius:10px;padding:8px;display:grid;grid-template-columns:34px 1fr auto;gap:8px;align-items:center;text-align:left;cursor:pointer;color:#171B2D}.gm .build-btn:hover{border-color:#BFC1F4}.gm .build-btn.selected{border-color:#5B5CE2;box-shadow:0 0 0 2px rgba(91,92,226,.12)}.gm .build-btn:disabled{opacity:.45;cursor:not-allowed}.gm .build-btn b{display:block;font-size:14px;line-height:1.15}.gm .build-btn small{display:block;color:#667085;font-size:11px;line-height:1.2;margin-top:2px}.gm .build-btn em{font-style:normal;font-size:12px;font-weight:800;color:#667085;white-space:nowrap}.gm .building-icon{width:32px;height:32px;border-radius:8px;color:#fff;display:grid;place-items:center;font-weight:800}.gm .house-icon{background:#B96B4D}.gm .lumber-icon{background:#4E8B65}.gm .quarry-icon{background:#69758A}.gm .farm-icon{background:#D49A3A}.gm .tower-icon{background:#5B5CE2}.gm .wall-icon{background:#8B6B4E}.gm .objective{border-top:1px solid #E5E7EF;margin-top:14px;padding-top:12px}.gm .objective h3{font-size:16px;margin:0 0 7px}.gm .status-row{display:flex;justify-content:space-between;font-size:13px;margin:6px 0}.gm .status-row strong{font-weight:800}.gm .meter{height:7px;background:#E5E7EF;border-radius:99px;overflow:hidden}.gm .meter i{display:block;height:100%;width:100%;background:#22C55E;transition:width .25s}.gm .primary-btn,.gm .secondary-btn{width:100%;height:46px;border:0;border-radius:10px;font:700 15px inherit;cursor:pointer;margin-top:13px}.gm .primary-btn{background:#5B5CE2;color:#fff}.gm .primary-btn:hover{background:#4546B8}.gm .secondary-btn{background:#F1F2F8;color:#4546B8}@media(max-width:820px){.gm .game-layout{grid-template-columns:1fr}.gm .controls-panel{order:2}.gm .game-topbar{grid-template-columns:repeat(3,1fr)}.gm .wave-stat{grid-column:auto}.gm .board{aspect-ratio:1/0.8}}@media(max-width:520px){.gm .page{padding:20px 12px 50px}.gm .game-shell{padding:9px;border-radius:15px}.gm .game-topbar{grid-template-columns:repeat(2,1fr)}.gm .wave-stat{grid-column:span 2}.gm .board{grid-template-columns:repeat(10,1fr);gap:2px;padding:4px;aspect-ratio:1/1}.gm .building{inset:8%;font-size:15px}.gm .board-header{padding:9px 10px}.gm .board-header span:not(.timer){font-size:11px}.gm .timer{font-size:18px}.gm .build-btn{min-height:53px}}.gm button:focus-visible,.gm summary:focus-visible,.gm .tile:focus-visible{outline:3px solid #FFB84D;outline-offset:2px}";
function __ready(f){f()}
function boot(){
(() => {
  "use strict";

  const SIZE = 10;
  const BUILDINGS = {
    house:  {name:"House", cost:{wood:25,stone:0,food:0}, icon:"⌂", income:{food:0,wood:0,stone:0}, defense:0, pop:2},
    lumber: {name:"Lumber Camp", cost:{wood:35,stone:0,food:0}, icon:"▥", income:{wood:5,stone:0,food:0}, defense:0, pop:0},
    quarry: {name:"Quarry", cost:{wood:35,stone:0,food:0}, icon:"◆", income:{wood:0,stone:4,food:0}, defense:0, pop:0},
    farm:   {name:"Farm", cost:{wood:30,stone:0,food:0}, icon:"✚", income:{wood:0,stone:0,food:5}, defense:0, pop:0},
    tower:  {name:"Defense Tower", cost:{wood:45,stone:0,food:0}, icon:"▲", income:{wood:0,stone:0,food:0}, defense:8, pop:0},
    wall:   {name:"Wall", cost:{wood:20,stone:0,food:0}, icon:"▦", income:{wood:0,stone:0,food:0}, defense:4, pop:0}
  };

  let state = { timer: null };

  const $ = id => document.getElementById(id);
  const board = $("board");
  const message = $("message");
  const timerEl = $("timer");
  const phaseTitle = $("phaseTitle");
  const phaseText = $("phaseText");

  function freshState() {
    return {
      resources:{wood:120, stone:90, food:80},
      wave:1, hp:100, defense:20, population:2,
      selected:"house", phase:"build", seconds:30,
      grid:Array(SIZE*SIZE).fill(null),
      timer:null, ended:false, buildingCount:0
    };
  }

  function renderBoard() {
    board.innerHTML = "";
    state.grid.forEach((type, i) => {
      const tile = document.createElement("button");
      tile.type = "button";
      tile.className = "tile" + (i === 44 ? " center" : "");
      tile.setAttribute("role","gridcell");
      tile.setAttribute("aria-label", type ? `${BUILDINGS[type].name}, tile ${i+1}` : `Empty tile ${i+1}`);
      tile.addEventListener("click", () => placeBuilding(i));
      if (type) {
        const b = document.createElement("span");
        b.className = `building ${type}`;
        b.textContent = BUILDINGS[type].icon;
        tile.appendChild(b);
      }
      board.appendChild(tile);
    });
  }

  function updateUI() {
    $("wood").textContent = state.resources.wood;
    $("stone").textContent = state.resources.stone;
    $("food").textContent = state.resources.food;
    $("wave").textContent = state.wave;
    $("hp").textContent = `${state.hp}%`;
    $("hpBar").style.width = `${state.hp}%`;
    $("defense").textContent = state.defense;
    $("population").textContent = state.population;
    timerEl.textContent = state.seconds;

    document.querySelectorAll(".build-btn").forEach(btn => {
      const type = btn.dataset.type;
      btn.classList.toggle("selected", type === state.selected);
      const c = BUILDINGS[type].cost;
      btn.disabled = state.phase !== "build" || state.resources.wood < c.wood;
    });

    if (state.phase === "build") {
      phaseTitle.textContent = "Build Phase";
      phaseText.textContent = "Place buildings before the next attack.";
      $("attackBtn").textContent = "End Build Phase";
    } else if (!state.ended) {
      phaseTitle.textContent = "Enemy Attack";
      phaseText.textContent = "Your base is under attack!";
      $("attackBtn").textContent = "Next Build Phase";
    }
  }

  function setMessage(text) {
    message.textContent = text;
  }

  function selectBuilding(type) {
    if (state.phase !== "build" || state.ended) return;
    state.selected = type;
    setMessage(`Selected ${BUILDINGS[type].name}. Choose an empty tile.`);
    updateUI();
  }

  function placeBuilding(index) {
    if (state.phase !== "build" || state.ended) return;
    if (state.grid[index]) {
      setMessage("That tile is occupied. Choose an empty tile.");
      return;
    }
    // Keep the command center area clear.
    if (index === 44) {
      setMessage("The center tile is reserved for your command center.");
      return;
    }
    const type = state.selected;
    const data = BUILDINGS[type];
    if (state.resources.wood < data.cost.wood) {
      setMessage(`Not enough wood for a ${data.name}.`);
      return;
    }
    state.resources.wood -= data.cost.wood;
    state.grid[index] = type;
    state.buildingCount++;
    state.defense += data.defense;
    state.population += data.pop;
    setMessage(`${data.name} built. Keep preparing your base.`);
    renderBoard();
    updateUI();
  }

  function collectIncome() {
    let wood=0, stone=0, food=0;
    state.grid.forEach(type => {
      if (!type) return;
      const inc = BUILDINGS[type].income;
      wood += inc.wood; stone += inc.stone; food += inc.food;
    });
    // Houses also consume food as population grows.
    const foodUse = Math.max(1, Math.ceil(state.population / 3));
    state.resources.wood += wood;
    state.resources.stone += stone;
    state.resources.food += food - foodUse;
    if (state.resources.food < 0) {
      state.hp = Math.max(0, state.hp + state.resources.food);
      state.resources.food = 0;
      setMessage("Your food ran low, hurting the base.");
    }
  }

  function attack() {
    if (state.ended) return;
    state.phase = "attack";
    clearInterval(state.timer);
    const enemy = 16 + state.wave * 7 + Math.floor(state.wave * 1.8);
    const damage = Math.max(0, enemy - state.defense);
    const blocked = enemy - damage;
    collectIncome();
    if (damage > 0) {
      state.hp = Math.max(0, state.hp - damage);
      setMessage(`Wave ${state.wave} attacked. Defense blocked ${blocked} damage; ${damage} damage got through.`);
    } else {
      setMessage(`Wave ${state.wave} defeated your attackers. Your defense held perfectly.`);
    }

    if (state.hp <= 0) {
      state.ended = true;
      phaseTitle.textContent = "Base Destroyed";
      phaseText.textContent = "Your command center has fallen.";
      timerEl.textContent = "0";
      $("attackBtn").disabled = true;
      setMessage(`Game over after wave ${state.wave}. Your final defense was ${state.defense}.`);
      updateUI();
      return;
    }

    state.wave++;
    updateUI();
    setTimeout(() => {
      if (state.ended) return;
      state.phase = "build";
      state.seconds = Math.max(14, 30 - Math.floor(state.wave / 2));
      setMessage(`Wave cleared. You gained resources. Prepare for wave ${state.wave}.`);
      startTimer();
      updateUI();
    }, 900);
  }

  function startTimer() {
    clearInterval(state.timer);
    state.timer = setInterval(() => {
      if (state.phase !== "build" || state.ended) return;
      state.seconds--;
      timerEl.textContent = state.seconds;
      if (state.seconds <= 0) attack();
    }, 1000);
  }

  function restart() {
    if (state.timer) clearInterval(state.timer);
    state = freshState();
    $("attackBtn").disabled = false;
    renderBoard();
    updateUI();
    setMessage("Choose a building, then click an empty tile.");
    startTimer();
  }

  document.querySelectorAll(".build-btn").forEach(btn => {
    btn.addEventListener("click", () => selectBuilding(btn.dataset.type));
  });

  $("attackBtn").addEventListener("click", () => {
    if (state.phase === "build") attack();
    else if (!state.ended) {
      state.phase = "build";
      state.seconds = Math.max(14, 30 - Math.floor(state.wave / 2));
      startTimer();
      updateUI();
      setMessage(`Build phase started. Prepare for wave ${state.wave}.`);
    }
  });

  $("restartBtn").addEventListener("click", restart);
  restart();
})();

}
function begin(){poster.hidden=true;gm.hidden=false;if(!booted){booted=true;var s=document.createElement("style");s.textContent=LOOK;document.head.appendChild(s);boot();}else{var r=document.getElementById("restartBtn");if(r)r.click();}}
poster.addEventListener("click",begin);
var nb=document.getElementById("new");if(nb)nb.addEventListener("click",begin);
})();
