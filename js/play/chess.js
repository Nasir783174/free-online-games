/* Chess - game logic + its own look. Layout lives in style.css; page shell lives in the HTML. */
(function(){"use strict";
var gm=document.getElementById("gm"),poster=document.getElementById("poster"),booted=false;
var LOOK=".gm{\n  \n  \n  --accent: #16b8c4;\n  --action: #ffb84d;\n  --success: #22c55e;\n  --danger: #ef5b5b;\n  --page: #f6f7fb;\n  \n  \n  \n  \n  --board-dark: #6f523d;\n  --board-light: #e8d6ba;\n  --board-edge: #2f241d;\n  \n}.gm *{ box-sizing: border-box; }.gm button,.gm input{ font: inherit; }.gm .browse-link{ font-weight: 700; }.gm .page-shell{ width: min(1180px, calc(100% - 40px)); margin: 0 auto; }.gm h2,.gm h3{ margin-top: 0; line-height: 1.15; }.gm h2{ margin-bottom: 18px; font-size: clamp(28px, 4vw, 35px); font-weight: 700; letter-spacing: -.02em; }.gm h3{ margin: 30px 0 12px; font-size: 22px; font-weight: 700; }.gm .section-intro{ margin: 0; color: var(--muted); font-size: 18px; }.gm .game-card{ padding: 24px; border: 1px solid var(--border); border-radius: 20px; background: var(--card); box-shadow: var(--shadow); }.gm .game-toolbar{ display: flex; align-items: center; justify-content: space-between; gap: 24px; padding-bottom: 22px; border-bottom: 1px solid var(--border); }.gm .toolbar-label,.gm .panel-label{ display: block; color: var(--muted); font-size: 14px; font-weight: 700; }.gm .game-toolbar h2{ margin: 3px 0 0; font-size: 24px; }.gm .game-actions,.gm .modal-actions{ display: flex; gap: 10px; }.gm .button{ min-height: 46px; padding: 0 20px; border: 2px solid transparent; border-radius: 12px; cursor: pointer; font-size: 16px; font-weight: 800; transition: transform .15s ease, background .15s ease, border-color .15s ease; }.gm .button:hover:not(:disabled){ transform: translateY(-1px); }.gm .button:focus-visible,.gm .text-button:focus-visible,.gm .square:focus-visible,.gm summary:focus-visible{ outline: 3px solid rgba(91, 92, 226, .4); outline-offset: 3px; }.gm .button-primary{ background: var(--brand); color: #fff; }.gm .button-primary:hover{ background: var(--brand-dark); }.gm .button-secondary{ border-color: var(--border); background: #fff; color: var(--text); }.gm .button-secondary:hover:not(:disabled){ border-color: #bec3d0; background: #fafaff; }.gm .button:disabled{ cursor: not-allowed; opacity: .48; }.gm .game-layout{ display: grid; grid-template-columns: minmax(0, 720px) minmax(230px, 1fr); gap: 28px; padding-top: 26px; align-items: start; }.gm .board-column{ min-width: 0; }.gm .player-bar{ display: flex; align-items: center; gap: 12px; max-width: 680px; margin: 0 auto; padding: 10px 14px; border: 1px solid var(--border); border-radius: 12px; background: #f9fafc; }.gm .player-bar.active{ border-color: rgba(91, 92, 226, .45); box-shadow: 0 0 0 3px rgba(91, 92, 226, .09); }.gm .player-piece{ display: grid; place-items: center; width: 36px; height: 36px; border-radius: 9px; font-size: 27px; line-height: 1; }.gm .player-dark .player-piece{ background: #232735; color: #fff; }.gm .player-light .player-piece{ background: #fff; color: #232735; border: 1px solid #d9dbe3; }.gm .player-bar span:last-child{ display: flex; flex-direction: column; line-height: 1.25; }.gm .player-bar small{ color: var(--muted); font-size: 13px; }.gm .board-wrap{ width: min(100%, 680px); margin: 12px auto; padding: 10px; border-radius: 16px; background: var(--board-edge); box-shadow: 0 14px 30px rgba(34, 26, 20, .2); }.gm .chess-board{ display: grid; grid-template-columns: repeat(8, 1fr); width: 100%; aspect-ratio: 1; overflow: hidden; border-radius: 7px; touch-action: manipulation; user-select: none; }.gm .square{ position: relative; display: grid; place-items: center; width: 100%; aspect-ratio: 1; padding: 0; border: 0; border-radius: 0; cursor: pointer; color: #17130f; font-family: \"Times New Roman\", serif; font-size: clamp(31px, 7vw, 60px); line-height: 1; text-shadow: 0 1px 0 rgba(255,255,255,.2); }.gm .square.light{ background: var(--board-light); }.gm .square.dark{ background: var(--board-dark); }.gm .square.white-piece{ color: #fffdf8; text-shadow: 0 1px 1px #2f261f, 0 0 1px #2f261f; }.gm .square.black-piece{ color: #1d1a18; text-shadow: 0 1px 0 rgba(255,255,255,.18); }.gm .square.selected::after{ content: \"\"; position: absolute; inset: 5px; border: 4px solid var(--action); border-radius: 8px; pointer-events: none; }.gm .square.legal::before{ content: \"\"; position: absolute; z-index: 1; width: 25%; height: 25%; border-radius: 50%; background: rgba(22, 184, 196, .78); pointer-events: none; }.gm .square.legal.capture::before{ width: 76%; height: 76%; border: 5px solid rgba(22, 184, 196, .88); background: transparent; }.gm .square.last-move{ box-shadow: inset 0 0 0 999px rgba(255, 184, 77, .23); }.gm .square.in-check{ box-shadow: inset 0 0 0 999px rgba(239, 91, 91, .44); }.gm .piece{ position: relative; z-index: 2; transform: translateY(-1px); }.gm .coordinate{ position: absolute; z-index: 3; color: rgba(32, 26, 21, .62); font-family: \"Nunito Sans\", sans-serif; font-size: clamp(8px, 1.4vw, 12px); font-weight: 800; line-height: 1; }.gm .rank-label{ top: 5px; left: 5px; }.gm .file-label{ right: 5px; bottom: 4px; }.gm .game-panel{ overflow: hidden; border: 1px solid var(--border); border-radius: 16px; background: #f9fafc; }.gm .panel-section{ padding: 18px; border-bottom: 1px solid var(--border); }.gm .panel-section:last-child{ border-bottom: 0; }.gm .turn-card{ display: flex; align-items: center; gap: 12px; }.gm .turn-dot{ width: 28px; height: 28px; border: 2px solid #303440; border-radius: 50%; }.gm .turn-dot.white{ background: #fff; }.gm .turn-dot.black{ background: #262a36; }.gm .turn-card strong,.gm #material-balance{ display: block; font-size: 19px; }.gm .panel-heading{ display: flex; align-items: center; justify-content: space-between; }.gm .text-button{ padding: 2px 4px; border: 0; background: none; color: var(--brand-dark); cursor: pointer; font-size: 13px; font-weight: 800; }.gm .text-button:disabled{ cursor: default; color: #a8adba; }.gm .move-list{ max-height: 362px; margin: 12px 0 0; padding: 0; overflow-y: auto; list-style: none; counter-reset: moves; }.gm .move-list li:not(.empty-history){ display: grid; grid-template-columns: 32px 1fr 1fr; gap: 6px; padding: 7px 4px; border-bottom: 1px solid #eceef3; font-size: 14px; }.gm .move-list li:not(.empty-history)::before{ content: attr(data-move); color: var(--muted); font-weight: 700; }.gm .empty-history{ padding: 18px 0; color: var(--muted); font-size: 14px; text-align: center; }.gm .control-hint{ margin: 24px 0 0; padding: 14px 16px; border-radius: 12px; background: #f3f3ff; color: #4f5362; font-size: 15px; }.gm .feature-list{ padding: 0; list-style: none; }.gm .feature-list span{ display: inline-grid; place-items: center; width: 22px; height: 22px; margin-right: 7px; border-radius: 50%; background: #dcfce7; color: #15803d; font-size: 13px; font-weight: 800; }.gm .muted-section{ margin-top: 64px; padding: 52px; border: 0; border-radius: 18px; background: #eef0fb; }.gm .tips-grid{ display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; margin-top: 22px; }.gm .tips-grid div{ padding: 20px; border: 1px solid rgba(91,92,226,.13); border-radius: 14px; background: rgba(255,255,255,.75); }.gm .tips-grid strong,.gm .tips-grid span{ display: block; }.gm .tips-grid span{ margin-top: 5px; color: var(--muted); font-size: 15px; line-height: 1.5; }.gm details{ max-width: 850px; padding: 18px 0; border-bottom: 1px solid var(--border); }.gm summary{ cursor: pointer; font-size: 18px; font-weight: 800; }.gm details p{ margin-bottom: 0; }.gm .modal[hidden]{ display: none; }.gm .modal{ position: fixed; inset: 0; z-index: 20; display: grid; place-items: center; padding: 20px; background: rgba(17, 24, 39, .72); backdrop-filter: blur(4px); }.gm .modal-card{ width: min(430px, 100%); padding: 30px; border-radius: 18px; background: #fff; box-shadow: 0 24px 60px rgba(0,0,0,.28); text-align: center; }.gm .modal-card h2{ margin-bottom: 8px; font-size: 29px; }.gm .modal-card p{ margin: 0 0 22px; color: var(--muted); }.gm .promotion-options{ display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }.gm .promotion-option{ display: grid; place-items: center; aspect-ratio: 1; border: 2px solid var(--border); border-radius: 12px; background: #f9fafc; cursor: pointer; color: #20232e; font-family: \"Times New Roman\", serif; font-size: 46px; }.gm .promotion-option:hover,.gm .promotion-option:focus-visible{ border-color: var(--brand); background: #f1f1ff; outline: none; }.gm .result-icon{ display: block; margin-bottom: 6px; color: var(--brand); font-size: 58px; line-height: 1; }.gm .modal-actions{ justify-content: center; }.gm .toast{ position: fixed; right: 22px; bottom: 22px; z-index: 30; padding: 11px 16px; border-radius: 10px; background: #1f2937; color: #fff; font-size: 14px; font-weight: 700; opacity: 0; pointer-events: none; transform: translateY(10px); transition: opacity .2s, transform .2s; }.gm .toast.show{ opacity: 1; transform: translateY(0); }@media (max-width: 900px){.gm .game-layout{ grid-template-columns: 1fr; }.gm .game-panel{ display: grid; grid-template-columns: 1fr 1fr; }.gm .move-section{ grid-column: 1 / -1; }.gm .move-list{ max-height: 180px; }.gm .tips-grid{ grid-template-columns: 1fr; }}@media (max-width: 680px){.gm .page-shell{ width: min(100% - 24px, 1180px); }.gm .game-card{ padding: 14px; border-radius: 16px; }.gm .game-toolbar{ align-items: flex-start; flex-direction: column; gap: 14px; }.gm .game-actions{ width: 100%; }.gm .game-actions .button{ flex: 1; padding: 0 12px; }.gm .game-layout{ gap: 20px; padding-top: 18px; }.gm .board-wrap{ padding: 6px; border-radius: 11px; }.gm .square.selected::after{ inset: 3px; border-width: 3px; }.gm .square.legal.capture::before{ border-width: 3px; }.gm .player-bar{ padding: 8px 10px; }.gm .player-piece{ width: 31px; height: 31px; font-size: 23px; }.gm .control-hint{ margin-top: 18px; }.gm .muted-section{ margin-top: 36px; padding: 30px 22px; }}@media (max-width: 390px){.gm .browse-link{ font-size: 14px; }.gm .game-panel{ grid-template-columns: 1fr; }.gm .move-section{ grid-column: auto; }.gm .coordinate{ display: none; }.gm .modal-actions{ flex-direction: column; }}@media (prefers-reduced-motion: reduce){.gm *,.gm *::before,.gm *::after{ scroll-behavior: auto !important; transition: none !important; }}.gm .game-card{ padding: 12px 18px; }.gm .game-toolbar{ padding-bottom: 10px; }.gm .game-toolbar h2{ font-size: 21px; }.gm .button{ min-height: 38px; padding: 0 16px; }.gm .game-layout{ padding-top: 12px; gap: 20px; }.gm .player-bar{ padding: 5px 12px; }.gm .board-wrap{ margin: 8px auto; padding: 8px; }.gm .panel-section{ padding: 12px 16px; }.gm .move-list{ max-height: 220px; }.gm .control-hint{ display: none; }";
function __ready(f){f()}
function boot(){
"use strict";

const PIECES = {
  white: { k: "♔", q: "♕", r: "♖", b: "♗", n: "♘", p: "♙" },
  black: { k: "♚", q: "♛", r: "♜", b: "♝", n: "♞", p: "♟" }
};
const NAMES = { k: "king", q: "queen", r: "rook", b: "bishop", n: "knight", p: "pawn" };
const VALUES = { q: 9, r: 5, b: 3, n: 3, p: 1, k: 0 };
const FILES = "abcdefgh";

const boardElement = document.getElementById("chess-board");
const statusElement = document.getElementById("game-status");
const turnLabel = document.getElementById("turn-label");
const turnDot = document.getElementById("turn-dot");
const whitePlayer = document.getElementById("white-player");
const blackPlayer = document.getElementById("black-player");
const whiteMaterial = document.getElementById("white-material");
const blackMaterial = document.getElementById("black-material");
const materialBalance = document.getElementById("material-balance");
const moveList = document.getElementById("move-list");
const undoButton = document.getElementById("undo-button");
const newGameButton = document.getElementById("new-game-button");
const copyMovesButton = document.getElementById("copy-moves-button");
const promotionModal = document.getElementById("promotion-modal");
const promotionOptions = document.getElementById("promotion-options");
const gameOverModal = document.getElementById("game-over-modal");
const gameOverTitle = document.getElementById("game-over-title");
const gameOverMessage = document.getElementById("game-over-message");
const resultIcon = document.getElementById("result-icon");
const reviewButton = document.getElementById("review-button");
const playAgainButton = document.getElementById("play-again-button");
const toast = document.getElementById("toast");

let game;
let pendingPromotion = null;
let toastTimer;

function createInitialBoard() {
  const board = Array.from({ length: 8 }, () => Array(8).fill(null));
  const order = ["r", "n", "b", "q", "k", "b", "n", "r"];
  for (let c = 0; c < 8; c += 1) {
    board[0][c] = piece(order[c], "black");
    board[1][c] = piece("p", "black");
    board[6][c] = piece("p", "white");
    board[7][c] = piece(order[c], "white");
  }
  return board;
}

function piece(type, color) {
  return { type, color, moved: false };
}

function resetGame() {
  game = {
    board: createInitialBoard(),
    turn: "white",
    selected: null,
    legalMoves: [],
    lastMove: null,
    enPassant: null,
    halfmoveClock: 0,
    moveHistory: [],
    snapshots: [],
    positions: new Map(),
    over: false
  };
  game.positions.set(positionKey(game), 1);
  pendingPromotion = null;
  promotionModal.hidden = true;
  gameOverModal.hidden = true;
  render();
}

function cloneBoard(board) {
  return board.map(row => row.map(item => item ? { ...item } : null));
}

function snapshot() {
  return {
    board: cloneBoard(game.board),
    turn: game.turn,
    lastMove: game.lastMove ? { from: { ...game.lastMove.from }, to: { ...game.lastMove.to } } : null,
    enPassant: game.enPassant ? { ...game.enPassant } : null,
    halfmoveClock: game.halfmoveClock,
    moveHistory: game.moveHistory.slice(),
    positions: Array.from(game.positions.entries()),
    over: game.over
  };
}

function restore(data) {
  game.board = cloneBoard(data.board);
  game.turn = data.turn;
  game.selected = null;
  game.legalMoves = [];
  game.lastMove = data.lastMove;
  game.enPassant = data.enPassant;
  game.halfmoveClock = data.halfmoveClock;
  game.moveHistory = data.moveHistory.slice();
  game.positions = new Map(data.positions);
  game.over = data.over;
}

function inside(r, c) {
  return r >= 0 && r < 8 && c >= 0 && c < 8;
}

function opposite(color) {
  return color === "white" ? "black" : "white";
}

function squareName(r, c) {
  return `${FILES[c]}${8 - r}`;
}

function getPseudoMoves(board, r, c, includeCastling = true) {
  const moving = board[r][c];
  if (!moving) return [];
  const moves = [];
  const add = (toR, toC, extras = {}) => {
    if (!inside(toR, toC)) return false;
    const target = board[toR][toC];
    if (!target) {
      moves.push({ r: toR, c: toC, ...extras });
      return true;
    }
    if (target.color !== moving.color && target.type !== "k") moves.push({ r: toR, c: toC, capture: true, ...extras });
    return false;
  };

  if (moving.type === "p") {
    const direction = moving.color === "white" ? -1 : 1;
    const start = moving.color === "white" ? 6 : 1;
    const promotionRow = moving.color === "white" ? 0 : 7;
    if (inside(r + direction, c) && !board[r + direction][c]) {
      add(r + direction, c, { promotion: r + direction === promotionRow });
      if (r === start && !board[r + direction * 2][c]) add(r + direction * 2, c, { doublePawn: true });
    }
    for (const dc of [-1, 1]) {
      const nr = r + direction;
      const nc = c + dc;
      if (!inside(nr, nc)) continue;
      const target = board[nr][nc];
      if (target && target.color !== moving.color && target.type !== "k") {
        add(nr, nc, { capture: true, promotion: nr === promotionRow });
      } else if (game.enPassant && game.enPassant.r === nr && game.enPassant.c === nc) {
        moves.push({ r: nr, c: nc, capture: true, enPassant: true });
      }
    }
  }

  if (moving.type === "n") {
    for (const [dr, dc] of [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]]) add(r + dr, c + dc);
  }

  if (["b", "r", "q"].includes(moving.type)) {
    const directions = [];
    if (["b", "q"].includes(moving.type)) directions.push([-1,-1],[-1,1],[1,-1],[1,1]);
    if (["r", "q"].includes(moving.type)) directions.push([-1,0],[1,0],[0,-1],[0,1]);
    for (const [dr, dc] of directions) {
      let nr = r + dr;
      let nc = c + dc;
      while (inside(nr, nc)) {
        if (!add(nr, nc)) break;
        nr += dr;
        nc += dc;
      }
    }
  }

  if (moving.type === "k") {
    for (let dr = -1; dr <= 1; dr += 1) {
      for (let dc = -1; dc <= 1; dc += 1) {
        if (dr || dc) add(r + dr, c + dc);
      }
    }
    if (includeCastling && !moving.moved && !isKingInCheck(board, moving.color)) {
      const enemy = opposite(moving.color);
      const rookKing = board[r][7];
      if (rookKing && rookKing.type === "r" && rookKing.color === moving.color && !rookKing.moved && !board[r][5] && !board[r][6] && !isSquareAttacked(board, r, 5, enemy) && !isSquareAttacked(board, r, 6, enemy)) {
        moves.push({ r, c: 6, castle: "king" });
      }
      const rookQueen = board[r][0];
      if (rookQueen && rookQueen.type === "r" && rookQueen.color === moving.color && !rookQueen.moved && !board[r][1] && !board[r][2] && !board[r][3] && !isSquareAttacked(board, r, 3, enemy) && !isSquareAttacked(board, r, 2, enemy)) {
        moves.push({ r, c: 2, castle: "queen" });
      }
    }
  }
  return moves;
}

function isSquareAttacked(board, r, c, byColor) {
  const pawnRow = r + (byColor === "white" ? 1 : -1);
  for (const dc of [-1, 1]) {
    if (inside(pawnRow, c + dc)) {
      const p = board[pawnRow][c + dc];
      if (p && p.color === byColor && p.type === "p") return true;
    }
  }
  for (const [dr, dc] of [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]]) {
    if (inside(r + dr, c + dc)) {
      const p = board[r + dr][c + dc];
      if (p && p.color === byColor && p.type === "n") return true;
    }
  }
  for (let dr = -1; dr <= 1; dr += 1) {
    for (let dc = -1; dc <= 1; dc += 1) {
      if ((dr || dc) && inside(r + dr, c + dc)) {
        const p = board[r + dr][c + dc];
        if (p && p.color === byColor && p.type === "k") return true;
      }
    }
  }
  const rays = [
    [-1,-1,["b","q"]],[-1,1,["b","q"]],[1,-1,["b","q"]],[1,1,["b","q"]],
    [-1,0,["r","q"]],[1,0,["r","q"]],[0,-1,["r","q"]],[0,1,["r","q"]]
  ];
  for (const [dr, dc, types] of rays) {
    let nr = r + dr;
    let nc = c + dc;
    while (inside(nr, nc)) {
      const p = board[nr][nc];
      if (p) {
        if (p.color === byColor && types.includes(p.type)) return true;
        break;
      }
      nr += dr;
      nc += dc;
    }
  }
  return false;
}

function findKing(board, color) {
  for (let r = 0; r < 8; r += 1) {
    for (let c = 0; c < 8; c += 1) {
      const p = board[r][c];
      if (p && p.color === color && p.type === "k") return { r, c };
    }
  }
  return null;
}

function isKingInCheck(board, color) {
  const king = findKing(board, color);
  return king ? isSquareAttacked(board, king.r, king.c, opposite(color)) : true;
}

function simulateMove(board, from, move, promotionType = "q") {
  const copy = cloneBoard(board);
  const moving = copy[from.r][from.c];
  copy[from.r][from.c] = null;
  if (move.enPassant) copy[from.r][move.c] = null;
  copy[move.r][move.c] = { ...moving, moved: true };
  if (move.promotion) copy[move.r][move.c].type = promotionType;
  if (move.castle === "king") {
    copy[from.r][5] = { ...copy[from.r][7], moved: true };
    copy[from.r][7] = null;
  } else if (move.castle === "queen") {
    copy[from.r][3] = { ...copy[from.r][0], moved: true };
    copy[from.r][0] = null;
  }
  return copy;
}

function legalMovesFor(r, c) {
  const moving = game.board[r][c];
  if (!moving) return [];
  return getPseudoMoves(game.board, r, c).filter(move => !isKingInCheck(simulateMove(game.board, { r, c }, move), moving.color));
}

function allLegalMoves(color) {
  const all = [];
  for (let r = 0; r < 8; r += 1) {
    for (let c = 0; c < 8; c += 1) {
      const p = game.board[r][c];
      if (p && p.color === color) {
        for (const move of legalMovesFor(r, c)) all.push({ from: { r, c }, move });
      }
    }
  }
  return all;
}

function handleSquare(r, c) {
  if (game.over || pendingPromotion) return;
  const target = game.board[r][c];
  if (game.selected) {
    const move = game.legalMoves.find(item => item.r === r && item.c === c);
    if (move) {
      if (move.promotion) openPromotion(game.selected, move);
      else commitMove(game.selected, move);
      return;
    }
  }
  if (target && target.color === game.turn) {
    game.selected = { r, c };
    game.legalMoves = legalMovesFor(r, c);
  } else {
    game.selected = null;
    game.legalMoves = [];
  }
  renderBoard();
}

function openPromotion(from, move) {
  pendingPromotion = { from: { ...from }, move: { ...move } };
  promotionOptions.innerHTML = "";
  for (const type of ["q", "r", "b", "n"]) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "promotion-option";
    button.textContent = PIECES[game.turn][type];
    button.setAttribute("aria-label", `Promote pawn to ${NAMES[type]}`);
    button.addEventListener("click", () => {
      const pending = pendingPromotion;
      pendingPromotion = null;
      promotionModal.hidden = true;
      commitMove(pending.from, pending.move, type);
    });
    promotionOptions.appendChild(button);
  }
  promotionModal.hidden = false;
  promotionOptions.querySelector("button").focus();
}

