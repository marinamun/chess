import React, { useEffect, useRef, useState } from "react";
import Chessboard from "chessboardjsx"; // Import the chessboard from chessboardjsx library
import { Chess } from "chess.js"; // Import the Chess class from chess.js

// We can't import stockfish here because Vite doesn't support it, that's why we rely on the window.stockfish later

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
    if (window.Stockfish) {
      stockfishRef.current = window.Stockfish();

      //Check what stockfish considers the best move
      stockfishRef.current.onmessage = (event) => {
        if (event && event.startsWith("bestmove")) {
          // Extract the numerical position with its index since it comes as "best-move e4"
          const bestMove = event.split(" ")[1];

          //Make the move and Set that best move as its new position
          chessGame.move(bestMove);
          setPosition(chessGame.fen());
          //Set that the bot is not thinking any longer
          setIsBotThinking(false);
        }
      };

      //Terminate stockfish when the game is over
      return () => {
        stockfishRef.current.terminate();
      };
    }
  }, []);

  //HOW THE HUMAN MOVES
  const onDrop = ({ sourceSquare, targetSquare }) => {
    const move = chessGame.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q",
    });

    //if they make a move that isn't possible, exit
    if (move === null) return;

    setPosition(chessGame.fen());
    setIsBotThinking(true);

    stockfishRef.current.postMessage(`position fen ${chessGame.fen()}`);
    stockfishRef.current.postMessage("go depth 15"); //this is the command to instruct stockfish to start calculating the next best move
  };

  return (
    <>
      <h1>Hi from chessboard</h1>
      <Chessboard
        position={position}
        onDrop={onDrop} // Attach the onDrop handler to the Chessboard component
      />
    </>
  );
};
export default ChessGame;
