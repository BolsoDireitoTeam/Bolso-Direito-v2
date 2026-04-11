import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
 
import Sidebar from './components/layout/Sidebar'
import Topbar from './components/layout/Topbar'
import BottomNav from './components/layout/BottomNav'
import Fab from './components/layout/Fab'
import ActionSheet from './components/layout/ActionSheet'
 
import Login from './pages/Login'
import Register from './pages/Register'
import VisaoGeral from './pages/VisaoGeral'
import User from './pages/User'
import Investimentos from './pages/Investimentos'
 
 
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => localStorage.getItem('bd_logado') === 'true'
  )
  const [usuario, setUsuario] = useState(
    () => JSON.parse(localStorage.getItem('bd_usuario')) ?? { nome: "Usuário", saldo: 0, avatar: null }
  )
  const [actionSheetOpen, setActionSheetOpen] = useState(false)
  const toggleMenu = () => setActionSheetOpen(prev => !prev)
 
  const handleLogin = (dados) => {
    const novoUsuario = { nome: dados.username, saldo: 0, avatar: null }
    setIsLoggedIn(true)
    setUsuario(novoUsuario)
    localStorage.setItem('bd_logado', 'true')
    localStorage.setItem('bd_usuario', JSON.stringify(novoUsuario))
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
                <Sidebar />
                <Topbar />
                <main className="main-content">
                  <Routes>
                    <Route path="/" element={<VisaoGeral onAddClick={toggleMenu} />} />
                    <Route path="/perfil" element={<User usuario={usuario} />} />
                    <Route path="/investimentos" element={<Investimentos onAddClick={toggleMenu} />} />
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