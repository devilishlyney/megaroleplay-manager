import { useLocation } from "react-router-dom";
import ThemeToggle from "./theme-toggle/ThemeToggle";
import { useAuth } from "../../controller/context/AuthContext";
import { useNavigate } from "react-router-dom";

function Header() {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const avatarUrl = user?.user_metadata?.avatar_url || "/default_pfp.webp";

  return (
    <header>
        <ThemeToggle />
        {user && location.pathname !== '/login' && ( // sign out only appears if user is logged in
          <> 
            <button onClick={() => signOut()}>Sign out</button>
            <button onClick={() => navigate('/friends')}>Friends</button>
            <img onClick={() => navigate("/profile")} src={avatarUrl} alt="Profile" className="profile-pic" />
          </>
        )}
    </header>
  );
}

export default Header;