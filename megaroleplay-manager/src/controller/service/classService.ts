import { supabase } from './supabase'

export interface ClassData {
  id: string
  name: string
  description: string
  primary_stat: string
  hit_die: number
  spellcasting_ability?: string
  role?: string
  proficiencies?: string[]
  saving_throws?: string[]
  features?: string[]
}

export async function getClasses() {
  const { data, error } = await supabase.from('classes').select('*')
  if (error) throw error
  return data as ClassData[]
}
