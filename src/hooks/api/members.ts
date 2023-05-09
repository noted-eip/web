import { useMutation, useQuery } from 'react-query'

import { useAuthContext } from '../../contexts/auth'
import { useGroupContext } from '../../contexts/group'
import { apiQueryClient, openapiClient } from '../../lib/api'
import { V1GetGroupResponse, V1GetMemberResponse, V1GroupMember, V1ListGroupsResponse } from '../../protorepo/openapi/typescript-axios'
import { newGroupCacheKey, newGroupsCacheKey, newMemberCacheKey } from './cache'
import { axiosRequestOptionsWithAuthorization,MutationHookOptions, QueryHookOptions } from './helpers'

type GetGroupMemberRequest = {accountId: string};
export const useGetMemberInCurrentGroup = (req: GetGroupMemberRequest, options?: QueryHookOptions<GetGroupMemberRequest, V1GetMemberResponse>) => {
  const auth = useAuthContext()
  const groupContext = useGroupContext()
  const queryKey = newMemberCacheKey(groupContext.groupId as string, req.accountId)
  return useQuery({
    queryKey,
    queryFn: async () => {
      return (await openapiClient.groupsAPIGetMember(groupContext.groupId as string, req.accountId, await axiosRequestOptionsWithAuthorization(auth))).data
    },
    ...options,
  })
}

type UpdateGroupMemberInCurrentGroupRequest = {accountId: string, body: V1GroupMember};
export const useUpdateMemberInCurrentGroup = (options?: MutationHookOptions<UpdateGroupMemberInCurrentGroupRequest, object>) => {
  const auth = useAuthContext()
  const groupContext = useGroupContext()
  const currentGroupId = groupContext.groupId as string

  return useMutation(async (req: UpdateGroupMemberInCurrentGroupRequest) => {
    return (await openapiClient.groupsAPIUpdateMember(groupContext.groupId as string, req.accountId, req.body, await axiosRequestOptionsWithAuthorization(auth))).data
  },
  {
    ...options,
    // Optimistically update to the new value.
    onMutate: async (data) => {
      const queryKey = newMemberCacheKey(currentGroupId, data.accountId)
      await apiQueryClient.cancelQueries({ queryKey })
      let previousMember = apiQueryClient.getQueryData(queryKey) as V1GetMemberResponse | undefined

      // Update self.
      if (previousMember) {
        // @ts-expect-error ulterior check ensure data is present.
        apiQueryClient.setQueryData(queryKey, (old: V1GetMemberResponse) => {
          return {member: {...old.member, ...data.body}}
        })
      }

      if (apiQueryClient.getQueryData(newGroupCacheKey(currentGroupId))) {
        // @ts-expect-error ulterior check ensure data is present.
        apiQueryClient.setQueryData(newGroupCacheKey(currentGroupId), (old: V1GetGroupResponse) => {
          return {group: {...old.group, members: old.group.members?.map((member) => {
            if (member.accountId == data.accountId) {
              previousMember = {member}
              return {...member, ...data.body}
            }
            return member
          })}}
        })
      }

      if (options?.onMutate) options.onMutate(data)
      return {previousMember}
    },
    // Rollback to the previous value.
    onError: (error, data, context) => {
      apiQueryClient.setQueryData(newMemberCacheKey(currentGroupId, data.accountId), context?.previousMember)

      // Rollback self in group's members array.
      const groupCacheKey = newGroupCacheKey(currentGroupId)
      if (apiQueryClient.getQueryData(groupCacheKey)) {
        // @ts-expect-error ulterior check ensure data is present.
        apiQueryClient.setQueryData(groupCacheKey, (old: V1GetGroupResponse) => {
          return {group: {...old.group, members: old.group.members?.map((member) => {
            if (member.accountId == data.accountId) return context?.previousMember?.member
            return member
          }).filter((member) => member !== undefined)}}
        })
      }

      if (options?.onError) options.onError(error, data, context)
    },
    // Set authoritative group state.
    onSettled: async (data, error, variables, context) => {
      // Always refetch.
      apiQueryClient.invalidateQueries({ queryKey: newGroupCacheKey(currentGroupId) })

      if (options?.onSettled) options.onSettled(data, error, variables, context)
    }
  })
}

type RemoveGroupMemberRequest = {accountId: string};
export const useRemoveMemberInCurrentGroup = (options?: MutationHookOptions<RemoveGroupMemberRequest, object>) => {
  const auth = useAuthContext()
  const groupContext = useGroupContext()
  const currentGroupId = groupContext.groupId as string
  const currentAccountId = auth.accountId as string

  return useMutation(async (req: RemoveGroupMemberRequest) => {
    return (await openapiClient.groupsAPIRemoveMember(currentGroupId, req.accountId, await axiosRequestOptionsWithAuthorization(auth))).data
  },
  {
    ...options,
    onSuccess: async (data, variables, context) => {
      if (currentAccountId === variables.accountId) {
        // Removing self from group so we switch the current group to null.
        groupContext.changeGroup(null)
        // Optimistically remove group from groups list.
        // @ts-expect-error ulterior check ensure data is present.
        apiQueryClient.setQueriesData({ queryKey: newGroupsCacheKey({ accountId: currentAccountId }) }, (old: V1ListGroupsResponse) => {
          return {groups: old.groups?.filter((group) => group.id !== currentGroupId)}
        })
        // Always refetch.
        apiQueryClient.invalidateQueries({ queryKey: newGroupsCacheKey({ accountId: currentAccountId })})
      } else {
        // Optimistically remove member from group's members list.
        // @ts-expect-error ulterior check ensure data is present.
        apiQueryClient.setQueriesData({ queryKey: newGroupCacheKey(currentGroupId) }, (old: V1GetGroupResponse) => {
          return {group: {...old.group, members: old.group.members?.filter((member) => member.accountId != variables.accountId)}}
        })
      }

      if (options?.onSuccess) options.onSuccess(data, variables, context)
    },
    onSettled: async (data, error, variables, context) => {
      if (currentAccountId !== variables.accountId) {
        // Always refetch.
        apiQueryClient.invalidateQueries({ queryKey: newGroupCacheKey(currentGroupId) })
      }

      if (options?.onSettled) options.onSettled(data, error, variables, context)
    }
  })
}
