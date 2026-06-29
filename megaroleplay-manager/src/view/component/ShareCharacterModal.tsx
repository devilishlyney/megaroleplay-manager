import { useState, useEffect } from 'react';
import { getFriends } from '../../controller/service/friendService';
import { shareCharacter } from '../../controller/service/shareService';
import type { Friend } from '../../model/friendship';

interface Props {
  characterId: string;
  characterName: string;
  onClose: () => void;
}

export default function ShareCharacterModal({ characterId, characterName, onClose }: Props) {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [selectedFriend, setSelectedFriend] = useState<string | undefined>(undefined);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const loadFriends = async () => {
      try {
        const data = await getFriends();
        setFriends(data);
      } catch (err: any) {
        setError('Failed to load friends');
      }
    };
    loadFriends();
  }, []);

  const handleSend = async () => {
    if (!selectedFriend) return;
    setLoading(true);
    setError(null);
    try {
      await shareCharacter(selectedFriend, characterId, message);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div>
        <p>Character "{characterName}" sent successfully!</p>
        <button onClick={onClose}>Close</button>
      </div>
    );
  }

  return (
    <div>
      <div>
        <h2>Share "{characterName}"</h2>
        {error && <p>{error}</p>}

        {friends.length === 0 ? (
          <p>You have no friends to share with. Add some first!</p>
        ) : (
          <>
            <p>Select a friend:</p>
            {friends.map((friend) => (
              <button
                key={friend.friendId}
                onClick={() => setSelectedFriend(friend.friendId)}
                className={selectedFriend === friend.friendId ? 'selected' : ''}
              >
                {friend.display_name || friend.username}
              </button>
            ))}

            <div>
              <textarea
                placeholder="Optional message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
              />
            </div>

            <button onClick={handleSend} disabled={!selectedFriend || loading}>
              {loading ? 'Sending...' : 'Send Character'}
            </button>
          </>
        )}

        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}