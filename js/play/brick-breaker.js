/* Brick Breaker - game logic + its own look. Layout lives in style.css; page shell lives in the HTML. */
(function(){"use strict";
var gm=document.getElementById("gm"),poster=document.getElementById("poster"),booted=false;
var LOOK=".gm{\n  --primary: #5B5CE2;\n  --primary-dark: #4546B8;\n  --secondary: #16B8C4;\n  --action: #FFB84D;\n  --success: #22C55E;\n  --danger: #EF5B5B;\n\n  --background: #F6F7FB;\n  \n  \n  \n  \n\n  --game-bg: #111827;\n  --game-secondary: #1F2937;\n}.gm *{\n  box-sizing: border-box;\n}.gm button{\n  font: inherit;\n}.gm button{\n  cursor: pointer;\n}.gm .page-container{\n  width: min(100% - 40px, 1160px);\n  margin: 0 auto;\n  padding: 32px 0 80px;\n}.gm .game-card{\n  max-width: 900px;\n  margin: 0 auto 64px;\n  padding: 20px;\n\n  background: var(--card);\n  border: 1px solid var(--border);\n  border-radius: 20px;\n  box-shadow: 0 12px 35px rgba(23, 27, 45, 0.07);\n}.gm .game-topbar{\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 12px;\n\n  margin-bottom: 16px;\n}.gm .stat{\n  padding: 10px 16px;\n\n  background: var(--background);\n  border: 1px solid var(--border);\n  border-radius: 12px;\n\n  text-align: center;\n}.gm .stat span{\n  display: block;\n\n  color: var(--muted);\n  font-size: 13px;\n  font-weight: 700;\n  line-height: 1.2;\n  text-transform: uppercase;\n  letter-spacing: 0.5px;\n}.gm .stat strong{\n  display: block;\n  margin-top: 2px;\n\n  color: var(--text);\n  font-size: 24px;\n  font-weight: 800;\n  line-height: 1.25;\n}.gm .canvas-wrapper{\n  position: relative;\n\n  width: 100%;\n  overflow: hidden;\n\n  background: var(--game-bg);\n  border-radius: 16px;\n  border: 1px solid #293244;\n}.gm canvas{\n  display: block;\n  width: 100%;\n  height: auto;\n  aspect-ratio: 16 / 9;\n\n  touch-action: none;\n}.gm .game-overlay{\n  position: absolute;\n  inset: 0;\n\n  display: grid;\n  place-items: center;\n\n  padding: 24px;\n\n  background: rgba(17, 24, 39, 0.88);\n  text-align: center;\n\n  transition: opacity 0.2s ease, visibility 0.2s ease;\n}.gm .game-overlay.hidden{\n  opacity: 0;\n  visibility: hidden;\n  pointer-events: none;\n}.gm .overlay-content{\n  width: min(100%, 430px);\n}.gm .overlay-icon{\n  width: 54px;\n  height: 54px;\n\n  display: grid;\n  place-items: center;\n\n  margin: 0 auto 14px;\n\n  color: #fff;\n  background: var(--primary);\n  border-radius: 14px;\n\n  font-size: 25px;\n}.gm .overlay-content h2{\n  margin: 0 0 8px;\n\n  color: #fff;\n  font-size: 30px;\n  font-weight: 800;\n  line-height: 1.15;\n}.gm .overlay-content p{\n  margin: 0 0 22px;\n\n  color: #D1D5DB;\n  font-size: 16px;\n}.gm .primary-button,.gm .secondary-button,.gm .control-button{\n  min-height: 46px;\n  padding: 10px 20px;\n\n  border-radius: 10px;\n\n  font-size: 16px;\n  font-weight: 700;\n\n  transition:\n    transform 0.15s ease,\n    background 0.15s ease,\n    border-color 0.15s ease;\n}.gm .primary-button{\n  color: #fff;\n  background: var(--primary);\n  border: 1px solid var(--primary);\n}.gm .primary-button:hover,.gm .primary-button:focus-visible{\n  background: var(--primary-dark);\n  border-color: var(--primary-dark);\n}.gm .secondary-button{\n  color: var(--text);\n  background: #fff;\n  border: 1px solid var(--border);\n}.gm .secondary-button:hover,.gm .secondary-button:focus-visible{\n  color: var(--primary);\n  border-color: var(--primary);\n}.gm .primary-button:active,.gm .secondary-button:active,.gm .control-button:active{\n  transform: translateY(1px);\n}.gm .primary-button:focus-visible,.gm .secondary-button:focus-visible,.gm .control-button:focus-visible{\n  outline: 3px solid rgba(91, 92, 226, 0.28);\n  outline-offset: 2px;\n}.gm .game-controls{\n  display: flex;\n  justify-content: center;\n  gap: 12px;\n\n  margin-top: 16px;\n}.gm .mobile-controls{\n  display: none;\n  grid-template-columns: 1fr 1fr;\n  gap: 12px;\n\n  margin-top: 12px;\n}.gm .control-button{\n  min-height: 54px;\n\n  color: #fff;\n  background: var(--game-secondary);\n  border: 1px solid #374151;\n\n  font-size: 25px;\n  line-height: 1;\n  touch-action: manipulation;\n  user-select: none;\n}.gm .control-button:hover,.gm .control-button:focus-visible{\n  background: #293548;\n}@media (max-width: 700px){.gm .page-container{\n    width: min(100% - 28px, 1160px);\n    padding-top: 24px;\n  }.gm .game-card{\n    padding: 12px;\n    margin-bottom: 48px;\n    border-radius: 16px;\n  }.gm .game-topbar{\n    gap: 7px;\n    margin-bottom: 10px;\n  }.gm .stat{\n    padding: 8px 5px;\n    border-radius: 9px;\n  }.gm .stat span{\n    font-size: 11px;\n  }.gm .stat strong{\n    font-size: 20px;\n  }.gm .canvas-wrapper{\n    border-radius: 12px;\n  }.gm .game-controls{\n    margin-top: 10px;\n  }.gm .game-controls .secondary-button{\n    flex: 1;\n  }.gm .mobile-controls{\n    display: grid;\n  }}@media (max-width: 420px){.gm .page-container{\n    width: min(100% - 20px, 1160px);\n  }.gm .game-card{\n    padding: 8px;\n  }}@media (prefers-reduced-motion: reduce){.gm *,.gm *::before,.gm *::after{\n    transition-duration: 0.01ms !important;\n  }}";
function __ready(f){f()}
function boot(){
"use strict";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const scoreElement = document.getElementById("score");
const levelElement = document.getElementById("level");
const livesElement = document.getElementById("lives");

const overlay = document.getElementById("gameOverlay");
const overlayIcon = document.getElementById("overlayIcon");
const overlayTitle = document.getElementById("overlayTitle");
const overlayMessage = document.getElementById("overlayMessage");

const startButton = document.getElementById("startButton");
const pauseButton = document.getElementById("pauseButton");
const restartButton = document.getElementById("restartButton");

const leftButton = document.getElementById("leftButton");
const rightButton = document.getElementById("rightButton");

const WORLD_WIDTH = 960;
const WORLD_HEIGHT = 540;

canvas.width = WORLD_WIDTH;
canvas.height = WORLD_HEIGHT;

const paddle = {
  width: 145,
  height: 15,
  x: WORLD_WIDTH / 2 - 72.5,
  y: WORLD_HEIGHT - 42,
  speed: 680
};

const ball = {
  radius: 9,
  x: WORLD_WIDTH / 2,
  y: WORLD_HEIGHT - 70,
  vx: 310,
  vy: -310,
  speed: 438
};

const game = {
  score: 0,
  lives: 3,
  level: 1,
  running: false,
  paused: false,
  gameOver: false,
  levelComplete: false,
  lastTime: 0,
  animationFrame: null
};

const input = {
  left: false,
  right: false,
  mouseX: null
};

const brickSettings = {
  rows: 5,
  columns: 10,
  width: 76,
  height: 25,
  gap: 8,
  top: 58
};

let bricks = [];

function createBricks() {
  bricks = [];

  const totalWidth =
    brickSettings.columns * brickSettings.width +
    (brickSettings.columns - 1) * brickSettings.gap;

  const startX = (WORLD_WIDTH - totalWidth) / 2;

  const colors = [
    "#5B5CE2",
    "#16B8C4",
    "#FFB84D",
    "#22C55E",
    "#EF5B5B"
  ];

  const rowCount = Math.min(8, brickSettings.rows + game.level - 1);

  for (let row = 0; row < rowCount; row++) {
    for (let column = 0; column < brickSettings.columns; column++) {
      bricks.push({
        x: startX + column * (brickSettings.width + brickSettings.gap),
        y: brickSettings.top + row * (brickSettings.height + brickSettings.gap),
        width: brickSettings.width,
        height: brickSettings.height,
        alive: true,
        color: colors[row % colors.length],
        points: 10 + (row * 5)
      });
    }
  }
}

function updateStats() {
  scoreElement.textContent = game.score.toLocaleString();
  levelElement.textContent = game.level;
  livesElement.textContent = game.lives;
}

function resetPaddle() {
  paddle.x = WORLD_WIDTH / 2 - paddle.width / 2;
}

function resetBall() {
  ball.x = WORLD_WIDTH / 2;
  ball.y = paddle.y - ball.radius - 3;

  const direction = Math.random() < 0.5 ? -1 : 1;
  const angle = (Math.random() * 0.8 + 0.35) * direction;

  ball.speed = 438 + (game.level - 1) * 34;

  ball.vx = Math.sin(angle) * ball.speed;
  ball.vy = -Math.cos(angle) * ball.speed;
}

function resetLevelBall() {
  resetPaddle();
  resetBall();
}

function showOverlay(title, message, buttonText, icon = "◆") {
  overlayIcon.textContent = icon;
  overlayTitle.textContent = title;
  overlayMessage.textContent = message;
  startButton.textContent = buttonText;
  overlay.classList.remove("hidden");
}

function hideOverlay() {
  overlay.classList.add("hidden");
}

function startNewGame() {
  cancelAnimationFrame(game.animationFrame);

  game.score = 0;
  game.lives = 3;
  game.level = 1;
  game.running = true;
  game.paused = false;
  game.gameOver = false;
  game.levelComplete = false;
  game.lastTime = performance.now();

  createBricks();
  resetLevelBall();
  updateStats();

  pauseButton.textContent = "Pause";
  hideOverlay();

  game.animationFrame = requestAnimationFrame(gameLoop);
}

function restartGame() {
  startNewGame();
}

function pauseGame() {
  if (!game.running || game.gameOver) {
    return;
  }

  game.paused = !game.paused;

  if (game.paused) {
    pauseButton.textContent = "Resume";

    showOverlay(
      "Game Paused",
      "Take a break and resume when you are ready.",
      "Resume",
      "Ⅱ"
    );
  } else {
    pauseButton.textContent = "Pause";
    hideOverlay();
    game.lastTime = performance.now();
  }
}

function handleOverlayButton() {
  if (game.gameOver || game.levelComplete) {
    startNewGame();
    return;
  }

  if (game.paused) {
    game.paused = false;
    pauseButton.textContent = "Pause";
    hideOverlay();
    game.lastTime = performance.now();
    return;
  }

  startNewGame();
}

function movePaddle(deltaX) {
  paddle.x += deltaX;
  clampPaddle();
}

function clampPaddle() {
  paddle.x = Math.max(
    0,
    Math.min(WORLD_WIDTH - paddle.width, paddle.x)
  );
}

function updatePaddle(dt) {
  if (input.left) {
    paddle.x -= paddle.speed * dt;
  }

  if (input.right) {
    paddle.x += paddle.speed * dt;
  }

  if (input.mouseX !== null) {
    paddle.x = input.mouseX - paddle.width / 2;
  }

  clampPaddle();
}

function circleIntersectsRect(circle, rect) {
  const closestX = Math.max(rect.x, Math.min(circle.x, rect.x + rect.width));
  const closestY = Math.max(rect.y, Math.min(circle.y, rect.y + rect.height));

  const dx = circle.x - closestX;
  const dy = circle.y - closestY;

  return dx * dx + dy * dy <= circle.radius * circle.radius;
}

function bounceFromPaddle() {
  const paddleCenter = paddle.x + paddle.width / 2;
  const hitPosition = (ball.x - paddleCenter) / (paddle.width / 2);

  const maxAngle = Math.PI * 0.38;
  const angle = hitPosition * maxAngle;

  const speed = Math.sqrt(
    ball.vx * ball.vx + ball.vy * ball.vy
  );

  ball.vx = Math.sin(angle) * speed;
  ball.vy = -Math.abs(Math.cos(angle) * speed);

  ball.y = paddle.y - ball.radius - 1;
}

function handleBrickCollisions(previousX, previousY) {
  for (const brick of bricks) {
    if (!brick.alive) {
      continue;
    }

    if (!circleIntersectsRect(ball, brick)) {
      continue;
    }

    brick.alive = false;
    game.score += brick.points;

    const wasAbove = previousY + ball.radius <= brick.y;
    const wasBelow = previousY - ball.radius >= brick.y + brick.height;
    const wasLeft = previousX + ball.radius <= brick.x;
    const wasRight = previousX - ball.radius >= brick.x + brick.width;

    if (wasAbove || wasBelow) {
      ball.vy *= -1;
    } else if (wasLeft || wasRight) {
      ball.vx *= -1;
    } else {
      ball.vy *= -1;
    }

    updateStats();
    break;
  }
}

function checkLevelComplete() {
  if (bricks.some((brick) => brick.alive)) {
    return;
  }

  game.levelComplete = true;
  game.running = false;

  showOverlay(
    `Level ${game.level} Complete`,
    `Great job! Your score is ${game.score.toLocaleString()}.`,
    "Next Level",
    "✓"
  );
}

function loseLife() {
  game.lives -= 1;
  updateStats();

  if (game.lives <= 0) {
    endGame();
    return;
  }

  game.running = false;

  showOverlay(
    "Ball Lost",
    `${game.lives} ${game.lives === 1 ? "life" : "lives"} remaining.`,
    "Continue",
    "!"
  );
}

function continueAfterLifeLost() {
  if (game.lives <= 0) {
    endGame();
    return;
  }

  game.running = true;
  game.paused = false;

  resetLevelBall();
  hideOverlay();

  game.lastTime = performance.now();
  game.animationFrame = requestAnimationFrame(gameLoop);
}

function endGame() {
  game.running = false;
  game.gameOver = true;

  showOverlay(
    "Game Over",
    `Final score: ${game.score.toLocaleString()}.`,
    "Play Again",
    "×"
  );
}

function nextLevel() {
  if (!game.levelComplete) {
    return;
  }

  game.level += 1;
  game.levelComplete = false;
  game.running = true;

  createBricks();
  resetLevelBall();
  updateStats();

  hideOverlay();
  game.lastTime = performance.now();

  game.animationFrame = requestAnimationFrame(gameLoop);
}

function updateBall(dt) {
  const previousX = ball.x;
  const previousY = ball.y;

  ball.x += ball.vx * dt;
  ball.y += ball.vy * dt;

  if (ball.x - ball.radius <= 0) {
    ball.x = ball.radius;
    ball.vx = Math.abs(ball.vx);
  }

  if (ball.x + ball.radius >= WORLD_WIDTH) {
    ball.x = WORLD_WIDTH - ball.radius;
    ball.vx = -Math.abs(ball.vx);
  }

  if (ball.y - ball.radius <= 0) {
    ball.y = ball.radius;
    ball.vy = Math.abs(ball.vy);
  }

  if (
    ball.vy > 0 &&
    circleIntersectsRect(ball, paddle)
  ) {
    bounceFromPaddle();
  }

  handleBrickCollisions(previousX, previousY);

  if (ball.y - ball.radius > WORLD_HEIGHT) {
    loseLife();
  }

  checkLevelComplete();
}

function drawBackground() {
  ctx.fillStyle = "#111827";
  ctx.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

  ctx.strokeStyle = "rgba(255,255,255,0.035)";
  ctx.lineWidth = 1;

  for (let x = 0; x <= WORLD_WIDTH; x += 48) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, WORLD_HEIGHT);
    ctx.stroke();
  }

  for (let y = 0; y <= WORLD_HEIGHT; y += 48) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(WORLD_WIDTH, y);
    ctx.stroke();
  }
}

