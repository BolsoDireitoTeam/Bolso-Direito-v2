import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { investmentsData } from './data/mockData'

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
import InvestimentosOverview from './pages/InvestimentosOverview'
import CarteiraInvestimentos from './pages/CarteiraInvestimentos'
import NovoInvestimento from './pages/NovoInvestimento'
import SimulacaoInvestimento from './pages/SimulacaoInvestimento'


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => localStorage.getItem('bd_logado') === 'true'
  )
  const [usuario, setUsuario] = useState(
    () => JSON.parse(localStorage.getItem('bd_usuario')) ?? { nome: "Usuário", saldo: 0, avatar: null }
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

  const addInvestimento = (novo) => {
    const updated = [...investimentosList, novo]
    setInvestimentosList(updated)
    localStorage.setItem('bd_investimentos', JSON.stringify(updated))
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
                    <Route path="/perfil" element={<User usuario={usuario} />} />
                    <Route path="/editar-dados-cadastrais" element={<EditarInfoPessoal usuario={usuario} onSalvar={handleSalvarUsuario} />} />
                    <Route path="/investimentos" element={<InvestimentosOverview />} />
                    <Route path="/investimentos/carteira" element={<CarteiraInvestimentos onAddClick={toggleMenu} investimentos={investimentosList} />} />
                    <Route path="/investimentos/novo" element={<NovoInvestimento onAdd={addInvestimento} />} />
                    <Route path="/investimentos/simulacao" element={<SimulacaoInvestimento />} />
                  </Routes>
                </main>
                <Fab onClick={toggleMenu} />
                <ActionSheet isOpen={actionSheetOpen} onClose={() => setActionSheetOpen(false)} />
                <BottomNav onAddClick={toggleMenu} />
              </>
            )
        }
      />
    </Routes>
  )
}

export default App
