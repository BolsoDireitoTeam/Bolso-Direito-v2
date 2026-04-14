import { useState } from 'react'

function ContributeModal({ meta, isOpen, onClose, onConfirmSaldo, onConfirmAgenda }) {
  const [modalMode, setModalMode] = useState('saldo') // 'saldo' | 'agenda'
  const [valor, setValor] = useState('')
  const [dia, setDia] = useState(meta?.agendamento?.dia || 5)

  if (!isOpen || !meta) return null

  const handleConfirm = () => {
    const v = parseFloat(valor)
    if (!v || v <= 0) return alert('Insira um valor válido')

    if (modalMode === 'saldo') {
      onConfirmSaldo(meta.id, v)
    } else {
      onConfirmAgenda(meta.id, { dia, valor: v, ativo: true })
    }
    onClose()
  }

  return (
    <div className="action-sheet-overlay active" onClick={onClose}>
      <div className="action-sheet active" onClick={e => e.stopPropagation()}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="m-0">Contribuir para {meta.nome}</h3>
          <button className="btn-close-custom" onClick={onClose}><i className="bi bi-x"></i></button>
        </div>

        <div className="modal-tabs mb-4">
          <button 
            className={`modal-tab ${modalMode === 'saldo' ? 'active' : ''}`}
            onClick={() => setModalMode('saldo')}
          >
            Redirecionar Saldo
          </button>
          <button 
            className={`modal-tab ${modalMode === 'agenda' ? 'active' : ''}`}
            onClick={() => setModalMode('agenda')}
          >
            Agendar (Autopilot)
          </button>
        </div>

        <div className="mb-4">
          <label className="form-label text-muted" style={{ fontSize: '0.8rem' }}>Valor do Aporte (R$)</label>
          <div className="input-group-bd">
            <span className="input-prefix">R$</span>
            <input 
              type="number" 
              className="input-bd-field" 
              placeholder="0,00"
              value={valor}
              onChange={e => setValor(e.target.value)}
              autoFocus
            />
          </div>
          {modalMode === 'saldo' ? (
            <p className="mt-2 text-muted" style={{ fontSize: '0.72rem' }}>
              Este valor será debitado do seu saldo atual imediatamente.
            </p>
          ) : (
            <div className="mt-3">
              <label className="form-label text-muted" style={{ fontSize: '0.8rem' }}>Dia do mês para salvar</label>
              <input 
                type="range" 
                className="form-range-bd" 
                min="1" max="28" 
                value={dia}
                onChange={e => setDia(parseInt(e.target.value))}
              />
              <div className="d-flex justify-content-between">
                <small className="text-muted">Dia 1</small>
                <small className="fw-bold text-teal">Dia {dia}</small>
                <small className="text-muted">Dia 28</small>
              </div>
              <p className="mt-2 text-muted" style={{ fontSize: '0.72rem' }}>
                O BolsoDireito salvará este valor automaticamente todo mês na data de vencimento configurada.
              </p>
            </div>
          )}
        </div>

        <button 
          className="btn-bd-primary w-100 py-3" 
          onClick={handleConfirm}
        >
          {modalMode === 'saldo' ? 'Confirmar Aporte' : 'Ativar Autopilot'}
        </button>
      </div>
    </div>
  )
}

export default ContributeModal
