import {isConnected, getRankings, evaluateHand, setConnected, addRankingIfAbsent} from './game-service.js';

const didWinTranslation = {
    true: 1,
    undefined: 0,
    false: -1,
};
const resultTable = {
    0: '=',
    '-1': '×',
    1: '✓',
};

let loadingIndicatorIntervalId;
let numberOfDots = 0;

let playerButton;

const backToStartBtn = document.querySelector('#back-to-start-btn');
const switchConnectionBtn = document.querySelector('#switch-connection-btn');
const playerNameInput = document.querySelector('#player-name-input');
const handSelectorDiv = document.querySelector('#hand-selector-div');
const pcHandDiv = document.querySelector('#computer-hand-div');
const historyTable = document.querySelector('#history-table');
const rankingDiv = document.querySelector('#ranking-div');
const countdownDiv = document.querySelector('#countdown-div');
const gamePageDiv = document.querySelector('#game-page');
const startPageDiv = document.querySelector('#start-page');
const handButtons = document.querySelectorAll('.hand-btn');
const gamePageButtons = document.querySelectorAll('button.game-page');
const startGameForm = document.querySelector('#start-game-form');
const startGameBtn = document.querySelector('#start-game-btn');
const loadingIndicator = document.querySelector('#loading-div');

function disableStartPageButtons() {
    switchConnectionBtn.disabled = true;
    startGameBtn.disabled = true;
}

function enableStartPageButtons() {
    switchConnectionBtn.disabled = false;
    startGameBtn.disabled = false;
}

function updateLoadingIndicator() {
    loadingIndicator.innerHTML = `<b>Lädt${'.'.repeat(numberOfDots++ % 4)}</b>`;
}

function animateLoadingIndicator() {
    loadingIndicatorIntervalId = setInterval(updateLoadingIndicator, 250);
}

function startLoadingIndicator() {
    numberOfDots = 0;
    updateLoadingIndicator();
    animateLoadingIndicator();
    loadingIndicator.style.display = 'block';
    rankingDiv.style.display = 'none';
}

function removeLoadingIndicator() {
    loadingIndicator.style.display = 'none';
    clearInterval(loadingIndicatorIntervalId);
    rankingDiv.style.display = 'block';
}

function switchGamePageButtonState() {
    gamePageButtons.forEach((button) => {
        button.disabled = !button.disabled;
    });
}

function resetHandButtons() {
    handButtons.forEach((button) => {
        button.dataset.didwin = '0';
        button.textContent = button.dataset.hand;
    });
}

function countDown(remainingTime) {
    if (remainingTime === 0) {
        countdownDiv.textContent = 'VS';
        pcHandDiv.textContent = '?';
        resetHandButtons();
        switchGamePageButtonState();
    } else {
        countdownDiv.textContent = `Nächste Runde in ${remainingTime}`;
        setTimeout(() => countDown(remainingTime - 1), 1000);
    }
}

function startCountdown() {
    switchGamePageButtonState();
    countDown(3);
}

function getRankedScores(rankings) {
    let scores = new Set();
    Object.keys(rankings).forEach((key) => (scores.add(rankings[key].win)));
    scores = Array.from(scores);
    scores.sort((current, previous) => (previous - current));
    return scores.slice(0, 10);
}

function sanitizeName(name, maxlength = 10) {
    return name.replace(/\W+/g, '').substring(0, maxlength);
}

function addPlayerToRankingList(entry) {
    const score = entry.win;
    const sanitizedName = sanitizeName(entry.user);
    document.querySelector(`#list-score-${score}`).innerHTML += `<div>${sanitizedName}</div>`;
}

function createRank(score, rank) {
    rankingDiv.innerHTML += `<b>${rank}. Rang mit ${score} Siegen</b><div id="list-score-${score}"></div>`;
}

function updateRanking(rankings) {
    if (isConnected()) {
        removeLoadingIndicator();
        enableStartPageButtons();
    }
    const rankedScores = getRankedScores(rankings);
    rankingDiv.innerHTML = '';
    rankedScores.forEach((score, index) => (createRank(score, index + 1)));
    Object.keys(rankings).forEach((key) => {
        if (rankedScores.includes(rankings[key].win)) {
            addPlayerToRankingList(rankings[key]);
        }
    });
}

getRankings(updateRanking);

function adjustButtonColorAndText(didWin) {
    playerButton.textContent = `${resultTable[didWin]} ${playerButton.dataset.hand}`;
    playerButton.dataset.didwin = didWin;
}

function updateGameView(playerHand, pcHand, didWin) {
    let didWinTranslated;
    if (isConnected()) {
        didWinTranslated = didWinTranslation[didWin];
    } else {
        didWinTranslated = didWin;
    }
    adjustButtonColorAndText(didWinTranslated);
    pcHandDiv.textContent = pcHand;
    const newRow = historyTable.insertRow();
    newRow.innerHTML = `<td data-didwin="${didWinTranslated}">${resultTable[didWinTranslated]}</td><tr><td>${playerHand}</td><td>${pcHand}</td></tr>`;
}

handButtons.forEach((x) => (x.addEventListener('click', (event) => {
        startCountdown(event);
        playerButton = event.target;
        const playerHand = event.target.dataset.hand;
        evaluateHand(playerNameInput.value, playerHand, updateGameView);
        getRankings(updateRanking);
    })
));

startGameForm.addEventListener(
    'submit', (event) => {
        event.preventDefault();
        pcHandDiv.textContent = '?';
        historyTable.innerHTML = '<tbody><tr><th>Resultat</th><th>Spieler</th><th>Gegner</th></tr></tbody>';
        const playerName = playerNameInput.value;
        if (!isConnected()) {
            addRankingIfAbsent(playerName);
        }
        handSelectorDiv.innerHTML = `<b>${playerName}!</b> Wähle deine Hand!`;
        gamePageDiv.style.display = 'block';
        startPageDiv.style.display = 'none';
        getRankings(updateRanking);
    },
);

backToStartBtn.addEventListener(
    'click', () => {
        gamePageDiv.style.display = 'none';
        startPageDiv.style.display = 'block';
    },
);

switchConnectionBtn.addEventListener(
    'click', () => {
        setConnected(!isConnected());
        getRankings(updateRanking);
        if (isConnected()) {
            disableStartPageButtons();
            startLoadingIndicator();
            switchConnectionBtn.textContent = 'Wechsle zu Lokal';
        } else {
            removeLoadingIndicator();
            switchConnectionBtn.textContent = 'Wechsle zu Server';
        }
    },
);
