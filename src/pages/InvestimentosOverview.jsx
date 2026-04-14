import { useState } from 'react'
import { Link } from 'react-router-dom'
import PageHeader from '../components/ui/PageHeader'
import Card from '../components/ui/Card'
import DoubleLineChart from '../components/charts/DoubleLineChart'
import LineChart from '../components/charts/LineChart'
import { investmentsData } from '../data/mockData'

function InvestimentosOverview() {
  const [showDetails, setShowDetails] = useState(false)
  const chartData = {
    labels: ['jul', 'ago', 'set', 'out', 'nov', 'dez', 'jan'],
    efetivo: [200, 480, 500, 480, 520, 900, 950],
    esperado: [200, 350, 480, 600, 700, 800, 900]
  }

  const getIndividualChartData = (inv) => {
    const num = Number(inv.value.replace(/[^0-9,-]+/g,"").replace(",","."));
    const isUp = inv.returnLastWeek.includes('+')
    const finalMult = isUp ? 1.02 : 0.98;
    return {
      labels: ['M1', 'M2', 'M3', 'M4'],
      data: [(num * 0.9).toFixed(2), (num * 0.95).toFixed(2), (num * 1.0).toFixed(2), (num * finalMult).toFixed(2)]
    }
  }

  return (
    <>
      <PageHeader
        greeting="Dashboard"
        title="Investimentos"
        dateBadge="Abril 2026"
      />

      {/* Row with two summary cards */}
      <div className="row g-3 mb-3">
        <div className="col-6">
          <Card style={{ padding: '1.25rem', height: '100%' }}>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span style={{ fontSize: '0.85rem', color: 'var(--bd-muted)', fontWeight: 500 }}>
                Rendeu
              </span>
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
            </div>
            <div className="fs-4 fw-bold" style={{ color: 'var(--bd-text)', fontFamily: "'Syne', sans-serif" }}>
              R$ 2000,00
            </div>
          </Card>
        </div>
      </div>

      {/* Botão diferentinho de Toggle */}
      <div className="d-flex justify-content-end mb-3">
        <button 
          onClick={() => setShowDetails(!showDetails)}
          className="btn btn-sm text-uppercase fw-bold d-flex align-items-center gap-2"
          style={{
            background: showDetails ? 'rgba(172,182,229,0.15)' : 'linear-gradient(45deg, var(--bd-teal), #2b5c53)',
            color: showDetails ? 'var(--bd-purple)' : '#1a2236',
            borderRadius: '20px',
            fontSize: '0.75rem',
            letterSpacing: '0.5px',
            border: showDetails ? '1px solid var(--bd-purple)' : 'none',
            padding: '0.5rem 1rem',
            boxShadow: showDetails ? 'none' : '0 4px 10px rgba(78,227,196,0.2)',
            transition: 'all 0.3s'
          }}
        >
          <i className={`bi ${showDetails ? 'bi-bar-chart' : 'bi-grid'}`}></i>
          {showDetails ? 'Voltar ao Overview' : 'Detalhar por Ativo'}
        </button>
      </div>

      {/* Chart Section */}
      <div className="row mb-4 g-3">
        {!showDetails ? (
           <div className="col-12">
             <DoubleLineChart data={chartData} />
           </div>
        ) : (
           investmentsData.map((inv) => (
             <div className="col-12 col-md-6 col-xl-4" key={inv.id}>
                <LineChart data={getIndividualChartData(inv)} title={inv.name} />
             </div>
           ))
        )}
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
