import axios from 'axios'
import { API_BASE } from '../../lib/env'
import { AuthenticateRequest } from '../../types/api/accounts'

export const authenticate = async (req: AuthenticateRequest) => {
  return await axios.post(`${API_BASE}/authenticate`, req)
}
