import { useEffect, useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { CreateRecord, UpdateRecord } from '../../services/recordService'
import { isoDate } from '../../utils/dateUtils'
import { validateForm } from '../../utils/formValidator'
import { recordRulesValidator } from '../../utils/businessValidations'

const RecordForm = (props) => {
  const { getAccessTokenSilently } = useAuth0()
  const [formData, setFormData] = useState({ date: isoDate, note: '', habitID: '' })
  const [updating, setUpdating] = useState(false)
  const [changeDetected, setChangeDetected] = useState(true)

  useEffect(() => {
    if (props.selection != null) {
      setUpdating(true)
      setFormData({
        date: props.selection.date,
        note: props.selection.note,
        habitID: props.selection.habitID,
      })
    }
  }, [])

  useEffect(() => {
    if (updating) {
      if (formData.date != props.selection.date) setChangeDetected(true)
      else if (formData.note != props.selection.note) setChangeDetected(true)
      else if (formData.habitID != props.selection.habitID) setChangeDetected(true)
      else setChangeDetected(false)
    }
  }, [formData])

  function getFormChanges() {
    const dateChanged = formData.date != props.selection.date
    const noteChanged = formData.note != props.selection.note
    const habitChanged = formData.habitID != props.selection.habitID
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
    const formValidationFails = validateForm({ formName, formData, updating })
    if (formValidationFails) return alert('Please verify the form.')
    const rulesValidation = recordRulesValidator({
      record: formData,
      records: updating
        ? props.records.filter(r => r.id != props.selection.id)
        : props.records,
      habits: props.habits
    })
    if (rulesValidation.failed) return alert(rulesValidation.message)
    props.setLoading(true)
    const token = await getAccessTokenSilently()
    const values = updating ? getFormChanges() : { ...formData }
    const { error, data, message } = (updating)
      ? await UpdateRecord({ token, recordID: props.selection.id, values })
      : await CreateRecord({ token, values })
    alert(message)
    props.setLoading(false)
    if (error) return
    const newRecords = [...props.records]
    if (updating) {
      const updatedIndex = newRecords.findIndex(record => record.id == props.selection.id)
      newRecords[updatedIndex] = { ...newRecords[updatedIndex], ...formData }
    } else newRecords.push({ ...data })
    props.setRecords(newRecords)
    props.hideDrawer()
  }

  return <>
  <h3>Record Form</h3>
  <form onSubmit={handleSubmit} name='recordForm'>
    <label>
      <select name="habitID" required value={formData.habitID} onChange={handleChange}>
        { props.habits.map(habit => {
          return <option value={habit.id} key={habit.id}>{habit.name}</option>
        })}
      </select>
    </label>
    <label>
      <input
      type="date"
      name='date'
      value={formData.date}
      onChange={handleChange}
      disabled={props.loading}
      required />
      </label>
    <label>
      <textarea
      placeholder='Note'
      maxLength={2000}
      name='note'
      value={formData.note}
      onChange={handleChange}
      disabled={props.loading}
      ></textarea>
    </label>
    <button type="button" disabled={props.loading} onClick={props.hideDrawer}>
      Cancel
    </button>
    <button type="submit" disabled={props.loading || (updating && !changeDetected)}>
      Confirm
    </button>
  </form>
  </>
}

export default RecordForm
