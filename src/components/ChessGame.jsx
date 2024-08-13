import React, { useEffect, useRef, useState } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";

const ChessGame = () => {
  const chessGame = useRef(null);
  const [position, setPosition] = useState("start");
  const [isBotThinking, setIsBotThinking] = useState(false);
  const stockfishRef = useRef(null);

  useEffect(() => {
    // Initialize the chess game only once
    if (!chessGame.current) {
      chessGame.current = new Chess();
      setPosition(chessGame.current.fen());
    }

    const loadStockfish = () => {
      const worker = new Worker("/js/stockfish-nnue-16-single.js");
      worker.postMessage = worker.webkitPostMessage || worker.postMessage; // For cross-browser compatibility
      return worker;
    };

    stockfishRef.current = loadStockfish();

    stockfishRef.current.onmessage = (event) => {
      console.log("Received message from Stockfish:", event.data);
      if (typeof event.data === "string") {
        if (event.data.startsWith("bestmove")) {
          const bestMove = event.data.split(" ")[1];
          console.log("Best move from Stockfish:", bestMove);
          const move = chessGame.current.move(bestMove);
          if (move) {
            setPosition(chessGame.current.fen());
            setIsBotThinking(false);
            if (chessGame.current.isGameOver()) {
              alert("Game Over!");
            }
          } else {
            console.error("Invalid move received from Stockfish:", bestMove);
          }
        } else if (event.data.startsWith("info")) {
          console.log("Stockfish info:", event.data);
        } else if (event.data !== "uciok" && event.data !== "readyok") {
          console.warn("Unexpected message from Stockfish:", event.data);
        }
      } else {
        console.error(
          "Unexpected data type received from Stockfish:",
          typeof event.data
        );
      }
    };

    stockfishRef.current.postMessage("uci");
    stockfishRef.current.postMessage("ucinewgame");
    stockfishRef.current.postMessage("isready");
    console.log("Stockfish initialized and ready to receive commands.");

    return () => {
      if (stockfishRef.current) {
        stockfishRef.current.terminate();
        console.log("Terminating Stockfish...");
      }
    };
  }, []);

  const onPieceDrop = (sourceSquare, targetSquare) => {
    console.log(
      "Human move detected in onPieceDrop:",
      sourceSquare,
      targetSquare
    );
    const move = chessGame.current.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q",
    });

    if (move === null) {
      console.error("Invalid move.");
      return false;
    }

    setPosition(chessGame.current.fen());
    setIsBotThinking(true);

    if (stockfishRef.current) {
      const fen = chessGame.current.fen();
      console.log("Posting position to Stockfish:", fen);
      stockfishRef.current.postMessage(`position fen ${fen}`);
      stockfishRef.current.postMessage("go depth 15");
    } else {
      console.error("Stockfish is not initialized.");
    }

    return true;
  };

  return (
    <>
      <h1>Hi from chessboard</h1>
      <Chessboard position={position} onPieceDrop={onPieceDrop} />
      {isBotThinking && <p>Bot is thinking...</p>}
    </>
  );
};

export default ChessGame;
