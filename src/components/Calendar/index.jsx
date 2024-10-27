import { useEffect, useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { DeleteHabit } from '../../services/habitService'
import { GetRecords } from '../../services/recordService'
import { firstOfMonth, isoDate, monthNames } from '../../utils/dateUtils'
import CalendarRow from './CalendarRow'

const Calendar = (props) => {
  const { getAccessTokenSilently } = useAuth0()
  const [selectedMonth, setSelectedMonth] = useState(firstOfMonth())
  const [selectOptions, setSelectOptions] = useState([])
  const [calendarRecords, setCalendarRecords] = useState(props.records)

  useEffect(() => {
    const options = props.habits.reduce((previous, current) => {
      const option = formatOption(current.createdAt)
      return { ...previous, ...option }
    }, {})
    setSelectOptions(Object.entries(options))
  }, [])

  function formatOption(date = new Date()) {
    const habitDate = new Date(date)
    const habitCreationMonth = monthNames[habitDate.getMonth()]
    const habitCreationYear = habitDate.getFullYear()
    const text = `${habitCreationMonth}, ${habitCreationYear}`
    const value = firstOfMonth(habitDate)
    return { [text]: value }
  }

  function onMonthChange({ target }) {
    const { value: from } = target
    setSelectedMonth(from)
    const [fromYear, fromMonth] = from.split('-').map(Number);
    const toMonth = fromMonth == 12 ? 1 : fromMonth + 1
    const toYear = fromMonth == 12 ? fromYear + 1 : fromYear
    const to = `${toYear}-${toMonth}-01`
    const rangeRecords = props.records.filter(r => r.date >= from && r.date < to)
    if (rangeRecords.length > 0) return setCalendarRecords(rangeRecords)
    getRecords({ from, to })
  }

  async function getRecords({ from, to }) {
    props.setQuerying(true)
    const token = await getAccessTokenSilently()
    const { error, message, data } = await GetRecords({ token, from, to })
    props.setQuerying(false)
    if (error) return
    else if (data.length == 0) return alert('No records found')
    props.setRecords([...props.records, ...data])
    updateCalendar(data)
  }

  function updateCalendar(data) {
    setCalendarRecords(data)
  }

  function updateAssociations(id) {
    const newHabits = [...props.habits]
    const deletedIndex = newHabits.findIndex(habit => habit.id == id)
    newHabits.splice(deletedIndex, 1)
    props.setHabits(newHabits)
    const newRecords = props.records.filter(record => record.habitID != id)
    props.setRecords(newRecords)
  }

  async function confirmAndDeleteHabit({ id }) {
    const confirmed = confirm(
      'You are about to delete this habit and its records.\n' +
      'This action is irreversible, please confirm to proceed.'
    )
    if (!confirmed) return
    props.setQuerying(true)
    const token = await getAccessTokenSilently()
    const { error, message } = await DeleteHabit({ token, habitID: id })
    props.setQuerying(false)
    if (error) return alert(message)
    updateAssociations(id)
  }

  return <>
    <section>
      <label htmlFor='month'>Month</label>
      <select id='month' value={selectedMonth} onChange={onMonthChange}>
        { selectOptions.map(([optionText, optionValue]) => (
          <option value={optionValue} key={optionText}>{optionText}</option>
        )) }
      </select>
      <button
      type='button'
      onClick={() => props.showDrawer({ option: 'habitForm', data: null })}
      disabled={props.querying}
      >
        Add Habit
      </button>
      { props.habits.map(habit => <CalendarRow
        habit={habit}
        showDrawer={() => props.showDrawer({ option: 'habitForm', data: habit })}
        confirmAndDeleteHabit={() => confirmAndDeleteHabit(habit)}
        querying={props.querying}
        setQuerying={props.setQuerying}
        key={habit.id}
      />) }
    </section>
  </>
}
  
export default Calendar