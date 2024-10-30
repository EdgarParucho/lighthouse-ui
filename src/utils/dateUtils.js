const now = new Date()
const currentYear = now.getFullYear()
const currentMonth = String(now.getMonth() + 1).padStart(2, '0')
const currentDate = String(now.getDate()).padStart(2, '0')
const FIRST_DAY = '01'

export const milisecondsByDay = 86400000

export const isoDate = `${currentYear}-${currentMonth}-${currentDate}`

export const getMonthRange = (date) => {
  const [startYear, startMonth] = date ? date.split('-') : [currentYear, currentMonth]
  const endMonth = startMonth == '12' ? '01' : getFollowingMonth(startMonth)
  const endYear = startMonth == '12' ? getFollowingYear(startYear) : startYear
  return {
    fromDate: `${startYear}-${startMonth}-${FIRST_DAY}`,
    toDate: `${endYear}-${endMonth}-${FIRST_DAY}`
  }
}

const getFollowingMonth = (startMonth) => String(Number(startMonth) + 1).padStart(2, 0)
const getFollowingYear = (startYear) => Number(startYear) + 1

export const isValidDate = (value) => {
  const date = new Date(value)
  return !isNaN(date.getTime())
}

export const monthYearFormatter = (date) => {
  const [year, month] = date ? date.split('-') : [currentYear, currentMonth]
  return `${monthNames[month]}, ${year}`
}

const monthNames = {
  '01': 'January',
  '02': 'February',
  '03': 'March',
  '04': 'April',
  '05': 'May',
  '06': 'June',
  '07': 'July',
  '08': 'August',
  '09': 'September',
  '10': 'October',
  '11': 'November',
  '12': 'December',
}


export const dayNames = {
  0: 'Sunday',
  1: 'Monday',
  2: 'Tuesday',
  3: 'Wednesday',
  4: 'Thursday',
  5: 'Friday',
  6: 'Saturday',
}

export default {
  isoDate,
  milisecondsByDay,
  isValidDate,
  dayNames,
  monthYearFormatter,
  getMonthRange
}
