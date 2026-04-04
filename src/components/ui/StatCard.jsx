import Card from './Card'

function StatCard({ icon, iconVariant, title, value, valueClass, meta }) {
  // Para o card "Fatura CC" que usa cor custom (yellow)
  const iconStyles = iconVariant === 'yellow'
    ? { background: 'rgba(244,200,100,0.12)', color: '#f4c864', marginBottom: '1rem' }
    : undefined

  const valueStyle = valueClass === ''
    ? { color: '#f4c864' }
    : undefined

  return (
    <Card>
      <div
        className={`stat-icon${iconVariant !== 'yellow' ? ` ${iconVariant}` : ''}`}
        style={iconStyles}
      >
        <i className={`bi ${icon}`}></i>
      </div>
      <h5>{title}</h5>
      <div
        className={`stat-value${valueClass ? ` ${valueClass}` : ''}`}
        style={valueStyle}
      >
        {value}
      </div>
      <div className="stat-meta">
        {meta.icon && <i className={`bi ${meta.icon} ${meta.colorClass || ''}`}></i>}
        {' '}{meta.text}
        {meta.boldText && (
          <strong style={{ color: meta.boldColor }}> {meta.boldText}</strong>
        )}
      </div>
    </Card>
  )
}

export default StatCard
