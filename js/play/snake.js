/* Snake - game logic + its own look. Layout lives in style.css; page shell lives in the HTML. */
(function(){"use strict";
var gm=document.getElementById("gm"),poster=document.getElementById("poster"),booted=false;
var LOOK=".gm{\n  --primary: #5B5CE2;\n  --primary-dark: #4546B8;\n  --secondary: #16B8C4;\n  --action: #FFB84D;\n  --success: #22C55E;\n  --danger: #EF5B5B;\n\n  --background: #F6F7FB;\n  \n  \n  \n  \n\n  --game-bg: #111827;\n  --game-secondary: #1F2937;\n\n  --radius: 18px;\n  \n}.gm *{\n  box-sizing: border-box;\n}.gm button{\n  font-family: inherit;\n}.gm button{\n  cursor: pointer;\n}.gm button:focus-visible,.gm summary:focus-visible{\n  outline: 3px solid rgba(91, 92, 226, 0.35);\n  outline-offset: 3px;\n}.gm .home-link{\n  display: inline-flex;\n  align-items: center;\n  gap: 8px;\n  color: var(--muted);\n  font-size: 15px;\n  font-weight: 700;\n  transition: color 0.2s ease;\n}.gm .home-link:hover{\n  color: var(--primary);\n}.gm .page-container{\n  width: min(1120px, calc(100% - 40px));\n  margin: 0 auto;\n  padding: 30px 0 80px;\n}.gm .game-section{\n  margin-bottom: 72px;\n}.gm .game-card{\n  overflow: hidden;\n  padding: 22px;\n  border: 1px solid var(--border);\n  border-radius: 20px;\n  background: var(--card);\n  box-shadow: var(--shadow);\n}.gm .game-toolbar{\n  display: flex;\n  align-items: stretch;\n  gap: 12px;\n  margin-bottom: 18px;\n}.gm .score-box,.gm .status-box{\n  min-width: 120px;\n  padding: 10px 16px;\n  border: 1px solid var(--border);\n  border-radius: 12px;\n  background: #FAFAFC;\n}.gm .score-box{\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 14px;\n}.gm .score-box span{\n  color: var(--muted);\n  font-size: 13px;\n  font-weight: 700;\n}.gm .score-box strong{\n  color: var(--text);\n  font-size: 23px;\n  line-height: 1;\n  font-weight: 800;\n}.gm .status-box{\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  color: var(--primary);\n  font-size: 14px;\n  font-weight: 800;\n}.gm .canvas-wrapper{\n  position: relative;\n  width: min(100%, 700px);\n  margin: 0 auto;\n  overflow: hidden;\n  border: 5px solid var(--game-secondary);\n  border-radius: 16px;\n  background: var(--game-bg);\n  touch-action: none;\n  user-select: none;\n}.gm #gameCanvas{\n  display: block;\n  width: 100%;\n  height: auto;\n  aspect-ratio: 1 / 1;\n  background: var(--game-bg);\n}.gm .game-overlay{\n  position: absolute;\n  inset: 0;\n  display: grid;\n  place-items: center;\n  padding: 24px;\n  background: rgba(17, 24, 39, 0.84);\n  opacity: 1;\n  visibility: visible;\n  transition: opacity 0.2s ease, visibility 0.2s ease;\n}.gm .game-overlay.hidden{\n  opacity: 0;\n  visibility: hidden;\n  pointer-events: none;\n}.gm .overlay-content{\n  width: min(100%, 420px);\n  padding: 32px 24px;\n  border: 1px solid rgba(255, 255, 255, 0.12);\n  border-radius: 18px;\n  background: rgba(31, 41, 55, 0.94);\n  text-align: center;\n  color: #fff;\n}.gm .overlay-icon{\n  margin-bottom: 10px;\n  font-size: 44px;\n  line-height: 1;\n}.gm .overlay-content h2{\n  margin: 0 0 8px;\n  font-size: 28px;\n  line-height: 1.2;\n  font-weight: 800;\n}.gm .overlay-content p{\n  margin: 0 auto 22px;\n  color: #CBD5E1;\n  font-size: 15px;\n  line-height: 1.55;\n}.gm .primary-button,.gm .secondary-button{\n  min-height: 48px;\n  padding: 0 22px;\n  border: 0;\n  border-radius: 11px;\n  font-size: 16px;\n  font-weight: 800;\n  transition:\n    transform 0.15s ease,\n    background 0.15s ease,\n    box-shadow 0.15s ease;\n}.gm .primary-button{\n  background: var(--primary);\n  color: #fff;\n  box-shadow: 0 6px 18px rgba(91, 92, 226, 0.28);\n}.gm .primary-button:hover{\n  background: var(--primary-dark);\n  transform: translateY(-1px);\n}.gm .secondary-button{\n  border: 1px solid var(--border);\n  background: #fff;\n  color: var(--text);\n}.gm .secondary-button:hover{\n  border-color: var(--primary);\n  color: var(--primary);\n}.gm .game-actions{\n  display: flex;\n  justify-content: center;\n  gap: 12px;\n  margin-top: 18px;\n}.gm .control-hint{\n  margin: 18px 0 0;\n  color: var(--muted);\n  font-size: 14px;\n  text-align: center;\n}.gm .mobile-controls{\n  display: none;\n  margin: 20px auto 0;\n}.gm .control-row{\n  display: flex;\n  justify-content: center;\n  gap: 10px;\n}.gm .control-button{\n  width: 58px;\n  height: 52px;\n  border: 1px solid var(--border);\n  border-radius: 12px;\n  background: #fff;\n  color: var(--text);\n  font-size: 25px;\n  font-weight: 800;\n  line-height: 1;\n  box-shadow: 0 4px 12px rgba(23, 27, 45, 0.06);\n  -webkit-tap-highlight-color: transparent;\n}.gm .control-button:hover,.gm .control-button:active{\n  border-color: var(--primary);\n  background: #F1F1FF;\n  color: var(--primary);\n}.gm .control-button.up{\n  display: block;\n  margin: 0 auto 10px;\n}.gm .instruction-grid{\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 18px;\n  margin-top: 30px;\n}.gm .info-card{\n  padding: 24px;\n  border: 1px solid var(--border);\n  border-radius: 16px;\n  background: var(--card);\n}.gm .info-number{\n  margin-bottom: 18px;\n  color: var(--primary);\n  font-size: 14px;\n  font-weight: 800;\n}.gm .info-card h3{\n  margin: 0 0 8px;\n  font-size: 21px;\n  line-height: 1.3;\n  font-weight: 700;\n}.gm .info-card p{\n  margin: 0;\n  color: var(--muted);\n  font-size: 16px;\n  line-height: 1.6;\n}.gm .controls-table{\n  display: grid;\n  grid-template-columns: repeat(2, 1fr);\n  gap: 12px;\n  margin-top: 26px;\n}.gm .control-item{\n  display: flex;\n  align-items: center;\n  gap: 14px;\n  min-height: 64px;\n  padding: 12px 16px;\n  border: 1px solid var(--border);\n  border-radius: 12px;\n  background: var(--card);\n  color: var(--muted);\n  font-size: 15px;\n  font-weight: 600;\n}.gm .key{\n  min-width: 62px;\n  padding: 6px 8px;\n  border: 1px solid var(--border);\n  border-radius: 8px;\n  background: #F8F8FB;\n  color: var(--text);\n  font-size: 13px;\n  font-weight: 800;\n  text-align: center;\n}.gm .tips-list{\n  max-width: 850px;\n  margin: 22px 0 0;\n  padding-left: 24px;\n  color: var(--muted);\n}.gm .tips-list li{\n  margin-bottom: 10px;\n  padding-left: 5px;\n}.gm .coming-soon{\n  grid-column: 2;\n  color: var(--primary);\n  font-size: 12px;\n  font-weight: 800;\n}@media (max-width: 800px){.gm .page-container{\n    padding-top: 24px;\n  }.gm .game-card{\n    padding: 14px;\n  }.gm .game-toolbar{\n    flex-wrap: wrap;\n  }.gm .score-box{\n    flex: 1;\n    min-width: 0;\n  }.gm .status-box{\n    width: 100%;\n    min-height: 44px;\n  }.gm .mobile-controls{\n    display: block;\n  }.gm .instruction-grid{\n    grid-template-columns: 1fr;\n  }.gm .controls-table{\n    grid-template-columns: 1fr;\n  }}@media (max-width: 520px){.gm .page-container{\n    width: min(100% - 28px, 1120px);\n  }.gm .home-link{\n    font-size: 14px;\n  }.gm .game-section{\n    margin-bottom: 56px;\n  }.gm .game-toolbar{\n    gap: 8px;\n  }.gm .score-box{\n    padding: 9px 12px;\n  }.gm .score-box span{\n    font-size: 12px;\n  }.gm .score-box strong{\n    font-size: 20px;\n  }.gm .game-actions{\n    gap: 8px;\n  }.gm .primary-button,.gm .secondary-button{\n    min-height: 46px;\n    padding: 0 17px;\n    font-size: 15px;\n  }.gm .control-hint{\n    font-size: 13px;\n  }.gm .info-card{\n    padding: 20px;\n  }}";
function __ready(f){f()}
function boot(){
"use strict";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const scoreElement = document.getElementById("score");
const highScoreElement = document.getElementById("highScore");
const gameStatusElement = document.getElementById("gameStatus");

const overlay = document.getElementById("gameOverlay");
const overlayTitle = document.getElementById("overlayTitle");
const overlayMessage = document.getElementById("overlayMessage");
const startButton = document.getElementById("startButton");

const pauseButton = document.getElementById("pauseButton");
const restartButton = document.getElementById("restartButton");

const controlButtons = document.querySelectorAll("[data-direction]");

const GRID_SIZE = 24;
const INITIAL_SPEED = 145;
const MIN_SPEED = 70;
const SPEED_STEP = 4;
const POINTS_PER_FOOD = 10;

let snake = [];
let food = { x: 0, y: 0 };

let direction = { x: 1, y: 0 };
let nextDirection = { x: 1, y: 0 };

let score = 0;
let highScore = Number(localStorage.getItem("snakeHighScore")) || 0;

let gameRunning = false;
let gamePaused = false;
let gameOver = false;

let gameTimer = null;
let currentSpeed = INITIAL_SPEED;

let touchStartX = 0;
let touchStartY = 0;

highScoreElement.textContent = highScore;

/* -------------------------------------------------------
   Canvas setup
------------------------------------------------------- */

function resizeCanvas() {
  const rect = canvas.getBoundingClientRect();
  const size = Math.max(1, Math.floor(rect.width));

  const devicePixelRatio = Math.min(window.devicePixelRatio || 1, 2);

  canvas.width = Math.floor(size * devicePixelRatio);
  canvas.height = Math.floor(size * devicePixelRatio);

  ctx.setTransform(
    devicePixelRatio,
    0,
    0,
    devicePixelRatio,
    0,
    0
  );

  draw();
}

window.addEventListener("resize", resizeCanvas);

/* -------------------------------------------------------
   Game initialization
------------------------------------------------------- */

function createStartingSnake() {
  const center = Math.floor(GRID_SIZE / 2);

  return [
    { x: center, y: center },
    { x: center - 1, y: center },
    { x: center - 2, y: center },
    { x: center - 3, y: center }
  ];
}

function initializeGame() {
  clearInterval(gameTimer);

  snake = createStartingSnake();

  direction = { x: 1, y: 0 };
  nextDirection = { x: 1, y: 0 };

  score = 0;
  currentSpeed = INITIAL_SPEED;

  gameRunning = false;
  gamePaused = false;
  gameOver = false;

  updateScore();
  updateStatus("Ready");

  placeFood();
  draw();

  showOverlay(
    "Snake Game",
    "Eat the food and grow your snake. Don't hit the walls or yourself.",
    "Start Game"
  );

  pauseButton.textContent = "Pause";
}

function startGame() {
  if (gameRunning && !gamePaused) {
    return;
  }

  if (gameOver) {
    initializeGame();
  }

  gameRunning = true;
  gamePaused = false;
  gameOver = false;

  hideOverlay();
  updateStatus("Playing");

  pauseButton.textContent = "Pause";

  clearInterval(gameTimer);
  gameTimer = setInterval(gameLoop, currentSpeed);

  draw();
}

function restartGame() {
  initializeGame();
  startGame();
}

function pauseGame() {
  if (!gameRunning || gameOver) {
    return;
  }

  gamePaused = !gamePaused;

  if (gamePaused) {
    clearInterval(gameTimer);
    updateStatus("Paused");

    showOverlay(
      "Game Paused",
      "Take a break and continue when you're ready.",
      "Resume Game"
    );

    pauseButton.textContent = "Resume";
  } else {
    hideOverlay();
    updateStatus("Playing");

    pauseButton.textContent = "Pause";

    gameTimer = setInterval(gameLoop, currentSpeed);
  }
}

/* -------------------------------------------------------
   Main game loop
------------------------------------------------------- */

function gameLoop() {
  if (!gameRunning || gamePaused || gameOver) {
    return;
  }

  direction = nextDirection;

  const head = snake[0];

  const newHead = {
    x: head.x + direction.x,
    y: head.y + direction.y
  };

  if (hasHitWall(newHead) || hasHitSelf(newHead)) {
    endGame();
    return;
  }

  snake.unshift(newHead);

  if (newHead.x === food.x && newHead.y === food.y) {
    score += POINTS_PER_FOOD;

    if (score > highScore) {
      highScore = score;
      localStorage.setItem("snakeHighScore", String(highScore));
    }

    updateScore();
    increaseSpeed();
    placeFood();
  } else {
    snake.pop();
  }

  draw();
}

/* -------------------------------------------------------
   Collision detection
------------------------------------------------------- */

function hasHitWall(position) {
  return (
    position.x < 0 ||
    position.x >= GRID_SIZE ||
    position.y < 0 ||
    position.y >= GRID_SIZE
  );
}

function hasHitSelf(position) {
  /*
   When moving forward without eating, the current tail
   will be removed during this tick. Therefore it is valid
   to move into that final tail cell.
  */
  const bodyLengthToCheck =
    position.x === food.x && position.y === food.y
      ? snake.length
      : snake.length - 1;

  for (let i = 0; i < bodyLengthToCheck; i++) {
    if (
      snake[i].x === position.x &&
      snake[i].y === position.y
    ) {
      return true;
    }
  }

  return false;
}

/* -------------------------------------------------------
   Food
------------------------------------------------------- */

function placeFood() {
  const availableCells = [];

  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      const occupied = snake.some(
        segment => segment.x === x && segment.y === y
      );

      if (!occupied) {
        availableCells.push({ x, y });
      }
    }
  }

  if (availableCells.length === 0) {
    winGame();
    return;
  }

  const randomIndex = Math.floor(
    Math.random() * availableCells.length
  );

  food = availableCells[randomIndex];
}

/* -------------------------------------------------------
   Speed
------------------------------------------------------- */

function increaseSpeed() {
  const newSpeed = Math.max(
    MIN_SPEED,
    INITIAL_SPEED - Math.floor(score / POINTS_PER_FOOD) * SPEED_STEP
  );

  if (newSpeed === currentSpeed) {
    return;
  }

  currentSpeed = newSpeed;

  clearInterval(gameTimer);

  if (gameRunning && !gamePaused && !gameOver) {
    gameTimer = setInterval(gameLoop, currentSpeed);
  }
}

/* -------------------------------------------------------
   Win / Game over
------------------------------------------------------- */

function endGame() {
  gameRunning = false;
  gamePaused = false;
  gameOver = true;

  clearInterval(gameTimer);

  updateStatus("Game Over");
  pauseButton.textContent = "Pause";

  draw();

  showOverlay(
    "Game Over",
    `Your score was ${score}. Try again and beat your best score.`,
    "Play Again"
  );
}

function winGame() {
  gameRunning = false;
  gamePaused = false;
  gameOver = true;

  clearInterval(gameTimer);

  updateStatus("You Win!");
  pauseButton.textContent = "Pause";

  if (score > highScore) {
    highScore = score;
    localStorage.setItem("snakeHighScore", String(highScore));
    updateScore();
  }

  showOverlay(
    "You Win!",
    `Amazing! You filled the board with a score of ${score}.`,
    "Play Again"
  );
}

/* -------------------------------------------------------
   Direction controls
------------------------------------------------------- */

function setDirection(newDirection) {
  if (!gameRunning || gamePaused || gameOver) {
    return;
  }

  const oppositeDirection =
    direction.x + newDirection.x === 0 &&
    direction.y + newDirection.y === 0;

  if (oppositeDirection) {
    return;
  }

  nextDirection = newDirection;
}

function handleKeyDown(event) {
  const key = event.key.toLowerCase();

  const directionMap = {
    arrowup: { x: 0, y: -1 },
    w: { x: 0, y: -1 },

    arrowdown: { x: 0, y: 1 },
    s: { x: 0, y: 1 },

    arrowleft: { x: -1, y: 0 },
    a: { x: -1, y: 0 },

    arrowright: { x: 1, y: 0 },
    d: { x: 1, y: 0 }
  };

  if (key === " ") {
    event.preventDefault();

    if (!gameRunning && !gameOver) {
      startGame();
    } else {
      pauseGame();
    }

    return;
  }

  if (directionMap[key]) {
    event.preventDefault();

    if (!gameRunning && !gameOver) {
      startGame();
    }

    setDirection(directionMap[key]);
  }

  if (key === "enter" && gameOver) {
    restartGame();
  }
}

document.addEventListener("keydown", handleKeyDown);

/* -------------------------------------------------------
   Touch controls
------------------------------------------------------- */

canvas.addEventListener(
  "touchstart",
  event => {
    const touch = event.changedTouches[0];

    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
  },
  { passive: true }
);

canvas.addEventListener(
  "touchend",
  event => {
    const touch = event.changedTouches[0];

    const deltaX = touch.clientX - touchStartX;
    const deltaY = touch.clientY - touchStartY;

    const minimumSwipeDistance = 25;

    if (
      Math.abs(deltaX) < minimumSwipeDistance &&
      Math.abs(deltaY) < minimumSwipeDistance
    ) {
      if (!gameRunning && !gameOver) {
        startGame();
      } else if (gamePaused) {
        pauseGame();
      }

      return;
    }

    if (!gameRunning || gamePaused || gameOver) {
      return;
    }

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > 0) {
        setDirection({ x: 1, y: 0 });
      } else {
        setDirection({ x: -1, y: 0 });
      }
    } else {
      if (deltaY > 0) {
        setDirection({ x: 0, y: 1 });
      } else {
        setDirection({ x: 0, y: -1 });
      }
    }
  },
  { passive: true }
);

