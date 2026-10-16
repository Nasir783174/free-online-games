/* Four in a Row - game logic + its own look. Layout lives in style.css; page shell lives in the HTML. */
(function(){"use strict";
var gm=document.getElementById("gm"),poster=document.getElementById("poster"),booted=false;
var LOOK=".gm{\n  \n  \n  --secondary: #16B8C4;\n  --action: #FFB84D;\n  --success: #22C55E;\n  --danger: #EF5B5B;\n  \n  \n  \n  \n  \n  --game-bg: #111827;\n  --game-bg-2: #1F2937;\n  --red: #F25F5C;\n  --red-dark: #C94442;\n  --yellow: #FFD166;\n  --yellow-dark: #D6A53B;\n  --board-blue: #3764E8;\n  --board-dark: #264EC3;\n  \n}.gm *{ box-sizing: border-box; }.gm button,.gm input,.gm textarea,.gm select{ font: inherit; }.gm button{ cursor: pointer; }.gm .site-header__inner{ display: flex; align-items: center; justify-content: space-between; gap: 20px; }.gm h2,.gm h3{ margin-top: 0; letter-spacing: -.025em; }.gm h2{ margin-bottom: 18px; font-size: clamp(28px, 4vw, 36px); line-height: 1.18; font-weight: 700; }.gm h3{ margin-bottom: 12px; font-size: 22px; line-height: 1.25; font-weight: 700; }.gm .game-section{ padding-bottom: 72px; }.gm .game-shell{ background: var(--card); border: 1px solid var(--border); border-radius: 20px; box-shadow: var(--shadow); padding: 24px; }.gm .game-toolbar{ display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-bottom: 22px; }.gm .mode-switch{ display: inline-flex; align-items: center; gap: 4px; border: 1px solid var(--border); background: var(--bg); padding: 4px; border-radius: 13px; }.gm .mode-btn,.gm .secondary-btn,.gm .primary-btn,.gm .ghost-btn{ min-height: 46px; border-radius: 11px; border: 0; padding: 0 17px; font-weight: 800; transition: transform .15s ease, background-color .15s ease, border-color .15s ease, color .15s ease, box-shadow .15s ease; }.gm .mode-btn{ background: transparent; color: var(--muted); }.gm .mode-btn.is-active{ background: var(--card); color: var(--text); box-shadow: 0 4px 16px rgba(23,27,45,.08); }.gm .primary-btn{ background: var(--brand); color: white; box-shadow: inset 0 -3px 0 rgba(0,0,0,.13); }.gm .primary-btn:hover{ background: var(--brand-dark); transform: translateY(-1px); }.gm .secondary-btn{ background: var(--game-bg); color: white; }.gm .secondary-btn:hover{ background: var(--game-bg-2); }.gm .ghost-btn{ background: white; color: var(--text); border: 1px solid var(--border); }.gm .ghost-btn:hover{ border-color: #C7CAD7; background: var(--bg); }.gm button:focus-visible,.gm summary:focus-visible{ outline: 3px solid rgba(91,92,226,.35); outline-offset: 3px; }.gm .status-grid{ display: grid; grid-template-columns: 1fr minmax(190px, .8fr) 1fr; gap: 16px; align-items: stretch; margin-bottom: 22px; }.gm .player-card,.gm .turn-panel{ min-height: 86px; border: 1px solid var(--border); border-radius: 16px; background: #fff; padding: 15px 18px; }.gm .player-card{ display: flex; align-items: center; gap: 14px; transition: border-color .2s ease, box-shadow .2s ease, transform .2s ease; }.gm .player-card.is-active{ border-color: rgba(91,92,226,.4); box-shadow: 0 0 0 3px rgba(91,92,226,.08); transform: translateY(-1px); }.gm .player-disc{ width: 38px; aspect-ratio: 1; border-radius: 50%; flex: 0 0 auto; border: 3px solid rgba(23,27,45,.10); box-shadow: inset 0 -5px 0 rgba(0,0,0,.10); }.gm .player-disc--red{ background: var(--red); }.gm .player-disc--yellow{ background: var(--yellow); }.gm .player-label,.gm .turn-panel__label{ display: block; color: var(--muted); font-size: 14px; font-weight: 700; }.gm .player-card strong{ display: block; font-size: 26px; line-height: 1.1; margin-top: 2px; }.gm .turn-panel{ text-align: center; display: flex; flex-direction: column; justify-content: center; align-items: center; }.gm .turn-panel strong{ font-size: 22px; line-height: 1.2; }.gm .round-text{ color: var(--muted); font-size: 13px; margin-top: 4px; }.gm .board-wrap{ position: relative; max-width: 760px; margin: 0 auto; padding: 56px 28px 25px; border-radius: 22px; background: linear-gradient(180deg, #151E31 0%, #0F1726 100%); overflow: hidden; }.gm .board-wrap::before{ content: \"\"; position: absolute; inset: 0; background: radial-gradient(circle at 50% 0%, rgba(255,255,255,.06), transparent 45%); pointer-events: none; }.gm .column-controls{ display: grid; grid-template-columns: repeat(7, 1fr); gap: 8px; position: absolute; left: 28px; right: 28px; top: 12px; height: 38px; }.gm .column-btn{ position: relative; border: 0; border-radius: 9px; background: transparent; color: white; font-size: 13px; font-weight: 800; opacity: .7; }.gm .column-btn::after{ content: \"\u25bc\"; display: block; margin-top: -3px; font-size: 12px; opacity: 0; transform: translateY(-4px); transition: opacity .15s ease, transform .15s ease; }.gm .column-btn:hover,.gm .column-btn.is-selected{ background: rgba(255,255,255,.08); opacity: 1; }.gm .column-btn:hover::after,.gm .column-btn.is-selected::after{ opacity: 1; transform: translateY(0); }.gm .column-btn:disabled{ opacity: .25; cursor: not-allowed; }.gm .board{ display: grid; grid-template-columns: repeat(7, 1fr); grid-template-rows: repeat(6, 1fr); gap: clamp(6px, 1vw, 12px); padding: clamp(10px, 1.8vw, 18px); background: var(--board-blue); border-radius: 18px 18px 13px 13px; border-bottom: 7px solid var(--board-dark); box-shadow: 0 18px 30px rgba(0,0,0,.22), inset 0 1px 0 rgba(255,255,255,.18); position: relative; z-index: 2; }.gm .cell{ aspect-ratio: 1; border-radius: 50%; background: #0F1726; border: clamp(3px, .45vw, 6px) solid rgba(255,255,255,.14); position: relative; overflow: hidden; box-shadow: inset 0 6px 10px rgba(0,0,0,.26); }.gm .cell::before{ content: \"\"; position: absolute; inset: 7%; border-radius: 50%; background: #0B1220; }.gm .cell.disc-red::before,.gm .cell.disc-yellow::before{ animation: dropIn .28s cubic-bezier(.2,.8,.3,1.25); }.gm .cell.disc-red::before{ background: var(--red); box-shadow: inset 0 -7px 0 var(--red-dark), inset 0 4px 0 rgba(255,255,255,.20); }.gm .cell.disc-yellow::before{ background: var(--yellow); box-shadow: inset 0 -7px 0 var(--yellow-dark), inset 0 4px 0 rgba(255,255,255,.22); }.gm .cell.is-winning::after{ content: \"\"; position: absolute; inset: 13%; border-radius: 50%; border: 4px solid white; box-shadow: 0 0 0 4px rgba(255,255,255,.2); animation: pulseWin .8s ease-in-out infinite alternate; }.gm .board-base{ width: 92%; height: 22px; margin: -2px auto 0; border-radius: 0 0 18px 18px; background: #233D95; box-shadow: 0 14px 24px rgba(0,0,0,.24); position: relative; z-index: 1; }@keyframes dropIn{ from { transform: translateY(-120%); opacity: .3; } to { transform: translateY(0); opacity: 1; } }@keyframes pulseWin{ from { opacity: .55; transform: scale(.95); } to { opacity: 1; transform: scale(1.04); } }.gm .game-actions{ display: flex; justify-content: center; gap: 12px; margin-top: 22px; flex-wrap: wrap; }.gm .keyboard-hint{ margin: 16px 0 0; text-align: center; color: var(--muted); font-size: 14px; }.gm kbd{ display: inline-block; min-width: 24px; padding: 1px 6px; border: 1px solid #D0D5DD; border-bottom-width: 2px; border-radius: 5px; background: #fff; color: var(--text); font-size: 12px; font-weight: 800; }.gm .steps-list,.gm .check-list{ margin: 22px 0; padding-left: 24px; }.gm .steps-list li,.gm .check-list li{ margin: 8px 0; padding-left: 4px; }.gm .tips-card{ background: #fff; border: 1px solid var(--border); border-radius: 18px; padding: 24px; box-shadow: 0 10px 30px rgba(23,27,45,.06); }.gm .tips-card ul{ margin: 0; padding-left: 21px; }.gm .tips-card li{ margin: 9px 0; color: #515A6B; }.gm details{ background: #fff; border: 1px solid var(--border); border-radius: 14px; padding: 0 18px; margin-top: 12px; }.gm summary{ cursor: pointer; list-style: none; font-weight: 800; padding: 18px 32px 18px 0; position: relative; }.gm summary::-webkit-details-marker{ display: none; }.gm summary::after{ content: \"+\"; position: absolute; right: 0; top: 14px; font-size: 24px; color: var(--brand); }.gm details[open] summary::after{ content: \"\u2212\"; }.gm details p{ margin-top: 0; padding-bottom: 18px; }.gm .modal[hidden]{ display: none; }.gm .modal{ position: fixed; inset: 0; z-index: 100; display: grid; place-items: center; padding: 20px; }.gm .modal__backdrop{ position: absolute; inset: 0; background: rgba(17,24,39,.66); backdrop-filter: blur(5px); }.gm .modal__dialog{ position: relative; width: min(420px, 100%); background: #fff; border-radius: 20px; padding: 30px; text-align: center; box-shadow: 0 30px 80px rgba(0,0,0,.25); }.gm .result-icon{ width: 66px; height: 66px; border-radius: 18px; display: grid; place-items: center; margin: 0 auto 16px; background: rgba(255,184,77,.18); font-size: 34px; }.gm .modal__dialog h2{ font-size: 30px; margin-bottom: 8px; }.gm .modal__dialog p{ color: var(--muted); margin: 0; }.gm .modal__actions{ display: flex; gap: 10px; justify-content: center; margin-top: 24px; }@media (max-width: 820px){.gm .status-grid{ grid-template-columns: 1fr 1fr; }.gm .turn-panel{ grid-column: 1 / -1; grid-row: 1; min-height: 72px; }}@media (max-width: 620px){.gm .game-section{ padding-bottom: 52px; }.gm .game-shell{ padding: 14px; border-radius: 17px; }.gm .game-toolbar{ align-items: stretch; flex-direction: column; }.gm .mode-switch{ width: 100%; }.gm .mode-btn{ flex: 1; padding-inline: 10px; }.gm .secondary-btn{ width: 100%; }.gm .status-grid{ gap: 9px; }.gm .player-card,.gm .turn-panel{ min-height: 74px; padding: 11px 12px; border-radius: 13px; }.gm .player-disc{ width: 30px; }.gm .player-card strong{ font-size: 22px; }.gm .turn-panel strong{ font-size: 19px; }.gm .board-wrap{ padding: 48px 10px 20px; border-radius: 16px; }.gm .column-controls{ left: 10px; right: 10px; top: 8px; height: 36px; gap: 3px; }.gm .column-btn{ font-size: 12px; }.gm .board{ gap: 5px; padding: 8px; border-radius: 13px 13px 10px 10px; }.gm .cell{ border-width: 3px; }.gm .cell.disc-red::before{ box-shadow: inset 0 -4px 0 var(--red-dark), inset 0 3px 0 rgba(255,255,255,.2); }.gm .cell.disc-yellow::before{ box-shadow: inset 0 -4px 0 var(--yellow-dark), inset 0 3px 0 rgba(255,255,255,.22); }.gm .board-base{ height: 16px; border-radius: 0 0 12px 12px; }.gm .keyboard-hint{ display: none; }.gm .modal__dialog{ padding: 24px 18px; }}@media (prefers-reduced-motion: reduce){.gm *,.gm *::before,.gm *::after{ animation-duration: .01ms !important; animation-iteration-count: 1 !important; transition-duration: .01ms !important; scroll-behavior: auto !important; }}";
function __ready(f){f()}
function boot(){
(() => {
  'use strict';

  const ROWS = 6;
  const COLS = 7;
  const EMPTY = 0;
  const PLAYER_ONE = 1;
  const PLAYER_TWO = 2;

  const boardEl = document.getElementById('board');
  const columnControlsEl = document.getElementById('columnControls');
  const statusTextEl = document.getElementById('statusText');
  const roundTextEl = document.getElementById('roundText');
  const playerOneScoreEl = document.getElementById('playerOneScore');
  const playerTwoScoreEl = document.getElementById('playerTwoScore');
  const playerTwoLabelEl = document.getElementById('playerTwoLabel');
  const playerOneCardEl = document.getElementById('playerOneCard');
  const playerTwoCardEl = document.getElementById('playerTwoCard');
  const newGameBtn = document.getElementById('newGameBtn');
  const restartRoundBtn = document.getElementById('restartRoundBtn');
  const resetScoreBtn = document.getElementById('resetScoreBtn');
  const modeButtons = [...document.querySelectorAll('.mode-btn')];
  const resultModal = document.getElementById('resultModal');
  const resultTitle = document.getElementById('resultTitle');
  const resultMessage = document.getElementById('resultMessage');
  const resultIcon = document.getElementById('resultIcon');
  const playAgainBtn = document.getElementById('playAgainBtn');
  const closeModalBtn = document.getElementById('closeModalBtn');

  let board = createEmptyBoard();
  let currentPlayer = PLAYER_ONE;
  let gameMode = 'cpu';
  let isGameOver = false;
  let isCpuThinking = false;
  let selectedColumn = 3;
  let round = 1;
  let scores = { [PLAYER_ONE]: 0, [PLAYER_TWO]: 0 };
  let cpuTimer = null;

  function createEmptyBoard() {
    return Array.from({ length: ROWS }, () => Array(COLS).fill(EMPTY));
  }

  function initialize() {
    renderBoard();
    renderColumnControls();
    bindEvents();
    updateUI();
  }

  function renderBoard() {
    boardEl.innerHTML = '';
    for (let row = 0; row < ROWS; row += 1) {
      for (let col = 0; col < COLS; col += 1) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.dataset.row = String(row);
        cell.dataset.col = String(col);
        cell.setAttribute('role', 'gridcell');
        cell.setAttribute('aria-label', `Row ${row + 1}, column ${col + 1}, empty`);
        boardEl.appendChild(cell);
      }
    }
  }

  function renderColumnControls() {
    columnControlsEl.innerHTML = '';
    for (let col = 0; col < COLS; col += 1) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'column-btn';
      btn.dataset.col = String(col);
      btn.setAttribute('aria-label', `Drop disc in column ${col + 1}`);
      btn.textContent = String(col + 1);
      columnControlsEl.appendChild(btn);
    }
  }

  function bindEvents() {
    columnControlsEl.addEventListener('click', (event) => {
      const button = event.target.closest('.column-btn');
      if (!button) return;
      attemptMove(Number(button.dataset.col));
    });

    modeButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const nextMode = button.dataset.mode;
        if (!nextMode || nextMode === gameMode) return;
        gameMode = nextMode;
        startNewGame();
      });
    });

    newGameBtn.addEventListener('click', startNewGame);
    restartRoundBtn.addEventListener('click', restartRound);
    resetScoreBtn.addEventListener('click', () => {
      scores = { [PLAYER_ONE]: 0, [PLAYER_TWO]: 0 };
      round = 1;
      restartRound(false);
    });

    playAgainBtn.addEventListener('click', () => {
      hideModal();
      restartRound(true);
    });
    closeModalBtn.addEventListener('click', hideModal);
    resultModal.addEventListener('click', (event) => {
      if (event.target.dataset.closeModal === 'true') hideModal();
    });

    document.addEventListener('keydown', handleKeyboard);
  }

  function handleKeyboard(event) {
    if (!resultModal.hidden) {
      if (event.key === 'Escape') hideModal();
      return;
    }
    if (isGameOver || isCpuThinking || (gameMode === 'cpu' && currentPlayer === PLAYER_TWO)) return;

    if (/^[1-7]$/.test(event.key)) {
      attemptMove(Number(event.key) - 1);
      return;
    }

    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      selectedColumn = (selectedColumn + COLS - 1) % COLS;
      updateColumnSelection();
      return;
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault();
      selectedColumn = (selectedColumn + 1) % COLS;
      updateColumnSelection();
      return;
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      attemptMove(selectedColumn);
    }
  }

  function attemptMove(col) {
    if (isGameOver || isCpuThinking) return;
    if (gameMode === 'cpu' && currentPlayer === PLAYER_TWO) return;
    if (!Number.isInteger(col) || col < 0 || col >= COLS) return;

    const row = getOpenRow(board, col);
    if (row === -1) return;

    selectedColumn = col;
    makeMove(row, col, currentPlayer);
  }

  function makeMove(row, col, player) {
    board[row][col] = player;
    paintCell(row, col, player);

    const winCells = getWinningCells(board, row, col, player);
    if (winCells.length >= 4) {
      finishWin(player, winCells);
      return;
    }

    if (isBoardFull(board)) {
      finishDraw();
      return;
    }

    currentPlayer = player === PLAYER_ONE ? PLAYER_TWO : PLAYER_ONE;
    updateUI();

    if (gameMode === 'cpu' && currentPlayer === PLAYER_TWO) {
      scheduleCpuMove();
    }
  }

  function paintCell(row, col, player) {
    const index = row * COLS + col;
    const cell = boardEl.children[index];
    if (!cell) return;
    cell.classList.add(player === PLAYER_ONE ? 'disc-red' : 'disc-yellow');
    cell.setAttribute('aria-label', `Row ${row + 1}, column ${col + 1}, ${player === PLAYER_ONE ? 'red' : 'yellow'} disc`);
  }

  function scheduleCpuMove() {
    isCpuThinking = true;
    updateUI();
    clearTimeout(cpuTimer);
    cpuTimer = window.setTimeout(() => {
      if (isGameOver || currentPlayer !== PLAYER_TWO || gameMode !== 'cpu') {
        isCpuThinking = false;
        updateUI();
        return;
      }
      const col = chooseCpuMove();
      const row = getOpenRow(board, col);
      isCpuThinking = false;
      if (row !== -1) makeMove(row, col, PLAYER_TWO);
    }, 420);
  }

  function chooseCpuMove() {
    const validCols = getValidColumns(board);
    if (!validCols.length) return 0;

    const winningMove = findImmediateMove(PLAYER_TWO);
    if (winningMove !== -1) return winningMove;

    const blockingMove = findImmediateMove(PLAYER_ONE);
    if (blockingMove !== -1) return blockingMove;

    const scored = validCols.map((col) => ({ col, score: scoreMove(col) }));
    const maxScore = Math.max(...scored.map((item) => item.score));
    const topMoves = scored.filter((item) => item.score === maxScore);
    return topMoves[Math.floor(Math.random() * topMoves.length)].col;
  }

  function findImmediateMove(player) {
    for (const col of getValidColumns(board)) {
      const row = getOpenRow(board, col);
      board[row][col] = player;
      const wins = getWinningCells(board, row, col, player).length >= 4;
      board[row][col] = EMPTY;
      if (wins) return col;
    }
    return -1;
  }

  function scoreMove(col) {
    const row = getOpenRow(board, col);
    if (row === -1) return -Infinity;

    let score = 0;
    score += [3, 4, 5, 7, 5, 4, 3][col];
    score += (ROWS - row) * 0.2;

    board[row][col] = PLAYER_TWO;
    score += evaluatePosition(board, PLAYER_TWO) * 1.0;
    board[row][col] = EMPTY;

    board[row][col] = PLAYER_ONE;
    score += evaluatePosition(board, PLAYER_ONE) * 0.45;
    board[row][col] = EMPTY;

    return score;
  }

  function evaluatePosition(state, player) {
    let score = 0;
    const windows = [];

    for (let row = 0; row < ROWS; row += 1) {
      for (let col = 0; col <= COLS - 4; col += 1) {
        windows.push([state[row][col], state[row][col+1], state[row][col+2], state[row][col+3]]);
      }
    }
    for (let col = 0; col < COLS; col += 1) {
      for (let row = 0; row <= ROWS - 4; row += 1) {
        windows.push([state[row][col], state[row+1][col], state[row+2][col], state[row+3][col]]);
      }
    }
    for (let row = 0; row <= ROWS - 4; row += 1) {
      for (let col = 0; col <= COLS - 4; col += 1) {
        windows.push([state[row][col], state[row+1][col+1], state[row+2][col+2], state[row+3][col+3]]);
      }
    }
    for (let row = 3; row < ROWS; row += 1) {
      for (let col = 0; col <= COLS - 4; col += 1) {
        windows.push([state[row][col], state[row-1][col+1], state[row-2][col+2], state[row-3][col+3]]);
      }
    }

    for (const window of windows) {
      const own = window.filter((value) => value === player).length;
      const empty = window.filter((value) => value === EMPTY).length;
      if (own === 3 && empty === 1) score += 14;
      else if (own === 2 && empty === 2) score += 4;
      else if (own === 1 && empty === 3) score += 1;
    }
    return score;
  }

  function getOpenRow(state, col) {
    for (let row = ROWS - 1; row >= 0; row -= 1) {
      if (state[row][col] === EMPTY) return row;
    }
    return -1;
  }

  function getValidColumns(state) {
    return Array.from({ length: COLS }, (_, col) => col).filter((col) => state[0][col] === EMPTY);
  }

  function getWinningCells(state, row, col, player) {
    const directions = [
      [0, 1],
      [1, 0],
      [1, 1],
      [1, -1]
    ];

    for (const [dr, dc] of directions) {
      const line = [[row, col]];
      collectDirection(state, row, col, dr, dc, player, line);
      collectDirection(state, row, col, -dr, -dc, player, line);
      if (line.length >= 4) return line;
    }
    return [];
  }

  function collectDirection(state, row, col, dr, dc, player, line) {
    let r = row + dr;
    let c = col + dc;
    while (r >= 0 && r < ROWS && c >= 0 && c < COLS && state[r][c] === player) {
      line.push([r, c]);
      r += dr;
      c += dc;
    }
  }

  function isBoardFull(state) {
    return state[0].every((cell) => cell !== EMPTY);
  }

  function finishWin(player, winCells) {
    isGameOver = true;
    scores[player] += 1;
    highlightWinningCells(winCells);
    updateUI();

    const playerName = getPlayerName(player);
    window.setTimeout(() => {
      resultIcon.textContent = player === PLAYER_ONE ? '🔴' : '🟡';
      resultTitle.textContent = `${playerName} wins!`;
      resultMessage.textContent = 'Four connected discs completed the line.';
      showModal();
    }, 420);
  }

  function finishDraw() {
    isGameOver = true;
    updateUI();
    window.setTimeout(() => {
      resultIcon.textContent = '🤝';
      resultTitle.textContent = 'It’s a draw';
      resultMessage.textContent = 'The board is full with no four-disc connection.';
      showModal();
    }, 260);
  }

  function highlightWinningCells(cells) {
    cells.forEach(([row, col]) => {
      const cell = boardEl.children[row * COLS + col];
      if (cell) cell.classList.add('is-winning');
    });
  }

  function getPlayerName(player) {
    if (player === PLAYER_ONE) return 'Player 1';
    return gameMode === 'cpu' ? 'Computer' : 'Player 2';
  }

  function updateUI() {
    playerOneScoreEl.textContent = String(scores[PLAYER_ONE]);
    playerTwoScoreEl.textContent = String(scores[PLAYER_TWO]);
    playerTwoLabelEl.textContent = gameMode === 'cpu' ? 'Computer' : 'Player 2';
    roundTextEl.textContent = `Round ${round}`;

    modeButtons.forEach((button) => {
      const active = button.dataset.mode === gameMode;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });

    playerOneCardEl.classList.toggle('is-active', !isGameOver && currentPlayer === PLAYER_ONE && !isCpuThinking);
    playerTwoCardEl.classList.toggle('is-active', !isGameOver && currentPlayer === PLAYER_TWO);

    if (isGameOver) {
      statusTextEl.textContent = 'Round complete';
    } else if (isCpuThinking) {
      statusTextEl.textContent = 'Computer thinking…';
    } else if (currentPlayer === PLAYER_ONE) {
      statusTextEl.textContent = gameMode === 'cpu' ? 'Your move' : 'Player 1 turn';
    } else {
      statusTextEl.textContent = gameMode === 'cpu' ? 'Computer turn' : 'Player 2 turn';
    }

    [...columnControlsEl.children].forEach((button, col) => {
      const disabled = isGameOver || isCpuThinking || board[0][col] !== EMPTY || (gameMode === 'cpu' && currentPlayer === PLAYER_TWO);
      button.disabled = disabled;
      button.classList.toggle('is-selected', col === selectedColumn && !disabled);
    });
  }

  function updateColumnSelection() {
    [...columnControlsEl.children].forEach((button, col) => {
      button.classList.toggle('is-selected', col === selectedColumn && !button.disabled);
    });
  }

  function clearBoardVisuals() {
    [...boardEl.children].forEach((cell) => {
      cell.className = 'cell';
      const row = Number(cell.dataset.row);
      const col = Number(cell.dataset.col);
      cell.setAttribute('aria-label', `Row ${row + 1}, column ${col + 1}, empty`);
    });
  }

  function restartRound(incrementRound = false) {
    clearTimeout(cpuTimer);
    cpuTimer = null;
    if (incrementRound) round += 1;
    board = createEmptyBoard();
    currentPlayer = PLAYER_ONE;
    isGameOver = false;
    isCpuThinking = false;
    selectedColumn = 3;
    clearBoardVisuals();
    hideModal();
    updateUI();
  }

  function startNewGame() {
    scores = { [PLAYER_ONE]: 0, [PLAYER_TWO]: 0 };
    round = 1;
    restartRound(false);
  }

  function showModal() {
    resultModal.hidden = false;
    document.body.style.overflow = 'hidden';
    playAgainBtn.focus();
  }

  function hideModal() {
    resultModal.hidden = true;
    document.body.style.overflow = '';
  }

  initialize();
})();


}
function begin(){poster.hidden=true;gm.hidden=false;if(!booted){booted=true;var s=document.createElement("style");s.textContent=LOOK;document.head.appendChild(s);boot();}else{var r=document.getElementById("newGameBtn");if(r)r.click();}}
poster.addEventListener("click",begin);
var nb=document.getElementById("new");if(nb)nb.addEventListener("click",begin);
})();
