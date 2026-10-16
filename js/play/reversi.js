/* Reversi - game logic + its own look. Layout lives in style.css; page shell lives in the HTML. */
(function(){"use strict";
var gm=document.getElementById("gm"),poster=document.getElementById("poster"),booted=false;
var LOOK=".gm{\n  \n  \n  --accent: #16b8c4;\n  --action: #ffb84d;\n  --success: #22c55e;\n  --danger: #ef5b5b;\n  --page: #f6f7fb;\n  \n  \n  \n  \n  --board: #13795b;\n  --board-dark: #0d5f47;\n  --board-line: rgba(5, 49, 37, 0.65);\n  \n}.gm *{ box-sizing: border-box; }.gm button,.gm select{ font: inherit; }.gm .page-shell{\n  width: min(100% - 40px, 1160px);\n  margin-inline: auto;\n}.gm .all-games-link{\n  font-weight: 700;\n  text-decoration: none;\n}.gm h2,.gm h3,.gm p{ margin-top: 0; }.gm h2{ margin-bottom: 18px; font-size: clamp(28px, 4vw, 36px); line-height: 1.2; letter-spacing: -0.025em; }.gm h3{ margin-bottom: 8px; font-size: 21px; line-height: 1.3; }.gm .game-card{\n  max-width: 850px;\n  margin: 0 auto 76px;\n  padding: 24px;\n  overflow: hidden;\n  border: 1px solid var(--border);\n  border-radius: 20px;\n  background: var(--card);\n  box-shadow: var(--shadow);\n}.gm .game-toolbar,.gm .scoreboard,.gm .game-actions{\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 18px;\n}.gm .game-label,.gm .difficulty-control span,.gm .turn-kicker{\n  display: block;\n  margin: 0 0 3px;\n  color: var(--muted);\n  font-size: 13px;\n  font-weight: 700;\n  line-height: 1.3;\n}.gm .player-color{ display: flex; align-items: center; gap: 8px; margin: 0; font-weight: 800; line-height: 1.3; }.gm .difficulty-control{ display: flex; align-items: center; gap: 10px; }.gm .difficulty-control span{ margin: 0; }.gm select{\n  min-height: 44px;\n  padding: 0 34px 0 13px;\n  border: 1px solid #cfd3df;\n  border-radius: 10px;\n  background: #fff;\n  color: var(--text);\n  font-weight: 700;\n}.gm .scoreboard{\n  margin: 22px 0;\n  padding: 14px;\n  border-radius: 16px;\n  background: #f1f3f8;\n}.gm .score-box{\n  min-width: 170px;\n  display: grid;\n  grid-template-columns: auto 1fr auto;\n  align-items: center;\n  gap: 9px;\n  padding: 11px 13px;\n  border: 2px solid transparent;\n  border-radius: 12px;\n  background: #fff;\n}.gm .score-box.active{ border-color: var(--action); }.gm .score-box strong{ font-size: 24px; line-height: 1; }.gm .score-name{ font-weight: 700; }.gm .turn-panel{ flex: 1; text-align: center; }.gm .turn-panel strong{ display: block; font-size: 18px; line-height: 1.25; }.gm .mini-disc{\n  width: 20px;\n  aspect-ratio: 1;\n  display: inline-block;\n  flex: 0 0 auto;\n  border-radius: 50%;\n  box-shadow: inset 0 -2px 4px rgba(0, 0, 0, 0.25), 0 1px 2px rgba(0, 0, 0, 0.2);\n}.gm .mini-disc.black{ background: #111827; }.gm .mini-disc.white{ border: 1px solid #d3d7df; background: #fff; }.gm .board-wrap{\n  position: relative;\n  width: min(100%, 630px);\n  margin: 34px auto 28px;\n  padding: 0 0 0 25px;\n}.gm .board{\n  aspect-ratio: 1;\n  display: grid;\n  grid-template-columns: repeat(8, 1fr);\n  overflow: hidden;\n  border: 8px solid var(--board-dark);\n  border-radius: 16px;\n  background: var(--board-dark);\n  box-shadow: 0 16px 32px rgba(13, 95, 71, 0.24);\n  touch-action: manipulation;\n}.gm .cell{\n  position: relative;\n  min-width: 0;\n  padding: 0;\n  border: 0;\n  border-right: 1px solid var(--board-line);\n  border-bottom: 1px solid var(--board-line);\n  border-radius: 0;\n  background: var(--board);\n  cursor: default;\n}.gm .cell:nth-child(8n){ border-right: 0; }.gm .cell:nth-child(n + 57){ border-bottom: 0; }.gm .cell:focus-visible{ z-index: 3; outline: 4px solid var(--action); outline-offset: -5px; }.gm .cell.legal{ cursor: pointer; }.gm .cell.legal::after{\n  content: \"\";\n  position: absolute;\n  width: 23%;\n  aspect-ratio: 1;\n  left: 50%;\n  top: 50%;\n  border-radius: 50%;\n  background: rgba(255, 255, 255, 0.48);\n  transform: translate(-50%, -50%);\n  transition: transform 150ms ease, background 150ms ease;\n}.gm .cell.legal:hover::after,.gm .cell.legal:focus-visible::after{ background: var(--action); transform: translate(-50%, -50%) scale(1.25); }.gm .board.hints-hidden .cell.legal::after{ opacity: 0; }.gm .disc{\n  position: absolute;\n  inset: 11%;\n  border-radius: 50%;\n  backface-visibility: hidden;\n  box-shadow: inset 0 -5px 10px rgba(0, 0, 0, 0.28), 0 3px 6px rgba(0, 0, 0, 0.3);\n  animation: place-disc 180ms ease-out;\n}.gm .disc.black{ background: radial-gradient(circle at 35% 28%, #374151, #111827 62%); }.gm .disc.white{ border: 1px solid #d6d8dd; background: radial-gradient(circle at 35% 28%, #fff, #e8e9ed 68%); }@keyframes place-disc{\n  from { opacity: 0.25; transform: scale(0.45); }\n  to { opacity: 1; transform: scale(1); }\n}.gm .board-coordinates{ position: absolute; display: grid; color: var(--muted); font-size: 11px; font-weight: 800; line-height: 1; }.gm .board-coordinates.top{ top: -19px; left: 33px; right: 8px; grid-template-columns: repeat(8, 1fr); text-align: center; }.gm .board-coordinates.side{ top: 8px; bottom: 8px; left: 0; width: 17px; grid-template-rows: repeat(8, 1fr); align-items: center; text-align: center; }.gm .game-actions{ justify-content: center; }.gm .primary-button,.gm .secondary-button{\n  min-height: 48px;\n  padding: 0 22px;\n  border-radius: 12px;\n  font-size: 16px;\n  font-weight: 800;\n  cursor: pointer;\n  transition: transform 140ms ease, background 140ms ease, border-color 140ms ease;\n}.gm .primary-button{ border: 1px solid var(--brand); background: var(--brand); color: #fff; }.gm .primary-button:hover{ border-color: var(--brand-dark); background: var(--brand-dark); transform: translateY(-1px); }.gm .secondary-button{ border: 1px solid #cfd3df; background: #fff; color: var(--text); }.gm .secondary-button:hover{ border-color: var(--brand); color: var(--brand-dark); }.gm .primary-button:focus-visible,.gm .secondary-button:focus-visible,.gm select:focus-visible,.gm summary:focus-visible{ outline: 3px solid rgba(91, 92, 226, 0.28); outline-offset: 3px; }.gm .control-note{ margin: 17px 0 0; color: var(--muted); font-size: 14px; text-align: center; }.gm .result-panel{\n  margin-top: 22px;\n  padding: 18px;\n  display: grid;\n  grid-template-columns: auto 1fr auto;\n  align-items: center;\n  gap: 15px;\n  border: 1px solid #b8e8cf;\n  border-radius: 14px;\n  background: #effbf4;\n}.gm .result-panel[hidden]{ display: none; }.gm .result-icon{ width: 42px; height: 42px; display: grid; place-items: center; border-radius: 50%; background: var(--board); color: #fff; font-size: 25px; }.gm .result-panel h3,.gm .result-panel p{ margin: 0; }.gm .result-panel p{ color: var(--muted); font-size: 15px; }.gm .section-heading{ max-width: 700px; }.gm .steps-grid{\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 20px;\n  margin-top: 30px;\n}.gm .steps-grid article,.gm .strategy-card{\n  padding: 22px;\n  border: 1px solid var(--border);\n  border-radius: 16px;\n  background: var(--card);\n}.gm .steps-grid article > span{\n  width: 34px;\n  height: 34px;\n  display: grid;\n  place-items: center;\n  margin-bottom: 14px;\n  border-radius: 10px;\n  background: #e9eafe;\n  color: var(--brand-dark);\n  font-weight: 800;\n}.gm .steps-grid p,.gm .strategy-card li{ margin: 0; color: var(--muted); font-size: 16px; }.gm .rules-callout{ margin-top: 24px; padding: 22px 24px; border-left: 5px solid var(--action); border-radius: 4px 14px 14px 4px; background: #fff8e9; }.gm .rules-callout p{ margin: 0; color: #5b5141; }.gm .strategy-card{ background: #f1faf6; border-color: #cce8db; }.gm .strategy-card ul{ margin: 12px 0 0; padding-left: 20px; }.gm .strategy-card li + li{ margin-top: 10px; }.gm .row-heading{ max-width: none; display: flex; align-items: end; justify-content: space-between; gap: 20px; }.gm .row-heading h2{ margin-bottom: 0; }.gm .row-heading > a{ margin-bottom: 5px; font-weight: 800; }.gm .game-symbol{ width: 50px; height: 50px; display: grid; place-items: center; flex: 0 0 auto; border-radius: 14px; background: #e9eafe; color: var(--brand-dark); font-size: 28px; font-weight: 800; }.gm details{ border-top: 1px solid var(--border); }.gm details:last-child{ border-bottom: 1px solid var(--border); }.gm summary{ padding: 20px 4px; font-size: 18px; font-weight: 800; cursor: pointer; }.gm details p{ padding: 0 34px 20px 4px; color: var(--muted); }.gm .sr-only{ position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0; }@media (max-width: 760px){.gm .page-shell{ width: min(100% - 28px, 1160px); }.gm .game-card{ padding: 16px; margin-bottom: 60px; border-radius: 18px; }.gm .scoreboard{ gap: 8px; padding: 10px; }.gm .score-box{ min-width: 0; grid-template-columns: auto auto; gap: 6px; padding: 9px; }.gm .score-name{ grid-column: 1 / -1; grid-row: 2; font-size: 12px; line-height: 1; }.gm .score-box strong{ font-size: 21px; }.gm .turn-panel strong{ font-size: 15px; }.gm .turn-kicker{ font-size: 11px; }.gm .board-wrap{ margin-top: 32px; padding-left: 20px; }.gm .board{ border-width: 5px; border-radius: 12px; }.gm .board-coordinates.top{ left: 25px; right: 5px; }.gm .board-coordinates.side{ top: 5px; bottom: 5px; }.gm .disc{ inset: 10%; }.gm .steps-grid{ grid-template-columns: 1fr; }.gm .steps-grid{ gap: 14px; }.gm .result-panel{ grid-template-columns: auto 1fr; }.gm .result-panel .primary-button{ grid-column: 1 / -1; width: 100%; }}@media (max-width: 480px){.gm .all-games-link{ font-size: 15px; }.gm .game-toolbar{ align-items: end; }.gm .difficulty-control{ display: block; }.gm .difficulty-control span{ margin-bottom: 3px; }.gm select{ min-height: 42px; }.gm .mini-disc{ width: 17px; }.gm .game-actions{ flex-direction: column; }.gm .game-actions button{ width: 100%; }.gm .row-heading{ align-items: start; flex-direction: column; }}@media (prefers-reduced-motion: reduce){.gm *,.gm *::before,.gm *::after{ scroll-behavior: auto !important; animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; }}";
function __ready(f){f()}
function boot(){
"use strict";

const EMPTY = 0;
const BLACK = 1;
const WHITE = 2;
const SIZE = 8;
const DIRECTIONS = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],             [0, 1],
  [1, -1],  [1, 0],   [1, 1]
];

const POSITION_WEIGHTS = [
  [120, -30, 20, 5, 5, 20, -30, 120],
  [-30, -45, -5, -5, -5, -5, -45, -30],
  [20, -5, 15, 3, 3, 15, -5, 20],
  [5, -5, 3, 3, 3, 3, -5, 5],
  [5, -5, 3, 3, 3, 3, -5, 5],
  [20, -5, 15, 3, 3, 15, -5, 20],
  [-30, -45, -5, -5, -5, -5, -45, -30],
  [120, -30, 20, 5, 5, 20, -30, 120]
];

const boardElement = document.getElementById("board");
const blackScoreElement = document.getElementById("black-score");
const whiteScoreElement = document.getElementById("white-score");
const blackScoreBox = document.getElementById("black-score-box");
const whiteScoreBox = document.getElementById("white-score-box");
const statusElement = document.getElementById("status");
const difficultyElement = document.getElementById("difficulty");
const newGameButton = document.getElementById("new-game");
const hintButton = document.getElementById("toggle-hints");
const playAgainButton = document.getElementById("play-again");
const resultPanel = document.getElementById("result-panel");
const resultTitle = document.getElementById("result-title");
const resultMessage = document.getElementById("result-message");
const resultIcon = document.getElementById("result-icon");

let board = [];
let currentPlayer = BLACK;
let gameOver = false;
let computerThinking = false;
let showHints = true;
let focusedIndex = 0;
let computerTimer = null;

function createEmptyBoard() {
  return Array.from({ length: SIZE }, () => Array(SIZE).fill(EMPTY));
}

function startGame() {
  if (computerTimer !== null) {
    window.clearTimeout(computerTimer);
    computerTimer = null;
  }

  board = createEmptyBoard();
  board[3][3] = WHITE;
  board[3][4] = BLACK;
  board[4][3] = BLACK;
  board[4][4] = WHITE;
  currentPlayer = BLACK;
  gameOver = false;
  computerThinking = false;
  focusedIndex = 19;
  resultPanel.hidden = true;
  render();
  focusFirstLegalMove(false);
}

function isInside(row, col) {
  return row >= 0 && row < SIZE && col >= 0 && col < SIZE;
}

function opponentOf(player) {
  return player === BLACK ? WHITE : BLACK;
}

function getFlips(state, row, col, player) {
  if (!isInside(row, col) || state[row][col] !== EMPTY) return [];

  const opponent = opponentOf(player);
  const allFlips = [];

  for (const [rowStep, colStep] of DIRECTIONS) {
    let nextRow = row + rowStep;
    let nextCol = col + colStep;
    const line = [];

    while (isInside(nextRow, nextCol) && state[nextRow][nextCol] === opponent) {
      line.push([nextRow, nextCol]);
      nextRow += rowStep;
      nextCol += colStep;
    }

    if (line.length > 0 && isInside(nextRow, nextCol) && state[nextRow][nextCol] === player) {
      allFlips.push(...line);
    }
  }

  return allFlips;
}

function getValidMoves(state, player) {
  const moves = [];
  for (let row = 0; row < SIZE; row += 1) {
    for (let col = 0; col < SIZE; col += 1) {
      const flips = getFlips(state, row, col, player);
      if (flips.length > 0) moves.push({ row, col, flips });
    }
  }
  return moves;
}

function applyMove(state, move, player) {
  state[move.row][move.col] = player;
  for (const [row, col] of move.flips) state[row][col] = player;
}

function cloneBoard(state) {
  return state.map((row) => row.slice());
}

function handleCellSelection(row, col) {
  if (gameOver || computerThinking || currentPlayer !== BLACK) return;
  const flips = getFlips(board, row, col, BLACK);
  if (flips.length === 0) return;

  applyMove(board, { row, col, flips }, BLACK);
  currentPlayer = WHITE;
  render();
  continueGame();
}

function continueGame() {
  if (isBoardFull(board)) {
    finishGame();
    return;
  }

  const moves = getValidMoves(board, currentPlayer);
  if (moves.length > 0) {
    if (currentPlayer === WHITE) scheduleComputerMove();
    else {
      computerThinking = false;
      render();
      focusFirstLegalMove(false);
    }
    return;
  }

  const skippedPlayer = currentPlayer;
  currentPlayer = opponentOf(currentPlayer);
  const nextMoves = getValidMoves(board, currentPlayer);

  if (nextMoves.length === 0) {
    finishGame();
    return;
  }

  computerThinking = currentPlayer === WHITE;
  render(skippedPlayer === BLACK ? "No legal move. Your turn was passed." : "Computer had no legal move. Your turn.");

  if (currentPlayer === WHITE) scheduleComputerMove(700);
  else focusFirstLegalMove(false);
}

function scheduleComputerMove(delay = 520) {
  computerThinking = true;
  render("Computer is thinking…");
  computerTimer = window.setTimeout(() => {
    computerTimer = null;
    if (gameOver || currentPlayer !== WHITE) return;
    const moves = getValidMoves(board, WHITE);
    if (moves.length === 0) {
      computerThinking = false;
      continueGame();
      return;
    }
    const move = chooseComputerMove(moves);
    applyMove(board, move, WHITE);
    computerThinking = false;
    currentPlayer = BLACK;
    render();
    continueGame();
  }, delay);
}

function chooseComputerMove(moves) {
  const difficulty = difficultyElement.value;
  if (difficulty === "easy") return moves[Math.floor(Math.random() * moves.length)];

  const scoredMoves = moves.map((move) => ({
    move,
    score: evaluateMove(move, difficulty)
  }));
  scoredMoves.sort((a, b) => b.score - a.score);

  if (difficulty === "medium" && scoredMoves.length > 1 && Math.random() < 0.25) {
    return scoredMoves[Math.min(1, scoredMoves.length - 1)].move;
  }
  return scoredMoves[0].move;
}

function evaluateMove(move, difficulty) {
  const simulated = cloneBoard(board);
  applyMove(simulated, move, WHITE);
  const positional = POSITION_WEIGHTS[move.row][move.col];
  const flipValue = move.flips.length * 2;
  const opponentMobility = getValidMoves(simulated, BLACK).length;
  let score = positional + flipValue - opponentMobility * (difficulty === "hard" ? 5 : 2);

  if (difficulty === "hard") {
    const replies = getValidMoves(simulated, BLACK);
    if (replies.length > 0) {
      let worstReply = -Infinity;
      for (const reply of replies) {
        const replyScore = POSITION_WEIGHTS[reply.row][reply.col] + reply.flips.length * 2;
        worstReply = Math.max(worstReply, replyScore);
      }
      score -= worstReply * 0.65;
    }
    score += countStableEdges(simulated, WHITE) * 4;
  }

  return score + Math.random() * 0.15;
}

function countStableEdges(state, player) {
  const corners = [[0, 0], [0, 7], [7, 0], [7, 7]];
  let count = 0;
  for (const [row, col] of corners) {
    if (state[row][col] === player) count += 1;
  }
  return count;
}

function isBoardFull(state) {
  return state.every((row) => row.every((cell) => cell !== EMPTY));
}

function countDiscs(state) {
  let black = 0;
  let white = 0;
  for (const row of state) {
    for (const cell of row) {
      if (cell === BLACK) black += 1;
      if (cell === WHITE) white += 1;
    }
  }
  return { black, white };
}

function finishGame() {
  gameOver = true;
  computerThinking = false;
  const scores = countDiscs(board);
  let title;
  let message;
  let icon;

  if (scores.black > scores.white) {
    title = "You win!";
    message = `Final score: You ${scores.black}, Computer ${scores.white}.`;
    icon = "★";
  } else if (scores.white > scores.black) {
    title = "Computer wins";
    message = `Final score: You ${scores.black}, Computer ${scores.white}. Try controlling the corners next time.`;
    icon = "●";
  } else {
    title = "It’s a draw";
    message = `Both players finished with ${scores.black} discs.`;
    icon = "=";
  }

  resultTitle.textContent = title;
  resultMessage.textContent = message;
  resultIcon.textContent = icon;
  resultPanel.hidden = false;
  render(title);
  playAgainButton.focus({ preventScroll: true });
}

function render(customStatus = "") {
  const validMoves = !gameOver ? getValidMoves(board, currentPlayer) : [];
  const legalKeys = new Set(validMoves.map((move) => `${move.row}-${move.col}`));
  const scores = countDiscs(board);

  boardElement.textContent = "";
  boardElement.classList.toggle("hints-hidden", !showHints);

  for (let row = 0; row < SIZE; row += 1) {
    for (let col = 0; col < SIZE; col += 1) {
      const index = row * SIZE + col;
      const cell = document.createElement("button");
      const value = board[row][col];
      const isLegal = currentPlayer === BLACK && legalKeys.has(`${row}-${col}`) && !computerThinking;

      cell.type = "button";
      cell.className = `cell${isLegal ? " legal" : ""}`;
      cell.setAttribute("role", "gridcell");
      cell.setAttribute("aria-rowindex", String(row + 1));
      cell.setAttribute("aria-colindex", String(col + 1));
      cell.setAttribute("aria-label", getCellLabel(row, col, value, isLegal));
      cell.tabIndex = index === focusedIndex ? 0 : -1;
      cell.dataset.row = String(row);
      cell.dataset.col = String(col);
      cell.addEventListener("click", () => handleCellSelection(row, col));
      cell.addEventListener("focus", () => { focusedIndex = index; });
      cell.addEventListener("keydown", handleBoardKeydown);

      if (value !== EMPTY) {
        const disc = document.createElement("span");
        disc.className = `disc ${value === BLACK ? "black" : "white"}`;
        disc.setAttribute("aria-hidden", "true");
        cell.appendChild(disc);
      }

      boardElement.appendChild(cell);
    }
  }

  blackScoreElement.textContent = String(scores.black);
  whiteScoreElement.textContent = String(scores.white);
  blackScoreBox.classList.toggle("active", !gameOver && currentPlayer === BLACK);
  whiteScoreBox.classList.toggle("active", !gameOver && currentPlayer === WHITE);

  if (customStatus) statusElement.textContent = customStatus;
  else if (gameOver) statusElement.textContent = "Game over";
  else if (computerThinking) statusElement.textContent = "Computer is thinking…";
  else statusElement.textContent = "Your turn";
}

function getCellLabel(row, col, value, isLegal) {
  const coordinate = `${String.fromCharCode(65 + col)}${row + 1}`;
  if (value === BLACK) return `${coordinate}, black disc`;
  if (value === WHITE) return `${coordinate}, white disc`;
  if (isLegal) return `${coordinate}, legal move`;
  return `${coordinate}, empty`;
}

function handleBoardKeydown(event) {
  const keyMoves = {
    ArrowUp: -SIZE,
    ArrowDown: SIZE,
    ArrowLeft: -1,
    ArrowRight: 1
  };

  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    const target = event.currentTarget;
    handleCellSelection(Number(target.dataset.row), Number(target.dataset.col));
    return;
  }

  if (!(event.key in keyMoves)) return;
  event.preventDefault();
  const currentRow = Math.floor(focusedIndex / SIZE);
  const currentCol = focusedIndex % SIZE;
  let nextRow = currentRow;
  let nextCol = currentCol;

  if (event.key === "ArrowUp") nextRow = Math.max(0, currentRow - 1);
  if (event.key === "ArrowDown") nextRow = Math.min(SIZE - 1, currentRow + 1);
  if (event.key === "ArrowLeft") nextCol = Math.max(0, currentCol - 1);
  if (event.key === "ArrowRight") nextCol = Math.min(SIZE - 1, currentCol + 1);

  focusedIndex = nextRow * SIZE + nextCol;
  const cells = boardElement.querySelectorAll(".cell");
  cells.forEach((cell, index) => { cell.tabIndex = index === focusedIndex ? 0 : -1; });
  cells[focusedIndex].focus();
}

