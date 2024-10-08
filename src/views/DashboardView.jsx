import { useEffect, useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { Get } from '../services/'
import LogoutButton from '../components/LogoutButton'
import Skeleton from '../components/Skeleton'

function DashboardView() {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0()
  const [account, setAccount] = useState(null)
  const [habits, setHabits] = useState(null)
  const [records, setRecords] = useState(null)
  const [isFetching, setIsFetching] = useState(false)
  const [errorFetching, setErrorFetching] = useState(false)

  useEffect(() => {
    setIsFetching(true)
    const fetchData = async () => {
      try {
        const accessToken = await getAccessTokenSilently()
        const response = await Get(accessToken)
        setIsFetching(false)
      } catch (error) {
        alert('Error fetching data')
        setErrorFetching(true)
        setIsFetching(false)
      }
    }
    fetchData()
}, [])

  if (errorFetching) return <p>Sorry, something went wrong getting the data.</p>
  else return isFetching ? <Skeleton /> : (
    <>
    <h1>Dashboard</h1>
    <LogoutButton />
    </>
  )
}

export default DashboardView