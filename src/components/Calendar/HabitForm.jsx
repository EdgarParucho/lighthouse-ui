import { useEffect, useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { CreateHabit, UpdateHabit } from '../../services/habitService'
import { useSelectionContext } from '../../context/SelectionContext'

const HabitForm = ({ habits, setHabits, hideBottomSheet }) => {
  const { selectedData } = useSelectionContext()
  const { getAccessTokenSilently } = useAuth0()
  const [formData, setFormData] = useState({ name: '', createdAt: new Date() })
  const [loading, setLoading] = useState(false)
  
  useEffect(() => {
    if (selectedData != null) setFormData({
      name: selectedData.name,
      createdAt: selectedData.createdAt,
    })
  }, [selectedData])

  function handleChange(e) {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    const token = await getAccessTokenSilently()
    const values = { ...formData }
    const { error, data, message } = (selectedData == null)
      ? await CreateHabit({ token, values })
      : await UpdateHabit({ token, habitID: selectedData.id, values })
    alert(message)
    setLoading(false)
    if (error) return
    const newHabits = [...habits]
    if (selectedData == null) newHabits.push({ ...data })
    else {
      const updatedIndex = newHabits.findIndex(habit => habit.id == selectedData.id)
      newHabits[updatedIndex] = { ...newHabits[updatedIndex], ...formData }
    }
    setHabits(newHabits)
    hideBottomSheet()
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
    <button type="button" disabled={loading} onClick={hideBottomSheet}>Cancel</button>
    <button type="submit" disabled={loading}>Confirm</button>
  </form>
  </>
}

export default HabitForm
