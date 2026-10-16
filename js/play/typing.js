/* Typing - game logic + its own look. Layout lives in style.css; page shell lives in the HTML. */
(function(){"use strict";
var gm=document.getElementById("gm"),poster=document.getElementById("poster"),booted=false;
var LOOK=".gm{\n  --primary: #5B5CE2;\n  --primary-dark: #4546B8;\n  --secondary: #16B8C4;\n  --action: #FFB84D;\n  --success: #22C55E;\n  --danger: #EF5B5B;\n  \n  \n  \n  \n  \n  --game: #111827;\n  --game-secondary: #1F2937;\n  --white: #FFFFFF;\n  --radius: 18px;\n  \n}.gm *{\n  box-sizing: border-box;\n}.gm button,.gm input{\n  font: inherit;\n}.gm button{\n  cursor: pointer;\n}.gm button:focus-visible,.gm input:focus-visible,.gm .game-stage:focus-visible,.gm summary:focus-visible{\n  outline: 3px solid rgba(91, 92, 226, 0.35);\n  outline-offset: 3px;\n}.gm .page-shell{\n  width: min(1120px, calc(100% - 40px));\n  margin: 0 auto;\n  padding: 28px 0 80px;\n}.gm h2,.gm h3,.gm p{\n  margin-top: 0;\n}.gm .best-card{\n  flex: 0 0 150px;\n  padding: 16px 20px;\n  background: var(--card);\n  border: 1px solid var(--border);\n  border-radius: 16px;\n  box-shadow: var(--shadow);\n  text-align: center;\n}.gm .best-card span,.gm .stat span,.gm .result-grid span{\n  display: block;\n  color: var(--muted);\n  font-size: 13px;\n  font-weight: 700;\n}.gm .best-card strong{\n  display: block;\n  margin-top: 2px;\n  color: var(--primary);\n  font-size: 28px;\n  line-height: 1.2;\n}.gm .game-card{\n  overflow: hidden;\n  background: var(--card);\n  border: 1px solid var(--border);\n  border-radius: 20px;\n  box-shadow: var(--shadow);\n}.gm .game-toolbar{\n  min-height: 78px;\n  padding: 12px 18px;\n  display: grid;\n  grid-template-columns: repeat(5, 1fr);\n  gap: 10px;\n  border-bottom: 1px solid var(--border);\n  background: #FCFCFE;\n}.gm .stat{\n  min-width: 0;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  flex-direction: column;\n  border-right: 1px solid var(--border);\n}.gm .stat:last-child{\n  border-right: 0;\n}.gm .stat strong{\n  font-size: 22px;\n  line-height: 1.15;\n  font-weight: 800;\n}.gm .stat-wide strong{\n  color: var(--secondary);\n}.gm .game-stage-wrap{\n  padding: 18px;\n  background: var(--game-secondary);\n}.gm .game-stage{\n  position: relative;\n  height: min(68vh, 620px);\n  min-height: 430px;\n  overflow: hidden;\n  background:\n    linear-gradient(rgba(255, 255, 255, 0.025) 1px, transparent 1px),\n    linear-gradient(90deg, rgba(255, 255, 255, 0.025) 1px, transparent 1px),\n    var(--game);\n  background-size: 40px 40px;\n  border-radius: 14px;\n  border: 1px solid rgba(255, 255, 255, 0.08);\n  box-shadow: inset 0 0 50px rgba(0, 0, 0, 0.22);\n}.gm .stage-topline{\n  position: absolute;\n  z-index: 6;\n  top: 16px;\n  left: 18px;\n  right: 18px;\n  display: flex;\n  justify-content: space-between;\n  color: rgba(255, 255, 255, 0.72);\n  font-size: 13px;\n  font-weight: 800;\n  pointer-events: none;\n}.gm #statusLabel{\n  color: rgba(255, 255, 255, 0.55);\n}.gm .word-layer{\n  position: absolute;\n  inset: 0;\n  overflow: hidden;\n}.gm .falling-word{\n  position: absolute;\n  z-index: 3;\n  padding: 8px 12px;\n  border: 1px solid rgba(255, 255, 255, 0.12);\n  border-radius: 10px;\n  background: rgba(31, 41, 55, 0.96);\n  color: rgba(255, 255, 255, 0.88);\n  font-size: clamp(15px, 2vw, 19px);\n  font-weight: 800;\n  line-height: 1;\n  white-space: nowrap;\n  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.18);\n  transition: transform 0.12s ease, background 0.12s ease, border-color 0.12s ease;\n}.gm .falling-word.target{\n  border-color: rgba(255, 184, 77, 0.7);\n  background: rgba(91, 92, 226, 0.98);\n  color: white;\n  box-shadow: 0 7px 22px rgba(91, 92, 226, 0.28);\n}.gm .falling-word.matched{\n  animation: matched 0.22s ease forwards;\n}@keyframes matched{\n  to {\n    opacity: 0;\n    transform: scale(1.25);\n  }\n}.gm .danger-line{\n  position: absolute;\n  z-index: 2;\n  left: 0;\n  right: 0;\n  bottom: 54px;\n  height: 2px;\n  background: rgba(239, 91, 91, 0.7);\n  box-shadow: 0 0 16px rgba(239, 91, 91, 0.18);\n}.gm .danger-line::after{\n  content: \"DANGER\";\n  position: absolute;\n  right: 14px;\n  bottom: 6px;\n  color: rgba(239, 91, 91, 0.68);\n  font-size: 10px;\n  font-weight: 800;\n  letter-spacing: 0.08em;\n}.gm .game-overlay{\n  position: absolute;\n  z-index: 10;\n  inset: 0;\n  display: grid;\n  place-items: center;\n  padding: 24px;\n  background: rgba(17, 24, 39, 0.78);\n  backdrop-filter: blur(4px);\n}.gm .hidden{\n  display: none !important;\n}.gm .overlay-panel{\n  width: min(420px, 100%);\n  padding: 30px;\n  background: var(--card);\n  border-radius: 18px;\n  box-shadow: 0 24px 70px rgba(0, 0, 0, 0.3);\n  text-align: center;\n}.gm .overlay-icon{\n  width: 54px;\n  height: 54px;\n  margin: 0 auto 14px;\n  display: grid;\n  place-items: center;\n  border-radius: 15px;\n  background: rgba(91, 92, 226, 0.1);\n  color: var(--primary);\n  font-size: 28px;\n  font-weight: 800;\n}.gm .danger-icon{\n  background: rgba(239, 91, 91, 0.1);\n  color: var(--danger);\n}.gm .overlay-panel h2{\n  margin-bottom: 8px;\n  font-size: 30px;\n  line-height: 1.15;\n}.gm .overlay-panel p{\n  margin-bottom: 20px;\n  color: var(--muted);\n}.gm .primary-button,.gm .secondary-button{\n  min-height: 48px;\n  padding: 0 20px;\n  border-radius: 11px;\n  font-size: 16px;\n  font-weight: 800;\n  transition: transform 0.12s ease, background 0.12s ease;\n}.gm .primary-button{\n  border: 1px solid var(--primary);\n  background: var(--primary);\n  color: white;\n}.gm .primary-button:hover{\n  background: var(--primary-dark);\n  transform: translateY(-1px);\n}.gm .secondary-button{\n  border: 1px solid var(--border);\n  background: white;\n  color: var(--text);\n}.gm .secondary-button:hover:not(:disabled){\n  background: #F7F7FA;\n}.gm .primary-button:disabled,.gm .secondary-button:disabled{\n  cursor: not-allowed;\n  opacity: 0.5;\n}.gm .result-grid{\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 8px;\n  margin: 20px 0;\n}.gm .result-grid > div{\n  padding: 10px;\n  border: 1px solid var(--border);\n  border-radius: 10px;\n}.gm .result-grid strong{\n  display: block;\n  font-size: 20px;\n}.gm .typing-panel{\n  padding: 20px;\n  border-top: 1px solid var(--border);\n}.gm .typing-panel label{\n  display: block;\n  margin-bottom: 8px;\n  font-size: 14px;\n  font-weight: 800;\n}.gm .input-row{\n  display: flex;\n  gap: 10px;\n}.gm #typingInput{\n  width: 100%;\n  min-width: 0;\n  height: 52px;\n  padding: 0 15px;\n  border: 2px solid var(--border);\n  border-radius: 11px;\n  background: white;\n  color: var(--text);\n  font-size: 18px;\n  font-weight: 700;\n  transition: border-color 0.15s ease, box-shadow 0.15s ease;\n}.gm #typingInput:focus{\n  border-color: var(--primary);\n  box-shadow: 0 0 0 4px rgba(91, 92, 226, 0.1);\n  outline: none;\n}.gm #typingInput:disabled{\n  background: #F6F7FB;\n}.gm .input-help{\n  margin: 8px 0 0;\n  color: var(--muted);\n  font-size: 13px;\n}.gm kbd{\n  padding: 2px 6px;\n  border: 1px solid var(--border);\n  border-bottom-width: 2px;\n  border-radius: 5px;\n  background: #F6F7FB;\n  font-size: 12px;\n  font-weight: 800;\n}.gm .instruction-grid{\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 18px;\n  margin-top: 24px;\n}.gm .instruction-grid article{\n  padding: 22px;\n  background: var(--card);\n  border: 1px solid var(--border);\n  border-radius: 16px;\n}.gm .instruction-grid h3{\n  margin-bottom: 7px;\n  font-size: 20px;\n}.gm .instruction-grid p{\n  margin-bottom: 0;\n  color: var(--muted);\n  font-size: 16px;\n}.gm .tips-section ul{\n  max-width: 800px;\n  margin: 0;\n  padding-left: 22px;\n  color: var(--muted);\n}.gm .tips-section li + li{\n  margin-top: 8px;\n}@media (max-width: 760px){.gm .page-shell{\n    width: min(100% - 28px, 1120px);\n  }.gm .page-shell{\n    padding-top: 20px;\n  }.gm .best-card{\n    align-self: flex-start;\n    flex-basis: auto;\n    min-width: 145px;\n  }.gm .game-toolbar{\n    grid-template-columns: repeat(4, 1fr);\n    padding: 10px 8px;\n  }.gm .stat{\n    border-right: 0;\n  }.gm .stat-wide{\n    grid-column: span 4;\n    flex-direction: row;\n    gap: 8px;\n    border-top: 1px solid var(--border);\n    padding-top: 8px;\n  }.gm .stat strong{\n    font-size: 20px;\n  }.gm .game-stage-wrap{\n    padding: 10px;\n  }.gm .game-stage{\n    height: 68vh;\n    min-height: 390px;\n  }.gm .falling-word{\n    padding: 7px 9px;\n    font-size: 15px;\n  }.gm .typing-panel{\n    padding: 15px;\n  }.gm .input-row{\n    flex-direction: column;\n  }.gm .secondary-button{\n    width: 100%;\n  }.gm .instruction-grid{\n    grid-template-columns: 1fr;\n  }}@media (max-width: 430px){.gm .game-stage{\n    min-height: 360px;\n  }.gm .stage-topline{\n    left: 12px;\n    right: 12px;\n  }.gm .overlay-panel{\n    padding: 24px 18px;\n  }.gm .result-grid{\n    gap: 5px;\n  }.gm .result-grid > div{\n    padding: 8px 5px;\n  }}@media (prefers-reduced-motion: reduce){.gm *,.gm *::before,.gm *::after{\n    scroll-behavior: auto !important;\n    animation-duration: 0.01ms !important;\n    animation-iteration-count: 1 !important;\n    transition-duration: 0.01ms !important;\n  }}";
function __ready(f){f()}
function boot(){
(() => {
  "use strict";

  const WORDS = [
    "apple", "arrow", "beach", "black", "brain", "bright", "candle", "chair",
    "cloud", "coffee", "dance", "dream", "earth", "energy", "field", "flame",
    "flower", "forest", "friend", "garden", "glass", "green", "happy", "house",
    "jungle", "keyboard", "kitten", "light", "magic", "market", "mouse", "music",
    "ocean", "orange", "paper", "pencil", "planet", "purple", "rabbit", "river",
    "rocket", "school", "shadow", "silver", "smile", "snow", "space", "spring",
    "star", "stone", "summer", "sunny", "table", "tiger", "travel", "tree",
    "water", "window", "winter", "world", "yellow", "zebra", "adventure",
    "balance", "breathe", "capture", "curious", "discover", "evening", "freedom",
    "imagine", "journey", "lantern", "morning", "picture", "rainbow", "sunlight",
    "thunder", "village", "whisper", "wonder", "backpack", "calendar", "computer",
    "favorite", "football", "mountain", "notebook", "practice", "question",
    "remember", "sunrise", "treasure", "creative", "keyboard", "language"
  ];

  const els = {
    stage: document.getElementById("gameStage"),
    wordLayer: document.getElementById("wordLayer"),
    input: document.getElementById("typingInput"),
    clear: document.getElementById("clearButton"),
    start: document.getElementById("startButton"),
    resume: document.getElementById("resumeButton"),
    restart: document.getElementById("restartButton"),
    startOverlay: document.getElementById("startOverlay"),
    pauseOverlay: document.getElementById("pauseOverlay"),
    gameOverOverlay: document.getElementById("gameOverOverlay"),
    score: document.getElementById("score"),
    words: document.getElementById("words"),
    combo: document.getElementById("combo"),
    lives: document.getElementById("lives"),
    wpm: document.getElementById("wpm"),
    bestScore: document.getElementById("bestScore"),
    level: document.getElementById("levelLabel"),
    status: document.getElementById("statusLabel"),
    finalScore: document.getElementById("finalScore"),
    finalWords: document.getElementById("finalWords"),
    finalWpm: document.getElementById("finalWpm"),
    gameOverMessage: document.getElementById("gameOverMessage")
  };

  const state = {
    running: false,
    paused: false,
    score: 0,
    completed: 0,
    combo: 0,
    lives: 3,
    level: 1,
    words: [],
    lastTime: 0,
    spawnTimer: 0,
    spawnInterval: 1850,
    speed: 34,
    startTime: 0,
    lastInputLength: 0,
    bestScore: Number.parseInt(localStorage.getItem("typingGameBestScore") || "0", 10) || 0,
    animationId: 0
  };

  const MAX_WORDS = 7;

  els.bestScore.textContent = state.bestScore;

  function randomWord() {
    const pool = WORDS.filter(word => !state.words.some(item => item.text === word));
    const source = pool.length ? pool : WORDS;
    return source[Math.floor(Math.random() * source.length)];
  }

  function updateStats() {
    els.score.textContent = state.score;
    els.words.textContent = state.completed;
    els.combo.textContent = state.combo;
    els.lives.textContent = state.lives;
    els.lives.setAttribute("aria-label", `${state.lives} ${state.lives === 1 ? "life" : "lives"}`);
    els.level.textContent = `Level ${state.level}`;

    const elapsedMinutes = state.startTime
      ? Math.max((performance.now() - state.startTime) / 60000, 1 / 60)
      : 0;
    const typedWords = state.completed;
    const currentWpm = elapsedMinutes ? Math.round(typedWords / elapsedMinutes) : 0;
    els.wpm.textContent = currentWpm;
  }

  function createWord() {
    if (!state.running || state.paused || state.words.length >= MAX_WORDS) {
      return;
    }

    const text = randomWord();
    const node = document.createElement("div");
    node.className = "falling-word";
    node.textContent = text;

    const stageWidth = els.stage.clientWidth;
    const safeWidth = Math.max(80, stageWidth - 150);
    const left = 20 + Math.random() * safeWidth;

    node.style.left = `${Math.min(left, stageWidth - 100)}px`;
    node.style.top = "-36px";
    els.wordLayer.appendChild(node);

    state.words.push({
      id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
      text,
      y: -36,
      node,
      matched: false
    });

    refreshTarget();
  }

  function removeWord(item) {
    const index = state.words.indexOf(item);
    if (index !== -1) {
      state.words.splice(index, 1);
    }
    item.node.remove();
    refreshTarget();
  }

  function refreshTarget() {
    state.words.forEach(item => item.node.classList.remove("target"));
    const inputValue = els.input.value.trim().toLowerCase();

    if (!inputValue) {
      const nearest = state.words
        .slice()
        .sort((a, b) => b.y - a.y)[0];
      if (nearest) nearest.node.classList.add("target");
      return;
    }

    const exactPrefix = state.words
      .filter(item => item.text.startsWith(inputValue))
      .sort((a, b) => b.y - a.y);

    if (exactPrefix.length) {
      exactPrefix[0].node.classList.add("target");
    }
  }

  function submitInput() {
    if (!state.running || state.paused) return;

    const typed = els.input.value.trim().toLowerCase();
    if (!typed) return;

    const exact = state.words
      .filter(item => item.text === typed)
      .sort((a, b) => b.y - a.y)[0];

    if (exact) {
      scoreWord(exact);
      els.input.value = "";
      state.lastInputLength = 0;
      refreshTarget();
      return;
    }

    state.combo = 0;
    updateStats();
  }

  function scoreWord(item) {
    if (!state.running || item.matched) return;

    item.matched = true;
    item.node.classList.add("matched");

    const base = item.text.length * 10;
    const comboBonus = Math.min(state.combo, 10) * 5;
    const levelBonus = state.level * 3;
    state.score += base + comboBonus + levelBonus;
    state.completed += 1;
    state.combo += 1;

    const newLevel = Math.floor(state.completed / 8) + 1;
    if (newLevel > state.level) {
      state.level = newLevel;
      state.speed = 34 + (state.level - 1) * 6;
      state.spawnInterval = Math.max(760, 1850 - (state.level - 1) * 130);
      showStatus(`Level ${state.level}`);
    }

    if (state.score > state.bestScore) {
      state.bestScore = state.score;
      localStorage.setItem("typingGameBestScore", String(state.bestScore));
      els.bestScore.textContent = state.bestScore;
    }

    setTimeout(() => removeWord(item), 150);
    updateStats();
  }

  function missWord(item) {
    removeWord(item);
    state.lives -= 1;
    state.combo = 0;

    if (state.lives <= 0) {
      endGame();
    } else {
      showStatus(`${state.lives} ${state.lives === 1 ? "life" : "lives"} left`);
      updateStats();
    }
  }

  function showStatus(message) {
    els.status.textContent = message;
    clearTimeout(showStatus.timeout);
    showStatus.timeout = setTimeout(() => {
      if (state.running && !state.paused) {
        els.status.textContent = "Typing...";
      }
    }, 900);
  }

  function clearBoard() {
    state.words.forEach(item => item.node.remove());
    state.words = [];
  }

  function resetState() {
    cancelAnimationFrame(state.animationId);
    clearBoard();

    state.running = false;
    state.paused = false;
    state.score = 0;
    state.completed = 0;
    state.combo = 0;
    state.lives = 3;
    state.level = 1;
    state.lastTime = 0;
    state.spawnTimer = 0;
    state.spawnInterval = 1850;
    state.speed = 34;
    state.startTime = 0;
    state.lastInputLength = 0;

    els.input.value = "";
    els.input.disabled = true;
    els.clear.disabled = true;
    els.status.textContent = "Ready";
    els.level.textContent = "Level 1";
    updateStats();
  }

  function startGame() {
    resetState();

    state.running = true;
    state.startTime = performance.now();
    els.startOverlay.classList.add("hidden");
    els.pauseOverlay.classList.add("hidden");
    els.gameOverOverlay.classList.add("hidden");
    els.input.disabled = false;
    els.clear.disabled = false;
    els.input.placeholder = "Type a falling word...";
    els.status.textContent = "Typing...";
    els.input.focus();

    createWord();
    state.spawnTimer = 0;
    state.lastTime = performance.now();
    state.animationId = requestAnimationFrame(gameLoop);
  }

  function pauseGame() {
    if (!state.running || state.paused) return;
    state.paused = true;
    els.pauseOverlay.classList.remove("hidden");
    els.status.textContent = "Paused";
    els.input.blur();
    cancelAnimationFrame(state.animationId);
  }

  function resumeGame() {
    if (!state.running || !state.paused) return;
    state.paused = false;
    els.pauseOverlay.classList.add("hidden");
    els.status.textContent = "Typing...";
    state.lastTime = performance.now();
    els.input.focus();
    state.animationId = requestAnimationFrame(gameLoop);
  }

  function endGame() {
    if (!state.running) return;

    state.running = false;
    state.paused = false;
    cancelAnimationFrame(state.animationId);

    els.input.disabled = true;
    els.clear.disabled = true;
    els.status.textContent = "Game Over";

    const elapsedMinutes = state.startTime
      ? Math.max((performance.now() - state.startTime) / 60000, 1 / 60)
      : 0;
    const finalWpm = elapsedMinutes ? Math.round(state.completed / elapsedMinutes) : 0;

    els.finalScore.textContent = state.score;
    els.finalWords.textContent = state.completed;
    els.finalWpm.textContent = finalWpm;
    els.gameOverMessage.textContent = state.score >= state.bestScore && state.score > 0
      ? "Great run! You set or matched your best score."
      : "Your run has ended. Try again and beat your best score.";

    els.gameOverOverlay.classList.remove("hidden");
  }

  function gameLoop(now) {
    if (!state.running || state.paused) return;

    const delta = Math.min((now - state.lastTime) / 1000, 0.08);
    state.lastTime = now;

    state.spawnTimer += delta * 1000;
    if (state.spawnTimer >= state.spawnInterval) {
      state.spawnTimer = 0;
      createWord();
    }

    const dangerY = els.stage.clientHeight - 78;

    for (const item of [...state.words]) {
      if (item.matched) continue;

      item.y += state.speed * delta;
      item.node.style.top = `${item.y}px`;

      if (item.y + item.node.offsetHeight >= dangerY) {
        missWord(item);
        if (!state.running) break;
      }
    }

    updateStats();
    state.animationId = requestAnimationFrame(gameLoop);
  }

  function handleKeydown(event) {
    if (event.key === "Escape") {
      els.input.value = "";
      refreshTarget();
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      submitInput();
      return;
    }

    if (event.key.toLowerCase() === "p" && document.activeElement !== els.input) {
      if (state.running && !state.paused) pauseGame();
      else if (state.running && state.paused) resumeGame();
    }
  }

  els.input.addEventListener("input", () => {
    if (!state.running || state.paused) return;

    const current = els.input.value.toLowerCase();
    if (current.length > state.lastInputLength) {
      const matching = state.words
        .filter(item => item.text === current)
        .sort((a, b) => b.y - a.y)[0];

      if (matching) {
        scoreWord(matching);
        els.input.value = "";
        state.lastInputLength = 0;
      }
    }

    state.lastInputLength = els.input.value.length;
    refreshTarget();
  });

  els.input.addEventListener("keydown", event => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      submitInput();
    }
  });

  document.addEventListener("keydown", handleKeydown);

  els.start.addEventListener("click", startGame);
  els.restart.addEventListener("click", startGame);
  els.resume.addEventListener("click", resumeGame);

  els.clear.addEventListener("click", () => {
    els.input.value = "";
    state.lastInputLength = 0;
    refreshTarget();
    if (state.running && !state.paused) els.input.focus();
  });

  els.stage.addEventListener("click", () => {
    if (state.running && !state.paused) els.input.focus();
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden && state.running && !state.paused) {
      pauseGame();
    }
  });

  window.addEventListener("resize", () => {
    state.words.forEach(item => {
      const maxLeft = Math.max(10, els.stage.clientWidth - item.node.offsetWidth - 10);
      const currentLeft = Number.parseFloat(item.node.style.left) || 10;
      item.node.style.left = `${Math.min(currentLeft, maxLeft)}px`;
    });
  });

  resetState();
})();


}
function begin(){poster.hidden=true;gm.hidden=false;if(!booted){booted=true;var s=document.createElement("style");s.textContent=LOOK;document.head.appendChild(s);boot();}else{var r=document.getElementById("startButton");if(r)r.click();}}
poster.addEventListener("click",begin);
var nb=document.getElementById("new");if(nb)nb.addEventListener("click",begin);
})();
