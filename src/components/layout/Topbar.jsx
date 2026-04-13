import { useLocation } from 'react-router-dom'
import { sidebarNavItems } from '../../data/mockData'

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
      <div className="topbar-logo">
        <i className="bi bi-wallet2"></i> <span>{pageTitle}</span>
      </div>
      <button
        className="btn btn-sm btn-link text-decoration-none"
        style={{ color: 'var(--bd-muted)' }}
      >
        <i className="bi bi-bell" style={{ fontSize: '1.2rem' }}></i>
      </button>
    </div>
  )
}

export default Topbar
