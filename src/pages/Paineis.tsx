import React from 'react'
import { BarChart3, TrendingUp } from 'lucide-react'
import { EmptyState, PageHeader } from '@/components/EmptyState'
import { RoleGuard } from '@/components/RoleGuard'

export default function PaineisPage() {
  return (
    <RoleGuard allowedRoles={['supervisora', 'diretoria']}>
      <div className="space-y-6">
        <PageHeader title="Painéis" subtitle="Indicadores e gráficos." badge="BI & Indicadores" />

        <div className="bg-white rounded-[10px] border border-[#D9D9D9] p-6 shadow-subtle min-h-[46vh] flex items-center justify-center">
          <EmptyState
            icon={<BarChart3 className="w-8 h-8 text-[#2C3E50]" strokeWidth={1.75} />}
            title="Nenhum dado de painel"
            description="Os gráficos de desempenho aparecerão aqui."
          />
        </div>
      </div>
    </RoleGuard>
  )
}
