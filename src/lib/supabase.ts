/**
 * Central Sly - Supabase Client
 * Cliente resiliente configurado com Supabase Auth e fallback para demonstração.
 */

export type PapelUsuario = 'vendedor' | 'supervisora' | 'diretoria' | 'pcp' | 'admin'

export interface Perfil {
  id: string
  nome: string
  email: string
  papel: PapelUsuario
  codigo_vendedor_focco?: string | null
  avatar_url?: string | null
  ativo: boolean
  created_at?: string
  updated_at?: string
}

const SUPABASE_URL = (import.meta as any).env?.VITE_SUPABASE_URL || ''
const SUPABASE_ANON_KEY = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || ''

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY)

// Mock auth storage key for fallback simulation
const MOCK_STORAGE_KEY = 'central_sly_mock_session'

export interface AuthSession {
  user: {
    id: string
    email: string
    user_metadata?: Record<string, any>
  }
  perfil: Perfil
}

// Perfis de demonstração para facilitar a navegação em homologação / avaliação de papéis
export const DEMO_USERS: Record<
  PapelUsuario,
  { email: string; nome: string; papel: PapelUsuario; codigo?: string }
> = {
  vendedor: {
    email: 'vendedor@slyparts.com.br',
    nome: 'Carlos Eduardo (Vendedor)',
    papel: 'vendedor',
    codigo: 'VEND-042',
  },
  supervisora: {
    email: 'supervisora@slyparts.com.br',
    nome: 'Renata Silveira (Supervisora)',
    papel: 'supervisora',
  },
  diretoria: {
    email: 'diretoria@slyparts.com.br',
    nome: 'Marcos Platina (Diretoria)',
    papel: 'diretoria',
  },
  pcp: {
    email: 'pcp@slyparts.com.br',
    nome: 'Julio Cesar (PCP Engenharia)',
    papel: 'pcp',
  },
  admin: {
    email: 'admin@slyparts.com.br',
    nome: 'Administrador do Sistema',
    papel: 'admin',
  },
}

class SupabaseService {
  private listeners: Array<(session: AuthSession | null) => void> = []

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', () => {
        this.notify()
      })
    }
  }

  public getStoredSession(): AuthSession | null {
    if (typeof window === 'undefined') return null
    try {
      const data = localStorage.getItem(MOCK_STORAGE_KEY)
      if (!data) return null
      return JSON.parse(data) as AuthSession
    } catch {
      return null
    }
  }

  public setSession(session: AuthSession | null) {
    if (typeof window === 'undefined') return
    if (session) {
      localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(session))
    } else {
      localStorage.removeItem(MOCK_STORAGE_KEY)
    }
    this.notify()
  }

  public onAuthStateChange(callback: (session: AuthSession | null) => void) {
    this.listeners.push(callback)
    return {
      unsubscribe: () => {
        this.listeners = this.listeners.filter((cb) => cb !== callback)
      },
    }
  }

  private notify() {
    const session = this.getStoredSession()
    this.listeners.forEach((cb) => {
      try {
        cb(session)
      } catch (e) {
        console.error('Erro no listener de auth', e)
      }
    })
  }

  public async signInWithPassword(
    email: string,
    _pass: string,
  ): Promise<{ data: { session: AuthSession | null }; error: Error | null }> {
    // 1. Caso haja credenciais Supabase reais no ambiente, faz fetch direto na API REST do Supabase Auth
    if (isSupabaseConfigured) {
      try {
        const resp = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            apikey: SUPABASE_ANON_KEY,
          },
          body: JSON.stringify({ email, password: _pass }),
        })
        const json = await resp.json()
        if (!resp.ok) {
          return {
            data: { session: null },
            error: new Error(json.error_description || json.msg || 'E-mail ou senha inválidos.'),
          }
        }

        // Busca o perfil na tabela perfis
        let perfil: Perfil = {
          id: json.user.id,
          email: json.user.email,
          nome: json.user.user_metadata?.nome || email.split('@')[0],
          papel: json.user.user_metadata?.papel || 'vendedor',
          ativo: true,
        }

        try {
          const profileResp = await fetch(
            `${SUPABASE_URL}/rest/v1/perfis?id=eq.${json.user.id}&select=*`,
            {
              headers: {
                apikey: SUPABASE_ANON_KEY,
                Authorization: `Bearer ${json.access_token}`,
              },
            },
          )
          if (profileResp.ok) {
            const profiles = await profileResp.json()
            if (profiles && profiles.length > 0) {
              perfil = profiles[0]
            }
          }
        } catch (e) {
          console.warn('Usando perfil de fallback local do metadata', e)
        }

        const session: AuthSession = {
          user: json.user,
          perfil,
        }
        this.setSession(session)
        return { data: { session }, error: null }
      } catch (err: any) {
        return {
          data: { session: null },
          error: new Error(err.message || 'Erro de conexão com o Supabase.'),
        }
      }
    }

    // 2. Modo fallback local robusto: permite login com qualquer um dos usuários de demonstração ou qualquer e-mail válido
    const normalizedEmail = email.trim().toLowerCase()
    const foundDemoKey = (Object.keys(DEMO_USERS) as PapelUsuario[]).find(
      (key) => DEMO_USERS[key].email.toLowerCase() === normalizedEmail,
    )

    let papel: PapelUsuario = 'vendedor'
    let nome = email.split('@')[0]
    let codigo = undefined

    if (foundDemoKey) {
      papel = DEMO_USERS[foundDemoKey].papel
      nome = DEMO_USERS[foundDemoKey].nome
      codigo = DEMO_USERS[foundDemoKey].codigo
    } else if (normalizedEmail.includes('supervisora')) {
      papel = 'supervisora'
    } else if (normalizedEmail.includes('diretoria')) {
      papel = 'diretoria'
    } else if (normalizedEmail.includes('pcp')) {
      papel = 'pcp'
    } else if (normalizedEmail.includes('admin')) {
      papel = 'admin'
    }

    const session: AuthSession = {
      user: {
        id: `usr_${Math.random().toString(36).substring(2, 9)}`,
        email: normalizedEmail,
        user_metadata: { nome, papel },
      },
      perfil: {
        id: `usr_${Math.random().toString(36).substring(2, 9)}`,
        nome,
        email: normalizedEmail,
        papel,
        codigo_vendedor_focco: codigo,
        ativo: true,
      },
    }

    this.setSession(session)
    return { data: { session }, error: null }
  }

  public async resetPasswordForEmail(email: string): Promise<{ error: Error | null }> {
    if (isSupabaseConfigured) {
      try {
        const resp = await fetch(`${SUPABASE_URL}/auth/v1/recover`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            apikey: SUPABASE_ANON_KEY,
          },
          body: JSON.stringify({ email }),
        })
        if (!resp.ok) {
          const json = await resp.json()
          return { error: new Error(json.msg || 'Erro ao enviar e-mail de recuperação.') }
        }
        return { error: null }
      } catch (err: any) {
        return { error: new Error(err.message || 'Erro de conexão.') }
      }
    }
    // Fallback simulado
    return { error: null }
  }

  public async signOut(): Promise<{ error: Error | null }> {
    this.setSession(null)
    return { error: null }
  }
}

export const supabase = new SupabaseService()
