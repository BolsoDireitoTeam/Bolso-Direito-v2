import Card from '../ui/Card'
import SectionHeader from '../ui/SectionHeader'
import BudgetCategory from './BudgetCategory'

function BudgetList({ categories }) {
  return (
    <Card>
      <SectionHeader
        title="Orçamento"
        linkText="Editar"
        linkIcon="bi-pencil"
      />
      {categories.map(cat => (
        <BudgetCategory key={cat.name} category={cat} />
      ))}
    </Card>
  )
}

export default BudgetList