function drawBricks() {
  for (const brick of bricks) {
    if (!brick.alive) {
      continue;
    }

    ctx.fillStyle = brick.color;

    roundRect(
      ctx,
      brick.x,
      brick.y,
      brick.width,
      brick.height,
      6
    );

    ctx.fill();

    ctx.fillStyle = "rgba(255,255,255,0.2)";

    roundRect(
      ctx,
      brick.x + 3,
      brick.y + 3,
      brick.width - 6,
      5,
      3
    );

    ctx.fill();
  }
}

function drawPaddle() {
  ctx.fillStyle = "#FFFFFF";

  roundRect(
    ctx,
    paddle.x,
    paddle.y,
    paddle.width,
    paddle.height,
    8
  );

  ctx.fill();

  ctx.fillStyle = "#5B5CE2";

  roundRect(
    ctx,
    paddle.x + 7,
    paddle.y + 4,
    paddle.width - 14,
    5,
    3
  );

  ctx.fill();
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);

  ctx.fillStyle = "#FFB84D";
  ctx.fill();

  ctx.beginPath();
  ctx.arc(
    ball.x - 3,
    ball.y - 3,
    ball.radius * 0.3,
    0,
    Math.PI * 2
  );

  ctx.fillStyle = "rgba(255,255,255,0.75)";
  ctx.fill();
}

