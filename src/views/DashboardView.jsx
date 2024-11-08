import { useEffect, useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { Start } from '../services/'
import { DeleteHabit } from '../services/habitService'
import { DeleteRecord } from '../services/recordService'
import Skeleton from '../components/Layout/Skeleton'
import ErrorFetching from '../components/Layout/ErrorFetching'
import Section from '../components/Layout/Section'
import Calendar from '../components/Calendar'
import RecordList from '../components/Record/RecordList'
import Button from '../components/Layout/Button'
import Drawer from '../components/Drawer'
import AccountMenu from '../components/Drawer/AccountMenu'
import EmailForm from '../components/Drawer/EmailForm'
import HabitForm from '../components/Drawer/HabitForm'
import RecordForm from '../components/Drawer/RecordForm'
import DeletionAlert from '../components/Drawer/DeletionAlert'

const DashboardView = () => {
  const { getAccessTokenSilently } = useAuth0()
  const [starting, setStarting] = useState(false)
  const [querying, setQuerying] = useState(false)
  const [errorFetching, setErrorFetching] = useState(false)
  const [habits, setHabits] = useState([])
  const [records, setRecords] = useState([])
  const [showingDrawer, setShowingDrawer] = useState(false)
  const [drawerChild, setDrawerChild] = useState(null)

  useEffect(() => { fetchData() }, [])

  async function fetchData() {
    setStarting(true)
    const token = await getAccessTokenSilently()
    const { error, data, message } = await Start(token)
    alert(message)
    if (error) setErrorFetching(true)
    else if (errorFetching) setErrorFetching(false)
    else {
      setHabits(data.habits)
      setRecords(data.records)
    }
    setStarting(false)
  }

  function drawerChildBuilder({ Component, props }) {
    setDrawerChild(<Component { ...{ ...props, hideDrawer, querying, setQuerying }} />)
  }

  function hideDrawer() {
    setShowingDrawer(false)
    setDrawerChild(null)
  }

  function showAccountMenu() {
    drawerChildBuilder({
      Component: AccountMenu,
      props: { showEmailForm }
    })
    setShowingDrawer(true)
  }

  function showEmailForm() {
    hideDrawer()
    drawerChildBuilder({
      Component: EmailForm,
      props: {}
    })
    setShowingDrawer(true)
  }

  function showHabitForm(data = null) {
    drawerChildBuilder({
      Component: HabitForm,
      props: { data, habits, setHabits, showHabitDeletionAlert: () => showHabitDeletionAlert(data) }
    })
    setShowingDrawer(true)
  }

  function showHabitDeletionAlert(data) {
    hideDrawer()
    drawerChildBuilder({
      Component: DeletionAlert,
      props: {
        title: 'Delete Habit?',
        message: 'This action is irreversible. Confirm to delete the habit and its records.',
        action: () => deleteHabit(data)
      }
    })
    setShowingDrawer(true)
  }

  function showRecordForm(data = null) {
    drawerChildBuilder({
      Component: RecordForm,
      props: {
        data,
        habits,
        records,
        setHabits,
        setRecords,
        showRecordDeletionAlert: () => showRecordDeletionAlert(data)
      }
    })
    setShowingDrawer(true)
  }

  function showRecordDeletionAlert(data) {
    hideDrawer()
    drawerChildBuilder({
      Component: DeletionAlert,
      props: {
        title: 'Delete Record?',
        message: 'This action is irreversible.',
        action: () => deleteRecord(data)
      }
    })
    setShowingDrawer(true)
  }

  async function deleteHabit({ id }) {
    setQuerying(true)
    const token = await getAccessTokenSilently()
    const { error, message } = await DeleteHabit({ token, habitID: id })
    setQuerying(false)
    alert(message)
    if (error) return
    removeHabit(id)
    hideDrawer()
  }

  async function deleteRecord({ id }) {
    setQuerying(true)
    const token = await getAccessTokenSilently()
    const { error, message } = await DeleteRecord({ token, recordID: id })
    setQuerying(false)
    alert(message)
    if (error) return
    const newRecords = records.filter(record => record.id != id)
    setRecords(newRecords)
    hideDrawer()
  }

  function removeHabit(id) {
    const newHabits = [...habits]
    const deletedIndex = newHabits.findIndex(habit => habit.id == id)
    newHabits.splice(deletedIndex, 1)
    setHabits(newHabits)
    const newRecords = records.filter(record => record.habitID != id)
    setRecords(newRecords)
  }

  if (starting) return <Skeleton />
  errorFetching && <ErrorFetching fetchData={fetchData} />
  return <>
    <Button
    type='button'
    disabled={querying}
    onClick={showAccountMenu}
    text='Account'
    modifiers={['absolute', 'top-10', 'right-10']}
    />
    <Section>
      <Calendar { ...{ habits, setHabits, records, setRecords, querying, setQuerying, showHabitForm, showRecordForm } } />
    </Section>
    {records.length > 0 &&
    <Section modifiers={['mb-60']}>
      <RecordList { ...{ habits, records, setRecords, querying, setQuerying, showRecordForm } } />
    </Section>}
    { showingDrawer && <Drawer hideDrawer={hideDrawer}>{drawerChild}</Drawer>}
    { habits.length > 0 &&
    <Button
    type='button'
    disabled={querying}
    onClick={() => showRecordForm()}
    text='Add Record'
    modifiers={['primary', 'fixed', 'bottom-0', 'w-full', 'h-lg']}
    />}
  </>
}

export default DashboardView
