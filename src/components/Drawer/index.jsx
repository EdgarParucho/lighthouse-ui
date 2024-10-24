import { useEffect, useState } from 'react'
import AccountMenu from './AccountMenu'
import EmailForm from './EmailForm'
import RecordForm from './RecordForm'
import HabitForm from './HabitForm'

const Drawer = (props) => {
  const [drawerContent, setDrawerContent] = useState(null)

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
      loading: props.loading,
      setLoading: props.setLoading
    },
    habitForm: {
      habits: props.habits,
      setHabits: props.setHabits,
      loading: props.loading,
      setLoading: props.setLoading,
      selection: props.drawerData,
      hideDrawer: props.hideDrawer
    },
    recordForm: {
      habits: props.habits,
      records: props.records,
      setRecords: props.setRecords,
      loading: props.loading,
      setLoading: props.setLoading,
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
    <div>
      {drawerContent}
      <button type="button" onClick={props.hideDrawer}>
        Close
      </button>
    </div>
  )
}

export default Drawer
