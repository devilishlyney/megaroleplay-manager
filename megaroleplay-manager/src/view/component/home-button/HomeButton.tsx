import { useNavigate } from "react-router-dom";
import './HomeButton.css';

function HomeButton() {
  const navigate = useNavigate();

  return (
    <button onClick={() => navigate("/")} className="home-button">
      <span className="material-symbols-outlined">
        home
      </span>
    </button>
  );
}

export default HomeButton;