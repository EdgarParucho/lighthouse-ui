import axios from '../api/axios'
import { errorMessage } from './index'

export function UpdateEmail({ token, values }) {
  const headers = { Authorization: 'Bearer ' + token }
  return axios.patch('/account', values, { headers })
    .then(() => Object({
      error: false,
      message: 'Done: Email updated',
    }))
    .catch((error) => Object({
      error: true,
      message: errorMessage(error),
    }))
}

export function DeleteAccount({ token }) {
  const headers = { Authorization: 'Bearer ' + token }
  return axios.delete('/account', { headers })
    .then(() => Object({
      error: false,
      message: 'Done: Account deleted',
    }))
    .catch((error) => Object({
      error: true,
      message: errorMessage(error),
    }))
}
