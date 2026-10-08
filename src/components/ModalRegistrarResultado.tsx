import React, { useState } from 'react'
import {
  CheckCircle2,
  Calendar,
  XCircle,
  Package,
  Store,
  AlertTriangle,
  PhoneOff,
  CheckSquare,
  HelpCircle,
  DollarSign,
  Loader2,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Acao } from '@/types/crm'
import { registrarResultadoAcao } from '@/services/crm'
import { useToast } from '@/hooks/use-toast'

interface ModalRegistrarResultadoProps {
  acao: Acao | null
  open: boolean
  onClose: () => void
  onSuccess: (acaoId: string) => void
}

interface OutcomeOption {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  requiresValue?: boolean
  requiresDate?: boolean
  requiresReason?: boolean
}

const OUTCOME_OPTIONS: OutcomeOption[] = [
  {
    id: 'Pedido gerado',
    label: 'Pedido gerado',
    icon: CheckCircle2,
    color: 'text-[#1E9E5A] border-[#1E9E5A]/30 bg-[#1E9E5A]/5',
    requiresValue: true,
  },
  {
    id: 'Cliente vai comprar',
    label: 'Cliente vai comprar',
    icon: Calendar,
    color: 'text-[#3B82F6] border-[#3B82F6]/30 bg-[#3B82F6]/5',
    requiresDate: true,
  },
  {
    id: 'Retornar em outra data',
    label: 'Retornar em outra data',
    icon: Calendar,
    color: 'text-[#E8A317] border-[#E8A317]/30 bg-[#E8A317]/5',
    requiresDate: true,
  },
  {
    id: 'Cliente com estoque alto',
    label: 'Cliente com estoque alto',
    icon: Package,
    color: 'text-[#707980] border-[#707980]/30 bg-[#707980]/5',
    requiresDate: true,
  },
  {
    id: 'Comprando de concorrente',
    label: 'Comprando de concorrente',
    icon: Store,
    color: 'text-[#ED1C24] border-[#ED1C24]/30 bg-[#ED1C24]/5',
    requiresReason: true,
  },
  {
    id: 'Problema de atendimento/qualidade',
    label: 'Problema de atendimento/qualidade',
    icon: AlertTriangle,
    color: 'text-[#ED1C24] border-[#ED1C24]/30 bg-[#ED1C24]/5',
    requiresReason: true,
  },
  {
    id: 'Sem contato',
    label: 'Sem contato',
    icon: PhoneOff,
    color: 'text-[#707980] border-[#707980]/30 bg-[#707980]/5',
  },
  {
    id: 'Pendência liberada',
    label: 'Pendência liberada',
    icon: CheckSquare,
    color: 'text-[#1E9E5A] border-[#1E9E5A]/30 bg-[#1E9E5A]/5',
  },
  {
    id: 'Não se aplica',
    label: 'Não se aplica',
    icon: HelpCircle,
    color: 'text-[#707980] border-[#707980]/30 bg-[#707980]/5',
  },
]

