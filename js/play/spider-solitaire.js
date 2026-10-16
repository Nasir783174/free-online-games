/* Spider Solitaire - game logic + its own look. Layout lives in style.css; page shell lives in the HTML. */
(function(){"use strict";
var gm=document.getElementById("gm"),poster=document.getElementById("poster"),booted=false;
var LOOK=".gm{\n  \n  \n  --accent: #16B8C4;\n  --action: #FFB84D;\n  --success: #22C55E;\n  --danger: #EF5B5B;\n  --page: #F6F7FB;\n  \n  \n  \n  \n  --felt: #0f6b46;\n  --felt-dark: #0a5336;\n  --felt-line: rgba(255,255,255,.18);\n  \n}.gm *{ box-sizing: border-box; }.gm button,.gm select{ font: inherit; }.gm button{ cursor: pointer; }.gm :focus-visible{\n  outline: 3px solid rgba(91,92,226,.35);\n  outline-offset: 3px;\n}.gm .page-shell{\n  width: min(1180px, calc(100% - 40px));\n  margin: 0 auto;\n}.gm .game-card{\n  background: var(--card);\n  border: 1px solid var(--border);\n  border-radius: 20px;\n  box-shadow: var(--shadow);\n  overflow: hidden;\n  margin-bottom: 72px;\n}.gm .game-toolbar{\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  gap: 20px;\n  padding: 20px 22px;\n  border-bottom: 1px solid var(--border);\n}.gm .toolbar-label{ margin: 0 0 3px; font-weight: 800; font-size: 20px; }.gm .status-group{ display: flex; flex-wrap: wrap; gap: 16px; color: var(--muted); font-size: 14px; }.gm .status-group strong{ color: var(--text); font-size: 20px; margin-left: 4px; }.gm .toolbar-actions{ display: flex; align-items: end; gap: 10px; }.gm .difficulty-control{ display: grid; gap: 4px; color: var(--muted); font-size: 12px; font-weight: 700; }.gm select{\n  min-height: 44px;\n  padding: 0 36px 0 13px;\n  border: 1px solid var(--border);\n  border-radius: 10px;\n  background: #fff;\n  color: var(--text);\n  font-weight: 700;\n}.gm .button{\n  min-height: 44px;\n  border: 0;\n  border-radius: 10px;\n  padding: 0 17px;\n  font-weight: 800;\n  transition: transform .15s ease, background .15s ease;\n}.gm .button:active{ transform: translateY(1px); }.gm .button-secondary{ background: #EEF0FF; color: var(--brand-dark); }.gm .button-secondary:hover{ background: #E2E5FF; }.gm .button-primary{ background: var(--brand); color: #fff; }.gm .button-primary:hover{ background: var(--brand-dark); }.gm .game-message{\n  padding: 10px 18px;\n  min-height: 45px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  text-align: center;\n  font-size: 14px;\n  color: #fff;\n  background: var(--felt-dark);\n  border-bottom: 1px solid var(--felt-line);\n}.gm .game-message.error{ background: #7f1d1d; }.gm .game-message.success{ background: #166534; }.gm .table-wrap{\n  overflow-x: auto;\n  background: var(--felt);\n  overscroll-behavior-inline: contain;\n}.gm .tabletop{\n  position: relative;\n  min-width: 760px;\n  min-height: 660px;\n  padding: 18px 18px 34px;\n  background:\n    radial-gradient(circle at 50% 10%, rgba(255,255,255,.06), transparent 35%),\n    linear-gradient(0deg, rgba(0,0,0,.03), rgba(0,0,0,.03)),\n    var(--felt);\n}.gm .table-top-row{\n  min-height: 95px;\n  display: flex;\n  align-items: flex-start;\n  justify-content: space-between;\n  margin-bottom: 12px;\n}.gm .stock-area{\n  width: 70px;\n  min-height: 90px;\n  border: 0;\n  padding: 0;\n  background: transparent;\n  color: #fff;\n  position: relative;\n}.gm .stock-card-back{\n  display: block;\n  width: 62px;\n  height: 82px;\n  border-radius: 8px;\n  border: 2px solid rgba(255,255,255,.9);\n  box-shadow: 0 5px 12px rgba(0,0,0,.22);\n  background:\n    linear-gradient(45deg, rgba(255,255,255,.13) 25%, transparent 25%, transparent 75%, rgba(255,255,255,.13) 75%),\n    linear-gradient(45deg, rgba(255,255,255,.13) 25%, transparent 25%, transparent 75%, rgba(255,255,255,.13) 75%),\n    #3437a8;\n  background-position: 0 0, 6px 6px;\n  background-size: 12px 12px;\n}.gm .stock-area::before,.gm .stock-area::after{\n  content: \"\";\n  position: absolute;\n  width: 62px;\n  height: 82px;\n  top: 0;\n  left: 0;\n  border-radius: 8px;\n  border: 1px solid rgba(255,255,255,.45);\n  background: #2e318f;\n  z-index: -1;\n}.gm .stock-area::before{ transform: translate(5px, 3px); }.gm .stock-area::after{ transform: translate(9px, 6px); }.gm .stock-area.empty::before,.gm .stock-area.empty::after{ display: none; }.gm .stock-area.empty .stock-card-back{ background: rgba(255,255,255,.07); border-style: dashed; box-shadow: none; }.gm .stock-count{ display: block; margin-top: 6px; font-size: 12px; font-weight: 700; }.gm .completed-area{\n  display: flex;\n  flex-direction: row-reverse;\n  gap: 5px;\n  min-height: 82px;\n}.gm .completed-run{\n  width: 56px;\n  height: 76px;\n  background: white;\n  color: #111827;\n  border-radius: 7px;\n  border: 1px solid rgba(0,0,0,.12);\n  box-shadow: 0 4px 10px rgba(0,0,0,.15);\n  display: grid;\n  place-items: center;\n  font-size: 24px;\n  font-weight: 800;\n}.gm .completed-run.red{ color: #c62828; }.gm .tableau{\n  display: grid;\n  grid-template-columns: repeat(10, minmax(64px, 1fr));\n  gap: 7px;\n  align-items: start;\n}.gm .column{\n  position: relative;\n  min-height: 460px;\n  border-radius: 10px;\n}.gm .column::before{\n  content: \"\";\n  position: absolute;\n  top: 0;\n  left: 50%;\n  transform: translateX(-50%);\n  width: calc(100% - 4px);\n  max-width: 86px;\n  height: 114px;\n  border: 2px dashed rgba(255,255,255,.22);\n  border-radius: 9px;\n}.gm .column.selected-destination::before{ border-color: rgba(255,184,77,.95); background: rgba(255,184,77,.08); }.gm .playing-card{\n  position: absolute;\n  left: 50%;\n  transform: translateX(-50%);\n  width: calc(100% - 4px);\n  max-width: 86px;\n  height: 114px;\n  border-radius: 9px;\n  border: 1px solid rgba(10,20,28,.18);\n  background: #fff;\n  box-shadow: 0 3px 8px rgba(0,0,0,.17);\n  user-select: none;\n  touch-action: manipulation;\n  transition: transform .12s ease, box-shadow .12s ease;\n}.gm .playing-card.face-down{\n  background:\n    linear-gradient(45deg, rgba(255,255,255,.14) 25%, transparent 25%, transparent 75%, rgba(255,255,255,.14) 75%),\n    linear-gradient(45deg, rgba(255,255,255,.14) 25%, transparent 25%, transparent 75%, rgba(255,255,255,.14) 75%),\n    #3437a8;\n  background-position: 0 0, 6px 6px;\n  background-size: 12px 12px;\n  border: 2px solid rgba(255,255,255,.85);\n}.gm .playing-card.face-up{ cursor: pointer; }.gm .playing-card.face-up:hover{ box-shadow: 0 5px 13px rgba(0,0,0,.26); }.gm .playing-card.red{ color: #c62828; }.gm .playing-card.black{ color: #111827; }.gm .playing-card.selected{\n  transform: translate(-50%, -5px);\n  box-shadow: 0 0 0 3px var(--action), 0 9px 16px rgba(0,0,0,.28);\n  z-index: 150 !important;\n}.gm .playing-card.selected-sequence{\n  box-shadow: 0 0 0 2px rgba(255,184,77,.8), 0 7px 13px rgba(0,0,0,.23);\n}.gm .card-corner{\n  position: absolute;\n  left: 7px;\n  top: 5px;\n  display: grid;\n  line-height: .95;\n  justify-items: center;\n  font-weight: 800;\n  font-size: 17px;\n}.gm .card-suit-small{ font-size: 15px; }.gm .card-suit-large{\n  position: absolute;\n  inset: 0;\n  display: grid;\n  place-items: center;\n  font-size: 36px;\n  opacity: .93;\n}.gm .mobile-help{\n  padding: 14px 20px;\n  color: var(--muted);\n  font-size: 14px;\n  border-top: 1px solid var(--border);\n}.gm .steps-list{ padding-left: 22px; color: #4b5565; }.gm .win-modal{\n  position: fixed;\n  inset: 0;\n  display: none;\n  place-items: center;\n  padding: 20px;\n  background: rgba(12,18,30,.68);\n  z-index: 1000;\n}.gm .win-modal.open{ display: grid; }.gm .win-dialog{ width: min(430px,100%); padding: 32px; background: white; border-radius: 20px; text-align: center; box-shadow: 0 24px 80px rgba(0,0,0,.28); }.gm .win-dialog h2{ margin: 8px 0 8px; font-size: 32px; }.gm .win-dialog p{ color: var(--muted); margin: 0 0 20px; }.gm .win-icon{ width: 60px; height: 60px; margin: 0 auto; display: grid; place-items: center; border-radius: 50%; color: #fff; background: var(--felt); font-size: 28px; }@media (max-width: 820px){.gm .page-shell{ width: min(100% - 26px, 1180px); }.gm .game-toolbar{ align-items: flex-start; flex-direction: column; }.gm .toolbar-actions{ width: 100%; justify-content: space-between; }.gm .difficulty-control{ flex: 1; }.gm .difficulty-control select{ width: 100%; }.gm .tabletop{ min-height: 600px; }.gm .game-card{ margin-left: -13px; margin-right: -13px; border-radius: 0; }}@media (max-width: 560px){.gm .toolbar-actions{ flex-direction: column; align-items: stretch; }.gm .toolbar-actions .button{ width: 100%; }.gm .status-group{ gap: 12px; }.gm .status-group strong{ font-size: 18px; }.gm .table-wrap{ scrollbar-width: thin; }.gm .tabletop{ padding-left: 10px; padding-right: 10px; }}@media (prefers-reduced-motion: reduce){.gm *,.gm *::before,.gm *::after{ scroll-behavior: auto !important; transition: none !important; }}";
function __ready(f){f()}
function boot(){
(() => {
  "use strict";

  const SUITS = ["♠", "♥", "♦", "♣"];
  const RED_SUITS = new Set(["♥", "♦"]);
  const RANK_LABELS = { 1: "A", 11: "J", 12: "Q", 13: "K" };

  const tableauEl = document.getElementById("tableau");
  const stockEl = document.getElementById("stock");
  const stockCountEl = document.getElementById("stock-count");
  const completedAreaEl = document.getElementById("completed-area");
  const scoreEl = document.getElementById("score");
  const movesEl = document.getElementById("moves");
  const runsEl = document.getElementById("runs");
  const messageEl = document.getElementById("game-message");
  const difficultyEl = document.getElementById("difficulty");
  const newGameEl = document.getElementById("new-game");
  const winModalEl = document.getElementById("win-modal");
  const winSummaryEl = document.getElementById("win-summary");
  const playAgainEl = document.getElementById("play-again");

  let tableau = [];
  let stock = [];
  let completedRuns = [];
  let selected = null;
  let score = 500;
  let moves = 0;
  let gameOver = false;
  let difficulty = 1;
  let messageTimer = null;

  function makeDeck(suitCount) {
    const activeSuits = SUITS.slice(0, suitCount);
    const copiesPerSuit = 8 / suitCount;
    const deck = [];
    let id = 0;

    for (const suit of activeSuits) {
      for (let copy = 0; copy < copiesPerSuit; copy += 1) {
        for (let rank = 1; rank <= 13; rank += 1) {
          deck.push({ id: `c${id++}`, suit, rank, faceUp: false });
        }
      }
    }
    return shuffle(deck);
  }

  function shuffle(cards) {
    const arr = cards.slice();
    for (let i = arr.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function startGame() {
    difficulty = Number(difficultyEl.value);
    const deck = makeDeck(difficulty);
    tableau = Array.from({ length: 10 }, () => []);
    completedRuns = [];
    selected = null;
    score = 500;
    moves = 0;
    gameOver = false;

    for (let i = 0; i < 54; i += 1) {
      const columnIndex = i % 10;
      tableau[columnIndex].push(deck[i]);
    }

    tableau.forEach((column) => {
      if (column.length) column[column.length - 1].faceUp = true;
    });

    stock = deck.slice(54);
    closeWinModal();
    showMessage(`New ${difficulty}-suit game started. Build descending sequences from King to Ace.`);
    render();
  }

  function render() {
    renderTableau();
    renderStock();
    renderCompletedRuns();
    scoreEl.textContent = score;
    movesEl.textContent = moves;
    runsEl.textContent = `${completedRuns.length}/8`;
  }

  function renderTableau() {
    tableauEl.innerHTML = "";
    tableau.forEach((column, columnIndex) => {
      const columnEl = document.createElement("div");
      columnEl.className = "column";
      columnEl.dataset.column = String(columnIndex);
      columnEl.setAttribute("role", "group");
      columnEl.setAttribute("aria-label", `Tableau column ${columnIndex + 1}`);

      if (selected && selected.column !== columnIndex && canMoveToColumn(selected.column, selected.cardIndex, columnIndex)) {
        columnEl.classList.add("selected-destination");
      }

      columnEl.addEventListener("click", (event) => {
        if (event.target === columnEl || !event.target.closest(".playing-card")) {
          onColumnClick(columnIndex);
        }
      });

      let top = 0;
      column.forEach((card, cardIndex) => {
        const cardEl = createCardElement(card, columnIndex, cardIndex);
        const previous = column[cardIndex - 1];
        if (cardIndex === 0) {
          top = 0;
        } else {
          top += previous.faceUp ? 29 : 17;
        }
        cardEl.style.top = `${top}px`;
        cardEl.style.zIndex = String(cardIndex + 1);
        columnEl.appendChild(cardEl);
      });

      const minHeight = Math.max(460, top + 128);
      columnEl.style.minHeight = `${minHeight}px`;
      tableauEl.appendChild(columnEl);
    });
  }

  function createCardElement(card, columnIndex, cardIndex) {
    const cardEl = document.createElement("button");
    cardEl.type = "button";
    cardEl.className = `playing-card ${card.faceUp ? "face-up" : "face-down"}`;
    cardEl.dataset.column = String(columnIndex);
    cardEl.dataset.index = String(cardIndex);

    if (!card.faceUp) {
      cardEl.setAttribute("aria-label", "Face-down card");
      cardEl.disabled = true;
      return cardEl;
    }

    const isRed = RED_SUITS.has(card.suit);
    cardEl.classList.add(isRed ? "red" : "black");
    const label = rankLabel(card.rank);
    cardEl.setAttribute("aria-label", `${label} of ${suitName(card.suit)}`);
    cardEl.innerHTML = `
      <span class="card-corner"><span>${label}</span><span class="card-suit-small">${card.suit}</span></span>
      <span class="card-suit-large" aria-hidden="true">${card.suit}</span>
    `;

    if (selected && selected.column === columnIndex && cardIndex >= selected.cardIndex) {
      cardEl.classList.add(cardIndex === selected.cardIndex ? "selected" : "selected-sequence");
    }

    cardEl.addEventListener("click", (event) => {
      event.stopPropagation();
      onCardClick(columnIndex, cardIndex);
    });

    return cardEl;
  }

  function renderStock() {
    const deals = Math.floor(stock.length / 10);
    stockCountEl.textContent = deals === 1 ? "1 deal" : `${deals} deals`;
    stockEl.classList.toggle("empty", stock.length === 0);
    stockEl.disabled = stock.length === 0 || gameOver;
    stockEl.setAttribute("aria-label", stock.length ? `Deal a new row. ${deals} deals remaining.` : "Stock is empty");
  }

  function renderCompletedRuns() {
    completedAreaEl.innerHTML = "";
    completedRuns.forEach((suit, index) => {
      const runEl = document.createElement("div");
      runEl.className = `completed-run ${RED_SUITS.has(suit) ? "red" : ""}`;
      runEl.textContent = suit;
      runEl.setAttribute("aria-label", `Completed run ${index + 1}: ${suitName(suit)}`);
      completedAreaEl.appendChild(runEl);
    });
  }

  function onCardClick(columnIndex, cardIndex) {
    if (gameOver) return;
    const card = tableau[columnIndex][cardIndex];
    if (!card || !card.faceUp) return;

    if (selected) {
      if (selected.column === columnIndex && selected.cardIndex === cardIndex) {
        selected = null;
        showMessage("Selection cleared.");
        render();
        return;
      }

      if (canMoveToColumn(selected.column, selected.cardIndex, columnIndex)) {
        moveSequence(selected.column, selected.cardIndex, columnIndex);
        return;
      }
    }

    if (isMovableSequence(columnIndex, cardIndex)) {
      selected = { column: columnIndex, cardIndex };
      showMessage(`Selected ${rankLabel(card.rank)}${card.suit}. Choose a destination column.`);
    } else {
      selected = null;
      showMessage("That group cannot move together. Select a same-suit descending sequence.", "error");
    }
    render();
  }

  function onColumnClick(columnIndex) {
    if (!selected || gameOver) return;
    if (canMoveToColumn(selected.column, selected.cardIndex, columnIndex)) {
      moveSequence(selected.column, selected.cardIndex, columnIndex);
    } else {
      showMessage("That move is not allowed.", "error");
    }
  }

  function isMovableSequence(columnIndex, startIndex) {
    const column = tableau[columnIndex];
    if (!column[startIndex] || !column[startIndex].faceUp) return false;
    for (let i = startIndex; i < column.length - 1; i += 1) {
      const current = column[i];
      const next = column[i + 1];
      if (!next.faceUp || current.suit !== next.suit || current.rank !== next.rank + 1) return false;
    }
    return true;
  }

  function canMoveToColumn(fromColumn, startIndex, toColumn) {
    if (fromColumn === toColumn) return false;
    if (!isMovableSequence(fromColumn, startIndex)) return false;

    const movingCard = tableau[fromColumn][startIndex];
    const destination = tableau[toColumn];
    if (destination.length === 0) return true;

    const target = destination[destination.length - 1];
    return target.faceUp && target.rank === movingCard.rank + 1;
  }

  function moveSequence(fromColumn, startIndex, toColumn) {
    const movingCards = tableau[fromColumn].splice(startIndex);
    tableau[toColumn].push(...movingCards);
    selected = null;
    moves += 1;
    score = Math.max(0, score - 1);

    flipTopCard(fromColumn);
    resolveCompletedRuns();
    showMessage("Move completed.");
    render();
    checkWin();
  }

  function flipTopCard(columnIndex) {
    const column = tableau[columnIndex];
    if (!column.length) return;
    const top = column[column.length - 1];
    if (!top.faceUp) top.faceUp = true;
  }

  function resolveCompletedRuns() {
    let removedAny = true;
    while (removedAny) {
      removedAny = false;
      for (let columnIndex = 0; columnIndex < tableau.length; columnIndex += 1) {
        if (hasCompleteRun(tableau[columnIndex])) {
          const removed = tableau[columnIndex].splice(-13);
          const suit = removed[0].suit;
          completedRuns.push(suit);
          score += 100;
          flipTopCard(columnIndex);
          removedAny = true;
          showMessage("Complete King-to-Ace run cleared! +100 points", "success");
        }
      }
    }
  }

  function hasCompleteRun(column) {
    if (column.length < 13) return false;
    const run = column.slice(-13);
    const suit = run[0].suit;
    for (let i = 0; i < 13; i += 1) {
      const expectedRank = 13 - i;
      if (!run[i].faceUp || run[i].suit !== suit || run[i].rank !== expectedRank) return false;
    }
    return true;
  }

  function dealStock() {
    if (gameOver || stock.length === 0) return;
    if (tableau.some((column) => column.length === 0)) {
      showMessage("Fill every empty column before dealing a new row.", "error");
      return;
    }

    selected = null;
    for (let columnIndex = 0; columnIndex < 10; columnIndex += 1) {
      const card = stock.shift();
      card.faceUp = true;
      tableau[columnIndex].push(card);
    }
    moves += 1;
    score = Math.max(0, score - 1);
    resolveCompletedRuns();
    showMessage("A new row was dealt from the stock.");
    render();
    checkWin();
  }

  function checkWin() {
    if (completedRuns.length === 8) {
      gameOver = true;
      selected = null;
      render();
      winSummaryEl.textContent = `You completed all eight runs in ${moves} moves with a score of ${score}.`;
      winModalEl.classList.add("open");
      winModalEl.setAttribute("aria-hidden", "false");
      playAgainEl.focus();
    }
  }

  function closeWinModal() {
    winModalEl.classList.remove("open");
    winModalEl.setAttribute("aria-hidden", "true");
  }

  function showMessage(text, type = "") {
    window.clearTimeout(messageTimer);
    messageEl.textContent = text;
    messageEl.className = `game-message${type ? ` ${type}` : ""}`;
    messageTimer = window.setTimeout(() => {
      messageEl.textContent = "Build descending sequences. Same-suit sequences can move together.";
      messageEl.className = "game-message";
    }, 4200);
  }

  function rankLabel(rank) {
    return RANK_LABELS[rank] || String(rank);
  }

  function suitName(suit) {
    return ({ "♠": "spades", "♥": "hearts", "♦": "diamonds", "♣": "clubs" })[suit];
  }

  stockEl.addEventListener("click", dealStock);
  newGameEl.addEventListener("click", startGame);
  playAgainEl.addEventListener("click", startGame);
  difficultyEl.addEventListener("change", () => {
    showMessage("Difficulty selected. Press New Game to apply it.");
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && selected) {
      selected = null;
      showMessage("Selection cleared.");
      render();
    }
  });

  startGame();
})();


}
function begin(){poster.hidden=true;gm.hidden=false;if(!booted){booted=true;var s=document.createElement("style");s.textContent=LOOK;document.head.appendChild(s);boot();}else{var r=document.getElementById("new-game");if(r)r.click();}}
poster.addEventListener("click",begin);
var nb=document.getElementById("new");if(nb)nb.addEventListener("click",begin);
})();
