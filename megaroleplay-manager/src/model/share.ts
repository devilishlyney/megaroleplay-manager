export interface CharacterShare {
  id?: string;
  sender_id: string;
  receiver_id: string;
  character_id: string;
  character_snapshot: Record<string, any>;
  message?: string | null;
  status: 'pending' | 'accepted' | 'declined';
  created_at?: string;
  responded_at?: string | null;
}