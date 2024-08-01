import ChessGame from "../components/ChessGame";
import { Link } from "react-router-dom"; // Import Link for navigation

const Homepage = () => {
  return (
    <>
      <h1>Hola mongoloooo💖</h1>
      <Link to="/play">¿Una partidita?</Link>
      <ChessGame />
    </>
  );
};
export default Homepage;
