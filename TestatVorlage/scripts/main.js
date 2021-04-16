import {HANDS, isConnected, getRankings, evaluateHand, setConnected, addRankingIfAbsent} from './game-service.js';

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
let countdownLength;


function pickHand() {
    const handIndex = Math.floor(Math.random() * 3);
    return HANDS[handIndex];
}

const backToStartBtn = document.querySelector('#back-to-start-btn');
const switchConnectionBtn = document.querySelector('#switch-connection-btn');
const playerNameInput = document.querySelector('#player-name-input');
const handSelectorDiv = document.querySelector('#hand-selector-div');
const pcHandDiv = document.querySelector('#computer-hand-div');
const historyTable = document.querySelector('#history-table');
const rankingList = document.querySelector('#ranking-list');
const countdownDiv = document.querySelector('#countdown-div');
const gamePageDiv = document.querySelector('#game-page');
const startPageDiv = document.querySelector('#start-page');
const handButtons = document.querySelectorAll('.hand-btn');
const buttons = document.querySelectorAll('button');
const startGameForm = document.querySelector('#start-game-form');

function switchButtonState() {
    buttons.forEach((button) => {
        button.disabled = !button.disabled;
    });
}

function resetHandButtons() {
    handButtons.forEach((button) => {
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

function getRankedScores(rankings) {
    let scores = new Set();
    Object.keys(rankings).forEach((key) => (scores.add(rankings[key].wins)));
    scores = Array.from(scores);
    scores.sort((current, previous) => (previous - current));
    return scores.slice(0, 10);
}

function addPlayerToRankingList(entry) {
    const score = entry.wins;
    document.querySelector(`#list-score-${score}`).innerHTML += `<div>${entry.name}</div>`;
}

function createRank(score, rank) {
    rankingList.innerHTML += `<b>${rank}. Rang mit ${score} Siegen</b><div id="list-score-${score}"></div>`;
}

function updateRanking(rankings) {
    const rankedScores = getRankedScores(rankings);
    rankingList.innerHTML = '';
    rankedScores.forEach((score, index) => (createRank(score, index + 1)));
    Object.keys(rankings).forEach((key) => {
        if (rankedScores.includes(rankings[key].wins)) {
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

function adjustButtonColorAndText(event, didWin) {
    event.target.textContent = `${resultTable[didWin]} ${event.target.dataset.hand}`;
    event.target.style.color = colorTable[didWin];
}

handButtons.forEach((x) => (x.addEventListener('click', (event) => {
        startCountdown(event);
        const playerHand = event.target.dataset.hand;
        const pcHand = pickHand();
        pcHandDiv.textContent = pcHand;
        const didWin = evaluateHand(playerName, playerHand, pcHand, updateHistory);
        adjustButtonColorAndText(event, didWin);
        getRankings(updateRanking);
    })
));

startGameForm.addEventListener(
    'submit', (event) => {
        event.preventDefault();
        pcHandDiv.textContent = '?';
        historyTable.innerHTML = '<tbody><tr><th>Resultat</th><th>Spieler</th><th>Gegner</th></tr></tbody>';
        playerName = playerNameInput.value;
        addRankingIfAbsent(playerName);
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
        if (isConnected()) {
            switchConnectionBtn.textContent = 'Wechsle zu Lokal';
        } else {
            switchConnectionBtn.textContent = 'Wechsle zu Server';
        }
    },
);
