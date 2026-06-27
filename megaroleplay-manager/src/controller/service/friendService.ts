import { supabase } from './supabase'

// --- Types ---
export interface Friend {
  friendshipId: string
  friendId: string
  display_name: string | null
  username: string | null
}

export interface PendingRequest {
  id: string
  requester_id: string
  status: string
  requester: {
    id: string
    display_name: string | null
    username: string | null
  }
}

// Search Users
export async function searchUsers(query: string, currentUserId: string) {
  const { data, error } = await supabase
    .from('public_profiles')
    .select('id, username, display_name')
    .or(`username.ilike.%${query}%,display_name.ilike.%${query}%`)
    .neq('id', currentUserId)
    .limit(10)

  if (error) throw error
  
  return (data || []).map(p => ({
    id: p.id,
    username: p.username,
    display_name: p.display_name || p.username
  }))
}

// Send Friend Request
export async function sendFriendRequest(addresseeId: string) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  // Check if friendship exists
  const { data: existing, error: checkError } = await supabase
    .from('friendships')
    .select('id, status')
    .or(`requester_id.eq.${user.id}.and.addressee_id.eq.${addresseeId},requester_id.eq.${addresseeId}.and.addressee_id.eq.${user.id}`)
    .maybeSingle()

  if (checkError && checkError.code !== 'PGRST116') throw checkError // PGRST116 = no rows found
  
  if ((existing as any)?.status === 'accepted') {
    throw new Error('Already friends with this user.')
  }

  const { data, error } = await supabase
    .from('friendships')
    .insert({
      requester_id: user.id,
      addressee_id: addresseeId,
      status: 'pending'
    })
    .select()
    .single()

  if (error) throw error
  return data
}

// Accept Friend Request
export async function acceptFriendRequest(friendshipId: string) {
  const { data, error } = await supabase
    .from('friendships')
    .update({ status: 'accepted', updated_at: new Date().toISOString() })
    .eq('id', friendshipId)
    .select()
    .single()

  if (error) throw error
  return data
}

// Decline/Remove Friend Request
export async function declineFriendRequest(friendshipId: string) {
  const { data, error } = await supabase
    .from('friendships')
    .delete()
    .eq('id', friendshipId)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function removeFriend(friendshipId: string) {
  const { error } = await supabase
    .from('friendships')
    .delete()
    .eq('id', friendshipId)

  if (error) throw error
}

// Get Accepted Friends
export async function getFriends() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('friendships')
    .select(`
      id,
      requester_id,
      addressee_id,
      requester_public_profile:public_profiles!inner(display_name, username),
      addressee_public_profile:public_profiles!inner(display_name, username)
    `)
    .or(`requester_id.eq.${user.id},addressee_id.eq.${user.id}`)
    .eq('status', 'accepted')
    .order('updated_at', { ascending: false })

  if (error) throw error

  return (data || []).map((f: any) => {
    const friendData = f.requester_id === user.id ? f.addressee_public_profile : f.requester_public_profile
    return {
      friendshipId: f.id,
      friendId: f.requester_id === user.id ? f.addressee_id : f.requester_id,
      display_name: (friendData?.[0]?.display_name as string | undefined) ?? 'Anonymous',
      username: (friendData?.[0]?.username as string | undefined) ?? null
    }
  })
}

// Get Pending Requests
export async function getPendingRequests() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('friendships')
    .select(`
      *,
      requester_public_profile:public_profiles!inner(id, display_name, username)
    `)
    .eq('addressee_id', user.id)
    .eq('status', 'pending')
    .order('created_at', { ascending: false })

  if (error) throw error

  return (data || []).map((req: any) => ({
    id: req.id,
    requester_id: req.requester_id,
    status: req.status,
    requester: {
      id: req.requester_id,
      display_name: (req.requester_public_profile?.[0]?.display_name as string | undefined) ?? 'Unknown',
      username: (req.requester_public_profile?.[0]?.username as string | undefined) ?? null
    }
  }))
}