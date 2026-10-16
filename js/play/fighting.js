/* Fighting - game logic + its own look. Layout lives in style.css; page shell lives in the HTML. */
(function(){"use strict";
var gm=document.getElementById("gm"),poster=document.getElementById("poster"),booted=false;
var LOOK=".gm *{box-sizing:border-box}.gm .game-kicker,.gm .overlay-kicker{margin:0 0 7px;color:#16b8c4;font-size:13px;font-weight:800;letter-spacing:.12em;text-transform:uppercase}.gm .game-shell{background:#fff;border:1px solid #e5e7ef;border-radius:18px;overflow:hidden;box-shadow:0 18px 50px rgba(23,27,45,.08)}.gm .game-topbar{padding:20px 24px;display:flex;align-items:center;justify-content:space-between;gap:16px}.gm .game-topbar h2{margin:0;font-size:24px}.gm .secondary-btn,.gm .primary-btn,.gm .control-btn{font:inherit;font-weight:800;border:0;cursor:pointer}.gm .secondary-btn{height:44px;padding:0 18px;border-radius:12px;background:#eef0ff;color:#4546b8}.gm .secondary-btn:hover{background:#e2e4ff}.gm .hud{display:grid;grid-template-columns:1fr auto 1fr;gap:20px;align-items:center;padding:15px 24px;background:#111827;color:#fff}.gm .fighter-hud{min-width:0}.gm .fighter-hud.right{text-align:right}.gm .hud-row{display:flex;justify-content:space-between;gap:10px;font-size:13px;margin-bottom:6px}.gm .health-track{height:13px;background:#303a4c;border-radius:999px;overflow:hidden;border:1px solid rgba(255,255,255,.08)}.gm .health-fill{height:100%;width:100%;background:#22c55e;transition:width .18s ease,background .18s ease}.gm .health-fill.low{background:#ffb84d}.gm .health-fill.critical{background:#ef5b5b}.gm .health-fill.cpu{margin-left:auto}.gm .timer-wrap{text-align:center;min-width:72px}.gm .timer-wrap span{display:block;font-size:10px;letter-spacing:.12em;color:#aeb6c5;font-weight:800}.gm .timer-wrap strong{font-size:30px;line-height:1}.gm .round-pips{display:flex;gap:5px;margin-top:7px}.gm .right .round-pips{justify-content:flex-end}.gm .pip{width:9px;height:9px;border-radius:50%;background:#394456;border:1px solid #596477}.gm .pip.won{background:#ffb84d;border-color:#ffb84d}.gm .arena{height:500px;position:relative;overflow:hidden;background:#111827;outline:none;touch-action:none;user-select:none}.gm .arena:focus-visible{box-shadow:inset 0 0 0 3px #16b8c4}.gm .arena-bg{position:absolute;inset:0;background:linear-gradient(#111827 0 58%,#182131 58%);overflow:hidden}.gm .moon{position:absolute;width:86px;height:86px;border-radius:50%;background:#f4e9c8;right:11%;top:12%;box-shadow:0 0 40px rgba(244,233,200,.12)}.gm .city{position:absolute;left:0;right:0;bottom:42%;height:150px;opacity:.65;background:repeating-linear-gradient(90deg,#263246 0 45px,transparent 45px 58px),linear-gradient(transparent 0 30%,#263246 30%)}.gm .city-back{transform:scaleY(.75);transform-origin:bottom;opacity:.35}.gm .city-front{clip-path:polygon(0 35%,6% 35%,6% 10%,12% 10%,12% 48%,18% 48%,18% 25%,24% 25%,24% 52%,31% 52%,31% 0,38% 0,38% 40%,44% 40%,44% 18%,51% 18%,51% 48%,58% 48%,58% 30%,66% 30%,66% 8%,72% 8%,72% 43%,80% 43%,80% 20%,87% 20%,87% 48%,94% 48%,94% 28%,100% 28%,100% 100%,0 100%)}.gm .floor-lines{position:absolute;left:-20%;right:-20%;bottom:-10%;height:52%;background:repeating-linear-gradient(90deg,transparent 0 74px,rgba(255,255,255,.035) 75px 77px),repeating-linear-gradient(0deg,transparent 0 43px,rgba(255,255,255,.04) 44px 46px);transform:perspective(250px) rotateX(57deg);transform-origin:bottom}.gm .fighter{position:absolute;bottom:70px;width:86px;height:160px;transform-origin:50% 100%;will-change:left,bottom,transform}.gm .fighter .shadow{position:absolute;bottom:-8px;left:4px;width:78px;height:20px;border-radius:50%;background:rgba(0,0,0,.32)}.gm .fighter .body{position:absolute;inset:0}.gm .head{position:absolute;left:27px;top:2px;width:35px;height:37px;border-radius:48% 48% 44% 44%;background:#d8a27e;border:3px solid #0b1020;z-index:4}.gm .face{position:absolute;right:4px;top:14px;width:5px;height:4px;border-radius:50%;background:#0b1020}.gm .torso{position:absolute;left:20px;top:34px;width:48px;height:65px;border-radius:13px 13px 8px 8px;background:#5b5ce2;border:3px solid #0b1020;z-index:3}.gm .arm,.gm .leg{position:absolute;background:#d8a27e;border:3px solid #0b1020;transform-origin:top center}.gm .arm{width:17px;height:62px;border-radius:9px;top:42px;z-index:2}.gm .arm-back{left:14px;transform:rotate(12deg)}.gm .arm-front{left:60px;transform:rotate(-16deg);z-index:4}.gm .leg{width:20px;height:69px;top:91px;border-radius:8px}.gm .leg-back{left:23px;transform:rotate(7deg)}.gm .leg-front{left:48px;transform:rotate(-5deg);z-index:2}.gm .cpu-fighter .torso{background:#ef5b5b}.gm .cpu-fighter{transform:scaleX(-1)}.gm .fighter.walk .leg-front{animation:walkFront .24s infinite alternate}.gm .fighter.walk .leg-back{animation:walkBack .24s infinite alternate}.gm .fighter.punch .arm-front{animation:punch .22s ease}.gm .fighter.kick .leg-front{animation:kick .34s ease}.gm .fighter.special .arm-front{animation:special .45s ease}.gm .fighter.block .arm-front{transform:rotate(-100deg) translate(6px,-3px)}.gm .fighter.block .arm-back{transform:rotate(-70deg) translate(8px,0)}.gm .fighter.hit{animation:hit .22s ease}.gm .fighter.jump{filter:drop-shadow(0 10px 5px rgba(0,0,0,.15))}@keyframes walkFront{to{transform:rotate(20deg)}}@keyframes walkBack{to{transform:rotate(-16deg)}}@keyframes punch{50%{transform:rotate(-86deg) translateY(-5px);height:70px}}@keyframes kick{50%{transform:rotate(-72deg) translate(15px,-6px);height:77px}}@keyframes special{40%{transform:rotate(-95deg) translate(12px,-10px);height:76px}}@keyframes hit{50%{filter:brightness(1.7);transform:translateX(-8px) rotate(-3deg)}}.gm .impact{position:absolute;width:16px;height:16px;border:4px solid #ffb84d;border-radius:50%;opacity:0;pointer-events:none}.gm .impact.show{animation:impact .28s ease}@keyframes impact{0%{opacity:1;transform:scale(.4)}100%{opacity:0;transform:scale(3)}}.gm .game-overlay{position:absolute;inset:0;background:rgba(8,13,25,.72);display:grid;place-items:center;padding:20px;z-index:20;backdrop-filter:blur(3px)}.gm .game-overlay.hidden{display:none}.gm .overlay-card{width:min(430px,100%);padding:28px;border-radius:18px;background:#fff;text-align:center;box-shadow:0 24px 60px rgba(0,0,0,.28)}.gm .overlay-card h3{font-size:38px;line-height:1;margin:5px 0 12px}.gm .overlay-card p{color:#667085;margin:0 0 20px}.gm .primary-btn{height:48px;padding:0 24px;border-radius:12px;background:#5b5ce2;color:#fff}.gm .primary-btn:hover{background:#4546b8}.gm .announcement{position:absolute;left:50%;top:24%;transform:translate(-50%,-50%) scale(.8);font-size:clamp(34px,7vw,72px);font-weight:800;color:#fff;text-shadow:0 5px 20px rgba(0,0,0,.45);opacity:0;pointer-events:none;z-index:15;white-space:nowrap}.gm .announcement.show{animation:announce 1s ease}@keyframes announce{0%{opacity:0;transform:translate(-50%,-50%) scale(.65)}25%,70%{opacity:1;transform:translate(-50%,-50%) scale(1)}100%{opacity:0}}.gm .status-strip{display:grid;grid-template-columns:1fr 1fr 1fr;border-top:1px solid #e5e7ef;border-bottom:1px solid #e5e7ef}.gm .status-strip>div{padding:13px 20px;text-align:center}.gm .status-strip>div+div{border-left:1px solid #e5e7ef}.gm .status-strip span{display:block;color:#667085;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.08em}.gm .status-strip strong{font-size:16px}.gm .mobile-controls{display:none;padding:16px;background:#f6f7fb;gap:16px}.gm .move-pad,.gm .attack-pad{display:grid;gap:8px}.gm .move-pad{grid-template-columns:repeat(3,1fr)}.gm .attack-pad{grid-template-columns:repeat(4,1fr)}.gm .control-btn{min-height:52px;border-radius:12px;background:#e9ebf2;color:#171b2d;-webkit-tap-highlight-color:transparent}.gm .control-btn:active,.gm .control-btn.active{transform:translateY(1px);filter:brightness(.92)}.gm .punch-btn{background:#5b5ce2;color:#fff}.gm .kick-btn{background:#16b8c4;color:#fff}.gm .special-btn{background:#ffb84d;color:#332000}.gm .block-btn{background:#30394a;color:#fff}.gm .keyboard-help{display:flex;justify-content:center;flex-wrap:wrap;gap:18px;padding:18px 24px;color:#667085;font-size:13px}.gm .keyboard-help span{display:flex;align-items:center;gap:5px}.gm kbd{min-width:26px;padding:3px 7px;text-align:center;border:1px solid #d5d8e2;border-bottom-width:3px;border-radius:6px;background:#fff;color:#171b2d;font-family:inherit;font-weight:800}.gm .info-card{background:#fff;border:1px solid #e5e7ef;border-radius:16px;padding:22px}.gm .info-card h3{margin:0 0 8px;font-size:21px}.gm .info-card p{margin:0;color:#667085}@media(max-width:760px){.gm .game-topbar{padding:16px}.gm .hud{grid-template-columns:1fr 58px 1fr;gap:9px;padding:12px}.gm .timer-wrap strong{font-size:25px}.gm .arena{height:390px}.gm .fighter{bottom:48px;transform:scale(.82);transform-origin:50% 100%}.gm .cpu-fighter{transform:scaleX(-1) scale(.82)}.gm .mobile-controls{display:grid}.gm .keyboard-help{display:none}.gm .status-strip>div{padding:10px 7px}.gm .status-strip strong{font-size:14px}.gm .status-strip span{font-size:9px}.gm .overlay-card{padding:24px 18px}.gm .overlay-card h3{font-size:32px}}@media(max-width:430px){.gm .game-topbar h2{font-size:20px}.gm .secondary-btn{padding:0 12px}.gm .arena{height:350px}.gm .mobile-controls{gap:10px;padding:10px}.gm .attack-pad{grid-template-columns:repeat(2,1fr)}.gm .control-btn{min-height:50px}.gm .hud-row{font-size:11px}.gm .health-track{height:11px}}@media(prefers-reduced-motion:reduce){.gm *,.gm *:before,.gm *:after{animation-duration:.01ms!important;animation-iteration-count:1!important;scroll-behavior:auto!important}}";
function __ready(f){f()}
function boot(){
(() => {
  "use strict";

  const arena = document.getElementById("arena");
  const playerEl = document.getElementById("player");
  const cpuEl = document.getElementById("cpu");
  const playerHealthEl = document.getElementById("playerHealth");
  const cpuHealthEl = document.getElementById("cpuHealth");
  const playerHealthText = document.getElementById("playerHealthText");
  const cpuHealthText = document.getElementById("cpuHealthText");
  const timerEl = document.getElementById("timer");
  const roundLabel = document.getElementById("roundLabel");
  const playerRoundsEl = document.getElementById("playerRounds");
  const cpuRoundsEl = document.getElementById("cpuRounds");
  const playerScoreEl = document.getElementById("playerScore");
  const cpuScoreEl = document.getElementById("cpuScore");
  const comboText = document.getElementById("comboText");
  const statusText = document.getElementById("statusText");
  const overlay = document.getElementById("overlay");
  const overlayTitle = document.getElementById("overlayTitle");
  const overlayText = document.getElementById("overlayText");
  const startBtn = document.getElementById("startBtn");
  const newGameBtn = document.getElementById("newGameBtn");
  const announcement = document.getElementById("announcement");
  const impact = document.getElementById("impact");

  const keys = {};
  const touch = { left:false, right:false, block:false };
  const ATTACKS = {
    punch: { damage: 8, range: 88, duration: 260, cooldown: 390 },
    kick: { damage: 13, range: 108, duration: 360, cooldown: 620 },
    special: { damage: 20, range: 132, duration: 470, cooldown: 2800 }
  };

  let player, cpu, gameRunning = false, roundActive = false, lastTime = 0;
  let roundTime = 60, timerAccumulator = 0, round = 1;
  let playerRounds = 0, cpuRounds = 0, combo = 0, comboExpire = 0;
  let cpuThinkAt = 0, rafId = null;

  function freshFighter(isPlayer) {
    return {
      x: isPlayer ? 105 : Math.max(240, arena.clientWidth - 190),
      y: 0, vy: 0, health: 100, width: 86, speed: 210,
      blocking: false, attacking: false, attackType: "",
      attackEnds: 0, nextAttack: 0, specialReady: 0, hitRegistered: false,
      moving: false
    };
  }

  function resetMatch() {
    gameRunning = false; roundActive = false; round = 1;
    playerRounds = 0; cpuRounds = 0; combo = 0;
    player = freshFighter(true); cpu = freshFighter(false);
    roundTime = 60; timerAccumulator = 0;
    updatePips(); updateHUD(); render();
    overlayTitle.textContent = "FIGHT!";
    overlayText.textContent = "First fighter to win two rounds takes the match.";
    startBtn.textContent = "Start Fight";
    overlay.classList.remove("hidden");
    statusText.textContent = "Ready to fight";
  }

  function startMatch() {
    playerRounds = 0; cpuRounds = 0; round = 1;
    gameRunning = true;
    overlay.classList.add("hidden");
    beginRound();
  }

  function beginRound() {
    player = freshFighter(true);
    cpu = freshFighter(false);
    roundTime = 60; timerAccumulator = 0; combo = 0;
    roundActive = false;
    updateHUD(); updatePips(); render();
    announce(`ROUND ${round}`, () => {
      announce("FIGHT!", () => {
        roundActive = true;
        statusText.textContent = "Fight!";
      });
    });
  }

  function announce(text, done) {
    announcement.textContent = text;
    announcement.classList.remove("show");
    void announcement.offsetWidth;
    announcement.classList.add("show");
    setTimeout(() => {
      announcement.classList.remove("show");
      if (done) done();
    }, 850);
  }

  function endRound(reason) {
    if (!roundActive) return;
    roundActive = false;
    player.blocking = cpu.blocking = false;
    let winner;
    if (player.health === cpu.health) winner = "draw";
    else winner = player.health > cpu.health ? "player" : "cpu";

    if (winner === "player") playerRounds++;
    if (winner === "cpu") cpuRounds++;
    updatePips(); updateHUD();

    const text = winner === "draw" ? "DRAW" : winner === "player" ? "ROUND WON" : "ROUND LOST";
    statusText.textContent = reason === "time" ? "Time up" : text;

    announce(text, () => {
      if (playerRounds >= 2 || cpuRounds >= 2) finishMatch();
      else {
        round++;
        roundLabel.textContent = `ROUND ${round}`;
        setTimeout(beginRound, 450);
      }
    });
  }

  function finishMatch() {
    gameRunning = false;
    const won = playerRounds > cpuRounds;
    overlayTitle.textContent = won ? "YOU WIN!" : "CPU WINS";
    overlayText.textContent = won
      ? `Match complete ${playerRounds}–${cpuRounds}. Nice timing. Fight again?`
      : `Match complete ${playerRounds}–${cpuRounds}. Adjust your range and try again.`;
    startBtn.textContent = "Fight Again";
    overlay.classList.remove("hidden");
    statusText.textContent = won ? "Match won" : "Match lost";
  }

  function attack(f, target, type, now, isPlayer) {
    const data = ATTACKS[type];
    if (!roundActive || f.attacking || now < f.nextAttack || f.blocking || f.y > 45) return;
    if (type === "special" && now < f.specialReady) return;
    f.attacking = true;
    f.attackType = type;
    f.attackEnds = now + data.duration;
    f.nextAttack = now + data.cooldown;
    f.hitRegistered = false;
    if (type === "special") f.specialReady = now + data.cooldown;

    const el = isPlayer ? playerEl : cpuEl;
    el.classList.remove("punch","kick","special");
    void el.offsetWidth;
    el.classList.add(type);

    setTimeout(() => {
      if (!f.attacking || f.attackType !== type || f.hitRegistered || !roundActive) return;
      const distance = Math.abs((f.x + 43) - (target.x + 43));
      if (distance <= data.range && Math.abs(f.y - target.y) < 55) {
        f.hitRegistered = true;
        dealDamage(target, data.damage, isPlayer, type);
      }
    }, data.duration * .48);
  }

  function dealDamage(target, rawDamage, playerAttacked, type) {
    const blocked = target.blocking;
    const damage = blocked ? Math.max(2, Math.round(rawDamage * .28)) : rawDamage;
    target.health = Math.max(0, target.health - damage);
    const targetEl = playerAttacked ? cpuEl : playerEl;
    targetEl.classList.remove("hit");
    void targetEl.offsetWidth;
    targetEl.classList.add("hit");

    if (playerAttacked) {
      combo = Date.now() < comboExpire ? combo + 1 : 1;
      comboExpire = Date.now() + 1300;
      statusText.textContent = blocked ? `${type} blocked` : `${type} landed`;
    } else {
      combo = 0;
      statusText.textContent = blocked ? "You blocked it" : `CPU ${type} landed`;
    }
    showImpact(target);
    updateHUD();
    if (target.health <= 0) setTimeout(() => endRound("ko"), 180);
  }

  function showImpact(target) {
    impact.style.left = `${target.x + 38}px`;
    impact.style.bottom = `${70 + target.y + 85}px`;
    impact.classList.remove("show");
    void impact.offsetWidth;
    impact.classList.add("show");
  }

  function jump(f) {
    if (!roundActive || f.y > 1 || f.attacking) return;
    f.vy = 500;
  }

  function updatePlayer(dt, now) {
    let dir = 0;
    if (keys.KeyA || keys.ArrowLeft || touch.left) dir -= 1;
    if (keys.KeyD || keys.ArrowRight || touch.right) dir += 1;
    player.blocking = !!(keys.KeyL || touch.block) && !player.attacking && player.y < 5;
    player.moving = dir !== 0 && !player.blocking && !player.attacking;
    if (player.moving) player.x += dir * player.speed * dt;

    if (keys.KeyW || keys.ArrowUp) {
      if (!keys._jumpLatch) { jump(player); keys._jumpLatch = true; }
    } else keys._jumpLatch = false;

    physics(player, dt);
    constrain();
    if (player.attacking && now >= player.attackEnds) {
      player.attacking = false; player.attackType = "";
    }
  }

  function updateCPU(dt, now) {
    if (!roundActive) return;
    const distance = Math.abs((cpu.x + 43) - (player.x + 43));
    cpu.blocking = false;
    cpu.moving = false;

    if (now >= cpuThinkAt) {
      cpuThinkAt = now + 130 + Math.random() * 180;
      if (player.attacking && distance < 125 && Math.random() < .58) {
        cpu.blocking = true;
      } else if (distance > 104) {
        cpu.moving = true;
      } else if (distance < 66 && Math.random() < .25) {
        cpu.moving = true;
      } else if (!cpu.attacking) {
        const r = Math.random();
        if (r < .53) attack(cpu, player, "punch", now, false);
        else if (r < .88) attack(cpu, player, "kick", now, false);
        else attack(cpu, player, "special", now, false);
      }
      if (Math.random() < .035 && cpu.y < 1) jump(cpu);
    }

    if (!cpu.attacking && !cpu.blocking) {
      if (distance > 104) {
        cpu.x += (player.x > cpu.x ? 1 : -1) * cpu.speed * .72 * dt;
        cpu.moving = true;
      } else if (distance < 58) {
        cpu.x += (player.x > cpu.x ? -1 : 1) * cpu.speed * .48 * dt;
        cpu.moving = true;
      }
    }
    physics(cpu, dt);
    constrain();
    if (cpu.attacking && now >= cpu.attackEnds) {
      cpu.attacking = false; cpu.attackType = "";
    }
  }

  function physics(f, dt) {
    if (f.y > 0 || f.vy > 0) {
      f.y += f.vy * dt;
      f.vy -= 1180 * dt;
      if (f.y <= 0) { f.y = 0; f.vy = 0; }
    }
  }

  function constrain() {
    const maxX = Math.max(120, arena.clientWidth - 95);
    player.x = Math.max(8, Math.min(maxX, player.x));
    cpu.x = Math.max(8, Math.min(maxX, cpu.x));

    const minGap = 54;
    if (Math.abs(player.x - cpu.x) < minGap) {
      const middle = (player.x + cpu.x) / 2;
      if (player.x < cpu.x) {
        player.x = middle - minGap / 2; cpu.x = middle + minGap / 2;
      } else {
        player.x = middle + minGap / 2; cpu.x = middle - minGap / 2;
      }
    }
  }

  function renderFighter(el, f, isCpu) {
    el.style.left = `${f.x}px`;
    el.style.bottom = `${70 + f.y}px`;
    el.classList.toggle("walk", f.moving && f.y < 2);
    el.classList.toggle("block", f.blocking);
    el.classList.toggle("jump", f.y > 2);
    if (!f.attacking) el.classList.remove("punch","kick","special");
    const facingLeft = isCpu ? player.x < cpu.x : cpu.x < player.x;
    const mobileScale = arena.clientWidth <= 760 ? .82 : 1;
    const flip = facingLeft ? -1 : 1;
    el.style.transform = `scaleX(${flip}) scale(${mobileScale})`;
  }

  function render() {
    renderFighter(playerEl, player, false);
    renderFighter(cpuEl, cpu, true);
  }

  function healthClass(el, health) {
    el.classList.toggle("low", health <= 55 && health > 25);
    el.classList.toggle("critical", health <= 25);
  }

  function updateHUD() {
    playerHealthEl.style.width = `${player.health}%`;
    cpuHealthEl.style.width = `${cpu.health}%`;
    playerHealthText.textContent = player.health;
    cpuHealthText.textContent = cpu.health;
    timerEl.textContent = Math.ceil(roundTime);
    roundLabel.textContent = `ROUND ${round}`;
    playerScoreEl.textContent = playerRounds;
    cpuScoreEl.textContent = cpuRounds;
    comboText.textContent = combo;
    healthClass(playerHealthEl, player.health);
    healthClass(cpuHealthEl, cpu.health);
  }

  function updatePips() {
    const make = (wins) => `<span class="pip ${wins > 0 ? "won" : ""}"></span><span class="pip ${wins > 1 ? "won" : ""}"></span>`;
    playerRoundsEl.innerHTML = make(playerRounds);
    cpuRoundsEl.innerHTML = make(cpuRounds);
    playerScoreEl.textContent = playerRounds;
    cpuScoreEl.textContent = cpuRounds;
  }

  function gameLoop(t) {
    if (!lastTime) lastTime = t;
    const dt = Math.min(.033, (t - lastTime) / 1000);
    lastTime = t;

    if (roundActive) {
      updatePlayer(dt, t);
      updateCPU(dt, t);
      timerAccumulator += dt;
      if (timerAccumulator >= .1) {
        roundTime = Math.max(0, roundTime - timerAccumulator);
        timerAccumulator = 0;
        if (Date.now() > comboExpire) combo = 0;
        updateHUD();
        if (roundTime <= 0) endRound("time");
      }
      render();
    }
    rafId = requestAnimationFrame(gameLoop);
  }

  function playerAttack(type) {
    attack(player, cpu, type, performance.now(), true);
  }

  document.addEventListener("keydown", e => {
    const gameKeys = ["KeyA","KeyD","KeyW","KeyJ","KeyK","KeyL","KeyI","ArrowLeft","ArrowRight","ArrowUp"];
    if (gameKeys.includes(e.code)) e.preventDefault();
    keys[e.code] = true;
    if (!roundActive || e.repeat) return;
    if (e.code === "KeyJ") playerAttack("punch");
    if (e.code === "KeyK") playerAttack("kick");
    if (e.code === "KeyI") playerAttack("special");
  });
  document.addEventListener("keyup", e => { keys[e.code] = false; });

  document.querySelectorAll(".control-btn").forEach(btn => {
    const action = btn.dataset.action;
    const press = e => {
      e.preventDefault(); btn.classList.add("active");
      if (action === "left" || action === "right" || action === "block") touch[action] = true;
      else if (action === "jump") jump(player);
      else playerAttack(action);
    };
    const release = e => {
      e.preventDefault(); btn.classList.remove("active");
      if (action in touch) touch[action] = false;
    };
    btn.addEventListener("pointerdown", press);
    btn.addEventListener("pointerup", release);
    btn.addEventListener("pointercancel", release);
    btn.addEventListener("pointerleave", release);
  });

  startBtn.addEventListener("click", startMatch);
  newGameBtn.addEventListener("click", resetMatch);
  window.addEventListener("resize", () => { constrain(); render(); });
  window.addEventListener("blur", () => {
    Object.keys(keys).forEach(k => keys[k] = false);
    touch.left = touch.right = touch.block = false;
  });

  resetMatch();
  if (rafId) cancelAnimationFrame(rafId);
  rafId = requestAnimationFrame(gameLoop);
})();

}
function begin(){poster.hidden=true;gm.hidden=false;if(!booted){booted=true;var s=document.createElement("style");s.textContent=LOOK;document.head.appendChild(s);boot();}else{var r=document.getElementById("newGameBtn");if(r)r.click();}}
poster.addEventListener("click",begin);
var nb=document.getElementById("new");if(nb)nb.addEventListener("click",begin);
})();
