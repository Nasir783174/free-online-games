/* Point &amp; Click Adventure - game logic + its own look. Layout lives in style.css; page shell lives in the HTML. */
(function(){"use strict";
var gm=document.getElementById("gm"),poster=document.getElementById("poster"),booted=false;
var LOOK=".gm{\n  --primary: #5b5ce2;\n  --primary-dark: #4546b8;\n  --accent: #16b8c4;\n  --action: #ffb84d;\n  --success: #22c55e;\n  --danger: #ef5b5b;\n  \n  \n  \n  \n  \n  --game: #111827;\n  --game-2: #1f2937;\n  \n  --radius: 18px;\n}.gm *{ box-sizing: border-box; }.gm button,.gm input{ font: inherit; }.gm button{ -webkit-tap-highlight-color: transparent; }.gm .modal-eyebrow,.gm .game-kicker{ margin: 0 0 8px; color: var(--primary); font-size: 13px; font-weight: 800; letter-spacing: .12em; text-transform: uppercase; }.gm .game-card{ overflow: hidden; border: 1px solid var(--border); border-radius: 22px; background: var(--card); box-shadow: var(--shadow); }.gm .game-topbar{ display: flex; justify-content: space-between; gap: 24px; padding: 20px 24px; border-bottom: 1px solid var(--border); }.gm .game-topbar h2{ margin: 0; font-size: 26px; line-height: 1.2; }.gm .game-kicker{ margin-bottom: 4px; font-size: 11px; }.gm .stats{ display: flex; gap: 30px; align-items: center; }.gm .stats div{ min-width: 58px; }.gm .stats span{ display: block; color: var(--muted); font-size: 11px; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; }.gm .stats strong{ font-size: 21px; line-height: 1.2; }.gm .game-layout{ display: grid; grid-template-columns: minmax(0, 1fr) 260px; min-height: 590px; background: #202a3a; }.gm .stage-wrap{ position: relative; min-width: 0; display: grid; grid-template-rows: 1fr auto; }.gm .scene{ position: relative; overflow: hidden; isolation: isolate; min-height: 508px; background: var(--game); }.gm .scene::after{ content: \"\"; position: absolute; inset: 0; z-index: 20; pointer-events: none; box-shadow: inset 0 0 70px rgba(0,0,0,.42); }.gm .scene-study{ background: linear-gradient(#28354d 0 68%, #17202f 68%); }.gm .scene-study::before{ content: \"\"; position: absolute; inset: 68% 0 0; background: repeating-linear-gradient(100deg, transparent 0 80px, rgba(255,255,255,.025) 82px 84px), #181f2b; transform: perspective(500px) rotateX(18deg); transform-origin: top; }.gm .room-label{ position: absolute; z-index: 30; left: 18px; top: 16px; padding: 7px 11px; border: 1px solid rgba(255,255,255,.14); border-radius: 999px; background: rgba(10,16,26,.64); color: #eef2ff; font-size: 13px; font-weight: 800; pointer-events: none; }.gm .hotspot{ position: absolute; margin: 0; padding: 0; border: 0; background: transparent; color: inherit; cursor: pointer; }.gm .hotspot::after{ content: \"\"; position: absolute; inset: -6px; border: 2px solid transparent; border-radius: 10px; transition: border-color .2s, background .2s; }.gm .hotspot:hover::after,.gm .hotspot:focus-visible::after{ border-color: var(--action); background: rgba(255,184,77,.08); }.gm .hotspot:focus-visible{ outline: 0; }.gm .hotspot-label{ position: absolute; z-index: 50; left: 50%; bottom: -33px; transform: translate(-50%, 5px); white-space: nowrap; opacity: 0; padding: 4px 9px; border-radius: 7px; background: #fff; color: var(--text); font-size: 12px; font-weight: 800; pointer-events: none; transition: .2s; }.gm .hotspot:hover .hotspot-label,.gm .hotspot:focus-visible .hotspot-label{ opacity: 1; transform: translate(-50%, 0); }.gm .clock{ left: 12%; top: 9%; width: 90px; height: 188px; border-radius: 48px 48px 12px 12px; background: #6d452d; box-shadow: inset 0 0 0 7px #4a2d20, 0 10px 20px rgba(0,0,0,.28); }.gm .clock::before{ content: \"\"; position: absolute; left: 33px; top: 100px; width: 24px; height: 60px; border-radius: 50%; background: #f2bd53; transform-origin: 50% 0; animation: pendulum 2s ease-in-out infinite paused; }.gm .clock.repaired::before{ animation-play-state: running; }@keyframes pendulum{ 0%,100% { transform: rotate(-10deg); } 50% { transform: rotate(10deg); } }.gm .clock-face{ position: absolute; left: 15px; top: 15px; width: 60px; height: 60px; border: 5px solid #c79043; border-radius: 50%; background: #f3ead3; box-shadow: inset 0 0 0 2px #403025; }.gm .clock-face::before{ content: \"12\\A\\A\\A6\"; white-space: pre; position: absolute; inset: 1px; color: #403025; font-size: 8px; line-height: 23px; text-align: center; }.gm .clock-face i,.gm .clock-face b{ position: absolute; left: 27px; top: 26px; width: 2px; height: 18px; background: #403025; transform-origin: 50% 1px; }.gm .clock-face i{ transform: rotate(0deg); }.gm .clock-face b{ height: 22px; transform: rotate(90deg); }.gm .portrait{ left: 36%; top: 11%; width: 150px; height: 180px; border: 10px solid #a06c35; border-style: ridge; background: #202a43; box-shadow: 0 10px 20px rgba(0,0,0,.25); }.gm .portrait-art{ position: absolute; inset: 9px; overflow: hidden; border-radius: 50% 50% 45% 45%; background: radial-gradient(circle at 50% 32%, #d49a75 0 14%, transparent 15%), linear-gradient(145deg, #48566f, #131a2b); }.gm .portrait-art::after{ content: \"\"; position: absolute; width: 70px; height: 90px; left: 30px; top: 48px; border-radius: 30px 30px 8px 8px; background: #343c5b; }.gm .portrait-art i,.gm .portrait-art b,.gm .portrait-art em{ display: none; position: absolute; z-index: 2; bottom: 7px; color: #ffda78; font-size: 17px; font-style: normal; text-shadow: 0 0 8px #ffda78; }.gm .portrait.revealed .portrait-art i,.gm .portrait.revealed .portrait-art b,.gm .portrait.revealed .portrait-art em{ display: block; }.gm .portrait-art i{ left: 18px; }.gm .portrait-art b{ left: 55px; }.gm .portrait-art em{ left: 90px; }.gm .desk{ left: 24%; bottom: 15%; width: 300px; height: 107px; border-radius: 4px; background: #785039; box-shadow: inset 0 7px #9c6c49, 0 15px 20px rgba(0,0,0,.24); }.gm .desk::before,.gm .desk::after{ content: \"\"; position: absolute; bottom: -74px; width: 24px; height: 75px; background: #533525; }.gm .desk::before{ left: 24px; }.gm .desk::after{ right: 24px; }.gm .desk-lamp{ position: absolute; left: 35px; top: -76px; width: 64px; height: 50px; border-radius: 50% 50% 8px 8px; background: #d5a442; box-shadow: 0 0 35px rgba(255,199,85,.22); }.gm .desk-lamp::after{ content: \"\"; position: absolute; left: 29px; top: 45px; width: 7px; height: 36px; background: #b07e32; }.gm .drawer{ left: calc(24% + 164px); bottom: calc(15% + 42px); z-index: 4; width: 105px; height: 42px; border: 2px solid #5c3927; border-radius: 2px; }.gm .keyhole{ position: absolute; left: 49px; top: 14px; width: 7px; height: 10px; border-radius: 50% 50% 2px 2px; background: #261b18; }.gm .drawer.open{ transform: translateY(16px); background: #40281f; }.gm .rug{ left: 15%; bottom: 2%; width: 360px; height: 66px; transform: skewX(-16deg); border: 6px solid #a24f41; background: #d48d52; box-shadow: 0 5px 15px rgba(0,0,0,.35); }.gm .rug-pattern{ position: absolute; inset: 8px; border: 3px solid #623b4c; background: repeating-linear-gradient(45deg, transparent 0 22px, rgba(102,57,69,.38) 23px 28px); }.gm .rug.lifted{ transform: skewX(-16deg) rotate(-3deg) translateY(-12px); transform-origin: 0 100%; }.gm .door{ border: 7px solid #182234; }.gm .greenhouse-door{ right: 7%; bottom: 12%; width: 112px; height: 266px; background: linear-gradient(90deg, #21626a, #17464e); box-shadow: inset 0 0 0 3px #3b8990; }.gm .door-window{ position: absolute; left: 18px; top: 18px; width: 62px; height: 90px; border: 5px solid #276c73; background: linear-gradient(150deg, rgba(255,255,255,.2), transparent), #7eb8ac; }.gm .door-knob{ position: absolute; left: 17px; top: 150px; width: 12px; height: 12px; border-radius: 50%; background: #f0bd5c; }.gm .observatory-door{ right: 23%; top: 19%; width: 100px; height: 250px; border: 8px solid #3a485c; border-radius: 46px 46px 4px 4px; background: #171f31; box-shadow: inset 0 0 0 4px #222e44; }.gm .gear-slot{ position: absolute; display: grid; place-items: center; left: 25px; top: 94px; width: 36px; height: 36px; border: 3px solid #79859b; border-radius: 50%; color: #8793a8; font-size: 25px; }.gm .observatory-door.unlocked{ background: linear-gradient(135deg, #263b58, #121b2c); box-shadow: inset 0 0 30px rgba(255,205,93,.28); }.gm .observatory-door.unlocked .gear-slot{ color: #ffcc5c; border-color: #ffcc5c; transform: rotate(25deg); }.gm .token{ z-index: 8; width: 24px; height: 24px; border: 2px solid #f4c55a; border-radius: 50%; background: #a66e27; color: #ffe48f; font-size: 11px; box-shadow: 0 0 10px rgba(255,209,89,.35); }.gm .study-token{ left: 7%; bottom: 6%; }.gm .token.collected{ display: none; }.gm .scene-greenhouse{ background: linear-gradient(#183e49 0 69%, #202c2e 69%); }.gm .scene-greenhouse::before{ content: \"\"; position: absolute; inset: 0; opacity: .55; background: linear-gradient(75deg, transparent 47%, #98b9ac 48% 49%, transparent 50%), linear-gradient(-75deg, transparent 47%, #98b9ac 48% 49%, transparent 50%), linear-gradient(90deg, transparent 32%, #98b9ac 33% 34%, transparent 35% 65%, #98b9ac 66% 67%, transparent 68%); }.gm .greenhouse-floor{ position: absolute; inset: 69% 0 0; background: repeating-linear-gradient(90deg, #283536 0 70px, #1d2829 71px 75px); }.gm .plant{ position: absolute; left: 9%; bottom: 17%; width: 155px; height: 210px; }.gm .plant::before{ content: \"\"; position: absolute; left: 67px; bottom: 40px; width: 10px; height: 130px; background: #41784a; transform: rotate(-5deg); }.gm .plant::after{ content: \"\"; position: absolute; left: 28px; bottom: 0; width: 100px; height: 70px; border-radius: 4px 4px 30px 30px; background: #9a5f3d; box-shadow: inset 0 8px #68402f; }.gm .flower-shape{ position: absolute; z-index: 2; left: 42px; top: 2px; width: 72px; height: 72px; border-radius: 50%; background: #f4bd49; clip-path: polygon(50% 0,63% 30%,98% 20%,72% 50%,98% 80%,63% 70%,50% 100%,37% 70%,2% 80%,28% 50%,2% 20%,37% 30%); }.gm .flower-shape::after{ content: \"\"; position: absolute; left: 27px; top: 27px; width: 18px; height: 18px; border-radius: 50%; background: #754728; }.gm .mosaic{ left: 36%; top: 12%; width: 210px; height: 136px; border: 10px solid #92714c; background: #193344; box-shadow: inset 0 0 0 3px #d9b96f; }.gm .moon-phases{ display: flex; align-items: center; justify-content: space-around; position: absolute; inset: 20px 13px; }.gm .moon-phases span{ width: 30px; height: 30px; border-radius: 50%; background: #ecd887; }.gm .moon-phases span:nth-child(1){ background: #ecd887; }.gm .moon-phases span:nth-child(2){ background: linear-gradient(90deg,#193344 50%,#ecd887 50%); }.gm .moon-phases span:nth-child(3){ background: #193344; box-shadow: inset -8px 0 #ecd887; }.gm .moon-phases span:nth-child(4){ background: linear-gradient(90deg,#ecd887 50%,#193344 50%); }.gm .star-vane{ right: 15%; top: 11%; width: 115px; height: 160px; }.gm .star-vane::after{ content: \"\"; position: absolute; left: 54px; top: 60px; width: 7px; height: 100px; background: #845f3e; }.gm .star-shape{ position: absolute; z-index: 2; left: 14px; top: 0; width: 88px; height: 88px; background: #f1bf53; clip-path: polygon(50% 0,61% 32%,85% 15%,68% 39%,100% 50%,68% 61%,85% 85%,61% 68%,50% 100%,39% 68%,15% 85%,32% 61%,0 50%,32% 39%,15% 15%,39% 32%); }.gm .chest{ left: 39%; bottom: 12%; width: 190px; height: 105px; border: 6px solid #4a2e24; border-radius: 36px 36px 7px 7px; background: linear-gradient(#845031 0 45%, #603925 46%); box-shadow: inset 0 0 0 3px #ac7243, 0 13px 20px rgba(0,0,0,.3); }.gm .chest::before{ content: \"\"; position: absolute; left: 75px; top: 42px; width: 30px; height: 32px; border: 4px solid #d5a943; border-radius: 5px; background: #3e2920; }.gm .chest.open{ transform: translateY(5px); background: #33251f; }.gm .greenhouse-token{ right: 5%; bottom: 6%; }.gm .back-door{ left: 4%; top: 23%; width: 80px; height: 220px; background: #34424a; border-color: #253038; }.gm .back-door::before{ content: \"\u2190\"; display: grid; place-items: center; position: absolute; inset: 50px 14px 90px; border: 2px solid #687781; color: #d7e0e5; font-weight: 800; }.gm .message-box{ min-height: 82px; display: grid; grid-template-columns: 82px 1fr; gap: 12px; align-items: center; padding: 13px 20px; border-top: 1px solid rgba(255,255,255,.1); background: #111827; color: #e8edf6; }.gm .message-box .speaker{ color: #f6c765; font-size: 12px; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; }.gm .message-box p{ margin: 0; font-size: 15px; line-height: 1.45; }.gm .message-box.flash{ animation: messageFlash .35s ease; }@keyframes messageFlash{ 50% { background: #26344c; } }.gm .side-panel{ display: flex; flex-direction: column; background: #fff; color: var(--text); }.gm .panel-section{ padding: 22px 18px; border-bottom: 1px solid var(--border); }.gm .panel-heading{ display: flex; align-items: center; justify-content: space-between; }.gm .panel-heading span{ color: var(--muted); font-size: 13px; font-weight: 800; }.gm .panel-section h3{ margin: 0 0 14px; font-size: 18px; }.gm .panel-heading h3{ margin-bottom: 0; }.gm .inventory{ display: grid; grid-template-columns: repeat(2, 1fr); gap: 9px; margin-top: 15px; min-height: 132px; }.gm .empty-state{ grid-column: 1 / -1; margin: 10px 0 0; color: var(--muted); font-size: 14px; text-align: center; }.gm .inventory-item{ display: grid; place-items: center; gap: 4px; min-height: 62px; padding: 6px; border: 1px solid var(--border); border-radius: 11px; background: #f9fafc; color: var(--text); cursor: pointer; }.gm .inventory-item:hover,.gm .inventory-item:focus-visible{ border-color: var(--primary); }.gm .inventory-item.selected{ border: 2px solid var(--primary); background: #efefff; }.gm .inventory-item.used{ opacity: .5; }.gm .item-icon{ font-size: 23px; line-height: 1; }.gm .item-name{ font-size: 11px; font-weight: 800; line-height: 1.15; }.gm .objective-section{ flex: 1; background: #fafbfe; }.gm .objective-section p{ margin: 0; color: var(--muted); font-size: 14px; line-height: 1.5; }.gm .panel-actions{ display: grid; gap: 9px; padding: 18px; }.gm .button{ min-height: 46px; padding: 10px 17px; border: 0; border-radius: 11px; font-weight: 800; cursor: pointer; transition: transform .15s, background .15s; }.gm .button:hover{ transform: translateY(-1px); }.gm .button:focus-visible,.gm .room-nav:focus-visible,.gm summary:focus-visible{ outline: 3px solid rgba(91,92,226,.28); outline-offset: 2px; }.gm .button-primary{ background: var(--primary); color: #fff; }.gm .button-primary:hover{ background: var(--primary-dark); }.gm .button-secondary{ background: #ececff; color: var(--primary-dark); }.gm .button-quiet{ border: 1px solid var(--border); background: #fff; color: var(--muted); }.gm .mobile-room-nav{ display: none; }.gm .instruction-list{ display: grid; gap: 16px; margin: 25px 0 0; padding: 0; list-style: none; }.gm .instruction-list li{ display: grid; grid-template-columns: 42px 1fr; gap: 13px; }.gm .instruction-list li > span{ display: grid; place-items: center; width: 42px; height: 42px; border-radius: 10px; background: #efefff; color: var(--primary); font-weight: 800; }.gm .instruction-list strong{ font-size: 17px; }.gm .instruction-list p{ margin: 1px 0 0; color: var(--muted); font-size: 15px; }.gm .controls-list{ margin: 0; }.gm .controls-list div{ display: flex; justify-content: space-between; gap: 15px; padding: 14px 0; border-bottom: 1px solid var(--border); }.gm .controls-list dt{ font-weight: 800; }.gm .controls-list dd{ margin: 0; color: var(--muted); text-align: right; }.gm .best-score{ margin: 22px 0 0; padding: 12px; border-radius: 10px; background: #f7f7fb; font-size: 15px; }.gm .coming-soon{ color: var(--primary); font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: .05em; }.gm details{ border-bottom: 1px solid var(--border); }.gm summary{ padding: 18px 2px; font-weight: 800; cursor: pointer; }.gm details p{ margin: -4px 0 20px; color: var(--muted); }.gm .modal-backdrop{ position: fixed; inset: 0; z-index: 1000; display: none; place-items: center; padding: 20px; background: rgba(13,18,30,.78); backdrop-filter: blur(5px); }.gm .modal-backdrop.open{ display: grid; }.gm .modal{ position: relative; width: min(520px, 100%); max-height: calc(100vh - 40px); overflow-y: auto; padding: 34px; border-radius: 19px; background: #fff; box-shadow: 0 25px 80px rgba(0,0,0,.35); }.gm .modal h2{ margin: 0 0 13px; font-size: 32px; line-height: 1.16; }.gm .modal p{ color: var(--muted); }.gm .modal .button-primary{ width: 100%; margin-top: 12px; }.gm .modal-close{ position: absolute; right: 15px; top: 12px; width: 38px; height: 38px; border: 0; border-radius: 50%; background: #f1f2f6; color: var(--text); font-size: 25px; cursor: pointer; }.gm .code-form{ display: grid; gap: 15px; margin-top: 20px; }.gm .code-input{ width: 100%; height: 64px; border: 2px solid var(--border); border-radius: 12px; background: #f8f9fc; color: var(--text); font-size: 28px; font-weight: 800; letter-spacing: .3em; text-align: center; }.gm .code-input:focus{ border-color: var(--primary); outline: 3px solid rgba(91,92,226,.15); }.gm .puzzle-help{ margin: 0; font-size: 15px; }.gm .puzzle-error{ min-height: 22px; margin: 0; color: var(--danger) !important; font-size: 14px; font-weight: 700; }.gm .dial-row{ display: flex; justify-content: center; gap: 12px; margin: 22px 0; }.gm .dial{ display: grid; gap: 6px; }.gm .dial button{ width: 58px; height: 42px; border: 0; border-radius: 9px; background: #ececff; color: var(--primary-dark); font-weight: 800; cursor: pointer; }.gm .dial output{ display: grid; place-items: center; width: 58px; height: 62px; border-radius: 10px; background: #1b2535; color: #ffdb79; font-size: 28px; font-weight: 800; }.gm .win-modal{ text-align: center; }.gm .win-emblem{ display: grid; place-items: center; width: 70px; height: 70px; margin: 0 auto 17px; border-radius: 50%; background: #fff2cc; color: #b77a00; font-size: 34px; }.gm .final-stats{ display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin: 22px 0 5px; }.gm .final-stats div{ padding: 12px 5px; border-radius: 10px; background: #f7f7fb; }.gm .final-stats span{ display: block; color: var(--muted); font-size: 11px; font-weight: 800; text-transform: uppercase; }.gm .final-stats strong{ font-size: 20px; }@media (max-width: 900px){.gm .game-layout{ grid-template-columns: 1fr; }.gm .side-panel{ display: grid; grid-template-columns: 1.15fr 1fr; }.gm .panel-actions{ grid-column: 1 / -1; grid-template-columns: 1fr 1fr; }.gm .objective-section{ border-left: 1px solid var(--border); }.gm .game-layout{ min-height: auto; }}@media (max-width: 680px){.gm .game-card{ margin-inline: -12px; border-radius: 0; border-left: 0; border-right: 0; }.gm .game-topbar{ align-items: flex-start; padding: 16px; }.gm .game-topbar h2{ font-size: 21px; }.gm .stats{ gap: 13px; }.gm .stats strong{ font-size: 17px; }.gm .stats span{ font-size: 9px; }.gm .scene{ min-height: 430px; transform: translateZ(0); }.gm .clock{ left: 5%; transform: scale(.75); transform-origin: top left; }.gm .portrait{ left: 32%; transform: scale(.75); transform-origin: top left; }.gm .desk{ left: 13%; bottom: 16%; transform: scale(.78); transform-origin: bottom left; }.gm .drawer{ left: calc(13% + 128px); bottom: calc(16% + 34px); transform: scale(.78); transform-origin: bottom left; }.gm .rug{ left: 10%; width: 270px; }.gm .greenhouse-door{ right: 2%; bottom: 13%; transform: scale(.75); transform-origin: bottom right; }.gm .observatory-door{ right: 25%; top: 18%; transform: scale(.75); transform-origin: top right; }.gm .plant{ left: 1%; transform: scale(.75); transform-origin: bottom left; }.gm .mosaic{ left: 28%; transform: scale(.68); transform-origin: top left; }.gm .star-vane{ right: 2%; transform: scale(.75); transform-origin: top right; }.gm .chest{ left: 32%; transform: scale(.8); transform-origin: bottom left; }.gm .back-door{ left: 1%; transform: scale(.75); transform-origin: top left; }.gm .message-box{ grid-template-columns: 1fr; gap: 2px; min-height: 92px; padding: 11px 15px; }.gm .message-box p{ font-size: 14px; }.gm .side-panel{ display: block; }.gm .inventory{ grid-template-columns: repeat(4, 1fr); min-height: 70px; }.gm .inventory-item{ min-height: 64px; }.gm .objective-section{ border-left: 0; }.gm .panel-actions{ grid-template-columns: 1fr 1fr; }.gm .mobile-room-nav{ display: grid; grid-template-columns: 1fr 1fr; padding: 10px; border-top: 1px solid var(--border); background: #fff; }.gm .room-nav{ min-height: 42px; border: 0; border-radius: 9px; background: transparent; color: var(--muted); font-weight: 800; }.gm .room-nav.active{ background: #ececff; color: var(--primary-dark); }.gm .modal{ padding: 27px 22px; }.gm .modal h2{ font-size: 27px; }}@media (max-width: 410px){.gm .stats{ gap: 8px; }.gm .game-topbar{ gap: 8px; }.gm .game-topbar h2{ font-size: 18px; }.gm .scene{ min-height: 400px; }.gm .panel-actions{ grid-template-columns: 1fr; }.gm .inventory{ grid-template-columns: repeat(2, 1fr); }.gm .final-stats{ grid-template-columns: 1fr; }}@media (prefers-reduced-motion: reduce){.gm *,.gm *::before,.gm *::after{ scroll-behavior: auto !important; animation-duration: .01ms !important; animation-iteration-count: 1 !important; transition-duration: .01ms !important; }}";
function __ready(f){f()}
function boot(){
"use strict";

const SAVE_KEY = "clockwork-study-save-v1";
const BEST_KEY = "clockwork-study-best-v1";

const freshState = () => ({
  started: false,
  finished: false,
  room: "study",
  startTime: 0,
  elapsedBeforeLoad: 0,
  score: 1000,
  clues: [],
  inventory: [],
  selectedItem: null,
  flags: {
    rugLifted: false,
    drawerOpen: false,
    portraitRevealed: false,
    chestOpen: false,
    clockRepaired: false,
    observatoryUnlocked: false
  },
  tokens: [],
  hintsUsed: 0,
  wrongAttempts: 0
});

let state = freshState();
let timerId = null;
let lastFocusedElement = null;

const elements = {
  scene: document.getElementById("scene"),
  message: document.getElementById("message"),
  score: document.getElementById("score"),
  timer: document.getElementById("timer"),
  clueCount: document.getElementById("clue-count"),
  inventory: document.getElementById("inventory"),
  inventoryCount: document.getElementById("inventory-count"),
  objective: document.getElementById("objective"),
  roomLabel: document.getElementById("room-label"),
  hintButton: document.getElementById("hint-button"),
  restartButton: document.getElementById("restart-button"),
  startModal: document.getElementById("start-modal"),
  startButton: document.getElementById("start-button"),
  puzzleModal: document.getElementById("puzzle-modal"),
  puzzleTitle: document.getElementById("puzzle-title"),
  puzzleEyebrow: document.getElementById("puzzle-eyebrow"),
  puzzleBody: document.getElementById("puzzle-body"),
  puzzleClose: document.getElementById("puzzle-close"),
  winModal: document.getElementById("win-modal"),
  finalScore: document.getElementById("final-score"),
  finalTime: document.getElementById("final-time"),
  finalTokens: document.getElementById("final-tokens"),
  playAgain: document.getElementById("play-again"),
  bestScore: document.getElementById("best-score")
};

const itemData = {
  brassKey: { name: "Brass key", icon: "⚿", description: "A small key found beneath the rug." },
  lens: { name: "Blue lens", icon: "◉", description: "A tinted glass lens from the locked drawer." },
  clockKey: { name: "Clock key", icon: "♢", description: "A winding key recovered from the greenhouse chest." },
  gear: { name: "Silver gear", icon: "✣", description: "The clock released this precisely cut gear." }
};

function elapsedSeconds() {
  if (!state.started) return state.elapsedBeforeLoad || 0;
  return state.elapsedBeforeLoad + Math.floor((Date.now() - state.startTime) / 1000);
}

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function calculatedScore() {
  const timePenalty = Math.min(300, Math.floor(elapsedSeconds() / 10));
  return Math.max(100, state.score - timePenalty + state.tokens.length * 100);
}

function saveGame() {
  if (!state.started || state.finished) return;
  const snapshot = { ...state, elapsedBeforeLoad: elapsedSeconds(), startTime: 0 };
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(snapshot)); } catch (_) { /* Storage can be unavailable in private mode. */ }
}

function loadGame() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return false;
    const parsed = JSON.parse(raw);
    if (!parsed || parsed.finished) return false;
    state = { ...freshState(), ...parsed, flags: { ...freshState().flags, ...(parsed.flags || {}) } };
    state.startTime = Date.now();
    state.started = true;
    return true;
  } catch (_) {
    state = freshState();
    return false;
  }
}

