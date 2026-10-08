import React from 'react'
import { SituacaoComercial } from '@/types/crm'

interface StatusBadgeProps {
  situacao: SituacaoComercial | string
  className?: string
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ situacao, className = '' }) => {
  switch (situacao) {
    case 'ativo':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-figtree font-bold tracking-wide bg-[#1E9E5A]/10 text-[#1E9E5A] border border-[#1E9E5A]/20 ${className}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#1E9E5A]" />
          Ativo
        </span>
      )
    case 'atencao':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-figtree font-bold tracking-wide bg-[#E8A317]/10 text-[#C68508] border border-[#E8A317]/25 ${className}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#E8A317]" />
          Em atenção
        </span>
      )
    case 'queda':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-figtree font-bold tracking-wide bg-[#ED1C24]/10 text-[#ED1C24] border border-[#ED1C24]/20 ${className}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#ED1C24]" />
          Em queda
        </span>
      )
    case 'inativo':
    default:
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-figtree font-bold tracking-wide bg-[#696969]/10 text-[#696969] border border-[#696969]/20 ${className}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#696969]" />
          Inativo
        </span>
      )
  }
}
