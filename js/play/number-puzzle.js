/* Number Puzzle - game logic + its own look. Layout lives in style.css; page shell lives in the HTML. */
(function(){"use strict";
var gm=document.getElementById("gm"),poster=document.getElementById("poster"),booted=false;
var LOOK=".gm{\n  --primary:#5B5CE2;--primary-dark:#4546B8;--secondary:#16B8C4;--action:#FFB84D;\n  --success:#22C55E;--danger:#EF5B5B;\n  --game:#111827;--game2:#1F2937;\n  \n}.gm *{box-sizing:border-box}.gm button{font:inherit}.gm button{cursor:pointer}.gm button:focus-visible,.gm summary:focus-visible{outline:3px solid rgba(22,184,196,.4);outline-offset:3px}.gm .all-games{font-size:15px;font-weight:700;color:var(--primary);text-decoration:none}.gm h2,.gm h3,.gm p{margin-top:0}.gm h2{font-size:clamp(27px,4vw,35px);line-height:1.2;letter-spacing:-.02em;margin-bottom:16px}.gm h3{font-size:22px;line-height:1.25}.gm .game-card{background:var(--card);border:1px solid var(--border);border-radius:20px;padding:24px;box-shadow:var(--shadow)}.gm .game-topbar{display:flex;align-items:flex-end;justify-content:space-between;gap:24px;margin-bottom:20px}.gm .game-topbar h2{font-size:28px;margin:2px 0 0}.gm .game-label{font-size:13px;color:var(--muted);font-weight:700;text-transform:uppercase;letter-spacing:.08em}.gm .difficulty{display:flex;gap:7px;padding:5px;background:var(--bg);border-radius:12px}.gm .size-btn{border:0;background:transparent;color:var(--muted);font-weight:800;font-size:14px;min-width:58px;height:40px;border-radius:9px}.gm .size-btn.active{background:#fff;color:var(--primary);box-shadow:0 3px 12px rgba(23,27,45,.08)}.gm .stats{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:18px}.gm .stat{background:var(--bg);border:1px solid var(--border);border-radius:14px;padding:12px 16px;text-align:center}.gm .stat span{display:block;color:var(--muted);font-size:13px;font-weight:700}.gm .stat strong{display:block;font-size:23px;line-height:1.3;margin-top:2px}.gm .game-stage{position:relative;min-height:420px;background:var(--game);border-radius:18px;padding:24px;display:grid;place-items:center;overflow:hidden}.gm .board{--size:3;display:grid;grid-template-columns:repeat(var(--size),1fr);gap:10px;width:min(100%,520px);aspect-ratio:1;background:var(--game2);padding:12px;border-radius:16px;touch-action:manipulation}.gm .tile{border:0;border-radius:12px;background:#fff;color:var(--text);font-weight:800;font-size:clamp(20px,5vw,34px);display:grid;place-items:center;min-width:0;box-shadow:inset 0 -4px 0 rgba(23,27,45,.09);transition:transform .12s ease,background .12s ease}.gm .tile:hover{background:#f1f2ff;transform:translateY(-1px)}.gm .tile.correct{background:#eafbf0;color:#147a36}.gm .tile.empty{background:rgba(255,255,255,.055);box-shadow:none;cursor:default}.gm .tile.empty:hover{transform:none}.gm .win-panel{position:absolute;inset:0;background:rgba(17,24,39,.93);color:#fff;display:grid;place-content:center;text-align:center;padding:28px}.gm .win-panel[hidden]{display:none}.gm .win-icon{width:68px;height:68px;border-radius:50%;display:grid;place-items:center;background:var(--success);font-size:38px;font-weight:800;margin:0 auto 15px}.gm .win-panel h3{font-size:30px;margin-bottom:8px}.gm .win-panel p{color:#d1d5db}.gm .status{text-align:center;color:var(--muted);font-size:15px;margin:14px 0 0}.gm .game-actions{display:flex;justify-content:center;gap:10px;margin-top:18px}.gm .primary-btn,.gm .secondary-btn{height:48px;border-radius:12px;padding:0 20px;font-weight:800;font-size:16px}.gm .primary-btn{border:1px solid var(--primary);background:var(--primary);color:#fff}.gm .primary-btn:hover{background:var(--primary-dark)}.gm .secondary-btn{border:1px solid var(--border);background:#fff;color:var(--text)}.gm .secondary-btn:hover{background:var(--bg)}.gm .mobile-controls{display:none;text-align:center;margin-top:20px;color:var(--muted);font-size:14px;font-weight:700}.gm .dpad{display:grid;grid-template-columns:repeat(3,48px);grid-template-rows:repeat(2,48px);justify-content:center;gap:7px;margin-top:9px}.gm .dpad button{border:1px solid var(--border);background:#fff;border-radius:11px;font-size:22px;font-weight:800}.gm .dpad button[data-direction=up]{grid-column:2}.gm .dpad button[data-direction=left]{grid-column:1;grid-row:2}.gm .dpad button[data-direction=down]{grid-column:2;grid-row:2}.gm .dpad button[data-direction=right]{grid-column:3;grid-row:2}.gm .tips{background:#f0fbfc;border-color:#d2f0f2}.gm .about-section{padding-top:72px}.gm .about-section{max-width:900px}.gm .about-section p{color:var(--muted)}.gm .section-heading{display:flex;justify-content:space-between;align-items:end;gap:30px;margin-bottom:22px}.gm .section-heading h2{margin-bottom:0}.gm .section-heading>p{max-width:420px;color:var(--muted);font-size:15px;margin-bottom:4px}.gm details{background:#fff;border:1px solid var(--border);border-radius:14px;margin:11px 0;overflow:hidden}.gm summary{padding:18px 20px;font-weight:800;cursor:pointer}.gm details p{padding:0 20px 18px;margin:0;color:var(--muted)}@media (max-width:760px){.gm .game-card{padding:14px;border-radius:17px}.gm .game-topbar{align-items:flex-start;flex-direction:column;gap:13px}.gm .difficulty{width:100%}.gm .size-btn{flex:1}.gm .stats{gap:7px}.gm .stat{padding:9px 6px}.gm .stat strong{font-size:20px}.gm .game-stage{min-height:0;padding:12px}.gm .board{gap:7px;padding:8px;border-radius:13px}.gm .tile{border-radius:9px}.gm .game-actions{flex-direction:column}.gm .game-actions button{width:100%}.gm .mobile-controls{display:block}.gm .about-section{padding-top:54px}.gm .section-heading{display:block}.gm .section-heading>p{margin-top:10px}}@media (max-width:380px){.gm .all-games{font-size:14px}.gm .stats{grid-template-columns:1fr 1fr}.gm .stat:last-child{grid-column:1/-1}.gm .board{gap:5px}}@media (prefers-reduced-motion:reduce){.gm *{scroll-behavior:auto!important;transition:none!important}}";
function __ready(f){f()}
function boot(){
(() => {
  "use strict";

  const boardEl = document.getElementById("board");
  const movesEl = document.getElementById("moves");
  const timerEl = document.getElementById("timer");
  const bestEl = document.getElementById("best");
  const statusEl = document.getElementById("status");
  const winPanel = document.getElementById("win-panel");
  const winSummary = document.getElementById("win-summary");
  const newGameBtn = document.getElementById("new-game");
  const resetBtn = document.getElementById("reset-game");
  const playAgainBtn = document.getElementById("play-again");
  const sizeButtons = [...document.querySelectorAll(".size-btn")];
  const directionButtons = [...document.querySelectorAll("[data-direction]")];

  let size = 3;
  let tiles = [];
  let startingTiles = [];
  let moves = 0;
  let seconds = 0;
  let timerId = null;
  let started = false;
  let finished = false;

  function solvedBoard() {
    return [...Array(size * size - 1)].map((_, i) => i + 1).concat(0);
  }

  function neighbors(index) {
    const row = Math.floor(index / size);
    const col = index % size;
    const result = [];
    if (row > 0) result.push(index - size);
    if (row < size - 1) result.push(index + size);
    if (col > 0) result.push(index - 1);
    if (col < size - 1) result.push(index + 1);
    return result;
  }

  function shuffleSolvable() {
    let arr = solvedBoard();
    let empty = arr.length - 1;
    let previousEmpty = -1;
    const steps = Math.max(80, size * size * 18);

    for (let i = 0; i < steps; i++) {
      let choices = neighbors(empty).filter(n => n !== previousEmpty);
      if (!choices.length) choices = neighbors(empty);
      const chosen = choices[Math.floor(Math.random() * choices.length)];
      [arr[empty], arr[chosen]] = [arr[chosen], arr[empty]];
      previousEmpty = empty;
      empty = chosen;
    }

    if (isSolved(arr)) return shuffleSolvable();
    return arr;
  }

  function render() {
    boardEl.style.setProperty("--size", size);
    boardEl.innerHTML = "";

    tiles.forEach((value, index) => {
      const cell = document.createElement(value === 0 ? "div" : "button");
      cell.className = value === 0 ? "tile empty" : "tile";
      cell.setAttribute("role", "gridcell");

      if (value === 0) {
        cell.setAttribute("aria-label", "Empty space");
      } else {
        cell.type = "button";
        cell.textContent = value;
        cell.dataset.index = index;
        cell.setAttribute("aria-label", `Tile ${value}`);
        if (value === index + 1) cell.classList.add("correct");
        cell.addEventListener("click", () => moveTile(index));
      }
      boardEl.appendChild(cell);
    });
  }

  function moveTile(index) {
    if (finished) return;
    const empty = tiles.indexOf(0);
    if (!neighbors(empty).includes(index)) {
      statusEl.textContent = "That tile cannot move. Choose one beside the empty space.";
      return;
    }

    if (!started) startTimer();
    [tiles[empty], tiles[index]] = [tiles[index], tiles[empty]];
    moves++;
    movesEl.textContent = moves;
    statusEl.textContent = "Good move. Keep arranging the tiles.";
    render();

    if (isSolved(tiles)) completeGame();
  }

  function moveEmpty(direction) {
    if (finished) return;
    const empty = tiles.indexOf(0);
    const row = Math.floor(empty / size);
    const col = empty % size;
    let target = null;

    if (direction === "up" && row > 0) target = empty - size;
    if (direction === "down" && row < size - 1) target = empty + size;
    if (direction === "left" && col > 0) target = empty - 1;
    if (direction === "right" && col < size - 1) target = empty + 1;

    if (target !== null) moveTile(target);
  }

  function isSolved(arr) {
    for (let i = 0; i < arr.length - 1; i++) {
      if (arr[i] !== i + 1) return false;
    }
    return arr[arr.length - 1] === 0;
  }

  function startTimer() {
    if (timerId || finished) return;
    started = true;
    timerId = window.setInterval(() => {
      seconds++;
      timerEl.textContent = formatTime(seconds);
    }, 1000);
  }

  function stopTimer() {
    if (timerId) window.clearInterval(timerId);
    timerId = null;
  }

  function formatTime(total) {
    const mins = Math.floor(total / 60).toString().padStart(2, "0");
    const secs = (total % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  }

  function bestKey() {
    return `numberPuzzleBest_${size}`;
  }

  function readBest() {
    try {
      const raw = localStorage.getItem(bestKey());
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return Number.isFinite(parsed.moves) && Number.isFinite(parsed.seconds) ? parsed : null;
    } catch {
      return null;
    }
  }

  function updateBestDisplay() {
    const best = readBest();
    bestEl.textContent = best ? `${best.moves} moves` : "—";
  }

  function saveBest() {
    const current = { moves, seconds };
    const best = readBest();
    const better = !best || moves < best.moves || (moves === best.moves && seconds < best.seconds);
    if (better) {
      try { localStorage.setItem(bestKey(), JSON.stringify(current)); } catch {}
    }
    updateBestDisplay();
    return better;
  }

  function completeGame() {
    finished = true;
    stopTimer();
    const newBest = saveBest();
    winSummary.textContent = `Solved in ${moves} moves and ${formatTime(seconds)}${newBest ? " — a new best!" : "."}`;
    winPanel.hidden = false;
    statusEl.textContent = "Puzzle solved. Start a new game to play again.";
  }

  function setGameState(arr) {
    stopTimer();
    tiles = [...arr];
    moves = 0;
    seconds = 0;
    started = false;
    finished = false;
    movesEl.textContent = "0";
    timerEl.textContent = "00:00";
    winPanel.hidden = true;
    statusEl.textContent = "Select a tile next to the empty space to move it.";
    updateBestDisplay();
    render();
  }

  function newGame() {
    const shuffled = shuffleSolvable();
    startingTiles = [...shuffled];
    setGameState(shuffled);
  }

  function resetGame() {
    if (!startingTiles.length) return;
    setGameState(startingTiles);
    statusEl.textContent = "Puzzle reset to its starting position.";
  }

  function changeSize(newSize) {
    size = newSize;
    sizeButtons.forEach(btn => {
      const active = Number(btn.dataset.size) === size;
      btn.classList.toggle("active", active);
      btn.setAttribute("aria-pressed", String(active));
    });
    newGame();
  }

  sizeButtons.forEach(btn => btn.addEventListener("click", () => changeSize(Number(btn.dataset.size))));
  newGameBtn.addEventListener("click", newGame);
  resetBtn.addEventListener("click", resetGame);
  playAgainBtn.addEventListener("click", newGame);
  directionButtons.forEach(btn => btn.addEventListener("click", () => moveEmpty(btn.dataset.direction)));

  document.addEventListener("keydown", event => {
    const map = { ArrowUp:"up", ArrowDown:"down", ArrowLeft:"left", ArrowRight:"right" };
    if (!map[event.key]) return;
    event.preventDefault();
    moveEmpty(map[event.key]);
  }, { passive:false });

  newGame();
})();


}
function begin(){poster.hidden=true;gm.hidden=false;if(!booted){booted=true;var s=document.createElement("style");s.textContent=LOOK;document.head.appendChild(s);boot();}else{var r=document.getElementById("play-again");if(r)r.click();}}
poster.addEventListener("click",begin);
var nb=document.getElementById("new");if(nb)nb.addEventListener("click",begin);
})();
