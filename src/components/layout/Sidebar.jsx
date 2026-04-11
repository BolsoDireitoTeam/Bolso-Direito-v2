import { useLocation, Link, useNavigate } from 'react-router-dom'
import { sidebarNavItems } from '../../data/mockData'

function Sidebar({ usuario }) {
  const location = useLocation()
  const navigate = useNavigate()

  const defaultNome = usuario?.nome || 'Usuário'
  const initials = defaultNome.substring(0, 2).toUpperCase()
  const defaultEmail = usuario?.email || `${defaultNome.replace(/\s+/g, '').toLowerCase()}@bolsodireito.com`

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
              className={location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path)) ? 'active' : ''}
            >
              <i className={`bi ${item.icon}`}></i> {item.label}
            </Link>
          </li>
        ))}
      </ul>

      <div className="sidebar-user" onClick={() => navigate('/perfil')} style={{ cursor: 'pointer' }}>
        {usuario?.avatar ? (
          <img src={usuario.avatar} alt="Avatar" className="sidebar-avatar" style={{width: '32px', height: '32px', borderRadius: '50%', border: 'none', objectFit: 'cover'}} />
        ) : (
          <div className="sidebar-avatar">{initials}</div>
        )}
        <div className="sidebar-user-info">
          <strong>{defaultNome}</strong>
          <small>{defaultEmail}</small>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
