import axios from 'axios'
import { useQuery } from 'react-query'
import { useAuthContext } from '../../contexts/auth'
import { decodeToken } from '../../lib/api'
import { API_BASE } from '../../lib/env'
import { CreateAccountRequest, GetAccountRequest } from '../../types/api'

export const createAccount = async (req: CreateAccountRequest) => {
  return await axios.post(`${API_BASE}/accounts`, req)
}

export const getAccount = (req: GetAccountRequest) => {
  const auth = useAuthContext()
  return useQuery(['accounts', req.id], async () => {
    const token = await auth.token()
    const decodedToken = decodeToken(token)  
    return axios.get(`${API_BASE}/accounts/${decodedToken.uid}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
  })
}
