/* Escape - game logic + its own look. Layout lives in style.css; page shell lives in the HTML. */
(function(){"use strict";
var gm=document.getElementById("gm"),poster=document.getElementById("poster"),booted=false;
var LOOK=".gm{\n  \n  \n  --accent: #16b8c4;\n  --action: #ffb84d;\n  --success: #22c55e;\n  --danger: #ef5b5b;\n  --page: #f6f7fb;\n  \n  \n  \n  \n  --game: #111827;\n  --game-2: #1f2937;\n  --wood: #7a5038;\n  --wood-dark: #4b2e22;\n  --gold: #d6a54a;\n  \n}.gm *{ box-sizing: border-box; }.gm button,.gm input{ font: inherit; }.gm button{ -webkit-tap-highlight-color: transparent; }.gm .page-width{ width: min(1160px, calc(100% - 40px)); margin-inline: auto; }.gm .game-kicker{ margin: 0 0 7px; color: var(--brand-dark); font-size: 13px; font-weight: 800; letter-spacing: 0.11em; text-transform: uppercase; }.gm h2,.gm h3,.gm p{ overflow-wrap: break-word; }.gm h2{ margin: 0 0 17px; font-size: clamp(28px, 4vw, 36px); line-height: 1.16; letter-spacing: -0.025em; }.gm h3{ margin: 0 0 9px; font-size: 22px; line-height: 1.25; }.gm .game-section{ margin-bottom: 74px; }.gm .game-card{ position: relative; overflow: hidden; border: 1px solid #30394a; border-radius: 20px; background: var(--game); color: #fff; box-shadow: var(--shadow); }.gm .game-topbar{ display: flex; align-items: center; justify-content: space-between; gap: 24px; padding: 20px 22px; border-bottom: 1px solid #30394a; background: #151e2d; }.gm .game-topbar .game-kicker{ color: #8be0e6; }.gm .objective{ margin: 0; color: #d7deea; font-size: 15px; }.gm .stats{ display: flex; gap: 10px; }.gm .stat{ min-width: 82px; padding: 8px 12px; border: 1px solid #374356; border-radius: 12px; background: #1c2636; text-align: center; }.gm .stat span{ display: block; color: #aeb9ca; font-size: 11px; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; }.gm .stat strong{ display: block; color: #fff; font-size: 22px; line-height: 1.3; }.gm .game-layout{ display: grid; grid-template-columns: minmax(0, 1fr) 280px; }.gm .play-column{ min-width: 0; padding: 20px; }.gm .scene-nav{ display: flex; gap: 8px; margin-bottom: 12px; overflow-x: auto; scrollbar-width: thin; }.gm .scene-tab{ min-width: 78px; min-height: 42px; padding: 8px 16px; border: 1px solid #3b4658; border-radius: 11px; background: #202a3a; color: #c7d0de; font-weight: 800; cursor: pointer; }.gm .scene-tab:hover{ border-color: #66758b; color: #fff; }.gm .scene-tab.is-active{ border-color: var(--action); background: var(--action); color: #292319; }.gm .stage{ position: relative; aspect-ratio: 16 / 9; min-height: 330px; overflow: hidden; border: 1px solid #3a4658; border-radius: 16px; background: #263143; isolation: isolate; }.gm .scene-art{ position: absolute; inset: 0; overflow: hidden; }.gm .stage-vignette{ pointer-events: none; position: absolute; inset: 0; z-index: 8; box-shadow: inset 0 0 90px rgba(0,0,0,.58); }.gm .scene-label{ position: absolute; left: 18px; top: 15px; z-index: 9; padding: 5px 10px; border-radius: 8px; background: rgba(13, 19, 30, .75); color: #f8fafc; font-size: 13px; font-weight: 800; }.gm .wall{ position: absolute; inset: 0 0 28%; background: #52606e; }.gm .floor{ position: absolute; inset: 72% 0 0; background: linear-gradient(100deg, #32251f, #5a3c2b 45%, #2e241f); }.gm .floor::before{ content: \"\"; position: absolute; inset: 0; opacity: .2; background: repeating-linear-gradient(95deg, transparent 0 55px, #e8bf82 56px 58px); }.gm .baseboard{ position: absolute; left: 0; right: 0; bottom: 26%; height: 14px; background: #231b18; }.gm .hotspot{ position: absolute; z-index: 5; border: 2px solid transparent; background: transparent; color: transparent; cursor: pointer; }.gm .hotspot::after{ content: \"\"; position: absolute; left: 50%; top: 50%; width: 15px; height: 15px; border: 2px solid rgba(255,255,255,.82); border-radius: 50%; background: rgba(22,184,196,.86); box-shadow: 0 0 0 5px rgba(22,184,196,.22); transform: translate(-50%,-50%); opacity: 0; transition: opacity .2s, transform .2s; }.gm .hotspot:hover::after,.gm .hotspot:focus-visible::after{ opacity: 1; transform: translate(-50%,-50%) scale(1.1); }.gm .hotspot:focus-visible{ outline: 3px solid #fff; outline-offset: 2px; }.gm .painting-art{ position: absolute; left: 13%; top: 16%; width: 22%; height: 31%; border: 9px solid #35241b; background: #b4946c; box-shadow: 0 8px 13px rgba(0,0,0,.28), inset 0 0 0 3px #cba968; }.gm .painting-art::before{ content: \"\u2600  \u25d0  \u2767  \u2605\"; position: absolute; inset: 16px 6px; display: grid; place-items: center; color: #3a3027; font-size: clamp(14px, 2.4vw, 28px); letter-spacing: .18em; }.gm .painting-hotspot{ left: 11%; top: 12%; width: 27%; height: 39%; }.gm .cabinet-art{ position: absolute; left: 42%; bottom: 21%; width: 18%; height: 40%; border: 7px solid #3a251c; border-radius: 2px; background: #765039; box-shadow: 9px 10px 18px rgba(0,0,0,.28); }.gm .cabinet-art::before{ content: \"\"; position: absolute; left: 8%; right: 8%; top: 8%; height: 40%; border: 2px solid #4a3024; box-shadow: 0 50px 0 -2px #765039, 0 50px 0 0 #4a3024; }.gm .cabinet-art::after{ content: \"\"; position: absolute; right: 12%; top: 29%; width: 7px; height: 7px; border-radius: 50%; background: var(--gold); box-shadow: 0 50px 0 var(--gold); }.gm .cabinet-hotspot{ left: 40%; bottom: 18%; width: 22%; height: 46%; }.gm .rug-art{ position: absolute; left: 28%; bottom: 2%; width: 45%; height: 19%; border: 4px solid #c49b54; border-radius: 50%; background: repeating-radial-gradient(ellipse, #7e2635 0 14px, #b64b47 15px 28px); transform: perspective(160px) rotateX(42deg); }.gm .rug-hotspot{ left: 27%; bottom: 0; width: 48%; height: 24%; }.gm .vent-art{ position: absolute; right: 6%; top: 23%; width: 16%; height: 23%; border: 6px solid #242b31; background: repeating-linear-gradient(#111 0 7px, #4b5560 8px 10px); box-shadow: 0 5px 10px rgba(0,0,0,.35); }.gm .vent-hotspot{ right: 4%; top: 20%; width: 20%; height: 29%; }.gm .door-art{ position: absolute; right: 25%; bottom: 27%; width: 14%; height: 61%; border: 8px solid #2e211b; background: #5f3b29; box-shadow: inset 0 0 0 3px #7e5640; }.gm .door-art::after{ content: \"\"; position: absolute; right: 12%; top: 52%; width: 8px; height: 8px; border-radius: 50%; background: var(--gold); }.gm .door-hotspot{ right: 23%; bottom: 24%; width: 18%; height: 67%; }.gm .desk-wall{ position: absolute; inset: 0; background: linear-gradient(#3d4a57 0 45%, #26313e 45% 100%); }.gm .desk-surface{ position: absolute; left: 8%; right: 8%; top: 53%; height: 16%; border: 7px solid #3e271c; background: #865a3c; box-shadow: 0 15px 0 #4a3024, 0 20px 18px rgba(0,0,0,.4); }.gm .desk-surface::before,.gm .desk-surface::after{ content: \"\"; position: absolute; top: 100%; width: 9%; height: 180%; background: #4a3024; }.gm .desk-surface::before{ left: 8%; }.gm .desk-surface::after{ right: 8%; }.gm .desk-clock{ position: absolute; left: 17%; top: 22%; width: 18%; aspect-ratio: 1; border: 9px solid #8c6638; border-radius: 50%; background: #eee2c4; box-shadow: 0 7px 15px rgba(0,0,0,.3); }.gm .desk-clock::before{ content: \"\"; position: absolute; left: 50%; top: 18%; width: 3px; height: 34%; background: #302a25; transform-origin: bottom; transform: rotate(0deg); }.gm .desk-clock::after{ content: \"\"; position: absolute; left: 50%; top: 48%; width: 31%; height: 3px; background: #302a25; transform-origin: left; transform: rotate(-38deg); }.gm .memo-art{ position: absolute; left: 42%; top: 34%; width: 19%; height: 22%; padding: 7px; background: #e7d7a9; color: #4a3b2d; font-size: clamp(9px, 1.2vw, 14px); font-weight: 800; text-align: center; transform: rotate(-4deg); box-shadow: 2px 4px 8px rgba(0,0,0,.25); }.gm .memo-hotspot{ left: 40%; top: 31%; width: 23%; height: 27%; }.gm .drawer-art{ position: absolute; right: 13%; top: 47%; width: 21%; height: 15%; border: 5px solid #422a1f; background: #7a5038; }.gm .drawer-art::before{ content: \"3 4 2 1\"; position: absolute; left: 50%; top: 50%; padding: 2px 5px; background: #1b2431; color: #9be4e8; font-size: clamp(8px, 1vw, 12px); letter-spacing: .12em; transform: translate(-50%, -50%); }.gm .drawer-hotspot{ right: 10%; top: 43%; width: 27%; height: 23%; }.gm .books-room{ position: absolute; inset: 0; background: #4c3b34; }.gm .bookshelf-art{ position: absolute; left: 10%; right: 10%; top: 9%; bottom: 8%; border: 12px solid #39241c; background: repeating-linear-gradient(to bottom, #6a442e 0 22%, #302019 22% 25%); box-shadow: 0 10px 22px rgba(0,0,0,.35); }.gm .book-row{ position: absolute; left: 5%; right: 5%; top: 7%; height: 14%; background: repeating-linear-gradient(90deg, #883d45 0 7%, #d3a644 7% 12%, #3b6f78 12% 18%, #5d3d72 18% 24%); }.gm .book-row.row-two{ top: 32%; filter: hue-rotate(50deg); }.gm .book-row.row-three{ top: 57%; filter: hue-rotate(110deg); }.gm .legend-book{ position: absolute; left: 58%; top: 55%; z-index: 2; width: 13%; height: 21%; border: 4px solid #50301f; background: #e2d4a7; transform: rotate(8deg); box-shadow: 5px 7px 10px rgba(0,0,0,.36); }.gm .legend-book::after{ content: \"\u2600=3\\A\u25d0=4\\A\u2767=2\\A\u2605=1\"; white-space: pre; position: absolute; inset: 8%; color: #413629; font-size: clamp(9px, 1.45vw, 17px); font-weight: 800; line-height: 1.45; }.gm .book-hotspot{ left: 54%; top: 50%; width: 22%; height: 32%; }.gm .door-room{ position: absolute; inset: 0; background: radial-gradient(circle at 50% 30%, #53606d, #27313e 72%); }.gm .exit-door-large{ position: absolute; left: 32%; top: 7%; width: 36%; height: 87%; border: 15px solid #291f1b; background: linear-gradient(90deg, #68432f, #87573a 48%, #5a3829); box-shadow: inset 0 0 0 4px #9e7651, 12px 14px 24px rgba(0,0,0,.36); }.gm .exit-door-large::before{ content: \"EXIT\"; position: absolute; left: 50%; top: 9%; padding: 4px 12px; border: 2px solid #d0a85e; color: #f1d28d; font-size: clamp(12px, 2vw, 20px); font-weight: 800; letter-spacing: .18em; transform: translateX(-50%); }.gm .lock-art{ position: absolute; right: 8%; top: 48%; width: 38px; height: 52px; border: 4px solid #b9893d; border-radius: 6px; background: #d6a54a; }.gm .lock-art::before{ content: \"\"; position: absolute; left: 50%; bottom: 100%; width: 22px; height: 22px; border: 5px solid #d6a54a; border-bottom: 0; border-radius: 14px 14px 0 0; transform: translateX(-50%); }.gm .lock-art::after{ content: \"\u25c6\"; position: absolute; inset: 8px 0 0; color: #46341f; text-align: center; }.gm .door-lock-hotspot{ left: 28%; top: 3%; width: 44%; height: 94%; }.gm .feedback{ min-height: 51px; margin-top: 12px; padding: 12px 14px; border-left: 4px solid var(--accent); border-radius: 8px; background: #1b2636; color: #dce5f2; font-size: 15px; }.gm .feedback.is-warning{ border-left-color: var(--action); }.gm .feedback.is-success{ border-left-color: var(--success); }.gm .game-actions{ display: flex; flex-wrap: wrap; gap: 10px; margin-top: 14px; }.gm .button{ min-height: 46px; padding: 10px 18px; border: 0; border-radius: 11px; font-size: 16px; font-weight: 800; cursor: pointer; transition: transform .15s, background .15s, border-color .15s; }.gm .button:hover{ transform: translateY(-1px); }.gm .button:active{ transform: translateY(0); }.gm .button:focus-visible,.gm .scene-tab:focus-visible,.gm summary:focus-visible{ outline: 3px solid #8de4e9; outline-offset: 3px; }.gm .button-primary{ background: var(--action); color: #342717; }.gm .button-primary:hover{ background: #ffc563; }.gm .button-secondary{ background: var(--brand); color: #fff; }.gm .button-secondary:hover{ background: #6d6ee9; }.gm .button-secondary span{ margin-left: 5px; opacity: .78; font-size: 13px; }.gm .button-ghost{ border: 1px solid #4a566a; background: transparent; color: #dce4ef; }.gm .button-ghost:hover{ border-color: #8290a4; background: #202b3c; }.gm .button:disabled{ cursor: not-allowed; opacity: .48; transform: none; }.gm .side-panel{ padding: 20px; border-left: 1px solid #30394a; background: #151e2d; }.gm .inventory-card,.gm .notes-card{ padding: 17px; border: 1px solid #354155; border-radius: 14px; background: #1b2636; }.gm .notes-card{ margin-top: 14px; }.gm .panel-heading{ display: flex; align-items: center; justify-content: space-between; gap: 12px; }.gm .panel-heading h2{ margin: 0; color: #fff; font-size: 20px; letter-spacing: 0; }.gm .panel-heading span{ color: #9ba9bd; font-size: 13px; font-weight: 800; }.gm .panel-help{ margin: 6px 0 12px; color: #9eabba; font-size: 13px; line-height: 1.45; }.gm .inventory-list{ display: grid; gap: 8px; }.gm .inventory-item{ width: 100%; min-height: 48px; display: grid; grid-template-columns: 35px 1fr; align-items: center; gap: 10px; padding: 7px 9px; border: 1px solid #3d4a5e; border-radius: 10px; background: #222f41; color: #edf3fb; text-align: left; cursor: pointer; }.gm .inventory-item:hover{ border-color: #748299; }.gm .inventory-item.is-selected{ border-color: var(--action); box-shadow: 0 0 0 2px rgba(255,184,77,.2); }.gm .item-icon{ display: grid; place-items: center; width: 35px; height: 35px; border-radius: 9px; background: #303e52; font-size: 20px; }.gm .item-name{ display: block; font-size: 14px; font-weight: 800; }.gm .item-state{ display: block; color: #a7b3c3; font-size: 11px; }.gm .notes-list{ margin: 12px 0 0; padding: 0; list-style: none; }.gm .notes-list li:not(.empty-state){ margin-top: 8px; padding: 9px 10px; border-left: 3px solid var(--accent); border-radius: 6px; background: #243247; color: #d8e2ee; font-size: 13px; line-height: 1.45; }.gm .empty-state{ margin: 10px 0 0; color: #8f9caf; font-size: 13px; line-height: 1.5; }.gm .start-overlay{ position: absolute; inset: 0; z-index: 20; display: grid; place-items: center; padding: 22px; background: rgba(10, 15, 24, .82); backdrop-filter: blur(8px); }.gm .start-overlay[hidden]{ display: none; }.gm .overlay-card{ max-width: 510px; padding: 30px; border: 1px solid #445066; border-radius: 18px; background: #182231; color: #fff; text-align: center; box-shadow: 0 24px 70px rgba(0,0,0,.42); }.gm .overlay-card .game-kicker{ color: #8de4e9; }.gm .overlay-card h2{ font-size: clamp(27px, 4vw, 37px); }.gm .overlay-card p:not(.game-kicker){ color: #c4cddd; }.gm .lock-symbol{ display: grid; place-items: center; width: 66px; height: 66px; margin: 0 auto 18px; border-radius: 18px; background: #273449; font-size: 34px; }.gm .keyboard-note{ margin: 14px 0 0; font-size: 13px; }.gm .game-dialog{ width: min(510px, calc(100% - 28px)); padding: 0; border: 1px solid var(--border); border-radius: 18px; background: #fff; color: var(--text); box-shadow: 0 25px 80px rgba(0,0,0,.34); }.gm .game-dialog::backdrop{ background: rgba(10, 15, 24, .74); backdrop-filter: blur(4px); }.gm .game-dialog form,.gm .end-dialog{ padding: 28px; }.gm .dialog-close{ position: absolute; top: 13px; right: 14px; width: 38px; height: 38px; border: 0; border-radius: 10px; background: #eff1f7; color: var(--text); font-size: 26px; line-height: 1; cursor: pointer; }.gm .dialog-copy{ margin: 0; color: var(--muted); }.gm .clue-display{ margin: 17px 0 4px; padding: 18px; border: 1px solid #e2d8c2; border-radius: 12px; background: #fff9e9; color: #3e3329; font-size: clamp(20px, 5vw, 30px); font-weight: 800; letter-spacing: .16em; text-align: center; }.gm .legend-grid{ display: grid; grid-template-columns: repeat(2, 1fr); gap: 9px; margin-top: 18px; }.gm .legend-grid span{ padding: 10px; border-radius: 10px; background: #eff2f7; font-weight: 800; text-align: center; }.gm .dialog-input-area{ margin-top: 18px; }.gm .dialog-input-area label{ display: block; margin-bottom: 7px; font-weight: 800; }.gm .dialog-input-area input{ width: 100%; height: 52px; padding: 8px 14px; border: 2px solid #cfd4df; border-radius: 11px; color: var(--text); font-size: 24px; font-weight: 800; letter-spacing: .25em; text-align: center; }.gm .dialog-input-area input:focus{ border-color: var(--brand); outline: 3px solid rgba(91,92,226,.16); }.gm .dialog-input-area .button{ width: 100%; margin-top: 9px; }.gm .input-error{ min-height: 23px; margin: 5px 0 0; color: #b42318; font-size: 14px; }.gm .end-dialog{ text-align: center; }.gm .end-icon{ width: 64px; height: 64px; display: grid; place-items: center; margin: 0 auto 16px; border-radius: 50%; background: #dcfce7; color: #167c3b; font-size: 34px; font-weight: 800; }.gm .end-dialog.is-loss .end-icon{ background: #fee2e2; color: #b42318; }.gm .result-stats{ display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 20px 0; }.gm .result-stats div{ padding: 13px; border-radius: 11px; background: #f1f3f8; }.gm .result-stats span{ display: block; color: var(--muted); font-size: 12px; font-weight: 800; text-transform: uppercase; }.gm .result-stats strong{ font-size: 24px; }.gm .instruction-card{ padding: 24px; border: 1px solid var(--border); border-radius: 16px; background: var(--card); box-shadow: 0 10px 28px rgba(23,27,45,.07); }.gm .controls-list{ margin: 0; }.gm .controls-list div{ display: grid; grid-template-columns: 1fr 1.35fr; gap: 18px; padding: 10px 0; border-top: 1px solid var(--border); }.gm .controls-list div:first-child{ border-top: 0; }.gm .controls-list dt{ font-weight: 800; }.gm .controls-list dd{ margin: 0; color: var(--muted); }.gm .tinted-section{ background: #eceef7; }.gm .tips-list{ margin: 0; padding-left: 22px; }.gm .tips-list li{ margin: 8px 0; color: var(--muted); }.gm .noscript{ padding: 15px; background: #fee2e2; color: #8f1d1d; }@media (max-width: 900px){.gm .game-layout{ grid-template-columns: 1fr; }.gm .side-panel{ display: grid; grid-template-columns: 1fr 1fr; gap: 14px; border-top: 1px solid #30394a; border-left: 0; }.gm .notes-card{ margin-top: 0; }.gm .stage{ min-height: 300px; }}@media (max-width: 680px){.gm .page-width{ width: min(100% - 24px, 1160px); }.gm .game-topbar{ align-items: flex-start; flex-direction: column; padding: 16px; }.gm .stats{ width: 100%; }.gm .stat{ min-width: 0; flex: 1; padding-inline: 5px; }.gm .stat strong{ font-size: 19px; }.gm .play-column{ padding: 12px; }.gm .scene-nav{ margin-bottom: 9px; }.gm .scene-tab{ min-width: 72px; padding-inline: 13px; }.gm .stage{ min-height: 0; aspect-ratio: 4 / 3; }.gm .painting-art::before{ letter-spacing: .06em; }.gm .side-panel{ grid-template-columns: 1fr; padding: 12px; }.gm .game-actions .button{ flex: 1; padding-inline: 12px; }.gm .start-overlay{ padding: 12px; }.gm .overlay-card{ padding: 22px 17px; }.gm .keyboard-note{ display: none; }.gm .controls-list div{ grid-template-columns: 1fr; gap: 0; }}@media (max-width: 390px){.gm .stats{ gap: 6px; }.gm .stat span{ font-size: 10px; }.gm .feedback{ font-size: 14px; }.gm .game-actions{ flex-direction: column; }.gm .result-stats{ grid-template-columns: 1fr; }}@media (hover: none){.gm .hotspot::after{ opacity: .72; }.gm .hotspot:active::after{ opacity: 1; transform: translate(-50%,-50%) scale(1.12); }}@media (prefers-reduced-motion: reduce){.gm *,.gm *::before,.gm *::after{ scroll-behavior: auto !important; transition-duration: .01ms !important; animation-duration: .01ms !important; }}";
function __ready(f){f()}
function boot(){
"use strict";

const GAME_TIME = 600;
const CORRECT_CODE = "3421";
const MAX_HINTS = 3;

const elements = {
  stage: document.getElementById("stage"),
  sceneArt: document.getElementById("scene-art"),
  sceneNav: document.getElementById("scene-nav"),
  feedback: document.getElementById("feedback"),
  objective: document.getElementById("objective"),
  score: document.getElementById("score"),
  timer: document.getElementById("timer"),
  bestScore: document.getElementById("best-score"),
  inventory: document.getElementById("inventory"),
  inventoryCount: document.getElementById("inventory-count"),
  notesList: document.getElementById("notes-list"),
  clueCount: document.getElementById("clue-count"),
  hintButton: document.getElementById("hint-button"),
  hintCount: document.getElementById("hint-count"),
  restartButton: document.getElementById("restart-button"),
  startOverlay: document.getElementById("start-overlay"),
  startButton: document.getElementById("start-button"),
  puzzleDialog: document.getElementById("puzzle-dialog"),
  puzzleForm: document.getElementById("puzzle-form"),
  dialogClose: document.getElementById("dialog-close"),
  dialogKicker: document.getElementById("dialog-kicker"),
  dialogTitle: document.getElementById("dialog-title"),
  dialogContent: document.getElementById("dialog-content"),
  dialogInputArea: document.getElementById("dialog-input-area"),
  codeInput: document.getElementById("code-input"),
  codeError: document.getElementById("code-error"),
  endDialog: document.getElementById("end-dialog"),
  endIcon: document.getElementById("end-icon"),
  endKicker: document.getElementById("end-kicker"),
  endTitle: document.getElementById("end-title"),
  endCopy: document.getElementById("end-copy"),
  finalScore: document.getElementById("final-score"),
  finalTime: document.getElementById("final-time"),
  playAgainButton: document.getElementById("play-again-button")
};

const itemCatalog = {
  brassKey: { name: "Brass key", icon: "🗝️", state: "Fits a small lock" },
  flashlight: { name: "Flashlight", icon: "🔦", state: "Missing a battery" },
  battery: { name: "Battery", icon: "🔋", state: "Still has a charge" },
  poweredFlashlight: { name: "Lit flashlight", icon: "🔦", state: "Ready to use" },
  silverKey: { name: "Silver key", icon: "🔑", state: "Marked with a diamond" }
};

let state;
let timerInterval = null;

function freshState() {
  return {
    status: "ready",
    scene: "room",
    startedAt: 0,
    elapsed: 0,
    remaining: GAME_TIME,
    penalties: 0,
    progress: 0,
    hintsUsed: 0,
    inventory: [],
    selectedItem: null,
    clues: [],
    foundRugKey: false,
    cabinetOpen: false,
    drawerOpen: false,
    ventSearched: false,
    escaped: false
  };
}

function formatTime(totalSeconds) {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = String(safeSeconds % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function calculateScore() {
  return Math.max(0, 1000 + state.progress * 120 - state.elapsed - state.penalties);
}

function getBestScore() {
  try {
    const value = Number.parseInt(localStorage.getItem("escape-clockmaker-best") || "", 10);
    return Number.isFinite(value) ? value : null;
  } catch (error) {
    return null;
  }
}

function saveBestScore(score) {
  const current = getBestScore() || 0;
  if (score > current) {
    try { localStorage.setItem("escape-clockmaker-best", String(score)); } catch (error) { /* Storage may be blocked. */ }
  }
}

function setFeedback(message, type = "normal") {
  elements.feedback.textContent = message;
  elements.feedback.className = "feedback";
  if (type === "warning") elements.feedback.classList.add("is-warning");
  if (type === "success") elements.feedback.classList.add("is-success");
}

function setObjective() {
  let message = "Search the study for something useful.";
  if (state.foundRugKey && !state.cabinetOpen) message = "Find where the small brass key fits.";
  if (state.cabinetOpen && !state.drawerOpen) message = "Decode the symbol clues and open the desk drawer.";
  if (state.drawerOpen && !state.inventory.includes("poweredFlashlight")) message = "Combine two compatible inventory items.";
  if (state.inventory.includes("poweredFlashlight") && !state.ventSearched) message = "Use the light to inspect a dark place.";
  if (state.ventSearched && !state.escaped) message = "Use the silver key to unlock the exit.";
  if (state.escaped) message = "You escaped the Clockmaker’s Study!";
  elements.objective.textContent = message;
}

function updateStats() {
  elements.score.textContent = calculateScore();
  elements.timer.textContent = formatTime(state.remaining);
  const best = getBestScore();
  elements.bestScore.textContent = best === null ? "—" : best;
  elements.hintCount.textContent = `${MAX_HINTS - state.hintsUsed} left`;
  elements.hintButton.disabled = state.status !== "playing" || state.hintsUsed >= MAX_HINTS;
}

function addItem(itemId) {
  if (!state.inventory.includes(itemId)) state.inventory.push(itemId);
  renderInventory();
}

function removeItem(itemId) {
  state.inventory = state.inventory.filter((id) => id !== itemId);
  if (state.selectedItem === itemId) state.selectedItem = null;
}

function addClue(clueId) {
  if (!state.clues.includes(clueId)) {
    state.clues.push(clueId);
    renderNotes();
  }
}

function renderInventory() {
  elements.inventory.replaceChildren();
  elements.inventoryCount.textContent = `${state.inventory.length} / 4`;
  if (state.inventory.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "Items you collect will appear here.";
    elements.inventory.append(empty);
    return;
  }

  state.inventory.forEach((itemId) => {
    const item = itemCatalog[itemId];
    const button = document.createElement("button");
    button.type = "button";
    button.className = "inventory-item";
    button.dataset.item = itemId;
    button.setAttribute("aria-pressed", String(state.selectedItem === itemId));
    if (state.selectedItem === itemId) button.classList.add("is-selected");

    const icon = document.createElement("span");
    icon.className = "item-icon";
    icon.setAttribute("aria-hidden", "true");
    icon.textContent = item.icon;
    const text = document.createElement("span");
    const name = document.createElement("span");
    name.className = "item-name";
    name.textContent = item.name;
    const itemState = document.createElement("span");
    itemState.className = "item-state";
    itemState.textContent = item.state;
    text.append(name, itemState);
    button.append(icon, text);
    elements.inventory.append(button);
  });
}

function renderNotes() {
  elements.notesList.replaceChildren();
  elements.clueCount.textContent = `${state.clues.length} / 2`;
  if (state.clues.length === 0) {
    const empty = document.createElement("li");
    empty.className = "empty-state";
    empty.textContent = "Important clues are saved automatically.";
    elements.notesList.append(empty);
    return;
  }
  const clueText = {
    painting: "Painting order: Sun → Moon → Leaf → Star",
    legend: "Book values: Sun 3, Moon 4, Leaf 2, Star 1"
  };
  state.clues.forEach((clue) => {
    const li = document.createElement("li");
    li.textContent = clueText[clue];
    elements.notesList.append(li);
  });
}

function roomMarkup() {
  return `
    <span class="scene-label">Room overview</span>
    <div class="wall" aria-hidden="true"></div><div class="floor" aria-hidden="true"></div><div class="baseboard" aria-hidden="true"></div>
    <div class="painting-art" aria-hidden="true"></div><button class="hotspot painting-hotspot" data-action="painting" aria-label="Inspect the framed painting">Painting</button>
    <div class="cabinet-art" aria-hidden="true"></div><button class="hotspot cabinet-hotspot" data-action="cabinet" aria-label="Inspect the locked cabinet">Cabinet</button>
    <div class="rug-art" aria-hidden="true"></div><button class="hotspot rug-hotspot" data-action="rug" aria-label="Look under the rug">Rug</button>
    <div class="vent-art" aria-hidden="true"></div><button class="hotspot vent-hotspot" data-action="vent" aria-label="Inspect the dark wall vent">Wall vent</button>
    <div class="door-art" aria-hidden="true"></div><button class="hotspot door-hotspot" data-action="door" aria-label="Approach the exit door">Exit door</button>`;
}

function deskMarkup() {
  return `
    <span class="scene-label">Writing desk</span><div class="desk-wall" aria-hidden="true"></div>
    <div class="desk-clock" aria-hidden="true"></div><div class="desk-surface" aria-hidden="true"></div>
    <div class="memo-art" aria-hidden="true">Order matters.<br>Pictures before numbers.</div><button class="hotspot memo-hotspot" data-action="memo" aria-label="Read the note on the desk">Desk note</button>
    <div class="drawer-art" aria-hidden="true"></div><button class="hotspot drawer-hotspot" data-action="drawer" aria-label="Inspect the coded desk drawer">Coded drawer</button>`;
}

function booksMarkup() {
  return `
    <span class="scene-label">Bookcase</span><div class="books-room" aria-hidden="true"></div><div class="bookshelf-art" aria-hidden="true"><div class="book-row"></div><div class="book-row row-two"></div><div class="book-row row-three"></div></div>
    <div class="legend-book" aria-hidden="true"></div><button class="hotspot book-hotspot" data-action="book" aria-label="Inspect the unusual open book">Open book</button>`;
}

function doorMarkup() {
  return `
    <span class="scene-label">Exit door</span><div class="door-room" aria-hidden="true"></div><div class="exit-door-large" aria-hidden="true"><div class="lock-art"></div></div>
    <button class="hotspot door-lock-hotspot" data-action="exit" aria-label="Try the diamond-marked exit lock">Exit lock</button>`;
}

function renderScene() {
  const markupByScene = { room: roomMarkup, desk: deskMarkup, books: booksMarkup, door: doorMarkup };
  elements.stage.className = `stage scene-${state.scene}`;
  elements.stage.setAttribute("aria-label", `${state.scene[0].toUpperCase()}${state.scene.slice(1)} view`);
  elements.sceneArt.innerHTML = markupByScene[state.scene]();
  elements.sceneNav.querySelectorAll("[data-scene]").forEach((button) => {
    const active = button.dataset.scene === state.scene;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
}

function showDialog({ kicker = "Clue found", title, html, codeInput = false }) {
  elements.dialogKicker.textContent = kicker;
  elements.dialogTitle.textContent = title;
  elements.dialogContent.innerHTML = html;
  elements.dialogInputArea.hidden = !codeInput;
  elements.codeInput.value = "";
  elements.codeError.textContent = "";
  if (!elements.puzzleDialog.open) elements.puzzleDialog.showModal();
  if (codeInput) window.setTimeout(() => elements.codeInput.focus(), 0);
}

function closePuzzleDialog() {
  if (elements.puzzleDialog.open) elements.puzzleDialog.close();
}

function inspectPainting() {
  addClue("painting");
  showDialog({
    title: "Four symbols are painted in a row",
    html: '<p class="dialog-copy">A worn plaque says, “Read us from left to right.”</p><div class="clue-display" aria-label="Sun, moon, leaf, star">☀ &nbsp; ◐ &nbsp; ❧ &nbsp; ★</div>'
  });
  setFeedback("The painting’s symbol order has been added to your case notes.", "success");
}

function inspectBook() {
  addClue("legend");
  showDialog({
    title: "The open book contains a symbol key",
    html: '<p class="dialog-copy">Someone matched each symbol to a number.</p><div class="legend-grid"><span>☀ = 3</span><span>◐ = 4</span><span>❧ = 2</span><span>★ = 1</span></div>'
  });
  setFeedback("The book’s number key has been added to your case notes.", "success");
}

function searchRug() {
  if (state.foundRugKey) {
    setFeedback("You already searched beneath the rug. Nothing else is hidden there.");
    return;
  }
  state.foundRugKey = true;
  state.progress += 1;
  addItem("brassKey");
  setFeedback("You lift the rug and find a small brass key.", "success");
  updateGameUI();
}

function openCabinet() {
  if (state.cabinetOpen) {
    setFeedback("The cabinet is empty. You already took the flashlight.");
    return;
  }
  if (!state.inventory.includes("brassKey")) {
    setFeedback("The cabinet is locked. Its small brass keyhole must match a key nearby.", "warning");
    return;
  }
  state.cabinetOpen = true;
  state.progress += 1;
  removeItem("brassKey");
  addItem("flashlight");
  setFeedback("The brass key opens the cabinet. Inside is a flashlight without a battery.", "success");
  updateGameUI();
}

function inspectVent() {
  if (state.ventSearched) {
    setFeedback("Only dust remains inside the vent.");
    return;
  }
  if (!state.inventory.includes("poweredFlashlight")) {
    setFeedback("The vent is too dark to search safely. You need a working light.", "warning");
    return;
  }
  state.ventSearched = true;
  state.progress += 1;
  addItem("silverKey");
  setFeedback("The flashlight reveals a silver key deep inside the vent.", "success");
  updateGameUI();
}

function inspectDrawer() {
  if (state.drawerOpen) {
    setFeedback("The drawer is open and empty. You already took the battery.");
    return;
  }
  showDialog({
    kicker: "Locked puzzle",
    title: "The desk drawer needs a four-digit code",
    html: '<p class="dialog-copy">Use the room’s symbol order and number key. Wrong codes cost 35 points.</p>',
    codeInput: true
  });
}

function submitCode(event) {
  event.preventDefault();
  if (elements.dialogInputArea.hidden) return;
  const code = elements.codeInput.value.trim();
  if (!/^\d{4}$/.test(code)) {
    elements.codeError.textContent = "Enter exactly four digits.";
    return;
  }
  if (code !== CORRECT_CODE) {
    state.penalties += 35;
    elements.codeError.textContent = "The lock flashes red. That code is not correct.";
    elements.codeInput.select();
    setFeedback("Wrong code. Compare the painting’s order with the book’s values.", "warning");
    updateStats();
    return;
  }
  state.drawerOpen = true;
  state.progress += 1;
  addItem("battery");
  closePuzzleDialog();
  setFeedback("The code works. The drawer opens, revealing a charged battery.", "success");
  updateGameUI();
}

function selectInventoryItem(itemId) {
  if (state.status !== "playing") return;
  if (state.selectedItem === itemId) {
    state.selectedItem = null;
    setFeedback(`${itemCatalog[itemId].name} deselected.`);
    renderInventory();
    return;
  }

  if (state.selectedItem) {
    const pair = new Set([state.selectedItem, itemId]);
    if (pair.has("flashlight") && pair.has("battery")) {
      removeItem("flashlight");
      removeItem("battery");
      state.selectedItem = null;
      state.progress += 1;
      addItem("poweredFlashlight");
      setFeedback("The battery clicks into place. The flashlight now shines brightly.", "success");
      updateGameUI();
      return;
    }
    setFeedback("Those items do not fit together. Try a different combination.", "warning");
  } else {
    setFeedback(`${itemCatalog[itemId].name} selected. Choose another item to combine it.`);
  }
  state.selectedItem = itemId;
  renderInventory();
}

function tryExit() {
  if (!state.inventory.includes("silverKey")) {
    setFeedback("The exit lock is marked with a diamond. You do not have the right key yet.", "warning");
    return;
  }
  state.escaped = true;
  state.progress += 1;
  state.status = "won";
  clearInterval(timerInterval);
  timerInterval = null;
  const score = calculateScore();
  saveBestScore(score);
  setObjective();
  updateStats();
  showEndDialog(true);
}

function showEndDialog(won) {
  const score = calculateScore();
  elements.endDialog.classList.toggle("is-loss", !won);
  elements.endIcon.textContent = won ? "✓" : "!";
  elements.endKicker.textContent = won ? "You escaped" : "Time expired";
  elements.endTitle.textContent = won ? "The study door swings open." : "The final lock has engaged.";
  elements.endCopy.textContent = won ? "You connected every clue and escaped the Clockmaker’s Study." : "The clues remain in place. Start again and take a faster route through the room.";
  elements.finalScore.textContent = score;
  elements.finalTime.textContent = formatTime(state.elapsed);
  if (!elements.endDialog.open) elements.endDialog.showModal();
}

function handleAction(action) {
  if (state.status !== "playing") return;
  const actions = {
    painting: inspectPainting,
    cabinet: openCabinet,
    rug: searchRug,
    vent: inspectVent,
    door: () => changeScene("door"),
    memo: () => showDialog({ title: "A hurried note", html: '<p class="dialog-copy">“Order matters. Pictures before numbers. The drawer holds what the light lacks.”</p>' }),
    drawer: inspectDrawer,
    book: inspectBook,
    exit: tryExit
  };
  if (actions[action]) actions[action]();
}

function changeScene(scene) {
  if (!Object.prototype.hasOwnProperty.call({ room: true, desk: true, books: true, door: true }, scene)) return;
  state.scene = scene;
  renderScene();
  const messages = {
    room: "You step back to view the whole study.",
    desk: "The old writing desk has a coded drawer and a handwritten note.",
    books: "Most books are dusty, but one volume has been left open.",
    door: "A diamond-marked lock keeps the heavy exit door shut."
  };
  setFeedback(messages[scene]);
}

function useHint() {
  if (state.status !== "playing" || state.hintsUsed >= MAX_HINTS) return;
  state.hintsUsed += 1;
  state.penalties += 50;
  let hint = "Start low: something may be hidden beneath the rug.";
  if (state.foundRugKey && !state.cabinetOpen) hint = "The brass key fits the cabinet in the room view.";
  else if (state.cabinetOpen && !state.drawerOpen && state.clues.length < 2) hint = "Compare the painting’s symbol order with the open book’s number key.";
  else if (state.cabinetOpen && !state.drawerOpen) hint = "Sun, Moon, Leaf, Star becomes 3, 4, 2, 1.";
  else if (state.drawerOpen && !state.inventory.includes("poweredFlashlight")) hint = "Select the flashlight, then select the battery in your inventory.";
  else if (state.inventory.includes("poweredFlashlight") && !state.ventSearched) hint = "The wall vent is dark enough to hide something.";
  else if (state.ventSearched) hint = "The silver key belongs in the diamond-marked exit lock.";
  setFeedback(`Hint: ${hint}`, "warning");
  updateStats();
}

function tick() {
  if (state.status !== "playing") return;
  state.elapsed = Math.min(GAME_TIME, Math.floor((Date.now() - state.startedAt) / 1000));
  state.remaining = GAME_TIME - state.elapsed;
  updateStats();
  if (state.remaining <= 0) {
    state.status = "lost";
    clearInterval(timerInterval);
    timerInterval = null;
    showEndDialog(false);
  }
}

function startGame() {
  state.status = "playing";
  state.startedAt = Date.now();
  elements.startOverlay.hidden = true;
  elements.restartButton.disabled = false;
  setFeedback("The clock starts. Search the study and find a way out.");
  setObjective();
  updateStats();
  clearInterval(timerInterval);
  timerInterval = window.setInterval(tick, 250);
  const firstHotspot = elements.sceneArt.querySelector(".hotspot");
  if (firstHotspot) firstHotspot.focus();
}

function resetGame(autoStart = false) {
  clearInterval(timerInterval);
  timerInterval = null;
  if (elements.puzzleDialog.open) elements.puzzleDialog.close();
  if (elements.endDialog.open) elements.endDialog.close();
  state = freshState();
  renderScene();
  renderInventory();
  renderNotes();
  setObjective();
  setFeedback("The study is silent except for the ticking clock.");
  elements.startOverlay.hidden = autoStart;
  elements.restartButton.disabled = !autoStart;
  updateStats();
  if (autoStart) startGame();
}

function updateGameUI() {
  setObjective();
  updateStats();
  renderInventory();
  renderNotes();
}

elements.startButton.addEventListener("click", startGame);
elements.restartButton.addEventListener("click", () => {
  if (state.status === "playing" && !window.confirm("Restart and lose your current progress?")) return;
  resetGame(true);
});
elements.playAgainButton.addEventListener("click", () => resetGame(true));
elements.hintButton.addEventListener("click", useHint);
elements.dialogClose.addEventListener("click", closePuzzleDialog);
elements.puzzleForm.addEventListener("submit", submitCode);
elements.endDialog.addEventListener("cancel", (event) => event.preventDefault());

elements.sceneNav.addEventListener("click", (event) => {
  const button = event.target.closest("[data-scene]");
  if (button && state.status === "playing") changeScene(button.dataset.scene);
});

elements.sceneArt.addEventListener("click", (event) => {
  const hotspot = event.target.closest("[data-action]");
  if (hotspot) handleAction(hotspot.dataset.action);
});

elements.inventory.addEventListener("click", (event) => {
  const item = event.target.closest("[data-item]");
  if (item) selectInventoryItem(item.dataset.item);
});

document.addEventListener("keydown", (event) => {
  if (event.key.toLowerCase() === "h" && !elements.puzzleDialog.open && !elements.endDialog.open) useHint();
  if (event.key.toLowerCase() === "r" && !elements.puzzleDialog.open && !elements.endDialog.open && state.status === "playing") {
    event.preventDefault();
    elements.restartButton.click();
  }
});

resetGame(false);


}
function begin(){poster.hidden=true;gm.hidden=false;if(!booted){booted=true;var s=document.createElement("style");s.textContent=LOOK;document.head.appendChild(s);boot();}else{var r=document.getElementById("restart-button");if(r)r.click();}}
poster.addEventListener("click",begin);
var nb=document.getElementById("new");if(nb)nb.addEventListener("click",begin);
})();
