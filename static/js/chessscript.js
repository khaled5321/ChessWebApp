import {Chess} from './chess.js'
import {Timer, startTimer, swapPlayer, stopTimer } from './chessclock.js';

let board = null;
let game_over=false; //chess.js library doens't provide a gameover flag to manually end the game
const game = new Chess();
var stockfish;

function onDragStart (source, piece, position, orientation) {
  // do not pick up pieces if the game is over
  if (game.game_over()||game_over){return false} 
 
  if(mode!=="offline"){
    // only pick up pieces for the side to move / only pick up pieces for White
    let side=(turn[0]==='w')?(piece.search(/^b/) ):(piece.search(/^w/) );
    if ((side !== -1)) {
      return false
    }
  }
  // only pick up pieces for the side to move
  if ((game.turn() === 'w' && piece.search(/^b/) !== -1) ||
      (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
    return false
  }
}

function onDrop (source, target) {
  status.innerHTML="";
  // see if the move is legal
  let move = game.move({
    from: source,
    to: target,
    promotion: 'q'
  })

  if(game.in_check() &&!game.game_over()){
    let game_turn=(game.turn()==='w')?('White'):('Black');
    status.innerHTML=`${game_turn} is in Check!`;
  }
  else if(game.game_over()){
    stopTimer();
    GameOver();
    /*
    if(game.in_checkmate()){
      let game_turn=(game.turn()==='w')?('Black'):('White');
      status.innerHTML=`Checkmate! ${game_turn} Won!`;
    }
    else if(game.in_draw()){
      status.innerHTML=`Game Ended. Draw!`;
    }
    else if(game.in_stalemate()){
      status.innerHTML=`Game Ended. Stalemate!`;
    }
    else if(game.in_threefold_repetition()){
      status.innerHTML=`Game Ended. Threefold Repetition!`;
    }
    else if(game.insufficient_material()){
      status.innerHTML=`Game Ended. Insufficient Material!`;
    }
    */
  }
  // illegal move
  if (move === null) return 'snapback'
}

// update the board position after the piece snap
// for castling, en passant, pawn promotion
function onSnapEnd () {
  board.position(game.fen())
  swapPlayer();
  
  if(mode==="stockfish"){
    stockfish.postMessage("position fen " + game.fen());
    stockfish.postMessage("go depth 10");
  }

  else if(mode==="offline"){
    board.flip()
  }
}
  
const config = {
  draggable: true,
  position: 'start',
  onDragStart: onDragStart,
  onDrop: onDrop,
  onSnapEnd: onSnapEnd,
  orientation:(turn)?(turn):("white")
}
board = Chessboard('board', config);

if(mode==="stockfish"){
  stockfish = new Worker(stockfishURL);
  stockfish.postMessage("uci");
  stockfish.postMessage("ucinewgame");
  if(game.turn()!==turn[0]){
    stockfish.postMessage("position fen rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
    stockfish.postMessage("go depth 10");
  }

  stockfish.addEventListener('message', function (e){
    console.log(e.data);
    let info = e.data ? e.data : '';
  
    if (info.includes('bestmove') || info.includes('ponder')) {
      const bestmove = info.split(/ +/)[1];
      
      game.move(bestmove, {promotion: 'q', sloppy: true});
      board.position(game.fen());
      if(game.game_over()){GameOver()}
      stockfish.postMessage(`position fen ${game.fen()}`); // update fen of stockfish
    }
  });
}

if(timecontrol==="time"){
  let p1timer = new Timer('w', parseInt(minutes, 10));
  let p2timer = new Timer('b', parseInt(minutes, 10));
  startTimer(p1timer,p2timer);
}

const player1_name=document.getElementById("player1"); //player1 label
const player2_name=document.getElementById("player2"); //player2 label
const status=document.getElementById("status"); //status label
const clock_player1=document.getElementById("clock1");
const clock_player2=document.getElementById("clock2");
const draw_button=document.getElementById("offer_draw");
const surrender_button=document.getElementById("surrender");
const takeback_button=document.getElementById("take_back");

//if the user is logged in display his username
player1_name.innerText=(player1)? (player1) : ("Player1");

// time unlimited hide clocks [to maintain ui diminsions]
if(timecontrol==="unlimited"|| mode==="stockfish"){
  clock_player1.style.visibility="hidden"
  clock_player2.style.visibility="hidden"
}

if(mode==="stockfish"){
  player2_name.innerText="Stockfish";
  draw_button.style.display="none";
}

draw_button.addEventListener("click",()=>{
  if(game.game_over()||game_over)return;

  if(mode!=="online"){
    status.innerHTML="Game Ended. Players Agreed to a Draw";
    stopTimer();
    game_over=true;
  }
});

surrender_button.addEventListener("click",()=>{
  if(game.game_over()||game_over) return;

  let game_turn=(game.turn()==='w')?('White'):('Black');
  if(mode==="online"){game_turn=turn}
  status.innerHTML=`Game Ended. ${game_turn} has surrenderd!`;
  stopTimer();
  game_over=true;
});

takeback_button.addEventListener("click",()=>{
  if(game.game_over()||game_over) return;

  let undo=game.undo();
  if(undo){
    board.position(game.fen());
    if(mode==="stockfish"){
      stockfish.postMessage(`position fen ${game.fen()}`);
      let undo=game.undo();
      if(undo){
        board.position(game.fen());
        stockfish.postMessage(`position fen ${game.fen()}`);
      }
    }
    swapPlayer();
    if(mode==="offline"){
      board.flip();
    }
  }
});

function GameOver(){
  game_over=true;
  
  if(game.in_checkmate()){
    let game_turn=(game.turn()==='w')?('Black'):('White');
    status.innerHTML=`Checkmate! ${game_turn} Won!`;
  }
  else if(game.in_draw()){
    status.innerHTML=`Game Ended. Draw!`;
  }
  else if(game.in_stalemate()){
    status.innerHTML=`Game Ended. Stalemate!`;
  }
  else if(game.in_threefold_repetition()){
    status.innerHTML=`Game Ended. Threefold Repetition!`;
  }
  else if(game.insufficient_material()){
    status.innerHTML=`Game Ended. Insufficient Material!`;
  }
}
export function set_game_over_flag(){game_over=true}