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
    props.hideDrawer()
    props.showDrawer({ option: 'emailForm', data: null })
  }

  function getComponentProps() {
    switch (props.drawerOption) {
      case 'accountMenu':
        return { showEmailForm, hideDrawer: props.hideDrawer }
      case 'emailForm':
      return { hideDrawer: props.hideDrawer }
      case 'habitForm':
        return Object({
          habits: props.habits,
          setHabits: props.setHabits,
          loading: props.loading,
          setLoading: props.setLoading,
          selection: props.drawerData,
          hideDrawer: props.hideDrawer
        })
      case 'recordForm':
        return Object({
          habits: props.habits,
          records: props.records,
          setRecords: props.setRecords,
          loading: props.loading,
          setLoading: props.setLoading,
          selection: props.drawerData,
          hideDrawer: props.hideDrawer
        })
      default:
        break;
    }
  }

  useEffect(() => {
    const Component = drawerOptions[props.drawerOption]
    const componentProps = getComponentProps()
    setDrawerContent(<Component { ...componentProps } />)
  }, [])

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
