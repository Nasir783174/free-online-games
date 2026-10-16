/* Word Puzzle - game logic + its own look. Layout lives in style.css; page shell lives in the HTML. */
(function(){"use strict";
var gm=document.getElementById("gm"),poster=document.getElementById("poster"),booted=false;
var LOOK=".gm{\n  --primary:#5B5CE2; --primary-dark:#4546B8; --secondary:#16B8C4;\n  --action:#FFB84D; --success:#22C55E; --danger:#EF5B5B;\n     \n   --game:#111827; --game-2:#1F2937;\n  \n}.gm *{box-sizing:border-box}.gm button,.gm select{font:inherit}.gm button,.gm select,.gm .cell{outline:none}.gm button:focus-visible,.gm select:focus-visible,.gm .cell:focus-visible{box-shadow:0 0 0 4px rgba(91,92,226,.22)}.gm .game-kicker{font-size:13px;font-weight:800;letter-spacing:.13em;color:var(--primary);margin:0 0 8px}.gm h2{font-size:clamp(28px,4vw,36px);line-height:1.2;margin:0 0 16px}.gm h3{font-size:22px;line-height:1.3;margin:0 0 8px}.gm .game-card{background:var(--card);border:1px solid var(--border);border-radius:20px;padding:24px;box-shadow:var(--shadow)}.gm .game-topbar{display:flex;align-items:center;justify-content:space-between;gap:20px;margin-bottom:18px}.gm .game-topbar h2{font-size:28px;margin:0}.gm .secondary-btn,.gm .primary-btn{height:46px;border-radius:12px;padding:0 18px;font-weight:800;cursor:pointer;border:1px solid var(--border)}.gm .secondary-btn{background:#fff;color:var(--text)}.gm .primary-btn{background:var(--primary);color:#fff;border-color:var(--primary)}.gm .secondary-btn:hover{background:#f8f8fc}.gm .primary-btn:hover{background:var(--primary-dark)}.gm .stats{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:20px}.gm .stat{background:#f8f9fc;border:1px solid var(--border);border-radius:14px;padding:12px 16px;display:flex;align-items:center;justify-content:space-between}.gm .stat span{color:var(--muted);font-size:14px;font-weight:700}.gm .stat strong{font-size:22px}.gm .game-layout{display:grid;grid-template-columns:minmax(0,1fr) 280px;gap:22px}.gm .board-wrap{background:var(--game);border-radius:18px;padding:22px;min-width:0}.gm .board{width:min(100%,650px);aspect-ratio:1;margin:auto;display:grid;gap:5px;touch-action:manipulation;user-select:none}.gm .cell{border:0;border-radius:8px;background:var(--game-2);color:#fff;display:grid;place-items:center;font-weight:800;font-size:clamp(15px,2.4vw,24px);cursor:pointer;transition:transform .12s,background .12s}.gm .cell:hover{transform:translateY(-1px);background:#344154}.gm .cell.selected{background:var(--action);color:#34240d}.gm .cell.found{background:var(--success);color:#fff}.gm .cell.wrong{animation:shake .25s;background:var(--danger)}@keyframes shake{25%{transform:translateX(-3px)}75%{transform:translateX(3px)}}.gm .selection-text{color:#cbd5e1;text-align:center;font-size:14px;margin:14px 0 0}.gm .word-panel{border:1px solid var(--border);border-radius:18px;padding:20px;background:#fbfbfd}.gm .panel-heading{display:flex;align-items:center;justify-content:space-between;gap:10px}.gm .panel-heading h3{font-size:20px}.gm .badge{background:rgba(91,92,226,.1);color:var(--primary-dark);font-size:12px;font-weight:800;padding:5px 9px;border-radius:999px}.gm .word-list{list-style:none;padding:0;margin:18px 0;display:grid;gap:8px}.gm .word-list li{display:flex;align-items:center;gap:9px;padding:8px 10px;background:#fff;border:1px solid var(--border);border-radius:10px;font-weight:700;font-size:15px}.gm .word-list li::before{content:\"\";width:9px;height:9px;border:2px solid #b7bdca;border-radius:50%}.gm .word-list li.found{text-decoration:line-through;color:var(--muted);background:#f1fbf4}.gm .word-list li.found::before{background:var(--success);border-color:var(--success)}.gm .difficulty{border-top:1px solid var(--border);padding-top:16px}.gm .difficulty label{display:block;font-size:14px;font-weight:800;margin-bottom:7px}.gm .difficulty select{width:100%;height:46px;border:1px solid var(--border);border-radius:10px;background:#fff;padding:0 12px;color:var(--text)}.gm .status{text-align:center;font-weight:700;color:var(--muted);padding:17px 10px 0}.gm .steps{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-top:26px}.gm .steps article{background:#fff;border:1px solid var(--border);border-radius:16px;padding:24px}.gm .steps article>span{display:grid;place-items:center;width:38px;height:38px;border-radius:11px;background:rgba(91,92,226,.1);color:var(--primary);font-weight:800;margin-bottom:15px}.gm .steps p{color:var(--muted)}.gm .modal{position:fixed;inset:0;background:rgba(17,24,39,.72);display:grid;place-items:center;padding:20px;z-index:10}.gm .modal[hidden]{display:none}.gm .modal-card{width:min(430px,100%);background:#fff;border-radius:20px;padding:34px;text-align:center;box-shadow:0 24px 80px rgba(0,0,0,.25)}.gm .modal-icon{width:58px;height:58px;border-radius:18px;background:rgba(255,184,77,.18);color:#bd7610;display:grid;place-items:center;margin:0 auto 16px;font-size:28px}.gm .modal-card p{color:var(--muted)}@media(max-width:820px){.gm .game-layout{grid-template-columns:1fr}.gm .word-panel{order:2}.gm .steps{grid-template-columns:1fr}.gm .game-card{padding:18px}.gm .board-wrap{padding:14px}}@media(max-width:560px){.gm .game-topbar{align-items:flex-start}.gm .game-topbar h2{font-size:23px}.gm .secondary-btn{height:42px;padding:0 12px;font-size:14px}.gm .stats{gap:7px}.gm .stat{display:block;text-align:center;padding:9px 5px}.gm .stat span{display:block}.gm .stat strong{font-size:19px}.gm .board{gap:3px}.gm .cell{border-radius:6px}.gm .board-wrap{padding:9px}.gm .game-card{padding:12px;border-radius:16px}}";
function __ready(f){f()}
function boot(){
(() => {
  "use strict";

  const CONFIG = {
    easy:   { size: 8,  words: 6,  time: 240 },
    medium: { size: 10, words: 8,  time: 180 },
    hard:   { size: 12, words: 10, time: 150 }
  };

  const WORD_BANK = [
    "PLANET","ROCKET","COMET","ORBIT","GALAXY","STAR","MOON","SPACE","SOLAR","METEOR",
    "OCEAN","CORAL","WHALE","SHARK","WAVES","ISLAND","REEF","TURTLE","SHELL","TIDE",
    "FOREST","RIVER","MOUNTAIN","CLOUD","STORM","BREEZE","FLOWER","LEAF","STONE","TRAIL",
    "PUZZLE","LETTER","BRAIN","LOGIC","SEARCH","CLUE","WORDS","THINK","FOCUS","SMART",
    "MUSIC","RHYTHM","MELODY","PIANO","DRUM","SONG","DANCE","BEAT","VOICE","CHORD",
    "APPLE","MANGO","BERRY","LEMON","PEACH","GRAPE","MELON","CHERRY","OLIVE","PLUM"
  ];

  const boardEl = document.getElementById("board");
  const scoreEl = document.getElementById("score");
  const foundCountEl = document.getElementById("foundCount");
  const wordCountEl = document.getElementById("wordCount");
  const timerEl = document.getElementById("timer");
  const wordListEl = document.getElementById("wordList");
  const statusEl = document.getElementById("status");
  const selectionTextEl = document.getElementById("selectionText");
  const difficultyEl = document.getElementById("difficulty");
  const difficultyBadge = document.getElementById("difficultyBadge");
  const newGameBtn = document.getElementById("newGameBtn");
  const playAgainBtn = document.getElementById("playAgainBtn");
  const modal = document.getElementById("modal");
  const modalTitle = document.getElementById("modalTitle");
  const modalMessage = document.getElementById("modalMessage");
  const modalIcon = document.getElementById("modalIcon");

  let grid = [], placements = [], words = [], selectedStart = null;
  let found = new Set(), score = 0, secondsLeft = 0, timerId = null, gameActive = false;

  const directions = [[0,1],[1,0],[1,1],[1,-1],[0,-1],[-1,0],[-1,-1],[-1,1]];
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  function sampleWords(count, maxLength) {
    const eligible = WORD_BANK.filter(w => w.length <= maxLength);
    for (let i = eligible.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [eligible[i], eligible[j]] = [eligible[j], eligible[i]];
    }
    return eligible.slice(0, count);
  }

  function buildGrid(size, selectedWords) {
    grid = Array.from({length:size}, () => Array(size).fill(""));
    placements = [];

    for (const word of selectedWords) {
      let placed = false;
      for (let attempt = 0; attempt < 250 && !placed; attempt++) {
        const [dr, dc] = directions[Math.floor(Math.random() * directions.length)];
        const row = Math.floor(Math.random() * size);
        const col = Math.floor(Math.random() * size);
        const endR = row + dr * (word.length - 1);
        const endC = col + dc * (word.length - 1);
        if (endR < 0 || endR >= size || endC < 0 || endC >= size) continue;

        let fits = true;
        for (let i=0;i<word.length;i++) {
          const existing = grid[row+dr*i][col+dc*i];
          if (existing && existing !== word[i]) { fits = false; break; }
        }
        if (!fits) continue;

        const cells = [];
        for (let i=0;i<word.length;i++) {
          const r=row+dr*i, c=col+dc*i;
          grid[r][c]=word[i]; cells.push([r,c]);
        }
        placements.push({word,cells});
        placed = true;
      }
      if (!placed) return false;
    }

    for (let r=0;r<size;r++) for (let c=0;c<size;c++) {
      if (!grid[r][c]) grid[r][c] = alphabet[Math.floor(Math.random()*alphabet.length)];
    }
    return true;
  }

  function renderBoard() {
    const size = grid.length;
    boardEl.innerHTML = "";
    boardEl.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    boardEl.setAttribute("aria-rowcount", size);
    boardEl.setAttribute("aria-colcount", size);

    grid.forEach((row,r) => row.forEach((letter,c) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "cell";
      btn.textContent = letter;
      btn.dataset.row = r;
      btn.dataset.col = c;
      btn.setAttribute("role","gridcell");
      btn.setAttribute("aria-label", `${letter}, row ${r+1}, column ${c+1}`);
      btn.addEventListener("click", () => chooseCell(r,c));
      boardEl.appendChild(btn);
    }));
  }

  function renderWords() {
    wordListEl.innerHTML = "";
    words.forEach(word => {
      const li = document.createElement("li");
      li.textContent = word;
      li.dataset.word = word;
      wordListEl.appendChild(li);
    });
    wordCountEl.textContent = words.length;
    foundCountEl.textContent = "0";
  }

  function cellEl(r,c) {
    return boardEl.querySelector(`[data-row="${r}"][data-col="${c}"]`);
  }

  function chooseCell(r,c) {
    if (!gameActive) return;
    if (!selectedStart) {
      selectedStart = [r,c];
      cellEl(r,c).classList.add("selected");
      selectionTextEl.textContent = `Start: ${grid[r][c]}. Now select the last letter.`;
      return;
    }

    const [sr,sc] = selectedStart;
    const path = getStraightPath(sr,sc,r,c);
    cellEl(sr,sc).classList.remove("selected");
    selectedStart = null;

    if (!path) {
      flashWrong([[r,c]]);
      statusEl.textContent = "Choose letters in a horizontal, vertical, or diagonal line.";
      selectionTextEl.textContent = "Try another start and end letter.";
      return;
    }

    const candidate = path.map(([pr,pc]) => grid[pr][pc]).join("");
    const reverse = candidate.split("").reverse().join("");
    const matched = words.find(w => !found.has(w) && (w === candidate || w === reverse));

    if (matched) {
      found.add(matched);
      path.forEach(([pr,pc]) => cellEl(pr,pc).classList.add("found"));
      const gained = matched.length * 15;
      score += gained;
      scoreEl.textContent = score;
      foundCountEl.textContent = found.size;
      const li = wordListEl.querySelector(`[data-word="${matched}"]`);
      if (li) li.classList.add("found");
      statusEl.textContent = `${matched} found! +${gained} points.`;
      selectionTextEl.textContent = "Nice find. Choose another word.";
      if (found.size === words.length) finishGame(true);
    } else {
      flashWrong(path);
      statusEl.textContent = "That line is not one of the remaining words.";
      selectionTextEl.textContent = "Try another start and end letter.";
    }
  }

  function getStraightPath(sr,sc,er,ec) {
    const rd = er-sr, cd = ec-sc;
    if (rd === 0 && cd === 0) return [[sr,sc]];
    const straight = rd === 0 || cd === 0 || Math.abs(rd) === Math.abs(cd);
    if (!straight) return null;
    const dr = Math.sign(rd), dc = Math.sign(cd);
    const length = Math.max(Math.abs(rd),Math.abs(cd)) + 1;
    return Array.from({length},(_,i)=>[sr+dr*i,sc+dc*i]);
  }

  function flashWrong(path) {
    path.forEach(([r,c]) => cellEl(r,c)?.classList.add("wrong"));
    setTimeout(() => path.forEach(([r,c]) => cellEl(r,c)?.classList.remove("wrong")), 300);
  }

  function updateTimer() {
    const min = Math.floor(secondsLeft/60).toString().padStart(2,"0");
    const sec = (secondsLeft%60).toString().padStart(2,"0");
    timerEl.textContent = `${min}:${sec}`;
  }

  function startTimer() {
    clearInterval(timerId);
    timerId = setInterval(() => {
      if (!gameActive) return;
      secondsLeft--;
      updateTimer();
      if (secondsLeft <= 0) finishGame(false);
    },1000);
  }

  function finishGame(won) {
    gameActive = false;
    clearInterval(timerId);
    if (won) {
      const bonus = secondsLeft * 2;
      score += bonus;
      scoreEl.textContent = score;
      modalIcon.textContent = "★";
      modalTitle.textContent = "Puzzle Complete!";
      modalMessage.textContent = `You found all ${words.length} words and scored ${score} points, including a ${bonus}-point time bonus.`;
      statusEl.textContent = "Puzzle complete!";
    } else {
      modalIcon.textContent = "⌛";
      modalTitle.textContent = "Time's Up";
      modalMessage.textContent = `You found ${found.size} of ${words.length} words and scored ${score} points. Try a new puzzle and beat your score.`;
      statusEl.textContent = "Time is up. Start a new puzzle to play again.";
    }
    modal.hidden = false;
    playAgainBtn.focus();
  }

  function newGame() {
    modal.hidden = true;
    const level = difficultyEl.value;
    const cfg = CONFIG[level];
    difficultyBadge.textContent = level[0].toUpperCase()+level.slice(1);
    found = new Set(); score = 0; selectedStart = null;
    scoreEl.textContent = "0";
    secondsLeft = cfg.time;
    updateTimer();

    let success = false, attempts = 0;
    while (!success && attempts < 20) {
      words = sampleWords(cfg.words, cfg.size);
      success = buildGrid(cfg.size, words);
      attempts++;
    }
    if (!success) {
      statusEl.textContent = "Could not create this puzzle. Please try New Puzzle.";
      return;
    }

    renderBoard();
    renderWords();
    selectionTextEl.textContent = "Select the first letter, then the last letter of a word.";
    statusEl.textContent = "Puzzle ready. Good luck!";
    gameActive = true;
    startTimer();
  }

  newGameBtn.addEventListener("click", newGame);
  playAgainBtn.addEventListener("click", newGame);
  difficultyEl.addEventListener("change", newGame);
  modal.addEventListener("click", e => { if (e.target === modal && !gameActive) newGame(); });
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && !modal.hidden) newGame();
  });

  newGame();
})();


}
function begin(){poster.hidden=true;gm.hidden=false;if(!booted){booted=true;var s=document.createElement("style");s.textContent=LOOK;document.head.appendChild(s);boot();}else{var r=document.getElementById("newGameBtn");if(r)r.click();}}
poster.addEventListener("click",begin);
var nb=document.getElementById("new");if(nb)nb.addEventListener("click",begin);
})();
