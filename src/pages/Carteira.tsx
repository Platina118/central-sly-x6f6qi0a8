import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Briefcase,
  Search,
  Filter,
  Download,
  ArrowUpDown,
  ArrowUpRight,
  ArrowDownRight,
  ChevronLeft,
  ChevronRight,
  UserPlus,
  Building,
  TrendingUp,
  TrendingDown,
  Layers,
  MapPin,
  ExternalLink,
} from 'lucide-react'
import { RoleGuard } from '@/components/RoleGuard'
import { StatusBadge } from '@/components/StatusBadge'
import { Sparkline } from '@/components/Sparkline'
import { EmptyState } from '@/components/EmptyState'
import { useAuth } from '@/contexts/AuthContext'
import { getClientes, getVendedores, formatCurrency, formatDateBR } from '@/services/crm'
import { Cliente, Perfil, SituacaoComercial } from '@/types/crm'

export default function CarteiraPage() {
  const navigate = useNavigate()
  const { perfil, session } = useAuth()
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [vendedores, setVendedores] = useState<Perfil[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Filtros
  const [filtroSituacao, setFiltroSituacao] = useState<SituacaoComercial | 'todos'>('todos')
  const [filtroVendedor, setFiltroVendedor] = useState<string>('todos')
  const [filtroUf, setFiltroUf] = useState<string>('todos')
  const [filtroMercado, setFiltroMercado] = useState<string>('todos')
  const [buscaTexto, setBuscaTexto] = useState<string>('')

  // Ordenação
  const [sortColumn, setSortColumn] = useState<keyof Cliente>('media_mensal_6m')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')

  // Paginação
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 10

  const isGestao = ['supervisora', 'diretoria', 'admin'].includes(perfil?.papel || '')

  useEffect(() => {
    async function carregar() {
      setLoading(true)
      setErrorMessage(null)
      try {
        if (!session) {
          setErrorMessage('Sessão expirada ou não autenticada. Faça login novamente.')
          setLoading(false)
          return
        }

        const [listaClientes, listaVendedores] = await Promise.all([getClientes(), getVendedores()])
        setClientes(listaClientes)
        setVendedores(listaVendedores)
      } catch (err) {
        console.error('Erro ao carregar Carteira:', err)
        setErrorMessage('Erro ao carregar a carteira. Verifique suas permissões.')
      } finally {
        setLoading(false)
      }
    }
    carregar()
  }, [session?.user?.id])

  // Contagem por situação para as pills de resumo
  const contagens = useMemo(() => {
    const counts = {
      todos: clientes.length,
      ativo: 0,
      atencao: 0,
      queda: 0,
      inativo: 0,
    }
    clientes.forEach((c) => {
      if (counts[c.situacao_comercial] !== undefined) {
        counts[c.situacao_comercial]++
      }
    })
    return counts
  }, [clientes])

  // Filtragem dos dados
  const clientesFiltrados = useMemo(() => {
    return clientes.filter((c) => {
      // Se for vendedor puro (não gestão), vê somente os seus
      if (!isGestao && perfil?.id && c.vendedor_id !== perfil.id) {
        return false
      }

      if (filtroSituacao !== 'todos' && c.situacao_comercial !== filtroSituacao) {
        return false
      }

      if (filtroVendedor !== 'todos' && c.vendedor_id !== filtroVendedor) {
        return false
      }

      if (filtroUf !== 'todos' && c.uf !== filtroUf) {
        return false
      }

      if (filtroMercado !== 'todos' && c.mercado !== filtroMercado) {
        return false
      }

      if (buscaTexto.trim()) {
        const termo = buscaTexto.toLowerCase()
        const matchNome = c.nome_fantasia.toLowerCase().includes(termo)
        const matchRazao = c.razao_social.toLowerCase().includes(termo)
        const matchCod = c.codigo_focco.toLowerCase().includes(termo)
        const matchCnpj = c.cnpj.toLowerCase().includes(termo)
        const matchCidade = c.cidade.toLowerCase().includes(termo)
        if (!matchNome && !matchRazao && !matchCod && !matchCnpj && !matchCidade) {
          return false
        }
      }

      return true
    })
  }, [
    clientes,
    filtroSituacao,
    filtroVendedor,
    filtroUf,
    filtroMercado,
    buscaTexto,
    isGestao,
    perfil,
  ])

  // Ordenação
  const clientesOrdenados = useMemo(() => {
    const list = [...clientesFiltrados]
    list.sort((a, b) => {
      let aVal = a[sortColumn]
      let bVal = b[sortColumn]

      if (aVal === null || aVal === undefined) return 1
      if (bVal === null || bVal === undefined) return -1

      if (typeof aVal === 'string') {
        return sortDirection === 'asc'
          ? (aVal as string).localeCompare(bVal as string)
          : (bVal as string).localeCompare(aVal as string)
      }

      return sortDirection === 'asc' ? Number(aVal) - Number(bVal) : Number(bVal) - Number(aVal)
    })
    return list
  }, [clientesFiltrados, sortColumn, sortDirection])

  // Paginação
  const totalPages = Math.ceil(clientesOrdenados.length / pageSize) || 1
  const clientesPaginados = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return clientesOrdenados.slice(start, start + pageSize)
  }, [clientesOrdenados, currentPage, pageSize])

  const handleSort = (column: keyof Cliente) => {
    if (sortColumn === column) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortColumn(column)
      setSortDirection('desc')
    }
    setCurrentPage(1)
  }

  // Bloco Top Clientes por UF
  const topClientesPorUf = useMemo(() => {
    const ufs = Array.from(new Set(clientes.map((c) => c.uf))).sort()
    const result: { uf: string; clientes: Cliente[] }[] = []

    ufs.forEach((uf) => {
      const doEstado = clientes
        .filter((c) => c.uf === uf)
        .sort((a, b) => Number(b.media_mensal_6m) - Number(a.media_mensal_6m))
        .slice(0, 3)

      if (doEstado.length > 0) {
        result.push({ uf, clientes: doEstado })
      }
    })

    return result
  }, [clientes])

  // Gerador determinístico de histórico 12m para sparkline baseado na média
  const getClientSparklineData = (c: Cliente): number[] => {
    const base = Number(c.media_mensal_6m) || 10000
    const varFactor = Number(c.variacao_pct) / 100
    // 12 meses
    return [
      base * 0.95,
      base * 0.98,
      base * 1.02,
      base * 0.97,
      base * 1.05,
      base * 1.0,
      base * 0.92,
      base * 0.94,
      base * (1 + varFactor * 0.4),
      base * (1 + varFactor * 0.6),
      base * (1 + varFactor * 0.8),
      Number(c.media_recente) || base * (1 + varFactor),
    ]
  }

  const exportarCsv = () => {
    const headers = [
      'Código Focco',
      'Nome Fantasia',
      'Razão Social',
      'CNPJ',
      'Cidade',
      'UF',
      'Mercado',
      'Situação Comercial',
      'Média 6M (R$)',
      'Média Recente (R$)',
      'Variação (%)',
      'Dias sem Compra',
    ]

    const rows = clientesOrdenados.map((c) => [
      c.codigo_focco,
      `"${c.nome_fantasia}"`,
      `"${c.razao_social}"`,
      c.cnpj,
      c.cidade,
      c.uf,
      c.mercado,
      c.situacao_comercial,
      c.media_mensal_6m,
      c.media_recente,
      c.variacao_pct,
      c.dias_sem_compra,
    ])

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(';'), ...rows.map((e) => e.join(';'))].join('\n')

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute(
      'download',
      `carteira_clientes_sly_${new Date().toISOString().split('T')[0]}.csv`,
    )
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <RoleGuard allowedRoles={['vendedor', 'supervisora', 'diretoria']}>
      <div className="space-y-6 pb-20 md:pb-8 animate-fade-in">
        {/* MENSAGEM DE ERRO VISÍVEL SE SESSÃO FOR INVÁLIDA */}
        {errorMessage && (
          <div className="bg-[#ED1C24]/10 border border-[#ED1C24]/30 text-[#ED1C24] p-4 rounded-[10px] text-xs font-figtree flex items-center justify-between">
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Topo da Página */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#D9D9D9]/70 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-montserrat text-2xl md:text-3xl font-bold text-[#111213] tracking-tight">
                Carteira de Clientes
              </h1>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-figtree font-bold bg-[#ED1C24]/10 text-[#ED1C24]">
                {clientesFiltrados.length} distribuidores
              </span>
            </div>
            <p className="font-figtree text-xs md:text-sm text-[#707980] mt-0.5">
              Gestão de volume, faturamento, médias móveis e saúde da carteira comercial.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={exportarCsv}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-[8px] bg-white border border-[#D9D9D9] hover:bg-[#F6F6F6] text-[#111213] text-xs font-figtree font-semibold transition-colors shadow-xs"
            >
              <Download className="w-4 h-4 text-[#707980]" />
              Exportar Excel
            </button>
          </div>
        </div>

        {/* FAIXA DE RESUMO COM CONTAGEM POR SITUAÇÃO EM PILLS CLICÁVEIS */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              setFiltroSituacao('todos')
              setCurrentPage(1)
            }}
            className={`px-3 py-1.5 rounded-full text-xs font-figtree font-bold transition-all border ${
              filtroSituacao === 'todos'
                ? 'bg-[#111213] text-white border-[#111213] shadow-xs'
                : 'bg-white text-[#707980] border-[#D9D9D9] hover:bg-[#F6F6F6]'
            }`}
          >
            Todos ({contagens.todos})
          </button>

          <button
            onClick={() => {
              setFiltroSituacao('ativo')
              setCurrentPage(1)
            }}
            className={`px-3 py-1.5 rounded-full text-xs font-figtree font-bold transition-all border inline-flex items-center gap-1.5 ${
              filtroSituacao === 'ativo'
                ? 'bg-[#1E9E5A] text-white border-[#1E9E5A] shadow-xs'
                : 'bg-white text-[#1E9E5A] border-[#1E9E5A]/30 hover:bg-[#1E9E5A]/10'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#1E9E5A]" />
            Ativo ({contagens.ativo})
          </button>

          <button
            onClick={() => {
              setFiltroSituacao('atencao')
              setCurrentPage(1)
            }}
            className={`px-3 py-1.5 rounded-full text-xs font-figtree font-bold transition-all border inline-flex items-center gap-1.5 ${
              filtroSituacao === 'atencao'
                ? 'bg-[#E8A317] text-white border-[#E8A317] shadow-xs'
                : 'bg-white text-[#C68508] border-[#E8A317]/30 hover:bg-[#E8A317]/10'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#E8A317]" />
            Em atenção ({contagens.atencao})
          </button>

          <button
            onClick={() => {
              setFiltroSituacao('queda')
              setCurrentPage(1)
            }}
            className={`px-3 py-1.5 rounded-full text-xs font-figtree font-bold transition-all border inline-flex items-center gap-1.5 ${
              filtroSituacao === 'queda'
                ? 'bg-[#ED1C24] text-white border-[#ED1C24] shadow-xs'
                : 'bg-white text-[#ED1C24] border-[#ED1C24]/30 hover:bg-[#ED1C24]/10'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#ED1C24]" />
            Em queda ({contagens.queda})
          </button>

          <button
            onClick={() => {
              setFiltroSituacao('inativo')
              setCurrentPage(1)
            }}
            className={`px-3 py-1.5 rounded-full text-xs font-figtree font-bold transition-all border inline-flex items-center gap-1.5 ${
              filtroSituacao === 'inativo'
                ? 'bg-[#696969] text-white border-[#696969] shadow-xs'
                : 'bg-white text-[#696969] border-[#696969]/30 hover:bg-[#696969]/10'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#696969]" />
            Inativo ({contagens.inativo})
          </button>
        </div>

        {/* BARRA DE FILTROS: Vendedor, UF, Mercado e Busca por texto */}
        <div className="bg-white rounded-[10px] border border-[#D9D9D9] p-3 shadow-subtle flex flex-col md:flex-row items-center gap-3">
          {/* Busca por texto */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-[#707980] absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Buscar por cliente, razão social, CNPJ ou código Focco..."
              value={buscaTexto}
              onChange={(e) => {
                setBuscaTexto(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#F6F6F6] hover:bg-[#EAEAEA]/50 focus:bg-white border border-[#D9D9D9] rounded-[8px] outline-none focus:border-[#ED1C24] font-figtree text-[#111213]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {/* Vendedor (visível para supervisora/diretoria) */}
            {isGestao && (
              <select
                value={filtroVendedor}
                onChange={(e) => {
                  setFiltroVendedor(e.target.value)
                  setCurrentPage(1)
                }}
                className="px-2.5 py-1.5 text-xs bg-white border border-[#D9D9D9] rounded-[8px] font-figtree text-[#111213] outline-none"
              >
                <option value="todos">Todos os vendedores</option>
                {vendedores.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.nome}
                  </option>
                ))}
              </select>
            )}

            {/* UF */}
            <select
              value={filtroUf}
              onChange={(e) => {
                setFiltroUf(e.target.value)
                setCurrentPage(1)
              }}
              className="px-2.5 py-1.5 text-xs bg-white border border-[#D9D9D9] rounded-[8px] font-figtree text-[#111213] outline-none"
            >
              <option value="todos">Todos os Estados</option>
              <option value="RS">RS - Rio Grande do Sul</option>
              <option value="SC">SC - Santa Catarina</option>
              <option value="PR">PR - Paraná</option>
              <option value="SP">SP - São Paulo</option>
              <option value="MG">MG - Minas Gerais</option>
              <option value="BA">BA - Bahia</option>
              <option value="PE">PE - Pernambuco</option>
            </select>

            {/* Mercado */}
            <select
              value={filtroMercado}
              onChange={(e) => {
                setFiltroMercado(e.target.value)
                setCurrentPage(1)
              }}
              className="px-2.5 py-1.5 text-xs bg-white border border-[#D9D9D9] rounded-[8px] font-figtree text-[#111213] outline-none"
            >
              <option value="todos">Todos os mercados</option>
              <option value="reposicao_direta">Reposição Direta</option>
              <option value="reposicao_indireta">Reposição Indireta</option>
              <option value="industria">Indústria</option>
              <option value="exportacao">Exportação</option>
            </select>
          </div>
        </div>

        {/* LAYOUT PRINCIPAL: TABELA + BLOCO TOP CLIENTES POR UF */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* TABELA DE CLIENTES (3 COLUNAS NO DESKTOP LARGO) */}
          <div className="xl:col-span-3 bg-white rounded-[10px] border border-[#D9D9D9] shadow-subtle overflow-hidden flex flex-col justify-between">
            {loading ? (
              <div className="p-8 space-y-4">
                <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
                <div className="h-12 bg-gray-100 rounded animate-pulse" />
                <div className="h-12 bg-gray-100 rounded animate-pulse" />
                <div className="h-12 bg-gray-100 rounded animate-pulse" />
              </div>
            ) : clientesPaginados.length === 0 ? (
              <div className="p-8">
                <EmptyState
                  icon={<Building className="w-8 h-8 text-[#2C3E50]" />}
                  title="Nenhum distribuidor encontrado"
                  description="Ajuste os filtros de busca para visualizar os clientes da carteira."
                />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-figtree border-collapse">
                  <thead className="bg-[#F6F6F6] text-[#707980] border-b border-[#D9D9D9] select-none">
                    <tr>
                      <th
                        onClick={() => handleSort('nome_fantasia')}
                        className="py-3 px-4 font-bold uppercase tracking-wider cursor-pointer hover:text-[#111213]"
                      >
                        <div className="flex items-center gap-1">
                          <span>Cliente</span>
                          <ArrowUpDown className="w-3 h-3" />
                        </div>
                      </th>
                      <th
                        onClick={() => handleSort('uf')}
                        className="py-3 px-2 font-bold uppercase tracking-wider cursor-pointer hover:text-[#111213]"
                      >
                        UF
                      </th>
                      <th className="py-3 px-3 font-bold uppercase tracking-wider">Situação</th>
                      <th
                        onClick={() => handleSort('media_mensal_6m')}
                        className="py-3 px-3 font-bold uppercase tracking-wider text-right cursor-pointer hover:text-[#111213]"
                      >
                        <div className="flex items-center justify-end gap-1">
                          <span>Média 6M</span>
                          <ArrowUpDown className="w-3 h-3" />
                        </div>
                      </th>
                      <th
                        onClick={() => handleSort('media_recente')}
                        className="py-3 px-3 font-bold uppercase tracking-wider text-right cursor-pointer hover:text-[#111213]"
                      >
                        Média Recente
                      </th>
                      <th
                        onClick={() => handleSort('variacao_pct')}
                        className="py-3 px-3 font-bold uppercase tracking-wider text-center cursor-pointer hover:text-[#111213]"
                      >
                        Variação
                      </th>
                      <th className="py-3 px-2 font-bold uppercase tracking-wider text-center">
                        12 Meses
                      </th>
                      <th
                        onClick={() => handleSort('dias_sem_compra')}
                        className="py-3 px-3 font-bold uppercase tracking-wider text-center cursor-pointer hover:text-[#111213]"
                      >
                        Sem Compra
                      </th>
                      {isGestao && (
                        <th className="py-3 px-3 font-bold uppercase tracking-wider">Vendedor</th>
                      )}
                      <th className="py-3 px-3 text-right">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#D9D9D9]/70">
                    {clientesPaginados.map((cliente) => {
                      const isNegative = Number(cliente.variacao_pct) < 0
                      const isZero = Number(cliente.variacao_pct) === 0
                      const sparkData = getClientSparklineData(cliente)

                      return (
                        <tr
                          key={cliente.id}
                          className="hover:bg-[#F6F6F6]/60 transition-colors cursor-pointer group"
                          onClick={() => navigate(`/clientes/${cliente.id}`)}
                        >
                          {/* Nome Fantasia + Código Focco */}
                          <td className="py-3 px-4">
                            <div className="font-montserrat font-bold text-sm text-[#111213] group-hover:text-[#ED1C24] transition-colors truncate max-w-[220px]">
                              {cliente.nome_fantasia}
                            </div>
                            <div className="text-[11px] text-[#707980] truncate max-w-[220px]">
                              {cliente.codigo_focco} • {cliente.cidade}
                            </div>
                          </td>

                          {/* UF */}
                          <td className="py-3 px-2 font-bold text-[#111213]">{cliente.uf}</td>

                          {/* Situação */}
                          <td className="py-3 px-3">
                            <StatusBadge situacao={cliente.situacao_comercial} />
                          </td>

                          {/* Média 6m */}
                          <td className="py-3 px-3 text-right font-montserrat font-semibold text-[#111213]">
                            {formatCurrency(cliente.media_mensal_6m)}
                          </td>

                          {/* Média recente */}
                          <td className="py-3 px-3 text-right font-montserrat text-[#707980]">
                            {formatCurrency(cliente.media_recente)}
                          </td>

                          {/* Variação */}
                          <td className="py-3 px-3 text-center">
                            <span
                              className={`inline-flex items-center gap-0.5 font-montserrat font-bold text-xs ${
                                isZero
                                  ? 'text-[#707980]'
                                  : isNegative
                                    ? 'text-[#ED1C24]'
                                    : 'text-[#1E9E5A]'
                              }`}
                            >
                              {isNegative ? (
                                <ArrowDownRight className="w-3.5 h-3.5" />
                              ) : (
                                <ArrowUpRight className="w-3.5 h-3.5" />
                              )}
                              {Number(cliente.variacao_pct) > 0 ? '+' : ''}
                              {cliente.variacao_pct}%
                            </span>
                          </td>

                          {/* Sparkline 12 meses em ardósia #2C3E50 */}
                          <td className="py-3 px-2 text-center">
                            <Sparkline data={sparkData} color="#2C3E50" width={80} height={22} />
                          </td>

                          {/* Dias sem compra */}
                          <td className="py-3 px-3 text-center font-figtree">
                            <span
                              className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                                cliente.dias_sem_compra > 40
                                  ? 'bg-[#ED1C24]/10 text-[#ED1C24]'
                                  : 'text-[#111213]'
                              }`}
                            >
                              {cliente.dias_sem_compra} dias
                            </span>
                          </td>

                          {/* Vendedor (Gestão) */}
                          {isGestao && (
                            <td className="py-3 px-3 text-[#707980] truncate max-w-[130px]">
                              {cliente.vendedor?.nome || 'Não atribuído'}
                            </td>
                          )}

                          {/* Link para Ficha */}
                          <td className="py-3 px-3 text-right">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                navigate(`/clientes/${cliente.id}`)
                              }}
                              className="p-1 rounded hover:bg-white text-[#707980] hover:text-[#ED1C24] transition-colors"
                              title="Abrir ficha 360°"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Paginação */}
            <div className="p-3 bg-[#F6F6F6] border-t border-[#D9D9D9] flex items-center justify-between text-xs font-figtree text-[#707980]">
              <span>
                Mostrando {clientesPaginados.length} de {clientesFiltrados.length} clientes
              </span>

              <div className="flex items-center gap-2">
                <button
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="p-1.5 rounded-[6px] border border-[#D9D9D9] bg-white text-[#111213] disabled:opacity-40 hover:bg-[#F6F6F6]"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="font-semibold text-[#111213]">
                  Página {currentPage} de {totalPages}
                </span>
                <button
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="p-1.5 rounded-[6px] border border-[#D9D9D9] bg-white text-[#111213] disabled:opacity-40 hover:bg-[#F6F6F6]"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* BLOCO LATERAL: TOP CLIENTES POR UF */}
          <div className="space-y-4">
            <div className="bg-white rounded-[10px] border border-[#D9D9D9] p-4 shadow-subtle">
              <div className="flex items-center justify-between border-b border-[#D9D9D9]/70 pb-3 mb-3">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#ED1C24]" />
                  <h3 className="font-montserrat text-sm font-bold text-[#111213]">
                    Top Clientes por UF
                  </h3>
                </div>
                <span className="text-[10px] font-figtree font-bold uppercase text-[#707980] bg-[#F6F6F6] px-2 py-0.5 rounded">
                  Média 6M
                </span>
              </div>

              <div className="space-y-4 max-h-[640px] overflow-y-auto pr-1">
                {topClientesPorUf.map((grupo) => (
                  <div key={grupo.uf} className="border-b border-[#D9D9D9]/50 pb-3 last:border-b-0">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-montserrat text-xs font-bold text-[#111213] bg-[#F6F6F6] px-2 py-0.5 rounded">
                        Estado: {grupo.uf}
                      </span>
                    </div>

                    <div className="space-y-2">
                      {grupo.clientes.map((c, idx) => {
                        const isNeg = Number(c.variacao_pct) < 0
                        return (
                          <div
                            key={c.id}
                            onClick={() => navigate(`/clientes/${c.id}`)}
                            className="p-2 rounded-[8px] hover:bg-[#F6F6F6] transition-colors cursor-pointer border border-transparent hover:border-[#D9D9D9]"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-montserrat text-xs font-bold text-[#111213] truncate max-w-[150px]">
                                {idx + 1}. {c.nome_fantasia}
                              </span>
                              <span className="font-montserrat font-bold text-xs text-[#111213]">
                                {formatCurrency(c.media_mensal_6m)}
                              </span>
                            </div>

                            <div className="flex items-center justify-between mt-1 text-[11px] text-[#707980]">
                              <span>{c.cidade}</span>
                              <span
                                className={`font-semibold ${
                                  isNeg ? 'text-[#ED1C24]' : 'text-[#1E9E5A]'
                                }`}
                              >
                                {isNeg ? '↓' : '↑'} {c.variacao_pct}%
                              </span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </RoleGuard>
  )
}
