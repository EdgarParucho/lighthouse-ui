const now = new Date()
const year = now.getFullYear()
const month = String(now.getMonth() + 1).padStart(2, '0')
const day = String(now.getDate()).padStart(2, '0')

export const isoDate = () => `${year}-${month}-${day}`
export const firstOfMonth = () => `${year}-${month}-01`

export const isValidDate = (value) => {
  const date = new Date(value)
  return !isNaN(date.getTime())
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
