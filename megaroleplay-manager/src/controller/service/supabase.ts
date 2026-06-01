import { createClient } from '@supabase/supabase-js'

// 1. Get these from your Supabase Project Dashboard (Settings -> API)
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error('Missing Supabase environment variables')
}

// 2. Create the client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)