(function(){
// Runs inside each embedded game page, after the game finishes rendering itself.
// Finds the real interactive surface (canvas / svg / a grid of many same-type
// children such as board cells, tiles or on-screen keyboard keys) and hides every
// sibling that is not part of it, so only the playable game remains visible.
// If nothing can be confidently identified, it leaves that section untouched
// rather than risk hiding the actual game.
function isolateGameSurface(){
  try{
    var main=document.querySelector('main'); if(!main) return;
    function firstToken(el){ var c=el.className; if(typeof c!=='string'||!c) return el.tagName; return c.trim().split(/\s+/)[0]||el.tagName; }
    function isChrome(el){ return /dialog/i.test(el.tagName)||/modal|overlay|message|dialog/i.test(el.className||''); }
    function findCores(root){
      var cores=[];
      Array.prototype.forEach.call(root.querySelectorAll('canvas,svg'),function(el){cores.push(el)});
      var all=root.querySelectorAll('*');
      for(var i=0;i<all.length;i++){
        var el=all[i], kids=el.children;
        if(kids.length<6) continue;
        var counts={};
        for(var j=0;j<kids.length;j++){ var k=firstToken(kids[j]); counts[k]=(counts[k]||0)+1; }
        var top=0; for(var key in counts){ if(counts[key]>top) top=counts[key]; }
        if(top>=6 && top/kids.length>=0.7) cores.push(el);
      }
      return cores;
    }
    var containers=Array.prototype.filter.call(main.children,function(c){return getComputedStyle(c).display!=='none'});
    containers.forEach(function(container){
      var cores=findCores(container);
      if(!cores.length) return;
      var keep=[];
      cores.forEach(function(core){
        var n=core;
        while(n && n!==container.parentElement){ keep.push(n); if(n===container) break; n=n.parentElement; }
      });
      Array.prototype.forEach.call(container.querySelectorAll('*'),function(el){
        if(keep.indexOf(el)!==-1 || isChrome(el)) return;
        for(var i=0;i<keep.length;i++){ if(el.contains(keep[i])) return; }
        el.style.display='none';
      });
    });
  }catch(e){}
}
if(document.readyState==='complete') setTimeout(isolateGameSurface,350);
else window.addEventListener('load',function(){setTimeout(isolateGameSurface,350)});
})();
