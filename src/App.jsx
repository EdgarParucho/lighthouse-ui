import { useAuth0 } from '@auth0/auth0-react'
import DashboardView from './views/DashboardView'
import StartView from './views/StartView'
import './App.css'

const ErrorMessage = () => <p>Sorry, we have an issue with the authentication.</p>

function App() {
  const { isAuthenticated, error } = useAuth0()

  if (error) return <ErrorMessage />
  else if (isAuthenticated) return <DashboardView />
  else return <StartView />
  
}

export default App
