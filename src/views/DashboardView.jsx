import { useEffect, useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { GetAll } from '../services/'
import { CreateHabit } from '../services'
import LogoutButton from '../components/LogoutButton'
import Skeleton from '../components/Skeleton'

function DashboardView() {
  const { getAccessTokenSilently } = useAuth0()
  const [habits, setHabits] = useState([])
  const [records, setRecords] = useState([])
  const [isFetching, setIsFetching] = useState(false)
  const [errorFetching, setErrorFetching] = useState(false)

  async function fetchData() {
    setIsFetching(true)
    const token = await getAccessTokenSilently()
    const { error, data, message } = await GetAll(token)
    alert(message)
    setIsFetching(false)
    if (error) return setErrorFetching(true)
    else if (errorFetching) setErrorFetching(false)
    setHabits(data.habits)
    setRecords(data.records)
  }

  async function createHabit(payload) {
    setIsFetching(true)
    const token = await getAccessTokenSilently()
    const { error, data, message } = await CreateHabit({ token, payload })
    alert(message)
    setIsFetching(false)
    if (error) return
    const newHabits = [...habits]
    newHabits.push({ ...data })
    setHabits(newHabits)
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
  else return isFetching ? <Skeleton /> : (
    <>
    <h1>Dashboard</h1>
    <pre>Records: {JSON.stringify(records)}</pre>
    <pre>Habits: {JSON.stringify(habits)}</pre>
    <LogoutButton />
    </>
  )
}

export default DashboardView