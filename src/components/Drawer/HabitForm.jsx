import { useEffect, useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { CreateHabit, UpdateHabit } from '../../services/habitService'
import { today } from '../../utils/dateUtils'
import { validateForm } from '../../utils/formValidator'

const HabitForm = (props) => {
  const { getAccessTokenSilently } = useAuth0()
  const [formData, setFormData] = useState({ name: '', createdAt: today() })
  const [updating, setUpdating] = useState(false)
  const [changeDetected, setChangeDetected] = useState(false)

  useEffect(() => {
    if (props.selection != null) {
      setUpdating(true)
      setFormData({
        name: props.selection.name,
        createdAt: props.selection.createdAt,
      })
    }
  }, [])

  useEffect(() => {
    if (updating) {
      if (formData.name != props.selection.name) setChangeDetected(true)
      else if (formData.createdAt != props.selection.createdAt) setChangeDetected(true)
      else setChangeDetected(false)
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
    const formValidationFails = validateForm({ formName, formData, updating })
    if (formValidationFails) return alert('Please verify the form.')
    props.setLoading(true)
    const token = await getAccessTokenSilently()
    const values = updating ? getFormChanges() : { ...formData }
    const { error, data, message } = (updating)
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
    if (updating) {
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
      disabled={props.loading}
      />
    </label>
    <label>
      <input
      type="date"
      name='createdAt'
      value={formData.createdAt}
      onChange={handleChange}
      disabled={props.loading}
      />
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

export default HabitForm
