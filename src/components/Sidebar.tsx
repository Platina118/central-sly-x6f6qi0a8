import React, { useState } from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import {
  CalendarDays,
  Briefcase,
  Target,
  MessageSquare,
  UserPlus,
  ShieldCheck,
  PackageSearch,
  Layers,
  Users2,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Sliders,
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { PapelUsuario } from '@/lib/supabase'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

interface MenuItemConfig {
  id: string
  label: string
  path: string
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>
  allowedRoles: PapelUsuario[]
}

export const ALL_MENU_ITEMS: MenuItemConfig[] = [
  {
    id: 'meu-dia',
    label: 'Meu dia',
    path: '/meu-dia',
    icon: CalendarDays,
    allowedRoles: ['vendedor', 'supervisora'],
  },
  {
    id: 'carteira',
    label: 'Carteira',
    path: '/carteira',
    icon: Briefcase,
    allowedRoles: ['vendedor', 'supervisora', 'diretoria'],
  },
  {
    id: 'oportunidades',
    label: 'Oportunidades',
    path: '/oportunidades',
    icon: Target,
    allowedRoles: ['vendedor', 'supervisora', 'diretoria'],
  },
  {
    id: 'conversas',
    label: 'Conversas',
    path: '/conversas',
    icon: MessageSquare,
    allowedRoles: ['vendedor', 'supervisora'],
  },
  {
    id: 'novos-clientes',
    label: 'Novos clientes',
    path: '/novos-clientes',
    icon: UserPlus,
    allowedRoles: ['vendedor', 'supervisora', 'diretoria'],
  },
  {
    id: 'pos-venda',
    label: 'Pós-venda',
    path: '/pos-venda',
    icon: ShieldCheck,
    allowedRoles: ['vendedor', 'supervisora', 'diretoria'],
  },
  {
    id: 'lotes-c-d',
    label: 'Lotes C/D',
    path: '/lotes-c-d',
    icon: Layers,
    allowedRoles: ['supervisora', 'diretoria', 'pcp'],
  },
  {
    id: 'consulta-estoque',
    label: 'Consulta de estoque',
    path: '/consulta-estoque',
    icon: PackageSearch,
    allowedRoles: ['vendedor', 'supervisora', 'diretoria', 'pcp', 'admin'],
  },
  {
    id: 'supervisao',
    label: 'Supervisão',
    path: '/supervisao',
    icon: Users2,
    allowedRoles: ['supervisora'],
  },
  {
    id: 'paineis',
    label: 'Painéis',
    path: '/paineis',
    icon: BarChart3,
    allowedRoles: ['supervisora', 'diretoria'],
  },
  {
    id: 'administracao',
    label: 'Administração',
    path: '/administracao',
    icon: Settings,
    allowedRoles: ['admin', 'supervisora'], // supervisora vê só seção Parâmetros
  },
]

export const Sidebar: React.FC<{
  collapsed: boolean
  onToggleCollapsed: () => void
}> = ({ collapsed, onToggleCollapsed }) => {
  const { perfil, signOut, switchDemoRole } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const papel: PapelUsuario = perfil?.papel || 'vendedor'

  // Filtrar itens permitidos para o papel
  const menuItems = ALL_MENU_ITEMS.filter((item) => item.allowedRoles.includes(papel))

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  // Obter iniciais
  const getInitials = (name?: string) => {
    if (!name) return 'SP'
    const parts = name.trim().split(/\s+/)
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase()
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }

  const roleLabels: Record<PapelUsuario, string> = {
    vendedor: 'Vendedor',
    supervisora: 'Supervisora',
    diretoria: 'Diretoria',
    pcp: 'PCP Engenharia',
    admin: 'Administrador',
  }

  return (
    <aside
      className={`fixed top-0 bottom-0 left-0 z-30 hidden md:flex flex-col bg-[#111213] text-white transition-all duration-300 ease-in-out select-none border-r border-[#202020] ${
        collapsed ? 'w-[68px]' : 'w-[248px]'
      }`}
    >
      {/* Topo: Logo Sly Parts */}
      <div className="h-16 flex items-center px-4 border-b border-[#202020] justify-center overflow-hidden">
        {collapsed ? (
          <div
            className="w-10 h-10 rounded-full bg-[#ED1C24] flex items-center justify-center font-montserrat font-black text-lg text-white shadow-md cursor-pointer tracking-tight"
            title="Sly Parts"
          >
            S
          </div>
        ) : (
          <div className="flex items-center justify-center w-full px-2">
            <img
              src="https://www.slyparts.com.br/wp-content/uploads/2025/01/Sly-Parts_vertical-300x171.png"
              alt="Sly Parts"
              className="h-11 w-auto max-w-[140px] object-contain brightness-110 filter contrast-125"
            />
          </div>
        )}
      </div>

      {/* Menu Principal */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-1 scrollbar-thin">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname.startsWith(item.path)
          // Na supervisora o item de administração mostra rótulo "Parâmetros"
          const displayLabel =
            papel === 'supervisora' && item.id === 'administracao' ? 'Parâmetros' : item.label

          const linkContent = (
            <NavLink
              to={item.path}
              className={`group relative flex items-center h-10 rounded-[8px] transition-all duration-150 ${
                isActive
                  ? 'bg-[#202020] text-white font-semibold'
                  : 'text-[#707980] hover:text-white hover:bg-[#202020]/70 font-medium'
              } ${collapsed ? 'justify-center px-0' : 'px-3 gap-3'}`}
            >
              {/* Faixa vermelha de 3px à esquerda do item ativo */}
              {isActive && (
                <span className="absolute left-0 top-1 bottom-1 w-[3px] bg-[#ED1C24] rounded-r" />
              )}

              <Icon
                className={`w-5 h-5 flex-shrink-0 transition-colors ${
                  isActive ? 'text-[#ED1C24]' : 'text-[#707980] group-hover:text-white'
                }`}
                strokeWidth={1.75}
              />

              {!collapsed && (
                <span className="font-figtree text-[11px] font-bold uppercase tracking-[0.06em] truncate">
                  {displayLabel}
                </span>
              )}
            </NavLink>
          )

          if (collapsed) {
            return (
              <Tooltip key={item.id} delayDuration={100}>
                <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                <TooltipContent
                  side="right"
                  className="bg-[#111213] text-white border border-[#303235] text-xs font-figtree"
                >
                  {displayLabel}
                </TooltipContent>
              </Tooltip>
            )
          }

          return <React.Fragment key={item.id}>{linkContent}</React.Fragment>
        })}
      </nav>

      {/* Seletor Rápido de Papel para Teste/Avaliação (ajuda o usuário testar todos os 5 papéis) */}
      {!collapsed && switchDemoRole && (
        <div className="px-3 py-2 border-t border-[#202020]/80">
          <label className="text-[10px] font-figtree font-bold uppercase tracking-wider text-[#707980] block mb-1">
            Simular Papel:
          </label>
          <div className="grid grid-cols-3 gap-1">
            {(['vendedor', 'supervisora', 'diretoria', 'pcp', 'admin'] as PapelUsuario[]).map(
              (r) => (
                <button
                  key={r}
                  onClick={() => switchDemoRole(r)}
                  className={`text-[10px] py-0.5 px-1 rounded font-figtree transition-all ${
                    papel === r
                      ? 'bg-[#ED1C24] text-white font-bold'
                      : 'bg-[#202020] text-[#707980] hover:text-white'
                  }`}
                >
                  {r === 'supervisora' ? 'Superv.' : r.toUpperCase()}
                </button>
              ),
            )}
          </div>
        </div>
      )}

      {/* Botão de Recolher / Expandir */}
      <div className="px-2 py-1 border-t border-[#202020]">
        <button
          onClick={onToggleCollapsed}
          className="w-full flex items-center justify-center h-8 rounded-[8px] hover:bg-[#202020] text-[#707980] hover:text-white transition-colors text-xs font-figtree"
          title={collapsed ? 'Expandir menu' : 'Recolher menu'}
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <div className="flex items-center gap-2">
              <ChevronLeft className="w-4 h-4" />
              <span className="text-[11px] uppercase tracking-wider">Recolher</span>
            </div>
          )}
        </button>
      </div>

      {/* Rodapé: Usuário e Sair */}
      <div className="p-3 border-t border-[#202020] bg-[#111213]">
        <div className={`flex items-center ${collapsed ? 'justify-center' : 'justify-between'}`}>
          <div className="flex items-center gap-2.5 min-w-0">
            {/* Avatar circular */}
            {perfil?.avatar_url ? (
              <img
                src={perfil.avatar_url}
                alt={perfil.nome}
                className="w-9 h-9 rounded-full object-cover border border-[#303235]"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-[#202020] border border-[#303235] text-white flex items-center justify-center font-montserrat font-bold text-xs flex-shrink-0">
                {getInitials(perfil?.nome)}
              </div>
            )}

            {!collapsed && (
              <div className="min-w-0">
                <p className="font-figtree text-xs font-semibold text-white truncate leading-tight">
                  {perfil?.nome || 'Usuário'}
                </p>
                <p className="font-figtree text-[11px] text-[#707980] truncate leading-tight mt-0.5">
                  {roleLabels[papel]}
                  {perfil?.codigo_vendedor_focco ? ` • ${perfil.codigo_vendedor_focco}` : ''}
                </p>
              </div>
            )}
          </div>

          {!collapsed && (
            <button
              onClick={handleSignOut}
              className="p-1.5 rounded-[8px] text-[#707980] hover:text-[#ED1C24] hover:bg-[#202020] transition-colors"
              title="Sair do sistema"
            >
              <LogOut className="w-4 h-4" strokeWidth={1.75} />
            </button>
          )}
        </div>
      </div>
    </aside>
  )
}

