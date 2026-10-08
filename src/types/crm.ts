/**
 * Central Sly - Types do Domínio Comercial
 * Sly Parts / Platina Indústria e Comércio de Autopeças
 */

export type PapelUsuario = 'vendedor' | 'supervisora' | 'diretoria' | 'pcp' | 'admin'
export type MercadoCliente = 'reposicao_direta' | 'reposicao_indireta' | 'industria' | 'exportacao'
export type SituacaoComercial = 'ativo' | 'atencao' | 'queda' | 'inativo'
export type FamiliaProduto =
  | 'pistao_leve'
  | 'pistao_pesada'
  | 'pistao_jogos'
  | 'pca'
  | 'kpm'
  | 'pino'
export type TipoAcao =
  | 'reativacao'
  | 'lote_cd'
  | 'pendencia'
  | 'retorno'
  | 'pos_venda'
  | 'prospeccao'
  | 'manual'
export type FaixaAcao = 'alta' | 'normal'
export type SituacaoAcao = 'aberta' | 'concluida' | 'cancelada'
export type OrigemAcao = 'motor' | 'manual' | 'ia'
export type CanalInteracao = 'whatsapp' | 'telefone' | 'teams' | 'email' | 'visita'
export type SituacaoAlerta = 'aberto' | 'lido' | 'resolvido'

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

export interface Cliente {
  id: string
  codigo_focco: string
  razao_social: string
  nome_fantasia: string
  cnpj: string
  cidade: string
  uf: string
  mercado: MercadoCliente
  vendedor_id: string | null
  situacao_comercial: SituacaoComercial
  media_mensal_6m: number
  media_recente: number
  variacao_pct: number
  dias_sem_compra: number
  intervalo_medio_dias: number
  ticket_medio: number
  ultima_compra: string | null
  ultima_interacao: string | null
  created_at?: string
  updated_at?: string
  // Relações opcionais
  vendedor?: Perfil | null
  contatos?: Contato[]
  historico_faturamento?: FaturamentoMensal[]
}

export interface Contato {
  id: string
  cliente_id: string
  nome: string
  cargo?: string | null
  telefone?: string | null
  email?: string | null
  principal: boolean
  created_at?: string
}

export interface FaturamentoMensal {
  id: string
  cliente_id: string
  mes: string // YYYY-MM-DD
  pecas: number
  valor: number
  familia: FamiliaProduto
  created_at?: string
}

export interface Acao {
  id: string
  cliente_id: string
  vendedor_id: string | null
  tipo: TipoAcao
  titulo: string
  motivo: string
  valor_em_risco: number
  prioridade_pontos: number
  faixa: FaixaAcao
  data_prevista: string // YYYY-MM-DD
  prazo?: string | null
  situacao: SituacaoAcao
  resultado?: string | null
  observacao?: string | null
  data_retorno?: string | null
  origem: OrigemAcao
  created_at?: string
  updated_at?: string
  // Relações
  cliente?: Cliente | null
  vendedor?: Perfil | null
}

export interface Interacao {
  id: string
  cliente_id: string
  usuario_id: string | null
  acao_id?: string | null
  canal: CanalInteracao
  direcao: 'saida' | 'entrada'
  resumo: string
  data: string
  usuario?: Perfil | null
  cliente?: Cliente | null
}

export interface Alerta {
  id: string
  tipo: string
  destinatario_id: string | null
  mensagem: string
  referencia?: string | null
  situacao: SituacaoAlerta
  created_at: string
  destinatario?: Perfil | null
}
