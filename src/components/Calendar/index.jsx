import { useAuth0 } from '@auth0/auth0-react'
import { DeleteHabit } from '../../services/habitService'
import CalendarRow from './CalendarRow'

const Calendar = (props) => {
  const { getAccessTokenSilently } = useAuth0()

  function updateAssociations(id) {
    const newHabits = [...props.habits]
    const deletedIndex = newHabits.findIndex(habit => habit.id == id)
    newHabits.splice(deletedIndex, 1)
    props.setHabits(newHabits)
    const newRecords = records.filter(record => record.habitID != id)
    props.setRecords(newRecords)
  }

  async function confirmAndDeleteHabit({ id }) {
    const confirmed = confirm(
      'You are about to delete this habit and its records.\n' +
      'This action is irreversible, please confirm to proceed.'
    )
    if (!confirmed) return
    props.setLoading(true)
    const token = await getAccessTokenSilently()
    const { error, message } = await DeleteHabit({ token, habitID: id })
    props.setLoading(false)
    if (error) return alert(message)
    updateAssociations(id)
  }

  return <>
    <section>
      <h2>Habits</h2>
      <button
      type="button"
      onClick={() => props.showDrawer({ option: 'habitForm', data: null })}
      >
        Add Habit
      </button>
      { props.habits.map(habit => <CalendarRow
        habit={habit}
        showDrawer={() => props.showDrawer({ option: 'habitForm', data: habit })}
        confirmAndDeleteHabit={() => confirmAndDeleteHabit(habit)}
        key={habit.id}
      />) }
    </section>
  </>
}
  
export default Calendar