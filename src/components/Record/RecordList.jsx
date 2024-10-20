import { useEffect, useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { DeleteRecord } from '../../services/recordService'
import RecordCard from './RecordCard'

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
    props.setLoading(true)
    const token = await getAccessTokenSilently()
    const { error, message } = await DeleteRecord({ token, recordID: id })
    alert(message)
    props.setLoading(false)
    if (error) return
    const newRecords = [...props.records]
    const deletedIndex = newRecords.findIndex(record => record.id == id)
    newRecords.splice(deletedIndex, 1)
    props.setRecords(newRecords)
  }

  return <>
    <h2>Records</h2>
    { props.records.map(record => <RecordCard
      record={record}
      habitName={habitNames[record.habitID]}
      key={record.id}
      showDrawer={() => props.showDrawer({ option: 'recordForm', data: record })}
      confirmAndDeleteRecord={() => confirmAndDeleteRecord(record)}
      />
    )}
  </>
}

export default RecordList
