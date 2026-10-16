/* Mahjong - game logic + its own look. Layout lives in style.css; page shell lives in the HTML. */
(function(){"use strict";
var gm=document.getElementById("gm"),poster=document.getElementById("poster"),booted=false;
var LOOK=".gm{\n  \n  \n  --secondary: #16B8C4;\n  --action: #FFB84D;\n  --success: #22C55E;\n  --danger: #EF5B5B;\n  \n  \n  \n  \n  \n  --game-bg: #16211C;\n  --game-bg-2: #223128;\n  --tile: #F5E8C9;\n  --tile-edge: #D9C79E;\n  --tile-text: #27332D;\n  \n}.gm *{ box-sizing: border-box; }.gm button,.gm input,.gm select,.gm textarea{ font: inherit; }.gm button:focus-visible,.gm summary:focus-visible{\n  outline: 3px solid rgba(91, 92, 226, .35);\n  outline-offset: 3px;\n}.gm .narrow-container{ width: min(860px, calc(100% - 40px)); }.gm .visually-hidden{\n  position: absolute !important;\n  width: 1px !important;\n  height: 1px !important;\n  padding: 0 !important;\n  margin: -1px !important;\n  overflow: hidden !important;\n  clip: rect(0, 0, 0, 0) !important;\n  white-space: nowrap !important;\n  border: 0 !important;\n}.gm h2,.gm h3{ margin-top: 0; color: var(--text); }.gm h2{ font-size: clamp(28px, 4vw, 36px); line-height: 1.18; margin-bottom: 18px; font-weight: 700; }.gm h3{ font-size: 22px; line-height: 1.3; margin-bottom: 12px; font-weight: 700; }.gm .game-section{ padding: 24px 0 64px; }.gm .game-layout{ display: grid; grid-template-columns: minmax(0, 1fr) 310px; gap: 24px; align-items: start; }.gm .game-panel,.gm .side-card{ background: var(--card); border: 1px solid var(--border); border-radius: 18px; box-shadow: var(--shadow); }.gm .game-panel{ padding: 20px; }.gm .game-toolbar{ display: flex; gap: 18px; justify-content: space-between; align-items: center; margin-bottom: 14px; flex-wrap: wrap; }.gm .status-group{ display: flex; gap: 10px; flex-wrap: wrap; }.gm .status-card{ min-width: 88px; padding: 10px 12px; border: 1px solid var(--border); border-radius: 13px; background: #FBFCFE; }.gm .status-label{ display: block; font-size: 12px; text-transform: uppercase; letter-spacing: .06em; color: var(--muted); font-weight: 800; }.gm .status-card strong{ font-size: 21px; line-height: 1.1; }.gm .button-group{ display: flex; gap: 10px; flex-wrap: wrap; }.gm .btn{ min-height: 46px; border-radius: 12px; border: 1px solid transparent; padding: 10px 16px; font-weight: 800; cursor: pointer; transition: transform .15s ease, background .15s ease, border-color .15s ease; }.gm .btn:hover{ transform: translateY(-1px); }.gm .btn:active{ transform: translateY(0); }.gm .btn-primary{ background: var(--brand); color: #fff; }.gm .btn-primary:hover{ background: var(--brand-dark); }.gm .btn-secondary{ background: #fff; color: var(--text); border-color: var(--border); }.gm .btn-secondary:hover{ border-color: #C9CCDA; background: #FAFAFD; }.gm .game-status{ margin: 0 0 14px; padding: 10px 12px; min-height: 46px; display: flex; align-items: center; border-radius: 12px; color: #35403A; background: #F0F7F2; border: 1px solid #DDEBE1; font-weight: 700; font-size: 15px; }.gm .game-status.warning{ background: #FFF8E8; border-color: #F5DFAC; color: #70541C; }.gm .game-status.success{ background: #ECFDF3; border-color: #BBF7D0; color: #166534; }.gm .board-wrap{\n  background: linear-gradient(180deg, var(--game-bg), var(--game-bg-2));\n  border-radius: 18px;\n  padding: 22px;\n  overflow: auto;\n  min-height: 540px;\n  display: grid;\n  place-items: center;\n  box-shadow: inset 0 0 0 1px rgba(255,255,255,.05);\n}.gm .mahjong-board{\n  position: relative;\n  width: min(100%, 760px);\n  aspect-ratio: 1.36 / 1;\n  min-width: 640px;\n}.gm .mahjong-tile{\n  position: absolute;\n  width: 8.6%;\n  aspect-ratio: .78 / 1;\n  border: 0;\n  border-radius: 9px;\n  background: linear-gradient(155deg, #FFF8E9 0%, var(--tile) 67%, #E8D7B0 100%);\n  color: var(--tile-text);\n  cursor: pointer;\n  box-shadow: 0 4px 0 var(--tile-edge), 0 7px 15px rgba(0,0,0,.23);\n  display: grid;\n  place-items: center;\n  padding: 0;\n  transform: translateZ(0);\n  transition: transform .12s ease, filter .12s ease, opacity .16s ease, box-shadow .12s ease;\n  user-select: none;\n  -webkit-tap-highlight-color: transparent;\n}.gm .mahjong-tile::after{\n  content: \"\";\n  position: absolute;\n  inset: 5px;\n  border-radius: 6px;\n  border: 1px solid rgba(74, 81, 74, .14);\n  pointer-events: none;\n}.gm .tile-face{ display: flex; flex-direction: column; align-items: center; justify-content: center; line-height: 1; gap: 3px; }.gm .tile-symbol{ font-size: clamp(20px, 3.6vw, 31px); font-weight: 800; }.gm .tile-mark{ font-size: 9px; font-weight: 800; letter-spacing: .1em; opacity: .55; text-transform: uppercase; }.gm .mahjong-tile:not(.blocked):hover{ transform: translateY(-3px); box-shadow: 0 5px 0 var(--tile-edge), 0 12px 22px rgba(0,0,0,.28); }.gm .mahjong-tile.blocked{ cursor: not-allowed; filter: saturate(.65) brightness(.84); color: #687069; }.gm .mahjong-tile.blocked::before{\n  content: \"\";\n  position: absolute;\n  inset: 0;\n  border-radius: inherit;\n  background: rgba(48, 62, 52, .12);\n}.gm .mahjong-tile.selected{ outline: 4px solid var(--action); outline-offset: 2px; transform: translateY(-5px); z-index: 999 !important; }.gm .mahjong-tile.hint{ animation: hintPulse .85s ease-in-out 2; z-index: 998 !important; }.gm .mahjong-tile.removing{ opacity: 0; transform: scale(.7); pointer-events: none; }@keyframes hintPulse{\n  0%,100% { box-shadow: 0 4px 0 var(--tile-edge), 0 7px 15px rgba(0,0,0,.23); }\n  50% { box-shadow: 0 4px 0 var(--tile-edge), 0 0 0 5px rgba(255,184,77,.55), 0 12px 24px rgba(0,0,0,.3); }\n}.gm .mobile-help{ display: none; margin-top: 12px; color: var(--muted); font-size: 14px; }.gm .side-panel{ display: grid; gap: 18px; }.gm .side-card{ padding: 22px; box-shadow: none; }.gm .side-card h2{ font-size: 26px; }.gm .side-card ol,.gm .side-card ul{ padding-left: 22px; margin-bottom: 0; }.gm .side-card li + li{ margin-top: 10px; }.gm .compact-card p{ margin-bottom: 0; color: var(--muted); }.gm details{ background: #fff; border: 1px solid var(--border); border-radius: 14px; padding: 0 18px; }.gm details + details{ margin-top: 12px; }.gm summary{ cursor: pointer; font-weight: 800; padding: 17px 0; }.gm details p{ margin-top: 0; color: var(--muted); padding-bottom: 16px; }.gm .modal{ position: fixed; inset: 0; z-index: 100; display: none; place-items: center; padding: 20px; }.gm .modal.open{ display: grid; }.gm .modal-backdrop{ position: absolute; inset: 0; background: rgba(17,24,39,.62); backdrop-filter: blur(5px); }.gm .modal-dialog{ position: relative; width: min(460px, 100%); background: #fff; border-radius: 20px; padding: 30px; box-shadow: 0 25px 70px rgba(0,0,0,.22); text-align: center; }.gm .modal-dialog h2{ font-size: 32px; margin-bottom: 10px; }.gm .modal-dialog > p:not(.eyebrow){ color: var(--muted); }.gm .modal-stats{ display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin: 24px 0; }.gm .modal-stats div{ padding: 12px 8px; background: var(--bg); border-radius: 12px; }.gm .modal-stats span{ display: block; color: var(--muted); font-size: 12px; text-transform: uppercase; font-weight: 800; }.gm .modal-stats strong{ font-size: 20px; }.gm .modal-button{ width: 100%; }@media (max-width: 980px){.gm .game-layout{ grid-template-columns: 1fr; }.gm .side-panel{ grid-template-columns: 1fr 1fr; }.gm .board-wrap{ min-height: 500px; }}@media (max-width: 720px){.gm .narrow-container{ width: min(100% - 24px, 1180px); }.gm .game-section{ padding-top: 12px; }.gm .game-panel{ padding: 12px; border-radius: 15px; }.gm .game-toolbar{ align-items: stretch; }.gm .status-group{ display: grid; grid-template-columns: repeat(4, 1fr); width: 100%; gap: 7px; }.gm .status-card{ min-width: 0; padding: 8px; }.gm .status-card strong{ font-size: 18px; }.gm .status-label{ font-size: 10px; }.gm .button-group{ width: 100%; display: grid; grid-template-columns: 1fr 1fr 1.15fr; gap: 7px; }.gm .btn{ min-height: 48px; padding: 9px 10px; font-size: 14px; }.gm .board-wrap{ padding: 12px; min-height: 0; place-items: start; overflow-x: auto; }.gm .mahjong-board{ min-width: 560px; width: 560px; }.gm .tile-symbol{ font-size: 24px; }.gm .mobile-help{ display: block; }.gm .side-panel{ grid-template-columns: 1fr; }}@media (max-width: 420px){.gm .status-group{ grid-template-columns: repeat(2, 1fr); }.gm .button-group{ grid-template-columns: 1fr 1fr; }.gm #newGameBtn{ grid-column: 1 / -1; }.gm .modal-stats{ grid-template-columns: 1fr; }}@media (prefers-reduced-motion: reduce){.gm *,.gm *::before,.gm *::after{ animation-duration: .01ms !important; animation-iteration-count: 1 !important; transition-duration: .01ms !important; scroll-behavior: auto !important; }}";
function __ready(f){f()}
function boot(){
(() => {
  "use strict";

  const boardEl = document.getElementById("mahjongBoard");
  const scoreEl = document.getElementById("score");
  const pairsEl = document.getElementById("pairs");
  const totalPairsEl = document.getElementById("totalPairs");
  const movesEl = document.getElementById("moves");
  const timeEl = document.getElementById("time");
  const gameStatusEl = document.getElementById("gameStatus");
  const hintBtn = document.getElementById("hintBtn");
  const shuffleBtn = document.getElementById("shuffleBtn");
  const newGameBtn = document.getElementById("newGameBtn");
  const resultModal = document.getElementById("resultModal");
  const playAgainBtn = document.getElementById("playAgainBtn");
  const finalScoreEl = document.getElementById("finalScore");
  const finalMovesEl = document.getElementById("finalMoves");
  const finalTimeEl = document.getElementById("finalTime");

  const SYMBOLS = [
    ["🀇", "1 Bamboo"], ["🀈", "2 Bamboo"], ["🀉", "3 Bamboo"], ["🀊", "4 Bamboo"],
    ["🀙", "1 Circle"], ["🀚", "2 Circle"], ["🀛", "3 Circle"], ["🀜", "4 Circle"],
    ["🀐", "1 Character"], ["🀑", "2 Character"], ["🀒", "3 Character"], ["🀓", "4 Character"],
    ["🀀", "East Wind"], ["🀁", "South Wind"], ["🀂", "West Wind"], ["🀃", "North Wind"],
    ["🀄", "Red Dragon"], ["🀅", "Green Dragon"], ["🀆", "White Dragon"], ["🀢", "Spring"],
    ["🀣", "Summer"], ["🀤", "Autumn"], ["🀥", "Winter"]
  ];

  // Layout coordinates use a 12-column x 9-row logical grid plus layers.
  // The bottom layer contains 36 tiles, layer 1 contains 8, and layer 2 contains 4 = 48 tiles / 24 pairs.
  const LAYOUT = [
    // Base layer: broad turtle-like body (36)
    ...coordsForRows(0, [
      [0, 2, 8],
      [1, 1, 10],
      [2, 0, 12],
      [3, 1, 10],
      [4, 2, 8]
    ]),
    // Mid layer: 8 tiles centered
    {x:4,y:1.45,z:1},{x:5,y:1.45,z:1},{x:6,y:1.45,z:1},{x:7,y:1.45,z:1},
    {x:4,y:2.55,z:1},{x:5,y:2.55,z:1},{x:6,y:2.55,z:1},{x:7,y:2.55,z:1},
    // Top layer: 4 tiles
    {x:5,y:1.9,z:2},{x:6,y:1.9,z:2},{x:5,y:2.1,z:2},{x:6,y:2.1,z:2}
  ];

  let tiles = [];
  let selectedId = null;
  let score = 0;
  let moves = 0;
  let matchedPairs = 0;
  let startTime = 0;
  let timerId = null;
  let lastMatchAt = 0;
  let gameActive = false;

  function coordsForRows(z, rows) {
    const result = [];
    for (const [y, startX, count] of rows) {
      for (let i = 0; i < count; i++) result.push({ x: startX + i, y, z });
    }
    return result;
  }

  function shuffled(array) {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function makePairValues(pairCount) {
    const values = [];
    for (let i = 0; i < pairCount; i++) {
      const symbolIndex = i % SYMBOLS.length;
      values.push(symbolIndex, symbolIndex);
    }
    return shuffled(values);
  }

  function newGame() {
    closeModal();
    clearInterval(timerId);
    boardEl.innerHTML = "";
    score = 0;
    moves = 0;
    matchedPairs = 0;
    selectedId = null;
    lastMatchAt = 0;
    startTime = Date.now();
    gameActive = true;

    const values = makePairValues(LAYOUT.length / 2);
    tiles = LAYOUT.map((pos, index) => ({
      id: index,
      ...pos,
      value: values[index],
      removed: false
    }));

    totalPairsEl.textContent = String(LAYOUT.length / 2);
    renderBoard();
    updateStats();
    setStatus("Match two open tiles with the same symbol.");
    timerId = setInterval(updateTime, 1000);
    updateTime();

    // Ensure the opening position has at least one move.
    if (!findAvailableMatches().length) shuffleRemaining(false);
  }

  function renderBoard() {
    boardEl.innerHTML = "";
    const maxX = 11;
    const maxY = 4;

    [...tiles].sort((a, b) => a.z - b.z || a.y - b.y || a.x - b.x).forEach(tile => {
      if (tile.removed) return;
      const [symbol, label] = SYMBOLS[tile.value];
      const btn = document.createElement("button");
      btn.className = "mahjong-tile";
      btn.type = "button";
      btn.dataset.id = String(tile.id);
      btn.setAttribute("role", "gridcell");
      btn.setAttribute("aria-label", `${label} tile`);
      btn.style.left = `${(tile.x / maxX) * 88.5 + 1}%`;
      btn.style.top = `${(tile.y / maxY) * 76 + 5 - tile.z * 1.5}%`;
      btn.style.zIndex = String(10 + tile.z * 20 + Math.round(tile.y * 2));
      btn.innerHTML = `<span class="tile-face"><span class="tile-symbol" aria-hidden="true">${symbol}</span><span class="tile-mark">${shortLabel(label)}</span></span>`;
      btn.addEventListener("click", () => handleTileClick(tile.id));
      boardEl.appendChild(btn);
    });

    refreshTileStates();
  }

  function shortLabel(label) {
    if (label.includes("Bamboo")) return "BAM";
    if (label.includes("Circle")) return "DOT";
    if (label.includes("Character")) return "CHR";
    if (label.includes("Wind")) return "WIND";
    if (label.includes("Dragon")) return "DRG";
    return "SEASON";
  }

  function tileById(id) { return tiles.find(t => t.id === id); }

  function isTileOpen(tile) {
    if (!tile || tile.removed) return false;

    // Any higher-layer tile sufficiently overlapping the tile blocks it.
    const covered = tiles.some(other => {
      if (other.removed || other.z <= tile.z) return false;
      const horizontalOverlap = Math.abs(other.x - tile.x) < 0.82;
      const verticalOverlap = Math.abs(other.y - tile.y) < 0.64;
      return horizontalOverlap && verticalOverlap;
    });
    if (covered) return false;

    // A tile is side-free if there is no same-layer neighbor directly on that side.
    const leftBlocked = tiles.some(other => !other.removed && other.z === tile.z && Math.abs(other.y - tile.y) < 0.45 && other.x < tile.x && tile.x - other.x <= 1.05);
    const rightBlocked = tiles.some(other => !other.removed && other.z === tile.z && Math.abs(other.y - tile.y) < 0.45 && other.x > tile.x && other.x - tile.x <= 1.05);

    return !leftBlocked || !rightBlocked;
  }

  function refreshTileStates() {
    boardEl.querySelectorAll(".mahjong-tile").forEach(el => {
      const id = Number(el.dataset.id);
      const tile = tileById(id);
      const open = isTileOpen(tile);
      el.classList.toggle("blocked", !open);
      el.classList.toggle("selected", selectedId === id);
      el.setAttribute("aria-disabled", String(!open));
      el.title = open ? SYMBOLS[tile.value][1] : `${SYMBOLS[tile.value][1]} (blocked)`;
    });
  }

  function handleTileClick(id) {
    if (!gameActive) return;
    const tile = tileById(id);
    if (!isTileOpen(tile)) {
      setStatus("That tile is blocked. Choose a tile with a free side and no tile above it.", "warning");
      return;
    }

    if (selectedId === null) {
      selectedId = id;
      refreshTileStates();
      setStatus(`Selected ${SYMBOLS[tile.value][1]}. Choose its matching open tile.`);
      return;
    }

    if (selectedId === id) {
      selectedId = null;
      refreshTileStates();
      setStatus("Selection cleared.");
      return;
    }

    const first = tileById(selectedId);
    moves++;

    if (first && first.value === tile.value && isTileOpen(first)) {
      removePair(first, tile);
    } else {
      selectedId = id;
      refreshTileStates();
      setStatus("Those tiles do not match. The second tile is now selected.", "warning");
      updateStats();
    }
  }

  function removePair(a, b) {
    const aEl = boardEl.querySelector(`[data-id="${a.id}"]`);
    const bEl = boardEl.querySelector(`[data-id="${b.id}"]`);
    aEl?.classList.add("removing");
    bEl?.classList.add("removing");

    const now = Date.now();
    const streakBonus = lastMatchAt && now - lastMatchAt < 7000 ? 25 : 0;
    lastMatchAt = now;
    score += 100 + streakBonus;
    matchedPairs++;
    selectedId = null;
    updateStats();
    setStatus(streakBonus ? `Match! +${100 + streakBonus} points with a streak bonus.` : "Match! +100 points.", "success");

    setTimeout(() => {
      a.removed = true;
      b.removed = true;
      renderBoard();

      if (matchedPairs === LAYOUT.length / 2) {
        finishGame();
        return;
      }

      if (!findAvailableMatches().length) {
        setStatus("No matching open pairs remain. Use Shuffle to continue.", "warning");
      }
    }, 170);
  }

  function findAvailableMatches() {
    const openTiles = tiles.filter(t => !t.removed && isTileOpen(t));
    const matches = [];
    for (let i = 0; i < openTiles.length; i++) {
      for (let j = i + 1; j < openTiles.length; j++) {
        if (openTiles[i].value === openTiles[j].value) matches.push([openTiles[i], openTiles[j]]);
      }
    }
    return matches;
  }

  function showHint() {
    if (!gameActive) return;
    const matches = findAvailableMatches();
    if (!matches.length) {
      setStatus("No open match is available right now. Try Shuffle.", "warning");
      return;
    }

    score = Math.max(0, score - 25);
    updateStats();
    const [a, b] = matches[Math.floor(Math.random() * matches.length)];
    const aEl = boardEl.querySelector(`[data-id="${a.id}"]`);
    const bEl = boardEl.querySelector(`[data-id="${b.id}"]`);
    aEl?.classList.add("hint");
    bEl?.classList.add("hint");
    setStatus("Hint highlighted an available matching pair. −25 points.");
    setTimeout(() => {
      aEl?.classList.remove("hint");
      bEl?.classList.remove("hint");
    }, 1800);
  }

  function shuffleRemaining(applyPenalty = true) {
    if (!gameActive) return;
    const remaining = tiles.filter(t => !t.removed);
    if (remaining.length < 2) return;

    selectedId = null;
    let attempts = 0;
    do {
      const values = shuffled(remaining.map(t => t.value));
      remaining.forEach((tile, i) => { tile.value = values[i]; });
      attempts++;
    } while (!findAvailableMatches().length && attempts < 100);

    if (!findAvailableMatches().length) {
      // Guaranteed fallback: force one pair onto the first two open tiles.
      const open = remaining.filter(isTileOpen);
      if (open.length >= 2) open[1].value = open[0].value;
    }

    if (applyPenalty) score = Math.max(0, score - 50);
    renderBoard();
    updateStats();
    setStatus(applyPenalty ? "Remaining tiles shuffled. −50 points." : "Board prepared with an available opening move.");
  }

  function updateStats() {
    scoreEl.textContent = String(score);
    pairsEl.textContent = String(matchedPairs);
    movesEl.textContent = String(moves);
  }

  function updateTime() {
    if (!gameActive) return;
    const seconds = Math.floor((Date.now() - startTime) / 1000);
    timeEl.textContent = formatTime(seconds);
  }

  function formatTime(totalSeconds) {
    const mins = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
    const secs = (totalSeconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  }

  function setStatus(message, state = "") {
    gameStatusEl.textContent = message;
    gameStatusEl.classList.remove("warning", "success");
    if (state) gameStatusEl.classList.add(state);
  }

  function finishGame() {
    gameActive = false;
    clearInterval(timerId);
    updateTime();
    setStatus("Board cleared. You won!", "success");
    finalScoreEl.textContent = String(score);
    finalMovesEl.textContent = String(moves);
    finalTimeEl.textContent = timeEl.textContent;
    resultModal.classList.add("open");
    resultModal.setAttribute("aria-hidden", "false");
    playAgainBtn.focus();
  }

  function closeModal() {
    resultModal.classList.remove("open");
    resultModal.setAttribute("aria-hidden", "true");
  }

  hintBtn.addEventListener("click", showHint);
  shuffleBtn.addEventListener("click", () => shuffleRemaining(true));
  newGameBtn.addEventListener("click", newGame);
  playAgainBtn.addEventListener("click", newGame);
  resultModal.addEventListener("click", e => {
    if (e.target.matches("[data-close-modal]")) closeModal();
  });
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && resultModal.classList.contains("open")) closeModal();
  });

  newGame();
})();


}
function begin(){poster.hidden=true;gm.hidden=false;if(!booted){booted=true;var s=document.createElement("style");s.textContent=LOOK;document.head.appendChild(s);boot();}else{var r=document.getElementById("shuffleBtn");if(r)r.click();}}
poster.addEventListener("click",begin);
var nb=document.getElementById("new");if(nb)nb.addEventListener("click",begin);
})();
