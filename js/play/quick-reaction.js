/* Quick Reaction - game logic + its own look. Layout lives in style.css; page shell lives in the HTML. */
(function(){"use strict";
var gm=document.getElementById("gm"),poster=document.getElementById("poster"),booted=false;
var LOOK=".gm{\n  --primary: #5b5ce2;\n  --primary-dark: #4546b8;\n  --secondary: #16b8c4;\n  --action: #ffb84d;\n  --success: #22c55e;\n  --danger: #ef5b5b;\n  --background: #f6f7fb;\n  \n  \n  \n  \n  --game: #111827;\n  --game-secondary: #1f2937;\n  \n}.gm *{ box-sizing: border-box; }.gm button,.gm input,.gm textarea,.gm select{ font: inherit; }.gm .visually-hidden{ position: absolute !important; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0; }.gm .all-games-link{ color: var(--primary-dark); font-weight: 700; text-decoration: none; }.gm .all-games-link:hover{ text-decoration: underline; }.gm h2,.gm h3,.gm p{ margin-top: 0; }.gm h2{ margin-bottom: 22px; font-size: clamp(28px, 3vw, 36px); font-weight: 700; letter-spacing: -0.025em; line-height: 1.2; }.gm h3{ font-size: 21px; line-height: 1.3; }.gm .game-section{ padding-bottom: 72px; }.gm .stats{ display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; margin-bottom: 18px; }.gm .stat-card{ display: flex; align-items: center; justify-content: space-between; min-height: 78px; padding: 16px 20px; border: 1px solid var(--border); border-radius: 16px; background: var(--card); }.gm .stat-card span{ color: var(--muted); font-size: 15px; font-weight: 700; }.gm .stat-card strong{ font-size: 23px; font-variant-numeric: tabular-nums; }.gm .game-shell{ overflow: hidden; border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 20px; background: var(--game); box-shadow: var(--shadow); }.gm .reaction-zone{ display: flex; min-height: 440px; padding: 46px 24px; align-items: center; justify-content: center; flex-direction: column; cursor: pointer; text-align: center; color: #fff; outline: none; touch-action: manipulation; user-select: none; -webkit-tap-highlight-color: transparent; transition: background-color 180ms ease; }.gm .reaction-zone:focus-visible{ box-shadow: inset 0 0 0 4px var(--action); }.gm .reaction-zone.state-idle{ background: var(--game); }.gm .reaction-zone.state-waiting{ background: #283446; }.gm .reaction-zone.state-go{ background: #168b47; }.gm .reaction-zone.state-false{ background: #b83d49; }.gm .reaction-zone.state-result{ background: #173958; }.gm .reaction-zone.state-complete{ background: #34358e; }.gm .signal-icon{ position: relative; display: grid; width: 104px; height: 104px; margin-bottom: 24px; place-items: center; }.gm .signal-dot{ z-index: 2; width: 40px; height: 40px; border: 6px solid rgba(255, 255, 255, 0.32); border-radius: 50%; background: #fff; }.gm .signal-ring{ position: absolute; inset: 0; border: 2px solid rgba(255, 255, 255, 0.28); border-radius: 50%; }.gm .state-waiting .signal-dot{ background: var(--action); }.gm .state-waiting .signal-ring{ animation: breathe 1.15s ease-in-out infinite; }.gm .state-go .signal-dot{ background: #fff; transform: scale(1.16); }.gm .state-go .signal-ring{ border-width: 4px; border-color: rgba(255, 255, 255, 0.72); animation: go-pulse 0.8s ease-out infinite; }.gm .state-false .signal-dot{ border-radius: 10px; transform: rotate(45deg); }.gm .state-result .signal-dot,.gm .state-complete .signal-dot{ background: var(--secondary); }.gm .zone-kicker{ margin-bottom: 7px; color: rgba(255, 255, 255, 0.72); font-size: 14px; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; }.gm .zone-message{ margin-bottom: 8px; font-size: clamp(31px, 5vw, 54px); font-weight: 800; letter-spacing: -0.035em; line-height: 1.08; }.gm .zone-hint{ margin-bottom: 0; color: rgba(255, 255, 255, 0.78); font-size: 16px; }.gm .game-actions{ display: flex; align-items: center; justify-content: center; gap: 12px; padding: 18px; border-top: 1px solid rgba(255, 255, 255, 0.1); background: var(--game-secondary); }.gm .game-actions button{ min-height: 48px; padding: 11px 20px; border: 0; border-radius: 12px; cursor: pointer; font-size: 16px; font-weight: 800; transition: transform 150ms ease, background-color 150ms ease; }.gm .game-actions button:hover:not(:disabled){ transform: translateY(-1px); }.gm .game-actions button:focus-visible{ outline: 3px solid var(--action); outline-offset: 3px; }.gm .game-actions button:disabled{ cursor: not-allowed; opacity: 0.48; }.gm .primary-button{ background: var(--action); color: #3a2700; }.gm .primary-button:hover:not(:disabled){ background: #ffc66c; }.gm .secondary-button{ background: #fff; color: var(--text); }.gm .sound-button{ display: inline-flex; align-items: center; gap: 8px; background: transparent; color: #fff; box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.28); }.gm .results-card{ grid-template-columns: repeat(3, 1fr); margin-top: 18px; overflow: hidden; border: 1px solid var(--border); border-radius: 16px; background: var(--card); }.gm .results-card:not([hidden]){ display: grid; }.gm .results-card > div{ padding: 22px; text-align: center; }.gm .results-card > div + div{ border-left: 1px solid var(--border); }.gm .result-label{ display: block; margin-bottom: 4px; color: var(--muted); font-size: 14px; font-weight: 700; }.gm .results-card strong{ font-size: 26px; font-variant-numeric: tabular-nums; }.gm .round-history{ margin-top: 18px; padding: 22px; border: 1px solid var(--border); border-radius: 16px; background: var(--card); }.gm .round-history h3{ margin-bottom: 14px; }.gm .round-history ol{ display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px; margin: 0; padding: 0; list-style: none; counter-reset: rounds; }.gm .round-history li{ padding: 11px 8px; border-radius: 10px; background: var(--background); color: var(--muted); font-size: 14px; text-align: center; counter-increment: rounds; }.gm .round-history li::before{ content: \"Round \" counter(rounds); display: block; margin-bottom: 2px; font-size: 12px; }.gm .round-history li strong{ color: var(--text); font-size: 17px; font-variant-numeric: tabular-nums; }.gm .two-column{ display: grid; grid-template-columns: 1.35fr 0.85fr; gap: 24px; }.gm .steps-list{ display: grid; gap: 20px; margin: 0; padding: 0; list-style: none; }.gm .steps-list li{ display: grid; grid-template-columns: 42px 1fr; gap: 14px; }.gm .steps-list li > span{ display: grid; width: 42px; height: 42px; place-items: center; border-radius: 13px; background: #ededff; color: var(--primary-dark); font-weight: 800; }.gm .steps-list strong{ font-size: 18px; }.gm .steps-list p{ margin-bottom: 0; color: var(--muted); }.gm .control-row{ display: flex; justify-content: space-between; gap: 18px; padding: 14px 0; border-bottom: 1px solid var(--border); }.gm .control-row span{ color: var(--muted); }.gm .controls-card > p{ margin: 22px 0 0; color: var(--muted); font-size: 15px; }.gm .text-content{ max-width: 820px; }.gm .text-content p,.gm .text-content li{ color: var(--muted); }.gm .text-content h2:not(:first-child){ margin-top: 46px; }.gm .text-content ul{ padding-left: 23px; }.gm .section-heading{ display: flex; align-items: end; justify-content: space-between; gap: 24px; margin-bottom: 24px; }.gm .section-heading h2{ margin-bottom: 0; }.gm .section-heading a{ color: var(--primary-dark); font-weight: 800; }.gm .coming-soon{ grid-column: 2; width: max-content; padding: 3px 8px; border-radius: 99px; background: var(--background); color: var(--muted); font-size: 12px; font-weight: 700; }.gm details{ border-bottom: 1px solid var(--border); }.gm summary{ position: relative; padding: 20px 38px 20px 0; cursor: pointer; font-size: 18px; font-weight: 700; list-style: none; }.gm summary::-webkit-details-marker{ display: none; }.gm summary::after{ content: \"+\"; position: absolute; right: 4px; top: 17px; color: var(--primary); font-size: 25px; line-height: 1; }.gm details[open] summary::after{ content: \"\u2212\"; }.gm details p{ padding-right: 38px; padding-bottom: 20px; }@keyframes breathe{ 50% { transform: scale(0.84); opacity: 0.42; } }@keyframes go-pulse{ from { transform: scale(0.5); opacity: 1; } to { transform: scale(1.2); opacity: 0; } }@media (prefers-reduced-motion: reduce){.gm *,.gm *::before,.gm *::after{ scroll-behavior: auto !important; animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; }}@media (max-width: 800px){.gm .stats{ gap: 10px; }.gm .stat-card{ align-items: flex-start; flex-direction: column; min-height: 84px; }.gm .two-column{ grid-template-columns: 1fr; }.gm .reaction-zone{ min-height: 390px; }}@media (max-width: 600px){.gm .game-section{ padding-bottom: 56px; }.gm .stats{ grid-template-columns: repeat(3, minmax(0, 1fr)); }.gm .stat-card{ min-width: 0; min-height: 76px; padding: 11px; border-radius: 13px; }.gm .stat-card span{ font-size: 12px; }.gm .stat-card strong{ font-size: 17px; }.gm .game-shell{ border-radius: 16px; }.gm .reaction-zone{ min-height: 350px; padding: 38px 16px; }.gm .signal-icon{ width: 86px; height: 86px; margin-bottom: 19px; }.gm .signal-dot{ width: 34px; height: 34px; }.gm .game-actions{ display: grid; grid-template-columns: 1fr 1fr; padding: 13px; }.gm .game-actions button{ width: 100%; min-height: 46px; padding-inline: 10px; font-size: 14px; }.gm .sound-button{ grid-column: 1 / -1; justify-content: center; }.gm .results-card{ grid-template-columns: 1fr; }.gm .results-card > div{ display: flex; align-items: center; justify-content: space-between; padding: 15px 18px; text-align: left; }.gm .results-card > div + div{ border-top: 1px solid var(--border); border-left: 0; }.gm .results-card strong{ font-size: 21px; }.gm .round-history ol{ grid-template-columns: repeat(5, minmax(68px, 1fr)); overflow-x: auto; padding-bottom: 6px; }.gm .section-heading{ align-items: flex-start; flex-direction: column; }}";
function __ready(f){f()}
function boot(){
"use strict";

(() => {
  const TOTAL_ROUNDS = 5;
  const MIN_WAIT_MS = 1500;
  const MAX_WAIT_MS = 4500;
  const STORAGE_KEY = "gamesHubReactionBest";

  const zone = document.getElementById("reactionZone");
  const zoneKicker = document.getElementById("zoneKicker");
  const zoneMessage = document.getElementById("zoneMessage");
  const gameHint = document.getElementById("gameHint");
  const startButton = document.getElementById("startButton");
  const resetButton = document.getElementById("resetButton");
  const soundButton = document.getElementById("soundButton");
  const soundLabel = document.getElementById("soundLabel");
  const roundDisplay = document.getElementById("roundDisplay");
  const lastDisplay = document.getElementById("lastDisplay");
  const bestDisplay = document.getElementById("bestDisplay");
  const resultsCard = document.getElementById("resultsCard");
  const averageDisplay = document.getElementById("averageDisplay");
  const fastestDisplay = document.getElementById("fastestDisplay");
  const ratingDisplay = document.getElementById("ratingDisplay");
  const historyPanel = document.getElementById("historyPanel");
  const historyList = document.getElementById("historyList");
  const liveStatus = document.getElementById("liveStatus");
  const currentYear = document.getElementById("currentYear");

  let state = "idle";
  let currentRound = 0;
  let results = [];
  let waitTimer = null;
  let nextRoundTimer = null;
  let signalStartedAt = 0;
  let soundEnabled = true;
  let audioContext = null;

  function getStoredBest() {
    try {
      const value = Number.parseInt(localStorage.getItem(STORAGE_KEY), 10);
      return Number.isFinite(value) && value > 0 ? value : null;
    } catch (error) {
      return null;
    }
  }

  function storeBest(value) {
    try {
      localStorage.setItem(STORAGE_KEY, String(value));
    } catch (error) {
      // The game remains fully playable when browser storage is unavailable.
    }
  }

  function clearStoredBest() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      // Ignore blocked storage; the current game can still reset normally.
    }
  }

  function playTone(frequency, duration, volume = 0.08) {
    if (!soundEnabled) return;

    try {
      audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      oscillator.type = "sine";
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(volume, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + duration);
      oscillator.connect(gain);
      gain.connect(audioContext.destination);
      oscillator.start();
      oscillator.stop(audioContext.currentTime + duration);
    } catch (error) {
      // Audio is an optional enhancement and never blocks gameplay.
    }
  }

  function clearTimers() {
    window.clearTimeout(waitTimer);
    window.clearTimeout(nextRoundTimer);
    waitTimer = null;
    nextRoundTimer = null;
  }

  function setZoneState(nextState, kicker, message, hint, ariaLabel) {
    state = nextState;
    zone.className = `reaction-zone state-${nextState}`;
    zoneKicker.textContent = kicker;
    zoneMessage.textContent = message;
    gameHint.textContent = hint;
    zone.setAttribute("aria-label", ariaLabel);
  }

  function announce(message) {
    liveStatus.textContent = "";
    window.requestAnimationFrame(() => {
      liveStatus.textContent = message;
    });
  }

  function updateBestDisplay() {
    const best = getStoredBest();
    bestDisplay.textContent = best ? `${best} ms` : "—";
  }

  function beginTest() {
    clearTimers();
    results = [];
    currentRound = 1;
    historyList.replaceChildren();
    historyPanel.hidden = true;
    resultsCard.hidden = true;
    lastDisplay.textContent = "—";
    startButton.disabled = true;
    startButton.textContent = "Test Running";
    resetButton.disabled = true;
    roundDisplay.textContent = `${currentRound} / ${TOTAL_ROUNDS}`;
    zone.focus({ preventScroll: true });
    startWaiting();
  }

  function startWaiting() {
    clearTimers();
    setZoneState(
      "waiting",
      `Round ${currentRound} of ${TOTAL_ROUNDS}`,
      "Wait for green…",
      "Do not tap yet",
      `Round ${currentRound}. Wait for the green signal. Do not activate yet.`
    );
    announce(`Round ${currentRound}. Wait for green.`);

    const delay = Math.floor(Math.random() * (MAX_WAIT_MS - MIN_WAIT_MS + 1)) + MIN_WAIT_MS;
    waitTimer = window.setTimeout(showSignal, delay);
  }

  function showSignal() {
    waitTimer = null;
    signalStartedAt = performance.now();
    setZoneState(
      "go",
      `Round ${currentRound} of ${TOTAL_ROUNDS}`,
      "TAP NOW!",
      "Click, tap, or press Space",
      "Green signal. Activate now."
    );
    playTone(760, 0.12, 0.1);
    announce("Green signal. Tap now!");
  }

  function handleFalseStart() {
    clearTimers();
    setZoneState(
      "false",
      "False start",
      "Too soon!",
      "This round will restart",
      "False start. You reacted before the green signal. This round will restart."
    );
    playTone(180, 0.2);
    announce("False start. The round will restart.");
    nextRoundTimer = window.setTimeout(startWaiting, 1300);
  }

  function recordReaction() {
    const reactionTime = Math.max(1, Math.round(performance.now() - signalStartedAt));
    results.push(reactionTime);
    lastDisplay.textContent = `${reactionTime} ms`;
    addHistoryItem(reactionTime);

    const storedBest = getStoredBest();
    const isNewBest = storedBest === null || reactionTime < storedBest;
    if (isNewBest) {
      storeBest(reactionTime);
      updateBestDisplay();
    }

    setZoneState(
      "result",
      isNewBest ? "New personal best" : `Round ${currentRound} complete`,
      `${reactionTime} ms`,
      currentRound < TOTAL_ROUNDS ? "Get ready for the next round" : "Calculating your result",
      `Reaction time ${reactionTime} milliseconds.${isNewBest ? " New personal best." : ""}`
    );
    playTone(isNewBest ? 980 : 560, 0.12);
    announce(`Reaction time ${reactionTime} milliseconds.${isNewBest ? " New personal best." : ""}`);

    if (currentRound >= TOTAL_ROUNDS) {
      nextRoundTimer = window.setTimeout(finishTest, 1100);
    } else {
      currentRound += 1;
      roundDisplay.textContent = `${currentRound} / ${TOTAL_ROUNDS}`;
      nextRoundTimer = window.setTimeout(startWaiting, 1250);
    }
  }

  function addHistoryItem(time) {
    const item = document.createElement("li");
    const strong = document.createElement("strong");
    strong.textContent = `${time} ms`;
    item.appendChild(strong);
    historyList.appendChild(item);
    historyPanel.hidden = false;
  }

  function getRating(average) {
    if (average < 180) return "Lightning";
    if (average < 220) return "Excellent";
    if (average < 270) return "Quick";
    if (average < 330) return "Steady";
    return "Keep practicing";
  }

  function finishTest() {
    clearTimers();
    const total = results.reduce((sum, value) => sum + value, 0);
    const average = Math.round(total / results.length);
    const fastest = Math.min(...results);
    const rating = getRating(average);

    averageDisplay.textContent = `${average} ms`;
    fastestDisplay.textContent = `${fastest} ms`;
    ratingDisplay.textContent = rating;
    resultsCard.hidden = false;
    roundDisplay.textContent = `${TOTAL_ROUNDS} / ${TOTAL_ROUNDS}`;
    startButton.disabled = false;
    startButton.textContent = "Start New Test";
    resetButton.disabled = false;

    setZoneState(
      "complete",
      "Test complete",
      `${average} ms average`,
      rating,
      `Test complete. Average reaction time ${average} milliseconds. Rating: ${rating}.`
    );
    playTone(660, 0.1);
    window.setTimeout(() => playTone(880, 0.16), 100);
    announce(`Test complete. Your average is ${average} milliseconds. ${rating}.`);
  }

  function activateGameZone() {
    if (state === "waiting") {
      handleFalseStart();
    } else if (state === "go") {
      recordReaction();
    }
  }

  function resetGame() {
    clearTimers();
    results = [];
    currentRound = 0;
    signalStartedAt = 0;
    clearStoredBest();
    updateBestDisplay();
    roundDisplay.textContent = `0 / ${TOTAL_ROUNDS}`;
    lastDisplay.textContent = "—";
    historyList.replaceChildren();
    historyPanel.hidden = true;
    resultsCard.hidden = true;
    startButton.disabled = false;
    startButton.textContent = "Start Test";
    resetButton.disabled = false;
    setZoneState(
      "idle",
      "Reaction test",
      "Ready to test your speed?",
      "Press Start Test below",
      "Reaction game area. Press the start button to begin."
    );
    announce("Scores reset. Ready to start a new reaction test.");
  }

  function toggleSound() {
    soundEnabled = !soundEnabled;
    soundButton.setAttribute("aria-pressed", String(soundEnabled));
    soundButton.setAttribute("aria-label", soundEnabled ? "Mute game sounds" : "Turn on game sounds");
    soundLabel.textContent = soundEnabled ? "Sound on" : "Sound off";
    if (soundEnabled) playTone(620, 0.08, 0.06);
  }

  startButton.addEventListener("click", beginTest);
  resetButton.addEventListener("click", resetGame);
  soundButton.addEventListener("click", toggleSound);
  zone.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    event.preventDefault();
    activateGameZone();
  });
  zone.addEventListener("keydown", (event) => {
    if ((event.code === "Space" || event.code === "Enter") && !event.repeat) {
      event.preventDefault();
      activateGameZone();
    }
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden && (state === "waiting" || state === "go")) {
      handleFalseStart();
    }
  });

  currentYear.textContent = String(new Date().getFullYear());
  updateBestDisplay();
})();


}
function begin(){poster.hidden=true;gm.hidden=false;if(!booted){booted=true;var s=document.createElement("style");s.textContent=LOOK;document.head.appendChild(s);boot();}else{var r=document.getElementById("startButton");if(r)r.click();}}
poster.addEventListener("click",begin);
var nb=document.getElementById("new");if(nb)nb.addEventListener("click",begin);
})();
