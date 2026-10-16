/* Simulation - game logic + its own look. Layout lives in style.css; page shell lives in the HTML. */
(function(){"use strict";
var gm=document.getElementById("gm"),poster=document.getElementById("poster"),booted=false;
var LOOK=".gm *{box-sizing:border-box}.gm{\n  --teal:#16B8C4;--orange:#FFB84D;\n  --success:#22C55E;--danger:#EF5B5B;\n  \n  --game:#111827;--game2:#1F2937;\n}.gm button{font:inherit}.gm button{cursor:pointer}.gm .page{max-width:1180px;margin:auto;padding:28px 24px 70px}.gm h2,.gm h3,.gm p{margin-top:0}.gm .game-shell{background:#fff;border:1px solid var(--border);border-radius:20px;overflow:hidden;box-shadow:0 12px 35px rgba(23,27,45,.07)}.gm .game-topbar{padding:15px 18px;display:flex;gap:10px;align-items:center;border-bottom:1px solid var(--border);flex-wrap:wrap}.gm .stat{min-width:115px;padding:4px 12px;border-right:1px solid var(--border)}.gm .stat-label{display:block;font-size:12px;color:var(--muted);font-weight:700;text-transform:uppercase;letter-spacing:.04em}.gm .stat strong{font-size:21px;line-height:1.25}.gm .restart-button{margin-left:auto;border:1px solid var(--border);background:#fff;color:var(--text);border-radius:10px;height:44px;padding:0 17px;font-weight:800}.gm .restart-button:hover{border-color:#B8BAE8;color:var(--brand-dark)}.gm .game-area{display:grid;grid-template-columns:minmax(0,1.35fr) minmax(330px,.85fr);background:var(--game)}.gm .town-view{min-height:560px;position:relative;overflow:hidden;background:#8EC7D1}.gm .sky{position:absolute;inset:0 0 47%;background:#9ED6E1}.gm .ground{position:absolute;left:0;right:0;top:53%;bottom:0;background:#78A96B}.gm .road{position:absolute;background:#A79F91;box-shadow:inset 0 0 0 2px rgba(255,255,255,.12)}.gm .road-a{width:100%;height:72px;top:59%;transform:rotate(-4deg)}.gm .road-b{height:100%;width:58px;left:59%;top:40%;transform:rotate(3deg)}.gm .river{position:absolute;width:31%;height:120%;left:-9%;top:29%;background:#4FABC0;transform:rotate(10deg);opacity:.95}.gm .town-label{position:absolute;top:20px;left:22px;color:rgba(255,255,255,.9);font-size:12px;font-weight:800;letter-spacing:.13em;text-shadow:0 1px 2px rgba(0,0,0,.2)}.gm .town-objects{position:absolute;inset:0}.gm .object{position:absolute;display:grid;place-items:center;border-radius:7px;box-shadow:0 3px 7px rgba(0,0,0,.14)}.gm .house{width:54px;height:42px;background:#F7D58C;border:3px solid #A96C45}.gm .house:before{content:\"\";position:absolute;width:42px;height:27px;background:#C95F55;transform:rotate(45deg);top:-15px;border-radius:4px}.gm .house:after{content:\"\";position:absolute;width:10px;height:17px;background:#6E7C8C;bottom:0}.gm .factory{width:70px;height:58px;background:#7A8492;border:3px solid #525C6A}.gm .factory:before{content:\"\";position:absolute;width:14px;height:45px;background:#606B79;right:8px;top:-28px}.gm .park{width:68px;height:52px;background:#65A95D;border:3px solid #39773C;border-radius:18px}.gm .park:before,.gm .park:after{content:\"\";position:absolute;background:#3D873D;border-radius:50%;width:26px;height:26px}.gm .park:before{left:7px;top:-8px}.gm .park:after{right:7px;top:-13px}.gm .power{width:58px;height:58px;background:#E8C94F;border:3px solid #927D25;clip-path:polygon(48% 0,100% 0,70% 40%,100% 40%,32% 100%,46% 54%,15% 54%)}.gm .object.new{animation:pop .3s ease}@keyframes pop{from{transform:scale(.5);opacity:.1}to{transform:scale(1);opacity:1}}.gm .event-toast{position:absolute;left:22px;right:22px;bottom:22px;padding:12px 15px;background:rgba(17,24,39,.9);color:#fff;border-radius:12px;font-size:14px;opacity:0;transform:translateY(8px);transition:.25s;pointer-events:none}.gm .event-toast.show{opacity:1;transform:translateY(0)}.gm .control-panel{background:#fff;padding:24px}.gm .panel-heading{display:flex;justify-content:space-between;align-items:flex-start;gap:12px;margin-bottom:20px}.gm .panel-heading h2{font-size:24px;margin:2px 0 0;line-height:1.2}.gm .round-badge{background:#F0F1FF;color:var(--brand-dark);padding:6px 9px;border-radius:9px;font-size:12px;font-weight:800;white-space:nowrap}.gm .resource-row{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:17px}.gm .resource-row div{background:#F8F9FC;border:1px solid var(--border);border-radius:10px;padding:9px 10px}.gm .resource-row span{display:block;font-size:12px;color:var(--muted)}.gm .resource-row strong{font-size:18px}.gm .actions{display:grid;gap:9px}.gm .action-card{display:flex;align-items:center;gap:12px;text-align:left;width:100%;min-height:62px;padding:9px 11px;background:#fff;border:1px solid var(--border);border-radius:12px;color:var(--text);transition:.15s}.gm .action-card:hover,.gm .action-card:focus-visible{border-color:#A7A8E8;background:#F8F8FF;transform:translateY(-1px);outline:none}.gm .action-card.selected{border-color:var(--brand);background:#F0F1FF}.gm .action-card:disabled{opacity:.45;cursor:not-allowed;transform:none}.gm .action-icon{width:38px;height:38px;border-radius:10px;display:grid;place-items:center;background:#F3F4F8;color:var(--brand-dark);font-size:20px;font-weight:800;flex:0 0 auto}.gm .action-card strong,.gm .action-card small{display:block}.gm .action-card strong{font-size:15px}.gm .action-card small{font-size:12px;color:var(--muted)}.gm .restart-button:focus-visible{outline:3px solid rgba(91,92,226,.22);outline-offset:2px}.gm .hint{font-size:12px;color:var(--muted);line-height:1.5;margin:10px 2px 0}.gm .game-status{padding:13px 18px;background:#FBFBFD;border-top:1px solid var(--border);font-size:14px;color:var(--muted)}.gm .game-status.good{color:#16753A}.gm .game-status.bad{color:#A62F2F}.gm .instruction-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;margin-top:22px}.gm .instruction-grid>div{background:#fff;border:1px solid var(--border);border-radius:14px;padding:20px}.gm .instruction-grid h3{font-size:19px;margin-bottom:6px}.gm .instruction-grid p{font-size:15px;margin:0}.gm .tips{padding-left:22px;color:#4E5668}.gm .tips li{margin:7px 0}@media(max-width:850px){.gm .game-area{grid-template-columns:1fr}.gm .town-view{min-height:470px}.gm .control-panel{padding:20px}.gm .instruction-grid{grid-template-columns:1fr}}@media(max-width:600px){.gm .page{padding:22px 14px 55px}.gm .game-topbar{padding:10px;gap:0}.gm .stat{flex:1;min-width:25%;padding:3px 8px}.gm .stat:nth-child(4){border-right:0}.gm .stat strong{font-size:18px}.gm .restart-button{width:100%;margin:8px 0 0}.gm .town-view{min-height:400px}.gm .town-label{left:15px}.gm .event-toast{left:12px;right:12px;bottom:12px}.gm .control-panel{padding:17px}.gm .panel-heading h2{font-size:22px}.gm .resource-row div{padding:8px}.gm .resource-row strong{font-size:17px}.gm .action-card{min-height:60px}}@media(prefers-reduced-motion:reduce){.gm *{scroll-behavior:auto!important;transition:none!important;animation:none!important}}";
function __ready(f){f()}
function boot(){
(() => {
  "use strict";

  const initialState = {
    day: 1, money: 1000, population: 25, happiness: 70,
    jobs: 12, energy: 65, services: 55, homes: 3, factories: 1, parks: 1, power: 1,
    gameOver: false, score: 0, selected: null
  };

  let state = {...initialState};

  const $ = (id) => document.getElementById(id);
  const els = {
    day: $("dayValue"), money: $("moneyValue"), population: $("populationValue"),
    happiness: $("happinessValue"), jobs: $("jobsValue"), energy: $("energyValue"),
    services: $("servicesValue"), round: $("roundBadge"), status: $("gameStatus"),
    toast: $("eventToast"), objects: $("townObjects"), advance: $("advanceButton"),
    restart: $("restartButton"), actions: [...document.querySelectorAll(".action-card")]
  };

  const actions = {
    homes: {cost: 120, label: "Homes built.", effect: () => {
      state.homes++; state.population += 8; state.happiness = clamp(state.happiness - 1, 0, 100);
    }},
    jobs: {cost: 150, label: "A new local business opened.", effect: () => {
      state.factories++; state.jobs += 10; state.money -= 30;
    }},
    park: {cost: 180, label: "A new park improved community life.", effect: () => {
      state.parks++; state.happiness = clamp(state.happiness + 10, 0, 100);
    }},
    power: {cost: 220, label: "Power capacity upgraded.", effect: () => {
      state.power++; state.energy = clamp(state.energy + 18, 0, 100);
    }},
    services: {cost: 200, label: "Town services improved.", effect: () => {
      state.services = clamp(state.services + 16, 0, 100); state.happiness = clamp(state.happiness + 3, 0, 100);
    }}
  };

  const events = [
    {text:"A local festival brought extra visitors.", money:90, happiness:5},
    {text:"A storm damaged town infrastructure.", money:-120, energy:-10},
    {text:"Residents volunteered for a cleanup.", happiness:7, services:5},
    {text:"A busy week increased local tax revenue.", money:140},
    {text:"A water-main repair disrupted services.", money:-80, services:-8},
    {text:"A quiet week helped the town recover.", energy:6, happiness:3}
  ];

  function clamp(n, min, max) { return Math.max(min, Math.min(max, n)); }
  function money(n) { return `$${Math.max(0, Math.round(n)).toLocaleString()}`; }

  function render() {
    els.day.textContent = state.day;
    els.money.textContent = money(state.money);
    els.population.textContent = state.population;
    els.happiness.textContent = `${state.happiness}%`;
    els.jobs.textContent = state.jobs;
    els.energy.textContent = `${state.energy}%`;
    els.services.textContent = `${state.services}%`;
    els.round.textContent = `Round ${state.day}`;
    els.advance.disabled = state.gameOver;

    els.actions.forEach(btn => {
      const item = actions[btn.dataset.action];
      btn.disabled = state.gameOver || state.money < item.cost;
      btn.classList.toggle("selected", state.selected === btn.dataset.action);
    });

    if (state.gameOver) {
      els.status.textContent = `Game over — final town score: ${state.score.toLocaleString()}. Start a new game to try again.`;
      els.status.className = "game-status bad";
    } else {
      const pressure = state.population > state.jobs * 3 ? "Your town needs more jobs." :
        state.energy < 30 ? "Energy is running low." :
        state.services < 30 ? "Town services are under pressure." :
        state.happiness < 40 ? "Residents are becoming unhappy." :
        "Your town is stable. Choose an action, then end the day.";
      els.status.textContent = pressure;
      els.status.className = `game-status ${state.happiness >= 65 ? "good" : ""}`;
    }
    drawTown();
  }

  function drawTown() {
    els.objects.innerHTML = "";
    const objects = [];
    const houseCount = Math.min(14, state.homes);
    const parkCount = Math.min(4, state.parks);
    const factoryCount = Math.min(4, state.factories);
    const powerCount = Math.min(3, state.power);

    for (let i=0;i<houseCount;i++) objects.push(["house", 14 + (i%5)*13 + (Math.floor(i/5)*3), 48 + Math.floor(i/5)*13]);
    for (let i=0;i<parkCount;i++) objects.push(["park", 20 + i*17, 77 - (i%2)*11]);
    for (let i=0;i<factoryCount;i++) objects.push(["factory", 72 + (i%2)*12, 70 + Math.floor(i/2)*13]);
    for (let i=0;i<powerCount;i++) objects.push(["power", 77 + i*7, 30 + (i%2)*12]);

    objects.forEach(([type,x,y], i) => {
      const el = document.createElement("div");
      el.className = `object ${type}`;
      el.style.left = `${x}%`;
      el.style.top = `${y}%`;
      el.setAttribute("aria-hidden","true");
      if (i === objects.length - 1 && state.selected) el.classList.add("new");
      els.objects.appendChild(el);
    });
  }

  function chooseAction(name) {
    if (state.gameOver) return;
    const item = actions[name];
    if (state.money < item.cost) {
      showToast("Not enough money for that action.");
      return;
    }
    if (state.selected) {
      showToast("One action is already selected. End the day or choose another action.");
      return;
    }
    state.money -= item.cost;
    item.effect();
    state.selected = name;
    showToast(item.label);
    render();
  }

  function advanceDay() {
    if (state.gameOver) return;
    if (!state.selected) {
      showToast("Choose one action before ending the day.");
      return;
    }

    const selected = state.selected;
    state.selected = null;

    // Daily economy: taxes from residents, wages/services and infrastructure upkeep.
    const taxIncome = Math.max(45, Math.round(state.population * 4.5));
    const upkeep = Math.round(state.population * 1.2 + state.factories * 12 + state.parks * 7 + state.power * 8);
    state.money += taxIncome - upkeep;

    // Resource pressure.
    state.energy = clamp(state.energy - Math.max(3, Math.ceil(state.population / 18)) + state.power * 2, 0, 100);
    state.services = clamp(state.services - Math.max(1, Math.ceil(state.population / 28)) + (state.factories > 0 ? 1 : 0), 0, 100);

    const jobRatio = state.jobs / Math.max(1, state.population);
    let happinessChange = 0;
    if (jobRatio < 0.35) happinessChange -= 7;
    else if (jobRatio > 0.6) happinessChange += 3;
    if (state.energy < 35) happinessChange -= 7;
    else if (state.energy > 70) happinessChange += 2;
    if (state.services < 35) happinessChange -= 6;
    else if (state.services > 70) happinessChange += 2;
    if (state.population > state.jobs * 3) happinessChange -= 4;

    state.happiness = clamp(state.happiness + happinessChange, 0, 100);

    const event = events[Math.floor(Math.random() * events.length)];
    state.money += event.money || 0;
    state.happiness = clamp(state.happiness + (event.happiness || 0), 0, 100);
    state.energy = clamp(state.energy + (event.energy || 0), 0, 100);
    state.services = clamp(state.services + (event.services || 0), 0, 100);

    // Small growth only when the town has enough jobs, services and happiness.
    if (state.happiness >= 55 && state.services >= 45 && state.energy >= 35 && state.jobs >= Math.ceil(state.population * 0.35)) {
      state.population += Math.max(1, Math.floor(state.population * 0.03));
    }

    state.day++;
    state.score = Math.max(0, Math.round(state.population * 10 + state.happiness * 8 + state.money / 5 + state.day * 15));

    showToast(event.text);
    checkGameOver();
    render();
  }

  function checkGameOver() {
    if (state.money <= 0) {
      state.gameOver = true;
      state.score = Math.max(0, Math.round(state.population * 10 + state.happiness * 8 + state.day * 15));
      return;
    }
    if (state.happiness <= 20) {
      state.gameOver = true;
      state.score = Math.max(0, Math.round(state.population * 10 + state.happiness * 8 + state.money / 5 + state.day * 15));
      return;
    }
    if (state.day >= 31) {
      state.gameOver = true;
      state.score = Math.round(state.population * 12 + state.happiness * 10 + state.money / 4 + state.day * 20);
      showToast("30 days survived! Your town simulation is complete.");
    }
  }

  let toastTimer;
  function showToast(text) {
    els.toast.textContent = text;
    els.toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => els.toast.classList.remove("show"), 2400);
  }

  function restart() {
    state = {...initialState};
    els.toast.classList.remove("show");
    render();
    showToast("A new town is ready.");
  }

  els.actions.forEach(btn => btn.addEventListener("click", () => chooseAction(btn.dataset.action)));
  els.advance.addEventListener("click", advanceDay);
  els.restart.addEventListener("click", restart);

  document.addEventListener("keydown", e => {
    if (e.key === "Enter" && document.activeElement?.classList.contains("action-card")) {
      document.activeElement.click();
    }
    if (e.key.toLowerCase() === "n") restart();
  });

  render();
})();

}
function begin(){poster.hidden=true;gm.hidden=false;if(!booted){booted=true;var s=document.createElement("style");s.textContent=LOOK;document.head.appendChild(s);boot();}else{var r=document.getElementById("restartButton");if(r)r.click();}}
poster.addEventListener("click",begin);
var nb=document.getElementById("new");if(nb)nb.addEventListener("click",begin);
})();
