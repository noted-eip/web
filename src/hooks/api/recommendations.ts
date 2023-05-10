import { useQuery } from 'react-query'

import { useAuthContext } from '../../contexts/auth'
import { useGroupContext } from '../../contexts/group'
import { openapiClient } from '../../lib/api'
import { V1GenerateWidgetsResponse } from '../../protorepo/openapi/typescript-axios'
import { axiosRequestOptionsWithAuthorization, QueryHookOptions } from './helpers'

export type GenerateWidgetsRequest = { noteId: string };
export const useGenerateWidgets = (req: GenerateWidgetsRequest, options?: QueryHookOptions<GenerateWidgetsRequest, V1GenerateWidgetsResponse>) => {
  const authContext = useAuthContext()
  const groupContext = useGroupContext()
  const currentGroupId = groupContext.groupId as string
  console.log('req.noteId : ', req.noteId)
  console.log('currentGroupId : ', currentGroupId)
  //const queryKey = newNoteCacheKey(currentGroupId, req.noteId)
  
  return useQuery({
    //queryKey: queryKey,
    queryFn: async () => {
      return (await openapiClient.recommendationsAPIGenerateWidgets(currentGroupId, req.noteId, await axiosRequestOptionsWithAuthorization(authContext))).data
    },
    ...options,
  })
}