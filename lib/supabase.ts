import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

function isValidUrl(url: string): boolean {
  try {
    const u = new URL(url)
    return u.protocol === 'http:' || u.protocol === 'https:'
  } catch {
    return false
  }
}

export const supabase = isValidUrl(supabaseUrl) && supabaseKey && supabaseKey !== 'your_supabase_anon_key_here'
  ? createClient(supabaseUrl, supabaseKey)
  : null
