import axios from 'axios'
import { useQuery } from 'react-query'
import { useAuthContext } from '../../contexts/auth'
import { decodeToken } from '../../lib/api'
import { API_BASE } from '../../lib/env'
import {
  CreateAccountRequest,
  GetAccountRequest,
  GetAccountResponse,
  UpdateAccountRequest,
  UpdateAccountResponse,
} from '../../types/api/accounts'
import { newMutationHook, newQueryHook } from './helpers'

export const createAccount = async (req: CreateAccountRequest) => {
  return await axios.post(`${API_BASE}/accounts`, req)
}

export const getAccount = (req: GetAccountRequest) => {
  const auth = useAuthContext()
  return useQuery(['accounts', req.account_id], async () => {
    const token = await auth.token()
    const decodedToken = decodeToken(token)
    return axios.get(`${API_BASE}/accounts/${decodedToken.uid}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  })
}

export const useGetAccount = newQueryHook<GetAccountRequest, GetAccountResponse>(
  (req) => {
    return req.account_id
      ? `accounts/${req.account_id}`
      : `accounts/by-email/${req.email}`
  },
  ['account_id', 'email']
)

export const useUpdateAccount = newMutationHook<
UpdateAccountRequest,
UpdateAccountResponse
>({
  method: 'patch',
  path: (req) => `accounts/${req.account.id}`,
  pathFields: ['account_id'],
})
