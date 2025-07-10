import { useAuth0 } from '@auth0/auth0-react'
import { useState, useEffect } from 'react'
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
  const [demoMode, setDemoMode] = useState(false)

  useEffect(() => setDemoMode(window.location.pathname.includes('demo')), [])

  return <>
    <header className='header'>
      <h1 className="header__title">Lighthouse</h1>
      <p className="header__subtitle">Habit Tracker</p>
    </header>
    <Main
    authError={error}
    loggedIn={isAuthenticated || demoMode}
    loggedOut={!isAuthenticated && !demoMode}
    onAuthError={() => <AuthErrorMessage />}
    onLoggedIn={() => <DashboardView demoMode={demoMode} setDemoMode={setDemoMode} />}
    onLoggedOut={() => <StartView setDemoMode={setDemoMode} />}
    />
  </>
}

export default App
