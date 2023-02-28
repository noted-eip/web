import { useMutation } from 'react-query'

import { useAuthContext } from '../../contexts/auth'
import { useGroupContext } from '../../contexts/group'
import { openapiClient } from '../../lib/api'
import { NotesAPIInsertBlockRequest, V1Block, V1InsertBlockResponse, V1UpdateBlockResponse } from '../../protorepo/openapi/typescript-axios'
import { axiosRequestOptionsWithAuthorization,MutationHookOptions } from './helpers'

// TODO: Side Effects
export type InsertBlockRequestInCurrentGroupNote = { noteId: string, body: NotesAPIInsertBlockRequest};
export const useInsertBlockInCurrentGroupNote = (options?: MutationHookOptions<InsertBlockRequestInCurrentGroupNote, V1InsertBlockResponse>) => {
  const authContext = useAuthContext()
  const groupContext = useGroupContext()
  const currentGroupId = groupContext.groupId as string

  return useMutation(async (req: InsertBlockRequestInCurrentGroupNote) => {
    return (await openapiClient.notesAPIInsertBlock(currentGroupId, req.noteId, req.body, await axiosRequestOptionsWithAuthorization(authContext))).data
  }, options)
}

// TODO: Side Effects
export type UpdateBlockRequestInCurrentGroupNote = { noteId: string, blockId: string, body: V1Block };
export const useUpdateBlockInCurrentGroupNote = (options?: MutationHookOptions<UpdateBlockRequestInCurrentGroupNote, V1UpdateBlockResponse>) => {
  const authContext = useAuthContext()
  const groupContext = useGroupContext()
  const currentGroupId = groupContext.groupId as string

  return useMutation(async (req: UpdateBlockRequestInCurrentGroupNote) => {
    return (await openapiClient.notesAPIUpdateBlock(currentGroupId, req.noteId, req.blockId, req.body, await axiosRequestOptionsWithAuthorization(authContext))).data
  }, options)
}

// TODO: Side Effects
export type DeleteBlockRequestInCurrentGroupNote = { noteId: string, blockId: string };
export const useDeleteBlockInCurrentGroupNote = (options?: MutationHookOptions<DeleteBlockRequestInCurrentGroupNote, object>) => {
  const authContext = useAuthContext()
  const groupContext = useGroupContext()
  const currentGroupId = groupContext.groupId as string

  return useMutation(async (req: DeleteBlockRequestInCurrentGroupNote) => {
    return (await openapiClient.notesAPIDeleteBlock(currentGroupId, req.noteId, req.blockId, await axiosRequestOptionsWithAuthorization(authContext))).data
  }, options)
}
