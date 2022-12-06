import axios from 'axios'
import { useQuery } from 'react-query'
import { useAuthContext } from '../../contexts/auth'
import { decodeToken } from '../../lib/api'
import { API_BASE } from '../../lib/env'
import {CreateNoteRequest, GetNoteRequest} from '../../types/api'

export const createNote = async (req: CreateNoteRequest) => {
  return await axios.post(`${API_BASE}/notes`, req)
}

// export const getNote = (req: GetNoteRequest) => {
//   const auth = useAuthContext()
//   return useQuery(['accounts', req.note.id], async () => {
//     return axios.get(`${API_BASE}/notes/${decodedToken.uid}`, {
//       headers: {
//         'Authorization': `Bearer ${token}`,
//       },
//     }
// }