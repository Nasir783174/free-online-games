/* Motorcycle - game logic + its own look. Layout lives in style.css; page shell lives in the HTML. */
(function(){"use strict";
var gm=document.getElementById("gm"),poster=document.getElementById("poster"),booted=false;
var LOOK=".gm{--primary:#5B5CE2;--primary-dark:#4546B8;--cyan:#16B8C4;--yellow:#FFB84D;--green:#22C55E;--danger:#EF5B5B;--road:#111827;--road2:#1F2937}.gm *{box-sizing:border-box}.gm .page-shell{width:min(1120px,calc(100% - 32px));margin:0 auto}.gm .game-card{background:var(--card);border:1px solid var(--border);border-radius:18px;padding:14px;box-shadow:0 8px 30px rgba(23,27,45,.06)}.gm .game-topbar{min-height:58px;display:flex;align-items:center;gap:25px;padding:0 5px 12px}.gm .stat{display:flex;flex-direction:column;min-width:80px}.gm .stat span{font-size:12px;color:var(--muted);font-weight:700;text-transform:uppercase;letter-spacing:.06em}.gm .stat strong{font-size:23px;line-height:1.15}.gm .status{margin-left:auto;color:var(--muted);font-size:14px;font-weight:700}.gm .restart-btn,.gm .primary-btn,.gm .control-btn{border:0;font:inherit;font-weight:800;cursor:pointer;transition:transform .12s,background .12s}.gm .restart-btn{height:44px;padding:0 17px;border-radius:10px;background:#EEF0FF;color:var(--primary-dark)}.gm .restart-btn:hover{background:#E1E3FF}.gm .restart-btn:active,.gm .primary-btn:active,.gm .control-btn:active{transform:scale(.97)}.gm .canvas-wrap{position:relative;overflow:hidden;border-radius:14px;background:var(--road)}.gm canvas{display:block;width:100%;height:auto;aspect-ratio:3/2;touch-action:none}.gm .overlay{position:absolute;inset:0;display:grid;place-items:center;background:rgba(17,24,39,.54);padding:20px}.gm .overlay.hidden{display:none}.gm .overlay-box{width:min(440px,92%);background:#fff;border-radius:18px;padding:28px;text-align:center;box-shadow:0 20px 50px rgba(0,0,0,.2)}.gm .overlay-kicker{font-size:12px;letter-spacing:.12em;font-weight:800;color:var(--primary)}.gm .overlay h2{font-size:30px;line-height:1.15;margin:6px 0 9px}.gm .overlay p{margin:0 0 20px;color:var(--muted);font-size:15px}.gm .primary-btn{height:48px;padding:0 24px;border-radius:11px;background:var(--primary);color:#fff}.gm .primary-btn:hover{background:var(--primary-dark)}.gm .controls{display:flex;align-items:center;justify-content:center;gap:20px;padding:13px 0 2px}.gm .control-btn{width:62px;height:50px;border-radius:12px;background:#EEF0FF;color:var(--primary-dark);font-size:27px;line-height:1}.gm .control-hint{font-size:13px;color:var(--muted);font-weight:700}.gm .info-section{background:#fff;border:1px solid var(--border);border-radius:16px;padding:25px}.gm .info-section h2{font-size:27px;line-height:1.2;margin:0 0 12px}.gm .info-section p{margin:0 0 12px;color:#454B60}.gm .info-section{margin-bottom:24px}.gm button:focus-visible,.gm summary:focus-visible{outline:3px solid rgba(91,92,226,.35);outline-offset:3px}@media(max-width:700px){.gm .page-shell{width:min(100% - 20px,1120px)}.gm .game-card{padding:9px;border-radius:15px}.gm .game-topbar{gap:14px;padding:0 3px 9px}.gm .stat{min-width:62px}.gm .stat strong{font-size:20px}.gm .status{display:none}.gm .restart-btn{margin-left:auto;height:40px}.gm .canvas-wrap{border-radius:11px}.gm .controls{gap:12px}.gm .control-btn{width:78px;height:54px}.gm .control-hint{font-size:12px}.gm .info-section{padding:20px}.gm .info-section h2{font-size:24px}}@media(max-width:420px){.gm .overlay-box{padding:23px 18px}.gm .overlay h2{font-size:25px}.gm .overlay p{font-size:14px}.gm .control-btn{width:74px}}";
function __ready(f){f()}
function boot(){
(() => {
  'use strict';
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');
  const scoreEl = document.getElementById('score');
  const bestEl = document.getElementById('best');
  const statusEl = document.getElementById('status');
  const overlay = document.getElementById('overlay');
  const overlayTitle = document.getElementById('overlayTitle');
  const overlayText = document.getElementById('overlayText');
  const startBtn = document.getElementById('startBtn');
  const restartBtn = document.getElementById('restartBtn');
  const leftBtn = document.getElementById('leftBtn');
  const rightBtn = document.getElementById('rightBtn');

  const W = canvas.width, H = canvas.height;
  const lanes = [0, 1, 2];
  let running = false, lastTime = 0, distance = 0, score = 0, speed = 300, spawnTimer = 0, roadOffset = 0;
  let player, traffic = [], particles = [], raf = 0;
  let best = Number(localStorage.getItem('motorcycleBest') || 0);
  bestEl.textContent = best;

  function laneX(lane) { return W * 0.5 + (lane - 1) * 180; }
  function reset() {
    player = { lane: 1, x: laneX(1), y: H - 105, w: 48, h: 92, tilt: 0 };
    traffic = []; particles = []; distance = 0; score = 0; speed = 300; spawnTimer = 500; roadOffset = 0;
    updateScore();
  }
  function updateScore() { score = Math.floor(distance / 8); scoreEl.textContent = score; }
  function start() {
    cancelAnimationFrame(raf); reset(); running = true; lastTime = performance.now(); overlay.classList.add('hidden'); statusEl.textContent = 'Ride carefully'; raf = requestAnimationFrame(loop);
  }
  function endGame() {
    running = false; cancelAnimationFrame(raf);
    if (score > best) { best = score; localStorage.setItem('motorcycleBest', String(best)); bestEl.textContent = best; }
    statusEl.textContent = 'Crash!'; overlayTitle.textContent = 'Ride Over'; overlayText.textContent = `You scored ${score}. Dodge traffic and try to beat your best run.`; startBtn.textContent = 'Ride Again'; overlay.classList.remove('hidden');
    burst(player.x, player.y + 15);
    draw();
  }
  function move(dir) {
    if (!running) return;
    const next = Math.max(0, Math.min(2, player.lane + dir));
    if (next !== player.lane) { player.lane = next; player.tilt = dir * 0.14; }
  }
  function spawnTraffic() {
    const blocked = new Set(traffic.filter(v => v.y < 180).map(v => v.lane));
    const choices = lanes.filter(l => !blocked.has(l));
    if (!choices.length) return;
    const lane = choices[Math.floor(Math.random() * choices.length)];
    const colors = ['#EF5B5B','#16B8C4','#FFB84D','#8B7CF6','#22C55E'];
    traffic.push({ lane, x: laneX(lane), y: -105, w: 54, h: 94, color: colors[Math.floor(Math.random()*colors.length)], speedMul: .92 + Math.random()*.18 });
  }
  function burst(x,y) { for(let i=0;i<22;i++) particles.push({x,y,vx:(Math.random()-.5)*260,vy:(Math.random()-.5)*260,life:.55}); }
  function hit(a,b) { return Math.abs(a.x-b.x) < (a.w+b.w)*.37 && Math.abs(a.y-b.y) < (a.h+b.h)*.38; }

  function loop(now) {
    if (!running) return;
    const dt = Math.min((now-lastTime)/1000, .035); lastTime = now;
    distance += speed * dt * .055; speed = Math.min(610, 300 + distance * 0.72); roadOffset = (roadOffset + speed*dt) % 80;
    spawnTimer -= dt*1000;
    if (spawnTimer <= 0) { spawnTraffic(); spawnTimer = Math.max(470, 940 - distance*1.4); }
    player.x += (laneX(player.lane)-player.x) * Math.min(1, dt*14); player.tilt *= Math.max(0, 1-dt*7);
    for (const v of traffic) v.y += speed*v.speedMul*dt;
    traffic = traffic.filter(v => v.y < H+120);
    for (const p of particles) { p.x+=p.vx*dt; p.y+=p.vy*dt; p.vy+=420*dt; p.life-=dt; }
    particles = particles.filter(p=>p.life>0);
    updateScore();
    for (const v of traffic) if (hit(player,v)) { endGame(); return; }
    draw(); raf=requestAnimationFrame(loop);
  }

  function roundedRect(x,y,w,h,r,fill) { ctx.beginPath(); ctx.roundRect(x,y,w,h,r); ctx.fillStyle=fill; ctx.fill(); }
  function drawRoad() {
    ctx.fillStyle='#79A96B'; ctx.fillRect(0,0,W,H);
    const roadL=165, roadR=W-165; ctx.fillStyle='#252C38'; ctx.fillRect(roadL,0,roadR-roadL,H);
    ctx.fillStyle='#DDE2E8'; ctx.fillRect(roadL,0,7,H); ctx.fillRect(roadR-7,0,7,H);
    ctx.strokeStyle='rgba(255,255,255,.72)'; ctx.lineWidth=6; ctx.setLineDash([34,46]);
    for(const x of [W/2-90,W/2+90]) { ctx.lineDashOffset=-roadOffset; ctx.beginPath(); ctx.moveTo(x,-80); ctx.lineTo(x,H+80); ctx.stroke(); }
    ctx.setLineDash([]);
    for(let y=-80+(roadOffset%80);y<H;y+=80){ctx.fillStyle='rgba(255,255,255,.13)';ctx.fillRect(roadL+12,y,10,30);ctx.fillRect(roadR-22,y,10,30)}
  }
  function drawTraffic(v) {
    ctx.save(); ctx.translate(v.x,v.y); roundedRect(-v.w/2+4,-v.h/2+7,v.w-8,v.h-12,11,'rgba(0,0,0,.24)');
    roundedRect(-v.w/2,-v.h/2,v.w,v.h,11,v.color); roundedRect(-18,-28,36,27,7,'#243247'); roundedRect(-15,-24,30,16,5,'#A9D5E7');
    ctx.fillStyle='#FFE7A8';ctx.fillRect(-20,27,11,5);ctx.fillRect(9,27,11,5); ctx.restore();
  }
  function drawPlayer() {
    ctx.save(); ctx.translate(player.x,player.y); ctx.rotate(player.tilt);
    ctx.fillStyle='rgba(0,0,0,.3)';ctx.beginPath();ctx.ellipse(0,42,27,9,0,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#111827';ctx.beginPath();ctx.ellipse(0,-27,11,23,0,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.ellipse(0,30,11,23,0,0,Math.PI*2);ctx.fill();
    roundedRect(-15,-27,30,61,10,'#5B5CE2'); roundedRect(-11,-43,22,23,9,'#171B2D');
    ctx.fillStyle='#B9E6F2';ctx.beginPath();ctx.ellipse(0,-37,8,8,0,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle='#FFB84D';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(-17,-15);ctx.lineTo(17,-15);ctx.stroke();
    ctx.fillStyle='#fff';ctx.fillRect(-12,25,24,5); ctx.restore();
  }
  function draw() {
    ctx.clearRect(0,0,W,H); drawRoad(); traffic.forEach(drawTraffic); drawPlayer();
    for(const p of particles){ctx.globalAlpha=Math.max(0,p.life/.55);ctx.fillStyle='#FFB84D';ctx.beginPath();ctx.arc(p.x,p.y,4,0,Math.PI*2);ctx.fill()} ctx.globalAlpha=1;
    if(running){ctx.fillStyle='rgba(255,255,255,.8)';ctx.font='700 16px Nunito Sans';ctx.fillText(`Speed ${Math.round(speed/3)} km/h`,22,31)}
  }
  function press(dir){ move(dir); }
  document.addEventListener('keydown',e=>{ if(['ArrowLeft','ArrowRight','a','d','A','D'].includes(e.key)) e.preventDefault(); if(e.key==='ArrowLeft'||e.key==='a'||e.key==='A')press(-1); if(e.key==='ArrowRight'||e.key==='d'||e.key==='D')press(1); if(e.key==='Enter'&&!running)start(); });
  leftBtn.addEventListener('pointerdown',()=>press(-1)); rightBtn.addEventListener('pointerdown',()=>press(1)); startBtn.addEventListener('click',start); restartBtn.addEventListener('click',start);
  reset(); draw();
})();


}
function begin(){poster.hidden=true;gm.hidden=false;if(!booted){booted=true;var s=document.createElement("style");s.textContent=LOOK;document.head.appendChild(s);boot();}else{var r=document.getElementById("restartBtn");if(r)r.click();}}
poster.addEventListener("click",begin);
var nb=document.getElementById("new");if(nb)nb.addEventListener("click",begin);
})();
