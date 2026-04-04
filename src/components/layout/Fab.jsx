function Fab({ onClick }) {
  return (
    <button
      className="fab d-none d-lg-flex"
      onClick={onClick}
      aria-label="Adicionar"
    >
      <i className="bi bi-plus-lg"></i>
    </button>
  )
}

export default Fab
