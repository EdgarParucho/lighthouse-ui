const now = new Date()
const currentYear = now.getFullYear()
const currentMonth = String(now.getMonth() + 1).padStart(2, '0')
const currentDate = String(now.getDate()).padStart(2, '0')
export const milisecondsXDay = 86400000

export const isoDate = () => `${currentYear}-${currentMonth}-${currentDate}`
export const firstOfMonth = () => `${currentYear}-${currentMonth}-01`

export const isValidDate = (value) => {
  const date = new Date(value)
  return !isNaN(date.getTime())
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

export const monthNames = {
  1: 'January',
  2: 'February',
  3: 'March',
  4: 'April',
  5: 'May',
  6: 'June',
  7: 'July',
  8: 'August',
  9: 'September',
  10: 'October',
  11: 'November',
  12: 'December'
}

export default {
  isoDate,
  firstOfMonth,
  milisecondsXDay,
  isValidDate,
  dayNames,
  monthNames,
}