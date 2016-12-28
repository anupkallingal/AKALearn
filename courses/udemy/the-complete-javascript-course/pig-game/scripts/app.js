/*
GAME RULES:

- The game has 2 players, playing in rounds
- In each turn, a player rolls a dice as many times as he whishes. Each result get added to his ROUND score
- BUT, if the player rolls a 1, all his ROUND score gets lost. After that, it's the next player's turn
- The player can choose to 'Hold', which means that his ROUND score gets added to his GLBAL score. After that, it's the next player's turn
- The first player to reach 100 points on GLOBAL score wins the game

*/
var scores, roundScore, activePlayer, dice;

scores = [0, 0];
roundScore = 0;
activePlayer = 0;

document.querySelector('.dice').style.display = 'none';

document.getElementById('score-0').textContent = 0;
document.getElementById('score-1').textContent = 0;
document.getElementById('current-0').textContent = 0;
document.getElementById('current-1').textContent = 0;

document.querySelector('.btn-roll').addEventListener('click', function () {
    // 1. Random Number
    dice = Math.floor(Math.random() * 6) + 1;
    console.log(dice);

    // 2. Display the result
    var diceDOM = document.querySelector('.dice');
    diceDOM.style.display = 'block';
    diceDOM.src = 'images/dice-' + dice + '.png';
    
    // 3. Update the round score if rolled number was not 1
    if (dice !== 1) {
        // Add score
        roundScore += dice;
        
        document.querySelector('#current-' + activePlayer).textContent = roundScore;
    } else {
        // Next Player
        nextPlayer();
    }
});

document.querySelector('.btn-hold').addEventListener('click', function () {
    // Add current score to global score
    scores[activePlayer] += roundScore;
    
    // Update the UI
    document.getElementById('score-' + activePlayer).textContent = scores[activePlayer];
    
    // Check if player won the gane
    if (scores[activePlayer] > 100) {
        // Declare winner on UI
        document.getElementById('name-' + activePlayer).textContent = 'Winner!';
        document.querySelector('.player-' + activePlayer + '-panel').classList.add('winner');
        document.querySelector('.player-' + activePlayer + '-panel').classList.remove('active');

        // Stop game
        document.querySelector('.dice').style.display = 'none';
    } else {
        // Next Player
        nextPlayer();
    }
});


function nextPlayer() {
    // Switch active player
    activePlayer = activePlayer === 0 ? 1 : 0;
    // Clear round score
    roundScore = 0;

    // Update the UI
    document.getElementById('current-0').textContent = 0;
    document.getElementById('current-1').textContent = 0;
    document.querySelector('.player-0-panel').classList.toggle('active');
    document.querySelector('.player-1-panel').classList.toggle('active');
    document.querySelector('.dice').style.display = 'none';

    // Log switch of user
    console.log('Switched to Player ' + (activePlayer + 1));
}
