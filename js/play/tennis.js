/* Tennis - game logic + its own look. Layout lives in style.css; page shell lives in the HTML. */
(function(){"use strict";
var gm=document.getElementById("gm"),poster=document.getElementById("poster"),booted=false;
var LOOK=".gm{\n    --cyan:#16B8C4; --action:#FFB84D;\n  --success:#22C55E; --danger:#EF5B5B;  \n    \n  --court:#111827; --court2:#1F2937;\n}.gm *{box-sizing:border-box}.gm button{font:inherit}.gm button{cursor:pointer}.gm .page{width:min(1160px,calc(100% - 32px));margin:0 auto;padding:30px 0 70px}.gm .game-card{background:var(--card);border:1px solid var(--border);border-radius:20px;padding:18px;box-shadow:0 10px 30px rgba(23,27,45,.07)}.gm .scorebar{display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:16px;padding:4px 8px 16px}.gm .player{display:flex;align-items:baseline;gap:12px}.gm .player strong{font-size:28px}.gm .player-label{font-size:12px;font-weight:800;letter-spacing:.1em;color:var(--muted)}.gm .opponent{justify-content:flex-end}.gm .match-info{text-align:center;display:flex;flex-direction:column;gap:2px}.gm .match-info span:first-child{font-weight:800}.gm .match-info span:last-child{font-size:13px;color:var(--muted)}.gm .court-wrap{position:relative;background:var(--court);border-radius:16px;overflow:hidden;aspect-ratio:16/9}.gm canvas{display:block;width:100%;height:100%;touch-action:none}.gm .overlay-message{position:absolute;inset:0;display:grid;place-items:center;background:rgba(17,24,39,.55);backdrop-filter:blur(3px)}.gm .overlay-message.hidden{display:none}.gm .message-box{width:min(360px,calc(100% - 32px));text-align:center;background:#fff;border-radius:16px;padding:28px 24px;box-shadow:0 16px 50px rgba(0,0,0,.22)}.gm .message-box h2{margin:0 0 6px;font-size:28px}.gm .message-box p{margin:0 0 18px;color:var(--muted)}.gm .message-box button,.gm .restart{border:0;border-radius:11px;background:var(--brand);color:#fff;font-weight:800;padding:12px 20px;min-height:46px}.gm .message-box button:hover,.gm .restart:hover{background:var(--brand-dark)}.gm .controls{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:16px 4px 2px}.gm .control-copy{display:flex;align-items:center;gap:15px;color:var(--muted);font-size:14px;flex-wrap:wrap}.gm .control-copy strong{color:var(--text)}.gm .touch-controls{display:flex;gap:8px}.gm .touch-controls button{height:46px;min-width:54px;border:1px solid var(--border);border-radius:11px;background:#fff;color:var(--text);font-weight:800}.gm .touch-controls #hitBtn{background:var(--action);border-color:var(--action);min-width:64px}.gm .touch-controls button:active{transform:translateY(1px)}.gm .restart{background:#eef0ff;color:var(--brand-dark);border:1px solid #dfe1ff}.gm details{border-top:1px solid var(--border);padding:16px 0}.gm details:last-child{border-bottom:1px solid var(--border)}.gm summary{cursor:pointer;font-weight:800;font-size:17px}.gm details p{margin:10px 0 0}.gm button:focus-visible,.gm summary:focus-visible{outline:3px solid rgba(91,92,226,.35);outline-offset:3px}@media(max-width:700px){.gm .page{width:min(100% - 20px,1160px);padding-top:20px}.gm .game-card{padding:10px;border-radius:16px}.gm .scorebar{padding:5px 5px 11px}.gm .player{gap:7px}.gm .player strong{font-size:24px}.gm .match-info span:last-child{font-size:12px}.gm .controls{flex-wrap:wrap;justify-content:center}.gm .control-copy{justify-content:center;width:100%;gap:9px}.gm .touch-controls{order:2}.gm .restart{order:3;width:100%}}@media(max-width:430px){.gm .court-wrap{aspect-ratio:4/3}.gm .control-copy span:nth-last-child(1){display:none}}";
function __ready(f){f()}
function boot(){
(() => {
  "use strict";

  const canvas = document.getElementById("court");
  const ctx = canvas.getContext("2d");
  const playerScoreEl = document.getElementById("playerScore");
  const cpuScoreEl = document.getElementById("cpuScore");
  const setStatusEl = document.getElementById("setStatus");
  const gameStatusEl = document.getElementById("gameStatus");
  const overlay = document.getElementById("message");
  const messageTitle = document.getElementById("messageTitle");
  const messageText = document.getElementById("messageText");
  const startBtn = document.getElementById("startBtn");
  const restartBtn = document.getElementById("restartBtn");
  const leftBtn = document.getElementById("leftBtn");
  const rightBtn = document.getElementById("rightBtn");
  const hitBtn = document.getElementById("hitBtn");

  const W = canvas.width, H = canvas.height;
  const court = { left: 72, right: W - 72, top: 52, bottom: H - 48, netY: H / 2 };
  const player = { x: W / 2, y: court.bottom - 34, w: 112, h: 13, speed: 560 };
  const cpu = { x: W / 2, y: court.top + 34, w: 112, h: 13 };
  const ball = { x: W / 2, y: player.y - 20, r: 8, vx: 0, vy: 0, active: false, lastHit: null };

  let running = false;
  let pointReady = true;
  let playerPoints = 0, cpuPoints = 0;
  let playerGames = 0, cpuGames = 0;
  let playerSets = 0, cpuSets = 0;
  let serveByPlayer = true;
  let keys = { left:false, right:false };
  let cpuTarget = W / 2;
  let lastTime = performance.now();
  let rallyHits = 0;

  const pointNames = ["0", "15", "30", "40"];

  function resetMatch() {
    playerPoints = cpuPoints = 0;
    playerGames = cpuGames = 0;
    playerSets = cpuSets = 0;
    serveByPlayer = true;
    rallyHits = 0;
    running = false;
    pointReady = true;
    resetBall();
    updateScore();
    showOverlay("Tennis", "Serve to start the match.", "Start Match");
  }

  function resetBall() {
    ball.x = serveByPlayer ? player.x : cpu.x;
    ball.y = serveByPlayer ? player.y - 20 : cpu.y + 20;
    ball.vx = 0;
    ball.vy = 0;
    ball.active = false;
    ball.lastHit = null;
    pointReady = true;
    rallyHits = 0;
    gameStatusEl.textContent = serveByPlayer ? "Ready to serve" : "CPU serves";
  }

  function startMatch() {
    overlay.classList.add("hidden");
    running = true;
    pointReady = true;
    gameStatusEl.textContent = "Serve now";
    lastTime = performance.now();
  }

  function serve() {
    if (!running || !pointReady || !serveByPlayer) return;
    pointReady = false;
    ball.active = true;
    ball.lastHit = "player";
    ball.x = player.x;
    ball.y = player.y - 18;
    ball.vx = (Math.random() - .5) * 210;
    ball.vy = -470;
    rallyHits = 1;
    gameStatusEl.textContent = "Rally!";
  }

  function playerHit() {
    if (!running || !ball.active) return;
    if (ball.vy <= 0 || ball.y < H / 2) return;
    const near = Math.abs(ball.x - player.x) <= player.w / 2 + ball.r * 1.4;
    if (!near) return;

    ball.y = player.y - ball.r - 1;
    ball.vy = -(430 + Math.min(rallyHits * 7, 130));
    ball.vx = ((ball.x - player.x) / (player.w / 2)) * 300 + (Math.random() - .5) * 80;
    ball.lastHit = "player";
    rallyHits++;
    gameStatusEl.textContent = "Rally!";
  }

  function cpuHit() {
    if (!running || !ball.active || ball.vy >= 0 || ball.y > H / 2) return;
    if (Math.abs(ball.x - cpu.x) > cpu.w / 2 + ball.r * 1.4) return;

    ball.y = cpu.y + ball.r + 1;
    const target = court.left + 45 + Math.random() * (court.right - court.left - 90);
    ball.vx = (target - ball.x) * 0.95;
    ball.vx = Math.max(-390, Math.min(390, ball.vx));
    ball.vy = 430 + Math.min(rallyHits * 7, 130);
    ball.lastHit = "cpu";
    rallyHits++;
    gameStatusEl.textContent = "Rally!";
  }

  function point(winner) {
    if (!running) return;
    ball.active = false;
    if (winner === "player") playerPoints++;
    else cpuPoints++;
    updateScore();

    const gameWinner = checkGame();
    if (gameWinner) return;

    serveByPlayer = winner === "cpu" ? true : false;
    setTimeout(() => {
      if (!running) return;
      resetBall();
      gameStatusEl.textContent = serveByPlayer ? "Your serve" : "CPU serve";
    }, 700);
  }

  function checkGame() {
    const p = playerPoints, c = cpuPoints;
    const won = (p >= 4 && p - c >= 2);
    const lost = (c >= 4 && c - p >= 2);
    if (!won && !lost) return false;

    if (won) playerGames++;
    else cpuGames++;

    playerPoints = cpuPoints = 0;

    if (playerGames >= 6 && playerGames - cpuGames >= 2) {
      playerSets++;
      playerGames = cpuGames = 0;
    } else if (cpuGames >= 6 && cpuGames - playerGames >= 2) {
      cpuSets++;
      playerGames = cpuGames = 0;
    }

    if (playerSets >= 2 || cpuSets >= 2) {
      running = false;
      updateScore();
      const playerWon = playerSets >= 2;
      showOverlay(playerWon ? "You Win!" : "Match Over", playerWon ? "Great rally. You won the tennis match." : "The computer won this match. Try again.", "Play Again");
      return true;
    }

    serveByPlayer = lost;
    updateScore();
    resetBall();
    return true;
  }

  function updateScore() {
    const p = playerPoints >= 3 && cpuPoints >= 3
      ? (playerPoints === cpuPoints ? "40" : playerPoints > cpuPoints ? "AD" : "40")
      : pointNames[Math.min(playerPoints, 3)];
    const c = cpuPoints >= 3 && playerPoints >= 3
      ? (playerPoints === cpuPoints ? "40" : cpuPoints > playerPoints ? "AD" : "40")
      : pointNames[Math.min(cpuPoints, 3)];
    playerScoreEl.textContent = p;
    cpuScoreEl.textContent = c;
    setStatusEl.textContent = `Sets ${playerSets}-${cpuSets} · Games ${playerGames}-${cpuGames}`;
  }

  function showOverlay(title, text, buttonText) {
    messageTitle.textContent = title;
    messageText.textContent = text;
    startBtn.textContent = buttonText;
    overlay.classList.remove("hidden");
  }

  function movePlayer(dir, dt) {
    player.x += dir * player.speed * dt;
    player.x = Math.max(court.left + player.w / 2, Math.min(court.right - player.w / 2, player.x));
    if (pointReady && serveByPlayer) ball.x = player.x;
  }

  function update(dt) {
    if (!running) return;

    const dir = (keys.right ? 1 : 0) - (keys.left ? 1 : 0);
    movePlayer(dir, dt);

    if (ball.active) {
      ball.x += ball.vx * dt;
      ball.y += ball.vy * dt;

      if (ball.x - ball.r <= court.left || ball.x + ball.r >= court.right) {
        ball.x = Math.max(court.left + ball.r, Math.min(court.right - ball.r, ball.x));
        ball.vx *= -1;
      }

      // Computer follows the ball with a controlled delay.
      const desired = ball.x + ball.vx * 0.06;
      cpuTarget += Math.max(-1, Math.min(1, desired - cpuTarget)) * 4.5;
      cpu.x += Math.max(-1, Math.min(1, cpuTarget - cpu.x)) * 360 * dt;
      cpu.x = Math.max(court.left + cpu.w / 2, Math.min(court.right - cpu.w / 2, cpu.x));

      cpuHit();
      playerHit();

      if (ball.y < court.top - 18) {
        point("player");
      } else if (ball.y > court.bottom + 18) {
        point("cpu");
      }
    }
  }

  function drawCourt() {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "#111827";
    ctx.fillRect(0, 0, W, H);

    // Court surface
    ctx.fillStyle = "#176B5B";
    ctx.fillRect(court.left, court.top, court.right - court.left, court.bottom - court.top);

    // Subtle court stripes
    ctx.fillStyle = "rgba(255,255,255,.025)";
    for (let x = court.left; x < court.right; x += 54) ctx.fillRect(x, court.top, 27, court.bottom - court.top);

    ctx.strokeStyle = "rgba(255,255,255,.9)";
    ctx.lineWidth = 5;
    ctx.strokeRect(court.left, court.top, court.right - court.left, court.bottom - court.top);

    ctx.lineWidth = 3;
    const singlesL = court.left + 92, singlesR = court.right - 92;
    const serviceTop = court.top + 125, serviceBottom = court.bottom - 125;

    // Singles sidelines and service boxes
    ctx.beginPath();
    ctx.moveTo(singlesL, court.top); ctx.lineTo(singlesL, court.bottom);
    ctx.moveTo(singlesR, court.top); ctx.lineTo(singlesR, court.bottom);
    ctx.moveTo(singlesL, serviceTop); ctx.lineTo(singlesR, serviceTop);
    ctx.moveTo(singlesL, serviceBottom); ctx.lineTo(singlesR, serviceBottom);
    ctx.moveTo((singlesL + singlesR)/2, serviceTop); ctx.lineTo((singlesL + singlesR)/2, serviceBottom);
    ctx.stroke();

    // Net
    ctx.strokeStyle = "#F8FAFC";
    ctx.lineWidth = 8;
    ctx.beginPath(); ctx.moveTo(court.left - 3, court.netY); ctx.lineTo(court.right + 3, court.netY); ctx.stroke();
    ctx.strokeStyle = "rgba(17,24,39,.5)";
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(court.left, court.netY + 5); ctx.lineTo(court.right, court.netY + 5); ctx.stroke();

    // Rackets
    drawRacket(cpu.x, cpu.y, "#FFB84D", false);
    drawRacket(player.x, player.y, "#5B5CE2", true);

    // Ball shadow
    if (ball.active || pointReady) {
      ctx.fillStyle = "rgba(0,0,0,.2)";
      ctx.beginPath(); ctx.ellipse(ball.x + 3, ball.y + 7, ball.r + 1, 4, 0, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = "#E8F85B";
      ctx.beginPath(); ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI*2); ctx.fill();
      ctx.strokeStyle = "rgba(17,24,39,.5)";
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
  }

  function drawRacket(x, y, color, playerSide) {
    ctx.save();
    ctx.translate(x, y);
    ctx.strokeStyle = color;
    ctx.lineWidth = 7;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(0, playerSide ? 7 : -7);
    ctx.lineTo(0, playerSide ? 27 : -27);
    ctx.stroke();

    ctx.strokeStyle = "#F8FAFC";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.ellipse(0, playerSide ? -2 : 2, 27, 19, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  function loop(now) {
    const dt = Math.min((now - lastTime) / 1000, 0.032);
    lastTime = now;
    update(dt);
    drawCourt();
    requestAnimationFrame(loop);
  }

  function setKey(dir, down) {
    keys[dir] = down;
  }

  window.addEventListener("keydown", e => {
    if (["ArrowLeft","ArrowRight","Space","KeyA","KeyD"].includes(e.code)) e.preventDefault();
    if (e.code === "ArrowLeft" || e.code === "KeyA") setKey("left", true);
    if (e.code === "ArrowRight" || e.code === "KeyD") setKey("right", true);
    if (e.code === "Space") {
      if (!running) startMatch();
      else if (pointReady) serve();
      else playerHit();
    }
  });
  window.addEventListener("keyup", e => {
    if (e.code === "ArrowLeft" || e.code === "KeyA") setKey("left", false);
    if (e.code === "ArrowRight" || e.code === "KeyD") setKey("right", false);
  });

  function bindHold(btn, dir) {
    const down = e => { e.preventDefault(); setKey(dir, true); };
    const up = e => { e.preventDefault(); setKey(dir, false); };
    ["pointerdown"].forEach(ev => btn.addEventListener(ev, down));
    ["pointerup","pointercancel","pointerleave"].forEach(ev => btn.addEventListener(ev, up));
  }
  bindHold(leftBtn, "left");
  bindHold(rightBtn, "right");

  hitBtn.addEventListener("pointerdown", e => {
    e.preventDefault();
    if (!running) startMatch();
    else if (pointReady) serve();
    else playerHit();
  });

  startBtn.addEventListener("click", () => {
    if (startBtn.textContent === "Play Again") resetMatch();
    startMatch();
  });
  restartBtn.addEventListener("click", resetMatch);

  resetMatch();
  requestAnimationFrame(loop);
})();


}
function begin(){poster.hidden=true;gm.hidden=false;if(!booted){booted=true;var s=document.createElement("style");s.textContent=LOOK;document.head.appendChild(s);boot();}else{var r=document.getElementById("startBtn");if(r)r.click();}}
poster.addEventListener("click",begin);
var nb=document.getElementById("new");if(nb)nb.addEventListener("click",begin);
})();
