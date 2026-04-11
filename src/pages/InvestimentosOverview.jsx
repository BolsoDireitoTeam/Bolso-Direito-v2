import { Link } from 'react-router-dom'
import PageHeader from '../components/ui/PageHeader'
import Card from '../components/ui/Card'
import DoubleLineChart from '../components/charts/DoubleLineChart'

function InvestimentosOverview() {
  const chartData = {
    labels: ['jul', 'ago', 'set', 'out', 'nov', 'dez', 'jan'],
    efetivo: [200, 480, 500, 480, 520, 900, 950],
    esperado: [200, 350, 480, 600, 700, 800, 900]
  }

  return (
    <>
      <PageHeader
        greeting="Dashboard"
        title="Investimentos"
        dateBadge="Abril 2026"
      />

      {/* Row with two summary cards */}
      <div className="row g-3 mb-4">
        <div className="col-6">
          <Card style={{ padding: '1.25rem', height: '100%' }}>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span style={{ fontSize: '0.85rem', color: 'var(--bd-muted)', fontWeight: 500 }}>
                Rendeu
              </span>
              <i className="bi bi-chevron-down" style={{ color: 'var(--bd-teal)', cursor: 'pointer' }}></i>
            </div>
            <div className="fs-3 fw-bold" style={{ color: 'var(--bd-text)', fontFamily: "'Syne', sans-serif" }}>
              +0.7%
            </div>
          </Card>
        </div>
        <div className="col-6">
          <Card style={{ padding: '1.25rem', height: '100%' }}>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span style={{ fontSize: '0.85rem', color: 'var(--bd-muted)', fontWeight: 500 }}>
                Total Invest.
              </span>
              <i className="bi bi-chevron-down" style={{ color: 'var(--bd-teal)', cursor: 'pointer' }}></i>
            </div>
            <div className="fs-4 fw-bold" style={{ color: 'var(--bd-text)', fontFamily: "'Syne', sans-serif" }}>
              R$ 2000,00
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
