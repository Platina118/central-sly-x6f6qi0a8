export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  public: {
    Tables: {
      perfis: {
        Row: {
          id: string
          nome: string
          email: string
          papel: 'vendedor' | 'supervisora' | 'diretoria' | 'pcp' | 'admin'
          codigo_vendedor_focco: string | null
          avatar_url: string | null
          ativo: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          nome: string
          email: string
          papel?: 'vendedor' | 'supervisora' | 'diretoria' | 'pcp' | 'admin'
          codigo_vendedor_focco?: string | null
          avatar_url?: string | null
          ativo?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nome?: string
          email?: string
          papel?: 'vendedor' | 'supervisora' | 'diretoria' | 'pcp' | 'admin'
          codigo_vendedor_focco?: string | null
          avatar_url?: string | null
          ativo?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      clientes: {
        Row: {
          id: string
          codigo_focco: string
          razao_social: string
          nome_fantasia: string
          cnpj: string
          cidade: string
          uf: string
          mercado: 'reposicao_direta' | 'reposicao_indireta' | 'industria' | 'exportacao'
          vendedor_id: string | null
          situacao_comercial: 'ativo' | 'atencao' | 'queda' | 'inativo'
          media_mensal_6m: number
          media_recente: number
          variacao_pct: number
          dias_sem_compra: number
          intervalo_medio_dias: number
          ticket_medio: number
          ultima_compra: string | null
          ultima_interacao: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          codigo_focco: string
          razao_social: string
          nome_fantasia: string
          cnpj: string
          cidade: string
          uf: string
          mercado?: 'reposicao_direta' | 'reposicao_indireta' | 'industria' | 'exportacao'
          vendedor_id?: string | null
          situacao_comercial?: 'ativo' | 'atencao' | 'queda' | 'inativo'
          media_mensal_6m?: number
          media_recente?: number
          variacao_pct?: number
          dias_sem_compra?: number
          intervalo_medio_dias?: number
          ticket_medio?: number
          ultima_compra?: string | null
          ultima_interacao?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          codigo_focco?: string
          razao_social?: string
          nome_fantasia?: string
          cnpj?: string
          cidade?: string
          uf?: string
          mercado?: 'reposicao_direta' | 'reposicao_indireta' | 'industria' | 'exportacao'
          vendedor_id?: string | null
          situacao_comercial?: 'ativo' | 'atencao' | 'queda' | 'inativo'
          media_mensal_6m?: number
          media_recente?: number
          variacao_pct?: number
          dias_sem_compra?: number
          intervalo_medio_dias?: number
          ticket_medio?: number
          ultima_compra?: string | null
          ultima_interacao?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'clientes_vendedor_id_fkey'
            columns: ['vendedor_id']
            isOneToOne: false
            referencedRelation: 'perfis'
            referencedColumns: ['id']
          },
        ]
      }
      contatos: {
        Row: {
          id: string
          cliente_id: string
          nome: string
          cargo: string | null
          telefone: string | null
          email: string | null
          principal: boolean
          created_at: string
        }
        Insert: {
          id?: string
          cliente_id: string
          nome: string
          cargo?: string | null
          telefone?: string | null
          email?: string | null
          principal?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          cliente_id?: string
          nome?: string
          cargo?: string | null
          telefone?: string | null
          email?: string | null
          principal?: boolean
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'contatos_cliente_id_fkey'
            columns: ['cliente_id']
            isOneToOne: false
            referencedRelation: 'clientes'
            referencedColumns: ['id']
          },
        ]
      }
      faturamento_mensal: {
        Row: {
          id: string
          cliente_id: string
          mes: string
          pecas: number
          valor: number
          familia: 'pistao_leve' | 'pistao_pesada' | 'pistao_jogos' | 'pca' | 'kpm' | 'pino'
          created_at: string
        }
        Insert: {
          id?: string
          cliente_id: string
          mes: string
          pecas?: number
          valor?: number
          familia?: 'pistao_leve' | 'pistao_pesada' | 'pistao_jogos' | 'pca' | 'kpm' | 'pino'
          created_at?: string
        }
        Update: {
          id?: string
          cliente_id?: string
          mes?: string
          pecas?: number
          valor?: number
          familia?: 'pistao_leve' | 'pistao_pesada' | 'pistao_jogos' | 'pca' | 'kpm' | 'pino'
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'faturamento_mensal_cliente_id_fkey'
            columns: ['cliente_id']
            isOneToOne: false
            referencedRelation: 'clientes'
            referencedColumns: ['id']
          },
        ]
      }
      acoes: {
        Row: {
          id: string
          cliente_id: string
          vendedor_id: string | null
          tipo:
            | 'reativacao'
            | 'lote_cd'
            | 'pendencia'
            | 'retorno'
            | 'pos_venda'
            | 'prospeccao'
            | 'manual'
          titulo: string
          motivo: string
          valor_em_risco: number
          prioridade_pontos: number
          faixa: 'alta' | 'normal'
          data_prevista: string
          prazo: string | null
          situacao: 'aberta' | 'concluida' | 'cancelada'
          resultado: string | null
          observacao: string | null
          data_retorno: string | null
          origem: 'motor' | 'manual' | 'ia'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          cliente_id: string
          vendedor_id?: string | null
          tipo?:
            | 'reativacao'
            | 'lote_cd'
            | 'pendencia'
            | 'retorno'
            | 'pos_venda'
            | 'prospeccao'
            | 'manual'
          titulo: string
          motivo: string
          valor_em_risco?: number
          prioridade_pontos?: number
          faixa?: 'alta' | 'normal'
          data_prevista?: string
          prazo?: string | null
          situacao?: 'aberta' | 'concluida' | 'cancelada'
          resultado?: string | null
          observacao?: string | null
          data_retorno?: string | null
          origem?: 'motor' | 'manual' | 'ia'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          cliente_id?: string
          vendedor_id?: string | null
          tipo?:
            | 'reativacao'
            | 'lote_cd'
            | 'pendencia'
            | 'retorno'
            | 'pos_venda'
            | 'prospeccao'
            | 'manual'
          titulo?: string
          motivo?: string
          valor_em_risco?: number
          prioridade_pontos?: number
          faixa?: 'alta' | 'normal'
          data_prevista?: string
          prazo?: string | null
          situacao?: 'aberta' | 'concluida' | 'cancelada'
          resultado?: string | null
          observacao?: string | null
          data_retorno?: string | null
          origem?: 'motor' | 'manual' | 'ia'
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'acoes_cliente_id_fkey'
            columns: ['cliente_id']
            isOneToOne: false
            referencedRelation: 'clientes'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'acoes_vendedor_id_fkey'
            columns: ['vendedor_id']
            isOneToOne: false
            referencedRelation: 'perfis'
            referencedColumns: ['id']
          },
        ]
      }
      interacoes: {
        Row: {
          id: string
          cliente_id: string
          usuario_id: string | null
          acao_id: string | null
          canal: 'whatsapp' | 'telefone' | 'teams' | 'email' | 'visita'
          direcao: string
          resumo: string
          data: string
        }
        Insert: {
          id?: string
          cliente_id: string
          usuario_id?: string | null
          acao_id?: string | null
          canal?: 'whatsapp' | 'telefone' | 'teams' | 'email' | 'visita'
          direcao?: string
          resumo: string
          data?: string
        }
        Update: {
          id?: string
          cliente_id?: string
          usuario_id?: string | null
          acao_id?: string | null
          canal?: 'whatsapp' | 'telefone' | 'teams' | 'email' | 'visita'
          direcao?: string
          resumo?: string
          data?: string
        }
        Relationships: [
          {
            foreignKeyName: 'interacoes_cliente_id_fkey'
            columns: ['cliente_id']
            isOneToOne: false
            referencedRelation: 'clientes'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'interacoes_usuario_id_fkey'
            columns: ['usuario_id']
            isOneToOne: false
            referencedRelation: 'perfis'
            referencedColumns: ['id']
          },
        ]
      }
      alertas: {
        Row: {
          id: string
          tipo: string
          destinatario_id: string | null
          mensagem: string
          referencia: string | null
          situacao: 'aberto' | 'lido' | 'resolvido'
          created_at: string
        }
        Insert: {
          id?: string
          tipo: string
          destinatario_id?: string | null
          mensagem: string
          referencia?: string | null
          situacao?: 'aberto' | 'lido' | 'resolvido'
          created_at?: string
        }
        Update: {
          id?: string
          tipo?: string
          destinatario_id?: string | null
          mensagem?: string
          referencia?: string | null
          situacao?: 'aberto' | 'lido' | 'resolvido'
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'alertas_destinatario_id_fkey'
            columns: ['destinatario_id']
            isOneToOne: false
            referencedRelation: 'perfis'
            referencedColumns: ['id']
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      current_user_papel: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      papel_usuario: 'vendedor' | 'supervisora' | 'diretoria' | 'pcp' | 'admin'
      mercado_cliente: 'reposicao_direta' | 'reposicao_indireta' | 'industria' | 'exportacao'
      situacao_comercial: 'ativo' | 'atencao' | 'queda' | 'inativo'
      familia_produto: 'pistao_leve' | 'pistao_pesada' | 'pistao_jogos' | 'pca' | 'kpm' | 'pino'
      tipo_acao:
        | 'reativacao'
        | 'lote_cd'
        | 'pendencia'
        | 'retorno'
        | 'pos_venda'
        | 'prospeccao'
        | 'manual'
      faixa_acao: 'alta' | 'normal'
      situacao_acao: 'aberta' | 'concluida' | 'cancelada'
      origem_acao: 'motor' | 'manual' | 'ia'
      canal_interacao: 'whatsapp' | 'telefone' | 'teams' | 'email' | 'visita'
      situacao_alerta: 'aberto' | 'lido' | 'resolvido'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database['public']['Tables'] & Database['public']['Views'])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
        Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database['public']['Tables'] &
        Database['public']['Views'])
    ? (Database['public']['Tables'] &
        Database['public']['Views'])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export const Constants = {
  graphqlEndpoint: 'https://ixkaxoxqgykufhvhvhxh.supabase.co/graphql/v1',
}
