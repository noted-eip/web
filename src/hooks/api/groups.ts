import { useAuthContext } from '../../contexts/auth'
import { useGroupContext } from '../../contexts/group'
import { apiQueryClient } from '../../lib/api'
import {
  CreateGroupRequest,
  CreateGroupResponse,
  GetGroupRequest,
  GetGroupResponse,
  ListGroupMembersRequest,
  ListGroupMembersResponse,
  ListGroupsRequest,
  ListGroupsResponse,
  UpdateGroupMemberRequest,
  UpdateGroupMemberResponse,
  UpdateGroupRequest,
  UpdateGroupResponse,
  RemoveGroupMemberRequest,
  RemoveGroupMemberResponse,
  GetGroupMemberRequest,
  GetGroupMemberResponse,
} from '../../types/api/groups'
import {
  newMutationHook,
  newQueryHook,
  OldQueryHookOptions,
  QueryHookParams,
} from './helpers'

export const useCreateGroup = newMutationHook<CreateGroupRequest, CreateGroupResponse>({
  method: 'post',
  path: () => 'groups',
  invalidate: () => [['groups']],
})

export const useGetGroup = newQueryHook<GetGroupRequest, GetGroupResponse>(
  (req) => `groups/${req.group_id}`,
  ['group_id']
)

export const useGetCurrentGroup = (params?: QueryHookParams) => {
  const groupContext = useGroupContext()

  return useGetGroup(
    { group_id: groupContext.groupID as string, ...params?.req },
    {
      ...params?.options,
      onError(error) {
        groupContext.changeGroup(null)
        if (params?.options?.onError) {
          params.options.onError(error)
        }
      },
    }
  )
}

export const useUpdateGroup = newMutationHook<UpdateGroupRequest, UpdateGroupResponse>({
  method: 'patch',
  path: (req) => `groups/${req.group.id}`,
  pathFields: ['group.id'],
  invalidate: () => [['groups']],
})

export const useListGroups = newQueryHook<ListGroupsRequest, ListGroupsResponse>(
  () => 'groups'
)

export const useGetGroupMember = newQueryHook<
GetGroupMemberRequest,
GetGroupMemberResponse
>((req) => `groups/${req.group_id}/${req.account_id}`, ['group_id', 'account_id'])

export const useUpdateGroupMember = newMutationHook<
UpdateGroupMemberRequest,
UpdateGroupMemberResponse
>({
  method: 'patch',
  path: (req) => `groups/${req.group_id}/members/${req.account_id}`,
  pathFields: ['group_id', 'account_id'],
  invalidate: (req) => [['groups', req.group_id, 'members']],
})

export const useRemoveGroupMember = () => {
  const authContext = useAuthContext()
  const groupContext = useGroupContext()

  return newMutationHook<RemoveGroupMemberRequest, RemoveGroupMemberResponse>({
    method: 'delete',
    path: (req) => `groups/${req.group_id}/members/${req.account_id}`,
    pathFields: ['group_id', 'account_id'],
    customOptions: {
      onSuccess: (result, variables) => {
        if (authContext.userID === variables.account_id) {
          groupContext.changeGroup(null)
        } else {
          apiQueryClient.invalidateQueries({
            queryKey: ['groups', variables.group_id, 'members'],
          })
        }
      },
    },
  })()
}

export const useListGroupMembers = newQueryHook<
ListGroupMembersRequest,
ListGroupMembersResponse
>((req) => `groups/${req.group_id}/members`, ['group_id'])

export const useListCurrentGroupMembers = (
  req: Omit<ListGroupMembersRequest, 'group_id'>,
  options?: OldQueryHookOptions<ListGroupMembersResponse>
) => {
  const groupContext = useGroupContext()

  return useListGroupMembers(
    { ...req, group_id: groupContext.groupID as string },
    {
      ...options,
      onError(error) {
        groupContext.changeGroup(null)
        if (options?.onError) {
          options.onError(error)
        }
      },
    }
  )
}
