import { useAuth0 } from '@auth0/auth0-react'
import LoginButton from './components/LoginButton'
import DashboardView from './views/DashboardView'
import './App.css'

function App() {
  const { isAuthenticated, isLoading } = useAuth0()

  if (isLoading) return <div>Loading ...</div>
  else if (!isAuthenticated) return <LoginButton />
  else return (
    <>
    <DashboardView />
    </>
  )
}

export default App
