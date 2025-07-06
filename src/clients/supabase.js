import { createClient } from '@supabase/supabase-js'
import { useUserStore } from '@/stores/userStore'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

supabase.auth.onAuthStateChange((event, session) => {
  const userStore = useUserStore()

  userStore.setUser(session?.user)
})

export function useSupabase() {
  return { supabase }
}
