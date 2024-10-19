import { useAuth0 } from '@auth0/auth0-react'
import DashboardView from './views/DashboardView'
import { SelectionProvider } from './context/SelectionContext'
import './App.css'

const ErrorMessage = () => <p>Sorry, we have an issue with the authentication.</p>

function App() {
  const { isAuthenticated, isLoading, error, loginWithRedirect } = useAuth0()
  if (isLoading) return <div>Authenticating...</div>
  else if (isAuthenticated) {
    return (
    <SelectionProvider>
      <DashboardView />
    </SelectionProvider>
  )
  }
  else if (error) return <ErrorMessage />
  else return <button onClick={() => loginWithRedirect()}>Log In</button>
}

export default App
