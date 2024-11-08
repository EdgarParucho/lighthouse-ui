const DeletionAlert = (props) => <div>
  <h3>{props.title}</h3>
  <p>{props.message}</p>
  <button type="button" onClick={props.hideDrawer}>Cancel</button>
  <button type="button" onClick={props.action}>Confirm</button>
</div>

export default DeletionAlert