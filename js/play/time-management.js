/* Time Management - game logic + its own look. Layout lives in style.css; page shell lives in the HTML. */
(function(){"use strict";
var gm=document.getElementById("gm"),poster=document.getElementById("poster"),booted=false;
var LOOK=".gm *{box-sizing:border-box}.gm .category{font-size:14px;font-weight:700;color:#667085;background:#F0F1FF;padding:6px 12px;border-radius:999px}.gm .page{max-width:1160px;margin:auto;padding:28px 20px 80px}.gm .game-shell{position:relative;background:#111827;border-radius:20px;padding:18px;box-shadow:0 16px 40px rgba(17,24,39,.12);overflow:hidden}.gm .topbar{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:14px}.gm .stat{background:#1F2937;border-radius:12px;padding:9px 13px;display:flex;justify-content:space-between;align-items:center;color:#CBD5E1}.gm .stat span{font-size:13px}.gm .stat strong{font-size:21px;color:#fff}.gm .game-layout{display:grid;grid-template-columns:minmax(0,1fr) 280px;gap:14px}.gm .desk{background:#fff;border-radius:16px;padding:22px;color:#171B2D}.gm .desk-head{display:flex;justify-content:space-between;align-items:flex-start;gap:16px}.gm .desk h2{font-size:26px;line-height:1.2;margin:4px 0 12px}.gm .clock{font-variant-numeric:tabular-nums;font-weight:800;font-size:25px;color:#4546B8;background:#F0F1FF;border-radius:12px;padding:5px 10px;white-space:nowrap}.gm .progress-track{height:8px;background:#E5E7EF;border-radius:99px;overflow:hidden;margin-bottom:18px}.gm .progress{height:100%;width:100%;background:#16B8C4;transition:width .2s linear}.gm .task-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.gm .task{border:2px solid #E5E7EF;border-radius:14px;padding:15px;text-align:left;background:#fff;cursor:pointer;transition:transform .15s,border-color .15s,box-shadow .15s;min-height:125px;color:#171B2D}.gm .task:hover,.gm .task:focus-visible{transform:translateY(-2px);border-color:#5B5CE2;box-shadow:0 8px 18px rgba(91,92,226,.12);outline:none}.gm .task:disabled{cursor:not-allowed;opacity:.62;transform:none}.gm .task-top{display:flex;justify-content:space-between;gap:8px;align-items:center}.gm .task-name{font-weight:800;font-size:18px}.gm .badge{font-size:11px;font-weight:800;padding:3px 7px;border-radius:999px}.gm .badge.urgent{background:#FDE8E8;color:#B42318}.gm .badge.normal{background:#E8F7F2;color:#147A57}.gm .task p{font-size:14px;color:#667085;margin:7px 0}.gm .task-meta{display:flex;justify-content:space-between;font-size:13px;font-weight:700}.gm .message{margin-top:15px;min-height:46px;padding:10px 13px;border-radius:10px;background:#F6F7FB;color:#667085;font-size:14px}.gm .actions{display:flex;justify-content:flex-end;gap:9px;margin-top:13px}.gm .primary,.gm .secondary{border:0;border-radius:10px;height:46px;padding:0 18px;font:700 16px inherit;cursor:pointer}.gm .primary{background:#5B5CE2;color:#fff}.gm .primary:hover{background:#4546B8}.gm .secondary{background:#fff;color:#4546B8;border:1px solid #E5E7EF}.gm .tips{background:#1F2937;color:#fff;border-radius:16px;padding:21px}.gm .tips h3{margin:0 0 8px;font-size:21px}.gm .tips p,.gm .tips li{color:#CBD5E1;font-size:14px}.gm .tips ul{padding-left:19px}.gm .legend{display:flex;align-items:center;gap:7px;margin-top:20px;font-size:13px;color:#CBD5E1}.gm .dot{width:9px;height:9px;border-radius:50%;display:inline-block;margin-left:5px}.gm .dot.urgent{background:#EF5B5B}.gm .dot.normal{background:#16B8C4}.gm .overlay{position:absolute;inset:0;background:rgba(17,24,39,.78);display:grid;place-items:center;padding:20px}.gm .hidden{display:none}.gm .result-card{background:#fff;max-width:430px;width:100%;border-radius:18px;padding:28px;text-align:center;box-shadow:0 20px 50px rgba(0,0,0,.22)}.gm .result-kicker{font-size:12px;font-weight:800;color:#5B5CE2;letter-spacing:1px}.gm .result-card h2{margin:6px 0;font-size:30px}.gm .result-card p{color:#667085}.gm .result-score{display:flex;justify-content:space-between;align-items:center;background:#F6F7FB;border-radius:12px;padding:10px 14px;margin:18px 0}.gm .result-score strong{font-size:26px}@media(max-width:760px){.gm .page{padding:20px 14px 55px}.gm .game-shell{padding:10px;border-radius:16px}.gm .game-layout{grid-template-columns:1fr}.gm .tips{display:none}.gm .topbar{grid-template-columns:repeat(2,1fr)}.gm .desk{padding:16px}.gm .desk-head{align-items:center}.gm .desk h2{font-size:21px}.gm .clock{font-size:21px}.gm .task-grid{grid-template-columns:1fr}.gm .task{min-height:108px}.gm .actions{justify-content:stretch}.gm .actions button{flex:1}}@media(prefers-reduced-motion:reduce){.gm *{scroll-behavior:auto!important;transition:none!important}}";
function __ready(f){f()}
function boot(){
(() => {
  "use strict";
  const els = {
    time: document.getElementById("time"), score: document.getElementById("score"),
    focus: document.getElementById("focus"), day: document.getElementById("day"),
    clock: document.getElementById("clock"), progress: document.getElementById("progress"),
    grid: document.getElementById("taskGrid"), message: document.getElementById("message"),
    restart: document.getElementById("restart"), pause: document.getElementById("pause"),
    overlay: document.getElementById("overlay"), resultKicker: document.getElementById("resultKicker"),
    resultTitle: document.getElementById("resultTitle"), resultText: document.getElementById("resultText"),
    resultScore: document.getElementById("resultScore"), next: document.getElementById("next")
  };

  const taskPool = [
    ["Client email","Reply to an important client.","urgent",8,18],
    ["Project deadline","Update the delivery plan.","urgent",10,25],
    ["Team check-in","Resolve a blocker with your team.","urgent",7,20],
    ["Invoice review","Approve this week's invoices.","normal",6,14],
    ["Inbox cleanup","Clear low-priority messages.","normal",5,9],
    ["Plan tomorrow","Prepare your next-day schedule.","normal",6,13],
    ["Deep work","Finish a focused project task.","normal",12,30],
    ["Quick report","Send a short status report.","normal",7,16],
    ["Meeting prep","Review notes before a meeting.","urgent",5,15],
    ["File organization","Sort project documents.","normal",8,10],
    ["Customer follow-up","Check on an open request.","urgent",6,19],
    ["Break & reset","Take a short focus break.","normal",4,6]
  ];

  let day = 1, totalScore = 0, timeLeft = 90, focus = 100, timer = null, paused = false, active = false, currentTasks = [];
  const maxDays = 5;

  const pick = (arr, n) => [...arr].sort(() => Math.random() - 0.5).slice(0, n);
  const fmt = s => `${String(Math.floor(s / 60)).padStart(2,"0")}:${String(s % 60).padStart(2,"0")}`;

  function renderStats() {
    els.time.textContent = `${timeLeft}s`;
    els.clock.textContent = fmt(timeLeft);
    els.score.textContent = totalScore;
    els.focus.textContent = `${focus}%`;
    els.day.textContent = `${day}/${maxDays}`;
    els.progress.style.width = `${Math.max(0, timeLeft / dayDuration() * 100)}%`;
  }
  function dayDuration() { return Math.max(55, 90 - (day - 1) * 7); }

  function renderTasks() {
    els.grid.innerHTML = "";
    currentTasks.forEach((t, i) => {
      const [name, desc, type, cost, points] = t;
      const btn = document.createElement("button");
      btn.className = "task";
      btn.type = "button";
      btn.dataset.index = i;
      btn.innerHTML = `<div class="task-top"><span class="task-name">${name}</span><span class="badge ${type}">${type === "urgent" ? "URGENT" : "NORMAL"}</span></div><p>${desc}</p><div class="task-meta"><span>⏱ ${cost}s</span><span>+${points} pts</span></div>`;
      btn.addEventListener("click", () => completeTask(i));
      els.grid.appendChild(btn);
    });
  }

  function startDay() {
    clearInterval(timer);
    timeLeft = dayDuration();
    focus = 100;
    paused = false;
    active = true;
    els.pause.textContent = "Pause";
    els.overlay.classList.add("hidden");
    els.message.textContent = "Choose a task. Urgent work rewards better decisions, while poor priorities can cost focus.";
    currentTasks = pick(taskPool, 4);
    renderTasks(); renderStats();
    timer = setInterval(tick, 1000);
  }

  function tick() {
    if (!active || paused) return;
    timeLeft--;
    renderStats();
    if (timeLeft <= 0) finishDay(false);
  }

  function completeTask(i) {
    if (!active || paused) return;
    const t = currentTasks[i];
    if (!t) return;
    const [name, desc, type, cost, points] = t;
    if (timeLeft < cost) {
      focus = Math.max(0, focus - 8);
      els.message.textContent = `Not enough time for "${name}". Try a shorter task.`;
      renderStats();
      return;
    }
    timeLeft -= cost;
    let earned = points;
    if (type === "urgent") earned += 5;
    if (focus >= 80) earned += 2;
    totalScore += earned;
    if (type === "normal" && focus < 60) focus = Math.max(0, focus - 3);
    currentTasks.splice(i, 1);
    els.message.textContent = `${name} completed. You earned ${earned} points.`;
    renderTasks(); renderStats();
    if (currentTasks.length === 0) finishDay(true);
  }

  function finishDay(completed) {
    if (!active) return;
    active = false; clearInterval(timer);
    const threshold = 55 + day * 5;
    const dayScore = totalScore;
    const passed = completed || dayScore >= threshold;
    els.resultKicker.textContent = passed ? "DAY COMPLETE" : "DAY ENDED";
    els.resultTitle.textContent = passed ? (day === maxDays ? "Workday mastered!" : "Nice planning!") : "The clock won this round";
    els.resultText.textContent = passed
      ? `You finished day ${day} with ${focus}% focus. Keep your priorities sharp for the next day.`
      : `You ran out of time. Try prioritizing urgent tasks and shorter jobs next time.`;
    els.resultScore.textContent = totalScore;
    els.next.textContent = day === maxDays ? "Play Again" : "Next Day";
    els.next.dataset.passed = passed ? "1" : "0";
    els.overlay.classList.remove("hidden");
  }

  els.pause.addEventListener("click", () => {
    if (!active) return;
    paused = !paused;
    els.pause.textContent = paused ? "Resume" : "Pause";
    els.message.textContent = paused ? "Game paused. Resume when you're ready." : "Back to work — choose your next task.";
  });

  els.restart.addEventListener("click", () => {
    totalScore = 0;
    startDay();
  });

  els.next.addEventListener("click", () => {
    if (day === maxDays || els.next.dataset.passed !== "1") {
      if (day === maxDays) { day = 1; totalScore = 0; }
      startDay();
      return;
    }
    day++;
    startDay();
  });

  renderStats();
  startDay();
})();

}
function begin(){poster.hidden=true;gm.hidden=false;if(!booted){booted=true;var s=document.createElement("style");s.textContent=LOOK;document.head.appendChild(s);boot();}else{var r=document.getElementById("restart");if(r)r.click();}}
poster.addEventListener("click",begin);
var nb=document.getElementById("new");if(nb)nb.addEventListener("click",begin);
})();
