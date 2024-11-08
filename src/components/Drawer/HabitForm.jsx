import { useEffect, useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { CreateHabit, UpdateHabit } from '../../services/habitService'
import { isoDate } from '../../utils/dateUtils'
import { validateForm } from '../../utils/formValidator'
import { habitRulesValidator } from '../../utils/businessValidations'

const HabitForm = (props) => {
  const { getAccessTokenSilently } = useAuth0()
  const [formData, setFormData] = useState({ name: '', createdAt: isoDate })
  const [editing, setEditing] = useState(false)
  const [lock, setLock] = useState(true)
  const [unaltered, setUnaltered] = useState(true)

  useEffect(() => {
    if (props.data != null) {
      setEditing(true)
      setFormData({
        name: props.data.name,
        createdAt: props.data.createdAt,
      })
    }
  }, [])

  useEffect(() => {
    if (editing) {
      if (formData.name != props.data.name) setUnaltered(false)
      else if (formData.createdAt != props.data.createdAt) setUnaltered(false)
      else setUnaltered(true)
    }
  }, [formData])

  function getFormChanges() {
    const nameChanged = formData.name != props.data.name
    const dateChanged = formData.createdAt != props.data.createdAt
    const updatedValues = {}
    if (nameChanged) updatedValues.name = formData.name
    if (dateChanged) updatedValues.createdAt = formData.createdAt
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
    const rulesValidation = habitRulesValidator({
      habit: formData,
      habits: editing
        ? props.habits.filter(h => h.id != props.data.id)
        : props.habits
    })
    if (rulesValidation.failed) return alert(rulesValidation.message)
    props.setQuerying(true)
    const token = await getAccessTokenSilently()
    const values = editing ? getFormChanges() : { ...formData }
    const { error, data, message } = (editing)
      ? await UpdateHabit({ token, habitID: props.data.id, values })
      : await CreateHabit({ token, values })
    props.setQuerying(false)
    alert(message)
    if (error) return
    updateHabits(data)
    props.hideDrawer()
  }

  function updateHabits(data) {
    const newHabits = [...props.habits]
    if (editing) {
      const updatedIndex = newHabits.findIndex(habit => habit.id == props.data.id)
      newHabits[updatedIndex] = { ...newHabits[updatedIndex], ...formData }
    }
    else newHabits.push({ ...data })
    props.setHabits(newHabits)
    
  }

  return <>
  <h3>Habit Form</h3>
  <form onSubmit={handleSubmit} name='habitForm'>
    <label>
      <input
      type='text'
      placeholder='Habit name'
      maxLength={30}
      required
      name='name'
      value={formData.name}
      onChange={handleChange}
      disabled={props.querying || (editing && lock)}
      />
    </label>
    <label>
      <input
      type="date"
      name='createdAt'
      value={formData.createdAt}
      onChange={handleChange}
      disabled={props.querying || (editing && lock)}
      />
    </label>
    <button type="button" disabled={props.querying} onClick={props.hideDrawer}>
      Cancel
    </button>
    { editing && lock
    ? <button type="button" disabled={props.querying} onClick={() => setLock(false)}>
      Edit
    </button>
    : <button type="submit" disabled={props.querying || (editing && unaltered)}>
      Save
    </button>}
    {editing && <button type="button" disabled={props.querying} onClick={props.showHabitDeletionAlert}>
      Delete
    </button>}
  </form>
  </>
}

export default HabitForm
