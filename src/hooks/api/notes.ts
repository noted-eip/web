import {newMutationHook, newQueryHook} from './helpers'
import {CreateNoteRequest, CreateNoteResponse, GetNoteRequest, GetNoteResponse, ListNotesRequest, ListNotesResponse} from '../../types/api/notes'

export const useCreateNote = newMutationHook<CreateNoteRequest, CreateNoteResponse>({
  method: 'post',
  path: (req) => `groups/${req.group_id}/notes`,
  pathFields: ['group_id'],
  invalidate: () => ['notes']
})

export const useGetNote = newQueryHook<GetNoteRequest, GetNoteResponse>(
  (req) => `notes/${req.note_id}`,
  ['note_id']
)

export const useListNotes = newQueryHook<ListNotesRequest, ListNotesResponse>(
  () => 'notes',
  []
)
