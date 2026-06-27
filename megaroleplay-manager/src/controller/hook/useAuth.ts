import { supabase } from '../service/supabase'

export async function updateUserDisplayName(newDisplayName: string) {
  const trimmedDisplayName = newDisplayName.trim()

  const { error: metadataError } = await supabase.auth.updateUser({
    data: { display_name: trimmedDisplayName }
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