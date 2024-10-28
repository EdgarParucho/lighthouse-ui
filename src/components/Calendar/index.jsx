import { useEffect, useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { DeleteHabit } from '../../services/habitService'
import { GetRecords } from '../../services/recordService'
import dateUtils from '../../utils/dateUtils'
import CalendarRow from './CalendarRow'
import './calendar.css'

const Calendar = (props) => {
  const { getAccessTokenSilently } = useAuth0()
  const { firstOfMonth } = dateUtils
  const [selectedMonth, setSelectedMonth] = useState(firstOfMonth())
  const [selectOptions, setSelectOptions] = useState([])
  const [calendarRecords, setCalendarRecords] = useState(props.records)
  const [tableHeaders, setTableHeaders] = useState([])
  const [tableRows, setTableRows] = useState([])

  useEffect(() => {
    const options = props.habits.reduce((previous, current) => {
      const option = addOption(current.createdAt)
      return { ...previous, ...option }
    }, {})
    setSelectOptions(Object.entries(options))
  }, [])

  useEffect(() => {
    const range = getRangeLimit(selectedMonth)
    updateCalendarRecords(range)
    getTableHeaders(range)
    getTableRows()
  }, [selectedMonth])

  useEffect(() => {
    getTableRows()
  }, [props.records, props.records])

  function getRangeLimit(from) {
    const [fromYear, fromMonth] = from.split('-').map(Number)
    const toMonth = fromMonth == 12 ? 1 : fromMonth + 1
    const toYear = fromMonth == 12 ? fromYear + 1 : fromYear
    const to = `${toYear}-${String(toMonth).padStart(2, '0')}-01`
    return { from, to }
  }

  function updateCalendarRecords({ from, to }) {
    const localRecordsFiltered = props.records.filter(r => r.date >= from && r.date < to)
    if (localRecordsFiltered.length > 0) setCalendarRecords(localRecordsFiltered)
    else getRecords({ from, to })
  }

  function getTableHeaders({ from, to }) {
    const { milisecondsXDay, dayNames } = dateUtils
    const monthDays = (new Date(to) - new Date(from)) / milisecondsXDay
    const headersData = []
    const [year, month] = from.split('-').map(Number)
    const getDayName = (dd) => dayNames[new Date(year, month - 1, dd).getDay()]
    for (let i = 1; i <= monthDays; i++) {
      const date = String(i).padStart(2, 0)
      const isCurrentDate = i == new Date().getDate()
      headersData.push({ date, isCurrentDate, weekday: getDayName(date) })
    }
    setTableHeaders(headersData)
  }

  function getTableRows() {
    const rows = {}
    for (let habit of props.habits) rows[habit.id] = {
      habitName: habit.name,
      habitRecords: Array(tableHeaders.length).fill(null)
    }
    for (let record of calendarRecords) {
      const index = record.date.slice(8)
      rows[record.habitID].habitRecords[index] = record
    }
    setTableRows(Object.entries(rows))
  }

  function addOption(date) {
    const { monthNames } = dateUtils
    const [year, month] = date.split('-').map(Number)
    const key = `${monthNames[month]}, ${year}`
    const value = `${year}-${month}-01`
    return { [key]: value }
  }

  function onMonthChange({ target }) {
    const { value: from } = target
    setSelectedMonth(from)
  }

  async function getRecords({ from, to }) {
    props.setQuerying(true)
    const token = await getAccessTokenSilently()
    const { error, message, data } = await GetRecords({ token, from, to })
    
    props.setQuerying(false)
    if (error) return alert(message)
    else if (data.length == 0) return alert('No records found')
    props.setRecords([...props.records, ...data])
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

  return <div>
    <label htmlFor='month' className='label label_mx-auto'>Month</label>
    <select
    id='month'
    className='month-selector'
    value={selectedMonth}
    onChange={onMonthChange}
    >
      { selectOptions.map(([optionText, optionValue]) => (
        <option value={optionValue} key={optionText}>{optionText}</option>
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
          { tableHeaders.map(header => <th
          key={header.date}
          className='table__cell table__cell_border-none table__cell_grid'
          >
            <span>{header.date}</span>
            <span>{header.weekday[0]}</span>
          </th>)
          }
        </tr>
      </thead>
      <tbody>
        { tableRows.map(([habitID, { habitName, habitRecords }]) => <CalendarRow
          habitName={habitName}
          records={habitRecords }
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