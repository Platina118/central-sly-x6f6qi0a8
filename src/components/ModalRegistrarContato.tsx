import React, { useState } from 'react'
import { MessageSquare, Phone, Video, Mail, MapPin, Loader2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Acao } from '@/types/crm'
import { criarInteracao } from '@/services/crm'
import { useToast } from '@/hooks/use-toast'

interface ModalRegistrarContatoProps {
  clienteId: string
  clienteNome: string
  usuarioId?: string | null
  acoesAbertas: Acao[]
  open: boolean
  onClose: () => void
  onSuccess: () => void
}

export const ModalRegistrarContato: React.FC<ModalRegistrarContatoProps> = ({
  clienteId,
  clienteNome,
  usuarioId,
  acoesAbertas,
  open,
  onClose,
  onSuccess,
}) => {
  const { toast } = useToast()
  const [canal, setCanal] = useState<string>('whatsapp')
  const [direcao, setDirecao] = useState<'saida' | 'entrada'>('saida')
  const [acaoVinculadaId, setAcaoVinculadaId] = useState<string>('')
  const [resumo, setResumo] = useState<string>('')
  const [saving, setSaving] = useState(false)

  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!resumo.trim()) {
      toast({
        title: 'Informe o resumo da interação',
        description: 'Digite o que foi tratado na conversa com o cliente.',
        variant: 'destructive',
      })
      return
    }

    setSaving(true)
    const res = await criarInteracao({
      cliente_id: clienteId,
      usuario_id: usuarioId || null,
      acao_id: acaoVinculadaId || null,
      canal,
      direcao,
      resumo,
    })
    setSaving(false)

    if (res.success) {
      toast({
        title: 'Contato registrado!',
        description: 'A conversa foi inserida na linha do tempo do cliente.',
      })
      onSuccess()
      handleClose()
    } else {
      toast({
        title: 'Erro ao registrar contato',
        description: res.error || 'Tente novamente.',
        variant: 'destructive',
      })
    }
  }

  const handleClose = () => {
    setCanal('whatsapp')
    setDirecao('saida')
    setAcaoVinculadaId('')
    setResumo('')
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[540px] p-0 overflow-hidden border border-[#D9D9D9] rounded-[12px] bg-white shadow-2xl">
        <DialogHeader className="p-5 border-b border-[#D9D9D9] bg-[#F6F6F6]/60">
          <span className="font-figtree text-[11px] font-bold uppercase tracking-wider text-[#ED1C24]">
            Linha do Tempo Comercial
          </span>
          <DialogTitle className="font-montserrat text-lg font-bold text-[#111213] mt-0.5">
            Registrar Contato com {clienteNome}
          </DialogTitle>
          <DialogDescription className="font-figtree text-xs text-[#707980]">
            Histórico oficial de interações, cotações e follow-ups realizados.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSalvar} className="p-5 space-y-4">
          {/* Canal de Contato */}
          <div>
            <label className="block font-figtree text-xs font-bold uppercase tracking-wider text-[#707980] mb-1.5">
              Canal de Atendimento
            </label>
            <div className="grid grid-cols-5 gap-1.5">
              {[
                { id: 'whatsapp', label: 'WhatsApp', icon: MessageSquare },
                { id: 'telefone', label: 'Telefone', icon: Phone },
                { id: 'teams', label: 'Teams', icon: Video },
                { id: 'email', label: 'E-mail', icon: Mail },
                { id: 'visita', label: 'Visita', icon: MapPin },
              ].map((c) => {
                const Icon = c.icon
                const isSelected = canal === c.id
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setCanal(c.id)}
                    className={`flex flex-col items-center justify-center p-2 rounded-[8px] border text-xs font-figtree transition-all ${
                      isSelected
                        ? 'bg-[#111213] text-white border-[#111213] font-bold shadow-xs'
                        : 'bg-white text-[#707980] border-[#D9D9D9] hover:bg-[#F6F6F6]'
                    }`}
                  >
                    <Icon className="w-4 h-4 mb-1" />
                    <span className="text-[10px]">{c.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Direção */}
            <div>
              <label className="block font-figtree text-xs font-bold uppercase tracking-wider text-[#707980] mb-1">
                Direção do Contato
              </label>
              <select
                value={direcao}
                onChange={(e) => setDirecao(e.target.value as any)}
                className="w-full px-3 py-2 text-xs bg-white border border-[#D9D9D9] rounded-[8px] font-figtree text-[#111213] outline-none"
              >
                <option value="saida">Ativo (Entramos em contato)</option>
                <option value="entrada">Receptivo (Cliente nos procurou)</option>
              </select>
            </div>

            {/* Ação Vinculada (Opcional) */}
            <div>
              <label className="block font-figtree text-xs font-bold uppercase tracking-wider text-[#707980] mb-1">
                Vincular a Ação Aberta
              </label>
              <select
                value={acaoVinculadaId}
                onChange={(e) => setAcaoVinculadaId(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-[#D9D9D9] rounded-[8px] font-figtree text-[#111213] outline-none"
              >
                <option value="">Nenhuma ação específica</option>
                {acoesAbertas.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.titulo}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Resumo da Conversa */}
          <div>
            <label className="block font-figtree text-xs font-bold uppercase tracking-wider text-[#707980] mb-1">
              Resumo da Conversa / Assunto Tratado *
            </label>
            <textarea
              rows={4}
              placeholder="Descreva o que foi acordado com o cliente, produtos solicitados, prazos ou pedidos gerados..."
              value={resumo}
              onChange={(e) => setResumo(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white border border-[#D9D9D9] rounded-[8px] outline-none focus:border-[#ED1C24] font-figtree text-[#111213]"
              required
            />
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
                'Salvar Contato'
              )}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
