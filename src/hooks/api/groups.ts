import { useMutation, useQuery } from 'react-query'
import { useAuthContext } from '../../contexts/auth'
import { useGroupContext } from '../../contexts/group'
import { apiQueryClient, openapiClient } from '../../lib/api'
import { GroupsAPIUpdateGroupRequest, V1CreateGroupRequest, V1CreateGroupResponse, V1GetGroupResponse, V1ListGroupsResponse, V1UpdateGroupResponse } from '../../protorepo/openapi/typescript-axios'
import { newGroupCacheKey, newGroupsCacheKey } from './cache'
import { axiosRequestOptionsWithAuthorization, MutationHookOptions, QueryHookOptions } from './helpers'

export type CreateGroupRequest = {body: V1CreateGroupRequest};
export const useCreateGroup = (options?: MutationHookOptions<CreateGroupRequest, V1CreateGroupResponse>) => {
  const authContext = useAuthContext()
  const groupContext = useGroupContext()
  const currentAccountId = authContext.accountId as string

  return useMutation({ 
    mutationFn: async (req) => {
      return (await openapiClient.groupsAPICreateGroup(req.body, await axiosRequestOptionsWithAuthorization(authContext))).data
    },
    ...options,
    onSuccess: async (data, variables, context) => {
      apiQueryClient.setQueryData(newGroupCacheKey(data.group.id), data)

      // Optimistically add group to list groups.
      // @ts-expect-error ulterior check ensure data is present.
      apiQueryClient.setQueriesData({ queryKey: newGroupsCacheKey(currentAccountId) }, (old: V1ListGroupsResponse) => {
        return {groups: [...(old.groups || []), data.group]}
      })

      apiQueryClient.invalidateQueries(newGroupsCacheKey({accountId: currentAccountId}))
      groupContext.changeGroup(data.group.id)
      if (options?.onSuccess) options.onSuccess(data, variables, context)
    }
  })
}

export type GetGroupRequest = {groupId: string};
export const useGetGroup = (req: GetGroupRequest, options?: QueryHookOptions<GetGroupRequest, V1GetGroupResponse>) => {
  const authContext = useAuthContext()
  const queryKey = newGroupCacheKey(req.groupId)
  return useQuery({
    queryKey,
    queryFn: async () => {
      return (await openapiClient.groupsAPIGetGroup(req.groupId, undefined, await axiosRequestOptionsWithAuthorization(authContext))).data
    },
    ...options,
  })
}

export const useGetCurrentGroup = (options?: QueryHookOptions<GetGroupRequest, V1GetGroupResponse>) => {
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

export type UpdateCurrentGroupRequest = {body: GroupsAPIUpdateGroupRequest};
export const useUpdateCurrentGroup = (options?: MutationHookOptions<UpdateCurrentGroupRequest, V1UpdateGroupResponse>) => {
  const authContext = useAuthContext()
  const groupContext = useGroupContext()
  const currentGroupId = groupContext.groupId as string
  const currentAccountId = authContext.accountId as string

  return useMutation(async (req: UpdateCurrentGroupRequest) => {
    return (await openapiClient.groupsAPIUpdateGroup(currentGroupId, req.body, await axiosRequestOptionsWithAuthorization(authContext))).data
  },
  {
    ...options,
    // Optimistically update to the new value.
    onMutate: async (data) => {
      const queryKey = newGroupCacheKey(currentGroupId)
      await apiQueryClient.cancelQueries({ queryKey })
      const previousGroup = apiQueryClient.getQueryData(queryKey) as V1GetGroupResponse | undefined

      // Update self.
      if (previousGroup) {
        // @ts-expect-error ulterior check ensure data is present.
        apiQueryClient.setQueryData(queryKey, (old: V1GetGroupResponse) => {
          return {group: {...old.group, ...data.body}}
        })
      }

      // Update self in list queries.
      const groupsCacheKey = newGroupsCacheKey({accountId: currentAccountId})
      if (apiQueryClient.getQueryData(groupsCacheKey)) {
        // @ts-expect-error ulterior check ensure data is present.
        apiQueryClient.setQueryData(groupsCacheKey, (old: V1ListGroupsResponse) => {
          for (let i = 0; old.groups && i < old.groups.length; i++) {
            if (old.groups[i].id === currentGroupId) {
              old.groups[i] = {...old.groups[i], ...data.body}
            }
          }
          return old
        })
      }

      if (options?.onMutate) options.onMutate(data)
      return {previousGroup}
    },
    // Rollback to the previous value.
    onError: (error, data, context) => {
      apiQueryClient.setQueryData(newGroupCacheKey(currentGroupId), context?.previousGroup)

      // Rollback self in list queries.
      const groupsCacheKey = newGroupsCacheKey({ accountId: currentAccountId})
      if (apiQueryClient.getQueryData(groupsCacheKey)) {
        // @ts-expect-error ulterior check ensure data is present.
        apiQueryClient.setQueryData(groupsCacheKey, (old: V1ListGroupsResponse) => {
          for (let i = 0; old.groups && i < old.groups.length; i++) {
            if (old.groups[i].id === currentGroupId && context?.previousGroup) {
              old.groups[i] = {...old.groups[i], ...context.previousGroup.group}
            }
          }
          return old
        })
      }

      // Refetch
      apiQueryClient.invalidateQueries({ queryKey: newGroupCacheKey(currentGroupId) })
      apiQueryClient.invalidateQueries({ queryKey: newGroupsCacheKey({accountId: currentAccountId}) })

      if (options?.onError) options.onError(error, data, context)
    },
    // Set authoritative group state.
    onSuccess: async (data, variables, context) => {
      apiQueryClient.setQueryData(newGroupCacheKey(data.group.id), data)
      if (options?.onSuccess) options.onSuccess(data, variables, context)
    }
  })
}

export type ListGroupsRequest = {accountId: string, limit?: string, offset?: string};
export const useListGroups = (req: ListGroupsRequest, options?: QueryHookOptions<ListGroupsRequest, V1ListGroupsResponse>) => {
  const authContext = useAuthContext()
  const queryKey = newGroupsCacheKey({accountId: req.accountId})
  return useQuery({
    queryKey: queryKey,
    queryFn: async () => {
      return (await openapiClient.groupsAPIListGroups(req.accountId, req.limit, req.offset, await axiosRequestOptionsWithAuthorization(authContext))).data
    },
    ...options,
  })
}
