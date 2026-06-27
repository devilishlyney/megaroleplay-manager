import { supabase } from './supabase'
import type { User, Session } from '@supabase/supabase-js'

// Sign Up
export async function signUp(email: string, password: string, username?: string) {
  const normalizedUsername = username?.trim()

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username: normalizedUsername || email.split('@')[0],
        display_name: normalizedUsername || email.split('@')[0],
      },
      emailRedirectTo: `${window.location.origin}/auth/callback`,
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

// Update display name
export async function updateUserDisplayName(newDisplayName: string) {
  const trimmedDisplayName = newDisplayName.trim()

  const { error: metadataError } = await supabase.auth.updateUser({
    data: { display_name: trimmedDisplayName },
  })

  if (metadataError) throw metadataError

  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError) throw userError

  if (user) {
    const { error: profileError } = await supabase
      .from('public_profiles')
      .update({ display_name: trimmedDisplayName, updated_at: new Date().toISOString() })
      .eq('id', user.id)

    if (profileError) throw profileError
  }
}

// Get Current User
export async function getCurrentUser(): Promise<User | null> {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

// Listen to Auth State Changes
export function onAuthStateChange(callback: (session: Session | null) => void) {
  return supabase.auth.onAuthStateChange((_event, session) => {
    callback(session)
  })
}

// Update Avatar
export async function updateAvatar(avatarDataUrl: string): Promise<User | null> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('User not authenticated')

  // Convert data URL to blob
  const response = await fetch(avatarDataUrl)
  const blob = await response.blob()

  // Upload to storage
  const fileName = `${user.id}-${Date.now()}.png`
  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(fileName, blob, { upsert: true })

  if (uploadError) throw uploadError

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('avatars')
    .getPublicUrl(fileName)

  // Update user metadata with the public URL
  const { data, error } = await supabase.auth.updateUser({
    data: {
      avatar_url: publicUrl,
    },
  })
  if (error) throw error
  return data.user
}