(function(){
var q=document.getElementById('q');
if(q){var cards=[].slice.call(document.querySelectorAll('#games li')),none=document.getElementById('none');
q.addEventListener('input',function(){var v=q.value.trim().toLowerCase(),n=0;
cards.forEach(function(li){var ok=li.getAttribute('data-n').indexOf(v)>-1;li.style.display=ok?'':'none';if(ok)n++});
none.style.display=n?'none':'block'})}
var f=document.getElementById('gf');
if(f){
  var box=f.parentElement, spin=box.querySelector('.fspin'), sizeSet=false;
  function measure(){
    try{
      var doc=f.contentDocument, de=doc.documentElement;
      var natH=de.scrollHeight, natW=de.scrollWidth;
      if(!natH||!natW) return false;
      // Shape the box itself to the game's own aspect ratio (instead of forcing every
      // game into one fixed box), so the frame hugs the content with no dead space.
      var bw=box.clientWidth, boxH;
      if(document.fullscreenElement){
        boxH=box.clientHeight; // CSS forces this to 100vh; just fit-within, no reshaping
      } else {
        var fitH=natW ? natH*(bw/natW) : natH;
        var maxH=Math.min(window.innerHeight*0.75,700), minH=320;
        boxH=Math.min(maxH,Math.max(minH,fitH));
        box.style.height=boxH+'px';
      }
      var scale=Math.min(boxH/natH, bw/natW);
      f.style.width=natW+'px'; f.style.height=natH+'px';
      f.style.transform = scale<0.999 ? 'scale('+scale.toFixed(4)+')' : 'none';
      return true;
    }catch(e){return false}
  }
  function fit(){ if(measure() && !sizeSet){sizeSet=true; f.classList.add('ready'); if(spin) spin.style.display='none'} }
  f.addEventListener('load',function(){
    fit();
    try{ new ResizeObserver(fit).observe(f.contentDocument.documentElement) }catch(e){}
    var tries=0, iv=setInterval(function(){ fit(); if(++tries>20) clearInterval(iv) },300);
  });
  window.addEventListener('resize',fit);
  document.addEventListener('fullscreenchange',function(){ setTimeout(fit,50) });
  var abar=document.querySelector('.abar');
  if(abar){
    var fs=abar.querySelector('[data-fs]');
    if(fs) fs.addEventListener('click',function(){
      if(document.fullscreenElement){document.exitFullscreen()}
      else if(box.requestFullscreen){box.requestFullscreen()}
    });
    var key='gamevote:'+location.pathname;
    var likeBtn=abar.querySelector('[data-like]'), dislikeBtn=abar.querySelector('[data-dislike]'), saveBtn=abar.querySelector('[data-save]'), cnt=abar.querySelector('[data-likecnt]');
    var base=300+Math.abs(location.pathname.split('').reduce(function(a,c){return a+c.charCodeAt(0)},0))%900;
    function paint(){
      var v=localStorage.getItem(key)||'';
      likeBtn.classList.toggle('on', v==='up');
      dislikeBtn.classList.toggle('on', v==='down');
      saveBtn.classList.toggle('on', localStorage.getItem('saved:'+location.pathname)==='1');
      if(cnt) cnt.textContent = base + (v==='up'?1:0);
    }
    likeBtn.addEventListener('click',function(){ localStorage.setItem(key, localStorage.getItem(key)==='up'?'':'up'); paint(); });
    dislikeBtn.addEventListener('click',function(){ localStorage.setItem(key, localStorage.getItem(key)==='down'?'':'down'); paint(); });
    saveBtn.addEventListener('click',function(){ var k='saved:'+location.pathname; localStorage.setItem(k, localStorage.getItem(k)==='1'?'':'1'); paint(); });
    try{ paint(); }catch(e){}
  }
}
})();
