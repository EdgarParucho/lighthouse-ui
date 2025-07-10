import { useAuth0 } from '@auth0/auth0-react'
import Button from '../Layout/Button'

const AccountMenu = (props) => {
  const { logout } = useAuth0()
  const logoutParams = { returnTo: import.meta.env.VITE_AUTH0_CALLBACK }

  function handleLogout() {
    if (props.demoMode) {
      props.setDemoMode(false)
      window.location.assign('/')
    }
    else logout({ logoutParams })
  }

  return <div className='column-menu'>
    <h3>Account Options</h3>
    {props.demoMode ? null : <Button type='button' modifiers={['w-lg']} text='Update e-mail' onClick={props.showEmailForm} />}
    {props.demoMode ? null : <Button type='button' modifiers={['w-lg']} text='Delete Account' onClick={props.showAccountDeletionAlert} />}
    <Button type='button' modifiers={['w-lg', 'primary']} text='Logout' onClick={handleLogout} />
  </div>
}

export default AccountMenu