var stockfish = new Worker('stockfish.js');

stockfish.addEventListener('message', function (e) {
  console.log(e.data);
});

var fenString = "rnbqkbnr/ppppp1pp/8/5p2/3P4/8/PPP1PPPP/RNBQKBNR w KQkq - 0 2"
// start UCI
stockfish.postMessage("uci");
// start new game
stockfish.postMessage("ucinewgame");
// set new game position
stockfish.postMessage("position fen " + fenString);
// start search
stockfish.postMessage("go depth 10");