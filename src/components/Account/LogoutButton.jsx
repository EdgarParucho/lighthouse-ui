import { useAuth0 } from '@auth0/auth0-react'

function LogoutButton() {
  const { logout } = useAuth0()
  const logoutParams = { returnTo: import.meta.env.VITE_AUTH0_CALLBACK }
  return (
    <>
    <button onClick={() => logout({ logoutParams })}>Log Out</button>
    </>
  )
}

export default LogoutButton
