const now = new Date()

export const monthNames = {
  0: 'January',
  1: 'February',
  2: 'March',
  3: 'April',
  4: 'May',
  5: 'June',
  6: 'July',
  7: 'August',
  8: 'September',
  9: 'October',
  10: 'November',
  11: 'December'
}

export const isoDate = (date = now) => {
  const yyyy = new Date(date).getFullYear()
  const mm = String(new Date(date).getMonth() + 1).padStart(2, '0')
  const dd = String(new Date(date).getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

export const isValidDate = (value) => {
  const date = new Date(value)
  return !isNaN(date.getTime())
}

export const firstOfMonth = (date = now) => {
  return isoDate(new Date(date.getFullYear(), date.getMonth(), 1))
}
