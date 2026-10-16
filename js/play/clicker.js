/* Clicker - game logic + its own look. Layout lives in style.css; page shell lives in the HTML. */
(function(){"use strict";
var gm=document.getElementById("gm"),poster=document.getElementById("poster"),booted=false;
var LOOK=".gm{\n  \n  \n  --teal: #16b8c4;\n  --action: #ffb84d;\n  --success: #22c55e;\n  --danger: #ef5b5b;\n  \n  \n  \n  \n  \n  --game: #111827;\n  --game-2: #1f2937;\n  \n}.gm *{ box-sizing: border-box; }.gm button{ font: inherit; }.gm button{ -webkit-tap-highlight-color: transparent; }.gm .game-kicker{ display: block; color: var(--brand); text-transform: uppercase; letter-spacing: .12em; font-size: 13px; line-height: 1.3; font-weight: 800; }.gm h2,.gm h3,.gm p{ margin-top: 0; }.gm .game-card{ background: var(--card); border: 1px solid var(--border); border-radius: 20px; box-shadow: var(--shadow); padding: 24px; }.gm .game-topbar{ display: flex; align-items: center; justify-content: space-between; gap: 20px; margin-bottom: 20px; }.gm .game-topbar h2{ font-size: 28px; line-height: 1.2; margin: 5px 0 0; }.gm .sound-button,.gm .secondary-button{ min-height: 44px; border: 1px solid var(--border); background: #fff; color: var(--text); border-radius: 12px; padding: 0 15px; font-weight: 800; cursor: pointer; }.gm .sound-button{ display: inline-flex; align-items: center; gap: 8px; }.gm .sound-button:hover,.gm .secondary-button:hover{ border-color: var(--brand); color: var(--brand-dark); }.gm button:focus-visible,.gm summary:focus-visible{ outline: 3px solid rgba(91,92,226,.35); outline-offset: 3px; }.gm .stats{ display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 17px; }.gm .stat{ border: 1px solid var(--border); border-radius: 14px; padding: 13px 16px; background: #fafaff; }.gm .stat span{ display: block; color: var(--muted); font-size: 13px; line-height: 1.3; font-weight: 700; }.gm .stat strong{ display: block; font-size: 25px; line-height: 1.2; margin-top: 4px; }.gm .progress-wrap{ margin-bottom: 16px; }.gm .progress-copy{ display: flex; justify-content: space-between; color: var(--muted); font-size: 13px; font-weight: 700; margin-bottom: 6px; }.gm .progress-track{ height: 9px; overflow: hidden; background: #ececf5; border-radius: 100px; }.gm .progress-track span{ display: block; width: 0; height: 100%; background: var(--success); border-radius: inherit; transition: width .2s ease; }.gm .arena{ position: relative; min-height: 470px; overflow: hidden; display: grid; place-items: center; background: radial-gradient(circle at 50% 42%, #28364f 0, var(--game) 58%); border-radius: 18px; isolation: isolate; touch-action: manipulation; user-select: none; }.gm .arena-pattern{ position: absolute; inset: 0; opacity: .18; background-image: radial-gradient(circle, #8f9bad 1px, transparent 1px); background-size: 24px 24px; z-index: -1; }.gm .tap-target{ position: relative; width: 190px; height: 190px; border: 0; border-radius: 50%; color: white; background: transparent; cursor: pointer; display: grid; place-items: center; transition: transform .08s ease; }.gm .tap-target:not(:disabled):active,.gm .tap-target.is-hit{ transform: scale(.94); }.gm .tap-target:disabled{ cursor: default; }.gm .target-core{ position: relative; z-index: 2; width: 136px; height: 136px; display: flex; flex-direction: column; align-items: center; justify-content: center; border-radius: 50%; background: linear-gradient(145deg, #7374ef, var(--brand-dark)); border: 5px solid rgba(255,255,255,.13); box-shadow: 0 14px 30px rgba(41,42,150,.46), inset 0 3px 9px rgba(255,255,255,.2); }.gm .target-value{ font-size: 26px; font-weight: 800; line-height: 1; }.gm .target-label{ margin-top: 8px; font-size: 16px; font-weight: 800; letter-spacing: .13em; }.gm .target-ring{ position: absolute; border-radius: 50%; border: 2px solid rgba(131,132,250,.45); }.gm .ring-one{ inset: 10px; }.gm .ring-two{ inset: 0; opacity: .5; }.gm .tap-target:not(:disabled) .ring-one{ animation: breathe 1.5s ease-in-out infinite; }.gm .bonus-target{ position: absolute; z-index: 4; width: 78px; height: 78px; border: 3px solid #fff4cf; border-radius: 50%; color: #54330a; background: var(--action); box-shadow: 0 9px 24px rgba(255,184,77,.36); cursor: pointer; animation: bonus-in .2s ease-out, bonus-pulse .7s ease-in-out infinite alternate; }.gm .bonus-target span{ display: block; font-size: 25px; line-height: 1; }.gm .bonus-target small{ display: block; font-size: 12px; font-weight: 800; }.gm .combo-timer{ position: absolute; top: 18px; left: 50%; width: min(280px, 62%); height: 5px; transform: translateX(-50%); background: rgba(255,255,255,.12); border-radius: 10px; overflow: hidden; opacity: 0; transition: opacity .2s; }.gm .combo-timer.is-active{ opacity: 1; }.gm .combo-timer span{ display: block; width: 100%; height: 100%; transform-origin: left; background: var(--action); }.gm .arena-hint{ position: absolute; left: 20px; right: 20px; bottom: 14px; color: #aeb8c8; text-align: center; font-size: 14px; font-weight: 700; margin: 0; }.gm .point-pop{ position: absolute; z-index: 5; color: white; font-size: 22px; font-weight: 800; pointer-events: none; animation: score-pop .72s ease-out forwards; text-shadow: 0 2px 8px #000; }.gm .game-overlay{ position: absolute; inset: 0; z-index: 10; display: none; place-items: center; padding: 22px; background: rgba(7,12,24,.76); backdrop-filter: blur(5px); }.gm .game-overlay.is-visible{ display: grid; }.gm .overlay-panel{ width: min(430px, 100%); text-align: center; color: white; }.gm .overlay-icon{ width: 64px; height: 64px; display: grid; place-items: center; margin: 0 auto 18px; background: var(--action); color: #3e2806; border-radius: 18px; font-size: 30px; }.gm .overlay-panel h3{ font-size: 28px; line-height: 1.2; margin-bottom: 10px; }.gm .overlay-panel p{ color: #cdd5e1; margin-bottom: 22px; }.gm .primary-button{ min-height: 50px; padding: 0 24px; border: 0; border-radius: 13px; color: white; background: var(--brand); font-weight: 800; cursor: pointer; box-shadow: 0 8px 18px rgba(91,92,226,.32); }.gm .primary-button:hover{ background: #6869ec; }.gm .game-actions{ display: flex; justify-content: space-between; align-items: center; gap: 20px; padding-top: 17px; }.gm .game-actions p{ margin: 0; color: var(--muted); font-size: 14px; }.gm .steps{ list-style: none; padding: 0; margin: 0; display: grid; gap: 18px; }.gm .steps li{ display: flex; gap: 14px; }.gm .steps li > span{ flex: 0 0 36px; height: 36px; display: grid; place-items: center; color: white; background: var(--brand); border-radius: 10px; font-weight: 800; }.gm .steps strong{ display: block; }.gm .steps p{ color: var(--muted); margin: 2px 0 0; font-size: 15px; line-height: 1.55; }.gm .tip-card{ background: #f0f8f8; border-color: #cdeced; }.gm .card-icon{ display: grid; place-items: center; width: 46px; height: 46px; color: white; background: var(--teal); border-radius: 13px; font-size: 22px; margin-bottom: 18px; }.gm .tip-card p{ color: #475467; font-size: 16px; }.gm .section-heading{ display: flex; align-items: end; justify-content: space-between; gap: 20px; }.gm .section-heading h2{ margin: 5px 0 0; }.gm .coming-note{ color: var(--muted); font-size: 14px; font-weight: 700; }.gm .purple{ background: var(--brand); }.gm .teal{ background: var(--teal); }.gm .orange{ background: #ed8d35; }.gm .soon{ position: absolute; top: 10px; right: 10px; color: var(--muted); background: var(--bg); border-radius: 20px; padding: 2px 8px; font-size: 11px; font-weight: 800; }.gm details{ background: white; border: 1px solid var(--border); border-radius: 14px; margin-bottom: 12px; padding: 0 20px; }.gm summary{ cursor: pointer; list-style: none; padding: 18px 34px 18px 0; font-weight: 800; position: relative; }.gm summary::-webkit-details-marker{ display: none; }.gm summary::after{ content: \"+\"; position: absolute; right: 0; color: var(--brand); font-size: 24px; line-height: 1; }.gm details[open] summary::after{ content: \"\u2212\"; }.gm details p{ color: var(--muted); margin: -4px 0 18px; }.gm .sr-only{ position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; }@keyframes breathe{ 50% { transform: scale(1.06); opacity: .72; } }@keyframes bonus-in{ from { transform: scale(.4); opacity: 0; } }@keyframes bonus-pulse{ to { transform: scale(1.08); } }@keyframes score-pop{ 0% { transform: translate(-50%,0) scale(.7); opacity: 0; } 18% { opacity: 1; } 100% { transform: translate(-50%,-70px) scale(1.08); opacity: 0; } }@media (max-width: 760px){.gm .game-card{ padding: 14px; border-radius: 17px; }.gm .game-topbar{ align-items: flex-start; }.gm .game-topbar h2{ font-size: 21px; }.gm .sound-button{ width: 44px; padding: 0; justify-content: center; }.gm #sound-label{ display: none; }.gm .stats{ grid-template-columns: repeat(2, 1fr); gap: 8px; }.gm .stat{ padding: 10px 12px; }.gm .stat strong{ font-size: 22px; }.gm .arena{ min-height: 420px; border-radius: 15px; }.gm .tap-target{ width: 180px; height: 180px; }.gm .game-actions{ align-items: stretch; flex-direction: column; gap: 12px; }.gm .secondary-button{ width: 100%; }.gm .section-heading{ align-items: flex-start; flex-direction: column; gap: 5px; }}@media (max-width: 380px){.gm .arena{ min-height: 390px; }.gm .tap-target{ width: 165px; height: 165px; }.gm .target-core{ width: 122px; height: 122px; }}@media (prefers-reduced-motion: reduce){.gm *,.gm *::before,.gm *::after{ scroll-behavior: auto !important; animation-duration: .01ms !important; animation-iteration-count: 1 !important; transition-duration: .01ms !important; }}";
function __ready(f){f()}
function boot(){
"use strict";

const ROUND_SECONDS = 45;
const GOAL_SCORE = 250;
const COMBO_WINDOW = 1200;
const BONUS_POINTS = 25;

const elements = {
  score: document.getElementById("score"),
  time: document.getElementById("time"),
  combo: document.getElementById("combo"),
  best: document.getElementById("best"),
  goalLabel: document.getElementById("goal-label"),
  progressText: document.getElementById("progress-text"),
  progressTrack: document.getElementById("progress-track"),
  progressFill: document.getElementById("progress-fill"),
  arena: document.getElementById("arena"),
  tapTarget: document.getElementById("tap-target"),
  targetValue: document.getElementById("target-value"),
  bonusTarget: document.getElementById("bonus-target"),
  comboTimer: document.getElementById("combo-timer"),
  comboTimerFill: document.getElementById("combo-timer-fill"),
  arenaHint: document.getElementById("arena-hint"),
  overlay: document.getElementById("game-overlay"),
  overlayIcon: document.getElementById("overlay-icon"),
  overlayTitle: document.getElementById("overlay-title"),
  overlayMessage: document.getElementById("overlay-message"),
  startButton: document.getElementById("start-button"),
  restartButton: document.getElementById("restart-button"),
  soundToggle: document.getElementById("sound-toggle"),
  soundIcon: document.getElementById("sound-icon"),
  soundLabel: document.getElementById("sound-label"),
  liveStatus: document.getElementById("live-status")
};

let score = 0;
let bestScore = loadBestScore();
let timeLeft = ROUND_SECONDS;
let comboCount = 0;
let multiplier = 1;
let lastTapTime = 0;
let state = "idle";
let soundEnabled = true;
let roundTimer = null;
let comboFrame = null;
let bonusShowTimer = null;
let bonusHideTimer = null;
let audioContext = null;

function loadBestScore() {
  try {
    return Number.parseInt(localStorage.getItem("clickRushBest"), 10) || 0;
  } catch (error) {
    return 0;
  }
}

function saveBestScore() {
  if (score <= bestScore) return;
  bestScore = score;
  try {
    localStorage.setItem("clickRushBest", String(bestScore));
  } catch (error) {
    // The game remains fully playable when browser storage is unavailable.
  }
}

function initializeDisplay() {
  elements.goalLabel.textContent = GOAL_SCORE;
  elements.progressTrack.setAttribute("aria-valuemax", GOAL_SCORE);
  elements.best.textContent = bestScore;
  updateDisplay();
}

function updateDisplay() {
  elements.score.textContent = score;
  elements.time.textContent = timeLeft;
  elements.combo.textContent = `×${multiplier}`;
  elements.targetValue.textContent = `+${multiplier}`;
  elements.best.textContent = bestScore;
  elements.progressText.textContent = `${Math.min(score, GOAL_SCORE)} / ${GOAL_SCORE}`;
  elements.progressTrack.setAttribute("aria-valuenow", Math.min(score, GOAL_SCORE));
  elements.progressFill.style.width = `${Math.min(100, (score / GOAL_SCORE) * 100)}%`;
}

function startGame() {
  clearGameTimers();
  score = 0;
  timeLeft = ROUND_SECONDS;
  comboCount = 0;
  multiplier = 1;
  lastTapTime = 0;
  state = "running";
  elements.overlay.classList.remove("is-visible");
  elements.tapTarget.disabled = false;
  elements.bonusTarget.hidden = true;
  elements.arenaHint.textContent = "Keep tapping quickly to hold your combo";
  elements.liveStatus.textContent = "Game started. Reach 250 points in 45 seconds.";
  updateDisplay();
  scheduleBonus();
  startComboAnimation();

  roundTimer = window.setInterval(() => {
    timeLeft -= 1;
    updateDisplay();
    if (timeLeft === 10) {
      elements.liveStatus.textContent = "10 seconds remaining.";
      playTone(500, 0.08);
    }
    if (timeLeft <= 0) endGame(score >= GOAL_SCORE);
  }, 1000);

  elements.tapTarget.focus({ preventScroll: true });
}

function registerTap(event) {
  if (state !== "running") return;
  const now = performance.now();
  comboCount = now - lastTapTime <= COMBO_WINDOW ? comboCount + 1 : 1;
  lastTapTime = now;
  multiplier = Math.min(5, 1 + Math.floor(comboCount / 6));
  score += multiplier;
  saveBestScore();
  updateDisplay();
  showPointPop(event, `+${multiplier}`);
  animateTarget();
  playTone(235 + multiplier * 45, 0.035);

  if (score >= GOAL_SCORE) endGame(true);
}

function collectBonus(event) {
  if (state !== "running" || elements.bonusTarget.hidden) return;
  event.stopPropagation();
  score += BONUS_POINTS;
  saveBestScore();
  updateDisplay();
  showPointPop(event, `+${BONUS_POINTS}`);
  elements.bonusTarget.hidden = true;
  window.clearTimeout(bonusHideTimer);
  playTone(760, 0.14);
  elements.liveStatus.textContent = `Golden bonus collected. Score ${score}.`;
  if (score >= GOAL_SCORE) endGame(true);
  else scheduleBonus();
}

function showPointPop(event, text) {
  const arenaRect = elements.arena.getBoundingClientRect();
  const fallbackRect = elements.tapTarget.getBoundingClientRect();
  const clientX = event.clientX || fallbackRect.left + fallbackRect.width / 2;
  const clientY = event.clientY || fallbackRect.top + fallbackRect.height / 2;
  const pop = document.createElement("span");
  pop.className = "point-pop";
  pop.textContent = text;
  pop.style.left = `${clientX - arenaRect.left}px`;
  pop.style.top = `${clientY - arenaRect.top}px`;
  elements.arena.appendChild(pop);
  window.setTimeout(() => pop.remove(), 750);
}

function animateTarget() {
  elements.tapTarget.classList.remove("is-hit");
  void elements.tapTarget.offsetWidth;
  elements.tapTarget.classList.add("is-hit");
  window.setTimeout(() => elements.tapTarget.classList.remove("is-hit"), 90);
}

function startComboAnimation() {
  function frame() {
    if (state !== "running") return;
    const elapsed = performance.now() - lastTapTime;
    const active = lastTapTime > 0 && elapsed < COMBO_WINDOW;
    elements.comboTimer.classList.toggle("is-active", active);
    elements.comboTimerFill.style.transform = `scaleX(${active ? Math.max(0, 1 - elapsed / COMBO_WINDOW) : 0})`;

    if (!active && multiplier !== 1) {
      comboCount = 0;
      multiplier = 1;
      updateDisplay();
    }
    comboFrame = requestAnimationFrame(frame);
  }
  comboFrame = requestAnimationFrame(frame);
}

function scheduleBonus() {
  window.clearTimeout(bonusShowTimer);
  bonusShowTimer = window.setTimeout(showBonus, 3500 + Math.random() * 3500);
}

function showBonus() {
  if (state !== "running") return;
  const arenaRect = elements.arena.getBoundingClientRect();
  const size = 78;
  const margin = 20;
  const maxX = Math.max(margin, arenaRect.width - size - margin);
  const maxY = Math.max(70, arenaRect.height - size - 58);
  let x = margin + Math.random() * Math.max(0, maxX - margin);
  let y = 65 + Math.random() * Math.max(0, maxY - 65);

  const centerX = arenaRect.width / 2;
  const centerY = arenaRect.height / 2;
  if (Math.hypot(x + size / 2 - centerX, y + size / 2 - centerY) < 135) {
    x = x < centerX ? maxX : margin;
  }

  elements.bonusTarget.style.left = `${x}px`;
  elements.bonusTarget.style.top = `${y}px`;
  elements.bonusTarget.hidden = false;
  elements.liveStatus.textContent = "Golden bonus appeared.";

  bonusHideTimer = window.setTimeout(() => {
    elements.bonusTarget.hidden = true;
    scheduleBonus();
  }, 2100);
}

function endGame(won) {
  if (state !== "running") return;
  state = won ? "won" : "lost";
  clearGameTimers();
  saveBestScore();
  updateDisplay();
  elements.tapTarget.disabled = true;
  elements.bonusTarget.hidden = true;
  elements.comboTimer.classList.remove("is-active");
  elements.overlayIcon.textContent = won ? "★" : "↻";
  elements.overlayTitle.textContent = won ? "Goal reached!" : "Time is up";
  elements.overlayMessage.textContent = won
    ? `You scored ${score} points with ${timeLeft} seconds left. Can you beat your best score?`
    : `You scored ${score} points. Reach ${GOAL_SCORE} next round to win.`;
  elements.startButton.textContent = "Play Again";
  elements.overlay.classList.add("is-visible");
  elements.liveStatus.textContent = won ? `You won with ${score} points.` : `Game over. Final score ${score}.`;
  playTone(won ? 660 : 165, won ? 0.22 : 0.28);
  elements.startButton.focus({ preventScroll: true });
}

function clearGameTimers() {
  window.clearInterval(roundTimer);
  window.clearTimeout(bonusShowTimer);
  window.clearTimeout(bonusHideTimer);
  if (comboFrame) cancelAnimationFrame(comboFrame);
  roundTimer = null;
  comboFrame = null;
}

function playTone(frequency, duration) {
  if (!soundEnabled) return;
  try {
    audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.type = "sine";
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(0.055, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + duration);
  } catch (error) {
    soundEnabled = false;
    updateSoundButton();
  }
}

function toggleSound() {
  soundEnabled = !soundEnabled;
  updateSoundButton();
  if (soundEnabled) playTone(440, 0.08);
}

function updateSoundButton() {
  elements.soundToggle.setAttribute("aria-pressed", String(!soundEnabled));
  elements.soundToggle.setAttribute("aria-label", soundEnabled ? "Mute game sounds" : "Turn on game sounds");
  elements.soundIcon.textContent = soundEnabled ? "♪" : "×";
  elements.soundLabel.textContent = soundEnabled ? "Sound on" : "Sound off";
}

elements.tapTarget.addEventListener("click", registerTap);
elements.bonusTarget.addEventListener("click", collectBonus);
elements.startButton.addEventListener("click", startGame);
elements.restartButton.addEventListener("click", startGame);
elements.soundToggle.addEventListener("click", toggleSound);

document.addEventListener("keydown", (event) => {
  if (state !== "running" || (event.code !== "Space" && event.code !== "Enter")) return;
  if (event.target.matches("button, a, summary")) return;
  event.preventDefault();
  const rect = elements.tapTarget.getBoundingClientRect();
  registerTap({ clientX: rect.left + rect.width / 2, clientY: rect.top + rect.height / 2 });
});

document.addEventListener("visibilitychange", () => {
  if (document.hidden && state === "running") {
    endGame(false);
    elements.overlayTitle.textContent = "Round paused too long";
    elements.overlayMessage.textContent = "The round ended when the tab became inactive. Start again when you are ready.";
  }
});

initializeDisplay();


}
function begin(){poster.hidden=true;gm.hidden=false;if(!booted){booted=true;var s=document.createElement("style");s.textContent=LOOK;document.head.appendChild(s);boot();}else{var r=document.getElementById("start-button");if(r)r.click();}}
poster.addEventListener("click",begin);
var nb=document.getElementById("new");if(nb)nb.addEventListener("click",begin);
})();
