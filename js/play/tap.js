/* Tap - game logic + its own look. Layout lives in style.css; page shell lives in the HTML. */
(function(){"use strict";
var gm=document.getElementById("gm"),poster=document.getElementById("poster"),booted=false;
var LOOK=".gm{\n  \n  \n  --accent: #16b8c4;\n  --action: #ffb84d;\n  --success: #22c55e;\n  --danger: #ef5b5b;\n  --background: #f6f7fb;\n  \n  \n  \n  \n  --game: #111827;\n  --game-secondary: #1f2937;\n  \n}.gm *{\n  box-sizing: border-box;\n}.gm button{\n  -webkit-tap-highlight-color: transparent;\n}.gm button{\n  font: inherit;\n}.gm :focus-visible{\n  outline: 3px solid var(--action);\n  outline-offset: 3px;\n}.gm .visually-hidden{\n  position: absolute;\n  width: 1px;\n  height: 1px;\n  padding: 0;\n  margin: -1px;\n  overflow: hidden;\n  clip: rect(0, 0, 0, 0);\n  white-space: nowrap;\n  border: 0;\n}.gm .all-games-link{\n  font-weight: 700;\n}.gm h2,.gm h3,.gm p{\n  margin-top: 0;\n}.gm h2{\n  margin-bottom: 18px;\n  font-size: clamp(28px, 4vw, 36px);\n  font-weight: 800;\n  letter-spacing: -0.025em;\n  line-height: 1.18;\n}.gm h3{\n  margin-bottom: 12px;\n  font-size: 23px;\n  line-height: 1.25;\n}.gm .game-card{\n  padding: 24px;\n  border: 1px solid var(--border);\n  border-radius: 20px;\n  background: var(--card);\n  box-shadow: var(--shadow);\n}.gm .scoreboard{\n  display: grid;\n  grid-template-columns: repeat(4, 1fr);\n  gap: 12px;\n  margin-bottom: 18px;\n}.gm .stat{\n  min-width: 0;\n  padding: 13px 16px;\n  border: 1px solid var(--border);\n  border-radius: 14px;\n  background: #fafaff;\n}.gm .stat-label{\n  display: block;\n  color: var(--muted);\n  font-size: 13px;\n  font-weight: 700;\n  letter-spacing: 0.06em;\n  line-height: 1.2;\n  text-transform: uppercase;\n}.gm .stat strong{\n  display: block;\n  overflow: hidden;\n  margin-top: 2px;\n  font-size: 25px;\n  line-height: 1.25;\n  text-overflow: ellipsis;\n}.gm .stat-unit{\n  margin-left: 2px;\n  color: var(--muted);\n  font-size: 15px;\n}.gm .arena{\n  position: relative;\n  min-height: 520px;\n  overflow: hidden;\n  border-radius: 18px;\n  background: var(--game);\n  isolation: isolate;\n  touch-action: manipulation;\n  user-select: none;\n}.gm .arena-grid{\n  position: absolute;\n  inset: 0;\n  z-index: -1;\n  opacity: 0.45;\n  background-image:\n    linear-gradient(rgba(255, 255, 255, 0.035) 1px, transparent 1px),\n    linear-gradient(90deg, rgba(255, 255, 255, 0.035) 1px, transparent 1px);\n  background-size: 34px 34px;\n  mask-image: radial-gradient(circle at center, #000 0, transparent 78%);\n}.gm .target{\n  position: absolute;\n  z-index: 3;\n  width: 76px;\n  height: 76px;\n  padding: 0;\n  border: 0;\n  border-radius: 50%;\n  background: #38bdf8;\n  box-shadow: 0 8px 0 #087aa8, 0 14px 28px rgba(56, 189, 248, 0.24);\n  cursor: pointer;\n  transform: translate3d(0, 0, 0);\n  transition: left 80ms ease-out, top 80ms ease-out, transform 80ms ease-out;\n}.gm .target::before,.gm .target::after,.gm .target-core{\n  position: absolute;\n  border-radius: 50%;\n  pointer-events: none;\n}.gm .target::before{\n  content: \"\";\n  inset: 10px;\n  border: 3px solid rgba(255, 255, 255, 0.8);\n}.gm .target::after{\n  content: \"\";\n  inset: 24px;\n  background: #fff;\n}.gm .target-core{\n  inset: 31px;\n  z-index: 1;\n  background: #0c4a6e;\n}.gm .target:hover{\n  transform: scale(1.04);\n}.gm .target:active,.gm .target.is-hit{\n  transform: scale(0.87);\n}.gm .target.bonus{\n  background: #fbbf24;\n  box-shadow: 0 8px 0 #b76e00, 0 14px 30px rgba(251, 191, 36, 0.3);\n}.gm .target.bonus .target-core{\n  background: #78350f;\n}.gm .target.decoy{\n  background: var(--danger);\n  box-shadow: 0 8px 0 #a92b3b, 0 14px 30px rgba(239, 91, 91, 0.28);\n}.gm .target.decoy::before,.gm .target.decoy::after{\n  border-radius: 4px;\n  background: #fff;\n}.gm .target.decoy::before{\n  inset: 34px 16px;\n  border: 0;\n  transform: rotate(45deg);\n}.gm .target.decoy::after{\n  inset: 34px 16px;\n  transform: rotate(-45deg);\n}.gm .target.decoy .target-core{\n  display: none;\n}.gm .game-overlay{\n  position: absolute;\n  inset: 0;\n  z-index: 6;\n  display: grid;\n  place-content: center;\n  justify-items: center;\n  padding: 28px;\n  background: rgba(17, 24, 39, 0.9);\n  color: #fff;\n  text-align: center;\n  backdrop-filter: blur(5px);\n}.gm .game-overlay[hidden]{\n  display: none;\n}.gm .game-overlay p{\n  max-width: 430px;\n  margin-bottom: 24px;\n  color: #d1d5db;\n}.gm .overlay-icon{\n  width: 68px;\n  height: 68px;\n  display: grid;\n  place-items: center;\n  margin-bottom: 18px;\n  border: 1px solid rgba(255, 255, 255, 0.14);\n  border-radius: 20px;\n  background: var(--game-secondary);\n  font-size: 32px;\n}.gm .primary-button,.gm .secondary-button{\n  min-height: 48px;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  gap: 8px;\n  padding: 10px 20px;\n  border: 0;\n  border-radius: 12px;\n  font-size: 16px;\n  font-weight: 800;\n  cursor: pointer;\n}.gm .primary-button{\n  background: var(--action);\n  color: #332000;\n  box-shadow: 0 4px 0 #c88010;\n}.gm .primary-button:active{\n  transform: translateY(2px);\n  box-shadow: 0 2px 0 #c88010;\n}.gm .secondary-button{\n  border: 1px solid var(--border);\n  background: #fff;\n  color: var(--text);\n}.gm .secondary-button:hover:not(:disabled){\n  border-color: #c9c9f3;\n  background: #f5f5ff;\n}.gm .secondary-button:disabled{\n  cursor: not-allowed;\n  opacity: 0.5;\n}.gm .game-actions{\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  margin-top: 18px;\n}.gm .status{\n  margin: 0 0 0 auto;\n  color: var(--muted);\n  font-size: 15px;\n  text-align: right;\n}.gm .feedback{\n  position: absolute;\n  z-index: 5;\n  color: #fff;\n  font-size: 20px;\n  font-weight: 800;\n  text-shadow: 0 2px 8px #000;\n  pointer-events: none;\n  animation: float-up 550ms ease-out forwards;\n}.gm .feedback.negative{\n  color: #fecaca;\n}@keyframes float-up{\n  from { opacity: 1; transform: translate(-50%, -20%); }\n  to { opacity: 0; transform: translate(-50%, -130%); }\n}.gm .instruction-card{\n  align-self: start;\n  padding: 24px;\n  border: 1px solid var(--border);\n  border-radius: 16px;\n  background: var(--card);\n}.gm .control-list{\n  margin: 0;\n}.gm .control-list div{\n  display: grid;\n  grid-template-columns: 92px 1fr;\n  gap: 14px;\n  padding: 11px 0;\n  border-top: 1px solid var(--border);\n}.gm .control-list dt{\n  font-weight: 800;\n}.gm .control-list dd{\n  margin: 0;\n  color: var(--muted);\n}.gm .about-section{\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n}.gm .tips-list{\n  padding-left: 22px;\n  color: var(--muted);\n}.gm .tips-list li + li{\n  margin-top: 9px;\n}.gm .section-heading{\n  display: flex;\n  align-items: end;\n  justify-content: space-between;\n  gap: 20px;\n  margin-bottom: 24px;\n}.gm .section-heading h2{\n  margin-bottom: 0;\n}.gm .section-heading > a{\n  flex: none;\n  font-weight: 800;\n}.gm .game-tile{\n  width: 62px;\n  height: 62px;\n  flex: none;\n  display: grid;\n  place-items: center;\n  border-radius: 14px;\n  color: #fff;\n  font-weight: 800;\n}.gm .snake-tile{ background: #15803d; }.gm .number-tile{ background: #b45309; font-size: 16px; }.gm .memory-tile{ background: #7c3aed; font-size: 26px; }.gm .noscript-message{\n  margin: 18px 0 0;\n  padding: 12px;\n  border-radius: 10px;\n  background: #fef2f2;\n  color: #991b1b;\n}@media (max-width: 760px){.gm .game-card{\n    padding: 14px;\n    border-radius: 16px;\n  }.gm .scoreboard{\n    grid-template-columns: repeat(2, 1fr);\n    gap: 8px;\n  }.gm .stat{\n    padding: 10px 12px;\n  }.gm .stat strong{\n    font-size: 22px;\n  }.gm .arena{\n    min-height: min(480px, 68vh);\n    border-radius: 14px;\n  }.gm .target{\n    width: 68px;\n    height: 68px;\n  }.gm .target::before{ inset: 9px; }.gm .target::after{ inset: 22px; }.gm .target-core{ inset: 28px; }.gm .target.decoy::before,.gm .target.decoy::after{ inset: 31px 14px; }.gm .game-actions{\n    display: grid;\n    grid-template-columns: 1fr 1fr;\n  }.gm .status{\n    grid-column: 1 / -1;\n    margin: 2px 0 0;\n    text-align: left;\n  }.gm .about-section{\n    grid-template-columns: 1fr;\n    gap: 34px;\n    padding: 64px 0;\n  }}@media (max-width: 430px){.gm .all-games-link{\n    font-size: 14px;\n  }.gm .game-overlay{\n    padding: 22px;\n  }.gm .game-overlay p{\n    font-size: 15px;\n  }.gm .section-heading{\n    align-items: start;\n    flex-direction: column;\n  }}@media (prefers-reduced-motion: reduce){.gm *,.gm *::before,.gm *::after{\n    scroll-behavior: auto !important;\n    animation-duration: 0.01ms !important;\n    animation-iteration-count: 1 !important;\n    transition-duration: 0.01ms !important;\n  }}";
function __ready(f){f()}
function boot(){
"use strict";

(() => {
  const ROUND_DURATION = 30;
  const NORMAL_POINTS = 10;
  const BONUS_POINTS = 50;
  const DECOY_PENALTY = 25;
  const STORAGE_KEY = "gamesHubTapBest";

  const elements = {
    arena: document.getElementById("arena"),
    target: document.getElementById("target"),
    score: document.getElementById("score"),
    time: document.getElementById("time"),
    combo: document.getElementById("combo"),
    best: document.getElementById("best"),
    overlay: document.getElementById("gameOverlay"),
    overlayIcon: document.getElementById("overlayIcon"),
    overlayTitle: document.getElementById("overlayTitle"),
    overlayText: document.getElementById("overlayText"),
    startButton: document.getElementById("startButton"),
    pauseButton: document.getElementById("pauseButton"),
    pauseIcon: document.getElementById("pauseIcon"),
    pauseLabel: document.getElementById("pauseLabel"),
    restartButton: document.getElementById("restartButton"),
    status: document.getElementById("status"),
    feedbackLayer: document.getElementById("feedbackLayer"),
    year: document.getElementById("year")
  };

  const state = {
    phase: "ready",
    score: 0,
    combo: 0,
    best: loadBestScore(),
    roundStartingBest: 0,
    remaining: ROUND_DURATION,
    startedAt: 0,
    pausedAt: 0,
    totalPaused: 0,
    moveTimer: null,
    frameId: null,
    targetType: "normal",
    lastPosition: null,
    autoPaused: false
  };

  function loadBestScore() {
    try {
      const stored = Number.parseInt(localStorage.getItem(STORAGE_KEY), 10);
      return Number.isFinite(stored) && stored >= 0 ? stored : 0;
    } catch (error) {
      return 0;
    }
  }

  function saveBestScore() {
    try {
      localStorage.setItem(STORAGE_KEY, String(state.best));
    } catch (error) {
      // The game remains fully playable when browser storage is unavailable.
    }
  }

  function setStatus(message) {
    elements.status.textContent = message;
  }

  function updateStats() {
    elements.score.textContent = String(state.score);
    elements.combo.textContent = String(state.combo);
    elements.best.textContent = String(state.best);
    elements.time.textContent = state.remaining.toFixed(1);
  }

  function clearTimers() {
    window.clearTimeout(state.moveTimer);
    state.moveTimer = null;
    window.cancelAnimationFrame(state.frameId);
    state.frameId = null;
  }

  function getMoveDelay() {
    const elapsed = ROUND_DURATION - state.remaining;
    return Math.max(420, 900 - elapsed * 15);
  }

  function chooseTargetType() {
    const roll = Math.random();
    if (roll < 0.14) return "decoy";
    if (roll < 0.26) return "bonus";
    return "normal";
  }

  function getTargetSize() {
    return elements.target.getBoundingClientRect().width || 76;
  }

  function pickPosition(maxX, maxY) {
    let position;
    let attempts = 0;

    do {
      position = {
        x: Math.round(Math.random() * maxX),
        y: Math.round(Math.random() * maxY)
      };
      attempts += 1;
    } while (
      state.lastPosition &&
      attempts < 8 &&
      Math.hypot(position.x - state.lastPosition.x, position.y - state.lastPosition.y) < 115
    );

    return position;
  }

  function moveTarget() {
    if (state.phase !== "running") return;

    const size = getTargetSize();
    const padding = 12;
    const maxX = Math.max(0, elements.arena.clientWidth - size - padding * 2);
    const maxY = Math.max(0, elements.arena.clientHeight - size - padding * 2);
    const position = pickPosition(maxX, maxY);

    state.lastPosition = position;
    state.targetType = chooseTargetType();

    elements.target.classList.remove("normal", "bonus", "decoy", "is-hit");
    elements.target.classList.add(state.targetType);
    elements.target.style.left = `${position.x + padding}px`;
    elements.target.style.top = `${position.y + padding}px`;

    const labels = {
      normal: "Tap target",
      bonus: "Tap gold bonus target",
      decoy: "Red decoy, do not tap"
    };
    elements.target.setAttribute("aria-label", labels[state.targetType]);

    window.clearTimeout(state.moveTimer);
    state.moveTimer = window.setTimeout(handleExpiredTarget, getMoveDelay());
  }

  function handleExpiredTarget() {
    if (state.phase !== "running") return;
    if (state.targetType !== "decoy" && state.combo > 0) {
      state.combo = 0;
      elements.combo.textContent = "0";
      setStatus("Missed target. Combo reset.");
    }
    moveTarget();
  }

  function showFeedback(text, isNegative = false) {
    const targetRect = elements.target.getBoundingClientRect();
    const arenaRect = elements.arena.getBoundingClientRect();
    const feedback = document.createElement("span");

    feedback.className = `feedback${isNegative ? " negative" : ""}`;
    feedback.textContent = text;
    feedback.style.left = `${targetRect.left - arenaRect.left + targetRect.width / 2}px`;
    feedback.style.top = `${targetRect.top - arenaRect.top}px`;
    elements.feedbackLayer.append(feedback);
    window.setTimeout(() => feedback.remove(), 600);
  }

  function handleTargetHit(event) {
    event.preventDefault();
    if (state.phase !== "running") return;

    window.clearTimeout(state.moveTimer);
    elements.target.classList.add("is-hit");

    if (state.targetType === "decoy") {
      state.score = Math.max(0, state.score - DECOY_PENALTY);
      state.combo = 0;
      showFeedback(`−${DECOY_PENALTY}`, true);
      setStatus("Decoy hit. Points lost and combo reset.");
    } else {
      state.combo += 1;
      const comboBonus = Math.min(40, Math.max(0, state.combo - 1) * 2);
      const basePoints = state.targetType === "bonus" ? BONUS_POINTS : NORMAL_POINTS;
      const points = basePoints + comboBonus;
      state.score += points;
      showFeedback(`+${points}`);
      setStatus(state.targetType === "bonus" ? "Gold bonus! Keep going." : `Great hit. Combo ×${state.combo}.`);
    }

    if (state.score > state.best) {
      state.best = state.score;
    }

    updateStats();
    window.setTimeout(moveTarget, 70);
  }

  function tick(now) {
    if (state.phase !== "running") return;

    const elapsed = (now - state.startedAt - state.totalPaused) / 1000;
    state.remaining = Math.max(0, ROUND_DURATION - elapsed);
    elements.time.textContent = state.remaining.toFixed(1);

    if (state.remaining <= 0) {
      endGame();
      return;
    }

    state.frameId = window.requestAnimationFrame(tick);
  }

  function showOverlay(title, text, buttonText, icon) {
    elements.overlayTitle.textContent = title;
    elements.overlayText.textContent = text;
    elements.startButton.textContent = buttonText;
    elements.overlayIcon.textContent = icon;
    elements.overlay.hidden = false;
  }

  function startGame() {
    clearTimers();
    state.phase = "running";
    state.score = 0;
    state.combo = 0;
    state.roundStartingBest = state.best;
    state.remaining = ROUND_DURATION;
    state.startedAt = performance.now();
    state.pausedAt = 0;
    state.totalPaused = 0;
    state.lastPosition = null;
    state.autoPaused = false;

    elements.feedbackLayer.replaceChildren();
    elements.overlay.hidden = true;
    elements.target.hidden = false;
    elements.pauseButton.disabled = false;
    elements.restartButton.disabled = false;
    elements.pauseIcon.textContent = "Ⅱ";
    elements.pauseLabel.textContent = "Pause";
    setStatus("Game started. Tap the blue and gold targets.");
    updateStats();
    moveTarget();
    state.frameId = window.requestAnimationFrame(tick);
  }

  function pauseGame(isAutomatic = false) {
    if (state.phase !== "running") return;

    state.phase = "paused";
    state.pausedAt = performance.now();
    state.autoPaused = isAutomatic;
    clearTimers();
    elements.target.hidden = true;
    elements.pauseIcon.textContent = "▶";
    elements.pauseLabel.textContent = "Resume";
    showOverlay("Game paused", "Your score and remaining time are safe.", "Resume Game", "Ⅱ");
    setStatus("Game paused.");
  }

  function resumeGame() {
    if (state.phase !== "paused") return;

    state.totalPaused += performance.now() - state.pausedAt;
    state.phase = "running";
    state.autoPaused = false;
    elements.overlay.hidden = true;
    elements.target.hidden = false;
    elements.pauseIcon.textContent = "Ⅱ";
    elements.pauseLabel.textContent = "Pause";
    setStatus("Game resumed.");
    moveTarget();
    state.frameId = window.requestAnimationFrame(tick);
  }

  function endGame() {
    if (state.phase === "over") return;

    clearTimers();
    state.phase = "over";
    state.remaining = 0;
    elements.target.hidden = true;
    elements.pauseButton.disabled = true;

    const isNewBest = state.score > state.roundStartingBest;
    if (state.score > state.best) state.best = state.score;
    saveBestScore();
    updateStats();

    const message = isNewBest
      ? `New best score: ${state.score}. Your reactions were sharp!`
      : `You scored ${state.score}. Your best is ${state.best}.`;
    showOverlay("Time’s up!", message, "Play Again", isNewBest ? "★" : "✓");
    setStatus(message);
  }

  function handleStartButton() {
    if (state.phase === "paused") {
      resumeGame();
    } else {
      startGame();
    }
  }

  function togglePause() {
    if (state.phase === "running") pauseGame();
    else if (state.phase === "paused") resumeGame();
  }

  elements.startButton.addEventListener("click", handleStartButton);
  elements.pauseButton.addEventListener("click", togglePause);
  elements.restartButton.addEventListener("click", startGame);
  elements.target.addEventListener("click", handleTargetHit);

  document.addEventListener("keydown", (event) => {
    if (event.key.toLowerCase() === "p" && !event.repeat) {
      event.preventDefault();
      togglePause();
    }
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden && state.phase === "running") {
      pauseGame(true);
    }
  });

  window.addEventListener("resize", () => {
    if (state.phase === "running") moveTarget();
  });

  elements.year.textContent = String(new Date().getFullYear());
  elements.best.textContent = String(state.best);
  updateStats();
})();


}
function begin(){poster.hidden=true;gm.hidden=false;if(!booted){booted=true;var s=document.createElement("style");s.textContent=LOOK;document.head.appendChild(s);boot();}else{var r=document.getElementById("startButton");if(r)r.click();}}
poster.addEventListener("click",begin);
var nb=document.getElementById("new");if(nb)nb.addEventListener("click",begin);
})();
