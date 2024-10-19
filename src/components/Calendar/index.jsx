import { useAuth0 } from '@auth0/auth0-react'
import { DeleteHabit } from '../../services/habitService'
import CalendarRow from './CalendarRow'

const Calendar = ({ habits, setHabits, setRecords, showHabitForm }) => {
  const { getAccessTokenSilently } = useAuth0()

  function updateAssociations(id) {
    const newHabits = [...habits]
    const deletedIndex = newHabits.findIndex(habit => habit.id == id)
    newHabits.splice(deletedIndex, 1)
    setHabits(newHabits)
    const newRecords = records.filter(record => record.habitID != id)
    setRecords(newRecords)
  }

  async function confirmAndDeleteHabit({ id }) {
    const confirmed = confirm(
      'You are about to delete this habit and its records.\n' +
      'This action is irreversible, please confirm to proceed.'
    )
    if (!confirmed) return
    const token = await getAccessTokenSilently()
    const { error, message } = await DeleteHabit({ token, habitID: id })
    if (error) return alert(message)
    updateAssociations(id)
  }

  return <>
    <section>
      <h2>Habits</h2>
      <button type="button" onClick={showHabitForm}>Add Habit</button>
      { habits.map(habit => <CalendarRow
        habit={habit}
        showHabitForm={() => showHabitForm(habit)}
        confirmAndDeleteHabit={() => confirmAndDeleteHabit(habit)}
        key={habit.id}
      />) }
    </section>
  </>
}
  
export default Calendar