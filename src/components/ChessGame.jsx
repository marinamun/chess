import React, { useEffect, useRef, useState } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js"; // Import the Chess class from chess.js

const ChessGame = () => {
  const chessGame = new Chess();
  const [position, setPosition] = useState(chessGame.fen());
  const [isBotThinking, setIsBotThinking] = useState(false);
  const stockfishRef = useRef(null);

  useEffect(() => {
    const initializeStockfish = () => {
      if (window.Stockfish) {
        console.log("Stockfish is available.");
        stockfishRef.current = window.Stockfish();
        stockfishRef.current.onmessage = (event) => {
          console.log("Stockfish message:", event);

          if (event && event.startsWith("bestmove")) {
            const bestMove = event.split(" ")[1];
            console.log("Best move from Stockfish:", bestMove);

            const move = chessGame.move(bestMove);
            if (move) {
              setPosition(chessGame.fen());
              setIsBotThinking(false);

              if (chessGame.isGameOver()) {
                alert("Game Over!");
              }
            } else {
              console.error("Invalid move from Stockfish:", bestMove);
            }
          }
        };
      } else {
        console.error("Stockfish is not available.");
      }
    };

    const scriptCheckInterval = setInterval(() => {
      if (window.Stockfish) {
        initializeStockfish();
        clearInterval(scriptCheckInterval);
      }
    }, 100);

    return () => {
      if (stockfishRef.current) {
        stockfishRef.current.terminate();
        console.log("Terminating Stockfish...");
      }
      clearInterval(scriptCheckInterval);
    };
  }, []);

  const onDrop = ({ sourceSquare, targetSquare }) => {
    console.log("Human move:", sourceSquare, targetSquare);

    const move = chessGame.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q",
    });

    if (move === null) {
      console.error("Invalid move.");
      return;
    }

    setPosition(chessGame.fen());
    setIsBotThinking(true);

    if (stockfishRef.current) {
      const fen = chessGame.fen();
      console.log("Posting position to Stockfish:", fen);
      stockfishRef.current.postMessage(`position fen ${fen}`);
      stockfishRef.current.postMessage("go depth 15");
    } else {
      console.error("Stockfish is not initialized.");
    }
  };

  return (
    <>
      <h1>Hi from chessboard</h1>
      <Chessboard position={position} onDrop={onDrop} />
      {isBotThinking && <p>Bot is thinking...</p>}
    </>
  );
};

export default ChessGame;
