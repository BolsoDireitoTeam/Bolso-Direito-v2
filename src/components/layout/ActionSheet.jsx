import { actionSheetActions } from '../../data/mockData'

function ActionSheet({ isOpen, onClose }) {
  return (
    <>
      <div
        className={`action-sheet-overlay${isOpen ? ' active' : ''}`}
        onClick={onClose}
      ></div>
      <div className={`action-sheet${isOpen ? ' active' : ''}`}>
        <h3>O que deseja registrar?</h3>
        <div className="action-grid">
          {actionSheetActions.map(action => (
            <button className="action-btn" key={action.label}>
              <i className={`bi ${action.icon}`}></i>
              {action.label}
            </button>
          ))}
        </div>
      </div>
    </>
  )
}

export default ActionSheet