function draw() {
  drawBackground();
  drawBricks();
  drawPaddle();
  drawBall();
}

function roundRect(context, x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);

  context.beginPath();
  context.moveTo(x + r, y);
  context.arcTo(x + width, y, x + width, y + height, r);
  context.arcTo(x + width, y + height, x, y + height, r);
  context.arcTo(x, y + height, x, y, r);
  context.arcTo(x, y, x + width, y, r);
  context.closePath();
}

function gameLoop(timestamp) {
  if (!game.running) {
    draw();
    return;
  }

  if (game.paused) {
    draw();
    game.animationFrame = requestAnimationFrame(gameLoop);
    return;
  }

  let dt = (timestamp - game.lastTime) / 1000;

  game.lastTime = timestamp;

  // Prevent a large physics jump if the browser tab was inactive.
  dt = Math.min(dt, 0.025);

  updatePaddle(dt);
  updateBall(dt);
  draw();

  if (game.running) {
    game.animationFrame = requestAnimationFrame(gameLoop);
  }
}

function canvasPointerPosition(event) {
  const rect = canvas.getBoundingClientRect();

  const scaleX = WORLD_WIDTH / rect.width;

  return {
    x: (event.clientX - rect.left) * scaleX
  };
}

function handlePointerMove(event) {
  const position = canvasPointerPosition(event);

  input.mouseX = position.x;
}

