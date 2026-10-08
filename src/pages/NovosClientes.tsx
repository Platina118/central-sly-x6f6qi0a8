import React from 'react'
import { UserPlus, Filter } from 'lucide-react'
import { EmptyState, PageHeader } from '@/components/EmptyState'
import { RoleGuard } from '@/components/RoleGuard'

export default function NovosClientesPage() {
  return (
    <RoleGuard allowedRoles={['vendedor', 'supervisora', 'diretoria']}>
      <div className="space-y-6">
        <PageHeader
          title="Novos Clientes"
          subtitle="Prospecção e cadastro."
          actions={
            <button
              onClick={() => {}}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-[8px] bg-[#ED1C24] hover:bg-[#C8141B] text-white text-xs font-figtree font-semibold transition-all transform hover:scale-[1.02] shadow-sm"
            >
              <UserPlus className="w-4 h-4" />
              Prospecção de Distribuidor
            </button>
          }
        />

        <div className="bg-white rounded-[10px] border border-[#D9D9D9] p-6 shadow-subtle min-h-[46vh] flex items-center justify-center">
          <EmptyState
            icon={<UserPlus className="w-8 h-8 text-[#2C3E50]" strokeWidth={1.75} />}
            title="Nenhum novo cliente"
            description="Novos cadastros aparecerão aqui."
          />
        </div>
      </div>
    </RoleGuard>
  )
}
