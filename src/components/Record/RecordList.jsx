import { useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { DeleteRecord } from '../../services/recordService'
import RecordCard from './RecordCard'

const RecordList = (props) => {
  const { records, setRecords, habitNames, showRecordForm, } = props
  const { getAccessTokenSilently } = useAuth0()
  const [loading, setLoading] = useState(false)

  async function confirmAndDeleteRecord({ id }) {
    const confirmed = confirm(
      'You are about to delete this record.\n' +
      'This action is irreversible, please confirm to proceed.'
    )
    if (!confirmed) return
    setLoading(true)
    const token = await getAccessTokenSilently()
    const { error, message } = await DeleteRecord({ token, recordID: id })
    alert(message)
    setLoading(false)
    if (error) return
    const newRecords = [...records]
    const deletedIndex = newRecords.findIndex(record => record.id == id)
    newRecords.splice(deletedIndex, 1)
    setRecords(newRecords)
  }

  return <>
    <h2>Records</h2>
    { records.map(record => <RecordCard
      record={record}
      habitName={habitNames[record.habitID]}
      key={record.id}
      showRecordForm={() => showRecordForm(record)}
      confirmAndDeleteRecord={() => confirmAndDeleteRecord(record)}
      />
    )}
  </>
}

export default RecordList
