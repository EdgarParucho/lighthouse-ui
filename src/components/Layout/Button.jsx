import './button.css'

const Button = ({ type, disabled, onClick, text, modifiers }) => {
  const className = modifiers ? `button button_${modifiers.join(' button_')}` : 'button'

  return <button
  type={type}
  className={className}
  disabled={disabled}
  onClick={onClick}
  >
    {text}
  </button>
}

export default Button