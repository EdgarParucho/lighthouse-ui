import { useAuth0 } from '@auth0/auth0-react'
import { useState } from 'react'
import { UpdateEmail } from '../../services/accountService'
import { validateForm } from '../../utils/formValidator'

const EmailForm = (props) => {
  const { getAccessTokenSilently } = useAuth0()
  const [email, setEmail] = useState('')
  const [confirmation, setConfirmation] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    const formName = e.target.getAttribute('name')
    const formValidationFails = validateForm({ formName, formData: { email } })
    if (formValidationFails) return alert('Please verify the form.')
    props.setQuerying(true)
    const token = await getAccessTokenSilently()
    const { error, message } = await UpdateEmail({ token, values: { email } })
    props.setQuerying(false)
    alert(message)
    if (!error) props.hideDrawer()
  }

  function onEmailChange(e) {
    const { value } = e.target
    setEmail(value)
  }

  function onConfirmationChange(e) {
    const { value } = e.target
    setConfirmation(value)
  }

  return <form onSubmit={handleSubmit} name='emailForm'>
    <label htmlFor='email'>E-mail</label>
    <input
    id='email'
    type='email'
    placeholder='example@mail.com'
    value={email}
    onChange={onEmailChange}
    disabled={props.querying}
    />
    <label htmlFor="confirmation">Confirmation</label>
    <input
    id='confirmation'
    type='email'
    placeholder='example@mail.com'
    value={confirmation}
    onChange={onConfirmationChange}
    disabled={props.querying}
    />
    <button type='button' disabled={props.querying} onClick={props.hideDrawer}>
      Back
    </button>
    <button type='submit' disabled={props.querying || email != confirmation}>
      Update
    </button>
  </form>
}

export default EmailForm
