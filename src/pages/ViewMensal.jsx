// ============================================================
//  Bolso Direito v2 — ViewMensal.jsx
//  Análise estatística mensal com navegação entre meses.
//  Origem: app.js L112-148 + ui.js L358-399 (v1)
// ============================================================

import { useState, useMemo } from 'react'
import { useFinance } from '../hooks/useFinance'
import { moeda, nomeMes, mesAtual } from '../utils/format'
import PageHeader from '../components/ui/PageHeader'
import Card from '../components/ui/Card'

function avancarMes(mesAno, delta) {
  const [yyyy, mm] = mesAno.split('-').map(Number)
  const d = new Date(yyyy, mm - 1 + delta, 1)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

function ViewMensal() {
  const { transacoes, estado } = useFinance()
  const [mes, setMes] = useState(mesAtual())

  const stats = useMemo(() => {
    const txMes = transacoes.filter(tx => tx.data && tx.data.startsWith(mes))
    const receitas = txMes.filter(t => t.tipo === 'ganho').reduce((a, t) => a + t.valor, 0)
    const despesas = txMes.filter(t => t.tipo === 'gasto').reduce((a, t) => a + t.valor, 0)
    const balanco = receitas - despesas
    const economias = Math.max(0, balanco)
    const maiorDespesa = txMes
      .filter(t => t.tipo === 'gasto')
      .sort((a, b) => b.valor - a.valor)[0] ?? null

    // Gastos por categoria
    const porCategoria = {}
    txMes.filter(t => t.tipo === 'gasto' && t.categoria).forEach(t => {
      porCategoria[t.categoria] = (porCategoria[t.categoria] || 0) + t.valor
    })
    const categoriasMes = Object.entries(porCategoria)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)

    return { receitas, despesas, balanco, economias, maiorDespesa, categoriasMes, total: txMes.length }
  }, [transacoes, mes])

  const statCards = [
    { label: 'Economizou',    value: moeda(stats.economias),  color: 'var(--bd-green)',  icon: 'bi-piggy-bank' },
    { label: 'Gasto Total',   value: moeda(stats.despesas),   color: 'var(--bd-red)',    icon: 'bi-arrow-up-circle' },
    { label: 'Maior Despesa', value: stats.maiorDespesa ? moeda(stats.maiorDespesa.valor) : '—', color: '#f4c864', icon: 'bi-exclamation-triangle' },
    { label: 'Balanço',       value: moeda(stats.balanco),    color: stats.balanco >= 0 ? 'var(--bd-teal)' : 'var(--bd-red)', icon: 'bi-wallet2' },
  ]

  return (
    <div style={{ maxWidth: 640, margin: '0 auto' }}>
      <PageHeader title="Análise Mensal" subtitle="Estatísticas por período" />

      {/* Navegação de meses */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.75rem 1.25rem',
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '14px',
        marginBottom: '1.25rem',
      }}>
        <button
          onClick={() => setMes(m => avancarMes(m, -1))}
          style={{ background: 'none', border: 'none', color: 'var(--bd-teal)', cursor: 'pointer', fontSize: '1.2rem', padding: '0.25rem 0.5rem' }}
        >
          <i className="bi bi-chevron-left" />
        </button>
        <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '1.05rem' }}>
          {nomeMes(mes)}
        </div>
        <button
          onClick={() => setMes(m => avancarMes(m, 1))}
          style={{ background: 'none', border: 'none', color: 'var(--bd-teal)', cursor: 'pointer', fontSize: '1.2rem', padding: '0.25rem 0.5rem' }}
        >
          <i className="bi bi-chevron-right" />
        </button>
      </div>

      {/* Stat Cards */}
      <div className="row g-3 mb-3">
        {statCards.map(s => (
          <div className="col-6" key={s.label}>
            <Card>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
                <div style={{
                  width: 36, height: 36, borderRadius: '10px',
                  background: `${s.color}22`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: s.color, fontSize: '1rem',
                }}>
                  <i className={`bi ${s.icon}`} />
                </div>
                <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.45)' }}>{s.label}</span>
              </div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '1.15rem', color: s.color }}>
                {s.value}
              </div>
              {s.label === 'Maior Despesa' && stats.maiorDespesa && (
                <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.2rem' }}>
                  {stats.maiorDespesa.nome}
                </div>
              )}
            </Card>
          </div>
        ))}
      </div>

      {/* Gastos por categoria */}
      {stats.categoriasMes.length > 0 && (
        <Card>
          <div className="d-flex align-items-center justify-content-between mb-3">
            <span className="section-title">Gastos por Categoria</span>
            <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)' }}>{stats.total} movimentações</span>
          </div>
          {stats.categoriasMes.map(([cat, valor]) => {
            const pct = stats.despesas > 0 ? (valor / stats.despesas) * 100 : 0
            return (
              <div key={cat} style={{ marginBottom: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                  <span style={{ fontSize: '0.84rem', color: 'rgba(255,255,255,0.8)' }}>{cat}</span>
                  <span style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--bd-red)' }}>{moeda(valor)}</span>
                </div>
                <div style={{ height: 6, background: 'rgba(255,255,255,0.07)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    width: `${pct}%`,
                    background: 'linear-gradient(90deg, var(--bd-teal), var(--bd-purple))',
                    borderRadius: 3,
                    transition: 'width 0.4s ease',
                  }} />
                </div>
                <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', marginTop: '0.2rem', textAlign: 'right' }}>
                  {pct.toFixed(0)}% das despesas
                </div>
              </div>
            )
          })}
        </Card>
      )}

      {stats.total === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'rgba(255,255,255,0.3)' }}>
          <i className="bi bi-calendar-x" style={{ fontSize: '2.5rem', display: 'block', marginBottom: '0.75rem' }} />
          <div>Nenhuma movimentação em {nomeMes(mes)}</div>
        </div>
      )}
    </div>
  )
}

export default ViewMensal
