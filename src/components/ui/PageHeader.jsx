import { useNavigate } from 'react-router-dom'

function PageHeader({ greeting, title, subtitle, dateBadge, backPath, children }) {
  const navigate = useNavigate()

  return (
    <div className="page-header d-flex align-items-start justify-content-between flex-wrap gap-2 mb-4">
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
        {backPath && (
          <button
            onClick={() => navigate(backPath)}
            style={{
              background: 'rgba(255,255,255,0.07)',
              border: 'none',
              borderRadius: '10px',
              width: 36,
              height: 36,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'rgba(255,255,255,0.7)',
              flexShrink: 0,
              marginTop: '0.25rem',
              transition: 'background 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.14)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.07)'}
          >
            <i className="bi bi-arrow-left" style={{ fontSize: '1rem' }} />
          </button>
        )}
        <div>
          {greeting && <p className="greeting">{greeting}</p>}
          <h1>{title}</h1>
          {subtitle && (
            <p style={{ margin: 0, fontSize: '0.82rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.1rem' }}>
              {subtitle}
            </p>
          )}
          {dateBadge && (
            <span className="date-badge">
              <i className="bi bi-calendar3 me-1"></i>
              {dateBadge}
            </span>
          )}
        </div>
      </div>
      {children}
    </div>
  )
}

export default PageHeader
