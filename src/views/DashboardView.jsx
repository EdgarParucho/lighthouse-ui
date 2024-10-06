import LogoutButton from '../components/LogoutButton'
import axiosInstance from '../api/axios'
import { useEffect, useState } from 'react'

function DashboardView() {
  const [data, setData] = useState(null)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get()
        setData(response.data)
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