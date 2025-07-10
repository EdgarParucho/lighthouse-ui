import { useEffect, useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { CreateRecord, UpdateRecord } from '../../services/recordService'
import { isoDate } from '../../utils/dateUtils'
import { validateForm } from '../../utils/formValidator'
import { recordRulesValidator } from '../../utils/businessValidations'
import Button from '../Layout/Button'

const RecordForm = (props) => {
  const { getAccessTokenSilently } = useAuth0()
  const [formData, setFormData] = useState({
    date: isoDate,
    note: '',
    habitID: props.habits[0].id
  })
  const [editing, setEditing] = useState(false)
  const [lock, setLock] = useState(true)
  const [unaltered, setUnaltered] = useState(true)
  const [querying, setQuerying] = useState(false)

  useEffect(() => {
    if (props.data?.id) setEditing(true)
    if (props.data != null) setFormData({
      date: props.data.date,
      note: props.data.note ?? '',
      habitID: props.data.habitID,
    })
  }, [])

  useEffect(() => {
    if (editing) {
      if (formData.date != props.data.date) setUnaltered(false)
      else if (formData.note != props.data.note) setUnaltered(false)
      else if (formData.habitID != props.data.habitID) setUnaltered(false)
      else setUnaltered(true)
    }
  }, [formData])

  function getFormChanges() {
    const dateChanged = formData.date != props.data.date
    const noteChanged = formData.note != props.data.note
    const habitChanged = formData.habitID != props.data.habitID
    const updatedValues = {}
    if (noteChanged) updatedValues.note = formData.note
    if (dateChanged) updatedValues.date = formData.date
    if (habitChanged) updatedValues.habitID = formData.habitID
    return updatedValues
  }

  function handleChange(e) {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const formName = e.target.getAttribute('name')
    const formValidationFails = validateForm({ formName, formData, editing })
    if (formValidationFails) return props.showAlert('Please verify the form.')
    const rulesValidation = recordRulesValidator({
      record: formData,
      records: editing
        ? props.records.filter(r => r.id != props.data.id)
        : props.records,
      habits: props.habits
    })
    if (rulesValidation.failed) return props.showAlert(rulesValidation.message)
    setQuerying(true)
    const token = props.demoMode ? null : await getAccessTokenSilently()
    const values = editing ? getFormChanges() : { ...formData }
    const { error, data, message } = (editing)
      ? await UpdateRecord({ token, recordID: props.data.id, values }, { demoMode: props.demoMode })
      : await CreateRecord({ token, values }, { demoMode: props.demoMode })
    props.showAlert(message)
    setQuerying(false)
    if (error) return
    const newRecords = [...props.records]
    if (editing) {
      const updatedIndex = newRecords.findIndex(record => record.id == props.data.id)
      newRecords[updatedIndex] = { ...newRecords[updatedIndex], ...formData }
    } else newRecords.push({ ...data })
    props.setRecords(newRecords)
    props.hideDrawer()
  }

  return <>
  <h3>Record Form</h3>
  <form className='form' name='recordForm' onSubmit={handleSubmit}>
    <fieldset className='form__fieldset'>
      <label className='form__label' htmlFor='record-habit-id'>
        Habit
      </label>
      <select
      id='record-habit-id'
      className='form__field'
      name="habitID"
      required
      value={formData.habitID}
      onChange={handleChange}
      disabled={querying || (editing && lock)}
      >
        { props.habits.map(({id, name }) => <option value={id} key={id}>{name}</option>) }
      </select>
      <label className='form__label' htmlFor='record-date'>
        Date
      </label>
      <input
      id='record-date'
      className='form__field'
      type="date"
      name='date'
      required
      value={formData.date}
      onChange={handleChange}
      disabled={querying || (editing && lock)}
      />
      <label>
        <textarea
        className='form__field form__field_lg'
        name='note'
        placeholder='Note (optional)'
        maxLength={2000}
        value={formData.note}
        onChange={handleChange}
        disabled={querying || (editing && lock)}
        ></textarea>
      </label>
    </fieldset>
    <div className="form__actions">
      <Button type="button" disabled={querying} onClick={props.hideDrawer} text='Back' />
      { (editing && lock) &&
        <Button
        type="button"
        disabled={querying}
        onClick={() => setLock(false)}
        text='Edit' />
      }
      { (!editing || !lock) &&
        <Button
        type="submit"
        disabled={querying || (editing && unaltered)}
        text='Save'
        modifiers={['primary']} />
      }
      { editing &&
        <Button
        type="button"
        disabled={querying}
        onClick={props.showRecordDeletionAlert}
        text='Delete' />
      }
    </div>
  </form>
  </>
}

export default RecordForm
