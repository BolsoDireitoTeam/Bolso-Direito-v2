import ChangeBadge from '../ui/ChangeBadge'

function BalanceHero({ data }) {
  return (
    <div className="balance-hero h-100">
      <label>Saldo Disponível</label>
      <div className="amount">{data.saldo}</div>
      <div className="d-flex gap-2 flex-wrap">
        <ChangeBadge direction={data.changeDirection} text={`${data.changePct} ${data.changeText}`} />
      </div>
      <hr style={{ borderColor: 'rgba(255,255,255,0.08)', margin: '1.2rem 0 1rem' }} />
      <div className="d-flex gap-4">
        <div>
          <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.45)' }}>Receitas</div>
          <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, color: 'var(--bd-green)' }}>{data.receitas}</div>
        </div>
        <div>
          <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.45)' }}>Despesas</div>
          <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, color: 'var(--bd-red)' }}>{data.despesas}</div>
        </div>
        <div>
          <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.45)' }}>Investido</div>
          <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, color: 'var(--bd-purple)' }}>{data.investido}</div>
        </div>
      </div>
    </div>
  )
}

export default BalanceHero
