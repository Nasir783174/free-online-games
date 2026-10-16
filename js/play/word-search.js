/* Word Search - game logic + its own look. Layout lives in style.css; page shell lives in the HTML. */
(function(){"use strict";
var gm=document.getElementById("gm"),poster=document.getElementById("poster"),booted=false;
var LOOK=".gm{\n  \n  \n  --teal: #16B8C4;\n  --orange: #FFB84D;\n  --success: #22C55E;\n  --danger: #EF5B5B;\n  \n  \n  \n  \n  \n  --game: #111827;\n  --game-2: #1F2937;\n  --cell-size: min(52px, 7.1vw);\n}.gm *{ box-sizing: border-box; }.gm button{ font: inherit; }.gm button{ cursor: pointer; }.gm .page-shell{\n  width: min(1160px, calc(100% - 40px));\n  margin: 0 auto;\n  padding: 28px 0 72px;\n}.gm h2,.gm p{ margin-top: 0; }.gm h2{\n  font-size: clamp(25px, 3vw, 34px);\n  line-height: 1.2;\n  letter-spacing: -0.025em;\n  margin-bottom: 12px;\n}.gm .stats{\n  display: flex;\n  gap: 10px;\n  flex: 0 0 auto;\n}.gm .stat-card{\n  min-width: 102px;\n  padding: 13px 15px;\n  border: 1px solid var(--border);\n  border-radius: 14px;\n  background: var(--card);\n}.gm .stat-label{\n  display: block;\n  color: var(--muted);\n  font-size: 12px;\n  font-weight: 700;\n  text-transform: uppercase;\n  letter-spacing: .06em;\n}.gm .stat-card strong{\n  display: block;\n  font-size: 20px;\n  line-height: 1.25;\n  margin-top: 3px;\n}.gm .game-card{\n  background: var(--card);\n  border: 1px solid var(--border);\n  border-radius: 20px;\n  padding: 22px;\n  box-shadow: 0 8px 30px rgba(23, 27, 45, .05);\n}.gm .game-toolbar{\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  gap: 20px;\n  margin-bottom: 18px;\n}.gm .game-toolbar h2{ margin-bottom: 4px; }.gm .status{\n  margin-bottom: 0;\n  color: var(--muted);\n  font-size: 15px;\n}.gm .primary-btn{\n  min-height: 48px;\n  padding: 0 20px;\n  border: 0;\n  border-radius: 12px;\n  background: var(--brand);\n  color: #fff;\n  font-weight: 800;\n  transition: transform .15s ease, background .15s ease;\n}.gm .primary-btn:hover{ background: var(--brand-dark); transform: translateY(-1px); }.gm .primary-btn:focus-visible{ outline: 3px solid rgba(91, 92, 226, .28); outline-offset: 3px; }.gm .game-layout{\n  display: grid;\n  grid-template-columns: minmax(0, 1fr) 300px;\n  gap: 22px;\n  align-items: start;\n}.gm .board-wrap{\n  position: relative;\n  min-width: 0;\n  padding: 22px;\n  border-radius: 18px;\n  background: var(--game);\n  overflow: hidden;\n}.gm .word-grid{\n  width: min(100%, 650px);\n  margin: 0 auto;\n  display: grid;\n  grid-template-columns: repeat(12, 1fr);\n  gap: 5px;\n  user-select: none;\n  touch-action: none;\n}.gm .cell{\n  position: relative;\n  aspect-ratio: 1;\n  border: 1px solid rgba(255,255,255,.07);\n  border-radius: 8px;\n  background: var(--game-2);\n  color: #F9FAFB;\n  display: grid;\n  place-items: center;\n  font-size: clamp(15px, 2.2vw, 24px);\n  font-weight: 800;\n  line-height: 1;\n  cursor: crosshair;\n  transition: background .12s ease, transform .12s ease, color .12s ease;\n}.gm .cell:hover{ background: #293548; }.gm .cell.preview{\n  background: rgba(22, 184, 196, .75);\n  color: #fff;\n  transform: scale(.96);\n}.gm .cell.found{\n  background: var(--success);\n  color: #fff;\n  border-color: transparent;\n}.gm .cell.keyboard-active{\n  outline: 3px solid var(--orange);\n  outline-offset: -3px;\n}.gm .cell.found::after{\n  content: \"\";\n  position: absolute;\n  inset: 4px;\n  border: 1px solid rgba(255,255,255,.45);\n  border-radius: 5px;\n}.gm .selection-hint{\n  text-align: center;\n  color: rgba(255,255,255,.68);\n  font-size: 13px;\n  margin-top: 14px;\n}.gm .word-panel{\n  border: 1px solid var(--border);\n  border-radius: 16px;\n  padding: 18px;\n  background: #FBFBFE;\n}.gm .panel-heading{\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  gap: 10px;\n  margin-bottom: 12px;\n}.gm .panel-heading h2{\n  font-size: 21px;\n  margin: 0;\n}.gm .badge{\n  display: inline-flex;\n  align-items: center;\n  min-height: 28px;\n  padding: 0 9px;\n  border-radius: 999px;\n  background: #ECECFF;\n  color: var(--brand-dark);\n  font-size: 12px;\n  font-weight: 800;\n  white-space: nowrap;\n}.gm .word-list{\n  list-style: none;\n  padding: 0;\n  margin: 0;\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 7px;\n}.gm .word-item{\n  min-width: 0;\n  border: 1px solid var(--border);\n  border-radius: 9px;\n  padding: 8px 9px;\n  background: #fff;\n  color: var(--text);\n  font-size: 14px;\n  font-weight: 800;\n  transition: .15s ease;\n}.gm .word-item.found{\n  color: #15803D;\n  background: #ECFDF3;\n  border-color: #B7E7C7;\n  text-decoration: line-through;\n}.gm .control-list li{ margin-bottom: 7px; }.gm .modal{\n  position: fixed;\n  inset: 0;\n  z-index: 10;\n  display: grid;\n  place-items: center;\n  padding: 20px;\n  background: rgba(17, 24, 39, .6);\n}.gm .modal[hidden]{ display: none; }.gm .modal-card{\n  width: min(430px, 100%);\n  background: #fff;\n  border-radius: 22px;\n  padding: 34px;\n  text-align: center;\n  box-shadow: 0 24px 70px rgba(0,0,0,.25);\n}.gm .success-icon{\n  width: 58px;\n  height: 58px;\n  margin: 0 auto 15px;\n  border-radius: 50%;\n  display: grid;\n  place-items: center;\n  background: #DCFCE7;\n  color: #15803D;\n  font-size: 30px;\n  font-weight: 900;\n}.gm .modal-card h2{ margin-bottom: 8px; }.gm .modal-card p:not(.eyebrow){ color: var(--muted); margin-bottom: 22px; }@media (max-width: 900px){.gm .stats{ width: 100%; }.gm .stat-card{ flex: 1; }.gm .game-layout{ grid-template-columns: 1fr; }.gm .word-panel{ order: 2; }.gm .word-list{ grid-template-columns: repeat(3, 1fr); }}@media (max-width: 640px){.gm .page-shell{ width: min(100% - 24px, 1160px); }.gm .page-shell{ padding-top: 20px; padding-bottom: 50px; }.gm .stats{ display: grid; grid-template-columns: repeat(3, 1fr); }.gm .stat-card{ min-width: 0; padding: 10px 11px; }.gm .stat-card strong{ font-size: 17px; }.gm .game-card{ padding: 12px; border-radius: 16px; }.gm .game-toolbar{ align-items: stretch; flex-direction: column; }.gm .primary-btn{ width: 100%; }.gm .board-wrap{ padding: 10px; border-radius: 14px; }.gm .word-grid{ gap: 3px; }.gm .cell{ border-radius: 6px; }.gm .selection-hint{ font-size: 12px; margin-top: 10px; }.gm .word-panel{ padding: 14px; }.gm .word-list{ grid-template-columns: repeat(2, 1fr); }}@media (max-width: 390px){.gm .stats{ gap: 6px; }.gm .stat-card{ padding: 9px 8px; }.gm .stat-label{ font-size: 10px; }.gm .stat-card strong{ font-size: 15px; }.gm .word-item{ font-size: 13px; }}@media (prefers-reduced-motion: reduce){.gm *,.gm *::before,.gm *::after{\n    scroll-behavior: auto !important;\n    transition: none !important;\n  }}";
function __ready(f){f()}
function boot(){
(() => {
  "use strict";

  const GRID_SIZE = 12;
  const WORD_COUNT = 12;
  const DIRECTIONS = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1],           [0, 1],
    [1, -1],  [1, 0],  [1, 1]
  ];

  const WORD_BANK = [
    "BROWSER", "PUZZLE", "LETTER", "SEARCH", "KEYBOARD", "TOUCH",
    "CHALLENGE", "PATTERN", "SCORE", "SPEED", "DIAGONAL", "GRID",
    "MOBILE", "WORD", "GAME", "CLUE", "TARGET", "SOLUTION"
  ];

  const gridEl = document.getElementById("grid");
  const wordListEl = document.getElementById("wordList");
  const foundCountEl = document.getElementById("foundCount");
  const scoreEl = document.getElementById("score");
  const timerEl = document.getElementById("timer");
  const statusTextEl = document.getElementById("statusText");
  const remainingBadgeEl = document.getElementById("remainingBadge");
  const newGameBtn = document.getElementById("newGameBtn");
  const winModal = document.getElementById("winModal");
  const finalSummaryEl = document.getElementById("finalSummary");
  const playAgainBtn = document.getElementById("playAgainBtn");

  let board = [];
  let placements = new Map();
  let foundWords = new Set();
  let selection = null;
  let score = 0;
  let elapsed = 0;
  let timerId = null;
  let gameActive = false;
  let keyboardCursor = { row: 0, col: 0 };
  let keyboardSelection = null;

  const rand = (max) => Math.floor(Math.random() * max);

  function shuffle(array) {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = rand(i + 1);
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function formatTime(seconds) {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
  }

  function updateStats() {
    foundCountEl.textContent = `${foundWords.size} / ${WORD_COUNT}`;
    scoreEl.textContent = String(score);
    timerEl.textContent = formatTime(elapsed);
    const remaining = WORD_COUNT - foundWords.size;
    remainingBadgeEl.textContent = `${remaining} left`;
  }

  function startTimer() {
    clearInterval(timerId);
    timerId = setInterval(() => {
      if (!gameActive) return;
      elapsed += 1;
      timerEl.textContent = formatTime(elapsed);
    }, 1000);
  }

  function emptyBoard() {
    return Array.from({ length: GRID_SIZE }, () =>
      Array.from({ length: GRID_SIZE }, () => "")
    );
  }

  function canPlace(word, row, col, dr, dc) {
    const endRow = row + dr * (word.length - 1);
    const endCol = col + dc * (word.length - 1);
    if (endRow < 0 || endRow >= GRID_SIZE || endCol < 0 || endCol >= GRID_SIZE) {
      return false;
    }
    for (let i = 0; i < word.length; i++) {
      const r = row + dr * i;
      const c = col + dc * i;
      const cell = board[r][c];
      if (cell && cell !== word[i]) return false;
    }
    return true;
  }

  function placeWord(word) {
    const directions = shuffle(DIRECTIONS);
    for (let attempt = 0; attempt < 300; attempt++) {
      const [dr, dc] = directions[attempt % directions.length];
      const row = rand(GRID_SIZE);
      const col = rand(GRID_SIZE);
      if (!canPlace(word, row, col, dr, dc)) continue;

      const cells = [];
      for (let i = 0; i < word.length; i++) {
        const r = row + dr * i;
        const c = col + dc * i;
        board[r][c] = word[i];
        cells.push(`${r},${c}`);
      }
      placements.set(word, cells);
      return true;
    }
    return false;
  }

  function buildPuzzle() {
    for (let rebuild = 0; rebuild < 30; rebuild++) {
      board = emptyBoard();
      placements = new Map();
      const words = shuffle(WORD_BANK).slice(0, WORD_COUNT).sort((a, b) => b.length - a.length);
      let success = true;

      for (const word of words) {
        if (!placeWord(word)) {
          success = false;
          break;
        }
      }

      if (success) {
        for (let r = 0; r < GRID_SIZE; r++) {
          for (let c = 0; c < GRID_SIZE; c++) {
            if (!board[r][c]) board[r][c] = String.fromCharCode(65 + rand(26));
          }
        }
        return words;
      }
    }

    // Extremely unlikely fallback: use a simple horizontal placement.
    board = emptyBoard();
    placements = new Map();
    const words = WORD_BANK.slice(0, WORD_COUNT);
    words.forEach((word, index) => {
      const row = index;
      const col = 0;
      const cells = [];
      for (let i = 0; i < word.length && i < GRID_SIZE; i++) {
        board[row][col + i] = word[i];
        cells.push(`${row},${col + i}`);
      }
      placements.set(word, cells);
    });
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        if (!board[r][c]) board[r][c] = String.fromCharCode(65 + rand(26));
      }
    }
    return words;
  }

  let activeWords = [];

  function renderGrid() {
    gridEl.innerHTML = "";
    const fragment = document.createDocumentFragment();

    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        const cell = document.createElement("button");
        cell.type = "button";
        cell.className = "cell";
        cell.dataset.row = String(r);
        cell.dataset.col = String(c);
        cell.textContent = board[r][c];
        cell.setAttribute("role", "gridcell");
        cell.setAttribute("aria-label", `Row ${r + 1}, column ${c + 1}, letter ${board[r][c]}`);
        cell.addEventListener("pointerdown", onPointerDown);
        cell.addEventListener("pointerenter", onPointerEnter);
        cell.addEventListener("pointerup", onPointerUp);
        fragment.appendChild(cell);
      }
    }
    gridEl.appendChild(fragment);
    updateKeyboardCursor();
  }

  function renderWordList() {
    wordListEl.innerHTML = "";
    activeWords.forEach((word) => {
      const li = document.createElement("li");
      li.className = "word-item";
      li.dataset.word = word;
      li.textContent = word;
      if (foundWords.has(word)) li.classList.add("found");
      wordListEl.appendChild(li);
    });
  }

  function getCell(row, col) {
    return gridEl.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
  }

  function cellsForLine(start, end) {
    const dr = Math.sign(end.row - start.row);
    const dc = Math.sign(end.col - start.col);
    const rowDiff = Math.abs(end.row - start.row);
    const colDiff = Math.abs(end.col - start.col);

    // Only straight lines are valid.
    if (!(start.row === end.row || start.col === end.col || rowDiff === colDiff)) return [];

    const length = Math.max(rowDiff, colDiff) + 1;
    return Array.from({ length }, (_, i) => ({
      row: start.row + dr * i,
      col: start.col + dc * i
    }));
  }

  function sameCells(a, b) {
    if (a.length !== b.length) return false;
    return a.every((cell, i) => cell.row === b[i].row && cell.col === b[i].col);
  }

  function wordForCells(cells) {
    const letters = cells.map(({ row, col }) => board[row][col]).join("");
    const reversed = letters.split("").reverse().join("");

    for (const word of activeWords) {
      if (foundWords.has(word)) continue;
      if (word === letters || word === reversed) return word;
    }
    return null;
  }

  function clearPreview() {
    gridEl.querySelectorAll(".cell.preview").forEach((el) => el.classList.remove("preview"));
  }

  function showPreview(cells) {
    clearPreview();
    cells.forEach(({ row, col }) => {
      const cell = getCell(row, col);
      if (cell) cell.classList.add("preview");
    });
  }

  function markFound(word) {
    const cells = placements.get(word) || [];
    cells.forEach((key) => {
      const [row, col] = key.split(",").map(Number);
      const cell = getCell(row, col);
      if (cell) cell.classList.add("found");
    });

    const item = wordListEl.querySelector(`[data-word="${word}"]`);
    if (item) item.classList.add("found");
  }

  function processSelection(cells) {
    const word = wordForCells(cells);
    clearPreview();

    if (!word) {
      statusTextEl.textContent = "Not a hidden word. Try a straight horizontal, vertical, or diagonal line.";
      return;
    }

    foundWords.add(word);
    score += word.length * 10;
    markFound(word);
    updateStats();
    statusTextEl.textContent = `Found ${word}! Keep going.`;

    if (foundWords.size === WORD_COUNT) finishGame();
  }

  function pointToCell(event) {
    const target = document.elementFromPoint(event.clientX, event.clientY);
    const cell = target && target.closest(".cell");
    if (!cell || !gridEl.contains(cell)) return null;
    return { row: Number(cell.dataset.row), col: Number(cell.dataset.col) };
  }

  function onPointerDown(event) {
    if (!gameActive) return;
    const cell = event.currentTarget;
    selection = {
      pointerId: event.pointerId,
      start: { row: Number(cell.dataset.row), col: Number(cell.dataset.col) },
      current: { row: Number(cell.dataset.row), col: Number(cell.dataset.col) }
    };
    event.currentTarget.setPointerCapture?.(event.pointerId);
    showPreview([selection.start]);
    statusTextEl.textContent = "Keep dragging to the last letter.";
    event.preventDefault();
  }

  function onPointerEnter(event) {
    if (!selection || selection.pointerId !== event.pointerId) return;
    const current = { row: Number(event.currentTarget.dataset.row), col: Number(event.currentTarget.dataset.col) };
    selection.current = current;
    const cells = cellsForLine(selection.start, current);
    showPreview(cells);
  }

  function onPointerUp(event) {
    if (!selection || selection.pointerId !== event.pointerId) return;
    const end = pointToCell(event) || selection.current;
    const cells = cellsForLine(selection.start, end);
    selection = null;
    if (cells.length) processSelection(cells);
    else clearPreview();
  }

  function updateKeyboardCursor() {
    gridEl.querySelectorAll(".cell.keyboard-active").forEach((el) => el.classList.remove("keyboard-active"));
    const cell = getCell(keyboardCursor.row, keyboardCursor.col);
    if (cell) cell.classList.add("keyboard-active");
  }

  function keyboardMove(dr, dc) {
    keyboardCursor.row = Math.max(0, Math.min(GRID_SIZE - 1, keyboardCursor.row + dr));
    keyboardCursor.col = Math.max(0, Math.min(GRID_SIZE - 1, keyboardCursor.col + dc));
    updateKeyboardCursor();
  }

  function handleKeyboard(event) {
    if (!gameActive) return;
    const keys = {
      ArrowUp: [-1, 0], ArrowDown: [1, 0],
      ArrowLeft: [0, -1], ArrowRight: [0, 1]
    };

    if (keys[event.key]) {
      event.preventDefault();
      keyboardMove(...keys[event.key]);
      if (keyboardSelection) {
        keyboardSelection.current = { ...keyboardCursor };
        showPreview(cellsForLine(keyboardSelection.start, keyboardSelection.current));
      }
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (!keyboardSelection) {
        keyboardSelection = {
          start: { ...keyboardCursor },
          current: { ...keyboardCursor }
        };
        showPreview([keyboardCursor]);
        statusTextEl.textContent = "Use the arrow keys to reach the last letter, then press Enter.";
      } else {
        const cells = cellsForLine(keyboardSelection.start, keyboardSelection.current);
        keyboardSelection = null;
        processSelection(cells);
      }
    }

    if (event.key === "Escape") {
      keyboardSelection = null;
      clearPreview();
      statusTextEl.textContent = "Selection cancelled.";
    }
  }

  function finishGame() {
    gameActive = false;
    clearInterval(timerId);
    statusTextEl.textContent = "Puzzle complete!";
    finalSummaryEl.textContent = `You found all ${WORD_COUNT} words in ${formatTime(elapsed)} and scored ${score} points.`;
    winModal.hidden = false;
    playAgainBtn.focus();
  }

  function newGame() {
    winModal.hidden = true;
    clearInterval(timerId);
    foundWords = new Set();
    score = 0;
    elapsed = 0;
    selection = null;
    keyboardSelection = null;
    keyboardCursor = { row: 0, col: 0 };
    activeWords = buildPuzzle();
    gameActive = true;
    renderGrid();
    renderWordList();
    updateStats();
    statusTextEl.textContent = "Select a word by dragging across its letters.";
    startTimer();
  }

  document.addEventListener("pointerup", (event) => {
    if (selection && selection.pointerId === event.pointerId) {
      const end = pointToCell(event) || selection.current;
      const cells = cellsForLine(selection.start, end);
      selection = null;
      if (cells.length) processSelection(cells);
      else clearPreview();
    }
  });

  document.addEventListener("keydown", handleKeyboard);

  newGameBtn.addEventListener("click", newGame);
  playAgainBtn.addEventListener("click", newGame);

  winModal.addEventListener("click", (event) => {
    if (event.target === winModal) {
      winModal.hidden = true;
      newGameBtn.focus();
    }
  });

  newGame();
})();


}
function begin(){poster.hidden=true;gm.hidden=false;if(!booted){booted=true;var s=document.createElement("style");s.textContent=LOOK;document.head.appendChild(s);boot();}else{var r=document.getElementById("newGameBtn");if(r)r.click();}}
poster.addEventListener("click",begin);
var nb=document.getElementById("new");if(nb)nb.addEventListener("click",begin);
})();
