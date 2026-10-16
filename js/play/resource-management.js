/* Resource Management - game logic + its own look. Layout lives in style.css; page shell lives in the HTML. */
(function(){"use strict";
var gm=document.getElementById("gm"),poster=document.getElementById("poster"),booted=false;
var LOOK=".gm{\n  \n  \n  --ink: #171b2d;\n  \n  --page: #f6f7fb;\n  \n  \n  --forest: #25443a;\n  --forest-2: #31594b;\n  --cream: #f4f0e5;\n  --gold: #e9a83a;\n  --danger: #ef5b5b;\n  --success: #22a660;\n  \n}.gm *{ box-sizing: border-box; }.gm button,.gm input{ font: inherit; }.gm button{ cursor: pointer; }.gm .page-shell{ width: min(1180px, calc(100% - 32px)); margin: auto; }.gm .kicker{ margin: 0 0 6px; color: var(--brand-dark); font-size: 14px; font-weight: 800; letter-spacing: .09em; text-transform: uppercase; }.gm .game-card{ overflow: hidden; color: #eef7f1; background: var(--forest); border: 1px solid rgba(255,255,255,.1); border-radius: 20px; box-shadow: var(--shadow); }.gm .game-topbar{ min-height: 84px; display: grid; grid-template-columns: 1fr auto auto; gap: 26px; align-items: center; padding: 16px 22px; background: #1e3931; border-bottom: 1px solid rgba(255,255,255,.1); }.gm .season-label,.gm .season-value{ margin: 0; }.gm .season-label{ color: #a9c0b7; font-size: 12px; font-weight: 800; letter-spacing: .07em; text-transform: uppercase; }.gm .season-value{ font-size: 20px; font-weight: 800; }.gm .turn-block{ display: flex; gap: 8px; align-items: baseline; padding-right: 24px; border-right: 1px solid rgba(255,255,255,.14); }.gm .turn-block span{ color: #b9cbc4; font-size: 14px; }.gm .turn-block strong{ font-size: 20px; }.gm .sound-button{ min-height: 42px; padding: 0 14px; color: #e6f2ec; background: transparent; border: 1px solid #56786b; border-radius: 10px; font-size: 14px; font-weight: 700; }.gm .game-layout{ display: grid; grid-template-columns: minmax(0, 1.8fr) minmax(270px, .72fr); }.gm .main-panel{ min-width: 0; padding: 22px; border-right: 1px solid rgba(255,255,255,.1); }.gm .side-panel{ padding: 22px; background: rgba(8, 25, 21, .19); }.gm .resource-grid{ display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 24px; }.gm .resource{ min-width: 0; display: grid; grid-template-columns: 36px 1fr auto; gap: 9px; align-items: center; padding: 12px; color: #21342e; background: var(--cream); border-radius: 12px; }.gm .resource > span{ display: grid; place-items: center; width: 34px; height: 34px; background: #fff; border-radius: 9px; }.gm .resource small,.gm .resource strong{ display: block; line-height: 1.2; }.gm .resource small{ color: #66746f; font-size: 11px; font-weight: 800; letter-spacing: .05em; text-transform: uppercase; }.gm .resource strong{ margin-top: 3px; font-size: 21px; }.gm .resource em{ color: var(--success); font-size: 12px; font-style: normal; font-weight: 800; }.gm .resource.warning em{ color: #b46a11; }.gm .resource.danger{ outline: 2px solid var(--danger); }.gm .resource.danger em{ color: #c33636; }.gm .section-heading{ display: flex; align-items: end; justify-content: space-between; margin-bottom: 12px; }.gm .section-heading h2{ margin: 0; color: #fff; font-size: 25px; line-height: 1.2; }.gm .section-heading .kicker{ color: #a9c0b7; font-size: 11px; }.gm .action-points{ margin: 0; padding: 7px 11px; color: #173429; background: #cde9d6; border-radius: 999px; font-size: 13px; font-weight: 800; }.gm .building-grid{ display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }.gm .action-card{ position: relative; min-height: 145px; padding: 16px; color: #20362f; text-align: left; background: #fff; border: 2px solid transparent; border-radius: 14px; transition: transform .16s, border-color .16s, box-shadow .16s; }.gm .action-card:hover:not(:disabled),.gm .action-card:focus-visible{ z-index: 1; transform: translateY(-2px); border-color: #8cc5a6; box-shadow: 0 10px 26px rgba(5,20,15,.2); outline: none; }.gm .action-card:disabled{ cursor: not-allowed; opacity: .48; }.gm .action-card .hotkey{ position: absolute; top: 12px; right: 12px; display: grid; place-items: center; width: 23px; height: 23px; color: #64746d; background: #eef1ef; border-radius: 6px; font-size: 11px; font-weight: 800; }.gm .action-title{ display: flex; gap: 10px; align-items: center; margin: 0 30px 7px 0; font-size: 18px; line-height: 1.2; }.gm .action-icon{ display: grid; place-items: center; width: 36px; height: 36px; flex: 0 0 36px; background: #edf5f0; border-radius: 9px; font-size: 20px; }.gm .action-card p{ min-height: 38px; margin: 0 0 9px; color: #6a756f; font-size: 13px; line-height: 1.45; }.gm .costs{ display: flex; flex-wrap: wrap; gap: 6px; }.gm .costs span{ padding: 3px 7px; color: #45564f; background: #f1f3f2; border-radius: 5px; font-size: 11px; font-weight: 800; }.gm .owned{ position: absolute; right: 12px; bottom: 12px; color: #32634f; font-size: 11px; font-weight: 800; }.gm .action-card.flash{ animation: cardFlash .4s ease; }@keyframes cardFlash{ 50% { background: #dff4e6; } }.gm .objective-card,.gm .forecast-card,.gm .log-card{ margin-bottom: 14px; padding: 17px; background: rgba(255,255,255,.08); border: 1px solid rgba(255,255,255,.1); border-radius: 14px; }.gm .side-panel h2{ margin: 0; color: #fff; font-size: 20px; line-height: 1.25; }.gm .side-panel .kicker{ color: #9fb9af; font-size: 10px; }.gm .goal-list{ padding: 0; margin: 15px 0; list-style: none; }.gm .goal-list li{ display: flex; justify-content: space-between; gap: 10px; padding: 8px 0; color: #c6d7d0; border-bottom: 1px solid rgba(255,255,255,.08); font-size: 13px; }.gm .goal-list li strong{ color: #fff; }.gm .goal-list li.complete span::before{ content: \"\u2713 \"; color: #65d995; font-weight: 800; }.gm .score-row,.gm .upkeep{ display: flex; justify-content: space-between; gap: 12px; align-items: center; padding-top: 4px; color: #b8cbc3; font-size: 13px; }.gm .score-row strong{ color: #ffd37c; font-size: 23px; }.gm .forecast-header{ display: flex; justify-content: space-between; align-items: center; }.gm .forecast-card > p{ min-height: 44px; margin: 10px 0; color: #c3d3cd; font-size: 13px; line-height: 1.45; }.gm .upkeep{ padding-top: 10px; border-top: 1px solid rgba(255,255,255,.08); }.gm .upkeep strong{ color: #fff; font-size: 12px; }.gm .log-card h2{ margin-bottom: 10px; font-size: 16px; }.gm .log-card ol{ height: 112px; padding: 0; margin: 0; overflow-y: auto; list-style: none; scrollbar-width: thin; }.gm .log-card li{ padding: 4px 0; color: #becfc8; font-size: 12px; line-height: 1.35; }.gm .log-card li::before{ content: \"\u2022\"; margin-right: 7px; color: #f5bf5f; }.gm .log-card li:first-child{ color: #fff; }.gm .end-turn-button,.gm .new-game-button{ width: 100%; min-height: 49px; border-radius: 11px; font-weight: 800; }.gm .end-turn-button{ display: flex; justify-content: space-between; align-items: center; padding: 0 17px; color: #20362f; background: #f2bd58; border: 0; }.gm .end-turn-button:hover:not(:disabled){ background: #ffd071; }.gm .end-turn-button:disabled{ cursor: not-allowed; opacity: .48; }.gm .new-game-button{ margin-top: 9px; color: #dceae4; background: transparent; border: 1px solid #557568; }.gm button:focus-visible,.gm summary:focus-visible{ outline: 3px solid #ffcc69; outline-offset: 3px; }.gm .article-section h2{ margin: 0 0 18px; font-size: clamp(30px, 4vw, 36px); line-height: 1.2; letter-spacing: -.02em; }.gm .article-section > p{ color: var(--muted); }.gm .steps{ padding: 0; margin: 25px 0 0; list-style: none; counter-reset: step; }.gm .steps li{ position: relative; padding: 0 0 20px 48px; color: var(--muted); }.gm .steps li::before{ counter-increment: step; content: counter(step); position: absolute; left: 0; top: 1px; display: grid; place-items: center; width: 31px; height: 31px; color: #fff; background: var(--brand); border-radius: 9px; font-size: 14px; font-weight: 800; }.gm .steps strong{ color: var(--ink); }.gm .controls-card{ align-self: start; padding: 24px; background: #fff; border: 1px solid var(--border); border-radius: 16px; box-shadow: 0 10px 30px rgba(23,27,45,.06); }.gm .controls-card h3{ margin: 0 0 13px; font-size: 22px; }.gm .controls-card dl{ margin: 0; }.gm .controls-card dl > div{ display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-top: 1px solid var(--border); }.gm .controls-card dt,.gm .controls-card dd{ margin: 0; }.gm .controls-card dd{ color: var(--muted); font-size: 14px; }.gm kbd{ padding: 3px 7px; color: #344054; background: #f2f4f7; border: 1px solid #d0d5dd; border-bottom-width: 2px; border-radius: 5px; font-size: 12px; font-weight: 800; }.gm .article-section{ padding: 70px 0; border-top: 1px solid var(--border); }.gm .article-section > p{ max-width: 850px; }.gm .tip-grid{ display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-top: 28px; }.gm .tip-grid article{ padding: 22px; background: #fff; border: 1px solid var(--border); border-radius: 16px; }.gm .tip-grid article > span{ color: var(--brand); font-weight: 800; }.gm .tip-grid h3{ margin: 8px 0 7px; font-size: 20px; }.gm .tip-grid p{ margin: 0; color: var(--muted); font-size: 15px; }.gm details{ background: #fff; border: 1px solid var(--border); border-radius: 12px; margin-top: 12px; }.gm summary{ padding: 17px 20px; cursor: pointer; font-weight: 800; }.gm details p{ padding: 0 20px 18px; margin: 0; color: var(--muted); }.gm dialog{ width: min(470px, calc(100% - 32px)); padding: 30px; color: var(--ink); text-align: center; background: #fff; border: 0; border-radius: 20px; box-shadow: 0 30px 80px rgba(0,0,0,.3); }.gm dialog::backdrop{ background: rgba(13,29,24,.78); backdrop-filter: blur(4px); }.gm .dialog-art{ font-size: 55px; }.gm dialog h2{ margin: 2px 0 10px; font-size: 32px; line-height: 1.15; }.gm dialog > p:not(.eyebrow){ color: var(--muted); }.gm .final-score{ display: flex; justify-content: space-between; align-items: center; margin: 20px 0; padding: 14px 17px; background: #f3f4fa; border-radius: 11px; }.gm .final-score strong{ color: var(--brand); font-size: 26px; }.gm dialog button{ width: 100%; min-height: 48px; color: #fff; background: var(--brand); border: 0; border-radius: 10px; font-weight: 800; }@media (max-width: 900px){.gm .game-layout{ grid-template-columns: 1fr; }.gm .main-panel{ border-right: 0; border-bottom: 1px solid rgba(255,255,255,.1); }.gm .side-panel{ display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }.gm .side-panel > *{ margin: 0; }.gm .log-card{ grid-column: 1 / -1; }.gm .end-turn-button,.gm .new-game-button{ align-self: stretch; }}@media (max-width: 660px){.gm .page-shell{ width: min(100% - 20px, 1180px); }.gm .game-card{ border-radius: 15px; }.gm .game-topbar{ grid-template-columns: 1fr auto; gap: 12px; padding: 13px; }.gm .sound-button{ grid-column: 1 / -1; width: 100%; }.gm .turn-block{ padding-right: 0; border-right: 0; }.gm .main-panel,.gm .side-panel{ padding: 13px; }.gm .resource-grid{ grid-template-columns: repeat(2, 1fr); }.gm .resource{ grid-template-columns: 31px 1fr; padding: 10px; }.gm .resource > span{ width: 30px; height: 30px; }.gm .resource em{ grid-column: 2; }.gm .building-grid{ grid-template-columns: 1fr; }.gm .action-card{ min-height: 128px; }.gm .side-panel{ grid-template-columns: 1fr; }.gm .log-card{ grid-column: auto; }.gm .tip-grid{ grid-template-columns: 1fr; }.gm .article-section{ padding: 55px 4px; }}@media (prefers-reduced-motion: reduce){.gm *,.gm *::before,.gm *::after{ scroll-behavior: auto !important; animation-duration: .01ms !important; transition-duration: .01ms !important; }}";
function __ready(f){f()}
function boot(){
"use strict";

const STORAGE_KEY = "gamesHubResourceManagementV1";
const TOTAL_TURNS = 12;

const actions = [
  { id: "farm", name: "Build Farm", icon: "🌾", description: "+7 food each season", cost: { materials: 6, coins: 4 } },
  { id: "solar", name: "Solar Field", icon: "☀️", description: "+6 energy each season", cost: { materials: 5, coins: 5 } },
  { id: "workshop", name: "Workshop", icon: "⚒️", description: "+5 materials, uses 2 energy", cost: { materials: 4, coins: 7 } },
  { id: "market", name: "Open Market", icon: "🏪", description: "+8 coins and +1 person", cost: { food: 3, materials: 3 } },
  { id: "homes", name: "Build Homes", icon: "🏠", description: "+3 people and +3 happiness", cost: { materials: 8, coins: 6 } },
  { id: "festival", name: "Hold Festival", icon: "🎉", description: "+12 happiness immediately", cost: { food: 5, coins: 5 } }
];

const events = [
  { icon: "☀️", name: "Mild skies", text: "Mild skies. Normal production expected.", apply: () => ({}) },
  { icon: "🌧️", name: "Spring rain", text: "Helpful rain gives every farm +3 food this season.", apply: s => ({ food: s.buildings.farm * 3 }) },
  { icon: "💨", name: "Strong winds", text: "Strong winds boost every solar field by +2 energy.", apply: s => ({ energy: s.buildings.solar * 2 }) },
  { icon: "📦", name: "Trade caravan", text: "A trade caravan pays 6 coins for local goods.", apply: () => ({ coins: 6 }) },
  { icon: "🛠️", name: "Broken tools", text: "Repairs consume 3 materials this season.", apply: () => ({ materials: -3 }) },
  { icon: "🌡️", name: "Heat wave", text: "The heat wave reduces food stores by 4.", apply: () => ({ food: -4 }) },
  { icon: "🎻", name: "Traveling musicians", text: "Visitors raise happiness by 6.", apply: () => ({ happiness: 6 }) },
  { icon: "🪙", name: "Tax adjustment", text: "The council collects 4 coins for repairs.", apply: () => ({ coins: -4 }) }
];

const seasons = [
  { name: "Spring", icon: "🌱" },
  { name: "Summer", icon: "☀️" },
  { name: "Autumn", icon: "🍂" },
  { name: "Winter", icon: "❄️" }
];

const initialState = () => ({
  turn: 1,
  actionsLeft: 2,
  food: 18,
  energy: 14,
  materials: 16,
  coins: 22,
  people: 12,
  happiness: 58,
  score: 0,
  buildings: { farm: 0, solar: 0, workshop: 0, market: 0, homes: 0, festival: 0 },
  eventIndex: 0,
  log: ["The council has entrusted the settlement to you."],
  gameOver: false,
  sound: true
});

let state = loadState();
const $ = id => document.getElementById(id);

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved && saved.turn >= 1 && saved.turn <= TOTAL_TURNS && saved.buildings && !saved.gameOver) {
      return { ...initialState(), ...saved };
    }
  } catch (error) {
    console.warn("Saved game could not be loaded.", error);
  }
  return initialState();
}

