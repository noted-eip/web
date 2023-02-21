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
      apiQueryClient.invalidateQueries(newNotesCacheKey())

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

export type DeleteNoteRequestInCurrentGroup = { noteId: string };
export const useDeleteNoteInCurrentGroup = (options?: MutationHookOptions<DeleteNoteRequestInCurrentGroup, object>) => {
  const authContext = useAuthContext()
  const groupContext = useGroupContext() 
  const currentGroupId = groupContext.groupId as string

  return useMutation(async (req: DeleteNoteRequestInCurrentGroup) => {
    return (await openapiClient.notesAPIDeleteNote(currentGroupId, req.noteId, await axiosRequestOptionsWithAuthorization(authContext))).data
  },
  {
    ...options,
    // Optimistically remove the note from each notes array.
    onMutate: async (variables) => {
      await apiQueryClient.cancelQueries(newNotesCacheKey())

      const previousNotes = apiQueryClient.getQueryData(newNotesCacheKey({ groupId: currentGroupId }))
      // @ts-expect-error previous check.
      apiQueryClient.setQueriesData(newNotesCacheKey(), (old: V1ListNotesResponse) => {
        if (!old) return old
        return {notes: old.notes?.filter((note) => note.id !== variables.noteId)}
      })

      if (options?.onMutate) options.onMutate(variables)
      return { previousNotes }
    },
    onError: (error, variables, context) => {
      if (context?.previousNotes) {
        apiQueryClient.setQueryData(newNotesCacheKey(), context.previousNotes)
      }

      if (options?.onError) options.onError(error, variables, context)
    },
    onSettled: async (data, error, variables, context) => {
      // Always refetch.
      apiQueryClient.invalidateQueries(newNotesCacheKey({ groupId: currentGroupId }))
  
      if (options?.onSettled) options.onSettled(data, error, variables, context)
    }
  })
}
