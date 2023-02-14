import { useMutation, useQuery } from 'react-query'
import { useAuthContext } from '../../contexts/auth'
import { useGroupContext } from '../../contexts/group'
import { openapiClient } from '../../lib/api'
import { V1GetMemberResponse, V1GroupMember } from '../../protorepo/openapi/typescript-axios'
import { axiosRequestOptionsWithAuthorization, MutationHookOptions, newMemberCacheKey, QueryHookOptions } from './helpers'

type GetGroupMemberRequest = {accountId: string};
export const useGetMemberInCurrentGroup = (req: GetGroupMemberRequest, options?: QueryHookOptions<GetGroupMemberRequest, V1GetMemberResponse>) => {
  const auth = useAuthContext()
  const groupContext = useGroupContext()
  const queryKey = newMemberCacheKey(groupContext.groupID as string, req.accountId)
  return useQuery({
    queryKey,
    queryFn: async () => {
      return (await openapiClient.groupsAPIGetMember(groupContext.groupID as string, req.accountId, await axiosRequestOptionsWithAuthorization(auth))).data
    },
    ...options,
  })
}

type UpdateGroupMemberRequest = {accountId: string, body: V1GroupMember};
export const useUpdateMemberInCurrentGroup = (options?: MutationHookOptions<UpdateGroupMemberRequest, object>) => {
  const auth = useAuthContext()
  const groupContext = useGroupContext()
  return useMutation(async (req: UpdateGroupMemberRequest) => {
    return (await openapiClient.groupsAPIUpdateMember(groupContext.groupID as string, req.accountId, req.body, undefined, await axiosRequestOptionsWithAuthorization(auth))).data
  }, options)
}

type RemoveGroupMemberRequest = {accountId: string};
export const useRemoveMemberInCurrentGroup = (options?: MutationHookOptions<RemoveGroupMemberRequest, object>) => {
  const auth = useAuthContext()
  const groupContext = useGroupContext()
  return useMutation(async (req: RemoveGroupMemberRequest) => {
    return (await openapiClient.groupsAPIRemoveMember(groupContext.groupID as string, req.accountId, await axiosRequestOptionsWithAuthorization(auth))).data
  }, options)
}
