import './drawer.css'

const Drawer = (props) => {
  return (
    <div className='drawer'>
      {props.children}
    </div>
  )
}

export default Drawer
