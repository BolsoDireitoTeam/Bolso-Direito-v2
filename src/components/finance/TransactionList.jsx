import Card from '../ui/Card'
import SectionHeader from '../ui/SectionHeader'
import TransactionItem from './TransactionItem'

function TransactionList({ transactions }) {
  return (
    <Card>
      <SectionHeader
        title="Últimas Transações"
        linkText="Ver tudo"
        linkIcon="bi-arrow-right"
      />
      {transactions.map(tx => (
        <TransactionItem key={tx.id} tx={tx} />
      ))}
    </Card>
  )
}

export default TransactionList
