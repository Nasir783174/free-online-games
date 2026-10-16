/* Tic Tac Toe - game logic + its own look. Layout lives in style.css; page shell lives in the HTML. */
(function(){"use strict";
var gm=document.getElementById("gm"),poster=document.getElementById("poster"),booted=false;
var LOOK=".gm{\n  \n  \n  --teal: #16b8c4;\n  --amber: #ffb84d;\n  --danger: #ef5b5b;\n  \n  \n  \n  \n  \n  --game-bg: #111827;\n  --game-secondary: #1f2937;\n  \n  font-family: \"Nunito Sans\", Nunito, ui-rounded, system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif;\n  color: var(--text);\n  background: var(--bg);\n  font-synthesis: none;\n}.gm *{ box-sizing: border-box; }.gm button,.gm select{ font: inherit; }.gm button{ -webkit-tap-highlight-color: transparent; }.gm .coming-note{ color: var(--muted); font-size: 14px; font-weight: 700; }.gm h2,.gm h3,.gm p{ margin-top: 0; }.gm h2{ margin-bottom: 18px; font-size: clamp(28px, 4vw, 35px); font-weight: 800; line-height: 1.18; letter-spacing: -0.02em; }.gm h3{ margin-bottom: 4px; font-size: 21px; line-height: 1.25; }.gm .game-shell{\n  overflow: hidden;\n  max-width: 900px;\n  margin: 0 auto 76px;\n  border: 1px solid var(--border);\n  border-radius: 20px;\n  background: var(--card);\n  box-shadow: var(--shadow);\n}.gm .game-toolbar{\n  display: flex;\n  align-items: end;\n  justify-content: space-between;\n  gap: 22px;\n  padding: 20px 24px;\n  border-bottom: 1px solid var(--border);\n}.gm .field-group{ display: grid; gap: 7px; }.gm .field-label{ color: var(--muted); font-size: 13px; font-weight: 800; letter-spacing: .04em; text-transform: uppercase; }.gm .segmented{\n  display: flex;\n  gap: 4px;\n  padding: 4px;\n  border: 1px solid var(--border);\n  border-radius: 12px;\n  background: var(--bg);\n}.gm .segment{\n  min-height: 40px;\n  padding: 7px 14px;\n  border: 0;\n  border-radius: 9px;\n  background: transparent;\n  color: var(--muted);\n  font-size: 15px;\n  font-weight: 800;\n  cursor: pointer;\n}.gm .segment.active{ background: var(--brand); color: #fff; box-shadow: 0 4px 12px rgba(91, 92, 226, .22); }.gm select{\n  min-width: 130px;\n  height: 48px;\n  padding: 0 38px 0 14px;\n  border: 1px solid var(--border);\n  border-radius: 11px;\n  background: #fff;\n  color: var(--text);\n  font-weight: 700;\n  cursor: pointer;\n}.gm button:focus-visible,.gm select:focus-visible,.gm summary:focus-visible{\n  outline: 3px solid rgba(22, 184, 196, .38);\n  outline-offset: 3px;\n}.gm .scoreboard{\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 1px;\n  border-bottom: 1px solid var(--border);\n  background: var(--border);\n}.gm .score-card{\n  display: grid;\n  grid-template-columns: auto 1fr auto;\n  align-items: center;\n  gap: 10px;\n  padding: 16px 22px;\n  background: #fff;\n}.gm .score-symbol{ display: grid; width: 32px; height: 32px; place-items: center; border-radius: 9px; font-weight: 900; line-height: 1; }.gm .player-x .score-symbol{ background: #eeeefe; color: var(--brand); }.gm .player-o .score-symbol{ background: #e6f8fa; color: #087f88; }.gm .draws .score-symbol{ background: #fff2dc; color: #a86400; }.gm .score-label{ color: var(--muted); font-size: 14px; font-weight: 700; }.gm .score-card strong{ font-size: 24px; line-height: 1; }.gm .score-card.active{ box-shadow: inset 0 -3px 0 var(--brand); }.gm .score-card.player-o.active{ box-shadow: inset 0 -3px 0 var(--teal); }.gm .play-area{\n  padding: 30px 24px 32px;\n  background: var(--game-bg);\n  color: #fff;\n}.gm .turn-panel{\n  display: flex;\n  width: fit-content;\n  align-items: center;\n  gap: 12px;\n  margin: 0 auto 22px;\n}.gm .turn-icon{ display: grid; width: 43px; height: 43px; place-items: center; border-radius: 13px; background: var(--brand); font-size: 24px; font-weight: 900; line-height: 1; }.gm .turn-icon.o{ background: var(--teal); }.gm .turn-icon.draw{ background: var(--amber); color: #432c00; }.gm .turn-kicker{ margin-bottom: 0; color: #9ca3af; font-size: 12px; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; }.gm .status{ margin-bottom: 0; font-size: 21px; font-weight: 800; line-height: 1.25; }.gm .board-wrap{\n  width: min(100%, 430px);\n  margin-inline: auto;\n  padding: 10px;\n  border-radius: 20px;\n  background: var(--game-secondary);\n}.gm .board{\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 9px;\n}.gm .cell{\n  position: relative;\n  display: grid;\n  aspect-ratio: 1;\n  place-items: center;\n  border: 0;\n  border-radius: 14px;\n  background: #f8fafc;\n  color: var(--brand);\n  font-size: clamp(48px, 11vw, 72px);\n  font-weight: 900;\n  line-height: 1;\n  cursor: pointer;\n  transition: transform .12s ease, background .12s ease;\n}.gm .cell:not([aria-disabled=\"true\"]):hover{ background: #fff; transform: translateY(-2px); }.gm .cell.o{ color: #0796a1; }.gm .cell.winner{ background: #dff8e7; color: #16803a; animation: winner-pop .36s ease both; }.gm .cell[aria-disabled=\"true\"]{ cursor: default; }@keyframes winner-pop{ 50% { transform: scale(.94); } }@media (prefers-reduced-motion: reduce){.gm *,.gm *::before,.gm *::after{ scroll-behavior: auto !important; animation-duration: .01ms !important; transition-duration: .01ms !important; }}.gm .game-actions{ display: flex; justify-content: center; gap: 12px; margin-top: 24px; }.gm .button{\n  min-height: 48px;\n  padding: 10px 20px;\n  border: 1px solid transparent;\n  border-radius: 12px;\n  font-size: 16px;\n  font-weight: 800;\n  cursor: pointer;\n}.gm .button.primary{ background: var(--brand); color: #fff; }.gm .button.primary:hover{ background: var(--brand-dark); }.gm .button.secondary{ border-color: #4b5563; background: transparent; color: #e5e7eb; }.gm .button.secondary:hover{ background: #273244; }.gm .tips-card{ background: #f0f0ff; border-color: #dedeff; }.gm .tip-list{ display: grid; gap: 20px; margin: 0; padding: 0; list-style: none; }.gm .tip-list li{ display: flex; align-items: flex-start; gap: 12px; }.gm .tip-list li > span{ display: grid; flex: 0 0 30px; height: 30px; place-items: center; border-radius: 9px; background: var(--brand); color: #fff; font-size: 14px; font-weight: 800; }.gm .section-heading{ display: flex; align-items: end; justify-content: space-between; gap: 24px; margin-bottom: 22px; }.gm .section-heading h2,.gm .section-heading .eyebrow{ margin-bottom: 0; }.gm .game-badge{ display: grid; width: 48px; height: 48px; place-items: center; border-radius: 13px; color: #fff; font-size: 23px; font-weight: 900; }.gm .game-badge.purple{ background: var(--brand); }.gm .game-badge.teal{ background: var(--teal); }.gm .game-badge.amber{ background: #d88c18; }.gm .soon{ padding: 3px 8px; border-radius: 999px; background: var(--bg); color: var(--muted); font-size: 12px; font-weight: 800; }.gm details{ border-top: 1px solid var(--border); background: transparent; }.gm details:last-child{ border-bottom: 1px solid var(--border); }.gm summary{ padding: 20px 4px; font-size: 18px; font-weight: 800; cursor: pointer; }.gm details p{ padding: 0 28px 20px 4px; color: var(--muted); }.gm [hidden]{ display: none !important; }@media (max-width: 760px){.gm .game-toolbar{ align-items: stretch; }.gm .field-group:first-child{ flex: 1; }.gm .segmented,.gm .segment{ width: 100%; }.gm .segment{ padding-inline: 10px; }.gm .score-card{ grid-template-columns: 1fr; justify-items: center; gap: 5px; padding: 13px 8px; text-align: center; }.gm .score-symbol{ width: 29px; height: 29px; }.gm .section-heading{ align-items: flex-start; flex-direction: column; gap: 6px; }}@media (max-width: 510px){.gm .game-shell{ margin-inline: -4px; margin-bottom: 60px; border-radius: 16px; }.gm .game-toolbar{ flex-direction: column; gap: 14px; padding: 16px; }.gm #difficulty-group select{ width: 100%; }.gm .play-area{ padding: 25px 14px 28px; }.gm .board-wrap{ padding: 8px; border-radius: 17px; }.gm .board{ gap: 7px; }.gm .cell{ border-radius: 11px; }.gm .game-actions{ display: grid; grid-template-columns: 1fr 1fr; gap: 9px; }.gm .button{ padding-inline: 12px; }}";
function __ready(f){f()}
function boot(){
'use strict';

const WINNING_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

const CELL_NAMES = [
  'Top left', 'Top center', 'Top right',
  'Middle left', 'Center', 'Middle right',
  'Bottom left', 'Bottom center', 'Bottom right'
];

const boardElement = document.getElementById('game-board');
const cells = [...document.querySelectorAll('.cell')];
const statusElement = document.getElementById('status');
const turnIcon = document.getElementById('turn-icon');
const difficultySelect = document.getElementById('difficulty');
const difficultyGroup = document.getElementById('difficulty-group');
const modeButtons = [...document.querySelectorAll('[data-mode]')];
const newRoundButton = document.getElementById('new-round');
const resetScoreButton = document.getElementById('reset-score');
const xScoreElement = document.getElementById('x-score');
const oScoreElement = document.getElementById('o-score');
const drawScoreElement = document.getElementById('draw-score');
const xLabel = document.getElementById('x-label');
const oLabel = document.getElementById('o-label');
const xScoreCard = document.getElementById('x-score-card');
const oScoreCard = document.getElementById('o-score-card');

let board = Array(9).fill('');
let mode = 'computer';
let difficulty = 'hard';
let currentPlayer = 'X';
let startingPlayer = 'X';
let isGameOver = false;
let isComputerThinking = false;
let aiTimer = null;
let scores = loadScores();

function loadScores() {
  try {
    const saved = JSON.parse(localStorage.getItem('gamesHubTicTacToeScores'));
    if (saved && Number.isInteger(saved.x) && Number.isInteger(saved.o) && Number.isInteger(saved.draws)) {
      return saved;
    }
  } catch (error) {
    // The game still works if browser storage is unavailable.
  }
  return { x: 0, o: 0, draws: 0 };
}

function saveScores() {
  try {
    localStorage.setItem('gamesHubTicTacToeScores', JSON.stringify(scores));
  } catch (error) {
    // Scores remain available for the current page session.
  }
}

function renderScores() {
  xScoreElement.textContent = scores.x;
  oScoreElement.textContent = scores.o;
  drawScoreElement.textContent = scores.draws;
}

function setMode(nextMode) {
  mode = nextMode;
  modeButtons.forEach((button) => {
    const selected = button.dataset.mode === mode;
    button.classList.toggle('active', selected);
    button.setAttribute('aria-pressed', String(selected));
  });
  difficultyGroup.hidden = mode !== 'computer';
  xLabel.textContent = mode === 'computer' ? 'You' : 'Player X';
  oLabel.textContent = mode === 'computer' ? 'Computer' : 'Player O';
  startingPlayer = 'X';
  startRound(false);
}

function startRound(alternateStarter = true) {
  window.clearTimeout(aiTimer);
  if (alternateStarter) startingPlayer = startingPlayer === 'X' ? 'O' : 'X';
  board = Array(9).fill('');
  currentPlayer = startingPlayer;
  isGameOver = false;
  isComputerThinking = false;

  cells.forEach((cell, index) => {
    cell.textContent = '';
    cell.className = 'cell';
    cell.setAttribute('aria-disabled', 'false');
    cell.setAttribute('aria-label', `${CELL_NAMES[index]}, empty`);
  });

  updateStatus();
  focusFirstCell();

  if (mode === 'computer' && currentPlayer === 'O') scheduleComputerMove();
}

function focusFirstCell() {
  cells.forEach((cell, index) => { cell.tabIndex = index === 0 ? 0 : -1; });
}

function getResult(state) {
  for (const line of WINNING_LINES) {
    const [a, b, c] = line;
    if (state[a] && state[a] === state[b] && state[a] === state[c]) {
      return { winner: state[a], line };
    }
  }
  if (state.every(Boolean)) return { winner: 'draw', line: [] };
  return null;
}

function placeMark(index, player) {
  board[index] = player;
  const cell = cells[index];
  cell.textContent = player;
  cell.classList.add(player.toLowerCase());
  cell.setAttribute('aria-label', `${CELL_NAMES[index]}, ${player}`);
  cell.setAttribute('aria-disabled', 'true');
}

function handleCellSelection(index) {
  if (isGameOver || isComputerThinking || board[index]) return;
  if (mode === 'computer' && currentPlayer === 'O') return;

  placeMark(index, currentPlayer);
  finishTurn();
}

function finishTurn() {
  const result = getResult(board);
  if (result) {
    finishGame(result);
    return;
  }

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  updateStatus();
  if (mode === 'computer' && currentPlayer === 'O') scheduleComputerMove();
}

function finishGame(result) {
  isGameOver = true;
  isComputerThinking = false;
  cells.forEach((cell) => cell.setAttribute('aria-disabled', 'true'));

  if (result.winner === 'draw') {
    scores.draws += 1;
    statusElement.textContent = 'Round drawn';
    turnIcon.textContent = '—';
    turnIcon.className = 'turn-icon draw';
  } else {
    scores[result.winner.toLowerCase()] += 1;
    result.line.forEach((index) => cells[index].classList.add('winner'));
    const winnerName = getPlayerName(result.winner);
    const verb = mode === 'friend' || result.winner === 'O' ? 'wins' : 'win';
    statusElement.textContent = `${winnerName} ${verb}`;
    turnIcon.textContent = result.winner;
    turnIcon.className = `turn-icon ${result.winner.toLowerCase()}`;
  }

  xScoreCard.classList.remove('active');
  oScoreCard.classList.remove('active');
  renderScores();
  saveScores();
  newRoundButton.focus();
}

function getPlayerName(player) {
  if (mode === 'computer') return player === 'X' ? 'You' : 'Computer';
  return `Player ${player}`;
}

function updateStatus() {
  const playerName = getPlayerName(currentPlayer);
  const possessive = mode === 'computer' && currentPlayer === 'X' ? 'Your' : `${playerName}’s`;
  statusElement.textContent = `${possessive} turn`;
  turnIcon.textContent = currentPlayer;
  turnIcon.className = `turn-icon ${currentPlayer.toLowerCase()}`;
  xScoreCard.classList.toggle('active', currentPlayer === 'X');
  oScoreCard.classList.toggle('active', currentPlayer === 'O');
}

function scheduleComputerMove() {
  isComputerThinking = true;
  statusElement.textContent = 'Computer is thinking…';

  aiTimer = window.setTimeout(() => {
    if (isGameOver || mode !== 'computer') return;
    const index = difficulty === 'easy' ? chooseEasyMove() : chooseHardMove();
    isComputerThinking = false;
    placeMark(index, 'O');
    finishTurn();
  }, 420);
}

function availableMoves(state) {
  return state.map((value, index) => value ? -1 : index).filter((index) => index !== -1);
}

function chooseEasyMove() {
  const moves = availableMoves(board);
  return moves[Math.floor(Math.random() * moves.length)];
}

function chooseHardMove() {
  let bestScore = -Infinity;
  let bestMoves = [];

  for (const index of availableMoves(board)) {
    board[index] = 'O';
    const score = minimax(board, 0, false);
    board[index] = '';
    if (score > bestScore) {
      bestScore = score;
      bestMoves = [index];
    } else if (score === bestScore) {
      bestMoves.push(index);
    }
  }

  return bestMoves[Math.floor(Math.random() * bestMoves.length)];
}

function minimax(state, depth, isMaximizing) {
  const result = getResult(state);
  if (result?.winner === 'O') return 10 - depth;
  if (result?.winner === 'X') return depth - 10;
  if (result?.winner === 'draw') return 0;

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (const index of availableMoves(state)) {
      state[index] = 'O';
      bestScore = Math.max(bestScore, minimax(state, depth + 1, false));
      state[index] = '';
    }
    return bestScore;
  }

  let bestScore = Infinity;
  for (const index of availableMoves(state)) {
    state[index] = 'X';
    bestScore = Math.min(bestScore, minimax(state, depth + 1, true));
    state[index] = '';
  }
  return bestScore;
}

function resetScores() {
  scores = { x: 0, o: 0, draws: 0 };
  saveScores();
  renderScores();
  startingPlayer = 'X';
  startRound(false);
}

function handleBoardKeyboard(event) {
  const currentIndex = cells.indexOf(document.activeElement);
  if (currentIndex < 0) return;

  const row = Math.floor(currentIndex / 3);
  const column = currentIndex % 3;
  let nextIndex = currentIndex;

  if (event.key === 'ArrowRight') nextIndex = row * 3 + ((column + 1) % 3);
  else if (event.key === 'ArrowLeft') nextIndex = row * 3 + ((column + 2) % 3);
  else if (event.key === 'ArrowDown') nextIndex = ((row + 1) % 3) * 3 + column;
  else if (event.key === 'ArrowUp') nextIndex = ((row + 2) % 3) * 3 + column;
  else return;

  event.preventDefault();
  cells.forEach((cell, index) => { cell.tabIndex = index === nextIndex ? 0 : -1; });
  cells[nextIndex].focus();
}

cells.forEach((cell) => {
  cell.addEventListener('click', () => handleCellSelection(Number(cell.dataset.index)));
});

boardElement.addEventListener('keydown', handleBoardKeyboard);
modeButtons.forEach((button) => button.addEventListener('click', () => setMode(button.dataset.mode)));
difficultySelect.addEventListener('change', () => {
  difficulty = difficultySelect.value;
  startingPlayer = 'X';
  startRound(false);
});
newRoundButton.addEventListener('click', () => startRound(true));
resetScoreButton.addEventListener('click', resetScores);
document.getElementById('current-year').textContent = new Date().getFullYear();

renderScores();
setMode('computer');


}
function begin(){poster.hidden=true;gm.hidden=false;if(!booted){booted=true;var s=document.createElement("style");s.textContent=LOOK;document.head.appendChild(s);boot();}else{var r=document.getElementById("new-round");if(r)r.click();}}
poster.addEventListener("click",begin);
var nb=document.getElementById("new");if(nb)nb.addEventListener("click",begin);
})();
