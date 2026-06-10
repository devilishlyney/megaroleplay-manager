import { useLocation } from "react-router-dom";
import ThemeToggle from "./theme-toggle/ThemeToggle";
import { useAuth } from "../../controller/context/AuthContext";
import { useNavigate } from "react-router-dom";

function Header() {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <header>
        <ThemeToggle />
        {user && location.pathname !== '/login' && (
          <>
            <button onClick={() => signOut()}>Sign out</button>
            <img onClick={() => navigate("/profile")} src={"/default_pfp.webp"} alt="Profile" className="profile-pic" />
          </>
        )}
    </header>
  );
}

export default Header;