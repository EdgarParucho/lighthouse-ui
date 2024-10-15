import { useAuth0 } from '@auth0/auth0-react'
import { useState } from 'react'
import { CreateRecord } from '../services/recordService'

function RecordForm({ records, hideRecordForm, habits }) {
  const [loading, setLoading] = useState(false)
  const { getAccessTokenSilently } = useAuth0()
  const [formData, setFormData] = useState({
    date: new Date(),
    note: '',
    habitID: '',
  })
  
  function handleChange(e) {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    const token = await getAccessTokenSilently()
    const payload = { ...formData }
    const { error, data, message } =  await CreateRecord({ token, payload })
    alert(message)
    setLoading(false)
    if (error) return
    const newRecords = [...records, { ...data }]
    setRecords(newRecords)
    hideRecordForm()
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
      value={formData.name}
      onChange={handleChange}
      ></textarea>
    </label>
    <button type="button" disabled={loading} onClick={hideRecordForm}>Cancel</button>
    <button type="submit" disabled={loading}>Confirm</button>
  </form>
  </>
}

export default RecordForm