function showMessage(speaker, text) {
  const speakerEl = elements.message.querySelector(".speaker");
  const textEl = elements.message.querySelector("p");
  speakerEl.textContent = speaker;
  textEl.textContent = text;
  elements.message.classList.remove("flash");
  void elements.message.offsetWidth;
  elements.message.classList.add("flash");
}

function addClue(clue) {
  if (!state.clues.includes(clue)) state.clues.push(clue);
}

function addItem(item) {
  if (!state.inventory.includes(item)) state.inventory.push(item);
}

function removeItem(item) {
  state.inventory = state.inventory.filter(current => current !== item);
  if (state.selectedItem === item) state.selectedItem = null;
}

function setObjective() {
  let objective = "Search the study for clues and useful objects.";
  if (!state.flags.drawerOpen && state.inventory.includes("brassKey")) objective = "Find where the small brass key fits.";
  if (state.flags.drawerOpen && !state.flags.portraitRevealed) objective = "Try the blue lens on something that hides details.";
  if (state.flags.portraitRevealed && !state.flags.chestOpen) objective = "Use the portrait's symbol order to open the greenhouse chest.";
  if (state.flags.chestOpen && !state.flags.clockRepaired) objective = "Use the winding key on the stopped clock.";
  if (state.flags.clockRepaired && !state.flags.observatoryUnlocked) objective = "Fit the silver gear into the observatory door.";
  if (state.flags.observatoryUnlocked && !state.finished) objective = "Solve the observatory's final alignment lock.";
  if (state.finished) objective = "Adventure complete.";
  elements.objective.textContent = objective;
}

