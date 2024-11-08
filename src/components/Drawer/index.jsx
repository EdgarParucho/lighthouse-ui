import { useEffect, useState } from 'react'
import AccountMenu from './AccountMenu'
import EmailForm from './EmailForm'
import RecordForm from './RecordForm'
import HabitForm from './HabitForm'
import './drawer.css'
const Drawer = (props) => {
  const [drawerContent, setDrawerContent] = useState(null)
  const [loading, setLoading] = useState(false)

  const drawerOptions = {
    accountMenu: AccountMenu,
    emailForm: EmailForm,
    habitForm: HabitForm,
    recordForm: RecordForm,
  }

  function showEmailForm() {
    props.showDrawer({ option: 'emailForm', data: null })
  }

  const getComponentProps = () => Object({
    accountMenu: { showEmailForm, hideDrawer: props.hideDrawer },
    emailForm: {
      hideDrawer: props.hideDrawer,
      loading,
      setLoading
    },
    habitForm: {
      habits: props.habits,
      setHabits: props.setHabits,
      loading,
      setLoading,
      selection: props.drawerData,
      hideDrawer: props.hideDrawer
    },
    recordForm: {
      habits: props.habits,
      records: props.records,
      setRecords: props.setRecords,
      loading,
      setLoading,
      selection: props.drawerData,
      hideDrawer: props.hideDrawer
    }
  })

  useEffect(() => {
    const Component = drawerOptions[props.drawerOption]
    const componentProps = getComponentProps()[props.drawerOption]
    setDrawerContent(<Component { ...componentProps } />)
  }, [props.drawerOption])

  return (
    <div className='drawer'>
      {drawerContent}
      <button type="button" onClick={props.hideDrawer} disabled={loading}>
        Close
      </button>
    </div>
  )
}

export default Drawer
