import { useMutation, useQuery } from 'react-query'

import { useAuthContext } from '../../contexts/auth'
import { useGroupContext } from '../../contexts/group'
import { openapiClient } from '../../lib/api'
import { NotesAPIInsertBlockRequest, V1Block, V1CreateBlockCommentResponse, V1InsertBlockResponse, V1ListBlockCommentsResponse, V1UpdateBlockResponse } from '../../protorepo/openapi/typescript-axios'
import { newBlockCommentCacheKey } from './cache'
import { axiosRequestOptionsWithAuthorization,MutationHookOptions, QueryHookOptions } from './helpers'

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

export type ListBlockCommentsRequest = {groupId: string, noteId: string, blockId: string};
export const useListBlockCommentsRequest = (req: ListBlockCommentsRequest, options?: QueryHookOptions<ListBlockCommentsRequest, V1ListBlockCommentsResponse>) => {
  const auth = useAuthContext()
  const queryKey = newBlockCommentCacheKey(req.groupId, req.noteId, req.blockId)

  return useQuery({
    queryKey,
    queryFn: async () => {
      return (await openapiClient.notesAPIListBlockComments(req.groupId, req.noteId, req.blockId, await axiosRequestOptionsWithAuthorization(auth))).data
    },
    ...options,
  })
}

export type DeleteBlockCommentRequestInCurrentGroupNote = { noteId: string, blockId: string, commentId: string};
export const useDeleteBlockCommentInCurrentGroupNote = (options?: MutationHookOptions<DeleteBlockCommentRequestInCurrentGroupNote, object>) => {
  const authContext = useAuthContext()
  const groupContext = useGroupContext()
  const currentGroupId = groupContext.groupId as string

  return useMutation(async (req: DeleteBlockCommentRequestInCurrentGroupNote) => {
    return (await openapiClient.notesAPIDeleteBlockComment(currentGroupId, req.noteId, req.blockId, req.commentId, await axiosRequestOptionsWithAuthorization(authContext))).data
  }, options)
}

export type CreateBlockCommentRequestInCurrentGroupNote = { noteId: string, blockId: string, content: string};
export const useCreateBlockCommentInCurrentGroupNote = (options?: MutationHookOptions<CreateBlockCommentRequestInCurrentGroupNote, V1CreateBlockCommentResponse>) => {
  const authContext = useAuthContext()
  const groupContext = useGroupContext()
  const currentGroupId = groupContext.groupId as string

  return useMutation(async (req: CreateBlockCommentRequestInCurrentGroupNote) => {
    return (await openapiClient.notesAPICreateBlockComment(currentGroupId, req.noteId, req.blockId, {comment: {content: req.content}}, await axiosRequestOptionsWithAuthorization(authContext))).data
  }, options)
}
