/* Blackjack-style - game logic + its own look. Layout lives in style.css; page shell lives in the HTML. */
(function(){"use strict";
var gm=document.getElementById("gm"),poster=document.getElementById("poster"),booted=false;
var LOOK=".gm{\n  \n  \n  --accent: #16B8C4;\n  --action: #FFB84D;\n  --success: #22C55E;\n  --danger: #EF5B5B;\n  \n  \n  \n  \n  \n  --felt: #0B3D2E;\n  --felt-2: #0F5138;\n  --felt-line: rgba(255, 255, 255, 0.18);\n  \n}.gm *{\n  box-sizing: border-box;\n}.gm button,.gm input,.gm textarea,.gm select{\n  font: inherit;\n}.gm button:focus-visible,.gm summary:focus-visible{\n  outline: 3px solid rgba(91, 92, 226, 0.35);\n  outline-offset: 3px;\n}.gm h2,.gm h3,.gm p{\n  margin-top: 0;\n}.gm h2{\n  font-size: clamp(27px, 4vw, 35px);\n  line-height: 1.2;\n  letter-spacing: -0.02em;\n  margin-bottom: 16px;\n}.gm .game-section{\n  padding-bottom: 68px;\n}.gm .game-shell{\n  background: var(--card);\n  border: 1px solid var(--border);\n  border-radius: 20px;\n  overflow: hidden;\n  box-shadow: var(--shadow);\n}.gm .game-topbar{\n  display: grid;\n  grid-template-columns: repeat(4, minmax(0, 1fr));\n  border-bottom: 1px solid var(--border);\n  background: #fff;\n}.gm .game-topbar > div{\n  padding: 15px 18px;\n  text-align: center;\n  border-right: 1px solid var(--border);\n}.gm .game-topbar > div:last-child{\n  border-right: 0;\n}.gm .game-topbar .label{\n  display: block;\n  font-size: 13px;\n  color: var(--muted);\n  font-weight: 700;\n  text-transform: uppercase;\n  letter-spacing: 0.06em;\n}.gm .game-topbar strong{\n  font-size: 22px;\n  line-height: 1.2;\n}.gm .table-wrap{\n  padding: 24px;\n  background: #111827;\n}.gm .felt-table{\n  min-height: 610px;\n  border-radius: 18px;\n  padding: 34px;\n  color: white;\n  background:\n    radial-gradient(circle at center, rgba(255,255,255,0.06), transparent 50%),\n    var(--felt);\n  border: 1px solid rgba(255,255,255,0.14);\n  box-shadow: inset 0 0 0 10px rgba(255,255,255,0.025);\n  display: grid;\n  grid-template-rows: 1fr auto 1fr;\n  gap: 24px;\n}.gm .hand-zone{\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n}.gm .hand-heading{\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 20px;\n  margin-bottom: 20px;\n}.gm .hand-heading h2{\n  color: #fff;\n  margin: 2px 0 0;\n  font-size: 24px;\n}.gm .hand-kicker{\n  color: rgba(255,255,255,0.72);\n  font-size: 13px;\n  text-transform: uppercase;\n  font-weight: 800;\n  letter-spacing: 0.08em;\n}.gm .score-pill{\n  min-width: 56px;\n  height: 48px;\n  padding: 0 15px;\n  border-radius: 999px;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  background: rgba(255,255,255,0.1);\n  border: 1px solid rgba(255,255,255,0.18);\n  font-size: 24px;\n  font-weight: 800;\n}.gm .cards{\n  display: flex;\n  flex-wrap: wrap;\n  gap: 14px;\n  min-height: 132px;\n}.gm .playing-card{\n  width: 88px;\n  height: 124px;\n  background: #fff;\n  color: #131722;\n  border-radius: 12px;\n  border: 1px solid rgba(0,0,0,0.09);\n  box-shadow: 0 10px 24px rgba(0,0,0,0.22);\n  padding: 9px 10px;\n  display: flex;\n  flex-direction: column;\n  justify-content: space-between;\n  animation: cardIn 220ms ease-out both;\n  user-select: none;\n}.gm .playing-card.red{\n  color: #D93535;\n}.gm .playing-card.hidden-card{\n  background:\n    linear-gradient(135deg, rgba(255,255,255,0.08) 25%, transparent 25%) 0 0/16px 16px,\n    linear-gradient(315deg, rgba(255,255,255,0.08) 25%, transparent 25%) 0 0/16px 16px,\n    var(--brand-dark);\n  border: 4px solid #fff;\n  position: relative;\n}.gm .playing-card.hidden-card::after{\n  content: \"GH\";\n  position: absolute;\n  inset: 0;\n  display: grid;\n  place-items: center;\n  color: rgba(255,255,255,0.92);\n  font-weight: 800;\n  letter-spacing: 0.08em;\n}.gm .card-corner{\n  font-size: 17px;\n  font-weight: 800;\n  line-height: 1.05;\n}.gm .card-suit{\n  font-size: 30px;\n  align-self: center;\n  line-height: 1;\n}.gm .card-bottom{\n  transform: rotate(180deg);\n  align-self: flex-end;\n}.gm .table-center{\n  text-align: center;\n  color: rgba(255,255,255,0.58);\n  border-top: 1px solid var(--felt-line);\n  border-bottom: 1px solid var(--felt-line);\n  padding: 12px 0;\n}.gm .table-mark{\n  font-size: 16px;\n  font-weight: 800;\n  letter-spacing: 0.22em;\n}.gm .table-rule{\n  font-size: 13px;\n}.gm .status-panel{\n  text-align: center;\n  padding: 22px 24px 10px;\n}.gm .status-title{\n  margin-bottom: 2px;\n  font-size: 22px;\n  font-weight: 800;\n}.gm .status-text{\n  margin-bottom: 0;\n  color: var(--muted);\n}.gm .controls{\n  display: flex;\n  justify-content: center;\n  gap: 12px;\n  flex-wrap: wrap;\n  padding: 18px 24px 14px;\n}.gm .btn{\n  min-height: 48px;\n  border: 0;\n  border-radius: 12px;\n  padding: 0 20px;\n  font-size: 16px;\n  font-weight: 800;\n  cursor: pointer;\n  transition: transform 150ms ease, box-shadow 150ms ease, opacity 150ms ease;\n}.gm .btn:not(:disabled):hover{\n  transform: translateY(-1px);\n}.gm .btn:disabled{\n  opacity: 0.45;\n  cursor: not-allowed;\n}.gm .btn-primary{\n  background: var(--brand);\n  color: #fff;\n  box-shadow: 0 8px 18px rgba(91,92,226,0.24);\n}.gm .btn-action{\n  background: var(--action);\n  color: #32220a;\n}.gm .btn-secondary{\n  background: #E9F8F9;\n  color: #0A646B;\n}.gm .btn-ghost{\n  background: #F2F3F7;\n  color: #353A4D;\n}.gm .keyboard-hint{\n  text-align: center;\n  margin: 0;\n  padding: 0 24px 24px;\n  color: var(--muted);\n  font-size: 14px;\n}.gm kbd{\n  border: 1px solid #C9CCD6;\n  background: #fff;\n  border-bottom-width: 2px;\n  border-radius: 5px;\n  padding: 1px 5px;\n  font-size: 12px;\n  font-weight: 800;\n}.gm .long-card{\n  background: #fff;\n  border: 1px solid var(--border);\n  border-radius: 16px;\n  padding: 24px;\n}.gm .long-card h2{\n  font-size: 29px;\n}.gm .long-card + .long-card{\n  margin-top: 22px;\n}.gm .long-card p:last-child,.gm .long-card ul:last-child{\n  margin-bottom: 0;\n}.gm li + li{\n  margin-top: 7px;\n}.gm .muted{\n  color: var(--muted);\n}@keyframes cardIn{\n  from { opacity: 0; transform: translateY(-8px) scale(0.97); }\n  to { opacity: 1; transform: translateY(0) scale(1); }\n}@media (max-width: 760px){.gm .game-topbar{\n    grid-template-columns: repeat(2, 1fr);\n  }.gm .game-topbar > div:nth-child(2){\n    border-right: 0;\n  }.gm .game-topbar > div:nth-child(-n+2){\n    border-bottom: 1px solid var(--border);\n  }.gm .table-wrap{\n    padding: 12px;\n  }.gm .felt-table{\n    min-height: 540px;\n    padding: 22px 16px;\n    border-radius: 14px;\n  }.gm .playing-card{\n    width: 70px;\n    height: 100px;\n    border-radius: 10px;\n    padding: 7px 8px;\n  }.gm .card-suit{\n    font-size: 25px;\n  }.gm .cards{\n    gap: 9px;\n    min-height: 108px;\n  }.gm .hand-heading h2{\n    font-size: 21px;\n  }.gm .score-pill{\n    min-width: 50px;\n    height: 44px;\n    font-size: 21px;\n  }.gm .controls{\n    display: grid;\n    grid-template-columns: repeat(2, minmax(0, 1fr));\n  }.gm .btn{\n    width: 100%;\n  }.gm .long-card h2{\n    font-size: 27px;\n  }}@media (max-width: 440px){.gm .game-topbar > div{\n    padding: 12px 10px;\n  }.gm .felt-table{\n    padding: 18px 12px;\n  }.gm .cards{\n    gap: 7px;\n  }.gm .playing-card{\n    width: 62px;\n    height: 90px;\n  }.gm .card-corner{\n    font-size: 15px;\n  }.gm .card-suit{\n    font-size: 22px;\n  }.gm .controls{\n    grid-template-columns: 1fr;\n  }.gm .keyboard-hint{\n    display: none;\n  }}@media (prefers-reduced-motion: reduce){.gm *,.gm *::before,.gm *::after{\n    animation-duration: 0.01ms !important;\n    animation-iteration-count: 1 !important;\n    scroll-behavior: auto !important;\n  }}";
function __ready(f){f()}
function boot(){
(() => {
  "use strict";

  const dealerCardsEl = document.getElementById("dealerCards");
  const playerCardsEl = document.getElementById("playerCards");
  const dealerScoreEl = document.getElementById("dealerScore");
  const playerScoreEl = document.getElementById("playerScore");
  const statusTitleEl = document.getElementById("statusTitle");
  const statusTextEl = document.getElementById("statusText");
  const roundValueEl = document.getElementById("roundValue");
  const winsValueEl = document.getElementById("winsValue");
  const lossesValueEl = document.getElementById("lossesValue");
  const pushesValueEl = document.getElementById("pushesValue");

  const dealBtn = document.getElementById("dealBtn");
  const hitBtn = document.getElementById("hitBtn");
  const standBtn = document.getElementById("standBtn");
  const restartBtn = document.getElementById("restartBtn");

  const suits = ["♠", "♥", "♦", "♣"];
  const ranks = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

  let deck = [];
  let playerHand = [];
  let dealerHand = [];
  let roundActive = false;
  let dealerHoleHidden = true;
  let round = 1;
  let wins = 0;
  let losses = 0;
  let pushes = 0;

  function createDeck() {
    const newDeck = [];
    suits.forEach((suit) => {
      ranks.forEach((rank) => {
        newDeck.push({ suit, rank });
      });
    });
    return shuffle(newDeck);
  }

  function shuffle(cards) {
    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }
    return cards;
  }

  function cardBaseValue(rank) {
    if (rank === "A") return 11;
    if (["K", "Q", "J"].includes(rank)) return 10;
    return Number(rank);
  }

  function calculateHand(hand) {
    let total = hand.reduce((sum, card) => sum + cardBaseValue(card.rank), 0);
    let aces = hand.filter((card) => card.rank === "A").length;

    while (total > 21 && aces > 0) {
      total -= 10;
      aces -= 1;
    }

    return total;
  }

  function isBlackjack(hand) {
    return hand.length === 2 && calculateHand(hand) === 21;
  }

  function drawCard() {
    if (deck.length === 0) {
      deck = createDeck();
    }
    return deck.pop();
  }

  function makeCardElement(card, hidden = false) {
    const el = document.createElement("div");
    el.className = "playing-card";

    if (hidden) {
      el.classList.add("hidden-card");
      el.setAttribute("aria-label", "Hidden dealer card");
      return el;
    }

    const red = card.suit === "♥" || card.suit === "♦";
    if (red) el.classList.add("red");

    el.setAttribute("aria-label", `${card.rank} of ${suitName(card.suit)}`);
    el.innerHTML = `
      <div class="card-corner">${card.rank}<br>${card.suit}</div>
      <div class="card-suit">${card.suit}</div>
      <div class="card-corner card-bottom">${card.rank}<br>${card.suit}</div>
    `;
    return el;
  }

  function suitName(symbol) {
    return {
      "♠": "spades",
      "♥": "hearts",
      "♦": "diamonds",
      "♣": "clubs"
    }[symbol];
  }

  function renderHands() {
    dealerCardsEl.innerHTML = "";
    playerCardsEl.innerHTML = "";

    dealerHand.forEach((card, index) => {
      dealerCardsEl.appendChild(makeCardElement(card, dealerHoleHidden && index === 1));
    });

    playerHand.forEach((card) => {
      playerCardsEl.appendChild(makeCardElement(card));
    });

    playerScoreEl.textContent = playerHand.length ? String(calculateHand(playerHand)) : "0";

    if (!dealerHand.length) {
      dealerScoreEl.textContent = "?";
    } else if (dealerHoleHidden) {
      dealerScoreEl.textContent = String(cardBaseValue(dealerHand[0].rank));
    } else {
      dealerScoreEl.textContent = String(calculateHand(dealerHand));
    }
  }

  function updateStats() {
    roundValueEl.textContent = String(round);
    winsValueEl.textContent = String(wins);
    lossesValueEl.textContent = String(losses);
    pushesValueEl.textContent = String(pushes);
  }

  function setStatus(title, text) {
    statusTitleEl.textContent = title;
    statusTextEl.textContent = text;
  }

  function setButtons({ canDeal, canHit, canStand }) {
    dealBtn.disabled = !canDeal;
    hitBtn.disabled = !canHit;
    standBtn.disabled = !canStand;
    dealBtn.textContent = roundActive ? "Round in Progress" : "Deal Cards";
  }

  function startRound() {
    if (roundActive) return;

    deck = createDeck();
    playerHand = [];
    dealerHand = [];
    dealerHoleHidden = true;
    roundActive = true;

    playerHand.push(drawCard());
    dealerHand.push(drawCard());
    playerHand.push(drawCard());
    dealerHand.push(drawCard());

    renderHands();
    setButtons({ canDeal: false, canHit: true, canStand: true });
    setStatus("Your move", "Hit for another card or stand to keep your current total.");

    const playerNatural = isBlackjack(playerHand);
    const dealerNatural = isBlackjack(dealerHand);

    if (playerNatural || dealerNatural) {
      dealerHoleHidden = false;
      renderHands();

      if (playerNatural && dealerNatural) {
        finishRound("push", "Both have 21", "Both you and the dealer opened with 21. The round is a push.");
      } else if (playerNatural) {
        finishRound("win", "Blackjack!", "Your opening hand totals 21. You win the round.");
      } else {
        finishRound("loss", "Dealer blackjack", "The dealer opened with 21 and wins the round.");
      }
    }
  }

  function playerHit() {
    if (!roundActive) return;

    playerHand.push(drawCard());
    renderHands();

    const total = calculateHand(playerHand);

    if (total > 21) {
      dealerHoleHidden = false;
      renderHands();
      finishRound("loss", "Bust", `Your hand reached ${total}, which is over 21.`);
      return;
    }

    if (total === 21) {
      setStatus("21!", "You reached 21. The dealer will now play.");
      dealerTurn();
    } else {
      setStatus("Your move", `Your total is ${total}. Hit again or stand.`);
    }
  }

  function playerStand() {
    if (!roundActive) return;
    dealerTurn();
  }

  function dealerTurn() {
    if (!roundActive) return;

    setButtons({ canDeal: false, canHit: false, canStand: false });
    dealerHoleHidden = false;
    renderHands();

    while (calculateHand(dealerHand) < 17) {
      dealerHand.push(drawCard());
    }

    renderHands();
    settleRound();
  }

  function settleRound() {
    const playerTotal = calculateHand(playerHand);
    const dealerTotal = calculateHand(dealerHand);

    if (dealerTotal > 21) {
      finishRound("win", "Dealer busts", `The dealer reached ${dealerTotal}. You win with ${playerTotal}.`);
      return;
    }

    if (playerTotal > dealerTotal) {
      finishRound("win", "You win", `Your ${playerTotal} beats the dealer's ${dealerTotal}.`);
    } else if (playerTotal < dealerTotal) {
      finishRound("loss", "Dealer wins", `The dealer's ${dealerTotal} beats your ${playerTotal}.`);
    } else {
      finishRound("push", "Push", `You both finished on ${playerTotal}. The round is tied.`);
    }
  }

  function finishRound(result, title, text) {
    roundActive = false;

    if (result === "win") wins += 1;
    if (result === "loss") losses += 1;
    if (result === "push") pushes += 1;

    setStatus(title, text);
    setButtons({ canDeal: true, canHit: false, canStand: false });
    updateStats();
    round += 1;
    roundValueEl.textContent = String(round);
  }

  function resetMatch() {
    deck = [];
    playerHand = [];
    dealerHand = [];
    roundActive = false;
    dealerHoleHidden = true;
    round = 1;
    wins = 0;
    losses = 0;
    pushes = 0;

    renderHands();
    updateStats();
    setStatus("Ready?", "Start a round and try to beat the dealer.");
    setButtons({ canDeal: true, canHit: false, canStand: false });
  }

  dealBtn.addEventListener("click", startRound);
  hitBtn.addEventListener("click", playerHit);
  standBtn.addEventListener("click", playerStand);
  restartBtn.addEventListener("click", resetMatch);

  document.addEventListener("keydown", (event) => {
    if (event.repeat) return;
    const key = event.key.toLowerCase();

    if (key === "d" && !dealBtn.disabled) startRound();
    if (key === "h" && !hitBtn.disabled) playerHit();
    if (key === "s" && !standBtn.disabled) playerStand();
    if (key === "r") resetMatch();
  });

  resetMatch();
})();


}
function begin(){poster.hidden=true;gm.hidden=false;if(!booted){booted=true;var s=document.createElement("style");s.textContent=LOOK;document.head.appendChild(s);boot();}else{var r=document.getElementById("restartBtn");if(r)r.click();}}
poster.addEventListener("click",begin);
var nb=document.getElementById("new");if(nb)nb.addEventListener("click",begin);
})();
