/**
 * Central Sly - Configurações e Tipos de Autenticação Supabase
 * Reexporta o cliente supabase real e define os usuários homologados para demo.
 */

import { supabase } from '@/lib/supabase/client'
import type { Perfil, PapelUsuario } from '@/types/crm'

export type { PapelUsuario, Perfil }
export { supabase }

export const isSupabaseConfigured = true

// Senha padrão configurada para todas as contas de homologação
export const DEMO_PASSWORD = 'Skip@Pass'

export interface DemoUserConfig {
  email: string
  nome: string
  papel: PapelUsuario
  codigo?: string
}

// Perfis de demonstração oficiais alinhados ao Supabase Auth e tabela perfis
export const DEMO_USERS: Record<PapelUsuario, DemoUserConfig> = {
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
    codigo: 'SUP-001',
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
    codigo: 'PCP-010',
  },
  admin: {
    email: 'admin@slyparts.com.br',
    nome: 'Administrador do Sistema',
    papel: 'admin',
  },
}
