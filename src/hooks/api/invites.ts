import { useMutation, useQuery } from 'react-query'
import { useAuthContext } from '../../contexts/auth'
import { useGroupContext } from '../../contexts/group'
import { apiQueryClient, openapiClient } from '../../lib/api'
import { GroupsAPISendInviteRequest, V1AcceptInviteResponse, V1GetGroupResponse, V1GetInviteResponse, V1ListInvitesResponse, V1SendInviteResponse } from '../../protorepo/openapi/typescript-axios'
import { newGroupCacheKey, newGroupsCacheKey, newInviteCacheKey, newInvitesCacheKey } from './cache'
import { axiosRequestOptionsWithAuthorization, MutationHookOptions, QueryHookOptions } from './helpers'

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
  const groupContext = useGroupContext()
  const currentAccountId = authContext.accountId as string

  return useMutation(async (req: AcceptInviteRequest) => {
    return (await openapiClient.groupsAPIAcceptInvite(req.groupId, req.inviteId, await axiosRequestOptionsWithAuthorization(authContext))).data
  },
  {
    ...options,
    // Delete invite from cache list groups.
    // Switch to group and invalidate group and list groups.
    onSuccess: async (data, variables, context) => {
      apiQueryClient.setQueryData(newInviteCacheKey(variables.groupId, variables.inviteId), undefined)

      // Remove invite from invites list.
      // @ts-expect-error ulterior check ensure data is present.
      apiQueryClient.setQueriesData({ queryKey: newInvitesCacheKey({ recipientAccountId: currentAccountId }) }, (old: V1ListInvitesResponse) => {
        return {invites: old.invites?.filter((invite) => invite.id != variables.inviteId)}
      })

      groupContext.changeGroup(variables.groupId)

      // Always refetch.
      apiQueryClient.invalidateQueries({ queryKey: newGroupCacheKey(variables.groupId) })
      apiQueryClient.invalidateQueries({ queryKey: newGroupsCacheKey({accountId: currentAccountId}) })

      if (options?.onSuccess) options.onSuccess(data, variables, context)
    }
  })
}

export type SendInviteRequest = {body: GroupsAPISendInviteRequest};
export const useSendInviteInCurrentGroup = (options?: MutationHookOptions<SendInviteRequest, V1SendInviteResponse>) => {
  const authContext = useAuthContext()
  const groupContext = useGroupContext() 
  const currentGroupId = groupContext.groupId as string

  return useMutation(async (req) => {
    return (await openapiClient.groupsAPISendInvite(currentGroupId, req.body, await axiosRequestOptionsWithAuthorization(authContext))).data
  },
  {
    ...options,
    // Update the group's invites array.
    // TODO: Update list invites array.
    onSuccess: async (data, variables, context) => {
      apiQueryClient.setQueryData(newInviteCacheKey(currentGroupId, data.invite.id), data)

      // Optimistically add invite to the group's invites array.
      if (apiQueryClient.getQueryData(newGroupCacheKey(currentGroupId))) {
        // @ts-expect-error ulterior check ensure data is present.
        apiQueryClient.setQueryData(newGroupCacheKey(currentGroupId), (old: V1GetGroupResponse) => {
          return {group: {...old.group, invites: [...(old.group.invites || []), data.invite]}}
        })
      }

      // Always refetch.
      apiQueryClient.invalidateQueries(newGroupCacheKey(currentGroupId))

      if (options?.onSuccess) options.onSuccess(data, variables, context)
    }
  })
}

export type DenyInviteRequest = {groupId: string, inviteId: string};
export const useDenyInvite = (options?: MutationHookOptions<DenyInviteRequest, object>) => {
  const authContext = useAuthContext()

  return useMutation(async (req) => {
    return (await openapiClient.groupsAPIDenyInvite(req.groupId, req.inviteId, await axiosRequestOptionsWithAuthorization(authContext))).data
  },
  {
    ...options,
    onSuccess: async (data, variables, context) => {
      // Optimistically remove invite from invites list.
      // @ts-expect-error ulterior check ensure data is present.
      apiQueryClient.setQueriesData({ queryKey: newInvitesCacheKey() }, (old: V1ListInvitesResponse) => {
        return {invites: old.invites?.filter((invite) => invite.id != variables.inviteId)}
      })

      // Always refetch.
      apiQueryClient.invalidateQueries({ queryKey: newInvitesCacheKey() })

      if (options?.onSuccess) options.onSuccess(data, variables, context)
    }
  })
}

export type RevokeInviteRequest = {inviteId: string};
export const useRevokeInviteInCurrentGroup = (options?: MutationHookOptions<RevokeInviteRequest, object>) => {
  const authContext = useAuthContext()
  const groupContext = useGroupContext() 
  const currentGroupId = groupContext.groupId as string
  const currentAccountId = authContext.accountId as string

  return useMutation({ 
    mutationFn: async (req) => {
      return (await openapiClient.groupsAPIRevokeInvite(currentGroupId, req.inviteId, await axiosRequestOptionsWithAuthorization(authContext))).data
    },
    ...options,
    onSuccess: async (data, variables, context) => {
      // Optimistically remove invite from invites list.
      // @ts-expect-error ulterior check ensure data is present.
      apiQueryClient.setQueriesData({ queryKey: newInvitesCacheKey(currentAccountId) }, (old: V1ListInvitesResponse) => {
        return {invites: old.invites?.filter((invite) => invite.id != variables.inviteId)}
      })

      // Optimistically remove invite from group invites list.
      // @ts-expect-error ulterior check ensure data is present.
      apiQueryClient.setQueryData(newGroupCacheKey(currentGroupId), (old: V1GetGroupResponse) => {
        return {group: {...old.group, invites: old.group.invites?.filter((invite) => invite.id != variables.inviteId)}}
      })

      // Always refetch.
      apiQueryClient.invalidateQueries({ queryKey: newGroupCacheKey(currentGroupId) })
      apiQueryClient.invalidateQueries({ queryKey: newInvitesCacheKey() })

      if (options?.onSuccess) options.onSuccess(data, variables, context)
    }
  })
}

export type ListInvitesRequest = {senderAccountId?: string, recipientAccountId?: string, groupId?: string, limit?: number, offset?: number};
export const useListInvites = (req: ListInvitesRequest, options?: QueryHookOptions<ListInvitesRequest, V1ListInvitesResponse>) => {
  const auth = useAuthContext()
  const queryKey = newInvitesCacheKey({
    senderAccountId: req.senderAccountId,
    recipientAccountId: req.recipientAccountId,
    groupId: req.groupId
  })

  return useQuery({
    queryKey: queryKey,
    queryFn: async () => {
      return (await openapiClient.groupsAPIListInvites(req.senderAccountId, req.recipientAccountId, req.groupId, req.limit, req.offset, await axiosRequestOptionsWithAuthorization(auth))).data
    },
    ...options,
  })
}
