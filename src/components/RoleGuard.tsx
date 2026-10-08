import React from 'react'
import { ShieldAlert, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth, getRoleHomePath } from '@/contexts/AuthContext'
import { PapelUsuario } from '@/lib/supabase'

export const RoleGuard: React.FC<{
  allowedRoles: PapelUsuario[]
  children: React.ReactNode
}> = ({ allowedRoles, children }) => {
  const { perfil } = useAuth()
  const navigate = useNavigate()

  const userRole = perfil?.papel || 'vendedor'
  const hasAccess = allowedRoles.includes(userRole)

  if (!hasAccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-8 text-center animate-fade-in">
        <div className="w-16 h-16 rounded-full bg-[#ED1C24]/10 text-[#ED1C24] flex items-center justify-center mb-4">
          <ShieldAlert className="w-8 h-8" strokeWidth={1.75} />
        </div>
        <h2 className="font-montserrat text-xl font-bold text-[#111213] mb-2 tracking-tight">
          Acesso Restrito
        </h2>
        <p className="font-figtree text-sm text-[#707980] max-w-md leading-relaxed mb-6">
          Seu perfil atual (<strong>{userRole.toUpperCase()}</strong>) não possui permissão para
          visualizar esta área da Central Sly. Caso necessite de acesso, solicite à supervisão ou ao
          administrador do sistema.
        </p>
        <button
          onClick={() => navigate(getRoleHomePath(userRole))}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[8px] bg-white border border-[#D9D9D9] hover:bg-[#F6F6F6] text-sm font-semibold text-[#111213] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para minha página inicial
        </button>
      </div>
    )
  }

  return <>{children}</>
}
