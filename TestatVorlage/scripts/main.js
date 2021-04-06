import {HANDS, isConnected, getRankings, evaluateHand, setConnected} from './game-service.js';

// TODO: Replace the following is demo code which should not be inclucec in the final solution

console.log('isConnected:', isConnected());

getRankings((rankings) => console.log('rankings:', rankings));

function pickHand() {
    const handIndex = Math.floor(Math.random() * 3);
    return HANDS[handIndex];
}

let count = 1;

function printWinner(hand, didWin) {
    console.log(count++, hand, didWin);
}

for (let i = 1; i < 10; i++) {
    const hand = pickHand();
    evaluateHand('peter', hand, (didWin) => printWinner(hand, didWin));
}

const startGameBtn = document.querySelector('#start-game-btn');
const backToStartBtn = document.querySelector('#back-to-start-btn');
const switchConnectionBtn = document.querySelector('#switch-connection-btn');
const playerNameInput = document.querySelector('#player-name-input');
const handSelectorDiv = document.querySelector('#hand-selector-div');

startGameBtn.addEventListener(
    'click', () => {
        startGameBtn.style.display = 'none';
        handSelectorDiv.innerHTML = `<b>${playerNameInput.value}!</b> Select your hand!`;
        document.querySelectorAll('.start-page').forEach((x) => (x.style.display = 'none'));
        document.querySelectorAll('.game-page').forEach((x) => (x.style.display = 'block'));
        document.querySelectorAll('.hand-btn').forEach((x) => (x.style.display = 'inline-block'));
    },
);

backToStartBtn.addEventListener(
    'click', () => {
        document.querySelectorAll('.start-page').forEach((x) => (x.style.display = 'block'));
        document.querySelectorAll('.game-page').forEach((x) => (x.style.display = 'none'));
        document.querySelectorAll('.hand-btn').forEach((x) => (x.style.display = 'none'));
        startGameBtn.style.display = 'block';
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
