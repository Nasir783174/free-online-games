/* Anagram - game logic + its own look. Layout lives in style.css; page shell lives in the HTML. */
(function(){"use strict";
var gm=document.getElementById("gm"),poster=document.getElementById("poster"),booted=false;
var LOOK=".gm{\n  --primary: #5B5CE2;\n  --primary-dark: #4546B8;\n  --secondary: #16B8C4;\n  --action: #FFB84D;\n  --success: #22C55E;\n  --danger: #EF5B5B;\n  \n  \n  \n  \n  \n  --game-bg: #111827;\n  --game-secondary: #1F2937;\n  \n}.gm *{ box-sizing: border-box; }.gm button,.gm input{ font: inherit; }.gm button{ -webkit-tap-highlight-color: transparent; }.gm .page-shell{\n  width: min(1120px, calc(100% - 40px));\n  margin: 0 auto;\n  padding: 30px 0 72px;\n}.gm h2{\n  letter-spacing: -0.035em;\n  line-height: 1.12;\n  margin-top: 0;\n}.gm h2{\n  font-size: clamp(27px, 4vw, 34px);\n  margin-bottom: 14px;\n}.gm .game-card{\n  background: var(--card);\n  border: 1px solid var(--border);\n  border-radius: 20px;\n  overflow: hidden;\n  box-shadow: var(--shadow);\n  margin-bottom: 64px;\n}.gm .game-topbar{\n  display: grid;\n  grid-template-columns: 1fr auto 1fr;\n  align-items: center;\n  gap: 18px;\n  padding: 18px 24px;\n  background: var(--game-bg);\n  color: #fff;\n}.gm .stat{\n  display: flex;\n  align-items: baseline;\n  gap: 9px;\n}.gm .stat-right{ justify-content: flex-end; }.gm .stat-label{\n  color: #AAB2C5;\n  font-size: 13px;\n  font-weight: 700;\n  text-transform: uppercase;\n  letter-spacing: .08em;\n}.gm .stat strong{ font-size: 24px; line-height: 1; }.gm .round-status{\n  color: #D8DCEA;\n  font-size: 14px;\n  font-weight: 700;\n  text-align: center;\n}.gm .game-area{\n  max-width: 780px;\n  margin: 0 auto;\n  padding: 42px 28px 34px;\n}.gm .game-intro{ text-align: center; }.gm .category-pill{\n  display: inline-flex;\n  align-items: center;\n  padding: 5px 11px;\n  border-radius: 999px;\n  background: #EEF0FF;\n  color: var(--primary-dark);\n  font-size: 13px;\n  font-weight: 800;\n}.gm .game-intro h2{ margin: 15px 0 4px; font-size: 30px; }.gm .instruction{\n  color: var(--muted);\n  margin: 0 0 30px;\n}.gm .letters{\n  display: flex;\n  flex-wrap: wrap;\n  justify-content: center;\n  gap: 10px;\n  min-height: 68px;\n  margin-bottom: 28px;\n}.gm .letter-btn{\n  width: 58px;\n  height: 58px;\n  border: 1px solid #D7DAE7;\n  border-bottom-width: 3px;\n  border-radius: 13px;\n  background: #fff;\n  color: var(--text);\n  font-size: 25px;\n  font-weight: 800;\n  cursor: pointer;\n  transition: transform .14s ease, border-color .14s ease, background .14s ease, color .14s ease;\n}.gm .letter-btn:hover:not(:disabled){\n  transform: translateY(-2px);\n  border-color: var(--primary);\n}.gm .letter-btn:focus-visible,.gm .btn:focus-visible,.gm .answer-box:focus-visible,.gm details summary:focus-visible{\n  outline: 3px solid rgba(91, 92, 226, .25);\n  outline-offset: 2px;\n}.gm .letter-btn.selected{\n  background: #ECECFF;\n  border-color: var(--primary);\n  color: var(--primary-dark);\n}.gm .letter-btn:disabled{\n  opacity: .4;\n  cursor: default;\n}.gm .answer-area{ margin-bottom: 16px; }.gm .answer-label-row{\n  display: flex;\n  justify-content: space-between;\n  margin-bottom: 8px;\n  color: var(--muted);\n  font-size: 14px;\n  font-weight: 700;\n}.gm .answer-box{\n  min-height: 76px;\n  border: 2px dashed #D8DBE8;\n  border-radius: 15px;\n  padding: 10px;\n  display: flex;\n  flex-wrap: wrap;\n  align-items: center;\n  justify-content: center;\n  gap: 7px;\n  background: #FAFAFC;\n}.gm .answer-placeholder{\n  color: #98A0B4;\n  font-size: 15px;\n  text-align: center;\n}.gm .answer-letter{\n  width: 43px;\n  height: 50px;\n  display: grid;\n  place-items: center;\n  background: var(--game-bg);\n  color: #fff;\n  border-radius: 9px;\n  font-size: 21px;\n  font-weight: 800;\n  cursor: pointer;\n  border: 0;\n}.gm .feedback{\n  min-height: 28px;\n  margin: 10px 0 4px;\n  text-align: center;\n  font-size: 15px;\n  font-weight: 800;\n}.gm .feedback.success{ color: #16853D; }.gm .feedback.error{ color: #C73D3D; }.gm .feedback.info{ color: var(--primary-dark); }.gm .controls{\n  display: grid;\n  grid-template-columns: 1fr 1fr 1.5fr;\n  gap: 10px;\n  margin-top: 10px;\n}.gm .btn{\n  min-height: 48px;\n  padding: 10px 17px;\n  border: 0;\n  border-radius: 12px;\n  font-size: 16px;\n  font-weight: 800;\n  cursor: pointer;\n  transition: transform .14s ease, background .14s ease, opacity .14s ease;\n}.gm .btn:hover:not(:disabled){ transform: translateY(-1px); }.gm .btn:active:not(:disabled){ transform: translateY(0); }.gm .btn-secondary{\n  color: var(--text);\n  background: #EFF0F5;\n}.gm .btn-secondary:hover:not(:disabled){ background: #E6E8F0; }.gm .btn-primary{\n  color: #fff;\n  background: var(--primary);\n}.gm .btn-primary:hover:not(:disabled){ background: var(--primary-dark); }.gm .btn:disabled{\n  opacity: .5;\n  cursor: not-allowed;\n}.gm #hintCost{\n  color: #7A5B19;\n  font-size: 13px;\n  margin-left: 3px;\n}.gm .keyboard-help{\n  display: flex;\n  justify-content: center;\n  flex-wrap: wrap;\n  gap: 18px;\n  margin-top: 22px;\n  color: var(--muted);\n  font-size: 13px;\n}.gm kbd{\n  padding: 2px 7px;\n  border: 1px solid #D5D8E3;\n  border-bottom-width: 2px;\n  border-radius: 5px;\n  background: #fff;\n  color: var(--text);\n  font-size: 12px;\n  font-weight: 800;\n}.gm .feature-list{\n  margin: 18px 0 0;\n  padding-left: 22px;\n}.gm .feature-list li{ margin-bottom: 8px; }.gm .score-rules{\n  display: grid;\n  gap: 9px;\n  margin-top: 18px;\n}.gm .score-rules div{\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  padding: 10px 13px;\n  border-radius: 10px;\n  background: #F7F7FA;\n}.gm .score-rules span{ color: var(--muted); }.gm .wide{ margin-bottom: 24px; }.gm details{\n  border-top: 1px solid var(--border);\n  padding: 16px 0;\n}.gm details:last-child{ padding-bottom: 0; }.gm summary{\n  cursor: pointer;\n  font-weight: 800;\n  list-style-position: inside;\n}.gm details p{\n  color: var(--muted);\n  margin: 10px 0 0 24px;\n}@media (max-width: 720px){.gm .page-shell{ width: min(100% - 28px, 1120px); }.gm .page-shell{ padding-top: 22px; }.gm .game-card{ border-radius: 16px; margin-bottom: 42px; }.gm .game-topbar{ padding: 15px 16px; gap: 8px; }.gm .stat strong{ font-size: 21px; }.gm .stat-label{ font-size: 11px; }.gm .round-status{ font-size: 12px; }.gm .game-area{ padding: 32px 16px 26px; }.gm .game-intro h2{ font-size: 26px; }.gm .letters{ gap: 8px; }.gm .letter-btn{\n    width: 52px;\n    height: 52px;\n    font-size: 22px;\n  }.gm .answer-box{ min-height: 70px; }.gm .answer-letter{\n    width: 38px;\n    height: 46px;\n    font-size: 19px;\n  }.gm .controls{ grid-template-columns: 1fr 1fr; }.gm .btn-primary{ grid-column: 1 / -1; }.gm .keyboard-help{ display: none; }}@media (max-width: 420px){.gm .game-topbar{ grid-template-columns: 1fr auto 1fr; }.gm .stat{ gap: 5px; }.gm .stat-right{ justify-content: flex-end; }.gm .letter-btn{ width: 46px; height: 46px; }.gm .controls{ gap: 8px; }}";
function __ready(f){f()}
function boot(){
(() => {
  "use strict";

  const WORDS = [
    { word: "APPLE", category: "Food" },
    { word: "BREAD", category: "Food" },
    { word: "CHEESE", category: "Food" },
    { word: "BANANA", category: "Food" },
    { word: "CARROT", category: "Food" },
    { word: "ORANGE", category: "Food" },
    { word: "TOMATO", category: "Food" },
    { word: "POTATO", category: "Food" },
    { word: "GUITAR", category: "Music" },
    { word: "PIANO", category: "Music" },
    { word: "DRUMS", category: "Music" },
    { word: "MELODY", category: "Music" },
    { word: "RHYTHM", category: "Music" },
    { word: "SINGER", category: "Music" },
    { word: "TIGER", category: "Animals" },
    { word: "HORSE", category: "Animals" },
    { word: "MONKEY", category: "Animals" },
    { word: "RABBIT", category: "Animals" },
    { word: "DOLPHIN", category: "Animals" },
    { word: "PARROT", category: "Animals" },
    { word: "CASTLE", category: "Places" },
    { word: "GARDEN", category: "Places" },
    { word: "FOREST", category: "Places" },
    { word: "ISLAND", category: "Places" },
    { word: "BRIDGE", category: "Places" },
    { word: "SCHOOL", category: "Places" },
    { word: "PLANET", category: "Science" },
    { word: "ROCKET", category: "Science" },
    { word: "ENERGY", category: "Science" },
    { word: "OCEAN", category: "Science" },
    { word: "VOLCANO", category: "Science" },
    { word: "GALAXY", category: "Science" },
    { word: "SUMMER", category: "Nature" },
    { word: "WINTER", category: "Nature" },
    { word: "FLOWER", category: "Nature" },
    { word: "THUNDER", category: "Nature" },
    { word: "RAINBOW", category: "Nature" },
    { word: "SUNSET", category: "Nature" },
    { word: "CAMERA", category: "Objects" },
    { word: "BOTTLE", category: "Objects" },
    { word: "WINDOW", category: "Objects" },
    { word: "PENCIL", category: "Objects" },
    { word: "JACKET", category: "Objects" },
    { word: "LANTERN", category: "Objects" }
  ];

  const TOTAL_ROUNDS = 10;
  const HINT_COST = 2;
  const ROUND_TIME = 30;

  const els = {
    score: document.getElementById("score"),
    bestScore: document.getElementById("bestScore"),
    roundStatus: document.getElementById("roundStatus"),
    category: document.getElementById("category"),
    letters: document.getElementById("letters"),
    answerBox: document.getElementById("answerBox"),
    answerCount: document.getElementById("answerCount"),
    feedback: document.getElementById("feedback"),
    clearBtn: document.getElementById("clearBtn"),
    hintBtn: document.getElementById("hintBtn"),
    submitBtn: document.getElementById("submitBtn"),
    hintCost: document.getElementById("hintCost")
  };

  let score = 0;
  let bestScore = Number(localStorage.getItem("anagramBestScore") || 0);
  let round = 1;
  let streak = 0;
  let current = null;
  let selected = [];
  let hintedPositions = new Set();
  let solved = false;
  let gameOver = false;
  let roundStartedAt = 0;
  let timerId = null;
  let recentWords = [];

  els.bestScore.textContent = bestScore;

  function shuffle(items) {
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function makePuzzle(word) {
    let letters = word.split("");
    for (let attempt = 0; attempt < 20; attempt += 1) {
      letters = shuffle(letters);
      if (letters.join("") !== word) break;
    }
    return letters;
  }

  function chooseWord() {
    const available = WORDS.filter(item => !recentWords.includes(item.word));
    const pool = available.length ? available : WORDS;
    const chosen = pool[Math.floor(Math.random() * pool.length)];
    recentWords.push(chosen.word);
    if (recentWords.length > 8) recentWords.shift();
    return chosen;
  }

  function startGame() {
    score = 0;
    round = 1;
    streak = 0;
    gameOver = false;
    recentWords = [];
    updateScore();
    loadRound();
  }

  function loadRound() {
    if (round > TOTAL_ROUNDS) {
      endGame();
      return;
    }

    current = chooseWord();
    selected = [];
    hintedPositions = new Set();
    solved = false;
    roundStartedAt = Date.now();

    els.category.textContent = current.category;
    els.roundStatus.textContent = `Round ${round} of ${TOTAL_ROUNDS}`;
    els.feedback.textContent = "";
    els.feedback.className = "feedback";
    els.hintBtn.disabled = false;
    els.submitBtn.disabled = false;
    els.clearBtn.disabled = false;
    renderLetters(makePuzzle(current.word));
    renderAnswer();
    startTimer();
  }

  function startTimer() {
    clearInterval(timerId);
    timerId = setInterval(() => {
      if (solved || gameOver) return;
      const elapsed = (Date.now() - roundStartedAt) / 1000;
      if (elapsed >= ROUND_TIME) {
        clearInterval(timerId);
        streak = 0;
        showFeedback(`Time's up. The answer was ${current.word}.`, "error");
        solved = true;
        lockRound();
        setTimeout(() => {
          round += 1;
          loadRound();
        }, 1100);
      }
    }, 250);
  }

  function renderLetters(scrambled) {
    els.letters.innerHTML = "";
    scrambled.forEach((letter, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "letter-btn";
      button.textContent = letter;
      button.dataset.index = String(index);
      button.setAttribute("aria-label", `Letter ${letter}`);
      button.addEventListener("click", () => selectLetter(index, letter));
      els.letters.appendChild(button);
    });
  }

  function selectLetter(index, letter) {
    if (solved || gameOver) return;

    const existing = selected.findIndex(item => item.index === index);
    if (existing !== -1) {
      selected.splice(existing, 1);
    } else {
      selected.push({ index, letter });
    }

    syncLetterButtons();
    renderAnswer();
    clearFeedback();
  }

  function syncLetterButtons() {
    const selectedIndexes = new Set(selected.map(item => item.index));
    document.querySelectorAll(".letter-btn").forEach(button => {
      const index = Number(button.dataset.index);
      button.classList.toggle("selected", selectedIndexes.has(index));
      button.disabled = selectedIndexes.has(index);
    });
  }

  function renderAnswer() {
    els.answerBox.innerHTML = "";

    if (!selected.length) {
      const placeholder = document.createElement("span");
      placeholder.className = "answer-placeholder";
      placeholder.textContent = "Tap letters above to build your word";
      els.answerBox.appendChild(placeholder);
    } else {
      selected.forEach((item, position) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "answer-letter";
        button.textContent = item.letter;
        button.title = "Remove this letter";
        button.setAttribute("aria-label", `Remove letter ${item.letter}`);
        button.addEventListener("click", () => {
          selected.splice(position, 1);
          syncLetterButtons();
          renderAnswer();
        });
        els.answerBox.appendChild(button);
      });
    }

    els.answerCount.textContent = `${selected.length} ${selected.length === 1 ? "letter" : "letters"}`;
  }

  function clearAnswer() {
    if (solved || gameOver) return;
    selected = [];
    syncLetterButtons();
    renderAnswer();
    clearFeedback();
  }

  function submitAnswer() {
    if (solved || gameOver) return;

    const answer = selected.map(item => item.letter).join("");
    if (answer.length !== current.word.length) {
      showFeedback("Use every letter before checking your answer.", "info");
      return;
    }

    if (answer === current.word) {
      handleCorrect();
    } else {
      streak = 0;
      showFeedback("Not quite. Rearrange the letters and try again.", "error");
    }
  }

  function handleCorrect() {
    solved = true;
    clearInterval(timerId);

    const elapsed = (Date.now() - roundStartedAt) / 1000;
    const speedBonus = Math.max(0, Math.floor((ROUND_TIME - elapsed) / 3));
    const base = current.word.length * 10;
    const streakBonus = streak * 5;
    const hintPenalty = hintedPositions.size * HINT_COST;
    const gained = Math.max(1, base + speedBonus + streakBonus - hintPenalty);

    score += gained;
    streak += 1;
    updateScore();

    const streakText = streak > 1 ? ` ${streak}-word streak!` : "";
    showFeedback(`Correct! +${gained} points.${streakText}`, "success");
    lockRound();

    setTimeout(() => {
      round += 1;
      loadRound();
    }, 1100);
  }

  function giveHint() {
    if (solved || gameOver) return;

    const target = current.word;
    let position = -1;

    for (let i = 0; i < target.length; i += 1) {
      if (!hintedPositions.has(i)) {
        position = i;
        break;
      }
    }

    if (position === -1) {
      showFeedback("No more hints are available for this word.", "info");
      return;
    }

    hintedPositions.add(position);

    // Move the correct letter into the next answer position.
    const letter = target[position];
    const buttonNodes = [...document.querySelectorAll(".letter-btn")];
    const selectedIndexes = new Set(selected.map(item => item.index));
    let sourceIndex = -1;

    for (const node of buttonNodes) {
      const index = Number(node.dataset.index);
      if (!selectedIndexes.has(index) && node.textContent === letter) {
        sourceIndex = index;
        break;
      }
    }

    if (sourceIndex !== -1) {
      const sourceButton = buttonNodes.find(node => Number(node.dataset.index) === sourceIndex);
      selected.push({ index: sourceIndex, letter });
      sourceButton.classList.add("selected");
      sourceButton.disabled = true;
      renderAnswer();
      showFeedback(`Hint: position ${position + 1} is ${letter}.`, "info");
    } else {
      hintedPositions.delete(position);
      showFeedback("Try another move to reveal the hint.", "info");
    }

    if (hintedPositions.size >= current.word.length) {
      els.hintBtn.disabled = true;
    }
  }

  function lockRound() {
    els.hintBtn.disabled = true;
    els.submitBtn.disabled = true;
    els.clearBtn.disabled = true;
    document.querySelectorAll(".letter-btn").forEach(button => {
      button.disabled = true;
    });
  }

  function showFeedback(message, type) {
    els.feedback.textContent = message;
    els.feedback.className = `feedback ${type}`;
  }

  function clearFeedback() {
    if (!solved) {
      els.feedback.textContent = "";
      els.feedback.className = "feedback";
    }
  }

  function updateScore() {
    els.score.textContent = score;
    els.bestScore.textContent = bestScore;
  }

  function endGame() {
    gameOver = true;
    clearInterval(timerId);

    if (score > bestScore) {
      bestScore = score;
      localStorage.setItem("anagramBestScore", String(bestScore));
    }

    updateScore();
    els.roundStatus.textContent = "Game complete";
    els.category.textContent = "Well played";
    els.letters.innerHTML = "";
    els.answerBox.innerHTML = `<span class="answer-placeholder">Final score: ${score}</span>`;
    els.answerCount.textContent = "";
    showFeedback(`You finished all ${TOTAL_ROUNDS} rounds with ${score} points.`, "success");

    els.clearBtn.textContent = "New Game";
    els.clearBtn.disabled = false;
    els.clearBtn.onclick = startGame;
    els.hintBtn.disabled = true;
    els.submitBtn.disabled = true;
  }

  function handleKeydown(event) {
    if (gameOver) {
      if (event.key === "Enter") startGame();
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      submitAnswer();
      return;
    }

    if (event.key === "Backspace") {
      event.preventDefault();
      if (!solved && selected.length) {
        selected.pop();
        syncLetterButtons();
        renderAnswer();
      }
      return;
    }

    if (event.key.toLowerCase() === "h") {
      event.preventDefault();
      giveHint();
      return;
    }

    if (/^[a-zA-Z]$/.test(event.key) && !solved) {
      const target = event.key.toUpperCase();
      const nodes = [...document.querySelectorAll(".letter-btn")];
      const used = new Set(selected.map(item => item.index));
      const candidate = nodes.find(node => !used.has(Number(node.dataset.index)) && node.textContent === target);

      if (candidate) {
        selectLetter(Number(candidate.dataset.index), target);
      }
    }
  }

  els.clearBtn.addEventListener("click", clearAnswer);
  els.hintBtn.addEventListener("click", giveHint);
  els.submitBtn.addEventListener("click", submitAnswer);
  document.addEventListener("keydown", handleKeydown);

  startGame();
})();


}
function begin(){poster.hidden=true;gm.hidden=false;if(!booted){booted=true;var s=document.createElement("style");s.textContent=LOOK;document.head.appendChild(s);boot();}else{var r=document.getElementById("");if(r)r.click();}}
poster.addEventListener("click",begin);
var nb=document.getElementById("new");if(nb)nb.addEventListener("click",begin);
})();
