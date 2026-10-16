/* Klondike Solitaire - game logic + its own look. Layout lives in style.css; page shell lives in the HTML. */
(function(){"use strict";
var gm=document.getElementById("gm"),poster=document.getElementById("poster"),booted=false;
var LOOK=".gm{\n  \n  \n  --accent: #16b8c4;\n  --action: #ffb84d;\n  --success: #22c55e;\n  --danger: #ef5b5b;\n  --page: #f6f7fb;\n  \n  \n  \n  \n  --felt: #176b4c;\n  --felt-dark: #0f533b;\n  --black-card: #1c2434;\n  --red-card: #d64b4b;\n  \n  --radius: 18px;\n}.gm *{\n  box-sizing: border-box;\n}.gm button{\n  font: inherit;\n}.gm button:focus-visible,.gm summary:focus-visible,.gm .card-face:focus-visible{\n  outline: 3px solid rgba(255, 184, 77, 0.95);\n  outline-offset: 3px;\n}.gm .game-page{\n  padding: 40px 0 80px;\n}.gm h2,.gm h3,.gm p{\n  margin-top: 0;\n}.gm h2{\n  margin-bottom: 16px;\n  font-size: clamp(28px, 4vw, 36px);\n  line-height: 1.18;\n  font-weight: 800;\n  letter-spacing: -0.025em;\n}.gm .game-shell{\n  background: #fff;\n  border: 1px solid var(--border);\n  border-radius: 20px;\n  box-shadow: var(--shadow);\n  overflow: hidden;\n}.gm .game-toolbar{\n  min-height: 82px;\n  padding: 16px 20px;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 20px;\n  border-bottom: 1px solid var(--border);\n}.gm .status-group{\n  display: flex;\n  flex-wrap: wrap;\n  gap: 24px;\n}.gm .metric{\n  min-width: 66px;\n}.gm .metric span{\n  display: block;\n  font-size: 12px;\n  text-transform: uppercase;\n  letter-spacing: 0.06em;\n  color: var(--muted);\n  font-weight: 800;\n}.gm .metric strong{\n  display: block;\n  margin-top: 2px;\n  font-size: 22px;\n  line-height: 1.15;\n}.gm .toolbar-actions{\n  display: flex;\n  gap: 10px;\n}.gm .btn{\n  min-height: 46px;\n  padding: 0 18px;\n  border: 0;\n  border-radius: 12px;\n  cursor: pointer;\n  font-weight: 800;\n  transition: transform 0.14s ease, background 0.14s ease, box-shadow 0.14s ease;\n}.gm .btn:not(:disabled):hover{\n  transform: translateY(-1px);\n}.gm .btn:disabled{\n  cursor: not-allowed;\n  opacity: 0.48;\n}.gm .btn-primary{\n  background: var(--brand);\n  color: #fff;\n  box-shadow: 0 8px 20px rgba(91, 92, 226, 0.25);\n}.gm .btn-primary:not(:disabled):hover{\n  background: var(--brand-dark);\n}.gm .btn-secondary{\n  background: #eef0ff;\n  color: var(--brand-dark);\n}.gm .game-message{\n  min-height: 42px;\n  display: flex;\n  align-items: center;\n  padding: 8px 20px;\n  background: #fbfbfe;\n  border-bottom: 1px solid var(--border);\n  color: var(--muted);\n  font-size: 14px;\n  font-weight: 700;\n}.gm .board-wrap{\n  overflow-x: auto;\n  -webkit-overflow-scrolling: touch;\n  background: var(--felt-dark);\n}.gm .board{\n  min-width: 760px;\n  min-height: 690px;\n  padding: 24px;\n  background:\n    radial-gradient(circle at top left, rgba(255, 255, 255, 0.06), transparent 34%),\n    var(--felt);\n  user-select: none;\n}.gm .top-row{\n  display: flex;\n  justify-content: space-between;\n  gap: 28px;\n  margin-bottom: 28px;\n}.gm .top-left,.gm .foundations{\n  display: flex;\n  gap: 14px;\n}.gm .pile{\n  position: relative;\n  width: 92px;\n  height: 128px;\n  flex: 0 0 92px;\n  border: 2px dashed rgba(255, 255, 255, 0.3);\n  border-radius: 10px;\n}.gm .stock{\n  padding: 0;\n  appearance: none;\n  background: rgba(255, 255, 255, 0.08);\n  cursor: pointer;\n}.gm .stock.has-cards::before,.gm .card-back{\n  content: \"\";\n  position: absolute;\n  inset: 3px;\n  border-radius: 8px;\n  background:\n    linear-gradient(45deg, transparent 45%, rgba(255,255,255,.15) 45%, rgba(255,255,255,.15) 55%, transparent 55%),\n    linear-gradient(-45deg, transparent 45%, rgba(255,255,255,.12) 45%, rgba(255,255,255,.12) 55%, transparent 55%),\n    #3638a8;\n  background-size: 14px 14px;\n  border: 2px solid #fff;\n  box-shadow: 0 4px 10px rgba(0,0,0,.18);\n}.gm .stock.empty::after{\n  content: \"\u21bb\";\n  position: absolute;\n  inset: 0;\n  display: grid;\n  place-items: center;\n  color: rgba(255,255,255,.78);\n  font-size: 34px;\n  font-weight: 800;\n}.gm .foundation::before{\n  content: attr(data-suit-hint);\n  position: absolute;\n  inset: 0;\n  display: grid;\n  place-items: center;\n  color: rgba(255,255,255,.28);\n  font-size: 40px;\n}.gm .tableau{\n  display: grid;\n  grid-template-columns: repeat(7, 92px);\n  justify-content: space-between;\n  gap: 14px;\n}.gm .tableau-column{\n  position: relative;\n  min-height: 420px;\n  border-radius: 10px;\n}.gm .tableau-column:empty{\n  border: 2px dashed rgba(255,255,255,.22);\n}.gm .card-face,.gm .card-back{\n  width: 92px;\n  height: 128px;\n  border-radius: 10px;\n}.gm .card-face{\n  position: absolute;\n  left: 0;\n  display: block;\n  padding: 7px;\n  border: 1px solid rgba(17, 24, 39, 0.16);\n  background: #fff;\n  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.19);\n  cursor: grab;\n  touch-action: manipulation;\n  transition: transform 0.12s ease, box-shadow 0.12s ease;\n  z-index: 2;\n}.gm .card-face:hover{\n  transform: translateY(-2px);\n  box-shadow: 0 7px 16px rgba(0, 0, 0, 0.23);\n}.gm .card-face.red{\n  color: var(--red-card);\n}.gm .card-face.black{\n  color: var(--black-card);\n}.gm .card-face.selected{\n  transform: translateY(-5px);\n  box-shadow: 0 0 0 4px var(--action), 0 12px 22px rgba(0,0,0,.22);\n  z-index: 200 !important;\n}.gm .card-face.dragging{\n  opacity: 0.65;\n}.gm .card-rank{\n  display: block;\n  font-size: 19px;\n  line-height: 1;\n  font-weight: 800;\n}.gm .card-suit{\n  display: block;\n  margin-top: 2px;\n  font-size: 21px;\n  line-height: 1;\n}.gm .card-center{\n  position: absolute;\n  inset: 0;\n  display: grid;\n  place-items: center;\n  font-size: 39px;\n  opacity: 0.94;\n  pointer-events: none;\n}.gm .card-back{\n  position: absolute;\n  left: 0;\n  display: block;\n  border: 0;\n  z-index: 1;\n}.gm .waste .card-face,.gm .foundation .card-face{\n  top: 0 !important;\n}.gm .drop-target{\n  box-shadow: inset 0 0 0 4px rgba(255, 184, 77, 0.95);\n}.gm .mobile-help{\n  padding: 12px 20px 16px;\n  color: var(--muted);\n  font-size: 14px;\n  background: #fff;\n}.gm .tips-list{\n  padding-left: 22px;\n  margin-bottom: 0;\n}.gm .tips-list li + li{\n  margin-top: 8px;\n}.gm .win-overlay{\n  position: fixed;\n  inset: 0;\n  z-index: 5000;\n  display: grid;\n  place-items: center;\n  padding: 20px;\n  background: rgba(17, 24, 39, 0.68);\n}.gm .win-overlay[hidden]{\n  display: none;\n}.gm .win-card{\n  width: min(430px, 100%);\n  padding: 34px;\n  text-align: center;\n  background: #fff;\n  border-radius: 20px;\n  box-shadow: 0 24px 70px rgba(0,0,0,.28);\n}.gm .win-icon{\n  font-size: 58px;\n}.gm .win-card h2{\n  margin-top: 10px;\n  margin-bottom: 8px;\n}.gm .win-card p{\n  color: var(--muted);\n  margin-bottom: 22px;\n}@media (max-width: 900px){.gm .game-toolbar{\n    align-items: flex-start;\n    flex-direction: column;\n  }.gm .toolbar-actions{\n    width: 100%;\n  }.gm .toolbar-actions .btn{\n    flex: 1;\n  }}@media (max-width: 640px){.gm .game-page{\n    padding-top: 26px;\n  }.gm .game-shell{\n    border-radius: 14px;\n  }.gm .game-toolbar,.gm .game-message,.gm .mobile-help{\n    padding-left: 14px;\n    padding-right: 14px;\n  }.gm .status-group{\n    width: 100%;\n    justify-content: space-between;\n    gap: 12px;\n  }.gm .metric strong{\n    font-size: 20px;\n  }.gm .board{\n    transform-origin: top left;\n    min-height: 650px;\n    padding: 18px;\n  }}@media (prefers-reduced-motion: reduce){.gm *,.gm *::before,.gm *::after{\n    scroll-behavior: auto !important;\n    transition-duration: 0.001ms !important;\n    animation-duration: 0.001ms !important;\n    animation-iteration-count: 1 !important;\n  }}";
function __ready(f){f()}
function boot(){
"use strict";

const SUITS = ["♠", "♥", "♦", "♣"];
const SUIT_NAMES = { "♠": "Spades", "♥": "Hearts", "♦": "Diamonds", "♣": "Clubs" };
const RANKS = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
const RANK_VALUE = Object.fromEntries(RANKS.map((rank, index) => [rank, index + 1]));
const FOUNDATION_HINTS = ["♠", "♥", "♦", "♣"];

const state = {
  stock: [],
  waste: [],
  foundations: [[], [], [], []],
  tableau: [[], [], [], [], [], [], []],
  selected: null,
  history: [],
  score: 0,
  moves: 0,
  elapsed: 0,
  timerId: null,
  gameStarted: false,
  gameWon: false,
  lastTap: { cardId: null, time: 0 }
};

const els = {
  stock: document.getElementById("stock-pile"),
  waste: document.getElementById("waste-pile"),
  foundations: [...document.querySelectorAll(".foundation")],
  tableau: [...document.querySelectorAll(".tableau-column")],
  moves: document.getElementById("move-count"),
  score: document.getElementById("score"),
  timer: document.getElementById("timer"),
  message: document.getElementById("game-message"),
  undo: document.getElementById("undo-btn"),
  newGame: document.getElementById("new-game-btn"),
  winOverlay: document.getElementById("win-overlay"),
  winSummary: document.getElementById("win-summary"),
  playAgain: document.getElementById("play-again-btn")
};

FOUNDATION_HINTS.forEach((suit, i) => els.foundations[i].dataset.suitHint = suit);

function createDeck() {
  let id = 0;
  return SUITS.flatMap((suit) => RANKS.map((rank) => ({
    id: `card-${id++}`,
    suit,
    rank,
    value: RANK_VALUE[rank],
    color: suit === "♥" || suit === "♦" ? "red" : "black",
    faceUp: false
  })));
}

function shuffle(deck) {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

function newGame() {
  stopTimer();
  const deck = shuffle(createDeck());

  state.stock = [];
  state.waste = [];
  state.foundations = [[], [], [], []];
  state.tableau = [[], [], [], [], [], [], []];
  state.selected = null;
  state.history = [];
  state.score = 0;
  state.moves = 0;
  state.elapsed = 0;
  state.gameStarted = false;
  state.gameWon = false;
  state.lastTap = { cardId: null, time: 0 };
  els.winOverlay.hidden = true;

  for (let column = 0; column < 7; column++) {
    for (let row = 0; row <= column; row++) {
      const card = deck.pop();
      card.faceUp = row === column;
      state.tableau[column].push(card);
    }
  }

  state.stock = deck.map((card) => ({ ...card, faceUp: false }));
  setMessage("Build all four foundations from Ace to King.");
  render();
}

function startTimerIfNeeded() {
  if (state.gameStarted || state.gameWon) return;
  state.gameStarted = true;
  state.timerId = window.setInterval(() => {
    state.elapsed += 1;
    updateTimer();
  }, 1000);
}

function stopTimer() {
  if (state.timerId) {
    clearInterval(state.timerId);
    state.timerId = null;
  }
}

function updateTimer() {
  const minutes = Math.floor(state.elapsed / 60).toString().padStart(2, "0");
  const seconds = (state.elapsed % 60).toString().padStart(2, "0");
  els.timer.textContent = `${minutes}:${seconds}`;
}

function cloneCard(card) {
  return { ...card };
}

function snapshot() {
  return {
    stock: state.stock.map(cloneCard),
    waste: state.waste.map(cloneCard),
    foundations: state.foundations.map((pile) => pile.map(cloneCard)),
    tableau: state.tableau.map((column) => column.map(cloneCard)),
    score: state.score,
    moves: state.moves,
    elapsed: state.elapsed,
    gameStarted: state.gameStarted
  };
}

function pushHistory() {
  state.history.push(snapshot());
  if (state.history.length > 120) state.history.shift();
}

function restoreSnapshot(snap) {
  state.stock = snap.stock.map(cloneCard);
  state.waste = snap.waste.map(cloneCard);
  state.foundations = snap.foundations.map((pile) => pile.map(cloneCard));
  state.tableau = snap.tableau.map((column) => column.map(cloneCard));
  state.score = snap.score;
  state.moves = snap.moves;
  state.elapsed = snap.elapsed;
  state.gameStarted = snap.gameStarted;
  state.selected = null;
  state.gameWon = false;
  els.winOverlay.hidden = true;
  stopTimer();
  if (state.gameStarted) {
    state.timerId = window.setInterval(() => {
      state.elapsed += 1;
      updateTimer();
    }, 1000);
  }
  setMessage("Move undone.");
  render();
}

function undo() {
  const previous = state.history.pop();
  if (!previous) return;
  restoreSnapshot(previous);
}

function setMessage(message) {
  els.message.textContent = message;
}

function render() {
  renderStock();
  renderWaste();
  renderFoundations();
  renderTableau();
  renderStatus();
}

function renderStatus() {
  els.moves.textContent = state.moves;
  els.score.textContent = state.score;
  els.undo.disabled = state.history.length === 0;
  updateTimer();
}

function renderStock() {
  els.stock.classList.toggle("has-cards", state.stock.length > 0);
  els.stock.classList.toggle("empty", state.stock.length === 0);
  els.stock.setAttribute(
    "aria-label",
    state.stock.length > 0
      ? `Stock pile with ${state.stock.length} cards. Draw a card.`
      : `Empty stock pile. Recycle ${state.waste.length} waste cards.`
  );
}

function renderWaste() {
  els.waste.innerHTML = "";
  const card = state.waste.at(-1);
  if (!card) return;
  const cardEl = createCardElement(card, { source: "waste", index: state.waste.length - 1 });
  cardEl.style.top = "0px";
  els.waste.appendChild(cardEl);
}

function renderFoundations() {
  els.foundations.forEach((el, foundationIndex) => {
    el.innerHTML = "";
    const pile = state.foundations[foundationIndex];
    const card = pile.at(-1);
    if (card) {
      const cardEl = createCardElement(card, {
        source: "foundation",
        foundationIndex,
        index: pile.length - 1
      });
      cardEl.style.top = "0px";
      el.appendChild(cardEl);
    }
  });
}

function renderTableau() {
  els.tableau.forEach((columnEl, columnIndex) => {
    columnEl.innerHTML = "";
    const column = state.tableau[columnIndex];
    let top = 0;

    column.forEach((card, cardIndex) => {
      if (card.faceUp) {
        const cardEl = createCardElement(card, { source: "tableau", columnIndex, index: cardIndex });
        cardEl.style.top = `${top}px`;
        cardEl.style.zIndex = String(cardIndex + 2);
        columnEl.appendChild(cardEl);
        top += 31;
      } else {
        const back = document.createElement("div");
        back.className = "card-back";
        back.style.top = `${top}px`;
        back.style.zIndex = String(cardIndex + 1);
        back.setAttribute("aria-hidden", "true");
        columnEl.appendChild(back);
        top += 18;
      }
    });

    const minHeight = Math.max(420, top + 135);
    columnEl.style.minHeight = `${minHeight}px`;
  });
}

function createCardElement(card, location) {
  const el = document.createElement("button");
  el.type = "button";
  el.className = `card-face ${card.color}`;
  el.dataset.cardId = card.id;
  el.dataset.source = location.source;
  el.draggable = true;
  el.setAttribute("aria-label", `${card.rank} of ${SUIT_NAMES[card.suit]}`);

  if (location.columnIndex !== undefined) el.dataset.columnIndex = String(location.columnIndex);
  if (location.foundationIndex !== undefined) el.dataset.foundationIndex = String(location.foundationIndex);
  if (location.index !== undefined) el.dataset.cardIndex = String(location.index);

  if (isSelected(card.id)) el.classList.add("selected");

  el.innerHTML = `
    <span class="card-rank">${card.rank}</span>
    <span class="card-suit">${card.suit}</span>
    <span class="card-center" aria-hidden="true">${card.suit}</span>
  `;

  el.addEventListener("click", handleCardClick);
  el.addEventListener("dragstart", handleDragStart);
  el.addEventListener("dragend", handleDragEnd);
  return el;
}

function isSelected(cardId) {
  if (!state.selected) return false;
  const cards = getSelectedCards();
  return cards.some((card) => card.id === cardId);
}

function getSelectedCards() {
  if (!state.selected) return [];
  if (state.selected.source === "waste") {
    const card = state.waste.at(-1);
    return card ? [card] : [];
  }
  if (state.selected.source === "foundation") {
    const pile = state.foundations[state.selected.foundationIndex];
    const card = pile.at(-1);
    return card ? [card] : [];
  }
  if (state.selected.source === "tableau") {
    return state.tableau[state.selected.columnIndex].slice(state.selected.index);
  }
  return [];
}

function handleCardClick(event) {
  const el = event.currentTarget;
  const source = el.dataset.source;
  const cardId = el.dataset.cardId;
  const now = Date.now();
  const isDoubleTap = state.lastTap.cardId === cardId && now - state.lastTap.time < 420;
  state.lastTap = { cardId, time: now };

  const location = {
    source,
    cardId,
    index: Number(el.dataset.cardIndex)
  };
  if (el.dataset.columnIndex !== undefined) location.columnIndex = Number(el.dataset.columnIndex);
  if (el.dataset.foundationIndex !== undefined) location.foundationIndex = Number(el.dataset.foundationIndex);

  if (isDoubleTap) {
    if (tryAutoFoundation(location)) {
      state.lastTap = { cardId: null, time: 0 };
      return;
    }
  }

  if (state.selected) {
    const clickedSameSelection = selectedMatchesLocation(location);
    if (clickedSameSelection) {
      clearSelection();
      render();
      return;
    }

    if (source === "foundation" && tryMoveSelectionToFoundation(location.foundationIndex)) return;
    if (source === "tableau" && tryMoveSelectionToTableau(location.columnIndex)) return;
  }

  selectLocation(location);
}

function selectedMatchesLocation(location) {
  if (!state.selected) return false;
  return state.selected.source === location.source
    && state.selected.columnIndex === location.columnIndex
    && state.selected.foundationIndex === location.foundationIndex
    && state.selected.index === location.index;
}

function selectLocation(location) {
  if (location.source === "tableau") {
    const column = state.tableau[location.columnIndex];
    const card = column[location.index];
    if (!card || !card.faceUp) return;
    if (!isValidFaceUpRun(column.slice(location.index))) {
      setMessage("That stack cannot move because the face-up cards are not in valid descending alternating order.");
      return;
    }
  }

  if (location.source === "foundation") {
    const pile = state.foundations[location.foundationIndex];
    if (location.index !== pile.length - 1) return;
  }

  if (location.source === "waste" && location.index !== state.waste.length - 1) return;

  state.selected = location;
  setMessage("Card selected. Choose a valid destination.");
  render();
}

function clearSelection() {
  state.selected = null;
}

function isValidFaceUpRun(cards) {
  if (!cards.length) return false;
  if (cards.some((card) => !card.faceUp)) return false;
  for (let i = 0; i < cards.length - 1; i++) {
    const current = cards[i];
    const next = cards[i + 1];
    if (current.value !== next.value + 1 || current.color === next.color) return false;
  }
  return true;
}

function canPlaceOnTableau(card, targetColumn) {
  if (!targetColumn.length) return card.rank === "K";
  const target = targetColumn.at(-1);
  return target.faceUp && target.color !== card.color && target.value === card.value + 1;
}

function canPlaceOnFoundation(card, foundationIndex) {
  const pile = state.foundations[foundationIndex];
  if (!pile.length) return card.rank === "A";
  const top = pile.at(-1);
  return top.suit === card.suit && card.value === top.value + 1;
}

function tryMoveSelectionToTableau(targetColumnIndex) {
  if (!state.selected) return false;
  const cards = getSelectedCards();
  if (!cards.length) return false;
  const firstCard = cards[0];
  const targetColumn = state.tableau[targetColumnIndex];

  if (state.selected.source === "tableau" && state.selected.columnIndex === targetColumnIndex) return false;
  if (!canPlaceOnTableau(firstCard, targetColumn)) {
    setMessage("That card cannot be placed on this tableau column.");
    return false;
  }

  pushHistory();
  startTimerIfNeeded();

  const source = state.selected.source;
  if (source === "tableau") {
    const sourceColumn = state.tableau[state.selected.columnIndex];
    const moved = sourceColumn.splice(state.selected.index);
    state.tableau[targetColumnIndex].push(...moved);
    state.score += 5;
    revealTopCardIfNeeded(state.selected.columnIndex);
  } else if (source === "waste") {
    const moved = state.waste.pop();
    state.tableau[targetColumnIndex].push(moved);
    state.score += 5;
  } else if (source === "foundation") {
    const moved = state.foundations[state.selected.foundationIndex].pop();
    state.tableau[targetColumnIndex].push(moved);
    state.score = Math.max(0, state.score - 10);
  } else {
    state.history.pop();
    return false;
  }

  state.moves += 1;
  state.selected = null;
  setMessage("Move complete.");
  render();
  checkWin();
  return true;
}

function tryMoveSelectionToFoundation(foundationIndex) {
  if (!state.selected) return false;
  const cards = getSelectedCards();
  if (cards.length !== 1) {
    setMessage("Only one card at a time can move to a foundation.");
    return false;
  }

  const card = cards[0];
  if (!canPlaceOnFoundation(card, foundationIndex)) {
    setMessage("That card cannot be placed on this foundation.");
    return false;
  }

  pushHistory();
  startTimerIfNeeded();

  if (state.selected.source === "waste") {
    state.waste.pop();
  } else if (state.selected.source === "tableau") {
    const sourceColumn = state.tableau[state.selected.columnIndex];
    sourceColumn.splice(state.selected.index, 1);
    revealTopCardIfNeeded(state.selected.columnIndex);
  } else if (state.selected.source === "foundation") {
    if (state.selected.foundationIndex === foundationIndex) {
      state.history.pop();
      return false;
    }
    state.foundations[state.selected.foundationIndex].pop();
  }

  state.foundations[foundationIndex].push(card);
  state.score += 10;
  state.moves += 1;
  state.selected = null;
  setMessage(`${card.rank} of ${SUIT_NAMES[card.suit]} moved to a foundation.`);
  render();
  checkWin();
  return true;
}

function revealTopCardIfNeeded(columnIndex) {
  const column = state.tableau[columnIndex];
  const top = column.at(-1);
  if (top && !top.faceUp) {
    top.faceUp = true;
    state.score += 5;
  }
}

function findFoundationFor(card) {
  for (let i = 0; i < state.foundations.length; i++) {
    if (canPlaceOnFoundation(card, i)) return i;
  }
  return -1;
}

function tryAutoFoundation(location) {
  if (location.source === "tableau") {
    const column = state.tableau[location.columnIndex];
    if (location.index !== column.length - 1) return false;
  }
  if (location.source === "foundation") return false;

  const card = location.source === "waste"
    ? state.waste.at(-1)
    : state.tableau[location.columnIndex]?.[location.index];

  if (!card) return false;
  const target = findFoundationFor(card);
  if (target === -1) return false;

  state.selected = location;
  return tryMoveSelectionToFoundation(target);
}

function drawFromStock() {
  if (state.gameWon) return;
  clearSelection();

  if (state.stock.length > 0) {
    pushHistory();
    startTimerIfNeeded();
    const card = state.stock.pop();
    card.faceUp = true;
    state.waste.push(card);
    state.moves += 1;
    setMessage(`Drew ${card.rank} of ${SUIT_NAMES[card.suit]}.`);
  } else if (state.waste.length > 0) {
    pushHistory();
    startTimerIfNeeded();
    state.stock = state.waste.reverse().map((card) => ({ ...card, faceUp: false }));
    state.waste = [];
    state.moves += 1;
    state.score = Math.max(0, state.score - 20);
    setMessage("Waste recycled back into the stock.");
  } else {
    setMessage("No cards remain in the stock or waste.");
  }

  render();
}

function checkWin() {
  const foundationCount = state.foundations.reduce((sum, pile) => sum + pile.length, 0);
  if (foundationCount !== 52) return;

  state.gameWon = true;
  stopTimer();
  state.selected = null;
  const bonus = Math.max(0, 700 - state.moves * 2 - Math.floor(state.elapsed / 5));
  state.score += bonus;
  renderStatus();

  const minutes = Math.floor(state.elapsed / 60);
  const seconds = state.elapsed % 60;
  els.winSummary.textContent = `Finished in ${minutes}:${seconds.toString().padStart(2, "0")} with ${state.moves} moves and ${state.score} points.`;
  els.winOverlay.hidden = false;
  setMessage("Congratulations! You completed Klondike Solitaire.");
}

function handleDragStart(event) {
  const el = event.currentTarget;
  const source = el.dataset.source;
  const location = {
    source,
    cardId: el.dataset.cardId,
    index: Number(el.dataset.cardIndex)
  };
  if (el.dataset.columnIndex !== undefined) location.columnIndex = Number(el.dataset.columnIndex);
  if (el.dataset.foundationIndex !== undefined) location.foundationIndex = Number(el.dataset.foundationIndex);

  if (source === "tableau") {
    const column = state.tableau[location.columnIndex];
    if (!isValidFaceUpRun(column.slice(location.index))) {
      event.preventDefault();
      return;
    }
  }

  state.selected = location;
  event.dataTransfer.effectAllowed = "move";
  event.dataTransfer.setData("text/plain", el.dataset.cardId);
  el.classList.add("dragging");
  render();
}

function handleDragEnd() {
  document.querySelectorAll(".drop-target").forEach((el) => el.classList.remove("drop-target"));
  document.querySelectorAll(".dragging").forEach((el) => el.classList.remove("dragging"));
}

function bindDropTargets() {
  els.tableau.forEach((columnEl, columnIndex) => {
    columnEl.addEventListener("dragover", (event) => {
      if (!state.selected) return;
      event.preventDefault();
      event.dataTransfer.dropEffect = "move";
      columnEl.classList.add("drop-target");
    });
    columnEl.addEventListener("dragleave", () => columnEl.classList.remove("drop-target"));
    columnEl.addEventListener("drop", (event) => {
      event.preventDefault();
      columnEl.classList.remove("drop-target");
      tryMoveSelectionToTableau(columnIndex);
    });
    columnEl.addEventListener("click", (event) => {
      if (event.target.closest(".card-face")) return;
      if (state.selected) tryMoveSelectionToTableau(columnIndex);
    });
  });

  els.foundations.forEach((foundationEl, foundationIndex) => {
    foundationEl.addEventListener("dragover", (event) => {
      if (!state.selected) return;
      event.preventDefault();
      event.dataTransfer.dropEffect = "move";
      foundationEl.classList.add("drop-target");
    });
    foundationEl.addEventListener("dragleave", () => foundationEl.classList.remove("drop-target"));
    foundationEl.addEventListener("drop", (event) => {
      event.preventDefault();
      foundationEl.classList.remove("drop-target");
      tryMoveSelectionToFoundation(foundationIndex);
    });
    foundationEl.addEventListener("click", (event) => {
      if (event.target.closest(".card-face")) return;
      if (state.selected) tryMoveSelectionToFoundation(foundationIndex);
    });
  });
}

els.stock.addEventListener("click", drawFromStock);
els.undo.addEventListener("click", undo);
els.newGame.addEventListener("click", newGame);
els.playAgain.addEventListener("click", newGame);

window.addEventListener("keydown", (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "z") {
    event.preventDefault();
    undo();
  }
  if (event.key === "Escape" && state.selected) {
    clearSelection();
    setMessage("Selection cleared.");
    render();
  }
});

bindDropTargets();
newGame();


}
function begin(){poster.hidden=true;gm.hidden=false;if(!booted){booted=true;var s=document.createElement("style");s.textContent=LOOK;document.head.appendChild(s);boot();}else{var r=document.getElementById("new-game-btn");if(r)r.click();}}
poster.addEventListener("click",begin);
var nb=document.getElementById("new");if(nb)nb.addEventListener("click",begin);
})();
