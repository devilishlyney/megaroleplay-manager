import { supabase } from './supabase'

// --- Types ---
export interface Friend {
  id: any
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

// --- Search Users ---
export async function searchUsers(query: string, currentUserId?: string) {
  let builder = supabase
    .from('public_profiles')
    .select('id, username, display_name')
    .or(`username.ilike.%${query}%,display_name.ilike.%${query}%`)
    .limit(10)

  // Only exclude current user if ID was provided
  if (currentUserId && currentUserId.trim() !== '') {
    builder = builder.neq('id', currentUserId)
  }

  const { data, error } = await builder

  if (error) throw error

  return (data || []).map((p: any) => ({
    id: p.id,
    username: p.username,
    display_name: p.display_name || p.username
  }))
}

// --- Send Friend Request ---
export async function sendFriendRequest(addresseeId: string) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  // Check Direction 1: Current user → Addressee
  const { data: existing1, error: error1 } = await supabase
    .from('friendships')
    .select('status')
    .eq('requester_id', user.id)
    .eq('addressee_id', addresseeId)
    .single()

  // Check Direction 2: Addressee → Current user
  const { data: existing2, error: error2 } = await supabase
    .from('friendships')
    .select('status')
    .eq('requester_id', addresseeId)
    .eq('addressee_id', user.id)
    .single()

  // Handle "not found" errors
  const status1 = (existing1 as any)?.status
  const status2 = (existing2 as any)?.status
  
  if ((error1?.code !== 'PGRST116') && !(existing1)) {
    // Only throw if actual error, not "no rows"
  }
  if ((error2?.code !== 'PGRST116') && !(existing2)) {
    // Only throw if actual error, not "no rows"
  }

  if (status1 === 'accepted' || status2 === 'accepted') {
    throw new Error('Already friends with this user.')
  }
  if (status1 === 'pending' || status2 === 'pending') {
    throw new Error('Friend request already pending.')
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

// --- Accept Friend Request ---
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

// --- Decline Friend Request ---
export async function declineFriendRequest(friendshipId: string) {
  const { error } = await supabase
    .from('friendships')
    .delete()
    .eq('id', friendshipId)

  if (error) throw error
}

// --- Remove Friend ---
export async function removeFriend(friendshipId: string) {
  const { error } = await supabase
    .from('friendships')
    .delete()
    .eq('id', friendshipId)

  if (error) throw error
}

// --- Get Accepted Friends (Two-Query Approach) ---
export async function getFriends() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  // Step 1: Get all accepted friendships
  const { data: friendships, error: fError } = await supabase
    .from('friendships')
    .select('id, requester_id, addressee_id')
    .or(`requester_id.eq.${user.id},addressee_id.eq.${user.id}`)
    .eq('status', 'accepted')

  if (fError) throw fError
  if (!friendships || friendships.length === 0) return []

  // Step 2: Extract friend IDs
  const friendIds = friendships.map((f: any) =>
    f.requester_id === user.id ? f.addressee_id : f.requester_id
  )

  // Step 3: Fetch all profiles at once
  const { data: profiles, error: pError } = await supabase
    .from('public_profiles')
    .select('id, username, display_name')
    .in('id', friendIds)

  if (pError) throw pError

  // Step 4: Match manually
  return friendships.map((f: any) => {
    const friendId = f.requester_id === user.id ? f.addressee_id : f.requester_id
    const profile = profiles?.find((p: any) => p.id === friendId)
    return {
      friendshipId: f.id,
      friendId: friendId,
      display_name: profile?.display_name || 'Anonymous',
      username: profile?.username || null
    }
  })
}

// --- Get Pending Requests (Two-Query Approach) ---
export async function getPendingRequests() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  // Step 1: Get all pending requests addressed to current user
  const { data: requests, error: rError } = await supabase
    .from('friendships')
    .select('id, requester_id, addressee_id, status')
    .eq('addressee_id', user.id)
    .eq('status', 'pending')
    .order('created_at', { ascending: false })

  if (rError) throw rError
  if (!requests || requests.length === 0) return []

  // Step 2: Extract requester IDs
  const requesterIds = requests.map((r: any) => r.requester_id)

  // Step 3: Fetch all requester profiles at once
  const { data: profiles, error: pError } = await supabase
    .from('public_profiles')
    .select('id, username, display_name')
    .in('id', requesterIds)

  if (pError) throw pError

  // Step 4: Match manually
  return requests.map((r: any) => {
    const profile = profiles?.find((p: any) => p.id === r.requester_id)
    return {
      id: r.id,
      requester_id: r.requester_id,
      status: r.status,
      requester: {
        id: r.requester_id,
        display_name: profile?.display_name || 'Unknown',
        username: profile?.username || null
      }
    }
  })
}