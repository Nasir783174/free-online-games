/* Memory Puzzle - game logic + its own look. Layout lives in style.css; page shell lives in the HTML. */
(function(){"use strict";
var gm=document.getElementById("gm"),poster=document.getElementById("poster"),booted=false;
var LOOK=".gm{\n  --primary: #5B5CE2;\n  --primary-dark: #4546B8;\n  --secondary: #16B8C4;\n  --action: #FFB84D;\n  --success: #22C55E;\n  --danger: #EF5B5B;\n  \n  \n  \n  \n  \n  --game: #111827;\n  --game-secondary: #1F2937;\n  \n}.gm *{ box-sizing: border-box; }.gm button{ font: inherit; }.gm button:focus-visible,.gm summary:focus-visible{\n  outline: 3px solid rgba(22,184,196,.45);\n  outline-offset: 3px;\n}.gm .game-shell{ overflow: hidden; border-radius: 20px; background: var(--game); box-shadow: 0 22px 55px rgba(17,24,39,.18); }.gm .game-toolbar{ min-height: 82px; display: flex; align-items: center; justify-content: space-between; gap: 20px; padding: 16px 20px; background: var(--game-secondary); border-bottom: 1px solid rgba(255,255,255,.08); }.gm .stats{ display: flex; gap: 12px; flex-wrap: wrap; }.gm .stat{ min-width: 92px; padding: 8px 13px; border-radius: 12px; background: rgba(255,255,255,.07); color: white; }.gm .stat-label{ display: block; margin-bottom: 1px; color: #AEB8C8; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; }.gm .stat strong{ font-size: 21px; line-height: 1.1; }.gm .button{ min-height: 46px; border: 0; border-radius: 12px; padding: 0 18px; cursor: pointer; font-weight: 800; transition: transform .16s ease, background .16s ease; }.gm .button:hover{ transform: translateY(-1px); }.gm .button-light{ background: white; color: var(--text); }.gm .button-primary{ width: 100%; background: var(--primary); color: white; }.gm .button-primary:hover{ background: var(--primary-dark); }.gm .game-stage{ padding: 22px 22px 28px; }.gm .status{ min-height: 27px; margin: 0 0 16px; text-align: center; color: #D5DCE7; font-weight: 700; }.gm .memory-board{\n  width: min(680px, 100%);\n  margin-inline: auto;\n  display: grid;\n  grid-template-columns: repeat(4, 1fr);\n  gap: 13px;\n}.gm .memory-card{\n  position: relative;\n  aspect-ratio: 1 / 1;\n  border: 0;\n  padding: 0;\n  background: transparent;\n  perspective: 900px;\n  cursor: pointer;\n  border-radius: 16px;\n}.gm .memory-card:disabled{ cursor: default; }.gm .card-inner{\n  position: absolute; inset: 0;\n  border-radius: 16px;\n  transform-style: preserve-3d;\n  transition: transform .38s cubic-bezier(.2,.75,.3,1);\n}.gm .memory-card.is-flipped .card-inner,.gm .memory-card.is-matched .card-inner{ transform: rotateY(180deg); }.gm .card-face{\n  position: absolute; inset: 0;\n  display: grid; place-items: center;\n  backface-visibility: hidden;\n  border-radius: 16px;\n}.gm .card-back{\n  border: 2px solid rgba(255,255,255,.12);\n  background:\n    radial-gradient(circle at 30% 25%, rgba(255,255,255,.09) 0 7%, transparent 8%),\n    linear-gradient(145deg, #6263EA, #4A4BC2);\n  color: white;\n}.gm .card-back::after{ content: \"?\"; font-size: clamp(28px, 6vw, 48px); font-weight: 800; opacity: .82; }.gm .card-front{\n  transform: rotateY(180deg);\n  border: 2px solid rgba(255,255,255,.75);\n  background: white;\n  color: var(--symbol-color, var(--primary));\n  font-size: clamp(30px, 7vw, 56px);\n  font-weight: 800;\n  box-shadow: inset 0 0 0 5px var(--symbol-bg, #EEF0FF);\n}.gm .memory-card:hover:not(.is-flipped):not(.is-matched) .card-inner{ transform: translateY(-3px); }.gm .memory-card.is-matched .card-front{ box-shadow: inset 0 0 0 5px #DCFCE7; border-color: #86EFAC; }.gm .memory-card.is-matched{ animation: matched .36s ease; }@keyframes matched{ 50% { transform: scale(1.045); } }.gm .about-section{\n  background: var(--card); border: 1px solid var(--border); border-radius: 18px; padding: 26px; box-shadow: 0 8px 28px rgba(23,27,45,.04);\n}.gm h2{ margin: 0 0 15px; font-size: clamp(28px, 4vw, 35px); line-height: 1.18; letter-spacing: -.02em; }.gm .about-section p{ color: var(--muted); }.gm .tips-card{ background: #F0F1FF; border-color: #DADCFD; }.gm .about-section{ margin-top: 22px; }.gm .placeholder-note{ margin-bottom: 0; color: var(--muted); font-size: 14px; }.gm details{ border-top: 1px solid var(--border); padding: 15px 0; }.gm details:last-child{ padding-bottom: 0; }.gm summary{ cursor: pointer; font-weight: 800; }.gm details p{ margin-bottom: 0; color: var(--muted); }.gm .modal[hidden]{ display: none; }.gm .modal{ position: fixed; inset: 0; z-index: 50; display: grid; place-items: center; padding: 20px; }.gm .modal-backdrop{ position: absolute; inset: 0; background: rgba(17,24,39,.72); backdrop-filter: blur(4px); }.gm .modal-card{ position: relative; width: min(410px, 100%); padding: 30px; border-radius: 20px; background: white; text-align: center; box-shadow: 0 25px 70px rgba(0,0,0,.25); }.gm .win-icon{ width: 64px; height: 64px; margin: 0 auto 14px; display: grid; place-items: center; border-radius: 50%; background: #FFF7E8; color: #D98A12; font-size: 30px; }.gm .modal-card h2{ margin-bottom: 7px; }.gm .modal-card p{ margin-top: 0; color: var(--muted); }.gm .result-grid{ display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin: 22px 0; }.gm .result-grid div{ padding: 13px; border-radius: 12px; background: var(--bg); }.gm .result-grid span{ display: block; color: var(--muted); font-size: 13px; font-weight: 700; }.gm .result-grid strong{ font-size: 23px; }@media (max-width: 760px){.gm .game-toolbar{ align-items: stretch; flex-direction: column; }.gm .stats{ display: grid; grid-template-columns: repeat(3, 1fr); }.gm .stat{ min-width: 0; text-align: center; padding-inline: 7px; }.gm .button-light{ width: 100%; }.gm .game-stage{ padding: 16px 12px 20px; }.gm .memory-board{ gap: 8px; }.gm .card-inner,.gm .card-face,.gm .memory-card{ border-radius: 12px; }.gm .about-section{ padding: 21px; }}@media (max-width: 390px){.gm .game-stage{ padding-inline: 8px; }.gm .memory-board{ gap: 6px; }.gm .stat strong{ font-size: 19px; }}@media (prefers-reduced-motion: reduce){.gm *,.gm *::before,.gm *::after{ scroll-behavior: auto !important; transition-duration: .01ms !important; animation-duration: .01ms !important; animation-iteration-count: 1 !important; }}";
function __ready(f){f()}
function boot(){
(() => {
  "use strict";

  const symbols = [
    { icon: "★", color: "#5B5CE2", bg: "#EEF0FF", name: "star" },
    { icon: "♥", color: "#EF5B5B", bg: "#FFF0F0", name: "heart" },
    { icon: "●", color: "#16B8C4", bg: "#EAFBFC", name: "circle" },
    { icon: "◆", color: "#D98A12", bg: "#FFF7E8", name: "diamond" },
    { icon: "▲", color: "#22C55E", bg: "#ECFDF3", name: "triangle" },
    { icon: "✿", color: "#B14FD1", bg: "#FAF0FF", name: "flower" },
    { icon: "☀", color: "#E59B18", bg: "#FFF8DD", name: "sun" },
    { icon: "✦", color: "#3D7AE8", bg: "#EDF4FF", name: "spark" }
  ];

  const board = document.getElementById("gameBoard");
  const movesEl = document.getElementById("moves");
  const pairsEl = document.getElementById("pairs");
  const timerEl = document.getElementById("timer");
  const statusEl = document.getElementById("gameStatus");
  const restartBtn = document.getElementById("restartBtn");
  const winModal = document.getElementById("winModal");
  const playAgainBtn = document.getElementById("playAgainBtn");
  const finalMoves = document.getElementById("finalMoves");
  const finalTime = document.getElementById("finalTime");

  let firstCard = null;
  let secondCard = null;
  let lockBoard = false;
  let moves = 0;
  let matchedPairs = 0;
  let seconds = 0;
  let timerId = null;
  let started = false;
  let flipBackTimeout = null;

  function shuffle(items) {
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function formatTime(totalSeconds) {
    const mins = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
    const secs = (totalSeconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  }

  function startTimer() {
    if (started) return;
    started = true;
    timerId = window.setInterval(() => {
      seconds += 1;
      timerEl.textContent = formatTime(seconds);
    }, 1000);
  }

  function stopTimer() {
    if (timerId !== null) {
      clearInterval(timerId);
      timerId = null;
    }
  }

  function createCard(item, index) {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "memory-card";
    card.dataset.pair = item.name;
    card.setAttribute("aria-label", `Hidden memory card ${index + 1}`);

    card.innerHTML = `
      <span class="card-inner">
        <span class="card-face card-back" aria-hidden="true"></span>
        <span class="card-face card-front" style="--symbol-color:${item.color};--symbol-bg:${item.bg}" aria-hidden="true">${item.icon}</span>
      </span>
    `;

    card.addEventListener("click", () => handleCard(card, item));
    return card;
  }

  function handleCard(card, item) {
    if (lockBoard || card === firstCard || card.classList.contains("is-matched")) return;

    startTimer();
    card.classList.add("is-flipped");
    card.setAttribute("aria-label", `${item.name} card revealed`);

    if (!firstCard) {
      firstCard = card;
      statusEl.textContent = "Now choose a second card.";
      return;
    }

    secondCard = card;
    moves += 1;
    movesEl.textContent = moves;

    if (firstCard.dataset.pair === secondCard.dataset.pair) {
      matchCards();
    } else {
      hideCards();
    }
  }

  function matchCards() {
    firstCard.classList.add("is-matched");
    secondCard.classList.add("is-matched");
    firstCard.disabled = true;
    secondCard.disabled = true;
    matchedPairs += 1;
    pairsEl.textContent = matchedPairs;
    statusEl.textContent = matchedPairs === symbols.length ? "All pairs matched!" : "Match found! Keep going.";
    resetTurn();

    if (matchedPairs === symbols.length) {
      stopTimer();
      window.setTimeout(showWin, 450);
    }
  }

  function hideCards() {
    lockBoard = true;
    statusEl.textContent = "Not a match. Remember those cards.";
    flipBackTimeout = window.setTimeout(() => {
      [firstCard, secondCard].forEach((card) => {
        if (!card) return;
        card.classList.remove("is-flipped");
        const position = [...board.children].indexOf(card) + 1;
        card.setAttribute("aria-label", `Hidden memory card ${position}`);
      });
      resetTurn();
      lockBoard = false;
      statusEl.textContent = "Choose another card.";
      flipBackTimeout = null;
    }, 800);
  }

  function resetTurn() {
    firstCard = null;
    secondCard = null;
  }

  function showWin() {
    finalMoves.textContent = moves;
    finalTime.textContent = formatTime(seconds);
    winModal.hidden = false;
    playAgainBtn.focus();
  }

  function closeWin() {
    winModal.hidden = true;
  }

  function newGame() {
    stopTimer();
    if (flipBackTimeout !== null) {
      clearTimeout(flipBackTimeout);
      flipBackTimeout = null;
    }

    firstCard = null;
    secondCard = null;
    lockBoard = false;
    moves = 0;
    matchedPairs = 0;
    seconds = 0;
    started = false;

    movesEl.textContent = "0";
    pairsEl.textContent = "0";
    timerEl.textContent = "00:00";
    statusEl.textContent = "Choose any card to begin.";
    closeWin();

    const deck = shuffle([...symbols, ...symbols]);
    board.replaceChildren(...deck.map(createCard));
  }

  restartBtn.addEventListener("click", newGame);
  playAgainBtn.addEventListener("click", newGame);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !winModal.hidden) {
      closeWin();
      restartBtn.focus();
    }
  });

  newGame();
})();


}
function begin(){poster.hidden=true;gm.hidden=false;if(!booted){booted=true;var s=document.createElement("style");s.textContent=LOOK;document.head.appendChild(s);boot();}else{var r=document.getElementById("restartBtn");if(r)r.click();}}
poster.addEventListener("click",begin);
var nb=document.getElementById("new");if(nb)nb.addEventListener("click",begin);
})();