controlButtons.forEach(button => {
  button.addEventListener("click", () => {
    const selectedDirection = button.dataset.direction;

    const directions = {
      up: { x: 0, y: -1 },
      down: { x: 0, y: 1 },
      left: { x: -1, y: 0 },
      right: { x: 1, y: 0 }
    };

    if (!gameRunning && !gameOver) {
      startGame();
    }

    if (gamePaused) {
      return;
    }

    setDirection(directions[selectedDirection]);
  });
});

/* -------------------------------------------------------
   Drawing
------------------------------------------------------- */

function draw() {
  const canvasSize = canvas.getBoundingClientRect().width;

  if (!canvasSize) {
    return;
  }

  const cellSize = canvasSize / GRID_SIZE;

  drawBackground(canvasSize, cellSize);
  drawFood(cellSize);
  drawSnake(cellSize);
}

function drawBackground(canvasSize, cellSize) {
  ctx.fillStyle = "#111827";
  ctx.fillRect(0, 0, canvasSize, canvasSize);

  ctx.strokeStyle = "rgba(255, 255, 255, 0.045)";
  ctx.lineWidth = 1;

  for (let i = 1; i < GRID_SIZE; i++) {
    const position = Math.round(i * cellSize);

    ctx.beginPath();
    ctx.moveTo(position, 0);
    ctx.lineTo(position, canvasSize);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, position);
    ctx.lineTo(canvasSize, position);
    ctx.stroke();
  }
}

