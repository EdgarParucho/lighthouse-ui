import { useEffect, useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { GetAll } from '../services/'
import { DeleteHabit } from '../services/habitService'
import LogoutButton from '../components/LogoutButton'
import Skeleton from '../components/Skeleton'
import HabitForm from '../components/HabitForm'
import RecordForm from '../components/RecordForm'
import RecordCard from '../components/RecordCard'
import { DeleteRecord } from '../services/recordService'

const Habit = ({ habit, showHabitForm, askConfirmationToDeleteHabit }) => {
return <>
<div>
  <p>{habit.name}</p>
  <button type='button' onClick={showHabitForm}>Update</button>
  <button type='button' onClick={askConfirmationToDeleteHabit}>Delete</button>
</div>
</>}

function DashboardView() {
  const { getAccessTokenSilently } = useAuth0()
  const [habits, setHabits] = useState([])
  const [selectedHabit, setSelectedHabit] = useState(null)
  const [selectedRecord, setSelectedRecord] = useState(null)
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(false)
  const [showingHabitForm, setShowingHabitForm] = useState(false)
  const [showingRecordForm, setShowingRecordForm] = useState(false)
  const [errorFetching, setErrorFetching] = useState(false)
  const [habitNames, setHabitNames] = useState({})

  const showHabitForm = (habit = null) => {
    if (habit != null) setSelectedHabit({ ...habit })
    setShowingHabitForm(true)
  }
  const hideHabitForm = () => {
    setSelectedHabit(null)
    setShowingHabitForm(false)
  }

  const showRecordForm = (record = null) => {
    if (record != null) setSelectedRecord({ ...record })
    setShowingRecordForm(true)
  }
  const hideRecordForm = () => {
    setSelectedRecord(null)
    setShowingRecordForm(false)
  }

  const askConfirmationToDeleteHabit = async ({ id }) => {
    const deletionConfirmed = confirm('You are about to delete this habit and its records.\nThis action is irreversible, please confirm to proceed.')
    if (!deletionConfirmed) return
    setLoading(true)
    const token = await getAccessTokenSilently()
    const { error, message } = await DeleteHabit({ token, habitID: id })
    alert(message)
    setLoading(false)
    if (error) return setErrorFetching(true)
    else if (errorFetching) setErrorFetching(false)
    const newHabits = [...habits]
    const deletedIndex = newHabits.findIndex(habit => habit.id == id)
    newHabits.splice(deletedIndex, 1)
    setHabits(newHabits)
  }

  const askConfirmationToDeleteRecord = async ({ id }) => {
    const deletionConfirmed = confirm('You are about to delete this record.\nThis action is irreversible, please confirm to proceed.')
    if (!deletionConfirmed) return
    setLoading(true)
    const token = await getAccessTokenSilently()
    const { error, message } = await DeleteRecord({ token, recordID: id })
    alert(message)
    setLoading(false)
    if (error) return setErrorFetching(true)
    else if (errorFetching) setErrorFetching(false)
    const newRecords = [...records]
    const deletedIndex = newRecords.findIndex(record => record.id == id)
    newRecords.splice(deletedIndex, 1)
    setRecords(newRecords)
  }

  async function fetchData() {
    setLoading(true)
    const token = await getAccessTokenSilently()
    const { error, data, message } = await GetAll(token)
    alert(message)
    setLoading(false)
    if (error) return setErrorFetching(true)
    else if (errorFetching) setErrorFetching(false)
    setHabits(data.habits)
    setRecords(data.records)
  }

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    const newHabitNames = habits.reduce(
      (previous, { id, name }) => Object({ ...previous, [id]: name }), {}
    )
    setHabitNames(newHabitNames)
  }, [habits])

  if (errorFetching) return (
    <>
    <p>Sorry, something went wrong getting the data.</p>
    <button type='button' onClick={() => fetchData()}>Get data</button>
    </>
  )
  else if (loading) return <Skeleton />
  else return <>
  <h1>Dashboard</h1>
  <button type="button" onClick={() => showHabitForm()}>Add Habit</button>
  <button type="button" onClick={() => showRecordForm()}>Add Record</button>
  { showingHabitForm &&
    <HabitForm
    habits={habits}
    selectedHabit={selectedHabit}
    setHabits={setHabits}
    hideHabitForm={hideHabitForm}
    />
  }
  { showingRecordForm &&
    <RecordForm
    habits={habits}
    records={records}
    selectedRecord={selectedRecord}
    setRecords={setRecords}
    hideRecordForm={hideRecordForm}
    />
  }
  <h2>Habits</h2>
  { habits.map(habit => <Habit
    habit={habit}
    key={habit.id}
    showHabitForm={() => showHabitForm(habit)}
    askConfirmationToDeleteHabit={() => askConfirmationToDeleteHabit(habit)}
    />
  )}
  <h2>Records</h2>
  { records.map(record => <RecordCard
    record={record}
    habitName={habitNames[record.habitID]}
    key={record.id}
    showRecordForm={() => showRecordForm(record)}
    askConfirmationToDeleteRecord={() => askConfirmationToDeleteRecord(record)}
    />
  )}
  <LogoutButton />
  </>
}

export default DashboardView