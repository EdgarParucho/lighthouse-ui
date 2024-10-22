import { useAuth0 } from '@auth0/auth0-react'
import { useState } from 'react'
import { UpdateEmail } from '../../services/accountService'
import { validateForm } from '../../utils/formValidator'

const EmailForm = (props) => {
  const { getAccessTokenSilently } = useAuth0()
  const [email, setEmail] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    const formName = e.target.getAttribute('name')
    const formValidationFails = validateForm({ formName, formData: { email } })
    if (formValidationFails) return alert('Please verify the form.')
    props.setLoading(true)
    const token = await getAccessTokenSilently()
    const { error, message } = await UpdateEmail({ token, values: { email } })
    props.setLoading(false)
    alert(message)
    if (!error) props.hideDrawer()
  }

  function handleChange(e) {
    const { value } = e.target
    setEmail(value)
  }

  return <form onSubmit={handleSubmit} name='emailForm'>
    <label>
      <input
      type='email'
      placeholder='example@mail.com'
      value={email}
      onChange={handleChange}
      disabled={props.loading}
      />
      <button type='button' disabled={props.loading} onClick={props.hideDrawer}>
        Cancel
      </button>
      <button type='submit' disabled={props.loading}>
        Update
      </button>
    </label>
  </form>
}

export default EmailForm
