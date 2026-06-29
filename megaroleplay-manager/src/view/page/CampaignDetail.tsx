import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getCampaignById, updateCampaign, deleteCampaign, addCharacterToCampaign, removeCharacterFromCampaign } from '../../controller/service/campaignService';
import { getCharactersByOwner } from '../../controller/service/characterService';
import type { CampaignWithCharacters } from '../../model/campaign';
import type { Character } from '../../model/character';
import { supabase } from '../../controller/service/supabase';

export default function CampaignDetail() {
  const navigate = useNavigate();
  const { campaignId } = useParams<{ campaignId: string }>();

  const [campaign, setCampaign] = useState<CampaignWithCharacters | null>(null);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const loadCampaign = async () => {
    if (!campaignId) return;
    try {
      setLoading(true);
      setError(null);
      const data = await getCampaignById(campaignId);
      setCampaign(data);
    } catch (err: any) {
      setError('Failed to load campaign');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadAvailableCharacters = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return;
    
    try {
        const charactersData = await getCharactersByOwner(user.id);
        setCharacters(charactersData);
    } catch (err: any) {
        console.error('Failed to load characters:', err);
    }
    };

  useEffect(() => {
    loadCampaign();
  }, [campaignId]);

  const handleDelete = async () => {
    if (!confirm('Are you sure?')) return;
    try {
      await deleteCampaign(campaignId!);
      navigate('/campaigns');
    } catch (err: any) {
      setError('Failed to delete campaign');
    }
  };

  const handleUpdateStatus = async (newStatus: string) => {
    try {
      await updateCampaign(campaignId!, { status: newStatus as CampaignWithCharacters['status'] });
      await loadCampaign();
    } catch (err: any) {
      setError('Failed to update status');
    }
  };

  const handleAddCharacter = async (characterId: string) => {
    if (!campaignId) return;
    try {
      await addCharacterToCampaign(campaignId, characterId);
      await loadCampaign();
      setShowAddModal(false);
    } catch (err: any) {
      setError('Failed to add character');
    }
  };

  const handleRemoveCharacter = async (characterId: string) => {
    if (!campaignId) return;
    if (!confirm('Remove this character?')) return;
    try {
      await removeCharacterFromCampaign(campaignId, characterId);
      await loadCampaign();
    } catch (err: any) {
      setError('Failed to remove character');
    }
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) return <div>Loading campaign...</div>;

  if (error && !campaign) {
    return (
      <div>
        <p>{error}</p>
        <button onClick={() => navigate('/campaigns')}>Back to Campaigns</button>
      </div>
    );
  }

  if (!campaign) return <div>Campaign not found.</div>;

  return (
    <div className="card-large">
      <div>
        <span>Status: {campaign.status}</span>
        <select
          value={campaign.status}
          onChange={(e) => handleUpdateStatus(e.target.value)}
        >
          <option value="planning">Planning</option>
          <option value="active">Active</option>
          <option value="paused">Paused</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {error && <div>{error}</div>}

      <section>
        <h2>{campaign.name}</h2>
        {campaign.description && <p>{campaign.description}</p>}

        <div>
          <div>
            <label>Last Updated : </label>
            <span>{formatDate(campaign.updated_at)}</span>
          </div>
          <div>
            <label>Characters : </label>
            <span>{campaign.characters.length} assigned</span>
          </div>
        </div>
      </section>

      <section>
        <div>
          <h2>Campaign Characters ({campaign.characters.length})</h2>
          <button
            onClick={() => {
              loadAvailableCharacters();
              setShowAddModal(true);
            }}
          >
            + Add Character
          </button>
        </div>

        {campaign.characters.length === 0 ? (
          <div>No characters assigned yet.</div>
        ) : (
          <div>
            {campaign.characters.map((char, idx) => (
              <div key={`${char.id}-${idx}`}>
                <div>
                  <h3>{char.character_name}</h3>
                  <div>
                    {char.race || 'Unknown Race'} · {char.class || 'Unnamed Class'}
                  </div>
                  <span>Role: {char.role.replace('_', ' ').toUpperCase()}</span>
                  <div>Joined: {formatDate(char.joined_at)}</div>
                </div>
                <button onClick={() => handleRemoveCharacter(char.id)} className="danger action">
                  <span className="material-symbols-outlined">delete</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {showAddModal && (
        <div>
          <div>
            <h2>Select a Character</h2>
            {characters.length === 0 ? (
              <p>No characters available. Create one first!</p>
            ) : (
              <div>
                {characters.map((char) => {
                const charId = char.id;
                if (!charId) return null;
                
                const alreadyAssigned = campaign.characters.some(c => c.id === charId);
                
                return (
                    <button
                    key={charId}
                    disabled={alreadyAssigned}
                    onClick={() => handleAddCharacter(charId)}
                    >
                    <div>{char.name}</div>
                    <div>{char.race} · Lv{char.level}</div>
                    {alreadyAssigned && <div>Already assigned</div>}
                    </button>
                );
                })}
              </div>
            )}
            <button onClick={() => setShowAddModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}