function renderInventory() {
  elements.inventory.innerHTML = "";
  elements.inventoryCount.textContent = `${state.inventory.length}/4`;
  if (!state.inventory.length) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "Items you collect appear here.";
    elements.inventory.appendChild(empty);
    return;
  }

  state.inventory.forEach(item => {
    const data = itemData[item];
    const button = document.createElement("button");
    button.type = "button";
    button.className = `inventory-item${state.selectedItem === item ? " selected" : ""}`;
    button.dataset.item = item;
    button.setAttribute("aria-pressed", state.selectedItem === item ? "true" : "false");
    button.setAttribute("aria-label", `${data.name}. ${data.description}`);
    button.innerHTML = `<span class="item-icon" aria-hidden="true">${data.icon}</span><span class="item-name">${data.name}</span>`;
    elements.inventory.appendChild(button);
  });
}

function updateStats() {
  elements.timer.textContent = formatTime(elapsedSeconds());
  elements.score.textContent = calculatedScore();
  elements.clueCount.textContent = `${state.clues.length}/8`;
  let best = 0;
  try { best = Number(localStorage.getItem(BEST_KEY) || 0); } catch (_) { /* Storage is optional. */ }
  elements.bestScore.textContent = best ? best.toString() : "—";
}

function renderRoom() {
  if (state.room === "study") renderStudy(); else renderGreenhouse();
  document.querySelectorAll(".room-nav").forEach(button => button.classList.toggle("active", button.dataset.room === state.room));
}

