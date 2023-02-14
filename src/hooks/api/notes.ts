import { useMutation } from 'react-query'
import { useAuthContext } from '../../contexts/auth'
import { useGroupContext } from '../../contexts/group'
import { apiQueryClient, openapiClient } from '../../lib/api'
import { NotesAPICreateNoteRequest, V1CreateNoteResponse } from '../../protorepo/openapi/typescript-axios'
import { axiosRequestOptionsWithAuthorization, MutationHookOptions, newNoteCacheKey } from './helpers'

export type CreateNoteRequest = {body: NotesAPICreateNoteRequest};
export const useCreateNoteInCurrentGroup = (options?: MutationHookOptions<CreateNoteRequest, V1CreateNoteResponse>) => {
  const authContext = useAuthContext()
  const groupContext = useGroupContext() 

  return useMutation({ 
    mutationFn: async (req: CreateNoteRequest) => {
      return (await openapiClient.notesAPICreateNote(groupContext.groupID as string, req.body, await axiosRequestOptionsWithAuthorization(authContext))).data
    },
    ...options,
    onSuccess: async (data, variables, context) => {
      apiQueryClient.setQueryData(newNoteCacheKey(groupContext.groupID as string, data.note.id), data)
      if (options?.onSuccess) options.onSuccess(data, variables, context)
    }
  })
}
