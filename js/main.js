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
      var w=de.scrollWidth, h=de.scrollHeight;
      if(!w||!h){return false}
      f.style.width=w+'px'; f.style.height=h+'px';
      var bw=box.clientWidth, bh=box.clientHeight;
      var scale=Math.min(bw/w, bh/h);
      scale=Math.min(scale,1.4); // don't blow up a tiny game too much
      f.style.transform='translate(-50%,-50%) scale('+scale+')';
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
