import { useAuth0 } from '@auth0/auth0-react'
import LoginButton from './components/LoginButton'
import DashboardView from './views/DashboardView'
import './App.css'

const ErrorMessage = () => <p>Sorry, we have an issue with the authentication.</p>

function App() {
  const { isAuthenticated, isLoading, error } = useAuth0()

  if (isLoading) return <div>Loading ...</div>
  else if (isAuthenticated) return <DashboardView />
  else if (error) return <ErrorMessage />
  else return <LoginButton />
}

export default App
