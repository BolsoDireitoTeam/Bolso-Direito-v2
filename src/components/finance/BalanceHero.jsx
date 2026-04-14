import ChangeBadge from '../ui/ChangeBadge'
import { moeda } from '../../utils/format'

/**
 * BalanceHero — adaptado para formato BolsoDB.
 *
 * Props:
 *  saldo        {number}  — saldo atual em R$
 *  receitas     {number}  — receitas do mês
 *  despesas     {number}  — despesas do mês
 *  investido    {string}  — valor investido (ainda estático)
 *  changePct    {string}  — ex: "+12,4%" (opcional)
 *  changeDirection {string} — "up" | "down"
 */
function BalanceHero({ saldo = 0, receitas = 0, despesas = 0, investido = 'R$ 0', changePct, changeDirection = 'up' }) {
  const changeText = changePct
    ? `${changePct} vs mês anterior`
    : 'Este mês'

  return (
    <div className="balance-hero h-100">
      <label>Saldo Disponível</label>
      <div className="amount">{moeda(saldo)}</div>
      <div className="d-flex gap-2 flex-wrap">
        <ChangeBadge direction={changeDirection} text={changeText} />
      </div>
      <hr style={{ borderColor: 'rgba(255,255,255,0.08)', margin: '1.2rem 0 1rem' }} />
      <div className="d-flex gap-4">
        <div>
          <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.45)' }}>Receitas</div>
          <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, color: 'var(--bd-green)' }}>{moeda(receitas)}</div>
        </div>
        <div>
          <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.45)' }}>Despesas</div>
          <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, color: 'var(--bd-red)' }}>{moeda(despesas)}</div>
        </div>
        <div>
          <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.45)' }}>Investido</div>
          <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, color: 'var(--bd-purple)' }}>{investido}</div>
        </div>
      </div>
    </div>
  )
}

export default BalanceHero
