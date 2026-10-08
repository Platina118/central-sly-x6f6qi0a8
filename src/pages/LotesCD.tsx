import React from 'react'
import { Layers, RefreshCw } from 'lucide-react'
import { EmptyState, PageHeader } from '@/components/EmptyState'
import { RoleGuard } from '@/components/RoleGuard'

export default function LotesCDPage() {
  return (
    <RoleGuard allowedRoles={['supervisora', 'diretoria', 'pcp']}>
      <div className="space-y-6">
        <PageHeader
          title="Lotes C/D"
          subtitle="Gestão de lotes de clientes."
          actions={
            <button
              onClick={() => {}}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-[8px] bg-white border border-[#D9D9D9] hover:bg-[#F6F6F6] text-[#111213] text-xs font-figtree font-semibold transition-colors shadow-xs"
            >
              <RefreshCw className="w-4 h-4 text-[#707980]" />
              Sincronizar PCP Focco
            </button>
          }
        />

        <div className="bg-white rounded-[10px] border border-[#D9D9D9] p-6 shadow-subtle min-h-[46vh] flex items-center justify-center">
          <EmptyState
            icon={<Layers className="w-8 h-8 text-[#2C3E50]" strokeWidth={1.75} />}
            title="Nenhum lote"
            description="Lotes C/D aparecerão aqui."
          />
        </div>
      </div>
    </RoleGuard>
  )
}
