/*
GAME RULES:

- The game has 2 players, playing in rounds
- In each turn, a player rolls a dice as many times as he whishes. Each result get added to his ROUND score
- BUT, if the player rolls a 1, all his ROUND score gets lost. After that, it's the next player's turn
- The player can choose to 'Hold', which means that his ROUND score gets added to his GLBAL score. After that, it's the next player's turn
- The first player to reach 100 points on GLOBAL score wins the game

*/
var scores, roundScore, activePlayer, gamePlaying, lastDiceTotal;

init();

document.querySelector('.btn-roll').addEventListener('click', function () {
    if (gamePlaying) {
        // 1. Random Number
        var dice1, dice2, currentDiceTotal;
        dice1 = Math.floor(Math.random() * 6) + 1;
        dice2 = Math.floor(Math.random() * 6) + 1;
        console.log(dice1 + ' and ' + dice2);

        // 2. Display the result
        var dice1DOM, dice2DOM;
        dice1DOM = document.getElementById('dice-1');
        dice1DOM.style.display = 'block';
        dice1DOM.src = 'images/dice-' + dice1 + '.png';
        dice2DOM = document.getElementById('dice-2');
        dice2DOM.style.display = 'block';
        dice2DOM.src = 'images/dice-' + dice2 + '.png';

        currentDiceTotal = dice1 + dice2;
        if (currentDiceTotal === 12 && lastDiceTotal === 12) {
            // 3a. Player looses round and crevious score due to two consecutice 6s
            console.log('Player ' + (activePlayer + 1) + ' rolls consecutice double 6s. ' + ' Looses existing score ' + scores[activePlayer]);
            
            scores[activePlayer] = 0;
            document.getElementById('score-' + activePlayer).textContent = scores[activePlayer];

            // Next Player
            nextPlayer();
        } else if (dice1 !== 1 && dice2 !== 1) {
            // 3b. Update the round score if rolled number was not 1
        
            // Add score
            roundScore += currentDiceTotal;

            document.querySelector('#current-' + activePlayer).textContent = roundScore;
        } else {
            // 3c. Player looses round as rolled number was 1
            console.log('Player ' + (activePlayer + 1) + ' rolls 1. ' + ' Looses ' + roundScore);

            // Next Player
            nextPlayer();
        }
        
        // Save the value of current dice total
        lastDiceTotal = currentDiceTotal;
    }
});

document.querySelector('.btn-hold').addEventListener('click', function () {
    if (gamePlaying) {
        // Add current score to global score
        scores[activePlayer] += roundScore;
        console.log('Player ' + (activePlayer + 1) + ' adds ' + roundScore + ' now at ' + scores[activePlayer]);

        // Update the UI
        document.getElementById('score-' + activePlayer).textContent = scores[activePlayer];

        // Check if player won the gane
        var reqdFinalScore = 100, finalScoreInput;

        finalScoreInput = document.querySelector('.final-score').value;
        // Undefined, 0, null or "" are coerced to false. Anything else is coereced to true
        if (finalScoreInput) {
            reqdFinalScore = finalScoreInput;
        }
        
        if (scores[activePlayer] >= reqdFinalScore) {
            // Declare winner on UI
            document.getElementById('name-' + activePlayer).textContent = 'Winner!';
            document.querySelector('.player-' + activePlayer + '-panel').classList.add('winner');
            document.querySelector('.player-' + activePlayer + '-panel').classList.remove('active');

            // Stop game
            gamePlaying = false;
            document.getElementById('dice-1').style.display = 'none';
            document.getElementById('dice-2').style.display = 'none';
            document.querySelector('.btn-roll').style.display = 'none';
            document.querySelector('.btn-hold').style.display = 'none';
        } else {
            // Next Player
            nextPlayer();
        }
    }
});

document.querySelector('.btn-new').addEventListener('click', init);

function init() {
    scores = [0, 0];
    roundScore = 0;
    activePlayer = 0;
    gamePlaying = true;

    // Hide the dice
    document.getElementById('dice-1').style.display = 'none';
    document.getElementById('dice-2').style.display = 'none';
    document.querySelector('.btn-roll').style.display = 'block';
    document.querySelector('.btn-hold').style.display = 'block';

    // Reset the main score
    document.getElementById('score-0').textContent = 0;
    document.getElementById('score-1').textContent = 0;
    
    // Reset the round scores
    document.getElementById('current-0').textContent = 0;
    document.getElementById('current-1').textContent = 0;

    // Reset the player names and style
    document.getElementById('name-0').textContent = 'Player 1';
    document.getElementById('name-1').textContent = 'Player 2';
    document.querySelector('.player-0-panel').classList.remove('winner');
    document.querySelector('.player-1-panel').classList.remove('winner');
    document.querySelector('.player-0-panel').classList.remove('active');
    document.querySelector('.player-1-panel').classList.remove('active');
    document.querySelector('.player-0-panel').classList.add('active');
}

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
    document.getElementById('dice-1').style.display = 'none';
    document.getElementById('dice-2').style.display = 'none';

    // Log switch of user
    console.log('Switched to Player ' + (activePlayer + 1));
}

