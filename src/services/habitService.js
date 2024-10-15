import axios from '../api/axios'
import { errorMessage } from './index'

export function CreateHabit({ token, payload }) {
  const headers = { Authorization: 'Bearer ' + token }
  return axios.post('/habit', payload, { headers })
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

export function UpdateHabit({ token, habitID, payload }) {
  const headers = { Authorization: 'Bearer ' + token }
  return axios.put('/habit/' + habitID, payload, { headers })
    .then(() => Object({
      error: false,
      message: 'Done: Habit updated',
    }))
    .catch((error) => Object({
      error: true,
      message: errorMessage(error),
    }))
}

export function DeleteHabit({ token, habitID }) {
  const headers = { Authorization: 'Bearer ' + token }
  return axios.delete('/habit/' + habitID, { headers })
    .then(() => Object({
      error: false,
      message: 'Done: Habit deleted',
    }))
    .catch((error) => Object({
      error: true,
      message: errorMessage(error),
    }))
}
