import {HANDS, isConnected, getRankings, evaluateHand, setConnected, addRanking} from './game-service.js';

// TODO: Replace the following is demo code which should not be inclucec in the final solution
const resultTable = {
    0: '=',
    '-1': '×',
    1: '✓',
};
let winCount = 0;
let playerName;

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

function getTopScores(rankings) {
    let scores = new Set();
    Object.keys(rankings).forEach((key) => (scores.add(rankings[key].wins)));
    scores = Array.from(scores);
    scores.sort((current, previous) => (previous - current));
    return scores.slice(0, 10);
}

function addPlayerToRankingList(entry) {
    const score = entry.wins;
    const listElement = document.createElement('li');
    listElement.textContent = entry.name;
    document.querySelector(`#list-score-${score}`).appendChild(listElement);
}

function createRank(score) {
    const listElement = document.createElement('li');
    const subList = document.createElement('ul');
    subList.dataset.score = score;
    subList.id = `list-score-${score}`;
    listElement.textContent = ` Rang mit ${score} Siegen`;
    listElement.append(subList);
    rankingList.append(listElement);
}

function updateRanking(rankings) {
    const oldScores = getTopScores(rankings);
    addRanking(oldScores, playerName, winCount);
    const scores = getTopScores(rankings);
    rankingList.innerHTML = '';
    scores.forEach((score) => (createRank(score)));
    Object.keys(rankings).forEach((key) => {
        if (scores.includes(rankings[key].wins)) {
            addPlayerToRankingList(rankings[key]);
        }
    });
}

function updateHistory(playerHand, pcHand, didWin) {
    if (didWin === 1) {
        winCount++;
    }
    const newRow = historyTable.insertRow();
    newRow.innerHTML = `<td>${resultTable[didWin]}</td><tr><td>${playerHand}</td><td>${pcHand}</td></tr>`;
}

document.querySelectorAll('.hand-btn').forEach((x) => (x.addEventListener('click', (event) => {
    const playerHand = event.target.dataset.hand;
    const pcHand = pickHand();
    pcHandDiv.textContent = pcHand;
    evaluateHand(playerName, playerHand, pcHand, updateHistory);
    getRankings(updateRanking);
    })
));

startGameBtn.addEventListener(
    'click', () => {
        winCount = 0;
        historyTable.innerHTML = '';
        playerName = playerNameInput.value;
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
