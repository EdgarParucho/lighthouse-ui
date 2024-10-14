import { useEffect, useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { GetAll } from '../services/'
import { CreateHabit } from '../services'
import LogoutButton from '../components/LogoutButton'
import Skeleton from '../components/Skeleton'

const Habit = ({habitName}) => <>
<div>
  <p>{habitName}</p>
  <button type='button' disabled>...</button>
</div>
</>

const HabitForm = ({ habits, setHabits }) => {
  const { getAccessTokenSilently } = useAuth0()
  const [formData, setFormData] = useState({ name: '', date: new Date() })
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  async function createHabit(e) {
    e.preventDefault()
    setLoading(true)
    const token = await getAccessTokenSilently()
    const { error, data, message } = await CreateHabit({ token, payload: formData })
    alert(message)
    setLoading(false)
    if (error) return
    const newHabits = [...habits, data]
    setHabits(newHabits)
  }

  return <>
  <form onSubmit={createHabit}>
    <label>
      <input
      type='text'
      placeholder='Habit name'
      maxLength={30}
      required
      name='name'
      onChange={handleChange}
      />
    </label>
    <label>
      <input type="date" name='date' onChange={handleChange} />
    </label>
    <button type="button" disabled={loading}>Cancel</button>
    <button type="submit" disabled={loading}>Confirm</button>
  </form>
  </>
}

function DashboardView() {
  const { getAccessTokenSilently } = useAuth0()
  const [habits, setHabits] = useState([])
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(false)
  const [errorFetching, setErrorFetching] = useState(false)

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
  <HabitForm habits={habits} setHabits={setHabits} />
  { habits.map(habit => <Habit habitName={habit.name} key={habit.id} />) }
  <LogoutButton />
  </>
}

export default DashboardView