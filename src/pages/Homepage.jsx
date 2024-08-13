import React from "react";
import { Link } from "react-router-dom";

const Homepage = ({ setDifficulty }) => {
  const handleDifficultyChange = (level) => {
    setDifficulty(level);
  };

  return (
    <>
      <h1>Select Difficulty</h1>
      <div>
        <button onClick={() => handleDifficultyChange("easy")}>Easy</button>
        <button onClick={() => handleDifficultyChange("medium")}>Medium</button>
        <button onClick={() => handleDifficultyChange("hard")}>Hard</button>
      </div>
      <Link to="/play">Start Game</Link>
    </>
  );
};

export default Homepage;
