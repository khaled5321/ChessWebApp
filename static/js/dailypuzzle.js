import { Chess } from './chess.js'

const chess = new Chess();
const puzzle = new Chess();
let chessBoard = null;
let solvedMark= document.getElementById("mark");
const game={
    fen:null,
    solution:null,
    turn:null
};
// fetch puzzle from lichess puzzle api
async function fetchAsync(url) {
    let response = await fetch(url);
    let data = await response.json();
    return data;
}

// let data=await fetchAsync("https://lichess.org/api/puzzle/daily");
// let pgn = data.game.pgn;
// chess.load_pgn(pgn);
// let fen = chess.fen();
chess.load("r1bqk2r/ppp1bpp1/3p1n1p/4P3/2n1P3/2P2N2/PP3PPP/RNBQR1K1 w kq - 0 9")
let fen="r1bqk2r/ppp1bpp1/3p1n1p/4P3/2n1P3/2P2N2/PP3PPP/RNBQR1K1 w kq - 0 9"
// let solution = data.puzzle.solution;
let solution= ["e5f6", "e7f6", "d1a4", "d8d7", "a4c4"]
let turn = chess.turn();
game.fen=fen;
game.solution=solution;
game.turn=turn;
let currentPos=chess.fen();

function onDragStart(source, piece, position, orientation) {
    // do not pick up pieces if the game is over
    if (chess.game_over() || game.solution===[]) return false

    // only pick up pieces for the side to move
    if ((chess.turn() === 'w' && piece.search(/^b/) !== -1) ||
        (chess.turn() === 'b' && piece.search(/^w/) !== -1)) {
        return false
    }
    
}
function onDrop(source, target) {
    // see if the move is legal
    let move = chess.move({
        from: source,
        to: target,
        promotion: 'q'
    })

    // illegal move
    if (move === null){
        return 'snapback'
    }
    
}
function onSnapEnd() {
    chessBoard.position(chess.fen());
    onChange(currentPos, chess.fen());   
}

function onChange(oldpos,newpos){
    puzzle.load(oldpos);
    puzzle.move(game.solution[0],{ sloppy: true });

    // wrong move
    if (puzzle.fen()!==newpos){
        chessBoard.position(oldpos);
        chess.load(oldpos);
    }
    // player played correct move
    else if(puzzle.fen()===newpos){
        game.solution.shift();
        
        // if the puzzle is solved
        if(game.solution.length===0){
            config.draggable=false
            solvedMark.classList.remove("hidden");
        }
        // let move = solution[0].replace(/.{2}/g, '$&-');
        // move = move.substring(0, move.length - 1);
        chess.move(game.solution[0],{ sloppy: true }); //play the computer move
        puzzle.move(game.solution[0],{ sloppy: true });
        chessBoard.position(chess.fen()); //show new position
        currentPos=chess.fen();
        solution.shift();
    }
}

const config = {
    draggable: true,
    position: game.fen,
    orientation: game.turn,
    onDragStart: onDragStart,
    onDrop: onDrop,
    onSnapEnd: onSnapEnd,
    pieceTheme:"../../static/img/chesspieces/{piece}.png"
}
chessBoard = Chessboard('board', config);