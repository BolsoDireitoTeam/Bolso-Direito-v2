function ChangeBadge({ direction, text }) {
  return (
    <span className={`change-badge ${direction}`}>
      <i className={`bi ${direction === 'up' ? 'bi-arrow-up-right' : 'bi-arrow-down-right'}`}></i>
      {text}
    </span>
  )
}

export default ChangeBadge
