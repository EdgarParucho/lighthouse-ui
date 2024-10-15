import { useEffect, useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { GetAll } from '../services/'
import LogoutButton from '../components/LogoutButton'
import Skeleton from '../components/Skeleton'
import HabitForm from '../components/HabitForm'

const Habit = ({ habit, startUpdatingHabit }) => {
return <>
<div>
  <p>{habit.name}</p>
  <button type='button' onClick={startUpdatingHabit}>Update</button>
</div>
</>}

function DashboardView() {
  const { getAccessTokenSilently } = useAuth0()
  const [habits, setHabits] = useState([])
  const [selectedHabit, setSelectedHabit] = useState(null)
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(false)
  const [showingHabitForm, setShowingHabitForm] = useState(false)
  const [errorFetching, setErrorFetching] = useState(false)

  const showHabitForm = () => setShowingHabitForm(true)
  const hideHabitForm = () => {
    setSelectedHabit(null)
    setShowingHabitForm(false)
  }
  const startUpdatingHabit = (habit) => {
    setSelectedHabit({ ...habit })
    showHabitForm()
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
  <button type="button" onClick={showHabitForm}>Add Habit</button>
  { showingHabitForm &&
    <HabitForm
    habits={habits}
    selectedHabit={selectedHabit}
    setHabits={setHabits}
    hideHabitForm={hideHabitForm}
    />
  }
  { habits.map(habit => <Habit
    habit={habit}
    key={habit.id}
    startUpdatingHabit={() => startUpdatingHabit(habit)} />
  )}
  <LogoutButton />
  </>
}

export default DashboardView