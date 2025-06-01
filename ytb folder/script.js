// ====== Galaxy Quiz Data & Logic ======

const quizQuestions = [
  {
    question: "Which planet is known as the Red Planet?",
    options: ["Earth", "Mars", "Jupiter", "Venus"],
    answer: "Mars",
  },
  {
    question: "What is the largest planet in our solar system?",
    options: ["Saturn", "Jupiter", "Neptune", "Earth"],
    answer: "Jupiter",
  },
  {
    question: "Which planet has famous rings around it?",
    options: ["Uranus", "Saturn", "Venus", "Mercury"],
    answer: "Saturn",
  },
  {
    question: "Which planet is closest to the Sun?",
    options: ["Mercury", "Venus", "Earth", "Mars"],
    answer: "Mercury",
  },
  {
    question: "Which planet rotates on its side?",
    options: ["Neptune", "Uranus", "Saturn", "Jupiter"],
    answer: "Uranus",
  },
  {
    question: "Which planet is known for its strong winds and storms?",
    options: ["Neptune", "Venus", "Mars", "Mercury"],
    answer: "Neptune",
  },
  {
    question: "What planet do we live on?",
    options: ["Earth", "Mars", "Venus", "Jupiter"],
    answer: "Earth",
  },
  {
    question: "Which planet has the largest volcano?",
    options: ["Mars", "Venus", "Earth", "Saturn"],
    answer: "Mars",
  },
  {
    question: "Which planet is extremely hot with a thick atmosphere?",
    options: ["Mercury", "Venus", "Mars", "Earth"],
    answer: "Venus",
  },
  {
    question: "What is the smallest planet in the solar system?",
    options: ["Mercury", "Mars", "Venus", "Pluto"],
    answer: "Mercury",
  },
];

// DOM Elements
const startScreen = document.getElementById("startScreen");
const usernameInput = document.getElementById("usernameInput");
const startQuizBtn = document.getElementById("startQuizBtn");

const quizBox = document.querySelector(".quiz-box");
const questionText = quizBox.querySelector(".question-text");
const optionsContainer = quizBox.querySelector(".options");
const nextBtn = document.getElementById("nextBtn");
const progressBar = document.getElementById("progressBar");

const resultScreen = document.querySelector(".quiz-result");
const scoreDisplay = document.getElementById("scoreDisplay");
const playerNameDisplay = document.getElementById("playerNameDisplay");
const badgeDisplay = document.getElementById("badgeDisplay");
const restartQuizBtn = document.getElementById("restartQuizBtn");
const screenshotBtn = document.getElementById("screenshotBtn");

const leaderboardList = document.getElementById("leaderboardList");

// Sound Effects
const correctSound = document.getElementById("correctSound");
const wrongSound = document.getElementById("wrongSound");
const winSound = document.getElementById("winSound");

let currentQuestionIndex = 0;
let score = 0;
let username = "";
let answered = false;

// Badge system based on score
function getBadge(score) {
  if (score === quizQuestions.length) return "🌟 Galaxy Master";
  if (score >= quizQuestions.length * 0.7) return "🚀 Space Commander";
  if (score >= quizQuestions.length * 0.4) return "🪐 Rookie Explorer";
  return "👽 Cosmic Newbie";
}

function updateLeaderboard(name, score) {
  let leaderboard = JSON.parse(localStorage.getItem("galaxyLeaderboard")) || [];

  leaderboard.push({ name, score });
  leaderboard.sort((a, b) => b.score - a.score);
  if (leaderboard.length > 5) leaderboard = leaderboard.slice(0, 5);

  localStorage.setItem("galaxyLeaderboard", JSON.stringify(leaderboard));
  renderLeaderboard();
}

function renderLeaderboard() {
  let leaderboard = JSON.parse(localStorage.getItem("galaxyLeaderboard")) || [];
  leaderboardList.innerHTML = "";

  if (leaderboard.length === 0) {
    leaderboardList.innerHTML = "<li>No explorers yet. Be the first!</li>";
    return;
  }

  leaderboard.forEach((entry, index) => {
    const li = document.createElement("li");
    li.textContent = `${index + 1}. ${entry.name} - ${entry.score}/${quizQuestions.length}`;
    leaderboardList.appendChild(li);
  });
}

// Show question and options
function showQuestion() {
  answered = false;
  nextBtn.disabled = true;
  let q = quizQuestions[currentQuestionIndex];
  questionText.textContent = q.question;

  // Clear previous options
  optionsContainer.innerHTML = "";

  q.options.forEach((option) => {
    const button = document.createElement("button");
    button.classList.add("option-btn");
    button.textContent = option;
    button.onclick = () => selectOption(button, option, q.answer);
    optionsContainer.appendChild(button);
  });

  // Update progress bar
  let progressPercent = ((currentQuestionIndex) / quizQuestions.length) * 100;
  progressBar.style.width = progressPercent + "%";
}

