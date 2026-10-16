/* Memory Cards - game logic + its own look. Layout lives in style.css; page shell lives in the HTML. */
(function(){"use strict";
var gm=document.getElementById("gm"),poster=document.getElementById("poster"),booted=false;
var LOOK=".gm{\n  \n  \n  --secondary: #16B8C4;\n  --action: #FFB84D;\n  --success: #22C55E;\n  --danger: #EF5B5B;\n  \n  \n  \n  \n  \n  --game-bg: #111827;\n  --game-bg-2: #1F2937;\n  \n  --radius: 18px;\n}.gm *{\n  box-sizing: border-box;\n}.gm button{\n  font: inherit;\n}.gm button{\n  cursor: pointer;\n}.gm .game-toolbar,.gm .status-row,.gm .section-heading-row{\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 20px;\n}.gm .game-label{\n  margin: 0 0 8px;\n  text-transform: uppercase;\n  letter-spacing: 0.08em;\n  color: var(--brand);\n  font-weight: 800;\n  font-size: 14px;\n}.gm h2,.gm h3,.gm p{\n  margin-top: 0;\n}.gm h2{\n  font-size: clamp(28px, 4vw, 36px);\n  line-height: 1.18;\n  margin-bottom: 18px;\n  font-weight: 800;\n  letter-spacing: -0.02em;\n}.gm h3{\n  font-size: 22px;\n  line-height: 1.3;\n  margin-bottom: 8px;\n}.gm .game-section{\n  padding: 20px 0 70px;\n}.gm .game-shell{\n  background: var(--card);\n  border: 1px solid var(--border);\n  border-radius: 24px;\n  box-shadow: var(--shadow);\n  padding: 28px;\n}.gm .game-toolbar{\n  margin-bottom: 22px;\n}.gm .game-toolbar h2{\n  margin-bottom: 0;\n  font-size: 28px;\n}.gm .stats-grid{\n  display: grid;\n  grid-template-columns: repeat(4, 1fr);\n  gap: 14px;\n  margin-bottom: 18px;\n}.gm .stat-card{\n  border: 1px solid var(--border);\n  background: #FAFBFF;\n  border-radius: 14px;\n  padding: 15px 18px;\n}.gm .stat-label{\n  display: block;\n  color: var(--muted);\n  font-size: 13px;\n  font-weight: 700;\n  margin-bottom: 2px;\n}.gm .stat-value{\n  display: block;\n  font-size: 24px;\n  line-height: 1.2;\n  font-weight: 800;\n}.gm .status-row{\n  margin-bottom: 18px;\n}.gm .status-text{\n  color: var(--muted);\n  margin: 0;\n  font-weight: 700;\n}.gm .btn{\n  min-height: 46px;\n  border-radius: 12px;\n  padding: 10px 18px;\n  border: 1px solid transparent;\n  font-weight: 800;\n  font-size: 16px;\n  transition: transform 160ms ease, background-color 160ms ease, border-color 160ms ease;\n}.gm .btn:hover{\n  transform: translateY(-1px);\n}.gm .btn:active{\n  transform: translateY(0);\n}.gm .btn:focus-visible,.gm .memory-card:focus-visible,.gm summary:focus-visible{\n  outline: 3px solid rgba(91, 92, 226, 0.35);\n  outline-offset: 3px;\n}.gm .btn-primary{\n  background: var(--brand);\n  color: #fff;\n}.gm .btn-primary:hover{\n  background: var(--brand-dark);\n}.gm .btn-secondary{\n  background: #fff;\n  color: var(--text);\n  border-color: var(--border);\n}.gm .btn-secondary:hover{\n  border-color: #C9CBDA;\n  background: #F9FAFC;\n}.gm .memory-board{\n  background: var(--game-bg);\n  border-radius: 20px;\n  padding: 24px;\n  display: grid;\n  grid-template-columns: repeat(4, minmax(0, 1fr));\n  gap: 16px;\n  max-width: 760px;\n  margin: 0 auto;\n  box-shadow: inset 0 0 0 1px rgba(255,255,255,0.05);\n}.gm .memory-card{\n  position: relative;\n  aspect-ratio: 1 / 1;\n  border: 0;\n  background: transparent;\n  padding: 0;\n  perspective: 900px;\n  border-radius: 16px;\n  -webkit-tap-highlight-color: transparent;\n}.gm .card-inner{\n  position: absolute;\n  inset: 0;\n  border-radius: 16px;\n  transform-style: preserve-3d;\n  transition: transform 360ms cubic-bezier(.2,.8,.2,1);\n}.gm .memory-card.is-flipped .card-inner,.gm .memory-card.is-matched .card-inner{\n  transform: rotateY(180deg);\n}.gm .card-face{\n  position: absolute;\n  inset: 0;\n  display: grid;\n  place-items: center;\n  border-radius: 16px;\n  backface-visibility: hidden;\n  -webkit-backface-visibility: hidden;\n  user-select: none;\n}.gm .card-back{\n  background: #5B5CE2;\n  color: rgba(255,255,255,0.95);\n  border: 2px solid rgba(255,255,255,0.16);\n  box-shadow: 0 8px 18px rgba(0,0,0,0.16);\n}.gm .card-back::before,.gm .card-back::after{\n  content: \"\";\n  position: absolute;\n  border-radius: 50%;\n  border: 2px solid rgba(255,255,255,0.28);\n}.gm .card-back::before{\n  width: 36%;\n  height: 36%;\n}.gm .card-back::after{\n  width: 12%;\n  height: 12%;\n  background: rgba(255,255,255,0.9);\n}.gm .card-front{\n  transform: rotateY(180deg);\n  background: #fff;\n  color: var(--text);\n  font-size: clamp(32px, 6vw, 52px);\n  border: 3px solid transparent;\n}.gm .memory-card.is-matched .card-front{\n  border-color: var(--success);\n  background: #F2FFF6;\n}.gm .memory-card.is-matched{\n  cursor: default;\n}.gm .memory-card.is-matched .card-front::after{\n  content: \"\u2713\";\n  position: absolute;\n  top: 8px;\n  right: 10px;\n  width: 24px;\n  height: 24px;\n  display: grid;\n  place-items: center;\n  border-radius: 50%;\n  background: var(--success);\n  color: #fff;\n  font-size: 14px;\n  font-weight: 800;\n}.gm .memory-card.wrong .card-front{\n  border-color: var(--danger);\n}.gm .game-help{\n  margin: 18px auto 0;\n  max-width: 760px;\n  display: flex;\n  align-items: flex-start;\n  gap: 10px;\n  color: var(--muted);\n  font-size: 15px;\n}.gm .game-help p{\n  margin: 0;\n}.gm .help-dot{\n  width: 10px;\n  height: 10px;\n  border-radius: 50%;\n  background: var(--secondary);\n  margin-top: 8px;\n  flex: 0 0 auto;\n}.gm .alt-section{\n  background: #fff;\n  border-top: 1px solid var(--border);\n  border-bottom: 1px solid var(--border);\n}.gm .steps-list,.gm .clean-list,.gm .strategy-list{\n  margin: 0;\n  padding-left: 22px;\n}.gm .steps-list li,.gm .clean-list li,.gm .strategy-list li{\n  margin-bottom: 10px;\n}.gm .clean-list{\n  list-style: none;\n  padding-left: 0;\n}.gm .article-width{\n  max-width: 860px;\n}.gm .article-width p,.gm .article-width li{\n  color: #4F586D;\n}.gm .article-width h2:not(:first-child){\n  margin-top: 42px;\n}.gm .coming-soon{\n  font-size: 13px;\n  color: var(--muted);\n  font-weight: 700;\n}.gm details{\n  background: #fff;\n  border: 1px solid var(--border);\n  border-radius: 14px;\n  padding: 18px 20px;\n}.gm summary{\n  cursor: pointer;\n  font-weight: 800;\n}.gm details p{\n  margin: 12px 0 0;\n  color: var(--muted);\n}.gm .modal[hidden]{\n  display: none;\n}.gm .modal{\n  position: fixed;\n  inset: 0;\n  z-index: 100;\n  display: grid;\n  place-items: center;\n  padding: 20px;\n}.gm .modal-backdrop{\n  position: absolute;\n  inset: 0;\n  background: rgba(17, 24, 39, 0.68);\n}.gm .modal-card{\n  position: relative;\n  width: min(460px, 100%);\n  background: #fff;\n  border-radius: 22px;\n  padding: 30px;\n  text-align: center;\n  box-shadow: 0 28px 80px rgba(0,0,0,0.28);\n}.gm .trophy{\n  width: 62px;\n  height: 62px;\n  border-radius: 20px;\n  display: grid;\n  place-items: center;\n  background: #FFF7E7;\n  color: #D58A00;\n  font-size: 34px;\n  margin: 0 auto 16px;\n}.gm .modal-card h2{\n  margin-bottom: 10px;\n}.gm .modal-card > p:not(.eyebrow){\n  color: var(--muted);\n}.gm .modal-stats{\n  display: grid;\n  grid-template-columns: repeat(2, 1fr);\n  gap: 12px;\n  margin: 22px 0;\n}.gm .modal-stats div{\n  background: #F7F8FC;\n  border-radius: 12px;\n  padding: 14px;\n}.gm .modal-stats span,.gm .modal-stats strong{\n  display: block;\n}.gm .modal-stats span{\n  font-size: 13px;\n  color: var(--muted);\n  font-weight: 700;\n}.gm .modal-stats strong{\n  font-size: 24px;\n}.gm .modal-actions{\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 12px;\n}@media (max-width: 860px){.gm .stats-grid{\n    grid-template-columns: repeat(2, 1fr);\n  }.gm .memory-board{\n    gap: 12px;\n    padding: 18px;\n  }}@media (max-width: 640px){.gm h2{\n    font-size: 28px;\n  }.gm .game-section{\n    padding-bottom: 54px;\n  }.gm .game-shell{\n    padding: 16px;\n    border-radius: 18px;\n  }.gm .game-toolbar,.gm .status-row{\n    align-items: stretch;\n    flex-direction: column;\n  }.gm .game-toolbar .btn,.gm .status-row .btn{\n    width: 100%;\n  }.gm .stats-grid{\n    gap: 10px;\n  }.gm .stat-card{\n    padding: 12px 14px;\n  }.gm .stat-value{\n    font-size: 21px;\n  }.gm .memory-board{\n    width: 100%;\n    gap: 9px;\n    padding: 12px;\n    border-radius: 16px;\n  }.gm .memory-card,.gm .card-inner,.gm .card-face{\n    border-radius: 12px;\n  }.gm .card-front{\n    font-size: clamp(28px, 10vw, 42px);\n  }.gm .memory-card.is-matched .card-front::after{\n    top: 5px;\n    right: 5px;\n    width: 20px;\n    height: 20px;\n    font-size: 12px;\n  }.gm .modal-card{\n    padding: 24px 18px;\n  }}@media (max-width: 380px){.gm .memory-board{\n    gap: 7px;\n    padding: 10px;\n  }.gm .card-front{\n    font-size: 28px;\n  }}@media (prefers-reduced-motion: reduce){.gm *,.gm *::before,.gm *::after{\n    scroll-behavior: auto !important;\n    animation-duration: 0.01ms !important;\n    animation-iteration-count: 1 !important;\n    transition-duration: 0.01ms !important;\n  }}";
function __ready(f){f()}
function boot(){
(() => {
  "use strict";

  const SYMBOLS = ["🍒", "🚀", "🌟", "🎲", "🐼", "⚽", "🎵", "💎"];
  const TOTAL_PAIRS = SYMBOLS.length;
  const STORAGE_KEY = "memoryCardsBestMoves";

  const board = document.getElementById("memoryBoard");
  const movesEl = document.getElementById("moves");
  const matchesEl = document.getElementById("matches");
  const timerEl = document.getElementById("timer");
  const bestMovesEl = document.getElementById("bestMoves");
  const statusText = document.getElementById("statusText");
  const restartButton = document.getElementById("restartButton");
  const newGameTop = document.getElementById("newGameTop");
  const winModal = document.getElementById("winModal");
  const finalMoves = document.getElementById("finalMoves");
  const finalTime = document.getElementById("finalTime");
  const playAgainButton = document.getElementById("playAgainButton");
  const closeModalButton = document.getElementById("closeModalButton");
  const currentYear = document.getElementById("currentYear");

  let cards = [];
  let firstCard = null;
  let secondCard = null;
  let lockBoard = false;
  let moves = 0;
  let matches = 0;
  let started = false;
  let completed = false;
  let startTime = 0;
  let elapsedSeconds = 0;
  let timerInterval = null;
  let lastFocusedElement = null;

  function shuffle(array) {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
    const seconds = (totalSeconds % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  }

  function getBestMoves() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = Number.parseInt(raw, 10);
      return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
    } catch (error) {
      return null;
    }
  }

  function setBestMoves(value) {
    try {
      localStorage.setItem(STORAGE_KEY, String(value));
    } catch (error) {
      // Local storage can be unavailable in private or restricted browsing contexts.
    }
  }

  function updateBestMovesDisplay() {
    const best = getBestMoves();
    bestMovesEl.textContent = best ?? "—";
  }

  function startTimer() {
    if (started || completed) return;
    started = true;
    startTime = Date.now() - elapsedSeconds * 1000;
    timerInterval = window.setInterval(() => {
      elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
      timerEl.textContent = formatTime(elapsedSeconds);
    }, 250);
  }

  function stopTimer() {
    if (timerInterval !== null) {
      window.clearInterval(timerInterval);
      timerInterval = null;
    }
    if (started) {
      elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
      timerEl.textContent = formatTime(elapsedSeconds);
    }
  }

  function createCard(symbol, index) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "memory-card";
    button.dataset.symbol = symbol;
    button.dataset.index = String(index);
    button.setAttribute("role", "gridcell");
    button.setAttribute("aria-label", `Card ${index + 1}, face down`);
    button.setAttribute("aria-pressed", "false");

    button.innerHTML = `
      <span class="card-inner" aria-hidden="true">
        <span class="card-face card-back"></span>
        <span class="card-face card-front">${symbol}</span>
      </span>
    `;

    button.addEventListener("click", () => handleCardSelection(button));
    return button;
  }

  function renderBoard() {
    const deck = shuffle([...SYMBOLS, ...SYMBOLS]);
    board.innerHTML = "";
    cards = deck.map((symbol, index) => {
      const card = createCard(symbol, index);
      board.appendChild(card);
      return card;
    });
  }

  function revealCard(card) {
    card.classList.add("is-flipped");
    card.setAttribute("aria-pressed", "true");
    card.setAttribute("aria-label", `Card ${Number(card.dataset.index) + 1}, ${card.dataset.symbol}`);
  }

  function hideCard(card) {
    card.classList.remove("is-flipped", "wrong");
    card.setAttribute("aria-pressed", "false");
    card.setAttribute("aria-label", `Card ${Number(card.dataset.index) + 1}, face down`);
  }

  function markMatched(card) {
    card.classList.add("is-matched");
    card.classList.remove("wrong");
    card.disabled = true;
    card.setAttribute("aria-label", `Matched card, ${card.dataset.symbol}`);
  }

  function resetTurn() {
    firstCard = null;
    secondCard = null;
    lockBoard = false;
  }

  function handleCardSelection(card) {
    if (lockBoard || completed || card === firstCard || card.classList.contains("is-matched")) return;

    startTimer();
    revealCard(card);

    if (!firstCard) {
      firstCard = card;
      statusText.textContent = "Choose a second card.";
      return;
    }

    secondCard = card;
    moves += 1;
    movesEl.textContent = String(moves);

    if (firstCard.dataset.symbol === secondCard.dataset.symbol) {
      window.setTimeout(() => {
        markMatched(firstCard);
        markMatched(secondCard);
        matches += 1;
        matchesEl.textContent = String(matches);
        statusText.textContent = matches === TOTAL_PAIRS ? "All pairs matched!" : "Match found — keep going.";
        resetTurn();

        if (matches === TOTAL_PAIRS) finishGame();
      }, 240);
      return;
    }

    lockBoard = true;
    firstCard.classList.add("wrong");
    secondCard.classList.add("wrong");
    statusText.textContent = "Not a match. Remember their positions.";

    window.setTimeout(() => {
      hideCard(firstCard);
      hideCard(secondCard);
      resetTurn();
      statusText.textContent = "Try another pair.";
    }, 760);
  }

  function finishGame() {
    completed = true;
    stopTimer();

    const best = getBestMoves();
    const isNewBest = best === null || moves < best;

    if (isNewBest) {
      setBestMoves(moves);
      updateBestMovesDisplay();
    }

    finalMoves.textContent = String(moves);
    finalTime.textContent = formatTime(elapsedSeconds);
    const winSummary = document.getElementById("winSummary");
    winSummary.textContent = isNewBest
      ? "You matched every pair and set a new best move score."
      : "You matched every pair. Try again to beat your best move score.";

    window.setTimeout(openModal, 350);
  }

  function resetGame() {
    stopTimer();
    firstCard = null;
    secondCard = null;
    lockBoard = false;
    moves = 0;
    matches = 0;
    started = false;
    completed = false;
    startTime = 0;
    elapsedSeconds = 0;

    movesEl.textContent = "0";
    matchesEl.textContent = "0";
    timerEl.textContent = "00:00";
    statusText.textContent = "Flip any card to start.";

    closeModal(false);
    renderBoard();
    cards[0]?.focus({ preventScroll: true });
  }

  function openModal() {
    lastFocusedElement = document.activeElement;
    winModal.hidden = false;
    document.body.style.overflow = "hidden";
    playAgainButton.focus();
  }

  function closeModal(restoreFocus = true) {
    if (winModal.hidden) return;
    winModal.hidden = true;
    document.body.style.overflow = "";
    if (restoreFocus && lastFocusedElement instanceof HTMLElement) {
      lastFocusedElement.focus();
    }
  }

  function handleModalKeyboard(event) {
    if (winModal.hidden) return;

    if (event.key === "Escape") {
      closeModal();
      return;
    }

    if (event.key !== "Tab") return;

    const focusable = [playAgainButton, closeModalButton];
    const currentIndex = focusable.indexOf(document.activeElement);
    const nextIndex = event.shiftKey
      ? (currentIndex <= 0 ? focusable.length - 1 : currentIndex - 1)
      : (currentIndex >= focusable.length - 1 ? 0 : currentIndex + 1);

    event.preventDefault();
    focusable[nextIndex].focus();
  }

  restartButton.addEventListener("click", resetGame);
  newGameTop.addEventListener("click", resetGame);
  playAgainButton.addEventListener("click", resetGame);
  closeModalButton.addEventListener("click", () => closeModal());
  winModal.addEventListener("click", (event) => {
    if (event.target instanceof HTMLElement && event.target.dataset.closeModal === "true") {
      closeModal();
    }
  });
  document.addEventListener("keydown", handleModalKeyboard);

  currentYear.textContent = String(new Date().getFullYear());
  updateBestMovesDisplay();
  renderBoard();
})();


}
function begin(){poster.hidden=true;gm.hidden=false;if(!booted){booted=true;var s=document.createElement("style");s.textContent=LOOK;document.head.appendChild(s);boot();}else{var r=document.getElementById("newGameTop");if(r)r.click();}}
poster.addEventListener("click",begin);
var nb=document.getElementById("new");if(nb)nb.addEventListener("click",begin);
})();
