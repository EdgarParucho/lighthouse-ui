import { useAuth0 } from '@auth0/auth0-react'
import logo from '../assets/logo.png'
import Button from '../components/Layout/Button'
import './startView.css'

const StartView = () => {
  const { isLoading, loginWithRedirect } = useAuth0()
  return (
    <div className='start-view'>
      <Button
      type='button'
      disabled={isLoading}
      onClick={loginWithRedirect}
      modifiers={['primary', 'mx-auto', 'pulse']}
      text={ isLoading ? 'Loading' : 'Start' }
      />
      <figure className='start-view__image-container'>
        <img src={logo} alt='lighthouse' className='start-view__image' />
      </figure>
    </div>
  )
}

export default StartView
