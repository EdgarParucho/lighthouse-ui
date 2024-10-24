import { useAuth0 } from '@auth0/auth0-react'
import logo from '../assets/logo.png'

import './startView.css'

const StartView = () => {
  const { isLoading, loginWithRedirect } = useAuth0()
  return (
    <div className='start-view'>
      <img src={logo} alt='lighthouse' className='start-view__image' />
      <button className='start-view__button' onClick={loginWithRedirect} disabled={isLoading}>
        { isLoading ? 'Checking session' : 'Start' }
      </button>
    </div>
  )
}

export default StartView
