import { useAuth0 } from '@auth0/auth0-react'
import { useEffect, useState } from 'react'
import { CreateRecord, UpdateRecord } from '../../services/recordService'

const RecordForm = (props) => {
  const { habits, selection, records, setRecords, hideBottomSheet } = props
  const { getAccessTokenSilently } = useAuth0()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({ date: new Date(), note: '', habitID: '' })

  useEffect(() => {
    if (selection != null) setFormData({
      date: selection.date,
      note: selection.note,
      habitID: selection.habitID,
    })
  }, [selection])

  function handleChange(e) {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    const token = await getAccessTokenSilently()
    const values = { ...formData }
    const { error, data, message } = (selection == null)
      ? await CreateRecord({ token, values })
      : await UpdateRecord({ token, recordID: selection.id, values })
    alert(message)
    setLoading(false)
    if (error) return
    const newRecords = [...records]
    if (selection == null) newRecords.push({ ...data })
    else {
      const updatedIndex = newRecords.findIndex(record => record.id == selection.id)
      newRecords[updatedIndex] = { ...newRecords[updatedIndex], ...formData }
    }  
    setRecords(newRecords)
    hideBottomSheet()
  }

  return <>
  <h3>Record Form</h3>
  <form onSubmit={handleSubmit}>
    <label>
      <select name="habitID" required value={formData.habitID} onChange={handleChange}>
        { habits.map(habit => {
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
      required />
    </label>
    <label>
      <textarea
      placeholder='Note'
      maxLength={2000}
      name='note'
      value={formData.note}
      onChange={handleChange}
      ></textarea>
    </label>
    <button type="button" disabled={loading} onClick={hideBottomSheet}>Cancel</button>
    <button type="submit" disabled={loading}>Confirm</button>
  </form>
  </>
}

export default RecordForm