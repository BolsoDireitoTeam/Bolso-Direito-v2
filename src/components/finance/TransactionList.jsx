import Card from '../ui/Card'
import SectionHeader from '../ui/SectionHeader'
import TransactionItem from './TransactionItem'
import { useNavigate } from 'react-router-dom'

function TransactionList({ transactions }) {
  const navigate = useNavigate()

  return (
    <Card>
      <SectionHeader
        title="Últimas Transações"
        linkText="Ver tudo"
        linkIcon="bi-arrow-right"
        onLinkClick={() => navigate('/transacoes')}
      />
      {!transactions || transactions.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '2rem 1rem',
          color: 'rgba(255,255,255,0.35)',
          fontSize: '0.85rem',
        }}>
          <i className="bi bi-inbox" style={{ fontSize: '2rem', display: 'block', marginBottom: '0.5rem' }} />
          Nenhuma movimentação ainda.
        </div>
      ) : (
        transactions.map(tx => (
          <TransactionItem key={tx.id} tx={tx} />
        ))
      )}
    </Card>
  )
}

export default TransactionList
