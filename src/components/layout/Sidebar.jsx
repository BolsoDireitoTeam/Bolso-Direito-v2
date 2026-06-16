import { useLocation, Link, useNavigate } from 'react-router-dom'
import { useAppSelector, useAppDispatch } from '../../store/hooks'
import { selectUsuario, logout } from '../../store/slices/userSlice'
import { sidebarNavItems } from '../../data/constants'
import MonthYearPicker from '../ui/MonthYearPicker'

function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const usuario = useAppSelector(selectUsuario)

  const defaultNome = usuario?.nome || 'Usuário'
  const initials = defaultNome.substring(0, 2).toUpperCase()

  // Exibe apenas a parte antes do @ do email (ex: pedromagno04@gmail.com → pedromagno04)
  const rawEmail = usuario?.email || ''
  const displayHandle = rawEmail.includes('@')
    ? rawEmail.split('@')[0]
    : rawEmail || defaultNome.replace(/\s+/g, '').toLowerCase()

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

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
        <div className="sidebar-user-info" style={{ minWidth: 0, overflow: 'hidden' }}>
          <strong style={{
            display: 'block',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            fontSize: 'clamp(0.72rem, 1.2vw, 0.82rem)',
            maxWidth: '100%',
          }}>{defaultNome}</strong>
          <small style={{
            display: 'block',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            fontSize: 'clamp(0.62rem, 1vw, 0.7rem)',
            color: 'var(--bd-muted)',
            maxWidth: '100%',
          }}>{displayHandle}</small>
        </div>
      </div>

      {/* ── Logout ── */}
      <button
        onClick={handleLogout}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          width: '100%',
          padding: '0.7rem 0.8rem',
          marginTop: '0.5rem',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '10px',
          color: 'var(--bd-muted)',
          fontSize: '0.78rem',
          fontWeight: 500,
          cursor: 'pointer',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(255,80,80,0.08)'
          e.currentTarget.style.color = '#ff6b6b'
          e.currentTarget.style.borderColor = 'rgba(255,80,80,0.15)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
          e.currentTarget.style.color = 'var(--bd-muted)'
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'
        }}
      >
        <i className="bi bi-box-arrow-left" style={{ fontSize: '0.9rem' }}></i>
        Sair
      </button>
    </aside>
  )
}

export default Sidebar