function renderStudy() {
  elements.scene.className = "scene scene-study";
  elements.scene.setAttribute("aria-label", "The inventor's study. Explore the visible objects.");
  elements.scene.innerHTML = `
    <div class="room-label" id="room-label">Inventor's Study</div>
    <button class="hotspot clock${state.flags.clockRepaired ? " repaired" : ""}" data-action="clock" aria-label="Examine the stopped clock"><span class="clock-face"><i></i><b></b></span><span class="hotspot-label">Clock</span></button>
    <button class="hotspot portrait${state.flags.portraitRevealed ? " revealed" : ""}" data-action="portrait" aria-label="Examine the strange portrait"><span class="portrait-art"><i>✦</i><b>☾</b><em>☀</em></span><span class="hotspot-label">Portrait</span></button>
    <button class="hotspot desk" data-action="desk" aria-label="Examine the writing desk"><span class="desk-lamp"></span><span class="hotspot-label">Desk</span></button>
    <button class="hotspot drawer${state.flags.drawerOpen ? " open" : ""}" data-action="drawer" aria-label="Open the desk drawer"><span class="keyhole"></span><span class="hotspot-label">Drawer</span></button>
    <button class="hotspot rug${state.flags.rugLifted ? " lifted" : ""}" data-action="rug" aria-label="Lift the corner of the rug"><span class="rug-pattern"></span><span class="hotspot-label">Rug</span></button>
    <button class="hotspot study-token token${state.tokens.includes("study") ? " collected" : ""}" data-action="token-study" aria-label="Pick up a hidden brass token"><span>✦</span></button>
    <button class="hotspot door greenhouse-door" data-action="greenhouse" aria-label="Go to the greenhouse"><span class="door-window"></span><span class="door-knob"></span><span class="hotspot-label">Greenhouse</span></button>
    <button class="hotspot observatory-door${state.flags.observatoryUnlocked ? " unlocked" : ""}" data-action="observatory" aria-label="Examine the observatory door"><span class="gear-slot">✣</span><span class="hotspot-label">Observatory</span></button>`;
}

