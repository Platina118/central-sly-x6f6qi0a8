import React from 'react'
import {
  MessageCircle,
  FileText,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Layers,
  HelpCircle,
  Clock,
  ArrowRight,
  TrendingDown,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Acao } from '@/types/crm'
import { StatusBadge } from './StatusBadge'
import { formatCurrency } from '@/services/crm'

interface CartaoAcaoProps {
  acao: Acao
  onRegistrarResultado: (acao: Acao) => void
  isExiting?: boolean
}

// Renderiza o motivo com os trechos em **negrito**
function renderMarkdownBold(text: string) {
  if (!text) return null
  const parts = text.split(/(\*\*.*?\*\*)/g)
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={index} className="font-bold text-[#111213]">
          {part.slice(2, -2)}
        </strong>
      )
    }
    return <span key={index}>{part}</span>
  })
}

// Retorna ícone e texto amigável do tipo da ação
function getTipoInfo(tipo: string) {
  switch (tipo) {
    case 'reativacao':
      return { icon: TrendingDown, label: 'Reativação de Queda', color: 'text-[#ED1C24]' }
    case 'lote_cd':
      return { icon: Layers, label: 'Oportunidade Lote C/D', color: 'text-[#86B0B6]' }
    case 'pendencia':
      return { icon: AlertTriangle, label: 'Resolução de Pendência', color: 'text-[#E8A317]' }
    case 'retorno':
      return { icon: RotateCcw, label: 'Retorno Agendado', color: 'text-[#3B82F6]' }
    case 'pos_venda':
      return { icon: Sparkles, label: 'Pós-Venda Estratégico', color: 'text-[#1E9E5A]' }
    case 'prospeccao':
      return { icon: ArrowRight, label: 'Prospecção Ativa', color: 'text-[#2C3E50]' }
    default:
      return { icon: FileText, label: 'Atividade Comercial', color: 'text-[#707980]' }
  }
}

export const CartaoAcao: React.FC<CartaoAcaoProps> = ({
  acao,
  onRegistrarResultado,
  isExiting = false,
}) => {
  const navigate = useNavigate()
  const tipoInfo = getTipoInfo(acao.tipo)
  const TipoIcon = tipoInfo.icon
  const isAlta = acao.faixa === 'alta'
  const barraCor = isAlta ? 'bg-[#ED1C24]' : 'bg-[#86B0B6]'

  const cliente = acao.cliente
  const telefoneWhatsapp = '5554991248821' // fallback whatsapp
  const whatsappUrl = `https://wa.me/${telefoneWhatsapp}?text=Ol%C3%A1%2C+sou+da+Sly+Parts.+Gostaria+de+conversar+sobre+nossos+pedidos.`

  return (
    <div
      className={`relative bg-white rounded-[10px] border border-[#D9D9D9] shadow-subtle hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col md:flex-row md:items-center justify-between ${
        isExiting
          ? 'opacity-0 transform translate-x-12 duration-300 pointer-events-none'
          : 'opacity-100'
      }`}
    >
      {/* Barra vertical colorida à esquerda (3px a 4px de espessura) */}
      <span className={`absolute left-0 top-0 bottom-0 w-1 md:w-1.5 ${barraCor}`} />

      {/* Conteúdo Central */}
      <div className="pl-5 pr-4 py-4 md:py-4 flex-1 min-w-0 space-y-2">
        {/* Linha 1: Nome do cliente + Cidade/UF + Badge da situação */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => cliente?.id && navigate(`/clientes/${cliente.id}`)}
            className="font-montserrat text-base font-bold text-[#111213] hover:text-[#ED1C24] transition-colors truncate text-left"
          >
            {cliente?.nome_fantasia || 'Cliente Sly'}
          </button>

          <span className="font-figtree text-xs text-[#707980]">
            • {cliente?.cidade}/{cliente?.uf}
          </span>

          {cliente?.situacao_comercial && <StatusBadge situacao={cliente.situacao_comercial} />}

          {isAlta && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-figtree font-extrabold uppercase tracking-wider bg-[#ED1C24] text-white">
              Alta Prioridade
            </span>
          )}
        </div>

        {/* Linha 2: Tipo da ação com ícone Lucide + Título */}
        <div className="flex items-center gap-2 text-xs font-figtree text-[#707980]">
          <span className={`inline-flex items-center gap-1 font-bold ${tipoInfo.color}`}>
            <TipoIcon className="w-3.5 h-3.5" />
            {tipoInfo.label}
          </span>
          <span>•</span>
          <span className="font-semibold text-[#111213] truncate">{acao.titulo}</span>
          {acao.origem === 'motor' && (
            <span className="hidden sm:inline-block px-1.5 py-0.2 rounded text-[10px] bg-[#F6F6F6] text-[#707980] border border-[#D9D9D9]">
              Motor Sly
            </span>
          )}
        </div>

        {/* Linha 3: MOTIVO em texto com números em negrito */}
        <p className="font-figtree text-xs text-[#707980] leading-relaxed max-w-3xl">
          {renderMarkdownBold(acao.motivo)}
        </p>
      </div>

      {/* Bloco Lateral Direito: Valor em Risco + Ações */}
      <div className="px-5 py-3 md:py-4 md:pl-2 flex flex-col sm:flex-row md:flex-col items-start sm:items-center md:items-end justify-between md:justify-center gap-3 border-t md:border-t-0 md:border-l border-[#D9D9D9]/70 bg-[#F6F6F6]/30 min-w-[240px]">
        {/* Valor em risco */}
        {acao.valor_em_risco > 0 ? (
          <div className="text-left md:text-right">
            <span className="block font-figtree text-[10px] font-bold uppercase tracking-wider text-[#707980]">
              Valor em risco
            </span>
            <span className="font-montserrat font-bold text-base text-[#ED1C24] tracking-tight">
              {formatCurrency(acao.valor_em_risco)}
            </span>
          </div>
        ) : (
          <div className="text-left md:text-right">
            <span className="block font-figtree text-[10px] font-bold uppercase tracking-wider text-[#707980]">
              Relacionamento
            </span>
            <span className="font-montserrat font-semibold text-xs text-[#707980]">Manutenção</span>
          </div>
        )}

        {/* Três Botões de Ação */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end flex-wrap">
          {/* Ver Ficha (Ghost) */}
          <button
            onClick={() => cliente?.id && navigate(`/clientes/${cliente.id}`)}
            className="px-2.5 py-1.5 rounded-[8px] hover:bg-[#F6F6F6] text-[#707980] hover:text-[#111213] text-xs font-figtree font-semibold transition-colors border border-transparent hover:border-[#D9D9D9]"
            title="Abrir visão 360° do distribuidor"
          >
            Ver ficha
          </button>

          {/* WhatsApp (Verde #1E9E5A) */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] bg-[#1E9E5A] hover:bg-[#18854b] text-white text-xs font-figtree font-semibold transition-colors shadow-xs"
            title="Conversar via WhatsApp"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">WhatsApp</span>
          </a>

          {/* Registrar Resultado (Botão vermelho primário) */}
          <button
            onClick={() => onRegistrarResultado(acao)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-[8px] bg-[#ED1C24] hover:bg-[#C8141B] text-white text-xs font-figtree font-bold transition-all shadow-sm active:scale-95"
            title="Concluir e registrar desfecho"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Registrar resultado</span>
          </button>
        </div>
      </div>
    </div>
  )
}
