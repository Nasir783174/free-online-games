(function(){
var q=document.getElementById('q');
if(q){var cards=[].slice.call(document.querySelectorAll('#games li')),none=document.getElementById('none');
q.addEventListener('input',function(){var v=q.value.trim().toLowerCase(),n=0;
cards.forEach(function(li){var ok=li.getAttribute('data-n').indexOf(v)>-1;li.style.display=ok?'':'none';if(ok)n++});
none.style.display=n?'none':'block'})}
var f=document.getElementById('gf');
if(f){var fit=function(){try{var d=f.contentDocument;if(d&&d.body){f.style.height=Math.max(520,d.documentElement.scrollHeight)+'px'}}catch(e){}};
f.addEventListener('load',function(){fit();try{new ResizeObserver(fit).observe(f.contentDocument.body)}catch(e){setInterval(fit,700)}});}
})();
