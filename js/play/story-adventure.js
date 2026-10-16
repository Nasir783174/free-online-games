/* Story Adventure - game logic + its own look. Layout lives in style.css; page shell lives in the HTML. */
(function(){"use strict";
var gm=document.getElementById("gm"),poster=document.getElementById("poster"),booted=false;
var LOOK=".gm{\n  \n  \n  --teal: #16b8c4;\n  --gold: #ffb84d;\n  --danger: #ef5b5b;\n  \n  \n  --ink: #171b2d;\n  \n  \n  --night: #101827;\n  --night-soft: #1f2937;\n  \n}.gm *{ box-sizing: border-box; }.gm button{ font: inherit; }.gm .all-games{ color: var(--brand-dark); font-size: 15px; font-weight: 800; text-decoration: none; }.gm .all-games:hover{ text-decoration: underline; }.gm .game-intro{ padding: 18px 0 34px; display: flex; gap: 32px; align-items: end; justify-content: space-between; }.gm .game-intro > div:first-child{ max-width: 760px; }.gm h2,.gm h3,.gm p{ overflow-wrap: break-word; }.gm .game-intro p:last-child{ margin: 16px 0 0; color: var(--muted); font-size: 18px; max-width: 700px; }.gm .game-shell{ overflow: hidden; background: var(--night); border-radius: 20px; box-shadow: var(--shadow); }.gm .game-topbar{ min-height: 76px; padding: 14px 22px; color: #fff; border-bottom: 1px solid rgba(255,255,255,.11); display: flex; justify-content: space-between; align-items: center; gap: 20px; }.gm .label,.gm .stat small{ display: block; color: #aeb7c7; font-size: 12px; font-weight: 700; letter-spacing: .07em; text-transform: uppercase; }.gm .chapter-wrap strong{ font-size: 18px; }.gm .stats{ display: flex; gap: 12px; }.gm .stat{ min-width: 92px; display: grid; grid-template-columns: 20px 1fr; align-items: center; padding: 7px 10px; background: rgba(255,255,255,.07); border-radius: 10px; }.gm .stat > span{ grid-row: 1 / 3; color: var(--gold); }.gm .stat strong{ font-size: 19px; line-height: 1.1; }.gm .stat.courage > span{ color: #ff7676; }.gm .stat.supplies > span{ color: #5de1d2; }.gm .story-stage{ min-height: 575px; position: relative; isolation: isolate; display: grid; place-items: center; padding: 54px 24px; overflow: hidden; background: linear-gradient(180deg, #15233a 0%, #233957 55%, #152234 100%); transition: background .45s ease; }.gm .story-stage[data-mood=\"forest\"]{ background: linear-gradient(180deg, #15283a, #173f3c 58%, #102624); }.gm .story-stage[data-mood=\"river\"]{ background: linear-gradient(180deg, #142944, #1b5266 58%, #122d3b); }.gm .story-stage[data-mood=\"ruins\"]{ background: linear-gradient(180deg, #251f3c, #493e64 58%, #262138); }.gm .story-stage[data-mood=\"mountain\"]{ background: linear-gradient(180deg, #1b2438, #43516a 58%, #222b3d); }.gm .story-stage[data-mood=\"ending\"]{ background: linear-gradient(180deg, #2b2352, #5b4172 55%, #2d254b); }.gm .scene-art,.gm .scene-art > *{ position: absolute; }.gm .scene-art{ inset: 0; z-index: -1; overflow: hidden; }.gm .moon{ width: 94px; height: 94px; top: 54px; right: 12%; border-radius: 50%; background: #fff2c7; box-shadow: 0 0 45px rgba(255, 237, 177, .26); opacity: .85; }.gm .mountain{ left: -10%; bottom: -10%; width: 120%; height: 62%; transform-origin: center bottom; clip-path: polygon(0 100%, 0 58%, 12% 38%, 21% 61%, 37% 13%, 50% 56%, 66% 28%, 78% 61%, 89% 36%, 100% 64%, 100% 100%); }.gm .mountain-back{ background: rgba(9,20,33,.35); transform: scale(.92); }.gm .mountain-front{ background: rgba(7,14,24,.60); transform: translateY(18%); }.gm .lantern{ left: 9%; top: 29%; width: 42px; height: 58px; border: 4px solid rgba(255,255,255,.38); border-radius: 8px; transform: rotate(-4deg); }.gm .lantern::before{ content: \"\"; position: absolute; left: 8px; right: 8px; top: -18px; height: 18px; border: 3px solid rgba(255,255,255,.38); border-bottom: 0; border-radius: 12px 12px 0 0; }.gm .lantern span{ inset: 10px; display: block; background: var(--gold); border-radius: 50% 50% 42% 42%; box-shadow: 0 0 38px 15px rgba(255,184,77,.28); animation: flicker 2.2s ease-in-out infinite; }.gm .mist{ width: 55%; height: 52px; border-radius: 50%; background: rgba(235,243,250,.09); filter: blur(12px); }.gm .mist-one{ left: -10%; top: 48%; animation: drift 12s linear infinite alternate; }.gm .mist-two{ right: -12%; top: 69%; animation: drift 15s linear infinite alternate-reverse; }.gm .story-card{ width: min(700px, 100%); padding: 30px; background: rgba(255,255,255,.97); border: 1px solid rgba(255,255,255,.7); border-radius: 18px; box-shadow: 0 22px 60px rgba(0,0,0,.26); }.gm .scene-number{ margin: 0 0 5px; color: var(--brand-dark); font-size: 13px; font-weight: 800; letter-spacing: .1em; text-transform: uppercase; }.gm .story-card h2{ margin: 0; font-size: clamp(26px, 4vw, 34px); line-height: 1.2; }.gm .story-card > p:not(.scene-number):not(.keyboard-hint){ margin: 14px 0 0; color: #4e596d; }.gm .discovery{ margin-top: 16px; padding: 11px 14px; display: flex; gap: 11px; align-items: flex-start; color: #563d0d; background: #fff7df; border: 1px solid #f8d886; border-radius: 12px; }.gm .discovery[hidden]{ display: none; }.gm .discovery p{ margin: 0; line-height: 1.35; }.gm .discovery > span{ color: #e89b18; font-size: 22px; }.gm .choices{ margin-top: 22px; display: grid; gap: 10px; }.gm .choice-button{ width: 100%; min-height: 52px; padding: 12px 14px; text-align: left; color: var(--ink); background: #f8f8fc; border: 1px solid #dfe1eb; border-radius: 12px; cursor: pointer; display: flex; gap: 12px; align-items: center; font-weight: 700; transition: transform .15s ease, border-color .15s ease, background .15s ease; }.gm .choice-button:hover{ transform: translateY(-1px); border-color: var(--brand); background: #f1f1ff; }.gm .choice-button:focus-visible,.gm .restart-button:focus-visible,.gm summary:focus-visible{ outline: 3px solid #f3af37; outline-offset: 3px; }.gm .choice-number{ flex: 0 0 auto; width: 28px; height: 28px; display: grid; place-items: center; color: #fff; background: var(--brand); border-radius: 8px; font-size: 14px; }.gm .choice-button.ending-action{ justify-content: center; color: #fff; background: var(--brand); border-color: var(--brand); text-align: center; }.gm .choice-button.ending-action .choice-number{ display: none; }.gm .keyboard-hint{ margin: 12px 0 0; color: var(--muted); font-size: 13px; text-align: center; }.gm .game-footer{ min-height: 72px; padding: 13px 22px; color: #fff; border-top: 1px solid rgba(255,255,255,.11); display: flex; align-items: center; justify-content: space-between; gap: 22px; }.gm .progress-wrap{ width: min(520px, 70%); }.gm .progress-wrap > span{ color: #c7cfda; font-size: 13px; }.gm .progress-track{ height: 7px; margin-top: 5px; overflow: hidden; background: rgba(255,255,255,.13); border-radius: 99px; }.gm .progress-track span{ width: 0; height: 100%; display: block; background: linear-gradient(90deg, var(--teal), #64e7b0); border-radius: inherit; transition: width .35s ease; }.gm .restart-button{ min-height: 44px; padding: 9px 16px; color: #fff; background: transparent; border: 1px solid rgba(255,255,255,.45); border-radius: 11px; cursor: pointer; font-weight: 800; }.gm .restart-button:hover{ background: rgba(255,255,255,.09); }.gm .about-section{ padding: 76px 0; display: grid; grid-template-columns: 1.3fr .7fr; gap: 64px; }.gm h2{ margin: 0 0 16px; font-size: clamp(28px, 4vw, 36px); line-height: 1.2; letter-spacing: -.02em; }.gm h3{ margin: 0; font-size: 21px; line-height: 1.25; }.gm .about-section > p{ color: var(--muted); }.gm .steps{ margin: 25px 0 0; padding: 0; list-style: none; counter-reset: steps; display: grid; gap: 17px; }.gm .steps li{ position: relative; padding-left: 48px; }.gm .steps li::before{ counter-increment: steps; content: counter(steps); position: absolute; left: 0; top: 1px; width: 32px; height: 32px; display: grid; place-items: center; color: var(--brand-dark); background: #eeeeff; border-radius: 9px; font-weight: 800; }.gm .tips-card{ padding: 26px; align-self: start; background: #fff; border: 1px solid var(--border); border-radius: 17px; box-shadow: 0 12px 30px rgba(23,27,45,.06); }.gm .tips-card h2{ font-size: 25px; }.gm .tips-card ul{ margin: 0; padding-left: 20px; color: var(--muted); }.gm .tips-card li + li{ margin-top: 9px; }.gm .about-section{ padding-top: 68px; padding-bottom: 68px; border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); align-items: start; }.gm .about-section > p{ margin: 0; }.gm .section-heading{ display: flex; align-items: end; justify-content: space-between; gap: 20px; }.gm .section-heading > span{ color: var(--muted); font-size: 14px; }.gm .game-icon{ width: 54px; height: 54px; display: grid; place-items: center; color: var(--brand-dark); background: #eeeeff; border-radius: 14px; font-size: 24px; font-weight: 800; }.gm details{ background: #fff; border: 1px solid var(--border); border-radius: 13px; }.gm details + details{ margin-top: 10px; }.gm summary{ padding: 17px 20px; cursor: pointer; font-weight: 800; }.gm details p{ margin: 0; padding: 0 20px 18px; color: var(--muted); }.gm .noscript{ margin: 0; padding: 16px; color: #fff; background: var(--danger); text-align: center; }@keyframes flicker{ 0%,100% { transform: scale(.9); opacity: .85; } 50% { transform: scale(1.07); opacity: 1; } }@keyframes drift{ from { transform: translateX(-6%); } to { transform: translateX(14%); } }@media (prefers-reduced-motion: reduce){.gm *,.gm *::before,.gm *::after{ scroll-behavior: auto !important; animation: none !important; transition: none !important; }}@media (max-width: 780px){.gm .game-intro{ align-items: start; flex-direction: column; }.gm .game-topbar{ align-items: flex-start; flex-direction: column; }.gm .stats{ width: 100%; }.gm .stat{ flex: 1; min-width: 0; }.gm .story-stage{ min-height: 600px; padding: 32px 16px; }.gm .story-card{ padding: 23px 19px; }.gm .about-section{ grid-template-columns: 1fr; gap: 30px; }}@media (max-width: 520px){.gm .game-intro{ padding-bottom: 24px; }.gm .game-intro p:last-child{ font-size: 16px; }.gm .game-shell{ border-radius: 15px; }.gm .game-topbar,.gm .game-footer{ padding-left: 14px; padding-right: 14px; }.gm .stats{ gap: 6px; }.gm .stat{ padding: 7px 6px; grid-template-columns: 16px 1fr; }.gm .stat small{ font-size: 10px; letter-spacing: .02em; }.gm .stat strong{ font-size: 17px; }.gm .story-stage{ padding: 24px 10px; }.gm .story-card{ padding: 21px 15px; }.gm .choice-button{ min-height: 56px; padding: 11px; }.gm .game-footer{ align-items: stretch; flex-direction: column; padding-top: 15px; padding-bottom: 15px; }.gm .progress-wrap{ width: 100%; }.gm .restart-button{ width: 100%; }.gm .keyboard-hint{ display: none; }.gm .about-section{ padding-top: 56px; }.gm .section-heading{ align-items: start; flex-direction: column; gap: 0; }}";
function __ready(f){f()}
function boot(){
"use strict";

const scenes = {
  start: {
    chapter: "The Missing Light", title: "The Missing Light", mood: "village", progress: 0,
    text: "The lantern above Ember Hollow has vanished. Without its flame, the mountain mist creeps toward the village. Elder Mira presses an old compass into your hand and asks you to bring the light home before midnight.",
    choices: [
      { text: "Question the watchman at the empty tower", next: "watchman", score: 15 },
      { text: "Follow fresh tracks into Whisperwood", next: "forestFork", courage: -1, score: 25 },
      { text: "Visit the mapmaker for a safer route", next: "mapmaker", supplies: 1, score: 10 }
    ]
  },
  watchman: {
    chapter: "A Broken Watch", title: "Ash on the Wind", mood: "village", progress: 18,
    text: "The watchman admits he heard wings above the tower. On the sill you find silver ash that points north when held near Mira’s compass.",
    discovery: { title: "Clue found", text: "Silver ash — proof that a mist raven carried the lantern." },
    onEnter: { clue: "ash", score: 20 },
    choices: [
      { text: "Track the ash through Whisperwood", next: "forestFork", score: 20 },
      { text: "Cross the river toward the northern cliffs", next: "river", supplies: -1, score: 30, require: { supplies: 1 }, failText: "You need at least 1 Supply to cross safely." }
    ]
  },
  mapmaker: {
    chapter: "Lines and Legends", title: "The Mapmaker’s Warning", mood: "village", progress: 18,
    text: "Old Iven marks two routes: a hidden shrine in Whisperwood and a flooded path beside the river. He gives you a coil of rope and warns that the thief may not be your true enemy.",
    discovery: { title: "Item gained", text: "Rope and a marked map. Supplies +1." },
    choices: [
      { text: "Take the hidden path to the forest shrine", next: "shrine", score: 20 },
      { text: "Use the rope at the flooded river path", next: "river", supplies: -1, score: 30 }
    ]
  },
  forestFork: {
    chapter: "Whisperwood", title: "Voices Between the Trees", mood: "forest", progress: 30,
    text: "The trail splits beneath black pines. A distant child calls for help from the eastern path, while silver ash glimmers along the western stones.",
    choices: [
      { text: "Follow the voice and search for the child", next: "lostChild", score: 20 },
      { text: "Stay on the silver-ash trail", next: "shrine", score: 30 },
      { text: "Climb a pine to scout ahead", next: "ravenSight", courage: -1, score: 35, require: { courage: 1 }, failText: "You need at least 1 Courage to make the climb." }
    ]
  },
  lostChild: {
    chapter: "Whisperwood", title: "The Mimic in the Ferns", mood: "forest", progress: 44,
    text: "The cry comes from no child. A pale fox mimics the voice beside a hunter’s abandoned pack. It watches you carefully, neither tame nor hostile.",
    choices: [
      { text: "Offer food and follow the fox", next: "foxGuide", supplies: -1, score: 35, flag: "fox", require: { supplies: 1 }, failText: "You have no Supplies to offer." },
      { text: "Search the hunter’s pack", next: "shrine", supplies: 1, score: 15 },
      { text: "Leave quickly and return to the trail", next: "shrine", score: 5 }
    ]
  },
  ravenSight: {
    chapter: "Above the Trees", title: "A Raven Over the Ruins", mood: "forest", progress: 48,
    text: "From the swaying crown, you spot a giant raven circling ancient ruins. A cold blue flame burns below it. You also see a narrow mountain pass beyond the trees.",
    discovery: { title: "Clue found", text: "The lantern is at the moon ruins, guarded by a mist raven." },
    onEnter: { clue: "raven", score: 25 },
    choices: [
      { text: "Go directly to the moon ruins", next: "ruinsGate", score: 30 },
      { text: "Take the mountain pass above the ruins", next: "mountainPass", courage: -1, score: 40, require: { courage: 1 }, failText: "You need at least 1 Courage for the exposed pass." }
    ]
  },
  shrine: {
    chapter: "The Old Shrine", title: "A Flame That Remembers", mood: "ruins", progress: 50,
    text: "Inside the ruined shrine, a mural shows the lantern beside a white raven. The inscription reads: ‘Light freely given will guide; light taken will bind.’ A small ember still glows in a stone bowl.",
    discovery: { title: "Clue found", text: "The raven may be a guardian, not a thief. You take the shrine ember." },
    onEnter: { clue: "truth", flag: "ember", score: 30 },
    choices: [
      { text: "Carry the ember to the moon ruins", next: "ruinsGate", score: 25 },
      { text: "Follow the mural’s hidden mountain route", next: "mountainPass", score: 30 }
    ]
  },
  foxGuide: {
    chapter: "The Secret Way", title: "Beneath the Root Bridge", mood: "forest", progress: 60,
    text: "The fox leads you beneath a bridge of ancient roots. There, you hear the raven speaking in a human voice: the lantern’s flame is fading because the village has forgotten its promise to protect the mountain.",
    discovery: { title: "Secret learned", text: "The lantern cannot be restored by force; it needs a willing promise." },
    onEnter: { clue: "promise", score: 35 },
    choices: [
      { text: "Approach the moon ruins peacefully", next: "ravenMeeting", score: 40 },
      { text: "Sneak around and take the lantern", next: "stealLantern", score: 20 }
    ]
  },
  river: {
    chapter: "The Flooded Path", title: "The River’s Bargain", mood: "river", progress: 42,
    text: "The flooded river blocks the northern trail. A ferryman offers passage in return for your compass, while a half-submerged causeway disappears into fast water.",
    choices: [
      { text: "Trade the compass for safe passage", next: "ruinsGate", score: 20, flag: "noCompass" },
      { text: "Cross the submerged causeway", next: "riverRescue", courage: -1, score: 40, require: { courage: 1 }, failText: "You need at least 1 Courage to face the current." },
      { text: "Turn back toward the forest shrine", next: "shrine", score: 10 }
    ]
  },
  riverRescue: {
    chapter: "The Flooded Path", title: "A Hand in the Current", mood: "river", progress: 58,
    text: "Halfway across, you pull a trapped traveler from the current. She gives you a crystal chime and says its note calms creatures born from mist.",
    discovery: { title: "Item gained", text: "Crystal chime — its clear note can calm the raven." },
    onEnter: { flag: "chime", score: 35 },
    choices: [{ text: "Continue to the moon ruins", next: "ruinsGate", score: 30 }]
  },
  mountainPass: {
    chapter: "The High Pass", title: "Storm Above the Valley", mood: "mountain", progress: 68,
    text: "Wind tears across the narrow pass. Below, the raven shields the lantern from twisting shapes in the mist. The creature has been defending the flame all along.",
    discovery: { title: "Truth revealed", text: "The mist, not the raven, is trying to extinguish the lantern." },
    onEnter: { clue: "defender", score: 35 },
    choices: [
      { text: "Descend and help the raven", next: "ravenMeeting", courage: -1, score: 45, require: { courage: 1 }, failText: "You need at least 1 Courage to descend through the storm." },
      { text: "Wait for a chance to seize the lantern", next: "stealLantern", score: 15 }
    ]
  },
  ruinsGate: {
    chapter: "The Moon Ruins", title: "Guardian at the Gate", mood: "ruins", progress: 72,
    text: "At the moon ruins, the great raven spreads its wings across the gate. Blue fire glows behind it as the mist gathers into long, grasping hands.",
    choices: [
      { text: "Lower your hands and speak to the raven", next: "ravenMeeting", score: 35 },
      { text: "Rush past while the mist attacks", next: "stealLantern", courage: -1, score: 35, require: { courage: 1 }, failText: "You need at least 1 Courage to break through." },
      { text: "Use your knowledge to name the raven as guardian", next: "ravenMeeting", score: 50, requireAnyClue: ["truth", "raven", "defender"], failText: "You need a clue about the raven’s true role." }
    ]
  },
  ravenMeeting: {
    chapter: "The Choice of Light", title: "The Guardian Speaks", mood: "ruins", progress: 88,
    text: "The raven becomes a silver-haired guardian. ‘The village borrowed this flame generations ago,’ she says. ‘Will you renew the promise, return the flame to the mountain, or try to command it?’",
    choices: [
      { text: "Promise that Ember Hollow will protect the mountain", next: "endingRenewed", score: 100, requireAnyClue: ["promise", "truth", "defender"], failText: "You have not learned enough to make a true promise." },
      { text: "Return the flame to the mountain forever", next: "endingWild", score: 80 },
      { text: "Ring the crystal chime and unite both flames", next: "endingHarmony", score: 120, requireFlag: "chime", failText: "You need the crystal chime for this choice." }
    ]
  },
  stealLantern: {
    chapter: "The Stolen Flame", title: "Run Through the Mist", mood: "mountain", progress: 88,
    text: "You seize the lantern. The guardian’s cry shakes the ruins, and the mist closes around the path home. The flame burns hot, fighting your grip.",
    choices: [
      { text: "Use the shrine ember to steady the flame", next: "endingEmber", score: 70, requireFlag: "ember", failText: "You did not collect the shrine ember." },
      { text: "Trust the compass and race for the village", next: "endingDim", score: 35, forbiddenFlag: "noCompass", failText: "You traded away the compass and cannot find the safe path." },
      { text: "Turn back and surrender the lantern", next: "endingMercy", score: 55 }
    ]
  },
  endingRenewed: { ending: true, title: "Ending: The Promise Renewed", mood: "ending", progress: 100, text: "The guardian accepts your vow. The lantern rises above Ember Hollow, warmer than before, and the mist retreats. At dawn, the villagers begin restoring the forgotten mountain shrines.", endingName: "Promise Keeper", score: 200 },
  endingHarmony: { ending: true, title: "Ending: Two Lights, One Valley", mood: "ending", progress: 100, text: "The chime rings across the peaks. The village flame and the mountain’s blue fire join without consuming one another. The guardian names you Bridgekeeper, and the valley enters a new age of peace.", endingName: "Bridgekeeper", score: 250 },
  endingWild: { ending: true, title: "Ending: The Wild Mountain", mood: "ending", progress: 100, text: "You return the flame to its first home. Ember Hollow loses its magical lantern, but the villagers learn to guide one another through ordinary darkness. The mountain blooms with silver flowers.", endingName: "Mountain Friend", score: 170 },
  endingEmber: { ending: true, title: "Ending: A Fragile Flame", mood: "ending", progress: 100, text: "The shrine ember steadies the stolen light long enough to reach the village. Ember Hollow is safe, but the guardian vanishes and the lantern must now be tended every night.", endingName: "Ember Bearer", score: 130 },
  endingDim: { ending: true, title: "Ending: Home Before Midnight", mood: "ending", progress: 100, text: "The compass guides you out as the last bell rings. The lantern returns, but its flame is dim and the mist still waits at the valley’s edge. You saved the night, not the future.", endingName: "Night Runner", score: 100 },
  endingMercy: { ending: true, title: "Ending: The Guardian’s Mercy", mood: "ending", progress: 100, text: "You return the lantern and admit your mistake. The guardian leads you safely home, then lifts the flame above the valley for one final year—time for the village to remember its promise.", endingName: "The Penitent", score: 145 }
};

const els = {
  stage: document.getElementById("storyStage"), chapter: document.getElementById("chapterLabel"),
  sceneNumber: document.getElementById("sceneNumber"), title: document.getElementById("sceneTitle"),
  text: document.getElementById("sceneText"), choices: document.getElementById("choices"),
  courage: document.getElementById("courageValue"), supplies: document.getElementById("suppliesValue"),
  score: document.getElementById("scoreValue"), discovery: document.getElementById("discovery"),
  discoveryTitle: document.getElementById("discoveryTitle"), discoveryText: document.getElementById("discoveryText"),
  progressText: document.getElementById("progressText"), progressBar: document.getElementById("progressBar"),
  progressTrack: document.querySelector(".progress-track"), keyboardHint: document.getElementById("keyboardHint"),
  restart: document.getElementById("restartButton")
};

let state;
let activeScene = "start";
let locked = false;

function freshState() {
  return { courage: 3, supplies: 2, score: 0, clues: new Set(), flags: new Set(), visited: new Set(), sceneCount: 1 };
}

function restartGame() {
  state = freshState();
  activeScene = "start";
  locked = false;
  renderScene();
  els.stage.scrollIntoView({ behavior: "smooth", block: "center" });
}

function applyEnterEffect(scene) {
  if (!scene.onEnter || state.visited.has(activeScene)) return;
  const effect = scene.onEnter;
  if (effect.score) state.score += effect.score;
  if (effect.clue) state.clues.add(effect.clue);
  if (effect.flag) state.flags.add(effect.flag);
}

function renderScene() {
  const scene = scenes[activeScene];
  applyEnterEffect(scene);
  state.visited.add(activeScene);
  els.stage.dataset.mood = scene.mood || "village";
  els.chapter.textContent = scene.ending ? "Journey Complete" : scene.chapter;
  els.sceneNumber.textContent = scene.ending ? "Your ending" : `Scene ${state.sceneCount}`;
  els.title.textContent = scene.title;
  els.text.textContent = scene.text;

  if (scene.discovery) {
    els.discovery.hidden = false;
    els.discoveryTitle.textContent = scene.discovery.title;
    els.discoveryText.textContent = scene.discovery.text;
  } else if (scene.ending) {
    els.discovery.hidden = false;
    els.discoveryTitle.textContent = "Title earned";
    els.discoveryText.textContent = scene.endingName;
  } else {
    els.discovery.hidden = true;
  }

  els.choices.replaceChildren();
  if (scene.ending) {
    state.score += scene.score || 0;
    const button = makeChoiceButton({ text: "Play again", endingAction: true }, 0);
    button.addEventListener("click", restartGame);
    els.choices.append(button);
    els.keyboardHint.textContent = "You can replay to discover another ending";
  } else {
    scene.choices.forEach((choice, index) => {
      const button = makeChoiceButton(choice, index);
      button.addEventListener("click", () => selectChoice(choice, button));
      els.choices.append(button);
    });
    els.keyboardHint.textContent = scene.choices.length === 1 ? "Press 1 to continue" : `Press 1–${scene.choices.length} to choose`;
  }

  updateStats(scene.progress);
  locked = false;
}

function makeChoiceButton(choice, index) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = `choice-button${choice.endingAction ? " ending-action" : ""}`;
  const number = document.createElement("span");
  number.className = "choice-number";
  number.textContent = index + 1;
  number.setAttribute("aria-hidden", "true");
  const label = document.createElement("span");
  label.textContent = choice.text;
  button.append(number, label);
  return button;
}

function validateChoice(choice) {
  if (choice.require) {
    if (choice.require.courage && state.courage < choice.require.courage) return choice.failText;
    if (choice.require.supplies && state.supplies < choice.require.supplies) return choice.failText;
  }
  if (choice.requireAnyClue && !choice.requireAnyClue.some(clue => state.clues.has(clue))) return choice.failText;
  if (choice.requireFlag && !state.flags.has(choice.requireFlag)) return choice.failText;
  if (choice.forbiddenFlag && state.flags.has(choice.forbiddenFlag)) return choice.failText;
  return "";
}

function selectChoice(choice, button) {
  if (locked) return;
  const error = validateChoice(choice);
  if (error) {
    showChoiceError(button, error);
    return;
  }
  locked = true;
  state.courage = Math.max(0, state.courage + (choice.courage || 0));
  state.supplies = Math.max(0, state.supplies + (choice.supplies || 0));
  state.score += choice.score || 0;
  if (choice.flag) state.flags.add(choice.flag);
  activeScene = choice.next;
  state.sceneCount += 1;
  els.stage.classList.add("changing");
  window.setTimeout(() => {
    renderScene();
    els.stage.classList.remove("changing");
    els.title.focus?.({ preventScroll: true });
  }, 160);
}

function showChoiceError(button, message) {
  const original = button.querySelector("span:last-child").textContent;
  button.querySelector("span:last-child").textContent = message;
  button.style.borderColor = "#ef5b5b";
  button.setAttribute("aria-invalid", "true");
  window.setTimeout(() => {
    button.querySelector("span:last-child").textContent = original;
    button.style.borderColor = "";
    button.removeAttribute("aria-invalid");
  }, 2200);
}

function updateStats(progress) {
  els.courage.textContent = state.courage;
  els.supplies.textContent = state.supplies;
  els.score.textContent = state.score;
  els.progressText.textContent = `Journey progress: ${progress}%`;
  els.progressBar.style.width = `${progress}%`;
  els.progressTrack.setAttribute("aria-valuenow", progress);
}

document.addEventListener("keydown", event => {
  if (event.altKey || event.ctrlKey || event.metaKey || locked) return;
  const number = Number(event.key);
  if (number < 1 || number > 3) return;
  const button = els.choices.querySelectorAll("button")[number - 1];
  if (button) button.click();
});

els.restart.addEventListener("click", () => {
  if (activeScene === "start" || window.confirm("Restart the story and clear this journey?")) restartGame();
});

state = freshState();
renderScene();


}
function begin(){poster.hidden=true;gm.hidden=false;if(!booted){booted=true;var s=document.createElement("style");s.textContent=LOOK;document.head.appendChild(s);boot();}else{var r=document.getElementById("restartButton");if(r)r.click();}}
poster.addEventListener("click",begin);
var nb=document.getElementById("new");if(nb)nb.addEventListener("click",begin);
})();
