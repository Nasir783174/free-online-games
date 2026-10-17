# Changes (audit + fixes)
- Poster now always covers the game until Play is pressed (12 games had a dead poster).
- Sidebar no longer clips/scrolls (Sudoku keypad, Ludo, Reversi, Tower Defense...); invisible HUD numbers fixed (Classic Arcade, Time Management, Bike/Kart Racing, Time Trial...).
- Minesweeper red panel, Word Guess keyboard (now QWERTY under the board), Relaxing canvas size, Chess white pieces fixed.
- Arrows/Space no longer scroll the page while playing.
- Mobile horizontal overflow fixed (Fighting, Geography Quiz).
- Slug `point-andamp-click-adventure` -> `point-and-click-adventure` (+ redirect), `&amp;amp;` title bug fixed.
- vercel.json: real caching (immutable for css/js/fonts/images, revalidate for HTML) instead of no-store; asset versions bumped.
- Before going live run:  python3 set-domain.py https://yourdomain.com   (replaces placeholder demo.com in canonical/og/sitemap/robots)
