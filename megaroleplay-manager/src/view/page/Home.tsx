import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <main className="container">
      <div className="card">
        <div className="title">
          <h2>Welcome to</h2>
          <h1>MegaRoleplay<br />Manager</h1>
          <h3>The Unofficial D&D Management Tool</h3>
        </div>
        <div className="nav-btn-title">
          <button onClick={() => navigate("/characters")}>Characters</button>
          <button onClick={() => navigate("/campaigns")}>Campaigns</button>
          <button onClick={() => navigate("/dice")}>Dice Rolls</button>
          <button onClick={() => navigate("/settings")}>Settings</button>
        </div>
      </div>
    </main>
  );
}

export default Home;