function clearMouseControl() {
  input.mouseX = null;
}

function pressLeft() {
  input.left = true;
}

function releaseLeft() {
  input.left = false;
}

function pressRight() {
  input.right = true;
}

function releaseRight() {
  input.right = false;
}

function bindHoldButton(button, press, release) {
  button.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    press();
  });

  button.addEventListener("pointerup", (event) => {
    event.preventDefault();
    release();
  });

  button.addEventListener("pointercancel", release);
  button.addEventListener("pointerleave", release);
}

document.addEventListener("keydown", (event) => {
  if (
    event.key === "ArrowLeft" ||
    event.key.toLowerCase() === "a"
  ) {
    event.preventDefault();
    input.left = true;
  }

  if (
    event.key === "ArrowRight" ||
    event.key.toLowerCase() === "d"
  ) {
    event.preventDefault();
    input.right = true;
  }

  if (event.key === " " || event.key === "Escape") {
    event.preventDefault();

    if (game.running || game.paused) {
      pauseGame();
    }
  }

  if (event.key === "Enter" && !game.running) {
    if (game.gameOver) {
      startNewGame();
    } else if (game.levelComplete) {
      nextLevel();
    } else if (game.paused) {
      pauseGame();
    }
  }
});

document.addEventListener("keyup", (event) => {
  if (
    event.key === "ArrowLeft" ||
    event.key.toLowerCase() === "a"
  ) {
    input.left = false;
  }

  if (
    event.key === "ArrowRight" ||
    event.key.toLowerCase() === "d"
  ) {
    input.right = false;
  }
});

