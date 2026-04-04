import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'

import Sidebar from './components/layout/Sidebar'
import Topbar from './components/layout/Topbar'
import BottomNav from './components/layout/BottomNav'
import Fab from './components/layout/Fab'
import ActionSheet from './components/layout/ActionSheet'

import VisaoGeral from './pages/VisaoGeral'

function App() {
  const [actionSheetOpen, setActionSheetOpen] = useState(false)

  const toggleMenu = () => setActionSheetOpen(prev => !prev)
  const closeMenu = () => setActionSheetOpen(false)

  return (
    <>
      {/* Sidebar desktop */}
      <Sidebar />

      {/* Topbar mobile */}
      <Topbar />

      {/* Conteúdo principal */}
      <main className="main-content">
        <Routes>
          <Route path="/" element={<VisaoGeral onAddClick={toggleMenu} />} />
          {/* Rotas futuras */}
          {/* <Route path="/login" element={<Login />} /> */}
          {/* <Route path="/registro" element={<Register />} /> */}
          {/* <Route path="/perfil" element={<Profile />} /> */}
          {/* <Route path="/mensal" element={<MonthlyOverview />} /> */}
          {/* <Route path="/simulacao" element={<InvestmentSimulation />} /> */}
          {/* <Route path="/investimentos" element={<InvestmentPortfolio />} /> */}
          {/* <Route path="/dados" element={<FinancialData />} /> */}
        </Routes>
      </main>

      {/* FAB desktop */}
      <Fab onClick={toggleMenu} />

      {/* Action Sheet overlay + painel */}
      <ActionSheet isOpen={actionSheetOpen} onClose={closeMenu} />

      {/* Bottom Nav mobile */}
      <BottomNav onAddClick={toggleMenu} />
    </>
  )
}

export default App
