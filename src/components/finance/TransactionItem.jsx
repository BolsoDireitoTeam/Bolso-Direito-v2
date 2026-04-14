import { moeda, dataFormatada } from '../../utils/format'

/**
 * TransactionItem — adaptado para formato BolsoDB.
 *
 * Formato BolsoDB:
 *   { id, tipo: 'ganho'|'gasto', subtipo: 'debito'|'credito', nome, data: 'YYYY-MM-DD', valor, categoria }
 */
function TransactionItem({ tx }) {
  const isGanho = tx.tipo === 'ganho'

  // ícone baseado em categoria ou tipo
  const categoriaIcons = {
    'Alimentação':  'bi-cart3',
    'Transporte':   'bi-car-front',
    'Moradia':      'bi-house',
    'Saúde':        'bi-heart-pulse',
    'Lazer':        'bi-controller',
    'Educação':     'bi-book',
    'Vestuário':    'bi-bag',
    'Assinaturas':  'bi-music-note-beamed',
    'Outros':       'bi-three-dots',
  }

  const icon = isGanho
    ? 'bi-arrow-down-circle'
    : (categoriaIcons[tx.categoria] ?? 'bi-arrow-up-circle')

  const iconBg = isGanho
    ? 'rgba(78,227,160,0.12)'
    : tx.subtipo === 'credito'
      ? 'rgba(172,182,229,0.12)'
      : 'rgba(240,106,106,0.12)'

  const iconColor = isGanho
    ? 'var(--bd-green)'
    : tx.subtipo === 'credito'
      ? 'var(--bd-purple)'
      : 'var(--bd-red)'

  const amountClass = isGanho ? 'credit' : 'debit'
  const sinal = isGanho ? '+' : '−'

  const subtitulo = [
    dataFormatada(tx.data),
    tx.categoria,
    tx.subtipo === 'credito' && tx.parcelas > 1 ? `${tx.parcelas}x` : null,
  ].filter(Boolean).join(' • ')

  return (
    <div className="tx-item">
      <div className="tx-icon" style={{ background: iconBg, color: iconColor }}>
        <i className={`bi ${icon}`}></i>
      </div>
      <div className="tx-info">
        <strong>{tx.nome}</strong>
        <small>{subtitulo}</small>
      </div>
      <span className={`tx-amount ${amountClass}`}>
        {sinal} {moeda(tx.valor)}
      </span>
    </div>
  )
}

export default TransactionItem
