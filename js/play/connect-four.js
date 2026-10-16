/* Connect Four - game logic + its own look. Layout lives in style.css; page shell lives in the HTML. */
(function(){"use strict";
var gm=document.getElementById("gm"),poster=document.getElementById("poster"),booted=false;
var LOOK=".gm{\n  \n  \n  --accent: #16b8c4;\n  --action: #ffb84d;\n  \n  \n  \n  \n  \n  --board: #4856ce;\n  --board-dark: #303ba6;\n  --red: #ef5b5b;\n  --red-dark: #c93e47;\n  --yellow: #ffc93d;\n  --yellow-dark: #d99b13;\n  --slot: #eef1f7;\n  \n}.gm *{ box-sizing: border-box; }.gm button,.gm input{ font: inherit; }.gm .sr-only{ position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0; }.gm .section-kicker{ margin: 0 0 10px; color: var(--brand); font-size: 14px; font-weight: 800; letter-spacing: .11em; text-transform: uppercase; }.gm h2,.gm h3,.gm p{ overflow-wrap: break-word; }.gm h2{ margin: 0 0 18px; font-size: clamp(28px, 4vw, 36px); line-height: 1.15; letter-spacing: -.025em; }.gm h3{ font-size: 21px; line-height: 1.25; }.gm .mini-disc{ width: 58px; aspect-ratio: 1; border-radius: 50%; box-shadow: inset 0 -5px 0 rgba(0,0,0,.15), 0 3px 0 rgba(255,255,255,.2); }.gm .red{ background: var(--red); }.gm .yellow{ background: var(--yellow); }.gm .game-shell{ padding: 28px; border: 1px solid var(--border); border-radius: 24px; background: var(--card); box-shadow: var(--shadow); }.gm .scoreboard{ display: grid; grid-template-columns: 1fr auto 1fr; gap: 14px; width: min(650px, 100%); margin: 0 auto 18px; }.gm .score-card,.gm .round-card{ min-height: 70px; display: flex; align-items: center; justify-content: center; gap: 12px; border: 2px solid var(--border); border-radius: 16px; background: #fff; transition: border-color .2s, transform .2s, box-shadow .2s; }.gm .score-card.active{ transform: translateY(-2px); box-shadow: 0 8px 20px rgba(29,38,84,.09); }.gm .score-card.player-red.active{ border-color: var(--red); }.gm .score-card.player-yellow.active{ border-color: var(--yellow-dark); }.gm .score-card small,.gm .round-card small{ display: block; color: var(--muted); font-size: 13px; font-weight: 700; line-height: 1.1; text-transform: uppercase; letter-spacing: .06em; }.gm .score-card strong,.gm .round-card strong{ display: block; margin-top: 3px; font-size: 25px; line-height: 1; }.gm .round-card{ min-width: 82px; padding: 10px 17px; flex-direction: column; gap: 2px; background: #f8f8ff; }.gm .score-disc{ width: 34px; height: 34px; border-radius: 50%; box-shadow: inset 0 -4px 0 rgba(0,0,0,.15); }.gm .player-red .score-disc{ background: var(--red); }.gm .player-yellow .score-disc{ background: var(--yellow); }.gm .status-panel{ min-height: 48px; display: flex; align-items: center; justify-content: center; gap: 10px; width: min(650px, 100%); margin: 0 auto 16px; border-radius: 12px; background: #f3f4ff; font-weight: 800; }.gm .turn-disc{ width: 20px; height: 20px; border-radius: 50%; box-shadow: inset 0 -3px 0 rgba(0,0,0,.14); }.gm .board-stage{ width: min(650px, 100%); margin-inline: auto; }.gm .column-controls{ display: grid; grid-template-columns: repeat(7, 1fr); gap: 7px; padding: 0 13px; }.gm .column-button{ display: grid; place-items: center; height: 40px; padding: 0; border: 0; border-radius: 9px 9px 4px 4px; background: transparent; color: var(--muted); cursor: pointer; font-weight: 800; transition: color .15s, background .15s, transform .15s; }.gm .column-button::before{ content: \"\u2193\"; margin-right: 3px; }.gm .column-button:hover,.gm .column-button.selected{ color: var(--brand-dark); background: #eeeeff; transform: translateY(2px); }.gm .column-button:disabled{ opacity: .3; cursor: not-allowed; transform: none; }.gm .column-button:focus-visible,.gm .btn:focus-visible,.gm summary:focus-visible{ outline: 3px solid var(--accent); outline-offset: 3px; }.gm .board-wrap{ position: relative; padding-top: 2px; }.gm .drop-preview{ position: absolute; z-index: 0; top: -52px; left: 0; width: calc((100% - 26px - 42px) / 7); aspect-ratio: 1; border-radius: 50%; opacity: 0; pointer-events: none; box-shadow: inset 0 -6px 0 rgba(0,0,0,.15); transition: left .13s ease, opacity .13s ease; }.gm .drop-preview.visible{ opacity: .5; }.gm .board{ position: relative; z-index: 1; display: grid; grid-template-columns: repeat(7, 1fr); gap: 7px; padding: 13px; border: 0 solid var(--board-dark); border-width: 0 0 10px; border-radius: 18px; background: var(--board); box-shadow: 0 11px 0 var(--board-dark), 0 20px 30px rgba(38,48,123,.2); user-select: none; touch-action: manipulation; }.gm .cell{ position: relative; display: grid; place-items: center; aspect-ratio: 1; border-radius: 50%; background: var(--slot); box-shadow: inset 0 5px 0 rgba(25,32,95,.22), 0 1px 0 rgba(255,255,255,.25); cursor: pointer; }.gm .cell::after{ content: \"\"; position: absolute; inset: 7%; border-radius: 50%; }.gm .cell.red::after,.gm .cell.yellow::after{ box-shadow: inset 0 -7px 0 rgba(0,0,0,.14), inset 0 3px 0 rgba(255,255,255,.22); }.gm .cell.red::after{ background: var(--red); }.gm .cell.yellow::after{ background: var(--yellow); }.gm .cell.last-move::after{ outline: 3px solid rgba(255,255,255,.9); outline-offset: -7px; }.gm .cell.winning::after{ animation: winner-pulse .72s ease-in-out infinite alternate; }.gm .cell.drop::after{ animation: disc-drop .32s cubic-bezier(.25,.8,.35,1); }@keyframes disc-drop{ from { transform: translateY(-420%); } to { transform: translateY(0); } }@keyframes winner-pulse{ to { transform: scale(.83); box-shadow: inset 0 -6px 0 rgba(0,0,0,.14), 0 0 0 6px #fff; } }.gm .keyboard-hint{ margin: 24px 0 0; text-align: center; color: var(--muted); font-size: 14px; }.gm kbd{ min-width: 28px; display: inline-block; padding: 1px 7px; border: 1px solid #d4d8e4; border-bottom-width: 3px; border-radius: 6px; background: #fff; color: var(--text); font-family: inherit; font-weight: 800; }.gm .game-actions{ display: flex; justify-content: center; gap: 12px; margin-top: 18px; }.gm .btn{ min-height: 48px; padding: 11px 20px; border: 2px solid transparent; border-radius: 12px; cursor: pointer; font-size: 16px; font-weight: 800; transition: transform .15s, background .15s, box-shadow .15s; }.gm .btn:hover{ transform: translateY(-2px); }.gm .btn-primary{ color: #fff; background: var(--brand); box-shadow: 0 7px 16px rgba(69,70,184,.25); }.gm .btn-primary:hover{ background: var(--brand-dark); }.gm .btn-secondary{ border-color: var(--border); color: var(--text); background: #fff; }.gm .btn-secondary:hover{ border-color: #c9ccda; background: #f8f9fc; }.gm .instructions{ display: grid; grid-template-columns: 1.05fr .95fr; align-items: start; gap: 70px; }.gm .instructions p,.gm .about > p:last-child{ color: var(--muted); }.gm .steps{ display: grid; gap: 13px; margin: 0; padding: 0; list-style: none; }.gm .steps li{ display: flex; gap: 15px; padding: 18px; border: 1px solid var(--border); border-radius: 15px; background: #fff; }.gm .steps li > span{ flex: 0 0 36px; height: 36px; display: grid; place-items: center; border-radius: 50%; color: #fff; background: var(--brand); font-weight: 800; }.gm .steps strong{ display: block; }.gm .steps p{ margin: 2px 0 0; font-size: 15px; }.gm .tips-grid{ display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-top: 28px; }.gm .tips-grid article{ padding: 23px; border: 1px solid var(--border); border-radius: 16px; background: #fff; }.gm .tips-grid article > span{ width: 42px; height: 42px; display: grid; place-items: center; border-radius: 11px; color: var(--brand); background: #eeeeff; font-size: 23px; font-weight: 800; }.gm .tips-grid h3{ margin: 17px 0 8px; }.gm .tips-grid p{ margin: 0; color: var(--muted); font-size: 16px; }.gm .about{ max-width: 820px; }.gm .section-heading-row{ display: flex; align-items: end; justify-content: space-between; gap: 28px; margin-bottom: 25px; }.gm .section-heading-row h2{ margin-bottom: 0; }.gm .section-heading-row > p{ max-width: 330px; margin: 0; color: var(--muted); text-align: right; }.gm .coming-soon{ grid-column: 2; margin-top: 8px; color: var(--brand); font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: .07em; }.gm details{ border-top: 1px solid var(--border); background: transparent; }.gm details:last-child{ border-bottom: 1px solid var(--border); }.gm summary{ position: relative; padding: 19px 42px 19px 0; cursor: pointer; list-style: none; font-weight: 800; }.gm summary::-webkit-details-marker{ display: none; }.gm summary::after{ content: \"+\"; position: absolute; right: 8px; top: 14px; color: var(--brand); font-size: 25px; }.gm details[open] summary::after{ content: \"\u2212\"; }.gm details p{ margin: -4px 40px 20px 0; color: var(--muted); }.gm .modal-backdrop{ position: fixed; z-index: 50; inset: 0; display: grid; place-items: center; padding: 20px; background: rgba(17,24,39,.66); backdrop-filter: blur(5px); }.gm .modal-backdrop[hidden]{ display: none; }.gm .result-modal{ width: min(430px, 100%); padding: 34px; border-radius: 22px; background: #fff; text-align: center; box-shadow: 0 24px 70px rgba(0,0,0,.28); animation: modal-in .24s ease-out; }@keyframes modal-in{ from { opacity: 0; transform: translateY(14px) scale(.97); } }.gm .result-mark{ width: 78px; height: 78px; margin: 0 auto 20px; border: 8px solid var(--brand); border-radius: 50%; box-shadow: inset 0 -8px 0 rgba(0,0,0,.13); }.gm .result-mark.red{ background: var(--red); border-color: #ffd6d6; }.gm .result-mark.yellow{ background: var(--yellow); border-color: #fff0b2; }.gm .result-mark.draw{ position: relative; background: linear-gradient(90deg, var(--red) 50%, var(--yellow) 50%); border-color: #e8eaf2; }.gm .result-modal h2{ margin-bottom: 9px; }.gm .result-modal p{ margin: 0 0 23px; color: var(--muted); }.gm .modal-actions{ display: flex; justify-content: center; gap: 10px; }@media (max-width: 760px){.gm .game-shell{ padding: 20px 14px 24px; border-radius: 20px; }.gm .score-card{ min-height: 62px; gap: 8px; }.gm .score-disc{ width: 28px; height: 28px; }.gm .score-card strong{ font-size: 22px; }.gm .round-card{ min-width: 64px; padding-inline: 10px; }.gm .column-controls{ gap: 4px; padding-inline: 8px; }.gm .column-button{ height: 38px; font-size: 14px; }.gm .column-button::before{ display: none; }.gm .board{ gap: 4px; padding: 8px; border-radius: 13px; border-bottom-width: 7px; box-shadow: 0 8px 0 var(--board-dark), 0 14px 25px rgba(38,48,123,.2); }.gm .cell::after{ inset: 6%; }.gm .cell.red::after,.gm .cell.yellow::after{ box-shadow: inset 0 -4px 0 rgba(0,0,0,.14), inset 0 2px 0 rgba(255,255,255,.22); }.gm .drop-preview{ display: none; }.gm .keyboard-hint{ display: none; }.gm .game-actions{ margin-top: 22px; }.gm .game-actions .btn{ flex: 1; padding-inline: 10px; }.gm .instructions{ grid-template-columns: 1fr; gap: 28px; }.gm .tips-grid{ grid-template-columns: 1fr; }.gm .section-heading-row{ align-items: start; flex-direction: column; }.gm .section-heading-row > p{ text-align: left; }}@media (max-width: 390px){.gm .scoreboard{ gap: 6px; }.gm .score-card{ padding-inline: 5px; }.gm .score-card small{ font-size: 11px; }.gm .score-disc{ width: 22px; height: 22px; }.gm .status-panel{ padding-inline: 8px; font-size: 14px; }.gm .result-modal{ padding: 28px 20px; }.gm .modal-actions{ flex-direction: column; }}@media (prefers-reduced-motion: reduce){.gm *,.gm *::before,.gm *::after{ scroll-behavior: auto !important; animation-duration: .01ms !important; animation-iteration-count: 1 !important; transition-duration: .01ms !important; }}";
function __ready(f){f()}
function boot(){
"use strict";

const ROWS = 6;
const COLUMNS = 7;
const EMPTY = 0;
const RED = 1;
const YELLOW = 2;

const boardElement = document.getElementById("board");
const controlsElement = document.getElementById("columnControls");
const statusText = document.getElementById("statusText");
const turnDisc = document.getElementById("turnDisc");
const dropPreview = document.getElementById("dropPreview");
const redScoreElement = document.getElementById("redScore");
const yellowScoreElement = document.getElementById("yellowScore");
const roundNumberElement = document.getElementById("roundNumber");
const redScoreCard = document.getElementById("redScoreCard");
const yellowScoreCard = document.getElementById("yellowScoreCard");
const newRoundButton = document.getElementById("newRoundButton");
const resetMatchButton = document.getElementById("resetMatchButton");
const resultModal = document.getElementById("resultModal");
const resultTitle = document.getElementById("resultTitle");
const resultMessage = document.getElementById("resultMessage");
const resultMark = document.getElementById("resultMark");
const playAgainButton = document.getElementById("playAgainButton");
const closeModalButton = document.getElementById("closeModalButton");

let board = [];
let currentPlayer = RED;
let selectedColumn = 3;
let gameOver = false;
let isAnimating = false;
let lastMove = null;
let scores = { red: 0, yellow: 0 };
let round = 1;

function playerName(player) {
  return player === RED ? "Red" : "Yellow";
}

function playerClass(player) {
  return player === RED ? "red" : "yellow";
}

function createBoard() {
  boardElement.replaceChildren();
  controlsElement.replaceChildren();

  for (let column = 0; column < COLUMNS; column += 1) {
    const button = document.createElement("button");
    button.className = "column-button";
    button.type = "button";
    button.dataset.column = String(column);
    button.setAttribute("aria-label", `Drop disc in column ${column + 1}`);
    button.textContent = String(column + 1);
    button.addEventListener("click", () => playColumn(column));
    button.addEventListener("mouseenter", () => selectColumn(column));
    controlsElement.append(button);
  }

  for (let row = 0; row < ROWS; row += 1) {
    for (let column = 0; column < COLUMNS; column += 1) {
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.dataset.row = String(row);
      cell.dataset.column = String(column);
      cell.setAttribute("role", "gridcell");
      cell.setAttribute("aria-label", `Row ${row + 1}, column ${column + 1}, empty`);
      cell.addEventListener("click", () => playColumn(column));
      cell.addEventListener("mouseenter", () => selectColumn(column));
      boardElement.append(cell);
    }
  }
}

function resetBoard() {
  board = Array.from({ length: ROWS }, () => Array(COLUMNS).fill(EMPTY));
  currentPlayer = RED;
  selectedColumn = 3;
  gameOver = false;
  isAnimating = false;
  lastMove = null;
  closeResultModal();
  renderBoard();
  updateStatus();
  selectColumn(selectedColumn);
}

function newRound() {
  round += 1;
  roundNumberElement.textContent = String(round);
  resetBoard();
}

function resetMatch() {
  scores = { red: 0, yellow: 0 };
  round = 1;
  redScoreElement.textContent = "0";
  yellowScoreElement.textContent = "0";
  roundNumberElement.textContent = "1";
  resetBoard();
}

function findOpenRow(column) {
  for (let row = ROWS - 1; row >= 0; row -= 1) {
    if (board[row][column] === EMPTY) return row;
  }
  return -1;
}

function playColumn(column) {
  if (gameOver || isAnimating || column < 0 || column >= COLUMNS) return;

  const row = findOpenRow(column);
  if (row === -1) {
    statusText.textContent = `Column ${column + 1} is full — choose another`;
    return;
  }

  isAnimating = true;
  board[row][column] = currentPlayer;
  lastMove = { row, column };
  renderBoard(row, column);

  const winningCells = getWinningCells(row, column, currentPlayer);
  if (winningCells.length >= 4) {
    gameOver = true;
    markWinningCells(winningCells);
    const winner = currentPlayer;
    if (winner === RED) scores.red += 1;
    else scores.yellow += 1;
    updateScores();
    statusText.textContent = `${playerName(winner)} wins with four in a row!`;
    disableFullColumns();
    window.setTimeout(() => showResult(winner), 520);
  } else if (board.every(rowCells => rowCells.every(cell => cell !== EMPTY))) {
    gameOver = true;
    statusText.textContent = "Draw — the board is full";
    disableFullColumns();
    window.setTimeout(() => showResult(EMPTY), 520);
  } else {
    currentPlayer = currentPlayer === RED ? YELLOW : RED;
    updateStatus();
  }

  window.setTimeout(() => { isAnimating = false; }, 340);
}

function getWinningCells(row, column, player) {
  const directions = [[0, 1], [1, 0], [1, 1], [1, -1]];

  for (const [rowStep, columnStep] of directions) {
    const line = [{ row, column }];

    for (const sign of [-1, 1]) {
      let nextRow = row + rowStep * sign;
      let nextColumn = column + columnStep * sign;
      while (
        nextRow >= 0 && nextRow < ROWS &&
        nextColumn >= 0 && nextColumn < COLUMNS &&
        board[nextRow][nextColumn] === player
      ) {
        line.push({ row: nextRow, column: nextColumn });
        nextRow += rowStep * sign;
        nextColumn += columnStep * sign;
      }
    }

    if (line.length >= 4) return line;
  }
  return [];
}

function renderBoard(animatedRow = -1, animatedColumn = -1) {
  for (let row = 0; row < ROWS; row += 1) {
    for (let column = 0; column < COLUMNS; column += 1) {
      const cell = getCell(row, column);
      const value = board[row][column];
      cell.className = "cell";
      if (value !== EMPTY) cell.classList.add(playerClass(value));
      if (lastMove && lastMove.row === row && lastMove.column === column) cell.classList.add("last-move");
      if (row === animatedRow && column === animatedColumn) cell.classList.add("drop");
      const state = value === EMPTY ? "empty" : `${playerName(value)} disc`;
      cell.setAttribute("aria-label", `Row ${row + 1}, column ${column + 1}, ${state}`);
    }
  }
  disableFullColumns();
}

function getCell(row, column) {
  return boardElement.children[row * COLUMNS + column];
}

function markWinningCells(cells) {
  cells.forEach(({ row, column }) => getCell(row, column).classList.add("winning"));
}

function updateScores() {
  redScoreElement.textContent = String(scores.red);
  yellowScoreElement.textContent = String(scores.yellow);
}

function updateStatus() {
  statusText.textContent = `${playerName(currentPlayer)}'s turn — choose a column`;
  turnDisc.className = `turn-disc ${playerClass(currentPlayer)}`;
  redScoreCard.classList.toggle("active", currentPlayer === RED && !gameOver);
  yellowScoreCard.classList.toggle("active", currentPlayer === YELLOW && !gameOver);
  updatePreview();
}

function disableFullColumns() {
  controlsElement.querySelectorAll(".column-button").forEach((button, column) => {
    button.disabled = gameOver || board[0][column] !== EMPTY;
  });
}

function selectColumn(column) {
  selectedColumn = Math.max(0, Math.min(COLUMNS - 1, column));
  controlsElement.querySelectorAll(".column-button").forEach((button, index) => {
    button.classList.toggle("selected", index === selectedColumn);
  });
  updatePreview();
}

function updatePreview() {
  const innerWidth = boardElement.clientWidth - 26;
  const gapWidth = 42;
  const discWidth = (innerWidth - gapWidth) / COLUMNS;
  const left = 13 + selectedColumn * (discWidth + 7);
  dropPreview.style.left = `${left}px`;
  dropPreview.style.width = `${discWidth}px`;
  dropPreview.className = `drop-preview ${playerClass(currentPlayer)}`;
  if (!gameOver && board[0][selectedColumn] === EMPTY) dropPreview.classList.add("visible");
}

function showResult(winner) {
  if (winner === EMPTY) {
    resultTitle.textContent = "It's a draw!";
    resultMessage.textContent = "Every space is filled. Start a new round and try again.";
    resultMark.className = "result-mark draw";
  } else {
    const name = playerName(winner);
    resultTitle.textContent = `${name} wins!`;
    resultMessage.textContent = "Four in a row. Great game!";
    resultMark.className = `result-mark ${playerClass(winner)}`;
  }
  resultModal.hidden = false;
  playAgainButton.focus();
}

function closeResultModal() {
  resultModal.hidden = true;
}

function handleKeyboard(event) {
  if (!resultModal.hidden) {
    if (event.key === "Escape") {
      closeResultModal();
      newRoundButton.focus();
    }
    return;
  }

  if (event.target.closest("button, a, summary")) return;

  const gameKeys = ["ArrowLeft", "ArrowRight", "Enter", " "];
  if (!gameKeys.includes(event.key) || gameOver) return;
  event.preventDefault();

  if (event.key === "ArrowLeft") selectColumn((selectedColumn + COLUMNS - 1) % COLUMNS);
  if (event.key === "ArrowRight") selectColumn((selectedColumn + 1) % COLUMNS);
  if (event.key === "Enter" || event.key === " ") playColumn(selectedColumn);
}

function keepFocusInModal(event) {
  if (resultModal.hidden || event.key !== "Tab") return;
  const modalButtons = [playAgainButton, closeModalButton];
  const currentIndex = modalButtons.indexOf(document.activeElement);
  if (event.shiftKey && currentIndex <= 0) {
    event.preventDefault();
    closeModalButton.focus();
  } else if (!event.shiftKey && currentIndex === modalButtons.length - 1) {
    event.preventDefault();
    playAgainButton.focus();
  }
}

newRoundButton.addEventListener("click", newRound);
resetMatchButton.addEventListener("click", resetMatch);
playAgainButton.addEventListener("click", newRound);
closeModalButton.addEventListener("click", () => {
  closeResultModal();
  newRoundButton.focus();
});
resultModal.addEventListener("click", event => {
  if (event.target === resultModal) closeResultModal();
});
document.addEventListener("keydown", handleKeyboard);
document.addEventListener("keydown", keepFocusInModal);
window.addEventListener("resize", updatePreview);

createBoard();
resetBoard();


}
function begin(){poster.hidden=true;gm.hidden=false;if(!booted){booted=true;var s=document.createElement("style");s.textContent=LOOK;document.head.appendChild(s);boot();}else{var r=document.getElementById("newRoundButton");if(r)r.click();}}
poster.addEventListener("click",begin);
var nb=document.getElementById("new");if(nb)nb.addEventListener("click",begin);
})();
