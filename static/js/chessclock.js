import {set_game_over_flag} from './chessscript.js'

const status=document.getElementById("status");
let playing = false;
let currentPlayer = 'w';

// Add a leading zero to numbers less than 10.
const padZero = (number) => {
    if (number < 10) {
        return '0' + number;
    }
    return number;
}

// Warn the player if time drops below thirty seconds.
// const timeWarning = (player, min, sec) => {
//     // Change the numbers to red below 0 minutes and 30 seconds
//     if (min < 1 && sec <= 30) {
//         if (player === 1) {
//             clock_player1.style.color = '#CC0000';
//         } 
//         else {
//             clock_player2.style.color = '#CC0000';
//         }
//     }
// }

// Create a class for the timer.
class Timer {
    constructor(player, minutes) {
        this.player = player;
        this.minutes = minutes;
        this.seconds=0;
    }
}


// Swap player's timer after a move (player1 = 1, player2 = 2).
const swapPlayer = () => {
    if (!playing) return;
    
    // Toggle the current player.
    currentPlayer = currentPlayer === 'w' ? 'b' : 'w';
}

// Start timer countdown to zero.
const startTimer = (p1timer,p2timer) => {
    playing = true;
    document.getElementById('clock1-min').textContent = padZero(p1timer.minutes);
    document.getElementById('clock2-min').textContent = padZero(p2timer.minutes);

    p1timer.seconds=60;
    p2timer.seconds=60;

    let timerId = setInterval(function() {
        // Player 1.
        if (currentPlayer === 'w') {
            if (playing) {

                if (p1timer.seconds === 60) {
                    p1timer.minutes = p1timer.minutes - 1;
                }
                
                p1timer.seconds = p1timer.seconds - 1;

                document.getElementById('clock1-sec').textContent = padZero(p1timer.seconds);
                document.getElementById('clock1-min').textContent = padZero(p1timer.minutes);

                if (p1timer.seconds === 0) {
                    // If minutes and seconds are zero stop timer with the clearInterval method.
                    if (p1timer.seconds === 0 && p1timer.minutes === 0) {
                        // Stop timer.
                        clearInterval(timerId);
                        set_game_over_flag();
                        status.innerHTML=`Black wins! White time ran out!`;
                        playing = false;
                    }
                    p1timer.seconds = 60;
                }
            }
        } 
        else {
            // Player 2.
            if (playing) {

                if (p2timer.seconds === 60) {
                    p2timer.minutes = p2timer.minutes - 1;
                }

                p2timer.seconds = p2timer.seconds - 1;
                document.getElementById('clock2-sec').textContent = padZero(p2timer.seconds);
                document.getElementById('clock2-min').textContent = padZero(p2timer.minutes);

                if (p2timer.seconds === 0) {
                    // If minutes and seconds are zero stop timer with the clearInterval method.
                    if (p2timer.seconds === 0 && p2timer.minutes === 0) {
                        // Stop timer.
                        clearInterval(timerId);
                        set_game_over_flag();
                        status.innerHTML=`White wins! Black time ran out!`;
                        playing = false;
                    }
                    p2timer.seconds = 60;
                }
            }
        }
    }, 1000);
}

const stopTimer=()=>{
    playing=false;
}

export {Timer, startTimer, swapPlayer, stopTimer, padZero}
