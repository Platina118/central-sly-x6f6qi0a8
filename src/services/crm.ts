/**
 * Central Sly - Serviço de Dados do CRM (Supabase + Fallback Resiliente)
 * Sly Parts / Platina Indústria e Comércio de Autopeças
 */

import { supabase } from '@/lib/supabase/client'
import {
  Cliente,
  Acao,
  Contato,
  FaturamentoMensal,
  Interacao,
  Alerta,
  Perfil,
  PapelUsuario,
  SituacaoComercial,
} from '@/types/crm'

export const formatCurrency = (val: number | null | undefined): string => {
  const num = Number(val || 0)
  return num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export const formatDateBR = (dateStr: string | null | undefined): string => {
  if (!dateStr) return '-'
  try {
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return dateStr
    return d.toLocaleDateString('pt-BR')
  } catch {
    return dateStr
  }
}

export const formatDateTimeBR = (dateStr: string | null | undefined): string => {
  if (!dateStr) return '-'
  try {
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return dateStr
    return `${d.toLocaleDateString('pt-BR')} às ${d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`
  } catch {
    return dateStr
  }
}

// -----------------------------------------------------------------------------
// 1. CLIENTES
// -----------------------------------------------------------------------------
export async function getClientes(options?: {
  vendedorId?: string | null
  situacao?: SituacaoComercial | null
  uf?: string | null
  mercado?: string | null
  search?: string | null
}): Promise<Cliente[]> {
  try {
    let query = supabase
      .from('clientes')
      .select('*, vendedor:perfis!clientes_vendedor_id_fkey(*)')
      .order('razao_social', { ascending: true })

    if (options?.vendedorId) {
      query = query.eq('vendedor_id', options.vendedorId)
    }
    if (options?.situacao) {
      query = query.eq('situacao_comercial', options.situacao)
    }
    if (options?.uf) {
      query = query.eq('uf', options.uf)
    }
    if (options?.mercado) {
      query = query.eq('mercado', options.mercado as any)
    }
    if (options?.search) {
      const term = `%${options.search}%`
      query = query.or(
        `razao_social.ilike.${term},nome_fantasia.ilike.${term},codigo_focco.ilike.${term},cnpj.ilike.${term},cidade.ilike.${term}`,
      )
    }

    const { data, error } = await query
    if (error) {
      console.warn('Erro ao carregar clientes do Supabase:', error)
      return []
    }
    return (data as any) || []
  } catch (err) {
    console.error('Falha de rede ao buscar clientes:', err)
    return []
  }
}

export async function getClienteById(id: string): Promise<Cliente | null> {
  try {
    const { data, error } = await supabase
      .from('clientes')
      .select('*, vendedor:perfis!clientes_vendedor_id_fkey(*)')
      .eq('id', id)
      .single()

    if (error) {
      console.warn('Erro ao carregar cliente por ID:', error)
      return null
    }
    return (data as any) || null
  } catch (err) {
    console.error('Falha ao buscar cliente:', err)
    return null
  }
}

export async function getContatosByCliente(clienteId: string): Promise<Contato[]> {
  try {
    const { data, error } = await supabase
      .from('contatos')
      .select('*')
      .eq('cliente_id', clienteId)
      .order('principal', { ascending: false })

    if (error) {
      console.warn('Erro ao carregar contatos:', error)
      return []
    }
    return (data as any) || []
  } catch (err) {
    console.error('Falha ao buscar contatos:', err)
    return []
  }
}

export async function getFaturamentoByCliente(clienteId: string): Promise<FaturamentoMensal[]> {
  try {
    const { data, error } = await supabase
      .from('faturamento_mensal')
      .select('*')
      .eq('cliente_id', clienteId)
      .order('mes', { ascending: true })

    if (error) {
      console.warn('Erro ao carregar faturamento:', error)
      return []
    }
    return (data as any) || []
  } catch (err) {
    console.error('Falha ao buscar faturamento:', err)
    return []
  }
}

// -----------------------------------------------------------------------------
// 2. AÇÕES
// -----------------------------------------------------------------------------
export async function getAcoes(options?: {
  vendedorId?: string | null
  situacao?: string
  dataPrevista?: string
}): Promise<Acao[]> {
  try {
    let query = supabase
      .from('acoes')
      .select('*, cliente:clientes(*), vendedor:perfis!acoes_vendedor_id_fkey(*)')
      .order('prioridade_pontos', { ascending: false })

    if (options?.vendedorId) {
      query = query.eq('vendedor_id', options.vendedorId)
    }
    if (options?.situacao) {
      query = query.eq('situacao', options.situacao as any)
    }
    if (options?.dataPrevista) {
      query = query.eq('data_prevista', options.dataPrevista)
    }

    const { data, error } = await query
    if (error) {
      console.warn('Erro ao carregar ações:', error)
      return []
    }
    return (data as any) || []
  } catch (err) {
    console.error('Falha ao buscar ações:', err)
    return []
  }
}

export async function registrarResultadoAcao(params: {
  acaoId: string
  clienteId: string
  usuarioId?: string | null
  resultado: string
  observacao?: string
  dataRetorno?: string | null
  pedidoValor?: number | null
}): Promise<{ success: boolean; error?: string }> {
  try {
    // 1. Atualizar a ação para concluída
    const { error: acaoError } = await (supabase.from('acoes') as any)
      .update({
        situacao: 'concluida',
        resultado: params.resultado,
        observacao: params.observacao || null,
        data_retorno: params.dataRetorno || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', params.acaoId)

    if (acaoError) {
      console.error('Erro ao atualizar ação:', acaoError)
      return { success: false, error: acaoError.message }
    }

    // 2. Registrar no histórico de interações
    let resumoTexto = `Resultado da ação: ${params.resultado}.`
    if (params.pedidoValor) {
      resumoTexto += ` Pedido gerado de ${formatCurrency(params.pedidoValor)}.`
    }
    if (params.observacao) {
      resumoTexto += ` Obs: ${params.observacao}`
    }
    if (params.dataRetorno) {
      resumoTexto += ` Retorno agendado para ${formatDateBR(params.dataRetorno)}.`
    }

    const { error: interacaoError } = await (supabase.from('interacoes') as any).insert({
      cliente_id: params.clienteId,
      usuario_id: params.usuarioId || null,
      acao_id: params.acaoId,
      canal: 'whatsapp',
      direcao: 'saida',
      resumo: resumoTexto,
      data: new Date().toISOString(),
    })

    if (interacaoError) {
      console.warn('Aviso: ação concluída, mas erro ao criar interação:', interacaoError)
    }

    // Se tiver data de retorno futura, cria automaticamente uma nova ação de retorno
    if (params.dataRetorno) {
      await (supabase.from('acoes') as any).insert({
        cliente_id: params.clienteId,
        vendedor_id: params.usuarioId || null,
        tipo: 'retorno',
        titulo: `Retorno agendado: ${params.resultado}`,
        motivo: params.observacao || `Retorno agendado em acompanhamento comercial.`,
        valor_em_risco: 0,
        prioridade_pontos: 80,
        faixa: 'alta',
        data_prevista: params.dataRetorno,
        situacao: 'aberta',
        origem: 'manual',
      })
    }

    return { success: true }
  } catch (err: any) {
    console.error('Falha ao registrar resultado:', err)
    return { success: false, error: err.message || 'Erro desconhecido' }
  }
}

export async function criarNovaAcao(nova: {
  cliente_id: string
  vendedor_id?: string | null
  tipo: string
  titulo: string
  motivo: string
  valor_em_risco?: number
  faixa?: string
  data_prevista: string
  prazo?: string
}): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const { data, error } = await (supabase.from('acoes') as any)
      .insert({
        cliente_id: nova.cliente_id,
        vendedor_id: nova.vendedor_id || null,
        tipo: nova.tipo || 'manual',
        titulo: nova.titulo,
        motivo: nova.motivo,
        valor_em_risco: nova.valor_em_risco || 0,
        prioridade_pontos: nova.faixa === 'alta' ? 85 : 55,
        faixa: nova.faixa || 'normal',
        data_prevista: nova.data_prevista,
        prazo: nova.prazo || null,
        situacao: 'aberta',
        origem: 'manual',
      })
      .select()
      .single()

    if (error) {
      return { success: false, error: error.message }
    }
    return { success: true, data }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}

// -----------------------------------------------------------------------------
// 3. INTERAÇÕES
// -----------------------------------------------------------------------------
export async function getInteracoesByCliente(clienteId: string): Promise<Interacao[]> {
  try {
    const { data, error } = await supabase
      .from('interacoes')
      .select('*, usuario:perfis!interacoes_usuario_id_fkey(*)')
      .eq('cliente_id', clienteId)
      .order('data', { ascending: false })

    if (error) {
      console.warn('Erro ao carregar interações:', error)
      return []
    }
    return (data as any) || []
  } catch (err) {
    console.error('Falha ao buscar interações:', err)
    return []
  }
}

export async function criarInteracao(params: {
  cliente_id: string
  usuario_id?: string | null
  acao_id?: string | null
  canal: string
  direcao?: string
  resumo: string
}): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await (supabase.from('interacoes') as any).insert({
      cliente_id: params.cliente_id,
      usuario_id: params.usuario_id || null,
      acao_id: params.acao_id || null,
      canal: params.canal,
      direcao: params.direcao || 'saida',
      resumo: params.resumo,
      data: new Date().toISOString(),
    })

    if (error) {
      return { success: false, error: error.message }
    }

    // Atualizar ultima_interacao no cliente
    await (supabase.from('clientes') as any)
      .update({ ultima_interacao: new Date().toISOString() })
      .eq('id', params.cliente_id)

    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}

// -----------------------------------------------------------------------------
// 4. ALERTAS
// -----------------------------------------------------------------------------
export async function getAlertas(destinatarioId?: string | null): Promise<Alerta[]> {
  try {
    let query = supabase
      .from('alertas')
      .select('*, destinatario:perfis!alertas_destinatario_id_fkey(*)')
      .order('created_at', { ascending: false })

    if (destinatarioId) {
      query = query.eq('destinatario_id', destinatarioId)
    }

    const { data, error } = await query
    if (error) {
      console.warn('Erro ao carregar alertas:', error)
      return []
    }
    return (data as any) || []
  } catch (err) {
    console.error('Falha ao buscar alertas:', err)
    return []
  }
}

export async function marcarAlertaResolvido(alertaId: string): Promise<boolean> {
  try {
    const { error } = await (supabase.from('alertas') as any)
      .update({ situacao: 'resolvido' })
      .eq('id', alertaId)
    return !error
  } catch {
    return false
  }
}

// -----------------------------------------------------------------------------
// 5. VENDEDORES / PERFIS (Para Supervisão e Reatribuição)
// -----------------------------------------------------------------------------
export async function getVendedores(): Promise<Perfil[]> {
  try {
    const { data, error } = await supabase
      .from('perfis')
      .select('*')
      .eq('papel', 'vendedor')
      .eq('ativo', true)
      .order('nome')

    if (error) {
      console.warn('Erro ao carregar vendedores:', error)
      return []
    }
    return (data as any) || []
  } catch (err) {
    console.error('Falha ao buscar vendedores:', err)
    return []
  }
}

export async function reatribuirAcao(acaoId: string, novoVendedorId: string): Promise<boolean> {
  try {
    const { error } = await (supabase.from('acoes') as any)
      .update({ vendedor_id: novoVendedorId, updated_at: new Date().toISOString() })
      .eq('id', acaoId)
    return !error
  } catch {
    return false
  }
}

export async function reatribuirCliente(
  clienteId: string,
  novoVendedorId: string,
): Promise<boolean> {
  try {
    // Reatribui o cliente
    const { error } = await (supabase.from('clientes') as any)
      .update({ vendedor_id: novoVendedorId, updated_at: new Date().toISOString() })
      .eq('id', clienteId)

    if (error) return false

    // Também reatribui as ações abertas daquele cliente
    await (supabase.from('acoes') as any)
      .update({ vendedor_id: novoVendedorId, updated_at: new Date().toISOString() })
      .eq('cliente_id', clienteId)
      .eq('situacao', 'aberta')

    return true
  } catch {
    return false
  }
}
