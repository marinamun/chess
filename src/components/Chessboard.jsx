import React, { useState, useEffect } from "react";
import Chessboard from "chessboardjsx"; // Import the chessboard from chessboardjsx library
import { Chess } from "chess.js"; // Import the Chess class from chess.js
import stockfish from "stockfish"; // Import stockfish that will serve as the bot to play against

const Chessboard = () => {
  //Create new chess game using the library
  const chessGame = new Chess();
  //Keep track of human's position aka fen
  const [humanPosition, setHumanPosition] = useState(chessGame.fen());
  //Keep track of bot's position
  //NULL because position of the bot isn't explicitly defined until it calculates and responds
  const [botPosition, setBotPosition] = useState(null);

  return <></>;
};
export default Chessboard;
