/* Turn-Based - game logic + its own look. Layout lives in style.css; page shell lives in the HTML. */
(function(){"use strict";
var gm=document.getElementById("gm"),poster=document.getElementById("poster"),booted=false;
var LOOK=".gm{\n  \n  \n  --teal: #16b8c4;\n  --gold: #ffb84d;\n  --success: #22c55e;\n  --danger: #ef5b5b;\n  \n  \n  \n  \n  \n  --arena: #111827;\n  --arena-2: #1f2937;\n  \n}.gm *{ box-sizing: border-box; }.gm button{ font: inherit; }.gm .browse-link{ color: var(--brand-dark); font-weight: 700; text-decoration: none; }.gm .browse-link:hover{ text-decoration: underline; }.gm h2,.gm h3,.gm p{ margin-top: 0; }.gm .game-card{ position: relative; overflow: hidden; background: var(--arena); border: 1px solid #2d3748; border-radius: 20px; box-shadow: var(--shadow); color: #fff; }.gm .game-topbar{ min-height: 78px; display: flex; align-items: center; justify-content: space-between; padding: 16px 24px; border-bottom: 1px solid #344054; background: #151e2d; }.gm .game-topbar > div:first-child{ display: flex; gap: 8px; align-items: baseline; }.gm .round-label,.gm .scoreboard span{ color: #aeb8c8; font-size: 14px; }.gm #roundNumber{ font-size: 24px; }.gm .scoreboard{ display: flex; gap: 12px; }.gm .scoreboard div{ min-width: 92px; display: grid; padding: 7px 12px; border: 1px solid #39465a; border-radius: 10px; background: #1c2738; line-height: 1.2; }.gm .scoreboard strong{ margin-top: 4px; color: #fff; font-size: 20px; }.gm .arena{ position: relative; display: grid; grid-template-columns: 1fr 56px 1fr; gap: 18px; padding: 32px 34px; background-color: var(--arena); background-image: radial-gradient(circle at 50% 20%, rgba(91,92,226,.15), transparent 42%), linear-gradient(rgba(255,255,255,.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.025) 1px, transparent 1px); background-size: auto, 32px 32px, 32px 32px; }.gm .combatant{ min-width: 0; display: grid; grid-template-columns: 118px 1fr; gap: 20px; align-items: center; padding: 20px; border: 1px solid #354158; border-radius: 16px; background: rgba(31,41,55,.86); transition: border-color .2s, transform .2s, box-shadow .2s; }.gm .combatant.active{ border-color: #818cf8; box-shadow: 0 0 0 3px rgba(99,102,241,.15); }.gm .combatant.hit{ animation: hit-shake .35s ease; }.gm .combatant.heal-flash{ animation: heal-pulse .55s ease; }.gm .fighter-art{ position: relative; display: grid; place-items: center; aspect-ratio: 1; border-radius: 50% 50% 42% 42%; border: 2px solid rgba(255,255,255,.13); overflow: hidden; }.gm .fighter-art::before{ content: \"\"; position: absolute; inset: 16%; border-radius: 50%; background: rgba(255,255,255,.07); }.gm .knight{ background: linear-gradient(145deg, #5859c8, #272966); }.gm .warden{ background: linear-gradient(145deg, #a94949, #54242d); }.gm .fighter-icon{ position: relative; font-size: 65px; line-height: 1; text-shadow: 0 4px 0 rgba(0,0,0,.2); }.gm .fighter-info{ min-width: 0; }.gm .name-row{ display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 14px; }.gm .name-row h2{ margin: 0; font-size: 20px; line-height: 1.25; }.gm .turn-badge{ flex: none; padding: 4px 8px; border-radius: 20px; color: #dcdcff; background: rgba(91,92,226,.28); font-size: 12px; font-weight: 800; }.gm .enemy-badge{ color: #fecaca; background: rgba(239,91,91,.17); }.gm .meter-label,.gm .energy-row{ display: flex; justify-content: space-between; align-items: center; color: #cbd5e1; font-size: 13px; }.gm .meter-label strong{ color: #fff; font-size: 13px; }.gm .meter{ height: 10px; margin: 7px 0 15px; overflow: hidden; border-radius: 20px; background: #374151; }.gm .meter span{ display: block; width: 100%; height: 100%; border-radius: inherit; background: var(--success); transition: width .45s ease, background .3s; }.gm .enemy-meter span{ background: var(--danger); }.gm .energy-pips{ display: flex; gap: 5px; }.gm .energy-pips i{ display: block; width: 13px; height: 13px; border: 2px solid #7c85a0; border-radius: 50%; }.gm .energy-pips i.filled{ border-color: var(--gold); background: var(--gold); box-shadow: 0 0 0 2px rgba(255,184,77,.12); }.gm .enemy-pips i.filled{ border-color: #fb7185; background: #fb7185; box-shadow: none; }.gm .status-effect{ min-height: 22px; margin: 12px 0 0; color: #aeb8c8; font-size: 13px; line-height: 1.4; }.gm .versus{ display: grid; place-items: center; }.gm .versus span{ display: grid; place-items: center; width: 48px; height: 48px; border-radius: 50%; border: 1px solid #475569; color: #cbd5e1; background: #1f2937; font-size: 14px; font-weight: 800; }.gm .battle-message{ min-height: 56px; display: flex; justify-content: center; align-items: center; gap: 10px; padding: 12px 24px; border-block: 1px solid #344054; background: #182334; text-align: center; color: #e5e7eb; }.gm .message-icon{ color: var(--gold); }.gm .action-panel{ padding: 24px; background: #111827; }.gm .action-heading{ display: flex; justify-content: space-between; align-items: center; gap: 20px; margin-bottom: 16px; }.gm .action-heading .label{ font-size: 18px; font-weight: 800; }.gm .action-heading p{ margin: 2px 0 0; color: #8f9caf; font-size: 12px; }.gm .restart-button{ min-height: 42px; padding: 0 16px; border: 1px solid #475569; border-radius: 10px; color: #e5e7eb; background: transparent; cursor: pointer; font-size: 14px; font-weight: 700; }.gm .restart-button:hover{ background: #1f2937; }.gm .actions{ display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }.gm .action-button{ position: relative; min-height: 112px; display: grid; grid-template-columns: 35px 1fr; grid-template-rows: 1fr auto; gap: 4px 9px; align-items: center; padding: 14px; border: 1px solid #3a4659; border-radius: 14px; color: #fff; background: #1d2939; text-align: left; cursor: pointer; transition: transform .16s, border-color .16s, background .16s; }.gm .action-button:hover:not(:disabled){ transform: translateY(-2px); border-color: #7783a0; background: #243247; }.gm .action-button:focus-visible,.gm .restart-button:focus-visible,.gm .primary-button:focus-visible,.gm summary:focus-visible{ outline: 3px solid var(--gold); outline-offset: 3px; }.gm .action-button:disabled{ opacity: .43; cursor: not-allowed; }.gm .action-key{ position: absolute; top: 8px; right: 8px; display: grid; place-items: center; width: 21px; height: 21px; border-radius: 6px; color: #9ca3af; background: #111827; font-size: 11px; font-weight: 800; }.gm .action-icon{ grid-row: 1 / 2; display: grid; place-items: center; width: 35px; height: 35px; border-radius: 10px; color: #ddd6fe; background: rgba(91,92,226,.2); font-size: 20px; }.gm .guard .action-icon{ color: #a5f3fc; background: rgba(22,184,196,.16); }.gm .power .action-icon{ color: #fde68a; background: rgba(255,184,77,.15); }.gm .recover .action-icon{ color: #bbf7d0; background: rgba(34,197,94,.16); }.gm .action-copy{ display: grid; line-height: 1.25; }.gm .action-copy strong{ font-size: 15px; }.gm .action-copy small{ margin-top: 3px; color: #aeb8c8; font-size: 11px; }.gm .cost{ grid-column: 1 / -1; color: #fcd34d; font-size: 11px; font-weight: 800; }.gm .cost.free{ color: #9ca3af; }.gm .game-overlay{ position: absolute; inset: 0; z-index: 5; display: grid; place-items: center; padding: 20px; background: rgba(7,12,22,.8); backdrop-filter: blur(7px); }.gm .game-overlay[hidden]{ display: none; }.gm .result-card{ width: min(410px, 100%); padding: 30px; border: 1px solid #49566c; border-radius: 20px; background: #1b2738; box-shadow: 0 24px 70px rgba(0,0,0,.4); text-align: center; }.gm .result-emblem{ width: 74px; height: 74px; display: grid; place-items: center; margin: 0 auto 16px; border-radius: 50%; color: #fcd34d; background: rgba(255,184,77,.14); font-size: 40px; }.gm .result-kicker{ margin-bottom: 3px; color: #aeb8c8; font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: .1em; }.gm .result-card h2{ margin-bottom: 8px; font-size: 34px; }.gm .result-card > p:not(.result-kicker){ color: #cbd5e1; }.gm .result-score{ width: 160px; display: grid; margin: 20px auto; padding: 10px; border-radius: 12px; background: #111827; }.gm .result-score span{ color: #9ca3af; font-size: 12px; }.gm .result-score strong{ color: #fff; font-size: 26px; }.gm .primary-button{ width: 100%; min-height: 48px; border: 0; border-radius: 11px; color: #fff; background: var(--brand); cursor: pointer; font-weight: 800; }.gm .primary-button:hover{ background: var(--brand-dark); }.gm .section-heading{ margin-bottom: 18px; }.gm .instruction-grid{ display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; margin-top: 30px; }.gm .instruction-grid article{ padding: 24px; border: 1px solid var(--border); border-radius: 16px; background: var(--card); }.gm .instruction-grid article > span{ display: inline-block; margin-bottom: 25px; color: var(--brand); font-size: 14px; font-weight: 800; }.gm .instruction-grid h3{ margin-bottom: 8px; font-size: 21px; }.gm .instruction-grid p{ margin: 0; color: var(--muted); font-size: 15px; }.gm .control-list{ display: flex; flex-wrap: wrap; gap: 10px; margin-top: 20px; }.gm .control-list span{ padding: 7px 11px; border: 1px solid var(--border); border-radius: 9px; background: var(--card); font-size: 14px; }.gm kbd{ min-width: 24px; display: inline-block; margin-right: 5px; padding: 1px 6px; border: 1px solid #cbd0dd; border-bottom-width: 2px; border-radius: 5px; background: #f7f8fb; text-align: center; font: 700 12px \"Nunito Sans\", sans-serif; }.gm .tip-card{ display: flex; gap: 15px; padding: 23px; border: 1px solid #dfe0ff; border-radius: 16px; background: #f0f0ff; }.gm .tip-icon{ flex: none; display: grid; place-items: center; width: 38px; height: 38px; border-radius: 10px; color: #fff; background: var(--brand); }.gm .tip-card h3{ margin-bottom: 4px; font-size: 19px; }.gm .tip-card p{ margin: 0; color: #4d5470; font-size: 14px; }.gm .grid-icon{ background: var(--teal); }.gm .checker-icon{ background: #d47745; }.gm details{ border-top: 1px solid var(--border); }.gm details:last-child{ border-bottom: 1px solid var(--border); }.gm summary{ padding: 18px 2px; cursor: pointer; font-weight: 800; }.gm details p{ padding: 0 24px 18px 2px; margin: 0; color: var(--muted); }@keyframes hit-shake{ 0%,100%{transform:translateX(0)} 25%{transform:translateX(-7px)} 60%{transform:translateX(5px)} }@keyframes heal-pulse{ 0%,100%{box-shadow:none} 50%{box-shadow:0 0 0 4px rgba(34,197,94,.35)} }@media (prefers-reduced-motion: reduce){.gm *,.gm *::before,.gm *::after{ scroll-behavior: auto !important; animation-duration: .01ms !important; transition-duration: .01ms !important; }}@media (max-width: 920px){.gm .arena{ grid-template-columns: 1fr; gap: 12px; }.gm .versus{ position: absolute; inset: 0; pointer-events: none; }.gm .versus span{ width: 42px; height: 42px; box-shadow: 0 0 0 7px var(--arena); }.gm .actions{ grid-template-columns: repeat(2, 1fr); }}@media (max-width: 680px){.gm .browse-link{ font-size: 14px; }.gm .game-card{ margin-inline: -4px; border-radius: 16px; }.gm .game-topbar{ padding: 13px 14px; }.gm .round-label{ display: none; }.gm .scoreboard{ gap: 7px; }.gm .scoreboard div{ min-width: 70px; padding: 6px 9px; }.gm .arena{ padding: 20px 14px; }.gm .combatant{ grid-template-columns: 78px 1fr; gap: 13px; padding: 14px; }.gm .fighter-icon{ font-size: 44px; }.gm .name-row{ align-items: flex-start; margin-bottom: 10px; }.gm .name-row h2{ font-size: 17px; }.gm .turn-badge{ padding: 3px 7px; font-size: 10px; }.gm .status-effect{ margin-top: 8px; font-size: 12px; }.gm .battle-message{ font-size: 14px; }.gm .action-panel{ padding: 16px 12px; }.gm .action-heading{ align-items: flex-end; }.gm .action-heading p{ display: none; }.gm .restart-button{ min-height: 40px; padding-inline: 12px; }.gm .actions{ gap: 9px; }.gm .action-button{ min-height: 106px; grid-template-columns: 32px 1fr; padding: 12px 9px; }.gm .action-icon{ width: 32px; height: 32px; }.gm .action-copy strong{ font-size: 14px; }.gm .action-copy small{ font-size: 10px; }.gm .instruction-grid{ grid-template-columns: 1fr; }.gm .instruction-grid article{ padding: 20px; }.gm .instruction-grid article > span{ margin-bottom: 12px; }}@media (max-width: 410px){.gm .combatant{ grid-template-columns: 62px 1fr; }.gm .fighter-art{ border-radius: 16px; }.gm .fighter-icon{ font-size: 36px; }.gm .action-button{ grid-template-columns: 1fr; align-content: start; min-height: 122px; }.gm .action-icon{ grid-row: auto; }.gm .action-copy small{ line-height: 1.25; }}";
function __ready(f){f()}
function boot(){
"use strict";

const MAX_HEALTH = 100;
const MAX_ENERGY = 3;

const elements = {
  round: document.getElementById("roundNumber"),
  score: document.getElementById("score"),
  bestScore: document.getElementById("bestScore"),
  playerHealthText: document.getElementById("playerHealthText"),
  enemyHealthText: document.getElementById("enemyHealthText"),
  playerHealthBar: document.getElementById("playerHealthBar"),
  enemyHealthBar: document.getElementById("enemyHealthBar"),
  playerEnergyPips: document.getElementById("playerEnergyPips"),
  enemyEnergyPips: document.getElementById("enemyEnergyPips"),
  playerEffect: document.getElementById("playerEffect"),
  enemyEffect: document.getElementById("enemyEffect"),
  playerCard: document.getElementById("playerCard"),
  enemyCard: document.getElementById("enemyCard"),
  playerTurnBadge: document.getElementById("playerTurnBadge"),
  enemyTurnBadge: document.getElementById("enemyTurnBadge"),
  messageText: document.getElementById("messageText"),
  actionButtons: [...document.querySelectorAll("[data-action]")],
  restartButton: document.getElementById("restartButton"),
  gameOverlay: document.getElementById("gameOverlay"),
  resultEmblem: document.getElementById("resultEmblem"),
  resultKicker: document.getElementById("resultKicker"),
  resultTitle: document.getElementById("resultTitle"),
  resultText: document.getElementById("resultText"),
  finalScore: document.getElementById("finalScore"),
  playAgainButton: document.getElementById("playAgainButton")
};

let state;
let enemyTimer = null;
let gameToken = 0;

function createFighter() {
  return { health: MAX_HEALTH, energy: 1, guarding: false, recoverCooldown: 0 };
}

function resetGame() {
  gameToken += 1;
  clearTimeout(enemyTimer);
  state = {
    player: createFighter(),
    enemy: createFighter(),
    round: 1,
    score: 0,
    playerTurn: true,
    gameOver: false
  };
  elements.gameOverlay.hidden = true;
  setMessage("Your move. Choose an action.");
  render();
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function setMessage(message) {
  elements.messageText.textContent = message;
}

function effectLabel(fighter, isPlayer) {
  if (fighter.guarding) return "Guard active: next hit reduced by 50%";
  if (fighter.recoverCooldown > 0) return `Recover ready in ${fighter.recoverCooldown} turn${fighter.recoverCooldown === 1 ? "" : "s"}`;
  return isPlayer ? "Ready for battle" : "Studying your stance";
}

function renderPips(container, value) {
  container.replaceChildren();
  for (let index = 0; index < MAX_ENERGY; index += 1) {
    const pip = document.createElement("i");
    if (index < value) pip.classList.add("filled");
    pip.setAttribute("aria-hidden", "true");
    container.appendChild(pip);
  }
}

function healthColor(health, enemy) {
  if (health <= 25) return "#ef5b5b";
  if (health <= 50) return "#ffb84d";
  return enemy ? "#ef5b5b" : "#22c55e";
}

function render() {
  const { player, enemy } = state;
  elements.round.textContent = state.round;
  elements.score.textContent = state.score.toLocaleString();
  elements.bestScore.textContent = getBestScore().toLocaleString();
  elements.playerHealthText.textContent = `${player.health} / ${MAX_HEALTH}`;
  elements.enemyHealthText.textContent = `${enemy.health} / ${MAX_HEALTH}`;
  elements.playerHealthBar.style.width = `${player.health}%`;
  elements.enemyHealthBar.style.width = `${enemy.health}%`;
  elements.playerHealthBar.style.background = healthColor(player.health, false);
  elements.enemyHealthBar.style.background = healthColor(enemy.health, true);
  renderPips(elements.playerEnergyPips, player.energy);
  renderPips(elements.enemyEnergyPips, enemy.energy);
  elements.playerEffect.textContent = effectLabel(player, true);
  elements.enemyEffect.textContent = effectLabel(enemy, false);
  elements.playerCard.classList.toggle("active", state.playerTurn && !state.gameOver);
  elements.enemyCard.classList.toggle("active", !state.playerTurn && !state.gameOver);
  elements.playerTurnBadge.textContent = state.playerTurn && !state.gameOver ? "Your turn" : "Waiting";
  elements.enemyTurnBadge.textContent = !state.playerTurn && !state.gameOver ? "Enemy turn" : "Waiting";

  elements.actionButtons.forEach((button) => {
    const action = button.dataset.action;
    const lacksEnergy = (action === "power" || action === "recover") && player.energy < 2;
    const recoverUnavailable = action === "recover" && (player.recoverCooldown > 0 || player.health === MAX_HEALTH);
    button.disabled = !state.playerTurn || state.gameOver || lacksEnergy || recoverUnavailable;
    if (action === "recover" && player.recoverCooldown > 0) {
      button.querySelector(".cost").textContent = `Cooldown: ${player.recoverCooldown}`;
    } else if (action === "recover") {
      button.querySelector(".cost").textContent = "2 energy";
    }
  });
}

function animateCard(card, className) {
  card.classList.remove(className);
  void card.offsetWidth;
  card.classList.add(className);
  window.setTimeout(() => card.classList.remove(className), 600);
}

function applyDamage(target, rawDamage, targetCard) {
  const blocked = target.guarding;
  const damage = blocked ? Math.ceil(rawDamage / 2) : rawDamage;
  target.guarding = false;
  target.health = Math.max(0, target.health - damage);
  animateCard(targetCard, "hit");
  return { damage, blocked };
}

function reduceCooldown(fighter, usedRecover) {
  if (!usedRecover && fighter.recoverCooldown > 0) fighter.recoverCooldown -= 1;
}

function performAction(actor, target, action, isPlayer) {
  const actorName = isPlayer ? "You" : "The Warden";
  const targetCard = isPlayer ? elements.enemyCard : elements.playerCard;
  let message = "";
  let usedRecover = false;

  if (action === "strike") {
    const outcome = applyDamage(target, randomInt(11, 16), targetCard);
    message = `${actorName} ${isPlayer ? "strike" : "strikes"} for ${outcome.damage} damage${outcome.blocked ? " through the guard" : ""}.`;
    if (isPlayer) state.score += outcome.damage * 10;
  }

  if (action === "guard") {
    actor.guarding = true;
    actor.energy = Math.min(MAX_ENERGY, actor.energy + 1);
    message = `${actorName} ${isPlayer ? "raise" : "raises"} a guard and ${isPlayer ? "gain" : "gains"} 1 energy.`;
  }

  if (action === "power") {
    actor.energy -= 2;
    const outcome = applyDamage(target, randomInt(22, 29), targetCard);
    message = `${actorName} ${isPlayer ? "unleash" : "unleashes"} a Power Strike for ${outcome.damage} damage${outcome.blocked ? " through the guard" : ""}!`;
    if (isPlayer) state.score += outcome.damage * 12;
  }

  if (action === "recover") {
    actor.energy -= 2;
    const before = actor.health;
    actor.health = Math.min(MAX_HEALTH, actor.health + randomInt(16, 22));
    const restored = actor.health - before;
    actor.recoverCooldown = 2;
    usedRecover = true;
    animateCard(isPlayer ? elements.playerCard : elements.enemyCard, "heal-flash");
    message = `${actorName} ${isPlayer ? "recover" : "recovers"} ${restored} health.`;
    if (isPlayer) state.score += restored * 5;
  }

  reduceCooldown(actor, usedRecover);
  return message;
}

function handlePlayerAction(action) {
  if (!state.playerTurn || state.gameOver) return;
  const button = elements.actionButtons.find((item) => item.dataset.action === action);
  if (!button || button.disabled) return;

  const message = performAction(state.player, state.enemy, action, true);
  setMessage(message);
  if (state.enemy.health <= 0) {
    endGame(true);
    return;
  }

  state.playerTurn = false;
  render();
  const token = gameToken;
  enemyTimer = window.setTimeout(() => {
    if (token === gameToken) takeEnemyTurn();
  }, 850);
}

function chooseEnemyAction() {
  const enemy = state.enemy;
  const player = state.player;
  const canRecover = enemy.energy >= 2 && enemy.recoverCooldown === 0 && enemy.health < MAX_HEALTH;

  if (enemy.health <= 34 && canRecover && Math.random() < .72) return "recover";
  if (enemy.energy >= 2 && !player.guarding && (player.health <= 30 || Math.random() < .55)) return "power";
  if (enemy.energy < 2 && Math.random() < .48) return "guard";
  if (player.guarding && Math.random() < .42) return "guard";
  return "strike";
}

function takeEnemyTurn() {
  if (state.gameOver) return;
  const action = chooseEnemyAction();
  const playerWasGuarding = state.player.guarding;
  const message = performAction(state.enemy, state.player, action, false);
  if (playerWasGuarding && (action === "strike" || action === "power")) state.score += 40;
  setMessage(message);

  if (state.player.health <= 0) {
    endGame(false);
    return;
  }

  state.round += 1;
  state.playerTurn = true;
  render();
  window.setTimeout(() => {
    if (!state.gameOver && state.playerTurn) setMessage("Your move. Choose an action.");
  }, 950);
}

function getBestScore() {
  try {
    const saved = Number.parseInt(localStorage.getItem("turnBasedBestScore"), 10);
    return Number.isFinite(saved) ? saved : 0;
  } catch (error) {
    return 0;
  }
}

function saveBestScore(score) {
  if (score <= getBestScore()) return;
  try { localStorage.setItem("turnBasedBestScore", String(score)); } catch (error) { /* Storage may be blocked. */ }
}

function endGame(playerWon) {
  state.gameOver = true;
  state.playerTurn = false;
  clearTimeout(enemyTimer);

  if (playerWon) {
    state.score += 500 + state.player.health * 5;
    elements.resultEmblem.textContent = "♛";
    elements.resultKicker.textContent = "Battle won";
    elements.resultTitle.textContent = "Victory!";
    elements.resultText.textContent = `The Iron Warden fell in round ${state.round}.`;
    saveBestScore(state.score);
  } else {
    elements.resultEmblem.textContent = "⚔";
    elements.resultKicker.textContent = "Battle lost";
    elements.resultTitle.textContent = "Defeated";
    elements.resultText.textContent = "The Warden held the arena. Change your tactics and try again.";
  }

  elements.finalScore.textContent = state.score.toLocaleString();
  render();
  elements.gameOverlay.hidden = false;
  window.setTimeout(() => elements.playAgainButton.focus(), 50);
}

elements.actionButtons.forEach((button) => {
  button.addEventListener("click", () => handlePlayerAction(button.dataset.action));
});

elements.restartButton.addEventListener("click", resetGame);
elements.playAgainButton.addEventListener("click", resetGame);

document.addEventListener("keydown", (event) => {
  if (event.key.toLowerCase() === "r") {
    resetGame();
    return;
  }
  const keyMap = { "1": "strike", "2": "guard", "3": "power", "4": "recover" };
  if (keyMap[event.key]) handlePlayerAction(keyMap[event.key]);
});

resetGame();


}
function begin(){poster.hidden=true;gm.hidden=false;if(!booted){booted=true;var s=document.createElement("style");s.textContent=LOOK;document.head.appendChild(s);boot();}else{var r=document.getElementById("restartButton");if(r)r.click();}}
poster.addEventListener("click",begin);
var nb=document.getElementById("new");if(nb)nb.addEventListener("click",begin);
})();
