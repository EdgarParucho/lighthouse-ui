import Button from '../Layout/Button'

const CalendarRow = ({ habitID, habitName, habitCells, habits, showDrawer }) => {

  const getRecordTemplate = (date) => Object({
    habitID,
    date,
    note: ''
  })

  function showHabitForm() {
    showDrawer({ option: 'habitForm', data: habits.find(h => h.id == habitID) }) 
  }

  function showRecordForm(cell) {
    showDrawer({ option: 'recordForm', data: cell.record ?? getRecordTemplate(cell.date) })
  }

  return <tr>
    <td className="table__cell table__cell_sticky table__cell_lg">
      <Button
      type='button'
      onClick={showHabitForm}
      text={habitName}
      modifiers={['w-full', 'h-full']}
      />
    </td>
    { habitCells.map((cell, i) => (
      <td className="table__cell table__cell_font-bold" key={i}>
        <Button
        type='button'
        onClick={() => showRecordForm(cell)}
        disabled={cell.isFutureDate || cell.isBeforeHabitCreation}
        text={cell.record ? 'X' : ''}
        modifiers={['w-full', 'h-full', cell.record ? '' : 'mt-4']}
        />
    </td>
  ))}
  </tr>
}

export default CalendarRow
