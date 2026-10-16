/* Quest Adventure - game logic + its own look. Layout lives in style.css; page shell lives in the HTML. */
(function(){"use strict";
var gm=document.getElementById("gm"),poster=document.getElementById("poster"),booted=false;
var LOOK=".gm{\n  \n  \n  --accent: #16b8c4;\n  --action: #ffb84d;\n  \n  \n  \n  --background: #f6f7fb;\n  \n  --forest: #17251f;\n  --forest-light: #21362c;\n  --radius: 18px;\n  font-family: \"Nunito Sans\", system-ui, sans-serif;\n  color: var(--text);\n  background: var(--background);\n}.gm *{ box-sizing: border-box; }.gm button{ font: inherit; }.gm button{ -webkit-tap-highlight-color: transparent; }.gm button:focus-visible,.gm summary:focus-visible{ outline: 3px solid #16b8c4; outline-offset: 3px; }.gm .page-shell{ width: min(1160px, calc(100% - 40px)); margin-inline: auto; }.gm .visually-hidden{ position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; }.gm .hidden{ display: none !important; }.gm .all-games{ color: var(--brand-dark); font-size: 15px; font-weight: 800; text-decoration: none; }.gm .kicker{ margin: 0; color: var(--brand); font-size: 13px; font-weight: 800; letter-spacing: .13em; text-transform: uppercase; }.gm .game-card{ overflow: hidden; background: var(--card); border: 1px solid var(--border); border-radius: 20px; box-shadow: 0 20px 55px rgba(23,27,45,.08); }.gm .game-toolbar{ min-height: 76px; padding: 12px 18px; display: flex; align-items: center; gap: 12px; border-bottom: 1px solid #33443a; color: white; background: var(--forest); }.gm .stat{ min-width: 100px; padding: 5px 15px; border-right: 1px solid #3b4c43; }.gm .stat span{ display: block; color: #aebbb4; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; }.gm .stat strong{ display: block; font-size: 23px; line-height: 1.2; }.gm .health-stat{ flex: 1; }.gm .health-stat strong{ color: #ff746e; letter-spacing: 2px; }.gm .icon-button{ width: 44px; height: 44px; margin-left: auto; color: white; background: #2c4035; border: 1px solid #485b50; border-radius: 12px; font-weight: 800; cursor: pointer; }.gm .icon-button:hover{ background: #3a5144; }.gm .game-frame{ position: relative; aspect-ratio: 10 / 7; max-height: 672px; overflow: hidden; background: var(--forest); touch-action: none; }.gm #gameCanvas{ display: block; width: 100%; height: 100%; image-rendering: pixelated; }.gm .announcement{ position: absolute; top: 16px; left: 50%; z-index: 3; padding: 8px 16px; color: white; background: rgba(17,24,39,.9); border: 1px solid rgba(255,255,255,.18); border-radius: 999px; font-size: 14px; font-weight: 800; transform: translate(-50%, -20px); opacity: 0; pointer-events: none; transition: .24s ease; }.gm .announcement.show{ transform: translate(-50%,0); opacity: 1; }.gm .overlay{ position: absolute; inset: 0; z-index: 5; display: grid; place-items: center; padding: 24px; background: rgba(11,19,15,.75); backdrop-filter: blur(5px); }.gm .overlay-panel{ width: min(500px, 100%); padding: 34px; text-align: center; color: white; background: rgba(27,43,35,.96); border: 1px solid #52675a; border-radius: 20px; box-shadow: 0 22px 60px rgba(0,0,0,.35); }.gm .overlay-icon{ display: grid; place-items: center; width: 64px; height: 64px; margin: 0 auto 15px; color: #6f440a; background: #ffc75c; border: 5px solid #ffe2a2; border-radius: 20px; font-size: 31px; }.gm .overlay .kicker{ color: #9ee0ae; }.gm .overlay h2{ margin: 6px 0 10px; font-size: clamp(28px, 5vw, 38px); line-height: 1.14; }.gm .overlay p:not(.kicker){ margin: 0 auto 22px; color: #d3ddd7; }.gm .overlay small{ display: block; margin-top: 14px; color: #9fb0a6; }.gm .primary-button,.gm .secondary-button{ min-height: 48px; padding: 0 22px; border-radius: 12px; font-weight: 800; cursor: pointer; }.gm .primary-button{ color: #2f260f; background: var(--action); border: 0; box-shadow: 0 5px 0 #cf8726; }.gm .primary-button:hover{ background: #ffc66f; }.gm .primary-button:active{ transform: translateY(3px); box-shadow: 0 2px 0 #cf8726; }.gm .final-score{ display: inline-flex; flex-direction: column; min-width: 145px; margin: 0 auto 24px; padding: 10px 24px; background: #20372b; border-radius: 12px; }.gm .final-score span{ color: #a8b8af; font-size: 12px; font-weight: 800; text-transform: uppercase; }.gm .final-score strong{ color: #ffd476; font-size: 28px; }.gm .mobile-controls{ display: none; padding: 18px; align-items: center; justify-content: space-between; background: #f0f2f7; border-top: 1px solid var(--border); }.gm .d-pad{ display: grid; grid-template: repeat(3, 48px) / repeat(3, 48px); gap: 5px; }.gm .control{ color: white; background: var(--brand); border: 0; border-radius: 12px; font-size: 18px; font-weight: 800; box-shadow: 0 4px 0 var(--brand-dark); }.gm .control:active,.gm .control.active{ transform: translateY(3px); box-shadow: 0 1px 0 var(--brand-dark); }.gm .control.up{ grid-area: 1 / 2; }.gm .control.left{ grid-area: 2 / 1; }.gm .control.down{ grid-area: 2 / 2; }.gm .control.right{ grid-area: 2 / 3; }.gm .attack-button{ width: 106px; height: 106px; color: #4a310e; background: var(--action); border: 0; border-radius: 50%; font-size: 15px; font-weight: 800; box-shadow: 0 6px 0 #d28c2d; }.gm .attack-button span{ display: block; font-size: 30px; line-height: 1; }.gm .attack-button:active{ transform: translateY(4px); box-shadow: 0 2px 0 #d28c2d; }.gm .game-actions{ min-height: 70px; padding: 12px 18px; display: flex; gap: 20px; align-items: center; justify-content: space-between; }.gm .game-actions p{ margin: 0; color: #475467; font-weight: 700; }.gm .secondary-button{ color: var(--brand-dark); background: #f0f0ff; border: 1px solid #dadafb; }.gm .secondary-button:hover{ background: #e6e6ff; }.gm .tips-section h2{ margin: 6px 0 16px; font-size: clamp(28px,4vw,36px); line-height: 1.2; }.gm .steps{ padding: 0; margin: 28px 0 0; list-style: none; counter-reset: step; }.gm .steps li{ position: relative; padding: 0 0 20px 48px; counter-increment: step; }.gm .steps li:last-child{ padding-bottom: 0; }.gm .steps li::before{ content: counter(step); position: absolute; left: 0; top: 1px; display: grid; place-items: center; width: 32px; height: 32px; color: white; background: var(--brand); border-radius: 10px; font-size: 14px; font-weight: 800; }.gm .steps strong{ display: block; }.gm .controls-card{ color: white; background: #20253a; border-color: #20253a; }.gm .controls-card .eyebrow{ color: #7ce0e5; }.gm .control-row{ min-height: 67px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #3a4054; }.gm .control-row > span{ color: #bbc1d1; }.gm kbd{ display: inline-block; min-width: 54px; padding: 5px 9px; text-align: center; color: #20253a; background: white; border-radius: 7px; box-shadow: 0 3px 0 #aeb4c4; font-family: inherit; font-size: 13px; font-weight: 800; }.gm .control-row div span{ padding: 0 5px; color: #9ea5b9; font-size: 13px; }.gm .touch-note{ margin-top: 22px !important; color: #bbc1d1 !important; font-size: 15px; }.gm .tips-section{ padding: 72px 0 0; }.gm .tip-grid{ display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }.gm .tip-grid article{ padding: 26px; background: white; border: 1px solid var(--border); border-radius: 16px; }.gm .tip-grid span{ color: var(--brand); font-size: 14px; font-weight: 800; }.gm .tip-grid h3{ margin: 13px 0 7px; font-size: 21px; }.gm .tip-grid p{ margin: 0; color: var(--muted); }@media (max-width: 760px){.gm .page-shell{ width: min(100% - 28px, 1160px); }.gm .game-card{ margin-inline: -14px; border-radius: 0; border-inline: 0; }.gm .game-toolbar{ min-height: 66px; padding: 8px; gap: 0; }.gm .stat{ min-width: 0; flex: 1; padding: 4px 8px; }.gm .stat strong{ font-size: 18px; }.gm .health-stat{ flex: 1.45; }.gm .health-stat strong{ font-size: 16px; letter-spacing: 0; }.gm .icon-button{ width: 40px; height: 40px; }.gm .game-frame{ aspect-ratio: 10 / 7; }.gm .overlay{ padding: 14px; }.gm .overlay-panel{ padding: 22px 18px; }.gm .overlay-icon{ width: 50px; height: 50px; margin-bottom: 10px; font-size: 24px; }.gm .overlay h2{ font-size: 27px; }.gm .overlay p:not(.kicker){ margin-bottom: 16px; font-size: 15px; line-height: 1.45; }.gm .overlay small{ display: none; }.gm .mobile-controls{ display: flex; }.gm .game-actions{ align-items: stretch; flex-direction: column; gap: 9px; }.gm .game-actions p{ text-align: center; }.gm .tip-grid{ grid-template-columns: 1fr; }.gm .tips-section{ padding-top: 54px; }}@media (max-width: 430px){.gm .stat span{ font-size: 10px; }.gm .stat strong{ font-size: 16px; }.gm .health-stat strong{ font-size: 13px; }.gm .game-frame{ min-height: 245px; }.gm .d-pad{ grid-template: repeat(2, 45px) / repeat(3, 45px); }.gm .attack-button{ width: 94px; height: 94px; }.gm .mobile-controls{ padding: 15px 20px; }}@media (prefers-reduced-motion: reduce){.gm *,.gm *::before,.gm *::after{ scroll-behavior: auto !important; transition-duration: .01ms !important; }}";
function __ready(f){f()}
function boot(){
"use strict";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");
const bestScoreEl = document.getElementById("bestScore");
const healthEl = document.getElementById("health");
const relicsEl = document.getElementById("relics");
const objectiveEl = document.getElementById("objective");
const startOverlay = document.getElementById("startOverlay");
const resultOverlay = document.getElementById("resultOverlay");
const pauseButton = document.getElementById("pauseButton");
const announcement = document.getElementById("announcement");

const COLS = 20;
const ROWS = 14;
const TILE = canvas.width / COLS;
const MAX_HEALTH = 5;
const RELIC_TOTAL = 3;

const baseMap = [
  "####################",
  "#....#.............#",
  "#....#..~~~..###...#",
  "#.......~~~........#",
  "#.####..~~~..#.....#",
  "#..........#.#.###.#",
  "#..~~~.....#.......#",
  "#..~~~..#####..##..#",
  "#..~~~.............#",
  "#......###...####..#",
  "#.####.............#",
  "#........##..~~~...#",
  "#............~~~...#",
  "####################"
];

const itemBlueprint = [
  { x: 3, y: 3, type: "relic" }, { x: 15, y: 4, type: "relic" }, { x: 12, y: 11, type: "relic" },
  { x: 7, y: 1, type: "coin" }, { x: 16, y: 1, type: "coin" }, { x: 7, y: 5, type: "coin" },
  { x: 2, y: 9, type: "coin" }, { x: 10, y: 8, type: "coin" }, { x: 17, y: 10, type: "coin" },
  { x: 6, y: 12, type: "coin" }, { x: 14, y: 8, type: "heart" }, { x: 4, y: 11, type: "heart" }
];

const enemyBlueprint = [
  { x: 10, y: 3 }, { x: 16, y: 5 }, { x: 6, y: 8 }, { x: 15, y: 10 }, { x: 9, y: 12 }
];

let player;
let items = [];
let enemies = [];
let particles = [];
let score = 0;
let relics = 0;
let state = "ready";
let startTime = 0;
let lastFrame = 0;
let enemyAccumulator = 0;
let attackUntil = 0;
let hurtUntil = 0;
let messageTimer;
let touchStart = null;
let bestScore = Number(localStorage.getItem("questBestScore") || 0);

bestScoreEl.textContent = bestScore;

function resetGame() {
  player = { x: 1, y: 1, health: MAX_HEALTH, facing: "right" };
  items = itemBlueprint.map(item => ({ ...item, collected: false }));
  enemies = enemyBlueprint.map((enemy, id) => ({ ...enemy, id, alive: true }));
  particles = [];
  score = 0;
  relics = 0;
  enemyAccumulator = 0;
  attackUntil = 0;
  hurtUntil = 0;
  updateHud();
  draw(performance.now());
}

function startGame() {
  resetGame();
  state = "playing";
  startTime = performance.now();
  startOverlay.classList.add("hidden");
  resultOverlay.classList.add("hidden");
  pauseButton.textContent = "Ⅱ";
  pauseButton.setAttribute("aria-label", "Pause game");
  canvas.focus();
}

function isWalkable(x, y) {
  return x >= 0 && x < COLS && y >= 0 && y < ROWS && baseMap[y][x] === ".";
}

function movePlayer(dx, dy) {
  if (state !== "playing") return;
  if (dx > 0) player.facing = "right";
  if (dx < 0) player.facing = "left";
  if (dy > 0) player.facing = "down";
  if (dy < 0) player.facing = "up";
  const nx = player.x + dx;
  const ny = player.y + dy;
  if (!isWalkable(nx, ny)) return;
  player.x = nx;
  player.y = ny;
  collectAt(nx, ny);
  checkEnemyContact();
  checkPortal();
}

function collectAt(x, y) {
  const item = items.find(entry => !entry.collected && entry.x === x && entry.y === y);
  if (!item) return;
  item.collected = true;
  if (item.type === "coin") {
    score += 50;
    burst(x, y, "#ffd166");
    showMessage("Coin found · +50");
  } else if (item.type === "heart") {
    if (player.health < MAX_HEALTH) {
      player.health++;
      showMessage("Health restored");
    } else {
      score += 25;
      showMessage("Full health · +25");
    }
    burst(x, y, "#ff6b6b");
  } else {
    relics++;
    score += 250;
    burst(x, y, "#fff0a6", 16);
    showMessage(relics === RELIC_TOTAL ? "Portal unlocked!" : `Sun relic ${relics} of ${RELIC_TOTAL}`);
  }
  updateHud();
}

function attack() {
  if (state !== "playing" || performance.now() < attackUntil - 200) return;
  attackUntil = performance.now() + 240;
  const vectors = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
  const [dx, dy] = vectors[player.facing];
  const targets = [
    [player.x + dx, player.y + dy],
    [player.x + dx * 2, player.y + dy * 2]
  ];
  const enemy = enemies.find(entry => entry.alive && targets.some(([x, y]) => entry.x === x && entry.y === y));
  if (enemy) {
    enemy.alive = false;
    score += 125;
    burst(enemy.x, enemy.y, "#b58cff", 12);
    showMessage("Shadow defeated · +125");
    updateHud();
  }
}

function moveEnemies() {
  enemies.filter(enemy => enemy.alive).forEach(enemy => {
    const distance = Math.abs(player.x - enemy.x) + Math.abs(player.y - enemy.y);
    let choices = [];
    if (distance <= 7) {
      const dx = Math.sign(player.x - enemy.x);
      const dy = Math.sign(player.y - enemy.y);
      choices = Math.abs(player.x - enemy.x) > Math.abs(player.y - enemy.y)
        ? [[dx, 0], [0, dy]] : [[0, dy], [dx, 0]];
    } else {
      choices = [[1,0],[-1,0],[0,1],[0,-1]].sort(() => Math.random() - .5);
    }
    const move = choices.find(([dx, dy]) => {
      const x = enemy.x + dx;
      const y = enemy.y + dy;
      return isWalkable(x, y) && !(x === 18 && y === 12) && !enemies.some(other => other !== enemy && other.alive && other.x === x && other.y === y);
    });
    if (move) { enemy.x += move[0]; enemy.y += move[1]; }
  });
  checkEnemyContact();
}

function checkEnemyContact() {
  if (performance.now() < hurtUntil) return;
  if (enemies.some(enemy => enemy.alive && enemy.x === player.x && enemy.y === player.y)) {
    player.health--;
    hurtUntil = performance.now() + 900;
    showMessage("A shadow struck you!");
    updateHud();
    if (player.health <= 0) finishGame(false);
  }
}

function checkPortal() {
  if (player.x === 18 && player.y === 12) {
    if (relics === RELIC_TOTAL) finishGame(true);
    else showMessage(`${RELIC_TOTAL - relics} relic${RELIC_TOTAL - relics === 1 ? "" : "s"} still missing`);
  }
}

function finishGame(won) {
  state = won ? "won" : "lost";
  if (won) {
    const seconds = Math.floor((performance.now() - startTime) / 1000);
    score += player.health * 100 + Math.max(0, 600 - seconds * 5);
  }
  if (score > bestScore) {
    bestScore = score;
    localStorage.setItem("questBestScore", String(bestScore));
  }
  bestScoreEl.textContent = bestScore;
  document.getElementById("finalScore").textContent = score;
  document.getElementById("resultIcon").textContent = won ? "✦" : "☾";
  document.getElementById("resultKicker").textContent = won ? "Quest complete" : "The ruins prevail";
  document.getElementById("resultTitle").textContent = won ? "The portal is restored!" : "Your quest has ended";
  document.getElementById("resultText").textContent = won
    ? "You recovered every relic and escaped the Emberwood ruins."
    : "The shadows claimed your last heart. Regroup and try a new route.";
  resultOverlay.classList.remove("hidden");
  updateHud();
}

function togglePause() {
  if (state === "playing") {
    state = "paused";
    pauseButton.textContent = "▶";
    pauseButton.setAttribute("aria-label", "Resume game");
    showMessage("Game paused");
  } else if (state === "paused") {
    state = "playing";
    lastFrame = performance.now();
    pauseButton.textContent = "Ⅱ";
    pauseButton.setAttribute("aria-label", "Pause game");
    showMessage("Quest resumed");
  }
}

function updateHud() {
  scoreEl.textContent = score;
  relicsEl.textContent = `${relics} / ${RELIC_TOTAL}`;
  healthEl.textContent = `${"♥ ".repeat(Math.max(0, player?.health || MAX_HEALTH)).trim()}${player && player.health < MAX_HEALTH ? "  " + "♡ ".repeat(MAX_HEALTH - player.health).trim() : ""}`;
  healthEl.setAttribute("aria-label", `${player?.health ?? MAX_HEALTH} health points`);
  objectiveEl.textContent = relics === RELIC_TOTAL ? "Objective: Reach the golden portal" : `Objective: Find ${RELIC_TOTAL - relics} more sun relic${RELIC_TOTAL - relics === 1 ? "" : "s"}`;
}

function showMessage(text) {
  announcement.textContent = text;
  announcement.classList.add("show");
  clearTimeout(messageTimer);
  messageTimer = setTimeout(() => announcement.classList.remove("show"), 1400);
}

function burst(x, y, color, count = 8) {
  for (let i = 0; i < count; i++) {
    particles.push({ x: (x + .5) * TILE, y: (y + .5) * TILE, vx: (Math.random() - .5) * 4, vy: (Math.random() - .5) * 4, life: 1, color });
  }
}

function roundedRect(x, y, width, height, radius) {
  ctx.beginPath();
  ctx.roundRect(x, y, width, height, radius);
}

function drawTile(x, y, tile) {
  const px = x * TILE;
  const py = y * TILE;
  const checker = (x + y) % 2;
  if (tile === "#") {
    ctx.fillStyle = checker ? "#263b30" : "#2c4336";
    ctx.fillRect(px, py, TILE, TILE);
    ctx.fillStyle = "#375443";
    ctx.beginPath(); ctx.arc(px + 13, py + 13, 8, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#1c2f25";
    ctx.fillRect(px, py + TILE - 7, TILE, 7);
  } else if (tile === "~") {
    ctx.fillStyle = checker ? "#245d68" : "#286772";
    ctx.fillRect(px, py, TILE, TILE);
    ctx.strokeStyle = "rgba(171,235,234,.28)";
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(px + 8, py + 18); ctx.quadraticCurveTo(px + 20, py + 11, px + 33, py + 18); ctx.stroke();
  } else {
    ctx.fillStyle = checker ? "#486246" : "#4d684a";
    ctx.fillRect(px, py, TILE, TILE);
    ctx.fillStyle = "rgba(236,225,176,.1)";
    ctx.fillRect(px + 4, py + 4, TILE - 8, TILE - 8);
    if ((x * 7 + y * 11) % 9 === 0) {
      ctx.fillStyle = "#6f8655"; ctx.fillRect(px + 9, py + 10, 3, 5); ctx.fillRect(px + 12, py + 7, 2, 4);
    }
  }
}

function drawPortal(now) {
  const x = 18 * TILE + TILE / 2;
  const y = 12 * TILE + TILE / 2;
  const open = relics === RELIC_TOTAL;
  ctx.save();
  ctx.translate(x, y);
  ctx.strokeStyle = open ? "#ffd166" : "#708078";
  ctx.lineWidth = 6;
  ctx.beginPath(); ctx.ellipse(0, 0, 16, 21, 0, 0, Math.PI * 2); ctx.stroke();
  ctx.fillStyle = open ? `rgba(255,209,102,${.55 + Math.sin(now / 180) * .18})` : "rgba(35,45,40,.75)";
  ctx.beginPath(); ctx.ellipse(0, 0, 11, 16, 0, 0, Math.PI * 2); ctx.fill();
  if (open) { ctx.rotate(now / 700); ctx.strokeStyle = "#fff3c4"; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(0,0,25,0,Math.PI*.8); ctx.stroke(); }
  ctx.restore();
}

function drawItem(item, now) {
  if (item.collected) return;
  const x = (item.x + .5) * TILE;
  const y = (item.y + .5) * TILE + Math.sin(now / 230 + item.x) * 2;
  ctx.save(); ctx.translate(x, y);
  if (item.type === "coin") {
    ctx.fillStyle = "#ffd166"; ctx.beginPath(); ctx.ellipse(0,0,8,11,0,0,Math.PI*2); ctx.fill();
    ctx.strokeStyle = "#9f6817"; ctx.lineWidth = 2; ctx.stroke();
  } else if (item.type === "heart") {
    ctx.fillStyle = "#ff6b6b"; ctx.font = "25px sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText("♥",0,1);
  } else {
    ctx.rotate(Math.PI / 4); ctx.fillStyle = "#ffe38f"; ctx.shadowColor = "#ffd166"; ctx.shadowBlur = 14; roundedRect(-10,-10,20,20,4); ctx.fill();
    ctx.fillStyle = "#d08b25"; roundedRect(-4,-4,8,8,2); ctx.fill();
  }
  ctx.restore();
}

function drawEnemy(enemy, now) {
  if (!enemy.alive) return;
  const x = (enemy.x + .5) * TILE;
  const y = (enemy.y + .5) * TILE + Math.sin(now / 180 + enemy.id) * 2;
  ctx.save(); ctx.translate(x, y);
  ctx.fillStyle = "rgba(15,9,27,.35)"; ctx.beginPath(); ctx.ellipse(0,16,16,7,0,0,Math.PI*2); ctx.fill();
  ctx.fillStyle = "#35264c"; ctx.beginPath(); ctx.arc(0,0,16,0,Math.PI*2); ctx.fill();
  ctx.fillStyle = "#a98ad6"; ctx.beginPath(); ctx.arc(-5,-2,2.5,0,Math.PI*2); ctx.arc(5,-2,2.5,0,Math.PI*2); ctx.fill();
  ctx.restore();
}

function drawPlayer(now) {
  const x = (player.x + .5) * TILE;
  const y = (player.y + .5) * TILE;
  const blink = now < hurtUntil && Math.floor(now / 90) % 2 === 0;
  if (blink) return;
  ctx.save(); ctx.translate(x, y);
  ctx.fillStyle = "rgba(15,25,18,.32)"; ctx.beginPath(); ctx.ellipse(0,17,16,6,0,0,Math.PI*2); ctx.fill();
  ctx.fillStyle = "#e7aa72"; ctx.beginPath(); ctx.arc(0,-8,9,0,Math.PI*2); ctx.fill();
  ctx.fillStyle = "#315f4d"; roundedRect(-13,-1,26,23,7); ctx.fill();
  ctx.fillStyle = "#d9b24c"; ctx.fillRect(-13,8,26,4);
  ctx.fillStyle = "#203a31"; ctx.beginPath(); ctx.moveTo(-11,-11); ctx.lineTo(0,-25); ctx.lineTo(12,-11); ctx.closePath(); ctx.fill();
  if (now < attackUntil) {
    const rotations = { right: 0, down: Math.PI/2, left: Math.PI, up: -Math.PI/2 };
    ctx.rotate(rotations[player.facing]);
    ctx.strokeStyle = "#f1f5f3"; ctx.lineWidth = 5; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(12,2); ctx.lineTo(30,-10); ctx.stroke();
    ctx.strokeStyle = "#c89436"; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(13,-4); ctx.lineTo(20,5); ctx.stroke();
  }
  ctx.restore();
}

function drawParticles() {
  particles.forEach(p => {
    p.x += p.vx; p.y += p.vy; p.life -= .035;
    ctx.globalAlpha = Math.max(0, p.life); ctx.fillStyle = p.color; ctx.fillRect(p.x - 2, p.y - 2, 4, 4);
  });
  ctx.globalAlpha = 1;
  particles = particles.filter(p => p.life > 0);
}

function draw(now) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let y = 0; y < ROWS; y++) for (let x = 0; x < COLS; x++) drawTile(x, y, baseMap[y][x]);
  drawPortal(now);
  items.forEach(item => drawItem(item, now));
  enemies.forEach(enemy => drawEnemy(enemy, now));
  drawPlayer(now);
  drawParticles();
  if (state === "paused") {
    ctx.fillStyle = "rgba(10,16,13,.55)"; ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle = "white"; ctx.textAlign = "center"; ctx.font = "800 52px Nunito Sans"; ctx.fillText("Paused", canvas.width/2, canvas.height/2);
  }
}

function loop(now) {
  const delta = Math.min(50, now - lastFrame);
  lastFrame = now;
  if (state === "playing") {
    enemyAccumulator += delta;
    if (enemyAccumulator >= 650) { enemyAccumulator = 0; moveEnemies(); }
  }
  draw(now);
  requestAnimationFrame(loop);
}

const keyActions = {
  ArrowUp: () => movePlayer(0,-1), w: () => movePlayer(0,-1), W: () => movePlayer(0,-1),
  ArrowDown: () => movePlayer(0,1), s: () => movePlayer(0,1), S: () => movePlayer(0,1),
  ArrowLeft: () => movePlayer(-1,0), a: () => movePlayer(-1,0), A: () => movePlayer(-1,0),
  ArrowRight: () => movePlayer(1,0), d: () => movePlayer(1,0), D: () => movePlayer(1,0),
  " ": attack, p: togglePause, P: togglePause
};

document.addEventListener("keydown", event => {
  if (keyActions[event.key]) { event.preventDefault(); keyActions[event.key](); }
});

document.querySelectorAll("[data-direction]").forEach(button => {
  const moves = { up: [0,-1], down: [0,1], left: [-1,0], right: [1,0] };
  const trigger = event => { event.preventDefault(); button.classList.add("active"); movePlayer(...moves[button.dataset.direction]); };
  button.addEventListener("pointerdown", trigger);
  button.addEventListener("pointerup", () => button.classList.remove("active"));
  button.addEventListener("pointercancel", () => button.classList.remove("active"));
});

canvas.addEventListener("pointerdown", event => { touchStart = { x: event.clientX, y: event.clientY }; });
canvas.addEventListener("pointerup", event => {
  if (!touchStart) return;
  const dx = event.clientX - touchStart.x;
  const dy = event.clientY - touchStart.y;
  if (Math.max(Math.abs(dx), Math.abs(dy)) > 24) {
    if (Math.abs(dx) > Math.abs(dy)) movePlayer(Math.sign(dx), 0);
    else movePlayer(0, Math.sign(dy));
  }
  touchStart = null;
});

document.getElementById("startButton").addEventListener("click", startGame);
document.getElementById("playAgainButton").addEventListener("click", startGame);
document.getElementById("restartButton").addEventListener("click", startGame);
document.getElementById("attackButton").addEventListener("pointerdown", event => { event.preventDefault(); attack(); });
pauseButton.addEventListener("click", togglePause);
window.addEventListener("blur", () => { if (state === "playing") togglePause(); });

resetGame();
requestAnimationFrame(loop);


}
function begin(){poster.hidden=true;gm.hidden=false;if(!booted){booted=true;var s=document.createElement("style");s.textContent=LOOK;document.head.appendChild(s);boot();}else{var r=document.getElementById("startButton");if(r)r.click();}}
poster.addEventListener("click",begin);
var nb=document.getElementById("new");if(nb)nb.addEventListener("click",begin);
})();
