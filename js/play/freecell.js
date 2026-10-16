/* FreeCell - game logic + its own look. Layout lives in style.css; page shell lives in the HTML. */
(function(){"use strict";
var gm=document.getElementById("gm"),poster=document.getElementById("poster"),booted=false;
var LOOK=".gm{\n  --primary: #5B5CE2;\n  --primary-dark: #4546B8;\n  --secondary: #16B8C4;\n  --accent: #FFB84D;\n  --success: #22C55E;\n  --danger: #EF5B5B;\n  \n  \n  \n  \n  \n  --felt: #0F6B4F;\n  --felt-dark: #0A4F3C;\n  --red: #C0392B;\n  --black: #1C2434;\n  \n}.gm *{ box-sizing: border-box; }.gm button,.gm input{ font: inherit; }.gm button{ -webkit-tap-highlight-color: transparent; }.gm .page-shell{ padding: 24px 0 72px; }.gm .toolbar-kicker{ margin: 0 0 8px; color: var(--primary); font-weight: 800; text-transform: uppercase; letter-spacing: .08em; font-size: 13px; }.gm h2{ font-size: clamp(28px, 4vw, 36px); line-height: 1.2; margin: 0 0 16px; }.gm h3{ font-size: 22px; margin: 0 0 12px; }.gm .modal-actions,.gm .toolbar-buttons{ display: flex; gap: 10px; flex-wrap: wrap; }.gm .btn{\n  border: 0;\n  min-height: 46px;\n  padding: 0 18px;\n  border-radius: 12px;\n  font-weight: 800;\n  cursor: pointer;\n  background: #ECEEF7;\n  color: var(--text);\n  transition: transform .15s ease, box-shadow .15s ease, background .15s ease;\n}.gm .btn:hover{ transform: translateY(-1px); box-shadow: 0 6px 16px rgba(23,27,45,.12); }.gm .btn:focus-visible,.gm .card:focus-visible,.gm .pile-slot:focus-visible{ outline: 3px solid rgba(91,92,226,.35); outline-offset: 3px; }.gm .btn-primary{ background: var(--primary); color: white; }.gm .btn-primary:hover{ background: var(--primary-dark); }.gm .btn-secondary{ background: #EEF0F7; color: var(--text); }.gm .btn-compact{ min-height: 42px; padding: 0 14px; font-size: 15px; }.gm .game-card{\n  background: var(--card);\n  border: 1px solid var(--border);\n  border-radius: 18px;\n  box-shadow: var(--shadow);\n}.gm .game-card{ overflow: hidden; margin-bottom: 28px; }.gm .game-toolbar{ display: flex; justify-content: space-between; gap: 20px; align-items: center; padding: 20px 22px; border-bottom: 1px solid var(--border); }.gm .game-toolbar h2{ margin: 0; font-size: 28px; }.gm .stats{ display: flex; gap: 12px; flex-wrap: wrap; justify-content: flex-end; }.gm .stat{ min-width: 90px; padding: 9px 12px; border: 1px solid var(--border); border-radius: 12px; background: #FAFBFD; text-align: center; }.gm .stat span{ display: block; color: var(--muted); font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: .04em; }.gm .stat strong{ font-size: 20px; line-height: 1.2; }.gm .board-wrap{ overflow-x: auto; background: var(--felt-dark); padding: 18px; }.gm .game-board{\n  min-width: 860px;\n  border-radius: 16px;\n  padding: 18px;\n  background:\n    radial-gradient(circle at 20% 15%, rgba(255,255,255,.05), transparent 24%),\n    radial-gradient(circle at 75% 70%, rgba(255,255,255,.04), transparent 28%),\n    var(--felt);\n  box-shadow: inset 0 0 0 1px rgba(255,255,255,.08);\n}.gm .top-row{ display: flex; justify-content: space-between; gap: 24px; margin-bottom: 26px; }.gm .pile-group{ flex: 1; }.gm .group-label{ color: rgba(255,255,255,.82); font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: .08em; margin-bottom: 8px; }.gm .slot-row{ display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }.gm .pile-slot{\n  position: relative;\n  aspect-ratio: 5 / 7;\n  max-width: 92px;\n  width: 100%;\n  border: 2px dashed rgba(255,255,255,.36);\n  border-radius: 10px;\n  background: rgba(255,255,255,.05);\n  cursor: pointer;\n}.gm .foundation-symbol{ position: absolute; inset: 0; display: grid; place-items: center; color: rgba(255,255,255,.34); font-size: 34px; font-weight: 800; }.gm .cascades{ display: grid; grid-template-columns: repeat(8, minmax(92px, 1fr)); gap: 10px; align-items: start; }.gm .cascade{ position: relative; min-height: 150px; border-radius: 10px; cursor: pointer; }.gm .cascade.empty{ outline: 2px dashed rgba(255,255,255,.28); outline-offset: -2px; min-height: 130px; background: rgba(255,255,255,.035); }.gm .card{\n  position: absolute;\n  left: 0;\n  width: 100%;\n  aspect-ratio: 5 / 7;\n  min-height: 124px;\n  border-radius: 10px;\n  border: 1px solid rgba(23,27,45,.18);\n  background: white;\n  box-shadow: 0 3px 8px rgba(0,0,0,.22);\n  padding: 7px;\n  user-select: none;\n  cursor: pointer;\n  transition: transform .12s ease, box-shadow .12s ease, outline .12s ease;\n}.gm .card:hover{ transform: translateY(-2px); box-shadow: 0 7px 14px rgba(0,0,0,.25); }.gm .card.red{ color: var(--red); }.gm .card.black{ color: var(--black); }.gm .card.selected{ outline: 4px solid var(--accent); outline-offset: 1px; transform: translateY(-4px); z-index: 90 !important; }.gm .card.movable-stack{ box-shadow: 0 0 0 3px rgba(255,184,77,.9), 0 7px 14px rgba(0,0,0,.25); }.gm .card-rank{ font-weight: 800; font-size: 21px; line-height: 1; }.gm .card-suit{ font-size: 23px; line-height: 1; }.gm .card-center{ position: absolute; inset: 0; display: grid; place-items: center; font-size: 44px; opacity: .92; }.gm .interaction-panel{ display: flex; justify-content: space-between; gap: 16px; align-items: center; padding: 16px 20px; border-top: 1px solid var(--border); }.gm .selection-help{ display: flex; flex-direction: column; }.gm .selection-help span{ color: var(--muted); font-size: 15px; }.gm .message-box{ min-height: 28px; padding: 0 20px 18px; color: var(--muted); font-size: 15px; }.gm .message-box.error{ color: var(--danger); font-weight: 700; }.gm .message-box.success{ color: #15803D; font-weight: 700; }.gm details{ border-top: 1px solid var(--border); padding: 14px 0; }.gm details:first-of-type{ border-top: 0; }.gm summary{ cursor: pointer; font-weight: 800; }.gm .modal{\n  position: fixed; inset: 0; background: rgba(17,24,39,.64); display: grid; place-items: center; padding: 20px; z-index: 200;\n}.gm .modal[hidden]{ display: none; }.gm .modal-card{ width: min(460px, 100%); background: white; border-radius: 18px; padding: 28px; box-shadow: 0 24px 60px rgba(0,0,0,.28); }.gm .modal-card h2{ margin-bottom: 10px; }@media (max-width: 900px){.gm .game-toolbar,.gm .interaction-panel{ align-items: stretch; flex-direction: column; }.gm .stats{ justify-content: flex-start; }}@media (max-width: 620px){.gm .page-shell{ padding-top: 16px; }.gm .game-toolbar{ padding: 18px; }.gm .board-wrap{ padding: 10px; }.gm .game-board{ min-width: 690px; padding: 12px; }.gm .cascades{ grid-template-columns: repeat(8, minmax(72px, 1fr)); gap: 7px; }.gm .slot-row{ gap: 7px; }.gm .card{ min-height: 101px; padding: 5px; }.gm .card-rank{ font-size: 17px; }.gm .card-suit{ font-size: 18px; }.gm .card-center{ font-size: 34px; }.gm .top-row{ gap: 14px; margin-bottom: 20px; }.gm .pile-slot{ max-width: 74px; }.gm .toolbar-buttons{ width: 100%; }.gm .toolbar-buttons .btn{ flex: 1; }}@media (prefers-reduced-motion: reduce){.gm *,.gm *::before,.gm *::after{ scroll-behavior: auto !important; transition: none !important; }}";
function __ready(f){f()}
function boot(){
'use strict';

const suits = [
  { symbol: '♠', name: 'spades', color: 'black' },
  { symbol: '♥', name: 'hearts', color: 'red' },
  { symbol: '♦', name: 'diamonds', color: 'red' },
  { symbol: '♣', name: 'clubs', color: 'black' }
];

const rankLabels = { 1: 'A', 11: 'J', 12: 'Q', 13: 'K' };

const els = {
  freeCells: document.getElementById('freeCells'),
  foundations: document.getElementById('foundations'),
  cascades: document.getElementById('cascades'),
  movesCount: document.getElementById('movesCount'),
  timer: document.getElementById('timer'),
  statusText: document.getElementById('statusText'),
  selectionTitle: document.getElementById('selectionTitle'),
  selectionHint: document.getElementById('selectionHint'),
  messageBox: document.getElementById('messageBox'),
  newGameBtn: document.getElementById('newGameBtn'),
  restartBtn: document.getElementById('restartBtn'),
  autoFoundationBtn: document.getElementById('autoFoundationBtn'),
  clearSelectionBtn: document.getElementById('clearSelectionBtn'),
  winModal: document.getElementById('winModal'),
  winSummary: document.getElementById('winSummary'),
  modalNewGameBtn: document.getElementById('modalNewGameBtn'),
  modalCloseBtn: document.getElementById('modalCloseBtn')
};

let cascades = Array.from({ length: 8 }, () => []);
let freeCells = Array(4).fill(null);
let foundations = { spades: [], hearts: [], diamonds: [], clubs: [] };
let selected = null;
let moves = 0;
let elapsedSeconds = 0;
let timerId = null;
let startedAt = null;
let initialDeckOrder = [];
let gameWon = false;
let lastTap = { key: '', time: 0 };

function buildDeck() {
  const deck = [];
  let id = 0;
  for (const suit of suits) {
    for (let rank = 1; rank <= 13; rank++) {
      deck.push({ id: `c${id++}`, suit: suit.name, symbol: suit.symbol, color: suit.color, rank });
    }
  }
  return deck;
}

function shuffle(deck) {
  const arr = [...deck];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function cardLabel(card) {
  return `${rankLabels[card.rank] || card.rank}${card.symbol}`;
}

function cloneCard(card) { return { ...card }; }

function dealFromDeck(deck) {
  cascades = Array.from({ length: 8 }, () => []);
  freeCells = Array(4).fill(null);
  foundations = { spades: [], hearts: [], diamonds: [], clubs: [] };
  deck.forEach((card, index) => cascades[index % 8].push(cloneCard(card)));
  selected = null;
  moves = 0;
  elapsedSeconds = 0;
  startedAt = Date.now();
  gameWon = false;
  els.winModal.hidden = true;
  startTimer();
  setMessage('Build down in alternating colors. Move Aces to the foundations when they become available.');
  render();
}

function startNewGame() {
  const deck = shuffle(buildDeck());
  initialDeckOrder = deck.map(cloneCard);
  dealFromDeck(initialDeckOrder);
}

function restartGame() {
  dealFromDeck(initialDeckOrder);
}

function startTimer() {
  clearInterval(timerId);
  timerId = setInterval(() => {
    if (gameWon) return;
    elapsedSeconds = Math.floor((Date.now() - startedAt) / 1000);
    updateStats();
  }, 1000);
}

function formatTime(total) {
  const minutes = Math.floor(total / 60).toString().padStart(2, '0');
  const seconds = (total % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
}

function updateStats() {
  els.movesCount.textContent = String(moves);
  els.timer.textContent = formatTime(elapsedSeconds);
  els.statusText.textContent = gameWon ? 'Won' : 'Playing';
}

function setMessage(text, type = '') {
  els.messageBox.textContent = text;
  els.messageBox.className = `message-box${type ? ` ${type}` : ''}`;
}

function clearSelection() {
  selected = null;
  updateSelectionHelp();
  render();
}

function updateSelectionHelp() {
  if (!selected) {
    els.selectionTitle.textContent = 'Select a card';
    els.selectionHint.textContent = 'Tap or click a card, then choose its destination.';
    return;
  }
  const cards = getSelectedCards();
  if (!cards.length) {
    selected = null;
    updateSelectionHelp();
    return;
  }
  els.selectionTitle.textContent = cards.length === 1 ? `Selected ${cardLabel(cards[0])}` : `Selected ${cards.length}-card sequence`;
  els.selectionHint.textContent = 'Choose a free cell, foundation, or valid cascade destination.';
}

function createCardElement(card, options = {}) {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = `card ${card.color}`;
  btn.dataset.cardId = card.id;
  btn.setAttribute('aria-label', `${rankLabels[card.rank] || card.rank} of ${card.suit}`);
  btn.innerHTML = `<span class="card-rank">${rankLabels[card.rank] || card.rank}</span><span class="card-suit">${card.symbol}</span><span class="card-center" aria-hidden="true">${card.symbol}</span>`;
  if (options.selected) btn.classList.add('selected');
  if (options.stackSelected) btn.classList.add('movable-stack');
  if (Number.isFinite(options.top)) btn.style.top = `${options.top}px`;
  if (Number.isFinite(options.z)) btn.style.zIndex = String(options.z);
  return btn;
}

function render() {
  renderFreeCells();
  renderFoundations();
  renderCascades();
  updateStats();
  updateSelectionHelp();
}

function renderFreeCells() {
  els.freeCells.innerHTML = '';
  freeCells.forEach((card, index) => {
    const slot = document.createElement('button');
    slot.type = 'button';
    slot.className = 'pile-slot';
    slot.dataset.type = 'freecell';
    slot.dataset.index = String(index);
    slot.setAttribute('aria-label', card ? `Free cell ${index + 1}, ${cardLabel(card)}` : `Empty free cell ${index + 1}`);
    if (card) {
      const selectedHere = selected?.source === 'freecell' && selected.index === index;
      const cardEl = createCardElement(card, { selected: selectedHere, top: 0, z: 1 });
      slot.appendChild(cardEl);
    }
    els.freeCells.appendChild(slot);
  });
}

function renderFoundations() {
  els.foundations.innerHTML = '';
  suits.forEach((suit, index) => {
    const slot = document.createElement('button');
    slot.type = 'button';
    slot.className = 'pile-slot';
    slot.dataset.type = 'foundation';
    slot.dataset.suit = suit.name;
    const stack = foundations[suit.name];
    const card = stack[stack.length - 1];
    slot.setAttribute('aria-label', card ? `${suit.name} foundation, top card ${cardLabel(card)}` : `Empty ${suit.name} foundation`);
    if (card) slot.appendChild(createCardElement(card, { top: 0, z: 1 }));
    else slot.innerHTML = `<span class="foundation-symbol" aria-hidden="true">${suit.symbol}</span>`;
    els.foundations.appendChild(slot);
  });
}

function renderCascades() {
  els.cascades.innerHTML = '';
  cascades.forEach((column, colIndex) => {
    const cascadeEl = document.createElement('div');
    cascadeEl.className = `cascade${column.length ? '' : ' empty'}`;
    cascadeEl.dataset.type = 'cascade';
    cascadeEl.dataset.index = String(colIndex);
    cascadeEl.setAttribute('role', 'group');
    cascadeEl.setAttribute('aria-label', `Cascade ${colIndex + 1}`);

    const overlap = 34;
    const cardHeight = 128;
    cascadeEl.style.height = `${Math.max(130, cardHeight + Math.max(0, column.length - 1) * overlap)}px`;

    column.forEach((card, cardIndex) => {
      const isSelected = selected?.source === 'cascade' && selected.index === colIndex && selected.cardIndex === cardIndex;
      const isStack = selected?.source === 'cascade' && selected.index === colIndex && cardIndex >= selected.cardIndex;
      const cardEl = createCardElement(card, { selected: isSelected, stackSelected: isStack && !isSelected, top: cardIndex * overlap, z: cardIndex + 1 });
      cardEl.dataset.col = String(colIndex);
      cardEl.dataset.cardIndex = String(cardIndex);
      cascadeEl.appendChild(cardEl);
    });
    els.cascades.appendChild(cascadeEl);
  });
}

function isValidDescendingAlternating(cards) {
  for (let i = 0; i < cards.length - 1; i++) {
    const a = cards[i];
    const b = cards[i + 1];
    if (a.rank !== b.rank + 1 || a.color === b.color) return false;
  }
  return true;
}

function getSelectedCards() {
  if (!selected) return [];
  if (selected.source === 'freecell') {
    const card = freeCells[selected.index];
    return card ? [card] : [];
  }
  if (selected.source === 'cascade') {
    const col = cascades[selected.index];
    return col.slice(selected.cardIndex);
  }
  return [];
}

function availableFreeCells(excludeSelectedFreeCell = false) {
  return freeCells.reduce((count, card, idx) => count + (!card && !(excludeSelectedFreeCell && selected?.source === 'freecell' && selected.index === idx) ? 1 : 0), 0);
}

function emptyCascadeCount(excludeDestinationIndex = null, excludeSourceIndex = null) {
  return cascades.reduce((count, col, idx) => {
    if (idx === excludeDestinationIndex || idx === excludeSourceIndex) return count;
    return count + (col.length === 0 ? 1 : 0);
  }, 0);
}

function maxMovableSequence(destinationIndex) {
  const selectedCards = getSelectedCards();
  if (!selectedCards.length) return 0;
  const sourceCascade = selected?.source === 'cascade' ? selected.index : null;
  const emptyFree = availableFreeCells(false);
  const emptyCols = emptyCascadeCount(destinationIndex, sourceCascade);
  const destinationIsEmpty = cascades[destinationIndex].length === 0;
  const usableEmptyCols = destinationIsEmpty ? emptyCols : emptyCols;
  return (emptyFree + 1) * Math.pow(2, usableEmptyCols);
}

function canPlaceOnCascade(cards, destinationIndex) {
  if (!cards.length || !isValidDescendingAlternating(cards)) return false;
  const dest = cascades[destinationIndex];
  if (dest.length === 0) return cards.length <= maxMovableSequence(destinationIndex);
  const top = dest[dest.length - 1];
  const first = cards[0];
  return top.rank === first.rank + 1 && top.color !== first.color && cards.length <= maxMovableSequence(destinationIndex);
}

function canMoveToFoundation(card, suitName) {
  if (!card || card.suit !== suitName) return false;
  const foundation = foundations[suitName];
  const expectedRank = foundation.length + 1;
  return card.rank === expectedRank;
}

function selectCascadeCard(colIndex, cardIndex) {
  const stack = cascades[colIndex].slice(cardIndex);
  if (!stack.length) return;
  if (!isValidDescendingAlternating(stack)) {
    setMessage('That card is blocked by a sequence that cannot move together.', 'error');
    return;
  }
  selected = { source: 'cascade', index: colIndex, cardIndex };
  setMessage(stack.length === 1 ? `Selected ${cardLabel(stack[0])}.` : `Selected a valid ${stack.length}-card sequence.`);
  render();
}

function selectFreeCell(index) {
  const card = freeCells[index];
  if (!card) return;
  selected = { source: 'freecell', index };
  setMessage(`Selected ${cardLabel(card)} from free cell ${index + 1}.`);
  render();
}

function removeSelectedCards() {
  const cards = getSelectedCards().map(cloneCard);
  if (selected.source === 'freecell') freeCells[selected.index] = null;
  else cascades[selected.index].splice(selected.cardIndex);
  return cards;
}

function completeMove(message) {
  moves += 1;
  selected = null;
  setMessage(message, 'success');
  render();
  checkWin();
}

function moveSelectedToFreeCell(index) {
  const cards = getSelectedCards();
  if (!cards.length) return false;
  if (freeCells[index]) {
    setMessage('That free cell is already occupied.', 'error');
    return false;
  }
  if (cards.length !== 1) {
    setMessage('A free cell can hold only one card.', 'error');
    return false;
  }
  const [card] = removeSelectedCards();
  freeCells[index] = card;
  completeMove(`Moved ${cardLabel(card)} to free cell ${index + 1}.`);
  return true;
}

function moveSelectedToFoundation(suitName) {
  const cards = getSelectedCards();
  if (cards.length !== 1) {
    setMessage('Only one card at a time can move to a foundation.', 'error');
    return false;
  }
  const card = cards[0];
  if (!canMoveToFoundation(card, suitName)) {
    setMessage(`That card cannot move to the ${suitName} foundation yet.`, 'error');
    return false;
  }
  removeSelectedCards();
  foundations[suitName].push(card);
  completeMove(`Moved ${cardLabel(card)} to the ${suitName} foundation.`);
  return true;
}

function moveSelectedToCascade(destinationIndex) {
  const cards = getSelectedCards();
  if (!cards.length) return false;
  if (selected.source === 'cascade' && selected.index === destinationIndex) {
    clearSelection();
    return false;
  }
  if (!canPlaceOnCascade(cards, destinationIndex)) {
    const limit = maxMovableSequence(destinationIndex);
    setMessage(`Invalid cascade move. Build down in alternating colors and keep the move within the current ${limit}-card capacity.`, 'error');
    return false;
  }
  const moved = removeSelectedCards();
  cascades[destinationIndex].push(...moved);
  completeMove(`Moved ${moved.length === 1 ? cardLabel(moved[0]) : `${moved.length} cards`} to cascade ${destinationIndex + 1}.`);
  return true;
}

function autoMoveCardFromSource(source) {
  let card = null;
  if (source.source === 'freecell') card = freeCells[source.index];
  else {
    const col = cascades[source.index];
    if (source.cardIndex !== col.length - 1) return false;
    card = col[col.length - 1];
  }
  if (!card || !canMoveToFoundation(card, card.suit)) return false;
  selected = { ...source };
  return moveSelectedToFoundation(card.suit);
}

function isSafeForAutoFoundation(card) {
  if (!card || !canMoveToFoundation(card, card.suit)) return false;
  if (card.rank <= 2) return true;
  const oppositeColorSuits = suits.filter(s => s.color !== card.color).map(s => s.name);
  return oppositeColorSuits.every(suit => foundations[suit].length >= card.rank - 1);
}

function autoMoveSafeCards() {
  let movedAny = false;
  let safety = 0;
  while (safety++ < 60) {
    let movedThisPass = false;
    for (let i = 0; i < freeCells.length; i++) {
      const card = freeCells[i];
      if (isSafeForAutoFoundation(card)) {
        selected = { source: 'freecell', index: i };
        moveSelectedToFoundation(card.suit);
        movedAny = movedThisPass = true;
        break;
      }
    }
    if (movedThisPass) continue;
    for (let i = 0; i < cascades.length; i++) {
      const col = cascades[i];
      const card = col[col.length - 1];
      if (isSafeForAutoFoundation(card)) {
        selected = { source: 'cascade', index: i, cardIndex: col.length - 1 };
        moveSelectedToFoundation(card.suit);
        movedAny = movedThisPass = true;
        break;
      }
    }
    if (!movedThisPass) break;
  }
  if (!movedAny) {
    selected = null;
    setMessage('No currently exposed card is safe to auto-move to a foundation.');
    render();
  }
}

function checkWin() {
  const total = Object.values(foundations).reduce((sum, pile) => sum + pile.length, 0);
  if (total !== 52) return;
  gameWon = true;
  clearInterval(timerId);
  elapsedSeconds = Math.floor((Date.now() - startedAt) / 1000);
  updateStats();
  setMessage('You won! All 52 cards are in the foundations.', 'success');
  els.winSummary.textContent = `Completed in ${moves} moves and ${formatTime(elapsedSeconds)}.`;
  els.winModal.hidden = false;
  els.modalNewGameBtn.focus();
}

function maybeDoubleTap(key, action) {
  const now = Date.now();
  if (lastTap.key === key && now - lastTap.time < 360) {
    lastTap = { key: '', time: 0 };
    action();
    return true;
  }
  lastTap = { key, time: now };
  return false;
}

els.cascades.addEventListener('click', (event) => {
  const cardEl = event.target.closest('.card');
  const cascadeEl = event.target.closest('.cascade');
  if (!cascadeEl) return;
  const colIndex = Number(cascadeEl.dataset.index);

  if (cardEl) {
    const cardIndex = Number(cardEl.dataset.cardIndex);
    const key = `c-${colIndex}-${cardIndex}`;
    if (maybeDoubleTap(key, () => autoMoveCardFromSource({ source: 'cascade', index: colIndex, cardIndex }))) return;

    if (selected) {
      if (selected.source === 'cascade' && selected.index === colIndex && selected.cardIndex === cardIndex) {
        clearSelection();
      } else if (!moveSelectedToCascade(colIndex)) {
        selectCascadeCard(colIndex, cardIndex);
      }
    } else {
      selectCascadeCard(colIndex, cardIndex);
    }
    return;
  }

  if (selected) moveSelectedToCascade(colIndex);
});

els.freeCells.addEventListener('click', (event) => {
  const slot = event.target.closest('.pile-slot');
  if (!slot) return;
  const index = Number(slot.dataset.index);
  const card = freeCells[index];

  if (card) {
    const key = `f-${index}`;
    if (maybeDoubleTap(key, () => autoMoveCardFromSource({ source: 'freecell', index }))) return;
    if (selected?.source === 'freecell' && selected.index === index) clearSelection();
    else if (selected) selectFreeCell(index);
    else selectFreeCell(index);
  } else if (selected) {
    moveSelectedToFreeCell(index);
  }
});

els.foundations.addEventListener('click', (event) => {
  const slot = event.target.closest('.pile-slot');
  if (!slot || !selected) return;
  moveSelectedToFoundation(slot.dataset.suit);
});

els.newGameBtn.addEventListener('click', startNewGame);
els.restartBtn.addEventListener('click', restartGame);
els.autoFoundationBtn.addEventListener('click', autoMoveSafeCards);
els.clearSelectionBtn.addEventListener('click', clearSelection);
els.modalNewGameBtn.addEventListener('click', startNewGame);
els.modalCloseBtn.addEventListener('click', () => { els.winModal.hidden = true; });

els.winModal.addEventListener('click', (event) => {
  if (event.target === els.winModal) els.winModal.hidden = true;
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    if (!els.winModal.hidden) els.winModal.hidden = true;
    else clearSelection();
  }
});

startNewGame();


}
function begin(){poster.hidden=true;gm.hidden=false;if(!booted){booted=true;var s=document.createElement("style");s.textContent=LOOK;document.head.appendChild(s);boot();}else{var r=document.getElementById("newGameBtn");if(r)r.click();}}
poster.addEventListener("click",begin);
var nb=document.getElementById("new");if(nb)nb.addEventListener("click",begin);
})();
