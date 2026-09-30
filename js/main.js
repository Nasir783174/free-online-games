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
      f.style.transform='none'; f.style.height=natH+'px'; // reset before re-measuring on resize
      var bw=box.clientWidth, bh=box.clientHeight;
      var scale=Math.min(1, bh/natH, bw/natW);
      if(scale<0.999) f.style.transform='scale('+scale.toFixed(4)+')';
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
  var fs=box.querySelector('.fsbtn');
  if(fs) fs.addEventListener('click',function(){
    if(document.fullscreenElement){document.exitFullscreen()}
    else if(box.requestFullscreen){box.requestFullscreen()}
  });
}
})();
