import React, { useEffect, useRef, useState } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import { Link, useNavigate } from "react-router-dom";
import "../styles/chessgame.css";
import PlayersInfo from "./PlayersInfo";
import nepo from "../media/nepo.gif";

const ChessGame = ({ difficulty, username }) => {
  const chessGame = useRef(null);
  const [position, setPosition] = useState("start");
  const [isBotThinking, setIsBotThinking] = useState(false);
  const stockfishRef = useRef(null);
  const [gameOver, setGameOver] = useState(null); // null for no result, 'win' for player win, 'loss' for player loss
  const navigate = useNavigate();

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

            // Now check if the game is over after bot makes its move
            // Important: Checking after move is applied to the board
            setTimeout(() => {
              if (chessGame.current.isGameOver()) {
                handleGameOver();
              }
            }, 100); // Small delay to ensure move is visible on board
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

  // Dealing with the game result
  const handleGameOver = () => {
    if (chessGame.current.isCheckmate()) {
      if (chessGame.current.turn() === "b") {
        setGameOver("win"); // Player wins
        alert("¡Vamooooos! You finished your opponent🥳");
      } else {
        setGameOver("loss"); // Player loses
        alert("LOSERRRR! 'You deserve prison' - T.S");
      }
    } else if (chessGame.current.isDraw()) {
      setGameOver("draw"); // It's a draw
      alert("It's a Draw!*side eye*🙄");
    }
  };

  // Function to get Stockfish depth based on difficulty level
  const getStockfishDepth = (difficulty) => {
    switch (difficulty) {
      case "easy":
        return 5; // shallow depth, easier opponent
      case "medium":
        return 10; // medium depth
      case "hard":
        return 20; // deep depth, harder opponent
      default:
        return 10; // default to medium
    }
  };

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

    const depth = getStockfishDepth(difficulty);

    if (stockfishRef.current) {
      const fen = chessGame.current.fen();
      console.log("Posting position to Stockfish:", fen);
      stockfishRef.current.postMessage(`position fen ${fen}`);
      stockfishRef.current.postMessage("go depth 15");
    } else {
      console.error("Stockfish is not initialized.");
    }

    // Do not check for game over here. Wait until after the bot makes its move.

    return true;
  };

  return (
    <>
      <div className="chessgame-container">
        {/* Back to Homepage Button */}
        <div className="chessgame-left">
          <img src={nepo} />
          <Link to="/">
            <button>🔙</button>
          </Link>
        </div>
        <div className="chessgame-middle">
          <h1>Suerte y no seas bazu</h1>
          <Chessboard
            position={position}
            onPieceDrop={onPieceDrop}
            boardWidth={520}
          />
        </div>
        <div className="chessgame-right">
          <PlayersInfo difficulty={difficulty} username={username} />
        </div>
      </div>
    </>
  );
};

export default ChessGame;
