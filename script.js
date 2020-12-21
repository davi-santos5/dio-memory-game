const cards = document.querySelectorAll('.card');
const clock = document.querySelector('.clock');
const reset = document.querySelector('#reset');
const score = document.querySelector('.score-tries');

let hasFlippedCard = false;
let firstCard, secondCard;
let lockBoard = false;
let tries = 0;
let chronometer;
let timeElapsed = 0;


function flipCard() {
    if(lockBoard) return;
    if(this === firstCard) return;

    this.classList.add('flip');
    if(!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;
        return;
    }

    secondCard = this;
    checkForMatch();
}

function checkForMatch() {
    if(firstCard.dataset.card === secondCard.dataset.card) {
        disableCards();
        return;
    }

    unflipCards();
}

function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);

    resetBoard();
    addScore();
}

function unflipCards() {
    lockBoard = true;
    
    setTimeout(() => {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');

        resetBoard();
        addScore();
    }, 1500);
}

function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

function addScore() {
    tries++;
    score.innerHTML = tries;
}

(function shuffle() {
    cards.forEach(card => {
        let randomPosition = Math.floor(Math.random() * cards.length)

        card.style.order = randomPosition;
    })
})();

function clockTime(time) {
    let min = 0;
    let sec = 0;

    min = Math.floor(time / 60);
    sec = time % 60;

    if (min < 10) min = "0" + min;
    if (sec < 10) sec = "0" + sec;

    return `${min}:${sec}`;
}

function tick() {
    timeElapsed++;
    clock.innerHTML = clockTime(timeElapsed);
}

function startClock() {
    chronometer = setInterval(tick, 1000);
}

function resetClock() {
    clearInterval(chronometer);

    timeElapsed = 0;
    clock.innerHTML = "00:00";
    
    startClock();
}

startClock();

function resetGame() {
    if(lockBoard) return;

    resetBoard();
    cards.forEach(card => {
        let randomPosition = Math.floor(Math.random() * cards.length)

        card.classList.remove('flip')
        card.addEventListener('click', flipCard)
        card.style.order = randomPosition;
    });

    resetClock();
}

cards.forEach((card) => {
    card.addEventListener('click', flipCard)
})

reset.addEventListener('click', resetGame)