function commitMove(from, move, promotionType = "q") {
  const moving = game.board[from.r][from.c];
  const captured = move.enPassant ? game.board[from.r][move.c] : game.board[move.r][move.c];
  game.snapshots.push(snapshot());
  const beforeName = squareName(from.r, from.c);
  const afterName = squareName(move.r, move.c);
  game.board = simulateMove(game.board, from, move, promotionType);
  game.lastMove = { from: { ...from }, to: { r: move.r, c: move.c } };
  game.enPassant = move.doublePawn ? { r: (from.r + move.r) / 2, c: from.c } : null;
  game.halfmoveClock = moving.type === "p" || captured ? 0 : game.halfmoveClock + 1;
  game.turn = opposite(game.turn);
  game.selected = null;
  game.legalMoves = [];

  let notation;
  if (move.castle === "king") notation = "O-O";
  else if (move.castle === "queen") notation = "O-O-O";
  else {
    const mark = captured ? "×" : "–";
    notation = `${moving.type === "p" ? "" : moving.type.toUpperCase()}${beforeName}${mark}${afterName}`;
    if (move.promotion) notation += `=${promotionType.toUpperCase()}`;
    if (move.enPassant) notation += " e.p.";
  }

  const inCheck = isKingInCheck(game.board, game.turn);
  const responses = allLegalMoves(game.turn);
  if (inCheck && responses.length === 0) notation += "#";
  else if (inCheck) notation += "+";
  game.moveHistory.push(notation);

  const key = positionKey(game);
  game.positions.set(key, (game.positions.get(key) || 0) + 1);
  render();
  evaluateGame(inCheck, responses.length, key);
}

