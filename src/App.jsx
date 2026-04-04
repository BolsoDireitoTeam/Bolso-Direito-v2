import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

import Sidebar from './components/layout/Sidebar'
import Topbar from './components/layout/Topbar'
import BottomNav from './components/layout/BottomNav'
import Fab from './components/layout/Fab'
import ActionSheet from './components/layout/ActionSheet'

import Login from './pages/Login'
import VisaoGeral from './pages/VisaoGeral'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [actionSheetOpen, setActionSheetOpen] = useState(false)
  const toggleMenu = () => setActionSheetOpen(prev => !prev)

  return (
    <Routes>
      {/* Rota do login — sem sidebar/topbar */}
      <Route
        path="/login"
        element={
          isLoggedIn
            ? <Navigate to="/" replace />
            : <Login onLogin={() => setIsLoggedIn(true)} />
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
                <Sidebar />
                <Topbar />
                <main className="main-content">
                  <Routes>
                    <Route path="/" element={<VisaoGeral onAddClick={toggleMenu} />} />
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