import { useEffect, useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { DeleteRecord } from '../../services/recordService'
import Button from '../Layout/Button'
import dateUtils from '../../utils/dateUtils'
import './recordList.css'

const RecordList = (props) => {
  const { getAccessTokenSilently } = useAuth0()
  const [habitNames, setHabitNames] = useState({})

  useEffect(() => {
    const newHabitNames = props.habits.reduce(
      (previous, { id, name }) => Object({ ...previous, [id]: name }), {}
    )
    setHabitNames(newHabitNames)
  }, [props.habits])
  
  async function confirmAndDeleteRecord({ id }) {
    const confirmed = confirm(
      'You are about to delete this record.\n' +
      'This action is irreversible, please confirm to proceed.'
    )
    if (!confirmed) return
    props.setQuerying(true)
    const token = await getAccessTokenSilently()
    const { error, message } = await DeleteRecord({ token, recordID: id })
    alert(message)
    props.setQuerying(false)
    if (error) return
    const newRecords = [...props.records]
    const deletedIndex = newRecords.findIndex(record => record.id == id)
    newRecords.splice(deletedIndex, 1)
    props.setRecords(newRecords)
  }

  return <>
    <h2 className='subtitle'>Last Records</h2>
    { props.records.map(record => <div className='record-card' key={record.id}>
      <span className='record-card__label'>
        {dateUtils.getRelativeDate(record.date)}
      </span>
      <p>{habitNames[record.habitID]}</p>
      <Button
      type='button'
      modifiers={['w-sm', 'rounded-sm']}
      onClick={() => props.showDrawer({ option: 'recordForm', data: record })}
      text='Details'
      />
    </div>
    )}
  </>
}

export default RecordList
