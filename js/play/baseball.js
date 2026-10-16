/* Baseball - game logic + its own look. Layout lives in style.css; page shell lives in the HTML. */
(function(){"use strict";
var gm=document.getElementById("gm"),poster=document.getElementById("poster"),booted=false;
var LOOK=".gm *{box-sizing:border-box}.gm{font-family:\"Nunito Sans\",system-ui,sans-serif;color:#171B2D;background:#F6F7FB}.gm button{font:inherit}.gm .back-link{color:#4546B8;text-decoration:none;font-weight:700}.gm .page{width:min(1120px,calc(100% - 32px));margin:0 auto;padding:28px 0 72px}.gm h2{font-size:30px;line-height:1.2;margin:0 0 14px}.gm p{font-size:17px;line-height:1.65;margin:0;color:#667085}.gm .game-shell{background:#fff;border:1px solid #E5E7EF;border-radius:20px;overflow:hidden;box-shadow:0 10px 30px rgba(23,27,45,.07)}.gm .scorebar{height:76px;display:grid;grid-template-columns:repeat(4,1fr);background:#fff;border-bottom:1px solid #E5E7EF}.gm .score-item{display:flex;flex-direction:column;align-items:center;justify-content:center;border-right:1px solid #E5E7EF}.gm .score-item:last-child{border:0}.gm .score-item span{font-size:13px;color:#667085;font-weight:700;text-transform:uppercase;letter-spacing:.06em}.gm .score-item strong{font-size:23px;line-height:1.1;margin-top:3px}.gm .stadium{position:relative;background:#111827;aspect-ratio:16/8.7;min-height:390px;overflow:hidden}.gm canvas{width:100%;height:100%;display:block}.gm .pitch-status{position:absolute;left:50%;top:18px;transform:translateX(-50%);background:rgba(17,24,39,.78);border:1px solid rgba(255,255,255,.13);color:#fff;padding:7px 14px;border-radius:999px;font-size:14px;font-weight:700;pointer-events:none;white-space:nowrap}.gm .game-overlay{position:absolute;inset:0;background:rgba(17,24,39,.56);display:grid;place-items:center;padding:20px}.gm .game-overlay.hidden{display:none}.gm .overlay-card{width:min(430px,100%);text-align:center;background:#fff;border-radius:18px;padding:30px;box-shadow:0 20px 60px rgba(0,0,0,.28)}.gm .baseball-icon{font-size:42px;margin-bottom:6px}.gm .overlay-card h2{margin-bottom:8px}.gm .overlay-card p{font-size:16px;margin-bottom:22px}.gm .primary-btn,.gm .swing-btn{border:0;cursor:pointer;font-weight:800}.gm .primary-btn{height:48px;padding:0 25px;border-radius:12px;background:#5B5CE2;color:#fff;box-shadow:0 5px 14px rgba(91,92,226,.24)}.gm .primary-btn:hover{background:#4546B8}.gm .primary-btn:focus-visible,.gm .swing-btn:focus-visible{outline:3px solid #16B8C4;outline-offset:3px}.gm .controls{min-height:100px;padding:18px 22px;display:flex;align-items:center;justify-content:center;gap:20px;border-top:1px solid #E5E7EF}.gm .swing-btn{height:62px;min-width:170px;border-radius:14px;background:#FFB84D;color:#171B2D;font-size:20px;letter-spacing:.04em;box-shadow:0 5px 0 #D99225;touch-action:manipulation}.gm .swing-btn:active{transform:translateY(4px);box-shadow:0 1px 0 #D99225}.gm .hint{font-size:15px;color:#667085}.gm .key{display:inline-block;background:#F6F7FB;border:1px solid #E5E7EF;border-radius:7px;padding:4px 7px;font-weight:800;color:#171B2D}.gm .score-guide{display:grid;gap:10px;margin-top:18px}.gm .score-guide div{display:grid;grid-template-columns:14px 1fr auto;align-items:center;gap:9px;padding:9px 10px;background:#F6F7FB;border-radius:10px}.gm .score-guide b{font-size:15px}.gm .score-guide em{font-style:normal;font-weight:800}.gm .dot{width:10px;height:10px;border-radius:50%}.gm .single{background:#22C55E}.gm .double{background:#16B8C4}.gm .triple{background:#FFB84D}.gm .homer{background:#EF5B5B}.gm .tips{margin-top:20px}.gm .tip-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}.gm .tip-grid div{padding:17px;background:#F6F7FB;border-radius:12px}.gm .tip-grid b{font-size:17px}.gm .tip-grid p{font-size:15px;margin-top:5px;line-height:1.55}.gm .section-heading{display:flex;align-items:end;justify-content:space-between;margin-bottom:16px}.gm .section-heading h2{margin:0}.gm .section-heading a{color:#4546B8;text-decoration:none;font-weight:800}@media(max-width:720px){.gm .page{width:min(100% - 20px,1120px);padding-top:20px}.gm .back-link{font-size:14px}.gm .scorebar{height:68px}.gm .score-item span{font-size:11px}.gm .score-item strong{font-size:20px}.gm .stadium{min-height:0;aspect-ratio:1/1.05}.gm .pitch-status{top:10px;font-size:12px;padding:6px 10px}.gm .controls{padding:16px;flex-direction:column;gap:12px}.gm .swing-btn{width:100%;max-width:360px;height:60px}.gm .hint{text-align:center;font-size:13px}.gm .tip-grid{grid-template-columns:1fr;gap:10px}.gm .section-heading{align-items:start;gap:10px;flex-direction:column}.gm .section-heading a{font-size:14px}.gm h2{font-size:27px}}";
function __ready(f){f()}
function boot(){
(() => {
  "use strict";

  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");
  const scoreEl = document.getElementById("score");
  const inningEl = document.getElementById("inning");
  const strikesEl = document.getElementById("strikes");
  const bestEl = document.getElementById("best");
  const statusEl = document.getElementById("status");
  const overlay = document.getElementById("overlay");
  const overlayTitle = document.getElementById("overlayTitle");
  const overlayText = document.getElementById("overlayText");
  const startBtn = document.getElementById("startBtn");
  const swingBtn = document.getElementById("swingBtn");

  const state = {
    running: false, score: 0, best: Number(localStorage.getItem("baseballBest") || 0),
    inning: 1, strikes: 0, outs: 0, pitch: null, swingTimer: 0,
    resultTimer: 0, particles: [], last: 0, animation: 0
  };

  bestEl.textContent = state.best;

  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.max(1, Math.round(rect.width * dpr));
    canvas.height = Math.max(1, Math.round(rect.height * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();

  function W(){ return canvas.clientWidth; }
  function H(){ return canvas.clientHeight; }
  function plateX(){ return W() * 0.79; }
  function hitY(){ return H() * 0.70; }

  function updateUI() {
    scoreEl.textContent = state.score;
    inningEl.textContent = `${state.inning} / 9`;
    strikesEl.textContent = `${state.strikes} / 3`;
    bestEl.textContent = state.best;
  }

  function startGame() {
    state.running = true; state.score = 0; state.inning = 1; state.strikes = 0;
    state.outs = 0; state.particles = []; state.swingTimer = 0; state.resultTimer = 0;
    overlay.classList.add("hidden");
    updateUI();
    statusEl.textContent = "Watch the pitch...";
    nextPitch();
  }

  function endGame(title, text) {
    state.running = false;
    if (state.score > state.best) {
      state.best = state.score;
      localStorage.setItem("baseballBest", String(state.best));
    }
    updateUI();
    overlayTitle.textContent = title;
    overlayText.textContent = `${text} Final score: ${state.score}.`;
    startBtn.textContent = "Play Again";
    overlay.classList.remove("hidden");
    statusEl.textContent = "Game over";
  }

  function nextPitch() {
    if (!state.running) return;
    const difficulty = Math.min(1, (state.inning - 1) / 9);
    state.pitch = {
      t: 0, duration: 1250 - difficulty * 140 + Math.random() * 160,
      startX: W() * 0.18, startY: H() * 0.38 + Math.random() * H() * 0.07,
      targetX: plateX(), targetY: hitY() - H() * 0.04 + Math.random() * H() * 0.08,
      curve: (Math.random() - 0.5) * H() * 0.12
    };
    statusEl.textContent = "Pitch incoming!";
  }

  function swing() {
    if (!state.running || !state.pitch || state.resultTimer > 0) return;
    state.swingTimer = 150;
    const p = state.pitch;
    const progress = p.t / p.duration;
    const distance = Math.abs(progress - 0.82);
    let result = "miss";
    if (distance < 0.045) result = "homer";
    else if (distance < 0.09) result = "triple";
    else if (distance < 0.145) result = "double";
    else if (distance < 0.22) result = "single";

    if (result === "miss") {
      state.strikes++;
      state.pitch = null;
      statusEl.textContent = state.strikes >= 3 ? "Strike three!" : "Strike!";
      burst(plateX(), hitY(), 8, false);
      if (state.strikes >= 3) {
        state.outs++;
        if (state.outs >= 3 || state.inning >= 9) {
          setTimeout(() => endGame("Three Strikes", "The pitcher wins this at-bat."), 520);
        } else {
          setTimeout(() => { state.strikes = 0; state.inning++; updateUI(); nextPitch(); }, 700);
        }
      } else {
        setTimeout(nextPitch, 620);
      }
      updateUI();
      return;
    }

    const points = {single:10,double:20,triple:35,homer:50}[result];
    state.score += points;
    statusEl.textContent = result === "homer" ? "HOME RUN! +50" : `${result.toUpperCase()}! +${points}`;
    burst(plateX(), hitY(), result === "homer" ? 36 : 18, true);
    state.pitch = null;
    state.resultTimer = result === "homer" ? 1000 : 700;
    updateUI();
  }

  function finishHit() {
    state.resultTimer = 0;
    if (!state.running) return;
    if (state.inning >= 9) {
      endGame("Game Complete", "You played all nine innings.");
      return;
    }
    state.inning++;
    state.strikes = 0;
    updateUI();
    nextPitch();
  }

  function burst(x,y,count,good) {
    for(let i=0;i<count;i++){
      state.particles.push({
        x,y,vx:(Math.random()-.5)*(good?260:150),vy:(Math.random()-.65)*(good?260:150),
        life:500+Math.random()*500,size:3+Math.random()*5,good
      });
    }
  }

  function drawField() {
    const w=W(), h=H();
    ctx.clearRect(0,0,w,h);
    // sky
    const sky = ctx.createLinearGradient(0,0,0,h*.62);
    sky.addColorStop(0,"#4B83B8"); sky.addColorStop(1,"#B7D8E6");
    ctx.fillStyle=sky; ctx.fillRect(0,0,w,h*.62);
    // distant stadium
    ctx.fillStyle="#374151"; ctx.fillRect(0,h*.34,w,h*.22);
    for(let x=12;x<w;x+=22){ ctx.fillStyle=x%44===0?"#E5E7EF":"#9CA3AF"; ctx.fillRect(x,h*.29,13,h*.08); }
    // field
    ctx.fillStyle="#4E8B45"; ctx.fillRect(0,h*.50,w,h*.50);
    ctx.fillStyle="#5F9E50"; ctx.beginPath(); ctx.arc(w*.5,h*.72,w*.53,Math.PI,Math.PI*2); ctx.fill();
    // dirt diamond
    ctx.save(); ctx.translate(plateX(),hitY()+8); ctx.rotate(Math.PI/4);
    ctx.fillStyle="#B97B4A"; ctx.fillRect(-h*.19,-h*.19,h*.38,h*.38); ctx.restore();
    // baselines
    ctx.strokeStyle="rgba(255,255,255,.78)"; ctx.lineWidth=3;
    ctx.beginPath(); ctx.moveTo(plateX(),hitY()); ctx.lineTo(w*.48,h*.53); ctx.lineTo(w*.22,h*.69); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(plateX(),hitY()); ctx.lineTo(w*.48,h*.53); ctx.lineTo(w*.22,h*.83); ctx.stroke();
    // bases
    [[w*.48,h*.53],[w*.22,h*.69],[w*.22,h*.83],[plateX(),hitY()]].forEach(([x,y])=>{
      ctx.save();ctx.translate(x,y);ctx.rotate(Math.PI/4);ctx.fillStyle="#fff";ctx.fillRect(-7,-7,14,14);ctx.restore();
    });
    // mound
    ctx.fillStyle="#C68A57";ctx.beginPath();ctx.ellipse(w*.48,h*.55,w*.10,h*.045,0,0,Math.PI*2);ctx.fill();
    // plate
    ctx.fillStyle="#fff";ctx.beginPath();ctx.moveTo(plateX()-10,hitY());ctx.lineTo(plateX()+10,hitY());ctx.lineTo(plateX()+6,hitY()+12);ctx.lineTo(plateX()-6,hitY()+12);ctx.closePath();ctx.fill();
    // hit zone
    ctx.strokeStyle="rgba(255,184,77,.9)";ctx.lineWidth=2;ctx.setLineDash([6,5]);
    ctx.strokeRect(plateX()-w*.055,hitY()-h*.09,w*.11,h*.18);ctx.setLineDash([]);
    // batter
    const bx=plateX()-w*.09, by=hitY()-h*.08;
    ctx.strokeStyle="#171B2D";ctx.lineWidth=Math.max(5,w*.009);ctx.lineCap="round";
    ctx.beginPath();ctx.moveTo(bx,by);ctx.lineTo(bx-w*.015,by+h*.12);ctx.moveTo(bx,by+h*.12);ctx.lineTo(bx-w*.035,by+h*.19);ctx.moveTo(bx,by+h*.12);ctx.lineTo(bx+w*.025,by+h*.19);ctx.stroke();
    ctx.fillStyle="#F3C9A8";ctx.beginPath();ctx.arc(bx,by-h*.035,w*.018,0,Math.PI*2);ctx.fill();
    ctx.fillStyle="#5B5CE2";ctx.fillRect(bx-w*.022,by-w*.006,w*.044,h*.10);
    ctx.strokeStyle="#D7A34A";ctx.lineWidth=Math.max(4,w*.008);ctx.beginPath();ctx.moveTo(bx+w*.005,by+h*.015);ctx.lineTo(bx+w*.075,by-h*.015);ctx.stroke();
  }

  function drawPitch() {
    if(!state.pitch) return;
    const p=state.pitch;
    const q=Math.min(1,p.t/p.duration);
    const ease=q*q*(3-2*q);
    const x=p.startX+(p.targetX-p.startX)*ease;
    const y=p.startY+(p.targetY-p.startY)*ease + Math.sin(q*Math.PI)*p.curve;
    const r=5+q*5;
    ctx.save();
    ctx.shadowColor="rgba(255,255,255,.45)";ctx.shadowBlur=12;
    ctx.fillStyle="#fff";ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();
    ctx.restore();
    ctx.strokeStyle="rgba(255,255,255,.4)";ctx.lineWidth=2;
    ctx.beginPath();ctx.moveTo(x-r*2,y-r*1.5);ctx.lineTo(x-r*4,y-r*2.2);ctx.stroke();
  }

  function drawParticles(dt) {
    for(let i=state.particles.length-1;i>=0;i--){
      const a=state.particles[i]; a.life-=dt; a.x+=a.vx*dt/1000; a.y+=a.vy*dt/1000; a.vy+=220*dt/1000;
      if(a.life<=0){state.particles.splice(i,1);continue}
      ctx.globalAlpha=Math.max(0,a.life/900);
      ctx.fillStyle=a.good?"#FFB84D":"#EF5B5B";
      ctx.beginPath();ctx.arc(a.x,a.y,a.size,0,Math.PI*2);ctx.fill();
    }
    ctx.globalAlpha=1;
  }

  function loop(ts) {
    const dt=Math.min(40,ts-state.last||16); state.last=ts;
    drawField();
    if(state.pitch){ state.pitch.t+=dt; if(state.pitch.t>=state.pitch.duration && state.resultTimer===0){
      state.pitch=null; state.strikes++; statusEl.textContent="Called strike!";
      updateUI();
      if(state.strikes>=3){ state.outs++; if(state.outs>=3||state.inning>=9) setTimeout(()=>endGame("Three Strikes","The pitcher wins this at-bat."),450);
      else setTimeout(()=>{state.strikes=0;state.inning++;updateUI();nextPitch()},650); }
      else setTimeout(nextPitch,600);
    }}
    if(state.swingTimer>0) state.swingTimer-=dt;
    if(state.resultTimer>0){ state.resultTimer-=dt; if(state.resultTimer<=0) finishHit(); }
    drawPitch(); drawParticles(dt);
    state.animation=requestAnimationFrame(loop);
  }

  startBtn.addEventListener("click", startGame);
  swingBtn.addEventListener("click", swing);
  document.addEventListener("keydown", e => {
    if(e.code==="Space"){ e.preventDefault(); if(!state.running) startGame(); else swing(); }
  });

  // Prevent accidental page scrolling/zoom behavior during touch play.
  swingBtn.addEventListener("touchstart", e => { e.preventDefault(); if(!state.running) startGame(); else swing(); }, {passive:false});

  updateUI();
  state.animation=requestAnimationFrame(loop);
})();


}
function begin(){poster.hidden=true;gm.hidden=false;if(!booted){booted=true;var s=document.createElement("style");s.textContent=LOOK;document.head.appendChild(s);boot();}else{var r=document.getElementById("startBtn");if(r)r.click();}}
poster.addEventListener("click",begin);
var nb=document.getElementById("new");if(nb)nb.addEventListener("click",begin);
})();
