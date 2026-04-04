import ProgressBar from '../ui/ProgressBar'

function GoalItem({ goal }) {
  return (
    <div className="goal-item">
      <div className="goal-header">
        <span className="goal-name">{goal.emoji} {goal.name}</span>
        <span className="goal-pct">{goal.pct}%</span>
      </div>
      <ProgressBar
        value={goal.current}
        max={goal.target}
        color={goal.color}
        height="7px"
      />
      <div className="goal-sub">
        R$ {goal.current.toLocaleString('pt-BR')} de R$ {goal.target.toLocaleString('pt-BR')}
      </div>
    </div>
  )
}

export default GoalItem
