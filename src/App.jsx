import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { investmentsData } from './data/mockData'

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


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => localStorage.getItem('bd_logado') === 'true'
  )
  const [usuario, setUsuario] = useState(
    () => JSON.parse(localStorage.getItem('bd_usuario')) ?? { nome: "Usuário", saldo: 0, avatar: null }
  )
  const [financeiro, setFinanceiro] = useState(
    () => JSON.parse(localStorage.getItem('bd_financeiro')) ?? null
  )
  const [investimentosList, setInvestimentosList] = useState(() => {
    const saved = localStorage.getItem('bd_investimentos')
    if (saved) return JSON.parse(saved)
    return investmentsData
  })

  const [actionSheetOpen, setActionSheetOpen] = useState(false)
  const toggleMenu = () => setActionSheetOpen(prev => !prev)

  const handleLogin = (dados) => {
    const novoUsuario = { nome: dados.username, saldo: 0, avatar: null }
    setIsLoggedIn(true)
    setUsuario(novoUsuario)
    localStorage.setItem('bd_logado', 'true')
    localStorage.setItem('bd_usuario', JSON.stringify(novoUsuario))
  }

  const handleSalvarUsuario = (dadosAtualizados) => {
    const atualizado = { ...usuario, ...dadosAtualizados }
    setUsuario(atualizado)
    localStorage.setItem('bd_usuario', JSON.stringify(atualizado))
  }

  const handleSalvarFinanceiro = (dadosFinanceiros) => {
    setFinanceiro(dadosFinanceiros)
    localStorage.setItem('bd_financeiro', JSON.stringify(dadosFinanceiros))
  }

  const addInvestimento = (novo) => {
    const updated = [...investimentosList, novo]
    setInvestimentosList(updated)
    localStorage.setItem('bd_investimentos', JSON.stringify(updated))
  }

  return (
    <FinanceProvider>
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
                      <Route path="/perfil" element={<User usuario={usuario} />} />
                      <Route path="/editar-dados-cadastrais" element={<EditarInfoPessoal usuario={usuario} onSalvar={handleSalvarUsuario} />} />
                      <Route path="/editar-dados-financeiros" element={<EditarDadosFinanceiros financeiro={financeiro} onSalvar={handleSalvarFinanceiro} />} />
                      <Route path="/investimentos" element={<InvestimentosOverview />} />
                      <Route path="/investimentos/carteira" element={<CarteiraInvestimentos onAddClick={toggleMenu} investimentos={investimentosList} />} />
                      <Route path="/investimentos/novo" element={<NovoInvestimento onAdd={addInvestimento} />} />
                      <Route path="/investimentos/simulacao" element={<SimulacaoInvestimento />} />
                      {/* ── Novas rotas portadas do v1 ── */}
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
    </FinanceProvider>
  )
}

export default App
