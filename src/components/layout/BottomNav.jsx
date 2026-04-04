function BottomNav({ onAddClick }) {
  return (
    <nav className="bottom-nav">
      <button className="nav-btn active">
        <i className="bi bi-grid-1x2" style={{ fontSize: '1.2rem' }}></i>
        <span>Painel</span>
      </button>
      <button className="nav-btn">
        <i className="bi bi-arrow-left-right" style={{ fontSize: '1.2rem' }}></i>
        <span>Transações</span>
      </button>
      <button className="nav-btn-add" onClick={onAddClick}>
        <i className="bi bi-plus-lg" style={{ fontSize: '1.3rem' }}></i>
      </button>
      <button className="nav-btn">
        <i className="bi bi-bar-chart-line" style={{ fontSize: '1.2rem' }}></i>
        <span>Relatórios</span>
      </button>
      <button className="nav-btn">
        <i className="bi bi-person" style={{ fontSize: '1.2rem' }}></i>
        <span>Perfil</span>
      </button>
    </nav>
  )
}

export default BottomNav
