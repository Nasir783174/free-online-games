/* Loaded only inside the /play/ iframe pages.
   Goal: the whole game (board / canvas + its buttons) is visible with NO scrolling inside the frame.

   How it works
   1. Finds the "stage" = the main play area (largest canvas / board / grid).
   2. Measures how much taller the page is than the frame.
   3. First compacts the surrounding UI (scores, buttons, hints) a little,
      then shrinks the stage (keeping its aspect ratio) so everything fits.
   Runs on load and on resize. Nothing is touched when the game already fits. */
(function () {
  'use strict';
  var MIN_ZOOM = 0.4;                  // never shrink the play area below this ratio
  var CHROME_LEVELS = [1, 0.9, 0.8, 0.7, 0.6];   // how much the surrounding UI may be compacted
  var GOOD_ENOUGH = 0.85;              // stop compacting once the stage keeps at least this size
  var doc = document.documentElement;
  var stage = null, chrome = [], savedStyle = null, timer = null, relaxed = [];

  function box(el) { return el.getBoundingClientRect(); }
  function over() { return doc.scrollHeight - window.innerHeight; }
  function shown(el) {
    var cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden') return false;
    var r = box(el);
    return r.width > 40 && r.height > 40;
  }

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
    while (el.parentElement && el.parentElement !== document.body) {   // climb to the tight wrapper (frame/padding only)
      var p = el.parentElement, rp = box(p), re = box(el);
      if (/^(MAIN|SECTION|ARTICLE|ASIDE)$/.test(p.tagName)) break;
      if (rp.width <= re.width + 60 && rp.height <= re.height + 60) el = p; else break;
    }
    return el;
  }

  // everything that sits next to the stage (or next to one of its ancestors) = surrounding UI
  function collectChrome(st) {
    var out = [];
    for (var el = st; el && el.parentElement && el !== document.body; el = el.parentElement) {
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

  // Many games hard-code min-height:680px style values on their layout / panels. Those are what keeps the page tall,
  // so lift them (except on the stage itself and anything inside it).
  function relaxMinHeights(st) {
    [].forEach.call(document.body.querySelectorAll('*'), function (el) {
      if (st && (el === st || st.contains(el))) return;
      if (/^(SCRIPT|STYLE|CANVAS|SVG)$/i.test(el.tagName)) return;
      var cs = getComputedStyle(el);
      if (cs.minHeight.indexOf('px') < 0 || parseFloat(cs.minHeight) < 150) return;
      if (cs.position === 'fixed') return;
      relaxed.push([el, el.getAttribute('style')]);
      el.style.minHeight = '0';
    });
  }

  // Big top/bottom padding & margins on the wrappers around the game are wasted space inside a small frame.
  function compactAncestors(st) {
    if (!st) return;
    for (var el = st.parentElement; el; el = el.parentElement) {
      var cs = getComputedStyle(el), changes = {};
      ['paddingTop', 'paddingBottom', 'marginTop', 'marginBottom'].forEach(function (k) {
        var v = parseFloat(cs[k]);
        if (v > 10) changes[k] = '10px';
      });
      if (Object.keys(changes).length) {
        relaxed.push([el, el.getAttribute('style')]);
        for (var k in changes) el.style[k] = changes[k];
      }
      if (el === document.documentElement) break;
    }
  }

  function reset() {
    for (var i = relaxed.length - 1; i >= 0; i--) {       // newest first, so the oldest (original) style wins
      var el = relaxed[i][0], st = relaxed[i][1];
      if (st === null) el.removeAttribute('style'); else el.setAttribute('style', st);
    }
    relaxed = [];
    chrome.forEach(function (s) { s.style.zoom = ''; });
    if (stage) {
      if (savedStyle === null) stage.removeAttribute('style'); else stage.setAttribute('style', savedStyle);
    }
    stage = null; chrome = []; savedStyle = null;
  }

  function setStage(z, w0) {
    stage.style.boxSizing = 'border-box';
    stage.style.maxWidth = 'none';
    stage.style.flex = 'none';
    stage.style.marginLeft = 'auto';
    stage.style.marginRight = 'auto';
    stage.style.width = w0 + 'px';          // width in zoomed space -> visual width = w0 * z
    stage.style.zoom = z === 1 ? '' : String(z);
  }

  function solveStage(w0) {
    var z = 1; setStage(1, w0);
    for (var i = 0; i < 6; i++) {
      var o = over(); if (o <= 1) break;
      var h = box(stage).height;
      var next = Math.max(MIN_ZOOM, Math.min(1, z * Math.max(0.2, (h - o - 2) / h)));
      if (Math.abs(next - z) < 0.004) break;
      z = next; setStage(z, w0);
    }
    return z;
  }

  // Safety net: no clear "board" (menu / quiz / shop style games) or still too tall -> scale the whole game a little
  var wholeEl = null, wholeSaved = null;
  function resetWhole() {
    if (!wholeEl) return;
    if (wholeSaved === null) wholeEl.removeAttribute('style'); else wholeEl.setAttribute('style', wholeSaved);
    wholeEl = null; wholeSaved = null;
  }
  function fitWhole() {
    wholeEl = document.querySelector('main') || document.body;
    wholeSaved = wholeEl.getAttribute('style');
    var z = 1;
    for (var i = 0; i < 8; i++) {
      var o = over(); if (o <= 1) break;
      var h = box(wholeEl).height;
      var next = Math.max(0.5, Math.min(1, z * Math.max(0.3, (h - o - 2) / h)));
      if (Math.abs(next - z) < 0.004) break;
      z = next; wholeEl.style.zoom = String(z);
    }
  }

  function fit() {
    reset(); resetWhole();
    if (over() <= 1) return;
    stage = findStage();
    relaxMinHeights(stage);
    compactAncestors(stage);
    if (over() <= 1) return;
    if (!stage) { fitWhole(); return; }
    savedStyle = stage.getAttribute('style');
    var w0 = Math.round(box(stage).width);
    chrome = collectChrome(stage);
    for (var i = 0; i < CHROME_LEVELS.length; i++) {
      var c = CHROME_LEVELS[i];
      chrome.forEach(function (s) { s.style.zoom = c === 1 ? '' : String(c); });
      var z = solveStage(w0);
      if (over() <= 1 && z >= GOOD_ENOUGH) break;
    }
    if (over() > 1) fitWhole();
  }

  function schedule() { clearTimeout(timer); timer = setTimeout(fit, 80); }

  if (!('zoom' in document.body.style)) return;        // very old browsers: leave the game exactly as it was
  window.addEventListener('resize', schedule);
  window.addEventListener('orientationchange', schedule);
  window.addEventListener('load', function () { fit(); setTimeout(fit, 300); setTimeout(fit, 1200); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(schedule);
  if (document.readyState !== 'loading') fit(); else document.addEventListener('DOMContentLoaded', fit);
})();
