function Topbar() {
  return (
    <div className="topbar">
      <div className="topbar-logo">
        <i className="bi bi-wallet2"></i> Bolso<span>Direito</span>
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
