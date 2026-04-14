import { useNavigate, useLocation } from 'react-router-dom'
import { useFinance } from '../../hooks/useFinance'

const actions = [
  { label: 'Novo Ganho',       icon: 'bi-plus-circle',           path: '/transacoes/teclado/ganho' },
  { label: 'Novo Gasto',       icon: 'bi-dash-circle',           path: '/transacoes/teclado/gasto' },
  { label: 'Importar Extrato', icon: 'bi-upload',                path: '/upload/extrato' },
  { label: 'Importar Fatura',  icon: 'bi-credit-card-2-front',   path: '/upload/fatura' },
]

function ActionSheet({ isOpen, onClose }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { virarMes, mostrarToast } = useFinance()

  const handleAction = (path) => {
    onClose()
    navigate(path)
  }

  const { configuracoes, receitasMes, despesasMes, totalFaturaMesAtual } = useFinance()

  const handleVerProjecao = () => {
    const dia = configuracoes.diaVencimentoCartao || '?'
    const sal = configuracoes.diaRecebimentoSalario || '?'
    
    alert(
      `📊 Projeção de Automação\n\n` +
      `Sua consolidação acontecerá no dia ${dia}.\n` +
      `• Recebimento esperado (dia ${sal}): R$ ${receitasMes.toFixed(2)}\n` +
      `• Gastos fixos projetados: R$ ${despesasMes.toFixed(2)}\n` +
      `• Fatura atual do cartão: R$ ${totalFaturaMesAtual.toFixed(2)}\n\n` +
      `O BolsoDireito gerencia isso automaticamente para você.`
    )
    onClose()
  }

  const isHome = location.pathname === '/'

  return (
    <>
      <div
        className={`action-sheet-overlay${isOpen ? ' active' : ''}`}
        onClick={onClose}
      />
      <div className={`action-sheet${isOpen ? ' active' : ''}`}>
        <h3>O que deseja registrar?</h3>
        <div className="action-grid">
          {actions.map(action => (
            <button
              className="action-btn"
              key={action.label}
              onClick={() => handleAction(action.path)}
            >
              <i className={`bi ${action.icon}`}></i>
              {action.label}
            </button>
          ))}
          {isHome && (
            <button
              className="action-btn"
              style={{ gridColumn: '1 / -1', color: 'var(--bd-purple)' }}
              onClick={handleVerProjecao}
            >
              <i className="bi bi-magic"></i>
              Projeção do Mês
            </button>
          )}
        </div>
      </div>
    </>
  )
}

export default ActionSheet
