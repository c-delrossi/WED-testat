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
    if (isConnected()) {
        setTimeout(() => fetch(`${SERVER_URL}/ranking`).then((r) => (r.json()).then((o) => (rankingsCallbackHandlerFn(o)))), DELAY_MS);
    } else {
        rankingsCallbackHandlerFn(rankings);
    }
}

export function addRankingIfAbsent(user) {
    if (!(user in rankings)) {
        rankings[user] = {user, win: 0};
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
    let pcHand;
    let didWin;
    if (isConnected()) {
        fetch(`${SERVER_URL}/play?playerName=${playerName}&playerHand=${playerHand}`)
            .then((r) => (r.json()))
            .then((o) => (didWinHandlerCallbackFn(playerHand, o.choice, o.win, event)));
    } else {
        pcHand = pickHand();
        didWin = determineWinner(playerHand, pcHand);
        if (didWin === 1) {
            rankings[playerName].win += 1;
        }
        didWinHandlerCallbackFn(playerHand, pcHand, didWin, event);
        localStorage.setItem('rankings', JSON.stringify(rankings));
    }
}
