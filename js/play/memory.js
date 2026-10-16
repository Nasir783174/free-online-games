/* Memory - game logic + its own look. Layout lives in style.css; page shell lives in the HTML. */
(function(){"use strict";
var gm=document.getElementById("gm"),poster=document.getElementById("poster"),booted=false;
var LOOK=".gm *{ box-sizing: border-box; }.gm button,.gm select{ font: inherit; }.gm button{ cursor: pointer; }.gm .category-pill{\n  color: var(--brand-dark);\n  background: #EEEEFF;\n  border: 1px solid #DDDEFF;\n  border-radius: 999px;\n  padding: 5px 12px;\n  font-size: 14px;\n  font-weight: 700;\n}.gm .page-shell{\n  max-width: 1160px;\n  margin: 0 auto;\n  padding: 28px 20px 80px;\n}.gm .section-kicker{\n  margin: 0 0 7px;\n  color: var(--brand);\n  font-size: 13px;\n  font-weight: 800;\n  letter-spacing: 0.11em;\n}.gm h2,.gm h3{\n  margin-top: 0;\n  color: var(--text);\n}.gm h2{\n  margin-bottom: 12px;\n  font-size: 34px;\n  line-height: 1.18;\n  font-weight: 700;\n}.gm h3{\n  margin: 34px 0 10px;\n  font-size: 22px;\n  line-height: 1.25;\n  font-weight: 700;\n}.gm p{ margin: 0 0 18px; }.gm .game-section{\n  margin-bottom: 78px;\n}.gm .game-topbar{\n  display: flex;\n  align-items: end;\n  justify-content: space-between;\n  gap: 24px;\n  margin-bottom: 18px;\n}.gm .game-topbar h2{ margin-bottom: 0; }.gm .difficulty-wrap{\n  display: flex;\n  align-items: center;\n  gap: 10px;\n}.gm .difficulty-wrap label{\n  color: var(--muted);\n  font-size: 14px;\n  font-weight: 700;\n}.gm select{\n  min-height: 46px;\n  padding: 8px 34px 8px 13px;\n  color: var(--text);\n  background: white;\n  border: 1px solid var(--border);\n  border-radius: 10px;\n  font-weight: 700;\n  outline: none;\n}.gm select:focus-visible{\n  border-color: var(--brand);\n  box-shadow: 0 0 0 3px rgba(91, 92, 226, 0.15);\n}.gm .stats{\n  display: grid;\n  grid-template-columns: repeat(5, 1fr);\n  gap: 10px;\n  margin-bottom: 12px;\n}.gm .stat{\n  min-height: 74px;\n  padding: 10px 14px;\n  background: white;\n  border: 1px solid var(--border);\n  border-radius: 13px;\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n}.gm .stat-label{\n  color: var(--muted);\n  font-size: 12px;\n  font-weight: 700;\n  text-transform: uppercase;\n  letter-spacing: 0.05em;\n}.gm .stat strong{\n  margin-top: 1px;\n  color: var(--text);\n  font-size: 21px;\n  line-height: 1.2;\n  font-weight: 800;\n}.gm .score-stat{\n  background: #EEEEFF;\n  border-color: #DDDEFF;\n}.gm .score-stat strong{ color: var(--brand-dark); }.gm .game-card{\n  padding: 18px;\n  border-radius: var(--radius);\n  background: var(--game);\n  box-shadow: 0 14px 40px rgba(17, 24, 39, 0.12);\n}.gm .game-status{\n  min-height: 34px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  margin: 0 auto 14px;\n  color: #E5E7EB;\n  font-size: 15px;\n  font-weight: 700;\n  text-align: center;\n}.gm .board{\n  width: min(100%, 820px);\n  margin: 0 auto;\n  display: grid;\n  grid-template-columns: repeat(5, minmax(52px, 1fr));\n  gap: 11px;\n  perspective: 1000px;\n}.gm .memory-card{\n  position: relative;\n  min-width: 0;\n  aspect-ratio: 1 / 1;\n  padding: 0;\n  border: 0;\n  border-radius: 13px;\n  background: transparent;\n  transform-style: preserve-3d;\n  transition: transform 0.32s ease, filter 0.2s ease;\n  -webkit-tap-highlight-color: transparent;\n}.gm .memory-card:not(:disabled):hover{\n  filter: brightness(1.08);\n  transform: translateY(-2px);\n}.gm .memory-card.is-flipped,.gm .memory-card.is-matched{\n  transform: rotateY(180deg);\n}.gm .card-face{\n  position: absolute;\n  inset: 0;\n  border-radius: 13px;\n  backface-visibility: hidden;\n  -webkit-backface-visibility: hidden;\n}.gm .card-back{\n  display: grid;\n  place-items: center;\n  background: #293548;\n  border: 2px solid #3D4A5E;\n  color: #AEB8C8;\n  box-shadow: inset 0 0 0 1px rgba(255,255,255,0.03);\n}.gm .card-back::after{\n  content: \"\u2726\";\n  width: 36%;\n  aspect-ratio: 1;\n  display: grid;\n  place-items: center;\n  border: 2px solid #657187;\n  border-radius: 50%;\n  color: #AEB8C8;\n  font-size: clamp(17px, 3vw, 25px);\n}.gm .card-front{\n  transform: rotateY(180deg);\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  gap: 2px;\n  padding: 6px;\n  background: #FFFFFF;\n  color: var(--text);\n  border: 3px solid #FFFFFF;\n}.gm .card-emoji{\n  font-size: clamp(28px, 5vw, 44px);\n  line-height: 1;\n}.gm .card-word{\n  max-width: 100%;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  font-size: clamp(11px, 1.5vw, 14px);\n  font-weight: 800;\n}.gm .memory-card.is-matched .card-front{\n  border-color: #6EE7B7;\n  box-shadow: inset 0 0 0 2px rgba(34,197,94,0.16);\n}.gm .memory-card:focus-visible{\n  outline: 3px solid var(--yellow);\n  outline-offset: 3px;\n  border-radius: 15px;\n}.gm .controls{\n  display: flex;\n  justify-content: center;\n  gap: 10px;\n  margin: 18px 0 24px;\n}.gm .primary-btn,.gm .secondary-btn{\n  min-height: 48px;\n  padding: 10px 22px;\n  border-radius: 11px;\n  border: 1px solid transparent;\n  font-size: 16px;\n  font-weight: 800;\n  transition: transform 0.15s ease, background 0.15s ease;\n}.gm .primary-btn{\n  color: white;\n  background: var(--brand);\n}.gm .primary-btn:hover{ background: var(--brand-dark); }.gm .secondary-btn{\n  color: var(--text);\n  background: white;\n  border-color: var(--border);\n}.gm .secondary-btn:hover{ background: #F1F2F8; }.gm .primary-btn:active,.gm .secondary-btn:active{ transform: translateY(1px); }.gm .primary-btn:focus-visible,.gm .secondary-btn:focus-visible{\n  outline: 3px solid rgba(91, 92, 226, 0.25);\n  outline-offset: 2px;\n}.gm .tip-box{\n  max-width: 820px;\n  margin: 0 auto;\n  padding: 15px 18px;\n  display: flex;\n  align-items: flex-start;\n  gap: 12px;\n  background: white;\n  border: 1px solid var(--border);\n  border-radius: 13px;\n}.gm .tip-box p{\n  margin: 0;\n  color: var(--muted);\n  font-size: 15px;\n}.gm .tip-box strong{ color: var(--text); }.gm .tip-icon{ font-size: 22px; line-height: 1.3; }.gm .steps{\n  padding-left: 25px;\n}.gm .steps li{\n  padding-left: 6px;\n  margin-bottom: 10px;\n}.gm .steps strong{ color: var(--text); }.gm .control-grid{\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 12px;\n}.gm .control-grid > div{\n  display: flex;\n  flex-direction: column;\n  gap: 4px;\n  padding: 15px;\n  background: white;\n  border: 1px solid var(--border);\n  border-radius: 12px;\n}.gm .control-key{\n  color: var(--brand-dark);\n  font-size: 13px;\n  font-weight: 800;\n  text-transform: uppercase;\n  letter-spacing: 0.05em;\n}.gm .control-grid > div span:last-child{\n  color: var(--muted);\n  font-size: 15px;\n}.gm .tips-list{\n  padding-left: 24px;\n}.gm .tips-list li{ margin-bottom: 8px; }.gm .win-modal[hidden]{ display: none; }.gm .win-modal{\n  position: fixed;\n  inset: 0;\n  z-index: 100;\n  display: grid;\n  place-items: center;\n  padding: 20px;\n}.gm .modal-backdrop{\n  position: absolute;\n  inset: 0;\n  background: rgba(17, 24, 39, 0.6);\n}.gm .modal{\n  position: relative;\n  width: min(100%, 460px);\n  padding: 34px;\n  background: white;\n  border-radius: 20px;\n  box-shadow: 0 24px 80px rgba(17,24,39,0.25);\n  text-align: center;\n  animation: modal-in 0.22s ease-out;\n}@keyframes modal-in{\n  from { opacity: 0; transform: translateY(10px) scale(0.98); }\n  to { opacity: 1; transform: translateY(0) scale(1); }\n}.gm .modal-close{\n  position: absolute;\n  top: 12px;\n  right: 14px;\n  width: 38px;\n  height: 38px;\n  border: 0;\n  border-radius: 50%;\n  background: #F3F4F7;\n  color: var(--text);\n  font-size: 25px;\n  line-height: 1;\n}.gm .modal-close:hover{ background: #E9EAF0; }.gm .modal-close:focus-visible{\n  outline: 3px solid rgba(91, 92, 226, 0.25);\n}.gm .win-icon{\n  margin-bottom: 7px;\n  font-size: 42px;\n  line-height: 1;\n}.gm .modal h2{\n  margin-bottom: 7px;\n  font-size: 32px;\n}.gm .modal > p:not(.section-kicker){\n  color: var(--muted);\n}.gm .result-grid{\n  display: grid;\n  grid-template-columns: repeat(4, 1fr);\n  gap: 8px;\n  margin: 20px 0;\n}.gm .result-grid > div{\n  padding: 11px 6px;\n  background: var(--bg);\n  border-radius: 10px;\n}.gm .result-grid span{\n  display: block;\n  color: var(--muted);\n  font-size: 11px;\n  font-weight: 800;\n  text-transform: uppercase;\n}.gm .result-grid strong{\n  display: block;\n  margin-top: 2px;\n  font-size: 18px;\n}.gm .modal-action{ width: 100%; }@media (max-width: 800px){.gm .page-shell{ padding-top: 22px; }.gm .stats{ grid-template-columns: repeat(3, 1fr); }.gm .score-stat{ grid-column: span 1; }.gm .board{ grid-template-columns: repeat(5, minmax(48px, 1fr)); gap: 8px; }}@media (max-width: 620px){.gm .category-pill{ display: none; }.gm .page-shell{ padding: 20px 14px 58px; }.gm h2{ font-size: 28px; }.gm .game-topbar{\n    align-items: flex-start;\n    flex-direction: column;\n    gap: 13px;\n  }.gm .difficulty-wrap{ width: 100%; }.gm .difficulty-wrap select{ flex: 1; }.gm .stats{\n    grid-template-columns: repeat(2, 1fr);\n  }.gm .stat{ min-height: 68px; }.gm .stat strong{ font-size: 19px; }.gm .game-card{ padding: 10px; }.gm .game-status{ min-height: 40px; padding: 0 5px; font-size: 14px; }.gm .board{ grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 7px; }.gm .card-front{ border-width: 2px; }.gm .card-word{ font-size: 10px; }.gm .controls{\n    width: 100%;\n  }.gm .primary-btn,.gm .secondary-btn{\n    flex: 1;\n    min-height: 50px;\n  }.gm .control-grid{ grid-template-columns: 1fr; }.gm .tip-box{ padding: 13px; }.gm .tip-box p{ font-size: 14px; }.gm .modal{ padding: 30px 18px 22px; }.gm .result-grid{ grid-template-columns: repeat(2, 1fr); }}@media (prefers-reduced-motion: reduce){.gm *,.gm *::before,.gm *::after{\n    animation-duration: 0.01ms !important;\n    transition-duration: 0.01ms !important;\n  }}";
function __ready(f){f()}
function boot(){
(() => {
  "use strict";

  const CARD_POOL = [
    { id: "elephant", emoji: "🐘", word: "Elephant", fact: "Elephants are the largest living land animals." },
    { id: "penguin", emoji: "🐧", word: "Penguin", fact: "Emperor penguins can dive to great depths to find food." },
    { id: "dolphin", emoji: "🐬", word: "Dolphin", fact: "Dolphins use clicks and whistles to communicate and navigate." },
    { id: "bee", emoji: "🐝", word: "Bee", fact: "Honeybees can communicate the location of food with a waggle dance." },
    { id: "panda", emoji: "🐼", word: "Panda", fact: "Giant pandas spend many hours each day eating bamboo." },
    { id: "owl", emoji: "🦉", word: "Owl", fact: "Owls can turn their heads remarkably far because of special neck anatomy." },
    { id: "turtle", emoji: "🐢", word: "Turtle", fact: "Some turtles can live for many decades." },
    { id: "butterfly", emoji: "🦋", word: "Butterfly", fact: "Butterflies taste with sensors on their feet." },
    { id: "rocket", emoji: "🚀", word: "Rocket", fact: "Rockets move in space by pushing exhaust in the opposite direction." },
    { id: "earth", emoji: "🌍", word: "Earth", fact: "Earth is the third planet from the Sun." },
    { id: "moon", emoji: "🌙", word: "Moon", fact: "The Moon takes about 27 days to orbit Earth relative to the stars." },
    { id: "sun", emoji: "☀️", word: "Sun", fact: "The Sun is a star at the center of our solar system." },
    { id: "atom", emoji: "⚛️", word: "Atom", fact: "Atoms are the basic units that make up ordinary matter." },
    { id: "water", emoji: "💧", word: "Water", fact: "Water can naturally occur as a solid, liquid, or gas on Earth." },
    { id: "volcano", emoji: "🌋", word: "Volcano", fact: "Volcanoes can form where magma reaches or approaches Earth's surface." },
    { id: "rainbow", emoji: "🌈", word: "Rainbow", fact: "Rainbows form when light is refracted, reflected, and dispersed by water droplets." },
    { id: "mountain", emoji: "⛰️", word: "Mountain", fact: "Mountains can form when tectonic plates push Earth's crust together." },
    { id: "tree", emoji: "🌳", word: "Tree", fact: "Trees take in carbon dioxide and release oxygen during photosynthesis." },
    { id: "compass", emoji: "🧭", word: "Compass", fact: "A magnetic compass aligns with Earth's magnetic field." },
    { id: "globe", emoji: "🌐", word: "Globe", fact: "A globe is a scale model that represents Earth's roughly spherical shape." },
    { id: "book", emoji: "📚", word: "Books", fact: "Reading regularly can expose learners to new vocabulary and ideas." },
    { id: "microscope", emoji: "🔬", word: "Microscope", fact: "Microscopes help scientists observe objects too small to see clearly with the naked eye." },
    { id: "puzzle", emoji: "🧩", word: "Puzzle", fact: "Memory games can encourage attention, recall, and pattern recognition." },
    { id: "lightbulb", emoji: "💡", word: "Idea", fact: "The brain continually forms and strengthens connections as we learn." }
  ];

  const DIFFICULTIES = {
    easy: { pairs: 8 },
    medium: { pairs: 10 },
    hard: { pairs: 12 }
  };

  const board = document.getElementById("board");
  const difficulty = document.getElementById("difficulty");
  const timeEl = document.getElementById("time");
  const movesEl = document.getElementById("moves");
  const matchesEl = document.getElementById("matches");
  const accuracyEl = document.getElementById("accuracy");
  const scoreEl = document.getElementById("score");
  const statusEl = document.getElementById("gameStatus");
  const newGameBtn = document.getElementById("newGame");
  const restartBtn = document.getElementById("restart");
  const winModal = document.getElementById("winModal");
  const closeModalBtn = document.getElementById("closeModal");
  const playAgainBtn = document.getElementById("playAgain");
  const finalScore = document.getElementById("finalScore");
  const finalMoves = document.getElementById("finalMoves");
  const finalTime = document.getElementById("finalTime");
  const finalAccuracy = document.getElementById("finalAccuracy");
  const winMessage = document.getElementById("winMessage");

  let deck = [];
  let firstCard = null;
  let secondCard = null;
  let lockBoard = false;
  let moves = 0;
  let matches = 0;
  let score = 0;
  let elapsedSeconds = 0;
  let timerId = null;
  let gameStarted = false;
  let gameFinished = false;
  let lastFocusedCard = null;

  function shuffle(items) {
    const result = [...items];
    for (let i = result.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  function formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
    const seconds = (totalSeconds % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  }

  function getAccuracy() {
    if (moves === 0) return 100;
    return Math.round((matches / moves) * 100);
  }

  function updateStats() {
    const totalPairs = DIFFICULTIES[difficulty.value].pairs;
    timeEl.textContent = formatTime(elapsedSeconds);
    movesEl.textContent = String(moves);
    matchesEl.textContent = `${matches} / ${totalPairs}`;
    accuracyEl.textContent = `${getAccuracy()}%`;
    scoreEl.textContent = String(Math.max(0, score));
  }

  function startTimer() {
    if (timerId !== null) return;
    timerId = window.setInterval(() => {
      elapsedSeconds += 1;
      updateStats();
    }, 1000);
  }

  function stopTimer() {
    if (timerId !== null) {
      window.clearInterval(timerId);
      timerId = null;
    }
  }

  function buildDeck() {
    const pairCount = DIFFICULTIES[difficulty.value].pairs;
    const selected = shuffle(CARD_POOL).slice(0, pairCount);
    deck = shuffle(
      selected.flatMap(card => [
        { ...card, uniqueKey: `${card.id}-a-${Math.random()}` },
        { ...card, uniqueKey: `${card.id}-b-${Math.random()}` }
      ])
    );
  }

  function createCard(card, index) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "memory-card";
    button.dataset.cardId = card.id;
    button.dataset.index = String(index);
    button.setAttribute("aria-label", `Face-down memory card ${index + 1}`);
    button.setAttribute("aria-pressed", "false");

    const back = document.createElement("span");
    back.className = "card-face card-back";
    back.setAttribute("aria-hidden", "true");

    const front = document.createElement("span");
    front.className = "card-face card-front";
    front.setAttribute("aria-hidden", "true");
    front.innerHTML = `
      <span class="card-emoji">${card.emoji}</span>
      <span class="card-word">${card.word}</span>
    `;

    button.append(back, front);
    button.addEventListener("click", () => handleCardClick(button, card));
    return button;
  }

  function renderBoard() {
    board.replaceChildren();
    deck.forEach((card, index) => board.appendChild(createCard(card, index)));
  }

  function setCardFlipped(cardEl, flipped) {
    cardEl.classList.toggle("is-flipped", flipped);
    cardEl.setAttribute("aria-pressed", String(flipped));
    if (flipped) {
      const card = deck[Number(cardEl.dataset.index)];
      cardEl.setAttribute("aria-label", `${card.word} card`);
    } else {
      cardEl.setAttribute("aria-label", `Face-down memory card ${Number(cardEl.dataset.index) + 1}`);
    }
  }

  function handleCardClick(cardEl, card) {
    if (lockBoard || gameFinished) return;
    if (cardEl === firstCard) return;
    if (cardEl.classList.contains("is-matched")) return;

    if (!gameStarted) {
      gameStarted = true;
      startTimer();
      statusEl.textContent = "Remember the cards and find their pairs.";
    }

    setCardFlipped(cardEl, true);

    if (!firstCard) {
      firstCard = cardEl;
      lastFocusedCard = cardEl;
      return;
    }

    secondCard = cardEl;
    lastFocusedCard = cardEl;
    moves += 1;
    lockBoard = true;
    updateStats();

    const firstId = firstCard.dataset.cardId;
    if (firstId === card.id) {
      handleMatch(card);
    } else {
      handleMismatch();
    }
  }

  function handleMatch(card) {
    const currentFirst = firstCard;
    const currentSecond = secondCard;

    currentFirst.classList.add("is-matched");
    currentSecond.classList.add("is-matched");
    currentFirst.disabled = true;
    currentSecond.disabled = true;
    matches += 1;

    const basePoints = 100;
    const efficiencyBonus = Math.max(0, 50 - (moves - matches) * 5);
    const timeBonus = Math.max(0, 40 - Math.floor(elapsedSeconds / 10));
    score += basePoints + efficiencyBonus + timeBonus;

    statusEl.textContent = `Match found: ${card.word}. ${card.fact}`;
    updateStats();

    window.setTimeout(() => {
      resetTurn();
      if (matches === DIFFICULTIES[difficulty.value].pairs) {
        finishGame();
      }
    }, 420);
  }

  function handleMismatch() {
    statusEl.textContent = "Not a match. Try to remember both positions.";
    updateStats();

    const currentFirst = firstCard;
    const currentSecond = secondCard;

    window.setTimeout(() => {
      setCardFlipped(currentFirst, false);
      setCardFlipped(currentSecond, false);
      resetTurn();
      statusEl.textContent = "Keep going — remember the cards you just saw.";
    }, 780);
  }

  function resetTurn() {
    firstCard = null;
    secondCard = null;
    lockBoard = false;
  }

  function finishGame() {
    gameFinished = true;
    stopTimer();

    const accuracy = getAccuracy();
    const timePenalty = Math.min(300, elapsedSeconds * 2);
    score = Math.max(0, score + 250 - timePenalty);

    updateStats();
    finalScore.textContent = String(score);
    finalMoves.textContent = String(moves);
    finalTime.textContent = formatTime(elapsedSeconds);
    finalAccuracy.textContent = `${accuracy}%`;

    if (accuracy >= 80) {
      winMessage.textContent = "Excellent recall! You found every pair with strong accuracy.";
    } else if (accuracy >= 50) {
      winMessage.textContent = "Nice work! Keep playing to sharpen your recall.";
    } else {
      winMessage.textContent = "You completed the board. Try again and see if you can use fewer moves.";
    }

    winModal.hidden = false;
    statusEl.textContent = "Board complete! Great job.";
  }

  function closeModal() {
    winModal.hidden = true;
    if (lastFocusedCard && document.contains(lastFocusedCard)) {
      lastFocusedCard.focus();
    } else {
      newGameBtn.focus();
    }
  }

  function startNewGame() {
    stopTimer();
    firstCard = null;
    secondCard = null;
    lockBoard = false;
    moves = 0;
    matches = 0;
    score = 0;
    elapsedSeconds = 0;
    gameStarted = false;
    gameFinished = false;
    lastFocusedCard = null;
    buildDeck();
    renderBoard();
    updateStats();
    statusEl.textContent = "Find two matching cards.";
    winModal.hidden = true;
  }

  difficulty.addEventListener("change", startNewGame);
  newGameBtn.addEventListener("click", startNewGame);
  restartBtn.addEventListener("click", startNewGame);
  playAgainBtn.addEventListener("click", startNewGame);
  closeModalBtn.addEventListener("click", closeModal);

  winModal.addEventListener("click", (event) => {
    if (event.target.matches("[data-close-modal]")) closeModal();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !winModal.hidden) {
      closeModal();
    }
  });

  startNewGame();
})();


}
function begin(){poster.hidden=true;gm.hidden=false;if(!booted){booted=true;var s=document.createElement("style");s.textContent=LOOK;document.head.appendChild(s);boot();}else{var r=document.getElementById("newGame");if(r)r.click();}}
poster.addEventListener("click",begin);
var nb=document.getElementById("new");if(nb)nb.addEventListener("click",begin);
})();
