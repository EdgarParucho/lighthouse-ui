import Button from '../Layout/Button'

const CalendarRow = ({ habitID, habitName, habitCells, showDrawer }) => {

  const template = (date) => Object({
    habitID,
    date,
    note: ''
  })

  return <tr>
    <td className="table__cell table__cell_sticky table__cell_lg table__cell_text-left">
      <span>{habitName}</span>
    </td>
    { habitCells.map((cell, i) => (
      <td className="table__cell table__cell_font-bold" key={i}>
        <Button
        type='button'
        onClick={() => showDrawer(cell.record ?? template(cell.date) )}
        disabled={cell.isFutureDate || cell.isBeforeHabitCreation}
        text={cell.record ? 'X' : ''}
        modifiers={['w-full', 'h-full', cell.record ? '' : 'mt-4']}
        />
    </td>
  ))}
  </tr>
}

export default CalendarRow
