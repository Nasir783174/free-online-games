/* Maze Puzzle - game logic + its own look. Layout lives in style.css; page shell lives in the HTML. */
(function(){"use strict";
var gm=document.getElementById("gm"),poster=document.getElementById("poster"),booted=false;
var LOOK=".gm{\n  --primary: #5B5CE2;\n  --primary-dark: #4546B8;\n  --secondary: #16B8C4;\n  --action: #FFB84D;\n  --success: #22C55E;\n  --danger: #EF5B5B;\n  \n  \n  \n  \n  \n  --game-bg: #111827;\n  --game-secondary: #1F2937;\n  \n}.gm *{ box-sizing: border-box; }.gm button,.gm select{ font: inherit; }.gm button,.gm select,.gm .maze-wrap{ outline: none; }.gm button:focus-visible,.gm select:focus-visible,.gm .maze-wrap:focus-visible,.gm summary:focus-visible{\n  outline: 3px solid rgba(91, 92, 226, .32);\n  outline-offset: 3px;\n}.gm .game-kicker{\n  margin: 0 0 7px;\n  color: var(--primary);\n  text-transform: uppercase;\n  letter-spacing: .11em;\n  font-size: 13px;\n  font-weight: 800;\n}.gm h2,.gm h3{ line-height: 1.15; }.gm .game-card{\n  padding: 24px;\n  border: 1px solid var(--border);\n  border-radius: 20px;\n  background: var(--card);\n  box-shadow: var(--shadow);\n}.gm .game-toolbar{\n  display: flex;\n  align-items: end;\n  justify-content: space-between;\n  gap: 20px;\n  margin-bottom: 20px;\n}.gm .game-toolbar h2{ margin: 0; font-size: 30px; }.gm .difficulty-wrap{\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  font-size: 15px;\n  font-weight: 700;\n}.gm .difficulty-wrap select{\n  height: 46px;\n  padding: 0 38px 0 14px;\n  border: 1px solid var(--border);\n  border-radius: 12px;\n  color: var(--text);\n  background: #fff;\n  font-weight: 700;\n}.gm .stats{\n  display: grid;\n  grid-template-columns: repeat(4, 1fr);\n  gap: 12px;\n  margin-bottom: 16px;\n}.gm .stat{\n  padding: 13px 16px;\n  border: 1px solid var(--border);\n  border-radius: 14px;\n  background: #FAFAFD;\n}.gm .stat span{\n  display: block;\n  color: var(--muted);\n  font-size: 13px;\n  font-weight: 700;\n}.gm .stat strong{ font-size: 22px; line-height: 1.25; }.gm .game-shell{\n  padding: 18px;\n  border-radius: 18px;\n  background: var(--game-bg);\n}.gm .maze-wrap{\n  position: relative;\n  width: 100%;\n  min-height: 300px;\n  display: grid;\n  place-items: center;\n  overflow: hidden;\n  border-radius: 14px;\n  background: var(--game-secondary);\n  touch-action: none;\n}.gm canvas{\n  display: block;\n  max-width: 100%;\n  border-radius: 10px;\n}.gm .game-overlay{\n  position: absolute;\n  inset: 0;\n  display: grid;\n  place-items: center;\n  padding: 20px;\n  background: rgba(17, 24, 39, .82);\n  backdrop-filter: blur(5px);\n}.gm .game-overlay.hidden{ display: none; }.gm .overlay-panel{\n  width: min(430px, 100%);\n  padding: 26px;\n  border-radius: 18px;\n  text-align: center;\n  background: #fff;\n}.gm .overlay-panel h3{ margin: 10px 0 8px; font-size: 25px; }.gm .overlay-panel p{ margin: 0 0 20px; color: var(--muted); }.gm .overlay-icon{\n  display: grid;\n  place-items: center;\n  width: 50px;\n  height: 50px;\n  margin: 0 auto;\n  border-radius: 15px;\n  color: #fff;\n  background: var(--primary);\n  font-size: 22px;\n  font-weight: 800;\n}.gm .overlay-icon.success{ background: var(--success); }.gm .overlay-actions{\n  display: flex;\n  justify-content: center;\n  gap: 10px;\n  flex-wrap: wrap;\n}.gm .button{\n  min-height: 46px;\n  padding: 0 18px;\n  border: 0;\n  border-radius: 12px;\n  cursor: pointer;\n  font-size: 16px;\n  font-weight: 800;\n  transition: transform .16s ease, background .16s ease;\n}.gm .button:hover{ transform: translateY(-1px); }.gm .button.primary{ color: #fff; background: var(--primary); }.gm .button.primary:hover{ background: var(--primary-dark); }.gm .button.secondary{ color: var(--text); background: #fff; border: 1px solid var(--border); }.gm .game-bottom{\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 18px;\n  padding-top: 16px;\n}.gm .status{\n  margin: 0;\n  color: #D7DBE5;\n  font-size: 15px;\n}.gm .touch-controls{\n  display: none;\n  width: 190px;\n  margin: 18px auto 0;\n  grid-template-columns: repeat(3, 58px);\n  grid-template-rows: repeat(2, 58px);\n  gap: 7px;\n}.gm .control{\n  border: 1px solid #465064;\n  border-radius: 13px;\n  color: #fff;\n  background: #2B3547;\n  font-size: 25px;\n  font-weight: 800;\n  cursor: pointer;\n}.gm .control:active{ transform: scale(.96); background: #3B465B; }.gm .control.up{ grid-column: 2; grid-row: 1; }.gm .control.left{ grid-column: 1; grid-row: 2; }.gm .control.down{ grid-column: 2; grid-row: 2; }.gm .control.right{ grid-column: 3; grid-row: 2; }.gm .steps{ padding-left: 24px; }.gm .steps li{ margin: 13px 0; padding-left: 5px; }.gm .tips-card{\n  align-self: start;\n  padding: 24px;\n  border: 1px solid var(--border);\n  border-radius: 18px;\n  background: var(--card);\n}.gm .tips-card h3{ margin: 0 0 14px; font-size: 22px; }.gm .controls-list{ margin: 0; }.gm .controls-list div{\n  display: flex;\n  justify-content: space-between;\n  gap: 16px;\n  padding: 12px 0;\n  border-top: 1px solid var(--border);\n}.gm .controls-list dt{ font-weight: 800; }.gm .controls-list dd{ margin: 0; color: var(--muted); text-align: right; }.gm .tip-grid{\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 18px;\n}.gm .tip{\n  padding: 22px;\n  border: 1px solid var(--border);\n  border-radius: 16px;\n  background: var(--card);\n}.gm .tip span{ color: var(--primary); font-size: 14px; font-weight: 800; }.gm .tip h3{ margin: 7px 0 8px; font-size: 21px; }.gm .tip p{ margin: 0; font-size: 16px; }.gm details{\n  margin: 12px 0;\n  border: 1px solid var(--border);\n  border-radius: 14px;\n  background: var(--card);\n}.gm summary{\n  padding: 18px 20px;\n  cursor: pointer;\n  font-weight: 800;\n}.gm details p{ margin: 0; padding: 0 20px 20px; }@media (pointer: coarse), (max-width: 820px){.gm .touch-controls{ display: grid; }}@media (max-width: 760px){.gm .game-card{ padding: 14px; border-radius: 17px; }.gm .game-toolbar{ align-items: stretch; flex-direction: column; }.gm .difficulty-wrap{ justify-content: space-between; }.gm .difficulty-wrap select{ min-width: 140px; }.gm .stats{ grid-template-columns: repeat(2, 1fr); }.gm .game-shell{ padding: 10px; }.gm .maze-wrap{ min-height: 250px; }.gm .game-bottom{ align-items: stretch; flex-direction: column; }.gm .game-bottom .button{ width: 100%; }.gm .tip-grid{ grid-template-columns: 1fr; }}@media (max-width: 390px){.gm .stat{ padding: 11px 12px; }.gm .stat strong{ font-size: 20px; }.gm .overlay-panel{ padding: 21px 17px; }}";
function __ready(f){f()}
function boot(){
(() => {
  "use strict";

  const canvas = document.getElementById("mazeCanvas");
  const ctx = canvas.getContext("2d");
  const mazeWrap = document.getElementById("mazeWrap");
  const difficultySelect = document.getElementById("difficulty");
  const timeEl = document.getElementById("time");
  const movesEl = document.getElementById("moves");
  const starsEl = document.getElementById("stars");
  const scoreEl = document.getElementById("score");
  const statusEl = document.getElementById("status");
  const startOverlay = document.getElementById("startOverlay");
  const winOverlay = document.getElementById("winOverlay");
  const winSummary = document.getElementById("winSummary");
  const startBtn = document.getElementById("startBtn");
  const newMazeBtn = document.getElementById("newMazeBtn");
  const playAgainBtn = document.getElementById("playAgainBtn");
  const closeWinBtn = document.getElementById("closeWinBtn");
  const controls = [...document.querySelectorAll(".control")];

  const configs = {
    easy: { cols: 10, rows: 8, stars: 3, multiplier: 1 },
    medium: { cols: 15, rows: 11, stars: 5, multiplier: 1.5 },
    hard: { cols: 20, rows: 15, stars: 7, multiplier: 2.2 }
  };

  let config;
  let grid = [];
  let player = { x: 0, y: 0 };
  let exit = { x: 0, y: 0 };
  let stars = [];
  let moves = 0;
  let collected = 0;
  let score = 0;
  let elapsed = 0;
  let running = false;
  let finished = false;
  let timerId = null;
  let cellSize = 32;
  let boardWidth = 0;
  let boardHeight = 0;
  let touchStart = null;

  function cell(x, y) {
    return grid[y * config.cols + x];
  }

  function createGrid() {
    grid = [];
    for (let y = 0; y < config.rows; y++) {
      for (let x = 0; x < config.cols; x++) {
        grid.push({
          x, y,
          visited: false,
          walls: { top: true, right: true, bottom: true, left: true }
        });
      }
    }
  }

  function unvisitedNeighbors(current) {
    const candidates = [
      [current.x, current.y - 1, "top", "bottom"],
      [current.x + 1, current.y, "right", "left"],
      [current.x, current.y + 1, "bottom", "top"],
      [current.x - 1, current.y, "left", "right"]
    ];

    return candidates
      .filter(([x, y]) => x >= 0 && y >= 0 && x < config.cols && y < config.rows && !cell(x, y).visited)
      .map(([x, y, wall, opposite]) => ({ next: cell(x, y), wall, opposite }));
  }

  function generateMaze() {
    createGrid();
    const stack = [];
    let current = cell(0, 0);
    current.visited = true;
    let visitedCount = 1;

    while (visitedCount < grid.length) {
      const neighbors = unvisitedNeighbors(current);

      if (neighbors.length) {
        const choice = neighbors[Math.floor(Math.random() * neighbors.length)];
        current.walls[choice.wall] = false;
        choice.next.walls[choice.opposite] = false;
        stack.push(current);
        current = choice.next;
        current.visited = true;
        visitedCount++;
      } else {
        current = stack.pop();
      }
    }

    grid.forEach(c => { c.visited = false; });
  }

  function farthestCellFrom(startX, startY) {
    const queue = [{ x: startX, y: startY, d: 0 }];
    const seen = new Set([`${startX},${startY}`]);
    let farthest = queue[0];

    while (queue.length) {
      const current = queue.shift();
      if (current.d > farthest.d) farthest = current;

      const c = cell(current.x, current.y);
      const options = [];
      if (!c.walls.top) options.push([current.x, current.y - 1]);
      if (!c.walls.right) options.push([current.x + 1, current.y]);
      if (!c.walls.bottom) options.push([current.x, current.y + 1]);
      if (!c.walls.left) options.push([current.x - 1, current.y]);

      options.forEach(([x, y]) => {
        const key = `${x},${y}`;
        if (!seen.has(key)) {
          seen.add(key);
          queue.push({ x, y, d: current.d + 1 });
        }
      });
    }
    return farthest;
  }

  function placeStars() {
    const forbidden = new Set([`0,0`, `${exit.x},${exit.y}`]);
    const candidates = grid
      .filter(c => !forbidden.has(`${c.x},${c.y}`))
      .sort(() => Math.random() - 0.5);

    stars = candidates.slice(0, Math.min(config.stars, candidates.length)).map(c => ({
      x: c.x, y: c.y, collected: false
    }));
  }

  function resetStats() {
    moves = 0;
    collected = 0;
    score = 0;
    elapsed = 0;
    movesEl.textContent = "0";
    timeEl.textContent = "00:00";
    scoreEl.textContent = "0";
    starsEl.textContent = `0/${stars.length}`;
  }

  function newMaze(autoStart = false) {
    stopTimer();
    config = configs[difficultySelect.value];
    player = { x: 0, y: 0 };
    generateMaze();
    const farthest = farthestCellFrom(0, 0);
    exit = { x: farthest.x, y: farthest.y };
    placeStars();
    resetStats();
    running = false;
    finished = false;
    winOverlay.classList.add("hidden");
    startOverlay.classList.toggle("hidden", autoStart);
    statusEl.textContent = autoStart ? "Maze started. Find the teal exit." : "Choose a difficulty, then start the maze.";
    resizeCanvas();
    draw();
    if (autoStart) startGame();
  }

  function startGame() {
    if (running || finished) return;
    running = true;
    startOverlay.classList.add("hidden");
    statusEl.textContent = "Maze started. Find the teal exit.";
    timerId = window.setInterval(() => {
      elapsed++;
      timeEl.textContent = formatTime(elapsed);
      updateLiveScore();
    }, 1000);
    mazeWrap.focus({ preventScroll: true });
  }

  function stopTimer() {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    }
  }

  function formatTime(seconds) {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }

  function calculateScore(final = false) {
    const base = config.cols * config.rows * 14 * config.multiplier;
    const starBonus = collected * 240 * config.multiplier;
    const movePenalty = moves * 4;
    const timePenalty = elapsed * 3;
    const finishBonus = final ? 700 * config.multiplier : 0;
    return Math.max(0, Math.round(base + starBonus + finishBonus - movePenalty - timePenalty));
  }

  function updateLiveScore() {
    score = calculateScore(false);
    scoreEl.textContent = score.toLocaleString();
  }

  function canMove(direction) {
    const c = cell(player.x, player.y);
    if (direction === "up") return !c.walls.top;
    if (direction === "right") return !c.walls.right;
    if (direction === "down") return !c.walls.bottom;
    if (direction === "left") return !c.walls.left;
    return false;
  }

  function move(direction) {
    if (finished) return;
    if (!running) startGame();
    if (!canMove(direction)) {
      statusEl.textContent = "That path is blocked.";
      return;
    }

    if (direction === "up") player.y--;
    if (direction === "right") player.x++;
    if (direction === "down") player.y++;
    if (direction === "left") player.x--;

    moves++;
    movesEl.textContent = moves.toString();
    collectStar();
    updateLiveScore();
    draw();

    if (player.x === exit.x && player.y === exit.y) {
      finishGame();
    } else {
      statusEl.textContent = "Keep going. The teal exit is still ahead.";
    }
  }

  function collectStar() {
    const found = stars.find(s => !s.collected && s.x === player.x && s.y === player.y);
    if (found) {
      found.collected = true;
      collected++;
      starsEl.textContent = `${collected}/${stars.length}`;
      statusEl.textContent = "Star collected! Bonus added.";
    }
  }

  function finishGame() {
    running = false;
    finished = true;
    stopTimer();
    score = calculateScore(true);
    scoreEl.textContent = score.toLocaleString();
    statusEl.textContent = "Maze complete. Great route finding!";
    winSummary.textContent = `Finished in ${formatTime(elapsed)} with ${moves} moves, ${collected}/${stars.length} stars, and ${score.toLocaleString()} points.`;
    winOverlay.classList.remove("hidden");
  }

  function resizeCanvas() {
    if (!config) return;
    const availableWidth = Math.max(260, mazeWrap.clientWidth - 24);
    const viewportLimit = window.innerWidth < 760 ? Math.min(window.innerHeight * 0.54, 520) : 650;
    const availableHeight = Math.max(240, viewportLimit);
    cellSize = Math.floor(Math.min(availableWidth / config.cols, availableHeight / config.rows));
    cellSize = Math.max(14, Math.min(cellSize, 46));

    boardWidth = config.cols * cellSize;
    boardHeight = config.rows * cellSize;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.style.width = `${boardWidth}px`;
    canvas.style.height = `${boardHeight}px`;
    canvas.width = Math.round(boardWidth * dpr);
    canvas.height = Math.round(boardHeight * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw();
  }

  function drawRoundedRect(x, y, w, h, r) {
    const radius = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, radius);
  }

  function drawStar(cx, cy, outer, inner) {
    ctx.beginPath();
    for (let i = 0; i < 10; i++) {
      const angle = -Math.PI / 2 + i * Math.PI / 5;
      const radius = i % 2 === 0 ? outer : inner;
      const x = cx + Math.cos(angle) * radius;
      const y = cy + Math.sin(angle) * radius;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
  }

  function draw() {
    if (!config || !grid.length || !boardWidth || !boardHeight) return;

    ctx.clearRect(0, 0, boardWidth, boardHeight);
    ctx.fillStyle = "#111827";
    ctx.fillRect(0, 0, boardWidth, boardHeight);

    ctx.strokeStyle = "#8B93A7";
    ctx.lineWidth = Math.max(1.5, cellSize * 0.065);
    ctx.lineCap = "round";

    grid.forEach(c => {
      const x = c.x * cellSize;
      const y = c.y * cellSize;
      ctx.beginPath();
      if (c.walls.top) { ctx.moveTo(x, y); ctx.lineTo(x + cellSize, y); }
      if (c.walls.right) { ctx.moveTo(x + cellSize, y); ctx.lineTo(x + cellSize, y + cellSize); }
      if (c.walls.bottom) { ctx.moveTo(x, y + cellSize); ctx.lineTo(x + cellSize, y + cellSize); }
      if (c.walls.left) { ctx.moveTo(x, y); ctx.lineTo(x, y + cellSize); }
      ctx.stroke();
    });

    const pad = Math.max(3, cellSize * .18);

    ctx.fillStyle = "#16B8C4";
    drawRoundedRect(exit.x * cellSize + pad, exit.y * cellSize + pad, cellSize - pad * 2, cellSize - pad * 2, cellSize * .2);
    ctx.fill();

    stars.forEach(s => {
      if (s.collected) return;
      ctx.fillStyle = "#FFB84D";
      drawStar(s.x * cellSize + cellSize / 2, s.y * cellSize + cellSize / 2, cellSize * .28, cellSize * .13);
      ctx.fill();
    });

    const px = player.x * cellSize + cellSize / 2;
    const py = player.y * cellSize + cellSize / 2;
    ctx.beginPath();
    ctx.arc(px, py, cellSize * .28, 0, Math.PI * 2);
    ctx.fillStyle = "#7C7DF0";
    ctx.fill();
    ctx.lineWidth = Math.max(2, cellSize * .07);
    ctx.strokeStyle = "#FFFFFF";
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(px - cellSize * .08, py - cellSize * .04, Math.max(1.5, cellSize * .035), 0, Math.PI * 2);
    ctx.arc(px + cellSize * .08, py - cellSize * .04, Math.max(1.5, cellSize * .035), 0, Math.PI * 2);
    ctx.fillStyle = "#FFFFFF";
    ctx.fill();
  }

  function keyDirection(key) {
    const map = {
      ArrowUp: "up", w: "up", W: "up",
      ArrowRight: "right", d: "right", D: "right",
      ArrowDown: "down", s: "down", S: "down",
      ArrowLeft: "left", a: "left", A: "left"
    };
    return map[key];
  }

  document.addEventListener("keydown", event => {
    const direction = keyDirection(event.key);
    if (!direction) return;
    const activeTag = document.activeElement?.tagName;
    if (activeTag === "SELECT" || activeTag === "BUTTON") return;
    event.preventDefault();
    move(direction);
  });

  controls.forEach(button => {
    button.addEventListener("pointerdown", event => {
      event.preventDefault();
      move(button.dataset.direction);
    });
  });

  mazeWrap.addEventListener("touchstart", event => {
    const touch = event.changedTouches[0];
    touchStart = { x: touch.clientX, y: touch.clientY };
  }, { passive: true });

  mazeWrap.addEventListener("touchend", event => {
    if (!touchStart) return;
    const touch = event.changedTouches[0];
    const dx = touch.clientX - touchStart.x;
    const dy = touch.clientY - touchStart.y;
    touchStart = null;

    if (Math.max(Math.abs(dx), Math.abs(dy)) < 24) return;
    if (Math.abs(dx) > Math.abs(dy)) move(dx > 0 ? "right" : "left");
    else move(dy > 0 ? "down" : "up");
  }, { passive: true });

  startBtn.addEventListener("click", startGame);
  newMazeBtn.addEventListener("click", () => newMaze(true));
  playAgainBtn.addEventListener("click", () => newMaze(true));
  closeWinBtn.addEventListener("click", () => winOverlay.classList.add("hidden"));
  difficultySelect.addEventListener("change", () => newMaze(false));

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resizeCanvas, 120);
  });

  newMaze(false);
})();


}
function begin(){poster.hidden=true;gm.hidden=false;if(!booted){booted=true;var s=document.createElement("style");s.textContent=LOOK;document.head.appendChild(s);boot();}else{var r=document.getElementById("startBtn");if(r)r.click();}}
poster.addEventListener("click",begin);
var nb=document.getElementById("new");if(nb)nb.addEventListener("click",begin);
})();
