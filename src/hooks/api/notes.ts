import { useMutation, useQuery } from 'react-query'
import { useAuthContext } from '../../contexts/auth'
import { useGroupContext } from '../../contexts/group'
import { apiQueryClient, openapiClient } from '../../lib/api'
import { NotesAPICreateNoteRequest, V1CreateNoteResponse, V1ListNotesResponse } from '../../protorepo/openapi/typescript-axios'
import { newNoteCacheKey, newNotesCacheKey } from './cache'
import { axiosRequestOptionsWithAuthorization, MutationHookOptions, QueryHookOptions } from './helpers'

// TODO: Side Effects
export type CreateNoteRequest = {body: NotesAPICreateNoteRequest};
export const useCreateNoteInCurrentGroup = (options?: MutationHookOptions<CreateNoteRequest, V1CreateNoteResponse>) => {
  const authContext = useAuthContext()
  const groupContext = useGroupContext() 

  return useMutation({ 
    mutationFn: async (req: CreateNoteRequest) => {
      return (await openapiClient.notesAPICreateNote(groupContext.groupId as string, req.body, await axiosRequestOptionsWithAuthorization(authContext))).data
    },
    ...options,
    onSuccess: async (data, variables, context) => {
      apiQueryClient.setQueryData(newNoteCacheKey(groupContext.groupId as string, data.note.id), data)
      if (options?.onSuccess) options.onSuccess(data, variables, context)
    }
  })
}

// TODO: Side Effects
export type ListNotesInCurrentGroupRequest = { authorAccountId?: string, limit?: number, offset?: number };
export const useListNotesInCurrentGroup = (req: ListNotesInCurrentGroupRequest, options?: QueryHookOptions<ListNotesInCurrentGroupRequest, V1ListNotesResponse>) => {
  const authContext = useAuthContext()
  const groupContext = useGroupContext() 
  const currentGroupId = groupContext.groupId as string
  const queryKey = newNotesCacheKey({ groupId: currentGroupId, ...req })

  return useQuery({
    queryKey: queryKey,
    queryFn: async () => {
      return (await openapiClient.notesAPIListNotes2(currentGroupId, req.authorAccountId, req.limit, req.offset, await axiosRequestOptionsWithAuthorization(authContext))).data
    },
    ...options,
  })
}

// TODO: Side Effects
export type ListNotesRequest = { groupId?: string, authorAccountId?: string, limit?: number, offset?: number };
export const useListNotes = (req: ListNotesRequest, options?: QueryHookOptions<ListNotesRequest, V1ListNotesResponse>) => {
  const authContext = useAuthContext()
  const queryKey = newNotesCacheKey({ ...req })

  return useQuery({
    queryKey: queryKey,
    queryFn: async () => {
      return (await openapiClient.notesAPIListNotes(req.groupId, req.authorAccountId, req.limit, req.offset, await axiosRequestOptionsWithAuthorization(authContext))).data
    },
    ...options,
  })
}
