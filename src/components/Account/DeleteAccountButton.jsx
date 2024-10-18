import { useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { DeleteAccount } from '../../services/accountService'

const DeleteAccountButton = () => {
  const [loading, setLoading] = useState(false)
  const { getAccessTokenSilently, logout } = useAuth0()

  async function alertAccountDeletion() {
    const confirmed = confirm('You are about to delete this account with the habits and records associated.\nThis action is irreversible, please confirm to proceed.')
    if (!confirmed) return
    setLoading(true)
    const token = await getAccessTokenSilently()
    const { error, message } = await DeleteAccount({ token })
    alert(message)
    setLoading(false)
    if (error) return
    const logoutParams = { returnTo: import.meta.env.VITE_AUTH0_CALLBACK }
    logout({ logoutParams })
  }

  return <button type='button' onClick={alertAccountDeletion} disabled={loading}>
    Delete Account
  </button>}

export default DeleteAccountButton