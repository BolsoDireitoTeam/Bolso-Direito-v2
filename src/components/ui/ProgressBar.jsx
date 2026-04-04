function ProgressBar({ value, max, color, height = '6px' }) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0

  return (
    <div className="progress" style={{ height }}>
      <div
        className="progress-bar"
        style={{ width: `${pct}%`, background: color }}
      ></div>
    </div>
  )
}

export default ProgressBar
