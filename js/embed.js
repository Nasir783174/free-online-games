/* Loaded only inside the /play/ iframe pages.
   Goal: the game fills the frame as much as possible — never scrolls, never looks tiny.

   1. Finds the "stage" = the main play area (largest canvas / board / grid).
   2. Lifts hard-coded min-heights / max-widths / big paddings around it.
   3. Picks the biggest zoom for the stage (shrinks OR grows, up to MAX_ZOOM) so that the whole page
      still fits the frame with no scrollbars. If that makes the stage smaller than natural size,
      the surrounding UI (scores, buttons, hints) is compacted a little first.
   4. Centres the content vertically when there is room left.
   Runs on load and on resize. Falls back to leaving the game untouched on old browsers. */
(function () {
  'use strict';
  var MIN_ZOOM = 0.22, MAX_ZOOM = 1.6;
  var CHROME_LEVELS = [1, 0.92, 0.85, 0.78, 0.7, 0.62];
  var GOOD = 0.95;                       // stage must reach this (relative to natural size) before we stop compacting UI
  var doc = document.documentElement, body = document.body;
  var stage = null, chrome = [], savedStyle = null, timer = null, undo = [], whole = null;

  function box(el) { return el.getBoundingClientRect(); }
  function shown(el) {
    var cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden') return false;
    var r = box(el); return r.width > 40 && r.height > 40;
  }
  function remember(el) { undo.push([el, el.getAttribute('style')]); }
  function fits() { return doc.scrollHeight <= window.innerHeight + 1 && doc.scrollWidth <= window.innerWidth + 1; }

  function findStage() {
    var sel = 'canvas,svg,[id*="board" i],[class*="board" i],[id*="grid" i],[class*="grid" i],[id*="stage" i],' +
              '[class*="stage" i],[class*="canvas" i],[class*="arena" i],[class*="field" i],[class*="maze" i],' +
              '[class*="table" i],[class*="playfield" i],[id*="game" i],[class*="game-wrap" i],[class*="game-frame" i]';
    var list = [].slice.call(document.querySelectorAll(sel)).filter(function (el) {
      if (el.closest('header,footer,.modal,[id*="modal" i],[class*="modal" i],[class*="overlay" i],button,label')) return false;
      if (!shown(el)) return false;
      var r = box(el), a = r.width * r.height, ar = r.width / r.height;
      return a > 35000 && ar > 0.3 && ar < 3.4;
    });
    if (!list.length) return null;
    var max = 0;
    list.forEach(function (el) { var r = box(el); max = Math.max(max, r.width * r.height); });
    var big = list.filter(function (el) { var r = box(el); return r.width * r.height >= max * 0.6; });
    big.sort(function (a, b) { var ra = box(a), rb = box(b); return ra.width * ra.height - rb.width * rb.height; });
    var el = big[0];
    while (el.parentElement && el.parentElement !== body) {
      var p = el.parentElement, rp = box(p), re = box(el);
      if (/^(MAIN|SECTION|ARTICLE|ASIDE)$/.test(p.tagName)) break;
      if (rp.width <= re.width + 60 && rp.height <= re.height + 60) el = p; else break;
    }
    return el;
  }

  // surrounding UI = siblings of the stage and of its ancestors
  function collectChrome(st) {
    var out = [];
    for (var el = st; el && el.parentElement && el !== body; el = el.parentElement) {
      [].forEach.call(el.parentElement.children, function (s) {
        if (s === el || /^(SCRIPT|STYLE|LINK|TEMPLATE)$/.test(s.tagName)) return;
        var cs = getComputedStyle(s);
        if (cs.display === 'none' || cs.position === 'fixed' || cs.position === 'absolute') return;
        if (box(s).height < 20) return;
        out.push(s);
      });
    }
    return out;
  }

  // hard-coded min-heights (also on html/body) keep the page tall and make "fits" lie; lift them
  function relaxMinHeights(st) {
    [doc, body].concat([].slice.call(body.querySelectorAll('*'))).forEach(function (el) {
      if (st && (el === st || st.contains(el))) return;
      if (/^(SCRIPT|STYLE|CANVAS|SVG)$/i.test(el.tagName)) return;
      var cs = getComputedStyle(el);
      if (cs.position === 'fixed') return;
      if (cs.minHeight.indexOf('px') < 0 || parseFloat(cs.minHeight) < 150) { if (el !== doc && el !== body) return; if (cs.minHeight === '0px' || cs.minHeight === 'auto') return; }
      remember(el); el.style.minHeight = '0';
    });
  }
  // wrappers around the game: no max-width cap (so a bigger stage can use the width), tighter vertical padding
  function loosenAncestors(st) {
    for (var el = st.parentElement; el; el = el.parentElement) {
      var cs = getComputedStyle(el), ch = {};
      if (cs.maxWidth !== 'none' && el !== doc) ch.maxWidth = 'none';
      ['paddingTop', 'paddingBottom', 'marginTop', 'marginBottom'].forEach(function (k) { if (parseFloat(cs[k]) > 10) ch[k] = '10px'; });
      if (parseFloat(cs.rowGap) > 8) ch.rowGap = '8px';
      if (Object.keys(ch).length) { remember(el); for (var k in ch) el.style[k] = ch[k]; }
      if (el === doc) break;
    }
  }

  function tightenChrome() {
    chrome.forEach(function (c) {
      var cs = getComputedStyle(c), ch = {};
      ['marginTop', 'marginBottom'].forEach(function (k) { if (parseFloat(cs[k]) > 8) ch[k] = '8px'; });
      ['paddingTop', 'paddingBottom'].forEach(function (k) { if (parseFloat(cs[k]) > 12 && !c.querySelector('canvas')) ch[k] = '12px'; });
      if (Object.keys(ch).length) { remember(c); for (var k in ch) c.style[k] = ch[k]; }
    });
  }
  // last resort: hide text-only hints (controls are also described in the page around the frame)
  function hideHints() {
    var n = 0;
    chrome.forEach(function (c) {
      if (c.querySelector('button,input,select,canvas,a,[role=button],[tabindex]')) return;
      var t = (c.textContent || '').trim();
      if (t.length < 12 || box(c).height > 90) return;
      remember(c); c.style.display = 'none'; n++;
    });
    return n;
  }

  function reset() {
    for (var i = undo.length - 1; i >= 0; i--) { var e = undo[i][0], s = undo[i][1]; if (s === null) e.removeAttribute('style'); else e.setAttribute('style', s); }
    undo = [];
    chrome.forEach(function (s) { s.style.zoom = ''; });
    if (stage) { if (savedStyle === null) stage.removeAttribute('style'); else stage.setAttribute('style', savedStyle); }
    if (whole) { whole.style.zoom = ''; whole = null; }
    stage = null; chrome = []; savedStyle = null;
  }

  function setStage(z, w0) {
    stage.style.boxSizing = 'border-box'; stage.style.maxWidth = 'none'; stage.style.flex = 'none';
    stage.style.marginLeft = 'auto'; stage.style.marginRight = 'auto';
    stage.style.width = w0 + 'px';
    stage.style.zoom = z === 1 ? '' : String(z);
  }
  // biggest zoom in [MIN_ZOOM, MAX_ZOOM] for which the page still fits the frame
  function solve(w0) {
    setStage(MAX_ZOOM, w0); if (fits()) return MAX_ZOOM;
    var lo = MIN_ZOOM, hi = MAX_ZOOM, ok = fits;
    setStage(MIN_ZOOM, w0);
    if (!fits()) {                                    // something else (e.g. a tall side panel) sets the height
      var base = doc.scrollHeight;
      ok = function () { return doc.scrollHeight <= base + 1 && doc.scrollWidth <= window.innerWidth + 1; };
    }
    for (var i = 0; i < 11; i++) { var mid = (lo + hi) / 2; setStage(mid, w0); if (ok()) lo = mid; else hi = mid; }
    setStage(lo, w0); return lo;
  }

  // no clear board (menu / quiz / shop games): scale the whole content to fit if it is too tall
  function fitWhole() {
    whole = document.querySelector('main') || body;
    var z = 1;
    for (var i = 0; i < 8 && !fits(); i++) {
      var o = doc.scrollHeight - window.innerHeight, h = box(whole).height;
      var next = Math.max(0.4, Math.min(1, z * Math.max(0.3, (h - o - 2) / h)));
      if (Math.abs(next - z) < 0.004) break;
      z = next; whole.style.zoom = String(z);
    }
  }

  // leftover vertical room -> centre the content instead of leaving a blank strip at the bottom
  function centre() {
    var free = window.innerHeight - doc.scrollHeight;
    var kids = [].slice.call(body.children).filter(function (k) { return !/^(SCRIPT|STYLE|LINK)$/.test(k.tagName) && getComputedStyle(k).position !== 'fixed'; });
    var last = kids.length ? kids[kids.length - 1] : null;
    if (!last) return;
    var used = box(last).bottom + (window.pageYOffset || 0);
    var spare = window.innerHeight - used;
    if (spare > 40 && spare < window.innerHeight * 0.5) { remember(body); body.style.paddingTop = Math.round(spare / 2 - 8) + 'px'; }
  }

  // the page around the frame already shows the game title -> hide a duplicate page-level <h1> inside the game
  function hideTitle() {
    [].forEach.call(document.querySelectorAll('h1'), function (h) {
      if (h.closest('[class*="overlay" i],[class*="modal" i],[role="dialog"],[class*="panel" i],[class*="card" i],[class*="start" i]')) return;
      if (h.querySelector('button,input,a')) return;
      if (box(h).top > 160 || box(h).height < 8) return;
      remember(h); h.style.display = 'none';
    });
  }

  function fit() {
    reset(); hideTitle();
    var st = findStage();
    doc.removeAttribute('data-fit');
    if (st) {
      var w0 = Math.round(box(st).width);
      stage = st; savedStyle = st.getAttribute('style');
      relaxMinHeights(st); loosenAncestors(st);
      chrome = collectChrome(st); tightenChrome();
      var z = 1;
      for (var i = 0; i < CHROME_LEVELS.length; i++) {
        var c = CHROME_LEVELS[i];
        chrome.forEach(function (s) { s.style.zoom = c === 1 ? '' : String(c); });
        z = solve(w0);
        var r = box(stage);   // stop compacting the UI once the stage already uses most of the frame
        if (fits() && (z >= GOOD || r.height >= window.innerHeight * 0.8 || r.width >= window.innerWidth * 0.85)) break;
      }
      var r2 = box(stage);
      if (z < GOOD && r2.height < window.innerHeight * 0.8 && r2.width < window.innerWidth * 0.85 && hideHints()) z = solve(w0);
      doc.setAttribute('data-fit', z.toFixed(2));
      if (!fits()) fitWhole();
      else centre();
    } else {
      relaxMinHeights(null);
      if (!fits()) fitWhole();
    }
  }

  function schedule() { clearTimeout(timer); timer = setTimeout(fit, 80); }
  if (!('zoom' in body.style)) return;
  window.addEventListener('resize', schedule);
  window.addEventListener('orientationchange', schedule);
  window.addEventListener('load', function () { fit(); setTimeout(fit, 300); setTimeout(fit, 1200); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(schedule);
  if (document.readyState !== 'loading') fit(); else document.addEventListener('DOMContentLoaded', fit);
})();
