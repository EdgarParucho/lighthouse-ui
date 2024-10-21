import { useEffect, useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { Start } from '../services/'
import Skeleton from '../components/Layout/Skeleton'
import ErrorFetching from '../components/Layout/ErrorFetching'
import Section from '../components/Layout/Section'
import Calendar from '../components/Calendar'
import RecordList from '../components/Record/RecordList'
import MainButton from '../components/Layout/MainButton'
import Drawer from '../components/Drawer'

const DashboardView = () => {
  const { getAccessTokenSilently } = useAuth0()
  const [loading, setLoading] = useState(false)
  const [errorFetching, setErrorFetching] = useState(false)
  const [habits, setHabits] = useState([])
  const [records, setRecords] = useState([])
  const [showingDrawer, setShowingDrawer] = useState(false)
  const [drawerOption, setDrawerOption] = useState(null)
  const [drawerData, setDrawerData] = useState(null)

  async function fetchData() {
    setLoading(true)
    const token = await getAccessTokenSilently()
    const { error, data, message } = await Start(token)
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

  function showDrawer({ option, data = null }) {
    setDrawerOption(option)
    setDrawerData(data)
    setShowingDrawer(true)
  }

  function hideDrawer() {
    if (drawerData != null) setDrawerData(null)
    setShowingDrawer(false)
  }

  if (errorFetching) return <ErrorFetching fetchData={fetchData} />
  else if (loading) return <Skeleton />
  return <>
  <button
  type='button'
  onClick={() => showDrawer({ option: 'accountMenu', data: null })}
  >
    Account
  </button>
  <h1>Lighthouse</h1>
  <Section>
    <Calendar { ...{ habits, records, setHabits, setRecords, showDrawer, setLoading } } />
  </Section>
  <Section>
    <RecordList { ...{ habits, records, setRecords, showDrawer, setLoading } } />
  </Section>
  {showingDrawer && <Drawer
    drawerOption={drawerOption}
    showDrawer={showDrawer}
    drawerData={drawerData}
    hideDrawer={hideDrawer}
    habits={habits}
    setHabits={setHabits}
    records={records}
    setRecords={setRecords}
    loading={loading}
    setLoading={setLoading}
  />}
  <MainButton showDrawer={() => showDrawer({ option: 'recordForm', data: null })} />
  </>
}

export default DashboardView