function saveState() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (error) { /* Game remains playable without storage. */ }
}

function getSeason() { return seasons[(state.turn - 1) % seasons.length]; }
function getYear() { return Math.floor((state.turn - 1) / 4) + 1; }
function clamp(value, min, max) { return Math.min(max, Math.max(min, value)); }
function upkeep() { return { food: Math.ceil(state.people / 2), energy: Math.ceil(state.people / 3) }; }

function canAfford(action) {
  return state.actionsLeft > 0 && Object.entries(action.cost).every(([resource, amount]) => state[resource] >= amount);
}

function formatCosts(cost) {
  const icons = { food: "🌾", energy: "⚡", materials: "🪵", coins: "●" };
  return Object.entries(cost).map(([resource, amount]) => `<span>${icons[resource]} ${amount} ${resource}</span>`).join("");
}

function buildActionCards() {
  $("buildingGrid").innerHTML = actions.map((action, index) => `
    <button class="action-card" type="button" data-action="${action.id}" aria-label="${action.name}. ${action.description}">
      <span class="hotkey" aria-hidden="true">${index + 1}</span>
      <h3 class="action-title"><span class="action-icon" aria-hidden="true">${action.icon}</span>${action.name}</h3>
      <p>${action.description}</p>
      <span class="costs">${formatCosts(action.cost)}</span>
      <span class="owned" data-owned="${action.id}"></span>
    </button>`).join("");

  $("buildingGrid").addEventListener("click", event => {
    const button = event.target.closest("[data-action]");
    if (button) performAction(button.dataset.action, button);
  });
}

