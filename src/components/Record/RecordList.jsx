import { useEffect, useState } from 'react'
import Button from '../Layout/Button'
import dateUtils from '../../utils/dateUtils'
import './recordList.css'

const RecordList = (props) => {
  const [habitNames, setHabitNames] = useState({})

  useEffect(() => {
    const newHabitNames = props.habits.reduce(
      (previous, { id, name }) => Object({ ...previous, [id]: name }), {}
    )
    setHabitNames(newHabitNames)
  }, [props.habits])
  
  return <div className='record-list'>
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
  </div>
}

export default RecordList
