import { useNavigate } from 'react-router-dom'
import PageHeader from '../components/ui/PageHeader'
import ProgressBar from '../components/ui/ProgressBar'

function formatBRL(val) {
  return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function Metas({ metas, usuario }) {
  const navigate = useNavigate()

  const totalAlocado = metas.reduce((s, m) => s + m.currentValue, 0)
  const metasAtivas = metas.filter(m => m.currentValue < m.targetValue).length
  const metasConcluidas = metas.filter(m => m.currentValue >= m.targetValue).length

  return (
    <>
      <PageHeader
        greeting="Seus Objetivos"
        title="Metas"
        dateBadge="Abril 2026"
      >
        <button
          className="meta-btn-nova"
          onClick={() => navigate('/metas/nova')}
        >
          <i className="bi bi-plus-lg"></i> Nova Meta
        </button>
      </PageHeader>

      {/* ── Summary Row ── */}
      <div className="row g-3 mb-4">
        {[
          { icon: 'bi-wallet2',  label: 'Saldo Disponível', val: formatBRL(usuario.saldo), color: '#4ee3c4' },
          { icon: 'bi-bullseye', label: 'Total em Metas',   val: formatBRL(totalAlocado),  color: '#ACB6E5' },
          { icon: 'bi-flag',     label: 'Metas Ativas',     val: metasAtivas,              color: '#4ee3a0' },
          { icon: 'bi-trophy',   label: 'Conquistadas',     val: metasConcluidas,          color: '#f4c864' },
        ].map((c, i) => (
          <div className="col-6 col-lg-3" key={i}>
            <div className="meta-summary-card">
              <div
                className="meta-summary-icon"
                style={{ background: `${c.color}1A`, color: c.color }}
              >
                <i className={`bi ${c.icon}`} />
              </div>
              <p className="meta-summary-label">{c.label}</p>
              <p className="meta-summary-value" style={{ color: c.color }}>{c.val}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Metas Grid ── */}
      {metas.length === 0 ? (
        <div className="meta-empty">
          <div className="meta-empty-icon">🎯</div>
          <p>Você ainda não tem nenhuma meta criada.<br />Comece agora!</p>
          <button
            className="meta-btn-nova"
            onClick={() => navigate('/metas/nova')}
          >
            <i className="bi bi-plus-lg"></i> Criar primeira meta
          </button>
        </div>
      ) : (
        <div className="row g-3">
          {metas.map(meta => {
            const pct = meta.targetValue > 0
              ? Math.min(Math.round((meta.currentValue / meta.targetValue) * 100), 100)
              : 0
            const isComplete = pct >= 100

            return (
              <div className="col-12 col-sm-6 col-lg-4" key={meta.id}>
                <div
                  className="meta-card"
                  onClick={() => navigate(`/metas/${meta.id}`)}
                >
                  <div className="meta-card-emoji">{meta.emoji}</div>
                  <div className="meta-card-name">{meta.name}</div>
                  <div className="meta-card-values">
                    {formatBRL(meta.currentValue)} de {formatBRL(meta.targetValue)}
                  </div>
                  <ProgressBar
                    value={meta.currentValue}
                    max={meta.targetValue}
                    color={meta.color}
                    height="8px"
                  />
                  <div className="meta-card-pct" style={{ color: meta.color }}>
                    {pct}%
                  </div>
                  {isComplete && (
                    <div className="meta-badge-complete">
                      <i className="bi bi-check-circle-fill"></i> Conquistada!
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </>
  )
}

export default Metas
