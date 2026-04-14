// ============================================================
//  Bolso Direito v2 — AlertaBanner.jsx
//  Exibe alertas de risco financeiro de faturas futuras.
//  Consome useFinance().alertas
// ============================================================

import { useState } from 'react'
import { useFinance } from '../../hooks/useFinance'
import { moeda } from '../../utils/format'

function AlertaBanner() {
  const { alertas } = useFinance()
  const [dismissed, setDismissed] = useState([])

  // Filtra apenas alertas de atenção ou risco e que não foram dispensados
  const relevantes = alertas.filter(
    a => (a.nivel === 'atencao' || a.nivel === 'risco') && !dismissed.includes(a.mesAno)
  )

  if (relevantes.length === 0) return null

  const dismiss = (mesAno) => setDismissed(prev => [...prev, mesAno])

  return (
    <div style={{ marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      {relevantes.map(alerta => {
        const isRisco = alerta.nivel === 'risco'
        const bg = isRisco
          ? 'linear-gradient(135deg, rgba(240,106,106,0.15), rgba(240,106,106,0.08))'
          : 'linear-gradient(135deg, rgba(244,200,100,0.15), rgba(244,200,100,0.08))'
        const border = isRisco ? 'rgba(240,106,106,0.35)' : 'rgba(244,200,100,0.35)'
        const color = isRisco ? 'var(--bd-red)' : '#f4c864'
        const icon = isRisco ? 'bi-exclamation-triangle-fill' : 'bi-exclamation-circle-fill'

        return (
          <div
            key={alerta.mesAno}
            style={{
              background: bg,
              border: `1px solid ${border}`,
              borderRadius: '12px',
              padding: '0.75rem 1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
            }}
          >
            <i className={`bi ${icon}`} style={{ color, fontSize: '1.1rem', flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, color, fontSize: '0.82rem' }}>
                {isRisco ? '⚠️ Risco Financeiro' : '⚡ Atenção'}
              </div>
              <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.78rem', marginTop: '0.15rem' }}>
                Fatura de <strong style={{ color: 'rgba(255,255,255,0.9)' }}>{alerta.mesAno}</strong> —{' '}
                <strong style={{ color }}>{moeda(alerta.totalFatura)}</strong>
                {' '}representa{' '}
                <strong style={{ color }}>{(alerta.percentual * 100).toFixed(0)}%</strong>
                {' '}da sua capacidade ({moeda(alerta.capacidade)}).
              </div>
            </div>
            <button
              onClick={() => dismiss(alerta.mesAno)}
              style={{
                background: 'none',
                border: 'none',
                color: 'rgba(255,255,255,0.35)',
                cursor: 'pointer',
                padding: '0.25rem',
                lineHeight: 1,
                flexShrink: 0,
              }}
              title="Dispensar"
            >
              <i className="bi bi-x" style={{ fontSize: '1rem' }} />
            </button>
          </div>
        )
      })}
    </div>
  )
}

export default AlertaBanner
