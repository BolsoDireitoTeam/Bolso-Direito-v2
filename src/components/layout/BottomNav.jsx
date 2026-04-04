import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const painelItems = [
  {
    path: '/',
    icon: 'bi-grid-1x2',
    label: 'Visão Geral',
    description: 'Resumo do seu mês',
    premium: false,
  },
  {
    path: '/metas',
    icon: 'bi-bullseye',
    label: 'Metas',
    description: 'Acompanhe seus objetivos',
    premium: false,
  },
  {
    path: '/investimentos',
    icon: 'bi-graph-up-arrow',
    label: 'Investimentos',
    description: 'Carteira e rentabilidade',
    premium: true,
  },
]

function BottomNav({ onAddClick }) {
  const [painelOpen, setPainelOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const isPainelActive = ['/', '/metas', '/investimentos'].includes(location.pathname)

  const handlePainelItem = (path) => {
    setPainelOpen(false)
    navigate(path)
  }

  return (
    <>
      {/* ── Overlay ── */}
      <div
        className={`action-sheet-overlay${painelOpen ? ' active' : ''}`}
        onClick={() => setPainelOpen(false)}
      />

      {/* ── Painel Sheet ── */}
      <div className={`action-sheet${painelOpen ? ' active' : ''}`}>
        <h3>Painel</h3>
        <div className="action-grid">
          {painelItems.map((item) => (
            <button
              key={item.path}
              className="action-btn"
              style={{
                position: 'relative',
                opacity: location.pathname === item.path ? 1 : undefined,
                background: location.pathname === item.path
                  ? 'rgba(78,227,196,0.1)'
                  : undefined,
                border: location.pathname === item.path
                  ? '1px solid rgba(78,227,196,0.25)'
                  : undefined,
              }}
              onClick={() => handlePainelItem(item.path)}
            >
              {/* Badge premium */}
              {item.premium && (
                <span style={{
                  position: 'absolute',
                  top: '0.5rem',
                  right: '0.5rem',
                  background: 'linear-gradient(135deg, #f4c864, #f0a830)',
                  color: '#1a1200',
                  fontSize: '0.58rem',
                  fontWeight: 700,
                  letterSpacing: '0.04em',
                  padding: '0.15rem 0.4rem',
                  borderRadius: '6px',
                  textTransform: 'uppercase',
                }}>
                  PRO
                </span>
              )}

              <i className={`bi ${item.icon}`}></i>
              {item.label}
              <span style={{
                fontSize: '0.7rem',
                color: 'var(--bd-muted)',
                fontWeight: 400,
                marginTop: '0.1rem',
              }}>
                {item.description}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Bottom Nav ── */}
      <nav className="bottom-nav">
        <button
          className={`nav-btn${isPainelActive ? ' active' : ''}`}
          onClick={() => setPainelOpen(prev => !prev)}
        >
          <i className="bi bi-grid-1x2" style={{ fontSize: '1.2rem' }}></i>
          <span>Painel</span>
        </button>

        <button className="nav-btn-add" onClick={onAddClick}>
          <i className="bi bi-plus-lg" style={{ fontSize: '1.3rem' }}></i>
        </button>

        <button className="nav-btn">
          <i className="bi bi-person" style={{ fontSize: '1.2rem' }}></i>
          <span>Perfil</span>
        </button>
      </nav>
    </>
  )
}

export default BottomNav
