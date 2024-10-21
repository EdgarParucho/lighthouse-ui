import { useEffect, useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { Start } from '../services/'
import Skeleton from '../components/Layout/Skeleton'
import ErrorFetching from '../components/Layout/ErrorFetching'
import Section from '../components/Layout/Section'
import Calendar from '../components/Calendar'
import RecordList from '../components/Record/RecordList'
import MainButton from '../components/Layout/MainButton'
import BottomSheet from '../components/Layout/BottomSheet'
import AccountMenu from '../components/Account/AccountMenu'
import EmailForm from '../components/Account/EmailForm'
import RecordForm from '../components/Record/RecordForm'
import HabitForm from '../components/Calendar/HabitForm'

const DashboardView = () => {
  const { getAccessTokenSilently } = useAuth0()
  const [habits, setHabits] = useState([])
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(false)
  const [showingBottomSheet, setShowingBottomSheet] = useState(false)
  const [bottomSheetChild, setBottomSheetChild] = useState(null)
  const [errorFetching, setErrorFetching] = useState(false)
  const [habitNames, setHabitNames] = useState({})

  function hideBottomSheet() {
    setShowingBottomSheet(false)
    setBottomSheetChild(null)
  }
  
  function showEmailForm() {
    hideBottomSheet()
    const props = { hideBottomSheet }
    setBottomSheetChild(<EmailForm {...props} />)
    setShowingBottomSheet(true)
  }

  function showAccountMenu() {
    const props = { showEmailForm, hideBottomSheet }
    setBottomSheetChild(<AccountMenu {...props} />)
    setShowingBottomSheet(true)
  }

  function showHabitForm(selection = null) {
    const props = { habits, selection, setHabits, hideBottomSheet }
    setBottomSheetChild(<HabitForm {...props} />)
    setShowingBottomSheet(true)
  }

  function showRecordForm(selection = null) {
    const props = { habits, records, selection, setRecords, hideBottomSheet }
    setBottomSheetChild(<RecordForm {...props} />)
    setShowingBottomSheet(true)
  }

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

  function updateHabitNames() {
    const newHabitNames = habits.reduce(
      (previous, { id, name }) => Object({ ...previous, [id]: name }), {}
    )
    setHabitNames(newHabitNames)
  }

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    updateHabitNames()
  }, [habits])

  if (errorFetching) return <ErrorFetching fetchData={fetchData} />
  else if (loading) return <Skeleton />
  return <>
  <button type='button' onClick={showAccountMenu}>Account</button>
  <h1>Lighthouse</h1>
  <Section>
    <Calendar { ...{ habits, setHabits, setRecords, showHabitForm } } />
  </Section>
  <Section>
    <RecordList { ...{ records, habitNames, showRecordForm } } />
  </Section>
  {showingBottomSheet &&
    <BottomSheet hideBottomSheet={hideBottomSheet}>
      {bottomSheetChild}
    </BottomSheet>
  }
  <MainButton showRecordForm={() => showRecordForm()} />
  </>
}

export default DashboardView
