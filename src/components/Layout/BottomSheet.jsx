const BottomSheet = ({ children, hideBottomSheet }) => {
  return (
  <div>
    {children}
    <button type="button" onClick={hideBottomSheet}>Close</button>
  </div>)
}

export default BottomSheet
