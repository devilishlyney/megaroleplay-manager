import { supabase } from './supabase'

export interface RaceData {
  id: string;
  name: string;
  description: string;
  size: string;
  speed: number;
  traits: any; // JSONB
  ability_bonuses: any; // JSONB
}

export async function getRaces() {
  const { data, error } = await supabase
    .from('races')
    .select('*')
    .order('name', { ascending: true })

  if (error) throw error
  return data as RaceData[]
}