import "../styles/playersinfo.css";

const PlayersInfo = ({ difficulty, username }) => {
  

  return (
    <>
      <div className="enemy-info">
        <h3>Players🥊</h3>
        <p>
          {difficulty} vs. {username}
        </p>
      </div>
    </>
  );
};
export default PlayersInfo;
