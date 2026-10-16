/* Math - game logic + its own look. Layout lives in style.css; page shell lives in the HTML. */
(function(){"use strict";
var gm=document.getElementById("gm"),poster=document.getElementById("poster"),booted=false;
var LOOK=".gm{--cyan:#16B8C4;--orange:#FFB84D;--green:#22C55E;--red:#EF5B5B;--game:#111827;--game2:#1F2937;--radius:18px}.gm *{box-sizing:border-box}.gm .page-shell{width:min(1120px,calc(100% - 40px));margin:auto;padding:28px 0 72px}.gm .game-card{position:relative;background:var(--game);color:#fff;border-radius:20px;overflow:hidden;box-shadow:0 18px 50px rgba(17,24,39,.14);max-width:900px;margin:0 auto 68px}.gm .game-topbar{display:grid;grid-template-columns:repeat(3,1fr) 1.2fr;background:var(--game2);border-bottom:1px solid rgba(255,255,255,.08)}.gm .stat,.gm .timer-wrap{padding:17px 20px}.gm .stat span,.gm .timer-wrap span{display:block;color:#AAB3C5;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.06em}.gm .stat strong,.gm .timer-wrap strong{display:block;font-size:24px;line-height:1.1;margin-top:2px}.gm .timer-wrap{text-align:right;background:rgba(91,92,226,.16)}.gm .timer-wrap strong{color:#FFCF78}.gm .game-main{padding:30px 36px 28px}.gm .difficulty-row{display:flex;justify-content:space-between;align-items:center;color:#AAB3C5;font-size:14px;font-weight:700}.gm .difficulty{padding:5px 10px;border-radius:999px;background:rgba(22,184,196,.14);color:#63D8DF}.gm .question-area{text-align:center;padding:24px 0 25px}.gm .question-label{font-size:14px;text-transform:uppercase;letter-spacing:.09em;color:#98A2B3;font-weight:800}.gm .question{font-size:clamp(42px,8vw,68px);font-weight:800;line-height:1.05;margin:7px 0 5px;letter-spacing:1px}.gm .feedback{min-height:27px;font-size:15px;color:#AAB3C5}.gm .feedback.correct{color:#6EE7A1}.gm .feedback.wrong{color:#FF8C8C}.gm .answers{display:grid;grid-template-columns:1fr 1fr;gap:13px}.gm .answer-btn{border:2px solid #354052;background:#202938;color:#fff;border-radius:14px;min-height:68px;padding:12px 16px;font:800 20px \"Nunito Sans\",sans-serif;cursor:pointer;transition:transform .12s,border-color .12s,background .12s}.gm .answer-btn:hover:not(:disabled),.gm .answer-btn:focus-visible:not(:disabled){border-color:#7779EE;background:#2A3344;transform:translateY(-1px);outline:none}.gm .answer-btn:disabled{cursor:default}.gm .answer-btn.correct{background:rgba(34,197,94,.2);border-color:#4ADE80}.gm .answer-btn.wrong{background:rgba(239,91,91,.2);border-color:#FB7185}.gm .controls{display:flex;justify-content:center;gap:12px;margin-top:22px}.gm .btn{height:48px;padding:0 23px;border-radius:12px;border:0;font:700 16px \"Nunito Sans\",sans-serif;cursor:pointer;transition:transform .12s,filter .12s}.gm .btn:hover,.gm .btn:focus-visible{transform:translateY(-1px);filter:brightness(1.03);outline:3px solid rgba(255,255,255,.18);outline-offset:2px}.gm .btn-primary{background:var(--brand);color:#fff}.gm .btn-secondary{background:#2B3545;color:#E7EAF0}.gm .keyboard-hint{text-align:center;color:#7F8A9D;font-size:13px;margin:16px 0 0}.gm .keyboard-hint kbd{font-family:inherit;font-weight:800;background:#2B3545;border:1px solid #465164;border-radius:5px;padding:1px 6px;color:#E7EAF0}.gm .game-over{position:absolute;inset:0;background:rgba(17,24,39,.96);display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:30px;z-index:3}.gm .game-over[hidden]{display:none}.gm .result-icon{width:58px;height:58px;border-radius:50%;display:grid;place-items:center;background:rgba(34,197,94,.16);color:#6EE7A1;font-size:30px;font-weight:800}.gm .game-over h2{font-size:34px;margin:13px 0 5px}.gm .game-over p{color:#B5BDCB;margin:0 0 20px}.gm .tip-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}.gm .tip-grid article{background:#fff;border:1px solid var(--border);border-radius:16px;padding:20px}.gm .tip-grid h3{font-size:20px;margin:0 0 7px}.gm .tip-grid p{font-size:15px;margin:0}@media(max-width:700px){.gm .page-shell{width:min(100% - 28px,1120px)}.gm .page-shell{padding-top:20px}.gm .game-card{border-radius:16px;margin-bottom:48px}.gm .game-topbar{grid-template-columns:repeat(3,1fr)}.gm .timer-wrap{grid-column:1/-1;text-align:center;padding:10px 15px;border-top:1px solid rgba(255,255,255,.08)}.gm .stat{padding:13px 10px;text-align:center}.gm .stat strong{font-size:21px}.gm .game-main{padding:22px 16px 21px}.gm .question-area{padding:25px 0 22px}.gm .question{font-size:48px}.gm .answers{gap:9px}.gm .answer-btn{min-height:62px;font-size:18px}.gm .controls{flex-direction:column}.gm .btn{width:100%}.gm .keyboard-hint{display:none}.gm .tip-grid{grid-template-columns:1fr}.gm .tip-grid article{padding:17px}}@media(max-width:390px){.gm .question{font-size:42px}.gm .answers{grid-template-columns:1fr}.gm .answer-btn{min-height:56px}.gm .stat span{font-size:11px}.gm .stat strong{font-size:19px}}";
function __ready(f){f()}
function boot(){
(() => {
  'use strict';

  const els = {
    score: document.getElementById('score'),
    streak: document.getElementById('streak'),
    best: document.getElementById('best'),
    timer: document.getElementById('timer'),
    round: document.getElementById('round-label'),
    difficulty: document.getElementById('difficulty-label'),
    question: document.getElementById('question'),
    feedback: document.getElementById('feedback'),
    answers: document.getElementById('answers'),
    start: document.getElementById('start-btn'),
    restart: document.getElementById('restart-btn'),
    gameOver: document.getElementById('game-over'),
    finalScore: document.getElementById('final-score'),
    finalStreak: document.getElementById('final-streak'),
    playAgain: document.getElementById('play-again-btn')
  };

  const BEST_KEY = 'math-game-best-score';
  const ROUND_TIME = 15;
  let state = {
    running: false,
    score: 0,
    streak: 0,
    bestStreak: 0,
    round: 1,
    time: ROUND_TIME,
    answer: null,
    locked: false,
    timerId: null
  };

  let bestScore = Number.parseInt(localStorage.getItem(BEST_KEY) || '0', 10);
  if (!Number.isFinite(bestScore)) bestScore = 0;
  els.best.textContent = bestScore;

  function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function difficultyLevel() {
    if (state.round >= 16) return { name: 'Expert', level: 4 };
    if (state.round >= 11) return { name: 'Hard', level: 3 };
    if (state.round >= 6) return { name: 'Medium', level: 2 };
    return { name: 'Easy', level: 1 };
  }

  function makeQuestion() {
    const { level } = difficultyLevel();
    let a, b, answer, operator;

    if (level === 1) {
      operator = Math.random() < 0.5 ? '+' : '-';
      a = randomInt(5, 30);
      b = randomInt(2, 20);
      if (operator === '-' && b > a) [a, b] = [b, a];
      answer = operator === '+' ? a + b : a - b;
    } else if (level === 2) {
      const ops = ['+', '-', '×'];
      operator = ops[randomInt(0, ops.length - 1)];
      if (operator === '×') {
        a = randomInt(3, 12); b = randomInt(2, 12); answer = a * b;
      } else {
        a = randomInt(12, 60); b = randomInt(5, 45);
        if (operator === '-' && b > a) [a, b] = [b, a];
        answer = operator === '+' ? a + b : a - b;
      }
    } else if (level === 3) {
      const ops = ['+', '-', '×', '÷'];
      operator = ops[randomInt(0, ops.length - 1)];
      if (operator === '×') {
        a = randomInt(7, 20); b = randomInt(3, 15); answer = a * b;
      } else if (operator === '÷') {
        b = randomInt(2, 12); answer = randomInt(3, 15); a = b * answer;
      } else {
        a = randomInt(30, 120); b = randomInt(10, 90);
        if (operator === '-' && b > a) [a, b] = [b, a];
        answer = operator === '+' ? a + b : a - b;
      }
    } else {
      const ops = ['+', '-', '×', '÷'];
      operator = ops[randomInt(0, 3)];
      if (operator === '×') {
        a = randomInt(12, 30); b = randomInt(6, 20); answer = a * b;
      } else if (operator === '÷') {
        b = randomInt(3, 15); answer = randomInt(5, 30); a = b * answer;
      } else {
        a = randomInt(80, 250); b = randomInt(20, 180);
        if (operator === '-' && b > a) [a, b] = [b, a];
        answer = operator === '+' ? a + b : a - b;
      }
    }

    return { text: `${a} ${operator} ${b} = ?`, answer };
  }

  function makeChoices(answer) {
    const choices = new Set([answer]);
    const spread = Math.max(3, Math.floor(Math.abs(answer) * 0.18));
    let attempts = 0;
    while (choices.size < 4 && attempts < 100) {
      attempts++;
      const offset = randomInt(-spread, spread) || (Math.random() < 0.5 ? -1 : 1);
      const candidate = answer + offset;
      if (candidate >= 0) choices.add(candidate);
    }
    let fallback = 1;
    while (choices.size < 4) {
      const candidate = answer + fallback++;
      if (candidate >= 0) choices.add(candidate);
    }
    return shuffle([...choices]);
  }

  function renderQuestion() {
    const q = makeQuestion();
    state.answer = q.answer;
    state.locked = false;
    const choices = makeChoices(q.answer);
    const diff = difficultyLevel();

    els.question.textContent = q.text;
    els.round.textContent = `Round ${state.round}`;
    els.difficulty.textContent = diff.name;
    els.feedback.textContent = 'Choose an answer';
    els.feedback.className = 'feedback';
    els.answers.innerHTML = '';

    choices.forEach((choice, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'answer-btn';
      button.dataset.index = String(index + 1);
      button.dataset.value = String(choice);
      button.textContent = choice.toLocaleString();
      button.setAttribute('aria-label', `Answer ${index + 1}: ${choice}`);
      button.addEventListener('click', () => submitAnswer(choice, button));
      els.answers.appendChild(button);
    });
  }

  function updateStats() {
    els.score.textContent = state.score;
    els.streak.textContent = state.streak;
    els.best.textContent = bestScore;
    els.timer.textContent = state.time;
  }

  function startTimer() {
    clearInterval(state.timerId);
    state.timerId = setInterval(() => {
      if (!state.running) return;
      state.time -= 1;
      updateStats();
      if (state.time <= 0) endGame();
    }, 1000);
  }

  function startGame() {
    clearInterval(state.timerId);
    state.running = true;
    state.score = 0;
    state.streak = 0;
    state.bestStreak = 0;
    state.round = 1;
    state.time = ROUND_TIME;
    els.start.textContent = 'Playing…';
    els.start.disabled = true;
    els.gameOver.hidden = true;
    updateStats();
    renderQuestion();
    startTimer();
  }

  function scoreForAnswer() {
    const speedBonus = Math.max(0, state.time - 5) * 2;
    const streakBonus = Math.min(state.streak, 10) * 3;
    return 10 + speedBonus + streakBonus;
  }

  function submitAnswer(value, selectedButton) {
    if (!state.running || state.locked) return;
    state.locked = true;
    const buttons = [...els.answers.querySelectorAll('.answer-btn')];
    buttons.forEach(button => { button.disabled = true; });

    if (value === state.answer) {
      state.streak += 1;
      state.bestStreak = Math.max(state.bestStreak, state.streak);
      const earned = scoreForAnswer();
      state.score += earned;
      if (state.score > bestScore) {
        bestScore = state.score;
        localStorage.setItem(BEST_KEY, String(bestScore));
      }
      selectedButton.classList.add('correct');
      els.feedback.textContent = `Correct! +${earned} points`;
      els.feedback.className = 'feedback correct';
    } else {
      state.streak = 0;
      selectedButton.classList.add('wrong');
      buttons.find(button => Number(button.dataset.value) === state.answer)?.classList.add('correct');
      els.feedback.textContent = `Not quite. The answer is ${state.answer}.`;
      els.feedback.className = 'feedback wrong';
    }
    updateStats();
    window.setTimeout(() => {
      if (!state.running) return;
      state.round += 1;
      renderQuestion();
    }, 650);
  }

  function endGame() {
    if (!state.running) return;
    state.running = false;
    clearInterval(state.timerId);
    state.timerId = null;
    state.time = 0;
    updateStats();
    els.start.textContent = 'Start Game';
    els.start.disabled = false;
    els.finalScore.textContent = state.score;
    els.finalStreak.textContent = state.bestStreak;
    els.gameOver.hidden = false;
  }

  els.start.addEventListener('click', startGame);
  els.restart.addEventListener('click', startGame);
  els.playAgain.addEventListener('click', startGame);

  document.addEventListener('keydown', event => {
    if (event.key === 'Enter' && !state.running) {
      event.preventDefault();
      startGame();
      return;
    }
    if (!state.running || state.locked) return;
    const number = Number(event.key);
    if (number >= 1 && number <= 4) {
      const button = els.answers.querySelector(`[data-index="${number}"]`);
      if (button) {
        event.preventDefault();
        submitAnswer(Number(button.dataset.value), button);
      }
    }
  });

  updateStats();
})();


}
function begin(){poster.hidden=true;gm.hidden=false;if(!booted){booted=true;var s=document.createElement("style");s.textContent=LOOK;document.head.appendChild(s);boot();}else{var r=document.getElementById("start-btn");if(r)r.click();}}
poster.addEventListener("click",begin);
var nb=document.getElementById("new");if(nb)nb.addEventListener("click",begin);
})();