function renderGreenhouse() {
  elements.scene.className = "scene scene-greenhouse";
  elements.scene.setAttribute("aria-label", "The glass greenhouse. Explore the flower, moon mosaic, weather vane, and chest.");
  elements.scene.innerHTML = `
    <div class="room-label" id="room-label">Glass Greenhouse</div>
    <div class="greenhouse-floor" aria-hidden="true"></div>
    <button class="hotspot plant" data-action="flower" aria-label="Examine the golden flower"><span class="flower-shape"></span><span class="hotspot-label">Golden flower</span></button>
    <button class="hotspot mosaic" data-action="mosaic" aria-label="Examine the moon phase mosaic"><span class="moon-phases"><span></span><span></span><span></span><span></span></span><span class="hotspot-label">Moon mosaic</span></button>
    <button class="hotspot star-vane" data-action="star" aria-label="Examine the star weather vane"><span class="star-shape"></span><span class="hotspot-label">Star vane</span></button>
    <button class="hotspot chest${state.flags.chestOpen ? " open" : ""}" data-action="chest" aria-label="Examine the coded chest"><span class="hotspot-label">Coded chest</span></button>
    <button class="hotspot greenhouse-token token${state.tokens.includes("greenhouse") ? " collected" : ""}" data-action="token-greenhouse" aria-label="Pick up a hidden brass token"><span>✦</span></button>
    <button class="hotspot back-door door" data-action="study" aria-label="Return to the study"><span class="hotspot-label">Study</span></button>`;
}

