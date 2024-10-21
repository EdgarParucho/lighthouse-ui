const RecordCard = (props) => {
  const { record, habitName, showDrawer, confirmAndDeleteRecord } = props
  return <>
  <div>
    <span>{record.date}</span>
    <p>{habitName}</p>
    <p>{record.note}</p>
    <button type='button' onClick={showDrawer}>Update</button>
    <button type='button' onClick={confirmAndDeleteRecord}>Delete</button>
  </div>
  </>
}

export default RecordCard