import { Link } from 'react-router-dom'
import { useFinance } from '../hooks/useFinance'
import PageHeader from '../components/ui/PageHeader'
import PaywallOverlay from '../components/ui/PaywallOverlay'
import Card from '../components/ui/Card'

function CarteiraInvestimentos({ onAddClick, investimentos }) {
  const { configuracoes } = useFinance()
  const isPremium = configuracoes.plano === 'pago'

  return (
    <div style={{ position: 'relative', minHeight: '60vh' }}>
      {!isPremium && (
        <PaywallOverlay 
          titulo="Carteira Pro" 
          descricao="Monitore a evolução do seu patrimônio, rendimentos mensais e diversificação de ativos."
        />
      )}

      <div style={{ filter: isPremium ? 'none' : 'blur(4px)', pointerEvents: isPremium ? 'auto' : 'none' }}>
        <PageHeader
          greeting="Minha Carteira"
          title="Ativos Actuais"
          dateBadge="Abril 2026"
        >
          <div className="d-flex align-items-center gap-2">
            <Link
              to="/investimentos/novo"
              className="btn d-flex align-items-center gap-2"
              style={{
                background: 'rgba(78,227,196,0.1)',
                border: '1px solid rgba(78,227,196,0.3)',
                color: 'var(--bd-teal)',
                borderRadius: '12px',
                fontSize: '0.85rem',
                padding: '0.5rem 1rem',
                textDecoration: 'none'
              }}
            >
              <i className="bi bi-plus-lg"></i> Novo
            </Link>
            {!isPremium && (
              <button
                className="btn d-none d-lg-flex align-items-center gap-2"
                style={{
                  background: 'linear-gradient(135deg, #f4c864, #f0a830)',
                  border: 'none',
                  color: '#1a1200',
                  borderRadius: '12px',
                  fontSize: '0.85rem',
                  padding: '0.5rem 1rem',
                  fontWeight: '600'
                }}
              >
                <i className="bi bi-star-fill"></i> Carteira PRO
              </button>
            )}
          </div>
        </PageHeader>

        {/* Row for cards (Responsive Mobile-first) */}
        <div className="row g-3">
          {investimentos.map((inv) => {
            const isPositive = inv.returnLastWeek.includes('+');
            return (
              <div className="col-12 col-md-6 col-lg-4" key={inv.id}>
                <Card className="h-100" style={{ padding: '1.25rem' }}>
                  <div style={{ padding: '1.25rem' }}>
                      <div className="d-flex align-items-center mb-3">
                      <div 
                          className="d-flex justify-content-center align-items-center rounded me-3" 
                          style={{ 
                          width: '48px', 
                          height: '48px', 
                          background: 'rgba(255,255,255,0.05)',
                          color: inv.color,
                          border: `1px solid ${inv.color}40`,
                          boxShadow: `0 4px 12px ${inv.color}20`
                          }}
                      >
                          <i className={`bi ${inv.icon} fs-4`}></i>
                      </div>
                      <div>
                          <h6 className="mb-0 fw-bold" style={{ fontSize: '1.05rem', color: '#fff' }}>{inv.name}</h6>
                          <small style={{ color: 'var(--bd-muted)' }}>{inv.type}</small>
                      </div>
                      </div>
                      
                      <div className="d-flex justify-content-between align-items-end mt-4">
                      <div>
                          <small className="d-block mb-1" style={{ color: 'var(--bd-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          Saldo Atual
                          </small>
                          <h5 className="mb-0 fw-bold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                          {inv.value}
                          </h5>
                      </div>
                      <div className="text-end">
                          <small className="d-block mb-1" style={{ color: 'var(--bd-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          Rentab. (7d)
                          </small>
                          <div 
                          className="fw-bold d-flex align-items-center justify-content-end gap-1"
                          style={{ color: isPositive ? 'var(--bd-green)' : 'var(--bd-red)' }}
                          >
                          <i className={`bi ${isPositive ? 'bi-graph-up-arrow' : 'bi-graph-down-arrow'}`} style={{ fontSize: '0.85rem' }}></i>
                          {inv.returnLastWeek}
                          </div>
                      </div>
                      </div>
                  </div>
                </Card>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default CarteiraInvestimentos
