import React from "react";
import { Link } from "react-router-dom";
import aita from "../media/piloto.png";
import brown from "../media/brown.png";
import joshua from "../media/texas.png";
import "../styles/homepage.css";

const Homepage = ({ setDifficulty, setUsername }) => {
  const handleDifficultyChange = (level) => {
    setDifficulty(level);
  };

  const handleNameChange = (event) => {
    setUsername(event.target.value);
  };

  return (
    <div className="homepage-container">
      <h1>Let's play chess, but first...</h1>
      <label>
        {" "}
        <input
          type="text"
          placeholder="What's your name?"
          onChange={handleNameChange}
          className="input-username"
        />
      </label>
      <h2>Choose your enemy:</h2>
      <div className="level-btns">
        <button onClick={() => handleDifficultyChange("PILOTO CIEGO")}>
          PILOTO CIEGO (Difficult)
          <img src={aita} style={{ width: "50px" }} />
        </button>
        <button onClick={() => handleDifficultyChange("TEXAN SURFER")}>
          TEXAN SURFER (Medium)
          <img src={joshua} style={{ width: "50px" }} />
        </button>
        <button onClick={() => handleDifficultyChange("GAMBITO")}>
          GAMBITO (Easy)
          <img src={brown} style={{ width: "50px" }} />
        </button>
      </div>
      <Link to="/play">Start Game</Link>
    </div>
  );
};

export default Homepage;
