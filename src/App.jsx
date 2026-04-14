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
import EditarDadosFinanceiros from './pages/EditarDadosFinanceiros'
import InvestimentosOverview from './pages/InvestimentosOverview'
import CarteiraInvestimentos from './pages/CarteiraInvestimentos'
import NovoInvestimento from './pages/NovoInvestimento'
import SimulacaoInvestimento from './pages/SimulacaoInvestimento'
import Metas from './pages/Metas'
import NovaMeta from './pages/NovaMeta'
import MetaDetalhes from './pages/MetaDetalhes'

/* ── Seed data para metas (primeira inicialização) ── */
const defaultMetas = [
  {
    id: 1, emoji: '🏖️', name: 'Viagem', targetValue: 5000, currentValue: 3250,
    color: '#4ee3c4', createdAt: '2025-01-15T00:00:00.000Z',
    aportes: [
      { id: 1001, valor: 2000, data: '2025-01-15', tipo: 'aporte' },
      { id: 1002, valor: 1250, data: '2025-03-10', tipo: 'aporte' },
    ],
  },
  {
    id: 2, emoji: '🚗', name: 'Carro Novo', targetValue: 40000, currentValue: 8800,
    color: '#ACB6E5', createdAt: '2025-02-01T00:00:00.000Z',
    aportes: [
      { id: 2001, valor: 5000, data: '2025-02-01', tipo: 'aporte' },
      { id: 2002, valor: 2000, data: '2025-04-15', tipo: 'aporte' },
      { id: 2003, valor: 1800, data: '2025-06-20', tipo: 'aporte' },
    ],
  },
  {
    id: 3, emoji: '🏠', name: 'Reserva', targetValue: 30000, currentValue: 14400,
    color: '#f4c864', createdAt: '2024-11-01T00:00:00.000Z',
    aportes: [
      { id: 3001, valor: 10000, data: '2024-11-01', tipo: 'aporte' },
      { id: 3002, valor: 2400, data: '2025-01-10', tipo: 'aporte' },
      { id: 3003, valor: 2000, data: '2025-05-01', tipo: 'aporte' },
    ],
  },
  {
    id: 4, emoji: '📱', name: 'iPhone', targetValue: 6000, currentValue: 5400,
    color: '#4ee3a0', createdAt: '2025-03-01T00:00:00.000Z',
    aportes: [
      { id: 4001, valor: 3000, data: '2025-03-01', tipo: 'aporte' },
      { id: 4002, valor: 1500, data: '2025-05-15', tipo: 'aporte' },
      { id: 4003, valor: 900, data: '2025-07-01', tipo: 'aporte' },
    ],
  },
]


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => localStorage.getItem('bd_logado') === 'true'
  )
  const [usuario, setUsuario] = useState(
    () => JSON.parse(localStorage.getItem('bd_usuario')) ?? { nome: "Usuário", saldo: 5000, avatar: null }
  )
  const [financeiro, setFinanceiro] = useState(
    () => JSON.parse(localStorage.getItem('bd_financeiro')) ?? null
  )
  const [investimentosList, setInvestimentosList] = useState(() => {
    const saved = localStorage.getItem('bd_investimentos')
    if (saved) return JSON.parse(saved)
    return investmentsData
  })

  const [metas, setMetas] = useState(() => {
    const saved = localStorage.getItem('bd_metas')
    if (saved) return JSON.parse(saved)
    return defaultMetas
  })

  const [actionSheetOpen, setActionSheetOpen] = useState(false)
  const toggleMenu = () => setActionSheetOpen(prev => !prev)

  const handleLogin = (dados) => {
    const novoUsuario = { nome: dados.username, saldo: 5000, avatar: null }
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

  /* ── Helpers de persistência ── */
  const persistMetas = (novasMetas) => {
    setMetas(novasMetas)
    localStorage.setItem('bd_metas', JSON.stringify(novasMetas))
  }
  const persistUsuario = (novoUsuario) => {
    setUsuario(novoUsuario)
    localStorage.setItem('bd_usuario', JSON.stringify(novoUsuario))
  }

  /* ── CRUD de Metas ── */
  const addMeta = (dados) => {
    const novaMeta = {
      id: Date.now(),
      emoji: dados.emoji,
      name: dados.name,
      targetValue: dados.targetValue,
      currentValue: 0,
      color: dados.color,
      createdAt: new Date().toISOString(),
      aportes: [],
    }
    // Aporte inicial (opcional)
    if (dados.aporteInicial > 0) {
      novaMeta.currentValue = dados.aporteInicial
      novaMeta.aportes.push({
        id: Date.now() + 1,
        valor: dados.aporteInicial,
        data: new Date().toISOString().split('T')[0],
        tipo: 'aporte',
      })
      persistUsuario({ ...usuario, saldo: usuario.saldo - dados.aporteInicial })
    }
    persistMetas([...metas, novaMeta])
  }

  const updateMeta = (id, updates) => {
    persistMetas(metas.map(m => m.id === id ? { ...m, ...updates } : m))
  }

  const deleteMeta = (id) => {
    const meta = metas.find(m => m.id === id)
    if (meta && meta.currentValue > 0) {
      // Devolver saldo alocado
      persistUsuario({ ...usuario, saldo: usuario.saldo + meta.currentValue })
    }
    persistMetas(metas.filter(m => m.id !== id))
  }

  const aporteMeta = (id, valor) => {
    persistMetas(metas.map(m => {
      if (m.id !== id) return m
      return {
        ...m,
        currentValue: m.currentValue + valor,
        aportes: [...m.aportes, {
          id: Date.now(),
          valor,
          data: new Date().toISOString().split('T')[0],
          tipo: 'aporte',
        }],
      }
    }))
    persistUsuario({ ...usuario, saldo: usuario.saldo - valor })
  }

  const resgateMeta = (id, valor) => {
    persistMetas(metas.map(m => {
      if (m.id !== id) return m
      return {
        ...m,
        currentValue: m.currentValue - valor,
        aportes: [...m.aportes, {
          id: Date.now(),
          valor,
          data: new Date().toISOString().split('T')[0],
          tipo: 'resgate',
        }],
      }
    }))
    persistUsuario({ ...usuario, saldo: usuario.saldo + valor })
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
                    <Route path="/" element={<VisaoGeral onAddClick={toggleMenu} usuario={usuario} metas={metas} />} />
                    <Route path="/perfil" element={<User usuario={usuario} />} />
                    <Route path="/editar-dados-cadastrais" element={<EditarInfoPessoal usuario={usuario} onSalvar={handleSalvarUsuario} />} />
                    <Route path="/editar-dados-financeiros" element={<EditarDadosFinanceiros financeiro={financeiro} onSalvar={handleSalvarFinanceiro} />} />
                    <Route path="/metas" element={<Metas metas={metas} usuario={usuario} />} />
                    <Route path="/metas/nova" element={<NovaMeta onAdd={addMeta} saldoDisponivel={usuario.saldo} />} />
                    <Route path="/metas/:id" element={<MetaDetalhes metas={metas} usuario={usuario} onAporte={aporteMeta} onResgate={resgateMeta} onUpdate={updateMeta} onDelete={deleteMeta} />} />
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
