// markus suggestion

const DELAY_MS = 1000;
const rankedScores = [];
const rankings = {};

export const HANDS = ['scissors', 'rock', 'paper'];

let isConnectedState = false;

export function setConnected(newIsConnected) {
    isConnectedState = Boolean(newIsConnected);
}

export function isConnected() {
    return isConnectedState;
}

export function getRankings(rankingsCallbackHandlerFn) {
    setTimeout(() => rankingsCallbackHandlerFn(rankings, rankedScores), DELAY_MS);
}

export function addRanking(name, wins) {
    if (rankedScores.includes(wins)) {
        rankings[name] = {name, wins};
    } else if (rankedScores.length < 10) {
        rankings[name] = {name, wins};
        rankedScores.push(wins);
        rankedScores.sort((current, previous) => (previous - current));
    } else if (rankedScores[9] < wins) {
        Object.keys(rankings).forEach((x) => {
            if (rankings[x].wins === rankedScores[9]) {
                delete rankings[x];
            }
        });
        rankedScores[9] = wins;
        rankings[name] = {name, wins};
        rankedScores.sort((current, previous) => (previous - current));
    }
}

function determineWinner(playerHand, pcHand) {
    switch (playerHand) {
        case 'scissors':
            switch (pcHand) {
                case 'paper':
                    return 1;
                case 'rock':
                    return -1;
                default:
                    return 0;
            }
        case 'paper':
            switch (pcHand) {
                case 'rock':
                    return 1;
                case 'scissors':
                    return -1;
                default:
                    return 0;
            }
        case 'rock':
            switch (pcHand) {
                case 'scissors':
                    return 1;
                case 'paper':
                    return -1;
                default:
                    return 0;
            }
        default:
            return 0;
    }
}

export function evaluateHand(playerName, playerHand, pcHand, didWinHandlerCallbackFn) {
    // todo: replace calculation of didWin and update rankings while doing so.
    // optional: in local-mode (isConnected == false) store rankings in the browser localStorage https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API
    const didWin = determineWinner(playerHand, pcHand);
    setTimeout(didWinHandlerCallbackFn(playerHand, pcHand, didWin), DELAY_MS);
}
