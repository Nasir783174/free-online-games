/* Geography Quiz - game logic + its own look. Layout lives in style.css; page shell lives in the HTML. */
(function(){"use strict";
var gm=document.getElementById("gm"),poster=document.getElementById("poster"),booted=false;
var LOOK=".gm *{\n  box-sizing: border-box;\n}.gm{\n  \n  \n  --teal: #16B8C4;\n  --orange: #FFB84D;\n  --green: #22C55E;\n  --red: #EF5B5B;\n  --page: #F6F7FB;\n  \n  \n  \n  \n  --game: #111827;\n  --game-2: #1F2937;\n  --white: #FFFFFF;\n  --radius: 18px;\n}.gm button{\n  font: inherit;\n}.gm button{\n  cursor: pointer;\n}.gm .page-shell{\n  width: min(1120px, calc(100% - 40px));\n  margin: 0 auto;\n}.gm .back-link{\n  color: var(--muted);\n  font-weight: 700;\n  transition: color 0.2s ease;\n}.gm .back-link:hover,.gm .back-link:focus-visible{\n  color: var(--brand);\n}.gm .page-shell{\n  padding: 28px 0 80px;\n}.gm h2,.gm h3,.gm p{\n  margin-top: 0;\n}.gm h2{\n  font-size: 34px;\n  line-height: 1.15;\n  letter-spacing: -0.02em;\n  margin-bottom: 18px;\n  font-weight: 700;\n}.gm h3{\n  font-size: 21px;\n  line-height: 1.25;\n  margin-bottom: 8px;\n  font-weight: 700;\n}.gm .game-card{\n  position: relative;\n  overflow: hidden;\n  background: var(--game);\n  color: var(--white);\n  border-radius: 20px;\n  padding: 24px;\n  box-shadow: 0 18px 50px rgba(17, 24, 39, 0.14);\n}.gm .game-card::before{\n  content: \"\";\n  position: absolute;\n  width: 260px;\n  height: 260px;\n  right: -120px;\n  top: -140px;\n  border-radius: 50%;\n  background: rgba(91, 92, 226, 0.2);\n  pointer-events: none;\n}.gm .game-topbar{\n  position: relative;\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 12px;\n  margin-bottom: 22px;\n}.gm .stat-box{\n  min-height: 76px;\n  padding: 12px 16px;\n  border: 1px solid rgba(255, 255, 255, 0.09);\n  border-radius: 14px;\n  background: var(--game-2);\n}.gm .stat-label{\n  display: block;\n  color: #AAB2C5;\n  font-size: 13px;\n  font-weight: 700;\n  text-transform: uppercase;\n  letter-spacing: 0.06em;\n}.gm .stat-box strong{\n  display: block;\n  font-size: 25px;\n  line-height: 1.1;\n  margin-top: 4px;\n}.gm .timer-box strong{\n  color: var(--orange);\n}.gm .progress-area{\n  position: relative;\n  margin-bottom: 26px;\n}.gm .progress-meta{\n  display: flex;\n  justify-content: space-between;\n  gap: 16px;\n  color: #C6CCDA;\n  font-size: 14px;\n  font-weight: 700;\n  margin-bottom: 8px;\n}.gm .progress-track{\n  height: 8px;\n  border-radius: 999px;\n  background: #303A4B;\n  overflow: hidden;\n}.gm .progress-bar{\n  height: 100%;\n  width: 10%;\n  background: var(--teal);\n  border-radius: inherit;\n  transition: width 0.25s ease;\n}.gm .quiz-panel,.gm .result-panel{\n  position: relative;\n  min-height: 310px;\n  padding: 28px;\n  border-radius: 16px;\n  background: #182234;\n  border: 1px solid rgba(255, 255, 255, 0.06);\n}.gm .question-kicker{\n  color: #7FDDE3;\n  font-size: 13px;\n  font-weight: 800;\n  letter-spacing: 0.1em;\n  margin-bottom: 10px;\n}.gm #question{\n  max-width: 850px;\n  font-size: clamp(25px, 3.5vw, 34px);\n  line-height: 1.25;\n  margin-bottom: 24px;\n}.gm .answers{\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 12px;\n}.gm .answer-btn{\n  min-height: 62px;\n  padding: 12px 16px;\n  border: 1px solid #354155;\n  border-radius: 13px;\n  background: #202C3F;\n  color: var(--white);\n  text-align: left;\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  font-size: 16px;\n  font-weight: 700;\n  transition: transform 0.16s ease, border-color 0.16s ease, background 0.16s ease;\n}.gm .answer-btn:hover:not(:disabled),.gm .answer-btn:focus-visible{\n  transform: translateY(-2px);\n  border-color: #7B7CF0;\n  background: #26344B;\n  outline: none;\n}.gm .answer-key{\n  flex: 0 0 32px;\n  width: 32px;\n  height: 32px;\n  border-radius: 9px;\n  display: grid;\n  place-items: center;\n  background: #303D53;\n  color: #DDE2EE;\n  font-weight: 800;\n}.gm .answer-btn.correct{\n  background: rgba(34, 197, 94, 0.16);\n  border-color: var(--green);\n}.gm .answer-btn.correct .answer-key{\n  background: var(--green);\n  color: #0C2715;\n}.gm .answer-btn.wrong{\n  background: rgba(239, 91, 91, 0.16);\n  border-color: var(--red);\n}.gm .answer-btn.wrong .answer-key{\n  background: var(--red);\n  color: #341010;\n}.gm .answer-btn:disabled{\n  cursor: default;\n}.gm .feedback{\n  min-height: 30px;\n  margin-top: 14px;\n  color: #D8DDEA;\n  font-weight: 700;\n}.gm .feedback.correct-text{\n  color: #73E79A;\n}.gm .feedback.wrong-text{\n  color: #FF9999;\n}.gm .game-actions{\n  display: flex;\n  justify-content: flex-end;\n  gap: 12px;\n  margin-top: 18px;\n}.gm .primary-btn,.gm .secondary-btn{\n  min-height: 48px;\n  border-radius: 11px;\n  padding: 10px 18px;\n  border: 1px solid transparent;\n  font-size: 16px;\n  font-weight: 800;\n  transition: transform 0.16s ease, background 0.16s ease;\n}.gm .primary-btn{\n  background: var(--teal);\n  color: #08282C;\n}.gm .primary-btn:hover,.gm .primary-btn:focus-visible{\n  background: #38C8D1;\n  transform: translateY(-1px);\n  outline: none;\n}.gm .secondary-btn{\n  background: #283449;\n  border-color: #3A475C;\n  color: var(--white);\n}.gm .secondary-btn:hover,.gm .secondary-btn:focus-visible{\n  background: #334158;\n  outline: none;\n}.gm .keyboard-hint{\n  margin: 14px 0 0;\n  color: #8995A9;\n  text-align: right;\n  font-size: 13px;\n}.gm kbd{\n  padding: 2px 6px;\n  border: 1px solid #465267;\n  border-bottom-width: 2px;\n  border-radius: 5px;\n  background: #263044;\n  color: #DCE1EB;\n  font-size: 12px;\n}.gm .result-panel{\n  display: grid;\n  place-items: center;\n  text-align: center;\n  align-content: center;\n}.gm .result-icon{\n  font-size: 48px;\n  line-height: 1;\n  margin-bottom: 12px;\n}.gm .result-panel h2{\n  margin-bottom: 8px;\n}.gm .final-score{\n  display: flex;\n  align-items: baseline;\n  gap: 8px;\n  margin: 4px 0 8px;\n}.gm .final-score span{\n  font-size: 54px;\n  line-height: 1;\n  font-weight: 800;\n  color: var(--orange);\n}.gm .final-score small{\n  color: #AAB2C5;\n  font-weight: 700;\n}.gm .result-message{\n  color: #C6CCDA;\n  margin-bottom: 20px;\n}.gm .result-stats{\n  display: flex;\n  gap: 10px;\n  width: min(520px, 100%);\n}.gm .result-stats div{\n  flex: 1;\n  padding: 11px;\n  background: #202C3F;\n  border-radius: 11px;\n}.gm .result-stats strong,.gm .result-stats span{\n  display: block;\n}.gm .result-stats strong{\n  font-size: 22px;\n}.gm .result-stats span{\n  color: #9CA7B9;\n  font-size: 12px;\n}.gm .instruction-grid{\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 18px;\n}.gm .info-card{\n  padding: 22px;\n  background: var(--card);\n  border: 1px solid var(--border);\n  border-radius: 16px;\n}.gm .info-number{\n  display: inline-grid;\n  place-items: center;\n  width: 38px;\n  height: 38px;\n  border-radius: 10px;\n  background: #ECECFF;\n  color: var(--brand);\n  font-size: 13px;\n  font-weight: 800;\n  margin-bottom: 18px;\n}.gm .info-card p{\n  color: var(--muted);\n  margin-bottom: 0;\n}.gm .tips-list{\n  margin: 0;\n  padding: 0;\n  list-style: none;\n  display: grid;\n  gap: 12px;\n}.gm .tips-list li{\n  position: relative;\n  padding: 15px 18px 15px 48px;\n  background: var(--card);\n  border: 1px solid var(--border);\n  border-radius: 13px;\n  color: var(--muted);\n}.gm .tips-list li::before{\n  content: \"\u2713\";\n  position: absolute;\n  left: 17px;\n  top: 14px;\n  color: var(--green);\n  font-weight: 800;\n}@media (max-width: 760px){.gm .page-shell{\n    width: min(100% - 28px, 1120px);\n  }.gm .page-shell{\n    padding-top: 22px;\n    padding-bottom: 56px;\n  }.gm h2{\n    font-size: 28px;\n  }.gm .game-card{\n    padding: 14px;\n    border-radius: 16px;\n  }.gm .game-topbar{\n    gap: 8px;\n    margin-bottom: 14px;\n  }.gm .stat-box{\n    min-height: 67px;\n    padding: 10px 11px;\n  }.gm .stat-label{\n    font-size: 11px;\n  }.gm .stat-box strong{\n    font-size: 22px;\n  }.gm .quiz-panel,.gm .result-panel{\n    min-height: 0;\n    padding: 20px 16px;\n  }.gm #question{\n    font-size: 25px;\n  }.gm .answers{\n    grid-template-columns: 1fr;\n    gap: 9px;\n  }.gm .answer-btn{\n    min-height: 58px;\n  }.gm .game-actions{\n    justify-content: stretch;\n  }.gm .game-actions button{\n    flex: 1;\n  }.gm .keyboard-hint{\n    display: none;\n  }.gm .instruction-grid{\n    grid-template-columns: 1fr;\n  }}@media (max-width: 430px){.gm .back-link{\n    font-size: 14px;\n  }.gm .progress-meta{\n    font-size: 12px;\n  }.gm .final-score span{\n    font-size: 46px;\n  }.gm .result-stats{\n    gap: 6px;\n  }.gm .result-stats div{\n    padding: 9px 5px;\n  }}@media (prefers-reduced-motion: reduce){.gm *,.gm *::before,.gm *::after{\n    transition-duration: 0.01ms !important;\n    animation-duration: 0.01ms !important;\n  }}";
function __ready(f){f()}
function boot(){
(() => {
  "use strict";

  const QUESTIONS_PER_GAME = 10;
  const QUESTION_TIME = 15;

  const questionBank = [
    {
      category: "Countries",
      question: "Which country is the largest by land area?",
      answers: ["Canada", "China", "Russia", "United States"],
      correct: 2
    },
    {
      category: "Capitals",
      question: "What is the capital city of Australia?",
      answers: ["Sydney", "Melbourne", "Canberra", "Perth"],
      correct: 2
    },
    {
      category: "Continents",
      question: "Which continent contains the Sahara Desert?",
      answers: ["Asia", "Africa", "South America", "Australia"],
      correct: 1
    },
    {
      category: "Oceans",
      question: "Which is the largest ocean on Earth?",
      answers: ["Atlantic Ocean", "Indian Ocean", "Pacific Ocean", "Arctic Ocean"],
      correct: 2
    },
    {
      category: "Landmarks",
      question: "In which country is Machu Picchu located?",
      answers: ["Peru", "Chile", "Bolivia", "Ecuador"],
      correct: 0
    },
    {
      category: "Capitals",
      question: "What is the capital of Japan?",
      answers: ["Kyoto", "Tokyo", "Osaka", "Hiroshima"],
      correct: 1
    },
    {
      category: "Physical Geography",
      question: "Mount Everest is part of which mountain range?",
      answers: ["Andes", "Rockies", "Alps", "Himalayas"],
      correct: 3
    },
    {
      category: "Countries",
      question: "Which country has the most islands in the world?",
      answers: ["Indonesia", "Sweden", "Philippines", "Japan"],
      correct: 1
    },
    {
      category: "Landmarks",
      question: "The Great Barrier Reef is off the coast of which country?",
      answers: ["Australia", "South Africa", "Mexico", "India"],
      correct: 0
    },
    {
      category: "Continents",
      question: "Which continent is the smallest by land area?",
      answers: ["Europe", "Antarctica", "Australia", "South America"],
      correct: 2
    },
    {
      category: "Countries",
      question: "Which country is completely surrounded by South Africa?",
      answers: ["Eswatini", "Lesotho", "Botswana", "Namibia"],
      correct: 1
    },
    {
      category: "Capitals",
      question: "What is the capital of Canada?",
      answers: ["Toronto", "Vancouver", "Ottawa", "Montreal"],
      correct: 2
    },
    {
      category: "Oceans",
      question: "Which ocean lies between Africa and Australia?",
      answers: ["Pacific Ocean", "Indian Ocean", "Atlantic Ocean", "Southern Ocean"],
      correct: 1
    },
    {
      category: "Physical Geography",
      question: "Which line divides Earth into the Northern and Southern Hemispheres?",
      answers: ["Prime Meridian", "Tropic of Cancer", "Equator", "International Date Line"],
      correct: 2
    },
    {
      category: "Countries",
      question: "Which country is known as the Land of the Rising Sun?",
      answers: ["China", "South Korea", "Thailand", "Japan"],
      correct: 3
    },
    {
      category: "Landmarks",
      question: "The Eiffel Tower is located in which city?",
      answers: ["Rome", "Paris", "Madrid", "Vienna"],
      correct: 1
    },
    {
      category: "Capitals",
      question: "What is the capital of Brazil?",
      answers: ["Rio de Janeiro", "São Paulo", "Brasília", "Salvador"],
      correct: 2
    },
    {
      category: "Physical Geography",
      question: "Which river is traditionally taught as the longest river in Africa?",
      answers: ["Congo", "Nile", "Niger", "Zambezi"],
      correct: 1
    },
    {
      category: "Continents",
      question: "Which continent has the greatest number of countries?",
      answers: ["Europe", "Africa", "Asia", "South America"],
      correct: 1
    },
    {
      category: "Countries",
      question: "Which country is shaped roughly like a boot?",
      answers: ["Greece", "Italy", "Portugal", "Croatia"],
      correct: 1
    }
  ];

  const elements = {
    score: document.getElementById("score"),
    streak: document.getElementById("streak"),
    timer: document.getElementById("timer"),
    questionCount: document.getElementById("question-count"),
    category: document.getElementById("category-label"),
    progress: document.getElementById("progress-bar"),
    question: document.getElementById("question"),
    answers: document.getElementById("answers"),
    feedback: document.getElementById("feedback"),
    quizPanel: document.getElementById("quiz-panel"),
    resultPanel: document.getElementById("result-panel"),
    finalScore: document.getElementById("final-score"),
    correctCount: document.getElementById("correct-count"),
    bestStreak: document.getElementById("best-streak"),
    accuracy: document.getElementById("accuracy"),
    resultMessage: document.getElementById("result-message"),
    restart: document.getElementById("restart-btn"),
    next: document.getElementById("next-btn")
  };

  let questions = [];
  let currentIndex = 0;
  let score = 0;
  let streak = 0;
  let bestStreak = 0;
  let correctAnswers = 0;
  let timeLeft = QUESTION_TIME;
  let timerId = null;
  let answered = false;

  function shuffle(array) {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function startGame() {
    stopTimer();
    questions = shuffle(questionBank).slice(0, QUESTIONS_PER_GAME);
    currentIndex = 0;
    score = 0;
    streak = 0;
    bestStreak = 0;
    correctAnswers = 0;
    answered = false;

    elements.score.textContent = "0";
    elements.streak.textContent = "0";
    elements.quizPanel.hidden = false;
    elements.resultPanel.hidden = true;
    elements.restart.textContent = "Restart Quiz";
    elements.next.hidden = true;

    renderQuestion();
  }

  function renderQuestion() {
    const current = questions[currentIndex];
    answered = false;
    timeLeft = QUESTION_TIME;

    elements.questionCount.textContent = `Question ${currentIndex + 1} of ${QUESTIONS_PER_GAME}`;
    elements.category.textContent = current.category;
    elements.progress.style.width = `${((currentIndex + 1) / QUESTIONS_PER_GAME) * 100}%`;
    elements.question.textContent = current.question;
    elements.feedback.textContent = "";
    elements.feedback.className = "feedback";
    elements.answers.innerHTML = "";

    current.answers.forEach((answer, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "answer-btn";
      button.dataset.index = String(index);
      button.innerHTML = `<span class="answer-key">${index + 1}</span><span>${answer}</span>`;
      button.addEventListener("click", () => handleAnswer(index));
      elements.answers.appendChild(button);
    });

    updateTimer();
    startTimer();
  }

  function startTimer() {
    stopTimer();
    timerId = window.setInterval(() => {
      timeLeft -= 1;
      updateTimer();

      if (timeLeft <= 0) {
        stopTimer();
        handleAnswer(null);
      }
    }, 1000);
  }

  function stopTimer() {
    if (timerId !== null) {
      window.clearInterval(timerId);
      timerId = null;
    }
  }

  function updateTimer() {
    elements.timer.textContent = String(Math.max(0, timeLeft));
    elements.timer.style.color = timeLeft <= 5 ? "#FF9999" : "#FFB84D";
  }

  function handleAnswer(selectedIndex) {
    if (answered) return;

    answered = true;
    stopTimer();

    const current = questions[currentIndex];
    const buttons = [...elements.answers.querySelectorAll(".answer-btn")];
    const correctButton = buttons[current.correct];

    buttons.forEach((button) => {
      button.disabled = true;
    });

    if (selectedIndex === current.correct) {
      correctAnswers += 1;
      streak += 1;
      bestStreak = Math.max(bestStreak, streak);

      const basePoints = 100;
      const streakBonus = Math.max(0, streak - 1) * 25;
      const timeBonus = timeLeft * 3;
      const earned = basePoints + streakBonus + timeBonus;

      score += earned;
      elements.score.textContent = String(score);
      elements.streak.textContent = String(streak);

      buttons[selectedIndex].classList.add("correct");
      elements.feedback.textContent = `Correct! +${earned} points`;
      elements.feedback.className = "feedback correct-text";
    } else {
      streak = 0;
      elements.streak.textContent = "0";

      if (selectedIndex !== null && buttons[selectedIndex]) {
        buttons[selectedIndex].classList.add("wrong");
      }

      correctButton.classList.add("correct");

      if (selectedIndex === null) {
        elements.feedback.textContent = `Time's up. The answer was ${current.answers[current.correct]}.`;
      } else {
        elements.feedback.textContent = `Not quite. The answer was ${current.answers[current.correct]}.`;
      }
      elements.feedback.className = "feedback wrong-text";
    }

    if (currentIndex === QUESTIONS_PER_GAME - 1) {
      elements.next.textContent = "See Results";
    } else {
      elements.next.textContent = "Next Question";
    }
    elements.next.hidden = false;
  }

  function nextQuestion() {
    if (!answered) return;

    if (currentIndex >= QUESTIONS_PER_GAME - 1) {
      finishGame();
      return;
    }

    currentIndex += 1;
    renderQuestion();
  }

  function finishGame() {
    stopTimer();

    const accuracy = Math.round((correctAnswers / QUESTIONS_PER_GAME) * 100);

    elements.quizPanel.hidden = true;
    elements.resultPanel.hidden = false;
    elements.next.hidden = true;
    elements.finalScore.textContent = String(score);
    elements.correctCount.textContent = `${correctAnswers}/${QUESTIONS_PER_GAME}`;
    elements.bestStreak.textContent = String(bestStreak);
    elements.accuracy.textContent = `${accuracy}%`;

    let message;
    if (accuracy === 100) {
      message = "Perfect round! Your world geography knowledge is excellent.";
    } else if (accuracy >= 80) {
      message = "Great work! You have a strong geography foundation.";
    } else if (accuracy >= 60) {
      message = "Nice effort! Replay the quiz to sharpen your geography knowledge.";
    } else {
      message = "Keep practicing. Every round is another chance to learn the world.";
    }

    elements.resultMessage.textContent = message;
  }

  elements.restart.addEventListener("click", startGame);
  elements.next.addEventListener("click", nextQuestion);

  document.addEventListener("keydown", (event) => {
    if (elements.resultPanel.hidden === false) {
      if (event.key === "Enter" || event.key.toLowerCase() === "r") {
        startGame();
      }
      return;
    }

    if (event.key >= "1" && event.key <= "4") {
      const index = Number(event.key) - 1;
      const buttons = elements.answers.querySelectorAll(".answer-btn");
      if (buttons[index] && !answered) {
        buttons[index].click();
      }
    }

    if (event.key === "Enter" && answered && !elements.next.hidden) {
      nextQuestion();
    }
  });

  startGame();
})();


}
function begin(){poster.hidden=true;gm.hidden=false;if(!booted){booted=true;var s=document.createElement("style");s.textContent=LOOK;document.head.appendChild(s);boot();}else{var r=document.getElementById("restart-btn");if(r)r.click();}}
poster.addEventListener("click",begin);
var nb=document.getElementById("new");if(nb)nb.addEventListener("click",begin);
})();
