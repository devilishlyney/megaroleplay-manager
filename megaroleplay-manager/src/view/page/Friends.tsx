import { useState, useEffect, useCallback } from 'react';
import {
  searchUsers,
  sendFriendRequest,
  getPendingRequests,
  getFriends,
  acceptFriendRequest,
  declineFriendRequest,
  removeFriend,
  type Friend,
  type PendingRequest
} from '../../controller/service/friendService';
import { useAuth } from '../../controller/context/AuthContext';

export default function Friends() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [pendingRequests, setPendingRequests] = useState<PendingRequest[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const { user } = useAuth();

  const loadData = useCallback(async () => {
    try {
      const [pending, friendsList] = await Promise.all([
        getPendingRequests(),
        getFriends()
      ]);
      setPendingRequests(pending);
      setFriends(friendsList);
    } catch (err: any) {
      setError(err.message);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const results = await searchUsers(searchQuery, user?.id);
      setSearchResults(results);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSendRequest = async (userId: string) => {
    try {
      await sendFriendRequest(userId);
      setSuccessMsg('Friend request sent!');
      setSearchResults(prev => prev.filter(u => u.id !== userId));
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      setError(err.message);
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleAccept = async (friendshipId: string) => {
    try {
      await acceptFriendRequest(friendshipId);
      await loadData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDecline = async (friendshipId: string) => {
    try {
      await declineFriendRequest(friendshipId);
      setPendingRequests(prev => prev.filter(r => r.id !== friendshipId));
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleRemove = async (friendshipId: string) => {
    if (!confirm('Are you sure you want to remove this friend?')) return;
    try {
      await removeFriend(friendshipId);
      setFriends(prev => prev.filter(f => f.friendshipId !== friendshipId));
    } catch (err: any) {
      setError(err.message);
    }
  };

  return ( // Page layout
    <main className="friends-page">
      <div className="card">
        <h1 className="friends-title">Friends</h1>

        {error && <div className="friends-alert error">{error}</div>}
        {successMsg && <div className="friends-alert success">{successMsg}</div>}

        {/* SEARCH SECTION */}
        <section className="friends-section">
          <h2 className="section-title">Find Friends</h2>
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by username"
              className="search-input"
            />
            <button type="submit" disabled={loading} className="search-btn">
              {loading ? 'Searching...' : 'Search'}
            </button>
          </form>

          {searchResults.length > 0 && (
            <div className="user-list">
              {searchResults.map((user) => (
                <div key={user.id}>
                  <div className="user-info">
                    <span className="user-name">{user.display_name || user.username || 'Unknown'}</span>
                    {user.username && (
                      <span className="user-username">(@{user.username})</span>
                    )}
                  </div>
                  <button
                    onClick={() => handleSendRequest(user.id)}
                    className="btn btn-primary"
                  >
                    Add Friend
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* PENDING REQUESTS SECTION */}
        {pendingRequests.length > 0 && (
          <section className="friends-section">
            <h2 className="section-title">
              Pending Requests
              <span className="badge">{pendingRequests.length}</span>
            </h2>
            <div className="user-list">
              {pendingRequests.map((req) => (
                <div key={req.id}>
                  <div className="user-info">
                    <span className="user-name">{req.requester.display_name || 'Unknown'}</span>
                    {req.requester.username && (
                      <span className="user-username">(@{req.requester.username})</span>
                    )}
                  </div>
                  <div className="action-group">
                    <button
                      onClick={() => handleAccept(req.id)}
                      className="btn btn-success"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleDecline(req.id)}
                      className="btn btn-danger"
                    >
                      Decline
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* FRIENDS LIST SECTION */}
        <section className="friends-section">
          <h2 className="section-title">My Friends ({friends.length})</h2>
          
          {friends.length === 0 ? (
            <p className="empty-message">You don't have any friends yet. Start by searching above!</p>
          ) : (
            <div className="user-list">
              {friends.map((friend) => (
                <div key={friend.friendshipId} className="block">
                  <div>
                    <span className="user-name">{friend.display_name || 'Anonymous'}</span>
                    {friend.username && (
                      <span className="user-username">(@{friend.username})</span>
                    )}
                  </div>
                  <button
                    onClick={() => handleRemove(friend.friendshipId)}
                    className="btn btn-danger-outline"
                  >
                    Unfriend
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}