function positionKey(state) {
  const placement = state.board.map(row => row.map(p => p ? `${p.color[0]}${p.type}` : "--").join("")).join("/");
  const rights = [];
  for (const color of ["white", "black"]) {
    const r = color === "white" ? 7 : 0;
    const king = state.board[r][4];
    if (king && king.type === "k" && king.color === color && !king.moved) {
      const kr = state.board[r][7];
      const qr = state.board[r][0];
      if (kr && kr.type === "r" && kr.color === color && !kr.moved) rights.push(color[0] + "k");
      if (qr && qr.type === "r" && qr.color === color && !qr.moved) rights.push(color[0] + "q");
    }
  }
  const ep = state.enPassant ? squareName(state.enPassant.r, state.enPassant.c) : "-";
  return `${placement} ${state.turn} ${rights.join("") || "-"} ${ep}`;
}

function insufficientMaterial() {
  const pieces = [];
  for (let r = 0; r < 8; r += 1) {
    for (let c = 0; c < 8; c += 1) {
      const p = game.board[r][c];
      if (p && p.type !== "k") pieces.push({ ...p, squareColor: (r + c) % 2 });
    }
  }
  if (pieces.length === 0) return true;
  if (pieces.length === 1 && ["b", "n"].includes(pieces[0].type)) return true;
  return pieces.every(p => p.type === "b") && new Set(pieces.map(p => p.squareColor)).size === 1;
}

