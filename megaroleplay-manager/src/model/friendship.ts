export interface Friend {
  friendshipId?: string;  // ID of the friendship record
  friendId?: string;
  username?: string;
  display_name?: string;
  avatar_url?: string | null;
  created_at?: string;
}

export interface FriendshipRequest {
  id: string;
  requester_id: string;
  addressee_id: string;
  status: 'pending' | 'accepted' | 'declined' | 'blocked';
  created_at: string;
  updated_at: string;
}