import React, { useState } from 'react'
import { Settings, Sliders, Shield, Users, Database } from 'lucide-react'
import { EmptyState, PageHeader } from '@/components/EmptyState'
import { RoleGuard } from '@/components/RoleGuard'
import { useAuth } from '@/contexts/AuthContext'

export default function AdministracaoPage() {
  const { perfil } = useAuth()
  const isSupervisora = perfil?.papel === 'supervisora'

  // Supervisora vê só "Parâmetros"
  const [activeTab, setActiveTab] = useState<'parametros' | 'usuarios' | 'sistema'>('parametros')

  return (
    <RoleGuard allowedRoles={['admin', 'supervisora']}>
      <div className="space-y-6">
        <PageHeader
          title={isSupervisora ? 'Parâmetros' : 'Administração'}
          subtitle={
            isSupervisora
              ? 'Parâmetros operacionais e metas de vendas.'
              : 'Parâmetros e gestão do sistema.'
          }
          badge={isSupervisora ? 'Módulo Parâmetros' : 'Painel Admin'}
        />

        {/* Abas administrativas para o Admin (a supervisora visualiza apenas a área de Parâmetros) */}
        {!isSupervisora && (
          <div className="flex border-b border-[#D9D9D9] gap-4 mb-4">
            <button
              onClick={() => setActiveTab('parametros')}
              className={`pb-2.5 text-xs font-figtree font-bold uppercase tracking-wider transition-all border-b-2 ${
                activeTab === 'parametros'
                  ? 'border-[#ED1C24] text-[#ED1C24]'
                  : 'border-transparent text-[#707980] hover:text-[#111213]'
              }`}
            >
              Parâmetros
            </button>
            <button
              onClick={() => setActiveTab('usuarios')}
              className={`pb-2.5 text-xs font-figtree font-bold uppercase tracking-wider transition-all border-b-2 ${
                activeTab === 'usuarios'
                  ? 'border-[#ED1C24] text-[#ED1C24]'
                  : 'border-transparent text-[#707980] hover:text-[#111213]'
              }`}
            >
              Usuários e Perfis
            </button>
            <button
              onClick={() => setActiveTab('sistema')}
              className={`pb-2.5 text-xs font-figtree font-bold uppercase tracking-wider transition-all border-b-2 ${
                activeTab === 'sistema'
                  ? 'border-[#ED1C24] text-[#ED1C24]'
                  : 'border-transparent text-[#707980] hover:text-[#111213]'
              }`}
            >
              Integração Focco
            </button>
          </div>
        )}

        <div className="bg-white rounded-[10px] border border-[#D9D9D9] p-6 shadow-subtle min-h-[46vh] flex items-center justify-center">
          <EmptyState
            icon={
              isSupervisora ? (
                <Sliders className="w-8 h-8 text-[#2C3E50]" strokeWidth={1.75} />
              ) : (
                <Settings className="w-8 h-8 text-[#2C3E50]" strokeWidth={1.75} />
              )
            }
            title={isSupervisora ? 'Nenhum parâmetro configurado' : 'Nenhum dado de administração'}
            description={
              isSupervisora
                ? 'Os parâmetros de comissões e metas aparecerão aqui.'
                : 'As configurações aparecerão aqui.'
            }
          />
        </div>
      </div>
    </RoleGuard>
  )
}
