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
    if (props.selection != null) {
      setEditing(true)
      setFormData({
        name: props.selection.name,
        createdAt: props.selection.createdAt,
      })
    }
  }, [])

  useEffect(() => {
    if (editing) {
      if (formData.name != props.selection.name) setUnaltered(false)
      else if (formData.createdAt != props.selection.createdAt) setUnaltered(false)
      else setUnaltered(true)
    }
  }, [formData])

  function getFormChanges() {
    const nameChanged = formData.name != props.selection.name
    const dateChanged = formData.createdAt != props.selection.createdAt
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
        ? props.habits.filter(h => h.id != props.selection.id)
        : props.habits
    })
    if (rulesValidation.failed) return alert(rulesValidation.message)
    props.setLoading(true)
    const token = await getAccessTokenSilently()
    const values = editing ? getFormChanges() : { ...formData }
    const { error, data, message } = (editing)
      ? await UpdateHabit({ token, habitID: props.selection.id, values })
      : await CreateHabit({ token, values })
    props.setLoading(false)
    alert(message)
    if (error) return
    updateHabits(data)
    props.hideDrawer()
  }

  function updateHabits(data) {
    const newHabits = [...props.habits]
    if (editing) {
      const updatedIndex = newHabits.findIndex(habit => habit.id == props.selection.id)
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
      disabled={props.loading || (editing && lock)}
      />
    </label>
    <label>
      <input
      type="date"
      name='createdAt'
      value={formData.createdAt}
      onChange={handleChange}
      disabled={props.loading || (editing && lock)}
      />
    </label>
    <button type="button" disabled={props.loading} onClick={props.hideDrawer}>
      Cancel
    </button>
    { editing && lock
    ? <button type="button" disabled={props.loading} onClick={() => setLock(false)}>
      Edit
    </button>
    : <button type="submit" disabled={props.loading || (editing && unaltered)}>
      Save
    </button>}
  </form>
  </>
}

export default HabitForm
