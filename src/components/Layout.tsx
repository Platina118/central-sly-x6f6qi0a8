import React, { useState } from 'react'
import { Outlet, useLocation, Navigate } from 'react-router-dom'
import { Sidebar, MobileBottomBar } from './Sidebar'
import { Topbar } from './Topbar'
import { useAuth } from '@/contexts/AuthContext'
import { Skeleton } from '@/components/ui/skeleton'

// Mapeamento dos títulos e subtítulos por rota para alimentar a Topbar
const ROUTE_META: Record<string, { title: string; subtitle: string }> = {
  '/meu-dia': {
    title: 'Meu Dia',
    subtitle: 'Sua rotina de vendas e tarefas do dia.',
  },
  '/carteira': {
    title: 'Carteira de Clientes',
    subtitle: 'Clientes ativos e relacionamento.',
  },
  '/oportunidades': {
    title: 'Oportunidades',
    subtitle: 'Negociações em andamento.',
  },
  '/conversas': {
    title: 'Conversas',
    subtitle: 'Acompanhamento de conversas com clientes.',
  },
  '/novos-clientes': {
    title: 'Novos Clientes',
    subtitle: 'Prospecção e cadastro.',
  },
  '/pos-venda': {
    title: 'Pós-Venda',
    subtitle: 'Acompanhamento pós-entrega.',
  },
  '/lotes-c-d': {
    title: 'Lotes C/D',
    subtitle: 'Gestão de lotes de clientes.',
  },
  '/consulta-estoque': {
    title: 'Consulta de Estoque',
    subtitle: 'Disponibilidade de peças.',
  },
  '/supervisao': {
    title: 'Supervisão',
    subtitle: 'Acompanhamento da equipe.',
  },
  '/paineis': {
    title: 'Painéis',
    subtitle: 'Indicadores e gráficos.',
  },
  '/administracao': {
    title: 'Administração',
    subtitle: 'Parâmetros e gestão do sistema.',
  },
}

export default function Layout() {
  const { session, loading, perfil } = useAuth()
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(false)

  // 1. Enquanto carrega a sessão Supabase, exibe skeleton loading com fidelidade visual
  if (loading) {
    return (
      <div className="flex h-screen w-screen bg-[#F6F6F6] overflow-hidden">
        <div className="w-[248px] bg-[#111213] p-4 flex flex-col justify-between hidden md:flex">
          <div className="space-y-4">
            <Skeleton className="h-10 w-32 bg-[#202020]" />
            <div className="space-y-2 pt-6">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-8 w-full bg-[#202020]" />
              ))}
            </div>
          </div>
          <Skeleton className="h-12 w-full bg-[#202020]" />
        </div>
        <div className="flex-1 flex flex-col">
          <div className="h-16 bg-white border-b border-[#D9D9D9] px-8 flex items-center justify-between">
            <Skeleton className="h-6 w-48 bg-[#EAEAEA]" />
            <Skeleton className="h-9 w-64 bg-[#EAEAEA]" />
          </div>
          <div className="p-8 space-y-6">
            <Skeleton className="h-32 w-full bg-white rounded-[10px]" />
            <Skeleton className="h-64 w-full bg-white rounded-[10px]" />
          </div>
        </div>
      </div>
    )
  }

  // 2. Se não estiver autenticado, redireciona para a tela de Login (/)
  if (!session) {
    return <Navigate to="/" state={{ from: location }} replace />
  }

  // Obter metadados da rota atual
  const currentPath = '/' + location.pathname.split('/')[1]
  const meta = ROUTE_META[currentPath] || {
    title:
      perfil?.papel === 'supervisora' && currentPath === '/administracao'
        ? 'Parâmetros'
        : 'Central Sly',
    subtitle: 'Inteligência comercial da Sly Parts.',
  }

  // Ajuste do título para supervisora na tela de administração
  const pageTitle =
    perfil?.papel === 'supervisora' && currentPath === '/administracao' ? 'Parâmetros' : meta.title

  return (
    <div className="min-h-screen bg-[#F6F6F6] text-[#111213] flex flex-col font-figtree">
      {/* Sidebar Desktop */}
      <Sidebar collapsed={collapsed} onToggleCollapsed={() => setCollapsed(!collapsed)} />

      {/* Conteúdo Principal com compensação da Sidebar */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${
          collapsed ? 'md:ml-[68px]' : 'md:ml-[248px]'
        }`}
      >
        {/* Topbar Fixa */}
        <Topbar title={pageTitle} subtitle={meta.subtitle} />

        {/* Área de Página com margem inferior para o menu mobile */}
        <main className="flex-1 p-4 md:p-8 mb-16 md:mb-0 max-w-7xl w-full mx-auto animate-fade-in">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Bar (smartphone) */}
      <MobileBottomBar />
    </div>
  )
}
