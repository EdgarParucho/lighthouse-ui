import { useEffect, useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { Start } from '../services/'
import { useSelectionContext } from '../context/SelectionContext'
import Skeleton from '../components/Layout/Skeleton'
import ErrorFetching from '../components/Layout/ErrorFetching'
import Section from '../components/Layout/Section'
import Calendar from '../components/Calendar'
import RecordList from '../components/Record/RecordList'
import BottomSheet from '../components/Layout/BottomSheet'
import MainButton from '../components/Layout/MainButton'
import RecordForm from '../components/Record/RecordForm'
import HabitForm from '../components/Calendar/HabitForm'
import AccountMenu from '../components/Account/AccountMenu'
import EmailForm from '../components/Account/EmailForm'

const DashboardView = () => {
  const { getAccessTokenSilently } = useAuth0()
  const { setSelectedData } = useSelectionContext()
  const [habits, setHabits] = useState([])
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(false)
  const [showingBottomSheet, setShowingBottomSheet] = useState(false)
  const [bottomSheetChild, setBottomSheetChild] = useState(null)
  const [errorFetching, setErrorFetching] = useState(false)
  const [habitNames, setHabitNames] = useState({})

  const emailFormProps = { hideBottomSheet }
  const calendarProps = { habits, setHabits, setRecords, showHabitForm }
  const recordListProps = { records, habitNames, showRecordForm }
  const habitFormProps = { habits, setHabits, hideBottomSheet }
  const recordFormProps = { habits, records, setRecords, hideBottomSheet }
  
  function hideBottomSheet() {
    setShowingBottomSheet(false)
    setBottomSheetChild(null)
    setSelectedData(null)
  }

  function showEmailForm() {
    hideBottomSheet()
    setBottomSheetChild(<EmailForm {...emailFormProps} />)
    setShowingBottomSheet(true)
  }

  function showAccountMenu() {
    const accountMenuProps = {
      showEmailForm,
      hideBottomSheet
    }
    setBottomSheetChild(<AccountMenu {...accountMenuProps} />)
    setShowingBottomSheet(true)
  }

  function showHabitForm(habit = null) {
    if (habit != null) setSelectedData({ ...habit })
    setBottomSheetChild(<HabitForm {...habitFormProps} />)
    setShowingBottomSheet(true)
  }

  function showRecordForm(record = null) {
    if (record != null) setSelectedData({ ...record })
    setBottomSheetChild(<RecordForm {...recordFormProps} />)
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
    <Calendar {...calendarProps} />
  </Section>
  <Section>
    <RecordList {...recordListProps} />
  </Section>
  {showingBottomSheet &&
    <BottomSheet hideBottomSheet={hideBottomSheet}>
      {bottomSheetChild}
    </BottomSheet>
  }
  <MainButton showRecordForm={showRecordForm} />
  </>
}

export default DashboardView