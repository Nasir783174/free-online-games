/* Idle Empire - game logic + its own look. Layout lives in style.css; page shell lives in the HTML. */
(function(){"use strict";
var gm=document.getElementById("gm"),poster=document.getElementById("poster"),booted=false;
var LOOK=".gm{\n  \n  \n  --accent: #16b8c4;\n  --action: #ffb84d;\n  --success: #22c55e;\n  --danger: #ef5b5b;\n  --page: #f6f7fb;\n  \n  \n  \n  \n  --game: #111827;\n  --game-2: #1f2937;\n  \n}.gm *{ box-sizing: border-box; }.gm button,.gm input{ font: inherit; }.gm button{ -webkit-tap-highlight-color: transparent; }.gm :focus-visible{ outline: 3px solid rgba(22, 184, 196, .65); outline-offset: 3px; }.gm [hidden]{ display: none !important; }.gm .category-pill{ padding: 7px 13px; border-radius: 999px; color: var(--brand-dark); background: #ededff; font-size: 14px; font-weight: 700; }.gm .page-shell{ width: min(1180px, calc(100% - 40px)); margin: 0 auto; }.gm h2,.gm h3,.gm p{ margin-top: 0; }.gm h2{ margin-bottom: 16px; font-size: clamp(28px, 4vw, 36px); font-weight: 800; letter-spacing: -.025em; line-height: 1.18; }.gm h3{ font-size: 21px; line-height: 1.3; }.gm .game-card{ overflow: hidden; border: 1px solid #263247; border-radius: 20px; background: var(--game); color: #fff; box-shadow: var(--shadow); }.gm .game-topbar{ min-height: 94px; padding: 18px 22px; display: grid; grid-template-columns: 1fr auto auto; align-items: center; gap: 30px; border-bottom: 1px solid #344054; background: #172033; }.gm .stat-label{ display: block; color: #aeb8c8; font-size: 14px; font-weight: 700; }.gm .balance{ display: block; overflow-wrap: anywhere; color: #fff; font-size: clamp(28px, 5vw, 40px); line-height: 1.15; font-variant-numeric: tabular-nums; }.gm .balance::before{ content: \"\u25cf\"; margin-right: 10px; color: var(--action); font-size: .72em; }.gm .compact-stats{ display: flex; gap: 28px; }.gm .compact-stats div{ min-width: 90px; }.gm .compact-stats span{ display: block; color: #aeb8c8; font-size: 13px; }.gm .compact-stats strong{ font-size: 20px; font-variant-numeric: tabular-nums; }.gm .icon-button{ width: 46px; height: 46px; border: 1px solid #475467; border-radius: 13px; color: #fff; background: #293548; font-weight: 800; cursor: pointer; }.gm .icon-button:hover{ background: #35435a; }.gm .game-layout{ display: grid; grid-template-columns: minmax(0, 1.1fr) minmax(350px, .9fr); min-height: 680px; }.gm .core-panel{ position: relative; overflow: hidden; padding: 32px; display: flex; flex-direction: column; align-items: center; justify-content: center; background-color: var(--game); background-image: radial-gradient(circle at 50% 45%, rgba(91, 92, 226, .22), transparent 37%), linear-gradient(rgba(255,255,255,.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.025) 1px, transparent 1px); background-size: auto, 32px 32px, 32px 32px; }.gm .goal-row{ width: min(480px, 100%); display: flex; justify-content: space-between; color: #c5ccda; font-size: 14px; font-weight: 700; }.gm .progress-track{ width: min(480px, 100%); height: 10px; margin: 10px 0 58px; overflow: hidden; border-radius: 99px; background: #2b3648; }.gm .progress-track span{ display: block; width: 0; height: 100%; border-radius: inherit; background: linear-gradient(90deg, var(--accent), #71e3c7); transition: width .35s ease; }.gm .energy-core{ position: relative; width: clamp(210px, 31vw, 300px); aspect-ratio: 1; border: 0; border-radius: 50%; color: #fff; background: transparent; cursor: pointer; touch-action: manipulation; isolation: isolate; }.gm .energy-core::before{ content: \"\"; position: absolute; inset: 15%; z-index: -1; border: 2px solid rgba(255,255,255,.38); border-radius: 50%; background: radial-gradient(circle at 35% 30%, #ffe4a7 0, #ffb84d 19%, #f07845 48%, #a84498 72%, #5b5ce2 100%); box-shadow: 0 0 0 12px rgba(255,184,77,.06), 0 20px 60px rgba(91,92,226,.38); transition: transform .1s ease, filter .15s ease; }.gm .energy-core:hover::before{ filter: brightness(1.08); transform: scale(1.025); }.gm .energy-core:active::before,.gm .energy-core.is-pressed::before{ transform: scale(.94); }.gm .core-center{ position: absolute; inset: 25%; display: grid; place-content: center; text-align: center; pointer-events: none; }.gm .core-center > span{ font-size: 38px; line-height: 1; }.gm .core-center strong{ margin-top: 8px; font-size: 24px; letter-spacing: .08em; }.gm .core-center small{ font-size: 14px; font-weight: 700; }.gm .core-orbit{ position: absolute; inset: 4%; z-index: -2; border: 2px solid rgba(132, 214, 255, .28); border-radius: 50%; animation: spin 9s linear infinite; }.gm .core-orbit::before{ content: \"\"; position: absolute; top: 14%; right: 8%; width: 14px; height: 14px; border-radius: 50%; background: #7be4ee; box-shadow: 0 0 18px rgba(123,228,238,.7); }.gm .orbit-two{ inset: 0 18%; transform: rotate(60deg); animation-duration: 7s; animation-direction: reverse; }.gm .orbit-two::before{ background: #ffd581; }@keyframes spin{ to { transform: rotate(360deg); } }.gm .core-hint{ margin: 30px 0 26px; color: #aeb8c8; font-size: 14px; }.gm kbd{ padding: 2px 8px; border: 1px solid #475467; border-bottom-width: 2px; border-radius: 6px; color: #f7f8fa; background: #293548; font-family: inherit; font-size: 12px; }.gm .milestones{ width: min(480px, 100%); display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }.gm .milestone{ padding: 10px 6px; border: 1px solid #344054; border-radius: 11px; color: #78869a; background: rgba(31, 41, 55, .7); text-align: center; }.gm .milestone span,.gm .milestone small{ display: block; }.gm .milestone span{ font-size: 14px; font-weight: 800; }.gm .milestone small{ font-size: 11px; }.gm .milestone.is-unlocked{ border-color: #6085a5; color: #e6faff; background: rgba(22,184,196,.16); }.gm .shop-panel{ overflow-y: auto; max-height: 680px; padding: 26px; border-left: 1px solid #344054; background: var(--game-2); scrollbar-color: #596579 #1f2937; }.gm .shop-heading{ display: flex; align-items: flex-end; justify-content: space-between; gap: 16px; margin-bottom: 20px; }.gm .shop-heading h2{ margin: 0; font-size: 25px; }.gm .buy-mode{ display: flex; padding: 3px; border-radius: 10px; background: #111827; }.gm .mode-button{ min-width: 42px; padding: 6px 8px; border: 0; border-radius: 8px; color: #aeb8c8; background: transparent; font-size: 12px; font-weight: 800; cursor: pointer; }.gm .mode-button.is-active{ color: #fff; background: var(--brand); }.gm .producer-list,.gm .upgrade-list{ display: grid; gap: 10px; }.gm .producer{ width: 100%; padding: 13px; display: grid; grid-template-columns: 46px 1fr auto; align-items: center; gap: 12px; border: 1px solid #3b4658; border-radius: 14px; color: #fff; background: #283447; text-align: left; cursor: pointer; transition: border-color .15s, transform .15s, background .15s; }.gm .producer:hover:not(:disabled){ border-color: #7887a0; background: #303e53; transform: translateY(-1px); }.gm .producer:disabled{ cursor: not-allowed; opacity: .55; }.gm .producer-icon{ width: 46px; height: 46px; display: grid; place-items: center; border-radius: 12px; background: #182235; font-size: 24px; }.gm .producer-name{ display: block; font-size: 15px; font-weight: 800; }.gm .producer-rate{ display: block; color: #aeb8c8; font-size: 12px; }.gm .producer-price{ text-align: right; }.gm .producer-price strong,.gm .producer-price small{ display: block; }.gm .producer-price strong{ color: #ffd68b; font-size: 14px; }.gm .producer-price small{ color: #aeb8c8; font-size: 11px; }.gm .upgrade-block{ margin-top: 26px; }.gm .upgrade-block h3{ margin-bottom: 12px; font-size: 18px; }.gm .upgrade{ width: 100%; padding: 13px; display: flex; align-items: center; justify-content: space-between; gap: 16px; border: 1px solid #3b4658; border-radius: 13px; color: #fff; background: #252f41; text-align: left; cursor: pointer; }.gm .upgrade:hover:not(:disabled){ border-color: var(--accent); }.gm .upgrade:disabled{ opacity: .55; cursor: not-allowed; }.gm .upgrade span{ display: block; font-size: 14px; font-weight: 800; }.gm .upgrade small{ display: block; color: #aeb8c8; font-size: 11px; }.gm .upgrade strong{ flex: 0 0 auto; color: #ffd68b; font-size: 13px; }.gm .upgrade.is-bought{ border-color: rgba(34,197,94,.5); }.gm .upgrade.is-bought strong{ color: #79e59c; }.gm .game-footer{ min-height: 78px; padding: 15px 22px; display: flex; align-items: center; justify-content: space-between; gap: 20px; border-top: 1px solid #344054; background: #172033; }.gm .status-message{ margin: 0; color: #bdc5d2; font-size: 14px; }.gm .game-actions{ display: flex; gap: 10px; }.gm .button{ min-height: 46px; padding: 10px 18px; border: 1px solid transparent; border-radius: 12px; font-size: 15px; font-weight: 800; cursor: pointer; }.gm .button-primary{ color: #fff; background: var(--brand); }.gm .button-primary:hover{ background: var(--brand-dark); }.gm .button-secondary{ border-color: #4a586f; color: #fff; background: #293548; }.gm .button-secondary:hover{ background: #35435a; }.gm .button-danger{ border-color: rgba(239,91,91,.45); color: #ffaaaa; background: rgba(239,91,91,.1); }.gm .button-danger:hover{ background: rgba(239,91,91,.2); }.gm .floating-number{ position: fixed; z-index: 30; color: #ffe098; font-size: 20px; font-weight: 800; pointer-events: none; animation: float-away .8s ease-out forwards; text-shadow: 0 2px 8px #111827; }@keyframes float-away{ from { opacity: 1; transform: translate(-50%, 0) scale(.85); } to { opacity: 0; transform: translate(-50%, -70px) scale(1.1); } }.gm .control-list{ color: var(--muted); }.gm .instruction-grid{ display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; margin-top: 30px; }.gm .instruction-grid article{ padding: 22px; border: 1px solid var(--border); border-radius: 15px; background: #fafbfe; }.gm .instruction-grid article > span{ display: grid; width: 38px; height: 38px; place-items: center; margin-bottom: 16px; border-radius: 10px; color: #fff; background: var(--brand); font-size: 14px; font-weight: 800; }.gm .instruction-grid h3{ margin-bottom: 8px; }.gm .instruction-grid p{ margin: 0; font-size: 15px; }.gm .control-list{ margin: 0; padding-left: 20px; }.gm .control-list li + li{ margin-top: 10px; }.gm .modal{ position: fixed; inset: 0; z-index: 100; padding: 20px; display: grid; place-items: center; background: rgba(12,18,31,.76); backdrop-filter: blur(5px); }.gm .modal-card{ width: min(440px, 100%); padding: 34px; border-radius: 20px; background: #fff; color: var(--text); box-shadow: 0 30px 90px rgba(0,0,0,.35); text-align: center; }.gm .modal-card h2{ font-size: 30px; }.gm .modal-card p{ color: var(--muted); }.gm .modal-card > strong{ display: block; margin: 18px 0 24px; color: var(--brand); font-size: 28px; }.gm .modal-card .button{ width: 100%; margin-top: 10px; }.gm .modal-card .button-secondary{ border-color: var(--border); color: var(--text); background: #f3f4f8; }.gm .modal-icon{ width: 64px; height: 64px; display: grid; place-items: center; margin: 0 auto 18px; border-radius: 18px; color: #aa6810; background: #fff0ce; font-size: 32px; }.gm .modal-icon.victory{ color: #4b4cca; background: #e9e9ff; }@media (max-width: 900px){.gm .game-layout{ grid-template-columns: 1fr; }.gm .shop-panel{ max-height: none; border-top: 1px solid #344054; border-left: 0; }.gm .core-panel{ min-height: 650px; }.gm .instruction-grid{ grid-template-columns: 1fr; }}@media (max-width: 640px){.gm .category-pill{ padding: 5px 10px; font-size: 12px; }.gm .page-shell{ width: min(100% - 24px, 1180px); }.gm .game-card{ border-radius: 16px; }.gm .game-topbar{ grid-template-columns: 1fr auto; gap: 12px; padding: 14px 16px; }.gm .compact-stats{ grid-column: 1 / -1; grid-row: 2; justify-content: space-between; gap: 12px; }.gm .compact-stats div{ min-width: 0; }.gm .icon-button{ grid-column: 2; grid-row: 1; }.gm .core-panel{ min-height: 590px; padding: 22px 14px; }.gm .progress-track{ margin-bottom: 38px; }.gm .energy-core{ width: min(250px, 78vw); }.gm .milestones{ gap: 5px; }.gm .milestone{ padding: 8px 3px; }.gm .shop-panel{ padding: 22px 14px; }.gm .shop-heading{ align-items: flex-start; flex-direction: column; }.gm .producer{ grid-template-columns: 42px minmax(0, 1fr) auto; padding: 11px; gap: 9px; }.gm .producer-icon{ width: 42px; height: 42px; }.gm .game-footer{ align-items: stretch; flex-direction: column; padding: 16px; }.gm .game-actions{ display: grid; grid-template-columns: 1fr 1fr; }}@media (prefers-reduced-motion: reduce){.gm *,.gm *::before,.gm *::after{ scroll-behavior: auto !important; animation-duration: .01ms !important; animation-iteration-count: 1 !important; transition-duration: .01ms !important; }}";
function __ready(f){f()}
function boot(){
"use strict";

const SAVE_KEY = "gamesHub_idleEmpire_v1";
const GOAL = 1_000_000;
const OFFLINE_CAP_SECONDS = 8 * 60 * 60;
const SAVE_INTERVAL_MS = 5000;

const producerDefinitions = [
  { id: "bot", name: "Helper Bot", icon: "🤖", baseCost: 15, baseRate: 0.5 },
  { id: "workshop", name: "Workshop", icon: "🔧", baseCost: 120, baseRate: 4 },
  { id: "factory", name: "Factory", icon: "🏭", baseCost: 1250, baseRate: 38 },
  { id: "lab", name: "Quantum Lab", icon: "⚛", baseCost: 15000, baseRate: 420 }
];

const upgradeDefinitions = [
  { id: "tap2", name: "Charged Touch", description: "Tap power ×2", cost: 250, type: "tap", multiplier: 2 },
  { id: "auto2", name: "Smart Logistics", description: "All production ×2", cost: 2500, type: "auto", multiplier: 2 },
  { id: "tap5", name: "Plasma Fingers", description: "Tap power ×5", cost: 12000, type: "tap", multiplier: 5 },
  { id: "auto3", name: "Golden Network", description: "All production ×3", cost: 85000, type: "auto", multiplier: 3 }
];

const defaultState = () => ({
  coins: 0,
  lifetimeCoins: 0,
  producers: Object.fromEntries(producerDefinitions.map(item => [item.id, 0])),
  upgrades: [],
  buyMode: "1",
  paused: false,
  won: false,
  lastSaved: Date.now()
});

let state = defaultState();
let lastFrame = performance.now();
let lastRenderedSecond = -1;

const elements = {
  coinBalance: document.getElementById("coinBalance"),
  perTap: document.getElementById("perTap"),
  perSecond: document.getElementById("perSecond"),
  tapReward: document.getElementById("tapReward"),
  coreButton: document.getElementById("coreButton"),
  producerList: document.getElementById("producerList"),
  upgradeList: document.getElementById("upgradeList"),
  goalText: document.getElementById("goalText"),
  goalProgress: document.getElementById("goalProgress"),
  progressTrack: document.querySelector(".progress-track"),
  statusMessage: document.getElementById("statusMessage"),
  pauseButton: document.getElementById("pauseButton"),
  pauseIcon: document.getElementById("pauseIcon"),
  saveButton: document.getElementById("saveButton"),
  resetButton: document.getElementById("resetButton"),
  offlineModal: document.getElementById("offlineModal"),
  offlineAmount: document.getElementById("offlineAmount"),
  collectOfflineButton: document.getElementById("collectOfflineButton"),
  winModal: document.getElementById("winModal"),
  continueButton: document.getElementById("continueButton"),
  newEmpireButton: document.getElementById("newEmpireButton"),
  currentYear: document.getElementById("currentYear")
};

function sanitizeLoadedState(parsed) {
  const clean = defaultState();
  if (!parsed || typeof parsed !== "object") return clean;
  clean.coins = validNumber(parsed.coins);
  clean.lifetimeCoins = validNumber(parsed.lifetimeCoins);
  clean.buyMode = ["1", "10", "max"].includes(String(parsed.buyMode)) ? String(parsed.buyMode) : "1";
  clean.paused = Boolean(parsed.paused);
  clean.won = Boolean(parsed.won);
  clean.lastSaved = Number.isFinite(parsed.lastSaved) ? parsed.lastSaved : Date.now();
  clean.upgrades = Array.isArray(parsed.upgrades)
    ? parsed.upgrades.filter(id => upgradeDefinitions.some(upgrade => upgrade.id === id))
    : [];
  producerDefinitions.forEach(item => {
    const amount = parsed.producers && parsed.producers[item.id];
    clean.producers[item.id] = Number.isFinite(amount) ? Math.max(0, Math.floor(amount)) : 0;
  });
  return clean;
}

function validNumber(value) {
  return Number.isFinite(value) ? Math.max(0, value) : 0;
}

function loadGame() {
  try {
    const saved = localStorage.getItem(SAVE_KEY);
    if (!saved) return;
    state = sanitizeLoadedState(JSON.parse(saved));
    const elapsedSeconds = Math.min(OFFLINE_CAP_SECONDS, Math.max(0, (Date.now() - state.lastSaved) / 1000));
    const offlineCoins = state.paused ? 0 : getProductionRate() * elapsedSeconds;
    if (offlineCoins >= 1 && elapsedSeconds >= 30) {
      state.coins += offlineCoins;
      state.lifetimeCoins += offlineCoins;
      elements.offlineAmount.textContent = `+${formatNumber(offlineCoins)} coins`;
      openModal(elements.offlineModal, elements.collectOfflineButton);
    }
  } catch (error) {
    console.warn("The saved Idle Empire game could not be loaded.", error);
    state = defaultState();
  }
}

function saveGame(showMessage = false) {
  state.lastSaved = Date.now();
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
    if (showMessage) setStatus("Game saved in this browser.");
  } catch (error) {
    if (showMessage) setStatus("This browser could not save the game.");
    console.warn("Idle Empire save failed.", error);
  }
}

function getTapPower() {
  return upgradeDefinitions
    .filter(item => item.type === "tap" && state.upgrades.includes(item.id))
    .reduce((power, item) => power * item.multiplier, 1);
}

function getAutoMultiplier() {
  return upgradeDefinitions
    .filter(item => item.type === "auto" && state.upgrades.includes(item.id))
    .reduce((power, item) => power * item.multiplier, 1);
}

function getProductionRate() {
  const base = producerDefinitions.reduce((total, item) => total + state.producers[item.id] * item.baseRate, 0);
  return base * getAutoMultiplier();
}

function unitCost(item, ownedOffset = 0) {
  return item.baseCost * Math.pow(1.15, state.producers[item.id] + ownedOffset);
}

function purchaseQuote(item) {
  if (state.buyMode === "max") {
    let quantity = 0;
    let cost = 0;
    while (quantity < 10000) {
      const nextCost = unitCost(item, quantity);
      if (cost + nextCost > state.coins + 1e-8) break;
      cost += nextCost;
      quantity += 1;
    }
    return { quantity, cost };
  }
  const desired = Number(state.buyMode);
  let cost = 0;
  for (let index = 0; index < desired; index += 1) cost += unitCost(item, index);
  return { quantity: desired, cost };
}

function buyProducer(id) {
  if (state.paused) return setStatus("Resume the game before making a purchase.");
  const item = producerDefinitions.find(entry => entry.id === id);
  if (!item) return;
  const quote = purchaseQuote(item);
  if (quote.quantity < 1) return setStatus(`You need more coins for ${item.name}.`);
  if (state.coins + 1e-8 < quote.cost) return setStatus(`You need ${formatNumber(quote.cost - state.coins)} more coins.`);
  state.coins -= quote.cost;
  state.producers[id] += quote.quantity;
  setStatus(`Bought ${quote.quantity} ${item.name}${quote.quantity === 1 ? "" : "s"}.`);
  render();
}

function buyUpgrade(id) {
  if (state.paused) return setStatus("Resume the game before buying an upgrade.");
  const item = upgradeDefinitions.find(entry => entry.id === id);
  if (!item || state.upgrades.includes(id)) return;
  if (state.coins < item.cost) return setStatus(`You need ${formatNumber(item.cost - state.coins)} more coins.`);
  state.coins -= item.cost;
  state.upgrades.push(id);
  setStatus(`${item.name} unlocked.`);
  render();
}

function tapCore(event) {
  if (state.paused) return setStatus("The game is paused. Resume to keep building.");
  const amount = getTapPower();
  state.coins += amount;
  state.lifetimeCoins += amount;
  elements.coreButton.classList.add("is-pressed");
  window.setTimeout(() => elements.coreButton.classList.remove("is-pressed"), 90);
  showFloatingNumber(event, amount);
  render();
  checkWin();
}

function showFloatingNumber(event, amount) {
  const rect = elements.coreButton.getBoundingClientRect();
  const x = event && Number.isFinite(event.clientX) && event.clientX > 0 ? event.clientX : rect.left + rect.width / 2;
  const y = event && Number.isFinite(event.clientY) && event.clientY > 0 ? event.clientY : rect.top + rect.height / 2;
  const number = document.createElement("span");
  number.className = "floating-number";
  number.textContent = `+${formatNumber(amount)}`;
  number.style.left = `${x}px`;
  number.style.top = `${y}px`;
  document.body.appendChild(number);
  window.setTimeout(() => number.remove(), 820);
}

function setBuyMode(mode) {
  state.buyMode = String(mode);
  document.querySelectorAll(".mode-button").forEach(button => {
    const active = button.dataset.mode === state.buyMode;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  renderShop();
}

function togglePause() {
  state.paused = !state.paused;
  document.body.classList.toggle("is-paused", state.paused);
  elements.pauseButton.setAttribute("aria-pressed", String(state.paused));
  elements.pauseButton.setAttribute("aria-label", state.paused ? "Resume game" : "Pause game");
  elements.pauseIcon.textContent = state.paused ? "▶" : "Ⅱ";
  setStatus(state.paused ? "Game paused. Automatic production is stopped." : "Game resumed. Your empire is producing again.");
  lastFrame = performance.now();
  renderShop();
  saveGame();
}

function render() {
  const tapPower = getTapPower();
  const production = getProductionRate();
  elements.coinBalance.textContent = formatNumber(state.coins);
  elements.perTap.textContent = formatNumber(tapPower);
  elements.perSecond.textContent = formatNumber(production);
  elements.tapReward.textContent = formatNumber(tapPower);
  elements.goalText.textContent = `${formatNumber(Math.min(state.lifetimeCoins, GOAL))} / 1.00M`;
  const progress = Math.min(100, (state.lifetimeCoins / GOAL) * 100);
  elements.goalProgress.style.width = `${progress}%`;
  elements.progressTrack.setAttribute("aria-valuenow", String(Math.floor(Math.min(state.lifetimeCoins, GOAL))));
  document.querySelectorAll(".milestone").forEach(node => {
    node.classList.toggle("is-unlocked", state.lifetimeCoins >= Number(node.dataset.milestone));
  });
  renderShop();
}

function renderShop() {
  elements.producerList.replaceChildren(...producerDefinitions.map(item => {
    const quote = purchaseQuote(item);
    const canAfford = quote.quantity > 0 && state.coins + 1e-8 >= quote.cost && !state.paused;
    const button = document.createElement("button");
    button.type = "button";
    button.className = "producer";
    button.disabled = !canAfford;
    button.dataset.producer = item.id;
    button.setAttribute("aria-label", `Buy ${quote.quantity || 1} ${item.name}. Cost ${formatNumber(quote.cost || unitCost(item))} coins. Owned ${state.producers[item.id]}.`);
    button.innerHTML = `<span class="producer-icon" aria-hidden="true">${item.icon}</span><span><span class="producer-name">${item.name}</span><span class="producer-rate">+${formatNumber(item.baseRate * getAutoMultiplier())}/sec each</span></span><span class="producer-price"><strong>${quote.quantity ? formatNumber(quote.cost) : "Too costly"}</strong><small>Owned ${state.producers[item.id]}${quote.quantity > 1 ? ` · Buy ${quote.quantity}` : ""}</small></span>`;
    button.addEventListener("click", () => buyProducer(item.id));
    return button;
  }));

  elements.upgradeList.replaceChildren(...upgradeDefinitions.map(item => {
    const bought = state.upgrades.includes(item.id);
    const button = document.createElement("button");
    button.type = "button";
    button.className = `upgrade${bought ? " is-bought" : ""}`;
    button.disabled = bought || state.coins < item.cost || state.paused;
    button.setAttribute("aria-label", bought ? `${item.name} purchased` : `Buy ${item.name} for ${formatNumber(item.cost)} coins`);
    button.innerHTML = `<span>${item.name}<small>${item.description}</small></span><strong>${bought ? "Owned ✓" : formatNumber(item.cost)}</strong>`;
    button.addEventListener("click", () => buyUpgrade(item.id));
    return button;
  }));
}

function checkWin() {
  if (state.lifetimeCoins < GOAL || state.won) return;
  state.won = true;
  saveGame();
  openModal(elements.winModal, elements.continueButton);
}

function resetGame(requireConfirmation = true) {
  if (requireConfirmation && !window.confirm("Reset all Idle Empire progress? This cannot be undone.")) return;
  state = defaultState();
  localStorage.removeItem(SAVE_KEY);
  closeModal(elements.winModal);
  document.body.classList.remove("is-paused");
  elements.pauseButton.setAttribute("aria-pressed", "false");
  elements.pauseButton.setAttribute("aria-label", "Pause game");
  elements.pauseIcon.textContent = "Ⅱ";
  lastFrame = performance.now();
  setBuyMode("1");
  setStatus("A new empire is ready. Tap the core to begin.");
  render();
}

function openModal(modal, focusTarget) {
  modal.hidden = false;
  window.setTimeout(() => focusTarget.focus(), 0);
}

function closeModal(modal) {
  modal.hidden = true;
  elements.coreButton.focus();
}

function setStatus(message) {
  elements.statusMessage.textContent = message;
}

function formatNumber(value) {
  if (!Number.isFinite(value)) return "0";
  const absolute = Math.abs(value);
  const units = [
    { threshold: 1e12, suffix: "T" },
    { threshold: 1e9, suffix: "B" },
    { threshold: 1e6, suffix: "M" },
    { threshold: 1e3, suffix: "K" }
  ];
  const unit = units.find(entry => absolute >= entry.threshold);
  if (unit) {
    const scaled = value / unit.threshold;
    const digits = scaled >= 100 ? 0 : scaled >= 10 ? 1 : 2;
    return `${scaled.toFixed(digits).replace(/\.0+$|(?<=\.[0-9])0$/, "")}${unit.suffix}`;
  }
  if (absolute >= 100) return Math.floor(value).toLocaleString("en-US");
  if (absolute >= 10) return value.toFixed(1).replace(/\.0$/, "");
  return value.toFixed(2).replace(/\.00$/, "").replace(/(\.\d)0$/, "$1");
}

function gameLoop(now) {
  const elapsed = Math.min(.25, Math.max(0, (now - lastFrame) / 1000));
  lastFrame = now;
  if (!state.paused) {
    const earned = getProductionRate() * elapsed;
    state.coins += earned;
    state.lifetimeCoins += earned;
  }
  const currentSecond = Math.floor(now / 250);
  if (currentSecond !== lastRenderedSecond) {
    lastRenderedSecond = currentSecond;
    render();
    checkWin();
  }
  window.requestAnimationFrame(gameLoop);
}

elements.coreButton.addEventListener("click", tapCore);
elements.pauseButton.addEventListener("click", togglePause);
elements.saveButton.addEventListener("click", () => saveGame(true));
elements.resetButton.addEventListener("click", () => resetGame(true));
elements.collectOfflineButton.addEventListener("click", () => {
  closeModal(elements.offlineModal);
  setStatus("Offline earnings collected. Welcome back!");
  render();
  checkWin();
  saveGame();
});
elements.continueButton.addEventListener("click", () => {
  closeModal(elements.winModal);
  setStatus("Goal complete. Keep building your empire!");
});
elements.newEmpireButton.addEventListener("click", () => resetGame(true));
document.querySelectorAll(".mode-button").forEach(button => button.addEventListener("click", () => setBuyMode(button.dataset.mode)));

document.addEventListener("keydown", event => {
  const target = event.target;
  const isInteractive = target instanceof HTMLButtonElement || target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement;
  if (event.code === "Space" && !isInteractive && elements.offlineModal.hidden && elements.winModal.hidden) {
    event.preventDefault();
    tapCore(event);
  }
  if (event.key.toLowerCase() === "p" && !isInteractive && elements.offlineModal.hidden && elements.winModal.hidden) togglePause();
  if (["1", "2", "3"].includes(event.key) && !isInteractive) setBuyMode({ "1": "1", "2": "10", "3": "max" }[event.key]);
  if (event.key === "Escape") {
    if (!elements.offlineModal.hidden) elements.collectOfflineButton.click();
    else if (!elements.winModal.hidden) elements.continueButton.click();
  }
});

document.addEventListener("visibilitychange", () => {
  if (document.hidden) saveGame();
  lastFrame = performance.now();
});
window.addEventListener("pagehide", () => saveGame());
window.setInterval(() => saveGame(), SAVE_INTERVAL_MS);

elements.currentYear.textContent = String(new Date().getFullYear());
loadGame();
setBuyMode(state.buyMode);
document.body.classList.toggle("is-paused", state.paused);
elements.pauseButton.setAttribute("aria-pressed", String(state.paused));
elements.pauseButton.setAttribute("aria-label", state.paused ? "Resume game" : "Pause game");
elements.pauseIcon.textContent = state.paused ? "▶" : "Ⅱ";
render();
window.requestAnimationFrame(gameLoop);


}
function begin(){poster.hidden=true;gm.hidden=false;if(!booted){booted=true;var s=document.createElement("style");s.textContent=LOOK;document.head.appendChild(s);boot();}else{var r=document.getElementById("resetButton");if(r)r.click();}}
poster.addEventListener("click",begin);
var nb=document.getElementById("new");if(nb)nb.addEventListener("click",begin);
})();
