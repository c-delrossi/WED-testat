import {HANDS, isConnected, getRankings, evaluateHand, setConnected, addRanking} from './game-service.js';

// TODO: Replace the following is demo code which should not be inclucec in the final solution

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

function updateRanking(rankings, scores) {
    rankingList.innerHTML = '';
    scores.forEach((score) => (createRank(score)));
    Object.keys(rankings).forEach((key) => (addPlayerToRankingList(rankings[key])));
    // rankingList.innerHTML = '';
    // ranking.sort((current, previous) => (previous.win - current.win));
    // ranking.forEach((entry) => addToRankingList(entry));
}

function updateHistory(playerHand, pcHand, didWin) {
    let symbol;
    switch (didWin) {
        case 1:
            winCount++;
            symbol = '✓';
            break;
        case -1:
            symbol = '×';
            break;
        default:
            symbol = '=';
    }
    const newRow = historyTable.insertRow();
    newRow.innerHTML = `<td>${symbol}</td><tr><td>${playerHand}</td><td>${pcHand}</td></tr>`;
}

document.querySelectorAll('.hand-btn').forEach((x) => (x.addEventListener('click', (event) => {
    const playerHand = event.target.dataset.hand;
    const pcHand = pickHand();
    pcHandDiv.textContent = pcHand;
    evaluateHand(playerName, playerHand, pcHand, updateHistory);
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
    },
);

backToStartBtn.addEventListener(
    'click', () => {
        addRanking(playerName, winCount);
        getRankings(updateRanking);
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