export const ModalRegistrarResultado: React.FC<ModalRegistrarResultadoProps> = ({
  acao,
  open,
  onClose,
  onSuccess,
}) => {
  const { toast } = useToast()
  const [selectedOutcome, setSelectedOutcome] = useState<string>('')
  const [pedidoValor, setPedidoValor] = useState<string>('')
  const [dataRetorno, setDataRetorno] = useState<string>('')
  const [motivoPerda, setMotivoPerda] = useState<string>('')
  const [observacao, setObservacao] = useState<string>('')
  const [saving, setSaving] = useState(false)

  if (!acao) return null

  const currentOption = OUTCOME_OPTIONS.find((opt) => opt.id === selectedOutcome)

  const handleSalvar = async () => {
    if (!selectedOutcome) {
      toast({
        title: 'Selecione um resultado',
        description: 'Escolha uma das opções para registrar o desfecho da ação.',
        variant: 'destructive',
      })
      return
    }

    // Validações contextuais
    if (currentOption?.requiresValue && !pedidoValor) {
      toast({
        title: 'Informe o valor do pedido',
        description: 'Para "Pedido gerado", informe o valor em reais.',
        variant: 'destructive',
      })
      return
    }

    if (currentOption?.requiresDate && !dataRetorno) {
      toast({
        title: 'Informe a data de retorno',
        description: 'Indique quando o cliente deve ser contatado novamente.',
        variant: 'destructive',
      })
      return
    }

    if (currentOption?.requiresReason && !motivoPerda && !observacao) {
      toast({
        title: 'Descreva a justificativa',
        description: 'Informe o concorrente ou problema identificado.',
        variant: 'destructive',
      })
      return
    }

    setSaving(true)
    const valorNumerico = pedidoValor
      ? parseFloat(pedidoValor.replace(/\./g, '').replace(',', '.'))
      : null

    const finalObs = [motivoPerda ? `Motivo: ${motivoPerda}` : '', observacao]
      .filter(Boolean)
      .join(' | ')

    const res = await registrarResultadoAcao({
      acaoId: acao.id,
      clienteId: acao.cliente_id,
      usuarioId: acao.vendedor_id,
      resultado: selectedOutcome,
      observacao: finalObs,
      dataRetorno: dataRetorno || null,
      pedidoValor: valorNumerico,
    })

    setSaving(false)

    if (res.success) {
      toast({
        title: 'Resultado registrado com sucesso!',
        description: `Ação com ${acao.cliente?.nome_fantasia || 'cliente'} concluída.`,
      })
      onSuccess(acao.id)
      handleClose()
    } else {
      toast({
        title: 'Erro ao registrar resultado',
        description: res.error || 'Tente novamente.',
        variant: 'destructive',
      })
    }
  }

  const handleClose = () => {
    setSelectedOutcome('')
    setPedidoValor('')
    setDataRetorno('')
    setMotivoPerda('')
    setObservacao('')
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[620px] p-0 overflow-hidden border border-[#D9D9D9] rounded-[12px] bg-white shadow-2xl">
        <DialogHeader className="p-5 border-b border-[#D9D9D9] bg-[#F6F6F6]/60">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-figtree text-[11px] font-bold uppercase tracking-wider text-[#707980]">
                Registrar Resultado da Ação
              </span>
              <DialogTitle className="font-montserrat text-lg font-bold text-[#111213] mt-0.5">
                {acao.cliente?.nome_fantasia || 'Cliente'}
              </DialogTitle>
              <DialogDescription className="font-figtree text-xs text-[#707980]">
                {acao.titulo}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="p-5 space-y-5 max-h-[72vh] overflow-y-auto">
          {/* Grade de Seleção em Cartões (Rápido em até 3 cliques) */}
          <div>
            <label className="block font-figtree text-xs font-bold uppercase tracking-wider text-[#707980] mb-2.5">
              1. Selecione o Desfecho da Ação
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {OUTCOME_OPTIONS.map((opt) => {
                const Icon = opt.icon
                const isSelected = selectedOutcome === opt.id
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setSelectedOutcome(opt.id)}
                    className={`flex flex-col items-center justify-center text-center p-3 rounded-[10px] border transition-all text-xs font-figtree ${
                      isSelected
                        ? 'border-[#ED1C24] bg-[#ED1C24]/5 text-[#ED1C24] font-bold shadow-xs scale-[1.02]'
                        : 'border-[#D9D9D9] hover:border-[#111213] bg-white text-[#111213] hover:bg-[#F6F6F6]'
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 mb-1.5 ${
                        isSelected ? 'text-[#ED1C24]' : 'text-[#707980]'
                      }`}
                    />
                    <span className="leading-tight">{opt.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Campos Dinâmicos conforme a opção */}
          {selectedOutcome && (
            <div className="p-4 bg-[#F6F6F6] rounded-[10px] border border-[#D9D9D9] space-y-3.5 animate-slide-down">
              <span className="font-figtree text-xs font-bold text-[#111213] block">
                2. Detalhes do registro ({selectedOutcome})
              </span>

              {/* Se Pedido Gerado -> Valor em R$ */}
              {currentOption?.requiresValue && (
                <div>
                  <label className="block font-figtree text-xs text-[#707980] font-semibold mb-1">
                    Valor Total do Pedido (R$) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs font-bold text-[#707980]">
                      R$
                    </span>
                    <input
                      type="text"
                      placeholder="18.500,00"
                      value={pedidoValor}
                      onChange={(e) => setPedidoValor(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-[#D9D9D9] rounded-[8px] outline-none focus:border-[#ED1C24] font-montserrat font-bold text-[#111213]"
                    />
                  </div>
                </div>
              )}

              {/* Se Requer Data de Retorno */}
              {currentOption?.requiresDate && (
                <div>
                  <label className="block font-figtree text-xs text-[#707980] font-semibold mb-1">
                    Data do Próximo Contato *
                  </label>
                  <input
                    type="date"
                    value={dataRetorno}
                    onChange={(e) => setDataRetorno(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white border border-[#D9D9D9] rounded-[8px] outline-none focus:border-[#ED1C24] font-figtree text-[#111213]"
                  />
                </div>
              )}

              {/* Se Requer Motivo de Perda */}
              {currentOption?.requiresReason && (
                <div>
                  <label className="block font-figtree text-xs text-[#707980] font-semibold mb-1">
                    Concorrente ou Motivo Central *
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Concorrente Mahle com 12% abaixo, prazo de entrega, etc."
                    value={motivoPerda}
                    onChange={(e) => setMotivoPerda(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white border border-[#D9D9D9] rounded-[8px] outline-none focus:border-[#ED1C24] font-figtree text-[#111213]"
                  />
                </div>
              )}

              {/* Observação Livre */}
              <div>
                <label className="block font-figtree text-xs text-[#707980] font-semibold mb-1">
                  Observações adicionais (salvas no histórico do cliente)
                </label>
                <textarea
                  rows={2}
                  placeholder="Escreva um breve resumo da conversa..."
                  value={observacao}
                  onChange={(e) => setObservacao(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-[#D9D9D9] rounded-[8px] outline-none focus:border-[#ED1C24] font-figtree text-[#111213]"
                />
              </div>
            </div>
          )}
        </div>

        {/* Rodapé com botões de ação */}
        <div className="p-4 bg-white border-t border-[#D9D9D9] flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 rounded-[8px] border border-[#D9D9D9] text-[#707980] hover:text-[#111213] text-xs font-figtree font-semibold transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            disabled={saving || !selectedOutcome}
            onClick={handleSalvar}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-[8px] bg-[#ED1C24] hover:bg-[#C8141B] disabled:opacity-50 text-white text-xs font-figtree font-bold transition-all shadow-sm"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Salvando...
              </>
            ) : (
              'Confirmar Resultado'
            )}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
