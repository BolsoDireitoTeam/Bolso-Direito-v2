function Card({ children, className = '' }) {
  return (
    <div className={`bd-card ${className}`}>
      {children}
    </div>
  )
}

export default Card
