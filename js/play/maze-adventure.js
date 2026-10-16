/* Maze Adventure - game logic + its own look. Layout lives in style.css; page shell lives in the HTML. */
(function(){"use strict";
var gm=document.getElementById("gm"),poster=document.getElementById("poster"),booted=false;
var LOOK=".gm{\n  \n  \n  --accent: #16b8c4;\n  --action: #ffb84d;\n  --success: #22c55e;\n  --danger: #ef5b5b;\n  \n  \n  \n  \n  \n  --game: #111827;\n  --game-2: #1f2937;\n  \n}.gm *{ box-sizing: border-box; }.gm button,.gm input{ font: inherit; }.gm h2,.gm h3,.gm p{ margin-top: 0; }.gm h2{ margin-bottom: 18px; font-size: clamp(28px, 4vw, 36px); line-height: 1.18; letter-spacing: -.025em; }.gm h3{ margin-bottom: 10px; font-size: 22px; line-height: 1.3; }.gm .game-card{ overflow: hidden; border: 1px solid var(--border); border-radius: 20px; background: var(--card); box-shadow: var(--shadow); }.gm .game-topbar{ display: grid; grid-template-columns: repeat(5, 1fr); gap: 1px; background: var(--border); border-bottom: 1px solid var(--border); }.gm .stat{ display: flex; min-width: 0; padding: 14px 20px; flex-direction: column; background: #fff; }.gm .stat span{ color: var(--muted); font-size: 12px; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; }.gm .stat strong{ overflow: hidden; font-size: 22px; line-height: 1.3; text-overflow: ellipsis; white-space: nowrap; }.gm .lives-stat strong{ color: var(--danger); letter-spacing: 3px; }.gm .game-stage{ position: relative; display: grid; min-height: 600px; place-items: center; overflow: hidden; background: var(--game); touch-action: none; }.gm canvas{ display: block; width: 100%; max-width: 840px; height: auto; aspect-ratio: 7 / 5; background: var(--game); }.gm .game-overlay{ position: absolute; inset: 0; display: grid; padding: 24px; place-items: center; background: rgba(9, 14, 27, .82); backdrop-filter: blur(4px); transition: opacity .2s ease; }.gm .game-overlay.is-hidden{ visibility: hidden; opacity: 0; pointer-events: none; }.gm .overlay-panel{ width: min(500px, 100%); padding: 35px; border: 1px solid rgba(255,255,255,.12); border-radius: 18px; background: #182131; color: #fff; text-align: center; box-shadow: 0 20px 50px rgba(0,0,0,.3); }.gm .overlay-panel h2{ margin-bottom: 12px; }.gm .overlay-panel > p:not(.eyebrow){ color: #cbd5e1; }.gm .overlay-icon{ display: grid; width: 58px; height: 58px; margin: 0 auto 18px; place-items: center; border-radius: 16px; background: rgba(22,184,196,.14); color: #55dce6; font-size: 30px; }.gm .button{ min-height: 46px; padding: 10px 20px; border: 0; border-radius: 12px; font-size: 16px; font-weight: 800; cursor: pointer; transition: transform .15s, background .15s, box-shadow .15s; }.gm .button:hover{ transform: translateY(-1px); }.gm .button:focus-visible,.gm .dpad:focus-visible,.gm summary:focus-visible{ outline: 3px solid rgba(91,92,226,.3); outline-offset: 3px; }.gm .button-primary{ background: var(--action); color: #352307; box-shadow: 0 8px 20px rgba(255,184,77,.2); }.gm .button-primary:hover{ background: #ffc465; }.gm .button-secondary{ border: 1px solid var(--border); background: #fff; color: var(--text); }.gm .button-secondary:hover{ background: #f8f8fc; }.gm .game-actions{ display: flex; gap: 20px; justify-content: space-between; align-items: center; padding: 16px 20px; border-top: 1px solid #2f394a; background: var(--game-2); color: #fff; }.gm .status-wrap{ display: flex; gap: 10px; align-items: center; min-width: 0; }.gm .status-wrap p{ margin: 0; color: #d7deea; font-size: 15px; }.gm .status-dot{ width: 9px; height: 9px; flex: 0 0 auto; border-radius: 50%; background: var(--success); box-shadow: 0 0 0 4px rgba(34,197,94,.15); }.gm .mobile-controls{ display: none; grid-template: repeat(2, 58px) / repeat(3, 58px); gap: 8px; justify-content: center; padding: 18px; border-top: 1px solid var(--border); background: #f9fafc; }.gm .dpad{ border: 1px solid #d8dbea; border-radius: 13px; background: #fff; color: var(--brand-dark); font-size: 24px; font-weight: 800; box-shadow: 0 3px 0 #dfe1ec; touch-action: manipulation; }.gm .dpad:active{ transform: translateY(2px); box-shadow: 0 1px 0 #dfe1ec; }.gm .dpad.up{ grid-column: 2; }.gm .dpad.left{ grid-column: 1; grid-row: 2; }.gm .dpad.down{ grid-column: 2; grid-row: 2; }.gm .dpad.right{ grid-column: 3; grid-row: 2; }.gm .legend-card{ padding: 28px; border: 1px solid var(--border); border-radius: 18px; background: #fff; }.gm .info-section > p{ color: var(--muted); }.gm .legend-card{ align-self: start; }.gm .legend-row{ display: flex; gap: 14px; align-items: center; padding: 12px 0; border-top: 1px solid var(--border); }.gm .legend-symbol{ display: grid; width: 39px; height: 39px; flex: 0 0 auto; place-items: center; border-radius: 10px; background: var(--game); font-weight: 800; }.gm .legend-row span:last-child{ display: flex; flex-direction: column; line-height: 1.35; }.gm .legend-row small{ color: var(--muted); }.gm .legend-symbol.player{ color: #f5c451; }.gm .legend-symbol.relic{ color: #4ed6e0; }.gm .legend-symbol.exit{ color: #ffc857; }.gm .legend-symbol.danger{ color: #f46f6f; }.gm .legend-symbol.potion{ color: #57cf85; }.gm .info-section{ padding-top: 76px; }.gm .info-section > p{ max-width: 800px; }.gm .tip-grid{ display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }.gm .tip-grid article{ padding: 24px; border: 1px solid var(--border); border-radius: 16px; background: #fff; }.gm .tip-grid article > span{ display: inline-block; margin-bottom: 20px; color: var(--brand); font-weight: 800; }.gm .tip-grid p{ margin-bottom: 0; color: var(--muted); font-size: 16px; }.gm details{ border-top: 1px solid var(--border); background: transparent; }.gm details:last-child{ border-bottom: 1px solid var(--border); }.gm summary{ padding: 19px 4px; font-weight: 800; cursor: pointer; }.gm details p{ max-width: 850px; padding: 0 4px 18px; color: var(--muted); }@media (max-width: 760px){.gm .game-card{ border-radius: 16px; }.gm .game-topbar{ grid-template-columns: repeat(3, 1fr); }.gm .stat{ padding: 11px 12px; }.gm .stat strong{ font-size: 18px; }.gm .lives-stat{ grid-column: span 2; }.gm .game-stage{ min-height: 0; }.gm canvas{ max-width: none; }.gm .overlay-panel{ padding: 25px 19px; }.gm .overlay-panel h2{ font-size: 27px; }.gm .game-actions{ align-items: stretch; flex-direction: column; }.gm .game-actions .button{ width: 100%; }.gm .mobile-controls{ display: grid; }.gm .tip-grid{ grid-template-columns: 1fr; }.gm .info-section{ padding-top: 58px; }}@media (prefers-reduced-motion: reduce){.gm *,.gm *::before,.gm *::after{ scroll-behavior: auto !important; transition: none !important; }}";
function __ready(f){f()}
function boot(){
"use strict";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");
const levelEl = document.getElementById("level");
const relicsEl = document.getElementById("relics");
const timeEl = document.getElementById("time");
const livesEl = document.getElementById("lives");
const statusEl = document.getElementById("gameStatus");
const startOverlay = document.getElementById("startOverlay");
const messageOverlay = document.getElementById("messageOverlay");
const messageIcon = document.getElementById("messageIcon");
const messageEyebrow = document.getElementById("messageEyebrow");
const messageTitle = document.getElementById("messageTitle");
const messageText = document.getElementById("messageText");
const messageButton = document.getElementById("messageButton");
const startButton = document.getElementById("startButton");
const restartButton = document.getElementById("restartButton");
const stage = document.getElementById("gameStage");

const COLS = 21;
const ROWS = 15;
const TOTAL_LEVELS = 3;
const directions = {
  up: { dx: 0, dy: -1, wall: "top", opposite: "bottom" },
  right: { dx: 1, dy: 0, wall: "right", opposite: "left" },
  down: { dx: 0, dy: 1, wall: "bottom", opposite: "top" },
  left: { dx: -1, dy: 0, wall: "left", opposite: "right" }
};

let maze = [];
let player = { x: 0, y: 0 };
let exit = { x: COLS - 1, y: ROWS - 1 };
let relics = [];
let traps = [];
let potions = [];
let guardians = [];
let level = 1;
let score = 0;
let lives = 3;
let moves = 0;
let collected = 0;
let requiredRelics = 0;
let elapsed = 0;
let timerId = null;
let gameState = "ready";
let invulnerableUntil = 0;
let nextAction = null;
let touchStart = null;

function cell(x, y) {
  return maze[y] && maze[y][x];
}

function makeMaze() {
  maze = Array.from({ length: ROWS }, (_, y) =>
    Array.from({ length: COLS }, (_, x) => ({
      x, y, visited: false,
      walls: { top: true, right: true, bottom: true, left: true }
    }))
  );

  const stack = [maze[0][0]];
  maze[0][0].visited = true;
  while (stack.length) {
    const current = stack[stack.length - 1];
    const options = Object.entries(directions)
      .map(([name, d]) => ({ name, d, next: cell(current.x + d.dx, current.y + d.dy) }))
      .filter(option => option.next && !option.next.visited);
    if (!options.length) {
      stack.pop();
      continue;
    }
    const choice = options[Math.floor(Math.random() * options.length)];
    current.walls[choice.d.wall] = false;
    choice.next.walls[choice.d.opposite] = false;
    choice.next.visited = true;
    stack.push(choice.next);
  }

  // Add a few loops so the maze rewards route choices rather than pure backtracking.
  const loops = 9 + level * 3;
  for (let i = 0; i < loops; i += 1) {
    const x = 1 + Math.floor(Math.random() * (COLS - 2));
    const y = 1 + Math.floor(Math.random() * (ROWS - 2));
    const names = ["right", "down"];
    const name = names[Math.floor(Math.random() * names.length)];
    const d = directions[name];
    const neighbor = cell(x + d.dx, y + d.dy);
    if (neighbor) {
      cell(x, y).walls[d.wall] = false;
      neighbor.walls[d.opposite] = false;
    }
  }
}

function samePosition(a, b) { return a.x === b.x && a.y === b.y; }
function occupied(x, y) {
  const point = { x, y };
  return samePosition(point, player) || samePosition(point, exit) ||
    relics.some(item => samePosition(item, point)) || traps.some(item => samePosition(item, point)) ||
    potions.some(item => samePosition(item, point)) || guardians.some(item => samePosition(item, point));
}

function randomFreeCell(minDistance = 0) {
  for (let attempt = 0; attempt < 1000; attempt += 1) {
    const point = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) };
    const distance = Math.abs(point.x - player.x) + Math.abs(point.y - player.y);
    if (!occupied(point.x, point.y) && distance >= minDistance) return point;
  }
  return { x: COLS - 2, y: ROWS - 2 };
}

function setupLevel() {
  player = { x: 0, y: 0 };
  exit = { x: COLS - 1, y: ROWS - 1 };
  relics = [];
  traps = [];
  potions = [];
  guardians = [];
  collected = 0;
  moves = 0;
  invulnerableUntil = 0;
  makeMaze();

  requiredRelics = 2 + level;
  for (let i = 0; i < requiredRelics; i += 1) relics.push(randomFreeCell(5));
  for (let i = 0; i < level + 2; i += 1) traps.push(randomFreeCell(4));
  for (let i = 0; i < 2; i += 1) potions.push(randomFreeCell(5));
  for (let i = 0; i < level; i += 1) guardians.push({ ...randomFreeCell(10), lastX: -1, lastY: -1 });
  updateHud();
  setStatus(`Level ${level}: recover ${requiredRelics} relic${requiredRelics === 1 ? "" : "s"}.`);
  draw();
}

function startGame() {
  level = 1;
  score = 0;
  lives = 3;
  elapsed = 0;
  gameState = "playing";
  startOverlay.classList.add("is-hidden");
  messageOverlay.classList.add("is-hidden");
  clearInterval(timerId);
  timerId = setInterval(() => {
    if (gameState === "playing") {
      elapsed += 1;
      updateHud();
    }
  }, 1000);
  setupLevel();
  canvas.focus?.();
}

function canMove(entity, directionName) {
  const d = directions[directionName];
  const current = cell(entity.x, entity.y);
  return current && !current.walls[d.wall] && cell(entity.x + d.dx, entity.y + d.dy);
}

function movePlayer(directionName) {
  if (gameState !== "playing" || !directions[directionName]) return;
  if (!canMove(player, directionName)) {
    setStatus("A stone wall blocks the way.");
    return;
  }
  const d = directions[directionName];
  player.x += d.dx;
  player.y += d.dy;
  moves += 1;
  score = Math.max(0, score - 1);
  checkPickups();
  if (gameState !== "playing") return;
  if (moves % 2 === 0) moveGuardians();
  checkDanger();
  if (gameState === "playing" && samePosition(player, exit)) {
    if (collected === requiredRelics) completeLevel();
    else setStatus(`The exit is sealed. ${requiredRelics - collected} relic${requiredRelics - collected === 1 ? " remains" : "s remain"}.`);
  }
  updateHud();
  draw();
}

function checkPickups() {
  const relicIndex = relics.findIndex(item => samePosition(item, player));
  if (relicIndex !== -1) {
    relics.splice(relicIndex, 1);
    collected += 1;
    score += 250;
    setStatus(collected === requiredRelics ? "All relics recovered! The golden exit is open." : `Relic recovered. ${requiredRelics - collected} still hidden.`);
  }
  const potionIndex = potions.findIndex(item => samePosition(item, player));
  if (potionIndex !== -1 && lives < 3) {
    potions.splice(potionIndex, 1);
    lives += 1;
    score += 50;
    setStatus("Potion used. One health restored.");
  }
}

function validGuardianMoves(guardian) {
  return Object.keys(directions).filter(name => {
    if (!canMove(guardian, name)) return false;
    const d = directions[name];
    return !(guardian.x + d.dx === guardian.lastX && guardian.y + d.dy === guardian.lastY);
  });
}

function moveGuardians() {
  guardians.forEach(guardian => {
    let options = validGuardianMoves(guardian);
    if (!options.length) options = Object.keys(directions).filter(name => canMove(guardian, name));
    if (!options.length) return;
    options.sort((a, b) => {
      const da = directions[a];
      const db = directions[b];
      const distanceA = Math.abs(guardian.x + da.dx - player.x) + Math.abs(guardian.y + da.dy - player.y);
      const distanceB = Math.abs(guardian.x + db.dx - player.x) + Math.abs(guardian.y + db.dy - player.y);
      return distanceA - distanceB;
    });
    const choice = Math.random() < 0.7 ? options[0] : options[Math.floor(Math.random() * options.length)];
    const d = directions[choice];
    guardian.lastX = guardian.x;
    guardian.lastY = guardian.y;
    guardian.x += d.dx;
    guardian.y += d.dy;
  });
}

function checkDanger() {
  if (Date.now() < invulnerableUntil) return;
  const onTrap = traps.some(item => samePosition(item, player));
  const hitGuardian = guardians.some(item => samePosition(item, player));
  if (!onTrap && !hitGuardian) return;
  lives -= 1;
  score = Math.max(0, score - 100);
  if (lives <= 0) {
    endGame(false);
    return;
  }
  player = { x: 0, y: 0 };
  invulnerableUntil = Date.now() + 1000;
  setStatus(hitGuardian ? "A guardian caught you. You returned to the entrance." : "A floor trap sent you back to the entrance.");
}

function completeLevel() {
  gameState = "paused";
  const levelBonus = Math.max(300, 1100 - moves * 3 - elapsed);
  score += levelBonus;
  if (level === TOTAL_LEVELS) {
    endGame(true);
    return;
  }
  messageIcon.textContent = "◆";
  messageEyebrow.textContent = `Level ${level} complete`;
  messageTitle.textContent = "A Deeper Passage Opens";
  messageText.textContent = `You earned a ${levelBonus}-point expedition bonus. The next ruin has more relics, traps, and guardians.`;
  messageButton.textContent = "Enter Next Level";
  nextAction = () => {
    level += 1;
    gameState = "playing";
    messageOverlay.classList.add("is-hidden");
    setupLevel();
  };
  messageOverlay.classList.remove("is-hidden");
  updateHud();
}

function endGame(won) {
  gameState = won ? "won" : "lost";
  clearInterval(timerId);
  const timeBonus = won ? Math.max(0, 1800 - elapsed * 3) : 0;
  if (won) score += timeBonus;
  messageIcon.textContent = won ? "★" : "×";
  messageEyebrow.textContent = won ? "Adventure complete" : "Expedition ended";
  messageTitle.textContent = won ? "The Ruins Are Restored" : "The Ruins Claim Another Explorer";
  messageText.textContent = won
    ? `Final score: ${score.toLocaleString()}. You escaped all three mazes in ${formatTime(elapsed)}.`
    : `You recovered ${collected} of ${requiredRelics} relics on level ${level}. Try a new maze and choose your route carefully.`;
  messageButton.textContent = "Play Again";
  nextAction = startGame;
  messageOverlay.classList.remove("is-hidden");
  setStatus(won ? "Adventure complete. All ruins cleared." : "Game over. Start a new expedition when ready.");
  updateHud();
  draw();
}

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function setStatus(text) { statusEl.textContent = text; }
function updateHud() {
  scoreEl.textContent = score.toLocaleString();
  levelEl.textContent = `${level} / ${TOTAL_LEVELS}`;
  relicsEl.textContent = `${collected} / ${requiredRelics}`;
  timeEl.textContent = formatTime(elapsed);
  livesEl.textContent = `${"♥ ".repeat(lives)}${"♡ ".repeat(3 - lives)}`.trim();
  livesEl.setAttribute("aria-label", `${lives} health remaining`);
}

function drawRoundedRect(x, y, width, height, radius) {
  ctx.beginPath();
  ctx.roundRect(x, y, width, height, radius);
  ctx.fill();
}

function draw() {
  const width = canvas.width;
  const height = canvas.height;
  const cellW = width / COLS;
  const cellH = height / ROWS;
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#101827";
  ctx.fillRect(0, 0, width, height);

  for (let y = 0; y < ROWS; y += 1) {
    for (let x = 0; x < COLS; x += 1) {
      ctx.fillStyle = (x + y) % 2 === 0 ? "#182334" : "#162030";
      ctx.fillRect(x * cellW, y * cellH, cellW, cellH);
    }
  }

  traps.forEach(item => {
    const cx = (item.x + .5) * cellW;
    const cy = (item.y + .55) * cellH;
    ctx.fillStyle = "#e96666";
    ctx.beginPath();
    ctx.moveTo(cx, cy - cellH * .2);
    ctx.lineTo(cx + cellW * .2, cy + cellH * .18);
    ctx.lineTo(cx - cellW * .2, cy + cellH * .18);
    ctx.closePath();
    ctx.fill();
  });

  potions.forEach(item => {
    const x = item.x * cellW + cellW * .31;
    const y = item.y * cellH + cellH * .28;
    ctx.fillStyle = "#5dd58b";
    drawRoundedRect(x, y, cellW * .38, cellH * .48, 6);
    ctx.fillStyle = "#d9ffe8";
    ctx.fillRect(x + cellW * .12, y - cellH * .08, cellW * .14, cellH * .1);
  });

  relics.forEach(item => {
    const cx = (item.x + .5) * cellW;
    const cy = (item.y + .5) * cellH;
    ctx.fillStyle = "rgba(72, 211, 222, .2)";
    ctx.beginPath(); ctx.arc(cx, cy, cellW * .35, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#4ed6e0";
    ctx.beginPath();
    ctx.moveTo(cx, cy - cellH * .24); ctx.lineTo(cx + cellW * .2, cy);
    ctx.lineTo(cx, cy + cellH * .24); ctx.lineTo(cx - cellW * .2, cy); ctx.closePath(); ctx.fill();
  });

  const exitOpen = collected === requiredRelics;
  const exitX = exit.x * cellW + cellW * .2;
  const exitY = exit.y * cellH + cellH * .15;
  ctx.fillStyle = exitOpen ? "rgba(255, 190, 77, .22)" : "rgba(135, 148, 169, .12)";
  drawRoundedRect(exit.x * cellW + 2, exit.y * cellH + 2, cellW - 4, cellH - 4, 7);
  ctx.fillStyle = exitOpen ? "#ffc857" : "#667085";
  drawRoundedRect(exitX, exitY, cellW * .6, cellH * .72, 6);
  ctx.fillStyle = "#172033";
  ctx.beginPath(); ctx.arc(exitX + cellW * .43, exitY + cellH * .37, 2.8, 0, Math.PI * 2); ctx.fill();

  guardians.forEach(item => {
    const cx = (item.x + .5) * cellW;
    const cy = (item.y + .52) * cellH;
    ctx.fillStyle = "#b978e6";
    ctx.beginPath(); ctx.arc(cx, cy, Math.min(cellW, cellH) * .27, Math.PI, 0); ctx.lineTo(cx + cellW * .27, cy + cellH * .19); ctx.lineTo(cx - cellW * .27, cy + cellH * .19); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.beginPath(); ctx.arc(cx - 5, cy - 1, 2.5, 0, Math.PI * 2); ctx.arc(cx + 5, cy - 1, 2.5, 0, Math.PI * 2); ctx.fill();
  });

  if (gameState !== "ready") {
    const cx = (player.x + .5) * cellW;
    const cy = (player.y + .5) * cellH;
    ctx.fillStyle = "rgba(255, 200, 87, .2)";
    ctx.beginPath(); ctx.arc(cx, cy, cellW * .4, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#f6c453";
    ctx.beginPath(); ctx.arc(cx, cy, Math.min(cellW, cellH) * .25, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#362b16";
    ctx.fillRect(cx - 6, cy - 2, 3, 3); ctx.fillRect(cx + 3, cy - 2, 3, 3);
  }

  ctx.strokeStyle = "#506078";
  ctx.lineWidth = 2;
  ctx.lineCap = "round";
  maze.forEach(row => row.forEach(tile => {
    const x = tile.x * cellW;
    const y = tile.y * cellH;
    ctx.beginPath();
    if (tile.walls.top) { ctx.moveTo(x, y); ctx.lineTo(x + cellW, y); }
    if (tile.walls.right) { ctx.moveTo(x + cellW, y); ctx.lineTo(x + cellW, y + cellH); }
    if (tile.walls.bottom) { ctx.moveTo(x, y + cellH); ctx.lineTo(x + cellW, y + cellH); }
    if (tile.walls.left) { ctx.moveTo(x, y); ctx.lineTo(x, y + cellH); }
    ctx.stroke();
  }));
}

function directionFromKey(key) {
  return ({ ArrowUp: "up", w: "up", W: "up", ArrowRight: "right", d: "right", D: "right", ArrowDown: "down", s: "down", S: "down", ArrowLeft: "left", a: "left", A: "left" })[key];
}

document.addEventListener("keydown", event => {
  const direction = directionFromKey(event.key);
  if (!direction) return;
  event.preventDefault();
  movePlayer(direction);
});

document.querySelectorAll("[data-direction]").forEach(button => {
  button.addEventListener("pointerdown", event => {
    event.preventDefault();
    movePlayer(button.dataset.direction);
  });
});

stage.addEventListener("touchstart", event => {
  const touch = event.changedTouches[0];
  touchStart = { x: touch.clientX, y: touch.clientY };
}, { passive: true });

stage.addEventListener("touchend", event => {
  if (!touchStart) return;
  const touch = event.changedTouches[0];
  const dx = touch.clientX - touchStart.x;
  const dy = touch.clientY - touchStart.y;
  touchStart = null;
  if (Math.max(Math.abs(dx), Math.abs(dy)) < 24) return;
  movePlayer(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? "right" : "left") : (dy > 0 ? "down" : "up"));
}, { passive: true });

startButton.addEventListener("click", startGame);
restartButton.addEventListener("click", startGame);
messageButton.addEventListener("click", () => { if (nextAction) nextAction(); });

window.addEventListener("resize", draw);
window.addEventListener("pagehide", () => clearInterval(timerId));

makeMaze();
updateHud();
draw();


}
function begin(){poster.hidden=true;gm.hidden=false;if(!booted){booted=true;var s=document.createElement("style");s.textContent=LOOK;document.head.appendChild(s);boot();}else{var r=document.getElementById("startButton");if(r)r.click();}}
poster.addEventListener("click",begin);
var nb=document.getElementById("new");if(nb)nb.addEventListener("click",begin);
})();
