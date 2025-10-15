import { supabase } from '@/config/supabase'

/**
 * Get user role from Supabase by email
 * This is a workaround for the mixed Firebase/Supabase architecture
 */
export async function getUserRoleFromSupabase(email: string): Promise<'user' | 'admin'> {
  try {
    console.log('[RoleHelper] Fetching role for:', email)

    // Use RPC call or direct SQL query to get user metadata
    const { data, error } = await supabase.rpc('get_user_role_by_email', {
      user_email: email
    })

    if (error) {
      console.warn('[RoleHelper] RPC error:', error)
      return 'user'
    }

    if (data && data.role) {
      console.log('[RoleHelper] Found role:', data.role)
      return data.role as 'user' | 'admin'
    }

    return 'user'
  } catch (err) {
    console.error('[RoleHelper] Error fetching role:', err)
    return 'user'
  }
}

/**
 * Get user display name from Supabase by email
 */
export async function getUserDisplayNameFromSupabase(email: string): Promise<string | null> {
  try {
    const { data, error } = await supabase.rpc('get_user_metadata_by_email', {
      user_email: email
    })

    if (error || !data) {
      return null
    }

    return data.displayName || data.display_name || null
  } catch (err) {
    console.error('[RoleHelper] Error fetching display name:', err)
    return null
  }
}