function performAction(id, button) {
  if (state.gameOver) return;
  const action = actions.find(item => item.id === id);
  if (!action || !canAfford(action)) {
    addLog(state.actionsLeft < 1 ? "No actions remain this season." : `Not enough resources for ${action ? action.name : "that action"}.`);
    playTone(145, .08);
    render();
    return;
  }

  Object.entries(action.cost).forEach(([resource, amount]) => { state[resource] -= amount; });
  state.actionsLeft -= 1;
  state.buildings[id] += 1;

  if (id === "market") { state.coins += 8; state.people += 1; }
  if (id === "homes") { state.people += 3; state.happiness += 3; }
  if (id === "festival") { state.happiness += 12; }
  state.happiness = clamp(state.happiness, 0, 100);
  state.score += 35;
  addLog(`${action.icon} ${action.name} completed.`);
  if (button) { button.classList.remove("flash"); void button.offsetWidth; button.classList.add("flash"); }
  playTone(440, .07);
  saveState();
  render();
}

function endSeason() {
  if (state.gameOver) return;
  const costs = upkeep();
  let production = {
    food: state.buildings.farm * 7,
    energy: state.buildings.solar * 6 - state.buildings.workshop * 2,
    materials: state.buildings.workshop * 5,
    coins: state.buildings.market * 2,
    happiness: 0
  };

  const event = events[state.eventIndex];
  const eventEffect = event.apply(state);
  Object.entries(eventEffect).forEach(([resource, amount]) => { production[resource] = (production[resource] || 0) + amount; });

  state.food += production.food - costs.food;
  state.energy += production.energy - costs.energy;
  state.materials += production.materials;
  state.coins += production.coins;
  state.happiness += production.happiness;

  const shortages = [];
  if (state.food < 0) { shortages.push("food"); state.happiness -= 14; state.people -= 2; state.food = 0; }
  if (state.energy < 0) { shortages.push("energy"); state.happiness -= 10; state.energy = 0; }
  if (state.materials < 0) { shortages.push("materials"); state.materials = 0; }
  if (state.coins < 0) { shortages.push("coins"); state.happiness -= 7; state.coins = 0; }

  if (!shortages.length) {
    state.happiness += 1;
    state.score += 45 + state.people * 2;
    addLog(`${event.icon} ${event.name}: season completed without shortages.`);
  } else {
    state.score = Math.max(0, state.score - shortages.length * 25);
    addLog(`⚠ Shortage: ${shortages.join(" and ")}. Happiness fell.`);
  }

  state.people = Math.max(0, state.people);
  state.happiness = clamp(state.happiness, 0, 100);
  playTone(shortages.length ? 170 : 560, .1);

  if (state.people <= 0 || state.happiness <= 0) {
    finishGame(false, "The settlement could not recover from its shortages. A steadier supply plan may turn the next run around.");
    return;
  }

  if (state.turn >= TOTAL_TURNS) {
    const won = state.people >= 20 && state.happiness >= 60 && state.coins >= 40;
    finishGame(won, won
      ? "You balanced growth, wellbeing, and trade. The council declares your settlement a thriving success."
      : "The settlement survived all 12 seasons, but one or more council objectives were missed. Try a different build order.");
    return;
  }

  state.turn += 1;
  state.actionsLeft = 2;
  state.eventIndex = chooseNextEvent();
  saveState();
  render();
}

