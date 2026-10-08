import React from 'react'
import { CalendarDays, Plus, CheckCircle2 } from 'lucide-react'
import { EmptyState, PageHeader } from '@/components/EmptyState'
import { RoleGuard } from '@/components/RoleGuard'

export default function MeuDiaPage() {
  return (
    <RoleGuard allowedRoles={['vendedor', 'supervisora']}>
      <div className="space-y-6">
        <PageHeader
          title="Meu Dia"
          subtitle="Sua rotina de vendas e tarefas do dia."
          badge="Rotina Diária"
          actions={
            <button
              onClick={() => {}}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-[8px] bg-[#ED1C24] hover:bg-[#C8141B] text-white text-xs font-figtree font-semibold transition-all transform hover:scale-[1.02] shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Nova Atividade
            </button>
          }
        />

        <div className="bg-white rounded-[10px] border border-[#D9D9D9] p-6 shadow-subtle min-h-[46vh] flex items-center justify-center">
          <EmptyState
            icon={<CalendarDays className="w-8 h-8 text-[#2C3E50]" strokeWidth={1.75} />}
            title="Nenhuma tarefa programada"
            description="Suas atividades do dia aparecerão aqui."
          />
        </div>
      </div>
    </RoleGuard>
  )
}
