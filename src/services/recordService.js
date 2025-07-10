import axios from '../api/axios'
import { errorMessage } from './index'

export function CreateRecord({ token, values }, { demoMode = false }) {
  const headers = { Authorization: 'Bearer ' + token }
  return axios.post((demoMode ? '/public/' : '/') + 'record', values, { headers })
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

export function UpdateRecord({ token, recordID, values }, { demoMode = false }) {
  const headers = { Authorization: 'Bearer ' + token }
  return axios.patch((demoMode ? '/public/' : '/') + 'record/' + recordID, values, { headers })
    .then(() => Object({
      error: false,
      message: 'Done: Record updated',
    }))
    .catch((error) => Object({
      error: true,
      message: errorMessage(error),
    }))
}

export function DeleteRecord({ token, recordID }, { demoMode = false }) {
  const headers = { Authorization: 'Bearer ' + token }
  return axios.delete((demoMode ? '/public/' : '/') + 'record/' + recordID, { headers })
    .then(() => Object({
        error: false,
        message: 'Done: Record deleted',
      }))
      .catch((error) => Object({
        error: true,
        message: errorMessage(error),
      }))
}

export function GetRecords({ token, from, to }, { demoMode = false }) {
  const headers = { Authorization: 'Bearer ' + token }
  return axios.get((demoMode ? '/public/' : '/') + 'record' + `?from=${from}&to=${to}`, { headers })
    .then(({ data }) => Object({
      error: false,
      message: null,
      data
    }))
    .catch((error) => Object({
      error: true,
      message: errorMessage(error),
      data: null
    }))
}