function evaluateGame(inCheck, moveCount, key) {
  if (moveCount === 0) {
    if (inCheck) endGame("Checkmate", `${capitalize(opposite(game.turn))} wins by checkmate.`, "♛");
    else endGame("Stalemate", "The game is a draw. The player to move has no legal move.", "½");
  } else if (insufficientMaterial()) {
    endGame("Draw", "The game is drawn because there is insufficient material to checkmate.", "½");
  } else if (game.halfmoveClock >= 100) {
    endGame("Draw", "The game is drawn by the 50-move rule.", "½");
  } else if ((game.positions.get(key) || 0) >= 3) {
    endGame("Draw", "The same position occurred three times.", "½");
  }
}

function endGame(title, message, icon) {
  game.over = true;
  statusElement.textContent = title;
  gameOverTitle.textContent = title;
  gameOverMessage.textContent = message;
  resultIcon.textContent = icon;
  render();
  gameOverModal.hidden = false;
  playAgainButton.focus();
}

function undoMove() {
  if (!game.snapshots.length || pendingPromotion) return;
  const data = game.snapshots.pop();
  restore(data);
  gameOverModal.hidden = true;
  render();
}

function render() {
  renderBoard();
  renderStatus();
  renderHistory();
  renderMaterial();
  undoButton.disabled = game.snapshots.length === 0;
  copyMovesButton.disabled = game.moveHistory.length === 0;
}