function chooseNextEvent() {
  let next = Math.floor(Math.random() * events.length);
  if (next === state.eventIndex && events.length > 1) next = (next + 1) % events.length;
  return next;
}

function finishGame(won, message) {
  state.gameOver = true;
  state.score += won ? 500 : 0;
  try { localStorage.removeItem(STORAGE_KEY); } catch (error) { /* Storage is optional. */ }
  render();
  $("dialogArt").textContent = won ? "🏆" : "🌙";
  $("dialogEyebrow").textContent = won ? "Council objective complete" : "Settlement report";
  $("dialogTitle").textContent = won ? "Your settlement thrives!" : "The season ends";
  $("dialogText").textContent = message;
  $("finalScore").textContent = state.score.toLocaleString();
  $("gameDialog").showModal();
  playTone(won ? 720 : 130, .18);
}

function newGame() {
  state = initialState();
  state.eventIndex = Math.floor(Math.random() * events.length);
  try { localStorage.removeItem(STORAGE_KEY); } catch (error) { /* Storage is optional. */ }
  if ($("gameDialog").open) $("gameDialog").close();
  addLog("A fresh 12-season plan begins.");
  saveState();
  render();
}

function addLog(message) {
  state.log.unshift(message);
  state.log = state.log.slice(0, 10);
}

