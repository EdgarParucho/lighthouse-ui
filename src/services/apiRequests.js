import axiosInstance from '../api/axios'

async function getData(accessToken) {
  const response = await axiosInstance.get('/', { headers: { Authorization: `Bearer ${accessToken}` } })
  return response
}

export default getData
