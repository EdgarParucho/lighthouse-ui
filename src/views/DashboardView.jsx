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
import './dashboardView.css'

const DashboardView = () => {
  const { getAccessTokenSilently } = useAuth0()
  const [starting, setStarting] = useState(false)
  const [querying, setQuerying] = useState(false)
  const [errorFetching, setErrorFetching] = useState(false)
  const [habits, setHabits] = useState([])
  const [records, setRecords] = useState([])
  const [showingDrawer, setShowingDrawer] = useState(false)
  const [drawerOption, setDrawerOption] = useState(null)
  const [drawerData, setDrawerData] = useState(null)

  async function fetchData() {
    setStarting(true)
    const token = await getAccessTokenSilently()
    const { error, data, message } = await Start(token)
    setStarting(false)
    alert(message)
    if (error) return setErrorFetching(true)
    else if (errorFetching) setErrorFetching(false)
    setHabits(data.habits)
    setRecords(data.records)
  }

  useEffect(() => { fetchData() }, [])

  function showDrawer({ option, data = null }) {
    if (showingDrawer) hideDrawer()
    setDrawerOption(option)
    setDrawerData(data)
    setShowingDrawer(true)
  }

  function hideDrawer() {
    setDrawerOption(null)
    if (drawerData != null) setDrawerData(null)
    setShowingDrawer(false)
  }

  if (starting) return <Skeleton />
  else if (errorFetching) return <ErrorFetching fetchData={fetchData} />
  else return <>
    <button
    className='button button_absolute button_top-10 button_right-10'
    onClick={() => showDrawer({ option: 'accountMenu', data: null })}
    disabled={querying}
    >
      Account
    </button>
    <Section>
      <Calendar { ...{ habits, setHabits, records, setRecords, querying, setQuerying, showDrawer } } />
    </Section>
    <Section>
      <RecordList { ...{ habits, records, setRecords, querying, setQuerying, showDrawer } } />
    </Section>
    { showingDrawer && <Drawer { ...{
      showDrawer,
      hideDrawer,
      drawerOption,
      drawerData,
      habits,
      setHabits,
      records,
      setRecords,
      querying,
      setQuerying
    } } />}
    <MainButton showDrawer={() => showDrawer({ option: 'recordForm', data: null })} />
  </>
}

export default DashboardView
