import {newMutationHook, newQueryHook} from './helpers'
import {CreateNotesRequest, CreateNotesResponse, GetNoteRequest, GetNoteResponse} from '../../types/api/notes'
import axios from 'axios'
import {API_BASE} from '../../lib/env'
import {useAuthContext} from '../../contexts/auth'

export const useCreateNotes = newMutationHook<CreateNotesRequest, CreateNotesResponse>(
  'post',
  () => 'notes'
)

export const useGetNote = newQueryHook<GetNoteRequest, GetNoteResponse>(
  (req) => `notes/${req.note_id}`,
  ['note_id']
)

export const getNotes = async (author_id: string) => {
  const auth = useAuthContext()

  const notes = await axios.get(`${API_BASE}/notes?author_id=${author_id}`, {
    headers: {
      'Authorization': `Bearer ${await auth.token()}`,
    },
  })
  return notes.data
}