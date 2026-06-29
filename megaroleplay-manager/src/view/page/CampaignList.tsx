import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCampaigns, deleteCampaign } from '../../controller/service/campaignService';
import type { Campaign } from '../../model/campaign';

export default function CampaignList() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadCampaigns = async () => {
    try {
      const data = await getCampaigns();
      setCampaigns(data);
    } catch (err: any) {
      console.error('Failed to load campaigns:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCampaigns();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this campaign?')) return;
    try {
      await deleteCampaign(id);
      setCampaigns(prev => prev.filter(c => c.id !== id));
    } catch (err: any) {
      console.error(err.message);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="card-large">
      <h2>Campaigns</h2>
      <button onClick={() => navigate('/campaigns/new')}>Create New Campaign</button>
      
      {campaigns.length === 0 && <p>No campaigns yet.</p>}
      
      {campaigns.map(camp => (
        <div key={camp.id} className="minicard gap">
          <h3>"{camp.name}"</h3>
          <p>{camp.description}</p>
          <span>Status: {camp.status}</span>
          <div>
            <button onClick={() => navigate(`/campaigns/${camp.id}`)} className="action"><span className="material-symbols-outlined">info</span></button>
            <button onClick={() => navigate(`/campaigns/${camp.id}/edit`)} className="action"><span className="material-symbols-outlined">edit</span></button>
            <button onClick={() => handleDelete(camp.id!)} className="danger action"><span className="material-symbols-outlined">delete</span></button>
          </div>
        </div>
      ))}
    </div>
  );
}