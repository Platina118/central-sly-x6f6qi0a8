import React, { useState, useEffect, useMemo } from 'react'
import {
  CalendarDays,
  Plus,
  CheckCircle2,
  Clock,
  AlertOctagon,
  DollarSign,
  Sparkles,
  ArrowRight,
  TrendingDown,
  RotateCcw,
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { RoleGuard } from '@/components/RoleGuard'
import { CartaoAcao } from '@/components/CartaoAcao'
import { ModalRegistrarResultado } from '@/components/ModalRegistrarResultado'
import { ModalNovaAcao } from '@/components/ModalNovaAcao'
import { getAcoes, getClientes, formatCurrency } from '@/services/crm'
import { Acao, Cliente } from '@/types/crm'

export default function MeuDiaPage() {
  const { perfil } = useAuth()
  const [acoes, setAcoes] = useState<Acao[]>([])
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [loading, setLoading] = useState(true)
  const [modalResultadoAcao, setModalResultadoAcao] = useState<Acao | null>(null)
  const [modalNovaAcaoOpen, setModalNovaAcaoOpen] = useState(false)
  const [exitingAcaoId, setExitingAcaoId] = useState<string | null>(null)

  // Identificador do vendedor logado ou filtro
  const vendedorId = perfil?.papel === 'vendedor' ? perfil.id : null

  const loadData = async () => {
    setLoading(true)
    try {
      const [acoesData, clientesData] = await Promise.all([
        getAcoes({ vendedorId }),
        getClientes({ vendedorId }),
      ])
      setAcoes(acoesData)
      setClientes(clientesData)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [vendedorId])

  // Data de hoje por extenso
  const dataHojeExtenso = useMemo(() => {
    const d = new Date()
    return d.toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }, [])

  // Saudação
  const primeiroNome = perfil?.nome?.split(' ')[0] || 'Vendedor'

  // Cálculos de KPIs
  const hojeStr = new Date().toISOString().split('T')[0]

  const acoesAbertas = useMemo(() => acoes.filter((a) => a.situacao === 'aberta'), [acoes])
  const acoesConcluidasHoje = useMemo(
    () => acoes.filter((a) => a.situacao === 'concluida'),
    [acoes],
  )

  // Classificação dos blocos
  // 1. RETORNOS AGENDADOS: tipo == 'retorno' ou com data_retorno
  const retornosAgendados = useMemo(
    () => acoesAbertas.filter((a) => a.tipo === 'retorno'),
    [acoesAbertas],
  )

  // 2. ATRASADAS: data_prevista < hojeStr e não é retorno
  const atrasadas = useMemo(
    () => acoesAbertas.filter((a) => a.data_prevista < hojeStr && a.tipo !== 'retorno'),
    [acoesAbertas, hojeStr],
  )

  // 3. NOVAS DE HOJE: data_prevista >= hojeStr e não é retorno
  const novasDeHoje = useMemo(
    () => acoesAbertas.filter((a) => a.data_prevista >= hojeStr && a.tipo !== 'retorno'),
    [acoesAbertas, hojeStr],
  )

  // KPIs
  const totalAcoesHoje = acoesAbertas.length + acoesConcluidasHoje.length
  const totalConcluidas = acoesConcluidasHoje.length
  const totalAtrasadas = atrasadas.length
  const valorEmJogo = acoesAbertas.reduce((acc, a) => acc + (Number(a.valor_em_risco) || 0), 0)

  const progressoPct = totalAcoesHoje > 0 ? Math.round((totalConcluidas / totalAcoesHoje) * 100) : 0

  const handleSuccessResultado = (acaoId: string) => {
    setExitingAcaoId(acaoId)
    setTimeout(() => {
      setAcoes((prev) =>
        prev.map((a) => (a.id === acaoId ? { ...a, situacao: 'concluida' as const } : a)),
      )
      setExitingAcaoId(null)
    }, 320)
  }

  return (
    <RoleGuard allowedRoles={['vendedor', 'supervisora']}>
      <div className="space-y-6 pb-20 md:pb-8 animate-fade-in">
        {/* TOPO: Saudação em Montserrat 700 + data por extenso */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#D9D9D9]/70 pb-4">
          <div>
            <h1 className="font-montserrat text-2xl md:text-3xl font-bold text-[#111213] tracking-tight">
              Bom dia, {primeiroNome}
            </h1>
            <p className="font-figtree text-xs md:text-sm text-[#707980] capitalize mt-0.5">
              {dataHojeExtenso}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setModalNovaAcaoOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[8px] bg-[#ED1C24] hover:bg-[#C8141B] text-white text-xs font-figtree font-bold transition-all shadow-sm active:scale-95"
            >
              <Plus className="w-4 h-4" />
              Nova ação
            </button>
          </div>
        </div>

        {/* 4 CARTÕES DE KPI EM LINHA */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Card 1: Ações de hoje */}
          <div className="relative bg-white rounded-[10px] border border-[#D9D9D9] p-4 shadow-subtle flex flex-col justify-between">
            <span className="font-figtree text-[11px] font-bold uppercase tracking-wider text-[#707980]">
              Ações de hoje
            </span>
            <div className="mt-2">
              <span className="font-montserrat text-3xl md:text-4xl font-bold text-[#111213] tracking-[-1px]">
                {loading ? '-' : acoesAbertas.length}
              </span>
            </div>
            <span className="font-figtree text-[11px] text-[#707980] mt-1">
              Pendentes na sua rotina
            </span>
          </div>

          {/* Card 2: Atrasadas (Faixa vermelha 3px no topo se > 0) */}
          <div className="relative bg-white rounded-[10px] border border-[#D9D9D9] p-4 shadow-subtle flex flex-col justify-between overflow-hidden">
            {totalAtrasadas > 0 && (
              <span className="absolute top-0 left-0 right-0 h-[3px] bg-[#ED1C24]" />
            )}
            <span className="font-figtree text-[11px] font-bold uppercase tracking-wider text-[#707980] flex items-center justify-between">
              <span>Atrasadas</span>
              {totalAtrasadas > 0 && <AlertOctagon className="w-3.5 h-3.5 text-[#ED1C24]" />}
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
              {totalAtrasadas > 0 ? 'Exigem contato urgente' : 'Nenhuma pendência vencida'}
            </span>
          </div>

          {/* Card 3: Concluídas hoje */}
          <div className="relative bg-white rounded-[10px] border border-[#D9D9D9] p-4 shadow-subtle flex flex-col justify-between">
            <span className="font-figtree text-[11px] font-bold uppercase tracking-wider text-[#707980] flex items-center justify-between">
              <span>Concluídas hoje</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-[#1E9E5A]" />
            </span>
            <div className="mt-2">
              <span className="font-montserrat text-3xl md:text-4xl font-bold text-[#1E9E5A] tracking-[-1px]">
                {loading ? '-' : totalConcluidas}
              </span>
            </div>
            <span className="font-figtree text-[11px] text-[#707980] mt-1">
              {progressoPct}% da meta diária
            </span>
          </div>

          {/* Card 4: Valor em jogo hoje */}
          <div className="relative bg-white rounded-[10px] border border-[#D9D9D9] p-4 shadow-subtle flex flex-col justify-between">
            <span className="font-figtree text-[11px] font-bold uppercase tracking-wider text-[#707980]">
              Valor em jogo hoje
            </span>
            <div className="mt-2">
              <span className="font-montserrat text-2xl md:text-3xl font-bold text-[#111213] tracking-[-1px] truncate block">
                {loading ? '-' : formatCurrency(valorEmJogo)}
              </span>
            </div>
            <span className="font-figtree text-[11px] text-[#707980] mt-1">
              Em risco ou cotação ativa
            </span>
          </div>
        </div>

        {/* BARRA DE PROGRESSO FINA VERMELHA MOSTRANDO CONCLUÍDAS/TOTAL DO DIA */}
        <div className="bg-white rounded-[10px] border border-[#D9D9D9] p-3 shadow-subtle flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs font-figtree">
            <span className="text-[#707980] font-semibold">
              Progresso do Dia: <strong className="text-[#111213]">{totalConcluidas}</strong> de{' '}
              <strong className="text-[#111213]">{totalAcoesHoje}</strong> ações concluídas
            </span>
            <span className="font-bold text-[#ED1C24]">{progressoPct}%</span>
          </div>
          <div className="w-full h-1.5 bg-[#EAEAEA] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#ED1C24] transition-all duration-500 rounded-full"
              style={{ width: `${progressoPct}%` }}
            />
          </div>
        </div>

        {/* LOADING SKELETON */}
        {loading && (
          <div className="space-y-4">
            <div className="h-4 w-40 bg-gray-200 rounded animate-pulse" />
            <div className="h-28 bg-white border border-[#D9D9D9] rounded-[10px] animate-pulse" />
            <div className="h-28 bg-white border border-[#D9D9D9] rounded-[10px] animate-pulse" />
          </div>
        )}

        {/* ESTADO "DIA CONCLUÍDO" (quando não restam ações) */}
        {!loading && acoesAbertas.length === 0 && (
          <div className="bg-white rounded-[10px] border border-[#D9D9D9] p-12 text-center shadow-subtle flex flex-col items-center justify-center animate-fade-in-up">
            <div className="w-16 h-16 rounded-full bg-[#1E9E5A]/10 text-[#1E9E5A] flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8" strokeWidth={2} />
            </div>
            <h3 className="font-montserrat text-xl font-bold text-[#111213] mb-1">
              Carteira em dia. Bom trabalho!
            </h3>
            <p className="font-figtree text-sm text-[#707980] max-w-sm mb-6">
              Você concluiu todas as ações prioritárias previstas para hoje. Aproveite para
              prospectar novos distribuidores ou revisar a carteira.
            </p>
            <button
              onClick={() => setModalNovaAcaoOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[8px] bg-[#ED1C24] hover:bg-[#C8141B] text-white text-xs font-figtree font-bold transition-all shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Adicionar nova ação
            </button>
          </div>
        )}

        {/* LISTAS EM BLOCOS COM RÓTULO EM MAIÚSCULAS */}
        {!loading && acoesAbertas.length > 0 && (
          <div className="space-y-8">
            {/* BLOCO 1: RETORNOS AGENDADOS */}
            {retornosAgendados.length > 0 && (
              <section className="space-y-3">
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-[#3B82F6]" />
                  <h2 className="font-figtree text-xs font-bold uppercase tracking-[0.06em] text-[#707980]">
                    RETORNOS AGENDADOS ({retornosAgendados.length})
                  </h2>
                </div>
                <div className="space-y-3">
                  {retornosAgendados.map((acao) => (
                    <CartaoAcao
                      key={acao.id}
                      acao={acao}
                      onRegistrarResultado={(a) => setModalResultadoAcao(a)}
                      isExiting={exitingAcaoId === acao.id}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* BLOCO 2: ATRASADAS */}
            {atrasadas.length > 0 && (
              <section className="space-y-3">
                <div className="flex items-center gap-2">
                  <AlertOctagon className="w-4 h-4 text-[#ED1C24]" />
                  <h2 className="font-figtree text-xs font-bold uppercase tracking-[0.06em] text-[#ED1C24]">
                    ATRASADAS ({atrasadas.length})
                  </h2>
                </div>
                <div className="space-y-3">
                  {atrasadas.map((acao) => (
                    <CartaoAcao
                      key={acao.id}
                      acao={acao}
                      onRegistrarResultado={(a) => setModalResultadoAcao(a)}
                      isExiting={exitingAcaoId === acao.id}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* BLOCO 3: NOVAS DE HOJE */}
            {novasDeHoje.length > 0 && (
              <section className="space-y-3">
                <div className="flex items-center gap-2">
                  <CalendarDays className="w-4 h-4 text-[#707980]" />
                  <h2 className="font-figtree text-xs font-bold uppercase tracking-[0.06em] text-[#707980]">
                    NOVAS DE HOJE ({novasDeHoje.length})
                  </h2>
                </div>
                <div className="space-y-3">
                  {novasDeHoje.map((acao) => (
                    <CartaoAcao
                      key={acao.id}
                      acao={acao}
                      onRegistrarResultado={(a) => setModalResultadoAcao(a)}
                      isExiting={exitingAcaoId === acao.id}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}

        {/* MODAL REGISTRAR RESULTADO */}
        <ModalRegistrarResultado
          acao={modalResultadoAcao}
          open={Boolean(modalResultadoAcao)}
          onClose={() => setModalResultadoAcao(null)}
          onSuccess={handleSuccessResultado}
        />

        {/* MODAL NOVA AÇÃO */}
        <ModalNovaAcao
          open={modalNovaAcaoOpen}
          onClose={() => setModalNovaAcaoOpen(false)}
          clientes={clientes}
          vendedorId={perfil?.id}
          onSuccess={loadData}
        />
      </div>
    </RoleGuard>
  )
}
