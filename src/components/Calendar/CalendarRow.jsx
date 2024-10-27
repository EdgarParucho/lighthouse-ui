const CalendarRow = (props) => <>
  <p>{props.habit.name}</p>
  <button type='button' onClick={props.showDrawer} disabled={props.querying}>
    Update
  </button>
  <button type='button' onClick={props.confirmAndDeleteHabit} disabled={props.querying}>
    Delete
  </button>
</>

export default CalendarRow
