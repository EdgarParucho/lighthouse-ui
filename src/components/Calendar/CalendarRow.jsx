const CalendarRow = ({ habit, showHabitForm, confirmAndDeleteHabit }) => <>
  <p>{habit.name}</p>
  <button type='button' onClick={showHabitForm}>Update</button>
  <button type='button' onClick={confirmAndDeleteHabit}>Delete</button>
</>

export default CalendarRow