canvas.addEventListener("pointermove", handlePointerMove);
canvas.addEventListener("pointerleave", clearMouseControl);
canvas.addEventListener("pointerdown", handlePointerMove);

startButton.addEventListener("click", () => {
  if (game.levelComplete) {
    nextLevel();
    return;
  }

  if (!game.running && !game.gameOver && game.lives < 3) {
    continueAfterLifeLost();
    return;
  }

  handleOverlayButton();
});

pauseButton.addEventListener("click", () => {
  pauseGame();
});

restartButton.addEventListener("click", () => {
  restartGame();
});

bindHoldButton(leftButton, pressLeft, releaseLeft);
bindHoldButton(rightButton, pressRight, releaseRight);

window.addEventListener("blur", () => {
  input.left = false;
  input.right = false;
  input.mouseX = null;

  if (game.running && !game.paused) {
    pauseGame();
  }
});

createBricks();
resetLevelBall();
updateStats();
draw();

}
function begin(){poster.hidden=true;gm.hidden=false;if(!booted){booted=true;var s=document.createElement("style");s.textContent=LOOK;document.head.appendChild(s);boot();}else{var r=document.getElementById("startButton");if(r)r.click();}}
poster.addEventListener("click",begin);
var nb=document.getElementById("new");if(nb)nb.addEventListener("click",begin);
})();