function renderBoard() {
  boardElement.innerHTML = "";
  const checkedKing = isKingInCheck(game.board, game.turn) ? findKing(game.board, game.turn) : null;
  for (let r = 0; r < 8; r += 1) {
    for (let c = 0; c < 8; c += 1) {
      const square = document.createElement("button");
      const p = game.board[r][c];
      const legal = game.legalMoves.find(move => move.r === r && move.c === c);
      square.type = "button";
      square.className = `square ${(r + c) % 2 ? "dark" : "light"}`;
      square.dataset.row = r;
      square.dataset.col = c;
      square.setAttribute("role", "gridcell");
      square.setAttribute("aria-label", `${squareName(r, c)}${p ? `, ${p.color} ${NAMES[p.type]}` : ", empty"}${legal ? ", legal move" : ""}`);
      if (p) square.classList.add(`${p.color}-piece`);
      if (game.selected && game.selected.r === r && game.selected.c === c) square.classList.add("selected");
      if (legal) square.classList.add("legal", ...(legal.capture ? ["capture"] : []));
      if (game.lastMove && ((game.lastMove.from.r === r && game.lastMove.from.c === c) || (game.lastMove.to.r === r && game.lastMove.to.c === c))) square.classList.add("last-move");
      if (checkedKing && checkedKing.r === r && checkedKing.c === c) square.classList.add("in-check");
      if (p) {
        const pieceSpan = document.createElement("span");
        pieceSpan.className = "piece";
        pieceSpan.textContent = PIECES[p.color][p.type];
        pieceSpan.setAttribute("aria-hidden", "true");
        square.appendChild(pieceSpan);
      }
      if (c === 0) square.insertAdjacentHTML("beforeend", `<span class="coordinate rank-label" aria-hidden="true">${8 - r}</span>`);
      if (r === 7) square.insertAdjacentHTML("beforeend", `<span class="coordinate file-label" aria-hidden="true">${FILES[c]}</span>`);
      square.addEventListener("click", () => handleSquare(r, c));
      square.addEventListener("keydown", handleBoardKeydown);
      boardElement.appendChild(square);
    }
  }
}

