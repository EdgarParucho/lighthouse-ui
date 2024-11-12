import { useEffect, useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { GetRecords } from '../../services/recordService'
import dateUtils from '../../utils/dateUtils'
import CalendarRow from './CalendarRow'
import Button from '../Layout/Button'
import './calendar.css'

const Calendar = (props) => {
  const { getAccessTokenSilently } = useAuth0()
  const { getMonthRange, monthYearFormatter, isoDate, getDaysInRange, dayNames } = dateUtils
  const defaultMonth = monthYearFormatter()
  const defaultMonthRange = getMonthRange()
  const defaultOption = { [defaultMonth]: defaultMonthRange }
  const [month, setMonth] = useState(defaultMonth)
  const [monthRange, setMonthRange] = useState(defaultMonthRange)
  const [monthOptions, setMonthOptions] = useState(defaultOption)
  const [headers, setHeaders] = useState([])
  const [rows, setRows] = useState([])
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
  }, [props.selectedMonthRecords])

  useEffect(() => {
    if (starting) return
    updateHeaders()
    updateMonthRecords()
    scrollCalendar(true)
  }, [monthRange])

  useEffect(() => {
    updateMonthOptions()
    updateHeaders()
    updateDataRows()
    setStarting(false)
    scrollCalendar()
  }, [])

  function scrollCalendar(monthRangeChanged = false) {
    if (window.screen.width > 1000) return
    const tableContainer = document.getElementById('table-container')
    const [, , date] = isoDate.split('-')
    const isFirstWeek = Number(date) < 7
    if (isFirstWeek || monthRangeChanged) return tableContainer.scrollTo({ left: 0, behavior: 'smooth' })
    const PX_BY_CELL =  31
    const FIRST_CELL_MARGIN =  1
    const weekDay = new Date().getUTCDay()
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
    const text = monthYearFormatter(date)
    const range = getMonthRange(date)
    return { [text]: range }
  }

  function onRangeOptionChange(e) {
    const option = e.target.value
    setMonth(option)
    setMonthRange(monthOptions[option])
  }

  function updateHeaders() {
    const [yyyy, mm] = monthRange.fromDate.split('-')
    const calendarDays = getDaysInRange(monthRange)
    const getDay = (date) => new Date(yyyy, Number(mm) - 1, date).getUTCDay()
    const getDate = (i) => String(i + 1).padStart(2, 0)
    const headers = Array.from({ length: calendarDays }, (_, i) => Object({
      date: getDate(i),
      dayName: dayNames[getDay(i + 1)],
      isToday: `${yyyy}-${mm}-${getDate(i)}` == isoDate
    }))
    setHeaders(headers)
    const daysElapsed = month == defaultMonth ? Number(dateUtils.currentDate) : calendarDays
    props.setDaysElapsed(daysElapsed)
  }

  async function updateMonthRecords() {
    const { fromDate, toDate } = monthRange
    const recordsFiltered = props.records.filter(r => r.date >= fromDate && r.date < toDate)
    if (recordsFiltered.length > 0) return props.setSelectedMonthRecords(recordsFiltered)

    props.setQuerying(true)
    const token = await getAccessTokenSilently()
    const { error, message, data } = await GetRecords({ token, from: fromDate, to: toDate })
    props.setQuerying(false)

    if (error) return alert(message)
    else if (data.length == 0) return props.setSelectedMonthRecords([])
    props.setRecords([...props.records, ...data])
    props.setSelectedMonthRecords(data)
  }

  function updateDataRows() {
    const calendarDays = getDaysInRange(monthRange)
    const [yyyy, mm] = monthRange.fromDate.split('-')
    const rows = props.habits.reduce((rows, habit) => Object({
      ...rows,
      [habit.id]: {
        habitName: habit.name,
        habitCells: Array.from({ length: calendarDays }, (_, i) => {
          const dd = String(i + 1).padStart(2, 0)
          const date = `${yyyy}-${mm}-${dd}`
          const isFutureDate = date > isoDate
          const isBeforeHabitCreation = habit.createdAt > date
          return Object({ date, record: null, isFutureDate, isBeforeHabitCreation })
        })
      }
    }), {})

    props.selectedMonthRecords.forEach(({ date, habitID, ...rest }) => {
      const [, , day] = date.split('-').map(Number)
      rows[habitID].habitCells[day - 1].record = { date, habitID, ...rest }
    })
    setRows(Object.entries(rows))
  }

  return <>
    {props.habits.length > 0 && <>
      <label htmlFor='month' className='label label_mx-auto'>Month</label>
      <select
      id='month'
      className='month-selector'
      value={month}
      onChange={onRangeOptionChange}
      disabled={props.querying}
      >
        { Object.keys(monthOptions).map((option) => (
          <option value={option} key={option}>
            {option}
          </option>
        )) }
      </select>
    </>
    }
    <div className='table-container' id='table-container'>
      { props.habits.length > 0 &&
        <table className='table'>
          <thead>
            <tr>
              <th className='table__cell table__cell_sticky table__cell_border-none table__cell_lg'>
                Habit
              </th>
              { headers.map((header) =>
                <th
                key={header.date}
                className={`table__cell table__cell_border-none ${header.isToday ? 'table__cell_bt': ''}`}
                >
                  <span>{header.date}</span>
                  <br />
                  <span>{header.dayName[0]}</span>
                </th>
              ) }
            </tr>
          </thead>
          <tbody>
            {rows.map(([habitID, { habitName, habitCells }]) => (
              <CalendarRow
              habits={props.habits}
              habitID={habitID}
              habitName={habitName}
              habitCells={habitCells}
              showHabitForm={props.showHabitForm}
              showRecordForm={props.showRecordForm}
              querying={props.querying}
              key={habitID}
              />
            ) )}
          </tbody>
        </table>
      }
      { props.habits.length == 0 &&
        <p className='text_lg text_centered text_my-20'>
          <strong>Let’s start by adding a habit.</strong>
        </p>
      }
      <Button
      type='button'
      disabled={props.querying}
      onClick={() => props.showHabitForm()}
      text='Add Habit'
      modifiers={props.habits.length == 0
        ? ['primary', 'w-lg', 'mx-auto', 'pulse']
        : ['sticky-left', 'w-full']
      }
      />
    </div>
  </>
}

export default Calendar
