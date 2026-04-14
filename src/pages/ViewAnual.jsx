// ============================================================
//  Bolso Direito v2 — ViewAnual.jsx
//  Gráfico de barras anual com gastos mês a mês.
//  Origem: app.js L154-201 (v1)
// ============================================================

import { useState, useMemo } from 'react'
import { useFinance } from '../hooks/useFinance'
import { moeda } from '../utils/format'
import PageHeader from '../components/ui/PageHeader'
import Card from '../components/ui/Card'
import GroupedBarChart from '../components/charts/GroupedBarChart'
import PaywallOverlay from '../components/ui/PaywallOverlay'

const MESES_LABEL = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

function ViewAnual() {
  const { transacoes, configuracoes } = useFinance()
  const [ano, setAno] = useState(new Date().getFullYear())

  const isPremium = configuracoes.plano === 'pago'

  const dados = useMemo(() => {
    const receitas = Array(12).fill(0)
    const despesas = Array(12).fill(0)

    transacoes.forEach(tx => {
      if (!tx.data) return
      const [yyyy, mm] = tx.data.split('-').map(Number)
      if (yyyy !== ano) return
      const idx = mm - 1
      if (tx.tipo === 'ganho') receitas[idx] += tx.valor
      else despesas[idx] += tx.valor
    })

    return { receitas, despesas }
  }, [transacoes, ano])

  const totalReceitas = dados.receitas.reduce((a, v) => a + v, 0)
  const totalDespesas = dados.despesas.reduce((a, v) => a + v, 0)
  const economias = Math.max(0, totalReceitas - totalDespesas)

  const chartData = {
    labels: MESES_LABEL,
    receitas: dados.receitas,
    despesas: dados.despesas,
  }

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', position: 'relative', minHeight: '60vh' }}>
      {!isPremium && (
        <PaywallOverlay 
          titulo="Relatórios Anuais PRO" 
          descricao="Visualize a evolução histórica de suas finanças com gráficos detalhados mês a mês."
        />
      )}

      <div style={{ filter: isPremium ? 'none' : 'blur(4px)', pointerEvents: isPremium ? 'auto' : 'none' }}>
        <PageHeader title="Análise Anual" subtitle="Receitas e despesas por mês" />

        {/* Navegação de ano */}
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
            onClick={() => setAno(a => a - 1)}
            style={{ background: 'none', border: 'none', color: 'var(--bd-teal)', cursor: 'pointer', fontSize: '1.2rem', padding: '0.25rem 0.5rem' }}
          >
            <i className="bi bi-chevron-left" />
          </button>
          <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '1.2rem' }}>
            {ano}
          </div>
          <button
            onClick={() => setAno(a => a + 1)}
            style={{ background: 'none', border: 'none', color: 'var(--bd-teal)', cursor: 'pointer', fontSize: '1.2rem', padding: '0.25rem 0.5rem' }}
          >
            <i className="bi bi-chevron-right" />
          </button>
        </div>

        {/* Totais do ano */}
        <div className="row g-3 mb-3">
          {[
            { label: 'Total Receitas', value: totalReceitas, color: 'var(--bd-green)', icon: 'bi-arrow-down-circle' },
            { label: 'Total Despesas', value: totalDespesas, color: 'var(--bd-red)',   icon: 'bi-arrow-up-circle' },
            { label: 'Economias',      value: economias,     color: 'var(--bd-purple)', icon: 'bi-piggy-bank' },
          ].map(s => (
            <div className="col-4" key={s.label}>
              <Card>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                  <i className={`bi ${s.icon}`} style={{ color: s.color, fontSize: '1rem' }} />
                  <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)' }}>{s.label}</span>
                </div>
                <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, color: s.color, fontSize: '1rem' }}>
                  {moeda(s.value)}
                </div>
              </Card>
            </div>
          ))}
        </div>

        {/* Gráfico */}
        <GroupedBarChart data={chartData} />
      </div>
    </div>
  )
}

export default ViewAnual
