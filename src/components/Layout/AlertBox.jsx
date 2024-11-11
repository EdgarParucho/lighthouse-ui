import { useState } from 'react';
import './alertBox.css'

const AlertBox = ({ message }) => {
  const [className, setClassName] = useState('alert-box alert-box_showing')
  setTimeout(() => setClassName('alert-box alert-box_hidden'), 3600)

  return <div className={className}>
    <p>{message}</p>
  </div>
}

export default AlertBox