/* Hangman - game logic + its own look. Layout lives in style.css; page shell lives in the HTML. */
(function(){"use strict";
var gm=document.getElementById("gm"),poster=document.getElementById("poster"),booted=false;
var LOOK=".gm *{ box-sizing: border-box; }.gm{\n  \n  \n  --cyan: #16B8C4;\n  --action: #FFB84D;\n  --success: #22C55E;\n  --danger: #EF5B5B;\n  \n  \n  \n  \n  \n  --game: #111827;\n  --game-2: #1F2937;\n}.gm button,.gm input{ font: inherit; }.gm button{ cursor: pointer; }.gm .game-type{\n  color: var(--muted);\n  font-size: 14px;\n  font-weight: 700;\n}.gm .page-shell{\n  width: min(1180px, calc(100% - 32px));\n  margin: 0 auto;\n  padding: 28px 0 72px;\n}.gm h2{ line-height: 1.15; }.gm h2{ font-size: 32px; margin: 0 0 15px; font-weight: 700; }.gm .game-card{\n  background: var(--card);\n  border: 1px solid var(--border);\n  border-radius: 20px;\n  overflow: hidden;\n  box-shadow: 0 10px 35px rgba(23,27,45,.07);\n}.gm .game-topbar{\n  display: flex;\n  gap: 1px;\n  background: var(--border);\n}.gm .stat{\n  background: #fff;\n  flex: 1;\n  padding: 13px 18px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 9px;\n}.gm .stat-label{ color: var(--muted); font-size: 14px; font-weight: 700; }.gm .stat strong{ font-size: 22px; }.gm .game-layout{\n  display: grid;\n  grid-template-columns: minmax(300px, .9fr) minmax(360px, 1.1fr);\n  min-height: 500px;\n}.gm .visual-panel{\n  background: var(--game);\n  color: #fff;\n  padding: 35px;\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  align-items: center;\n}.gm .hangman-stage{ width: min(100%, 390px); }.gm #hangman-svg{ display: block; width: 100%; height: auto; }.gm .gallows{ stroke: #fff; stroke-width: 8; stroke-linecap: round; fill: none; }.gm .body-part{\n  stroke: var(--action);\n  stroke-width: 7;\n  stroke-linecap: round;\n  fill: none;\n  opacity: 0;\n  transition: opacity .2s ease;\n}.gm .body-part.visible{ opacity: 1; }.gm .mistakes{ color: #cbd5e1; font-size: 15px; margin: 6px 0 0; }.gm .play-panel{ padding: 35px clamp(24px, 4vw, 48px); display: flex; flex-direction: column; justify-content: center; }.gm .status-message{\n  min-height: 28px;\n  color: var(--muted);\n  font-weight: 700;\n  text-align: center;\n  margin-bottom: 15px;\n}.gm .status-message.success{ color: var(--success); }.gm .status-message.danger{ color: var(--danger); }.gm .word-display{\n  min-height: 64px;\n  display: flex;\n  justify-content: center;\n  align-items: end;\n  flex-wrap: wrap;\n  gap: 8px;\n  margin-bottom: 8px;\n}.gm .letter-slot{\n  width: 32px;\n  height: 44px;\n  border-bottom: 3px solid var(--brand);\n  display: flex;\n  justify-content: center;\n  align-items: flex-end;\n  font-size: 27px;\n  line-height: 1;\n  font-weight: 800;\n}.gm .category{ text-align: center; color: var(--muted); margin: 0 0 24px; font-size: 14px; font-weight: 700; }.gm .keyboard{\n  display: grid;\n  grid-template-columns: repeat(7, 1fr);\n  gap: 8px;\n  max-width: 500px;\n  width: 100%;\n  margin: 0 auto 24px;\n}.gm .key{\n  min-height: 44px;\n  border: 1px solid var(--border);\n  border-radius: 10px;\n  background: #fff;\n  color: var(--text);\n  font-weight: 800;\n  transition: transform .12s ease, background .12s ease, color .12s ease;\n}.gm .key:hover:not(:disabled){ transform: translateY(-1px); border-color: var(--brand); }.gm .key:focus-visible,.gm .btn:focus-visible,.gm summary:focus-visible{ outline: 3px solid rgba(91,92,226,.28); outline-offset: 2px; }.gm .key.correct{ background: #dcfce7; color: #15803d; border-color: #86efac; }.gm .key.wrong{ background: #fee2e2; color: #b91c1c; border-color: #fecaca; }.gm .key:disabled{ cursor: not-allowed; opacity: .8; }.gm .actions{ display: flex; gap: 10px; justify-content: center; }.gm .btn{\n  min-height: 46px;\n  border-radius: 11px;\n  padding: 0 18px;\n  border: 1px solid transparent;\n  font-weight: 800;\n}.gm .btn-primary{ background: var(--brand); color: #fff; }.gm .btn-primary:hover{ background: var(--brand-dark); }.gm .btn-secondary{ background: #fff; color: var(--text); border-color: var(--border); }.gm .btn-secondary:hover{ border-color: var(--brand); color: var(--brand); }.gm .hint-cost{ font-size: 12px; opacity: .75; margin-left: 4px; }@media (max-width: 820px){.gm .game-layout{ grid-template-columns: 1fr; }.gm .visual-panel{ padding: 22px 20px; }.gm .hangman-stage{ max-width: 320px; }.gm .play-panel{ padding: 28px 20px 30px; }}@media (max-width: 560px){.gm .page-shell{ width: min(100% - 20px, 1180px); padding-top: 20px; }.gm h2{ font-size: 27px; }.gm .game-topbar{ display: grid; grid-template-columns: repeat(3, 1fr); }.gm .stat{ padding: 10px 6px; flex-direction: column; gap: 0; }.gm .stat strong{ font-size: 20px; }.gm .stat-label{ font-size: 12px; }.gm .visual-panel{ min-height: 310px; }.gm .word-display{ gap: 5px; }.gm .letter-slot{ width: 25px; height: 38px; font-size: 23px; }.gm .keyboard{ grid-template-columns: repeat(7, 1fr); gap: 6px; }.gm .key{ min-height: 43px; border-radius: 9px; padding: 0; }.gm .actions{ flex-direction: column; }.gm .btn{ width: 100%; }}";
function __ready(f){f()}
function boot(){
(() => {
  "use strict";

  const WORDS = [
    { word: "ELEPHANT", category: "Animals" },
    { word: "BUTTERFLY", category: "Animals" },
    { word: "DOLPHIN", category: "Animals" },
    { word: "GIRAFFE", category: "Animals" },
    { word: "PENGUIN", category: "Animals" },
    { word: "KANGAROO", category: "Animals" },
    { word: "VOLCANO", category: "Nature" },
    { word: "RAINBOW", category: "Nature" },
    { word: "THUNDER", category: "Nature" },
    { word: "MOUNTAIN", category: "Nature" },
    { word: "SUNFLOWER", category: "Nature" },
    { word: "OCEAN", category: "Nature" },
    { word: "LIBRARY", category: "Places" },
    { word: "AIRPORT", category: "Places" },
    { word: "HOSPITAL", category: "Places" },
    { word: "MUSEUM", category: "Places" },
    { word: "RESTAURANT", category: "Places" },
    { word: "CASTLE", category: "Places" },
    { word: "GUITAR", category: "Objects" },
    { word: "TELESCOPE", category: "Objects" },
    { word: "UMBRELLA", category: "Objects" },
    { word: "BACKPACK", category: "Objects" },
    { word: "COMPASS", category: "Objects" },
    { word: "CAMERA", category: "Objects" }
  ];

  const MAX_MISTAKES = 6;
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  const scoreEl = document.getElementById("score");
  const roundEl = document.getElementById("round");
  const guessesEl = document.getElementById("guesses");
  const mistakesEl = document.getElementById("mistakes");
  const statusEl = document.getElementById("status");
  const wordEl = document.getElementById("word");
  const categoryEl = document.getElementById("category");
  const keyboardEl = document.getElementById("keyboard");
  const newGameBtn = document.getElementById("new-game");
  const hintBtn = document.getElementById("hint");
  const bodyParts = [...document.querySelectorAll(".body-part")];

  let currentWord = "";
  let currentCategory = "";
  let guessed = new Set();
  let mistakes = 0;
  let score = 0;
  let round = 0;
  let hintUsed = false;
  let active = false;
  let lastIndex = -1;

  function chooseWord() {
    let index;
    do {
      index = Math.floor(Math.random() * WORDS.length);
    } while (WORDS.length > 1 && index === lastIndex);
    lastIndex = index;
    return WORDS[index];
  }

  function newRound() {
    const item = chooseWord();
    currentWord = item.word;
    currentCategory = item.category;
    guessed = new Set();
    mistakes = 0;
    hintUsed = false;
    active = true;
    round += 1;

    updateStats();
    categoryEl.textContent = `Category: ${currentCategory}`;
    statusEl.textContent = "Choose a letter to begin.";
    statusEl.className = "status-message";
    hintBtn.disabled = false;
    renderWord();
    renderKeyboard();
    updateDrawing();
  }

  function updateStats() {
    scoreEl.textContent = score;
    roundEl.textContent = round;
    guessesEl.textContent = Math.max(0, MAX_MISTAKES - mistakes);
    mistakesEl.textContent = `Mistakes: ${mistakes} / ${MAX_MISTAKES}`;
  }

  function renderWord() {
    wordEl.innerHTML = "";
    [...currentWord].forEach(letter => {
      const slot = document.createElement("span");
      slot.className = "letter-slot";
      slot.textContent = guessed.has(letter) ? letter : "";
      slot.setAttribute("aria-label", guessed.has(letter) ? letter : "hidden letter");
      wordEl.appendChild(slot);
    });
  }

  function renderKeyboard() {
    keyboardEl.innerHTML = "";
    for (const letter of letters) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "key";
      button.textContent = letter;
      button.dataset.letter = letter;
      button.setAttribute("aria-label", `Guess letter ${letter}`);
      button.disabled = guessed.has(letter) || !active;
      if (guessed.has(letter)) {
        button.classList.add(currentWord.includes(letter) ? "correct" : "wrong");
      }
      button.addEventListener("click", () => guess(letter));
      keyboardEl.appendChild(button);
    }
  }

  function updateDrawing() {
    bodyParts.forEach((part, index) => {
      part.classList.toggle("visible", index < mistakes);
    });
  }

  function isSolved() {
    return [...currentWord].every(letter => guessed.has(letter));
  }

  function guess(letter) {
    if (!active || guessed.has(letter)) return;
    guessed.add(letter);

    if (currentWord.includes(letter)) {
      score += 10;
      statusEl.textContent = "Nice guess!";
      statusEl.className = "status-message success";
    } else {
      mistakes += 1;
      score = Math.max(0, score - 3);
      statusEl.textContent = "Not in the word. Try another letter.";
      statusEl.className = "status-message danger";
    }

    renderWord();
    renderKeyboard();
    updateDrawing();
    updateStats();

    if (isSolved()) finishWin();
    else if (mistakes >= MAX_MISTAKES) finishLoss();
  }

  function finishWin() {
    active = false;
    const bonus = 25;
    score += bonus;
    statusEl.textContent = `You solved it! The word was ${currentWord}. +${bonus} bonus points.`;
    statusEl.className = "status-message success";
    renderKeyboard();
    updateStats();
    hintBtn.disabled = true;
  }

  function finishLoss() {
    active = false;
    [...currentWord].forEach(letter => guessed.add(letter));
    renderWord();
    statusEl.textContent = `Round over. The word was ${currentWord}.`;
    statusEl.className = "status-message danger";
    renderKeyboard();
    hintBtn.disabled = true;
  }

  function useHint() {
    if (!active || hintUsed) return;
    const hidden = [...new Set([...currentWord].filter(letter => !guessed.has(letter)))];
    if (!hidden.length) return;

    const letter = hidden[Math.floor(Math.random() * hidden.length)];
    hintUsed = true;
    score = Math.max(0, score - 2);
    guessed.add(letter);
    statusEl.textContent = `Hint revealed the letter ${letter}.`;
    statusEl.className = "status-message";
    hintBtn.disabled = true;

    renderWord();
    renderKeyboard();
    updateStats();

    if (isSolved()) finishWin();
  }

  document.addEventListener("keydown", event => {
    if (event.ctrlKey || event.altKey || event.metaKey) return;
    const letter = event.key.toUpperCase();
    if (/^[A-Z]$/.test(letter)) {
      event.preventDefault();
      guess(letter);
    }
  });

  newGameBtn.addEventListener("click", newRound);
  hintBtn.addEventListener("click", useHint);

  newRound();
})();


}
function begin(){poster.hidden=true;gm.hidden=false;if(!booted){booted=true;var s=document.createElement("style");s.textContent=LOOK;document.head.appendChild(s);boot();}else{var r=document.getElementById("new-game");if(r)r.click();}}
poster.addEventListener("click",begin);
var nb=document.getElementById("new");if(nb)nb.addEventListener("click",begin);
})();
