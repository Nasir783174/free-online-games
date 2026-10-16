/* Spelling - game logic + its own look. Layout lives in style.css; page shell lives in the HTML. */
(function(){"use strict";
var gm=document.getElementById("gm"),poster=document.getElementById("poster"),booted=false;
var LOOK=".gm *{\n  box-sizing: border-box;\n}.gm{\n  --primary: #5B5CE2;\n  --primary-dark: #4546B8;\n  --secondary: #16B8C4;\n  --action: #FFB84D;\n  --success: #22C55E;\n  --danger: #EF5B5B;\n  \n  \n  \n  \n  \n  --game-bg: #111827;\n  --game-secondary: #1F2937;\n  \n}.gm button,.gm input{\n  font: inherit;\n}.gm button{\n  cursor: pointer;\n}.gm .page-shell{\n  max-width: 1160px;\n  margin: 0 auto;\n  padding: 28px 24px 72px;\n}.gm h2{\n  letter-spacing: -0.025em;\n  line-height: 1.1;\n}.gm .lead{\n  max-width: 740px;\n  margin: 16px 0 0;\n  color: var(--muted);\n  font-size: 18px;\n}.gm .game-card{\n  overflow: hidden;\n  background: var(--game-bg);\n  border-radius: 20px;\n  box-shadow: var(--shadow);\n  color: #fff;\n}.gm .game-topbar{\n  min-height: 82px;\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  align-items: center;\n  background: var(--game-secondary);\n  border-bottom: 1px solid rgba(255,255,255,0.08);\n}.gm .stat{\n  text-align: center;\n  padding: 14px;\n  border-right: 1px solid rgba(255,255,255,0.08);\n}.gm .stat:last-child{\n  border-right: 0;\n}.gm .stat-label{\n  display: block;\n  color: #AEB7C7;\n  font-size: 13px;\n  font-weight: 700;\n  text-transform: uppercase;\n  letter-spacing: 0.07em;\n}.gm .stat strong{\n  display: block;\n  margin-top: 2px;\n  font-size: 25px;\n  line-height: 1.15;\n}.gm .game-stage{\n  min-height: 590px;\n  padding: 42px 24px 50px;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  position: relative;\n}.gm .status-badge{\n  background: rgba(91, 92, 226, 0.18);\n  border: 1px solid rgba(143, 145, 255, 0.32);\n  color: #C9CAFF;\n  padding: 6px 13px;\n  border-radius: 999px;\n  font-size: 13px;\n  font-weight: 800;\n  text-transform: uppercase;\n  letter-spacing: 0.06em;\n}.gm .word-card{\n  width: min(100%, 620px);\n  margin: 24px auto 28px;\n  padding: 32px 24px;\n  text-align: center;\n  background: #182235;\n  border: 1px solid rgba(255,255,255,0.08);\n  border-radius: 18px;\n}.gm .round-label{\n  margin: 0;\n  color: #8EDDE2;\n  font-size: 13px;\n  font-weight: 800;\n  letter-spacing: 0.1em;\n}.gm .speaker-wrap{\n  margin: 18px 0 14px;\n}.gm .icon-button{\n  width: 72px;\n  height: 72px;\n  border: 0;\n  border-radius: 50%;\n  background: var(--secondary);\n  color: #fff;\n  font-size: 29px;\n  display: inline-grid;\n  place-items: center;\n  transition: transform 0.15s ease, background 0.15s ease;\n}.gm .icon-button:hover{\n  transform: translateY(-2px);\n  background: #12A4AE;\n}.gm .icon-button:focus-visible,.gm button:focus-visible,.gm input:focus-visible,.gm summary:focus-visible{\n  outline: 3px solid #FFB84D;\n  outline-offset: 3px;\n}.gm .word-hint{\n  margin: 0;\n  color: #E7EAF0;\n  font-size: 20px;\n  font-weight: 700;\n}.gm .word-length{\n  margin: 5px 0 0;\n  color: #909BAE;\n  font-size: 14px;\n}.gm .answer-form{\n  width: min(100%, 620px);\n}.gm .answer-form label{\n  display: block;\n  margin-bottom: 8px;\n  color: #C8CED9;\n  font-size: 15px;\n  font-weight: 700;\n}.gm .input-row{\n  display: flex;\n  gap: 10px;\n}.gm .answer-form input{\n  flex: 1;\n  min-width: 0;\n  height: 52px;\n  border: 2px solid #384357;\n  border-radius: 12px;\n  background: #111827;\n  color: #fff;\n  padding: 0 16px;\n  font-size: 18px;\n}.gm .answer-form input::placeholder{\n  color: #667085;\n}.gm .answer-form input:focus{\n  border-color: var(--secondary);\n  outline: none;\n}.gm .submit-button,.gm .primary-button,.gm .secondary-button{\n  min-height: 48px;\n  border: 0;\n  border-radius: 11px;\n  padding: 0 20px;\n  font-weight: 800;\n  transition: transform 0.15s ease, opacity 0.15s ease, background 0.15s ease;\n}.gm .submit-button,.gm .primary-button{\n  background: var(--action);\n  color: #3A2A0E;\n}.gm .submit-button:hover,.gm .primary-button:hover,.gm .secondary-button:hover{\n  transform: translateY(-1px);\n}.gm .submit-button:disabled,.gm .primary-button:disabled,.gm .secondary-button:disabled{\n  cursor: not-allowed;\n  opacity: 0.55;\n  transform: none;\n}.gm .feedback{\n  width: min(100%, 620px);\n  min-height: 29px;\n  margin: 15px 0 0;\n  text-align: center;\n  font-weight: 800;\n}.gm .feedback.success{\n  color: #7BE69B;\n}.gm .feedback.error{\n  color: #FF9898;\n}.gm .controls{\n  display: flex;\n  gap: 10px;\n  margin-top: 18px;\n}.gm .secondary-button{\n  background: transparent;\n  border: 1px solid #465269;\n  color: #E7EAF0;\n}.gm .hidden{\n  display: none !important;\n}.gm .game-over{\n  width: min(100%, 620px);\n  margin-top: 25px;\n  padding: 30px 24px;\n  text-align: center;\n  background: #182235;\n  border: 1px solid rgba(255,255,255,0.09);\n  border-radius: 18px;\n}.gm .result-icon{\n  width: 52px;\n  height: 52px;\n  margin: 0 auto 16px;\n  display: grid;\n  place-items: center;\n  border-radius: 50%;\n  background: rgba(34,197,94,0.16);\n  color: #7BE69B;\n  font-size: 26px;\n  font-weight: 800;\n}.gm .game-over h2{\n  margin: 10px 0;\n  font-size: 30px;\n}.gm .final-score{\n  margin: 0 0 20px;\n  color: #B9C1CF;\n}.gm .two-col{\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 52px;\n}@media (max-width: 700px){.gm .page-shell{\n    padding-left: 16px;\n    padding-right: 16px;\n  }.gm .page-shell{\n    padding-top: 20px;\n  }.gm .lead{\n    font-size: 17px;\n  }.gm .game-stage{\n    min-height: 0;\n    padding: 30px 16px 38px;\n  }.gm .game-topbar{\n    min-height: 74px;\n  }.gm .stat{\n    padding: 10px 5px;\n  }.gm .stat-label{\n    font-size: 11px;\n  }.gm .stat strong{\n    font-size: 21px;\n  }.gm .word-card{\n    padding: 26px 17px;\n    margin-top: 20px;\n  }.gm .word-hint{\n    font-size: 18px;\n  }.gm .input-row{\n    flex-direction: column;\n  }.gm .submit-button{\n    width: 100%;\n  }.gm .controls{\n    width: 100%;\n    flex-direction: column;\n  }.gm .controls button{\n    width: 100%;\n  }.gm .two-col{\n    grid-template-columns: 1fr;\n    gap: 18px;\n  }}";
function __ready(f){f()}
function boot(){
(() => {
  "use strict";

  const WORDS = [
    { word: "because", hint: "A word used to give a reason" },
    { word: "beautiful", hint: "Pleasant to look at or experience" },
    { word: "calendar", hint: "A chart that shows days, weeks, and months" },
    { word: "different", hint: "Not the same as something else" },
    { word: "favorite", hint: "Something you like more than the others" },
    { word: "language", hint: "A system people use to communicate" },
    { word: "necessary", hint: "Needed or required" },
    { word: "practice", hint: "Repeated activity used to improve a skill" },
    { word: "remember", hint: "To keep something in your mind" },
    { word: "successful", hint: "Achieving the result you wanted" },
    { word: "tomorrow", hint: "The day after today" },
    { word: "together", hint: "With another person or group" },
    { word: "important", hint: "Having great value or meaning" },
    { word: "knowledge", hint: "Information and understanding gained through learning" },
    { word: "experience", hint: "Knowledge gained by doing or living through something" },
    { word: "environment", hint: "The surroundings in which people or things exist" },
    { word: "opportunity", hint: "A favorable chance to do something" },
    { word: "restaurant", hint: "A place where meals are prepared and served" },
    { word: "adventure", hint: "An exciting or unusual experience" },
    { word: "education", hint: "The process of learning and gaining knowledge" },
    { word: "friendship", hint: "A relationship between people who care about each other" },
    { word: "government", hint: "The group or system that runs a country or community" },
    { word: "beautifully", hint: "In a pleasing or attractive way" },
    { word: "temperature", hint: "A measure of how hot or cold something is" },
    { word: "comfortable", hint: "Providing physical ease and relaxation" }
  ];

  const TOTAL_ROUNDS = 10;
  const POINTS_PER_CORRECT = 100;

  const scoreEl = document.getElementById("score");
  const streakEl = document.getElementById("streak");
  const roundEl = document.getElementById("round");
  const statusBadge = document.getElementById("statusBadge");
  const roundLabel = document.getElementById("roundLabel");
  const wordHint = document.getElementById("wordHint");
  const wordLength = document.getElementById("wordLength");
  const answerForm = document.getElementById("answerForm");
  const answerInput = document.getElementById("answerInput");
  const feedback = document.getElementById("feedback");
  const nextBtn = document.getElementById("nextBtn");
  const restartBtn = document.getElementById("restartBtn");
  const playAgainBtn = document.getElementById("playAgainBtn");
  const speakBtn = document.getElementById("speakBtn");
  const gameOverPanel = document.getElementById("gameOverPanel");
  const finalScore = document.getElementById("finalScore");
  const finalStreak = document.getElementById("finalStreak");

  let round = 1;
  let score = 0;
  let streak = 0;
  let bestStreak = 0;
  let currentWord = null;
  let answered = false;
  let deck = [];

  function shuffle(items) {
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function buildDeck() {
    deck = shuffle(WORDS).slice(0, TOTAL_ROUNDS);
  }

  function updateStats() {
    scoreEl.textContent = String(score);
    streakEl.textContent = String(streak);
    roundEl.textContent = String(round);
  }

  function setFeedback(message, type = "") {
    feedback.textContent = message;
    feedback.className = `feedback${type ? ` ${type}` : ""}`;
  }

  function loadRound() {
    currentWord = deck[round - 1];
    answered = false;
    statusBadge.textContent = "Your turn";
    roundLabel.textContent = "SPELL THE WORD";
    wordHint.textContent = currentWord.hint;
    wordLength.textContent = `${currentWord.word.length} letters`;
    answerInput.value = "";
    answerInput.disabled = false;
    nextBtn.classList.add("hidden");
    setFeedback("");
    gameOverPanel.classList.add("hidden");
    answerInput.focus();
    updateStats();
  }

  function calculatePoints() {
    return POINTS_PER_CORRECT + Math.max(0, streak - 1) * 25;
  }

  function submitAnswer(event) {
    event.preventDefault();

    if (answered || !currentWord) return;

    const answer = answerInput.value.trim().toLowerCase();

    if (!answer) {
      setFeedback("Type a spelling before checking.", "error");
      answerInput.focus();
      return;
    }

    answered = true;
    answerInput.disabled = true;

    if (answer === currentWord.word) {
      const points = calculatePoints();
      score += points;
      streak += 1;
      bestStreak = Math.max(bestStreak, streak);
      statusBadge.textContent = "Correct!";
      roundLabel.textContent = "NICE WORK";
      setFeedback(`Correct! +${points} points. Your streak is ${streak}.`, "success");
    } else {
      const previousStreak = streak;
      streak = 0;
      statusBadge.textContent = "Not quite";
      roundLabel.textContent = "CORRECT SPELLING";
      setFeedback(
        `The correct spelling is "${currentWord.word}".${previousStreak > 0 ? " Your streak resets here." : ""}`,
        "error"
      );
    }

    updateStats();

    if (round >= TOTAL_ROUNDS) {
      window.setTimeout(endGame, 550);
    } else {
      nextBtn.classList.remove("hidden");
      nextBtn.focus();
    }
  }

  function nextRound() {
    if (!answered) return;
    round += 1;
    loadRound();
  }

  function endGame() {
    statusBadge.textContent = "Complete";
    roundLabel.textContent = "GAME COMPLETE";
    gameOverPanel.classList.remove("hidden");
    finalScore.textContent = String(score);
    finalStreak.textContent = String(bestStreak);
    nextBtn.classList.add("hidden");
    answerForm.classList.add("hidden");
    setFeedback("");
    gameOverPanel.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function restartGame() {
    round = 1;
    score = 0;
    streak = 0;
    bestStreak = 0;
    answerForm.classList.remove("hidden");
    buildDeck();
    updateStats();
    loadRound();
  }

  function speakWord() {
    if (!currentWord) return;

    if (!("speechSynthesis" in window)) {
      setFeedback("Your browser does not support word pronunciation.", "error");
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(currentWord.word);
    utterance.lang = "en-US";
    utterance.rate = 0.82;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  }

  answerForm.addEventListener("submit", submitAnswer);
  nextBtn.addEventListener("click", nextRound);
  restartBtn.addEventListener("click", restartGame);
  playAgainBtn.addEventListener("click", restartGame);
  speakBtn.addEventListener("click", speakWord);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !answered) {
      answerInput.value = "";
      answerInput.focus();
    }
  });

  restartGame();
})();


}
function begin(){poster.hidden=true;gm.hidden=false;if(!booted){booted=true;var s=document.createElement("style");s.textContent=LOOK;document.head.appendChild(s);boot();}else{var r=document.getElementById("restartBtn");if(r)r.click();}}
poster.addEventListener("click",begin);
var nb=document.getElementById("new");if(nb)nb.addEventListener("click",begin);
})();
