import { Route, Routes } from "react-router-dom";
import Homepage from "./pages/Homepage";
import ChessGame from "./components/ChessGame";
import { useState } from "react";
import "./App.css";

function App() {
  const [difficulty, setDifficulty] = useState("medium"); // Default difficulty

  return (
    <>
      <Routes>
        <Route path="/" element={<Homepage setDifficulty={setDifficulty} />} />
        <Route path="/play" element={<ChessGame difficulty={difficulty} />} />
      </Routes>
    </>
  );
}

export default App;
