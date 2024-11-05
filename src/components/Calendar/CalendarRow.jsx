const CalendarRow = ({ habitID, habitName, habitRecords }) => {
  return <tr>
    <td className="table__cell table__cell__fixed table__cell_lg table__cell_text-left">
      <span>{habitName}</span>
    </td>
    { habitRecords.map((record, i) => (
      <td className="table__cell table__cell_font-bold" key={i}>
      { record ? 'X' : '' }
    </td>
  ))}
  </tr>
}

export default CalendarRow
