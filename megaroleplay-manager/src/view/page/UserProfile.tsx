import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../controller/context/AuthContext";
import { useAvatarUpload } from "../../controller/hook/useAvatarUpload";
import { updateUserDisplayName } from "../../controller/service/authService";

function UserProfile() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { fileInputRef, avatarUrl, handleAvatarClick, handleFileSelect, isLoading } =
    useAvatarUpload();
  const [displayName, setDisplayName] = useState("");
  const [isSavingName, setIsSavingName] = useState(false);
  const [nameMessage, setNameMessage] = useState("");
  const username = user?.user_metadata?.username || user?.user_metadata?.display_name || user?.email?.split("@")[0] || "User";

  useEffect(() => {
    setDisplayName(
      user?.user_metadata?.display_name || user?.email?.split("@")[0] || "User"
    );
    setNameMessage("");
  }, [user]);

  const handleSaveDisplayName = async () => {
    const trimmedName = displayName.trim();

    if (!trimmedName) { // Prevent empty display name
      setNameMessage("Display name cannot be empty.");
      return;
    }

    try { // Update display name
      setIsSavingName(true);
      setNameMessage("");
      await updateUserDisplayName(trimmedName);
      setDisplayName(trimmedName);
      setNameMessage("Display name updated.");
    } catch (error: any) {
      setNameMessage(error?.message || "Could not update display name.");
    } finally {
      setIsSavingName(false);
    }
  };

  return ( // Page layout
    <main className="container">
      <div className="card">
        <h2>{displayName || "User"}'s profile</h2>
        <h3>@{username}</h3>
        <div className="avatar-container" onClick={!isLoading ? handleAvatarClick : undefined}>
          <img src={avatarUrl} alt="Avatar" className="avatar" />
          <div className="avatar-overlay">
            <div className="text">{isLoading ? "Uploading..." : "Change picture"}</div>
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          style={{ display: "none" }}
          disabled={isLoading}
        />

        <div>
          
          <label htmlFor="display-name">Display name : </label>
          <input
            id="display-name"
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            disabled={isSavingName}
          />
          <button onClick={handleSaveDisplayName} disabled={isSavingName}>
            {isSavingName ? "Saving..." : "Save"}
          </button>
          {nameMessage && <p>{nameMessage}</p>}
        </div>

        <div>
          <button onClick={() => navigate("/")} disabled={isLoading}>Back to dashboard</button>
        </div>
      </div>
    </main>
  );
}

export default UserProfile;