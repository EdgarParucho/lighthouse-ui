const CalendarRow = (props) => <>
  <p>{props.habit.name}</p>
  <button type='button' onClick={props.showDrawer}>Update</button>
  <button type='button' onClick={props.confirmAndDeleteHabit}>Delete</button>
</>

export default CalendarRow
