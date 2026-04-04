import Card from '../ui/Card'
import SectionHeader from '../ui/SectionHeader'
import GoalItem from './GoalItem'

function GoalList({ goals }) {
  return (
    <Card>
      <SectionHeader
        title="Metas"
        linkText="Nova"
        linkIcon="bi-plus"
      />
      {goals.map(goal => (
        <GoalItem key={goal.id} goal={goal} />
      ))}
    </Card>
  )
}

export default GoalList
