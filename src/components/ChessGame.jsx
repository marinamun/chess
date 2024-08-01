import React, { useEffect, useState } from "react";
import Chessboard from "chessboardjsx"; // Import the chessboard from chessboardjsx library
import { Chess } from "chess.js"; // Import the Chess class from chess.js
import stockfish from "stockfish"; // Import stockfish that will serve as the bot to play against

const ChessGame = () => {
  // Create a new chess game instance
  const chessGame = new Chess();

  // State to keep track of the current position on the chessboard (human's and bot's)
  const [position, setPosition] = useState(chessGame.fen());

  // State to keep track of whether the bot is thinking
  const [isBotThinking, setIsBotThinking] = useState(false);

  // HOW STOCKFISH WAKES UP, THINKS AND MOVES: Initialize Stockfish to be able to manage it, initial state is "null" because there are no moves yet
  const stockfishRef = useRef(null);

  useEffect(() => {
    //Initialize stockfish engine
    stockfishRef.current = stockfish();

    //Check what stockfish considers the best move
    stockfishRef.current.onmessage = (event) => {
      if (event && event.startsWith("bestmove")) {
        // Extract the numerical position with its index since it comes as "best-move e4"
        const bestMove = event.split(" ")[1];

        //Make the move and Set that best move as its new position
        chessGame.move(bestMove);
        setPosition(chessGame.fen());
        //Set that the bot is not thinking any longer
        setIsBotThinking(false)
      }
    };

    //Terminate stockfish when the game is over
    return() => {
      stockfishRef.current.terminate()
    }
  }, []);

  //HOW THE HUMAN MOVES
  

  return (
    <>
      <h1>Hi from chessboard</h1>
    </>
  );
};
export default ChessGame;
