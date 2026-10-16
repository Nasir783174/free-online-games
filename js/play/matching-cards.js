/* Matching Cards - game logic + its own look. Layout lives in style.css; page shell lives in the HTML. */
(function(){"use strict";
var gm=document.getElementById("gm"),poster=document.getElementById("poster"),booted=false;
var LOOK=".gm{\n  \n  \n  --secondary: #16B8C4;\n  --action: #FFB84D;\n  --success: #22C55E;\n  --danger: #EF5B5B;\n  --background: #F6F7FB;\n  \n  \n  \n  \n  --game-bg: #111827;\n  --game-bg-secondary: #1F2937;\n  \n}.gm *{\n  box-sizing: border-box;\n}.gm button{\n  font: inherit;\n}.gm button{\n  cursor: pointer;\n}.gm button:focus-visible,.gm summary:focus-visible{\n  outline: 3px solid rgba(91, 92, 226, 0.28);\n  outline-offset: 3px;\n}.gm .game-kicker{\n  margin: 0 0 8px;\n  color: var(--brand-dark);\n  text-transform: uppercase;\n  letter-spacing: 0.08em;\n  font-size: 14px;\n  font-weight: 800;\n}.gm h2,.gm h3,.gm p{\n  margin-top: 0;\n}.gm h2{\n  margin-bottom: 16px;\n  font-size: clamp(28px, 4vw, 35px);\n  line-height: 1.2;\n  letter-spacing: -0.025em;\n  font-weight: 700;\n}.gm .game-section{\n  padding: 24px 0 76px;\n}.gm .game-shell{\n  display: flex;\n  justify-content: center;\n}.gm .game-panel{\n  width: 100%;\n  max-width: 980px;\n  padding: 28px;\n  border-radius: 20px;\n  background: var(--game-bg);\n  box-shadow: var(--shadow);\n  color: #F9FAFB;\n}.gm .game-topbar{\n  display: flex;\n  gap: 20px;\n  align-items: center;\n  justify-content: space-between;\n  margin-bottom: 22px;\n}.gm .game-topbar h2{\n  margin: 0;\n  color: #FFFFFF;\n  font-size: 30px;\n}.gm .game-kicker{\n  color: #A5B4FC;\n}.gm .stats-grid{\n  display: grid;\n  grid-template-columns: repeat(4, minmax(0, 1fr));\n  gap: 12px;\n  margin-bottom: 18px;\n}.gm .stat-card{\n  padding: 14px 16px;\n  border: 1px solid rgba(255, 255, 255, 0.09);\n  border-radius: 14px;\n  background: var(--game-bg-secondary);\n}.gm .stat-label{\n  display: block;\n  margin-bottom: 2px;\n  color: #AAB2C0;\n  font-size: 14px;\n  font-weight: 700;\n}.gm .stat-value{\n  font-size: 24px;\n  line-height: 1.2;\n  font-weight: 700;\n}.gm .status-message{\n  min-height: 28px;\n  margin-bottom: 16px;\n  color: #D1D5DB;\n  font-size: 15px;\n  font-weight: 700;\n}.gm .game-board{\n  display: grid;\n  grid-template-columns: repeat(4, minmax(0, 1fr));\n  gap: 14px;\n  max-width: 760px;\n  margin: 0 auto;\n}.gm .memory-card{\n  position: relative;\n  aspect-ratio: 1 / 1;\n  border: 0;\n  padding: 0;\n  background: transparent;\n  perspective: 900px;\n  border-radius: 16px;\n  touch-action: manipulation;\n}.gm .card-inner{\n  position: absolute;\n  inset: 0;\n  transform-style: preserve-3d;\n  transition: transform 0.38s ease;\n}.gm .memory-card.is-flipped .card-inner,.gm .memory-card.is-matched .card-inner{\n  transform: rotateY(180deg);\n}.gm .card-face{\n  position: absolute;\n  inset: 0;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  border-radius: 16px;\n  backface-visibility: hidden;\n  -webkit-backface-visibility: hidden;\n}.gm .card-front{\n  border: 1px solid rgba(255, 255, 255, 0.10);\n  background: #2A3342;\n  color: #C7D2FE;\n}.gm .card-front::before{\n  content: \"?\";\n  display: grid;\n  place-items: center;\n  width: 42%;\n  aspect-ratio: 1 / 1;\n  border-radius: 50%;\n  background: rgba(91, 92, 226, 0.18);\n  font-size: clamp(26px, 4vw, 38px);\n  font-weight: 800;\n}.gm .card-back{\n  transform: rotateY(180deg);\n  border: 2px solid rgba(255, 255, 255, 0.12);\n  background: #F8FAFC;\n  color: #111827;\n  font-size: clamp(30px, 6vw, 48px);\n}.gm .memory-card:not(.is-matched):hover .card-front{\n  border-color: rgba(165, 180, 252, 0.55);\n  background: #323C4E;\n}.gm .memory-card.is-matched .card-back{\n  border-color: rgba(34, 197, 94, 0.75);\n  box-shadow: inset 0 0 0 3px rgba(34, 197, 94, 0.14);\n}.gm .memory-card:disabled{\n  cursor: default;\n}.gm .memory-card:focus-visible{\n  outline: 3px solid var(--action);\n  outline-offset: 4px;\n}.gm .game-actions{\n  display: flex;\n  gap: 18px;\n  align-items: center;\n  justify-content: space-between;\n  margin-top: 24px;\n}.gm .control-hint{\n  margin: 0;\n  color: #AAB2C0;\n  font-size: 14px;\n  text-align: right;\n}.gm .button{\n  min-height: 46px;\n  padding: 0 18px;\n  border-radius: 12px;\n  border: 1px solid transparent;\n  font-size: 16px;\n  font-weight: 700;\n  transition: transform 0.18s ease, background 0.18s ease, border-color 0.18s ease;\n}.gm .button:hover{\n  transform: translateY(-1px);\n}.gm .button-primary{\n  background: var(--brand);\n  color: #FFFFFF;\n}.gm .button-primary:hover{\n  background: var(--brand-dark);\n}.gm .button-secondary{\n  border-color: rgba(255, 255, 255, 0.14);\n  background: rgba(255, 255, 255, 0.08);\n  color: #FFFFFF;\n}.gm .wide-card{\n  width: 100%;\n}.gm .modal{\n  position: fixed;\n  inset: 0;\n  display: none;\n  align-items: center;\n  justify-content: center;\n  z-index: 100;\n  padding: 20px;\n}.gm .modal.is-open{\n  display: flex;\n}.gm .modal-backdrop{\n  position: absolute;\n  inset: 0;\n  background: rgba(17, 24, 39, 0.68);\n  backdrop-filter: blur(4px);\n}.gm .modal-card{\n  position: relative;\n  width: min(500px, 100%);\n  padding: 30px;\n  border-radius: 20px;\n  background: #FFFFFF;\n  box-shadow: 0 30px 90px rgba(17, 24, 39, 0.30);\n  text-align: center;\n}.gm .win-icon{\n  width: 58px;\n  height: 58px;\n  margin: 0 auto 14px;\n  display: grid;\n  place-items: center;\n  border-radius: 50%;\n  background: #FEF3C7;\n  color: #D97706;\n  font-size: 30px;\n}.gm .result-grid{\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 10px;\n  margin: 22px 0;\n}.gm .result-grid div{\n  padding: 14px 10px;\n  border-radius: 14px;\n  background: var(--background);\n}.gm .result-grid span{\n  display: block;\n  color: var(--muted);\n  font-size: 13px;\n  font-weight: 700;\n}.gm .result-grid strong{\n  font-size: 22px;\n}.gm .modal-actions{\n  display: flex;\n  justify-content: center;\n  gap: 10px;\n}.gm .modal .button-secondary{\n  border-color: var(--border);\n  background: #FFFFFF;\n  color: var(--text);\n}@media (max-width: 760px){.gm .game-section{\n    padding-bottom: 58px;\n  }.gm .game-panel{\n    padding: 18px;\n    border-radius: 18px;\n  }.gm .game-topbar{\n    align-items: flex-start;\n  }.gm .game-topbar h2{\n    font-size: 26px;\n  }.gm .stats-grid{\n    grid-template-columns: repeat(2, minmax(0, 1fr));\n  }.gm .game-board{\n    gap: 9px;\n  }.gm .card-face{\n    border-radius: 12px;\n  }.gm .memory-card{\n    border-radius: 12px;\n  }.gm .game-actions{\n    flex-direction: column;\n    align-items: stretch;\n  }.gm .control-hint{\n    text-align: left;\n  }}@media (max-width: 460px){.gm .game-topbar{\n    flex-direction: column;\n  }.gm .game-topbar .button{\n    width: 100%;\n  }.gm .stat-card{\n    padding: 12px;\n  }.gm .stat-value{\n    font-size: 22px;\n  }.gm .game-board{\n    gap: 7px;\n  }.gm .card-front::before{\n    font-size: 24px;\n  }.gm .card-back{\n    font-size: 30px;\n  }.gm .result-grid{\n    grid-template-columns: 1fr;\n  }.gm .modal-actions{\n    flex-direction: column;\n  }}@media (prefers-reduced-motion: reduce){.gm *,.gm *::before,.gm *::after{\n    scroll-behavior: auto !important;\n    transition-duration: 0.01ms !important;\n    animation-duration: 0.01ms !important;\n    animation-iteration-count: 1 !important;\n  }}";
function __ready(f){f()}
function boot(){
'use strict';

const symbols = ['◆', '●', '★', '▲', '♥', '☀', '☁', '♣'];
const totalPairs = symbols.length;

const board = document.getElementById('gameBoard');
const scoreEl = document.getElementById('score');
const movesEl = document.getElementById('moves');
const timerEl = document.getElementById('timer');
const pairsEl = document.getElementById('pairs');
const statusMessage = document.getElementById('statusMessage');
const restartBtn = document.getElementById('restartBtn');
const newGameBtn = document.getElementById('newGameBtn');
const winModal = document.getElementById('winModal');
const finalScore = document.getElementById('finalScore');
const finalMoves = document.getElementById('finalMoves');
const finalTime = document.getElementById('finalTime');
const playAgainBtn = document.getElementById('playAgainBtn');
const closeModalBtn = document.getElementById('closeModalBtn');

let deck = [];
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let moves = 0;
let matchedPairs = 0;
let score = 0;
let streak = 0;
let secondsElapsed = 0;
let timerId = null;
let gameStarted = false;
let gameFinished = false;
let currentSeedDeck = [];
let lastFocusedElement = null;

function shuffle(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function createDeck() {
  return shuffle([...symbols, ...symbols].map((symbol, index) => ({
    id: `${symbol}-${index}-${Math.random().toString(36).slice(2, 8)}`,
    symbol
  })));
}

function resetState() {
  stopTimer();
  firstCard = null;
  secondCard = null;
  lockBoard = false;
  moves = 0;
  matchedPairs = 0;
  score = 0;
  streak = 0;
  secondsElapsed = 0;
  gameStarted = false;
  gameFinished = false;
  updateStats();
  timerEl.textContent = '00:00';
  statusMessage.textContent = 'Choose any card to begin.';
}

function startNewGame(useExistingLayout = false) {
  closeWinModal(false);
  resetState();

  if (!useExistingLayout || currentSeedDeck.length === 0) {
    currentSeedDeck = createDeck();
  }

  deck = currentSeedDeck.map(card => ({ ...card, matched: false }));
  renderBoard();
}

function renderBoard() {
  board.innerHTML = '';

  deck.forEach((card, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'memory-card';
    button.dataset.id = card.id;
    button.dataset.symbol = card.symbol;
    button.setAttribute('role', 'gridcell');
    button.setAttribute('aria-label', `Card ${index + 1}, face down`);
    button.setAttribute('aria-pressed', 'false');

    button.innerHTML = `
      <span class="card-inner" aria-hidden="true">
        <span class="card-face card-front"></span>
        <span class="card-face card-back">${card.symbol}</span>
      </span>
    `;

    button.addEventListener('click', () => flipCard(button));
    button.addEventListener('keydown', handleCardKeydown);
    board.appendChild(button);
  });
}

function handleCardKeydown(event) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    flipCard(event.currentTarget);
  }
}

function flipCard(cardEl) {
  if (lockBoard || gameFinished) return;
  if (cardEl === firstCard) return;
  if (cardEl.classList.contains('is-matched') || cardEl.classList.contains('is-flipped')) return;

  if (!gameStarted) {
    gameStarted = true;
    startTimer();
    statusMessage.textContent = 'Game started. Find the matching symbol.';
  }

  revealCard(cardEl);

  if (!firstCard) {
    firstCard = cardEl;
    statusMessage.textContent = 'Now choose a second card.';
    return;
  }

  secondCard = cardEl;
  moves += 1;
  updateStats();
  checkForMatch();
}

function revealCard(cardEl) {
  cardEl.classList.add('is-flipped');
  cardEl.setAttribute('aria-pressed', 'true');
  cardEl.setAttribute('aria-label', `Revealed card: ${spokenSymbol(cardEl.dataset.symbol)}`);
}

function concealCard(cardEl) {
  cardEl.classList.remove('is-flipped');
  cardEl.setAttribute('aria-pressed', 'false');
  const cardIndex = [...board.children].indexOf(cardEl) + 1;
  cardEl.setAttribute('aria-label', `Card ${cardIndex}, face down`);
}

function checkForMatch() {
  const isMatch = firstCard.dataset.symbol === secondCard.dataset.symbol;

  if (isMatch) {
    handleMatch();
  } else {
    handleMismatch();
  }
}

function handleMatch() {
  lockBoard = true;
  matchedPairs += 1;
  streak += 1;

  const streakBonus = Math.min((streak - 1) * 15, 60);
  score += 100 + streakBonus;

  firstCard.classList.add('is-matched');
  secondCard.classList.add('is-matched');
  firstCard.disabled = true;
  secondCard.disabled = true;

  firstCard.setAttribute('aria-label', `Matched ${spokenSymbol(firstCard.dataset.symbol)} card`);
  secondCard.setAttribute('aria-label', `Matched ${spokenSymbol(secondCard.dataset.symbol)} card`);

  statusMessage.textContent = streak > 1
    ? `Match! ${streak} matches in a row — streak bonus earned.`
    : 'Match! Keep going.';

  updateStats();

  window.setTimeout(() => {
    resetTurn();
    if (matchedPairs === totalPairs) finishGame();
  }, 360);
}

function handleMismatch() {
  lockBoard = true;
  streak = 0;
  score = Math.max(0, score - 10);
  statusMessage.textContent = 'No match. Remember those positions.';
  updateStats();

  window.setTimeout(() => {
    concealCard(firstCard);
    concealCard(secondCard);
    resetTurn();
    statusMessage.textContent = 'Try another pair.';
  }, 820);
}

function resetTurn() {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
}

function updateStats() {
  scoreEl.textContent = score;
  movesEl.textContent = moves;
  pairsEl.textContent = `${matchedPairs}/${totalPairs}`;
}

function startTimer() {
  if (timerId) return;
  timerId = window.setInterval(() => {
    secondsElapsed += 1;
    timerEl.textContent = formatTime(secondsElapsed);
  }, 1000);
}

function stopTimer() {
  if (timerId) {
    window.clearInterval(timerId);
    timerId = null;
  }
}

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
  const seconds = (totalSeconds % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
}

function finishGame() {
  gameFinished = true;
  stopTimer();

  const efficiencyBonus = Math.max(0, 220 - Math.max(0, moves - totalPairs) * 12);
  const speedBonus = Math.max(0, 180 - secondsElapsed * 2);
  score += efficiencyBonus + speedBonus;
  updateStats();

  statusMessage.textContent = `Complete! You found all ${totalPairs} pairs in ${moves} moves.`;

  window.setTimeout(openWinModal, 450);
}

function openWinModal() {
  lastFocusedElement = document.activeElement;
  finalScore.textContent = score;
  finalMoves.textContent = moves;
  finalTime.textContent = formatTime(secondsElapsed);
  winModal.classList.add('is-open');
  winModal.setAttribute('aria-hidden', 'false');
  playAgainBtn.focus();
  document.body.style.overflow = 'hidden';
}

function closeWinModal(restoreFocus = true) {
  if (!winModal.classList.contains('is-open')) return;
  winModal.classList.remove('is-open');
  winModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';

  if (restoreFocus && lastFocusedElement instanceof HTMLElement) {
    lastFocusedElement.focus();
  }
}

function spokenSymbol(symbol) {
  const names = {
    '◆': 'diamond',
    '●': 'circle',
    '★': 'star',
    '▲': 'triangle',
    '♥': 'heart',
    '☀': 'sun',
    '☁': 'cloud',
    '♣': 'club'
  };
  return names[symbol] || 'symbol';
}

restartBtn.addEventListener('click', () => startNewGame(true));
newGameBtn.addEventListener('click', () => startNewGame(false));
playAgainBtn.addEventListener('click', () => startNewGame(false));
closeModalBtn.addEventListener('click', () => closeWinModal());

winModal.addEventListener('click', event => {
  if (event.target.dataset.closeModal === 'true') closeWinModal();
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && winModal.classList.contains('is-open')) {
    closeWinModal();
  }
});

startNewGame(false);


}
function begin(){poster.hidden=true;gm.hidden=false;if(!booted){booted=true;var s=document.createElement("style");s.textContent=LOOK;document.head.appendChild(s);boot();}else{var r=document.getElementById("newGameBtn");if(r)r.click();}}
poster.addEventListener("click",begin);
var nb=document.getElementById("new");if(nb)nb.addEventListener("click",begin);
})();