function handleBoardKeydown(event) {
  const directions = { ArrowUp: [-1,0], ArrowDown: [1,0], ArrowLeft: [0,-1], ArrowRight: [0,1] };
  if (!directions[event.key]) return;
  event.preventDefault();
  const r = Number(event.currentTarget.dataset.row);
  const c = Number(event.currentTarget.dataset.col);
  const [dr, dc] = directions[event.key];
  const nr = Math.max(0, Math.min(7, r + dr));
  const nc = Math.max(0, Math.min(7, c + dc));
  boardElement.querySelector(`[data-row="${nr}"][data-col="${nc}"]`).focus();
}

function renderStatus() {
  const inCheck = isKingInCheck(game.board, game.turn);
  if (!game.over) statusElement.textContent = `${capitalize(game.turn)} to move${inCheck ? " — Check!" : ""}`;
  turnLabel.textContent = capitalize(game.turn);
  turnDot.className = `turn-dot ${game.turn}`;
  whitePlayer.classList.toggle("active", game.turn === "white" && !game.over);
  blackPlayer.classList.toggle("active", game.turn === "black" && !game.over);
}

function renderHistory() {
  if (!game.moveHistory.length) {
    moveList.innerHTML = '<li class="empty-history">No moves yet</li>';
    return;
  }
  moveList.innerHTML = "";
  for (let i = 0; i < game.moveHistory.length; i += 2) {
    const row = document.createElement("li");
    row.dataset.move = `${i / 2 + 1}.`;
    row.innerHTML = `<span>${game.moveHistory[i]}</span><span>${game.moveHistory[i + 1] || ""}</span>`;
    moveList.appendChild(row);
  }
  moveList.scrollTop = moveList.scrollHeight;
}

