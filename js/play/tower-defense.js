/* Tower Defense - game logic + its own look. Layout lives in style.css; page shell lives in the HTML. */
(function(){"use strict";
var gm=document.getElementById("gm"),poster=document.getElementById("poster"),booted=false;
var LOOK=".gm{\n  \n  \n  --teal: #16b8c4;\n  --action: #ffb84d;\n  --success: #22c55e;\n  --danger: #ef5b5b;\n  \n  \n  \n  \n  \n  --arena: #111827;\n  \n}.gm *{ box-sizing: border-box; }.gm button{ -webkit-tap-highlight-color: transparent; }.gm button{ font: inherit; }.gm .all-games{ color: var(--brand-dark); font-weight: 700; text-decoration: none; }.gm .all-games:hover{ text-decoration: underline; }.gm .page-shell{ width: min(1180px, calc(100% - 40px)); margin: auto; }.gm h2,.gm h3,.gm p{ margin-top: 0; }.gm h2{ margin-bottom: 16px; font-size: clamp(28px, 4vw, 36px); line-height: 1.15; letter-spacing: -.025em; }.gm h3{ margin-bottom: 8px; font-size: 22px; line-height: 1.25; }.gm .game-card{ overflow: hidden; border: 1px solid var(--border); border-radius: 20px; background: var(--card); box-shadow: var(--shadow); }.gm .game-toolbar{\n  min-height: 76px; padding: 13px 22px; display: grid; grid-template-columns: repeat(4, 1fr);\n  align-items: center; border-bottom: 1px solid #303b4f; color: white; background: var(--arena);\n}.gm .stat{ padding: 0 20px; border-right: 1px solid #334155; }.gm .stat:first-child{ padding-left: 0; }.gm .stat:last-child{ border: 0; }.gm .stat span{ display: block; color: #9ca3af; font-size: 13px; line-height: 1.1; text-transform: uppercase; letter-spacing: .07em; }.gm .stat strong{ display: block; margin-top: 4px; font-size: 22px; line-height: 1.1; }.gm .game-layout{ display: grid; grid-template-columns: minmax(0, 1fr) 270px; background: var(--arena); }.gm .arena-wrap{ position: relative; min-width: 0; aspect-ratio: 3 / 2; background: #172033; }.gm #gameCanvas{ width: 100%; height: 100%; display: block; touch-action: manipulation; cursor: crosshair; }.gm .game-overlay{\n  position: absolute; inset: 0; z-index: 5; padding: 20px; display: grid; place-items: center;\n  background: rgba(10, 16, 29, .69); backdrop-filter: blur(4px);\n}.gm .game-overlay.hidden{ display: none; }.gm .overlay-panel{ width: min(440px, 94%); padding: 28px; text-align: center; border: 1px solid rgba(255,255,255,.14); border-radius: 18px; color: white; background: rgba(31, 41, 55, .94); }.gm .overlay-kicker{ margin-bottom: 4px; color: #8ee7ec; font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: .09em; }.gm .overlay-panel h2{ margin-bottom: 10px; font-size: 31px; }.gm .overlay-panel p:not(.overlay-kicker){ margin-bottom: 20px; color: #cbd5e1; font-size: 16px; line-height: 1.55; }.gm .control-panel{ padding: 20px; display: flex; flex-direction: column; gap: 18px; border-left: 1px solid #303b4f; color: white; background: #1f2937; }.gm .panel-heading{ display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }.gm .panel-heading h2{ margin: 0; font-size: 20px; letter-spacing: 0; }.gm .panel-heading span{ color: #9ca3af; font-size: 12px; }.gm .tower-list{ display: grid; gap: 8px; }.gm .tower-option{\n  width: 100%; min-height: 58px; padding: 8px 10px; display: grid; grid-template-columns: 38px 1fr auto; gap: 9px;\n  align-items: center; border: 1px solid #3c475a; border-radius: 12px; color: #f8fafc; text-align: left; background: #273448; cursor: pointer;\n}.gm .tower-option:hover{ border-color: #64748b; }.gm .tower-option.selected{ border-color: #8f90ff; background: #33375a; box-shadow: inset 0 0 0 1px #8f90ff; }.gm .tower-option:disabled{ opacity: .5; cursor: not-allowed; }.gm .tower-option strong,.gm .tower-option small{ display: block; line-height: 1.3; }.gm .tower-option strong{ font-size: 15px; }.gm .tower-option small{ color: #aeb8c8; font-size: 12px; }.gm .tower-option b{ color: #ffce73; font-size: 14px; }.gm .tower-icon{ width: 36px; height: 36px; display: grid; place-items: center; border-radius: 10px; color: white; font-weight: 800; }.gm .archer-icon{ background: #5b5ce2; }.gm .cannon-icon{ background: #ef7c4b; }.gm .frost-icon{ background: #16a9c4; }.gm .tower-actions{ padding: 12px; border: 1px solid #3c475a; border-radius: 12px; background: #273448; }.gm .tower-actions div{ margin-bottom: 10px; }.gm .tower-actions span,.gm .tower-actions strong{ display: block; line-height: 1.4; }.gm .tower-actions span{ color: #aeb8c8; font-size: 12px; }.gm .tower-actions strong{ font-size: 14px; }.gm .game-message{ min-height: 44px; margin: 0; padding: 9px 10px; border-radius: 9px; color: #d7e0ed; background: #182233; font-size: 13px; line-height: 1.45; }.gm .round-controls{ margin-top: auto; display: grid; gap: 8px; }.gm .control-row{ display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }.gm .button{ min-height: 44px; padding: 9px 15px; border: 0; border-radius: 10px; font-size: 15px; font-weight: 800; cursor: pointer; }.gm .button:disabled{ opacity: .46; cursor: not-allowed; }.gm .button-primary{ color: white; background: var(--brand); box-shadow: 0 8px 16px rgba(91,92,226,.22); }.gm .button-primary:hover:not(:disabled){ background: #696af0; }.gm .button-secondary{ width: 100%; color: #1c2440; background: #ffbd54; }.gm .button-quiet{ color: #e5e7eb; border: 1px solid #435069; background: #2c394d; }.gm .button-quiet:hover{ background: #36445a; }.gm .text-button{ padding: 7px; border: 0; color: #bdc6d4; background: transparent; font-size: 13px; font-weight: 700; text-decoration: underline; text-underline-offset: 3px; cursor: pointer; }.gm .text-button:disabled{ opacity: .45; cursor: not-allowed; }.gm .button:focus-visible,.gm .tower-option:focus-visible,.gm .text-button:focus-visible,.gm summary:focus-visible{ outline: 3px solid var(--action); outline-offset: 3px; }.gm .control-guide{ display: grid; gap: 10px; }.gm .control-guide div{ display: grid; grid-template-columns: 74px 1fr; align-items: center; gap: 13px; }.gm kbd{ padding: 6px 8px; border: 1px solid #d8dbe5; border-bottom-width: 3px; border-radius: 8px; color: var(--brand-dark); text-align: center; background: #f8f8fc; font: 700 13px \"Nunito Sans\", sans-serif; }.gm .control-guide span{ color: var(--muted); font-size: 15px; }.gm .tips-grid{ display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }.gm .tips-grid article{ padding: 22px; border: 1px solid var(--border); border-radius: 16px; background: var(--card); }.gm .tips-grid article > span{ display: inline-grid; width: 34px; height: 34px; margin-bottom: 18px; place-items: center; border-radius: 9px; color: var(--brand); background: #eeeeff; font-size: 13px; font-weight: 800; }.gm .tips-grid p{ margin: 0; color: var(--muted); font-size: 16px; }.gm details{ border-top: 1px solid var(--border); background: transparent; }.gm details:last-child{ border-bottom: 1px solid var(--border); }.gm summary{ padding: 19px 4px; font-weight: 800; cursor: pointer; }.gm details p{ max-width: 800px; padding: 0 4px 17px; margin: 0; color: var(--muted); }@media (max-width: 900px){.gm .game-layout{ grid-template-columns: 1fr; }.gm .control-panel{ border-top: 1px solid #303b4f; border-left: 0; }.gm .tower-list{ grid-template-columns: repeat(3, 1fr); }.gm .tower-option{ grid-template-columns: 36px 1fr; }.gm .tower-option b{ grid-column: 2; }.gm .round-controls{ grid-template-columns: 1.2fr 1fr auto; align-items: center; }.gm .control-row{ grid-template-columns: 1fr 1fr; }}@media (max-width: 640px){.gm .page-shell{ width: min(100% - 24px, 1180px); }.gm .all-games{ font-size: 14px; }.gm .game-card{ margin-inline: -12px; border-radius: 0; border-inline: 0; }.gm .game-toolbar{ min-height: 66px; padding: 11px 12px; }.gm .stat{ padding: 0 8px; }.gm .stat span{ font-size: 10px; }.gm .stat strong{ font-size: 17px; }.gm .arena-wrap{ aspect-ratio: 3 / 2; }.gm .overlay-panel{ padding: 21px 15px; }.gm .overlay-panel h2{ font-size: 26px; }.gm .control-panel{ padding: 14px 12px 17px; gap: 13px; }.gm .tower-list{ gap: 7px; }.gm .tower-option{ min-height: 78px; padding: 8px 6px; grid-template-columns: 1fr; gap: 4px; text-align: center; }.gm .tower-option .tower-icon{ margin: auto; }.gm .tower-option b{ grid-column: auto; }.gm .tower-option small{ display: none; }.gm .tower-actions{ display: grid; grid-template-columns: 1fr 1fr; align-items: center; gap: 7px; }.gm .tower-actions[hidden]{ display: none; }.gm .tower-actions div{ grid-column: 1 / -1; margin: 0; }.gm .round-controls{ grid-template-columns: 1fr; }.gm .tips-grid{ grid-template-columns: 1fr; }}@media (prefers-reduced-motion: reduce){.gm *,.gm *::before,.gm *::after{ scroll-behavior: auto !important; animation-duration: .01ms !important; transition-duration: .01ms !important; }}";
function __ready(f){f()}
function boot(){
"use strict";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const ui = {
  wave: document.getElementById("waveStat"), lives: document.getElementById("livesStat"),
  coins: document.getElementById("coinsStat"), score: document.getElementById("scoreStat"),
  overlay: document.getElementById("gameOverlay"), overlayTitle: document.getElementById("overlayTitle"),
  overlayText: document.getElementById("overlayText"), overlayButton: document.getElementById("overlayButton"),
  waveButton: document.getElementById("waveButton"), pauseButton: document.getElementById("pauseButton"),
  speedButton: document.getElementById("speedButton"), restartButton: document.getElementById("restartButton"),
  message: document.getElementById("gameMessage"), towerList: document.getElementById("towerList"),
  towerActions: document.getElementById("towerActions"), selectedTowerName: document.getElementById("selectedTowerName"),
  upgradeButton: document.getElementById("upgradeButton"), sellButton: document.getElementById("sellButton")
};

const COLS = 12;
const ROWS = 8;
const TILE = 80;
const TOTAL_WAVES = 10;
const pathCells = [
  [0, 3], [1, 3], [2, 3], [2, 2], [2, 1], [3, 1], [4, 1], [5, 1],
  [5, 2], [5, 3], [5, 4], [6, 4], [7, 4], [8, 4], [8, 3], [8, 2],
  [9, 2], [10, 2], [10, 3], [10, 4], [10, 5], [11, 5]
];
const pathKey = new Set(pathCells.map(([x, y]) => `${x},${y}`));
const pathPoints = pathCells.map(([x, y]) => ({ x: x * TILE + TILE / 2, y: y * TILE + TILE / 2 }));

const towerTypes = {
  archer: { name: "Archer", cost: 70, color: "#7778f0", barrel: "#d9daff", range: 150, damage: 18, fireRate: .62, projectile: "#fff1a6" },
  cannon: { name: "Cannon", cost: 120, color: "#e76f43", barrel: "#452c32", range: 132, damage: 34, fireRate: 1.25, projectile: "#ffbb66", splash: 58 },
  frost: { name: "Frost", cost: 100, color: "#16a9c4", barrel: "#c5f8ff", range: 140, damage: 9, fireRate: .85, projectile: "#9cf5ff", slow: .55 }
};

let state;
let lastTime = performance.now();
let animationId;

function freshState() {
  return {
    lives: 20, coins: 220, score: 0, wave: 0, waveActive: false, gameOver: false, won: false,
    paused: false, speed: 1, buildType: "archer", selectedTower: null, towers: [], enemies: [], projectiles: [],
    particles: [], spawnQueue: [], spawnTimer: 0, nextId: 1, started: false, hoverCell: null, messageTimer: 0
  };
}

function init() {
  state = freshState();
  lastTime = performance.now();
  ui.overlay.classList.remove("hidden");
  ui.overlayTitle.textContent = "Ready to Defend?";
  ui.overlayText.textContent = "Choose a tower, place it on the grass, then launch the first wave.";
  ui.overlayButton.textContent = "Start Building";
  selectBuildType("archer");
  updateUI();
  showMessage("Place towers on grass tiles.", true);
}

function startBuilding() {
  state.started = true;
  ui.overlay.classList.add("hidden");
  canvas.focus?.();
}

function createWave(number) {
  const count = 7 + number * 2;
  const queue = [];
  for (let i = 0; i < count; i++) {
    let kind = "grunt";
    if (number >= 3 && i % 5 === 4) kind = "runner";
    if (number >= 5 && i % 6 === 2) kind = "armored";
    if (number === 10 && i === count - 1) kind = "boss";
    queue.push(kind);
  }
  return queue;
}

function enemyStats(kind) {
  const scale = 1 + (state.wave - 1) * .19;
  const stats = {
    grunt: { hp: 58, speed: 58, reward: 13, radius: 18, color: "#f2cd5d" },
    runner: { hp: 39, speed: 92, reward: 15, radius: 14, color: "#ee7c72" },
    armored: { hp: 125, speed: 43, reward: 24, radius: 21, color: "#a9b4c4" },
    boss: { hp: 620, speed: 32, reward: 120, radius: 29, color: "#c982e6" }
  }[kind];
  return { ...stats, hp: Math.round(stats.hp * scale), maxHp: Math.round(stats.hp * scale) };
}

function spawnEnemy(kind) {
  const stats = enemyStats(kind);
  state.enemies.push({ id: state.nextId++, kind, ...stats, x: pathPoints[0].x, y: pathPoints[0].y, pathIndex: 0, slowUntil: 0, dead: false });
}

function startWave() {
  if (!state.started) startBuilding();
  if (state.gameOver || state.won || state.waveActive || state.wave >= TOTAL_WAVES) return;
  state.wave++;
  state.waveActive = true;
  state.spawnQueue = createWave(state.wave);
  state.spawnTimer = 0;
  state.selectedTower = null;
  showMessage(`Wave ${state.wave} started. ${state.spawnQueue.length} enemies incoming.`);
  updateUI();
}

function update(dt, now) {
  if (!state.started || state.paused || state.gameOver || state.won) return;
  const scaledDt = Math.min(dt, .04) * state.speed;

  if (state.waveActive && state.spawnQueue.length) {
    state.spawnTimer -= scaledDt;
    if (state.spawnTimer <= 0) {
      spawnEnemy(state.spawnQueue.shift());
      state.spawnTimer = Math.max(.34, .82 - state.wave * .025);
    }
  }

  for (const enemy of state.enemies) {
    if (enemy.dead) continue;
    const next = pathPoints[enemy.pathIndex + 1];
    if (!next) {
      enemy.dead = true;
      state.lives--;
      burst(enemy.x, enemy.y, "#ef5b5b", 9);
      showMessage("An enemy reached the crystal!", true);
      if (state.lives <= 0) endGame(false);
      continue;
    }
    const dx = next.x - enemy.x;
    const dy = next.y - enemy.y;
    const distance = Math.hypot(dx, dy);
    const slowFactor = now < enemy.slowUntil ? .52 : 1;
    const step = enemy.speed * slowFactor * scaledDt;
    if (step >= distance) {
      enemy.x = next.x; enemy.y = next.y; enemy.pathIndex++;
    } else {
      enemy.x += dx / distance * step; enemy.y += dy / distance * step;
    }
  }

  for (const tower of state.towers) {
    tower.cooldown -= scaledDt;
    if (tower.cooldown <= 0) {
      const target = findTarget(tower);
      if (target) fire(tower, target);
    }
  }

  for (const projectile of state.projectiles) {
    if (projectile.dead || projectile.target.dead) { projectile.dead = true; continue; }
    const dx = projectile.target.x - projectile.x;
    const dy = projectile.target.y - projectile.y;
    const distance = Math.hypot(dx, dy);
    const step = projectile.speed * scaledDt;
    if (step >= distance || distance < 8) hitTarget(projectile, now);
    else { projectile.x += dx / distance * step; projectile.y += dy / distance * step; }
  }

  for (const particle of state.particles) {
    particle.life -= scaledDt;
    particle.x += particle.vx * scaledDt;
    particle.y += particle.vy * scaledDt;
    particle.vx *= .96; particle.vy *= .96;
  }

  state.enemies = state.enemies.filter(enemy => !enemy.dead);
  state.projectiles = state.projectiles.filter(projectile => !projectile.dead);
  state.particles = state.particles.filter(particle => particle.life > 0);

  if (state.waveActive && !state.spawnQueue.length && !state.enemies.length) {
    state.waveActive = false;
    if (state.wave >= TOTAL_WAVES) endGame(true);
    else {
      const bonus = 25 + state.wave * 5;
      state.coins += bonus;
      showMessage(`Wave cleared! Preparation bonus: ${bonus} coins.`);
    }
  }
  updateUI();
}

function findTarget(tower) {
  let best = null;
  let bestProgress = -1;
  for (const enemy of state.enemies) {
    if (enemy.dead || Math.hypot(enemy.x - tower.x, enemy.y - tower.y) > tower.range) continue;
    const next = pathPoints[enemy.pathIndex + 1] || pathPoints[enemy.pathIndex];
    const progress = enemy.pathIndex + (1 - Math.min(1, Math.hypot(next.x - enemy.x, next.y - enemy.y) / TILE));
    if (progress > bestProgress) { best = enemy; bestProgress = progress; }
  }
  return best;
}

function fire(tower, target) {
  const type = towerTypes[tower.type];
  const multiplier = 1 + (tower.level - 1) * .48;
  tower.angle = Math.atan2(target.y - tower.y, target.x - tower.x);
  tower.cooldown = type.fireRate / (1 + (tower.level - 1) * .12);
  state.projectiles.push({
    x: tower.x + Math.cos(tower.angle) * 18, y: tower.y + Math.sin(tower.angle) * 18,
    target, damage: type.damage * multiplier, color: type.projectile, speed: tower.type === "cannon" ? 280 : 390,
    splash: type.splash || 0, slow: type.slow || 0, dead: false, radius: tower.type === "cannon" ? 7 : 4
  });
}

function hitTarget(projectile, now) {
  projectile.dead = true;
  const victims = projectile.splash
    ? state.enemies.filter(enemy => !enemy.dead && Math.hypot(enemy.x - projectile.target.x, enemy.y - projectile.target.y) <= projectile.splash)
    : [projectile.target];
  for (const enemy of victims) {
    damageEnemy(enemy, projectile.damage * (enemy === projectile.target ? 1 : .62));
    if (projectile.slow && !enemy.dead) enemy.slowUntil = Math.max(enemy.slowUntil, now + 1450);
  }
  burst(projectile.target.x, projectile.target.y, projectile.color, projectile.splash ? 10 : 5);
}

function damageEnemy(enemy, damage) {
  enemy.hp -= damage;
  if (enemy.hp <= 0 && !enemy.dead) {
    enemy.dead = true;
    state.coins += enemy.reward;
    state.score += enemy.reward * 10;
    burst(enemy.x, enemy.y, enemy.color, 12);
  }
}

function burst(x, y, color, amount) {
  for (let i = 0; i < amount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 22 + Math.random() * 55;
    state.particles.push({ x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, color, life: .35 + Math.random() * .3, maxLife: .65 });
  }
}

function buildAt(col, row) {
  if (state.gameOver || state.won) return;
  const existing = state.towers.find(t => t.col === col && t.row === row);
  if (existing) {
    state.selectedTower = existing;
    showMessage(`${towerTypes[existing.type].name} tower selected.`);
    updateUI();
    return;
  }
  if (pathKey.has(`${col},${row}`)) { showMessage("The enemy road must stay clear.", true); return; }
  const type = towerTypes[state.buildType];
  if (state.coins < type.cost) { showMessage(`You need ${type.cost - state.coins} more coins for this tower.`, true); return; }
  state.coins -= type.cost;
  const tower = { id: state.nextId++, type: state.buildType, col, row, x: col * TILE + TILE / 2, y: row * TILE + TILE / 2, level: 1, cooldown: .15, angle: -Math.PI / 2 };
  state.towers.push(tower);
  state.selectedTower = tower;
  burst(tower.x, tower.y, type.color, 12);
  showMessage(`${type.name} tower built.`);
  updateUI();
}

function selectBuildType(type) {
  state.buildType = type;
  state.selectedTower = null;
  document.querySelectorAll(".tower-option").forEach(button => {
    const active = button.dataset.tower === type;
    button.classList.toggle("selected", active);
    button.setAttribute("aria-pressed", String(active));
  });
  showMessage(`${towerTypes[type].name} selected. Tap an open grass tile.`);
  updateUI();
}

function upgradeSelected() {
  const tower = state.selectedTower;
  if (!tower || !state.towers.includes(tower) || tower.level >= 3) return;
  const cost = upgradeCost(tower);
  if (state.coins < cost) { showMessage(`You need ${cost - state.coins} more coins to upgrade.`, true); return; }
  state.coins -= cost;
  tower.level++;
  tower.range += 10;
  burst(tower.x, tower.y, "#ffce73", 16);
  showMessage(`${towerTypes[tower.type].name} upgraded to level ${tower.level}.`);
  updateUI();
}

function sellSelected() {
  const tower = state.selectedTower;
  if (!tower || !state.towers.includes(tower)) return;
  const value = sellValue(tower);
  state.coins += value;
  state.towers = state.towers.filter(item => item !== tower);
  state.selectedTower = null;
  burst(tower.x, tower.y, "#a9b4c4", 12);
  showMessage(`Tower sold for ${value} coins.`);
  updateUI();
}

function upgradeCost(tower) { return Math.round(towerTypes[tower.type].cost * (.72 + tower.level * .18)); }
function sellValue(tower) {
  let spent = towerTypes[tower.type].cost;
  for (let level = 1; level < tower.level; level++) spent += Math.round(towerTypes[tower.type].cost * (.72 + level * .18));
  return Math.round(spent * .62);
}

function endGame(won) {
  state.won = won; state.gameOver = !won; state.waveActive = false; state.paused = false;
  ui.overlayTitle.textContent = won ? "Crystal Defended!" : "The Crystal Fell";
  ui.overlayText.textContent = won ? `You survived all ten waves with ${state.lives} lives and scored ${state.score}.` : `You reached wave ${state.wave} with a score of ${state.score}. Rebuild and try a different strategy.`;
  ui.overlayButton.textContent = "Play Again";
  ui.overlay.classList.remove("hidden");
  updateUI();
}

function togglePause() {
  if (!state.started || state.gameOver || state.won) return;
  state.paused = !state.paused;
  showMessage(state.paused ? "Game paused." : "Defense resumed.");
  updateUI();
}

function toggleSpeed() {
  state.speed = state.speed === 1 ? 2 : 1;
  showMessage(`Game speed set to ×${state.speed}.`);
  updateUI();
}

function updateUI() {
  ui.wave.textContent = `${state.wave} / ${TOTAL_WAVES}`;
  ui.lives.textContent = state.lives;
  ui.coins.textContent = state.coins;
  ui.score.textContent = state.score;
  ui.waveButton.disabled = state.waveActive || state.gameOver || state.won || state.wave >= TOTAL_WAVES;
  ui.waveButton.textContent = state.waveActive ? `Wave ${state.wave} in progress` : `Start Wave ${state.wave + 1}`;
  ui.pauseButton.textContent = state.paused ? "Resume" : "Pause";
  ui.pauseButton.setAttribute("aria-pressed", String(state.paused));
  ui.speedButton.textContent = `Speed ×${state.speed}`;
  ui.speedButton.setAttribute("aria-pressed", String(state.speed === 2));
  document.querySelectorAll(".tower-option").forEach(button => {
    button.disabled = state.coins < towerTypes[button.dataset.tower].cost && button.dataset.tower !== state.buildType;
  });

  const tower = state.selectedTower;
  const valid = tower && state.towers.includes(tower);
  ui.towerActions.hidden = !valid;
  if (valid) {
    const maxed = tower.level >= 3;
    const cost = maxed ? 0 : upgradeCost(tower);
    ui.selectedTowerName.textContent = `${towerTypes[tower.type].name} · Level ${tower.level}`;
    ui.upgradeButton.textContent = maxed ? "Maximum level" : `Upgrade · ${cost}`;
    ui.upgradeButton.disabled = maxed || state.coins < cost;
    ui.sellButton.textContent = `Sell for ${sellValue(tower)} coins`;
  }
}

function showMessage(text, urgent = false) {
  ui.message.textContent = text;
  ui.message.style.color = urgent ? "#ffc2bd" : "#d7e0ed";
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawTerrain();
  drawPath();
  drawDecor();
  if (state.hoverCell) drawBuildPreview();
  for (const tower of state.towers) drawTower(tower);
  for (const enemy of state.enemies) drawEnemy(enemy);
  for (const projectile of state.projectiles) drawProjectile(projectile);
  for (const particle of state.particles) drawParticle(particle);
}

function drawTerrain() {
  ctx.fillStyle = "#244d40";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  for (let row = 0; row < ROWS; row++) for (let col = 0; col < COLS; col++) {
    if ((row + col) % 2 === 0) { ctx.fillStyle = "rgba(255,255,255,.018)"; ctx.fillRect(col * TILE, row * TILE, TILE, TILE); }
  }
}

function drawPath() {
  ctx.lineCap = "square"; ctx.lineJoin = "round";
  ctx.strokeStyle = "#172d2a"; ctx.lineWidth = 64;
  tracePath(); ctx.stroke();
  ctx.strokeStyle = "#c8a56b"; ctx.lineWidth = 52;
  tracePath(); ctx.stroke();
  ctx.strokeStyle = "rgba(255,238,193,.23)"; ctx.lineWidth = 2; ctx.setLineDash([10, 13]);
  tracePath(); ctx.stroke(); ctx.setLineDash([]);
}

function tracePath() {
  ctx.beginPath(); ctx.moveTo(-10, pathPoints[0].y);
  pathPoints.forEach(point => ctx.lineTo(point.x, point.y));
  ctx.lineTo(canvas.width + 10, pathPoints[pathPoints.length - 1].y);
}

function drawDecor() {
  ctx.fillStyle = "#7be0a7";
  [[55,70],[145,570],[710,70],[905,570],[360,355],[690,590]].forEach(([x,y]) => {
    ctx.beginPath(); ctx.arc(x,y,4,0,Math.PI*2); ctx.arc(x+9,y-5,3,0,Math.PI*2); ctx.fill();
  });
  const end = pathPoints[pathPoints.length - 1];
  ctx.save(); ctx.translate(end.x, end.y);
  ctx.shadowColor = "#75ecff"; ctx.shadowBlur = 20;
  ctx.fillStyle = "#9cf5ff"; ctx.beginPath(); ctx.moveTo(0,-22); ctx.lineTo(17,-5); ctx.lineTo(10,20); ctx.lineTo(-10,20); ctx.lineTo(-17,-5); ctx.closePath(); ctx.fill();
  ctx.restore();
}

function drawTower(tower) {
  const type = towerTypes[tower.type];
  if (state.selectedTower === tower) {
    ctx.fillStyle = "rgba(131, 219, 232, .09)"; ctx.strokeStyle = "rgba(156,245,255,.7)"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(tower.x, tower.y, tower.range, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  }
  ctx.fillStyle = "#172033"; ctx.beginPath(); ctx.arc(tower.x, tower.y + 4, 27, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = type.color; ctx.beginPath(); ctx.arc(tower.x, tower.y, 23, 0, Math.PI * 2); ctx.fill();
  ctx.save(); ctx.translate(tower.x, tower.y); ctx.rotate(tower.angle);
  ctx.fillStyle = type.barrel; ctx.fillRect(3, -5, tower.type === "cannon" ? 28 : 25, tower.type === "cannon" ? 10 : 7); ctx.restore();
  ctx.fillStyle = "#fff"; ctx.font = "800 12px Nunito Sans, sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(tower.level, tower.x, tower.y);
}

function drawEnemy(enemy) {
  ctx.save(); ctx.translate(enemy.x, enemy.y);
  ctx.fillStyle = "rgba(0,0,0,.22)"; ctx.beginPath(); ctx.ellipse(2, enemy.radius * .8, enemy.radius, enemy.radius * .45, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = enemy.color; ctx.beginPath(); ctx.arc(0, 0, enemy.radius, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#263347"; ctx.beginPath(); ctx.arc(-5, -3, 2.3, 0, Math.PI * 2); ctx.arc(5, -3, 2.3, 0, Math.PI * 2); ctx.fill();
  if (performance.now() < enemy.slowUntil) { ctx.strokeStyle = "#9cf5ff"; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(0, 0, enemy.radius + 4, 0, Math.PI * 2); ctx.stroke(); }
  ctx.restore();
  const width = Math.max(28, enemy.radius * 2.1);
  ctx.fillStyle = "rgba(11,18,31,.8)"; ctx.fillRect(enemy.x - width/2, enemy.y - enemy.radius - 10, width, 5);
  ctx.fillStyle = enemy.hp / enemy.maxHp > .35 ? "#4ade80" : "#f87171"; ctx.fillRect(enemy.x - width/2, enemy.y - enemy.radius - 10, width * Math.max(0, enemy.hp / enemy.maxHp), 5);
}

function drawProjectile(projectile) {
  ctx.fillStyle = projectile.color; ctx.shadowColor = projectile.color; ctx.shadowBlur = 8;
  ctx.beginPath(); ctx.arc(projectile.x, projectile.y, projectile.radius, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0;
}

function drawParticle(particle) {
  ctx.globalAlpha = Math.max(0, particle.life / particle.maxLife);
  ctx.fillStyle = particle.color; ctx.fillRect(particle.x - 2, particle.y - 2, 4, 4); ctx.globalAlpha = 1;
}

function drawBuildPreview() {
  const { col, row } = state.hoverCell;
  if (col < 0 || col >= COLS || row < 0 || row >= ROWS) return;
  const occupied = state.towers.some(t => t.col === col && t.row === row);
  const invalid = occupied || pathKey.has(`${col},${row}`);
  ctx.fillStyle = invalid ? "rgba(239,91,91,.26)" : "rgba(156,245,255,.18)";
  ctx.strokeStyle = invalid ? "#ef5b5b" : "#9cf5ff"; ctx.lineWidth = 2;
  ctx.fillRect(col * TILE + 4, row * TILE + 4, TILE - 8, TILE - 8);
  ctx.strokeRect(col * TILE + 5, row * TILE + 5, TILE - 10, TILE - 10);
}

function pointerCell(event) {
  const rect = canvas.getBoundingClientRect();
  return { col: Math.floor((event.clientX - rect.left) * canvas.width / rect.width / TILE), row: Math.floor((event.clientY - rect.top) * canvas.height / rect.height / TILE) };
}

canvas.addEventListener("pointermove", event => { state.hoverCell = pointerCell(event); });
canvas.addEventListener("pointerleave", () => { state.hoverCell = null; });
canvas.addEventListener("pointerdown", event => {
  if (!state.started || state.paused) return;
  const { col, row } = pointerCell(event);
  if (col >= 0 && col < COLS && row >= 0 && row < ROWS) buildAt(col, row);
});

ui.towerList.addEventListener("click", event => {
  const button = event.target.closest(".tower-option");
  if (button && !button.disabled) selectBuildType(button.dataset.tower);
});
ui.waveButton.addEventListener("click", startWave);
ui.pauseButton.addEventListener("click", togglePause);
ui.speedButton.addEventListener("click", toggleSpeed);
ui.upgradeButton.addEventListener("click", upgradeSelected);
ui.sellButton.addEventListener("click", sellSelected);
ui.restartButton.addEventListener("click", init);
ui.overlayButton.addEventListener("click", () => {
  if (state.gameOver || state.won) {
    init();
    startBuilding();
  } else {
    startBuilding();
  }
});
document.addEventListener("keydown", event => {
  if (event.code === "Space" && event.target.tagName !== "BUTTON") { event.preventDefault(); startWave(); }
  if (event.key.toLowerCase() === "p") togglePause();
  if (event.key === "Escape") { state.selectedTower = null; updateUI(); }
});

function loop(time) {
  const dt = (time - lastTime) / 1000;
  lastTime = time;
  update(dt, time);
  draw();
  animationId = requestAnimationFrame(loop);
}

document.getElementById("year").textContent = new Date().getFullYear();
init();
cancelAnimationFrame(animationId);
animationId = requestAnimationFrame(loop);


}
function begin(){poster.hidden=true;gm.hidden=false;if(!booted){booted=true;var s=document.createElement("style");s.textContent=LOOK;document.head.appendChild(s);boot();}else{var r=document.getElementById("overlayButton");if(r)r.click();}}
poster.addEventListener("click",begin);
var nb=document.getElementById("new");if(nb)nb.addEventListener("click",begin);
})();
