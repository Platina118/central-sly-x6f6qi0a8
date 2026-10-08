import React from 'react'

interface EmptyStateProps {
  icon: React.ReactNode
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, description, action }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[44vh] p-8 text-center animate-fade-in-up">
      {/* Círculo cinza claro */}
      <div className="w-16 h-16 rounded-full bg-[#E5E5E5] flex items-center justify-center text-[#2C3E50] mb-4 shadow-sm">
        {icon}
      </div>

      <h3 className="font-montserrat text-lg font-bold text-[#111213] tracking-tight mb-2">
        {title}
      </h3>

      <p className="font-figtree text-sm text-[#707980] max-w-md leading-relaxed">{description}</p>

      {action && (
        <button
          onClick={action.onClick}
          className="mt-6 px-4 py-2 text-sm font-semibold rounded-[8px] bg-[#ED1C24] hover:bg-[#C8141B] text-white transition-all transform hover:scale-[1.02] shadow-sm active:scale-95"
        >
          {action.label}
        </button>
      )}
    </div>
  )
}

export const PageHeader: React.FC<{
  title: string
  subtitle: string
  badge?: string
  actions?: React.ReactNode
}> = ({ title, subtitle, badge, actions }) => {
  return (
    <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-[#D9D9D9]/70">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="font-montserrat text-2xl font-bold text-[#111213] tracking-[-0.5px]">
            {title}
          </h1>
          {badge && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-figtree font-bold tracking-wider uppercase bg-[#ED1C24]/10 text-[#ED1C24]">
              {badge}
            </span>
          )}
        </div>
        <p className="font-figtree text-sm text-[#707980] mt-0.5">{subtitle}</p>
      </div>

      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  )
}
