import axiosInstance from '../api/axios'

export async function Get(accessToken) {
  const response = await axiosInstance.get('/', { headers: { Authorization: `Bearer ${accessToken}` } })
  return response
}

