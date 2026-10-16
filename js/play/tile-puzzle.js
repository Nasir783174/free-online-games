/* Tile Puzzle - game logic + its own look. Layout lives in style.css; page shell lives in the HTML. */
(function(){"use strict";
var gm=document.getElementById("gm"),poster=document.getElementById("poster"),booted=false;
var LOOK=".gm{\n  --primary: #5B5CE2;\n  --primary-dark: #4546B8;\n  --secondary: #16B8C4;\n  --action: #FFB84D;\n  --success: #22C55E;\n  --danger: #EF5B5B;\n  \n  \n  \n  \n  \n  --game-bg: #111827;\n  --game-secondary: #1F2937;\n  \n}.gm *{ box-sizing: border-box; }.gm button,.gm input,.gm select{ font: inherit; }.gm button{ cursor: pointer; }.gm h2,.gm h3,.gm p{ overflow-wrap: break-word; }.gm h2{ margin: 0 0 14px; font-size: clamp(28px, 4vw, 34px); line-height: 1.18; font-weight: 700; letter-spacing: -.02em; }.gm h3{ margin: 0 0 8px; font-size: 21px; line-height: 1.3; font-weight: 700; }.gm p{ margin: 0 0 16px; }.gm .game-card{\n  overflow: hidden;\n  background: var(--card);\n  border: 1px solid var(--border);\n  border-radius: 20px;\n  box-shadow: var(--shadow);\n}.gm .game-toolbar{\n  padding: 20px 22px;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 24px;\n  border-bottom: 1px solid var(--border);\n}.gm .toolbar-label{ margin: 0 0 7px; color: var(--muted); font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: .06em; }.gm .size-picker{ display: flex; gap: 8px; flex-wrap: wrap; }.gm .size-btn,.gm .secondary-btn{\n  min-height: 44px;\n  border: 1px solid var(--border);\n  border-radius: 12px;\n  padding: 8px 14px;\n  background: #fff;\n  color: var(--text);\n  font-weight: 800;\n}.gm .size-btn:hover,.gm .size-btn:focus-visible,.gm .secondary-btn:hover,.gm .secondary-btn:focus-visible{ border-color: var(--primary); color: var(--primary); outline: none; }.gm .size-btn.active{ background: var(--primary); border-color: var(--primary); color: #fff; }.gm .stats{ display: flex; gap: 12px; }.gm .stat{\n  min-width: 86px;\n  padding: 8px 12px;\n  text-align: center;\n  border: 1px solid var(--border);\n  border-radius: 12px;\n  background: #FAFAFD;\n}.gm .stat span{ display: block; color: var(--muted); font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: .05em; }.gm .stat strong{ display: block; margin-top: 1px; font-size: 22px; line-height: 1.25; }.gm .game-stage{ background: var(--game-bg); color: #fff; padding: clamp(20px, 4vw, 34px); }.gm .stage-topline{ display: flex; align-items: flex-start; justify-content: space-between; gap: 20px; margin-bottom: 28px; }.gm .stage-topline h2{ color: #fff; font-size: 26px; margin-bottom: 4px; }.gm .stage-topline p{ color: #B8C1D1; margin: 0; font-size: 15px; }.gm .primary-btn{\n  min-height: 46px;\n  border: 0;\n  border-radius: 12px;\n  padding: 10px 18px;\n  background: var(--action);\n  color: #2D210D;\n  font-weight: 800;\n  box-shadow: 0 7px 18px rgba(255,184,77,.18);\n}.gm .primary-btn:hover{ filter: brightness(.96); }.gm .primary-btn:focus-visible{ outline: 3px solid #fff; outline-offset: 3px; }.gm .board-wrap{ display: grid; place-items: center; width: 100%; }.gm .board{\n  --size: 4;\n  width: min(100%, 570px);\n  aspect-ratio: 1;\n  display: grid;\n  grid-template-columns: repeat(var(--size), 1fr);\n  grid-template-rows: repeat(var(--size), 1fr);\n  gap: clamp(6px, 1.2vw, 10px);\n  padding: clamp(8px, 1.5vw, 12px);\n  border-radius: 18px;\n  background: var(--game-secondary);\n  touch-action: none;\n  user-select: none;\n}.gm .tile{\n  border: 0;\n  border-radius: clamp(9px, 1.5vw, 14px);\n  background: #F9FAFB;\n  color: var(--text);\n  font-size: clamp(20px, 6vw, 38px);\n  line-height: 1;\n  font-weight: 800;\n  display: grid;\n  place-items: center;\n  box-shadow: 0 5px 0 #D8DCE7;\n  transition: transform .12s ease, background .12s ease, box-shadow .12s ease;\n}.gm .tile:hover{ background: #fff; transform: translateY(-1px); }.gm .tile:focus-visible{ outline: 4px solid var(--secondary); outline-offset: -4px; }.gm .tile.correct{ background: #EAF9EF; color: #167B38; box-shadow: 0 5px 0 #BCE7CA; }.gm .tile.empty{ visibility: hidden; pointer-events: none; box-shadow: none; }.gm .mobile-hint{ margin-top: 20px; color: #B8C1D1; text-align: center; font-size: 14px; }.gm .about-section{\n  background: var(--card);\n  border: 1px solid var(--border);\n  border-radius: 18px;\n  padding: clamp(22px, 3vw, 30px);\n}.gm .about-section p{ color: var(--muted); }.gm .about-section{ margin: 0 0 22px; }.gm .section-heading{ display: flex; justify-content: space-between; align-items: end; gap: 20px; margin-bottom: 20px; }.gm .placeholder-note{ margin-top: 12px; color: var(--muted); font-size: 13px; }.gm details{ border-top: 1px solid var(--border); padding: 16px 0; }.gm details:first-of-type{ margin-top: 6px; }.gm summary{ cursor: pointer; font-weight: 800; }.gm details p{ margin: 10px 0 0; }.gm .modal{\n  position: fixed;\n  inset: 0;\n  z-index: 100;\n  display: grid;\n  place-items: center;\n  padding: 20px;\n  background: rgba(17,24,39,.72);\n}.gm .modal[hidden]{ display: none; }.gm .modal-panel{ width: min(430px, 100%); border-radius: 20px; padding: 30px; text-align: center; background: #fff; box-shadow: 0 24px 70px rgba(0,0,0,.25); }.gm .win-badge{ width: 58px; height: 58px; display: grid; place-items: center; margin: 0 auto 18px; border-radius: 50%; background: #EAF9EF; color: var(--success); font-size: 28px; font-weight: 800; }.gm .modal-panel h2{ font-size: 32px; }.gm .modal-panel > p:not(.eyebrow){ color: var(--muted); }.gm .modal-actions{ display: flex; justify-content: center; gap: 10px; margin-top: 22px; }@media (max-width: 760px){.gm .game-toolbar{ align-items: stretch; flex-direction: column; }.gm .stats{ width: 100%; }.gm .stat{ flex: 1; min-width: 0; padding-inline: 6px; }.gm .stat strong{ font-size: 20px; }.gm .stage-topline{ align-items: stretch; flex-direction: column; }.gm .primary-btn{ width: 100%; }}@media (max-width: 420px){.gm .game-stage{ padding-inline: 14px; }.gm .board{ gap: 6px; padding: 7px; border-radius: 14px; }.gm .tile{ border-radius: 9px; box-shadow: 0 4px 0 #D8DCE7; }.gm .tile.correct{ box-shadow: 0 4px 0 #BCE7CA; }.gm .size-btn{ flex: 1; padding-inline: 8px; }.gm .modal-actions{ flex-direction: column; }}@media (prefers-reduced-motion: reduce){.gm *,.gm *::before,.gm *::after{ scroll-behavior: auto !important; transition: none !important; }}";
function __ready(f){f()}
function boot(){
(() => {
  "use strict";

  const boardEl = document.getElementById("board");
  const movesEl = document.getElementById("moves");
  const timerEl = document.getElementById("timer");
  const bestEl = document.getElementById("best");
  const statusEl = document.getElementById("status");
  const newGameBtn = document.getElementById("new-game");
  const sizeButtons = [...document.querySelectorAll(".size-btn")];
  const modal = document.getElementById("win-modal");
  const winSummary = document.getElementById("win-summary");
  const playAgainBtn = document.getElementById("play-again");
  const closeModalBtn = document.getElementById("close-modal");

  let size = 4;
  let tiles = [];
  let moves = 0;
  let seconds = 0;
  let timerId = null;
  let started = false;
  let solved = false;
  let touchStart = null;

  function solvedArray(n) {
    return [...Array(n * n - 1)].map((_, i) => i + 1).concat(0);
  }

  function neighbors(index) {
    const row = Math.floor(index / size);
    const col = index % size;
    const list = [];
    if (row > 0) list.push(index - size);
    if (row < size - 1) list.push(index + size);
    if (col > 0) list.push(index - 1);
    if (col < size - 1) list.push(index + 1);
    return list;
  }

  function shuffledSolvableBoard() {
    const arr = solvedArray(size);
    let empty = arr.length - 1;
    let previousEmpty = -1;
    const shuffleMoves = Math.max(120, size * size * 18);

    for (let i = 0; i < shuffleMoves; i++) {
      let options = neighbors(empty).filter(index => index !== previousEmpty);
      if (!options.length) options = neighbors(empty);
      const chosen = options[Math.floor(Math.random() * options.length)];
      [arr[empty], arr[chosen]] = [arr[chosen], arr[empty]];
      previousEmpty = empty;
      empty = chosen;
    }

    if (isSolved(arr)) return shuffledSolvableBoard();
    return arr;
  }

  function isSolved(arr = tiles) {
    const target = solvedArray(size);
    return arr.every((value, index) => value === target[index]);
  }

  function render() {
    boardEl.style.setProperty("--size", size);
    boardEl.innerHTML = "";

    tiles.forEach((value, index) => {
      const tile = document.createElement("button");
      tile.type = "button";
      tile.className = "tile";
      tile.setAttribute("role", "gridcell");

      if (value === 0) {
        tile.classList.add("empty");
        tile.setAttribute("aria-label", "Empty space");
        tile.tabIndex = -1;
      } else {
        tile.textContent = value;
        tile.dataset.index = index;
        tile.setAttribute("aria-label", `Tile ${value}`);
        if (value === index + 1) tile.classList.add("correct");
        tile.addEventListener("click", () => tryMove(index));
      }

      boardEl.appendChild(tile);
    });

    movesEl.textContent = String(moves);
    updateBestDisplay();
  }

  function tryMove(index) {
    if (solved) return false;
    const empty = tiles.indexOf(0);
    if (!neighbors(empty).includes(index)) return false;

    if (!started) startTimer();
    [tiles[empty], tiles[index]] = [tiles[index], tiles[empty]];
    moves += 1;
    render();

    if (isSolved()) finishGame();
    else statusEl.textContent = "Keep going. Put every number in ascending order.";

    return true;
  }

  function startTimer() {
    started = true;
    timerId = window.setInterval(() => {
      seconds += 1;
      timerEl.textContent = formatTime(seconds);
    }, 1000);
  }

  function stopTimer() {
    if (timerId !== null) {
      clearInterval(timerId);
      timerId = null;
    }
  }

  function formatTime(totalSeconds) {
    const mins = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
    const secs = (totalSeconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  }

  function bestKey() {
    return `tilePuzzleBest-${size}`;
  }

  function getBest() {
    const raw = localStorage.getItem(bestKey());
    const value = Number(raw);
    return Number.isFinite(value) && value > 0 ? value : null;
  }

  function updateBestDisplay() {
    const best = getBest();
    bestEl.textContent = best ? String(best) : "—";
  }

  function finishGame() {
    solved = true;
    stopTimer();
    statusEl.textContent = `Solved in ${moves} moves and ${formatTime(seconds)}.`;

    const oldBest = getBest();
    const newRecord = !oldBest || moves < oldBest;
    if (newRecord) {
      localStorage.setItem(bestKey(), String(moves));
      updateBestDisplay();
    }

    winSummary.textContent =
      `You solved the ${size} × ${size} puzzle in ${moves} moves and ${formatTime(seconds)}${newRecord ? ". New best move count!" : "."}`;
    modal.hidden = false;
    playAgainBtn.focus();
  }

  function newGame() {
    stopTimer();
    moves = 0;
    seconds = 0;
    started = false;
    solved = false;
    timerEl.textContent = "00:00";
    statusEl.textContent = "Move a tile next to the empty space to begin.";
    tiles = shuffledSolvableBoard();
    modal.hidden = true;
    render();
  }

  function setSize(nextSize) {
    size = nextSize;
    sizeButtons.forEach(btn => {
      const active = Number(btn.dataset.size) === size;
      btn.classList.toggle("active", active);
      btn.setAttribute("aria-pressed", String(active));
    });
    newGame();
  }

  function moveByArrow(key) {
    if (solved) return;
    const empty = tiles.indexOf(0);
    const row = Math.floor(empty / size);
    const col = empty % size;
    let tileIndex = null;

    // Arrow direction describes the tile movement into the empty space.
    if (key === "ArrowUp" && row < size - 1) tileIndex = empty + size;
    if (key === "ArrowDown" && row > 0) tileIndex = empty - size;
    if (key === "ArrowLeft" && col < size - 1) tileIndex = empty + 1;
    if (key === "ArrowRight" && col > 0) tileIndex = empty - 1;

    if (tileIndex !== null) tryMove(tileIndex);
  }

  sizeButtons.forEach(btn => {
    btn.addEventListener("click", () => setSize(Number(btn.dataset.size)));
  });

  newGameBtn.addEventListener("click", newGame);
  playAgainBtn.addEventListener("click", newGame);
  closeModalBtn.addEventListener("click", () => {
    modal.hidden = true;
    newGameBtn.focus();
  });

  modal.addEventListener("click", event => {
    if (event.target === modal) {
      modal.hidden = true;
      newGameBtn.focus();
    }
  });

  document.addEventListener("keydown", event => {
    if (!modal.hidden && event.key === "Escape") {
      modal.hidden = true;
      newGameBtn.focus();
      return;
    }

    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)) {
      event.preventDefault();
      moveByArrow(event.key);
    }
  });

  boardEl.addEventListener("touchstart", event => {
    const touch = event.changedTouches[0];
    touchStart = { x: touch.clientX, y: touch.clientY };
  }, { passive: true });

  boardEl.addEventListener("touchend", event => {
    if (!touchStart) return;
    const touch = event.changedTouches[0];
    const dx = touch.clientX - touchStart.x;
    const dy = touch.clientY - touchStart.y;
    touchStart = null;

    const threshold = 28;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < threshold) return;

    if (Math.abs(dx) > Math.abs(dy)) {
      moveByArrow(dx > 0 ? "ArrowRight" : "ArrowLeft");
    } else {
      moveByArrow(dy > 0 ? "ArrowDown" : "ArrowUp");
    }
  }, { passive: true });

  setSize(4);
})();


}
function begin(){poster.hidden=true;gm.hidden=false;if(!booted){booted=true;var s=document.createElement("style");s.textContent=LOOK;document.head.appendChild(s);boot();}else{var r=document.getElementById("new-game");if(r)r.click();}}
poster.addEventListener("click",begin);
var nb=document.getElementById("new");if(nb)nb.addEventListener("click",begin);
})();
