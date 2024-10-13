import axios from '../api/axios'

const networkErrMessage = 'An error ocurred. It may be a network problem.'
const defaultErrMessage = 'An error ocurred. Please try again later while we solve it.'
const networkError = (e) => e.message?.toLowerCase().includes('network')
const errorMessage = (e) => networkError(e) ? networkErrMessage : defaultErrMessage

export function GetAll(token) {
  return axios.get('/', { headers: { Authorization: 'Bearer ' + token } })
    .then(({ status, data }) => Object({
      error: false,
      message: status == 201 ? 'Your new account is ready' : 'Data loaded',
      data,
    }))
    .catch((error) => Object({
      error: true,
      message: errorMessage(error),
      data: null,
    }))
}

export function CreateHabit({ token, payload }) {
  return axios.post('/habit', payload, { headers: { Authorization: 'Bearer ' + token } })
    .then(({ data }) => Object({
      error: false,
      message: 'Done: Habit created',
      data,
    }))
    .catch((error) => Object({
      error: true,
      message: errorMessage(error),
      data: null,
    }))
}
