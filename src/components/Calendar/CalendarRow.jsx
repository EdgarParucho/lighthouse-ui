const CalendarRow = (props) => (
<tr className='table__row'>
  <td className="table__cell table__cell_lg">
    <span>{props.habit.name}</span>
    <div className="table__dots-button">
      <button type='button' onClick={props.showDrawer} disabled={props.querying}>
        U
      </button>
      <button type='button' onClick={props.confirmAndDeleteHabit} disabled={props.querying}>
        D
      </button>
    </div>
  </td>
</tr>)

export default CalendarRow
