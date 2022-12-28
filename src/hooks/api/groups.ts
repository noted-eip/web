import { CreateGroupRequest, CreateGroupResponse, GetGroupRequest, GetGroupResponse, ListGroupsRequest, ListGroupsResponse, UpdateGroupRequest, UpdateGroupResponse } from '../../types/api/groups'
import { newMutationHook, newQueryHook } from './helpers'

export const useUpdateGroup = newMutationHook<UpdateGroupRequest, UpdateGroupResponse>(
  'patch',
  (req) => `groups/${req.group.id}`,
  ['group.id']
)

export const useCreateGroup = newMutationHook<CreateGroupRequest, CreateGroupResponse>(
  'post',
  () => 'groups'
)

export const useGetGroup = newQueryHook<GetGroupRequest, GetGroupResponse>(
  (req) => `groups/${req.group_id}`,
  ['group_id']
)

export const useListGroups = newQueryHook<ListGroupsRequest, ListGroupsResponse>(
  () => 'groups',
)
