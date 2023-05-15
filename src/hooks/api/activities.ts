import { useQuery } from 'react-query'

import { useAuthContext } from '../../contexts/auth'
import { openapiClient } from '../../lib/api'
import { V1ListActivitiesResponse } from '../../protorepo/openapi/typescript-axios'
//import { newActivitiesCacheKey } from './cache'
import { axiosRequestOptionsWithAuthorization, QueryHookOptions } from './helpers'

export type ListActivitiesRequest = {groupId: string, limit?: number, offset?: number};
export const useListActivities = (req: ListActivitiesRequest, options?: QueryHookOptions<ListActivitiesRequest, V1ListActivitiesResponse> ) => {
  const authContext = useAuthContext()
  //const queryKey = newActivitiesCacheKey( req.groupId )
  
  return useQuery({
    //queryKey: queryKey,
    queryFn: async () => {
      return (await openapiClient.groupsAPIListActivities(req.groupId, req.limit, req.offset, await axiosRequestOptionsWithAuthorization(authContext))).data
    },
    ...options,
  })
}
