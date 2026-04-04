function TransactionItem({ tx }) {
  return (
    <div className="tx-item">
      <div
        className="tx-icon"
        style={{ background: tx.iconBg, color: tx.iconColor }}
      >
        <i className={`bi ${tx.icon}`}></i>
      </div>
      <div className="tx-info">
        <strong>{tx.name}</strong>
        <small>{tx.date}</small>
      </div>
      <span className={`tx-amount ${tx.type}`}>
        {tx.amount}
      </span>
    </div>
  )
}

export default TransactionItem
