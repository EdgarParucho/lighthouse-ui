import { useAuth0 } from '@auth0/auth0-react'
import Button from '../Layout/Button'

const AccountMenu = (props) => {
  const { logout } = useAuth0()
  const logoutParams = { returnTo: import.meta.env.VITE_AUTH0_CALLBACK }

  return <div className='column-menu'>
    <h3>Account Options</h3>
    <Button type='button' modifiers={['w-lg']} text='Update e-mail' onClick={props.showEmailForm} />
    <Button type='button' modifiers={['w-lg']} text='Delete Account' onClick={props.showAccountDeletionAlert} />
    <Button type='button' modifiers={['w-lg', 'primary']} text='Logout' onClick={() => logout({ logoutParams })} />
  </div>
}

export default AccountMenu