import { useAuth0 } from '@auth0/auth0-react'
import ActionButton from '../components/Layout/ActionButton'
import logo from '../assets/logo.png'
import './startView.css'

const StartView = () => {
  const { isLoading, loginWithRedirect } = useAuth0()
  return (
    <div className='start-view'>
      <h1 className="title">Lighthouse</h1>
      <h3 className="subtitle">Habit Tracker</h3>
      <ActionButton
        onClick={loginWithRedirect}
        text={isLoading ? 'Loading' : 'Start'}
        disabled={isLoading}
      />
      <img src={logo} alt='lighthouse' className='logo' />
    </div>
  )
}

export default StartView
