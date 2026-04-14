import Card from '../ui/Card'
import SectionHeader from '../ui/SectionHeader'
import TransactionItem from './TransactionItem'

function TransactionList({ transactions }) {
  return (
    <Card>
      <SectionHeader
        title="Últimas Transações"
      />
      {transactions.map(tx => (
        <TransactionItem key={tx.id} tx={tx} />
      ))}
    </Card>
  )
}

export default TransactionList
