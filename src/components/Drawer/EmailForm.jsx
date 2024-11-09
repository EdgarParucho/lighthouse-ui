import { useAuth0 } from '@auth0/auth0-react'
import { useState } from 'react'
import { UpdateEmail } from '../../services/accountService'
import { validateForm } from '../../utils/formValidator'
import Button from '../Layout/Button'

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

  return <div>
    <h3>Email Form</h3>
    <form className='form' onSubmit={handleSubmit} name='emailForm'>
      <fieldset className='form__fieldset'>
        <label className='form__label' htmlFor='email'>E-mail</label>
        <input
        id='email'
        className='form__field'
        type='email'
        placeholder='example@mail.com'
        value={email}
        onChange={onEmailChange}
        disabled={props.querying}
        />
        <label className='form__label' htmlFor="confirmation">Confirmation</label>
        <input
        id='confirmation'
        className='form__field'
        type='email'
        placeholder='example@mail.com'
        value={confirmation}
        onChange={onConfirmationChange}
        disabled={props.querying}
        />
      </fieldset>
      <div className="form__actions">
        <Button type='button' disabled={props.querying} onClick={props.hideDrawer} text='Back' />
        <Button type='submit' modifiers={['primary']} disabled={props.querying || email != confirmation} text='Save' />
      </div>
    </form>
  </div>
}

export default EmailForm
