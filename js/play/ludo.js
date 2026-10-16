/* Ludo - game logic + its own look. Layout lives in style.css; page shell lives in the HTML. */
(function(){"use strict";
var gm=document.getElementById("gm"),poster=document.getElementById("poster"),booted=false;
var LOOK=".gm{\n  \n  \n  --secondary: #16B8C4;\n  --action: #FFB84D;\n  --success: #22C55E;\n  --danger: #EF5B5B;\n  \n  \n  \n  \n  \n  --game-bg: #111827;\n  --red: #E74C3C;\n  --green: #2FB36D;\n  --yellow: #F4C542;\n  --blue: #3D7BEA;\n  \n}.gm *{ box-sizing: border-box; }.gm button,.gm input,.gm textarea,.gm select{ font: inherit; }.gm button{ -webkit-tap-highlight-color: transparent; }.gm h2,.gm h3{ margin-top: 0; color: var(--text); line-height: 1.12; }.gm h2{ font-size: clamp(28px, 4vw, 36px); font-weight: 800; letter-spacing: -.02em; }.gm .game-section{ padding-bottom: 72px; }.gm .game-card,.gm .wide-card{ background: var(--card); border: 1px solid var(--border); border-radius: 18px; box-shadow: var(--shadow); }.gm .game-card{ overflow: hidden; }.gm .game-topbar{ padding: 22px 24px; display: flex; align-items: center; justify-content: space-between; gap: 20px; border-bottom: 1px solid var(--border); }.gm .game-topbar h2{ font-size: 28px; margin-bottom: 0; }.gm .game-layout{ display: grid; grid-template-columns: 265px minmax(0, 1fr); min-height: 680px; }.gm .status-panel{ padding: 22px; background: #FCFCFE; border-right: 1px solid var(--border); display: flex; flex-direction: column; gap: 16px; }.gm .turn-card,.gm .dice-card,.gm .legend-card,.gm .rules-mini{ background: #fff; border: 1px solid var(--border); border-radius: 16px; padding: 16px; }.gm .status-label{ display: block; color: var(--muted); font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: .07em; margin-bottom: 10px; }.gm .player-line{ display: flex; align-items: center; gap: 9px; font-size: 22px; }.gm .player-dot{ width: 13px; height: 13px; border-radius: 50%; display: inline-block; flex: 0 0 auto; }.gm .player-dot.red{ background: var(--red); }.gm .player-dot.green{ background: var(--green); }.gm .player-dot.yellow{ background: var(--yellow); }.gm .player-dot.blue{ background: var(--blue); }.gm .dice-card{ text-align: center; }.gm .dice{ width: 88px; height: 88px; border: 0; border-radius: 18px; background: var(--game-bg); color: #fff; cursor: pointer; display: inline-grid; place-items: center; margin: 2px auto 14px; box-shadow: 0 10px 25px rgba(17,24,39,.2); transition: transform .15s ease; }.gm .dice:hover:not(:disabled),.gm .dice:focus-visible:not(:disabled){ transform: translateY(-2px); }.gm .dice:disabled{ cursor: not-allowed; opacity: .58; }.gm .dice-face{ font-size: 48px; line-height: 1; }.gm .primary-btn,.gm .secondary-btn{ min-height: 46px; border-radius: 12px; padding: 0 18px; font-weight: 800; border: 1px solid transparent; cursor: pointer; transition: transform .15s ease, background .15s ease, border-color .15s ease; }.gm .primary-btn{ background: var(--brand); color: #fff; width: 100%; }.gm .primary-btn:hover:not(:disabled),.gm .primary-btn:focus-visible:not(:disabled){ background: var(--brand-dark); transform: translateY(-1px); }.gm .primary-btn:disabled{ opacity: .5; cursor: not-allowed; }.gm .secondary-btn{ background: #fff; color: var(--text); border-color: var(--border); }.gm .secondary-btn:hover,.gm .secondary-btn:focus-visible{ border-color: #c8cad7; background: #f8f8fb; }.gm .hint{ color: var(--muted); font-size: 14px; line-height: 1.45; margin: 12px 0 0; min-height: 40px; }.gm .legend-list{ display: grid; gap: 10px; }.gm .legend-row{ display: grid; grid-template-columns: 14px 1fr auto; align-items: center; gap: 8px; font-size: 15px; }.gm .rules-mini p{ margin: 0 0 8px; }.gm .rules-mini ul{ margin: 0; padding-left: 19px; color: var(--muted); font-size: 14px; line-height: 1.5; }.gm .board-wrap{ padding: 26px; display: grid; place-items: center; align-content: center; gap: 16px; background: linear-gradient(#fff, #fbfbfd); min-width: 0; }.gm .ludo-board{\n  width: min(100%, 690px);\n  aspect-ratio: 1;\n  display: grid;\n  grid-template-columns: repeat(15, 1fr);\n  grid-template-rows: repeat(15, 1fr);\n  border: 3px solid #1E293B;\n  border-radius: 14px;\n  overflow: hidden;\n  background: #fff;\n  position: relative;\n  box-shadow: 0 16px 35px rgba(17,24,39,.14);\n  touch-action: manipulation;\n}.gm .cell{ border: 1px solid rgba(15,23,42,.12); position: relative; display: grid; place-items: center; min-width: 0; min-height: 0; }.gm .cell.track{ background: #fff; }.gm .cell.safe::after{ content: \"\u2605\"; font-size: clamp(9px, 1.55vw, 16px); color: #8B93A7; opacity: .85; }.gm .cell.start-red{ background: #FADBD8; }.gm .cell.start-green{ background: #D6F5E4; }.gm .cell.start-yellow{ background: #FFF0B8; }.gm .cell.start-blue{ background: #DDE9FF; }.gm .cell.home-red{ background: #F7B7B0; }.gm .cell.home-green{ background: #AEE5C5; }.gm .cell.home-yellow{ background: #FFE27A; }.gm .cell.home-blue{ background: #AFC9FA; }.gm .yard{ position: absolute; width: 40%; height: 40%; border: 2px solid rgba(15,23,42,.18); display: grid; place-items: center; z-index: 2; }.gm .yard.red{ left: 0; top: 0; background: var(--red); }.gm .yard.green{ right: 0; top: 0; background: var(--green); }.gm .yard.yellow{ right: 0; bottom: 0; background: var(--yellow); }.gm .yard.blue{ left: 0; bottom: 0; background: var(--blue); }.gm .yard-inner{ width: 70%; height: 70%; background: rgba(255,255,255,.94); border-radius: 18%; display: grid; grid-template-columns: repeat(2, 1fr); grid-template-rows: repeat(2, 1fr); gap: 10%; padding: 11%; box-shadow: inset 0 0 0 1px rgba(15,23,42,.09); }.gm .yard-spot{ border-radius: 50%; background: rgba(15,23,42,.08); display: grid; place-items: center; position: relative; }.gm .center-home{ position: absolute; left: 40%; top: 40%; width: 20%; height: 20%; z-index: 3; overflow: hidden; background: #fff; }.gm .center-home::before,.gm .center-home::after{ content: \"\"; position: absolute; inset: 0; }.gm .center-home::before{ clip-path: polygon(0 0, 50% 50%, 0 100%); background: var(--red); }.gm .center-home::after{ clip-path: polygon(100% 0, 50% 50%, 100% 100%); background: var(--yellow); }.gm .center-green,.gm .center-blue{ position: absolute; inset: 0; }.gm .center-green{ clip-path: polygon(0 0, 100% 0, 50% 50%); background: var(--green); }.gm .center-blue{ clip-path: polygon(0 100%, 50% 50%, 100% 100%); background: var(--blue); }.gm .center-label{ position: absolute; inset: 34%; z-index: 5; border-radius: 50%; background: #fff; display: grid; place-items: center; font-size: clamp(8px, 1.4vw, 14px); font-weight: 800; color: var(--text); box-shadow: 0 2px 8px rgba(15,23,42,.16); }.gm .token{ width: 68%; height: 68%; border-radius: 50%; border: 2px solid #fff; box-shadow: 0 3px 8px rgba(15,23,42,.26); position: absolute; z-index: 8; cursor: default; display: grid; place-items: center; color: #fff; font-size: clamp(8px, 1.2vw, 12px); font-weight: 800; transition: transform .18s ease, box-shadow .18s ease; }.gm .token.red{ background: var(--red); }.gm .token.green{ background: var(--green); }.gm .token.yellow{ background: #D9A90A; }.gm .token.blue{ background: var(--blue); }.gm .token.selectable{ cursor: pointer; animation: pulse 1s infinite; box-shadow: 0 0 0 3px #fff, 0 0 0 6px rgba(91,92,226,.55), 0 5px 12px rgba(15,23,42,.28); }.gm .token.stack-2:nth-of-type(2){ transform: translate(16%, 16%) scale(.82); }@keyframes pulse{ 0%, 100% { transform: scale(1); } 50% { transform: scale(1.11); } }.gm .board-message{ min-height: 24px; color: var(--muted); text-align: center; font-weight: 700; }.gm .wide-card{ padding: 28px; }.gm .wide-card h2{ font-size: 30px; margin-bottom: 14px; }.gm .wide-card p{ color: var(--muted); }.gm .modal[hidden]{ display: none; }.gm .modal{ position: fixed; inset: 0; z-index: 100; display: grid; place-items: center; padding: 20px; }.gm .modal-backdrop{ position: absolute; inset: 0; background: rgba(17,24,39,.65); backdrop-filter: blur(4px); }.gm .modal-card{ position: relative; z-index: 2; width: min(430px, 100%); background: #fff; border-radius: 20px; padding: 30px; text-align: center; box-shadow: 0 25px 80px rgba(17,24,39,.28); }.gm .modal-card h2{ margin-bottom: 10px; }.gm .modal-card .primary-btn{ margin-top: 10px; }.gm :focus-visible{ outline: 3px solid rgba(91,92,226,.35); outline-offset: 3px; }@media (max-width: 900px){.gm .game-layout{ grid-template-columns: 1fr; }.gm .status-panel{ border-right: 0; border-bottom: 1px solid var(--border); display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); }.gm .rules-mini{ grid-column: 1 / -1; }.gm .board-wrap{ padding: 22px; }}@media (max-width: 640px){.gm .game-section{ padding-bottom: 54px; }.gm .game-topbar{ padding: 18px; align-items: flex-start; }.gm .game-topbar h2{ font-size: 24px; }.gm .secondary-btn{ min-height: 42px; padding: 0 13px; }.gm .status-panel{ padding: 14px; grid-template-columns: 1fr 1fr; gap: 10px; }.gm .turn-card,.gm .dice-card,.gm .legend-card,.gm .rules-mini{ padding: 13px; border-radius: 14px; }.gm .legend-card{ grid-column: 1 / -1; }.gm .dice{ width: 72px; height: 72px; border-radius: 15px; }.gm .dice-face{ font-size: 40px; }.gm .rules-mini{ display: none; }.gm .board-wrap{ padding: 12px 8px 18px; }.gm .ludo-board{ width: 100%; border-width: 2px; border-radius: 10px; }.gm .yard{ border-width: 1px; }.gm .yard-inner{ gap: 8%; padding: 10%; border-radius: 14%; }.gm .token{ width: 72%; height: 72%; border-width: 1.5px; }.gm .board-message{ padding: 0 8px; font-size: 14px; }.gm .wide-card{ padding: 22px; }.gm .wide-card h2{ font-size: 27px; }}@media (prefers-reduced-motion: reduce){.gm *,.gm *::before,.gm *::after{ scroll-behavior: auto !important; animation-duration: .01ms !important; animation-iteration-count: 1 !important; transition-duration: .01ms !important; }}";
function __ready(f){f()}
function boot(){
(() => {
  "use strict";

  const board = document.getElementById("board");
  const diceBtn = document.getElementById("diceBtn");
  const rollBtn = document.getElementById("rollBtn");
  const diceFace = document.getElementById("diceFace");
  const diceHint = document.getElementById("diceHint");
  const turnText = document.getElementById("turnText");
  const turnDot = document.getElementById("turnDot");
  const boardMessage = document.getElementById("boardMessage");
  const newGameBtn = document.getElementById("newGameBtn");
  const playAgainBtn = document.getElementById("playAgainBtn");
  const winModal = document.getElementById("winModal");
  const winTitle = document.getElementById("winTitle");
  const winText = document.getElementById("winText");

  const DICE_FACES = ["⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];
  const PLAYERS = ["red", "green", "yellow", "blue"];
  const LABELS = { red: "Red", green: "Green", yellow: "Yellow", blue: "Blue" };

  // 52-cell main loop, expressed as board grid coordinates [row, col].
  const TRACK = [
    [6,1],[6,2],[6,3],[6,4],[6,5],[5,6],[4,6],[3,6],[2,6],[1,6],[0,6],[0,7],[0,8],
    [1,8],[2,8],[3,8],[4,8],[5,8],[6,9],[6,10],[6,11],[6,12],[6,13],[6,14],[7,14],[8,14],
    [8,13],[8,12],[8,11],[8,10],[8,9],[9,8],[10,8],[11,8],[12,8],[13,8],[14,8],[14,7],[14,6],
    [13,6],[12,6],[11,6],[10,6],[9,6],[8,5],[8,4],[8,3],[8,2],[8,1],[8,0],[7,0],[6,0]
  ];

  const START_INDEX = { red: 0, green: 13, yellow: 26, blue: 39 };
  const SAFE_TRACK_INDEXES = new Set([0, 8, 13, 21, 26, 34, 39, 47]);

  const HOME_PATHS = {
    red: [[7,1],[7,2],[7,3],[7,4],[7,5],[7,6]],
    green: [[1,7],[2,7],[3,7],[4,7],[5,7],[6,7]],
    yellow: [[7,13],[7,12],[7,11],[7,10],[7,9],[7,8]],
    blue: [[13,7],[12,7],[11,7],[10,7],[9,7],[8,7]]
  };

  const YARD_SPOTS = {
    red: [[2,2],[2,4],[4,2],[4,4]],
    green: [[2,10],[2,12],[4,10],[4,12]],
    yellow: [[10,10],[10,12],[12,10],[12,12]],
    blue: [[10,2],[10,4],[12,2],[12,4]]
  };

  const START_CELL_CLASS = {
    red: "start-red",
    green: "start-green",
    yellow: "start-yellow",
    blue: "start-blue"
  };

  let state;
  const cells = new Map();

  function initialState() {
    return {
      currentPlayer: 0,
      dice: null,
      awaitingMove: false,
      winner: null,
      tokens: Object.fromEntries(PLAYERS.map(color => [color, Array.from({ length: 4 }, (_, id) => ({ id, progress: -1 }))]))
    };
  }

  function key(row, col) { return `${row}-${col}`; }

  function createBoard() {
    board.innerHTML = "";
    cells.clear();

    for (let r = 0; r < 15; r++) {
      for (let c = 0; c < 15; c++) {
        const cell = document.createElement("div");
        cell.className = "cell";
        cell.style.gridRow = r + 1;
        cell.style.gridColumn = c + 1;
        cell.dataset.row = String(r);
        cell.dataset.col = String(c);
        board.appendChild(cell);
        cells.set(key(r, c), cell);
      }
    }

    TRACK.forEach(([r,c], idx) => {
      const cell = cells.get(key(r,c));
      cell.classList.add("track");
      if (SAFE_TRACK_INDEXES.has(idx)) cell.classList.add("safe");
    });

    Object.entries(START_INDEX).forEach(([color, idx]) => {
      const [r,c] = TRACK[idx];
      cells.get(key(r,c)).classList.add(START_CELL_CLASS[color]);
    });

    Object.entries(HOME_PATHS).forEach(([color, path]) => {
      path.forEach(([r,c]) => cells.get(key(r,c)).classList.add(`home-${color}`));
    });

    createYard("red", "1 / span 6", "1 / span 6");
    createYard("green", "1 / span 6", "10 / span 6");
    createYard("yellow", "10 / span 6", "10 / span 6");
    createYard("blue", "10 / span 6", "1 / span 6");

    const center = document.createElement("div");
    center.className = "center-home";
    center.innerHTML = '<span class="center-green"></span><span class="center-blue"></span><span class="center-label">HOME</span>';
    board.appendChild(center);
  }

  function createYard(color, row, col) {
    const yard = document.createElement("div");
    yard.className = `yard ${color}`;
    yard.style.gridRow = row;
    yard.style.gridColumn = col;
    yard.innerHTML = `<div class="yard-inner" aria-label="${LABELS[color]} yard">
      <div class="yard-spot" data-yard="${color}-0"></div>
      <div class="yard-spot" data-yard="${color}-1"></div>
      <div class="yard-spot" data-yard="${color}-2"></div>
      <div class="yard-spot" data-yard="${color}-3"></div>
    </div>`;
    board.appendChild(yard);
  }

  function getCoordinate(color, progress, tokenId) {
    if (progress === -1) return { type: "yard", selector: `[data-yard="${color}-${tokenId}"]` };
    if (progress >= 0 && progress <= 51) {
      const trackIndex = (START_INDEX[color] + progress) % 52;
      const [row, col] = TRACK[trackIndex];
      return { type: "cell", row, col, trackIndex };
    }
    if (progress >= 52 && progress <= 57) {
      const [row, col] = HOME_PATHS[color][progress - 52];
      return { type: "cell", row, col, home: true };
    }
    return { type: "finish" };
  }

  function renderTokens(selectable = []) {
    board.querySelectorAll(".token").forEach(el => el.remove());
    const selectableSet = new Set(selectable.map(t => `${t.color}-${t.id}`));

    PLAYERS.forEach(color => {
      state.tokens[color].forEach(token => {
        if (token.progress === 58) return;
        const tokenEl = document.createElement("button");
        tokenEl.type = "button";
        tokenEl.className = `token ${color}`;
        tokenEl.dataset.color = color;
        tokenEl.dataset.id = String(token.id);
        tokenEl.setAttribute("aria-label", `${LABELS[color]} token ${token.id + 1}`);
        tokenEl.textContent = String(token.id + 1);

        if (selectableSet.has(`${color}-${token.id}`)) {
          tokenEl.classList.add("selectable");
          tokenEl.disabled = false;
          tokenEl.addEventListener("click", () => makeMove(color, token.id));
        } else {
          tokenEl.disabled = true;
        }

        const pos = getCoordinate(color, token.progress, token.id);
        if (pos.type === "yard") {
          const spot = board.querySelector(pos.selector);
          spot?.appendChild(tokenEl);
        } else if (pos.type === "cell") {
          const cell = cells.get(key(pos.row, pos.col));
          cell?.appendChild(tokenEl);
          arrangeTokensInCell(cell);
        }
      });
    });
  }

  function arrangeTokensInCell(cell) {
    const tokenEls = [...cell.querySelectorAll(".token")];
    const positions = [
      [0,0], [25,-18], [-24,18], [22,22]
    ];
    tokenEls.forEach((el, i) => {
      const [x,y] = positions[i] || [0,0];
      const scale = tokenEls.length > 1 ? 0.76 : 1;
      el.style.transform = `translate(${x}%, ${y}%) scale(${scale})`;
      el.style.zIndex = String(8 + i);
    });
  }

  function canMoveToken(color, token, dice) {
    if (token.progress === 58) return false;
    if (token.progress === -1) return dice === 6;
    return token.progress + dice <= 58;
  }

  function legalMoves(color, dice) {
    return state.tokens[color]
      .filter(token => canMoveToken(color, token, dice))
      .map(token => ({ color, id: token.id }));
  }

  function rollDice() {
    if (state.awaitingMove || state.winner) return;
    const color = PLAYERS[state.currentPlayer];
    state.dice = Math.floor(Math.random() * 6) + 1;
    state.awaitingMove = true;
    diceFace.textContent = DICE_FACES[state.dice - 1];
    diceBtn.classList.add("rolling");
    setTimeout(() => diceBtn.classList.remove("rolling"), 180);

    const moves = legalMoves(color, state.dice);
    updateControls();

    if (moves.length === 0) {
      boardMessage.textContent = `${LABELS[color]} rolled ${state.dice}, but has no legal move.`;
      diceHint.textContent = "No legal move. Turn passes automatically.";
      renderTokens([]);
      setTimeout(() => endTurn(false), 750);
      return;
    }

    boardMessage.textContent = `${LABELS[color]} rolled ${state.dice}. Choose a highlighted token.`;
    diceHint.textContent = `Select one of ${moves.length} legal ${moves.length === 1 ? "move" : "moves"}.`;
    renderTokens(moves);
  }

  function makeMove(color, tokenId) {
    if (!state.awaitingMove || state.winner || color !== PLAYERS[state.currentPlayer]) return;
    const token = state.tokens[color][tokenId];
    if (!canMoveToken(color, token, state.dice)) return;

    const rolledSix = state.dice === 6;
    if (token.progress === -1) token.progress = 0;
    else token.progress += state.dice;

    const captured = captureOpponents(color, token);
    const finished = token.progress === 58;

    state.awaitingMove = false;
    renderTokens([]);
    updateHomeCounters();

    if (checkWinner(color)) {
      state.winner = color;
      boardMessage.textContent = `${LABELS[color]} wins the game!`;
      updateControls();
      showWinner(color);
      return;
    }

    if (finished) {
      boardMessage.textContent = `${LABELS[color]} moved a token home${rolledSix ? " and rolled a six" : ""}.`;
    } else if (captured) {
      boardMessage.textContent = `${LABELS[color]} captured an opponent token and earns another roll.`;
    } else {
      boardMessage.textContent = `${LABELS[color]} moved token ${tokenId + 1}.`;
    }

    const extraTurn = rolledSix || captured;
    setTimeout(() => endTurn(extraTurn), 420);
  }

  function captureOpponents(color, movedToken) {
    if (movedToken.progress < 0 || movedToken.progress > 51) return false;
    const pos = getCoordinate(color, movedToken.progress, movedToken.id);
    if (SAFE_TRACK_INDEXES.has(pos.trackIndex)) return false;

    let captured = false;
    PLAYERS.filter(c => c !== color).forEach(otherColor => {
      state.tokens[otherColor].forEach(token => {
        if (token.progress < 0 || token.progress > 51) return;
        const otherPos = getCoordinate(otherColor, token.progress, token.id);
        if (otherPos.trackIndex === pos.trackIndex) {
          token.progress = -1;
          captured = true;
        }
      });
    });
    return captured;
  }

  function endTurn(extraTurn) {
    if (state.winner) return;
    if (!extraTurn) state.currentPlayer = (state.currentPlayer + 1) % PLAYERS.length;
    state.dice = null;
    state.awaitingMove = false;
    renderTokens([]);
    updateStatus();
    updateControls();
    const color = PLAYERS[state.currentPlayer];
    boardMessage.textContent = extraTurn ? `${LABELS[color]} gets another roll.` : `${LABELS[color]}'s turn.`;
    diceHint.textContent = extraTurn ? "Bonus roll available." : `${LABELS[color]} is ready to roll.`;
  }

  function checkWinner(color) {
    return state.tokens[color].every(token => token.progress === 58);
  }

  function updateStatus() {
    const color = PLAYERS[state.currentPlayer];
    turnText.textContent = LABELS[color];
    turnDot.className = `player-dot ${color}`;
  }

  function updateHomeCounters() {
    PLAYERS.forEach(color => {
      const count = state.tokens[color].filter(t => t.progress === 58).length;
      const el = document.getElementById(`${color}HomeCount`);
      if (el) el.textContent = `${count}/4`;
    });
  }

  function updateControls() {
    const disabled = state.awaitingMove || Boolean(state.winner);
    rollBtn.disabled = disabled;
    diceBtn.disabled = disabled;
  }

  function showWinner(color) {
    winTitle.textContent = `${LABELS[color]} Wins!`;
    winText.textContent = `All four ${LABELS[color]} tokens reached home.`;
    winModal.hidden = false;
    playAgainBtn.focus();
  }

  function hideWinner() {
    winModal.hidden = true;
  }

  function resetGame() {
    state = initialState();
    hideWinner();
    diceFace.textContent = DICE_FACES[4];
    createBoard();
    renderTokens([]);
    updateStatus();
    updateHomeCounters();
    updateControls();
    diceHint.textContent = "Red rolls first.";
    boardMessage.textContent = "Roll the dice to begin.";
  }

  rollBtn.addEventListener("click", rollDice);
  diceBtn.addEventListener("click", rollDice);
  newGameBtn.addEventListener("click", resetGame);
  playAgainBtn.addEventListener("click", resetGame);

  document.addEventListener("keydown", (event) => {
    if ((event.code === "Space" || event.key === "Enter") && !event.repeat) {
      const target = document.activeElement;
      const isInteractive = target && ["BUTTON", "A", "SUMMARY", "INPUT", "TEXTAREA", "SELECT"].includes(target.tagName);
      if (!isInteractive && !state.awaitingMove && !state.winner) {
        event.preventDefault();
        rollDice();
      }
    }
    if (event.key === "Escape" && !winModal.hidden) hideWinner();
  });

  resetGame();
})();


}
function begin(){poster.hidden=true;gm.hidden=false;if(!booted){booted=true;var s=document.createElement("style");s.textContent=LOOK;document.head.appendChild(s);boot();}else{var r=document.getElementById("newGameBtn");if(r)r.click();}}
poster.addEventListener("click",begin);
var nb=document.getElementById("new");if(nb)nb.addEventListener("click",begin);
})();
