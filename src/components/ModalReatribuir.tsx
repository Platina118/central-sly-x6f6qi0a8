import React, { useState } from 'react'
import { ArrowRightLeft, UserCheck, Loader2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Perfil, Acao, Cliente } from '@/types/crm'
import { reatribuirAcao, reatribuirCliente } from '@/services/crm'
import { useToast } from '@/hooks/use-toast'

interface ModalReatribuirProps {
  open: boolean
  onClose: () => void
  vendedores: Perfil[]
  acao?: Acao | null
  cliente?: Cliente | null
  onSuccess: () => void
}

export const ModalReatribuir: React.FC<ModalReatribuirProps> = ({
  open,
  onClose,
  vendedores,
  acao,
  cliente,
  onSuccess,
}) => {
  const { toast } = useToast()
  const [novoVendedorId, setNovoVendedorId] = useState<string>('')
  const [salvando, setSalvando] = useState(false)

  const isAcao = Boolean(acao)
  const tituloEntidade = isAcao ? acao?.titulo : cliente?.nome_fantasia

  const handleSalvar = async () => {
    if (!novoVendedorId) {
      toast({
        title: 'Selecione o vendedor',
        description: 'Escolha para quem a responsabilidade será transferida.',
        variant: 'destructive',
      })
      return
    }

    setSalvando(true)
    let ok = false

    if (isAcao && acao) {
      ok = await reatribuirAcao(acao.id, novoVendedorId)
    } else if (cliente) {
      ok = await reatribuirCliente(cliente.id, novoVendedorId)
    }

    setSalvando(false)

    if (ok) {
      const vend = vendedores.find((v) => v.id === novoVendedorId)
      toast({
        title: 'Reatribuição concluída!',
        description: `${tituloEntidade} agora está sob responsabilidade de ${vend?.nome || 'novo vendedor'}.`,
      })
      onSuccess()
      onClose()
    } else {
      toast({
        title: 'Erro na reatribuição',
        description: 'Não foi possível alterar o vendedor responsável. Tente novamente.',
        variant: 'destructive',
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden border border-[#D9D9D9] rounded-[12px] bg-white shadow-2xl">
        <DialogHeader className="p-5 border-b border-[#D9D9D9] bg-[#F6F6F6]/60">
          <div className="flex items-center gap-2 text-[#ED1C24]">
            <ArrowRightLeft className="w-4 h-4" />
            <span className="font-figtree text-[11px] font-bold uppercase tracking-wider">
              Gestão de Carteira & Equipe
            </span>
          </div>
          <DialogTitle className="font-montserrat text-lg font-bold text-[#111213] mt-0.5">
            Reatribuir {isAcao ? 'Ação' : 'Distribuidor'}
          </DialogTitle>
          <DialogDescription className="font-figtree text-xs text-[#707980]">
            {tituloEntidade}
          </DialogDescription>
        </DialogHeader>

        <div className="p-5 space-y-4">
          <div>
            <label className="block font-figtree text-xs font-bold uppercase tracking-wider text-[#707980] mb-2">
              Selecione o Novo Vendedor Responsável
            </label>
            <div className="space-y-2">
              {vendedores.map((v) => {
                const isSelected = novoVendedorId === v.id
                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setNovoVendedorId(v.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-[8px] border text-left transition-all ${
                      isSelected
                        ? 'border-[#ED1C24] bg-[#ED1C24]/5 text-[#ED1C24]'
                        : 'border-[#D9D9D9] hover:bg-[#F6F6F6] text-[#111213]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#111213] text-white flex items-center justify-center font-bold text-xs">
                        {v.nome.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-figtree text-xs font-bold">{v.nome}</div>
                        <div className="text-[11px] text-[#707980]">
                          {v.codigo_vendedor_focco || 'Vendedor Sly'}
                        </div>
                      </div>
                    </div>
                    {isSelected && <UserCheck className="w-4 h-4 text-[#ED1C24]" />}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        <div className="p-4 bg-white border-t border-[#D9D9D9] flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-[8px] border border-[#D9D9D9] text-[#707980] hover:text-[#111213] text-xs font-figtree font-semibold transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            disabled={salvando || !novoVendedorId}
            onClick={handleSalvar}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-[8px] bg-[#ED1C24] hover:bg-[#C8141B] disabled:opacity-50 text-white text-xs font-figtree font-bold transition-all shadow-sm"
          >
            {salvando ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Reatribuindo...
              </>
            ) : (
              'Confirmar Reatribuição'
            )}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
