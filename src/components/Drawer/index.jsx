import { useEffect, useState } from 'react'
import './drawer.css'

const Drawer = ({ modifiers, hideDrawer, children }) => {
  const [className, setClassName] = useState(
    modifiers ? `drawer drawer_${modifiers.join(' drawer_')}` : 'drawer'
  )

  useEffect(() => {
    setClassName(modifiers ? `drawer drawer_${modifiers.join(' drawer_')}` : 'drawer')
  }, [modifiers])


  return <>
    <div className='drawer-bg' onClick={hideDrawer} />
    <aside className={className}>
      {children}
    </aside>
  </>
}

export default Drawer
