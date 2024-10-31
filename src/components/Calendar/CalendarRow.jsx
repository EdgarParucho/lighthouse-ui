const CalendarRow = (props) => {
  return <tr className='table__row'>
    <td className="table__cell table__cell_lg table__cell_pl-2">
      <span>{props.habitName}</span>
      <button
      className="button button_h-sm button_w-sm button_absolute button_right-1 button_top-1">
        ...
      </button>
    </td>
    { props.records.map((record, i) => (
      <td className="table__cell table__cell_text-center table__cell_font-bold" key={i}>
        {record ? 'X' : ''}
      </td>
    ))}
  </tr>
}

export default CalendarRow
