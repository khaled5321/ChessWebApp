import {Chess} from './chess.js'

let board = null
let game_over=false; //chess.js library doens't provide a gameover flag to manually end the game
const game = new Chess()

function onDragStart (source, piece, position, orientation) {
  // do not pick up pieces if the game is over
  if (game.game_over()||game_over){return false} 

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

  // illegal move
  if (move === null) return 'snapback'
}

// update the board position after the piece snap
// for castling, en passant, pawn promotion
function onSnapEnd () {
  board.position(game.fen())
  if(mode==="offline"){
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
board = Chessboard('board', config)

const player1_name=document.getElementById("player1");
const player2_name=document.getElementById("player2");
const clock_player1=document.getElementById("clock1");
const clock_player2=document.getElementById("clock2");
const status=document.getElementById("status");
const draw_button=document.getElementById("offer_draw");
const surrender_button=document.getElementById("surrender");
const takeback_button=document.getElementById("take_back");

//if the user is logged in display his user name
player1_name.innerText=(player1)? (player1) : ("Player1"); 
if(mode==="stockfish"){
  player2_name.innerText="Stockfish";
  draw_button.style.display="none";
} 

// if(timecontrol==="unlimited"|| mode==="stockfish"){
//   clock_player1.style.display="none";
//   clock_player2.style.display="none";
// }

draw_button.addEventListener("click",()=>{
  if(game.game_over()||game_over)return;

  if(mode!=="online"){
    status.innerHTML="Game Ended. Players Agreed to a Draw";
    game_over=true;
  }
});

surrender_button.addEventListener("click",()=>{
  if(game.game_over()||game_over) return;

  let game_turn=(game.turn()==='w')?('White'):('Black');
  status.innerHTML=`Game Ended. ${game_turn} has surrenderd!`;
  game_over=true;
});

takeback_button.addEventListener("click",()=>{
  if(game.game_over()||game_over) return;

  let undo=game.undo();

  if(undo){
    board.position(game.fen());
    if(mode==="offline"){
      board.flip()
    }
  }
});