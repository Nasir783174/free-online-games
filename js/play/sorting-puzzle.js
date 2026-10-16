/* Sorting Puzzle - game logic + its own look. Layout lives in style.css; page shell lives in the HTML. */
(function(){"use strict";
var gm=document.getElementById("gm"),poster=document.getElementById("poster"),booted=false;
var LOOK=".gm{\n  --primary:#5B5CE2;--primary-dark:#4546B8;--secondary:#16B8C4;--action:#FFB84D;\n  --success:#22C55E;--danger:#EF5B5B;\n  --game:#111827;--game2:#1F2937;\n}.gm *{box-sizing:border-box}.gm button{font:inherit}.gm button{cursor:pointer}.gm .all-games{font-weight:700}.gm h2{font-size:clamp(27px,3vw,35px);line-height:1.2;margin:0 0 14px;font-weight:700}.gm h3{font-size:22px;line-height:1.25;margin:0 0 5px}.gm .game-card{background:var(--card);border:1px solid var(--border);border-radius:20px;overflow:hidden;box-shadow:0 18px 50px rgba(23,27,45,.07)}.gm .game-toolbar{display:grid;grid-template-columns:110px 110px 110px 1fr;align-items:center;gap:12px;padding:18px 22px;border-bottom:1px solid var(--border)}.gm .toolbar-label{margin:0;color:var(--muted);font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.06em}.gm .game-toolbar strong{font-size:24px;line-height:1.1}.gm .toolbar-actions{display:flex;justify-content:flex-end;gap:10px}.gm .btn{border:0;border-radius:12px;min-height:46px;padding:10px 18px;font-weight:800;font-size:15px}.gm .btn:focus-visible,.gm .tube:focus-visible,.gm .text-button:focus-visible,.gm summary:focus-visible{outline:3px solid var(--action);outline-offset:3px}.gm .btn-primary{background:var(--primary);color:#fff}.gm .btn-primary:hover{background:var(--primary-dark)}.gm .btn-secondary{background:#EEF0F7;color:var(--text)}.gm .btn-success{background:var(--success);color:#fff}.gm .game-stage{background:var(--game);padding:24px;min-height:500px;color:#fff}.gm .stage-heading{display:flex;justify-content:space-between;align-items:flex-start;gap:20px;margin-bottom:22px}.gm .stage-heading h2{font-size:28px;margin-bottom:5px}.gm .stage-heading p{margin:0;color:#B8C0D1;font-size:15px}.gm .text-button{border:0;background:transparent;color:#BFC3FF;font-weight:800;padding:8px}.gm .board{display:grid;grid-template-columns:repeat(auto-fit,minmax(82px,1fr));gap:22px 16px;align-items:end;justify-items:center;max-width:820px;margin:28px auto 18px}.gm .tube{position:relative;width:72px;height:224px;padding:9px 7px 8px;border:3px solid #758097;border-top:0;border-radius:0 0 26px 26px;background:rgba(255,255,255,.035);display:flex;flex-direction:column-reverse;justify-content:flex-start;align-items:center;gap:5px;transition:transform .16s ease,border-color .16s ease,background .16s ease}.gm .tube::before,.gm .tube::after{content:\"\";position:absolute;top:-2px;width:13px;height:3px;background:#758097;border-radius:2px}.gm .tube::before{left:-3px}.gm .tube::after{right:-3px}.gm .tube:hover{background:rgba(255,255,255,.07)}.gm .tube.selected{transform:translateY(-10px);border-color:#FFCF78;background:rgba(255,184,77,.08)}.gm .tube.selected::before,.gm .tube.selected::after{background:#FFCF78}.gm .tube.invalid{animation:shake .25s linear}.gm .ball{width:52px;height:42px;border-radius:50%;box-shadow:inset 0 -7px 0 rgba(0,0,0,.12),inset 0 5px 0 rgba(255,255,255,.2);flex:0 0 auto}.gm .win-panel{max-width:820px;margin:24px auto 0;border:1px solid rgba(255,255,255,.13);background:var(--game2);border-radius:16px;padding:18px;display:grid;grid-template-columns:auto 1fr auto;gap:14px;align-items:center}.gm .win-panel[hidden]{display:none}.gm .win-panel p{margin:0;color:#C7CEDC}.gm .win-icon{width:44px;height:44px;border-radius:50%;background:var(--success);display:grid;place-items:center;font-weight:800;font-size:24px}.gm .steps{padding-left:24px}.gm .steps li{margin:10px 0}.gm .info-card{background:#fff;border:1px solid var(--border);border-radius:16px;padding:24px}.gm .info-card h2{font-size:27px}.gm .info-card p,.gm .info-card li{color:#444B5D}.gm .muted{color:var(--muted)!important}.gm kbd{background:#E9EBF3;border:1px solid #D4D8E5;border-bottom-width:2px;border-radius:5px;padding:1px 6px;font-size:.9em}@keyframes shake{25%{transform:translateX(-5px)}50%{transform:translateX(5px)}75%{transform:translateX(-3px)}}@media (max-width:700px){.gm .game-toolbar{grid-template-columns:repeat(3,1fr);padding:15px;gap:10px}.gm .toolbar-actions{grid-column:1/-1;justify-content:stretch}.gm .toolbar-actions .btn{flex:1}.gm .game-stage{padding:18px 12px;min-height:460px}.gm .stage-heading{padding:0 4px}.gm .stage-heading h2{font-size:24px}.gm .stage-heading p{font-size:14px}.gm .board{grid-template-columns:repeat(4,1fr);gap:20px 5px;margin-top:24px}.gm .tube{width:58px;height:184px;border-width:3px;padding:7px 5px;gap:4px}.gm .ball{width:42px;height:34px}.gm .win-panel{grid-template-columns:auto 1fr}.gm .win-panel .btn{grid-column:1/-1;width:100%}}@media (max-width:390px){.gm .board{grid-template-columns:repeat(4,1fr)}.gm .tube{width:52px;height:172px}.gm .ball{width:38px;height:31px}.gm .stage-heading{display:block}.gm .text-button{padding-left:0;margin-top:8px}}@media (prefers-reduced-motion:reduce){.gm *{scroll-behavior:auto!important;animation-duration:.001ms!important;transition-duration:.001ms!important}}";
function __ready(f){f()}
function boot(){
(() => {
  "use strict";

  const CAPACITY = 4;
  const COLORS = [
    "#FF6B6B", "#4D96FF", "#FFD93D", "#6BCB77",
    "#B983FF", "#FF8E3C", "#22C7C9", "#F065B5"
  ];

  const boardEl = document.getElementById("board");
  const movesEl = document.getElementById("movesValue");
  const levelEl = document.getElementById("levelValue");
  const bestEl = document.getElementById("bestValue");
  const statusEl = document.getElementById("statusText");
  const winPanel = document.getElementById("winPanel");
  const winText = document.getElementById("winText");
  const undoBtn = document.getElementById("undoBtn");
  const restartBtn = document.getElementById("restartBtn");
  const newGameBtn = document.getElementById("newGameBtn");
  const nextBtn = document.getElementById("nextBtn");

  let level = 1;
  let tubes = [];
  let initialState = [];
  let selected = null;
  let moves = 0;
  let history = [];
  let won = false;
  let focusedIndex = 0;

  const clone = state => state.map(t => [...t]);

  function seededRandom(seed) {
    let x = Math.sin(seed * 9999.91) * 10000;
    return () => {
      x = Math.sin(x) * 10000;
      return x - Math.floor(x);
    };
  }

  function solvedState(colorCount) {
    const state = [];
    for (let c = 0; c < colorCount; c++) state.push(Array(CAPACITY).fill(c));
    state.push([], []);
    return state;
  }

  function legalReverseMoves(state) {
    const moves = [];
    for (let from = 0; from < state.length; from++) {
      if (!state[from].length) continue;
      const color = state[from][state[from].length - 1];
      for (let to = 0; to < state.length; to++) {
        if (from === to || state[to].length >= CAPACITY) continue;
        moves.push([from, to, color]);
      }
    }
    return moves;
  }

  // Generate a guaranteed-solvable puzzle by scrambling a solved state.
  // Reverse scrambling allows moves that normal play would reject; reversing
  // the sequence always supplies a valid path back to the solved state.
  function generatePuzzle(currentLevel, salt = 0) {
    const colorCount = Math.min(4 + Math.floor((currentLevel - 1) / 2), 7);
    let state = solvedState(colorCount);
    const rand = seededRandom(currentLevel * 173 + salt * 997 + 41);
    const scrambleSteps = 28 + currentLevel * 4;
    let last = null;

    for (let step = 0; step < scrambleSteps; step++) {
      let candidates = legalReverseMoves(state).filter(([from, to]) =>
        !last || !(from === last[1] && to === last[0])
      );
      if (!candidates.length) candidates = legalReverseMoves(state);
      const pick = candidates[Math.floor(rand() * candidates.length)];
      if (!pick) break;
      const [from, to] = pick;
      state[to].push(state[from].pop());
      last = [from, to];
    }

    // Avoid returning a solved/trivial board.
    if (isSolved(state)) return generatePuzzle(currentLevel, salt + 1);
    return state;
  }

  function isUniform(tube) {
    return tube.length > 0 && tube.every(v => v === tube[0]);
  }

  function isSolved(state) {
    return state.every(tube => tube.length === 0 || (tube.length === CAPACITY && isUniform(tube)));
  }

  function canMove(from, to) {
    if (from === to || !tubes[from].length || tubes[to].length >= CAPACITY) return false;
    const moving = tubes[from][tubes[from].length - 1];
    return tubes[to].length === 0 || tubes[to][tubes[to].length - 1] === moving;
  }

  function moveBall(from, to) {
    if (!canMove(from, to) || won) return false;
    history.push(clone(tubes));
    tubes[to].push(tubes[from].pop());
    moves++;
    selected = null;
    render();
    checkWin();
    return true;
  }

  function selectTube(index) {
    if (won) return;
    if (selected === null) {
      if (!tubes[index].length) {
        flashInvalid(index, "Choose a tube that contains a ball.");
        return;
      }
      selected = index;
      statusEl.textContent = "Now choose an empty tube or a tube with the same color on top.";
      render();
      return;
    }

    if (selected === index) {
      selected = null;
      statusEl.textContent = "Selection cleared. Choose a tube to continue.";
      render();
      return;
    }

    const from = selected;
    if (!moveBall(from, index)) {
      flashInvalid(index, "That move is not allowed. Match the top color or use an empty tube.");
    }
  }

  function flashInvalid(index, message) {
    statusEl.textContent = message;
    const el = boardEl.children[index];
    if (!el) return;
    el.classList.remove("invalid");
    void el.offsetWidth;
    el.classList.add("invalid");
  }

  function render() {
    boardEl.innerHTML = "";
    tubes.forEach((tube, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "tube" + (selected === index ? " selected" : "");
      button.dataset.index = index;
      button.setAttribute("aria-label", describeTube(tube, index));
      button.setAttribute("aria-pressed", selected === index ? "true" : "false");
      button.tabIndex = index === focusedIndex ? 0 : -1;

      tube.forEach(colorIndex => {
        const ball = document.createElement("span");
        ball.className = "ball";
        ball.style.backgroundColor = COLORS[colorIndex];
        ball.setAttribute("aria-hidden", "true");
        button.appendChild(ball);
      });

      button.addEventListener("click", () => {
        focusedIndex = index;
        selectTube(index);
      });
      boardEl.appendChild(button);
    });

    movesEl.textContent = String(moves);
    levelEl.textContent = String(level);
    bestEl.textContent = getBest(level) ?? "—";
    undoBtn.disabled = history.length === 0 || won;
  }

  function describeTube(tube, index) {
    if (!tube.length) return `Tube ${index + 1}, empty`;
    return `Tube ${index + 1}, ${tube.length} of ${CAPACITY} balls`;
  }

  function checkWin() {
    if (!isSolved(tubes)) return;
    won = true;
    const previous = getBest(level);
    if (previous === null || moves < previous) {
      localStorage.setItem(`sortingPuzzleBest:${level}`, String(moves));
      bestEl.textContent = String(moves);
    }
    winText.textContent = `You completed level ${level} in ${moves} move${moves === 1 ? "" : "s"}.`;
    statusEl.textContent = "Puzzle complete. Nice work!";
    winPanel.hidden = false;
  }

  function getBest(lvl) {
    try {
      const value = localStorage.getItem(`sortingPuzzleBest:${lvl}`);
      return value === null ? null : Number(value);
    } catch {
      return null;
    }
  }

  function startLevel(newLevel = level, salt = 0) {
    level = Math.max(1, newLevel);
    tubes = generatePuzzle(level, salt);
    initialState = clone(tubes);
    selected = null;
    moves = 0;
    history = [];
    won = false;
    focusedIndex = 0;
    winPanel.hidden = true;
    statusEl.textContent = "Tap a tube, then tap another tube to move the top ball.";
    render();
  }

  function restart() {
    tubes = clone(initialState);
    selected = null;
    moves = 0;
    history = [];
    won = false;
    winPanel.hidden = true;
    statusEl.textContent = "Level restarted.";
    render();
  }

  function undo() {
    if (!history.length || won) return;
    tubes = history.pop();
    moves = Math.max(0, moves - 1);
    selected = null;
    statusEl.textContent = "Last move undone.";
    render();
  }

  function newPuzzle() {
    startLevel(level, Date.now() % 100000);
    statusEl.textContent = "A new puzzle is ready.";
  }

  function focusTube(index) {
    focusedIndex = (index + tubes.length) % tubes.length;
    render();
    const target = boardEl.children[focusedIndex];
    if (target) target.focus();
  }

  boardEl.addEventListener("keydown", event => {
    const cols = window.innerWidth <= 700 ? 4 : Math.max(1, Math.floor(boardEl.clientWidth / 98));
    if (event.key === "ArrowRight") { event.preventDefault(); focusTube(focusedIndex + 1); }
    else if (event.key === "ArrowLeft") { event.preventDefault(); focusTube(focusedIndex - 1); }
    else if (event.key === "ArrowDown") { event.preventDefault(); focusTube(focusedIndex + cols); }
    else if (event.key === "ArrowUp") { event.preventDefault(); focusTube(focusedIndex - cols); }
  });

  document.addEventListener("keydown", event => {
    if (event.target.matches("button, summary, a")) return;
    if (event.key.toLowerCase() === "u") undo();
    if (event.key.toLowerCase() === "r") restart();
  });

  undoBtn.addEventListener("click", undo);
  restartBtn.addEventListener("click", restart);
  newGameBtn.addEventListener("click", newPuzzle);
  nextBtn.addEventListener("click", () => startLevel(level + 1));

  startLevel(1);
})();


}
function begin(){poster.hidden=true;gm.hidden=false;if(!booted){booted=true;var s=document.createElement("style");s.textContent=LOOK;document.head.appendChild(s);boot();}else{var r=document.getElementById("restartBtn");if(r)r.click();}}
poster.addEventListener("click",begin);
var nb=document.getElementById("new");if(nb)nb.addEventListener("click",begin);
})();
