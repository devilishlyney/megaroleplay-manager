import { useState, useEffect } from 'react';
import { getReceivedShares, acceptShare, declineShare } from '../../controller/service/shareService';
import type { CharacterShare } from '../../model/share';

export default function SharedCharacters() {
  const [shares, setShares] = useState<CharacterShare[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadShares = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getReceivedShares();
      setShares(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadShares();
  }, []);

  const handleAccept = async (shareId: string) => {
    try {
      await acceptShare(shareId);
      await loadShares();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDecline = async (shareId: string) => {
    try {
      await declineShare(shareId);
      await loadShares();
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="card-large">
      <h2>Received Characters</h2>
      {error && <p>{error}</p>}

      {shares.length === 0 ? (
        <p>No characters shared with you yet.</p>
      ) : (
        <div>
          {shares.map((share) => {
            const char = share.character_snapshot;
            return (
              <div key={share.id}>
                <div>
                  <h3>{char.name}</h3>
                  <p>{char.race} · {char.class} · Lv{char.level || 1}</p>
                  {share.message && (
                    <p>"{share.message}"</p>
                  )}
                  <span>Status: {share.status}</span>
                </div>

                {share.status === 'pending' && (
                  <div>
                    <button onClick={() => handleAccept(share.id!)}>
                      Accept
                    </button>
                    <button onClick={() => handleDecline(share.id!)}>
                      Decline
                    </button>
                  </div>
                )}

                {share.status === 'accepted' && (
                  <p>Added to your characters. You can now assign it to a campaign.</p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}