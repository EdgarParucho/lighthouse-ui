import { useEffect, useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { CreateHabit, UpdateHabit } from '../../services/habitService'

const HabitForm = (props) => {
  const { getAccessTokenSilently } = useAuth0()
  const [formData, setFormData] = useState({ name: '', createdAt: new Date() })

  useEffect(() => {
    if (props.selection != null) setFormData({
      name: props.selection.name,
      createdAt: props.selection.createdAt,
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
      ? await CreateHabit({ token, values })
      : await UpdateHabit({ token, habitID: props.selection.id, values })
    alert(message)
    props.setLoading(false)
    if (error) return
    const newHabits = [...props.habits]
    if (props.selection == null) newHabits.push({ ...data })
    else {
      const updatedIndex = newHabits.findIndex(habit => habit.id == props.selection.id)
      newHabits[updatedIndex] = { ...newHabits[updatedIndex], ...formData }
    }
    props.setHabits(newHabits)
    props.hideDrawer()
  }

  return <>
  <h3>Habit Form</h3>
  <form onSubmit={handleSubmit}>
    <label>
      <input
      type='text'
      placeholder='Habit name'
      maxLength={30}
      required
      name='name'
      value={formData.name}
      onChange={handleChange}
      />
    </label>
    <label>
      <input
      type="date"
      name='createdAt'
      value={formData.createdAt}
      onChange={handleChange}
      />
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

export default HabitForm
