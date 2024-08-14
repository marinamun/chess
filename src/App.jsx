import { Route, Routes } from "react-router-dom";
import Homepage from "./pages/Homepage";
import ChessGame from "./components/ChessGame";
import { useState } from "react";
import "./App.css";

function App() {
  const [difficulty, setDifficulty] = useState("medium"); // Default difficulty
  const [username, setUsername] = useState("");

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <Homepage setDifficulty={setDifficulty} setUsername={setUsername} />
          }
        />
        <Route
          path="/play"
          element={<ChessGame difficulty={difficulty} username={username} />}
        />
      </Routes>
    </>
  );
}

export default App;
