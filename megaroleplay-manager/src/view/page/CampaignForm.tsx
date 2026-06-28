import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createCampaign, updateCampaign, getCampaignById } from '../../controller/service/campaignService';
import type { Campaign } from '../../model/campaign';

interface Props {
  editMode?: boolean;
}

export default function CampaignForm({ editMode = false }: Props) {
  const navigate = useNavigate();
  const { campaignId } = useParams<{ campaignId: string }>();

  const [formData, setFormData] = useState<Omit<Campaign, 'id' | 'ownerId' | 'created_at' | 'updated_at'>>({
    name: '',
    description: '',
    status: 'planning',
    avatar_url: null,
    start_date: null,
    end_date: null
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load existing data when in edit mode
  useEffect(() => {
    if (editMode && campaignId) {
      loadCampaignData(campaignId);
    }
  }, [editMode, campaignId]);

  const loadCampaignData = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const campaign = await getCampaignById(id);
      
      setFormData({
        name: campaign.name || '',
        description: campaign.description || '',
        status: campaign.status || 'planning',
        avatar_url: campaign.avatar_url || null
      });
    } catch (err: any) {
      setError('Failed to load campaign data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name.trim()) {
      setError('Campaign name is required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (editMode && campaignId) {
        // Update existing
        await updateCampaign(campaignId, formData);
      } else {
        // Create new
        await createCampaign(formData);
      }
      
      // Redirect to campaigns list
      navigate('/campaigns');
    } catch (err: any) {
      setError(err.message || 'Failed to save campaign');
    } finally {
      setLoading(false);
    }
  };

  if (loading && editMode) {
    return <div>Loading campaign...</div>;
  }

  return (
    <div>
      <h1>{editMode ? 'Edit Campaign' : 'Create New Campaign'}</h1>
      
      {error && (
        <div style={{ color: '#ef4444', marginBottom: '16px', padding: '12px', backgroundColor: 'rgba(239,68,68,0.1)', borderRadius: '8px' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ maxWidth: '600px' }}>
        {/* Name Field */}
        <div style={{ marginBottom: '16px' }}>
          <label htmlFor="name" style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px' }}>
            Campaign Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter campaign name"
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '8px',
              border: '1px solid #d1d5db',
              fontSize: '1rem'
            }}
            required
          />
        </div>

        {/* Description Field */}
        <div style={{ marginBottom: '16px' }}>
          <label htmlFor="description" style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px' }}>
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description || ''}
            onChange={handleChange}
            placeholder="Brief story overview or plot summary..."
            rows={4}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '8px',
              border: '1px solid #d1d5db',
              fontSize: '1rem',
              resize: 'vertical'
            }}
          />
        </div>

        {/* Status Field */}
        <div style={{ marginBottom: '16px' }}>
          <label htmlFor="status" style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px' }}>
            Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '8px',
              border: '1px solid #d1d5db',
              fontSize: '1rem',
              backgroundColor: 'white'
            }}
          >
            <option value="planning">Planning</option>
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {/* Submit Buttons */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button
            type="button"
            onClick={() => navigate('/campaigns')}
            disabled={loading}
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              border: '1px solid #d1d5db',
              backgroundColor: 'white',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1
            }}
          >
            Cancel
          </button>
          
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: '#3b82f6',
              color: 'white',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1
            }}
          >
            {loading ? 'Saving...' : (editMode ? 'Update Campaign' : 'Create Campaign')}
          </button>
        </div>
      </form>
    </div>
  );
}