import { useAuth0 } from '@auth0/auth0-react'
import './App.css'

const Profile = () => {
  const { user, isLoading, isAuthenticated } = useAuth0();

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  return (
    isAuthenticated && (
      <div>
        <img src={user.picture} alt={user.name} />
        <h2>{user.name}</h2>
        <p>{user.email}</p>
      </div>
    )
  )
}

const LogoutButton = () => {
  const { logout } = useAuth0();
  const logoutParams = { returnTo: import.meta.env.VITE_AUTH0_CALLBACK };
  return <button onClick={() => logout({ logoutParams })}>Log Out</button>
};


const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();
  return <button onClick={() => loginWithRedirect()}>Log In</button>
};

function App() {
  const { user, isAuthenticated, isLoading } = useAuth0();
  if (!isAuthenticated) return <LoginButton />
  else return (
    <>
    <Profile />
    <LogoutButton />
    </>
  )
}

export default App
