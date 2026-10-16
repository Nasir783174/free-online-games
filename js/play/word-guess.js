/* Word Guess - game logic + its own look. Layout lives in style.css; page shell lives in the HTML. */
(function(){"use strict";
var gm=document.getElementById("gm"),poster=document.getElementById("poster"),booted=false;
var LOOK=".gm *{ box-sizing: border-box; }.gm{\n  --primary: #5B5CE2;\n  --primary-dark: #4546B8;\n  --accent: #16B8C4;\n  --success: #22C55E;\n  --danger: #EF5B5B;\n  \n  \n  \n  \n  \n  --game-bg: #111827;\n  --game-secondary: #1F2937;\n  --tile-border: #697386;\n  --yellow: #D8A900;\n}.gm button,.gm input{ font: inherit; }.gm .page{\n  width: min(100% - 32px, 1120px);\n  margin: 0 auto;\n  padding: 34px 0 72px;\n}.gm h2,.gm h3{ line-height: 1.15; }.gm .game-card{\n  background: var(--game-bg);\n  border-radius: 20px;\n  padding: clamp(18px, 4vw, 30px);\n  color: #fff;\n  box-shadow: 0 14px 38px rgba(17, 24, 39, .14);\n}.gm .game-topbar{\n  max-width: 540px;\n  margin: 0 auto 22px;\n  display: grid;\n  grid-template-columns: 80px 1fr 80px;\n  gap: 10px;\n  align-items: center;\n}.gm .stat-label{\n  display: block;\n  color: #9CA3AF;\n  font-size: 12px;\n  font-weight: 700;\n  text-transform: uppercase;\n  letter-spacing: .08em;\n}.gm .game-topbar strong{ font-size: 21px; font-weight: 800; }.gm .status{ text-align: center; font-size: 15px; font-weight: 700; color: #D1D5DB; }.gm .score-box{ text-align: right; }.gm .board{\n  width: min(100%, 350px);\n  margin: 0 auto;\n  display: grid;\n  grid-template-columns: repeat(5, 1fr);\n  gap: 7px;\n}.gm .tile{\n  aspect-ratio: 1;\n  border: 2px solid var(--tile-border);\n  border-radius: 7px;\n  display: grid;\n  place-items: center;\n  font-size: clamp(22px, 6vw, 30px);\n  font-weight: 800;\n  text-transform: uppercase;\n  background: #151E2D;\n  transition: transform .12s ease, background .15s ease, border-color .15s ease;\n}.gm .tile.filled{ border-color: #9CA3AF; }.gm .tile.correct{ background: var(--success); border-color: var(--success); }.gm .tile.present{ background: var(--yellow); border-color: var(--yellow); }.gm .tile.absent{ background: #4B5563; border-color: #4B5563; }.gm .keyboard{\n  width: min(100%, 570px);\n  margin: 28px auto 0;\n  display: grid;\n  gap: 7px;\n}.gm .key-row{ display: flex; gap: 6px; justify-content: center; }.gm .key{\n  min-width: 36px;\n  height: 48px;\n  padding: 0 9px;\n  border: 0;\n  border-radius: 7px;\n  background: #374151;\n  color: #fff;\n  font-size: 14px;\n  font-weight: 800;\n  cursor: pointer;\n  touch-action: manipulation;\n}.gm .key.wide{ min-width: 64px; font-size: 12px; }.gm .key:hover{ background: #4B5563; }.gm .key:focus-visible,.gm .primary-btn:focus-visible{ outline: 3px solid #fff; outline-offset: 2px; }.gm .key.correct{ background: var(--success); }.gm .key.present{ background: var(--yellow); }.gm .key.absent{ background: #1F2937; color: #9CA3AF; }.gm .controls{ display: flex; justify-content: center; margin-top: 22px; }.gm .primary-btn{\n  border: 0;\n  min-height: 48px;\n  padding: 0 24px;\n  border-radius: 12px;\n  background: var(--primary);\n  color: #fff;\n  font-weight: 800;\n  cursor: pointer;\n}.gm .primary-btn:hover{ background: var(--primary-dark); }@media (max-width: 600px){.gm .page{ width: min(100% - 20px, 1120px); padding-top: 24px; }.gm .game-card{ padding: 16px 10px 20px; border-radius: 16px; }.gm .game-topbar{ grid-template-columns: 65px 1fr 65px; }.gm .board{ gap: 5px; width: min(100%, 330px); }.gm .tile{ border-radius: 6px; }.gm .keyboard{ gap: 5px; margin-top: 22px; }.gm .key-row{ gap: 4px; }.gm .key{ min-width: 0; flex: 1; height: 46px; padding: 0 3px; }.gm .key.wide{ flex: 1.45; min-width: 0; }}";
function __ready(f){f()}
function boot(){
(() => {
  "use strict";

  // A compact built-in word list keeps the game fully static and offline-friendly.
  const WORDS = [
    "apple","beach","brain","bread","chair","charm","chess","cloud","crown","dance",
    "dream","earth","flame","flock","fruit","ghost","giant","glass","grape","green",
    "heart","house","human","jelly","knife","light","magic","metal","money","mouse",
    "music","ocean","paper","party","peace","phone","plant","plane","point","pride",
    "queen","quick","radio","river","robot","round","scale","score","sheep","shine",
    "shirt","short","smile","snake","sound","space","spice","sport","storm","table",
    "tiger","toast","today","tower","train","treat","truck","under","video","water",
    "whale","wheel","world","write","young"
  ];

  const VALID_GUESSES = new Set(WORDS);
  const MAX_ROWS = 6;
  const WORD_LENGTH = 5;

  const board = document.getElementById("board");
  const keyboard = document.getElementById("keyboard");
  const status = document.getElementById("status");
  const scoreEl = document.getElementById("score");
  const roundEl = document.getElementById("roundText");
  const newGameBtn = document.getElementById("newGameBtn");

  const keyRows = [
    ["Q","W","E","R","T","Y","U","I","O","P"],
    ["A","S","D","F","G","H","J","K","L"],
    ["ENTER","Z","X","C","V","B","N","M","BACK"]
  ];

  let target = "";
  let guesses = [];
  let current = "";
  let gameOver = false;
  let score = 0;
  let round = 1;
  let keyStates = {};

  function chooseWord() {
    return WORDS[Math.floor(Math.random() * WORDS.length)];
  }

  function buildBoard() {
    board.innerHTML = "";
    for (let i = 0; i < MAX_ROWS * WORD_LENGTH; i++) {
      const tile = document.createElement("div");
      tile.className = "tile";
      tile.setAttribute("aria-hidden", "true");
      board.appendChild(tile);
    }
  }

  function buildKeyboard() {
    keyboard.innerHTML = "";
    keyRows.forEach(row => {
      const rowEl = document.createElement("div");
      rowEl.className = "key-row";
      row.forEach(label => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "key" + (label === "ENTER" || label === "BACK" ? " wide" : "");
        btn.textContent = label === "BACK" ? "⌫" : label;
        btn.setAttribute("aria-label", label === "BACK" ? "Backspace" : label === "ENTER" ? "Enter guess" : `Letter ${label}`);
        btn.dataset.key = label;
        btn.addEventListener("click", () => handleKey(label));
        rowEl.appendChild(btn);
      });
      keyboard.appendChild(rowEl);
    });
  }

  function render() {
    const tiles = [...board.children];
    tiles.forEach((tile, i) => {
      const row = Math.floor(i / WORD_LENGTH);
      const col = i % WORD_LENGTH;
      tile.textContent = "";
      tile.className = "tile";

      if (guesses[row]) {
        tile.textContent = guesses[row][col];
        tile.classList.add(guesses[row].result[col]);
      } else if (row === guesses.length && current[col]) {
        tile.textContent = current[col];
        tile.classList.add("filled");
      }
    });

    [...keyboard.querySelectorAll(".key")].forEach(btn => {
      const state = keyStates[btn.dataset.key];
      btn.classList.remove("correct", "present", "absent");
      if (state) btn.classList.add(state);
    });

    scoreEl.textContent = score;
    roundEl.textContent = round;
  }

  function evaluateGuess(guess) {
    const result = Array(WORD_LENGTH).fill("absent");
    const remaining = target.split("");

    for (let i = 0; i < WORD_LENGTH; i++) {
      if (guess[i] === target[i]) {
        result[i] = "correct";
        remaining[i] = null;
      }
    }

    for (let i = 0; i < WORD_LENGTH; i++) {
      if (result[i] !== "absent") continue;
      const index = remaining.indexOf(guess[i]);
      if (index !== -1) {
        result[i] = "present";
        remaining[index] = null;
      }
    }
    return result;
  }

  function updateKeyStates(guess, result) {
    const priority = { absent: 1, present: 2, correct: 3 };
    for (let i = 0; i < WORD_LENGTH; i++) {
      const key = guess[i].toUpperCase();
      const next = result[i];
      if (!keyStates[key] || priority[next] > priority[keyStates[key]]) {
        keyStates[key] = next;
      }
    }
  }

  function submitGuess() {
    if (gameOver) return;

    if (current.length !== WORD_LENGTH) {
      status.textContent = "Enter a five-letter word";
      return;
    }

    if (!VALID_GUESSES.has(current)) {
      status.textContent = "That word is not in the game list";
      return;
    }

    const result = evaluateGuess(current);
    const solved = current === target;
    guesses.push({ word: current, result });
    updateKeyStates(current, result);
    current = "";

    if (solved) {
      const points = [100, 80, 60, 45, 30, 20][guesses.length - 1];
      score += points;
      gameOver = true;
      status.textContent = `You found it! +${points} points`;
    } else if (guesses.length >= MAX_ROWS) {
      gameOver = true;
      status.textContent = `The word was ${target.toUpperCase()}`;
    } else {
      status.textContent = `${MAX_ROWS - guesses.length} guesses remaining`;
    }
    render();
  }

  function handleKey(key) {
    if (gameOver) return;

    if (key === "ENTER") {
      submitGuess();
      return;
    }

    if (key === "BACK") {
      current = current.slice(0, -1);
      status.textContent = "Guess the word";
      render();
      return;
    }

    if (/^[A-Z]$/.test(key) && current.length < WORD_LENGTH) {
      current += key.toLowerCase();
      status.textContent = "Guess the word";
      render();
    }
  }

  function newGame() {
    target = chooseWord();
    guesses = [];
    current = "";
    gameOver = false;
    keyStates = {};
    status.textContent = "Guess the word";
    render();
  }

  document.addEventListener("keydown", event => {
    if (event.ctrlKey || event.metaKey || event.altKey) return;

    if (event.key === "Enter") {
      event.preventDefault();
      handleKey("ENTER");
    } else if (event.key === "Backspace") {
      event.preventDefault();
      handleKey("BACK");
    } else if (/^[a-zA-Z]$/.test(event.key)) {
      handleKey(event.key.toUpperCase());
    }
  });

  newGameBtn.addEventListener("click", () => {
    round += 1;
    newGame();
  });

  buildBoard();
  buildKeyboard();
  newGame();
})();


}
function begin(){poster.hidden=true;gm.hidden=false;if(!booted){booted=true;var s=document.createElement("style");s.textContent=LOOK;document.head.appendChild(s);boot();}else{var r=document.getElementById("newGameBtn");if(r)r.click();}}
poster.addEventListener("click",begin);
var nb=document.getElementById("new");if(nb)nb.addEventListener("click",begin);
})();
