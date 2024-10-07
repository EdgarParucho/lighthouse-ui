import { useEffect, useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import LogoutButton from '../components/LogoutButton'
import getData from '../services/apiRequests'

function DashboardView() {
  const [data, setData] = useState(null)
  const { getAccessTokenSilently } = useAuth0()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = await getAccessTokenSilently()
        const userData = await getData(accessToken)
        setData(userData)
      } catch (error) {
        console.error('Error fetching data', error)
      }
    }
    fetchData()
}, [])

  return (
    <>
    <h1>Dashboard</h1>
    <div>{data ? JSON.stringify(data) : 'Loading...'}</div>
    <LogoutButton />
    </>
  )
}

export default DashboardView