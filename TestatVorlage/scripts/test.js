import {HANDS, isConnected, getRankings, evaluateHand, setConnected, addRankingIfAbsent} from './game-service.js';

// TODO: Replace the following is demo code which should not be inclucec in the final solution
const resultTable = {
    0: '=',
    '-1': '×',
    1: '✓',
};
const colorTable = {
    0: 'black',
    1: 'green',
    '-1': 'red',
};
let playerName;
let playerSequenceNumber = 1;
let countdownLength;

if (localStorage.getItem('playerSequenceNumber') === null) {
    playerSequenceNumber = 1;
} else {
    playerSequenceNumber = localStorage.getItem('playerSequenceNumber');
}

function pickHand() {
    const handIndex = Math.floor(Math.random() * 3);
    return HANDS[handIndex];
}

const startGameBtn = document.querySelector('#start-game-btn');
const backToStartBtn = document.querySelector('#back-to-start-btn');
const switchConnectionBtn = document.querySelector('#switch-connection-btn');
const playerNameInput = document.querySelector('#player-name-input');
const handSelectorDiv = document.querySelector('#hand-selector-div');
const pcHandDiv = document.querySelector('#computer-hand-div');
const historyTable = document.querySelector('#history-table');
const rankingList = document.querySelector('#ranking-list');
const countdownDiv = document.querySelector('#countdown-div');

function switchButtonState() {
    document.querySelectorAll('Button').forEach((button) => (button.disabled=!button.disabled));
}

function resetHandButtons() {
    document.querySelectorAll('.hand-btn').forEach((button) => {
        button.style.color = 'black';
        button.textContent = button.dataset.hand;
    });
}

function countDown() {
    if (countdownLength === 0) {
        countdownDiv.textContent = 'VS';
        pcHandDiv.textContent = '?';
        resetHandButtons();
        switchButtonState();
    } else {
        countdownDiv.textContent = `Nächste Runde in ${countdownLength}`;
        countdownLength--;
        setTimeout(countDown, 1000);
    }
}

function startCountdown() {
    switchButtonState();
    countdownLength = 3;
    countDown(countDown);
}

function getTopScores(rankings) {
    let scores = new Set();
    Object.keys(rankings).forEach((key) => (scores.add(rankings[key].wins)));
    scores = Array.from(scores);
    scores.sort((current, previous) => (previous - current));
    return scores.slice(0, 10);
}

function addPlayerToRankingList(entry) {
    const score = entry.wins;
    const listElement = document.createElement('div');
    listElement.textContent = entry.name;
    document.querySelector(`#list-score-${score}`).appendChild(listElement);
}

function createRank(score, rank) {
    const listElement = document.createElement('div');
    const subList = document.createElement('div');
    subList.dataset.score = score;
    subList.id = `list-score-${score}`;
    listElement.innerHTML = `<b>${rank}. Rang mit ${score} Siegen</b>`;
    listElement.append(subList);
    rankingList.append(listElement);
}

function updateRanking(rankings) {
    const scores = getTopScores(rankings);
    rankingList.innerHTML = '';
    scores.forEach((score, index) => (createRank(score, index + 1)));
    Object.keys(rankings).forEach((key) => {
        if (scores.includes(rankings[key].wins)) {
            addPlayerToRankingList(rankings[key]);
        }
    });
}

if (localStorage.getItem('rankings') !== null) {
    updateRanking(JSON.parse(localStorage.getItem('rankings')));
}

function updateHistory(playerHand, pcHand, didWin) {
    const newRow = historyTable.insertRow();
    newRow.innerHTML = `<td style="color:${colorTable[didWin]}">${resultTable[didWin]}</td><tr><td>${playerHand}</td><td>${pcHand}</td></tr>`;
}

document.querySelectorAll('.hand-btn').forEach((x) => (x.addEventListener('click', (event) => {
    startCountdown(event);
    const playerHand = event.target.dataset.hand;
    const pcHand = pickHand();
    pcHandDiv.textContent = pcHand;
    const didWin = evaluateHand(playerName, playerHand, pcHand, updateHistory);
    event.target.textContent = `${resultTable[didWin]} ${event.target.dataset.hand}`;
    event.target.style.color = colorTable[didWin];
    getRankings(updateRanking);
    })
));

startGameBtn.addEventListener(
    'click', () => {
        pcHandDiv.textContent = '?';
        historyTable.innerHTML = '<tbody><tr><th>Resultat</th><th>Spieler</th><th>Gegner</th></tr></tbody>';
        if (playerNameInput.value === '') {
            playerName = `Spieler ${playerSequenceNumber++}`;
            localStorage.setItem('playerSequenceNumber', playerSequenceNumber);
        } else {
            playerName = playerNameInput.value;
        }
        addRankingIfAbsent(playerName);
        handSelectorDiv.innerHTML = `<b>${playerName}!</b> Wähle deine Hand!`;
        document.querySelector('#game-page').style.display = 'block';
        document.querySelector('#start-page').style.display = 'none';
        getRankings(updateRanking);
    },
);

backToStartBtn.addEventListener(
    'click', () => {
        document.querySelector('#game-page').style.display = 'none';
        document.querySelector('#start-page').style.display = 'block';
    },
);

switchConnectionBtn.addEventListener(
    'click', () => {
        setConnected(!isConnected());
        if (isConnected()) {
            switchConnectionBtn.textContent = 'Wechsle zu Lokal';
        } else {
            switchConnectionBtn.textContent = 'Wechsle zu Server';
        }
    },
);
