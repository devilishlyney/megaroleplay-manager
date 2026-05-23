import { useNavigate } from "react-router-dom";
import "./view/assets/css/App.css";

function App() {
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
          <button onClick={() => navigate("/stats")}>Enter the Dungeon</button>
          <button>Settings</button>
        </div>
      </div>
    </main>
  );
}

export default App;
