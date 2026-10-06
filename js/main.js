/* GamesHub — site script (no dependencies) */
(function () {
  'use strict';
  var d = document, root = d.documentElement;
  function $(s, c) { return (c || d).querySelector(s); }
  function $$(s, c) { return [].slice.call((c || d).querySelectorAll(s)); }
  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) {} return null; }

  /* ---- theme ---- */
  var tt = $('#themeBtn');
  if (tt) tt.addEventListener('click', function () {
    var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next); store('gh-theme', next);
  });

  /* ---- mobile menu ---- */
  var hd = $('.hd'), bg = $('#burger');
  if (bg) bg.addEventListener('click', function () {
    var o = hd.classList.toggle('open'); bg.setAttribute('aria-expanded', o ? 'true' : 'false');
  });

  /* ---- close dropdowns on outside click / Esc ---- */
  d.addEventListener('click', function (e) {
    $$('.dd[open]').forEach(function (x) { if (!x.contains(e.target)) x.removeAttribute('open'); });
    var m = $('.fmenu.on'); if (m && !m.parentNode.contains(e.target)) m.classList.remove('on');
    var r = $('.hs-res.on'); if (r && !r.parentNode.contains(e.target)) r.classList.remove('on');
  });
  d.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { $$('.dd[open]').forEach(function (x) { x.removeAttribute('open'); }); $$('.fmenu.on,.hs-res.on').forEach(function (x) { x.classList.remove('on'); }); }
  });

  var G = window.GH || [];   // [slug, name, catSlug, emoji, hue, catName, pattern]
  function url(g) { return '/' + g[2] + '/' + g[0] + '/'; }

  /* ---- random game ---- */
  var rnd = $('#randBtn');
  if (rnd && G.length) rnd.addEventListener('click', function (e) { e.preventDefault(); location.href = url(G[Math.floor(Math.random() * G.length)]); });

  /* ---- header search with suggestions ---- */
  var hi = $('#hs'), hr = $('#hs-res'), sel = -1;
  function esc(s) { return s.replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function render(q) {
    q = q.trim().toLowerCase(); sel = -1;
    if (!q) { hr.classList.remove('on'); return; }
    var hits = G.filter(function (g) { return g[1].toLowerCase().indexOf(q) > -1 || g[5].toLowerCase().indexOf(q) > -1; })
      .sort(function (a, b) { return (a[1].toLowerCase().indexOf(q) === 0 ? 0 : 1) - (b[1].toLowerCase().indexOf(q) === 0 ? 0 : 1); }).slice(0, 7);
    hr.innerHTML = hits.length ? hits.map(function (g) {
      return '<li><a href="' + url(g) + '"><span class="th ' + g[6] + '" style="--h:' + g[4] + '"><i>' + g[3] + '</i></span><span>' + esc(g[1]) + '<small>' + esc(g[5]) + '</small></span></a></li>';
    }).join('') : '<li><p>No games found for “' + esc(q) + '”.</p></li>';
    hr.classList.add('on');
  }
  if (hi && hr) {
    hi.addEventListener('input', function () { render(hi.value); });
    hi.addEventListener('focus', function () { if (hi.value) render(hi.value); });
    hi.addEventListener('keydown', function (e) {
      var items = $$('a', hr);
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        if (!items.length) return; e.preventDefault();
        sel = (sel + (e.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length;
        items.forEach(function (a, i) { a.classList.toggle('sel', i === sel); });
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (items[sel > -1 ? sel : 0]) location.href = items[sel > -1 ? sel : 0].getAttribute('href');
        else if (hi.value.trim()) location.href = '/games/?q=' + encodeURIComponent(hi.value.trim());
      }
    });
  }

  /* ---- list filter (games + category pages) ---- */
  var q = $('#q'), cards = $$('[data-n]'), none = $('.none');
  var cat = 'all';
  function filter() {
    var t = q ? q.value.trim().toLowerCase() : '', n = 0;
    cards.forEach(function (c) {
      var ok = (!t || c.getAttribute('data-n').indexOf(t) > -1) && (cat === 'all' || c.getAttribute('data-c') === cat);
      c.hidden = !ok; if (ok) n++;
    });
    if (none) none.style.display = n ? 'none' : 'block';
  }
  if (q) {
    q.addEventListener('input', filter);
    var m = /[?&]q=([^&]*)/.exec(location.search); if (m) { q.value = decodeURIComponent(m[1].replace(/\+/g, ' ')); filter(); }
  }
  $$('[data-filter]').forEach(function (b) {
    b.addEventListener('click', function () {
      cat = b.getAttribute('data-filter');
      $$('[data-filter]').forEach(function (x) { x.classList.toggle('on', x === b); });
      filter();
    });
  });

  /* ---- carousel arrows ---- */
  $$('[data-scroll]').forEach(function (b) {
    b.addEventListener('click', function () {
      var tr = $('#' + b.getAttribute('data-target')); if (!tr) return;
      tr.scrollBy({ left: tr.clientWidth * 0.85 * +b.getAttribute('data-scroll'), behavior: 'smooth' });
    });
  });

  /* ---- game frame ---- */
  var box = $('.frame');
  if (box) {
    var f = $('iframe', box), poster = $('.poster', box), loaded = false;
    function sizeFrame() {
      if (d.fullscreenElement) return;
      box.style.removeProperty('--frame-h');
      var top = box.getBoundingClientRect().top + window.pageYOffset;
      var h = Math.round(window.innerHeight - top - 16);
      h = Math.max(440, Math.min(h, 760));
      if (window.innerWidth < 700) h = Math.max(440, Math.min(window.innerHeight - 60, 720));
      box.style.setProperty('--frame-h', h + 'px');
    }
    sizeFrame(); window.addEventListener('resize', sizeFrame); window.addEventListener('load', sizeFrame);
    function load(force) {
      if (loaded && !force) return;
      loaded = true; box.classList.add('loading', 'playing'); f.classList.remove('ready');
      f.onload = function () { box.classList.remove('loading'); f.classList.add('ready'); };
      f.src = f.getAttribute('data-src');
      if (poster) poster.hidden = true;
    }
    if (poster) poster.addEventListener('click', function () { load(); try { f.focus(); } catch (e) {} });
    else load();
    var fs = $('#fsBtn');
    if (fs) fs.addEventListener('click', function () {
      load();
      if (d.fullscreenElement) d.exitFullscreen();
      else if (box.requestFullscreen) box.requestFullscreen().catch(function () {});
      else if (box.webkitRequestFullscreen) box.webkitRequestFullscreen();
    });
    d.addEventListener('fullscreenchange', function () { if (!d.fullscreenElement) sizeFrame(); });
    var sb = $('#setBtn'), sm = $('.fmenu', box);
    if (sb && sm) {
      sb.addEventListener('click', function (e) { e.stopPropagation(); sm.classList.toggle('on'); });
      var rs = $('#restart'); if (rs) rs.addEventListener('click', function () { sm.classList.remove('on'); load(true); });
    }
  }
})();
