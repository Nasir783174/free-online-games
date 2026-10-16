/* 2048 - runs directly inside the game page. Look (colours) lives here, layout lives in style.css */
(function () {
  "use strict";
  var SIZE = 4, WIN = 2048, KEY = "games-hub-2048-best";
  var $ = function (id) { return document.getElementById(id); };
  var stage = $("stage"), board = $("board"), cellsEl = $("cells"), tilesEl = $("tiles");
  var scoreEl = $("score"), bestEl = $("best"), statusEl = $("status");
  var over = $("over"), overKick = $("over-kick"), overTitle = $("over-title"), overText = $("over-text");
  var poster = $("poster"), keepBtn = $("keep"), againBtn = $("again"), newBtn = $("new");

  var LOOK = { 2: ["#eee4da", "#655d55"], 4: ["#ede0c8", "#655d55"], 8: ["#f2b179", "#fff"], 16: ["#f59563", "#fff"], 32: ["#f67c5f", "#fff"], 64: ["#f65e3b", "#fff"], 128: ["#edcf72", "#fff"], 256: ["#edcc61", "#fff"], 512: ["#edc850", "#fff"], 1024: ["#edc53f", "#fff"], 2048: ["#edc22e", "#fff"] };
  stage.style.setProperty("--board", "#8f8174");

  var grid = [], score = 0, best = loadBest(), gameOver = false, won = false, keepPlaying = false;
  var started = false, visible = true, tx = 0, ty = 0;

  function loadBest() { try { var n = parseInt(localStorage.getItem(KEY) || "0", 10); return n > 0 ? n : 0; } catch (e) { return 0; } }
  function saveBest() { try { localStorage.setItem(KEY, String(best)); } catch (e) {} }
  function empty() { var g = []; for (var r = 0; r < SIZE; r++) g.push(new Array(SIZE).fill(0)); return g; }
  function emptyCells() { var out = []; for (var r = 0; r < SIZE; r++) for (var c = 0; c < SIZE; c++) if (!grid[r][c]) out.push([r, c]); return out; }
  function addTile() { var e = emptyCells(); if (!e.length) return; var p = e[Math.floor(Math.random() * e.length)]; grid[p[0]][p[1]] = Math.random() < 0.9 ? 2 : 4; }

  function buildCells() {
    var f = document.createDocumentFragment();
    for (var i = 0; i < SIZE * SIZE; i++) { var d = document.createElement("div"); d.className = "cell"; f.appendChild(d); }
    cellsEl.replaceChildren(f);
  }

  function begin() { started = true; poster.hidden = true; start(); }

  function start() {
    grid = empty(); score = 0; gameOver = false; won = false; keepPlaying = false;
    addTile(); addTile(); over.hidden = true;
    statusEl.textContent = "Use arrow keys, swipe, or tap the controls.";
    render(false); board.focus({ preventScroll: true });
  }

  function slide(line) {
    var c = line.filter(Boolean), out = [], pts = 0;
    for (var i = 0; i < c.length; i++) {
      if (c[i] === c[i + 1]) { out.push(c[i] * 2); pts += c[i] * 2; i++; } else out.push(c[i]);
    }
    while (out.length < SIZE) out.push(0);
    return { line: out, pts: pts };
  }
  function getLine(i, dir) {
    if (dir === "left") return grid[i].slice();
    if (dir === "right") return grid[i].slice().reverse();
    var col = grid.map(function (row) { return row[i]; });
    return dir === "up" ? col : col.reverse();
  }
  function setLine(i, dir, line) {
    if (dir === "left") grid[i] = line.slice();
    else if (dir === "right") grid[i] = line.slice().reverse();
    else { var l = dir === "up" ? line : line.slice().reverse(); for (var r = 0; r < SIZE; r++) grid[r][i] = l[r]; }
  }
  function same(a, b) { return a.every(function (row, r) { return row.every(function (v, c) { return v === b[r][c]; }); }); }
  function canMove() {
    if (emptyCells().length) return true;
    for (var r = 0; r < SIZE; r++) for (var c = 0; c < SIZE; c++) {
      if (c < SIZE - 1 && grid[r][c] === grid[r][c + 1]) return true;
      if (r < SIZE - 1 && grid[r][c] === grid[r + 1][c]) return true;
    }
    return false;
  }

  function move(dir) {
    if (!started || gameOver || (won && !keepPlaying)) return;
    var before = grid.map(function (r) { return r.slice(); }), gained = 0;
    for (var i = 0; i < SIZE; i++) { var res = slide(getLine(i, dir)); setLine(i, dir, res.line); gained += res.pts; }
    if (same(before, grid)) { statusEl.textContent = "No tiles moved. Try another direction."; return; }
    score += gained;
    if (score > best) { best = score; saveBest(); }
    addTile(); render(gained > 0);
    if (!won && grid.some(function (r) { return r.indexOf(WIN) > -1; })) {
      won = true; showOver("Nice work!", "You reached 2048", "Your score is " + score + ". Keep playing for a higher score or start a fresh board.", true);
      statusEl.textContent = "You created the 2048 tile!"; return;
    }
    if (!canMove()) {
      gameOver = true; showOver("Board full", "Game over", "Final score: " + score + ". Start a new game and try a different strategy.", false);
      statusEl.textContent = "Game over. There are no valid moves left.";
    } else statusEl.textContent = gained ? "Great move! +" + gained + " points." : "Tile moved. Keep combining.";
  }

  function render(bump) {
    var f = document.createDocumentFragment();
    for (var r = 0; r < SIZE; r++) for (var c = 0; c < SIZE; c++) {
      var v = grid[r][c]; if (!v) continue;
      var look = LOOK[v] || ["#3c3a32", "#fff"], size = v < 100 ? 9 : v < 1000 ? 7.5 : v < 10000 ? 6.2 : 5, t = document.createElement("div");
      t.className = "pop"; t.textContent = v; t.setAttribute("aria-label", String(v));
      t.style.cssText = "grid-row:" + (r + 1) + ";grid-column:" + (c + 1) + ";display:grid;place-items:center;border-radius:10px;font-weight:800;line-height:1;background:" + look[0] + ";color:" + look[1] + ";font-size:" + size + "cqw";
      f.appendChild(t);
    }
    tilesEl.replaceChildren(f);
    scoreEl.textContent = score; bestEl.textContent = best;
    board.setAttribute("aria-label", "2048 game board. Score " + score);
    if (bump) { scoreEl.classList.remove("pop"); void scoreEl.offsetWidth; scoreEl.classList.add("pop"); }
  }

  function showOver(kick, title, text, canKeep) {
    overKick.textContent = kick; overTitle.textContent = title; overText.textContent = text;
    keepBtn.hidden = !canKeep; over.hidden = false; (canKeep ? keepBtn : againBtn).focus();
  }

  var KEYS = { ArrowUp: "up", w: "up", W: "up", ArrowDown: "down", s: "down", S: "down", ArrowLeft: "left", a: "left", A: "left", ArrowRight: "right", d: "right", D: "right" };
  document.addEventListener("keydown", function (e) {
    var t = e.target, dir = KEYS[e.key];
    if (!dir || !visible || e.ctrlKey || e.metaKey || e.altKey) return;
    if (t && (/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName) || t.isContentEditable)) return;
    e.preventDefault(); move(dir);
  });
  board.addEventListener("touchstart", function (e) { tx = e.changedTouches[0].clientX; ty = e.changedTouches[0].clientY; }, { passive: true });
  board.addEventListener("touchend", function (e) {
    var dx = e.changedTouches[0].clientX - tx, dy = e.changedTouches[0].clientY - ty;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 28) return;
    move(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? "right" : "left") : (dy > 0 ? "down" : "up"));
  }, { passive: true });
  Array.prototype.forEach.call(document.querySelectorAll("[data-dir]"), function (b) {
    b.addEventListener("click", function () { move(b.getAttribute("data-dir")); board.focus({ preventScroll: true }); });
  });
  poster.addEventListener("click", begin);
  newBtn.addEventListener("click", begin);
  againBtn.addEventListener("click", begin);
  keepBtn.addEventListener("click", function () { keepPlaying = true; over.hidden = true; statusEl.textContent = "Keep going. Build the largest tile you can."; board.focus({ preventScroll: true }); });
  /* arrow keys only control the game while the board is on screen, so the text below can still be scrolled */
  if ("IntersectionObserver" in window) new IntersectionObserver(function (en) { visible = en[0].intersectionRatio >= 0.4; }, { threshold: [0, 0.4, 1] }).observe(board);

  buildCells(); grid = empty(); render(false);
})();
