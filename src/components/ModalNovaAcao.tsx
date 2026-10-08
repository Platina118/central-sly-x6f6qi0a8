import React, { useState } from 'react'
import { Plus, Loader2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Cliente } from '@/types/crm'
import { criarNovaAcao } from '@/services/crm'
import { useToast } from '@/hooks/use-toast'

interface ModalNovaAcaoProps {
  open: boolean
  onClose: () => void
  clientes: Cliente[]
  vendedorId?: string | null
  onSuccess: () => void
  defaultClienteId?: string
}

export const ModalNovaAcao: React.FC<ModalNovaAcaoProps> = ({
  open,
  onClose,
  clientes,
  vendedorId,
  onSuccess,
  defaultClienteId,
}) => {
  const { toast } = useToast()
  const [clienteId, setClienteId] = useState<string>(defaultClienteId || '')
  const [tipo, setTipo] = useState<string>('manual')
  const [faixa, setFaixa] = useState<'alta' | 'normal'>('normal')
  const [titulo, setTitulo] = useState<string>('')
  const [motivo, setMotivo] = useState<string>('')
  const [valorEmRisco, setValorEmRisco] = useState<string>('')
  const [dataPrevista, setDataPrevista] = useState<string>(new Date().toISOString().split('T')[0])
  const [prazo, setPrazo] = useState<string>('')
  const [saving, setSaving] = useState(false)

  // Sincroniza se vier defaultClienteId
  React.useEffect(() => {
    if (defaultClienteId) {
      setClienteId(defaultClienteId)
    }
  }, [defaultClienteId])

  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!clienteId || !titulo.trim() || !motivo.trim()) {
      toast({
        title: 'Preencha os campos obrigatórios',
        description: 'Selecione o cliente, título e descrição/motivo da ação.',
        variant: 'destructive',
      })
      return
    }

    setSaving(true)
    const valorNum = valorEmRisco
      ? parseFloat(valorEmRisco.replace(/\./g, '').replace(',', '.'))
      : 0

    const res = await criarNovaAcao({
      cliente_id: clienteId,
      vendedor_id: vendedorId || null,
      tipo,
      titulo,
      motivo,
      faixa,
      valor_em_risco: valorNum,
      data_prevista: dataPrevista,
      prazo: prazo || undefined,
    })

    setSaving(false)

    if (res.success) {
      toast({
        title: 'Nova ação criada!',
        description: 'A atividade foi inserida na sua lista de prioridades.',
      })
      onSuccess()
      handleClose()
    } else {
      toast({
        title: 'Erro ao criar ação',
        description: res.error || 'Tente novamente.',
        variant: 'destructive',
      })
    }
  }

  const handleClose = () => {
    if (!defaultClienteId) setClienteId('')
    setTitulo('')
    setMotivo('')
    setValorEmRisco('')
    setPrazo('')
    setTipo('manual')
    setFaixa('normal')
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[560px] p-0 overflow-hidden border border-[#D9D9D9] rounded-[12px] bg-white shadow-2xl">
        <DialogHeader className="p-5 border-b border-[#D9D9D9] bg-[#F6F6F6]/60">
          <span className="font-figtree text-[11px] font-bold uppercase tracking-wider text-[#ED1C24]">
            Central Sly Comercial
          </span>
          <DialogTitle className="font-montserrat text-lg font-bold text-[#111213] mt-0.5">
            Criar Nova Ação Comercial
          </DialogTitle>
          <DialogDescription className="font-figtree text-xs text-[#707980]">
            Cadastre uma oportunidade, retorno, follow-up ou visita para acompanhamento.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSalvar} className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Seleção do Cliente */}
          <div>
            <label className="block font-figtree text-xs font-bold uppercase tracking-wider text-[#707980] mb-1">
              Cliente / Distribuidor *
            </label>
            <select
              value={clienteId}
              onChange={(e) => setClienteId(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white border border-[#D9D9D9] rounded-[8px] outline-none focus:border-[#ED1C24] font-figtree text-[#111213]"
              required
            >
              <option value="">Selecione um cliente...</option>
              {clientes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nome_fantasia} ({c.cidade}/{c.uf}) - {c.codigo_focco}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Tipo */}
            <div>
              <label className="block font-figtree text-xs font-bold uppercase tracking-wider text-[#707980] mb-1">
                Tipo da Ação
              </label>
              <select
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-[#D9D9D9] rounded-[8px] outline-none focus:border-[#ED1C24] font-figtree text-[#111213]"
              >
                <option value="manual">Manual / Tarefa</option>
                <option value="retorno">Retorno Agendado</option>
                <option value="reativacao">Reativação / Queda</option>
                <option value="lote_cd">Oferta Lote C/D</option>
                <option value="pos_venda">Pós-Venda</option>
                <option value="prospeccao">Prospecção</option>
                <option value="pendencia">Pendência</option>
              </select>
            </div>

            {/* Faixa de Prioridade */}
            <div>
              <label className="block font-figtree text-xs font-bold uppercase tracking-wider text-[#707980] mb-1">
                Faixa de Prioridade
              </label>
              <div className="grid grid-cols-2 gap-1.5 h-[34px]">
                <button
                  type="button"
                  onClick={() => setFaixa('alta')}
                  className={`text-xs rounded-[6px] font-figtree font-semibold border transition-all ${
                    faixa === 'alta'
                      ? 'bg-[#ED1C24] text-white border-[#ED1C24]'
                      : 'bg-[#F6F6F6] text-[#707980] border-[#D9D9D9]'
                  }`}
                >
                  Alta
                </button>
                <button
                  type="button"
                  onClick={() => setFaixa('normal')}
                  className={`text-xs rounded-[6px] font-figtree font-semibold border transition-all ${
                    faixa === 'normal'
                      ? 'bg-[#86B0B6] text-white border-[#86B0B6]'
                      : 'bg-[#F6F6F6] text-[#707980] border-[#D9D9D9]'
                  }`}
                >
                  Normal
                </button>
              </div>
            </div>
          </div>

          {/* Título */}
          <div>
            <label className="block font-figtree text-xs font-bold uppercase tracking-wider text-[#707980] mb-1">
              Título da Ação *
            </label>
            <input
              type="text"
              placeholder="Ex: Retorno Cotação Linha Pesada Scania"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white border border-[#D9D9D9] rounded-[8px] outline-none focus:border-[#ED1C24] font-figtree text-[#111213]"
              required
            />
          </div>

          {/* Motivo com números */}
          <div>
            <label className="block font-figtree text-xs font-bold uppercase tracking-wider text-[#707980] mb-1">
              Motivo e Justificativa (com dados objetivos) *
            </label>
            <textarea
              rows={3}
              placeholder="Ex: Cliente solicitou retorno com desconto de 3% no pacote de pistão leve. Média mensal é de R$ 35.000."
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white border border-[#D9D9D9] rounded-[8px] outline-none focus:border-[#ED1C24] font-figtree text-[#111213]"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Valor em Risco */}
            <div>
              <label className="block font-figtree text-xs font-bold uppercase tracking-wider text-[#707980] mb-1">
                Valor em Jogo (R$)
              </label>
              <input
                type="text"
                placeholder="0,00"
                value={valorEmRisco}
                onChange={(e) => setValorEmRisco(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-[#D9D9D9] rounded-[8px] outline-none focus:border-[#ED1C24] font-figtree text-[#111213]"
              />
            </div>

            {/* Data Prevista */}
            <div>
              <label className="block font-figtree text-xs font-bold uppercase tracking-wider text-[#707980] mb-1">
                Data Prevista *
              </label>
              <input
                type="date"
                value={dataPrevista}
                onChange={(e) => setDataPrevista(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-[#D9D9D9] rounded-[8px] outline-none focus:border-[#ED1C24] font-figtree text-[#111213]"
                required
              />
            </div>

            {/* Prazo Limite */}
            <div>
              <label className="block font-figtree text-xs font-bold uppercase tracking-wider text-[#707980] mb-1">
                Prazo Limite
              </label>
              <input
                type="date"
                value={prazo}
                onChange={(e) => setPrazo(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-[#D9D9D9] rounded-[8px] outline-none focus:border-[#ED1C24] font-figtree text-[#111213]"
              />
            </div>
          </div>

          <div className="p-4 bg-white border-t border-[#D9D9D9] flex items-center justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 rounded-[8px] border border-[#D9D9D9] text-[#707980] hover:text-[#111213] text-xs font-figtree font-semibold transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-[8px] bg-[#ED1C24] hover:bg-[#C8141B] disabled:opacity-50 text-white text-xs font-figtree font-bold transition-all shadow-sm"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Criar Ação
                </>
              )}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
