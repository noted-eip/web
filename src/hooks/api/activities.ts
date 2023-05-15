import { useQuery } from 'react-query'

import { useAuthContext } from '../../contexts/auth'
import { useGroupContext } from '../../contexts/group'
import { openapiClient } from '../../lib/api'
import { V1ListActivitiesResponse } from '../../protorepo/openapi/typescript-axios'
import { newActivitiesCacheKey } from './cache'
import { axiosRequestOptionsWithAuthorization, QueryHookOptions } from './helpers'

export type ListActivitiesInCurrentGroupRequest = {limit?: number, offset?: number};
export const useListActivitiesInCurrentGroup = (req: ListActivitiesInCurrentGroupRequest, options?: QueryHookOptions<ListActivitiesInCurrentGroupRequest, V1ListActivitiesResponse> ) => {
  const authContext = useAuthContext()
  const groupContext = useGroupContext()
  const currentGroupId = groupContext.groupId as string
  const activitiesCacheKey = newActivitiesCacheKey(currentGroupId)

  return useQuery({
    queryKey: activitiesCacheKey,
    queryFn: async () => {
      return (await openapiClient.groupsAPIListActivities(currentGroupId, req.limit, req.offset, await axiosRequestOptionsWithAuthorization(authContext))).data
    },
    ...options,
  })
}
