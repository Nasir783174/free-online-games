/* Solitaire - game logic + its own look. Layout lives in style.css; page shell lives in the HTML. */
(function(){"use strict";
var gm=document.getElementById("gm"),poster=document.getElementById("poster"),booted=false;
var LOOK=".gm{\n  \n  \n  --teal: #16B8C4;\n  --action: #FFB84D;\n  --success: #22C55E;\n  --danger: #EF5B5B;\n  \n  \n  \n  \n  \n  --felt: #0E5C3D;\n  --felt-dark: #0A4931;\n  --felt-line: rgba(255, 255, 255, 0.18);\n  \n  --card-w: 92px;\n  --card-h: 128px;\n  --card-radius: 10px;\n  --stack-step: 31px;\n  --stack-step-down: 16px;\n}.gm *{\n  box-sizing: border-box;\n}.gm button{\n  font: inherit;\n}.gm button:focus-visible,.gm [tabindex]:focus-visible{\n  outline: 3px solid rgba(255, 184, 77, 0.95);\n  outline-offset: 3px;\n}.gm h2,.gm h3,.gm p{\n  margin-top: 0;\n}.gm h2{\n  margin-bottom: 14px;\n  font-size: clamp(28px, 4vw, 36px);\n  line-height: 1.15;\n  font-weight: 700;\n  letter-spacing: -0.02em;\n}.gm h3{\n  margin-bottom: 6px;\n  font-size: 22px;\n  line-height: 1.25;\n  font-weight: 700;\n}.gm .game-section{\n  padding: 0 0 72px;\n}.gm .game-shell{\n  background: var(--card);\n  border: 1px solid var(--border);\n  border-radius: 20px;\n  box-shadow: var(--shadow);\n  overflow: hidden;\n}.gm .game-toolbar{\n  padding: 18px 20px;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 18px;\n  border-bottom: 1px solid var(--border);\n  background: white;\n}.gm .stats{\n  display: flex;\n  align-items: center;\n  gap: 22px;\n}.gm .stat{\n  min-width: 66px;\n}.gm .stat-label{\n  display: block;\n  color: var(--muted);\n  font-size: 12px;\n  font-weight: 700;\n  text-transform: uppercase;\n  letter-spacing: .06em;\n  line-height: 1.2;\n  margin-bottom: 3px;\n}.gm .stat strong{\n  font-size: 22px;\n  line-height: 1;\n}.gm .toolbar-actions{\n  display: flex;\n  gap: 10px;\n  flex-wrap: wrap;\n  justify-content: flex-end;\n}.gm .tool-btn{\n  min-height: 46px;\n  padding: 0 18px;\n  border: 0;\n  border-radius: 11px;\n  background: var(--brand);\n  color: white;\n  font-weight: 800;\n  font-size: 15px;\n  cursor: pointer;\n  transition: transform .16s ease, background .16s ease, opacity .16s ease;\n}.gm .tool-btn:hover:not(:disabled){\n  background: var(--brand-dark);\n  transform: translateY(-1px);\n}.gm .tool-btn.secondary{\n  background: #EEF0FF;\n  color: var(--brand-dark);\n}.gm .tool-btn.secondary:hover:not(:disabled){\n  background: #E2E5FF;\n}.gm .tool-btn:disabled{\n  opacity: .48;\n  cursor: not-allowed;\n}.gm .status-message{\n  min-height: 44px;\n  display: flex;\n  align-items: center;\n  padding: 9px 20px;\n  font-size: 14px;\n  font-weight: 700;\n  color: #174A36;\n  background: #EDF8F2;\n  border-bottom: 1px solid #D9EEE3;\n}.gm .game-board{\n  position: relative;\n  overflow-x: auto;\n  overflow-y: hidden;\n  padding: 24px;\n  min-height: 640px;\n  background:\n    radial-gradient(circle at 50% 10%, rgba(255,255,255,.045), transparent 35%),\n    var(--felt);\n  color: white;\n  overscroll-behavior-x: contain;\n  scrollbar-width: thin;\n}.gm .game-board::after{\n  content: \"\";\n  position: absolute;\n  inset: 0;\n  pointer-events: none;\n  opacity: .22;\n  background-image:\n    linear-gradient(45deg, rgba(255,255,255,.025) 25%, transparent 25%),\n    linear-gradient(-45deg, rgba(255,255,255,.025) 25%, transparent 25%);\n  background-size: 18px 18px;\n}.gm .top-row,.gm .tableau{\n  min-width: calc((var(--card-w) * 7) + (18px * 6));\n  position: relative;\n  z-index: 1;\n}.gm .top-row{\n  display: flex;\n  justify-content: space-between;\n  gap: 28px;\n  margin-bottom: 32px;\n}.gm .stock-waste-group,.gm .foundation-group{\n  display: flex;\n  gap: 18px;\n}.gm .pile-wrap{\n  width: var(--card-w);\n}.gm .pile-label{\n  display: block;\n  margin: 0 0 7px;\n  text-align: center;\n  font-size: 13px;\n  font-weight: 800;\n  color: rgba(255,255,255,.78);\n  line-height: 1.2;\n}.gm .red-label{\n  color: #FFD4D4;\n}.gm .pile,.gm .tableau-pile{\n  position: relative;\n  width: var(--card-w);\n  min-height: var(--card-h);\n  border-radius: var(--card-radius);\n}.gm .pile{\n  border: 2px dashed var(--felt-line);\n}.gm .foundation-pile::before{\n  position: absolute;\n  inset: 0;\n  display: grid;\n  place-items: center;\n  font-size: 34px;\n  font-weight: 800;\n  color: rgba(255,255,255,.14);\n}.gm .foundation-pile[data-foundation=\"S\"]::before{ content: \"\u2660\"; }.gm .foundation-pile[data-foundation=\"H\"]::before{ content: \"\u2665\"; }.gm .foundation-pile[data-foundation=\"D\"]::before{ content: \"\u2666\"; }.gm .foundation-pile[data-foundation=\"C\"]::before{ content: \"\u2663\"; }.gm .tableau{\n  display: grid;\n  grid-template-columns: repeat(7, var(--card-w));\n  gap: 18px;\n  align-items: start;\n}.gm .tableau-pile{\n  border-radius: var(--card-radius);\n  background: rgba(255,255,255,.025);\n}.gm .tableau-pile:empty{\n  border: 2px dashed rgba(255,255,255,.12);\n}.gm .card{\n  width: var(--card-w);\n  height: var(--card-h);\n  position: absolute;\n  left: 0;\n  top: 0;\n  user-select: none;\n  -webkit-user-select: none;\n  touch-action: none;\n  border-radius: var(--card-radius);\n  box-shadow: 0 5px 12px rgba(0,0,0,.18);\n  cursor: grab;\n}.gm .card:active{\n  cursor: grabbing;\n}.gm .card.face-up{\n  background: #FFFDFC;\n  border: 1px solid rgba(0,0,0,.12);\n  color: #161A23;\n}.gm .card.red{\n  color: #D43B3B;\n}.gm .card.face-down{\n  border: 3px solid rgba(255,255,255,.92);\n  background:\n    linear-gradient(135deg, rgba(255,255,255,.1) 25%, transparent 25%) -8px 0/16px 16px,\n    linear-gradient(225deg, rgba(255,255,255,.1) 25%, transparent 25%) -8px 0/16px 16px,\n    linear-gradient(315deg, rgba(255,255,255,.1) 25%, transparent 25%) 0 0/16px 16px,\n    linear-gradient(45deg, rgba(255,255,255,.1) 25%, #4650C9 25%) 0 0/16px 16px;\n  cursor: default;\n}.gm .card-corner{\n  position: absolute;\n  left: 8px;\n  top: 7px;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  line-height: .92;\n  font-size: 16px;\n  font-weight: 800;\n}.gm .card-corner.bottom{\n  left: auto;\n  top: auto;\n  right: 8px;\n  bottom: 7px;\n  transform: rotate(180deg);\n}.gm .card-suit-center{\n  position: absolute;\n  inset: 0;\n  display: grid;\n  place-items: center;\n  font-size: 42px;\n  font-weight: 700;\n}.gm .card.selected{\n  transform: translateY(-6px);\n  box-shadow: 0 0 0 4px var(--action), 0 10px 22px rgba(0,0,0,.3);\n  z-index: 120 !important;\n}.gm .card.hint{\n  animation: hintPulse 1s ease-in-out 2;\n  box-shadow: 0 0 0 4px var(--action), 0 8px 20px rgba(0,0,0,.26);\n}.gm .pile.hint,.gm .tableau-pile.hint{\n  box-shadow: inset 0 0 0 4px var(--action);\n  animation: pilePulse 1s ease-in-out 2;\n}.gm .drag-ghost{\n  pointer-events: none !important;\n  opacity: .96;\n  filter: drop-shadow(0 14px 16px rgba(0,0,0,.34));\n}.gm .drop-target{\n  box-shadow: inset 0 0 0 4px rgba(255,184,77,.92);\n}.gm .stock-pile{\n  cursor: pointer;\n}.gm .stock-pile.is-empty::before{\n  content: \"\u21bb\";\n  position: absolute;\n  inset: 0;\n  display: grid;\n  place-items: center;\n  color: rgba(255,255,255,.55);\n  font-size: 34px;\n  font-weight: 800;\n}.gm .mobile-help{\n  padding: 12px 20px 16px;\n  color: var(--muted);\n  font-size: 14px;\n  background: white;\n}.gm .section-heading{\n  margin-bottom: 18px;\n  display: flex;\n  align-items: end;\n  justify-content: space-between;\n}.gm .coming-soon{\n  grid-column: 2;\n  color: var(--muted);\n  font-size: 12px;\n  font-weight: 800;\n  text-transform: uppercase;\n  letter-spacing: .05em;\n}.gm details{\n  background: white;\n  border: 1px solid var(--border);\n  border-radius: 14px;\n  padding: 0 20px;\n}.gm summary{\n  cursor: pointer;\n  padding: 18px 0;\n  font-weight: 800;\n}.gm details p{\n  color: var(--muted);\n  margin-bottom: 20px;\n}.gm .modal{\n  position: fixed;\n  inset: 0;\n  z-index: 500;\n  display: grid;\n  place-items: center;\n  padding: 20px;\n  background: rgba(7, 13, 21, .68);\n}.gm .modal[hidden]{\n  display: none;\n}.gm .modal-card{\n  width: min(440px, 100%);\n  padding: 30px;\n  border-radius: 20px;\n  background: white;\n  text-align: center;\n  box-shadow: 0 24px 80px rgba(0,0,0,.28);\n}.gm .win-icon{\n  font-size: 54px;\n  margin-bottom: 6px;\n}.gm .modal-actions{\n  display: flex;\n  justify-content: center;\n  gap: 10px;\n  margin-top: 22px;\n}@keyframes hintPulse{\n  0%, 100% { transform: translateY(0); }\n  50% { transform: translateY(-7px); }\n}@keyframes pilePulse{\n  0%, 100% { background-color: transparent; }\n  50% { background-color: rgba(255,184,77,.12); }\n}@media (max-width: 900px){.gm{\n    --card-w: 82px;\n    --card-h: 114px;\n    --stack-step: 28px;\n    --stack-step-down: 14px;\n  }.gm .game-toolbar{\n    align-items: flex-start;\n    flex-direction: column;\n  }.gm .toolbar-actions{\n    width: 100%;\n    justify-content: flex-start;\n  }}@media (max-width: 650px){.gm{\n    --card-w: 70px;\n    --card-h: 98px;\n    --stack-step: 24px;\n    --stack-step-down: 13px;\n  }.gm .game-toolbar{\n    padding: 15px;\n  }.gm .stats{\n    width: 100%;\n    justify-content: space-between;\n    gap: 10px;\n  }.gm .stat{\n    min-width: auto;\n  }.gm .stat strong{\n    font-size: 20px;\n  }.gm .toolbar-actions{\n    display: grid;\n    grid-template-columns: 1.2fr 1fr 1fr;\n    width: 100%;\n  }.gm .tool-btn{\n    width: 100%;\n    padding-inline: 10px;\n  }.gm .status-message,.gm .mobile-help{\n    padding-left: 15px;\n    padding-right: 15px;\n  }.gm .game-board{\n    padding: 16px 12px 22px;\n    min-height: 570px;\n  }.gm .top-row,.gm .tableau{\n    min-width: calc((var(--card-w) * 7) + (12px * 6));\n  }.gm .tableau{\n    gap: 12px;\n  }.gm .stock-waste-group,.gm .foundation-group{\n    gap: 12px;\n  }.gm .top-row{\n    gap: 20px;\n    margin-bottom: 26px;\n  }.gm .card-corner{\n    left: 6px;\n    top: 5px;\n    font-size: 13px;\n  }.gm .card-corner.bottom{\n    right: 6px;\n    bottom: 5px;\n  }.gm .card-suit-center{\n    font-size: 32px;\n  }}@media (max-width: 430px){.gm{\n    --card-w: 62px;\n    --card-h: 87px;\n    --stack-step: 22px;\n    --stack-step-down: 12px;\n  }.gm .top-row,.gm .tableau{\n    min-width: calc((var(--card-w) * 7) + (10px * 6));\n  }.gm .tableau,.gm .stock-waste-group,.gm .foundation-group{\n    gap: 10px;\n  }.gm .game-board{\n    min-height: 535px;\n  }.gm .pile-label{\n    font-size: 11px;\n  }.gm .toolbar-actions{\n    grid-template-columns: 1fr 1fr;\n  }.gm #newGameBtn{\n    grid-column: 1 / -1;\n  }.gm .modal-actions{\n    flex-direction: column;\n  }}@media (prefers-reduced-motion: reduce){.gm *,.gm *::before,.gm *::after{\n    scroll-behavior: auto !important;\n    animation-duration: .01ms !important;\n    animation-iteration-count: 1 !important;\n    transition-duration: .01ms !important;\n  }}";
function __ready(f){f()}
function boot(){
(() => {
  "use strict";

  const SUITS = {
    S: { symbol: "♠", color: "black", name: "Spades" },
    H: { symbol: "♥", color: "red", name: "Hearts" },
    D: { symbol: "♦", color: "red", name: "Diamonds" },
    C: { symbol: "♣", color: "black", name: "Clubs" }
  };

  const RANK_LABELS = {
    1: "A",
    11: "J",
    12: "Q",
    13: "K"
  };

  const state = {
    stock: [],
    waste: [],
    foundations: { S: [], H: [], D: [], C: [] },
    tableau: [[], [], [], [], [], [], []],
    score: 0,
    moves: 0,
    startedAt: null,
    timerId: null,
    selected: null,
    undoStack: [],
    gameWon: false,
    drag: null
  };

  const els = {
    board: document.getElementById("gameBoard"),
    stock: document.getElementById("stockPile"),
    waste: document.getElementById("wastePile"),
    tableau: document.getElementById("tableau"),
    score: document.getElementById("score"),
    moves: document.getElementById("moves"),
    timer: document.getElementById("timer"),
    status: document.getElementById("statusMessage"),
    newGame: document.getElementById("newGameBtn"),
    undo: document.getElementById("undoBtn"),
    hint: document.getElementById("hintBtn"),
    winModal: document.getElementById("winModal"),
    winSummary: document.getElementById("winSummary"),
    playAgain: document.getElementById("playAgainBtn"),
    closeModal: document.getElementById("closeModalBtn")
  };

  function makeDeck() {
    const deck = [];
    let id = 0;
    for (const suit of Object.keys(SUITS)) {
      for (let rank = 1; rank <= 13; rank++) {
        deck.push({
          id: `card-${id++}`,
          suit,
          rank,
          faceUp: false
        });
      }
    }
    return deck;
  }

  function shuffle(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
  }

  function newGame() {
    clearInterval(state.timerId);

    const deck = shuffle(makeDeck());
    state.stock = [];
    state.waste = [];
    state.foundations = { S: [], H: [], D: [], C: [] };
    state.tableau = [[], [], [], [], [], [], []];
    state.score = 0;
    state.moves = 0;
    state.startedAt = Date.now();
    state.selected = null;
    state.undoStack = [];
    state.gameWon = false;
    state.drag = null;

    for (let col = 0; col < 7; col++) {
      for (let row = 0; row <= col; row++) {
        const card = deck.pop();
        card.faceUp = row === col;
        state.tableau[col].push(card);
      }
    }

    while (deck.length) {
      const card = deck.pop();
      card.faceUp = false;
      state.stock.push(card);
    }

    els.winModal.hidden = true;
    setStatus("Build down in alternating colors and move Aces to the foundations.");
    startTimer();
    render();
  }

  function startTimer() {
    updateTimer();
    state.timerId = setInterval(updateTimer, 1000);
  }

  function updateTimer() {
    if (!state.startedAt || state.gameWon) return;
    const elapsed = Math.floor((Date.now() - state.startedAt) / 1000);
    const mins = String(Math.floor(elapsed / 60)).padStart(2, "0");
    const secs = String(elapsed % 60).padStart(2, "0");
    els.timer.textContent = `${mins}:${secs}`;
  }

  function rankLabel(rank) {
    return RANK_LABELS[rank] || String(rank);
  }

  function isRed(card) {
    return SUITS[card.suit].color === "red";
  }

  function cardName(card) {
    return `${rankLabel(card.rank)} of ${SUITS[card.suit].name}`;
  }

  function createCardElement(card, context = {}) {
    const el = document.createElement("div");
    el.className = "card";
    el.dataset.cardId = card.id;
    el.dataset.sourceType = context.sourceType || "";
    if (context.sourceIndex !== undefined) el.dataset.sourceIndex = context.sourceIndex;
    if (context.cardIndex !== undefined) el.dataset.cardIndex = context.cardIndex;

    if (!card.faceUp) {
      el.classList.add("face-down");
      el.setAttribute("aria-label", "Face-down card");
      return el;
    }

    el.classList.add("face-up");
    if (isRed(card)) el.classList.add("red");
    el.tabIndex = 0;
    el.setAttribute("role", "button");
    el.setAttribute("aria-label", cardName(card));

    if (isSelectedCard(card.id, context)) {
      el.classList.add("selected");
    }

    const cornerTop = document.createElement("div");
    cornerTop.className = "card-corner";
    cornerTop.innerHTML = `<span>${rankLabel(card.rank)}</span><span>${SUITS[card.suit].symbol}</span>`;

    const center = document.createElement("div");
    center.className = "card-suit-center";
    center.textContent = SUITS[card.suit].symbol;

    const cornerBottom = document.createElement("div");
    cornerBottom.className = "card-corner bottom";
    cornerBottom.innerHTML = `<span>${rankLabel(card.rank)}</span><span>${SUITS[card.suit].symbol}</span>`;

    el.append(cornerTop, center, cornerBottom);

    el.addEventListener("pointerdown", (event) => onCardPointerDown(event, card, context));
    el.addEventListener("click", (event) => onCardClick(event, card, context));
    el.addEventListener("dblclick", (event) => {
      event.preventDefault();
      event.stopPropagation();
      tryAutoFoundation(card, context);
    });
    el.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        onCardClick(event, card, context);
      }
    });

    return el;
  }

  function render() {
    renderStock();
    renderWaste();
    renderFoundations();
    renderTableau();
    els.score.textContent = state.score;
    els.moves.textContent = state.moves;
    els.undo.disabled = state.undoStack.length === 0;
    checkWin();
  }

  function renderStock() {
    els.stock.innerHTML = "";
    els.stock.classList.toggle("is-empty", state.stock.length === 0);

    if (state.stock.length > 0) {
      const top = state.stock[state.stock.length - 1];
      const cardEl = createCardElement(top, { sourceType: "stock" });
      cardEl.style.position = "absolute";
      cardEl.style.inset = "0";
      els.stock.appendChild(cardEl);
    }

    els.stock.onclick = () => drawFromStock();
    els.stock.onkeydown = (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        drawFromStock();
      }
    };
    els.stock.tabIndex = 0;
    els.stock.setAttribute("role", "button");
    els.stock.setAttribute(
      "aria-label",
      state.stock.length ? `Stock pile, ${state.stock.length} cards` : "Empty stock pile. Activate to recycle waste cards."
    );
  }

  function renderWaste() {
    els.waste.innerHTML = "";
    const top = state.waste[state.waste.length - 1];
    if (!top) return;

    const cardEl = createCardElement(top, {
      sourceType: "waste",
      cardIndex: state.waste.length - 1
    });
    cardEl.style.position = "absolute";
    cardEl.style.inset = "0";
    els.waste.appendChild(cardEl);
  }

  function renderFoundations() {
    document.querySelectorAll(".foundation-pile").forEach((pileEl) => {
      pileEl.innerHTML = "";
      const suit = pileEl.dataset.foundation;
      const pile = state.foundations[suit];
      const top = pile[pile.length - 1];

      if (top) {
        const cardEl = createCardElement(top, {
          sourceType: "foundation",
          sourceIndex: suit,
          cardIndex: pile.length - 1
        });
        cardEl.style.position = "absolute";
        cardEl.style.inset = "0";
        pileEl.appendChild(cardEl);
      }

      pileEl.onclick = (event) => {
        if (event.target === pileEl) {
          handleDestinationClick({ type: "foundation", index: suit });
        }
      };
    });
  }

  function renderTableau() {
    document.querySelectorAll(".tableau-pile").forEach((pileEl, colIndex) => {
      pileEl.innerHTML = "";
      const pile = state.tableau[colIndex];
      let currentTop = 0;

      pile.forEach((card, cardIndex) => {
        const cardEl = createCardElement(card, {
          sourceType: "tableau",
          sourceIndex: colIndex,
          cardIndex
        });

        cardEl.style.top = `${currentTop}px`;
        cardEl.style.zIndex = String(cardIndex + 1);

        if (card.faceUp) {
          currentTop += getCssNumber("--stack-step", 31);
        } else {
          currentTop += getCssNumber("--stack-step-down", 16);
        }

        pileEl.appendChild(cardEl);
      });

      pileEl.style.minHeight = `${Math.max(getCssNumber("--card-h", 128), currentTop + getCssNumber("--card-h", 128) - getCssNumber("--stack-step", 31))}px`;

      pileEl.onclick = (event) => {
        if (event.target === pileEl) {
          handleDestinationClick({ type: "tableau", index: colIndex });
        }
      };
    });
  }

  function getCssNumber(name, fallback) {
    const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    const parsed = parseFloat(raw);
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  function serializeState() {
    return JSON.stringify({
      stock: state.stock,
      waste: state.waste,
      foundations: state.foundations,
      tableau: state.tableau,
      score: state.score,
      moves: state.moves
    });
  }

  function pushUndo() {
    state.undoStack.push(serializeState());
    if (state.undoStack.length > 80) state.undoStack.shift();
  }

  function undo() {
    const snapshot = state.undoStack.pop();
    if (!snapshot) return;

    const data = JSON.parse(snapshot);
    state.stock = data.stock;
    state.waste = data.waste;
    state.foundations = data.foundations;
    state.tableau = data.tableau;
    state.score = data.score;
    state.moves = data.moves;
    state.selected = null;
    state.gameWon = false;
    els.winModal.hidden = true;

    setStatus("Previous move restored.");
    render();
  }

  function drawFromStock() {
    clearHints();
    state.selected = null;

    if (state.stock.length > 0) {
      pushUndo();
      const card = state.stock.pop();
      card.faceUp = true;
      state.waste.push(card);
      state.moves += 1;
      setStatus(`Drew ${cardName(card)} from the stock.`);
      render();
      return;
    }

    if (state.waste.length > 0) {
      pushUndo();
      state.stock = state.waste.reverse().map((card) => {
        card.faceUp = false;
        return card;
      });
      state.waste = [];
      state.moves += 1;
      state.score = Math.max(0, state.score - 20);
      setStatus("Waste pile recycled into the stock.");
      render();
    }
  }

  function onCardClick(event, card, context) {
    if (state.drag && state.drag.moved) return;
    event.stopPropagation();
    clearHints();

    if (!card.faceUp) return;

    if (state.selected) {
      const clickedSame = sameSelection(state.selected, makeSelection(card, context));
      if (clickedSame) {
        state.selected = null;
        setStatus("Selection cleared.");
        render();
        return;
      }

      const destination = destinationFromCard(card, context);
      if (destination && attemptSelectedMove(destination)) {
        return;
      }
    }

    state.selected = makeSelection(card, context);
    setStatus(`${cardName(card)} selected. Choose a valid destination.`);
    render();
  }

  function makeSelection(card, context) {
    if (context.sourceType === "tableau") {
      return {
        sourceType: "tableau",
        sourceIndex: Number(context.sourceIndex),
        cardIndex: Number(context.cardIndex),
        cardId: card.id
      };
    }

    return {
      sourceType: context.sourceType,
      sourceIndex: context.sourceIndex ?? null,
      cardIndex: context.cardIndex ?? null,
      cardId: card.id
    };
  }

  function sameSelection(a, b) {
    return a &&
      b &&
      a.sourceType === b.sourceType &&
      a.sourceIndex === b.sourceIndex &&
      a.cardIndex === b.cardIndex &&
      a.cardId === b.cardId;
  }

  function isSelectedCard(cardId, context) {
    if (!state.selected || state.selected.cardId !== cardId) return false;
    if (state.selected.sourceType !== context.sourceType) return false;

    if (context.sourceType === "tableau") {
      return state.selected.sourceIndex === Number(context.sourceIndex) &&
        state.selected.cardIndex === Number(context.cardIndex);
    }

    return true;
  }

  function destinationFromCard(card, context) {
    if (context.sourceType === "tableau") {
      return { type: "tableau", index: Number(context.sourceIndex) };
    }
    if (context.sourceType === "foundation") {
      return { type: "foundation", index: context.sourceIndex };
    }
    return null;
  }

  function handleDestinationClick(destination) {
    clearHints();
    if (state.selected) {
      attemptSelectedMove(destination);
    }
  }

  function getSelectedCards(selection = state.selected) {
    if (!selection) return [];

    if (selection.sourceType === "waste") {
      const card = state.waste[state.waste.length - 1];
      return card ? [card] : [];
    }

    if (selection.sourceType === "foundation") {
      const pile = state.foundations[selection.sourceIndex];
      const card = pile[pile.length - 1];
      return card ? [card] : [];
    }

    if (selection.sourceType === "tableau") {
      const pile = state.tableau[selection.sourceIndex];
      return pile.slice(selection.cardIndex);
    }

    return [];
  }

  function attemptSelectedMove(destination) {
    if (!state.selected) return false;
    const cards = getSelectedCards();
    if (!cards.length) {
      state.selected = null;
      render();
      return false;
    }

    if (destination.type === "tableau") {
      if (state.selected.sourceType === "tableau" && state.selected.sourceIndex === destination.index) {
        return false;
      }

      if (!isValidTableauMove(cards, destination.index)) {
        setStatus("That card sequence cannot be placed there.");
        return false;
      }

      commitMove(destination, cards);
      return true;
    }

    if (destination.type === "foundation") {
      if (cards.length !== 1) {
        setStatus("Only one card at a time can move to a foundation.");
        return false;
      }

      if (!isValidFoundationMove(cards[0], destination.index)) {
        setStatus("That card cannot move to this foundation.");
        return false;
      }

      commitMove(destination, cards);
      return true;
    }

    return false;
  }

  function isValidTableauMove(cards, targetIndex) {
    if (!cards.length) return false;
    if (!isValidTableauSequence(cards)) return false;

    const target = state.tableau[targetIndex];
    const moving = cards[0];

    if (target.length === 0) {
      return moving.rank === 13;
    }

    const top = target[target.length - 1];
    return top.faceUp && top.rank === moving.rank + 1 && isRed(top) !== isRed(moving);
  }

  function isValidTableauSequence(cards) {
    for (let i = 0; i < cards.length - 1; i++) {
      const a = cards[i];
      const b = cards[i + 1];
      if (!a.faceUp || !b.faceUp) return false;
      if (a.rank !== b.rank + 1) return false;
      if (isRed(a) === isRed(b)) return false;
    }
    return true;
  }

  function isValidFoundationMove(card, suit) {
    if (!card || card.suit !== suit) return false;
    const pile = state.foundations[suit];
    if (pile.length === 0) return card.rank === 1;
    return pile[pile.length - 1].rank + 1 === card.rank;
  }

  function removeSelectionFromSource(selection, count) {
    if (selection.sourceType === "waste") {
      return [state.waste.pop()];
    }

    if (selection.sourceType === "foundation") {
      return [state.foundations[selection.sourceIndex].pop()];
    }

    if (selection.sourceType === "tableau") {
      return state.tableau[selection.sourceIndex].splice(selection.cardIndex, count);
    }

    return [];
  }

  function commitMove(destination, cards) {
    pushUndo();

    const selection = { ...state.selected };
    const moved = removeSelectionFromSource(selection, cards.length).filter(Boolean);

    if (destination.type === "tableau") {
      state.tableau[destination.index].push(...moved);
    } else {
      state.foundations[destination.index].push(...moved);
    }

    updateScoreForMove(selection, destination, moved);
    revealTopCardIfNeeded(selection);
    state.moves += 1;
    state.selected = null;

    const movedName = moved.length === 1 ? cardName(moved[0]) : `${moved.length}-card sequence`;
    setStatus(`${movedName} moved successfully.`);
    render();
  }

  function updateScoreForMove(source, destination, moved) {
    if (!moved.length) return;

    if (destination.type === "foundation") {
      state.score += 10;
    } else if (source.sourceType === "waste" && destination.type === "tableau") {
      state.score += 5;
    } else if (source.sourceType === "foundation" && destination.type === "tableau") {
      state.score = Math.max(0, state.score - 15);
    }
  }

  function revealTopCardIfNeeded(selection) {
    if (selection.sourceType !== "tableau") return;
    const pile = state.tableau[selection.sourceIndex];
    const top = pile[pile.length - 1];
    if (top && !top.faceUp) {
      top.faceUp = true;
      state.score += 5;
    }
  }

  function tryAutoFoundation(card, context) {
    if (!card.faceUp) return;

    const selection = makeSelection(card, context);
    const cards = getSelectedCards(selection);
    if (cards.length !== 1 || cards[0].id !== card.id) return;

    if (isValidFoundationMove(card, card.suit)) {
      state.selected = selection;
      commitMove({ type: "foundation", index: card.suit }, [card]);
    }
  }

  function checkWin() {
    const totalFoundation = Object.values(state.foundations)
      .reduce((sum, pile) => sum + pile.length, 0);

    if (totalFoundation !== 52 || state.gameWon) return;

    state.gameWon = true;
    clearInterval(state.timerId);

    const elapsed = Math.floor((Date.now() - state.startedAt) / 1000);
    const mins = Math.floor(elapsed / 60);
    const secs = elapsed % 60;

    els.winSummary.textContent =
      `Score ${state.score} • ${state.moves} moves • ${mins}m ${secs}s`;

    setStatus("Congratulations! You completed Solitaire.");
    setTimeout(() => {
      els.winModal.hidden = false;
      els.playAgain.focus();
    }, 250);
  }

  function findHint() {
    // Prefer tableau/waste moves to foundations.
    const wasteTop = state.waste[state.waste.length - 1];
    if (wasteTop && isValidFoundationMove(wasteTop, wasteTop.suit)) {
      return {
        source: { type: "waste", cardId: wasteTop.id },
        destination: { type: "foundation", index: wasteTop.suit },
        message: `${cardName(wasteTop)} can move to its foundation.`
      };
    }

    for (let col = 0; col < 7; col++) {
      const pile = state.tableau[col];
      const top = pile[pile.length - 1];
      if (top && top.faceUp && isValidFoundationMove(top, top.suit)) {
        return {
          source: { type: "tableau", index: col, cardId: top.id },
          destination: { type: "foundation", index: top.suit },
          message: `${cardName(top)} can move to its foundation.`
        };
      }
    }

    // Find tableau-to-tableau moves that reveal or relocate cards.
    for (let sourceCol = 0; sourceCol < 7; sourceCol++) {
      const sourcePile = state.tableau[sourceCol];
      for (let cardIndex = 0; cardIndex < sourcePile.length; cardIndex++) {
        const card = sourcePile[cardIndex];
        if (!card.faceUp) continue;
        const sequence = sourcePile.slice(cardIndex);
        if (!isValidTableauSequence(sequence)) continue;

        for (let targetCol = 0; targetCol < 7; targetCol++) {
          if (targetCol === sourceCol) continue;
          if (isValidTableauMove(sequence, targetCol)) {
            return {
              source: { type: "tableau", index: sourceCol, cardId: card.id },
              destination: { type: "tableau", index: targetCol },
              message: `${cardName(card)} can move to tableau column ${targetCol + 1}.`
            };
          }
        }
      }
    }

    if (wasteTop) {
      for (let targetCol = 0; targetCol < 7; targetCol++) {
        if (isValidTableauMove([wasteTop], targetCol)) {
          return {
            source: { type: "waste", cardId: wasteTop.id },
            destination: { type: "tableau", index: targetCol },
            message: `${cardName(wasteTop)} can move to tableau column ${targetCol + 1}.`
          };
        }
      }
    }

    if (state.stock.length > 0) {
      return {
        source: { type: "stock" },
        destination: null,
        message: "Try drawing the next card from the stock."
      };
    }

    if (state.waste.length > 0) {
      return {
        source: { type: "stock" },
        destination: null,
        message: "Recycle the waste pile back into the stock."
      };
    }

    return null;
  }

  function showHint() {
    clearHints();
    const hint = findHint();

    if (!hint) {
      setStatus("No obvious legal move found. Try undoing or reconsidering a foundation move.");
      return;
    }

    setStatus(hint.message);

    if (hint.source.type === "stock") {
      els.stock.classList.add("hint");
      setTimeout(clearHints, 2200);
      return;
    }

    const sourceCard = document.querySelector(`[data-card-id="${hint.source.cardId}"]`);
    if (sourceCard) sourceCard.classList.add("hint");

    if (hint.destination) {
      let targetEl = null;
      if (hint.destination.type === "tableau") {
        targetEl = document.querySelector(`.tableau-pile[data-tableau="${hint.destination.index}"]`);
      } else {
        targetEl = document.querySelector(`.foundation-pile[data-foundation="${hint.destination.index}"]`);
      }
      if (targetEl) targetEl.classList.add("hint");
    }

    setTimeout(clearHints, 2200);
  }

  function clearHints() {
    document.querySelectorAll(".hint").forEach((el) => el.classList.remove("hint"));
  }

  function setStatus(message) {
    els.status.textContent = message;
  }

  function onCardPointerDown(event, card, context) {
    if (event.pointerType === "touch") return;
    if (event.button !== 0 || !card.faceUp) return;
    if (context.sourceType === "stock") return;

    const selection = makeSelection(card, context);
    const cards = getSelectedCards(selection);

    if (!cards.length) return;
    if (context.sourceType === "tableau" && !isValidTableauSequence(cards)) return;
    if (context.sourceType !== "tableau" && cards.length !== 1) return;

    const sourceEl = event.currentTarget;
    const startX = event.clientX;
    const startY = event.clientY;

    state.drag = {
      selection,
      cards,
      sourceEl,
      startX,
      startY,
      moved: false,
      ghosts: []
    };

    const onMove = (moveEvent) => {
      if (!state.drag) return;

      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;

      if (!state.drag.moved && Math.hypot(dx, dy) > 6) {
        state.drag.moved = true;
        beginGhostDrag(moveEvent);
      }

      if (state.drag.moved) {
        moveGhosts(moveEvent.clientX, moveEvent.clientY);
        highlightDropTarget(moveEvent.clientX, moveEvent.clientY);
      }
    };

    const onUp = (upEvent) => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);

      if (!state.drag) return;

      if (state.drag.moved) {
        finishGhostDrag(upEvent.clientX, upEvent.clientY);
        setTimeout(() => {
          if (state.drag) state.drag = null;
        }, 0);
      } else {
        state.drag = null;
      }
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp, { once: true });
  }

  function beginGhostDrag(event) {
    if (!state.drag) return;

    clearHints();
    state.selected = null;

    const rect = state.drag.sourceEl.getBoundingClientRect();
    const offsetX = event.clientX - rect.left;
    const offsetY = event.clientY - rect.top;
    state.drag.offsetX = offsetX;
    state.drag.offsetY = offsetY;

    const cardHeightStep = getCssNumber("--stack-step", 31);

    state.drag.cards.forEach((card, index) => {
      const ghost = createCardElement(card, { sourceType: "" });
      ghost.classList.add("drag-ghost");
      ghost.style.position = "fixed";
      ghost.style.zIndex = String(1000 + index);
      ghost.style.margin = "0";
      ghost.style.top = `${rect.top + index * cardHeightStep}px`;
      ghost.style.left = `${rect.left}px`;
      document.body.appendChild(ghost);
      state.drag.ghosts.push(ghost);
    });

    moveGhosts(event.clientX, event.clientY);
  }

  function moveGhosts(clientX, clientY) {
    if (!state.drag) return;
    const step = getCssNumber("--stack-step", 31);

    state.drag.ghosts.forEach((ghost, index) => {
      ghost.style.left = `${clientX - state.drag.offsetX}px`;
      ghost.style.top = `${clientY - state.drag.offsetY + (index * step)}px`;
    });
  }

  function finishGhostDrag(clientX, clientY) {
    if (!state.drag) return;

    clearDropTargets();
    const destination = getDropDestination(clientX, clientY);
    const selection = state.drag.selection;
    const cards = state.drag.cards;

    state.drag.ghosts.forEach((ghost) => ghost.remove());
    state.drag.ghosts = [];

    if (!destination) {
      setStatus("Move canceled.");
      render();
      return;
    }

    state.selected = selection;

    if (destination.type === "tableau") {
      if (selection.sourceType === "tableau" && selection.sourceIndex === destination.index) {
        state.selected = null;
        render();
        return;
      }
      if (!isValidTableauMove(cards, destination.index)) {
        state.selected = null;
        setStatus("That card sequence cannot be placed there.");
        render();
        return;
      }
    }

    if (destination.type === "foundation") {
      if (cards.length !== 1 || !isValidFoundationMove(cards[0], destination.index)) {
        state.selected = null;
        setStatus("That card cannot move to this foundation.");
        render();
        return;
      }
    }

    commitMove(destination, cards);
  }

  function getDropDestination(clientX, clientY) {
    const elements = document.elementsFromPoint(clientX, clientY);

    for (const el of elements) {
      const tableau = el.closest?.(".tableau-pile");
      if (tableau) {
        return { type: "tableau", index: Number(tableau.dataset.tableau) };
      }

      const foundation = el.closest?.(".foundation-pile");
      if (foundation) {
        return { type: "foundation", index: foundation.dataset.foundation };
      }
    }

    return null;
  }

  function highlightDropTarget(clientX, clientY) {
    clearDropTargets();
    const dest = getDropDestination(clientX, clientY);
    if (!dest) return;

    const selector = dest.type === "tableau"
      ? `.tableau-pile[data-tableau="${dest.index}"]`
      : `.foundation-pile[data-foundation="${dest.index}"]`;

    const el = document.querySelector(selector);
    if (el) el.classList.add("drop-target");
  }

  function clearDropTargets() {
    document.querySelectorAll(".drop-target").forEach((el) => el.classList.remove("drop-target"));
  }

  els.newGame.addEventListener("click", newGame);
  els.undo.addEventListener("click", undo);
  els.hint.addEventListener("click", showHint);
  els.playAgain.addEventListener("click", newGame);
  els.closeModal.addEventListener("click", () => {
    els.winModal.hidden = true;
  });

  els.winModal.addEventListener("click", (event) => {
    if (event.target === els.winModal) {
      els.winModal.hidden = true;
    }
  });

  document.addEventListener("keydown", (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "z") {
      event.preventDefault();
      undo();
    }

    if (event.key === "Escape") {
      state.selected = null;
      clearHints();
      render();
    }
  });

  window.addEventListener("resize", () => renderTableau());

  newGame();
})();


}
function begin(){poster.hidden=true;gm.hidden=false;if(!booted){booted=true;var s=document.createElement("style");s.textContent=LOOK;document.head.appendChild(s);boot();}else{var r=document.getElementById("newGameBtn");if(r)r.click();}}
poster.addEventListener("click",begin);
var nb=document.getElementById("new");if(nb)nb.addEventListener("click",begin);
})();
