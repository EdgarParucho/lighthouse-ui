import { useEffect, useRef, useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { Start } from '../services/'
import { DeleteHabit } from '../services/habitService'
import { DeleteRecord } from '../services/recordService'
import Skeleton from '../components/Layout/Skeleton'
import ErrorFetching from '../components/Layout/ErrorFetching'
import Section from '../components/Layout/Section'
import Calendar from '../components/Calendar'
import Chart from '../components/Chart'
import RecordList from '../components/Record/RecordList'
import Button from '../components/Layout/Button'
import Drawer from '../components/Drawer'
import AccountMenu from '../components/Drawer/AccountMenu'
import EmailForm from '../components/Drawer/EmailForm'
import HabitForm from '../components/Drawer/HabitForm'
import RecordForm from '../components/Drawer/RecordForm'
import DeletionAlert from '../components/Drawer/DeletionAlert'
import { DeleteAccount } from '../services/accountService'

const DashboardView = () => {
  const { getAccessTokenSilently, logout } = useAuth0()
  const [starting, setStarting] = useState(false)
  const [querying, setQuerying] = useState(false)
  const [errorFetching, setErrorFetching] = useState(false)
  const [habits, setHabits] = useState([])
  const [records, setRecords] = useState([])
  const [selectedMonthRecords, setSelectedMonthRecords] = useState([])
  const [daysElapsed, setDaysElapsed] = useState(1)
  const [showingDrawer, setShowingDrawer] = useState(false)
  const [drawerChild, setDrawerChild] = useState(null)
  const drawerModifiers = useRef([])

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
      setSelectedMonthRecords(data.records)
    }
    setStarting(false)
  }

  function drawerChildBuilder({ Component, props }) {
    setDrawerChild(<Component { ...{ ...props, hideDrawer, querying, setQuerying }} />)
  }

  function hideDrawer() {
    setShowingDrawer(false)
    setDrawerChild(null)
    drawerModifiers.current = []
  }

  function showAccountMenu() {
    drawerChildBuilder({
      Component: AccountMenu,
      props: {
        showEmailForm,
        showAccountDeletionAlert
      }
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
      props: {
        data,
        habits,
        records,
        setHabits,
        showHabitDeletionAlert: () => showHabitDeletionAlert(data)
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
    drawerModifiers.current.push('lg')
    setShowingDrawer(true)
  }

  function showHabitDeletionAlert(data) {
    hideDrawer()
    drawerChildBuilder({
      Component: DeletionAlert,
      props: {
        title: 'Delete Habit?',
        message: 'Confirm to permanently delete the habit and associated records.',
        action: () => deleteHabit(data)
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
        message: 'Confirm to permanently delete the record.',
        action: () => deleteRecord(data)
      }
    })
    setShowingDrawer(true)
  }

  function showAccountDeletionAlert() {
    hideDrawer()
    drawerChildBuilder({
      Component: DeletionAlert,
      props: {
        title: 'Delete Account?',
        message: 'Confirm to permanently delete the account.',
        action: () => deleteAccount()
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

  async function deleteAccount() {
    setQuerying(true)
    const token = await getAccessTokenSilently()
    const { error, message } = await DeleteAccount({ token })
    setQuerying(false)
    alert(message)
    if (error) return
    logout({ logoutParams: { returnTo: import.meta.env.VITE_AUTH0_CALLBACK } })
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
      <Calendar
      habits={habits}
      setHabits={setHabits}
      records={records}
      setRecords={setRecords}
      querying={querying}
      setQuerying={setQuerying}
      showHabitForm={showHabitForm}
      showRecordForm={showRecordForm}
      setDaysElapsed={setDaysElapsed}
      selectedMonthRecords={selectedMonthRecords}
      setSelectedMonthRecords={setSelectedMonthRecords}
      />
    </Section>
    { records.length > 0 &&
      <Section modifiers={['flex']}>
        <Chart habits={habits} records={selectedMonthRecords} daysElapsed={daysElapsed} />
        <RecordList { ...{ habits, selectedMonthRecords, querying, setQuerying, showRecordForm } } />
      </Section>
    }
    { showingDrawer &&
      <Drawer hideDrawer={hideDrawer} modifiers={drawerModifiers.current}>
        {drawerChild}
      </Drawer>
    }
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
