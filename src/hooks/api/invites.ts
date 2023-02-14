import { useMutation, useQuery } from 'react-query'
import { useAuthContext } from '../../contexts/auth'
import { useGroupContext } from '../../contexts/group'
import { apiQueryClient, openapiClient } from '../../lib/api'
import { GroupsAPISendInviteRequest, V1AcceptInviteResponse, V1GetInviteResponse, V1ListInvitesResponse, V1SendInviteResponse } from '../../protorepo/openapi/typescript-axios'
import { axiosRequestOptionsWithAuthorization, MutationHookOptions, newInviteCacheKey, newInvitesCacheKey, QueryHookOptions } from './helpers'

export type GetInviteRequest = {groupId: string, inviteId: string};
export const useGetInvite = (req: GetInviteRequest, options?: QueryHookOptions<GetInviteRequest, V1GetInviteResponse>) => {
  const auth = useAuthContext()
  const queryKey = newInviteCacheKey(req.groupId, req.inviteId)

  return useQuery({
    queryKey,
    queryFn: async () => {
      return (await openapiClient.groupsAPIGetInvite(req.groupId, req.inviteId, await axiosRequestOptionsWithAuthorization(auth))).data
    },
    ...options,
  })
}

export type AcceptInviteRequest = {groupId: string, inviteId: string};
export const useAcceptInvite = (options?: MutationHookOptions<AcceptInviteRequest, V1AcceptInviteResponse>) => {
  const authContext = useAuthContext()

  return useMutation({ 
    mutationFn: async (req) => {
      return (await openapiClient.groupsAPIAcceptInvite(req.groupId, req.inviteId, await axiosRequestOptionsWithAuthorization(authContext))).data
    },
    ...options,
    onSuccess: async (data, variables, context) => {
      // TODO: Delete invite from groups and else.
      // TODO: Add member.
      if (options?.onSuccess) options.onSuccess(data, variables, context)
    }
  })
}

export type SendInviteRequest = {body: GroupsAPISendInviteRequest};
export const useSendInviteInCurrentGroup = (options?: MutationHookOptions<SendInviteRequest, V1SendInviteResponse>) => {
  const authContext = useAuthContext()
  const groupContext = useGroupContext() 

  return useMutation({ 
    mutationFn: async (req) => {
      return (await openapiClient.groupsAPISendInvite(groupContext.groupID as string, req.body, await axiosRequestOptionsWithAuthorization(authContext))).data
    },
    ...options,
    onSuccess: async (data, variables, context) => {
      apiQueryClient.setQueryData(newInviteCacheKey(groupContext.groupID as string, data.invite.id), data)
      if (options?.onSuccess) options.onSuccess(data, variables, context)
    }
  })
}

export type DenyInviteRequest = {inviteId: string};
export const useDenyInviteInCurrentGroup = (options?: MutationHookOptions<DenyInviteRequest, object>) => {
  const authContext = useAuthContext()
  const groupContext = useGroupContext() 

  return useMutation({ 
    mutationFn: async (req) => {
      return (await openapiClient.groupsAPIDenyInvite(groupContext.groupID as string, req.inviteId, await axiosRequestOptionsWithAuthorization(authContext))).data
    },
    ...options,
    onSuccess: async (data, variables, context) => {
      // TODO: Delete invite from groups and else.
      if (options?.onSuccess) options.onSuccess(data, variables, context)
    }
  })
}

export type RevokeInviteRequest = {inviteId: string};
export const useRevokeInviteInCurrentGroup = (options?: MutationHookOptions<RevokeInviteRequest, object>) => {
  const authContext = useAuthContext()
  const groupContext = useGroupContext() 

  return useMutation({ 
    mutationFn: async (req) => {
      return (await openapiClient.groupsAPIRevokeInvite(groupContext.groupID as string, req.inviteId, await axiosRequestOptionsWithAuthorization(authContext))).data
    },
    ...options,
    onSuccess: async (data, variables, context) => {
      // TODO: Delete invite from groups and else.
      if (options?.onSuccess) options.onSuccess(data, variables, context)
    }
  })
}

export type ListInvitesRequest = {senderAccountId?: string, recipientAccountId?: string, groupId?: string, limit?: number, offset?: number};
export const useListInvites = (req: ListInvitesRequest, options?: QueryHookOptions<ListInvitesRequest, V1ListInvitesResponse>) => {
  const auth = useAuthContext()
  const queryKey = newInvitesCacheKey(req.senderAccountId, req.recipientAccountId, req.groupId, req.limit, req.offset)
  return useQuery({
    queryKey: queryKey,
    queryFn: async () => {
      return (await openapiClient.groupsAPIListInvites(req.senderAccountId, req.recipientAccountId, req.groupId, req.limit, req.offset, await axiosRequestOptionsWithAuthorization(auth))).data
    },
    ...options,
  })
}
