import { useAuth0 } from '@auth0/auth0-react'
import { useState } from 'react'
import { UpdateEmail } from '../../services/accountService'

function EmailForm({ hideEmailForm }) {
  const { getAccessTokenSilently } = useAuth0()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    const token = await getAccessTokenSilently()
    const { error, message } = await UpdateEmail({ token, values: { email } })
    alert(message)
    setLoading(false)
    if (!error) hideEmailForm()
  }

  function handleChange(e) {
    const { value } = e.target
    setEmail(value)
  }

  return <form onSubmit={handleSubmit}>
    <label>
      <input type="email" placeholder="example@mail.com" value={email} onChange={handleChange} />
      <button type='button' disabled={loading} onClick={hideEmailForm}>Cancel</button>
      <button type='submit'>Update</button>
    </label>
  </form>
}

export default EmailForm