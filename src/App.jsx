import { Route, Routes } from "react-router-dom";
import Homepage from "./pages/Homepage";
import ChessGame from "./components/ChessGame";

import "./App.css";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/play" element={<ChessGame />} />
      </Routes>
    </>
  );
}

export default App;
