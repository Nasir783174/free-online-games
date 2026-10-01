(function(){
  // Home / category search
  var q=document.getElementById('q');
  if(q){
    var cards=[].slice.call(document.querySelectorAll('#games li')), none=document.getElementById('none');
    q.addEventListener('input',function(){
      var v=q.value.trim().toLowerCase(), n=0;
      cards.forEach(function(li){ var ok=li.getAttribute('data-n').indexOf(v)>-1; li.style.display=ok?'':'none'; if(ok) n++; });
      if(none) none.style.display=n?'none':'block';
    });
  }

  // Game frame: simple, reliable load — just show the iframe once it loads, no scaling tricks
  var f=document.getElementById('gf');
  if(f){
    var box=f.closest('.frame'), spin=box ? box.querySelector('.fspin') : null;
    function ready(){ f.classList.add('ready'); if(spin) spin.style.display='none'; }
    f.addEventListener('load', ready);
    setTimeout(ready, 4000); // safety net: never leave the loading spinner stuck
    var fs=box ? box.querySelector('.fsbtn') : null;
    if(fs) fs.addEventListener('click',function(){
      if(document.fullscreenElement){ document.exitFullscreen(); }
      else if(box.requestFullscreen){ box.requestFullscreen(); }
    });
  }
})();
