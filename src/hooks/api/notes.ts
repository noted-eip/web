import { useMutation, useQuery } from 'react-query'

import { useAuthContext } from '../../contexts/auth'
import { useGroupContext } from '../../contexts/group'
import { apiQueryClient, openapiClient } from '../../lib/api'
import { NotesAPICreateNoteRequest, NotesAPIInsertBlockRequest, V1Block, V1CreateNoteResponse, V1GetNoteResponse, V1InsertBlockResponse, V1ListNotesResponse, V1Note, V1UpdateBlockResponse, V1UpdateNoteResponse } from '../../protorepo/openapi/typescript-axios'
import { newNoteCacheKey, newNotesCacheKey } from './cache'
import { axiosRequestOptionsWithAuthorization, MutationHookOptions, QueryHookOptions } from './helpers'

// TODO: Side Effects
export type CreateNoteRequest = { body: NotesAPICreateNoteRequest };
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

/*
export const useGetCurrentNote = (options?: QueryHookOptions<GetGroupRequest, V1GetGroupResponse>) => {
  const groupContext = useGroupContext()
  return useGetGroup({groupId: groupContext.groupId as string}, {
    ...options,
    // If no access to the group, switch group.
    onError: (error) => {
      groupContext.changeGroup(null)
      if (options?.onError) options.onError(error)
    }
  })
}
*/

export type GetNoteInCurrentGroupRequest = { noteId: string }
export const useGetNoteInCurrentGroup = (req: GetNoteInCurrentGroupRequest, options?: QueryHookOptions<GetNoteInCurrentGroupRequest, V1GetNoteResponse>) => {
  const authContext = useAuthContext()
  const groupContext = useGroupContext()
  const currentGroupId = groupContext.groupId as string
  const queryKey = newNoteCacheKey(currentGroupId, req.noteId)

  return useQuery({
    queryKey: queryKey,
    queryFn: async () => {
      return (await openapiClient.notesAPIGetNote(currentGroupId, req.noteId, await axiosRequestOptionsWithAuthorization(authContext))).data
    },
    ...options,
  })
}

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
        return { notes: old.notes?.filter((note) => note.id !== variables.noteId) }
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
      apiQueryClient.invalidateQueries(newNotesCacheKey())

      if (options?.onSettled) options.onSettled(data, error, variables, context)
    }
  })
}

export type InsertBlockInCurrentGroup = { noteId: string, body: NotesAPIInsertBlockRequest};
export const useInsertBlockInCurrentGroup = ( options?: MutationHookOptions<InsertBlockInCurrentGroup, V1InsertBlockResponse> ) => {
  const authContext = useAuthContext()
  const groupContext = useGroupContext()
  const currentGroupId = groupContext.groupId as string

  return useMutation(async (req: InsertBlockInCurrentGroup) => {
    return (await openapiClient.notesAPIInsertBlock(currentGroupId, req.noteId, req.body, await axiosRequestOptionsWithAuthorization(authContext))).data
  },
  {
    ...options,
  })
}

export type UpdateBlockInCurrentGroup = { noteId: string, blockId: string, body: V1Block};
export const useUpdateBlockInCurrentGroup = ( options?: MutationHookOptions<UpdateBlockInCurrentGroup, V1UpdateBlockResponse> ) => {
  const authContext = useAuthContext()
  const groupContext = useGroupContext()
  const currentGroupId = groupContext.groupId as string

  return useMutation(async (req: UpdateBlockInCurrentGroup) => {
    return (await openapiClient.notesAPIUpdateBlock(currentGroupId, req.noteId, req.blockId, req.body, await axiosRequestOptionsWithAuthorization(authContext))).data
  },
  {
    ...options,
  })
}

export type UpdateNoteInCurrentGroup = { noteId: string, body: V1Note };
export const useUpdateNoteInCurrentGroup = (options?: MutationHookOptions<UpdateNoteInCurrentGroup, V1UpdateNoteResponse>) => {
  const authContext = useAuthContext()
  const groupContext = useGroupContext()
  const currentGroupId = groupContext.groupId as string

  return useMutation(async (req: UpdateNoteInCurrentGroup) => {
    console.log(req.body)
    return (await openapiClient.notesAPIUpdateNote(currentGroupId, req.noteId, req.body, await axiosRequestOptionsWithAuthorization(authContext))).data
  },
  {
    ...options,
    // Optimistically update the note everywhere.
    onMutate: async (variables) => {
      await apiQueryClient.cancelQueries(newNotesCacheKey())
      await apiQueryClient.cancelQueries(newNoteCacheKey(currentGroupId, variables.noteId))

      const previousNote = apiQueryClient.getQueryData(newNoteCacheKey(currentGroupId, variables.noteId))
      // @ts-expect-error previous check.
      apiQueryClient.setQueriesData(newNoteCacheKey(currentGroupId, variables.noteId), (old: V1GetNoteResponse) => {
        if (!old) return old
        return { note: { ...old.note, ...variables.body } }
      })
      // @ts-expect-error previous check.
      apiQueryClient.setQueriesData(newNotesCacheKey(), (old: V1ListNotesResponse) => {
        if (!old) return old
        return { notes: old.notes?.map((note) => note.id === variables.noteId ? { ...note, ...variables.body } : note) }
      })

      if (options?.onMutate) options.onMutate(variables)
      return { previousNote }
    },
    onError: (error, variables, context) => {
      if (context?.previousNote) {
        apiQueryClient.setQueryData(newNoteCacheKey(currentGroupId, variables.noteId), context.previousNote)
      }

      if (options?.onError) options.onError(error, variables, context)
    },
    onSettled: async (data, error, variables, context) => {
      // Always refetch.
      apiQueryClient.invalidateQueries(newNotesCacheKey())
      apiQueryClient.invalidateQueries(newNoteCacheKey(currentGroupId, variables.noteId))

      if (options?.onSettled) options.onSettled(data, error, variables, context)
    }
  })
}
