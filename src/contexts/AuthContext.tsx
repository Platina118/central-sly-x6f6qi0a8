import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase, AuthSession, Perfil, PapelUsuario } from '@/lib/supabase'

interface AuthContextType {
  session: AuthSession | null
  perfil: Perfil | null
  loading: boolean
  signIn: (email: string, pass: string) => Promise<{ error: Error | null }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: Error | null }>
  switchDemoRole?: (papel: PapelUsuario) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<AuthSession | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 1. Inicializa com a sessão guardada
    const current = supabase.getStoredSession()
    setSession(current)
    setLoading(false)

    // 2. Escuta mudanças
    const sub = supabase.onAuthStateChange((newSession) => {
      setSession(newSession)
      setLoading(false)
    })

    return () => {
      sub.unsubscribe()
    }
  }, [])

  const signIn = async (email: string, pass: string) => {
    setLoading(true)
    const { data, error } = await supabase.signInWithPassword(email, pass)
    setLoading(false)
    if (data?.session) {
      setSession(data.session)
    }
    return { error }
  }

  const signOut = async () => {
    await supabase.signOut()
    setSession(null)
  }

  const resetPassword = async (email: string) => {
    return await supabase.resetPasswordForEmail(email)
  }

  const switchDemoRole = (papel: PapelUsuario) => {
    const defaultNames: Record<PapelUsuario, string> = {
      vendedor: 'Carlos Eduardo (Vendedor)',
      supervisora: 'Renata Silveira (Supervisora)',
      diretoria: 'Marcos Platina (Diretoria)',
      pcp: 'Julio Cesar (PCP Engenharia)',
      admin: 'Administrador do Sistema',
    }

    const newSession: AuthSession = {
      user: {
        id: 'usr_demo_' + papel,
        email: `${papel}@slyparts.com.br`,
        user_metadata: { nome: defaultNames[papel], papel },
      },
      perfil: {
        id: 'usr_demo_' + papel,
        nome: defaultNames[papel],
        email: `${papel}@slyparts.com.br`,
        papel,
        codigo_vendedor_focco: papel === 'vendedor' ? 'VEND-042' : undefined,
        ativo: true,
      },
    }
    supabase.setSession(newSession)
    setSession(newSession)
  }

  return (
    <AuthContext.Provider
      value={{
        session,
        perfil: session?.perfil || null,
        loading,
        signIn,
        signOut,
        resetPassword,
        switchDemoRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider')
  }
  return context
}

export const getRoleHomePath = (papel?: PapelUsuario): string => {
  switch (papel) {
    case 'vendedor':
      return '/meu-dia'
    case 'supervisora':
      return '/supervisao'
    case 'diretoria':
      return '/paineis'
    case 'pcp':
      return '/lotes-c-d'
    case 'admin':
      return '/administracao'
    default:
      return '/meu-dia'
  }
}
