import React, { useState, useEffect, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  MessageCircle,
  Phone,
  Video,
  Mail,
  MapPin,
  Calendar,
  DollarSign,
  Plus,
  Clock,
  Layers,
  CheckCircle2,
  AlertTriangle,
  User,
  Building,
  TrendingDown,
  TrendingUp,
  Filter,
  ExternalLink,
} from 'lucide-react'
import { RoleGuard } from '@/components/RoleGuard'
import { StatusBadge } from '@/components/StatusBadge'
import { EmptyState } from '@/components/EmptyState'
import { ModalRegistrarContato } from '@/components/ModalRegistrarContato'
import { ModalNovaAcao } from '@/components/ModalNovaAcao'
import {
  getClienteById,
  getContatosByCliente,
  getFaturamentoByCliente,
  getInteracoesByCliente,
  getAcoes,
  getAlertas,
  getClientes,
  formatCurrency,
  formatDateBR,
  formatDateTimeBR,
} from '@/services/crm'
import {
  Cliente,
  Contato,
  FaturamentoMensal,
  Interacao,
  Acao,
  Alerta,
  FamiliaProduto,
} from '@/types/crm'
import { useAuth } from '@/contexts/AuthContext'

export default function FichaClientePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { perfil } = useAuth()

  const [cliente, setCliente] = useState<Cliente | null>(null)
  const [contatos, setContatos] = useState<Contato[]>([])
  const [faturamento, setFaturamento] = useState<FaturamentoMensal[]>([])
  const [interacoes, setInteracoes] = useState<Interacao[]>([])
  const [acoes, setAcoes] = useState<Acao[]>([])
  const [alertas, setAlertas] = useState<Alerta[]>([])
  const [todosClientes, setTodosClientes] = useState<Cliente[]>([])
  const [loading, setLoading] = useState(true)

  // Gráfico: Toggle entre R$ e peças
  const [modoGrafico, setModoGrafico] = useState<'valor' | 'pecas'>('valor')

  // Filtro de linha do tempo por canal
  const [filtroCanal, setFiltroCanal] = useState<string>('todos')

  // Modais
  const [modalContatoOpen, setModalContatoOpen] = useState(false)
  const [modalAcaoOpen, setModalAcaoOpen] = useState(false)

  const carregarDados = async () => {
    if (!id) return
    setLoading(true)
    try {
      const [
        clienteData,
        contatosData,
        faturamentoData,
        interacoesData,
        acoesData,
        alertasData,
        clientesLista,
      ] = await Promise.all([
        getClienteById(id),
        getContatosByCliente(id),
        getFaturamentoByCliente(id),
        getInteracoesByCliente(id),
        getAcoes(),
        getAlertas(),
        getClientes(),
      ])

      setCliente(clienteData)
      setContatos(contatosData)
      setFaturamento(faturamentoData)
      setInteracoes(interacoesData)
      setAcoes(acoesData.filter((a) => a.cliente_id === id))
      setAlertas(alertasData.filter((a) => a.referencia === clienteData?.nome_fantasia))
      setTodosClientes(clientesLista)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    carregarDados()
  }, [id])

  // Ações abertas deste cliente
  const acoesAbertas = useMemo(() => acoes.filter((a) => a.situacao === 'aberta'), [acoes])

  // Agrupamento do Mix de Produtos por Família
  const mixProdutos = useMemo(() => {
    const familias: { id: FamiliaProduto; label: string }[] = [
      { id: 'pistao_leve', label: 'Pistão Leve (Flex/Gasolina)' },
      { id: 'pistao_pesada', label: 'Pistão Pesada (Diesel)' },
      { id: 'pistao_jogos', label: 'Pistão em Jogos c/ Anéis' },
      { id: 'pca', label: 'PCA (Conjuntos Automotivos)' },
      { id: 'kpm', label: 'KPM (Kits Motores Prontos)' },
      { id: 'pino', label: 'Pinos de Pistão Reforçados' },
    ]

    const totalFaturadoGeral = faturamento.reduce((acc, curr) => acc + Number(curr.valor || 0), 0)

    return familias.map((f) => {
      const itensFamilia = faturamento.filter((fat) => fat.familia === f.id)
      const totalValor = itensFamilia.reduce((acc, curr) => acc + Number(curr.valor || 0), 0)
      const totalPecas = itensFamilia.reduce((acc, curr) => acc + Number(curr.pecas || 0), 0)

      // Último mês com compra dessa família
      const mesesComCompra = itensFamilia
        .filter((fat) => Number(fat.valor) > 0)
        .sort((a, b) => b.mes.localeCompare(a.mes))

      const ultimaCompraFamilia = mesesComCompra[0]?.mes || null
      const participacaoPct = totalFaturadoGeral > 0 ? (totalValor / totalFaturadoGeral) * 100 : 0

      // Considera abandonada se não tem compra nos últimos 6 meses
      const isAbandonada =
        !mesesComCompra[0] ||
        (mesesComCompra[0] && itensFamilia.length > 0 && Number(mesesComCompra[0].valor) === 0)

      return {
        familiaId: f.id,
        label: f.label,
        totalValor,
        totalPecas,
        participacaoPct,
        ultimaCompra: ultimaCompraFamilia,
        status: participacaoPct > 2 ? 'Ativa' : 'Abandonada',
      }
    })
  }, [faturamento])

  // Dados dos 24 meses ordenados cronologicamente
  const dados24Meses = useMemo(() => {
    // Agrupa faturamento por mês
    const mapaMes: Record<string, { mes: string; valor: number; pecas: number }> = {}

    faturamento.forEach((f) => {
      if (!mapaMes[f.mes]) {
        mapaMes[f.mes] = { mes: f.mes, valor: 0, pecas: 0 }
      }
      mapaMes[f.mes].valor += Number(f.valor || 0)
      mapaMes[f.mes].pecas += Number(f.pecas || 0)
    })

    const lista = Object.values(mapaMes).sort((a, b) => a.mes.localeCompare(b.mes))
    return lista
  }, [faturamento])

  // Valores máximos do gráfico para normalização da escala
  const maxGrafico = useMemo(() => {
    if (dados24Meses.length === 0) return 1
    const valores = dados24Meses.map((d) => (modoGrafico === 'valor' ? d.valor : d.pecas))
    return Math.max(...valores, 1)
  }, [dados24Meses, modoGrafico])

  // Média 6M para a linha tracejada no gráfico
  const mediaTracejada = useMemo(() => {
    if (!cliente) return 0
    if (modoGrafico === 'valor') {
      return Number(cliente.media_mensal_6m) || 0
    }
    // estimativa de peças média 6m
    return Math.round((Number(cliente.media_mensal_6m) || 0) / 55)
  }, [cliente, modoGrafico])

  // Formatação de mês abreviado (ex: "Jan/25")
  const formatMesCurto = (mesIso: string) => {
    if (!mesIso) return ''
    const [y, m] = mesIso.split('-')
    const meses = [
      'Jan',
      'Fev',
      'Mar',
      'Abr',
      'Mai',
      'Jun',
      'Jul',
      'Ago',
      'Set',
      'Out',
      'Nov',
      'Dez',
    ]
    const idx = parseInt(m, 10) - 1
    return `${meses[idx]}/${y.slice(2)}`
  }

  // Interações filtradas por canal
  const interacoesFiltradas = useMemo(() => {
    if (filtroCanal === 'todos') return interacoes
    return interacoes.filter((i) => i.canal === filtroCanal)
  }, [interacoes, filtroCanal])

  if (loading) {
    return (
      <div className="space-y-6 pb-20 animate-fade-in">
        <div className="h-40 bg-[#111213] rounded-[10px] animate-pulse" />
        <div className="grid grid-cols-6 gap-3">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-20 bg-white rounded-[10px] border border-[#D9D9D9] animate-pulse"
            />
          ))}
        </div>
      </div>
    )
  }

  if (!cliente) {
    return (
      <div className="p-12 text-center bg-white rounded-[10px] border border-[#D9D9D9]">
        <EmptyState
          icon={<Building className="w-8 h-8 text-[#2C3E50]" />}
          title="Distribuidor não localizado"
          description="O cliente solicitado não existe na base da Central Sly."
          action={{
            label: 'Voltar para a Carteira',
            onClick: () => navigate('/carteira'),
          }}
        />
      </div>
    )
  }

  const contatoPrincipal = contatos.find((c) => c.principal) || contatos[0]
  const telefoneLimpo = (contatoPrincipal?.telefone || '').replace(/\D/g, '') || '5554991248821'
  const whatsappUrl = `https://wa.me/${telefoneLimpo}?text=Ol%C3%A1+${encodeURIComponent(
    contatoPrincipal?.nome || '',
  )}%2C+sou+da+Sly+Parts.`

  return (
    <RoleGuard allowedRoles={['vendedor', 'supervisora', 'diretoria']}>
      <div className="space-y-6 pb-24 md:pb-8 animate-fade-in">
        {/* BOTÃO VOLTAR */}
        <button
          onClick={() => navigate('/carteira')}
          className="inline-flex items-center gap-2 text-xs font-figtree font-semibold text-[#707980] hover:text-[#111213] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para a Carteira
        </button>

        {/* CABEÇALHO LARGO EM GRAFITE #111213 COM NOME EM BRANCO (Montserrat 700 28px) */}
        <div className="bg-[#111213] text-white rounded-[10px] p-6 shadow-md border border-[#202020] flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Lado Esquerdo: Identificação 360° */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-montserrat text-2xl md:text-3xl font-bold tracking-tight text-white">
                {cliente.nome_fantasia}
              </h1>
              <StatusBadge situacao={cliente.situacao_comercial} />
            </div>

            <p className="font-figtree text-xs text-[#A0A0A0]">
              {cliente.razao_social} • CNPJ: {cliente.cnpj}
            </p>

            <div className="flex flex-wrap items-center gap-3 text-xs font-figtree text-[#A0A0A0] pt-1">
              <span className="px-2 py-0.5 rounded bg-[#202020] text-white font-mono font-bold">
                {cliente.codigo_focco}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#ED1C24]" />
                {cliente.cidade} / {cliente.uf}
              </span>
              <span>•</span>
              <span className="capitalize">Mercado: {cliente.mercado.replace('_', ' ')}</span>
              <span>•</span>
              <span>
                Vendedor:{' '}
                <strong className="text-white">{cliente.vendedor?.nome || 'Carlos Eduardo'}</strong>
              </span>
            </div>
          </div>

          {/* Lado Direito: Ações rápidas */}
          <div className="flex items-center gap-2.5 flex-wrap">
            {/* WhatsApp */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-[8px] bg-[#1E9E5A] hover:bg-[#18854b] text-white text-xs font-figtree font-semibold transition-colors shadow-xs"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp
            </a>

            {/* Registrar Contato */}
            <button
              onClick={() => setModalContatoOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-[8px] bg-white/10 hover:bg-white/20 text-white text-xs font-figtree font-semibold transition-colors border border-white/20"
            >
              <Phone className="w-4 h-4" />
              Registrar contato
            </button>

            {/* Nova Ação (Vermelho) */}
            <button
              onClick={() => setModalAcaoOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-[8px] bg-[#ED1C24] hover:bg-[#C8141B] text-white text-xs font-figtree font-bold transition-all shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Nova ação
            </button>
          </div>
        </div>

        {/* LINHA DE 6 KPIS DO CLIENTE */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* KPI 1: Média 6M */}
          <div className="bg-white rounded-[10px] border border-[#D9D9D9] p-3.5 shadow-subtle flex flex-col justify-between">
            <span className="font-figtree text-[10px] font-bold uppercase tracking-wider text-[#707980]">
              Média 6 Meses
            </span>
            <span className="font-montserrat text-lg font-bold text-[#111213] mt-1 truncate">
              {formatCurrency(cliente.media_mensal_6m)}
            </span>
            <span className="text-[10px] font-figtree text-[#707980] mt-0.5">Média móvel</span>
          </div>

          {/* KPI 2: Média Recente */}
          <div className="bg-white rounded-[10px] border border-[#D9D9D9] p-3.5 shadow-subtle flex flex-col justify-between">
            <span className="font-figtree text-[10px] font-bold uppercase tracking-wider text-[#707980]">
              Média Recente
            </span>
            <span className="font-montserrat text-lg font-bold text-[#111213] mt-1 truncate">
              {formatCurrency(cliente.media_recente)}
            </span>
            <span className="text-[10px] font-figtree text-[#707980] mt-0.5">Últimos 60 dias</span>
          </div>

          {/* KPI 3: Variação */}
          <div className="bg-white rounded-[10px] border border-[#D9D9D9] p-3.5 shadow-subtle flex flex-col justify-between">
            <span className="font-figtree text-[10px] font-bold uppercase tracking-wider text-[#707980]">
              Variação %
            </span>
            <span
              className={`font-montserrat text-lg font-bold mt-1 ${
                Number(cliente.variacao_pct) < 0 ? 'text-[#ED1C24]' : 'text-[#1E9E5A]'
              }`}
            >
              {Number(cliente.variacao_pct) > 0 ? '+' : ''}
              {cliente.variacao_pct}%
            </span>
            <span className="text-[10px] font-figtree text-[#707980] mt-0.5">Comparativo 6M</span>
          </div>

          {/* KPI 4: Ticket Médio */}
          <div className="bg-white rounded-[10px] border border-[#D9D9D9] p-3.5 shadow-subtle flex flex-col justify-between">
            <span className="font-figtree text-[10px] font-bold uppercase tracking-wider text-[#707980]">
              Ticket Médio
            </span>
            <span className="font-montserrat text-lg font-bold text-[#111213] mt-1 truncate">
              {formatCurrency(cliente.ticket_medio)}
            </span>
            <span className="text-[10px] font-figtree text-[#707980] mt-0.5">Por faturamento</span>
          </div>

          {/* KPI 5: Dias sem compra */}
          <div className="bg-white rounded-[10px] border border-[#D9D9D9] p-3.5 shadow-subtle flex flex-col justify-between">
            <span className="font-figtree text-[10px] font-bold uppercase tracking-wider text-[#707980]">
              Dias sem compra
            </span>
            <span
              className={`font-montserrat text-lg font-bold mt-1 ${
                cliente.dias_sem_compra > cliente.intervalo_medio_dias
                  ? 'text-[#ED1C24]'
                  : 'text-[#111213]'
              }`}
            >
              {cliente.dias_sem_compra} dias
            </span>
            <span className="text-[10px] font-figtree text-[#707980] mt-0.5">
              Última: {formatDateBR(cliente.ultima_compra)}
            </span>
          </div>

          {/* KPI 6: Intervalo Médio */}
          <div className="bg-white rounded-[10px] border border-[#D9D9D9] p-3.5 shadow-subtle flex flex-col justify-between">
            <span className="font-figtree text-[10px] font-bold uppercase tracking-wider text-[#707980]">
              Intervalo Médio
            </span>
            <span className="font-montserrat text-lg font-bold text-[#111213] mt-1">
              {cliente.intervalo_medio_dias} dias
            </span>
            <span className="text-[10px] font-figtree text-[#707980] mt-0.5">Ciclo habitual</span>
          </div>
        </div>

        {/* GRÁFICO DE FATURAMENTO MENSAL DE 24 MESES */}
        <div className="bg-white rounded-[10px] border border-[#D9D9D9] p-5 shadow-subtle space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#D9D9D9]/70 pb-3">
            <div>
              <h2 className="font-montserrat text-base font-bold text-[#111213]">
                Faturamento Mensal (Histórico de 24 Meses)
              </h2>
              <p className="font-figtree text-xs text-[#707980]">
                Barras em ardósia #2C3E50, mês atual em vermelho #ED1C24 e linha tracejada teal
                #86B0B6 com a média 6m.
              </p>
            </div>

            {/* Toggle R$ vs Peças */}
            <div className="flex items-center gap-1 bg-[#F6F6F6] p-1 rounded-[8px] border border-[#D9D9D9] self-start sm:self-auto">
              <button
                onClick={() => setModoGrafico('valor')}
                className={`px-3 py-1 text-xs font-figtree font-bold rounded-[6px] transition-all ${
                  modoGrafico === 'valor'
                    ? 'bg-[#111213] text-white shadow-xs'
                    : 'text-[#707980] hover:text-[#111213]'
                }`}
              >
                Faturamento (R$)
              </button>
              <button
                onClick={() => setModoGrafico('pecas')}
                className={`px-3 py-1 text-xs font-figtree font-bold rounded-[6px] transition-all ${
                  modoGrafico === 'pecas'
                    ? 'bg-[#111213] text-white shadow-xs'
                    : 'text-[#707980] hover:text-[#111213]'
                }`}
              >
                Volume (Peças)
              </button>
            </div>
          </div>

          {/* Gráfico de Barras Customizado */}
          <div className="relative pt-6 pb-2">
            {/* Linha tracejada teal #86B0B6 da média 6m */}
            {mediaTracejada > 0 && maxGrafico > 0 && (
              <div
                className="absolute left-0 right-0 border-t-2 border-dashed border-[#86B0B6] z-10 pointer-events-none"
                style={{
                  bottom: `${Math.min(90, Math.max(10, (mediaTracejada / maxGrafico) * 160))}px`,
                }}
              >
                <span className="absolute right-0 -top-4 font-figtree font-bold text-[10px] text-[#86B0B6] bg-white px-1">
                  Média 6M (
                  {modoGrafico === 'valor'
                    ? formatCurrency(mediaTracejada)
                    : `${mediaTracejada} pçs`}
                  )
                </span>
              </div>
            )}

            {/* Barras dos 24 meses */}
            <div className="flex items-end justify-between gap-1 sm:gap-2 h-48 overflow-x-auto pt-4 px-2">
              {dados24Meses.map((d, index) => {
                const valorAtual = modoGrafico === 'valor' ? d.valor : d.pecas
                const pctAltura = Math.min(100, Math.max(4, (valorAtual / maxGrafico) * 100))
                const isMesAtual = index === dados24Meses.length - 1
                const barColor = isMesAtual ? 'bg-[#ED1C24]' : 'bg-[#2C3E50]'

                return (
                  <div
                    key={d.mes}
                    className="flex-1 min-w-[20px] flex flex-col items-center h-full justify-end group relative"
                  >
                    {/* Tooltip Hover */}
                    <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-[#111213] text-white text-[10px] font-figtree py-1 px-2 rounded shadow-md pointer-events-none whitespace-nowrap z-20">
                      <strong>{formatMesCurto(d.mes)}</strong>:{' '}
                      {modoGrafico === 'valor' ? formatCurrency(d.valor) : `${d.pecas} pçs`}
                    </div>

                    {/* Barra */}
                    <div
                      className={`w-full max-w-[26px] rounded-t-[4px] transition-all duration-300 ${barColor} group-hover:opacity-80`}
                      style={{ height: `${pctAltura}%` }}
                    />

                    {/* Rótulo do Mês */}
                    <span className="text-[9px] font-figtree text-[#707980] mt-1.5 truncate transform sm:rotate-0 -rotate-45 sm:transform-none select-none">
                      {formatMesCurto(d.mes)}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* MIX DE PRODUTOS */}
        <div className="bg-white rounded-[10px] border border-[#D9D9D9] p-5 shadow-subtle space-y-4">
          <div className="flex items-center justify-between border-b border-[#D9D9D9]/70 pb-3">
            <div>
              <h2 className="font-montserrat text-base font-bold text-[#111213]">
                Mix de Produtos
              </h2>
              <p className="font-figtree text-xs text-[#707980]">
                Desempenho por família e participação no faturamento histórico.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-figtree">
              <thead className="bg-[#F6F6F6] text-[#707980] border-b border-[#D9D9D9]">
                <tr>
                  <th className="py-2.5 px-3 font-bold uppercase">Família de Produto</th>
                  <th className="py-2.5 px-3 font-bold uppercase text-right">Faturado Total</th>
                  <th className="py-2.5 px-3 font-bold uppercase text-right">Peças</th>
                  <th className="py-2.5 px-4 font-bold uppercase">Participação (%)</th>
                  <th className="py-2.5 px-3 font-bold uppercase text-center">Última Compra</th>
                  <th className="py-2.5 px-3 font-bold uppercase text-center">Situação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D9D9D9]/70">
                {mixProdutos.map((item) => (
                  <tr key={item.familiaId} className="hover:bg-[#F6F6F6]/50">
                    <td className="py-2.5 px-3 font-bold text-[#111213]">{item.label}</td>
                    <td className="py-2.5 px-3 text-right font-montserrat font-semibold">
                      {formatCurrency(item.totalValor)}
                    </td>
                    <td className="py-2.5 px-3 text-right text-[#707980]">
                      {item.totalPecas.toLocaleString('pt-BR')} un
                    </td>
                    <td className="py-2.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-[#EAEAEA] rounded-full overflow-hidden max-w-[120px]">
                          <div
                            className="h-full bg-[#2C3E50] rounded-full"
                            style={{ width: `${Math.min(100, item.participacaoPct)}%` }}
                          />
                        </div>
                        <span className="font-montserrat font-bold text-[11px] text-[#111213]">
                          {item.participacaoPct.toFixed(1)}%
                        </span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-center text-[#707980]">
                      {item.ultimaCompra ? formatMesCurto(item.ultimaCompra) : 'Sem registro'}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      {item.status === 'Ativa' ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#1E9E5A]/10 text-[#1E9E5A]">
                          Ativa
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#ED1C24]/10 text-[#ED1C24]">
                          Abandonada
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* GRADE INFERIOR: COLUNA LATERAL (CONTATOS, AÇÕES, ALERTAS) + LINHA DO TEMPO */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* COLUNA LATERAL: Contatos, Ações abertas e Alertas */}
          <div className="space-y-4">
            {/* Bloco Contatos */}
            <div className="bg-white rounded-[10px] border border-[#D9D9D9] p-4 shadow-subtle space-y-3">
              <div className="flex items-center justify-between border-b border-[#D9D9D9]/70 pb-2">
                <h3 className="font-montserrat text-sm font-bold text-[#111213]">
                  Contatos ({contatos.length})
                </h3>
                <span className="text-[10px] font-figtree text-[#707980]">Compradores</span>
              </div>

              <div className="space-y-2.5">
                {contatos.map((contato) => {
                  const fone = (contato.telefone || '').replace(/\D/g, '') || '5554991248821'
                  const urlWhats = `https://wa.me/${fone}?text=Ol%C3%A1+${encodeURIComponent(
                    contato.nome,
                  )}`
                  return (
                    <div
                      key={contato.id}
                      className="p-2.5 rounded-[8px] bg-[#F6F6F6] border border-[#D9D9D9]/80 flex items-center justify-between gap-2"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-figtree text-xs font-bold text-[#111213] truncate">
                            {contato.nome}
                          </span>
                          {contato.principal && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-[#ED1C24]/10 text-[#ED1C24]">
                              Principal
                            </span>
                          )}
                        </div>
                        <p className="font-figtree text-[11px] text-[#707980] truncate">
                          {contato.cargo || 'Comprador'} • {contato.telefone || '-'}
                        </p>
                      </div>

                      {/* Botão de WhatsApp por Contato */}
                      <a
                        href={urlWhats}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-[6px] bg-[#1E9E5A] hover:bg-[#18854b] text-white transition-colors flex-shrink-0"
                        title={`Conversar com ${contato.nome}`}
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Bloco Ações Abertas */}
            <div className="bg-white rounded-[10px] border border-[#D9D9D9] p-4 shadow-subtle space-y-3">
              <div className="flex items-center justify-between border-b border-[#D9D9D9]/70 pb-2">
                <h3 className="font-montserrat text-sm font-bold text-[#111213]">
                  Ações Abertas ({acoesAbertas.length})
                </h3>
              </div>

              {acoesAbertas.length === 0 ? (
                <p className="font-figtree text-xs text-[#707980] italic py-2">
                  Nenhuma ação aberta para este distribuidor.
                </p>
              ) : (
                <div className="space-y-2">
                  {acoesAbertas.map((a) => (
                    <div
                      key={a.id}
                      className="p-2.5 rounded-[8px] border border-[#D9D9D9] hover:bg-[#F6F6F6] transition-colors text-xs font-figtree space-y-1"
                    >
                      <div className="flex items-center justify-between font-bold text-[#111213]">
                        <span>{a.titulo}</span>
                        {a.valor_em_risco > 0 && (
                          <span className="text-[#ED1C24] font-montserrat">
                            {formatCurrency(a.valor_em_risco)}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#707980] line-clamp-2">{a.motivo}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bloco Alertas */}
            <div className="bg-white rounded-[10px] border border-[#D9D9D9] p-4 shadow-subtle space-y-3">
              <h3 className="font-montserrat text-sm font-bold text-[#111213] border-b border-[#D9D9D9]/70 pb-2">
                Alertas do Cliente ({alertas.length})
              </h3>
              {alertas.length === 0 ? (
                <p className="font-figtree text-xs text-[#707980] italic py-2">
                  Nenhum alerta pendente.
                </p>
              ) : (
                <div className="space-y-2">
                  {alertas.map((alt) => (
                    <div
                      key={alt.id}
                      className="p-2.5 rounded-[8px] bg-[#ED1C24]/5 border border-[#ED1C24]/20 text-xs font-figtree text-[#ED1C24]"
                    >
                      <div className="font-bold flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Alerta Comercial</span>
                      </div>
                      <p className="text-[11px] text-[#111213] mt-1">{alt.mensagem}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* LINHA DO TEMPO: FEED VERTICAL COM ÍCONE POR CANAL */}
          <div className="lg:col-span-2 bg-white rounded-[10px] border border-[#D9D9D9] p-5 shadow-subtle space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#D9D9D9]/70 pb-3">
              <div>
                <h3 className="font-montserrat text-base font-bold text-[#111213]">
                  Linha do Tempo de Interações
                </h3>
                <p className="font-figtree text-xs text-[#707980]">
                  Histórico completo de atendimentos, visitas e cotações.
                </p>
              </div>

              {/* Filtro por Canal */}
              <div className="flex items-center gap-2">
                <Filter className="w-3.5 h-3.5 text-[#707980]" />
                <select
                  value={filtroCanal}
                  onChange={(e) => setFiltroCanal(e.target.value)}
                  className="px-2 py-1 text-xs bg-[#F6F6F6] border border-[#D9D9D9] rounded-[6px] font-figtree text-[#111213] outline-none"
                >
                  <option value="todos">Todos os canais</option>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="telefone">Telefone</option>
                  <option value="teams">Teams</option>
                  <option value="email">E-mail</option>
                  <option value="visita">Visita presencial</option>
                </select>
              </div>
            </div>

            {interacoesFiltradas.length === 0 ? (
              <div className="py-8 text-center">
                <p className="font-figtree text-xs text-[#707980] italic">
                  Nenhum registro de contato com os filtros selecionados.
                </p>
              </div>
            ) : (
              <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#D9D9D9]">
                {interacoesFiltradas.map((interacao) => {
                  let Icon = MessageCircle
                  let colorClass = 'bg-[#1E9E5A] text-white'

                  if (interacao.canal === 'telefone') {
                    Icon = Phone
                    colorClass = 'bg-[#3B82F6] text-white'
                  } else if (interacao.canal === 'teams') {
                    Icon = Video
                    colorClass = 'bg-[#6366F1] text-white'
                  } else if (interacao.canal === 'email') {
                    Icon = Mail
                    colorClass = 'bg-[#E8A317] text-white'
                  } else if (interacao.canal === 'visita') {
                    Icon = MapPin
                    colorClass = 'bg-[#ED1C24] text-white'
                  }

                  return (
                    <div key={interacao.id} className="relative group">
                      {/* Ícone no eixo da linha */}
                      <span
                        className={`absolute -left-[30px] top-0.5 w-6 h-6 rounded-full flex items-center justify-center ${colorClass} shadow-xs ring-4 ring-white`}
                      >
                        <Icon className="w-3 h-3" />
                      </span>

                      {/* Conteúdo */}
                      <div className="bg-[#F6F6F6]/60 hover:bg-[#F6F6F6] transition-colors p-3.5 rounded-[8px] border border-[#D9D9D9]/80 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-figtree text-xs font-bold text-[#111213] capitalize">
                            {interacao.canal} •{' '}
                            {interacao.direcao === 'saida' ? 'Contato Ativo' : 'Receptivo'}
                          </span>
                          <span className="font-figtree text-[11px] text-[#707980]">
                            {formatDateTimeBR(interacao.data)}
                          </span>
                        </div>

                        <p className="font-figtree text-xs text-[#111213] leading-relaxed">
                          {interacao.resumo}
                        </p>

                        <div className="pt-1 text-[10px] font-figtree text-[#707980]">
                          Registrado por:{' '}
                          <span className="font-semibold text-[#111213]">
                            {interacao.usuario?.nome || 'Equipe Comercial'}
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* MODAL REGISTRAR CONTATO */}
        <ModalRegistrarContato
          clienteId={cliente.id}
          clienteNome={cliente.nome_fantasia}
          usuarioId={perfil?.id}
          acoesAbertas={acoesAbertas}
          open={modalContatoOpen}
          onClose={() => setModalContatoOpen(false)}
          onSuccess={carregarDados}
        />

        {/* MODAL NOVA AÇÃO */}
        <ModalNovaAcao
          open={modalAcaoOpen}
          onClose={() => setModalAcaoOpen(false)}
          clientes={todosClientes}
          vendedorId={perfil?.id}
          defaultClienteId={cliente.id}
          onSuccess={carregarDados}
        />
      </div>
    </RoleGuard>
  )
}
