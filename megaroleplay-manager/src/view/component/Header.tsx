import { useLocation } from "react-router-dom";
import ThemeToggle from "./theme-toggle/ThemeToggle";
import { useAuth } from "../../controller/context/AuthContext";

function Header() {
  const { user, signOut } = useAuth();
  const location = useLocation();

  return (
    <header>
        <ThemeToggle />
        {user && location.pathname !== '/login' && (
          <button onClick={() => signOut()}>Sign out</button>
        )}
    </header>
  );
}

export default Header;