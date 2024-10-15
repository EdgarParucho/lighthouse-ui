import axios from '../api/axios'
import { errorMessage } from './index'

export function CreateRecord({ token, payload }) {
  const headers = { Authorization: 'Bearer ' + token }
  return axios.post('/record', payload, { headers })
    .then(({ data }) => Object({
      error: false,
      message: 'Done: Record created',
      data,
    }))
    .catch((error) => Object({
      error: true,
      message: errorMessage(error),
      data: null,
    }))
}
