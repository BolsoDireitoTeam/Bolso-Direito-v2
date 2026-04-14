// ============================================================
//  MonthYearPicker.jsx
//  Seletor compacto de mês/ano para Sidebar e Topbar.
//  Lê e escreve mesAnoFiltro no FinanceContext.
// ============================================================

import { useMemo } from 'react'
import { useFinance } from '../../hooks/useFinance'
import { nomeMes, mesAtual } from '../../utils/format'

// Gera N meses passados + 1 futuro a partir do mês atual
function gerarMeses(passados = 23, futuros = 1) {
  const meses = []
  const agora = new Date()
  for (let i = passados; i >= -futuros; i--) {
    const d = new Date(agora.getFullYear(), agora.getMonth() - i, 1)
    const yyyy = d.getFullYear()
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    meses.push(`${yyyy}-${mm}`)
  }
  return meses
}

function MonthYearPicker({ compact = false }) {
  const { mesAnoFiltro, setMesAnoFiltro } = useFinance()
  const hoje = mesAtual()

  const meses = useMemo(() => gerarMeses(23, 1), [])

  const idxAtual = meses.indexOf(mesAnoFiltro)

  const navAnterior = () => {
    if (idxAtual > 0) setMesAnoFiltro(meses[idxAtual - 1])
  }
  const navProximo = () => {
    if (idxAtual < meses.length - 1) setMesAnoFiltro(meses[idxAtual + 1])
  }

  const isHoje = mesAnoFiltro === hoje

  // Label curto para sidebar (ex: "Abr 2026") vs longo para outros contextos
  const label = (() => {
    if (!mesAnoFiltro) return ''
    const [yyyy, mm] = mesAnoFiltro.split('-').map(Number)
    const nomesCurtos = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez']
    return compact
      ? `${nomesCurtos[mm - 1]} ${yyyy}`
      : nomeMes(mesAnoFiltro)
  })()

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '12px',
      padding: compact ? '0.4rem 0.6rem' : '0.5rem 0.75rem',
      gap: '0.3rem',
      position: 'relative',
    }}>
      {/* Badge "Hoje" */}
      {isHoje && (
        <span style={{
          position: 'absolute',
          top: '-7px', right: '8px',
          background: 'var(--bd-teal)',
          color: 'var(--bd-navy)',
          fontSize: '0.58rem',
          fontWeight: 800,
          padding: '1px 6px',
          borderRadius: '10px',
          letterSpacing: '0.03em',
          textTransform: 'uppercase',
        }}>
          atual
        </span>
      )}

      {/* Botão anterior */}
      <button
        onClick={navAnterior}
        disabled={idxAtual <= 0}
        style={{
          background: 'none', border: 'none',
          color: idxAtual <= 0 ? 'rgba(255,255,255,0.15)' : 'var(--bd-muted)',
          cursor: idxAtual <= 0 ? 'default' : 'pointer',
          padding: '0.1rem 0.3rem',
          fontSize: '0.9rem',
          lineHeight: 1,
          transition: 'color 0.15s',
          display: 'flex', alignItems: 'center',
        }}
        title="Mês anterior"
      >
        <i className="bi bi-chevron-left" />
      </button>

      {/* Seletor dropdown */}
      <select
        value={mesAnoFiltro}
        onChange={e => setMesAnoFiltro(e.target.value)}
        style={{
          background: 'transparent',
          border: 'none',
          color: isHoje ? 'var(--bd-teal)' : 'var(--bd-text)',
          fontFamily: "'Syne', sans-serif",
          fontWeight: 700,
          fontSize: compact ? '0.78rem' : '0.85rem',
          cursor: 'pointer',
          outline: 'none',
          textAlign: 'center',
          flex: 1,
          minWidth: 0,
          appearance: 'none',
          WebkitAppearance: 'none',
        }}
        title="Selecionar mês"
      >
        {meses.map(m => (
          <option key={m} value={m} style={{ background: '#1a2236', color: '#fff' }}>
            {nomeMes(m)}
          </option>
        ))}
      </select>

      {/* Botão próximo */}
      <button
        onClick={navProximo}
        disabled={idxAtual >= meses.length - 1}
        style={{
          background: 'none', border: 'none',
          color: idxAtual >= meses.length - 1 ? 'rgba(255,255,255,0.15)' : 'var(--bd-muted)',
          cursor: idxAtual >= meses.length - 1 ? 'default' : 'pointer',
          padding: '0.1rem 0.3rem',
          fontSize: '0.9rem',
          lineHeight: 1,
          transition: 'color 0.15s',
          display: 'flex', alignItems: 'center',
        }}
        title="Próximo mês"
      >
        <i className="bi bi-chevron-right" />
      </button>
    </div>
  )
}

export default MonthYearPicker
