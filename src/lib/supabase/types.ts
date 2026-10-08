// AVOID UPDATING THIS FILE DIRECTLY. It is automatically generated.
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '14.18'
  }
  public: {
    Tables: {
      acoes: {
        Row: {
          cliente_id: string
          created_at: string
          data_prevista: string
          data_retorno: string | null
          faixa: Database['public']['Enums']['faixa_acao']
          id: string
          motivo: string
          observacao: string | null
          origem: Database['public']['Enums']['origem_acao']
          prazo: string | null
          prioridade_pontos: number
          resultado: string | null
          situacao: Database['public']['Enums']['situacao_acao']
          tipo: Database['public']['Enums']['tipo_acao']
          titulo: string
          updated_at: string
          valor_em_risco: number
          vendedor_id: string | null
        }
        Insert: {
          cliente_id: string
          created_at?: string
          data_prevista?: string
          data_retorno?: string | null
          faixa?: Database['public']['Enums']['faixa_acao']
          id?: string
          motivo: string
          observacao?: string | null
          origem?: Database['public']['Enums']['origem_acao']
          prazo?: string | null
          prioridade_pontos?: number
          resultado?: string | null
          situacao?: Database['public']['Enums']['situacao_acao']
          tipo?: Database['public']['Enums']['tipo_acao']
          titulo: string
          updated_at?: string
          valor_em_risco?: number
          vendedor_id?: string | null
        }
        Update: {
          cliente_id?: string
          created_at?: string
          data_prevista?: string
          data_retorno?: string | null
          faixa?: Database['public']['Enums']['faixa_acao']
          id?: string
          motivo?: string
          observacao?: string | null
          origem?: Database['public']['Enums']['origem_acao']
          prazo?: string | null
          prioridade_pontos?: number
          resultado?: string | null
          situacao?: Database['public']['Enums']['situacao_acao']
          tipo?: Database['public']['Enums']['tipo_acao']
          titulo?: string
          updated_at?: string
          valor_em_risco?: number
          vendedor_id?: string | null
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
      alertas: {
        Row: {
          created_at: string
          destinatario_id: string | null
          id: string
          mensagem: string
          referencia: string | null
          situacao: Database['public']['Enums']['situacao_alerta']
          tipo: string
        }
        Insert: {
          created_at?: string
          destinatario_id?: string | null
          id?: string
          mensagem: string
          referencia?: string | null
          situacao?: Database['public']['Enums']['situacao_alerta']
          tipo: string
        }
        Update: {
          created_at?: string
          destinatario_id?: string | null
          id?: string
          mensagem?: string
          referencia?: string | null
          situacao?: Database['public']['Enums']['situacao_alerta']
          tipo?: string
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
      clientes: {
        Row: {
          cidade: string
          cnpj: string
          codigo_focco: string
          created_at: string
          dias_sem_compra: number
          id: string
          intervalo_medio_dias: number
          media_mensal_6m: number
          media_recente: number
          mercado: Database['public']['Enums']['mercado_cliente']
          nome_fantasia: string
          razao_social: string
          situacao_comercial: Database['public']['Enums']['situacao_comercial']
          ticket_medio: number
          uf: string
          ultima_compra: string | null
          ultima_interacao: string | null
          updated_at: string
          variacao_pct: number
          vendedor_id: string | null
        }
        Insert: {
          cidade: string
          cnpj: string
          codigo_focco: string
          created_at?: string
          dias_sem_compra?: number
          id?: string
          intervalo_medio_dias?: number
          media_mensal_6m?: number
          media_recente?: number
          mercado?: Database['public']['Enums']['mercado_cliente']
          nome_fantasia: string
          razao_social: string
          situacao_comercial?: Database['public']['Enums']['situacao_comercial']
          ticket_medio?: number
          uf: string
          ultima_compra?: string | null
          ultima_interacao?: string | null
          updated_at?: string
          variacao_pct?: number
          vendedor_id?: string | null
        }
        Update: {
          cidade?: string
          cnpj?: string
          codigo_focco?: string
          created_at?: string
          dias_sem_compra?: number
          id?: string
          intervalo_medio_dias?: number
          media_mensal_6m?: number
          media_recente?: number
          mercado?: Database['public']['Enums']['mercado_cliente']
          nome_fantasia?: string
          razao_social?: string
          situacao_comercial?: Database['public']['Enums']['situacao_comercial']
          ticket_medio?: number
          uf?: string
          ultima_compra?: string | null
          ultima_interacao?: string | null
          updated_at?: string
          variacao_pct?: number
          vendedor_id?: string | null
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
          cargo: string | null
          cliente_id: string
          created_at: string
          email: string | null
          id: string
          nome: string
          principal: boolean
          telefone: string | null
        }
        Insert: {
          cargo?: string | null
          cliente_id: string
          created_at?: string
          email?: string | null
          id?: string
          nome: string
          principal?: boolean
          telefone?: string | null
        }
        Update: {
          cargo?: string | null
          cliente_id?: string
          created_at?: string
          email?: string | null
          id?: string
          nome?: string
          principal?: boolean
          telefone?: string | null
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
          cliente_id: string
          created_at: string
          familia: Database['public']['Enums']['familia_produto']
          id: string
          mes: string
          pecas: number
          valor: number
        }
        Insert: {
          cliente_id: string
          created_at?: string
          familia?: Database['public']['Enums']['familia_produto']
          id?: string
          mes: string
          pecas?: number
          valor?: number
        }
        Update: {
          cliente_id?: string
          created_at?: string
          familia?: Database['public']['Enums']['familia_produto']
          id?: string
          mes?: string
          pecas?: number
          valor?: number
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
      interacoes: {
        Row: {
          acao_id: string | null
          canal: Database['public']['Enums']['canal_interacao']
          cliente_id: string
          data: string
          direcao: string
          id: string
          resumo: string
          usuario_id: string | null
        }
        Insert: {
          acao_id?: string | null
          canal?: Database['public']['Enums']['canal_interacao']
          cliente_id: string
          data?: string
          direcao?: string
          id?: string
          resumo: string
          usuario_id?: string | null
        }
        Update: {
          acao_id?: string | null
          canal?: Database['public']['Enums']['canal_interacao']
          cliente_id?: string
          data?: string
          direcao?: string
          id?: string
          resumo?: string
          usuario_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'interacoes_acao_id_fkey'
            columns: ['acao_id']
            isOneToOne: false
            referencedRelation: 'acoes'
            referencedColumns: ['id']
          },
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
      perfis: {
        Row: {
          ativo: boolean
          avatar_url: string | null
          codigo_vendedor_focco: string | null
          created_at: string
          email: string
          id: string
          nome: string
          papel: Database['public']['Enums']['papel_usuario']
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          avatar_url?: string | null
          codigo_vendedor_focco?: string | null
          created_at?: string
          email: string
          id: string
          nome: string
          papel?: Database['public']['Enums']['papel_usuario']
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          avatar_url?: string | null
          codigo_vendedor_focco?: string | null
          created_at?: string
          email?: string
          id?: string
          nome?: string
          papel?: Database['public']['Enums']['papel_usuario']
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      current_user_papel: { Args: never; Returns: string }
    }
    Enums: {
      canal_interacao: 'whatsapp' | 'telefone' | 'teams' | 'email' | 'visita'
      faixa_acao: 'alta' | 'normal'
      familia_produto: 'pistao_leve' | 'pistao_pesada' | 'pistao_jogos' | 'pca' | 'kpm' | 'pino'
      mercado_cliente: 'reposicao_direta' | 'reposicao_indireta' | 'industria' | 'exportacao'
      origem_acao: 'motor' | 'manual' | 'ia'
      papel_usuario: 'vendedor' | 'supervisora' | 'diretoria' | 'pcp' | 'admin'
      situacao_acao: 'aberta' | 'concluida' | 'cancelada'
      situacao_alerta: 'aberto' | 'lido' | 'resolvido'
      situacao_comercial: 'ativo' | 'atencao' | 'queda' | 'inativo'
      tipo_acao:
        | 'reativacao'
        | 'lote_cd'
        | 'pendencia'
        | 'retorno'
        | 'pos_venda'
        | 'prospeccao'
        | 'manual'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      canal_interacao: ['whatsapp', 'telefone', 'teams', 'email', 'visita'],
      faixa_acao: ['alta', 'normal'],
      familia_produto: ['pistao_leve', 'pistao_pesada', 'pistao_jogos', 'pca', 'kpm', 'pino'],
      mercado_cliente: ['reposicao_direta', 'reposicao_indireta', 'industria', 'exportacao'],
      origem_acao: ['motor', 'manual', 'ia'],
      papel_usuario: ['vendedor', 'supervisora', 'diretoria', 'pcp', 'admin'],
      situacao_acao: ['aberta', 'concluida', 'cancelada'],
      situacao_alerta: ['aberto', 'lido', 'resolvido'],
      situacao_comercial: ['ativo', 'atencao', 'queda', 'inativo'],
      tipo_acao: [
        'reativacao',
        'lote_cd',
        'pendencia',
        'retorno',
        'pos_venda',
        'prospeccao',
        'manual',
      ],
    },
  },
} as const
