export interface Campaign {
  id?: string;
  ownerId?: string;
  name: string;
  description?: string | null;
  status: 'planning' | 'active' | 'completed' | 'paused';
  avatar_url?: string | null;
  start_date?: string | null; // ISO date string
  end_date?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface CampaignCharacter {
  id: string;
  campaign_id: string;
  character_id: string;
  role: 'player_character' | 'npc' | 'villain' | 'ally' | 'enemy';
  joined_at: string;
}

export interface CampaignWithCharacters extends Campaign {
  characters: Array<{
    id: string;
    character_name: string;
    race?: string;
    class?: string;
    role: string;
    joined_at: string;
  }>;
}