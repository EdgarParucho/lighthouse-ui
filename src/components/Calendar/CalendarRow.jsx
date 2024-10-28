const CalendarRow = (props) => {
  return (
  <tr className='table__row'>
    <td className="table__cell table__cell_lg">
      <span>{props.habitName}</span>
      <div className="table__dots-button">
        <button type='button' onClick={props.showDrawer} disabled={props.querying}>
          U
        </button>
        <button type='button' onClick={props.confirmAndDeleteHabit} disabled={props.querying}>
          D
        </button>
      </div>
    </td>
    {props.records.map((record, i) => <td key={i} className="table__cell table__cell_text-center">{record ? 'X' : ''}</td>)}
  </tr>)
}

export default CalendarRow