/**
 * Mobile Bottom Bar: Exibe os 4 itens principais para o papel no smartphone (0-640px)
 */
export const MobileBottomBar: React.FC = () => {
  const { perfil } = useAuth()
  const location = useLocation()
  const papel: PapelUsuario = perfil?.papel || 'vendedor'

  // Selecionar os 4 itens principais conforme o papel
  const getPrimaryFour = (): MenuItemConfig[] => {
    switch (papel) {
      case 'vendedor':
        return ALL_MENU_ITEMS.filter((i) =>
          ['meu-dia', 'carteira', 'oportunidades', 'consulta-estoque'].includes(i.id),
        )
      case 'supervisora':
        return ALL_MENU_ITEMS.filter((i) =>
          ['supervisao', 'meu-dia', 'carteira', 'paineis'].includes(i.id),
        )
      case 'diretoria':
        return ALL_MENU_ITEMS.filter((i) =>
          ['paineis', 'carteira', 'oportunidades', 'lotes-c-d'].includes(i.id),
        )
      case 'pcp':
        return ALL_MENU_ITEMS.filter((i) => ['lotes-c-d', 'consulta-estoque'].includes(i.id))
      case 'admin':
        return ALL_MENU_ITEMS.filter((i) => ['administracao', 'consulta-estoque'].includes(i.id))
      default:
        return ALL_MENU_ITEMS.slice(0, 4)
    }
  }

  const items = getPrimaryFour()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 h-16 bg-[#111213] border-t border-[#202020] flex md:hidden items-center justify-around px-2 shadow-lg">
      {items.map((item) => {
        const Icon = item.icon
        const isActive = location.pathname.startsWith(item.path)
        return (
          <NavLink
            key={item.id}
            to={item.path}
            className={`flex flex-col items-center justify-center flex-1 h-full py-1 transition-colors ${
              isActive ? 'text-[#ED1C24]' : 'text-[#707980] hover:text-white'
            }`}
          >
            <Icon className="w-5 h-5 mb-1" strokeWidth={1.75} />
            <span className="font-figtree text-[10px] font-bold uppercase tracking-wider truncate max-w-[70px]">
              {item.label}
            </span>
          </NavLink>
        )
      })}
    </nav>
  )
}
