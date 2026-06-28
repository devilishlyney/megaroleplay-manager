import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../../controller/service/supabase';

export default function Profile() {
  const { userId } = useParams<{ userId: string }>(); // URL param: /profile/:userId
  
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    fetchProfile(userId);
  }, [userId]);

  const fetchProfile = async (targetId: string) => {
    try {
      setLoading(true);
      setError(null);

      // Fetch profile data from public_profiles
      const { data, error: profileError } = await supabase
        .from('public_profiles')
        .select('*')
        .eq('id', targetId)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        throw profileError;
      }

      if (data) {
        setProfile(data);
      } else {
        setError('User not found');
      }
    } catch (err: any) {
      console.error('Failed to fetch profile:', err);
      setError(err.message || 'Could not load profile');
    } finally {
      setLoading(false);
    }
  };

  const navigateToFriends = () => {
    window.location.href = '/friends';
  };

  if (loading) {
    return <div className="profile-loading">Loading profile...</div>;
  }

  if (error) {
    return (
      <div className="profile-container">
        <div className="profile-error">{error}</div>
        <Link to="/friends" className="back-btn">Back to Friends</Link>
      </div>
    );
  }

  if (!profile) {
    return <div className="profile-container">Profile not found</div>;
  }

  return (
    <div className="profile-page">
      <div className="card-large">
        
        {/* Display name and username */}
        <h2 className="profile-name">
            {profile.display_name || 'Anonymous User'}'s profile
          </h2>
          
          {profile.username && (
            <span className="profile-username">@{profile.username}</span>
          )}

        {/* Avatar Section */}
        <div className="profile-avatar-section">
          <div className="avatar-container">
            {profile.avatar_url ? (
              <img 
                src={profile.avatar_url} 
                alt={profile.display_name || 'User'} 
                className="avatar"
              />
            ) : (
              <div className="profile-avatar-placeholder">
                {(profile.display_name || 'U')[0].toUpperCase()}
              </div>
            )}
          </div>
        </div>

        {/* Info Section */}
        <div className="profile-info">
          <div className="profile-meta">
            {profile.created_at && (
              <div className="meta-item">
                <span className="meta-label">Member since : </span>
                <span className="meta-value">
                  {new Date(profile.created_at).toLocaleDateString()}
                </span>
              </div>
            )}
            
          </div>
        </div>

        <button className="back-btn" onClick={navigateToFriends}>
          Back to Friends
        </button>
      </div>
    </div>
  );
}