function renderMaterial() {
  const totals = { white: 0, black: 0 };
  const counts = { white: 0, black: 0 };
  for (const row of game.board) {
    for (const p of row) {
      if (p) {
        totals[p.color] += VALUES[p.type];
        counts[p.color] += 1;
      }
    }
  }
  whiteMaterial.textContent = `${counts.white} piece${counts.white === 1 ? "" : "s"}`;
  blackMaterial.textContent = `${counts.black} piece${counts.black === 1 ? "" : "s"}`;
  const difference = totals.white - totals.black;
  materialBalance.textContent = difference === 0 ? "Even" : `${difference > 0 ? "White" : "Black"} +${Math.abs(difference)}`;
}

function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function showToast(message) {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add("show");
  toastTimer = setTimeout(() => toast.classList.remove("show"), 1800);
}

async function copyMoves() {
  const rows = [];
  for (let i = 0; i < game.moveHistory.length; i += 2) rows.push(`${i / 2 + 1}. ${game.moveHistory[i]} ${game.moveHistory[i + 1] || ""}`.trim());
  try {
    await navigator.clipboard.writeText(rows.join("\n"));
    showToast("Move history copied");
  } catch (error) {
    showToast("Copy is unavailable in this browser");
  }
}

undoButton.addEventListener("click", undoMove);
newGameButton.addEventListener("click", resetGame);
playAgainButton.addEventListener("click", resetGame);
reviewButton.addEventListener("click", () => {
  gameOverModal.hidden = true;
  boardElement.querySelector("button").focus();
});
copyMovesButton.addEventListener("click", copyMoves);

resetGame();


}
function begin(){poster.hidden=true;gm.hidden=false;if(!booted){booted=true;var s=document.createElement("style");s.textContent=LOOK;document.head.appendChild(s);boot();}else{var r=document.getElementById("new-game-button");if(r)r.click();}}
poster.addEventListener("click",begin);
var nb=document.getElementById("new");if(nb)nb.addEventListener("click",begin);
})();
