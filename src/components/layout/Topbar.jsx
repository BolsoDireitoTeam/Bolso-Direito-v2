import { useLocation } from 'react-router-dom'
import { sidebarNavItems } from '../../data/constants'
import MonthYearPicker from '../ui/MonthYearPicker'

function Topbar() {
  const location = useLocation()

  // Encontrar o label da página atual
  const currentPage = sidebarNavItems.find(item =>
    location.pathname === item.path ||
    (item.path !== '/' && location.pathname.startsWith(item.path))
  )

  const pageTitle = currentPage ? currentPage.label : 'BolsoDireito'

  return (
    <div className="topbar">
      {/* Logo / título da página */}
      <div className="topbar-logo" style={{ flexShrink: 0 }}>
        <i className="bi bi-wallet2"></i> <span>{pageTitle}</span>
      </div>

      {/* Seletor de mês/ano — centro */}
      <div style={{ flex: 1, padding: '0 0.75rem', maxWidth: '180px' }}>
        <MonthYearPicker compact />
      </div>

      {/* Ícone de notificação (placeholder) */}
      <button
        className="btn btn-sm btn-link text-decoration-none"
        style={{ color: 'var(--bd-muted)', flexShrink: 0 }}
      >
        <i className="bi bi-bell" style={{ fontSize: '1.2rem' }}></i>
      </button>
    </div>
  )
}

export default Topbar
