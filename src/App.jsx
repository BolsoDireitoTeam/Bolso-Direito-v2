import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

import { FinanceProvider } from './context/FinanceContext'
import Toast from './components/ui/Toast'

import Sidebar from './components/layout/Sidebar'
import Topbar from './components/layout/Topbar'
import BottomNav from './components/layout/BottomNav'
import Fab from './components/layout/Fab'
import ActionSheet from './components/layout/ActionSheet'

import Login from './pages/Login'
import Register from './pages/Register'
import VisaoGeral from './pages/VisaoGeral'
import User from './pages/User'
import EditarInfoPessoal from './pages/EditarInfoPessoal'
import EditarDadosFinanceiros from './pages/EditarDadosFinanceiros'
import InvestimentosOverview from './pages/InvestimentosOverview'
import CarteiraInvestimentos from './pages/CarteiraInvestimentos'
import NovoInvestimento from './pages/NovoInvestimento'
import SimulacaoInvestimento from './pages/SimulacaoInvestimento'
import TecladoValores from './pages/TecladoValores'
import EscolherCategoria from './pages/EscolherCategoria'
import EscolherTipoGasto from './pages/EscolherTipoGasto'
import ListaTransacoes from './pages/ListaTransacoes'
import ViewMensal from './pages/ViewMensal'
import ViewAnual from './pages/ViewAnual'
import UploadExtrato from './pages/UploadExtrato'
import UploadFatura from './pages/UploadFatura'
import Metas from './pages/Metas'
import NovaMeta from './pages/NovaMeta'
import MetaDetalhes from './pages/MetaDetalhes'

// ── Inner App: consome FinanceContext para dados centralizados ──
import { useFinance } from './hooks/useFinance'

function AppInner() {
  const { usuario, salvarUsuario, financeiro, salvarFinanceiro } = useFinance()

  const [isLoggedIn, setIsLoggedIn] = useState(
    () => localStorage.getItem('bd_logado') === 'true'
  )

  const [actionSheetOpen, setActionSheetOpen] = useState(false)
  const toggleMenu = () => setActionSheetOpen(prev => !prev)

  const handleLogin = (dados) => {
    setIsLoggedIn(true)
    salvarUsuario({ nome: dados.username })
    localStorage.setItem('bd_logado', 'true')
  }

  return (
    <Routes>
      {/* Rota do login — sem sidebar/topbar */}
      <Route
        path="/login"
        element={
          isLoggedIn
            ? <Navigate to="/" replace />
            : <Login onLogin={handleLogin} />
        }
      />

      {/* Rota do registro — sem sidebar/topbar */}
      <Route
        path="/registro"
        element={
          isLoggedIn
            ? <Navigate to="/" replace />
            : <Register onLogin={handleLogin} />
        }
      />

      {/* Rotas do app — com layout completo */}
      <Route
        path="/*"
        element={
          !isLoggedIn
            ? <Navigate to="/login" replace />
            : (
              <>
                <Sidebar usuario={usuario} />
                <Topbar />
                <main className="main-content">
                  <Routes>
                    <Route path="/" element={<VisaoGeral onAddClick={toggleMenu} usuario={usuario} />} />
                    <Route path="/perfil" element={<User />} />
                    <Route path="/editar-dados-cadastrais" element={<EditarInfoPessoal />} />
                    <Route path="/editar-dados-financeiros" element={<EditarDadosFinanceiros />} />
                    <Route path="/investimentos" element={<InvestimentosOverview />} />
                    <Route path="/investimentos/carteira" element={<CarteiraInvestimentos onAddClick={toggleMenu} />} />
                    <Route path="/investimentos/novo" element={<NovoInvestimento />} />
                    <Route path="/investimentos/simulacao" element={<SimulacaoInvestimento />} />
                    {/* ── Transações ── */}
                    <Route path="/transacoes/teclado/:tipo" element={<TecladoValores />} />
                    <Route path="/transacoes/categoria" element={<EscolherCategoria />} />
                    <Route path="/transacoes/tipo" element={<EscolherTipoGasto />} />
                    <Route path="/transacoes" element={<ListaTransacoes />} />
                    <Route path="/view-mensal" element={<ViewMensal />} />
                    <Route path="/view-anual" element={<ViewAnual />} />
                    <Route path="/upload/extrato" element={<UploadExtrato />} />
                    <Route path="/upload/fatura" element={<UploadFatura />} />
                    <Route path="/metas" element={<Metas />} />
                    <Route path="/metas/nova" element={<NovaMeta />} />
                    <Route path="/metas/:id" element={<MetaDetalhes />} />
                  </Routes>
                </main>
                <Fab onClick={toggleMenu} />
                <ActionSheet isOpen={actionSheetOpen} onClose={() => setActionSheetOpen(false)} />
                <BottomNav onAddClick={toggleMenu} />
                <Toast />
              </>
            )
        }
      />
    </Routes>
  )
}

// ── App root: wraps everything in FinanceProvider ──
function App() {
  return (
    <FinanceProvider>
      <AppInner />
    </FinanceProvider>
  )
}

export default App
