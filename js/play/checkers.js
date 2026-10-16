/* Checkers - game logic + its own look. Layout lives in style.css; page shell lives in the HTML. */
(function(){"use strict";
var gm=document.getElementById("gm"),poster=document.getElementById("poster"),booted=false;
var LOOK=".gm{\n  --primary: #5b5ce2;\n  --primary-dark: #4546b8;\n  --accent: #16b8c4;\n  --action: #ffb84d;\n  --success: #22c55e;\n  --danger: #ef5b5b;\n  --background: #f6f7fb;\n  \n  \n  \n  \n  --board-light: #eadbc8;\n  --board-dark: #745444;\n  --board-frame: #392c2a;\n  --red-piece: #d94747;\n  --red-piece-dark: #9f2727;\n  --black-piece: #283242;\n  --black-piece-dark: #111827;\n  --focus: #fbbf24;\n  \n}.gm *{ box-sizing: border-box; }.gm button{ font: inherit; }.gm button:focus-visible,.gm summary:focus-visible,.gm .board:focus-visible{\n  outline: 3px solid var(--focus);\n  outline-offset: 3px;\n}.gm .visually-hidden{\n  position: absolute !important;\n  width: 1px;\n  height: 1px;\n  padding: 0;\n  margin: -1px;\n  overflow: hidden;\n  clip: rect(0, 0, 0, 0);\n  white-space: nowrap;\n  border: 0;\n}.gm .page-shell{\n  width: min(1160px, calc(100% - 40px));\n  margin-inline: auto;\n}.gm .category-badge{ padding: 6px 12px; border: 1px solid #dfe0ff; border-radius: 999px; background: #f1f1ff; color: var(--primary-dark); font-size: 14px; font-weight: 700; }.gm .section-kicker{ margin: 0 0 10px; color: var(--primary-dark); font-size: 14px; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; }.gm h2,.gm h3,.gm p{ margin-top: 0; }.gm h2{ margin-bottom: 18px; font-size: clamp(28px, 4vw, 36px); line-height: 1.18; letter-spacing: -.02em; }.gm h3{ margin-bottom: 8px; font-size: 21px; line-height: 1.25; }.gm .game-card{ overflow: hidden; border: 1px solid var(--border); border-radius: 20px; background: var(--card); box-shadow: var(--shadow); }.gm .game-toolbar{ min-height: 86px; display: grid; grid-template-columns: 1fr auto 1fr; gap: 20px; align-items: center; padding: 16px 22px; border-bottom: 1px solid var(--border); }.gm .turn-panel{ display: flex; gap: 12px; align-items: center; }.gm .toolbar-label{ display: block; color: var(--muted); font-size: 13px; line-height: 1.25; }.gm .turn-panel strong{ display: block; font-size: 19px; line-height: 1.3; }.gm .turn-piece,.gm .mini-piece{ display: inline-block; flex: 0 0 auto; border-radius: 50%; }.gm .turn-piece{ width: 42px; height: 42px; border: 4px solid rgba(255,255,255,.62); box-shadow: inset 0 -5px 0 rgba(0,0,0,.18), 0 0 0 2px rgba(0,0,0,.08); }.gm .mini-piece{ width: 18px; height: 18px; box-shadow: inset 0 -3px 0 rgba(0,0,0,.2); }.gm .red{ background: var(--red-piece); }.gm .dark{ background: var(--black-piece); }.gm .piece-counts{ display: flex; gap: 18px; align-items: center; }.gm .piece-counts > div{ display: flex; gap: 7px; align-items: center; color: var(--muted); font-size: 14px; }.gm .piece-counts strong{ color: var(--text); font-size: 18px; }.gm .game-toolbar .button{ justify-self: end; }.gm .button{ min-height: 46px; display: inline-flex; align-items: center; justify-content: center; padding: 10px 19px; border: 0; border-radius: 12px; cursor: pointer; font-size: 16px; font-weight: 800; transition: transform .15s ease, background .15s ease; }.gm .button:hover{ transform: translateY(-1px); }.gm .button.primary{ background: var(--primary); color: #fff; }.gm .button.primary:hover{ background: var(--primary-dark); }.gm .button.secondary{ background: #f0f1f6; color: var(--text); }.gm .button.secondary:hover{ background: #e5e7ef; }.gm .game-stage{ padding: 26px max(16px, 3vw) 22px; background: #202938; }.gm .player-rank{ width: min(100%, 644px); display: flex; gap: 9px; align-items: center; margin: 0 auto; color: #d7dde7; font-size: 14px; font-weight: 700; }.gm .opponent-rank{ margin-bottom: 12px; }.gm .current-rank{ margin-top: 12px; }.gm .board-wrap{ position: relative; width: min(100%, 644px); margin: 0 auto; }.gm .board{\n  width: 100%;\n  aspect-ratio: 1;\n  display: grid;\n  grid-template-columns: repeat(8, 1fr);\n  grid-template-rows: repeat(8, 1fr);\n  overflow: hidden;\n  border: clamp(6px, 1.2vw, 12px) solid var(--board-frame);\n  border-radius: 12px;\n  background: var(--board-frame);\n  box-shadow: 0 16px 35px rgba(0,0,0,.26);\n  touch-action: manipulation;\n}.gm .square{ position: relative; min-width: 0; padding: 0; border: 0; border-radius: 0; display: grid; place-items: center; cursor: default; }.gm .square.light{ background: var(--board-light); }.gm .square.playable{ background: var(--board-dark); }.gm .square.selectable,.gm .square.destination{ cursor: pointer; }.gm .square.selectable::before{ content: \"\"; position: absolute; inset: 7%; border: 3px solid rgba(255, 213, 79, .78); border-radius: 10px; }.gm .square.destination::after{ content: \"\"; width: 24%; aspect-ratio: 1; border-radius: 50%; background: rgba(255, 220, 94, .9); box-shadow: 0 0 0 5px rgba(255,255,255,.12); }.gm .square.destination.capture::after{ width: 54%; background: transparent; border: 5px solid #ffd65c; box-shadow: none; }.gm .square.selected{ background: #987040; }.gm .square.last-move{ box-shadow: inset 0 0 0 4px rgba(22,184,196,.65); }.gm .square:focus-visible{ z-index: 2; outline: 4px solid #fff; outline-offset: -4px; }.gm .piece{ position: relative; z-index: 1; width: 70%; aspect-ratio: 1; border-radius: 50%; border: clamp(2px, .5vw, 5px) solid rgba(255,255,255,.36); box-shadow: inset 0 -8px 0 rgba(0,0,0,.2), 0 6px 10px rgba(0,0,0,.3); transition: transform .15s ease; pointer-events: none; }.gm .selectable .piece:hover,.gm .selected .piece{ transform: translateY(-3px) scale(1.04); }.gm .piece.red-piece{ background: var(--red-piece); }.gm .piece.black-piece{ background: var(--black-piece); }.gm .piece.king::after{ content: \"\u265b\"; position: absolute; inset: 0; display: grid; place-items: center; color: #ffd76a; font-size: clamp(18px, 4.4vw, 38px); line-height: 1; text-shadow: 0 2px 1px rgba(0,0,0,.35); }.gm .game-overlay{ position: absolute; inset: 0; z-index: 5; display: grid; place-items: center; padding: 20px; background: rgba(17,24,39,.78); backdrop-filter: blur(3px); }.gm .game-overlay[hidden]{ display: none; }.gm .overlay-card{ width: min(360px, 92%); padding: 28px; border-radius: 18px; background: #fff; text-align: center; box-shadow: 0 24px 60px rgba(0,0,0,.28); }.gm .result-icon{ display: grid; place-items: center; width: 64px; height: 64px; margin: 0 auto 14px; border-radius: 50%; background: #fff3cf; color: #9a6500; font-size: 34px; }.gm .overlay-card h2{ margin-bottom: 8px; }.gm .overlay-card p{ margin-bottom: 20px; color: var(--muted); }.gm .status-bar{ min-height: 56px; display: flex; gap: 10px; align-items: center; justify-content: center; padding: 12px 20px; border-top: 1px solid #303b4c; background: #151d2a; color: #fff; text-align: center; font-weight: 700; }.gm .status-dot{ width: 9px; height: 9px; flex: 0 0 auto; border-radius: 50%; background: var(--success); box-shadow: 0 0 0 5px rgba(34,197,94,.12); }.gm .status-bar.alert .status-dot{ background: var(--action); box-shadow: 0 0 0 5px rgba(255,184,77,.13); }.gm .quick-controls{ display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; padding: 20px 24px; background: #fbfbfd; }.gm .quick-controls > div{ display: flex; gap: 10px; align-items: center; color: var(--muted); font-size: 14px; }.gm .control-number{ width: 28px; height: 28px; display: grid; place-items: center; flex: 0 0 auto; border-radius: 9px; background: #ededff; color: var(--primary-dark); font-size: 13px; font-weight: 800; }.gm .rules-grid{ display: grid; grid-template-columns: repeat(2, 1fr); gap: 18px; margin-top: 32px; }.gm .rules-grid article{ border: 1px solid var(--border); border-radius: 16px; background: #fff; }.gm .rules-grid article{ padding: 22px; }.gm .rules-grid p{ margin-bottom: 0; color: var(--muted); }.gm .rule-icon{ width: 44px; height: 44px; display: grid; place-items: center; margin-bottom: 16px; border-radius: 12px; background: #ededff; color: var(--primary-dark); font-size: 21px; font-weight: 800; }.gm .note-card{ margin-top: 24px; padding: 22px 24px; border-left: 4px solid var(--accent); border-radius: 0 14px 14px 0; background: #eefdff; }.gm .note-card strong{ font-size: 19px; }.gm .note-card p{ margin: 5px 0 0; color: #43536a; }.gm .soft-section{ width: 100vw; margin-left: calc(50% - 50vw); padding-inline: max(20px, calc((100vw - 900px) / 2)); background: #fff; }.gm .strategy-list{ display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px 28px; padding: 0; list-style: none; }.gm .strategy-list li{ position: relative; padding: 18px 18px 18px 48px; border-radius: 14px; background: var(--background); color: var(--muted); }.gm .strategy-list li::before{ content: \"\u2713\"; position: absolute; top: 18px; left: 18px; width: 22px; height: 22px; display: grid; place-items: center; border-radius: 50%; background: #dcfce7; color: #15803d; font-size: 13px; font-weight: 800; }.gm .strategy-list strong{ color: var(--text); }.gm details{ border-top: 1px solid var(--border); }.gm details:last-child{ border-bottom: 1px solid var(--border); }.gm summary{ position: relative; padding: 19px 44px 19px 0; cursor: pointer; font-size: 18px; font-weight: 800; list-style: none; }.gm summary::-webkit-details-marker{ display: none; }.gm summary::after{ content: \"+\"; position: absolute; right: 8px; top: 15px; color: var(--primary); font-size: 26px; }.gm details[open] summary::after{ content: \"\u2212\"; }.gm details p{ padding-right: 40px; color: var(--muted); }@media (max-width: 760px){.gm .page-shell{ width: min(100% - 28px, 1160px); }.gm .category-badge{ display: none; }.gm .game-card{ border-radius: 16px; }.gm .game-toolbar{ grid-template-columns: 1fr auto; gap: 12px; padding: 14px; }.gm .piece-counts{ grid-column: 1 / -1; grid-row: 2; justify-content: space-between; padding-top: 12px; border-top: 1px solid var(--border); }.gm .game-stage{ padding: 18px 8px 16px; }.gm .board{ border-width: 6px; border-radius: 9px; }.gm .square.selectable::before{ inset: 5%; border-width: 2px; border-radius: 6px; }.gm .square.last-move{ box-shadow: inset 0 0 0 3px rgba(22,184,196,.65); }.gm .piece{ width: 73%; border-width: 2px; box-shadow: inset 0 -5px 0 rgba(0,0,0,.2), 0 3px 6px rgba(0,0,0,.28); }.gm .piece.king::after{ font-size: clamp(17px, 7vw, 30px); }.gm .quick-controls{ grid-template-columns: 1fr; padding: 16px; }.gm .rules-grid,.gm .strategy-list{ grid-template-columns: 1fr; }}@media (max-width: 420px){.gm .turn-piece{ width: 36px; height: 36px; }.gm .turn-panel strong{ font-size: 17px; }.gm .button{ min-height: 44px; padding-inline: 14px; }.gm .piece-counts > div{ font-size: 13px; }.gm .status-bar{ font-size: 14px; }}@media (prefers-reduced-motion: reduce){.gm *,.gm *::before,.gm *::after{ scroll-behavior: auto !important; transition-duration: .01ms !important; }}";
function __ready(f){f()}
function boot(){
"use strict";

(() => {
  const EMPTY = null;
  const RED = "red";
  const BLACK = "black";
  const BOARD_SIZE = 8;
  const DRAW_TURN_LIMIT = 80;

  const boardElement = document.getElementById("game-board");
  const turnPanel = document.getElementById("turn-panel");
  const turnPiece = document.getElementById("turn-piece");
  const turnText = document.getElementById("turn-text");
  const redCount = document.getElementById("red-count");
  const blackCount = document.getElementById("black-count");
  const statusText = document.getElementById("status-text");
  const statusBar = statusText.closest(".status-bar");
  const newGameButton = document.getElementById("new-game-button");
  const playAgainButton = document.getElementById("play-again-button");
  const overlay = document.getElementById("game-overlay");
  const resultTitle = document.getElementById("result-title");
  const resultMessage = document.getElementById("result-message");
  const resultIcon = document.getElementById("result-icon");

  let board = [];
  let currentPlayer = RED;
  let selected = null;
  let forcedPiece = null;
  let legalMoves = [];
  let lastMove = null;
  let gameOver = false;
  let quietTurns = 0;
  let positionHistory = new Map();

  function createInitialBoard() {
    return Array.from({ length: BOARD_SIZE }, (_, row) =>
      Array.from({ length: BOARD_SIZE }, (_, col) => {
        if ((row + col) % 2 === 0) return EMPTY;
        if (row < 3) return { color: BLACK, king: false };
        if (row > 4) return { color: RED, king: false };
        return EMPTY;
      })
    );
  }

  function startGame() {
    board = createInitialBoard();
    currentPlayer = RED;
    selected = null;
    forcedPiece = null;
    legalMoves = [];
    lastMove = null;
    gameOver = false;
    quietTurns = 0;
    positionHistory = new Map();
    overlay.hidden = true;
    recordPosition();
    setStatus("Red moves first. Select a piece to begin.", false);
    render();
  }

  function isInside(row, col) {
    return row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE;
  }

  function directionsFor(piece) {
    if (piece.king) return [[-1, -1], [-1, 1], [1, -1], [1, 1]];
    return piece.color === RED ? [[-1, -1], [-1, 1]] : [[1, -1], [1, 1]];
  }

  function movesForPiece(row, col, capturesOnly = false) {
    const piece = board[row][col];
    if (!piece) return [];

    const moves = [];
    for (const [rowStep, colStep] of directionsFor(piece)) {
      const nextRow = row + rowStep;
      const nextCol = col + colStep;
      if (!isInside(nextRow, nextCol)) continue;

      if (!capturesOnly && board[nextRow][nextCol] === EMPTY) {
        moves.push({ from: { row, col }, to: { row: nextRow, col: nextCol }, capture: null });
      }

      const landingRow = row + rowStep * 2;
      const landingCol = col + colStep * 2;
      const jumpedPiece = board[nextRow][nextCol];
      if (
        isInside(landingRow, landingCol) &&
        jumpedPiece &&
        jumpedPiece.color !== piece.color &&
        board[landingRow][landingCol] === EMPTY
      ) {
        moves.push({
          from: { row, col },
          to: { row: landingRow, col: landingCol },
          capture: { row: nextRow, col: nextCol }
        });
      }
    }
    return capturesOnly ? moves.filter((move) => move.capture) : moves;
  }

  function allMovesForPlayer(color) {
    const normalMoves = [];
    const captures = [];
    for (let row = 0; row < BOARD_SIZE; row += 1) {
      for (let col = 0; col < BOARD_SIZE; col += 1) {
        const piece = board[row][col];
        if (!piece || piece.color !== color) continue;
        for (const move of movesForPiece(row, col)) {
          (move.capture ? captures : normalMoves).push(move);
        }
      }
    }
    return captures.length ? captures : normalMoves;
  }

  function sameSquare(a, b) {
    return Boolean(a && b && a.row === b.row && a.col === b.col);
  }

  function handleSquare(row, col) {
    if (gameOver) return;

    const clickedPiece = board[row][col];
    const destinationMove = legalMoves.find((move) => sameSquare(move.to, { row, col }));
    if (selected && destinationMove) {
      makeMove(destinationMove);
      return;
    }

    if (forcedPiece) {
      setStatus("Continue the capture with the highlighted piece.", true);
      return;
    }

    if (clickedPiece && clickedPiece.color === currentPlayer) {
      selectPiece(row, col);
      return;
    }

    selected = null;
    legalMoves = [];
    const playerMoves = allMovesForPlayer(currentPlayer);
    const captureRequired = playerMoves.some((move) => move.capture);
    setStatus(captureRequired ? "A capture is available and must be played." : `${capitalize(currentPlayer)}: select one of your pieces.`, captureRequired);
    render();
  }

  function selectPiece(row, col) {
    const allMoves = allMovesForPlayer(currentPlayer);
    const pieceMoves = allMoves.filter((move) => sameSquare(move.from, { row, col }));
    const captureRequired = allMoves.some((move) => move.capture);

    if (!pieceMoves.length) {
      selected = null;
      legalMoves = [];
      setStatus(captureRequired ? "That piece cannot capture. Choose a highlighted piece." : "That piece has no legal move.", true);
    } else {
      selected = { row, col };
      legalMoves = pieceMoves;
      setStatus(captureRequired ? "Capture required. Choose a highlighted landing square." : "Choose a highlighted square.", captureRequired);
    }
    render();
  }

  function makeMove(move) {
    const piece = board[move.from.row][move.from.col];
    board[move.from.row][move.from.col] = EMPTY;
    board[move.to.row][move.to.col] = piece;

    let captured = false;
    if (move.capture) {
      board[move.capture.row][move.capture.col] = EMPTY;
      captured = true;
    }

    const wasKing = piece.king;
    const reachedKingRow = !piece.king && ((piece.color === RED && move.to.row === 0) || (piece.color === BLACK && move.to.row === 7));
    if (reachedKingRow) piece.king = true;

    lastMove = { from: move.from, to: move.to };

    // Under American Checkers rules, crowning ends a capturing turn.
    if (captured && !reachedKingRow) {
      const nextCaptures = movesForPiece(move.to.row, move.to.col, true);
      if (nextCaptures.length) {
        selected = { row: move.to.row, col: move.to.col };
        forcedPiece = selected;
        legalMoves = nextCaptures;
        setStatus("Multi-jump! Continue capturing with the same piece.", true);
        render();
        return;
      }
    }

    quietTurns = (captured || (!wasKing && piece.king)) ? 0 : quietTurns + 1;
    finishTurn();
  }

  function finishTurn() {
    selected = null;
    forcedPiece = null;
    legalMoves = [];
    currentPlayer = currentPlayer === RED ? BLACK : RED;

    const counts = countPieces();
    if (counts[currentPlayer] === 0) {
      endGame(currentPlayer === RED ? BLACK : RED, `${capitalize(currentPlayer)} has no pieces remaining.`);
      return;
    }

    const nextMoves = allMovesForPlayer(currentPlayer);
    if (!nextMoves.length) {
      endGame(currentPlayer === RED ? BLACK : RED, `${capitalize(currentPlayer)} has no legal moves.`);
      return;
    }

    const repetitionCount = recordPosition();
    if (repetitionCount >= 3) {
      endGame(null, "The same position occurred three times.");
      return;
    }
    if (quietTurns >= DRAW_TURN_LIMIT) {
      endGame(null, "No capture or promotion occurred for 80 turns.");
      return;
    }

    const captureRequired = nextMoves.some((move) => move.capture);
    setStatus(captureRequired ? `${capitalize(currentPlayer)} must capture.` : `${capitalize(currentPlayer)} to move.`, captureRequired);
    render();
  }

  function countPieces() {
    const counts = { red: 0, black: 0 };
    for (const row of board) {
      for (const piece of row) if (piece) counts[piece.color] += 1;
    }
    return counts;
  }

  function positionKey() {
    const cells = board.flat().map((piece) => {
      if (!piece) return ".";
      if (piece.color === RED) return piece.king ? "R" : "r";
      return piece.king ? "B" : "b";
    }).join("");
    return `${currentPlayer}:${cells}`;
  }

  function recordPosition() {
    const key = positionKey();
    const count = (positionHistory.get(key) || 0) + 1;
    positionHistory.set(key, count);
    return count;
  }

  function endGame(winner, reason) {
    gameOver = true;
    selected = null;
    forcedPiece = null;
    legalMoves = [];

    if (winner) {
      resultTitle.textContent = `${capitalize(winner)} wins!`;
      resultMessage.textContent = reason;
      resultIcon.textContent = "♛";
      setStatus(`${capitalize(winner)} wins. ${reason}`, false);
    } else {
      resultTitle.textContent = "Draw game";
      resultMessage.textContent = reason;
      resultIcon.textContent = "=";
      setStatus(`Draw. ${reason}`, false);
    }
    render();
    overlay.hidden = false;
    playAgainButton.focus();
  }

  function setStatus(message, alert) {
    statusText.textContent = message;
    statusBar.classList.toggle("alert", Boolean(alert));
  }

  function capitalize(value) {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  function notation(row, col) {
    return `${String.fromCharCode(65 + col)}${8 - row}`;
  }

  function render() {
    const allMoves = gameOver ? [] : allMovesForPlayer(currentPlayer);
    const selectableKeys = new Set(allMoves.map((move) => `${move.from.row}-${move.from.col}`));
    const destinationMap = new Map(legalMoves.map((move) => [`${move.to.row}-${move.to.col}`, move]));
    const fragment = document.createDocumentFragment();

    for (let row = 0; row < BOARD_SIZE; row += 1) {
      for (let col = 0; col < BOARD_SIZE; col += 1) {
        const square = document.createElement("button");
        const playable = (row + col) % 2 === 1;
        const piece = board[row][col];
        const key = `${row}-${col}`;
        const destination = destinationMap.get(key);

        square.type = "button";
        square.className = `square ${playable ? "playable" : "light"}`;
        square.setAttribute("role", "gridcell");
        square.dataset.row = String(row);
        square.dataset.col = String(col);

        if (sameSquare(selected, { row, col })) square.classList.add("selected");
        if (lastMove && (sameSquare(lastMove.from, { row, col }) || sameSquare(lastMove.to, { row, col }))) square.classList.add("last-move");
        if (selectableKeys.has(key) && (!forcedPiece || sameSquare(forcedPiece, { row, col }))) square.classList.add("selectable");
        if (destination) {
          square.classList.add("destination");
          if (destination.capture) square.classList.add("capture");
        }

        if (piece) {
          const pieceElement = document.createElement("span");
          pieceElement.className = `piece ${piece.color}-piece${piece.king ? " king" : ""}`;
          pieceElement.setAttribute("aria-hidden", "true");
          square.appendChild(pieceElement);
        }

        const contents = piece ? `${capitalize(piece.color)} ${piece.king ? "king" : "piece"}` : "empty";
        let action = "";
        if (destination) action = destination.capture ? ", legal capture destination" : ", legal move destination";
        else if (selectableKeys.has(key)) action = ", selectable";
        square.setAttribute("aria-label", `${notation(row, col)}, ${contents}${action}`);
        square.disabled = !playable || gameOver;
        fragment.appendChild(square);
      }
    }

    boardElement.replaceChildren(fragment);
    const counts = countPieces();
    redCount.textContent = String(counts.red);
    blackCount.textContent = String(counts.black);
    turnText.textContent = gameOver ? "Game finished" : `${capitalize(currentPlayer)} to move`;
    turnPiece.className = `turn-piece ${currentPlayer === RED ? "red" : "dark"}`;
    turnPanel.setAttribute("aria-label", gameOver ? "Game finished" : `${capitalize(currentPlayer)} to move`);
  }

  boardElement.addEventListener("click", (event) => {
    const square = event.target.closest(".square");
    if (!square || square.disabled) return;
    handleSquare(Number(square.dataset.row), Number(square.dataset.col));
  });

  newGameButton.addEventListener("click", startGame);
  playAgainButton.addEventListener("click", startGame);

  startGame();
})();


}
function begin(){poster.hidden=true;gm.hidden=false;if(!booted){booted=true;var s=document.createElement("style");s.textContent=LOOK;document.head.appendChild(s);boot();}else{var r=document.getElementById("new-game-button");if(r)r.click();}}
poster.addEventListener("click",begin);
var nb=document.getElementById("new");if(nb)nb.addEventListener("click",begin);
})();
