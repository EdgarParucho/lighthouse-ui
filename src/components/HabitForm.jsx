import { useEffect, useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { CreateHabit, UpdateHabit } from '../services/habitService'

const HabitForm = ({ habits, selectedHabit = null, hideHabitForm, setHabits }) => {
  const { getAccessTokenSilently } = useAuth0()
  const [formData, setFormData] = useState({
    name: '',
    createdAt: new Date()
  })
  
  useEffect(() => {
    if (selectedHabit != null) setFormData({
      name: selectedHabit.name,
      createdAt: selectedHabit.createdAt,
    })
  }, [selectedHabit])
  
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    const token = await getAccessTokenSilently()
    const payload = { ...formData }
    const { error, data, message } =  (selectedHabit == null)
      ? await CreateHabit({ token, payload })
      : await UpdateHabit({ token, habitID: selectedHabit.id, payload })
    alert(message)
    setLoading(false)
    if (error) return
    const newHabits = [...habits]
    if (selectedHabit == null) newHabits.push({ ...data })
    else {
      const updatedIndex = newHabits.findIndex(habit => habit.id == selectedHabit.id)
      newHabits[updatedIndex] = { ...newHabits[updatedIndex], ...formData }
    }
    setHabits(newHabits)
    hideHabitForm()
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
      <input type="date" name='createdAt' value={formData.createdAt} onChange={handleChange} />
    </label>
    <button type="button" disabled={loading} onClick={hideHabitForm}>Cancel</button>
    <button type="submit" disabled={loading}>Confirm</button>
  </form>
  </>
}

export default HabitForm
