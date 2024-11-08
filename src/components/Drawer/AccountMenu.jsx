import LogoutButton from './LogoutButton'
import DeleteAccountButton from './DeleteAccountButton'

const AccountMenu = (props) => <div>
  <button type='button' onClick={props.showEmailForm}>
    Update e-mail
  </button>
  <DeleteAccountButton />
  <LogoutButton />
</div>

export default AccountMenu