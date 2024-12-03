import { useState } from 'react'
import Button from '../Layout/Button'


const DeletionAlert = (props) => {
  const [querying, setQuerying] = useState(false) 
  
  function deleteData() {
    setQuerying(true)
    props.action()
    setQuerying(false)
  }

return <div>
  <h3>{props.title}</h3>
  <p>{props.message}</p>
  <Button
  type="button"
  modifiers={['mt-18']}
  onClick={props.hideDrawer}
  disabled={querying}
  text='Cancel'
  />
  <Button
  type="button"
  modifiers={['mt-18']}
  onClick={deleteData}
  disabled={querying}
  text='Confirm'
  />
</div>}

export default DeletionAlert