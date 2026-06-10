import { useNavigate } from "react-router-dom";
import { useAuth } from "../../controller/context/AuthContext";

function UserProfile() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const username =
    user?.user_metadata?.display_name ||
    user?.email?.split('@')[0] ||
    "User";

  return (
    <main className="container">
      <div className="card">
        <h2>{username}'s profile</h2>
        <div className="avatar-container">
          <img src={"/default_pfp.webp"} alt="Avatar" className="avatar"/>
            <div className="avatar-overlay">
                <div className="text">Change picture</div>
            </div>
        </div>
        <div>
          <button onClick={() => navigate("/")}>Back to dashboard</button>
        </div>
      </div>
    </main>
  );
}

export default UserProfile;