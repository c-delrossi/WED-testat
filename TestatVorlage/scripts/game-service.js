// markus suggestion

const DELAY_MS = 1000;
let rankings;
const evaluationTable = {
    Stein: {Stein: 0, Papier: -1, Schere: 1},
    Papier: {Stein: 1, Papier: 0, Schere: -1},
    Schere: {Stein: -1, Papier: 1, Schere: 0},
};

export const HANDS = ['Schere', 'Stein', 'Papier'];

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

function determineWinner(playerHand, pcHand) {
    return evaluationTable[playerHand][pcHand];
}

export function evaluateHand(playerName, playerHand, pcHand, didWinHandlerCallbackFn) {
    // todo: replace calculation of didWin and update rankings while doing so.
    // optional: in local-mode (isConnected == false) store rankings in the browser localStorage https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API
    const didWin = determineWinner(playerHand, pcHand);
    if (didWin === 1) {
        rankings[playerName].wins += 1;
    }
    didWinHandlerCallbackFn(playerHand, pcHand, didWin);
    localStorage.setItem('rankings', JSON.stringify(rankings));
    return didWin;
}
