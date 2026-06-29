import { supabase } from './supabase'
import type { CharacterShare } from '../../model/share'

export async function shareCharacter(
  receiverId: string,
  characterId: string,
  message?: string
): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  // Verify they are friends
  const { data: friendship } = await supabase
    .from('friendships')
    .select('id')
    .or(`and(requester_id.eq.${user.id},addressee_id.eq.${receiverId}),and(requester_id.eq.${receiverId},addressee_id.eq.${user.id})`)
    .eq('status', 'accepted')
    .maybeSingle()

  if (!friendship) throw new Error('You can only share with friends')

  // Fetch the character to snapshot it
  const { data: character, error: charError } = await supabase
    .from('characters')
    .select('*')
    .eq('id', characterId)
    .eq('owner_id', user.id)
    .single()

  if (charError || !character) throw new Error('Character not found')

  // Check for duplicate pending share
  const { data: existing } = await supabase
    .from('character_shares')
    .select('id')
    .eq('sender_id', user.id)
    .eq('receiver_id', receiverId)
    .eq('character_id', characterId)
    .eq('status', 'pending')
    .maybeSingle()

  if (existing) throw new Error('Character already shared (pending)')

  const { error } = await supabase
    .from('character_shares')
    .insert({
      sender_id: user.id,
      receiver_id: receiverId,
      character_id: characterId,
      character_snapshot: character,
      message: message || null,
      status: 'pending'
    })

  if (error) throw error
}

export async function getReceivedShares(): Promise<CharacterShare[]> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('character_shares')
    .select('*')
    .eq('receiver_id', user.id)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as CharacterShare[]
}

export async function getSentShares(): Promise<CharacterShare[]> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('character_shares')
    .select('*')
    .eq('sender_id', user.id)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as CharacterShare[]
}

export async function acceptShare(shareId: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  // Fetch the share
  const { data: share, error: fetchError } = await supabase
    .from('character_shares')
    .select('*')
    .eq('id', shareId)
    .eq('receiver_id', user.id)
    .single()

  if (fetchError || !share) throw new Error('Share not found')

  if (share.status !== 'pending') throw new Error('Share already responded to')

  // Create a copy of the character under the receiver's account
  const snapshot = share.character_snapshot
  const { error: insertError } = await supabase
    .from('characters')
    .insert({
      owner_id: user.id,
      shared_from_id: share.character_id,
      name: snapshot.name,
      pronouns: snapshot.pronouns || null,
      race: snapshot.race,
      class: snapshot.class,
      level: snapshot.level || 1,
      base_stats: snapshot.base_stats,
      final_stats: snapshot.final_stats || snapshot.base_stats,
      appearance: snapshot.appearance,
      inventory: snapshot.inventory || [],
      equipment: snapshot.equipment || {},
      lore: snapshot.lore || ''
    })

  if (insertError) throw insertError

  // Mark share as accepted
  const { error: updateError } = await supabase
    .from('character_shares')
    .update({ status: 'accepted', responded_at: new Date().toISOString() })
    .eq('id', shareId)

  if (updateError) throw updateError
}

export async function declineShare(shareId: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { error } = await supabase
    .from('character_shares')
    .update({ status: 'declined', responded_at: new Date().toISOString() })
    .eq('id', shareId)
    .eq('receiver_id', user.id)

  if (error) throw error
}

export async function cancelShare(shareId: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { error } = await supabase
    .from('character_shares')
    .delete()
    .eq('id', shareId)
    .eq('sender_id', user.id)

  if (error) throw error
}