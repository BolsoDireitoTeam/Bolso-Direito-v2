import { Link } from 'react-router-dom'
import { useFinance } from '../hooks/useFinance'
import { moeda, mesAtualLabel } from '../utils/format'
import PageHeader from '../components/ui/PageHeader'
import PaywallOverlay from '../components/ui/PaywallOverlay'
import Card from '../components/ui/Card'

function CarteiraInvestimentos({ onAddClick }) {
  const { configuracoes, investimentos, calcularValorInvestimento, removerInvestimento, aportarInvestimento, saldo } = useFinance()
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
          title="Ativos Atuais"
          dateBadge={mesAtualLabel()}
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
          </div>
        </PageHeader>

        {investimentos.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'rgba(255,255,255,0.4)' }}>
            <i className="bi bi-safe" style={{ fontSize: '2.5rem', display: 'block', marginBottom: '0.75rem', opacity: 0.4 }} />
            <div style={{ marginBottom: '0.5rem', fontWeight: 600 }}>Nenhum investimento ainda</div>
            <div style={{ fontSize: '0.85rem' }}>Clique em "Novo" para adicionar seu primeiro ativo.</div>
          </div>
        )}

        {/* Grid de investimentos */}
        <div className="row g-3">
          {investimentos.map((inv) => {
            const { montante, rendimento, totalAportado } = calcularValorInvestimento(inv)
            const rendPct = totalAportado > 0 ? ((rendimento / totalAportado) * 100).toFixed(1) : '0.0'
            const isPositive = rendimento >= 0

            return (
              <div className="col-12 col-md-6 col-lg-4" key={inv.id}>
                <Card className="h-100" style={{ padding: '1.25rem' }}>
                  <div style={{ padding: '0.5rem' }}>
                    <div className="d-flex align-items-center mb-3">
                      <div 
                        className="d-flex justify-content-center align-items-center rounded me-3" 
                        style={{ 
                          width: '48px', height: '48px', 
                          background: 'rgba(255,255,255,0.05)',
                          color: inv.cor,
                          border: `1px solid ${inv.cor}40`,
                        }}
                      >
                        <i className={`bi ${inv.icone || 'bi-safe'} fs-4`}></i>
                      </div>
                      <div style={{ flex: 1 }}>
                        <h6 className="mb-0 fw-bold" style={{ fontSize: '1.05rem', color: '#fff' }}>{inv.nome}</h6>
                        <small style={{ color: 'var(--bd-muted)' }}>{inv.tipo}</small>
                      </div>
                      <button 
                        onClick={() => { if(window.confirm(`Resgatar "${inv.nome}"?`)) removerInvestimento(inv.id) }}
                        style={{ background: 'none', border: 'none', color: 'var(--bd-muted)', cursor: 'pointer', fontSize: '0.9rem' }}
                        title="Resgatar investimento"
                      >
                        <i className="bi bi-box-arrow-up-right"></i>
                      </button>
                    </div>
                    
                    <div className="d-flex justify-content-between align-items-end mt-3">
                      <div>
                        <small className="d-block mb-1" style={{ color: 'var(--bd-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          Montante
                        </small>
                        <h5 className="mb-0 fw-bold" style={{ fontFamily: "'Syne', sans-serif", color: 'var(--bd-text)' }}>
                          {moeda(montante)}
                        </h5>
                      </div>
                      <div className="text-end">
                        <small className="d-block mb-1" style={{ color: 'var(--bd-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          Rendimento
                        </small>
                        <div 
                          className="fw-bold d-flex align-items-center justify-content-end gap-1"
                          style={{ color: isPositive ? 'var(--bd-green)' : 'var(--bd-red)' }}
                        >
                          <i className={`bi ${isPositive ? 'bi-graph-up-arrow' : 'bi-graph-down-arrow'}`} style={{ fontSize: '0.85rem' }}></i>
                          {isPositive ? '+' : ''}{rendPct}%
                        </div>
                      </div>
                    </div>

                    {/* Botão de Aporte */}
                    <button 
                      className="w-100 mt-3"
                      style={{
                        background: 'rgba(78,227,196,0.08)',
                        border: '1px solid rgba(78,227,196,0.2)',
                        color: 'var(--bd-teal)',
                        borderRadius: '10px',
                        padding: '0.55rem',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'background 0.2s',
                      }}
                      onClick={() => {
                        const val = prompt(`Aportar quanto em "${inv.nome}"?\nSaldo disponível: ${moeda(saldo)}`)
                        if (val) {
                          const v = parseFloat(val.replace(',', '.'))
                          if (v > 0) aportarInvestimento(inv.id, v)
                        }
                      }}
                    >
                      <i className="bi bi-plus-circle me-1"></i> Novo Aporte
                    </button>

                    <div style={{ fontSize: '0.72rem', color: 'var(--bd-muted)', marginTop: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
                      <span>Taxa: {(inv.taxaMensal * 100).toFixed(2)}%/mês</span>
                      <span>Aportes: {inv.aportes?.length || 0}</span>
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
