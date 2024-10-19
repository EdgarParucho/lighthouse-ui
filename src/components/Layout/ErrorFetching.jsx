const ErrorFetching = ({ fetchData }) => <>
  <p>Sorry, something went wrong getting the data.</p>
  <button type='button' onClick={() => fetchData()}>Try Again</button>
</>

export default ErrorFetching
