import Button from './Button'
import image from  '../../assets/lighthouse-circle.jpg'
import './errorFetching.css'

const ErrorFetching = ({ fetchData, starting }) => <>
  <p className='text_lg text_centered text_my-20'>Sorry, something went wrong getting the data.</p>
  <Button
  type='button'
  onClick={() => fetchData()}
  text='Try Again'
  disabled={starting}
  modifiers={['mx-auto', 'mt-18', 'pulse', 'primary']}
  />
  <figure className='image-container'>
    <img src={image} alt='A lighthouse sketch' className='image' />
  </figure>
</>

export default ErrorFetching