function render() {
  renderRoom();
  renderInventory();
  setObjective();
  updateStats();
  saveGame();
}

function moveTo(room) {
  state.room = room;
  state.selectedItem = null;
  render();
  showMessage("Narrator", room === "study" ? "You return to the quiet study." : "Moist air and moonlight fill the greenhouse.");
}

function collectToken(location) {
  if (state.tokens.includes(location)) return;
  state.tokens.push(location);
  showMessage("Discovery", "A hidden inventor’s token! It adds 100 bonus points.");
  render();
}

function useSelected(requiredItem, success) {
  if (state.selectedItem !== requiredItem) return false;
  success();
  return true;
}

function handleAction(action) {
  if (!state.started || state.finished) return;
  switch (action) {
    case "rug":
      if (!state.flags.rugLifted) {
        state.flags.rugLifted = true;
        addItem("brassKey");
        addClue("hidden-key");
        showMessage("Discovery", "Beneath the rug is a small brass key. It looks like a desk key.");
      } else showMessage("Narrator", "Only dust remains beneath the lifted rug.");
      render();
      break;
    case "desk":
      addClue("time-note");
      showMessage("Professor Orin's note", "‘When the long hand finds four and the short hand passes seven, the heart may turn again.’");
      render();
      break;
    case "drawer":
      if (state.flags.drawerOpen) {
        showMessage("Narrator", "The drawer is empty; you already took the blue lens.");
      } else if (useSelected("brassKey", () => {
        state.flags.drawerOpen = true;
        removeItem("brassKey");
        addItem("lens");
        showMessage("Discovery", "The key turns. Inside rests a blue glass lens in a velvet sleeve.");
      })) render();
      else showMessage("Narrator", "The drawer is locked with a very small brass keyhole.");
      break;
    case "portrait":
      if (state.flags.portraitRevealed) {
        showMessage("Hidden inscription", "The symbols read from left to right: STAR, MOON, SUN.");
      } else if (useSelected("lens", () => {
        state.flags.portraitRevealed = true;
        addClue("symbol-order");
        removeItem("lens");
        showMessage("Hidden inscription", "Through the blue lens, three symbols glow beneath the portrait: STAR, MOON, SUN.");
      })) render();
      else showMessage("Narrator", "The portrait’s varnish has an odd blue shimmer. Your eyes cannot make out what lies beneath it.");
      break;
    case "greenhouse": moveTo("greenhouse"); break;
    case "study": moveTo("study"); break;
    case "flower":
      addClue("sun-five");
      showMessage("Observation", "The golden flower is shaped like a sun. It has five broad petals.");
      render();
      break;
    case "mosaic":
      addClue("moon-four");
      showMessage("Observation", "The mosaic displays four distinct phases of the moon.");
      render();
      break;
    case "star":
      addClue("star-eight");
      showMessage("Observation", "The brass star has eight carefully cut points.");
      render();
      break;
    case "chest":
      if (state.flags.chestOpen) showMessage("Narrator", "The open chest is empty.");
      else openCodePuzzle();
      break;
    case "clock":
      if (state.flags.clockRepaired) showMessage("Clock", "Tick. Tock. The restored hands still point to 7:20.");
      else if (useSelected("clockKey", () => openClockPuzzle())) { /* Puzzle opens. */ }
      else showMessage("Narrator", "The clock is stopped. A square winding socket sits below its face.");
      break;
    case "observatory":
      if (state.flags.observatoryUnlocked) openFinalPuzzle();
      else if (useSelected("gear", () => {
        state.flags.observatoryUnlocked = true;
        removeItem("gear");
        showMessage("Mechanism", "The silver gear fits. Three star dials wake behind the door.");
        render();
        openFinalPuzzle();
      })) { /* Final puzzle opens. */ }
      else showMessage("Narrator", "A gear-shaped gap interrupts the observatory door’s mechanism.");
      break;
    case "token-study": collectToken("study"); break;
    case "token-greenhouse": collectToken("greenhouse"); break;
    default: break;
  }
}

