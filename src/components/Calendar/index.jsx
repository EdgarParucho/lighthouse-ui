import { useEffect, useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { DeleteHabit } from '../../services/habitService'
import { GetRecords } from '../../services/recordService'
import dateUtils from '../../utils/dateUtils'
import CalendarRow from './CalendarRow'
import './calendar.css'

const Calendar = (props) => {
  const { getAccessTokenSilently } = useAuth0()
  const { getMonthRange, monthYearFormatter } = dateUtils
  const defaultOption = monthYearFormatter()
  const defaultRange = getMonthRange()
  const [selectedRange, setSelectedRange] = useState(defaultOption)
  const [rangeOptions, setRangeOptions] = useState({ [defaultOption]: defaultRange })
  const [rangeRecords, setRangeRecords] = useState(props.records)
  const [headers, setHeaders] = useState([])
  const [rows, setRows] = useState([])

  useEffect(() => {
    updateRangeOptions()
    updateDataRows(rangeOptions[selectedRange])
  }, [props.habits])

  useEffect(() => {
    updateHeaderRow(rangeOptions[selectedRange])
    updateRangeRecords(rangeOptions[selectedRange])
  }, [selectedRange])

  useEffect(() => {
    updateDataRows(rangeOptions[selectedRange])
  }, [rangeRecords])

  useEffect(() => {
    updateRangeRecords(rangeOptions[selectedRange])
  }, [props.records])

  function updateRangeOptions() {
    const habitDates = props.habits.reduce((options, { createdAt }) => Object({
      ...options,
      ...getRangeOption(createdAt)
    }), [])
    setRangeOptions(habitDates)
  }

  function getRangeOption(date) {
    const text = dateUtils.monthYearFormatter(date)
    return {
      [text]: getMonthRange(date)
    }
  }

  function onRangeOptionChange(e) {
    const option = e.target.value
    setSelectedRange(option)
  }

  function updateHeaderRow({ fromDate, toDate }) {
    const { dayNames } = dateUtils
    const [year, month] = fromDate.split('-')
    const calendarDays = getCalendarDays({ fromDate, toDate })
    const getDay = (date) => new Date(year, Number(month) - 1, date).getDay()
    const headers = Array.from({ length: calendarDays }, (_, i) => Object({
      date: String(i + 1).padStart(2, 0),
      dayName: dayNames[getDay(i + 1)]
    }))
    setHeaders(headers)
  }
  
  function getCalendarDays({ fromDate, toDate }) {
    const { milisecondsByDay } = dateUtils
    const daysInMiliseconds = new Date(toDate) - new Date(fromDate)
    return Math.round(daysInMiliseconds / milisecondsByDay)
  }

  async function updateRangeRecords({ fromDate, toDate }) {
    const recordsFiltered = props.records.filter(r => r.date >= fromDate && r.date < toDate)
    if (recordsFiltered.length > 0) return setRangeRecords(recordsFiltered)

    props.setQuerying(true)
    const token = await getAccessTokenSilently()
    const { error, message, data } = await GetRecords({ token, from: fromDate, to: toDate })
    props.setQuerying(false)

    if (error) return alert(message)
    else if (data.length == 0) return setRangeRecords([])

    props.setRecords([...props.records, ...data])
    setRangeRecords(data)
  }

  function updateDataRows({ fromDate, toDate }) {
    const calendarDays = getCalendarDays({ fromDate, toDate })
    const rows = props.habits.reduce((rows, habit) => Object({
      ...rows,
      [habit.id]: {
        habitName: habit.name,
        habitRecords: Array.from({ length: calendarDays }).fill(null)
      }
    }), {})

    rangeRecords.forEach(({ date, habitID, ...rest }) => {
      const [, , day] = date.split('-').map(Number)
      rows[habitID].habitRecords[day - 1] = { date, habitID, ...rest }
    })
    setRows(Object.entries(rows))
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

  function updateAssociations(id) {
    const newHabits = [...props.habits]
    const deletedIndex = newHabits.findIndex(habit => habit.id == id)
    newHabits.splice(deletedIndex, 1)
    props.setHabits(newHabits)
    const newRecords = props.records.filter(record => record.habitID != id)
    props.setRecords(newRecords)
  }

  return <div>
    <label htmlFor='month' className='label label_mx-auto'>Month</label>
    <select
    id='month'
    className='month-selector'
    value={selectedRange}
    onChange={onRangeOptionChange}
    >
      { Object.keys(rangeOptions).map((option) => (
        <option value={option} key={option}>
          {option}
        </option>
      )) }
    </select>
    <button
    type='button'
    className='button button_w-lg button_mx-auto'
    disabled={props.querying}
    onClick={() => props.showDrawer({ option: 'habitForm', data: null })}
    >
      Add Habit
    </button>
    <table className='table'>
      <thead>
        <tr className='table__row table__row_mb-20'>
          <th className='table__cell table__cell_lg table__cell_border-none'>
            Habit
          </th>
          { headers.map((header) => <th
          key={header.date}
          className='table__cell table__cell_border-none table__cell_grid'
          >
            <span>{header.date}</span>
            <span>{header.dayName[0]}</span>
          </th>)
          }
        </tr>
      </thead>
      <tbody>
        { rows.map(([habitID, { habitName, habitRecords }]) => <CalendarRow
          habitName={habitName}
          records={habitRecords}
          showDrawer={() => props.showDrawer({ option: 'habitForm', data: habitID })}
          confirmAndDeleteHabit={() => confirmAndDeleteHabit(habitID)}
          querying={props.querying}
          setQuerying={props.setQuerying}
          key={habitID}
        />) }
      </tbody>
    </table>
  </div>
}
  
export default Calendar