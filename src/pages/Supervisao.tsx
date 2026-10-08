import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Users2,
  AlertOctagon,
  CheckCircle2,
  Clock,
  ArrowRightLeft,
  UserCheck,
  TrendingDown,
  Bell,
  MessageSquare,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  Eye,
  Check,
} from 'lucide-react'
import { RoleGuard } from '@/components/RoleGuard'
import { PageHeader } from '@/components/EmptyState'
import { StatusBadge } from '@/components/StatusBadge'
import { ModalReatribuir } from '@/components/ModalReatribuir'
import {
  getVendedores,
  getClientes,
  getAcoes,
  getAlertas,
  marcarAlertaResolvido,
  formatCurrency,
} from '@/services/crm'
import { Perfil, Cliente, Acao, Alerta } from '@/types/crm'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/use-toast'

export default function SupervisaoPage() {
  const navigate = useNavigate()
  const { perfil } = useAuth()
  const { toast } = useToast()

  const [vendedores, setVendedores] = useState<Perfil[]>([])
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [acoes, setAcoes] = useState<Acao[]>([])
  const [alertas, setAlertas] = useState<Alerta[]>([])
  const [loading, setLoading] = useState(true)

  // Vendedor selecionado para detalhamento de ações no painel inferior
  const [vendedorSelecionado, setVendedorSelecionado] = useState<Perfil | null>(null)

  // Modais
  const [modalReatribuirOpen, setModalReatribuirOpen] = useState(false)
  const [acaoParaReatribuir, setAcaoParaReatribuir] = useState<Acao | null>(null)

  const carregarDados = async () => {
    setLoading(true)
    try {
      const [vends, clis, acs, alts] = await Promise.all([
        getVendedores(),
        getClientes(),
        getAcoes(),
        getAlertas(),
      ])
      setVendedores(vends)
      setClientes(clis)
      setAcoes(acs)
      setAlertas(alts)

      if (vends.length > 0 && !vendedorSelecionado) {
        setVendedorSelecionado(vends[0])
      }
    } catch (err) {
      console.error('Erro ao carregar Supervisão:', err)
      toast({
        title: 'Erro de permissão ou conexão',
        description: 'Não foi possível carregar os dados completos da supervisão.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    carregarDados()
  }, [perfil?.id])

  // ===========================================================================
  // 4 KPIS DA EQUIPE HOJE
  // ===========================================================================
  const hojeStr = new Date().toISOString().split('T')[0]

  const totalAcoes = acoes.length
  const concluidasHoje = acoes.filter((a) => a.situacao === 'concluida').length
  const totalAtrasadas = acoes.filter(
    (a) => a.situacao === 'aberta' && a.data_prevista < hojeStr,
  ).length

  // Clientes em queda sem contato há 7+ dias
  const clientesQuedaSemContato = useMemo(() => {
    return clientes.filter((c) => {
      if (c.situacao_comercial !== 'queda') return false
      if (!c.ultima_interacao) return true
      const diffDias = Math.floor(
        (Date.now() - new Date(c.ultima_interacao).getTime()) / (1000 * 60 * 60 * 24),
      )
      return diffDias >= 7
    })
  }, [clientes])

  const alertasAbertos = useMemo(() => alertas.filter((a) => a.situacao === 'aberto'), [alertas])

  // ===========================================================================
  // ESTATÍSTICAS POR VENDEDOR
  // ===========================================================================
  const metricasVendedores = useMemo(() => {
    return vendedores.map((v) => {
      const acoesDoVend = acoes.filter((a) => a.vendedor_id === v.id)
      const abertas = acoesDoVend.filter((a) => a.situacao === 'aberta')
      const concluidas = acoesDoVend.filter((a) => a.situacao === 'concluida')
      const atrasadas = abertas.filter((a) => a.data_prevista < hojeStr)
      const total = acoesDoVend.length

      const pctProgresso = total > 0 ? Math.round((concluidas.length / total) * 100) : 0

      // Clientes em queda sem contato deste vendedor
      const clisQuedaSemContatoVend = clientesQuedaSemContato.filter((c) => c.vendedor_id === v.id)

      // Conversas sem resposta (simulado com base em clientes sem contato)
      const conversasSemResposta = Math.max(0, atrasadas.length)

      return {
        vendedor: v,
        total,
        concluidas: concluidas.length,
        atrasadas: atrasadas.length,
        pctProgresso,
        quedaSemContato: clisQuedaSemContatoVend.length,
        conversasSemResposta,
      }
    })
  }, [vendedores, acoes, clientesQuedaSemContato, hojeStr])

  // Ações do vendedor atualmente selecionado
  const acoesVendedorSelecionado = useMemo(() => {
    if (!vendedorSelecionado) return []
    return acoes.filter((a) => a.vendedor_id === vendedorSelecionado.id)
  }, [acoes, vendedorSelecionado])

  const handleResolverAlerta = async (alertaId: string) => {
    const ok = await marcarAlertaResolvido(alertaId)
    if (ok) {
      toast({
        title: 'Alerta resolvido',
        description: 'A pendência foi baixada com sucesso.',
      })
      setAlertas((prev) =>
        prev.map((alt) => (alt.id === alertaId ? { ...alt, situacao: 'resolvido' } : alt)),
      )
    }
  }

  const handleAssumirAlerta = (alt: Alerta) => {
    toast({
      title: 'Ação assumida pela supervisão',
      description: `Você assumiu o acompanhamento direto de: ${alt.referencia || alt.mensagem}.`,
    })
    handleResolverAlerta(alt.id)
  }

  return (
    <RoleGuard allowedRoles={['supervisora']}>
      <div className="space-y-6 pb-20 md:pb-8 animate-fade-in">
        {/* Topo da Tela */}
        <PageHeader
          title="Supervisão Comercial"
          subtitle="Acompanhamento em tempo real da equipe comercial, metas diárias e gargalos de atendimento."
          badge="Exclusivo Supervisão"
        />

        {/* 4 KPIS DA EQUIPE HOJE */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* KPI 1: Ações Concluídas / Total */}
          <div className="bg-white rounded-[10px] border border-[#D9D9D9] p-4 shadow-subtle flex flex-col justify-between">
            <span className="font-figtree text-[11px] font-bold uppercase tracking-wider text-[#707980]">
              Ações Concluídas / Total
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="font-montserrat text-3xl md:text-4xl font-bold text-[#111213] tracking-[-1px]">
                {loading ? '-' : concluidasHoje}
              </span>
              <span className="font-figtree text-sm text-[#707980]">
                de {loading ? '-' : totalAcoes} ações
              </span>
            </div>
            <div className="mt-2 w-full h-1.5 bg-[#EAEAEA] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#1E9E5A] rounded-full"
                style={{
                  width: `${totalAcoes > 0 ? (concluidasHoje / totalAcoes) * 100 : 0}%`,
                }}
              />
            </div>
          </div>

          {/* KPI 2: Atrasadas */}
          <div className="relative bg-white rounded-[10px] border border-[#D9D9D9] p-4 shadow-subtle flex flex-col justify-between overflow-hidden">
            {totalAtrasadas > 0 && (
              <span className="absolute top-0 left-0 right-0 h-[3px] bg-[#ED1C24]" />
            )}
            <span className="font-figtree text-[11px] font-bold uppercase tracking-wider text-[#707980] flex items-center justify-between">
              <span>Atrasadas da Equipe</span>
              <AlertOctagon className="w-3.5 h-3.5 text-[#ED1C24]" />
            </span>
            <div className="mt-2">
              <span
                className={`font-montserrat text-3xl md:text-4xl font-bold tracking-[-1px] ${
                  totalAtrasadas > 0 ? 'text-[#ED1C24]' : 'text-[#111213]'
                }`}
              >
                {loading ? '-' : totalAtrasadas}
              </span>
            </div>
            <span className="font-figtree text-[11px] text-[#707980] mt-1">
              Gargalos acumulados hoje
            </span>
          </div>

          {/* KPI 3: Clientes em Queda sem Contato 7+ dias */}
          <div className="bg-white rounded-[10px] border border-[#D9D9D9] p-4 shadow-subtle flex flex-col justify-between">
            <span className="font-figtree text-[11px] font-bold uppercase tracking-wider text-[#707980] flex items-center justify-between">
              <span>Queda s/ Contato (7+ dias)</span>
              <TrendingDown className="w-3.5 h-3.5 text-[#ED1C24]" />
            </span>
            <div className="mt-2">
              <span className="font-montserrat text-3xl md:text-4xl font-bold text-[#ED1C24] tracking-[-1px]">
                {loading ? '-' : clientesQuedaSemContato.length}
              </span>
            </div>
            <span className="font-figtree text-[11px] text-[#707980] mt-1">
              Distribuidores em risco crítico
            </span>
          </div>

          {/* KPI 4: Alertas Abertos */}
          <div className="bg-white rounded-[10px] border border-[#D9D9D9] p-4 shadow-subtle flex flex-col justify-between">
            <span className="font-figtree text-[11px] font-bold uppercase tracking-wider text-[#707980] flex items-center justify-between">
              <span>Alertas Abertos</span>
              <Bell className="w-3.5 h-3.5 text-[#E8A317]" />
            </span>
            <div className="mt-2">
              <span className="font-montserrat text-3xl md:text-4xl font-bold text-[#111213] tracking-[-1px]">
                {loading ? '-' : alertasAbertos.length}
              </span>
            </div>
            <span className="font-figtree text-[11px] text-[#707980] mt-1">
              Exigem decisão da gestão
            </span>
          </div>
        </div>

        {/* QUADRO POR VENDEDOR EM CARTÕES */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-figtree text-xs font-bold uppercase tracking-[0.06em] text-[#707980]">
              DESEMPENHO POR VENDEDOR ({vendedores.length})
            </h2>
            <span className="text-[11px] font-figtree text-[#707980]">
              Clique em um cartão para inspecionar as ações daquele vendedor
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {metricasVendedores.map((m) => {
              const isSelected = vendedorSelecionado?.id === m.vendedor.id
              return (
                <div
                  key={m.vendedor.id}
                  onClick={() => setVendedorSelecionado(m.vendedor)}
                  className={`bg-white rounded-[10px] border p-4 shadow-subtle transition-all cursor-pointer select-none relative overflow-hidden ${
                    isSelected
                      ? 'border-[#ED1C24] ring-2 ring-[#ED1C24]/20 shadow-md'
                      : 'border-[#D9D9D9] hover:border-[#111213]'
                  }`}
                >
                  {/* Faixa lateral indicando seleção */}
                  {isSelected && (
                    <span className="absolute left-0 top-0 bottom-0 w-1 bg-[#ED1C24]" />
                  )}

                  {/* Topo do Cartão: Avatar + Nome + Código */}
                  <div className="flex items-center gap-3">
                    {m.vendedor.avatar_url ? (
                      <img
                        src={m.vendedor.avatar_url}
                        alt={m.vendedor.nome}
                        className="w-10 h-10 rounded-full object-cover border border-[#D9D9D9]"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-[#111213] text-white flex items-center justify-center font-bold text-xs font-montserrat">
                        {m.vendedor.nome.substring(0, 2).toUpperCase()}
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <h3 className="font-montserrat text-sm font-bold text-[#111213] truncate">
                        {m.vendedor.nome}
                      </h3>
                      <p className="font-figtree text-[11px] text-[#707980] truncate">
                        {m.vendedor.codigo_vendedor_focco || 'Vendedor Sly'}
                      </p>
                    </div>
                  </div>

                  {/* Barra de Progresso do Dia */}
                  <div className="mt-4 space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-figtree">
                      <span className="text-[#707980]">Progresso do dia</span>
                      <strong className="text-[#111213]">{m.pctProgresso}%</strong>
                    </div>
                    <div className="w-full h-1.5 bg-[#EAEAEA] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#ED1C24] transition-all duration-300 rounded-full"
                        style={{ width: `${m.pctProgresso}%` }}
                      />
                    </div>
                  </div>

                  {/* Indicadores em Grade 2x2 */}
                  <div className="mt-4 pt-3 border-t border-[#D9D9D9]/70 grid grid-cols-2 gap-2 text-xs font-figtree">
                    <div className="p-2 rounded bg-[#F6F6F6]">
                      <span className="text-[10px] text-[#707980] uppercase block font-bold">
                        Atrasadas
                      </span>
                      <span
                        className={`font-montserrat font-bold text-sm ${
                          m.atrasadas > 0 ? 'text-[#ED1C24]' : 'text-[#111213]'
                        }`}
                      >
                        {m.atrasadas}
                      </span>
                    </div>

                    <div className="p-2 rounded bg-[#F6F6F6]">
                      <span className="text-[10px] text-[#707980] uppercase block font-bold">
                        Queda s/ contato
                      </span>
                      <span
                        className={`font-montserrat font-bold text-sm ${
                          m.quedaSemContato > 0 ? 'text-[#ED1C24]' : 'text-[#111213]'
                        }`}
                      >
                        {m.quedaSemContato}
                      </span>
                    </div>
                  </div>

                  {/* Rodapé do Cartão */}
                  <div className="mt-3 flex items-center justify-between text-[11px] text-[#707980]">
                    <span>{m.concluidas} concluídas</span>
                    <span className="font-semibold text-[#111213] flex items-center gap-0.5">
                      Ver ações <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* DETALHE: AÇÕES DO VENDEDOR SELECIONADO */}
        {vendedorSelecionado && (
          <section className="bg-white rounded-[10px] border border-[#D9D9D9] p-5 shadow-subtle space-y-4 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#D9D9D9]/70 pb-3">
              <div>
                <h3 className="font-montserrat text-base font-bold text-[#111213]">
                  Ações Atribuídas: {vendedorSelecionado.nome}
                </h3>
                <p className="font-figtree text-xs text-[#707980]">
                  Gerenciamento e reatribuição de oportunidades para equilíbrio da equipe.
                </p>
              </div>

              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-figtree font-bold bg-[#F6F6F6] text-[#111213] border border-[#D9D9D9]">
                {acoesVendedorSelecionado.length} ações no vendedor
              </span>
            </div>

            {acoesVendedorSelecionado.length === 0 ? (
              <p className="font-figtree text-xs text-[#707980] italic py-4 text-center">
                Este vendedor não possui ações cadastradas no momento.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-figtree">
                  <thead className="bg-[#F6F6F6] text-[#707980] border-b border-[#D9D9D9]">
                    <tr>
                      <th className="py-2.5 px-3 font-bold uppercase">Cliente</th>
                      <th className="py-2.5 px-3 font-bold uppercase">Tipo & Título</th>
                      <th className="py-2.5 px-3 font-bold uppercase text-right">Valor em Risco</th>
                      <th className="py-2.5 px-3 font-bold uppercase text-center">Prevista</th>
                      <th className="py-2.5 px-3 font-bold uppercase text-center">Situação</th>
                      <th className="py-2.5 px-3 text-right">Ação Rápida</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#D9D9D9]/70">
                    {acoesVendedorSelecionado.map((a) => (
                      <tr key={a.id} className="hover:bg-[#F6F6F6]/50">
                        <td className="py-2.5 px-3 font-bold text-[#111213]">
                          {a.cliente?.nome_fantasia || 'Cliente'}
                        </td>
                        <td className="py-2.5 px-3">
                          <div className="font-semibold text-[#111213]">{a.titulo}</div>
                          <div className="text-[11px] text-[#707980] truncate max-w-sm">
                            {a.motivo}
                          </div>
                        </td>
                        <td className="py-2.5 px-3 text-right font-montserrat font-bold text-[#ED1C24]">
                          {a.valor_em_risco > 0 ? formatCurrency(a.valor_em_risco) : '-'}
                        </td>
                        <td className="py-2.5 px-3 text-center text-[#707980]">
                          {a.data_prevista}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              a.situacao === 'concluida'
                                ? 'bg-[#1E9E5A]/10 text-[#1E9E5A]'
                                : 'bg-[#ED1C24]/10 text-[#ED1C24]'
                            }`}
                          >
                            {a.situacao}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <button
                            onClick={() => {
                              setAcaoParaReatribuir(a)
                              setModalReatribuirOpen(true)
                            }}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-[6px] border border-[#D9D9D9] hover:bg-white text-[11px] font-semibold text-[#111213] transition-colors"
                          >
                            <ArrowRightLeft className="w-3.5 h-3.5 text-[#707980]" />
                            Reatribuir
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {/* LISTA DE ALERTAS ABERTOS COM AÇÕES RÁPIDAS: "Reatribuir", "Assumir", "Marcar como resolvido" */}
        <section className="bg-white rounded-[10px] border border-[#D9D9D9] p-5 shadow-subtle space-y-4">
          <div className="flex items-center justify-between border-b border-[#D9D9D9]/70 pb-3">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-[#ED1C24]" />
              <h3 className="font-montserrat text-base font-bold text-[#111213]">
                Alertas Abertos da Operação ({alertasAbertos.length})
              </h3>
            </div>
            <span className="font-figtree text-xs text-[#707980]">
              Notificações de quedas de clientes, lotes CD e metas
            </span>
          </div>

          {alertasAbertos.length === 0 ? (
            <p className="font-figtree text-xs text-[#707980] italic py-4 text-center">
              Nenhum alerta aberto no momento. Todos os avisos da supervisão foram resolvidos.
            </p>
          ) : (
            <div className="space-y-3">
              {alertasAbertos.map((alt) => (
                <div
                  key={alt.id}
                  className="p-3.5 rounded-[8px] bg-[#F6F6F6] border border-[#D9D9D9] flex flex-col md:flex-row md:items-center justify-between gap-3"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-figtree text-xs font-bold text-[#111213]">
                        {alt.referencia || 'Alerta do Sistema'}
                      </span>
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-bold uppercase tracking-wider bg-[#ED1C24]/10 text-[#ED1C24]">
                        {alt.tipo.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="font-figtree text-xs text-[#707980]">{alt.mensagem}</p>
                  </div>

                  {/* Três Ações Rápidas */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Reatribuir */}
                    <button
                      onClick={() => {
                        // Localiza uma ação compatível ou reatribui
                        setModalReatribuirOpen(true)
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] border border-[#D9D9D9] bg-white hover:bg-[#F6F6F6] text-xs font-figtree font-semibold text-[#111213] transition-colors"
                    >
                      <ArrowRightLeft className="w-3.5 h-3.5 text-[#707980]" />
                      Reatribuir
                    </button>

                    {/* Assumir */}
                    <button
                      onClick={() => handleAssumirAlerta(alt)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] border border-[#3B82F6]/30 bg-[#3B82F6]/10 hover:bg-[#3B82F6]/20 text-xs font-figtree font-semibold text-[#3B82F6] transition-colors"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      Assumir
                    </button>

                    {/* Marcar como Resolvido */}
                    <button
                      onClick={() => handleResolverAlerta(alt.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] bg-[#1E9E5A] hover:bg-[#18854b] text-white text-xs font-figtree font-bold transition-all shadow-xs"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Marcar como resolvido
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* MODAL REATRIBUIR */}
        <ModalReatribuir
          open={modalReatribuirOpen}
          onClose={() => {
            setModalReatribuirOpen(false)
            setAcaoParaReatribuir(null)
          }}
          vendedores={vendedores}
          acao={acaoParaReatribuir}
          onSuccess={carregarDados}
        />
      </div>
    </RoleGuard>
  )
}
