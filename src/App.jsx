import { useAuth0 } from '@auth0/auth0-react'
import DashboardView from './views/DashboardView'
import StartView from './views/StartView'
import './App.css'

const ErrorMessage = () => <p>Sorry, we have an issue with the authentication.</p>

function App() {
  const { isAuthenticated, error } = useAuth0()

  return <>
  <header className='header'>
    <h1 className="header__title">Lighthouse</h1>
    <h3 className="header__subtitle">Habit Tracker</h3>
  </header>
  <main>
    { error && <ErrorMessage /> }
    { isAuthenticated && <DashboardView /> }
    { !isAuthenticated && <StartView /> }
  </main>
  </>
}

export default App
