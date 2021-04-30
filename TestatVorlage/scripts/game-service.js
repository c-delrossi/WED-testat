const DELAY_MS = 1000;
const SERVER_URL = 'https://stone.dev.ifs.hsr.ch';

let rankings;
const evaluationTable = {
    Stein: {Stein: 0, Papier: -1, Schere: 1},
    Papier: {Stein: 1, Papier: 0, Schere: -1},
    Schere: {Stein: -1, Papier: 1, Schere: 0},
};

const HANDS = ['Schere', 'Stein', 'Papier'];

if (localStorage.getItem('rankings') === null) {
    rankings = {};
} else {
    rankings = JSON.parse(localStorage.getItem('rankings'));
}

let isConnectedState = false;

export function setConnected(newIsConnected) {
    isConnectedState = Boolean(newIsConnected);
}

export function isConnected() {
    return isConnectedState;
}

export function getRankings(rankingsCallbackHandlerFn) {
    setTimeout(() => rankingsCallbackHandlerFn(rankings), DELAY_MS);
}

export function addRankingIfAbsent(name) {
    if (!(name in rankings)) {
        rankings[name] = {name, wins: 0};
        localStorage.setItem('rankings', JSON.stringify(rankings));
    }
}

function pickHand() {
    const handIndex = Math.floor(Math.random() * 3);
    return HANDS[handIndex];
}

function determineWinner(playerHand, pcHand) {
    return evaluationTable[playerHand][pcHand];
}

export function evaluateHand(playerName, playerHand, event, didWinHandlerCallbackFn) {
    const pcHand = pickHand();
    const didWin = determineWinner(playerHand, pcHand);
    if (didWin === 1) {
        rankings[playerName].wins += 1;
    }
    didWinHandlerCallbackFn(playerHand, pcHand, didWin, event);
    localStorage.setItem('rankings', JSON.stringify(rankings));
}
