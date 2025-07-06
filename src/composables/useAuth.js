import { useSupabase } from '@/clients/supabase'
import { useUserStore } from '@/stores/userStore'

export function useAuth() {
  const { supabase } = useSupabase()
  const userStore = useUserStore()

  const getSession = async () => {
    const { data, error } = await supabase.auth.getSession()

    if (error) throw error

    if (data.session && data.session.user) {
      userStore.setUser(data.session.user)
      await userStore.getProfile()
    }
    return data.session
  }

  const signUpWithPassw = async ({ email, password }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    if (error) throw error

    userStore.setUser(data.user)
    await userStore.getProfile()
  }

  const loginWithPassw = async ({ email, password }) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error

    userStore.setUser(data.user)
    await userStore.getProfile()
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    userStore.clear()

    if (error) throw error
  }

  return {
    getSession,
    signUpWithPassw,
    loginWithPassw,
    signOut,
  }
}
