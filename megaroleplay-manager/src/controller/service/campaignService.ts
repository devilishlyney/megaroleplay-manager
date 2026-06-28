import { supabase } from './supabase'
import type { Campaign, CampaignCharacter, CampaignWithCharacters } from '../../model/campaign'

// --- Create Campaign ---
export async function createCampaign(campaignData: Omit<Campaign, 'id' | 'ownerId' | 'created_at'>) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('campaigns')
    .insert([{ ...campaignData, owner_id: user.id }])
    .select()
    .single()

  if (error) throw error
  return data
}

// --- Get All Campaigns (for current user) ---
export async function getCampaigns() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('campaigns')
    .select('*')
    .eq('owner_id', user.id)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as Campaign[]
}

// --- Get Single Campaign with Characters ---
export async function getCampaignById(id: string) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data: campaign, error: camError } = await supabase
    .from('campaigns')
    .select('*')
    .eq('id', id)
    .single()

  if (camError) throw camError

  const { data: relations, error: relError } = await supabase
    .from('campaign_characters')
    .select(`
      *,
      char_details:characters!character_id(id, name, race, class)
    `)
    .eq('campaign_id', id)

  if (relError) throw relError

  const chars = relations?.map((r: any) => ({
    id: r.character_id,
    character_name: r.char_details?.name || 'Unnamed',
    race: r.char_details?.race || 'Unknown',
    class: r.char_details?.class || 'Unknown',
    role: r.role,
    joined_at: r.joined_at
  })) || []

  return { ...campaign, characters: chars } as CampaignWithCharacters
}

// --- Add Character to Campaign ---
export async function addCharacterToCampaign(campaignId: string, characterId: string, role?: string) {
  const { data, error } = await supabase
    .from('campaign_characters')
    .insert({
      campaign_id: campaignId,
      character_id: characterId,
      role: role || 'player_character'
    })
    .select()
    .single()

  if (error) throw error
  return data
}

// --- Remove Character from Campaign ---
export async function removeCharacterFromCampaign(campaignId: string, characterId: string) {
  const { error } = await supabase
    .from('campaign_characters')
    .delete()
    .match({ campaign_id: campaignId, character_id: characterId })

  if (error) throw error
}

// --- Update Campaign ---
export async function updateCampaign(id: string, updates: Partial<Campaign>) {
  const { data, error } = await supabase
    .from('campaigns')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

// --- Delete Campaign ---
export async function deleteCampaign(id: string) {
  const { error } = await supabase
    .from('campaigns')
    .delete()
    .eq('id', id)

  if (error) throw error
}