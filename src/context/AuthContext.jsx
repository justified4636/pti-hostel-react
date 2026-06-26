import { createContext, useContext, useState, useEffect } from 'react'
import { sb } from '../lib/supabase'

const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    sb.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) initApp(session.user)
      else setLoading(false)
    })

    const { data: { subscription } } = sb.auth.onAuthStateChange((_event, session) => {
      if (session?.user) initApp(session.user)
      else { setUser(null); setProfile(null); setLoading(false) }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function initApp(u) {
    setUser(u)
    const { data: p } = await sb.from('profiles').select('*').eq('id', u.id).single()
    setProfile(p)
    setLoading(false)
  }

  async function login(email, password) {
    const { data, error } = await sb.auth.signInWithPassword({ email, password })
    if (error) throw error
    await initApp(data.user)
  }

  async function logout() {
    await sb.auth.signOut()
    setUser(null)
    setProfile(null)
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