function openModal(title, eyebrow, html) {
  lastFocusedElement = document.activeElement;
  elements.puzzleTitle.textContent = title;
  elements.puzzleEyebrow.textContent = eyebrow;
  elements.puzzleBody.innerHTML = html;
  elements.puzzleModal.classList.add("open");
  elements.puzzleModal.setAttribute("aria-hidden", "false");
  const focusTarget = elements.puzzleBody.querySelector("input, button") || elements.puzzleClose;
  requestAnimationFrame(() => focusTarget.focus());
}

function closePuzzle() {
  elements.puzzleModal.classList.remove("open");
  elements.puzzleModal.setAttribute("aria-hidden", "true");
  elements.puzzleBody.innerHTML = "";
  if (lastFocusedElement && document.contains(lastFocusedElement)) lastFocusedElement.focus();
}

function penalize(amount) {
  state.score = Math.max(100, state.score - amount);
  state.wrongAttempts += 1;
  updateStats();
  saveGame();
}

function openCodePuzzle() {
  openModal("The Greenhouse Chest", "Three-digit lock", `
    <p class="puzzle-help">Three engraved slots sit beneath the same symbols found in the portrait. Enter the values in the correct order.</p>
    <form id="code-form" class="code-form">
      <label for="chest-code">STAR · MOON · SUN</label>
      <input id="chest-code" class="code-input" type="text" inputmode="numeric" autocomplete="off" maxlength="3" pattern="[0-9]{3}" aria-describedby="code-error">
      <p id="code-error" class="puzzle-error" aria-live="polite"></p>
      <button class="button button-primary" type="submit">Try the combination</button>
    </form>`);
  document.getElementById("code-form").addEventListener("submit", event => {
    event.preventDefault();
    const input = document.getElementById("chest-code");
    if (input.value === "845") {
      state.flags.chestOpen = true;
      addItem("clockKey");
      addClue("chest-open");
      closePuzzle();
      render();
      showMessage("Discovery", "The chest clicks open. Inside is a square clock-winding key.");
    } else {
      penalize(15);
      document.getElementById("code-error").textContent = "The lock rejects that sequence. Check both the order and each count. −15 points";
      input.select();
    }
  });
}

function openClockPuzzle() {
  openModal("Set the Stopped Clock", "Mechanical puzzle", `
    <p class="puzzle-help">The winding key fits, but the hands must match Orin’s written clue before the mechanism will start.</p>
    <form id="clock-form" class="code-form">
      <label for="clock-time">Set the time</label>
      <input id="clock-time" class="code-input" type="time" value="06:00" step="300" aria-describedby="clock-error">
      <p id="clock-error" class="puzzle-error" aria-live="polite"></p>
      <button class="button button-primary" type="submit">Wind the clock</button>
    </form>`);
  document.getElementById("clock-form").addEventListener("submit", event => {
    event.preventDefault();
    const value = document.getElementById("clock-time").value;
    if (value === "07:20" || value === "19:20") {
      state.flags.clockRepaired = true;
      removeItem("clockKey");
      addItem("gear");
      addClue("clock-repaired");
      closePuzzle();
      render();
      showMessage("Clock", "At 7:20 the clock begins to tick. A silver gear drops into its lower compartment.");
    } else {
      penalize(15);
      document.getElementById("clock-error").textContent = "The hands lock in place. Re-read the note on the desk. −15 points";
    }
  });
}

function openFinalPuzzle() {
  openModal("The Celestial Alignment", "Final mechanism", `
    <p class="puzzle-help">Three dials show the symbols from the portrait. Align each one with the value learned in the greenhouse.</p>
    <div class="dial-row" aria-label="Star, moon, and sun dials">
      ${dialMarkup("star-dial", "Star", 1)}
      ${dialMarkup("moon-dial", "Moon", 1)}
      ${dialMarkup("sun-dial", "Sun", 1)}
    </div>
    <p id="dial-error" class="puzzle-error" aria-live="polite"></p>
    <button id="align-button" class="button button-primary" type="button">Align the mechanism</button>`);

  elements.puzzleBody.querySelectorAll(".dial button").forEach(button => {
    button.addEventListener("click", () => {
      const output = document.getElementById(button.dataset.target);
      let value = Number(output.value);
      value += button.dataset.direction === "up" ? 1 : -1;
      if (value > 9) value = 1;
      if (value < 1) value = 9;
      output.value = value;
      output.textContent = value;
    });
  });

  document.getElementById("align-button").addEventListener("click", () => {
    const values = ["star-dial", "moon-dial", "sun-dial"].map(id => Number(document.getElementById(id).value));
    if (values.join("") === "845") finishGame();
    else {
      penalize(20);
      document.getElementById("dial-error").textContent = "The gears grind and return. The symbols follow the portrait's order. −20 points";
    }
  });
}