function focusFirstLegalMove(shouldFocus = true) {
  const moves = getValidMoves(board, BLACK);
  if (moves.length === 0) return;
  focusedIndex = moves[0].row * SIZE + moves[0].col;
  const cells = boardElement.querySelectorAll(".cell");
  cells.forEach((cell, index) => { cell.tabIndex = index === focusedIndex ? 0 : -1; });
  if (shouldFocus) cells[focusedIndex].focus();
}

newGameButton.addEventListener("click", () => {
  startGame();
  focusFirstLegalMove(true);
});

playAgainButton.addEventListener("click", () => {
  startGame();
  focusFirstLegalMove(true);
});

hintButton.addEventListener("click", () => {
  showHints = !showHints;
  hintButton.setAttribute("aria-pressed", String(showHints));
  hintButton.textContent = showHints ? "Hide Move Hints" : "Show Move Hints";
  boardElement.classList.toggle("hints-hidden", !showHints);
});

difficultyElement.addEventListener("change", startGame);

startGame();


}
function begin(){poster.hidden=true;gm.hidden=false;if(!booted){booted=true;var s=document.createElement("style");s.textContent=LOOK;document.head.appendChild(s);boot();}else{var r=document.getElementById("new-game");if(r)r.click();}}
poster.addEventListener("click",begin);
var nb=document.getElementById("new");if(nb)nb.addEventListener("click",begin);
})();
