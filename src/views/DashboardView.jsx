import { useEffect, useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { GetAll } from '../services/'
import { DeleteHabit } from '../services/habitService'
import LogoutButton from '../components/LogoutButton'
import Skeleton from '../components/Skeleton'
import HabitForm from '../components/HabitForm'
import RecordForm from '../components/RecordForm'

const Habit = ({ habit, showHabitForm, askDeleteConfirmation }) => {
return <>
<div>
  <p>{habit.name}</p>
  <button type='button' onClick={showHabitForm}>Update</button>
  <button type='button' onClick={askDeleteConfirmation}>Delete</button>
</div>
</>}

function DashboardView() {
  const { getAccessTokenSilently } = useAuth0()
  const [habits, setHabits] = useState([])
  const [selectedHabit, setSelectedHabit] = useState(null)
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(false)
  const [showingHabitForm, setShowingHabitForm] = useState(false)
  const [showingRecordForm, setShowingRecordForm] = useState(false)
  const [errorFetching, setErrorFetching] = useState(false)

  const showHabitForm = (habit = null) => {
    if (habit != null) setSelectedHabit({ ...habit })
    setShowingHabitForm(true)
  }
  const hideHabitForm = () => {
    setSelectedHabit(null)
    setShowingHabitForm(false)
  }

  const showRecordForm = () => setShowingRecordForm(true)
  const hideRecordForm = () => setShowingRecordForm(false)

  const askDeleteConfirmation = async ({ id }) => {
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
    records={records}
    habits={habits}
    setRecords={setRecords}
    hideRecordForm={hideRecordForm}
    />
  }
  { habits.map(habit => <Habit
    habit={habit}
    key={habit.id}
    showHabitForm={() => showHabitForm(habit)}
    askDeleteConfirmation={() => askDeleteConfirmation(habit)}/>
  )}
  <LogoutButton />
  </>
}

export default DashboardView