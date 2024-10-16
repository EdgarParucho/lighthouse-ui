const RecordCard = (props) => {
  const { record, habitName, showRecordForm } = props
  return <>
  <div>
    <span>{record.date}</span>
    <p>{habitName}</p>
    <p>{record.note}</p>
    <button type='button' onClick={showRecordForm}>Update</button>
  </div>
  </>
}

export default RecordCard