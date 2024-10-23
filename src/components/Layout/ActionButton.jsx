import './actionButton.css'

const ActionButton = ({ text, onClick, disabled }) => (
  <button onClick={onClick} className="action-button" disabled={disabled}>
    {text}
  </button>
)

export default ActionButton
