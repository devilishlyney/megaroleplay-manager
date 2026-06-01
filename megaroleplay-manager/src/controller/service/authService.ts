import { supabase } from './supabase'
import type { User, Session } from '@supabase/supabase-js'

// Sign Up
export async function signUp(email: string, password: string, username?: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        display_name: username || email.split('@')[0],
      },
      emailRedirectTo: `${window.location.origin}/auth/callback`, // Optional for email confirmation
    },
  })
  if (error) throw error
  return data
}

// Sign In
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  if (error) throw error
  return data
}

// Sign Out
export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

// Get Current User
export async function getCurrentUser(): Promise<User | null> {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

// Listen to Auth State Changes (Crucial for SPA)
export function onAuthStateChange(callback: (session: Session | null) => void) {
  return supabase.auth.onAuthStateChange((_event, session) => {
    callback(session)
  })
}