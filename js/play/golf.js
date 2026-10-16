/* Golf - game logic + its own look. Layout lives in style.css; page shell lives in the HTML. */
(function(){"use strict";
var gm=document.getElementById("gm"),poster=document.getElementById("poster"),booted=false;
var LOOK=".gm *{box-sizing:border-box}.gm{font-family:\"Nunito Sans\",system-ui,-apple-system,BlinkMacSystemFont,\"Segoe UI\",sans-serif;color:#171B2D;background:#F6F7FB}.gm button,.gm input{font:inherit}.gm button{cursor:pointer}.gm .page{width:min(1160px,calc(100% - 32px));margin:0 auto;padding:30px 0 72px}.gm h2,.gm h3,.gm p{margin-top:0}.gm .game-shell{background:#fff;border:1px solid #E5E7EF;border-radius:20px;overflow:hidden;box-shadow:0 14px 40px rgba(23,27,45,.07)}.gm .game-topbar{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:#E5E7EF}.gm .stat{background:#fff;padding:14px 18px;display:flex;justify-content:space-between;align-items:center;gap:12px}.gm .stat span{font-size:14px;color:#667085}.gm .stat strong{font-size:21px}.gm .canvas-wrap{position:relative;background:#111827;padding:0;line-height:0}.gm canvas{display:block;width:100%;height:auto;touch-action:none}.gm .state-card{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:min(360px,calc(100% - 36px));padding:26px;border-radius:18px;background:rgba(255,255,255,.97);text-align:center;box-shadow:0 20px 60px rgba(0,0,0,.25);line-height:1.5}.gm .state-card.hidden{display:none}.gm .state-kicker{font-size:13px;text-transform:uppercase;letter-spacing:.08em;font-weight:800;color:#5B5CE2}.gm .state-card h2{font-size:30px;margin:6px 0 8px}.gm .state-card p{color:#667085;margin-bottom:18px}.gm .controls-panel{padding:22px 24px;background:#fff}.gm .aim-row,.gm .power-row{display:grid;grid-template-columns:100px 1fr;gap:18px;align-items:center;margin-bottom:16px}.gm .control-label{display:flex;justify-content:space-between;gap:8px;align-items:center}.gm .control-label span{color:#667085;font-size:15px}.gm .control-label strong{font-size:16px}.gm input[type=range]{width:100%;accent-color:#5B5CE2;height:34px}.gm .action-row{display:flex;gap:12px;margin-top:4px}.gm .primary-btn,.gm .secondary-btn,.gm .ghost-btn{min-height:48px;border-radius:12px;border:1px solid transparent;padding:0 20px;font-weight:800;font-size:16px}.gm .primary-btn,.gm .secondary-btn{background:#5B5CE2;color:#fff}.gm .primary-btn:hover,.gm .secondary-btn:hover{background:#4546B8}.gm .ghost-btn{background:#fff;border-color:#E5E7EF;color:#171B2D}.gm .ghost-btn:hover{background:#F6F7FB}.gm .control-help{font-size:14px;line-height:1.55;color:#667085;margin:14px 0 0}.gm .tips{margin-top:20px}.gm .tips-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}.gm .tips-grid div{padding:18px;border:1px solid #E5E7EF;border-radius:14px;background:#FAFAFC}.gm .tips-grid span{display:block;color:#5B5CE2;font-weight:800;margin-bottom:8px}.gm .tips-grid p{margin:0;font-size:15px}.gm .muted{color:#667085!important}@media(max-width:760px){.gm .page{width:min(100% - 20px,1160px);padding-top:22px}.gm .game-topbar{grid-template-columns:repeat(2,1fr)}.gm .stat{padding:12px 14px}.gm .stat strong{font-size:18px}.gm .controls-panel{padding:18px 16px}.gm .aim-row,.gm .power-row{grid-template-columns:1fr;gap:4px;margin-bottom:10px}.gm .control-label{justify-content:space-between}.gm .action-row{display:grid;grid-template-columns:1fr 1fr}.gm .primary-btn,.gm .secondary-btn,.gm .ghost-btn{width:100%;padding:0 12px}.gm .tips-grid{grid-template-columns:1fr 1fr}}@media(max-width:440px){.gm .tips-grid{grid-template-columns:1fr}.gm .action-row{grid-template-columns:1fr}.gm .state-card{padding:21px}}";
function __ready(f){f()}
function boot(){
(() => {
  "use strict";

  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");
  const holeValue = document.getElementById("holeValue");
  const parValue = document.getElementById("parValue");
  const strokesValue = document.getElementById("strokesValue");
  const totalValue = document.getElementById("totalValue");
  const angleSlider = document.getElementById("angleSlider");
  const powerSlider = document.getElementById("powerSlider");
  const angleValue = document.getElementById("angleValue");
  const powerValue = document.getElementById("powerValue");
  const shotButton = document.getElementById("shotButton");
  const restartButton = document.getElementById("restartButton");
  const stateCard = document.getElementById("stateCard");
  const stateKicker = document.getElementById("stateKicker");
  const stateTitle = document.getElementById("stateTitle");
  const stateText = document.getElementById("stateText");
  const stateButton = document.getElementById("stateButton");

  const W = canvas.width, H = canvas.height;
  const HOLES = [
    {par:3, start:[145,470], cup:[930,150], obstacles:[
      {type:"sand",x:530,y:350,rx:105,ry:58},{type:"tree",x:720,y:190,r:34},{type:"tree",x:780,y:220,r:28}
    ]},
    {par:4, start:[150,485], cup:[965,150], obstacles:[
      {type:"sand",x:430,y:205,rx:115,ry:55},{type:"sand",x:745,y:410,rx:95,ry:48},{type:"tree",x:585,y:300,r:32}
    ]},
    {par:3, start:[165,150], cup:[920,475], obstacles:[
      {type:"sand",x:510,y:160,rx:105,ry:52},{type:"tree",x:390,y:370,r:34},{type:"tree",x:690,y:290,r:36}
    ]},
    {par:4, start:[140,310], cup:[960,310], obstacles:[
      {type:"sand",x:360,y:180,rx:80,ry:45},{type:"sand",x:730,y:450,rx:90,ry:45},{type:"tree",x:550,y:315,r:38}
    ]},
    {par:5, start:[145,500], cup:[945,120], obstacles:[
      {type:"sand",x:340,y:395,rx:100,ry:52},{type:"sand",x:740,y:215,rx:95,ry:48},{type:"tree",x:550,y:180,r:35},{type:"tree",x:600,y:390,r:30}
    ]},
    {par:3, start:[155,135], cup:[930,135], obstacles:[
      {type:"sand",x:535,y:135,rx:115,ry:50},{type:"tree",x:390,y:300,r:35},{type:"tree",x:735,y:300,r:35}
    ]},
    {par:4, start:[160,470], cup:[940,450], obstacles:[
      {type:"sand",x:500,y:445,rx:125,ry:50},{type:"tree",x:300,y:210,r:35},{type:"tree",x:785,y:230,r:35}
    ]},
    {par:4, start:[145,155], cup:[950,490], obstacles:[
      {type:"sand",x:380,y:210,rx:90,ry:48},{type:"sand",x:780,y:330,rx:90,ry:48},{type:"tree",x:590,y:300,r:38}
    ]},
    {par:5, start:[145,485], cup:[955,125], obstacles:[
      {type:"sand",x:300,y:300,rx:90,ry:48},{type:"sand",x:690,y:300,rx:105,ry:52},{type:"tree",x:505,y:155,r:34},{type:"tree",x:520,y:470,r:34}
    ]}
  ];

  let holeIndex = 0, strokes = 0, total = 0;
  let ball = {x:0,y:0}, moving = false, gameOver = false, anim = null;
  let trail = [], messageTimer = 0;

  function currentHole(){ return HOLES[holeIndex]; }
  function resetBall(){
    const h = currentHole();
    ball.x = h.start[0]; ball.y = h.start[1];
    trail = [];
  }
  function updateUI(){
    const h = currentHole();
    holeValue.textContent = `${holeIndex + 1} / ${HOLES.length}`;
    parValue.textContent = h.par;
    strokesValue.textContent = strokes;
    totalValue.textContent = total;
    angleValue.textContent = `${Number(angleSlider.value)}°`;
    powerValue.textContent = `${Number(powerSlider.value)}%`;
  }
  function showState(kicker,title,text,button){
    stateKicker.textContent=kicker; stateTitle.textContent=title; stateText.textContent=text; stateButton.textContent=button;
    stateCard.classList.remove("hidden");
  }
  function hideState(){ stateCard.classList.add("hidden"); }

  function dist(a,b){return Math.hypot(a.x-b.x,a.y-b.y)}
  function pointInObstacle(x,y,o){
    if(o.type==="sand") return ((x-o.x)**2/(o.rx*o.rx)+(y-o.y)**2/(o.ry*o.ry))<=1;
    return Math.hypot(x-o.x,y-o.y)<o.r;
  }
  function hitObstacle(x,y){
    return currentHole().obstacles.find(o=>pointInObstacle(x,y,o));
  }
  function drawCourse(){
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle="#0d6b43"; ctx.fillRect(0,0,W,H);
    ctx.fillStyle="#168252";
    for(let y=0;y<H;y+=70) ctx.fillRect(0,y,W,35);
    ctx.strokeStyle="rgba(255,255,255,.07)"; ctx.lineWidth=2;
    for(let x=0;x<W;x+=110){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke()}
    for(let y=0;y<H;y+=110){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke()}
    const h=currentHole();

    h.obstacles.forEach(o=>{
      if(o.type==="sand"){
        ctx.save(); ctx.fillStyle="#d9bb79"; ctx.beginPath(); ctx.ellipse(o.x,o.y,o.rx,o.ry,0,0,Math.PI*2); ctx.fill();
        ctx.strokeStyle="rgba(120,90,40,.2)"; ctx.lineWidth=3; ctx.stroke(); ctx.restore();
      } else {
        ctx.save(); ctx.fillStyle="#5b3b24"; ctx.fillRect(o.x-5,o.y+5,10,30);
        ctx.fillStyle="#174d2d"; ctx.beginPath();ctx.arc(o.x,o.y,o.r,0,Math.PI*2);ctx.fill();
        ctx.fillStyle="#246c3c";ctx.beginPath();ctx.arc(o.x-10,o.y-9,o.r*.62,0,Math.PI*2);ctx.fill();ctx.restore();
      }
    });

    ctx.save();
    ctx.fillStyle="#111827";ctx.globalAlpha=.18;ctx.beginPath();ctx.arc(h.cup[0]+2,h.cup[1]+3,10,0,Math.PI*2);ctx.fill();
    ctx.fillStyle="#f8fafc";ctx.beginPath();ctx.arc(h.cup[0],h.cup[1],9,0,Math.PI*2);ctx.fill();
    ctx.fillStyle="#111827";ctx.beginPath();ctx.arc(h.cup[0],h.cup[1],5,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle="#f8fafc";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(h.cup[0],h.cup[1]);ctx.lineTo(h.cup[0],h.cup[1]-70);ctx.stroke();
    ctx.fillStyle="#EF5B5B";ctx.beginPath();ctx.moveTo(h.cup[0],h.cup[1]-70);ctx.lineTo(h.cup[0]+38,h.cup[1]-58);ctx.lineTo(h.cup[0],h.cup[1]-45);ctx.closePath();ctx.fill();
    ctx.restore();

    if(trail.length>1){
      ctx.save();ctx.strokeStyle="rgba(255,255,255,.35)";ctx.lineWidth=2;ctx.setLineDash([5,7]);ctx.beginPath();
      trail.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.stroke();ctx.restore();
    }
    drawAim();
    ctx.save();ctx.fillStyle="#f8fafc";ctx.strokeStyle="#111827";ctx.lineWidth=3;ctx.beginPath();ctx.arc(ball.x,ball.y,9,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.restore();
  }

  function drawAim(){
    if(moving || gameOver)return;
    const rad=Number(angleSlider.value)*Math.PI/180;
    const len=55+Number(powerSlider.value)*1.25;
    ctx.save();ctx.strokeStyle="rgba(255,255,255,.9)";ctx.lineWidth=3;ctx.setLineDash([8,8]);
    ctx.beginPath();ctx.moveTo(ball.x,ball.y);ctx.lineTo(ball.x+Math.cos(rad)*len,ball.y+Math.sin(rad)*len);ctx.stroke();
    ctx.restore();
  }

  function shot(){
    if(moving||gameOver)return;
    hideState();
    const power=Number(powerSlider.value);
    const angle=Number(angleSlider.value)*Math.PI/180;
    const maxDist=65+power*4.15;
    const targetX=ball.x+Math.cos(angle)*maxDist, targetY=ball.y+Math.sin(angle)*maxDist;
    const start={x:ball.x,y:ball.y}, end={x:Math.max(18,Math.min(W-18,targetX)),y:Math.max(18,Math.min(H-18,targetY))};
    strokes++; updateUI(); moving=true; trail=[{...start}];
    const duration=420+power*5;
    const t0=performance.now();
    function frame(now){
      const t=Math.min(1,(now-t0)/duration);
      const ease=1-Math.pow(1-t,3);
      ball.x=start.x+(end.x-start.x)*ease; ball.y=start.y+(end.y-start.y)*ease;
      trail.push({x:ball.x,y:ball.y}); if(trail.length>30)trail.shift();
      drawCourse();
      if(t<1){anim=requestAnimationFrame(frame);return}
      moving=false; resolveShot();
    }
    anim=requestAnimationFrame(frame);
  }

  function resolveShot(){
    const h=currentHole();
    const obstacle=hitObstacle(ball.x,ball.y);
    if(dist(ball,{x:h.cup[0],y:h.cup[1]})<20){
      total+=strokes; updateUI();
      const rel=strokes-h.par;
      const label=rel<=-2?"Eagle":rel===-1?"Birdie":rel===0?"Par":rel===1?"Bogey":`${rel} over par`;
      if(holeIndex===HOLES.length-1){
        gameOver=true;
        showState("Round complete",`9 Holes Finished`,`You shot ${total} strokes — ${total-27>=0?total-27:Math.abs(total-27)} ${total-27>=0?"over":"under"} the 27-par round.`,`Play Again`);
      }else{
        showState("Hole complete",label,`Hole ${holeIndex+1}: ${strokes} stroke${strokes===1?"":"s"}. Total round score: ${total}.`,`Next Hole`);
      }
      return;
    }
    if(obstacle){
      const penalty=obstacle.type==="sand"?0:0;
      if(obstacle.type==="sand"){
        angleSlider.value=Number(angleSlider.value)+((Math.random()-.5)*12);
      } else {
        const h2=currentHole();
        ball.x=Math.max(20,ball.x-Math.cos(Number(angleSlider.value)*Math.PI/180)*22);
        ball.y=Math.max(20,ball.y-Math.sin(Number(angleSlider.value)*Math.PI/180)*22);
      }
      if(penalty)strokes+=penalty;
      updateUI();
    }
    messageTimer=performance.now()+1000;
  }

  function nextHole(){
    if(gameOver){restart();return}
    if(holeIndex<HOLES.length-1){
      holeIndex++;strokes=0;resetBall();hideState();updateUI();drawCourse();
    }
  }
  function restart(){
    if(anim)cancelAnimationFrame(anim);
    holeIndex=0;strokes=0;total=0;gameOver=false;moving=false;
    angleSlider.value=0;powerSlider.value=50;resetBall();hideState();updateUI();drawCourse();
  }

  angleSlider.addEventListener("input",()=>{updateUI();drawCourse()});
  powerSlider.addEventListener("input",()=>{updateUI();drawCourse()});
  shotButton.addEventListener("click",shot);
  restartButton.addEventListener("click",restart);
  stateButton.addEventListener("click",nextHole);

  window.addEventListener("keydown",e=>{
    if(e.target.matches("input,button"))return;
    if(e.key==="ArrowLeft"){e.preventDefault();angleSlider.value=Math.max(-180,Number(angleSlider.value)-5);updateUI();drawCourse()}
    if(e.key==="ArrowRight"){e.preventDefault();angleSlider.value=Math.min(180,Number(angleSlider.value)+5);updateUI();drawCourse()}
    if(e.key==="ArrowUp"){e.preventDefault();powerSlider.value=Math.min(100,Number(powerSlider.value)+5);updateUI();drawCourse()}
    if(e.key==="ArrowDown"){e.preventDefault();powerSlider.value=Math.max(10,Number(powerSlider.value)-5);updateUI();drawCourse()}
    if(e.code==="Space"){e.preventDefault();shot()}
  });

  resetBall();updateUI();drawCourse();
})();


}
function begin(){poster.hidden=true;gm.hidden=false;if(!booted){booted=true;var s=document.createElement("style");s.textContent=LOOK;document.head.appendChild(s);boot();}else{var r=document.getElementById("restartButton");if(r)r.click();}}
poster.addEventListener("click",begin);
var nb=document.getElementById("new");if(nb)nb.addEventListener("click",begin);
})();
