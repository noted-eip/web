import { useMutation, useQuery } from 'react-query'
import { useAuthContext } from '../../contexts/auth'
import { useGroupContext } from '../../contexts/group'
import { apiQueryClient, openapiClient } from '../../lib/api'
import { GroupsAPIUpdateGroupRequest, V1CreateGroupRequest, V1CreateGroupResponse, V1GetGroupResponse, V1ListGroupsResponse, V1UpdateGroupResponse } from '../../protorepo/openapi/typescript-axios'
import {
  axiosRequestOptionsWithAuthorization,
  makeUpdateMutationConfig,
  MutationHookOptions,
  newGroupCacheKey,
  newGroupsCacheKey,
  QueryHookOptions
} from './helpers'

export type CreateGroupRequest = {body: V1CreateGroupRequest};
export const useCreateGroup = (options?: MutationHookOptions<CreateGroupRequest, V1CreateGroupResponse>) => {
  const authContext = useAuthContext()
  const groupContext = useGroupContext()
  return useMutation({ 
    mutationFn: async (req) => {
      return (await openapiClient.groupsAPICreateGroup(req.body, await axiosRequestOptionsWithAuthorization(authContext))).data
    },
    ...options,
    onSuccess: async (data, variables, context) => {
      apiQueryClient.setQueryData(newGroupCacheKey(data.group.id), data)
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
  return useGetGroup({groupId: groupContext.groupID as string}, {
    ...options,
    onError: (error) => {
      groupContext.changeGroup(null)
      if (options?.onError) options.onError(error)
    }
  })
}

export type UpdateGroupRequest = {body: GroupsAPIUpdateGroupRequest};
export const useUpdateCurrentGroup = (options?: MutationHookOptions<UpdateGroupRequest, V1UpdateGroupResponse>) => {
  const authContext = useAuthContext()
  const groupContext = useGroupContext()

  return useMutation(async (req: UpdateGroupRequest) => {
    return (await openapiClient.groupsAPIUpdateGroup(groupContext.groupID as string, req.body, await axiosRequestOptionsWithAuthorization(authContext))).data
  },
  makeUpdateMutationConfig(
    () => newGroupCacheKey(groupContext.groupID as string),
    (old, data) => { return {...old, group: {...old.group, ...data.body}}},
    options)
  )
}

export type ListGroupsRequest = {accountId: string, limit?: string, offset?: string};
export const useListGroups = (req: ListGroupsRequest, options?: QueryHookOptions<ListGroupsRequest, V1ListGroupsResponse>) => {
  const authContext = useAuthContext()
  const queryKey = newGroupsCacheKey(req.accountId, req.limit, req.offset)
  return useQuery({
    queryKey: queryKey,
    queryFn: async () => {
      return (await openapiClient.groupsAPIListGroups(req.accountId, req.limit, req.offset, await axiosRequestOptionsWithAuthorization(authContext))).data
    },
    ...options,
  })
}
