/* Platform Action - game logic + its own look. Layout lives in style.css; page shell lives in the HTML. */
(function(){"use strict";
var gm=document.getElementById("gm"),poster=document.getElementById("poster"),booted=false;
var LOOK=".gm *{box-sizing:border-box}.gm .back-link{color:#5b5ce2;text-decoration:none;font-weight:700}.gm .game-card{background:#fff;border:1px solid #e5e7ef;border-radius:20px;box-shadow:0 12px 34px rgba(23,27,45,.07);overflow:hidden}.gm .hud{display:flex;gap:18px;align-items:center;padding:16px 20px;border-bottom:1px solid #e5e7ef}.gm .stat{min-width:82px}.gm .stat span{display:block;color:#667085;font-size:13px;font-weight:700;line-height:1.2}.gm .stat strong{font-size:22px;line-height:1.2}.gm .hud button,.gm #startBtn,.gm .primary-link{border:0;border-radius:11px;background:#5b5ce2;color:#fff;font:800 16px \"Nunito Sans\";padding:11px 17px;cursor:pointer;text-decoration:none;transition:.2s}.gm .hud button{margin-left:auto}.gm .hud button:hover,.gm #startBtn:hover,.gm .primary-link:hover{background:#4546b8;transform:translateY(-1px)}.gm .canvas-wrap{position:relative;background:#111827;aspect-ratio:16/9}.gm .canvas-wrap canvas{display:block;width:100%;height:100%;max-height:650px;touch-action:none}.gm .overlay{position:absolute;inset:0;display:grid;place-items:center;padding:20px;background:rgba(10,16,29,.44)}.gm .overlay.hidden{display:none}.gm .overlay-card{width:min(400px,100%);padding:32px;border-radius:20px;background:#fff;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,.25)}.gm .overlay-card h2{font-size:34px;line-height:1.1;margin:0 0 10px}.gm .overlay-card p:not(.eyebrow){color:#667085;margin:0 0 22px}.gm .touch-controls{display:none;justify-content:space-between;align-items:center;padding:14px 20px;border-top:1px solid #e5e7ef;background:#fafbff}.gm .control-group{display:flex;gap:10px}.gm .control{width:56px;height:48px;border:1px solid #dfe2ee;border-radius:12px;background:#fff;color:#171b2d;font:900 24px \"Nunito Sans\";box-shadow:0 2px 5px rgba(23,27,45,.08);touch-action:none}.gm .control.jump{width:84px;font-size:15px;color:#fff;background:#ff9f43;border-color:#ff9f43}.gm .control:active{transform:translateY(2px)}.gm .status{text-align:center;margin:0;padding:10px 18px 14px;color:#667085;font-size:15px;font-weight:700}.gm .primary-link{display:inline-block;margin-top:5px}.gm button:focus-visible,.gm summary:focus-visible{outline:3px solid rgba(22,184,196,.45);outline-offset:3px}@media(max-width:700px){.gm .back-link{font-size:14px}.gm .game-card{border-radius:16px}.gm .hud{gap:9px;padding:12px}.gm .stat{min-width:0;flex:1}.gm .stat strong{font-size:18px}.gm .hud button{font-size:14px;padding:9px 10px}.gm .touch-controls{display:flex}.gm .canvas-wrap{border-radius:0}.gm .overlay-card{padding:25px 20px}.gm .overlay-card h2{font-size:30px}}@media(min-width:701px){.gm .touch-controls{display:none}}";
function __ready(f){f()}
function boot(){
(() => {
const canvas=document.getElementById("gameCanvas"),ctx=canvas.getContext("2d");
const scoreEl=document.getElementById("score"),coinsEl=document.getElementById("coins"),livesEl=document.getElementById("lives"),statusEl=document.getElementById("status"),overlay=document.getElementById("overlay"),overlayText=document.getElementById("overlayText"),startBtn=document.getElementById("startBtn"),restartBtn=document.getElementById("restartBtn");
const W=960,H=540,keys={left:false,right:false,jump:false}; let state="ready",score=0,lives=3,coins=[],enemies=[],particles=[],last=0,acc=0;
const gravity=1850,moveSpeed=330,jumpSpeed=690;
const platforms=[
{x:0,y:485,w:235,h:55},{x:285,y:420,w:145,h:22},{x:490,y:350,w:125,h:22},{x:670,y:420,w:115,h:22},{x:820,y:345,w:140,h:22},
{x:760,y:245,w:110,h:22},{x:565,y:245,w:120,h:22},{x:370,y:280,w:115,h:22},{x:220,y:210,w:105,h:22},{x:0,y:330,w:130,h:22}
];
const player={x:55,y:400,w:34,h:44,vx:0,vy:0,onGround:false,facing:1,inv:0};
const spawn={x:55,y:400}; const goal={x:875,y:278,w:55,h:67};
const coinSeeds=[[95,440],[160,440],[325,380],[385,380],[535,310],[590,310],[705,380],[855,305],[910,305],[800,205],[605,205],[410,240],[265,170],[65,290]];
const enemySeeds=[{x:335,y:388,min:290,max:396},{x:530,y:318,min:500,max:595},{x:690,y:388,min:680,max:760},{x:790,y:213,min:770,max:840},{x:235,y:178,min:230,max:295}];
function resetLevel(){score=0;lives=3;resetEntities();updateHUD();state="ready";overlay.classList.remove("hidden");overlayText.textContent="Collect coins, avoid danger, and reach the portal.";startBtn.textContent="Start Game";statusEl.textContent="Press Start to begin."}
function resetEntities(){Object.assign(player,{x:spawn.x,y:spawn.y,vx:0,vy:0,onGround:false,facing:1,inv:0});coins=coinSeeds.map(([x,y])=>({x,y,r:10,taken:false,bob:Math.random()*6.28}));enemies=enemySeeds.map(e=>({...e,y:e.y,w:34,h:32,dir:Math.random()>.5?1:-1,speed:80}));particles=[]}
function updateHUD(){scoreEl.textContent=score;coinsEl.textContent=`${coins.filter(c=>c.taken).length} / ${coins.length}`;livesEl.textContent="♥".repeat(lives)+"♡".repeat(3-lives)}
function rectHit(a,b){return a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y}
function kill(){if(player.inv>0||state!=="playing")return;lives--;updateHUD();if(lives<=0){end(false);return}statusEl.textContent="Ouch! Back to the start.";Object.assign(player,{x:spawn.x,y:spawn.y,vx:0,vy:0,inv:1.2});}
function end(win){state=win?"won":"lost";overlay.classList.remove("hidden");overlayText.textContent=win?`Level complete! Score: ${score}. You collected ${coins.filter(c=>c.taken).length} coins.`:`Game over! Final score: ${score}. Try the level again.`;startBtn.textContent=win?"Play Again":"Try Again";statusEl.textContent=win?"You reached the portal!":"No lives left.";particles=[]}
function start(){if(state==="won"||state==="lost")resetEntities(),score=0,lives=3,updateHUD();state="playing";overlay.classList.add("hidden");statusEl.textContent="Reach the portal on the right."}
function input(e,down){let k=e.key?.toLowerCase();if(["arrowleft","a"].includes(k))keys.left=down;if(["arrowright","d"].includes(k))keys.right=down;if(["arrowup","w"," "].includes(k)){keys.jump=down;if(down)e.preventDefault()}}
addEventListener("keydown",e=>input(e,true));addEventListener("keyup",e=>input(e,false));
document.querySelectorAll("[data-key]").forEach(b=>{let k=b.dataset.key;const set=v=>{keys[k]=v};["pointerdown"].forEach(ev=>b.addEventListener(ev,e=>{e.preventDefault();set(true)}));["pointerup","pointercancel","pointerleave"].forEach(ev=>b.addEventListener(ev,e=>{e.preventDefault();set(false)}));});
startBtn.addEventListener("click",start);restartBtn.addEventListener("click",resetLevel);
function update(dt){
if(state!=="playing")return;
player.inv=Math.max(0,player.inv-dt);
let target=(keys.left?-1:0)+(keys.right?1:0);player.vx+= (target*moveSpeed-player.vx)*Math.min(1,dt*12);if(target)player.facing=target;
if(keys.jump&&player.onGround){player.vy=-jumpSpeed;player.onGround=false;keys.jump=false}
player.vy+=gravity*dt;let oldY=player.y;player.x+=player.vx*dt;player.x=Math.max(0,Math.min(W-player.w,player.x));
player.y+=player.vy*dt;player.onGround=false;
for(const p of platforms){if(player.x+player.w>p.x&&player.x<p.x+p.w&&player.vy>=0&&oldY+player.h<=p.y+5&&player.y+player.h>=p.y){player.y=p.y-player.h;player.vy=0;player.onGround=true}}
if(player.y>H+70)kill();
for(const c of coins)if(!c.taken){let cx=c.x,cy=c.y+Math.sin(performance.now()/250+c.bob)*4;if(player.x<cx+c.r&&player.x+player.w>cx-c.r&&player.y<cy+c.r&&player.y+player.h>cy-c.r){c.taken=true;score+=10;burst(cx,cy,"#FFD34E");updateHUD()}}
for(const e of enemies){e.x+=e.dir*e.speed*dt;if(e.x<e.min||e.x>e.max)e.dir*=-1;if(rectHit(player,e)){let stomp=player.vy>0&&oldY+player.h<=e.y+10;if(stomp){e.dead=true;player.vy=-420;score+=25;burst(e.x+17,e.y+15,"#EF5B5B");updateHUD()}else kill()}}enemies=enemies.filter(e=>!e.dead);
if(rectHit(player,goal)){score+=100;updateHUD();end(true)}
particles.forEach(p=>{p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=500*dt;p.life-=dt});particles=particles.filter(p=>p.life>0);
}
function burst(x,y,color){for(let i=0;i<10;i++)particles.push({x,y,vx:(Math.random()-.5)*220,vy:-Math.random()*220,life:.5+Math.random()*.3,color})}
function roundRect(x,y,w,h,r,fill){ctx.fillStyle=fill;ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fill()}
function draw(){
ctx.clearRect(0,0,W,H);
let sky=ctx.createLinearGradient(0,0,0,H);sky.addColorStop(0,"#18264a");sky.addColorStop(1,"#2b5a75");ctx.fillStyle=sky;ctx.fillRect(0,0,W,H);
ctx.fillStyle="rgba(255,255,255,.08)";for(let i=0;i<30;i++)ctx.fillRect((i*173)%W,(i*71)%260,2,2);
ctx.fillStyle="#17394a";ctx.beginPath();ctx.moveTo(0,380);for(let x=0;x<=W;x+=80)ctx.lineTo(x,300+(Math.sin(x*.03)*35));ctx.lineTo(W,H);ctx.lineTo(0,H);ctx.fill();
for(const p of platforms){roundRect(p.x,p.y,p.w,p.h,7,"#293845");ctx.fillStyle="#43B883";ctx.fillRect(p.x,p.y,p.w,6);ctx.fillStyle="rgba(255,255,255,.08)";ctx.fillRect(p.x+8,p.y+11,p.w-16,3)}
for(const c of coins)if(!c.taken){let y=c.y+Math.sin(performance.now()/250+c.bob)*4;ctx.fillStyle="#FFD34E";ctx.beginPath();ctx.arc(c.x,y,c.r,0,Math.PI*2);ctx.fill();ctx.fillStyle="#fff0a6";ctx.beginPath();ctx.arc(c.x-3,y-3,3,0,Math.PI*2);ctx.fill()}
for(const e of enemies){roundRect(e.x,e.y,e.w,e.h,9,"#EF5B5B");ctx.fillStyle="#fff";ctx.fillRect(e.x+8,e.y+9,5,6);ctx.fillRect(e.x+21,e.y+9,5,6);ctx.fillStyle="#171b2d";ctx.fillRect(e.x+10,e.y+11,2,3);ctx.fillRect(e.x+22,e.y+11,2,3)}
ctx.save();ctx.shadowColor="#16B8C4";ctx.shadowBlur=22;roundRect(goal.x,goal.y,goal.w,goal.h,15,"#16B8C4");ctx.restore();roundRect(goal.x+10,goal.y+10,goal.w-20,goal.h-20,11,"#17263c");ctx.fillStyle="#9af2f5";ctx.beginPath();ctx.arc(goal.x+goal.w/2,goal.y+goal.h/2,11,0,Math.PI*2);ctx.fill();
if(!(player.inv>0&&Math.floor(player.inv*10)%2===0)){roundRect(player.x,player.y,player.w,player.h,9,"#FFB84D");ctx.fillStyle="#171b2d";ctx.fillRect(player.x+(player.facing>0?23:9),player.y+12,4,5);ctx.fillStyle="#fff2c9";ctx.fillRect(player.x+7,player.y+27,20,4)}
for(const p of particles){ctx.globalAlpha=Math.max(0,p.life*1.5);ctx.fillStyle=p.color;ctx.fillRect(p.x,p.y,5,5)}ctx.globalAlpha=1;
}
function loop(t){let dt=Math.min(.033,(t-last)/1000||0);last=t;acc+=dt;while(acc>=1/120){update(1/120);acc-=1/120}draw();requestAnimationFrame(loop)}
resetLevel();requestAnimationFrame(loop);
})();

}
function begin(){poster.hidden=true;gm.hidden=false;if(!booted){booted=true;var s=document.createElement("style");s.textContent=LOOK;document.head.appendChild(s);boot();}else{var r=document.getElementById("restartBtn");if(r)r.click();}}
poster.addEventListener("click",begin);
var nb=document.getElementById("new");if(nb)nb.addEventListener("click",begin);
})();
