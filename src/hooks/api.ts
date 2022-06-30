import axios from 'axios'
import { useQuery } from 'react-query'
import { useAuthContext } from '../contexts/auth'
import { API_BASE, decodeToken } from '../lib/api'

// Fetch the user's account information.
const useAccount = async () => {
  const auth = useAuthContext()
  const token = await auth.token()
  const decodedToken = decodeToken(token)
  
  return useQuery(`accounts/${decodedToken.uid}`, async () => {
    return axios.get(`${API_BASE}/accounts/${decodedToken.uid}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  })
}

export default { useAccount, decodeToken }
