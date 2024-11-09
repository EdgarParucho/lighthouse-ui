import Button from '../Layout/Button'

const DeletionAlert = (props) => <div>
  <h3>{props.title}</h3>
  <p>{props.message}</p>
  <Button type="button" modifiers={['mt-18']} onClick={props.hideDrawer} text='Cancel' />
  <Button type="button" modifiers={['mt-18']} onClick={props.action} text='Confirm' />
</div>

export default DeletionAlert