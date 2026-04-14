import ProgressBar from '../ui/ProgressBar'

function MetaCard({ meta, onContribute, onRemove }) {
  const diff = meta.valorAlvo - meta.valorAtual
  const pct = Math.min(100, Math.round((meta.valorAtual / meta.valorAlvo) * 100))
  
  return (
    <div className="bd-card mb-3" style={{ borderLeft: `4px solid ${meta.cor}` }}>
      <div className="d-flex justify-content-between align-items-start mb-3">
        <div className="d-flex align-items-center gap-2">
          <div 
            className="meta-icon-circle"
            style={{ backgroundColor: `${meta.cor}15`, color: meta.cor }}
          >
            <i className={`bi ${meta.icone || 'bi-piggy-bank'}`}></i>
          </div>
          <div>
            <h4 className="m-0" style={{ fontSize: '1rem', fontWeight: '700' }}>{meta.nome}</h4>
            <small className="text-muted" style={{ fontSize: '0.75rem' }}>
              Prazo: {meta.prazo || 'Sem prazo'}
            </small>
          </div>
        </div>
        <button 
          className="btn-close-custom"
          onClick={() => { if(window.confirm('Excluir meta?')) onRemove(meta.id) }}
        >
          <i className="bi bi-x"></i>
        </button>
      </div>

      <div className="d-flex justify-content-between mb-1" style={{ fontSize: '0.85rem' }}>
        <span className="fw-bold" style={{ color: meta.cor }}>{pct}%</span>
        <span className="text-muted">Faltam R$ {diff.toLocaleString('pt-BR')}</span>
      </div>

      <ProgressBar 
        value={meta.valorAtual} 
        max={meta.valorAlvo} 
        color={meta.cor} 
        height="8px"
      />

      <div className="d-flex justify-content-between mt-3 align-items-center">
        <div style={{ fontSize: '0.82rem' }}>
          <strong style={{ color: 'var(--bd-text)' }}>R$ {meta.valorAtual.toLocaleString('pt-BR')}</strong>
          <span className="text-muted"> / R$ {meta.valorAlvo.toLocaleString('pt-BR')}</span>
        </div>
        <button 
          className="btn-contribute"
          style={{ backgroundColor: `${meta.cor}20`, color: meta.cor, border: `1px solid ${meta.cor}40` }}
          onClick={() => onContribute(meta)}
        >
          Contribuir
        </button>
      </div>
      
      {meta.agendamento && meta.agendamento.ativo && (
        <div className="meta-badge-autopilot mt-2">
          <i className="bi bi-magic me-1"></i>
          Autopilot: R$ {meta.agendamento.valor.toLocaleString('pt-BR')} no dia {meta.agendamento.dia}
        </div>
      )}
    </div>
  )
}

export default MetaCard
