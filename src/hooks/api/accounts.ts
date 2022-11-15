import axios, { AxiosResponse } from 'axios'
import { useMutation, useQuery } from 'react-query'
import { useAuthContext } from '../../contexts/auth'
import { apiQueryClient, decodeToken } from '../../lib/api'
import { API_BASE } from '../../lib/env'
import { CreateAccountRequest, CreateAccountResponse, GetAccountRequest } from '../../types/api'

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