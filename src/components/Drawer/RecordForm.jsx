import { useAuth0 } from '@auth0/auth0-react'
import { useEffect, useState } from 'react'
import { CreateRecord, UpdateRecord } from '../../services/recordService'

const RecordForm = (props) => {
  const { getAccessTokenSilently } = useAuth0()
  const [formData, setFormData] = useState({ date: new Date(), note: '', habitID: '' })

  useEffect(() => {
    if (props.selection != null) setFormData({
      date: props.selection.date,
      note: props.selection.note,
      habitID: props.selection.habitID,
    })
  }, [props.selection])

  function handleChange(e) {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    props.setLoading(true)
    const token = await getAccessTokenSilently()
    const values = { ...formData }
    const { error, data, message } = (props.selection == null)
      ? await CreateRecord({ token, values })
      : await UpdateRecord({ token, recordID: props.selection.id, values })
    alert(message)
    props.setLoading(false)
    if (error) return
    const newRecords = [...props.records]
    if (props.selection == null) newRecords.push({ ...data })
    else {
      const updatedIndex = newRecords.findIndex(record => record.id == props.selection.id)
      newRecords[updatedIndex] = { ...newRecords[updatedIndex], ...formData }
    }  
    props.setRecords(newRecords)
    props.hideDrawer()
  }

  return <>
  <h3>Record Form</h3>
  <form onSubmit={handleSubmit}>
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
    <button type="button" disabled={props.loading} onClick={props.hideDrawer}>
      Cancel
    </button>
    <button type="submit" disabled={props.loading}>
      Confirm
    </button>
  </form>
  </>
}

export default RecordForm