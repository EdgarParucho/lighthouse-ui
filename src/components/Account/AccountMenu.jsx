import LogoutButton from './LogoutButton'
import DeleteAccountButton from './DeleteAccountButton'

const AccountMenu = ({ showEmailForm }) => (
  <div>
    <button type='button' onClick={showEmailForm}>
      Update e-mail
    </button>
    <DeleteAccountButton />
    <LogoutButton />
  </div>
)

export default AccountMenu