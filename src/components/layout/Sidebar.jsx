import { useLocation, Link, useNavigate } from 'react-router-dom'
import { sidebarNavItems } from '../../data/mockData'

function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <i className="bi bi-wallet2"></i>Bolso<span>Direito</span>
      </div>

      <ul className="sidebar-nav">
        {sidebarNavItems.map(item => (
          <li key={item.path}>
            <Link
              to={item.path}
              className={location.pathname === item.path ? 'active' : ''}
            >
              <i className={`bi ${item.icon}`}></i> {item.label}
            </Link>
          </li>
        ))}
      </ul>

      <div className="sidebar-user" onClick={() => navigate('/perfil')} style={{ cursor: 'pointer' }}>
        <div className="sidebar-avatar">US</div>
        <div className="sidebar-user-info">
          <strong>Usuário</strong>
          <small>usuario@email.com</small>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
