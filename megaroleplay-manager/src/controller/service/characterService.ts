import { supabase } from './supabase'
import { RawStats, AppearanceSelection } from '../../model/character'

export interface NewCharacter {
  owner_id: string
  name: string
  pronouns?: string
  race: string
  class: string
  base_stats: RawStats
  appearance: AppearanceSelection
  lore?: string
  level: number
  final_stats?: RawStats
}

export async function createCharacter(character: NewCharacter) {
  const payload = {
    ...character,
    level: character.level ?? 1,
    final_stats: character.final_stats ?? character.base_stats,
  }

  const { data, error } = await supabase
    .from('characters')
    .insert(payload)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getCharactersByOwner(ownerId: string) {
  const { data, error } = await supabase
    .from('characters')
    .select('*')
    .eq('owner_id', ownerId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function getCharacterById(characterId: string) {
  const { data, error } = await supabase
    .from('characters')
    .select('*')
    .eq('id', characterId)
    .single()

  if (error) throw error
  return data
}

export async function updateCharacter(characterId: string, updates: Partial<NewCharacter>) {
  const payload = {
    ...updates,
    final_stats: updates.final_stats ?? updates.base_stats,
  }

  const { data, error } = await supabase
    .from('characters')
    .update(payload)
    .eq('id', characterId)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteCharacter(characterId: string) {
  const { error } = await supabase
    .from('characters')
    .delete()
    .eq('id', characterId)

  if (error) throw error
}
