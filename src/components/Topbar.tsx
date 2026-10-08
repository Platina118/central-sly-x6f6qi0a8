import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search,
  Bell,
  SlidersHorizontal,
  ChevronRight,
  User,
  Building,
  CheckCircle2,
  X,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { getClientes, getAlertas, marcarAlertaResolvido } from '@/services/crm'
import { Cliente, Alerta } from '@/types/crm'
import { useAuth } from '@/contexts/AuthContext'

interface TopbarProps {
  title: string
  subtitle: string
}

export const Topbar: React.FC<TopbarProps> = ({ title, subtitle }) => {
  const navigate = useNavigate()
  const { perfil } = useAuth()
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [alertas, setAlertas] = useState<Alerta[]>([])

  // Carregar clientes e alertas
  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        const [clis, alts] = await Promise.all([getClientes(), getAlertas()])
        if (mounted) {
          setClientes(clis)
          setAlertas(alts)
        }
      } catch (e) {
        console.warn('Erro ao carregar alertas na topbar', e)
      }
    }
    load()
    return () => {
      mounted = false
    }
  }, [perfil?.id])

  const alertasAbertos = alertas.filter((a) => a.situacao === 'aberto')

  // Ouvir atalho Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setSearchOpen((prev) => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Obter data e hora atual no formato especificado "dd/mm hh:mm"
  const now = new Date()
  const day = String(now.getDate()).padStart(2, '0')
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const formattedUpdate = `${day}/${month} ${hours}:${minutes}`

  return (
    <>
      <header className="sticky top-0 z-20 h-16 bg-white border-b border-[#D9D9D9] px-4 md:px-8 flex items-center justify-between shadow-sm">
        {/* Lado Esquerdo: Título & Subtítulo dinâmicos da página */}
        <div className="flex flex-col justify-center min-w-0 pr-4">
          <h1 className="font-montserrat text-lg md:text-xl font-bold text-[#111213] tracking-[-0.5px] truncate">
            {title}
          </h1>
          <span className="font-figtree text-xs text-[#707980] truncate hidden sm:inline-block">
            {subtitle}
          </span>
        </div>

        {/* Lado Direito: Busca rápida, indicador de atualização e sino de alertas */}
        <div className="flex items-center gap-3 md:gap-5">
          {/* Indicador de atualização */}
          <div className="hidden lg:flex items-center gap-1.5 text-xs text-[#707980] font-figtree">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1E9E5A] animate-pulse" />
            <span>Dados atualizados até {formattedUpdate}</span>
          </div>

          {/* Botão de Busca Global (Ctrl+K) */}
          <button
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-[8px] bg-[#F6F6F6] hover:bg-[#EAEAEA] border border-[#D9D9D9] text-[#707980] hover:text-[#111213] transition-colors text-xs font-figtree"
            title="Buscar clientes (Ctrl+K)"
          >
            <Search className="w-4 h-4 text-[#707980]" strokeWidth={1.75} />
            <span className="hidden sm:inline">Buscar clientes…</span>
            <kbd className="hidden md:inline-flex items-center px-1.5 py-0.5 text-[10px] font-semibold bg-white border border-[#D9D9D9] rounded text-[#707980] shadow-xs">
              Ctrl+K
            </kbd>
          </button>

          {/* Sino de Alertas com Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="relative p-2 rounded-[8px] hover:bg-[#F6F6F6] text-[#2C3E50] transition-colors focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                aria-label="Alertas e Notificações"
              >
                <Bell className="w-5 h-5" strokeWidth={1.75} />
                {/* Contador em pill vermelho */}
                {alertasAbertos.length > 0 && (
                  <span className="absolute top-1 right-1 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-[#ED1C24] text-[10px] font-bold text-white leading-none animate-pulse">
                    {alertasAbertos.length}
                  </span>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-80 sm:w-96 p-0 border border-[#D9D9D9] rounded-[10px] shadow-lg animate-slide-down bg-white z-50 max-h-[80vh] overflow-y-auto"
            >
              <div className="p-3 border-b border-[#D9D9D9] flex items-center justify-between bg-[#F6F6F6]/60 sticky top-0 bg-white">
                <span className="font-figtree font-bold text-xs uppercase tracking-wider text-[#707980]">
                  Alertas Operacionais
                </span>
                <span className="text-[11px] text-[#ED1C24] font-figtree font-bold">
                  {alertasAbertos.length} pendentes
                </span>
              </div>

              {alertasAbertos.length === 0 ? (
                <div className="py-8 px-4 flex flex-col items-center justify-center text-center">
                  <div className="w-10 h-10 rounded-full bg-[#F6F6F6] flex items-center justify-center text-[#707980] mb-2">
                    <CheckCircle2 className="w-5 h-5 text-[#1E9E5A]" strokeWidth={1.75} />
                  </div>
                  <p className="font-montserrat text-xs font-bold text-[#111213]">
                    Nenhum alerta pendente
                  </p>
                  <p className="font-figtree text-[11px] text-[#707980] mt-0.5">
                    Notificações de quedas, cotações e metas concluídas.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-[#D9D9D9]">
                  {alertasAbertos.map((alt) => (
                    <div
                      key={alt.id}
                      className="p-3 hover:bg-[#F6F6F6] transition-colors text-xs font-figtree space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#111213]">
                          {alt.referencia || 'Alerta'}
                        </span>
                        <span className="text-[10px] uppercase font-bold text-[#ED1C24] bg-[#ED1C24]/10 px-1.5 py-0.2 rounded">
                          {alt.tipo.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#707980] leading-tight">{alt.mensagem}</p>
                      <div className="pt-1 flex items-center justify-end">
                        <button
                          onClick={async () => {
                            await marcarAlertaResolvido(alt.id)
                            setAlertas((prev) =>
                              prev.map((a) =>
                                a.id === alt.id ? { ...a, situacao: 'resolvido' } : a,
                              ),
                            )
                          }}
                          className="text-[10px] text-[#1E9E5A] hover:underline font-bold"
                        >
                          Marcar como lido
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Modal de Busca Global (Ctrl+K) */}
      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogContent className="sm:max-w-[560px] p-0 overflow-hidden border border-[#D9D9D9] rounded-[12px] bg-white shadow-2xl">
          <DialogHeader className="sr-only">
            <DialogTitle>Buscar Clientes</DialogTitle>
          </DialogHeader>

          {/* Campo de Input com Ícone */}
          <div className="flex items-center px-4 border-b border-[#D9D9D9]">
            <Search className="w-5 h-5 text-[#707980] mr-3" strokeWidth={1.75} />
            <input
              autoFocus
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por razão social, CNPJ ou código do cliente..."
              className="w-full py-4 text-sm font-figtree text-[#111213] placeholder-[#707980] outline-none bg-transparent"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="p-1 rounded text-[#707980] hover:text-[#111213]"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Resultados de Busca ou Estado Vazio */}
          {searchQuery.trim() ? (
            <div className="max-h-[360px] overflow-y-auto divide-y divide-[#D9D9D9] p-2">
              {clientes
                .filter((c) => {
                  const q = searchQuery.toLowerCase()
                  return (
                    c.nome_fantasia.toLowerCase().includes(q) ||
                    c.razao_social.toLowerCase().includes(q) ||
                    c.codigo_focco.toLowerCase().includes(q) ||
                    c.cidade.toLowerCase().includes(q) ||
                    c.cnpj.includes(q)
                  )
                })
                .slice(0, 8)
                .map((c) => (
                  <div
                    key={c.id}
                    onClick={() => {
                      setSearchOpen(false)
                      setSearchQuery('')
                      navigate(`/clientes/${c.id}`)
                    }}
                    className="p-3 hover:bg-[#F6F6F6] rounded-[8px] cursor-pointer flex items-center justify-between transition-colors group"
                  >
                    <div>
                      <div className="font-montserrat text-xs font-bold text-[#111213] group-hover:text-[#ED1C24] transition-colors">
                        {c.nome_fantasia}
                      </div>
                      <div className="font-figtree text-[11px] text-[#707980]">
                        {c.codigo_focco} • {c.cidade}/{c.uf} • CNPJ: {c.cnpj}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#707980] group-hover:text-[#ED1C24] transition-colors" />
                  </div>
                ))}
            </div>
          ) : (
            <div className="p-8 text-center min-h-[200px] flex flex-col items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-[#F6F6F6] flex items-center justify-center text-[#707980] mb-3">
                <Building className="w-6 h-6 text-[#707980]" strokeWidth={1.75} />
              </div>
              <p className="font-montserrat text-sm font-bold text-[#111213]">
                Busca rápida de distribuidores
              </p>
              <p className="font-figtree text-xs text-[#707980] max-w-xs mt-1">
                Digite o nome do distribuidor, cidade ou CNPJ para abrir a ficha 360°.
              </p>
              <div className="mt-4 flex flex-wrap gap-2 justify-center">
                <button
                  onClick={() => setSearchQuery('Tonini')}
                  className="text-[11px] font-figtree text-[#707980] hover:text-[#111213] px-2 py-0.5 rounded bg-[#F6F6F6] border border-[#D9D9D9]"
                >
                  Ex: Tonini
                </button>
                <button
                  onClick={() => setSearchQuery('Serraf')}
                  className="text-[11px] font-figtree text-[#707980] hover:text-[#111213] px-2 py-0.5 rounded bg-[#F6F6F6] border border-[#D9D9D9]"
                >
                  Ex: Serraf
                </button>
                <button
                  onClick={() => setSearchQuery('Rede União')}
                  className="text-[11px] font-figtree text-[#707980] hover:text-[#111213] px-2 py-0.5 rounded bg-[#F6F6F6] border border-[#D9D9D9]"
                >
                  Ex: Rede União
                </button>
              </div>
            </div>
          )}

          {/* Rodapé da modal */}
          <div className="px-4 py-2 bg-[#F6F6F6] border-t border-[#D9D9D9] flex items-center justify-between text-[11px] font-figtree text-[#707980]">
            <span>Dica: use setas ↑ e ↓ para navegar</span>
            <span>ESC para fechar</span>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