function selectOption(button, selected, correctAnswer) {
  if (answered) return; // prevent multiple clicks
  answered = true;
  nextBtn.disabled = false;

  if (selected === correctAnswer) {
    button.classList.add("correct");
    score++;
    correctSound.play();
  } else {
    button.classList.add("wrong");
    wrongSound.play();
    // Highlight the correct answer
    Array.from(optionsContainer.children).forEach((btn) => {
      if (btn.textContent === correctAnswer) btn.classList.add("correct");
    });
  }
}

// Move to next question or show results
nextBtn.addEventListener("click", () => {
  currentQuestionIndex++;
  if (currentQuestionIndex < quizQuestions.length) {
    showQuestion();
  } else {
    showResults();
  }
});

// Show results and badge
function showResults() {
  quizBox.classList.add("hidden");
  resultScreen.classList.remove("hidden");
  playerNameDisplay.textContent = username;
  scoreDisplay.textContent = `Your Score: ${score} out of ${quizQuestions.length}`;
  badgeDisplay.textContent = getBadge(score);

  progressBar.style.width = "100%";

  // Play win sound if perfect score
  if (score === quizQuestions.length) {
    winSound.play();
  }

  // Update leaderboard
  updateLeaderboard(username, score);
}

// Start quiz
startQuizBtn.addEventListener("click", () => {
  username = usernameInput.value.trim() || "Galactic Traveler";
  startScreen.classList.add("hidden");
  quizBox.classList.remove("hidden");
  currentQuestionIndex = 0;
  score = 0;
  progressBar.style.width = "0%";
  showQuestion();
});

// Restart quiz
restartQuizBtn.addEventListener("click", () => {
  resultScreen.classList.add("hidden");
  startScreen.classList.remove("hidden");
  usernameInput.value = "";
});

// Screenshot share using html2canvas
screenshotBtn.addEventListener("click", () => {
  import("https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js")
    .then((html2canvas) => {
      html2canvas.default(resultScreen).then((canvas) => {
        canvas.toBlob((blob) => {
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = `${username}_GalaxyQuizScore.png`;
          link.click();
          URL.revokeObjectURL(url);
        });
      });
    })
    .catch((e) => alert("Screenshot capture failed: " + e.message));
});

// Initialize leaderboard on page load
renderLeaderboard();


// Optional: Starfield animation or other page scripts below...
// For brevity, starCanvas code is omitted here but should be in your script.js as well.
const funnyFacts = [
  "🚀 There are more stars in the universe than grains of sand on Earth! But none of them pay taxes.",
  "🌌 If you could fly to Pluto by plane, it would take over 800 years... hope you packed snacks!",
  "👽 Aliens might exist... but maybe they’re just avoiding Earth after watching our reality TV.",
  "🪐 Saturn is so light it could float in water — too bad you can’t find a tub big enough!",
  "🌠 A day on Venus is longer than its year. So technically, Venus has really long Mondays.",
  "🌍 Earth is the only planet not named after a god — and it's also the messiest!",
  "☄️ Halley's Comet only shows up every 76 years — kind of like your weird uncle at family reunions.",
  "🛸 Scientists say time slows down near black holes. Perfect place to take a nap!",
  "🌕 The Moon is moving away from Earth by 1.5 inches every year — it’s trying to ghost us.",
  "🔭 The universe is expanding — but don’t worry, your jeans shrinking in the wash isn’t cosmic."
];

function shuffle(array) {
  return array.sort(() => 0.5 - Math.random());
}

function createFlipCard(factText) {
  const card = document.createElement("div");
  card.className = "fact-card";

  const front = document.createElement("div");
  front.className = "fact-front";
  front.textContent = factText.trim().slice(0, 2); // Emoji or symbol

  const back = document.createElement("div");
  back.className = "fact-back";
  back.textContent = factText.trim().slice(3); // Fact text

  card.appendChild(front);
  card.appendChild(back);

  return card;
}

function displayRandomFunnyFacts(count = 5) {
  const container = document.getElementById("funnyFactsContainer");
  container.innerHTML = "";

  shuffle(funnyFacts).slice(0, count).forEach(fact => {
    const card = createFlipCard(fact);
    container.appendChild(card);
  });
}

// Run on page load
displayRandomFunnyFacts();
