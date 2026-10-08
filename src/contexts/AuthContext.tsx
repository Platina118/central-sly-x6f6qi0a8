import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase/client'
import { DEMO_USERS, DEMO_PASSWORD } from '@/lib/supabase'
import type { Perfil, PapelUsuario } from '@/types/crm'

export interface AuthContextType {
  session: Session | null
  user: User | null
  perfil: Perfil | null
  loading: boolean
  signIn: (email: string, pass: string) => Promise<{ error: Error | null }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: Error | null }>
  switchDemoRole?: (papel: PapelUsuario) => Promise<{ error: Error | null }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Função utilitária para buscar o perfil na tabela perfis pelo ID
async function fetchPerfil(userId: string, emailFallback?: string): Promise<Perfil | null> {
  try {
    const { data, error } = await supabase.from('perfis').select('*').eq('id', userId).maybeSingle()

    if (error) {
      console.warn('Erro ao carregar perfil do usuário:', error)
      return null
    }

    if (data) {
      return data as Perfil
    }

    // Fallback se não existir perfil criado para esse ID
    return {
      id: userId,
      nome: emailFallback?.split('@')[0] || 'Usuário',
      email: emailFallback || '',
      papel: 'vendedor',
      ativo: true,
    }
  } catch (e) {
    console.error('Falha de rede ao buscar perfil:', e)
    return null
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [perfil, setPerfil] = useState<Perfil | null>(null)
  const [loading, setLoading] = useState(true)

  // Atualizar perfil sempre que o usuário mudar
  const refreshPerfil = useCallback(async (currentUser: User | null) => {
    if (!currentUser) {
      setPerfil(null)
      return
    }
    const p = await fetchPerfil(currentUser.id, currentUser.email)
    setPerfil(p)
  }, [])

  useEffect(() => {
    // 1. Ouvinte oficial do Supabase Auth (sem async/await dentro do callback síncrono)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession)
      setUser(currentSession?.user ?? null)
      if (currentSession?.user) {
        // Carrega o perfil de forma assíncrona desacoplada
        fetchPerfil(currentSession.user.id, currentSession.user.email).then((p) => {
          setPerfil(p)
          setLoading(false)
        })
      } else {
        setPerfil(null)
        setLoading(false)
      }
    })

    // 2. Busca inicial síncrona/imediata da sessão persistida
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      setSession(initialSession)
      setUser(initialSession?.user ?? null)
      if (initialSession?.user) {
        fetchPerfil(initialSession.user.id, initialSession.user.email).then((p) => {
          setPerfil(p)
          setLoading(false)
        })
      } else {
        setLoading(false)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const signIn = async (email: string, pass: string) => {
    setLoading(true)
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password: pass,
    })

    if (error) {
      setLoading(false)
      return { error: new Error(error.message) }
    }

    if (data.session) {
      setSession(data.session)
      setUser(data.user)
      const p = await fetchPerfil(data.user.id, data.user.email)
      setPerfil(p)
    }
    setLoading(false)
    return { error: null }
  }

  const signOut = async () => {
    setLoading(true)
    await supabase.auth.signOut()
    setSession(null)
    setUser(null)
    setPerfil(null)
    setLoading(false)
  }

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
      redirectTo: `${window.location.origin}/`,
    })
    return { error: error ? new Error(error.message) : null }
  }

  // Seletor de homologação realiza login REAL com a conta demo correspondente
  const switchDemoRole = async (papel: PapelUsuario) => {
    const demo = DEMO_USERS[papel]
    if (!demo) return { error: new Error('Papel de demonstração não encontrado') }

    setLoading(true)
    const { data, error } = await supabase.auth.signInWithPassword({
      email: demo.email,
      password: DEMO_PASSWORD,
    })

    if (error) {
      console.error(`Erro ao logar na conta demo ${demo.email}:`, error)
      setLoading(false)
      return { error: new Error(error.message) }
    }

    if (data.session) {
      setSession(data.session)
      setUser(data.user)
      const p = await fetchPerfil(data.user.id, data.user.email)
      setPerfil(p)
    }
    setLoading(false)
    return { error: null }
  }

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        perfil,
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
