import { useGroupContext } from '../../contexts/group'
import { CreateGroupRequest, CreateGroupResponse, GetGroupRequest, GetGroupResponse, ListGroupsRequest, ListGroupsResponse, UpdateGroupRequest, UpdateGroupResponse } from '../../types/api/groups'
import { newMutationHook, newQueryHook, QueryHookParams } from './helpers'

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
