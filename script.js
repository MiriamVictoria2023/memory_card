const board = document.getElementById("game-board");
const timerElement = document.getElementById("timer");
const bestTimeElement = document.getElementById("best-time");
const winMessage = document.getElementById("win-message");
const restartBtn = document.getElementById("restartBtn");

const flipSound = document.getElementById("flip-sound");
const matchSound = document.getElementById("match-sound");
const winSound = document.getElementById("win-sound");

let emojis = ["🍎", "🍌", "🍇", "🍓", "🍒", "🍍"];
let cards = [];
let flippedCards = [];
let lockBoard = false;
let matchCount = 0;
let timer = 0;
let interval;

function shuffle(array) {
  return array.sort(() => 0.5 - Math.random());
}

function startGame() {
  cards = shuffle([...emojis, ...emojis]);
  board.innerHTML = "";
  matchCount = 0;
  flippedCards = [];
  lockBoard = false;
  winMessage.style.display = "none";
  timer = 0;
  timerElement.textContent = "⏱️ Time: 0s";
  clearInterval(interval);
  interval = setInterval(() => {
    timer++;
    timerElement.textContent = `⏱️ Time: ${timer}s`;
  }, 1000);

  cards.forEach((emoji) => {
    const card = document.createElement("div");
    card.classList.add("card");

    const cardInner = document.createElement("div");
    cardInner.classList.add("card-inner");

    const cardFront = document.createElement("div");
    cardFront.classList.add("card-front");
    cardFront.textContent = "?";

    const cardBack = document.createElement("div");
    cardBack.classList.add("card-back");
    cardBack.textContent = emoji;

    cardInner.appendChild(cardFront);
    cardInner.appendChild(cardBack);
    card.appendChild(cardInner);
    board.appendChild(card);

    card.addEventListener("click", () => flipCard(card, emoji));
  });

  loadBestTime();
}

function flipCard(card, emoji) {
  if (lockBoard || card.classList.contains("flipped")) return;

  card.classList.add("flipped");
  flipSound.play();

  flippedCards.push({ card, emoji });

  if (flippedCards.length === 2) {
    checkMatch();
  }
}

function checkMatch() {
  const [first, second] = flippedCards;

  if (first.emoji === second.emoji) {
    matchCount++;
    matchSound.play();
    flippedCards = [];

    if (matchCount === emojis.length) {
      clearInterval(interval);
      winSound.play();
      setTimeout(() => {
        winMessage.style.display = "block";
        updateBestTime();
      }, 500);
    }
  } else {
    lockBoard = true;
    setTimeout(() => {
      first.card.classList.remove("flipped");
      second.card.classList.remove("flipped");
      flippedCards = [];
      lockBoard = false;
    }, 1000);
  }
}

function updateBestTime() {
  const best = localStorage.getItem("bestTime");
  if (!best || timer < parseInt(best)) {
    localStorage.setItem("bestTime", timer);
    bestTimeElement.textContent = `🏆 Best: ${timer}s`;
  }
}

function loadBestTime() {
  const best = localStorage.getItem("bestTime");
  if (best) {
    bestTimeElement.textContent = `🏆 Best: ${best}s`;
  } else {
    bestTimeElement.textContent = `🏆 Best: --`;
  }
}

restartBtn.addEventListener("click", startGame);

startGame();
