import './drawer.css'

const Drawer = ({ modifiers, hideDrawer, children }) => {
  const className = modifiers ? `drawer drawer_${modifiers.join(' drawer_')}` : 'drawer'
  return <>
    <div className='drawer-bg' onClick={hideDrawer} />
    <div className={className}>
      {children}
    </div>
  </>
}

export default Drawer
