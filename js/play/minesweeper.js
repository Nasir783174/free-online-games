/* Minesweeper - game logic + its own look. Layout lives in style.css; page shell lives in the HTML. */
(function(){"use strict";
var gm=document.getElementById("gm"),poster=document.getElementById("poster"),booted=false;
var LOOK=".gm{\n  \n  \n  --accent: #16b8c4;\n  --action: #ffb84d;\n  --success: #22c55e;\n  --danger: #ef5b5b;\n  --page: #f6f7fb;\n  \n  \n  \n  \n  --board: #111827;\n  --board-two: #1f2937;\n  \n}.gm *{ box-sizing: border-box; }.gm button,.gm input{ font: inherit; }.gm button{ touch-action: manipulation; }.gm .visually-hidden{ position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0; }.gm h2,.gm h3,.gm p{ overflow-wrap: break-word; }.gm .game-section{ padding-bottom: 76px; }.gm .game-shell{ max-width: 990px; }.gm .game-toolbar{ display: flex; align-items: flex-end; justify-content: space-between; gap: 20px; margin-bottom: 14px; }.gm .difficulty-picker{ margin: 0; padding: 0; border: 0; }.gm .difficulty-picker legend{ margin-bottom: 7px; color: var(--muted); font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: .08em; }.gm .segment-control{ display: flex; padding: 4px; background: #e9ebf4; border-radius: 12px; }.gm .difficulty{ min-height: 40px; padding: 7px 15px; color: #555d72; background: transparent; border: 0; border-radius: 9px; font-size: 15px; font-weight: 800; cursor: pointer; }.gm .difficulty.active{ color: var(--brand-dark); background: #fff; box-shadow: 0 2px 7px rgba(23,27,45,.1); }.gm .new-game-button{ min-height: 48px; padding: 10px 18px; color: #fff; background: var(--brand); border: 0; border-radius: 12px; font-weight: 800; cursor: pointer; box-shadow: 0 8px 18px rgba(91,92,226,.23); }.gm .new-game-button:hover{ background: var(--brand-dark); }.gm .game-card{ overflow: hidden; background: var(--card); border: 1px solid var(--border); border-radius: 20px; box-shadow: var(--shadow); }.gm .score-strip{ display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; min-height: 92px; padding: 15px 24px; border-bottom: 1px solid var(--border); }.gm .stat{ display: flex; align-items: center; gap: 12px; }.gm .stat-right{ justify-self: end; }.gm .stat span:last-child{ display: flex; flex-direction: column; }.gm .stat small{ color: var(--muted); font-size: 12px; font-weight: 800; line-height: 1.3; letter-spacing: .08em; text-transform: uppercase; }.gm .stat strong{ min-width: 46px; font-size: 24px; line-height: 1.25; font-variant-numeric: tabular-nums; }.gm .mine-icon{ position: relative; width: 30px; height: 30px; background: var(--danger); border: 7px solid #fee2e2; border-radius: 50%; box-shadow: 0 0 0 2px var(--danger); }.gm .mine-icon::before,.gm .mine-icon::after{ content: \"\"; position: absolute; inset: -10px 7px; background: var(--danger); border-radius: 3px; z-index: -1; }.gm .mine-icon::after{ transform: rotate(90deg); }.gm .clock-icon{ width: 29px; height: 29px; border: 3px solid var(--accent); border-radius: 50%; position: relative; }.gm .clock-icon::before{ content: \"\"; position: absolute; width: 3px; height: 8px; left: 10px; top: 4px; background: var(--accent); border-radius: 2px; }.gm .clock-icon::after{ content: \"\"; position: absolute; width: 7px; height: 3px; left: 10px; top: 11px; background: var(--accent); border-radius: 2px; transform: rotate(30deg); transform-origin: left center; }.gm .face-button{ display: grid; place-items: center; width: 54px; height: 54px; padding: 0; background: #fff8e8; border: 2px solid #ffd980; border-radius: 14px; font-size: 27px; cursor: pointer; }.gm .face-button:hover{ transform: translateY(-1px); }.gm .status-message{ padding: 12px 20px; color: #dce4f2; background: var(--board-two); text-align: center; font-size: 14px; font-weight: 700; border-bottom: 1px solid #374151; }.gm .status-message.win{ color: #bbf7d0; }.gm .status-message.lose{ color: #fecaca; }.gm .board-viewport{ overflow: auto; padding: 24px; background: var(--board); scrollbar-color: #4b5563 var(--board); overscroll-behavior-inline: contain; }.gm .game-board{ --cols: 9; --cell: 38px; display: grid; grid-template-columns: repeat(var(--cols), var(--cell)); grid-auto-rows: var(--cell); gap: 3px; width: max-content; margin: auto; padding: 7px; background: #0b1220; border: 1px solid #384456; border-radius: 12px; user-select: none; -webkit-user-select: none; touch-action: manipulation; }.gm .cell{ position: relative; display: grid; place-items: center; width: var(--cell); height: var(--cell); padding: 0; color: #fff; background: #3c485a; border: 0; border-radius: 6px; font-size: calc(var(--cell) * .48); font-weight: 900; line-height: 1; cursor: pointer; box-shadow: inset 0 2px 0 rgba(255,255,255,.12), inset 0 -2px 0 rgba(0,0,0,.22); }.gm .cell:hover:not(.revealed){ background: #4a586c; }.gm .cell:focus-visible{ z-index: 2; outline: 3px solid var(--action); outline-offset: 1px; }.gm .cell.revealed{ color: #dbe3ef; background: #202b3b; cursor: default; box-shadow: inset 0 0 0 1px #2f3c4e; }.gm .cell.flagged{ color: #ffd166; background: #454054; }.gm .cell.mine{ color: #fff; background: var(--danger); }.gm .cell.exploded{ background: #c92e3b; animation: pop .28s ease-out; }.gm .cell.wrong-flag::after{ content: \"\u00d7\"; position: absolute; color: #fff; font-size: calc(var(--cell) * .75); text-shadow: 0 1px 3px #000; }.gm .cell[data-number=\"1\"]{ color: #60a5fa; }.gm .cell[data-number=\"2\"]{ color: #4ade80; }.gm .cell[data-number=\"3\"]{ color: #fb7185; }.gm .cell[data-number=\"4\"]{ color: #a78bfa; }.gm .cell[data-number=\"5\"]{ color: #fb923c; }.gm .cell[data-number=\"6\"]{ color: #2dd4bf; }.gm .cell[data-number=\"7\"]{ color: #f8fafc; }.gm .cell[data-number=\"8\"]{ color: #9ca3af; }@keyframes pop{ 50% { transform: scale(1.12); } }.gm .mobile-tools{ display: none; align-items: center; justify-content: space-between; gap: 12px; padding: 14px 18px; border-top: 1px solid var(--border); }.gm .mobile-tools > span{ color: var(--muted); font-size: 14px; font-weight: 800; }.gm .mode-control{ display: flex; gap: 5px; padding: 4px; background: #eef0f7; border-radius: 11px; }.gm .mode-button{ min-height: 42px; padding: 7px 13px; color: #596174; background: transparent; border: 0; border-radius: 8px; font-size: 14px; font-weight: 800; }.gm .mode-button.active{ color: #fff; background: var(--brand); }.gm .game-meta{ display: flex; justify-content: space-between; gap: 20px; padding: 14px 24px; border-top: 1px solid var(--border); color: var(--muted); font-size: 14px; }.gm .game-meta p{ margin: 0; }.gm .game-meta strong{ color: var(--text); }.gm .control-note{ margin: 15px auto 0; max-width: 780px; color: var(--muted); text-align: center; font-size: 14px; }.gm .steps-list{ display: grid; gap: 12px; padding: 0; margin: 30px 0 0; list-style: none; }.gm .steps-list li{ display: grid; grid-template-columns: 44px 1fr; gap: 15px; padding: 18px; background: #fff; border: 1px solid var(--border); border-radius: 14px; }.gm .steps-list li > span{ display: grid; place-items: center; width: 40px; height: 40px; color: var(--brand-dark); background: #eeeeff; border-radius: 10px; font-weight: 900; }.gm .steps-list h3{ margin: 0; font-size: 19px; line-height: 1.4; }.gm .steps-list p{ margin: 4px 0 0; color: var(--muted); font-size: 16px; }.gm .tips-list{ padding-left: 22px; color: #4f586d; }.gm .tips-list li{ margin-bottom: 12px; padding-left: 5px; }.gm .tips-list strong{ color: var(--text); }.gm .quick-guide{ position: sticky; top: 22px; padding: 24px; background: #fff; border: 1px solid var(--border); border-radius: 18px; box-shadow: 0 12px 34px rgba(23,27,45,.06); }.gm .quick-guide h2{ margin: 0 0 12px; font-size: 24px; }.gm .quick-guide dl{ margin: 0; }.gm .quick-guide dl div{ display: flex; justify-content: space-between; gap: 15px; padding-block: 12px; border-bottom: 1px solid var(--border); }.gm .quick-guide dt{ font-weight: 800; }.gm .quick-guide dd{ margin: 0; color: var(--muted); text-align: right; }.gm .quick-guide p{ margin: 20px 0 0; padding: 14px; color: #586174; background: #f0fafa; border-radius: 12px; font-size: 14px; line-height: 1.55; }.gm button:focus-visible,.gm summary:focus-visible{ outline: 3px solid var(--action); outline-offset: 3px; }@media (max-width: 820px){.gm .quick-guide{ position: static; }}@media (max-width: 640px){.gm .game-section{ padding-bottom: 56px; }.gm .game-toolbar{ display: block; }.gm .segment-control{ width: 100%; }.gm .difficulty{ flex: 1; padding-inline: 7px; font-size: 13px; }.gm .new-game-button{ width: 100%; margin-top: 10px; }.gm .score-strip{ min-height: 82px; padding-inline: 16px; }.gm .stat{ gap: 8px; }.gm .mine-icon,.gm .clock-icon{ transform: scale(.82); }.gm .stat strong{ font-size: 21px; }.gm .face-button{ width: 48px; height: 48px; }.gm .board-viewport{ padding: 16px; }.gm .game-board{ --cell: 34px; margin-inline: auto; }.gm .game-board[data-level=\"intermediate\"],.gm .game-board[data-level=\"expert\"]{ margin-inline: 0; }.gm .mobile-tools{ display: flex; }.gm .game-meta{ display: block; padding-inline: 18px; text-align: center; }.gm .game-meta p + p{ margin-top: 4px; }.gm .control-note{ text-align: left; }.gm .steps-list li{ grid-template-columns: 38px 1fr; padding: 15px; }.gm .steps-list li > span{ width: 36px; height: 36px; }}@media (max-width: 380px){.gm .game-board{ --cell: 31px; gap: 2px; padding: 5px; }.gm .stat-icon{ display: none; }.gm .mobile-tools{ display: block; }.gm .mode-control{ margin-top: 8px; }.gm .mode-button{ flex: 1; }}@media (prefers-reduced-motion: reduce){.gm *,.gm *::before,.gm *::after{ scroll-behavior: auto !important; animation-duration: .01ms !important; transition-duration: .01ms !important; }}";
function __ready(f){f()}
function boot(){
(function () {
  "use strict";

  const LEVELS = {
    beginner: { rows: 9, cols: 9, mines: 10, label: "Beginner" },
    intermediate: { rows: 16, cols: 16, mines: 40, label: "Intermediate" },
    expert: { rows: 16, cols: 30, mines: 99, label: "Expert" }
  };

  const boardElement = document.getElementById("game-board");
  const mineCountElement = document.getElementById("mine-count");
  const timerElement = document.getElementById("timer");
  const statusElement = document.getElementById("status-message");
  const faceElement = document.getElementById("face");
  const bestTimeElement = document.getElementById("best-time");
  const levelSummaryElement = document.getElementById("level-summary");
  const difficultyButtons = Array.from(document.querySelectorAll(".difficulty"));
  const revealModeButton = document.getElementById("reveal-mode");
  const flagModeButton = document.getElementById("flag-mode");

  let levelName = "beginner";
  let board = [];
  let gameState = "ready";
  let firstMove = true;
  let flagsPlaced = 0;
  let revealedSafeCells = 0;
  let elapsedSeconds = 0;
  let timerId = null;
  let inputMode = "reveal";
  let pointerTimer = null;
  let longPressTriggered = false;

  function createCell(row, col) {
    return {
      row,
      col,
      mine: false,
      revealed: false,
      flagged: false,
      adjacent: 0,
      element: null
    };
  }

  function startNewGame(nextLevel = levelName) {
    stopTimer();
    levelName = nextLevel;
    const level = LEVELS[levelName];
    board = Array.from({ length: level.rows }, (_, row) =>
      Array.from({ length: level.cols }, (_, col) => createCell(row, col))
    );
    gameState = "ready";
    firstMove = true;
    flagsPlaced = 0;
    revealedSafeCells = 0;
    elapsedSeconds = 0;
    inputMode = "reveal";

    boardElement.replaceChildren();
    boardElement.style.setProperty("--cols", level.cols);
    boardElement.dataset.level = levelName;
    boardElement.setAttribute("aria-rowcount", String(level.rows));
    boardElement.setAttribute("aria-colcount", String(level.cols));

    const fragment = document.createDocumentFragment();
    board.flat().forEach((cell) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "cell";
      button.dataset.row = cell.row;
      button.dataset.col = cell.col;
      button.setAttribute("role", "gridcell");
      button.setAttribute("aria-rowindex", String(cell.row + 1));
      button.setAttribute("aria-colindex", String(cell.col + 1));
      button.setAttribute("aria-label", `Covered square, row ${cell.row + 1}, column ${cell.col + 1}`);
      cell.element = button;
      fragment.appendChild(button);
    });
    boardElement.appendChild(fragment);

    difficultyButtons.forEach((button) => {
      const active = button.dataset.level === levelName;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    setInputMode("reveal");
    setStatus("Choose a square to begin.");
    faceElement.textContent = "🙂";
    timerElement.textContent = "000";
    updateMineCounter();
    levelSummaryElement.textContent = `${level.label} · ${level.cols} × ${level.rows} · ${level.mines} mines`;
    updateBestTime();
  }

  function placeMines(safeRow, safeCol) {
    const level = LEVELS[levelName];
    const protectedCells = new Set();
    forEachNeighbor(safeRow, safeCol, (neighbor) => protectedCells.add(key(neighbor.row, neighbor.col)));
    protectedCells.add(key(safeRow, safeCol));

    let candidates = board.flat().filter((cell) => !protectedCells.has(key(cell.row, cell.col)));
    if (candidates.length < level.mines) {
      candidates = board.flat().filter((cell) => cell.row !== safeRow || cell.col !== safeCol);
    }

    shuffle(candidates);
    candidates.slice(0, level.mines).forEach((cell) => { cell.mine = true; });
    board.flat().forEach((cell) => {
      if (!cell.mine) {
        let count = 0;
        forEachNeighbor(cell.row, cell.col, (neighbor) => { if (neighbor.mine) count += 1; });
        cell.adjacent = count;
      }
    });
  }

  function shuffle(items) {
    for (let i = items.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [items[i], items[j]] = [items[j], items[i]];
    }
  }

  function key(row, col) { return `${row}:${col}`; }

  function forEachNeighbor(row, col, callback) {
    const level = LEVELS[levelName];
    for (let rowOffset = -1; rowOffset <= 1; rowOffset += 1) {
      for (let colOffset = -1; colOffset <= 1; colOffset += 1) {
        if (rowOffset === 0 && colOffset === 0) continue;
        const nextRow = row + rowOffset;
        const nextCol = col + colOffset;
        if (nextRow >= 0 && nextRow < level.rows && nextCol >= 0 && nextCol < level.cols) {
          callback(board[nextRow][nextCol]);
        }
      }
    }
  }

  function startTimer() {
    if (timerId !== null) return;
    timerId = window.setInterval(() => {
      elapsedSeconds = Math.min(999, elapsedSeconds + 1);
      timerElement.textContent = formatCounter(elapsedSeconds);
      if (elapsedSeconds === 999) stopTimer();
    }, 1000);
  }

  function stopTimer() {
    if (timerId !== null) window.clearInterval(timerId);
    timerId = null;
  }

  function formatCounter(value) {
    if (value < 0) return `-${String(Math.min(99, Math.abs(value))).padStart(2, "0")}`;
    return String(Math.min(999, value)).padStart(3, "0");
  }

  function updateMineCounter() {
    mineCountElement.textContent = formatCounter(LEVELS[levelName].mines - flagsPlaced);
  }

  function setStatus(message, type = "") {
    statusElement.textContent = message;
    statusElement.className = `status-message${type ? ` ${type}` : ""}`;
  }

  function revealCell(cell) {
    if (gameState === "won" || gameState === "lost" || cell.flagged) return;
    if (cell.revealed) {
      chordReveal(cell);
      return;
    }

    if (firstMove) {
      placeMines(cell.row, cell.col);
      firstMove = false;
      gameState = "playing";
      startTimer();
      setStatus("Game in progress. Use the clues to find safe squares.");
    }

    if (cell.mine) {
      loseGame(cell);
      return;
    }

    floodReveal(cell);
    checkWin();
  }

  function floodReveal(startCell) {
    const queue = [startCell];
    const queued = new Set([key(startCell.row, startCell.col)]);

    while (queue.length) {
      const cell = queue.shift();
      if (cell.revealed || cell.flagged || cell.mine) continue;
      showSafeCell(cell);

      if (cell.adjacent === 0) {
        forEachNeighbor(cell.row, cell.col, (neighbor) => {
          const neighborKey = key(neighbor.row, neighbor.col);
          if (!neighbor.revealed && !neighbor.flagged && !neighbor.mine && !queued.has(neighborKey)) {
            queued.add(neighborKey);
            queue.push(neighbor);
          }
        });
      }
    }
  }

  function showSafeCell(cell) {
    cell.revealed = true;
    revealedSafeCells += 1;
    cell.element.classList.add("revealed");
    cell.element.disabled = false;
    if (cell.adjacent > 0) {
      cell.element.textContent = cell.adjacent;
      cell.element.dataset.number = cell.adjacent;
      cell.element.setAttribute("aria-label", `${cell.adjacent} adjacent ${cell.adjacent === 1 ? "mine" : "mines"}, row ${cell.row + 1}, column ${cell.col + 1}`);
    } else {
      cell.element.setAttribute("aria-label", `Empty square, row ${cell.row + 1}, column ${cell.col + 1}`);
    }
  }

  function chordReveal(cell) {
    if (!cell.revealed || cell.adjacent === 0 || gameState !== "playing") return;
    let nearbyFlags = 0;
    const coveredNeighbors = [];
    forEachNeighbor(cell.row, cell.col, (neighbor) => {
      if (neighbor.flagged) nearbyFlags += 1;
      else if (!neighbor.revealed) coveredNeighbors.push(neighbor);
    });
    if (nearbyFlags !== cell.adjacent) return;

    const mineHit = coveredNeighbors.find((neighbor) => neighbor.mine);
    if (mineHit) {
      loseGame(mineHit);
      return;
    }
    coveredNeighbors.forEach(floodReveal);
    checkWin();
  }

  function toggleFlag(cell) {
    if (gameState === "won" || gameState === "lost" || cell.revealed) return;
    cell.flagged = !cell.flagged;
    flagsPlaced += cell.flagged ? 1 : -1;
    cell.element.classList.toggle("flagged", cell.flagged);
    cell.element.textContent = cell.flagged ? "⚑" : "";
    cell.element.setAttribute("aria-label", cell.flagged
      ? `Flagged square, row ${cell.row + 1}, column ${cell.col + 1}`
      : `Covered square, row ${cell.row + 1}, column ${cell.col + 1}`);
    updateMineCounter();
  }

  function loseGame(triggeredCell) {
    gameState = "lost";
    stopTimer();
    faceElement.textContent = "😵";
    setStatus("Mine triggered. Try a new board!", "lose");

    board.flat().forEach((cell) => {
      if (cell.mine) {
        cell.element.classList.add("revealed", "mine");
        cell.element.textContent = "✹";
        cell.element.setAttribute("aria-label", `Mine, row ${cell.row + 1}, column ${cell.col + 1}`);
      } else if (cell.flagged) {
        cell.element.classList.add("wrong-flag");
        cell.element.setAttribute("aria-label", `Incorrect flag, row ${cell.row + 1}, column ${cell.col + 1}`);
      }
    });
    triggeredCell.element.classList.add("exploded");
  }

  function checkWin() {
    const level = LEVELS[levelName];
    if (revealedSafeCells !== level.rows * level.cols - level.mines) return;

    gameState = "won";
    stopTimer();
    faceElement.textContent = "😎";
    setStatus(`Board cleared in ${elapsedSeconds} ${elapsedSeconds === 1 ? "second" : "seconds"}!`, "win");
    board.flat().forEach((cell) => {
      if (cell.mine && !cell.flagged) {
        cell.flagged = true;
        flagsPlaced += 1;
        cell.element.classList.add("flagged");
        cell.element.textContent = "⚑";
      }
    });
    updateMineCounter();
    saveBestTime();
  }

  function getCellFromEvent(event) {
    const element = event.target.closest(".cell");
    if (!element || !boardElement.contains(element)) return null;
    return board[Number(element.dataset.row)][Number(element.dataset.col)];
  }

  function setInputMode(mode) {
    inputMode = mode;
    const revealActive = mode === "reveal";
    revealModeButton.classList.toggle("active", revealActive);
    flagModeButton.classList.toggle("active", !revealActive);
    revealModeButton.setAttribute("aria-pressed", String(revealActive));
    flagModeButton.setAttribute("aria-pressed", String(!revealActive));
  }

  function bestTimeKey() { return `games-hub-minesweeper-best-${levelName}`; }

  function getBestTime() {
    try {
      const saved = Number(window.localStorage.getItem(bestTimeKey()));
      return Number.isFinite(saved) && saved > 0 ? saved : null;
    } catch (error) {
      return null;
    }
  }

  function saveBestTime() {
    const currentBest = getBestTime();
    if (currentBest === null || elapsedSeconds < currentBest) {
      try { window.localStorage.setItem(bestTimeKey(), String(elapsedSeconds)); } catch (error) { /* Storage may be unavailable. */ }
    }
    updateBestTime();
  }

  function updateBestTime() {
    const best = getBestTime();
    bestTimeElement.textContent = best === null ? "—" : `${best}s`;
  }

  boardElement.addEventListener("click", (event) => {
    if (longPressTriggered) {
      longPressTriggered = false;
      return;
    }
    const cell = getCellFromEvent(event);
    if (!cell) return;
    if (inputMode === "flag") toggleFlag(cell);
    else revealCell(cell);
  });

  boardElement.addEventListener("contextmenu", (event) => {
    const cell = getCellFromEvent(event);
    if (!cell) return;
    event.preventDefault();
    toggleFlag(cell);
  });

  boardElement.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "mouse" || event.button !== 0) return;
    const cell = getCellFromEvent(event);
    if (!cell) return;
    longPressTriggered = false;
    pointerTimer = window.setTimeout(() => {
      longPressTriggered = true;
      toggleFlag(cell);
      if (navigator.vibrate) navigator.vibrate(35);
    }, 550);
  });

  ["pointerup", "pointercancel", "pointerleave"].forEach((eventName) => {
    boardElement.addEventListener(eventName, () => {
      if (pointerTimer !== null) window.clearTimeout(pointerTimer);
      pointerTimer = null;
    });
  });

  boardElement.addEventListener("keydown", (event) => {
    const cell = getCellFromEvent(event);
    if (!cell) return;
    if (event.key.toLowerCase() === "f") {
      event.preventDefault();
      toggleFlag(cell);
    }
  });

  difficultyButtons.forEach((button) => button.addEventListener("click", () => startNewGame(button.dataset.level)));
  document.getElementById("new-game").addEventListener("click", () => startNewGame());
  document.getElementById("face-button").addEventListener("click", () => startNewGame());
  revealModeButton.addEventListener("click", () => setInputMode("reveal"));
  flagModeButton.addEventListener("click", () => setInputMode("flag"));
  document.getElementById("current-year").textContent = new Date().getFullYear();

  startNewGame();
}());


}
function begin(){poster.hidden=true;gm.hidden=false;if(!booted){booted=true;var s=document.createElement("style");s.textContent=LOOK;document.head.appendChild(s);boot();}else{var r=document.getElementById("new-game");if(r)r.click();}}
poster.addEventListener("click",begin);
var nb=document.getElementById("new");if(nb)nb.addEventListener("click",begin);
})();
