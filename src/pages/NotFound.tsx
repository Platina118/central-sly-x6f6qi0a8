import React from 'react'
import { useNavigate } from 'react-router-dom'
import { HelpCircle, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#F6F6F6] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-full bg-[#E5E5E5] flex items-center justify-center text-[#2C3E50] mb-4">
        <HelpCircle className="w-8 h-8" strokeWidth={1.75} />
      </div>

      <h1 className="font-montserrat text-3xl font-bold text-[#111213] tracking-tight mb-2">
        Página não encontrada
      </h1>

      <p className="font-figtree text-sm text-[#707980] max-w-sm mb-6">
        A rota informada não existe na Central Sly. Utilize o menu lateral para navegar pelas seções
        do sistema.
      </p>

      <button
        onClick={() => navigate('/')}
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[8px] bg-[#ED1C24] hover:bg-[#C8141B] text-white text-xs font-figtree font-semibold transition-all transform hover:scale-[1.02] shadow-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        Retornar à Central
      </button>
    </div>
  )
}
