/**
 * Central Sly - Roteamento Principal
 * Sistema Interno de Inteligência Comercial - Sly Parts (Platina Indústria e Comércio de Autopeças)
 */
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AuthProvider } from './contexts/AuthContext'

import Layout from './components/Layout'
import Index from './pages/Index'
import NotFound from './pages/NotFound'

// As 11 rotas da Central Sly
import MeuDiaPage from './pages/MeuDia'
import CarteiraPage from './pages/Carteira'
import OportunidadesPage from './pages/Oportunidades'
import ConversasPage from './pages/Conversas'
import NovosClientesPage from './pages/NovosClientes'
import PosVendaPage from './pages/PosVenda'
import LotesCDPage from './pages/LotesCD'
import ConsultaEstoquePage from './pages/ConsultaEstoque'
import SupervisaoPage from './pages/Supervisao'
import PaineisPage from './pages/Paineis'
import AdministracaoPage from './pages/Administracao'

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          {/* Rota pública de login */}
          <Route path="/" element={<Index />} />

          {/* Rotas autenticadas sob o Layout com Sidebar e Topbar */}
          <Route element={<Layout />}>
            <Route path="/meu-dia" element={<MeuDiaPage />} />
            <Route path="/carteira" element={<CarteiraPage />} />
            <Route path="/oportunidades" element={<OportunidadesPage />} />
            <Route path="/conversas" element={<ConversasPage />} />
            <Route path="/novos-clientes" element={<NovosClientesPage />} />
            <Route path="/pos-venda" element={<PosVendaPage />} />
            <Route path="/lotes-c-d" element={<LotesCDPage />} />
            <Route path="/consulta-estoque" element={<ConsultaEstoquePage />} />
            <Route path="/supervisao" element={<SupervisaoPage />} />
            <Route path="/paineis" element={<PaineisPage />} />
            <Route path="/administracao" element={<AdministracaoPage />} />
          </Route>

          {/* Rota 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </AuthProvider>
  </BrowserRouter>
)

export default App