function dialMarkup(id, label, value) {
  return `<div class="dial"><span>${label}</span><button type="button" data-target="${id}" data-direction="up" aria-label="Increase ${label} dial">▲</button><output id="${id}" aria-label="${label} value" value="${value}">${value}</output><button type="button" data-target="${id}" data-direction="down" aria-label="Decrease ${label} dial">▼</button></div>`;
}

function finishGame() {
  state.finished = true;
  const finalTime = formatTime(elapsedSeconds());
  if (!state.tokens.includes("observatory")) state.tokens.push("observatory");
  const withFinalToken = calculatedScore();
  clearInterval(timerId);
  closePuzzle();
  try {
    const best = Number(localStorage.getItem(BEST_KEY) || 0);
    if (withFinalToken > best) localStorage.setItem(BEST_KEY, withFinalToken.toString());
    localStorage.removeItem(SAVE_KEY);
  } catch (_) { /* Continue without persistence. */ }
  elements.finalScore.textContent = withFinalToken;
  elements.finalTime.textContent = finalTime;
  elements.finalTokens.textContent = `${state.tokens.length}/3`;
  elements.winModal.classList.add("open");
  elements.winModal.setAttribute("aria-hidden", "false");
  elements.playAgain.focus();
  render();
}

function giveHint() {
  if (!state.started || state.finished) return;
  const hints = [];
  if (!state.flags.rugLifted) hints.push("A corner of the patterned rug does not lie flat.");
  else if (!state.flags.drawerOpen) hints.push("Select the brass key in your inventory, then click the desk drawer.");
  else if (!state.flags.portraitRevealed) hints.push("The blue lens reveals details hidden by a bluish surface.");
  else if (!state.flags.chestOpen) {
    if (!state.clues.includes("star-eight") || !state.clues.includes("moon-four") || !state.clues.includes("sun-five")) hints.push("The portrait gives an order. Count matching shapes in the greenhouse.");
    else hints.push("The chest code follows STAR, MOON, SUN: 8, 4, 5.");
  } else if (!state.flags.clockRepaired) hints.push("Select the clock key, use it on the study clock, and interpret the note on the desk as 7:20.");
  else if (!state.flags.observatoryUnlocked) hints.push("Select the silver gear, then click the observatory door.");
  else hints.push("The final dials use the same STAR, MOON, SUN values as the greenhouse chest.");
  state.hintsUsed += 1;
  state.score = Math.max(100, state.score - 25);
  showMessage("Hint", `${hints[0]} (−25 points)`);
  updateStats();
  saveGame();
}

function resetGame(confirmReset = true) {
  if (confirmReset && state.started && !state.finished && !window.confirm("Restart the adventure and clear this run?")) return;
  try { localStorage.removeItem(SAVE_KEY); } catch (_) { /* Ignore storage failure. */ }
  clearInterval(timerId);
  state = freshState();
  render();
  elements.winModal.classList.remove("open");
  elements.winModal.setAttribute("aria-hidden", "true");
  elements.startModal.classList.add("open");
  elements.startButton.focus();
  showMessage("Narrator", "Every object may hide part of the inventor’s secret. Look closely.");
}

function startGame() {
  state.started = true;
  state.startTime = Date.now();
  elements.startModal.classList.remove("open");
  render();
  timerId = window.setInterval(updateStats, 1000);
  showMessage("Narrator", "The tower door closes behind you. Search the study before midnight.");
  const firstHotspot = elements.scene.querySelector(".hotspot");
  if (firstHotspot) firstHotspot.focus();
}

elements.scene.addEventListener("click", event => {
  const hotspot = event.target.closest("[data-action]");
  if (hotspot) handleAction(hotspot.dataset.action);
});

elements.inventory.addEventListener("click", event => {
  const button = event.target.closest("[data-item]");
  if (!button) return;
  const item = button.dataset.item;
  state.selectedItem = state.selectedItem === item ? null : item;
  renderInventory();
  showMessage("Inventory", state.selectedItem ? `${itemData[item].name} selected. Now choose where to use it.` : `${itemData[item].name} put away.`);
  saveGame();
});

document.querySelectorAll(".room-nav").forEach(button => button.addEventListener("click", () => moveTo(button.dataset.room)));
elements.hintButton.addEventListener("click", giveHint);
elements.restartButton.addEventListener("click", () => resetGame(true));
elements.startButton.addEventListener("click", startGame);
elements.puzzleClose.addEventListener("click", closePuzzle);
elements.playAgain.addEventListener("click", () => resetGame(false));

elements.puzzleModal.addEventListener("click", event => {
  if (event.target === elements.puzzleModal) closePuzzle();
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape" && elements.puzzleModal.classList.contains("open")) closePuzzle();
  if (event.key.toLowerCase() === "h" && !event.target.matches("input")) giveHint();
});

window.addEventListener("beforeunload", saveGame);
document.addEventListener("visibilitychange", () => { if (document.hidden) saveGame(); });

function initialize() {
  const resumed = loadGame();
  render();
  if (resumed) {
    elements.startModal.classList.remove("open");
    timerId = window.setInterval(updateStats, 1000);
    showMessage("Welcome back", "Your investigation resumes where you left it.");
  } else {
    elements.startButton.focus();
  }
}

initialize();


}
function begin(){poster.hidden=true;gm.hidden=false;if(!booted){booted=true;var s=document.createElement("style");s.textContent=LOOK;document.head.appendChild(s);boot();}else{var r=document.getElementById("restart-button");if(r)r.click();}}
poster.addEventListener("click",begin);
var nb=document.getElementById("new");if(nb)nb.addEventListener("click",begin);
})();
