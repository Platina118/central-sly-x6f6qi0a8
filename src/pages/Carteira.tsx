import React from 'react'
import { Briefcase, UserPlus } from 'lucide-react'
import { EmptyState, PageHeader } from '@/components/EmptyState'
import { RoleGuard } from '@/components/RoleGuard'

export default function CarteiraPage() {
  return (
    <RoleGuard allowedRoles={['vendedor', 'supervisora', 'diretoria']}>
      <div className="space-y-6">
        <PageHeader
          title="Carteira de Clientes"
          subtitle="Clientes ativos e relacionamento."
          actions={
            <button
              onClick={() => {}}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-[8px] bg-white border border-[#D9D9D9] hover:bg-[#F6F6F6] text-[#111213] text-xs font-figtree font-semibold transition-colors shadow-xs"
            >
              <UserPlus className="w-4 h-4 text-[#707980]" />
              Vincular Distribuidor
            </button>
          }
        />

        <div className="bg-white rounded-[10px] border border-[#D9D9D9] p-6 shadow-subtle min-h-[46vh] flex items-center justify-center">
          <EmptyState
            icon={<Briefcase className="w-8 h-8 text-[#2C3E50]" strokeWidth={1.75} />}
            title="Carteira vazia"
            description="Seus clientes aparecerão aqui."
          />
        </div>
      </div>
    </RoleGuard>
  )
}