function drawSnake(cellSize) {
  snake.forEach((segment, index) => {
    const padding = Math.max(2, cellSize * 0.08);
    const x = segment.x * cellSize + padding;
    const y = segment.y * cellSize + padding;
    const size = cellSize - padding * 2;

    ctx.fillStyle = index === 0 ? "#22C55E" : "#16B8C4";

    roundRect(
      ctx,
      x,
      y,
      size,
      size,
      Math.max(4, cellSize * 0.16)
    );

    ctx.fill();

    if (index === 0) {
      drawSnakeEyes(x, y, size);
    }
  });
}

function drawSnakeEyes(x, y, size) {
  const eyeSize = Math.max(2, size * 0.11);

  let eyeOneX;
  let eyeOneY;
  let eyeTwoX;
  let eyeTwoY;

  if (direction.x > 0) {
    eyeOneX = x + size * 0.7;
    eyeOneY = y + size * 0.3;

    eyeTwoX = x + size * 0.7;
    eyeTwoY = y + size * 0.7;
  } else if (direction.x < 0) {
    eyeOneX = x + size * 0.3;
    eyeOneY = y + size * 0.3;

    eyeTwoX = x + size * 0.3;
    eyeTwoY = y + size * 0.7;
  } else if (direction.y < 0) {
    eyeOneX = x + size * 0.3;
    eyeOneY = y + size * 0.3;

    eyeTwoX = x + size * 0.7;
    eyeTwoY = y + size * 0.3;
  } else {
    eyeOneX = x + size * 0.3;
    eyeOneY = y + size * 0.7;

    eyeTwoX = x + size * 0.7;
    eyeTwoY = y + size * 0.7;
  }

  ctx.fillStyle = "#FFFFFF";

  ctx.beginPath();
  ctx.arc(eyeOneX, eyeOneY, eyeSize, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(eyeTwoX, eyeTwoY, eyeSize, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#171B2D";

  ctx.beginPath();
  ctx.arc(eyeOneX, eyeOneY, eyeSize * 0.48, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(eyeTwoX, eyeTwoY, eyeSize * 0.48, 0, Math.PI * 2);
  ctx.fill();
}

function drawFood(cellSize) {
  const centerX = food.x * cellSize + cellSize / 2;
  const centerY = food.y * cellSize + cellSize / 2;
  const radius = cellSize * 0.27;

  ctx.fillStyle = "#FFB84D";

  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#F6F7FB";

  ctx.beginPath();
  ctx.arc(
    centerX - radius * 0.35,
    centerY - radius * 0.35,
    radius * 0.2,
    0,
    Math.PI * 2
  );
  ctx.fill();

  ctx.strokeStyle = "#22C55E";
  ctx.lineWidth = Math.max(2, cellSize * 0.07);
  ctx.lineCap = "round";

  ctx.beginPath();
  ctx.moveTo(centerX, centerY - radius * 0.75);
  ctx.quadraticCurveTo(
    centerX + radius * 0.45,
    centerY - radius * 1.15,
    centerX + radius * 0.65,
    centerY - radius * 0.75
  );
  ctx.stroke();
}

function roundRect(context, x, y, width, height, radius) {
  const safeRadius = Math.min(
    radius,
    width / 2,
    height / 2
  );

  context.beginPath();
  context.moveTo(x + safeRadius, y);
  context.arcTo(
    x + width,
    y,
    x + width,
    y + height,
    safeRadius
  );
  context.arcTo(
    x + width,
    y + height,
    x,
    y + height,
    safeRadius
  );
  context.arcTo(
    x,
    y + height,
    x,
    y,
    safeRadius
  );
  context.arcTo(
    x,
    y,
    x + width,
    y,
    safeRadius
  );
  context.closePath();
}

/* -------------------------------------------------------
   UI helpers
------------------------------------------------------- */

function updateScore() {
  scoreElement.textContent = score;
  highScoreElement.textContent = highScore;
}

function updateStatus(status) {
  gameStatusElement.textContent = status;
}

function showOverlay(title, message, buttonText) {
  overlayTitle.textContent = title;
  overlayMessage.textContent = message;
  startButton.textContent = buttonText;
  overlay.classList.remove("hidden");
}

function hideOverlay() {
  overlay.classList.add("hidden");
}

/* -------------------------------------------------------
   Buttons
------------------------------------------------------- */

startButton.addEventListener("click", () => {
  if (gameOver) {
    restartGame();
    return;
  }

  if (gamePaused) {
    pauseGame();
    return;
  }

  startGame();
});

pauseButton.addEventListener("click", () => {
  if (!gameRunning && !gameOver) {
    startGame();
    return;
  }

  pauseGame();
});

restartButton.addEventListener("click", restartGame);

/* -------------------------------------------------------
   Start
------------------------------------------------------- */

initializeGame();
resizeCanvas();

}
function begin(){poster.hidden=true;gm.hidden=false;if(!booted){booted=true;var s=document.createElement("style");s.textContent=LOOK;document.head.appendChild(s);boot();}else{var r=document.getElementById("startButton");if(r)r.click();}}
poster.addEventListener("click",begin);
var nb=document.getElementById("new");if(nb)nb.addEventListener("click",begin);
})();
