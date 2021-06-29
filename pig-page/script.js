'use strict';

//Players
const totalPlayers = 2
const players = [];
for( let i = 0; i < totalPlayers; i++ ) {
    players[ i ] = {
        container: document.querySelector( `.container--${ i }` ),
        score: document.getElementById( `score--${ i }` ),
        currentScore: document.getElementById( `current--${ i }` )
    }
}

//Dice and Buttons
let dice = document.querySelector( '.dice' );
let btnNewGame = document.querySelector( '.btn--new' );
let btnRoll = document.querySelector( '.btn--roll' );
let btnHold = document.querySelector( '.btn--hold' );

//State Variables
let gameState, activePlayer, diceNumber, currentScore, score;
init();

//New Game
btnNewGame.addEventListener( 'click', reset );

//Rolling Dice
btnRoll.addEventListener( 'click', function(){
    
    if( gameState ) {

        //Getting diceNumber
        diceNumber = Math.trunc( Math.random() * 6 ) + 1
        dice.src = `dice-${ diceNumber }.png`;
        dice.classList.remove( 'hidden' );

        //Setting Current Score
        if( diceNumber !== 1 ) setCurrentScore();

        //Swtiching Turn when it 1
        else {
            setCurrentScore();
            switchTurn();
        }

    }
});

//Holding Score / Checking Game Result
btnHold.addEventListener( 'click', function(){

    if( gameState ) {
        setScore();
        if( score[ activePlayer ] >= 100 ) { 
            players[ activePlayer ].container.classList.add( 'player--winner' );
            gameState = false;
        }
        else switchTurn();
    }
});

//Functions
function init(){
    gameState = true;
    activePlayer = 0;
    diceNumber = 0;
    currentScore = 0;
    score = [ 0, 0 ];
}
function reset() {

    //Inits State and Clears Layout
    init();
    for( let i = 0; i < totalPlayers; i++ ) {
        players[ i ].score.textContent = String( score[ i ] );
        players[ i ].currentScore.textContent = String( currentScore );
        players[ i ].container.classList.remove( 'player--winner' );
    }
}
function setCurrentScore() {
    currentScore = ( diceNumber === 1 ) ? 0 : currentScore + diceNumber;
    players[ activePlayer ].currentScore.textContent = String( currentScore );
}
function setScore(){
    score[ activePlayer ] = score[ activePlayer ] + currentScore;
    players[ activePlayer ].score.textContent = String( score[ activePlayer ] );
}
function switchTurn() {

    //Clear Current Score
    currentScore = 0;
    players[ activePlayer ].currentScore.textContent = '0';

    //Switch Active Player and Toggle Classes
    activePlayer = ( activePlayer ) ? 0 : 1;  

    for( let i = 0; i < totalPlayers; i++ ) {
        if( i === activePlayer ) players[ i ].container.classList.add( 'player--active' );
        else players[ i ].container.classList.remove( 'player--active' );
    }
}



