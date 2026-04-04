import ProgressBar from '../ui/ProgressBar'

function BudgetCategory({ category }) {
  return (
    <div className="cat-row">
      <div className="cat-label">
        {category.name}
        <span>R$ {category.spent.toLocaleString('pt-BR')} / R$ {category.total.toLocaleString('pt-BR')}</span>
      </div>
      <ProgressBar
        value={category.spent}
        max={category.total}
        color={category.color}
      />
    </div>
  )
}

export default BudgetCategory
