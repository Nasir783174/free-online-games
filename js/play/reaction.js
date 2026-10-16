/* Reaction - game logic + its own look. Layout lives in style.css; page shell lives in the HTML. */
(function(){"use strict";
var gm=document.getElementById("gm"),poster=document.getElementById("poster"),booted=false;
var LOOK=".gm{\n  \n  \n  --accent: #16b8c4;\n  --action: #ffb84d;\n  --success: #22c55e;\n  --danger: #ef5b5b;\n  --background: #f6f7fb;\n  \n  \n  \n  \n  --game: #111827;\n  --game-secondary: #1f2937;\n  \n  --radius: 18px;\n}.gm *{ box-sizing: border-box; }.gm button,.gm summary{ -webkit-tap-highlight-color: transparent; }.gm button{ font: inherit; }.gm .visually-hidden{ position: absolute !important; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0; }.gm .all-games-link{ color: var(--brand-dark); font-size: 15px; font-weight: 800; text-decoration: none; }.gm .all-games-link:hover{ text-decoration: underline; }.gm h2,.gm h3,.gm p{ margin-top: 0; }.gm h2{ margin-bottom: 18px; font-size: clamp(28px, 4vw, 36px); line-height: 1.18; letter-spacing: -.025em; }.gm h3{ margin-bottom: 8px; font-size: 21px; line-height: 1.25; }.gm .game-section{ padding-bottom: 76px; }.gm .stats-grid{ display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 16px; }.gm .stat-card{ padding: 17px 20px; background: var(--card); border: 1px solid var(--border); border-radius: 14px; }.gm .stat-label{ display: block; margin-bottom: 3px; color: var(--muted); font-size: 14px; font-weight: 700; }.gm .stat-value{ display: block; font-size: 23px; line-height: 1.2; font-variant-numeric: tabular-nums; }.gm .stat-value small{ color: var(--muted); font-size: 14px; }.gm .game-shell{ overflow: hidden; background: var(--card); border: 1px solid var(--border); border-radius: 20px; box-shadow: var(--shadow); }.gm .reaction-pad{ position: relative; isolation: isolate; width: 100%; min-height: 430px; padding: 44px 24px; display: flex; flex-direction: column; align-items: center; justify-content: center; border: 0; border-radius: 0; color: #fff; cursor: pointer; overflow: hidden; touch-action: manipulation; user-select: none; transition: background-color .18s ease, transform .1s ease; }.gm .reaction-pad:active{ transform: scale(.998); }.gm .reaction-pad:focus-visible{ outline: 4px solid var(--action); outline-offset: -6px; }.gm .reaction-pad::before,.gm .reaction-pad::after{ content: \"\"; position: absolute; z-index: -1; border: 1px solid rgba(255,255,255,.08); border-radius: 50%; }.gm .reaction-pad::before{ width: 390px; height: 390px; }.gm .reaction-pad::after{ width: 610px; height: 610px; }.gm .state-idle{ background: var(--game); }.gm .state-waiting{ background: #294c7a; cursor: wait; }.gm .state-ready{ background: #158447; }.gm .state-result{ background: var(--brand-dark); }.gm .state-false{ background: #b43b49; }.gm .state-finished{ background: #202a3c; }.gm .signal-icon{ position: relative; width: 86px; height: 86px; display: grid; place-items: center; margin-bottom: 26px; }.gm .signal-ring,.gm .signal-dot{ position: absolute; border-radius: 50%; }.gm .signal-ring{ inset: 0; border: 2px solid rgba(255,255,255,.42); }.gm .signal-dot{ width: 46px; height: 46px; background: #fff; box-shadow: 0 0 0 11px rgba(255,255,255,.12); }.gm .state-waiting .signal-dot{ width: 20px; height: 20px; }.gm .state-waiting .signal-ring{ animation: waitPulse 1.45s ease-in-out infinite; }.gm .state-ready .signal-ring{ animation: readyPulse .75s ease-out infinite; }.gm .state-ready .signal-dot{ background: #dfffea; }.gm .state-false .signal-dot{ border-radius: 12px; transform: rotate(45deg); }.gm .pad-kicker{ margin-bottom: 5px; color: rgba(255,255,255,.72); font-size: 14px; font-weight: 800; letter-spacing: .09em; text-transform: uppercase; }.gm .pad-title{ max-width: 720px; font-size: clamp(34px, 6vw, 58px); line-height: 1.06; letter-spacing: -.04em; }.gm .state-ready .pad-title{ font-size: clamp(46px, 8vw, 78px); }.gm .pad-message{ max-width: 620px; margin-top: 14px; color: rgba(255,255,255,.78); font-size: 17px; }.gm .game-toolbar{ min-height: 74px; padding: 12px 18px; display: flex; align-items: center; justify-content: space-between; gap: 18px; border-top: 1px solid var(--border); }.gm .game-hint{ display: flex; align-items: center; gap: 10px; margin: 0; color: var(--muted); font-size: 14px; }.gm .key{ padding: 3px 10px; border: 1px solid #cfd3df; border-bottom-width: 3px; border-radius: 7px; background: #fff; color: var(--text); font-size: 12px; font-weight: 800; }.gm .button{ min-height: 46px; padding: 10px 18px; border-radius: 12px; font-size: 15px; font-weight: 800; cursor: pointer; transition: background-color .16s ease, border-color .16s ease, transform .16s ease; }.gm .button:hover{ transform: translateY(-1px); }.gm .button:focus-visible,.gm summary:focus-visible{ outline: 3px solid rgba(91,92,226,.35); outline-offset: 3px; }.gm .button-secondary{ border: 1px solid var(--border); background: #fff; color: var(--text); }.gm .button-secondary:hover{ border-color: #c3c7d4; background: #fafaff; }.gm .button-primary{ border: 1px solid var(--brand); background: var(--brand); color: #fff; }.gm .button-primary:hover{ background: var(--brand-dark); border-color: var(--brand-dark); }.gm .round-progress{ padding: 0 18px 20px; display: flex; justify-content: center; gap: 9px; }.gm .round-dot{ width: 36px; height: 5px; border-radius: 99px; background: var(--border); }.gm .round-dot.complete{ background: var(--success); }.gm .round-dot.current{ background: var(--action); }.gm .results-card{ margin-top: 20px; padding: 28px; background: var(--card); border: 1px solid var(--border); border-radius: var(--radius); box-shadow: var(--shadow); }.gm .results-card[hidden]{ display: none; }.gm .results-heading{ display: flex; align-items: flex-start; justify-content: space-between; gap: 24px; padding-bottom: 20px; border-bottom: 1px solid var(--border); }.gm .results-heading h2{ margin: 0; }.gm .result-badge{ flex: 0 0 auto; padding: 7px 12px; background: #eafaf0; color: #12743b; border-radius: 99px; font-size: 14px; font-weight: 800; }.gm .result-summary{ display: grid; grid-template-columns: .9fr 1.7fr; gap: 24px; padding-block: 24px; }.gm .average-result{ padding: 23px; display: flex; flex-direction: column; justify-content: center; background: #f0f0ff; border-radius: 14px; }.gm .average-result span,.gm .result-metrics span{ color: var(--muted); font-size: 14px; font-weight: 700; }.gm .average-result strong{ color: var(--brand-dark); font-size: clamp(38px, 5vw, 56px); font-variant-numeric: tabular-nums; }.gm .result-metrics{ display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }.gm .result-metrics div{ padding: 16px; background: var(--background); border-radius: 12px; }.gm .result-metrics strong{ display: block; margin-top: 3px; font-size: 20px; font-variant-numeric: tabular-nums; }.gm .round-breakdown{ margin-bottom: 22px; }.gm .round-breakdown h3{ font-size: 17px; }.gm .round-breakdown ol{ display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px; padding: 0; margin: 0; list-style: none; }.gm .round-breakdown li{ padding: 12px; background: var(--background); border: 1px solid var(--border); border-radius: 10px; text-align: center; }.gm .round-breakdown li span{ display: block; color: var(--muted); font-size: 12px; font-weight: 700; }.gm .round-breakdown li strong{ font-size: 17px; font-variant-numeric: tabular-nums; }.gm .about-section,.gm .tips-section{ padding-block: 72px; }.gm .tips-section{ background: #fff; }.gm .section-number{ position: absolute; right: 20px; top: 4px; color: rgba(91,92,226,.09); font-size: 76px; font-weight: 800; line-height: 1; }.gm .instruction-list{ padding: 0; margin: 26px 0; list-style: none; counter-reset: steps; }.gm .instruction-list li{ display: grid; grid-template-columns: 75px 1fr; gap: 12px; padding: 13px 0; border-bottom: 1px solid rgba(91,92,226,.15); }.gm .instruction-list li:first-child{ border-top: 1px solid rgba(91,92,226,.15); }.gm .instruction-list span{ color: var(--brand-dark); font-weight: 800; }.gm .notice{ margin: 0; padding: 15px 17px; background: #fff; border-left: 4px solid var(--action); border-radius: 9px; font-size: 15px; }.gm .control-list{ display: grid; gap: 13px; margin-top: 28px; }.gm .control-list > div{ display: flex; align-items: center; gap: 14px; padding: 15px; background: #fff; border: 1px solid var(--border); border-radius: 12px; }.gm .control-list p{ margin: 1px 0 0; color: var(--muted); font-size: 14px; }.gm .control-icon{ flex: 0 0 45px; width: 45px; height: 45px; display: grid; place-items: center; background: #ececff; color: var(--brand-dark); border-radius: 11px; font-size: 23px; font-weight: 800; }.gm .control-icon-wide{ font-size: 10px; }.gm .section-heading{ max-width: 660px; margin-bottom: 34px; }.gm .section-heading h2{ margin: 0; }.gm .prose-columns{ columns: 2; column-gap: 44px; color: var(--muted); }.gm .prose-columns p{ break-inside: avoid; }.gm .tips-grid{ display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }.gm .tips-grid article{ padding: 24px; background: var(--background); border: 1px solid var(--border); border-radius: 16px; }.gm .tips-grid article > span{ color: var(--brand); font-size: 14px; font-weight: 800; }.gm .tips-grid h3{ margin-top: 15px; }.gm .tips-grid p{ margin: 0; color: var(--muted); font-size: 15px; }.gm .section-heading-row{ max-width: none; display: flex; align-items: flex-end; justify-content: space-between; gap: 24px; }.gm .coming-soon{ color: var(--muted); font-size: 14px; font-weight: 700; }@keyframes waitPulse{ 0%, 100% { transform: scale(.88); opacity: .5; } 50% { transform: scale(1); opacity: 1; } }@keyframes readyPulse{ from { transform: scale(.65); opacity: 1; } to { transform: scale(1.35); opacity: 0; } }@media (max-width: 800px){.gm .stats-grid{ grid-template-columns: repeat(2, 1fr); }.gm .result-summary{ grid-template-columns: 1fr; }.gm .tips-grid{ grid-template-columns: 1fr; }.gm .reaction-pad{ min-height: 390px; }.gm .round-breakdown ol{ grid-template-columns: repeat(5, minmax(80px, 1fr)); overflow-x: auto; padding-bottom: 5px; }}@media (max-width: 560px){.gm .game-section{ padding-bottom: 54px; }.gm .stats-grid{ gap: 9px; margin-bottom: 10px; }.gm .stat-card{ padding: 13px 14px; }.gm .stat-label{ font-size: 12px; }.gm .stat-value{ font-size: 19px; }.gm .game-shell{ border-radius: 16px; }.gm .reaction-pad{ min-height: 370px; padding: 34px 18px; }.gm .reaction-pad::before{ width: 280px; height: 280px; }.gm .reaction-pad::after{ width: 440px; height: 440px; }.gm .signal-icon{ width: 72px; height: 72px; margin-bottom: 22px; }.gm .signal-dot{ width: 38px; height: 38px; }.gm .pad-title{ font-size: 36px; }.gm .state-ready .pad-title{ font-size: 52px; }.gm .pad-message{ font-size: 15px; }.gm .game-toolbar{ align-items: stretch; flex-direction: column; gap: 11px; padding: 15px; }.gm .game-hint{ justify-content: center; }.gm .button{ width: 100%; }.gm .results-card{ padding: 20px; }.gm .results-heading{ display: block; }.gm .result-badge{ display: inline-block; margin-top: 14px; }.gm .result-metrics{ grid-template-columns: 1fr 1fr; }.gm .result-metrics div{ padding: 13px; }.gm .result-metrics strong{ font-size: 17px; }.gm .about-section,.gm .tips-section{ padding-block: 54px; }.gm .prose-columns{ columns: 1; }.gm .section-heading-row{ align-items: flex-start; flex-direction: column; }.gm .coming-soon{ display: none; }}@media (prefers-reduced-motion: reduce){.gm *,.gm *::before,.gm *::after{ animation-duration: .01ms !important; animation-iteration-count: 1 !important; transition-duration: .01ms !important; }}";
function __ready(f){f()}
function boot(){
"use strict";

const TOTAL_ROUNDS = 5;
const MIN_WAIT_MS = 1500;
const MAX_WAIT_MS = 4500;
const STORAGE_KEY = "gamesHubReactionPersonalBest";

const elements = {
  pad: document.getElementById("reactionPad"),
  padKicker: document.getElementById("padKicker"),
  padTitle: document.getElementById("padTitle"),
  padMessage: document.getElementById("padMessage"),
  roundValue: document.getElementById("roundValue"),
  lastValue: document.getElementById("lastValue"),
  bestValue: document.getElementById("bestValue"),
  personalBestValue: document.getElementById("personalBestValue"),
  restartButton: document.getElementById("restartButton"),
  playAgainButton: document.getElementById("playAgainButton"),
  resultsCard: document.getElementById("resultsCard"),
  resultBadge: document.getElementById("resultBadge"),
  averageResult: document.getElementById("averageResult"),
  fastestResult: document.getElementById("fastestResult"),
  consistencyResult: document.getElementById("consistencyResult"),
  scoreResult: document.getElementById("scoreResult"),
  falseStartResult: document.getElementById("falseStartResult"),
  roundResults: document.getElementById("roundResults"),
  liveStatus: document.getElementById("liveStatus"),
  dots: Array.from(document.querySelectorAll(".round-dot"))
};

let state = "idle";
let reactionTimes = [];
let falseStarts = 0;
let waitTimer = null;
let transitionTimer = null;
let signalStartedAt = 0;
let roundToken = 0;

function readPersonalBest() {
  try {
    const saved = Number.parseInt(localStorage.getItem(STORAGE_KEY), 10);
    return Number.isFinite(saved) && saved > 0 ? saved : null;
  } catch (error) {
    return null;
  }
}

function savePersonalBest(time) {
  try {
    localStorage.setItem(STORAGE_KEY, String(time));
  } catch (error) {
    // Storage may be disabled; gameplay remains fully functional.
  }
}

function formatTime(value) {
  return Number.isFinite(value) ? `${value} ms` : "—";
}

function announce(message) {
  elements.liveStatus.textContent = "";
  window.setTimeout(() => { elements.liveStatus.textContent = message; }, 30);
}

function setPadState(nextState, kicker, title, message) {
  state = nextState;
  elements.pad.className = `reaction-pad state-${nextState}`;
  elements.padKicker.textContent = kicker;
  elements.padTitle.textContent = title;
  elements.padMessage.textContent = message;
}

function clearTimers() {
  window.clearTimeout(waitTimer);
  window.clearTimeout(transitionTimer);
  waitTimer = null;
  transitionTimer = null;
  roundToken += 1;
}

function updateStats() {
  const latest = reactionTimes.at(-1);
  const best = reactionTimes.length ? Math.min(...reactionTimes) : null;
  const personalBest = readPersonalBest();

  elements.roundValue.textContent = String(reactionTimes.length);
  elements.lastValue.textContent = formatTime(latest);
  elements.bestValue.textContent = formatTime(best);
  elements.personalBestValue.textContent = formatTime(personalBest);

  elements.dots.forEach((dot, index) => {
    dot.classList.toggle("complete", index < reactionTimes.length);
    dot.classList.toggle("current", index === reactionTimes.length && reactionTimes.length < TOTAL_ROUNDS && state !== "idle" && state !== "finished");
  });
}

function resetGame(autoStart = false) {
  clearTimers();
  reactionTimes = [];
  falseStarts = 0;
  signalStartedAt = 0;
  elements.resultsCard.hidden = true;
  setPadState("idle", "Ready to test your speed?", "Start Reaction Test", "Five rounds. One goal: react fast.");
  updateStats();
  announce("Reaction game reset. Activate the game area to start.");
  if (autoStart) startRound();
}

function startRound() {
  if (reactionTimes.length >= TOTAL_ROUNDS) {
    finishGame();
    return;
  }

  clearTimers();
  const token = roundToken;
  const roundNumber = reactionTimes.length + 1;
  const delay = Math.floor(Math.random() * (MAX_WAIT_MS - MIN_WAIT_MS + 1)) + MIN_WAIT_MS;

  setPadState("waiting", `Round ${roundNumber} of ${TOTAL_ROUNDS}`, "Wait for green…", "Do not tap yet.");
  updateStats();
  announce(`Round ${roundNumber}. Wait for the green signal.`);

  waitTimer = window.setTimeout(() => {
    if (token !== roundToken || state !== "waiting") return;
    signalStartedAt = performance.now();
    setPadState("ready", `Round ${roundNumber} of ${TOTAL_ROUNDS}`, "TAP NOW!", "Click, tap, or press Space.");
    announce("Green signal. React now!");
  }, delay);
}

function handleFalseStart() {
  falseStarts += 1;
  clearTimers();
  setPadState("false", "False start", "Too soon!", "Wait for the green signal. This round will retry.");
  updateStats();
  announce("False start. You reacted too soon. The same round will retry.");
  transitionTimer = window.setTimeout(startRound, 1200);
}

function recordReaction() {
  const elapsed = Math.max(1, Math.round(performance.now() - signalStartedAt));
  reactionTimes.push(elapsed);

  const previousBest = readPersonalBest();
  const isNewPersonalBest = previousBest === null || elapsed < previousBest;
  if (isNewPersonalBest) savePersonalBest(elapsed);

  setPadState(
    "result",
    isNewPersonalBest ? "New personal best" : `Round ${reactionTimes.length} complete`,
    formatTime(elapsed),
    reactionTimes.length < TOTAL_ROUNDS ? "Tap or press Space for the next round." : "All five rounds complete. View your report below."
  );
  updateStats();
  announce(`${elapsed} milliseconds.${isNewPersonalBest ? " New personal best." : ""}`);

  if (reactionTimes.length >= TOTAL_ROUNDS) {
    transitionTimer = window.setTimeout(finishGame, 850);
  }
}

function calculateStandardDeviation(values, average) {
  const variance = values.reduce((sum, value) => sum + Math.pow(value - average, 2), 0) / values.length;
  return Math.sqrt(variance);
}

function getRating(average) {
  if (average < 200) return { label: "Lightning fast", message: "Exceptional average speed" };
  if (average < 250) return { label: "Quick reflexes", message: "A very fast average" };
  if (average < 320) return { label: "Nice reactions", message: "A solid reaction average" };
  if (average < 450) return { label: "Good effort", message: "Keep practicing for speed" };
  return { label: "Warm up again", message: "Try another run when ready" };
}

function finishGame() {
  if (reactionTimes.length !== TOTAL_ROUNDS) return;
  clearTimers();

  const total = reactionTimes.reduce((sum, value) => sum + value, 0);
  const average = Math.round(total / TOTAL_ROUNDS);
  const fastest = Math.min(...reactionTimes);
  const deviation = Math.round(calculateStandardDeviation(reactionTimes, average));
  const score = reactionTimes.reduce((sum, value) => sum + Math.max(0, 1000 - value), 0);
  const rating = getRating(average);

  setPadState("finished", rating.message, `${average} ms average`, "Your five-round reaction report is ready.");
  updateStats();

  elements.resultBadge.textContent = rating.label;
  elements.averageResult.textContent = `${average} ms`;
  elements.fastestResult.textContent = `${fastest} ms`;
  elements.consistencyResult.textContent = `±${deviation} ms`;
  elements.scoreResult.textContent = `${score.toLocaleString()} / 5,000`;
  elements.falseStartResult.textContent = String(falseStarts);
  elements.roundResults.replaceChildren(...reactionTimes.map((time, index) => {
    const item = document.createElement("li");
    const label = document.createElement("span");
    const value = document.createElement("strong");
    label.textContent = `Round ${index + 1}`;
    value.textContent = `${time} ms`;
    item.append(label, value);
    return item;
  }));

  elements.resultsCard.hidden = false;
  announce(`Game complete. Average reaction time ${average} milliseconds. Fastest time ${fastest} milliseconds.`);
  elements.resultsCard.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "nearest" });
}

function activateGame() {
  if (state === "idle") {
    startRound();
  } else if (state === "waiting") {
    handleFalseStart();
  } else if (state === "ready") {
    recordReaction();
  } else if (state === "result" && reactionTimes.length < TOTAL_ROUNDS) {
    startRound();
  } else if (state === "finished") {
    resetGame(true);
  }
}

elements.pad.addEventListener("click", activateGame);

document.addEventListener("keydown", (event) => {
  if (event.code !== "Space" || event.repeat) return;
  const activeTag = document.activeElement?.tagName;
  const isAnotherButton = activeTag === "BUTTON" && document.activeElement !== elements.pad;
  if (activeTag === "SUMMARY" || activeTag === "A" || activeTag === "INPUT" || activeTag === "TEXTAREA" || isAnotherButton) return;
  event.preventDefault();
  activateGame();
});

elements.restartButton.addEventListener("click", () => resetGame(false));
elements.playAgainButton.addEventListener("click", () => {
  resetGame(true);
  elements.pad.focus({ preventScroll: true });
  elements.pad.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "center" });
});

document.addEventListener("visibilitychange", () => {
  if (document.hidden && (state === "waiting" || state === "ready")) {
    clearTimers();
    setPadState("idle", "Round paused", "Tap to continue", "The active round was canceled when the tab lost focus.");
    updateStats();
  }
});

updateStats();


}
function begin(){poster.hidden=true;gm.hidden=false;if(!booted){booted=true;var s=document.createElement("style");s.textContent=LOOK;document.head.appendChild(s);boot();}else{var r=document.getElementById("reactionPad");if(r)r.click();}}
poster.addEventListener("click",begin);
var nb=document.getElementById("new");if(nb)nb.addEventListener("click",begin);
})();
