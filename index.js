const lightMode = `
    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#ffffff">
      <path d="M480-360q50 0 85-35t35-85q0-50-35-85t-85-35q-50 0-85 35t-35 85q0 50 35 85t85 35Zm0 80q-83 0-141.5-58.5T280-480q0-83 58.5-141.5T480-680q83 0 141.5 58.5T680-480q0 83-58.5 141.5T480-280ZM200-440H40v-80h160v80Zm720 0H760v-80h160v80ZM440-760v-160h80v160h-80Zm0 720v-160h80v160h-80ZM256-650l-101-97 57-59 96 100-52 56Zm492 496-97-101 53-55 101 97-57 59Zm-98-550 97-101 59 57-100 96-56-52ZM154-212l101-97 55 53-97 101-59-57Zm326-268Z"/>
    </svg>`;

const darkMode = `
    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1c1e19">
      <path d="M480-120q-150 0-255-105T120-480q0-150 105-255t255-105q14 0 27.5 1t26.5 3q-41 29-65.5 75.5T444-660q0 90 63 153t153 63q55 0 101-24.5t75-65.5q2 13 3 26.5t1 27.5q0 150-105 255T480-120Zm0-80q88 0 158-48.5T740-375q-20 5-40 8t-40 3q-123 0-209.5-86.5T364-660q0-20 3-40t8-40q-78 32-126.5 102T200-480q0 116 82 198t198 82Zm-10-270Z"/>
    </svg>`;

document.addEventListener('DOMContentLoaded', (event) => {
    const savedMode = localStorage.getItem("darkMode");
    if (savedMode === "on") {
        document.body.classList.add("dark-mode");
        document.documentElement.classList.add("dark-mode");
    }
    updateModeIcon();
});

function updateModeIcon() {
    const modeToggle = document.getElementById('mode-toggle');
    if (!modeToggle) return;

    if (document.documentElement.classList.contains("dark-mode")) {
        modeToggle.innerHTML = lightMode;
    } else {
        modeToggle.innerHTML = darkMode;
    }
}

function change() {
    document.body.classList.toggle("dark-mode");
    document.documentElement.classList.toggle("dark-mode");
    const darkModeIsOn = document.documentElement.classList.contains("dark-mode");
    localStorage.setItem("darkMode", darkModeIsOn ? "on" : "off");
    updateModeIcon();
}

let quizData = [];
let currentQuestionIndex = 0;

const coinImage = document.querySelector('.quiz img');
const trueButton = document.getElementById('quiz-true');
const falseButton = document.getElementById('quiz-false');
const feedbackContainer = document.createElement('p');
feedbackContainer.id = 'feedback-text';
document.querySelector('.quiz').appendChild(feedbackContainer);

function loadQuizData() {
    fetch('quizdaten.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            quizData = data;
            if (quizData.length > 0) {
                displayQuestion(currentQuestionIndex);
            } else {
                feedbackContainer.textContent = "Fehler: Quizdaten sind leer.";
            }
        })
        .catch(error => {
            console.error('Fehler beim Laden der Quizdaten:', error);
            feedbackContainer.textContent = "Konnte Quizdaten nicht laden.";
        });
}

function displayQuestion(index) {
    const question = quizData[index];

    coinImage.src = question.bild;
    coinImage.alt = `${question.muenze} - Echtheitsprüfung`;

    feedbackContainer.textContent = "";
    feedbackContainer.classList.remove('correct', 'wrong');
    trueButton.disabled = false;
    falseButton.disabled = false;
    trueButton.style.display = 'block';
    falseButton.style.display = 'block';
}

function checkAnswer(userGuess) {
    const currentQuestion = quizData[currentQuestionIndex];
    const isCorrect = userGuess === currentQuestion['ist-echt'];

    trueButton.disabled = true;
    falseButton.disabled = true;

    if (isCorrect) {
        feedbackContainer.innerHTML = ' Richtig! ';
        feedbackContainer.classList.add('correct');
        feedbackContainer.classList.remove('wrong');
    } else {
        feedbackContainer.innerHTML = ' Falsch! ';
        feedbackContainer.classList.add('wrong');
        feedbackContainer.classList.remove('correct');
    }

    feedbackContainer.innerHTML += `<br>Erklärung: ${currentQuestion.erklaerung}`;

    setTimeout(nextQuestion, 4000);
}

function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < quizData.length) {
        displayQuestion(currentQuestionIndex);
    } else {
        coinImage.src = 'https://placehold.co/320x280?text=QUIZ+BEENDET';
        feedbackContainer.innerHTML = 'Herzlichen Glückwunsch! Quiz beendet. Laden Sie die Seite neu, um von vorne zu beginnen.';
        trueButton.style.display = 'none';
        falseButton.style.display = 'none';
    }
}

function setupEventListeners() {
    trueButton.addEventListener('click', () => checkAnswer(true));
    falseButton.addEventListener('click', () => checkAnswer(false));
}


document.addEventListener('DOMContentLoaded', () => {
    loadQuizData();
    setupEventListeners();
});
