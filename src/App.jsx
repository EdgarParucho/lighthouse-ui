import { useAuth0 } from '@auth0/auth0-react'
import DashboardView from './views/DashboardView'
import StartView from './views/StartView'
import './App.css'

const AuthErrorMessage = () => <p>There was an issue with the authentication. Please try again.</p>

const Main = ({ authError, loggedIn, loggedOut, onAuthError, onLoggedIn, onLoggedOut }) => {
  return <main>
    {authError && onAuthError()}
    {loggedOut && onLoggedOut()}
    {loggedIn && onLoggedIn()}
  </main>
}

function App() {
  const { isAuthenticated, error } = useAuth0()

  return <>
    <header className='header'>
      <h1 className="header__title">Lighthouse</h1>
      <h3 className="header__subtitle">Habit Tracker</h3>
    </header>
    <Main
    authError={error}
    loggedIn={isAuthenticated}
    loggedOut={!isAuthenticated}
    onAuthError={() => <AuthErrorMessage />}
    onLoggedIn={() => <DashboardView />}
    onLoggedOut={() => <StartView />}
    />
  </>
}

export default App
