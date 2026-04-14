import { useLocation, Link, useNavigate } from 'react-router-dom'
import { useFinance } from '../../hooks/useFinance'
import { sidebarNavItems } from '../../data/constants'
import MonthYearPicker from '../ui/MonthYearPicker'

function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { usuario } = useFinance()

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

      {/* ── Filtro Global Mês/Ano ── */}
      <div style={{ marginBottom: '1rem' }}>
        <div style={{
          fontSize: '0.65rem',
          color: 'var(--bd-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          fontWeight: 600,
          marginBottom: '0.45rem',
          paddingLeft: '0.1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
        }}>
          <i className="bi bi-calendar3" style={{ fontSize: '0.7rem' }} />
          Período
        </div>
        <MonthYearPicker compact />
      </div>

      {/* ── Usuário ── */}
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
