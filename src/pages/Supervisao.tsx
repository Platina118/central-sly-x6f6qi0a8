import React from 'react'
import { Users2, BarChart2 } from 'lucide-react'
import { EmptyState, PageHeader } from '@/components/EmptyState'
import { RoleGuard } from '@/components/RoleGuard'

export default function SupervisaoPage() {
  return (
    <RoleGuard allowedRoles={['supervisora']}>
      <div className="space-y-6">
        <PageHeader
          title="Supervisão"
          subtitle="Acompanhamento da equipe."
          badge="Exclusivo Supervisão"
        />

        <div className="bg-white rounded-[10px] border border-[#D9D9D9] p-6 shadow-subtle min-h-[46vh] flex items-center justify-center">
          <EmptyState
            icon={<Users2 className="w-8 h-8 text-[#2C3E50]" strokeWidth={1.75} />}
            title="Nenhum vendedor na equipe"
            description="Dados da equipe aparecerão aqui."
          />
        </div>
      </div>
    </RoleGuard>
  )
}
