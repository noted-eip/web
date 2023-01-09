import { useGroupContext } from '../../contexts/group'
import { CreateGroupRequest, CreateGroupResponse, GetGroupRequest, GetGroupResponse, ListGroupMembersRequest, ListGroupMembersResponse, ListGroupsRequest, ListGroupsResponse, UpdateGroupMemberRequest, UpdateGroupMemberResponse, UpdateGroupRequest, UpdateGroupResponse, RemoveGroupMemberRequest, RemoveGroupMemberResponse, GetGroupMemberRequest, GetGroupMemberResponse } from '../../types/api/groups'
import { newMutationHook, newQueryHook, QueryHookOptions, QueryHookParams } from './helpers'

export const useCreateGroup = newMutationHook<CreateGroupRequest, CreateGroupResponse>(
  'post',
  () => 'groups'
)

export const useGetGroup = newQueryHook<GetGroupRequest, GetGroupResponse>(
  (req) => `groups/${req.group_id}`,
  ['group_id']
)

export const useGetCurrentGroup = (params?: QueryHookParams) => {
  const groupContext = useGroupContext()


  return useGetGroup({group_id: groupContext.groupID as string, ...params?.req}, {
    ...params?.options,
    onError(error) {
      groupContext.changeGroup(null)
      if (params?.options?.onError) {
        params.options.onError(error)
      }
    },
  })
}

export const useUpdateGroup = newMutationHook<UpdateGroupRequest, UpdateGroupResponse>(
  'patch',
  (req) => `groups/${req.group.id}`,
  ['group.id']
)

export const useListGroups = newQueryHook<ListGroupsRequest, ListGroupsResponse>(
  () => 'groups',
)

export const useGetGroupMember = newQueryHook<GetGroupMemberRequest, GetGroupMemberResponse>(
  (req) => `groups/${req.group_id}/${req.account_id}`,
  ['group_id','account_id']
)

export const useUpdateGroupMember = newMutationHook<UpdateGroupMemberRequest, UpdateGroupMemberResponse>(
  'patch',
  (req) => `groups/${req.group_id}/members/${req.account_id}`,
  ['group_id','account_id']
)

export const useRemoveGroupMember = newMutationHook<RemoveGroupMemberRequest, RemoveGroupMemberResponse>(
  'delete',
  (req) => `groups/${req.group_id}/members/${req.account_id}`,
  ['group_id','account_id']
)

export const useListGroupMembers = newQueryHook<ListGroupMembersRequest, ListGroupMembersResponse>(
  (req) => `groups/${req.group_id}/members`,
  ['group_id']
)

export const useListCurrentGroupMembers = (req: Omit<ListGroupMembersRequest, 'group_id'>, options?: QueryHookOptions<ListGroupMembersResponse>) => {
  const groupContext = useGroupContext()


  return useListGroupMembers({...req, group_id: groupContext.groupID as string}, {
    ...options,
    onError(error) {
      groupContext.changeGroup(null)
      if (options?.onError) {
        options.onError(error)
      }
    },
  })
}
