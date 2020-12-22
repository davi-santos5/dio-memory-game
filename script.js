const cards = document.querySelectorAll('.card');
const clock = document.querySelector('.clock');
const reset = document.querySelector('#reset');
const score = document.querySelector('.score-tries');

const modal = document.querySelector('.modal-wrapper');
const modalCloseBtn = document.querySelector('.modal-close');
const modalClock = document.querySelector('.modal-clock');
const modalTries = document.querySelector('.modal-tries');

let hasFlippedCard = false;
let firstCard, secondCard;
let lockBoard = false;
let tries = 0;
let chronometer;
let timeElapsed = 0;
let pairsFound = 0;

//functions for flipping cards and check the results
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
        pairsFound++;
        pairsFound === cards.length / 2 && setTimeout(endGame, 1000);
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

//function to restore default board settings for new move
function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

//functions controlling score
function addScore() {
    tries++;
    score.innerHTML = tries;
}

function resetScore() {
    tries = 0;
    score.innerHTML = tries;
}

//functions controlling the clock
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

function stopClock() {
    clearInterval(chronometer);
}

function resetClock() {  
    stopClock();

    timeElapsed = 0;
    clock.innerHTML = "00:00";
    
    startClock();
}

//function to shuffle cards
function shuffle() {
    cards.forEach(card => {
        let randomPosition = Math.floor(Math.random() * cards.length)

        card.style.order = randomPosition;
    })
}

//function to reset game
function resetGame() {
    if(lockBoard) return;
    
    cards.forEach(card => {        
        card.classList.remove('flip')
        card.addEventListener('click', flipCard)
    });
    
    resetScore();
    resetBoard();
    resetClock();
    setTimeout(shuffle, 1000);
}

//functions to control modal
function modalShow() {
    modal.classList.add('show');
}

function modalClose() {
    modal.classList.remove('show');
}

function endGame() {
    stopClock();
    modalClock.innerHTML = clockTime(timeElapsed)
    modalTries.innerHTML = tries + " TRIES"
    modalShow();
}

//calling functions to start and control the game
cards.forEach((card) => {
    card.addEventListener('click', flipCard)
})

reset.addEventListener('click', resetGame)

modalCloseBtn.addEventListener('click', modalClose)
modal.addEventListener('click', event => event.target.className === 'modal-wrapper show' && modalClose())

shuffle();
startClock();