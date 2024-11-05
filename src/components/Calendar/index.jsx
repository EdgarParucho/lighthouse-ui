import { useEffect, useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { DeleteHabit } from '../../services/habitService'
import { GetRecords } from '../../services/recordService'
import dateUtils from '../../utils/dateUtils'
import CalendarRow from './CalendarRow'
import './calendar.css'

const Calendar = (props) => {
  const { getAccessTokenSilently } = useAuth0()
  const { getMonthRange, monthYearFormatter, getCalendarDays } = dateUtils
  const defaultMonth = monthYearFormatter()
  const defaultMonthRange = getMonthRange()
  const defaultOption = { [defaultMonth]: defaultMonthRange }
  const [month, setMonth] = useState(defaultMonth)
  const [monthRange, setMonthRange] = useState(defaultMonthRange)
  const [monthOptions, setMonthOptions] = useState(defaultOption)
  const [monthRecords, setMonthRecords] = useState(props.records)
  const [headers, setHeaders] = useState([])
  const [rows, setRows] = useState([])
  const [calendarDays, setCalendarDays] = useState(getCalendarDays(defaultMonthRange))
  const [starting, setStarting] = useState(true)

  useEffect(() => {
    if (starting) return
    updateMonthOptions()
    updateMonthRecords()
  }, [props.habits])
  
  useEffect(() => {
    if (!starting) updateMonthRecords()
  }, [props.records])

  useEffect(() => {
    if (!starting) updateDataRows()
  }, [monthRecords])

  useEffect(() => {
    if (starting) return
    updateHeaders()
    updateMonthRecords()
  }, [monthRange])

  useEffect(() => {
    updateMonthOptions()
    updateHeaders()
    updateDataRows()
    setStarting(false)
    scrollToCurrentWeek()
  }, [])

  function scrollToCurrentWeek() {
    const tableContainer = document.getElementById('table-container')
    const PX_BY_CELL =  31
    const FIRST_CELL_MARGIN =  1
    const [year, month, date] = dateUtils.isoDate.split('-')
    if (Number(date) < 7) return tableContainer.scrollLeft = 0
    const weekDay = new Date(year, Number(month) - 1, date).getDay() + 1
    const daysToCurrentWeek = Number(date) - Number(weekDay)
    const pxToScroll = (daysToCurrentWeek * PX_BY_CELL) + FIRST_CELL_MARGIN
    tableContainer.scrollTo({ left: pxToScroll, behavior: 'smooth' })
  }

  function updateMonthOptions() {
    const userOptions = props.habits.reduce((formattedOptions, { createdAt }) => Object({
      ...formattedOptions,
      ...getFormattedOption(createdAt)
    }), [])
    setMonthOptions(userOptions)
  }

  function getFormattedOption(date) {
    const text = dateUtils.monthYearFormatter(date)
    const range = getMonthRange(date)
    return { [text]: range }
  }

  function onRangeOptionChange(e) {
    const option = e.target.value
    setMonth(option)
    setMonthRange(monthOptions[option])
  }

  function updateHeaders() {
    const { dayNames, isoDate } = dateUtils
    const [year, month] = monthRange.fromDate.split('-')
    const calendarDaysUpdated = getCalendarDays(monthRange)
    setCalendarDays(calendarDaysUpdated)
    const getDay = (date) => new Date(year, Number(month) - 1, date).getDay()
    const getDate = (i) => String(i + 1).padStart(2, 0)
    const headers = Array.from({ length: calendarDaysUpdated }, (_, i) => Object({
      date: getDate(i),
      dayName: dayNames[getDay(i + 1)],
      isToday: `${year}-${month}-${getDate(i)}` == isoDate
    }))
    setHeaders(headers)
  }

  async function updateMonthRecords() {
    const { fromDate, toDate } = monthRange
    const recordsFiltered = props.records.filter(r => r.date >= fromDate && r.date < toDate)
    if (recordsFiltered.length > 0) return setMonthRecords(recordsFiltered)

    props.setQuerying(true)
    const token = await getAccessTokenSilently()
    const { error, message, data } = await GetRecords({ token, from: fromDate, to: toDate })
    props.setQuerying(false)

    if (error) return alert(message)
    else if (data.length == 0) return setMonthRecords([])
    else props.setRecords([...props.records, ...data])
  }

  function updateDataRows() {
    const calendarDaysUpdated = getCalendarDays(monthRange)
    const rows = props.habits.reduce((rows, habit) => Object({
      ...rows,
      [habit.id]: {
        habitName: habit.name,
        habitRecords: Array.from({ length: calendarDaysUpdated }).fill(null)
      }
    }), {})

    monthRecords.forEach(({ date, habitID, ...rest }) => {
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
    value={month}
    onChange={onRangeOptionChange}
    >
      { Object.keys(monthOptions).map((option) => (
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
    <div className='table-container' id='table-container'>
      <table className='table'>
        <thead>
          <tr>
            <th className='table__cell table__cell__fixed table__cell_border-none table__cell_lg'>
              Habit
            </th>
            { headers.map((header) => <th
            key={header.date}
            className={`table__cell table__cell_border-none ${header.isToday ? 'table__cell_bt': ''}`}
            >
              <span>{header.date}</span>
              <br />
              <span>{header.dayName[0]}</span>
            </th>)
            }
          </tr>
        </thead>
        <tbody>
          {rows.map(([habitID, { habitName, habitRecords }]) => (
            <CalendarRow { ...{ habitID, habitName, habitRecords, }} key={habitID} />
          ) )}
        </tbody>
      </table>
    </div>
  </div>
}
  
export default Calendar
