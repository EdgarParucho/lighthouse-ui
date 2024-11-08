import { useEffect, useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { CreateRecord, UpdateRecord } from '../../services/recordService'
import { isoDate } from '../../utils/dateUtils'
import { validateForm } from '../../utils/formValidator'
import { recordRulesValidator } from '../../utils/businessValidations'

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
    if (formValidationFails) return alert('Please verify the form.')
    const rulesValidation = recordRulesValidator({
      record: formData,
      records: editing
        ? props.records.filter(r => r.id != props.data.id)
        : props.records,
      habits: props.habits
    })
    if (rulesValidation.failed) return alert(rulesValidation.message)
    props.setQuerying(true)
    const token = await getAccessTokenSilently()
    const values = editing ? getFormChanges() : { ...formData }
    const { error, data, message } = (editing)
      ? await UpdateRecord({ token, recordID: props.data.id, values })
      : await CreateRecord({ token, values })
    alert(message)
    props.setQuerying(false)
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
  <form onSubmit={handleSubmit} name='recordForm'>
    <label>
      <select
      name="habitID"
      required
      value={formData.habitID}
      onChange={handleChange}
      disabled={props.querying || (editing && lock)}
      >
        { props.habits.map(habit => <option value={habit.id} key={habit.id}>{habit.name}</option>) }
      </select>
    </label>
    <label>
      <input
      type="date"
      name='date'
      value={formData.date}
      onChange={handleChange}
      disabled={props.querying || (editing && lock)}
      required />
      </label>
    <label>
      <textarea
      placeholder='Note'
      maxLength={2000}
      name='note'
      value={formData.note}
      onChange={handleChange}
      disabled={props.querying || (editing && lock)}
      ></textarea>
    </label>
    <button type="button" disabled={props.querying} onClick={props.hideDrawer}>
      Back
    </button>
    { editing && lock
    ? <button type="button" disabled={props.querying} onClick={() => setLock(false)}>
      Edit
    </button>
    : <button type="submit" disabled={props.querying || (editing && unaltered)}>
      Save
    </button>}
    {editing && <button type="button" disabled={props.querying} onClick={props.showRecordDeletionAlert}>
      Delete
    </button>}
  </form>
  </>
}

export default RecordForm