function rates() {
  const costs = upkeep();
  return {
    food: state.buildings.farm * 7 - costs.food,
    energy: state.buildings.solar * 6 - state.buildings.workshop * 2 - costs.energy,
    materials: state.buildings.workshop * 5,
    coins: state.buildings.market * 2
  };
}

function renderResource(id, value, rate) {
  $(`${id}Value`).textContent = value;
  const rateEl = $(`${id}Rate`);
  if (rateEl && typeof rate === "number") rateEl.textContent = `${rate >= 0 ? "+" : ""}${rate}`;
  const card = $(`${id}Value`).closest(".resource");
  card.classList.toggle("danger", value <= 3);
  card.classList.toggle("warning", value > 3 && value <= 8);
}

function render() {
  const season = getSeason();
  const event = events[state.eventIndex];
  const currentRates = rates();
  const costs = upkeep();

  $("seasonIcon").textContent = season.icon;
  $("seasonName").textContent = season.name;
  $("yearNumber").textContent = getYear();
  $("turnNumber").textContent = state.turn;
  $("actionsLeft").textContent = state.actionsLeft;
  renderResource("food", state.food, currentRates.food);
  renderResource("energy", state.energy, currentRates.energy);
  renderResource("materials", state.materials, currentRates.materials);
  renderResource("coins", state.coins, currentRates.coins);
  $("peopleValue").textContent = state.people;
  $("happinessValue").textContent = state.happiness;
  $("peopleRate").textContent = state.people >= 20 ? "Goal met" : "Growing";
  $("happinessRate").textContent = state.happiness >= 60 ? "Healthy" : "Needs care";

  $("peopleGoal").textContent = `${state.people}/20`;
  $("happinessGoal").textContent = `${state.happiness}%`;
  $("coinsGoal").textContent = `${state.coins}/40`;
  document.querySelector('[data-goal="people"]').classList.toggle("complete", state.people >= 20);
  document.querySelector('[data-goal="happiness"]').classList.toggle("complete", state.happiness >= 60);
  document.querySelector('[data-goal="coins"]').classList.toggle("complete", state.coins >= 40);
  $("scoreValue").textContent = state.score.toLocaleString();
  $("weatherIcon").textContent = event.icon;
  $("forecastText").textContent = event.text;
  $("upkeepText").textContent = `−${costs.food} food · −${costs.energy} energy`;
  $("gameLog").innerHTML = state.log.map(item => `<li>${escapeHtml(item)}</li>`).join("");
  $("soundButton").textContent = `Sound: ${state.sound ? "On" : "Off"}`;
  $("soundButton").setAttribute("aria-pressed", String(state.sound));
  $("soundButton").setAttribute("aria-label", `Turn sound ${state.sound ? "off" : "on"}`);
  $("endTurnButton").disabled = state.gameOver;

  document.querySelectorAll("[data-action]").forEach(button => {
    const action = actions.find(item => item.id === button.dataset.action);
    button.disabled = state.gameOver || !canAfford(action);
    const owned = button.querySelector("[data-owned]");
    owned.textContent = ["farm", "solar", "workshop"].includes(action.id) ? `Built: ${state.buildings[action.id]}` : "";
  });
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function playTone(frequency, duration) {
  if (!state.sound || !window.AudioContext) return;
  try {
    const context = new AudioContext();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(.035, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(.001, context.currentTime + duration);
    oscillator.connect(gain).connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + duration);
    oscillator.addEventListener("ended", () => context.close());
  } catch (error) { /* Audio is optional. */ }
}

function bindEvents() {
  $("endTurnButton").addEventListener("click", endSeason);
  $("newGameButton").addEventListener("click", newGame);
  $("playAgainButton").addEventListener("click", newGame);
  $("soundButton").addEventListener("click", () => { state.sound = !state.sound; saveState(); render(); });
  document.addEventListener("keydown", event => {
    if ($("gameDialog").open && event.key.toLowerCase() !== "r") return;
    if (/^[1-6]$/.test(event.key)) {
      const action = actions[Number(event.key) - 1];
      performAction(action.id, document.querySelector(`[data-action="${action.id}"]`));
    } else if (event.key === "Enter") {
      event.preventDefault();
      endSeason();
    } else if (event.key.toLowerCase() === "r") {
      newGame();
    }
  });
}

__ready( () => {
  $("currentYear").textContent = new Date().getFullYear();
  buildActionCards();
  bindEvents();
  render();
});


}
function begin(){poster.hidden=true;gm.hidden=false;if(!booted){booted=true;var s=document.createElement("style");s.textContent=LOOK;document.head.appendChild(s);boot();}else{var r=document.getElementById("newGameButton");if(r)r.click();}}
poster.addEventListener("click",begin);
var nb=document.getElementById("new");if(nb)nb.addEventListener("click",begin);
})();
