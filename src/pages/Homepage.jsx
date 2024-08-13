import React from "react";
import { Link } from "react-router-dom";
import aita from "../media/piloto.png";
import brown from "../media/brown.png";
import joshua from "../media/texas.png";
import "../styles/homepage.css";

const Homepage = ({ setDifficulty }) => {
  const handleDifficultyChange = (level) => {
    setDifficulty(level);
  };

  return (
    <div className="homepage-container">
      <h1>Let's play chess, but first...</h1>
      <h2>Choose your enemy:</h2>
      <div className="level-btns">
        <button onClick={() => handleDifficultyChange("hard")}>
          PILOTO CIEGO (Difficult)
          <img src={aita} style={{ width: "50px" }} />
        </button>
        <button onClick={() => handleDifficultyChange("medium")}>
          TEXAN SURFER (Medium)
          <img src={joshua} style={{ width: "50px" }} />
        </button>
        <button onClick={() => handleDifficultyChange("easy")}>
          GAMBITO (Easy)
          <img src={brown} style={{ width: "50px" }} />
        </button>
      </div>
      <Link to="/play">Start Game</Link>
    </div>
  );
};

export default Homepage;
