import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useFinance } from '../hooks/useFinance'
import { moeda, mesAtualLabel } from '../utils/format'
import PageHeader from '../components/ui/PageHeader'
import Card from '../components/ui/Card'
import DoubleLineChart from '../components/charts/DoubleLineChart'

function InvestimentosOverview() {
  const { investimentos, investimentosTotais, calcularValorInvestimento } = useFinance()

  const { montanteTotal, totalInvestido, rendimentoTotal } = investimentosTotais
  const rendPct = totalInvestido > 0
    ? ((rendimentoTotal / totalInvestido) * 100).toFixed(1)
    : '0.0'

  // Gráfico: evolução do montante acumulado vs investido nos últimos 7 meses
  const chartData = useMemo(() => {
    const MESES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
    const hoje = new Date()
    const labels = []
    const efetivo = []
    const esperado = []

    for (let i = 6; i >= 0; i--) {
      const d = new Date(hoje.getFullYear(), hoje.getMonth() - i, 28)
      const ateData = d.toISOString().split('T')[0]
      labels.push(MESES[d.getMonth()])

      let montAcumulado = 0
      let investAcumulado = 0
      investimentos.forEach(inv => {
        const { montante, totalAportado } = calcularValorInvestimento(inv, ateData)
        montAcumulado += montante
        investAcumulado += totalAportado
      })
      efetivo.push(Number(montAcumulado.toFixed(2)))
      esperado.push(Number(investAcumulado.toFixed(2)))
    }
    return { labels, efetivo, esperado }
  }, [investimentos, calcularValorInvestimento])

  return (
    <>
      <PageHeader
        greeting="Dashboard"
        title="Investimentos"
        dateBadge={mesAtualLabel()}
      />

      {/* Row with two summary cards */}
      <div className="row g-3 mb-4">
        <div className="col-6">
          <Card style={{ padding: '1.25rem', height: '100%' }}>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span style={{ fontSize: '0.85rem', color: 'var(--bd-muted)', fontWeight: 500 }}>
                Rendeu
              </span>
              <i className="bi bi-graph-up-arrow" style={{ color: 'var(--bd-teal)' }}></i>
            </div>
            <div className="fs-3 fw-bold" style={{ color: rendimentoTotal >= 0 ? 'var(--bd-green)' : 'var(--bd-red)', fontFamily: "'Syne', sans-serif" }}>
              {rendimentoTotal >= 0 ? '+' : ''}{rendPct}%
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--bd-muted)', marginTop: '0.25rem' }}>
              {moeda(rendimentoTotal)}
            </div>
          </Card>
        </div>
        <div className="col-6">
          <Card style={{ padding: '1.25rem', height: '100%' }}>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span style={{ fontSize: '0.85rem', color: 'var(--bd-muted)', fontWeight: 500 }}>
                Total Invest.
              </span>
              <i className="bi bi-safe" style={{ color: 'var(--bd-teal)' }}></i>
            </div>
            <div className="fs-4 fw-bold" style={{ color: 'var(--bd-text)', fontFamily: "'Syne', sans-serif" }}>
              {moeda(montanteTotal)}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--bd-muted)', marginTop: '0.25rem' }}>
              {investimentos.length} ativo{investimentos.length !== 1 ? 's' : ''}
            </div>
          </Card>
        </div>
      </div>

      {/* Chart Section */}
      <div className="row mb-4">
        <div className="col-12">
          <DoubleLineChart data={chartData} />
        </div>
      </div>

      {/* Bottom Buttons */}
      <div className="d-flex flex-column gap-3">
        <Link 
          to="/investimentos/carteira" 
          className="btn d-flex justify-content-center align-items-center"
          style={{
            background: 'rgba(78,227,160,0.15)',
            border: '1px solid var(--bd-green)',
            color: 'var(--bd-green)',
            borderRadius: '16px',
            padding: '1rem',
            fontSize: '1rem',
            fontWeight: 500,
            textDecoration: 'none',
            transition: 'background 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.background = 'rgba(78,227,160,0.25)'}
          onMouseOut={(e) => e.currentTarget.style.background = 'rgba(78,227,160,0.15)'}
        >
          Minha carteira
        </Link>
        <Link 
          to="/investimentos/simulacao"
          className="btn d-flex justify-content-center align-items-center"
          style={{
            background: 'rgba(78,227,160,0.15)',
            border: '1px solid var(--bd-green)',
            color: 'var(--bd-green)',
            borderRadius: '16px',
            padding: '1rem',
            fontSize: '1rem',
            fontWeight: 500,
            textDecoration: 'none',
            transition: 'background 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.background = 'rgba(78,227,160,0.25)'}
          onMouseOut={(e) => e.currentTarget.style.background = 'rgba(78,227,160,0.15)'}
        >
          Simulação de Investimentos
        </Link>
      </div>
    </>
  )
}

export default InvestimentosOverview
