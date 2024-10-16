import axios from '../api/axios'
import { errorMessage } from './index'

export function CreateRecord({ token, values }) {
  const headers = { Authorization: 'Bearer ' + token }
  return axios.post('/record', values, { headers })
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

export function UpdateRecord({ token, recordID, values }) {
  const headers = { Authorization: 'Bearer ' + token }
  return axios.put('/record/' + recordID, values, { headers })
    .then(() => Object({
      error: false,
      message: 'Done: Record updated',
    }))
    .catch((error) => Object({
      error: true,
      message: errorMessage(error),
    }))
}
