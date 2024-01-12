import { useMutation, useQuery } from 'react-query'

import { useAuthContext } from '../../contexts/auth'
import { useGroupContext } from '../../contexts/group'
import { openapiClient } from '../../lib/api'
import { getWikipediaImage } from '../../lib/widget'
import { V1GenerateQuizResponse, V1GenerateWidgetsResponse, V1ListQuizsResponse } from '../../protorepo/openapi/typescript-axios'
import { newQuizsCacheKey, newWidgetsCacheKey, newWikipediaImageCacheKey } from '../api/cache'
import { axiosRequestOptionsWithAuthorization, MutationHookOptions, QueryHookOptions } from './helpers'

export type GenerateWidgetsRequest = { noteId: string };
export const useGenerateWidgets = (req: GenerateWidgetsRequest, options?: QueryHookOptions<GenerateWidgetsRequest, V1GenerateWidgetsResponse>) => {
  const authContext = useAuthContext()
  const groupContext = useGroupContext()
  const currentGroupId = groupContext.groupId as string
  const queryKey = newWidgetsCacheKey(currentGroupId, req.noteId)
  
  return useQuery({
    queryKey: queryKey,
    queryFn: async () => {
      return (await openapiClient.recommendationsAPIGenerateWidgets(currentGroupId, req.noteId, await axiosRequestOptionsWithAuthorization(authContext))).data
    },
    ...options,
  })
}

export type GetWikipediaImageRequest = { imageUrl : string };
export const useGetWikipediaImage = (req: GetWikipediaImageRequest, options?: QueryHookOptions<GetWikipediaImageRequest, string>) => {
  const queryKey = newWikipediaImageCacheKey(req.imageUrl)
  
  return useQuery({
    queryKey: queryKey,
    queryFn: async () => {
      return (await getWikipediaImage(req.imageUrl))
    },
    ...options,
  })
}

export type GenerateQuizRequest = { noteId : string };
export const useGenerateQuiz = (options?: MutationHookOptions<GenerateQuizRequest, V1GenerateQuizResponse>) => {
  const authContext = useAuthContext()
  const groupContext = useGroupContext()
  const currentGroupId = groupContext.groupId as string
  // const queryKey = newQuizsCacheKey(currentGroupId, req.noteId)

  return useMutation(async (req: GenerateQuizRequest) => {
    return (await openapiClient.notesAPIGenerateQuiz(currentGroupId, req.noteId, await axiosRequestOptionsWithAuthorization(authContext))).data
  },
  {
    ...options,
  })
}

export type ListQuizsRequest = { noteId : string };
export const useListQuizs = (req: ListQuizsRequest, options?: QueryHookOptions<ListQuizsRequest, V1ListQuizsResponse>) => {
  const authContext = useAuthContext()
  const groupContext = useGroupContext()
  const currentGroupId = groupContext.groupId as string
  const queryKey = newQuizsCacheKey(currentGroupId, req.noteId)

  return useQuery({
    queryKey: queryKey,
    queryFn: async () => {
      return (await openapiClient.notesAPIListQuizs(currentGroupId, req.noteId, await axiosRequestOptionsWithAuthorization(authContext))).data
    },
    ...options,
  })
}
