/* Crossword - game logic + its own look. Layout lives in style.css; page shell lives in the HTML. */
(function(){"use strict";
var gm=document.getElementById("gm"),poster=document.getElementById("poster"),booted=false;
var LOOK=".gm{\n  \n  \n  --teal: #16B8C4;\n  --success: #22C55E;\n  --danger: #EF5B5B;\n  \n  \n  \n  \n  \n  --game: #111827;\n  --game-secondary: #1F2937;\n  --cell-size: min(58px, 8.5vw);\n  font-family: \"Nunito Sans\", sans-serif;\n}.gm *{ box-sizing: border-box; }.gm button{ font: inherit; }.gm button{ cursor: pointer; }.gm .category-pill{\n  color: var(--brand-dark);\n  background: #EEF0FF;\n  border-radius: 999px;\n  padding: 6px 12px;\n  font-size: 14px;\n  font-weight: 700;\n}.gm .page-shell{\n  max-width: 1180px;\n  margin: 0 auto;\n  padding: 28px 22px 80px;\n}.gm h2,.gm p{ margin-top: 0; }.gm .game-card{\n  background: var(--card);\n  border: 1px solid var(--border);\n  border-radius: 20px;\n  overflow: hidden;\n  box-shadow: 0 10px 32px rgba(23, 27, 45, 0.07);\n}.gm .game-toolbar{\n  display: flex;\n  align-items: center;\n  gap: 26px;\n  padding: 18px 20px;\n  border-bottom: 1px solid var(--border);\n  flex-wrap: wrap;\n}.gm .stat{\n  min-width: 88px;\n  display: flex;\n  flex-direction: column;\n  line-height: 1.2;\n}.gm .stat-label{\n  color: var(--muted);\n  font-size: 13px;\n  font-weight: 700;\n  text-transform: uppercase;\n  letter-spacing: 0.06em;\n}.gm .stat strong{ font-size: 23px; }.gm .game-toolbar .primary{ margin-left: auto; }.gm .button{\n  border: 0;\n  min-height: 46px;\n  padding: 0 18px;\n  border-radius: 12px;\n  font-weight: 800;\n  font-size: 15px;\n  transition: transform .15s ease, background .15s ease, box-shadow .15s ease;\n}.gm .button:hover{ transform: translateY(-1px); }.gm .button:focus-visible,.gm .clue:focus-visible,.gm .cell:focus-visible{\n  outline: 3px solid rgba(91, 92, 226, .3);\n  outline-offset: 2px;\n}.gm .button.primary{\n  background: var(--brand);\n  color: #fff;\n  box-shadow: 0 6px 14px rgba(91, 92, 226, .2);\n}.gm .button.primary:hover{ background: var(--brand-dark); }.gm .button.secondary{\n  background: #EEF0FF;\n  color: var(--brand-dark);\n}.gm .game-layout{\n  display: grid;\n  grid-template-columns: minmax(0, 1fr) 340px;\n  gap: 0;\n}.gm .board-panel{\n  min-width: 0;\n  padding: 24px;\n  background: var(--game);\n}.gm .status-row{\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 16px;\n  color: #E5E7EB;\n  margin-bottom: 18px;\n  min-height: 46px;\n}.gm #statusText{ font-weight: 700; }.gm .crossword{\n  width: fit-content;\n  max-width: 100%;\n  margin: 0 auto;\n  padding: 6px;\n  background: #0B1220;\n  border-radius: 10px;\n  display: grid;\n  gap: 2px;\n  touch-action: manipulation;\n  user-select: none;\n}.gm .cell{\n  width: var(--cell-size);\n  height: var(--cell-size);\n  position: relative;\n  border: 0;\n  border-radius: 3px;\n  padding: 0;\n  background: #F9FAFB;\n  color: #101828;\n  display: grid;\n  place-items: center;\n  font-size: clamp(20px, 3vw, 28px);\n  font-weight: 800;\n  line-height: 1;\n  text-transform: uppercase;\n}.gm .cell.block{\n  background: #111827;\n  cursor: default;\n}.gm .cell.selectable{ cursor: pointer; }.gm .cell .number{\n  position: absolute;\n  left: 3px;\n  top: 2px;\n  font-size: 9px;\n  line-height: 1;\n  font-weight: 800;\n  color: #344054;\n}.gm .cell .letter{\n  transform: translateY(3px);\n}.gm .cell.selected{ background: #A5F3FC; }.gm .cell.in-word{ background: #DDF7FA; }.gm .cell.correct{ color: #157F4B; }.gm .cell.wrong{\n  color: var(--danger);\n  background: #FEECEC;\n}.gm .cell.in-word.selected{\n  background: #67E8F9;\n}.gm .cell.block::after{\n  content: \"\";\n}.gm .clues-panel{\n  padding: 24px;\n  background: #fff;\n  border-left: 1px solid var(--border);\n  max-height: 620px;\n  overflow: auto;\n}.gm .clue-section + .clue-section{ margin-top: 28px; }.gm .clue-section h2{\n  font-size: 20px;\n  margin-bottom: 10px;\n}.gm .clue-list{ display: grid; gap: 5px; }.gm .clue{\n  border: 0;\n  background: transparent;\n  border-radius: 9px;\n  text-align: left;\n  padding: 8px 10px;\n  color: var(--text);\n  line-height: 1.35;\n  font-size: 15px;\n}.gm .clue:hover{ background: #F6F7FB; }.gm .clue.active{\n  background: #EEF0FF;\n  color: var(--brand-dark);\n  font-weight: 700;\n}.gm .clue-number{ font-weight: 800; margin-right: 5px; }.gm .mobile-tools{\n  display: flex;\n  justify-content: center;\n  gap: 8px;\n  margin-top: 18px;\n}.gm .control{\n  background: var(--game-secondary);\n  color: #F9FAFB;\n  min-width: 88px;\n}.gm .keyboard-hint{\n  margin: 18px auto 0;\n  max-width: 720px;\n  color: #98A2B3;\n  font-size: 13px;\n  text-align: center;\n}.gm kbd{\n  border: 1px solid #475467;\n  border-bottom-width: 2px;\n  border-radius: 5px;\n  padding: 1px 5px;\n  color: #E5E7EB;\n  background: #1F2937;\n}.gm .modal[hidden]{ display: none; }.gm .modal{\n  position: fixed;\n  inset: 0;\n  z-index: 20;\n  display: grid;\n  place-items: center;\n  padding: 20px;\n}.gm .modal-backdrop{\n  position: absolute;\n  inset: 0;\n  background: rgba(17, 24, 39, .64);\n}.gm .modal-card{\n  position: relative;\n  width: min(420px, 100%);\n  padding: 34px;\n  text-align: center;\n  background: #fff;\n  border-radius: 20px;\n  box-shadow: 0 24px 80px rgba(0,0,0,.25);\n}.gm .celebration{\n  width: 64px;\n  height: 64px;\n  margin: 0 auto 16px;\n  display: grid;\n  place-items: center;\n  border-radius: 50%;\n  color: #fff;\n  background: var(--success);\n  font-size: 32px;\n  font-weight: 800;\n}.gm .modal-card h2{ margin-bottom: 8px; }.gm .modal-card p{ color: var(--muted); }.gm .wide{ width: 100%; }@media (max-width: 900px){.gm .game-layout{ grid-template-columns: 1fr; }.gm .clues-panel{\n    border-left: 0;\n    border-top: 1px solid var(--border);\n    max-height: none;\n  }.gm .clue-section + .clue-section{ margin-top: 24px; }}@media (max-width: 620px){.gm{ --cell-size: min(47px, 11vw); }.gm .category-pill{ display: none; }.gm .page-shell{ padding: 20px 14px 60px; }.gm .game-toolbar{\n    gap: 14px;\n    padding: 14px;\n  }.gm .game-toolbar .primary{\n    width: 100%;\n    margin-left: 0;\n  }.gm .board-panel{ padding: 14px 8px 18px; }.gm .status-row{\n    padding: 0 5px;\n    align-items: stretch;\n  }.gm #statusText{ font-size: 14px; }.gm .status-row .secondary{ min-height: 40px; padding: 0 12px; }.gm .clues-panel{ padding: 18px 14px; }.gm .keyboard-hint{ padding: 0 10px; }}@media (max-width: 390px){.gm{ --cell-size: min(40px, 10.7vw); }.gm .cell .number{ font-size: 8px; }}";
function __ready(f){f()}
function boot(){
(() => {
  "use strict";

  // A compact, self-contained crossword puzzle. "#" represents a blocked cell.
  const PUZZLE = {
    grid: [
      "#######CATS###",
      "#######R######",
      "##PLANT#######",
      "#######S######",
      "#######S######",
      "#######W######",
      "#######ORD####",
      "#######E######",
      "#######R######"
    ],
    // Answers are generated from the intended layout below.
    words: [
      { number: 1, direction: "Across", row: 0, col: 7, answer: "CATS", clue: "Feline pets" },
      { number: 2, direction: "Across", row: 2, col: 2, answer: "PLANT", clue: "A living thing that grows from a seed" },
      { number: 3, direction: "Down", row: 0, col: 7, answer: "CROSSWORD", clue: "Word puzzle with intersecting answers" }
    ]
  };

  // Normalize the visual grid from the word definitions. This avoids relying
  // on prefilled answer letters in the board.
  const ROWS = 9;
  const COLS = 14;
  const cells = Array.from({ length: ROWS }, () => Array(COLS).fill(null));

  PUZZLE.words.forEach(word => {
    for (let i = 0; i < word.answer.length; i++) {
      const r = word.row + (word.direction === "Down" ? i : 0);
      const c = word.col + (word.direction === "Across" ? i : 0);
      cells[r][c] = { ...cells[r][c], row: r, col: c, letter: word.answer[i] };
    }
  });

  // Add numbering: a cell receives a clue number if it starts an Across or Down word.
  const starts = new Map();
  PUZZLE.words.forEach(word => {
    starts.set(`${word.row}-${word.col}`, word.number);
  });

  const crosswordEl = document.getElementById("crossword");
  const acrossEl = document.getElementById("acrossClues");
  const downEl = document.getElementById("downClues");
  const scoreEl = document.getElementById("score");
  const timerEl = document.getElementById("timer");
  const progressEl = document.getElementById("progress");
  const statusEl = document.getElementById("statusText");
  const modal = document.getElementById("completionModal");
  const completionText = document.getElementById("completionText");

  let current = { row: 0, col: 7 };
  let direction = "Down";
  let answers = {};
  let checked = {};
  let score = 0;
  let elapsed = 0;
  let timerId = null;
  let started = false;
  let finished = false;

  const playableCells = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (cells[r][c]) playableCells.push({ row: r, col: c });
    }
  }

  function key(row, col) {
    return `${row}-${col}`;
  }

  function formatTime(seconds) {
    const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");
    return `${mins}:${secs}`;
  }

  function startTimer() {
    if (started || finished) return;
    started = true;
    timerId = setInterval(() => {
      elapsed += 1;
      timerEl.textContent = formatTime(elapsed);
    }, 1000);
  }

  function stopTimer() {
    clearInterval(timerId);
    timerId = null;
  }

  function getWordAt(row, col, dir) {
    return PUZZLE.words.find(word => {
      if (word.direction !== dir) return false;
      if (dir === "Across") {
        return row === word.row && col >= word.col && col < word.col + word.answer.length;
      }
      return col === word.col && row >= word.row && row < word.row + word.answer.length;
    });
  }

  function getWordsAt(row, col) {
    return PUZZLE.words.filter(word => {
      if (word.direction === "Across") {
        return row === word.row && col >= word.col && col < word.col + word.answer.length;
      }
      return col === word.col && row >= word.row && row < word.row + word.answer.length;
    });
  }

  function chooseDirection(row, col) {
    const words = getWordsAt(row, col);
    if (words.length === 1) return words[0].direction;
    if (words.some(w => w.direction === direction)) return direction;
    return "Across";
  }

  function renderBoard() {
    crosswordEl.innerHTML = "";
    crosswordEl.style.gridTemplateColumns = `repeat(${COLS}, var(--cell-size))`;

    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const data = cells[r][c];
        const cell = document.createElement("button");
        cell.type = "button";
        cell.className = "cell";
        cell.dataset.row = r;
        cell.dataset.col = c;
        cell.setAttribute("role", "gridcell");

        if (!data) {
          cell.classList.add("block");
          cell.disabled = true;
          cell.setAttribute("aria-hidden", "true");
        } else {
          cell.classList.add("selectable");
          cell.setAttribute("aria-label", `Row ${r + 1}, column ${c + 1}`);
          const n = starts.get(key(r, c));
          if (n) {
            const number = document.createElement("span");
            number.className = "number";
            number.textContent = n;
            cell.appendChild(number);
          }

          const letter = document.createElement("span");
          letter.className = "letter";
          letter.textContent = answers[key(r, c)] || "";
          cell.appendChild(letter);

          if (checked[key(r, c)] === false) cell.classList.add("wrong");
          if (checked[key(r, c)] === true) cell.classList.add("correct");

          cell.addEventListener("click", () => {
            if (finished) return;
            const sameCell = current.row === r && current.col === c;
            if (sameCell && getWordsAt(r, c).length > 1) {
              direction = direction === "Across" ? "Down" : "Across";
            } else {
              direction = chooseDirection(r, c);
            }
            current = { row: r, col: c };
            renderBoard();
            updateStatus();
            startTimer();
          });
        }

        crosswordEl.appendChild(cell);
      }
    }

    highlightActiveWord();
  }

  function highlightActiveWord() {
    const activeWord = getWordAt(current.row, current.col, direction);
    if (!activeWord) return;

    document.querySelectorAll(".cell.selectable").forEach(el => {
      const r = Number(el.dataset.row);
      const c = Number(el.dataset.col);
      const inside = direction === "Across"
        ? r === activeWord.row && c >= activeWord.col && c < activeWord.col + activeWord.answer.length
        : c === activeWord.col && r >= activeWord.row && r < activeWord.row + activeWord.answer.length;
      if (inside) el.classList.add("in-word");
      if (r === current.row && c === current.col) el.classList.add("selected");
    });
  }

  function renderClues() {
    acrossEl.innerHTML = "";
    downEl.innerHTML = "";

    PUZZLE.words.filter(w => w.direction === "Across").forEach(word => {
      acrossEl.appendChild(createClue(word));
    });
    PUZZLE.words.filter(w => w.direction === "Down").forEach(word => {
      downEl.appendChild(createClue(word));
    });
  }

  function createClue(word) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "clue";
    button.dataset.number = word.number;
    button.dataset.direction = word.direction;
    button.innerHTML = `<span class="clue-number">${word.number}.</span>${word.clue}`;
    button.addEventListener("click", () => {
      if (finished) return;
      current = { row: word.row, col: word.col };
      direction = word.direction;
      startTimer();
      renderBoard();
      updateStatus();
      button.scrollIntoView({ block: "nearest" });
    });
    return button;
  }

  function updateClueHighlight() {
    document.querySelectorAll(".clue").forEach(button => {
      const active = Number(button.dataset.number) === getWordAt(current.row, current.col, direction)?.number &&
        button.dataset.direction === direction;
      button.classList.toggle("active", Boolean(active));
    });
  }

  function updateStatus() {
    const word = getWordAt(current.row, current.col, direction);
    if (word) {
      statusEl.textContent = `${word.number} ${word.direction}: ${word.clue}`;
    } else {
      statusEl.textContent = "Select a square or clue to begin.";
    }
    updateClueHighlight();
  }

  function setAnswer(letter) {
    if (finished) return;
    startTimer();
    const k = key(current.row, current.col);
    if (!cells[current.row][current.col]) return;
    answers[k] = letter;
    delete checked[k];
    score = Math.max(0, score);
    renderBoard();
    updateScoreAndProgress();

    if (letter) moveNext();
    checkCompletion();
  }

  function moveNext() {
    const word = getWordAt(current.row, current.col, direction);
    if (!word) return;

    const index = direction === "Across"
      ? current.col - word.col
      : current.row - word.row;

    if (index < word.answer.length - 1) {
      if (direction === "Across") current.col += 1;
      else current.row += 1;
    }
    renderBoard();
    updateStatus();
  }

  function movePrev() {
    const word = getWordAt(current.row, current.col, direction);
    if (!word) return;

    const index = direction === "Across"
      ? current.col - word.col
      : current.row - word.row;

    if (index > 0) {
      if (direction === "Across") current.col -= 1;
      else current.row -= 1;
    }
    renderBoard();
    updateStatus();
  }

  function erase() {
    if (finished) return;
    startTimer();
    const k = key(current.row, current.col);
    if (answers[k]) {
      delete answers[k];
      delete checked[k];
    } else {
      movePrev();
      const prevKey = key(current.row, current.col);
      delete answers[prevKey];
      delete checked[prevKey];
    }
    renderBoard();
    updateScoreAndProgress();
    updateStatus();
  }

  function checkAnswers() {
    if (finished) return;
    startTimer();
    let newlyCorrect = 0;
    let wrongCount = 0;

    playableCells.forEach(({ row, col }) => {
      const k = key(row, col);
      if (!answers[k]) return;
      if (answers[k] === cells[row][col].letter) {
        if (checked[k] !== true) {
          score += 10;
          newlyCorrect += 1;
        }
        checked[k] = true;
      } else {
        checked[k] = false;
        wrongCount += 1;
      }
    });

    renderBoard();
    updateScoreAndProgress();

    if (wrongCount > 0) {
      statusEl.textContent = `${wrongCount} letter${wrongCount === 1 ? "" : "s"} need another look.`;
    } else if (newlyCorrect > 0) {
      statusEl.textContent = `${newlyCorrect} correct letter${newlyCorrect === 1 ? "" : "s"}!`;
    } else {
      statusEl.textContent = "Check your entries when you are ready.";
    }
    checkCompletion();
  }

  function updateScoreAndProgress() {
    const filled = playableCells.filter(({ row, col }) => answers[key(row, col)]).length;
    scoreEl.textContent = score;
    progressEl.textContent = `${filled}/${playableCells.length}`;
  }

  function checkCompletion() {
    const complete = playableCells.every(({ row, col }) => answers[key(row, col)] === cells[row][col].letter);
    if (!complete || finished) return;

    finished = true;
    stopTimer();
    score += Math.max(50, 300 - elapsed);
    scoreEl.textContent = score;
    completionText.textContent = `You solved the crossword in ${formatTime(elapsed)} with a score of ${score}.`;
    modal.hidden = false;
    statusEl.textContent = "Puzzle solved!";
  }

  function resetGame() {
    stopTimer();
    answers = {};
    checked = {};
    score = 0;
    elapsed = 0;
    started = false;
    finished = false;
    current = { row: 0, col: 7 };
    direction = "Down";
    timerEl.textContent = "00:00";
    modal.hidden = true;
    renderBoard();
    renderClues();
    updateScoreAndProgress();
    updateStatus();
  }

  function handleKeydown(event) {
    if (finished) return;
    const activeTag = document.activeElement?.tagName;
    if (activeTag === "BUTTON" && !document.activeElement.classList.contains("cell")) {
      if (event.key === " ") event.preventDefault();
    }

    if (/^[a-zA-Z]$/.test(event.key)) {
      event.preventDefault();
      setAnswer(event.key.toUpperCase());
      return;
    }

    switch (event.key) {
      case "Backspace":
        event.preventDefault();
        erase();
        break;
      case " ":
        event.preventDefault();
        if (getWordsAt(current.row, current.col).length > 1) {
          direction = direction === "Across" ? "Down" : "Across";
          renderBoard();
          updateStatus();
        }
        break;
      case "ArrowLeft":
        event.preventDefault();
        direction = "Across";
        if (current.col > 0 && cells[current.row][current.col - 1]) current.col -= 1;
        renderBoard(); updateStatus(); startTimer();
        break;
      case "ArrowRight":
        event.preventDefault();
        direction = "Across";
        if (current.col < COLS - 1 && cells[current.row][current.col + 1]) current.col += 1;
        renderBoard(); updateStatus(); startTimer();
        break;
      case "ArrowUp":
        event.preventDefault();
        direction = "Down";
        if (current.row > 0 && cells[current.row - 1][current.col]) current.row -= 1;
        renderBoard(); updateStatus(); startTimer();
        break;
      case "ArrowDown":
        event.preventDefault();
        direction = "Down";
        if (current.row < ROWS - 1 && cells[current.row + 1][current.col]) current.row += 1;
        renderBoard(); updateStatus(); startTimer();
        break;
    }
  }

  document.getElementById("newGameBtn").addEventListener("click", resetGame);
  document.getElementById("playAgainBtn").addEventListener("click", resetGame);
  document.getElementById("checkBtn").addEventListener("click", checkAnswers);
  document.getElementById("eraseBtn").addEventListener("click", erase);

  document.getElementById("acrossBtn").addEventListener("click", () => {
    direction = "Across";
    const word = getWordAt(current.row, current.col, "Across");
    if (!word) {
      const first = PUZZLE.words.find(w => w.direction === "Across");
      current = { row: first.row, col: first.col };
    }
    renderBoard();
    updateStatus();
  });

  document.getElementById("downBtn").addEventListener("click", () => {
    direction = "Down";
    const word = getWordAt(current.row, current.col, "Down");
    if (!word) {
      const first = PUZZLE.words.find(w => w.direction === "Down");
      current = { row: first.row, col: first.col };
    }
    renderBoard();
    updateStatus();
  });

  document.addEventListener("keydown", handleKeydown);

  renderClues();
  resetGame();
})();


}
function begin(){poster.hidden=true;gm.hidden=false;if(!booted){booted=true;var s=document.createElement("style");s.textContent=LOOK;document.head.appendChild(s);boot();}else{var r=document.getElementById("newGameBtn");if(r)r.click();}}
poster.addEventListener("click",begin);
var nb=document.getElementById("new");if(nb)nb.addEventListener("click",begin);
})();
