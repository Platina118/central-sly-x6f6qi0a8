import React from 'react'
import { PackageSearch, Search } from 'lucide-react'
import { EmptyState, PageHeader } from '@/components/EmptyState'
import { RoleGuard } from '@/components/RoleGuard'

export default function ConsultaEstoquePage() {
  return (
    <RoleGuard allowedRoles={['vendedor', 'supervisora', 'diretoria', 'pcp', 'admin']}>
      <div className="space-y-6">
        <PageHeader
          title="Consulta de Estoque"
          subtitle="Disponibilidade de peças."
          actions={
            <div className="flex items-center gap-2">
              <span className="text-xs font-figtree text-[#707980]">
                Linhas: Pistões, Pinos e Jogos
              </span>
            </div>
          }
        />

        <div className="bg-white rounded-[10px] border border-[#D9D9D9] p-6 shadow-subtle min-h-[46vh] flex items-center justify-center">
          <EmptyState
            icon={<PackageSearch className="w-8 h-8 text-[#2C3E50]" strokeWidth={1.75} />}
            title="Estoque vazio"
            description="A consulta de estoque aparecerá aqui."
          />
        </div>
      </div>
    </RoleGuard>
  )
}
