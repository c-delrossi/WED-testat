// markus suggestion

const DELAY_MS = 1000;
const rankings = {};
const evaluationTable = {
    rock: {rock: 0, paper: -1, scissors: 1},
    paper: {rock: 1, paper: 0, scissors: -1},
    scissors: {rock: -1, paper: 1, scissors: 0},
};

export const HANDS = ['scissors', 'rock', 'paper'];

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

export function addRanking(rankedScores, name, wins) {
    if (!(name in rankings) || (rankings[name].wins < wins)) {
        rankings[name] = {name, wins};
    }
}

function determineWinner(playerHand, pcHand) {
    return evaluationTable[playerHand][pcHand];
}

export function evaluateHand(playerName, playerHand, pcHand, didWinHandlerCallbackFn) {
    // todo: replace calculation of didWin and update rankings while doing so.
    // optional: in local-mode (isConnected == false) store rankings in the browser localStorage https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API
    const didWin = determineWinner(playerHand, pcHand);
    setTimeout(didWinHandlerCallbackFn(playerHand, pcHand, didWin), DELAY_MS);
}
