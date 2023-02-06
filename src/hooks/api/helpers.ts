/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import { useMutation, UseMutationOptions, useQuery, UseQueryOptions } from 'react-query'
import { TAuthContext, useAuthContext } from '../../contexts/auth'
import { apiQueryClient } from '../../lib/api'
import { API_BASE } from '../../lib/env'
import { APIError } from '../../types/api/error'

export type OldQueryHookOptions<RES = any> = UseQueryOptions<
AxiosResponse<RES, any>,
AxiosError<APIError, unknown>,
AxiosResponse<RES, any>,
any[]
>

export type QueryHookParams<REQ = any, RES = any> = {
  req: REQ
  options?: UseQueryOptions<
  AxiosResponse<RES, any>,
  AxiosError<APIError, unknown>,
  AxiosResponse<RES, any>,
  any[]
  >
}

export function newQueryHook<REQ = any, RES = any>(
  path: (req: REQ) => string,
  pathFields?: string[]
) {
  return (
    req: REQ,
    options?: UseQueryOptions<
    AxiosResponse<RES, any>,
    AxiosError<APIError, unknown>,
    AxiosResponse<RES, any>,
    any[]
    >
  ) => {
    const auth = useAuthContext()
    const requestPath = path(req)
    const params = { ...req }

    if (pathFields) {
      for (let index = 0; index < pathFields.length; index++) {
        params[pathFields[index]] = undefined
      }
    }

    return useQuery({
      ...options,
      queryKey: [...requestPath.split('/'), { params }],
      queryFn: async () => {
        return axios.get(`${API_BASE}/${path(req)}`, {
          headers: {
            Authorization: `Bearer ${await auth.token()}`,
          },
          params,
        })
      },
    })
  }
}

export type MutationHookParams<REQ = any, RES = any> = {
  options?: UseMutationOptions<
  AxiosResponse<RES, unknown>,
  AxiosError<APIError, unknown>,
  REQ
  >
}

export function newMutationHook<REQ = any, RES = any>(config: {
  method: 'put' | 'post' | 'patch' | 'delete'
  path: (req: REQ) => string
  pathFields?: string[]
  queryParameterFields?: string[]
  invalidate?: (req: REQ) => any[]
  customOptions?: UseMutationOptions<
  AxiosResponse<RES, unknown>,
  AxiosError<APIError, unknown>,
  REQ
  >
}) {
  return (
    options?: UseMutationOptions<
    AxiosResponse<RES, unknown>,
    AxiosError<APIError, unknown>,
    REQ
    >
  ) => {
    const auth = useAuthContext()

    return useMutation(
      async (req: REQ) => {
        const params = {}
        const filteredReq = { ...req }

        if (config.queryParameterFields) {
          for (let index = 0; index < config.queryParameterFields.length; index++) {
            params[config.queryParameterFields[index]] =
              req[config.queryParameterFields[index]]
            filteredReq[config.queryParameterFields[index]] = undefined
          }
        }

        if (config.pathFields) {
          for (let index = 0; index < config.pathFields.length; index++) {
            filteredReq[config.pathFields[index]] = undefined
          }
        }

        return axios.request({
          method: config.method,
          data: filteredReq,
          url: `${API_BASE}/${config.path(req)}`,
          params,
          headers: {
            Authorization: `Bearer ${await auth.token()}`,
          },
        })
      },
      {
        ...config?.customOptions,
        ...options,
        onMutate: async (variables) => {
          await apiQueryClient.cancelQueries({ queryKey: config.path(variables) })
        },
        onSuccess: (result, variables, context) => {
          const queryPath = config.path(variables).split('/')

          let params: any = null
          if (config.queryParameterFields) {
            params = Object.fromEntries(
              config.queryParameterFields.map((k) => [k, variables[k]])
            )
          }

          apiQueryClient.invalidateQueries({ queryKey: [...queryPath, { params }] })

          if (config?.invalidate) {
            config
              .invalidate(variables)
              .map((el) => apiQueryClient.invalidateQueries({ queryKey: el }))
          }

          if (config?.customOptions?.onSuccess) {
            config.customOptions.onSuccess(result, variables, context)
          }

          if (options?.onSuccess) {
            options.onSuccess(result, variables, context)
          }
        },
      }
    )
  }
}

export type MutationHookOptions<REQ = any, RES = any> = UseMutationOptions<
RES,
AxiosError<APIError, REQ>,
REQ,
unknown
>

export type QueryHookOptions<REQ = any, RES = any> = UseQueryOptions<
RES,
AxiosError<APIError, REQ>,
RES,
any[]
>

export const axiosRequestOptionsWithAuthorization = async (auth: TAuthContext): Promise<AxiosRequestConfig> => {
  return {
    headers: {
      'Authorization': `Bearer ${await auth.token()}`
    }
  }
}

export const newAccountCacheKey = (accountIdOrEmail: string) => {
  return ['accounts', accountIdOrEmail]
}

export const newGroupCacheKey = (groupId: string) => {
  return ['groups', groupId]
}

export const newMemberCacheKey = (groupId: string, accountId: string) => {
  return ['groups/members', groupId, accountId]
}

export const newConversationCacheKey = (groupId: string, conversationId: string) => {
  return ['groups/conversations', groupId, conversationId]
}

export const newMessagesCacheKey = (groupId: string, conversationId: string) => {
  return ['groups/conversations/messages', groupId, conversationId]
}

export const newMessageCacheKey = (groupId: string, conversationId: string, messageId: string) => {
  return ['groups/conversations/messages', groupId, conversationId, messageId]
}

export function onOptimisticMutationMutate<TRequest = any, TResponse = any>(
  cacheKeyFn: (data: TRequest) => Array<any>,
  mergeFn: (old: TResponse, data: TRequest) => TResponse,
  options?: MutationHookOptions<TRequest, TResponse>
) {
  return async (data: TRequest): Promise<any> => {
    const queryKey = cacheKeyFn(data)
    await apiQueryClient.cancelQueries({queryKey})
    const previous = apiQueryClient.getQueryData(queryKey)
    apiQueryClient.setQueryData(queryKey, (old: TResponse | undefined) => {
      if (old === undefined) return {} as TResponse
      console.log('Merging old and desired Mutate', old, data, mergeFn(old, data))
      return mergeFn(old, data)
    })
    if (options?.onMutate) options.onMutate(data)
    return {previous}
  }
}

export function onOptimisticMutationSuccess<TRequest = any, TResponse = any>(
  cacheKeyFn: (data: TRequest) => Array<any>,
  options?: MutationHookOptions<TRequest, TResponse>
) {
  return async (data, variables, context) => {
    const queryKey = cacheKeyFn(data)
    console.log('Setting query data Success', data)
    apiQueryClient.setQueryData(queryKey, data)
    if (options?.onSuccess) options.onSuccess(data, variables, context)
  }
}

export function onOptimisticMutationError<TRequest = any, TResponse = any>(
  cacheKeyFn: (data: TRequest) => Array<any>,
  options?: MutationHookOptions<TRequest, TResponse>
) {
  return async (err, data, context) => {
    const queryKey = cacheKeyFn(data)
    console.log('Setting query data Error', data, context?.previous)
    apiQueryClient.setQueryData(queryKey, context?.previous)
    if (options?.onError) options.onError(err, data, context)
  }
}

// TODO: On update nested objects, update main object.
// TODO: On update listable objects, remove from list.
export function makeUpdateMutationConfig<TRequest = any, TResponse = any>(
  cacheKeyFn: (data: TRequest) => Array<any>,
  mergeFn: (old: TResponse, data: TRequest) => TResponse,
  fallback?: MutationHookOptions<TRequest, TResponse>
): MutationHookOptions<TRequest, TResponse> {
  return {
    ...fallback,
    onMutate: onOptimisticMutationMutate(cacheKeyFn, mergeFn, fallback),
    onSuccess: onOptimisticMutationSuccess(cacheKeyFn, fallback),
    onError: onOptimisticMutationError(cacheKeyFn, fallback) 
  }
}

// TODO: On delete nested objects, update main object.
// TODO: On delete listable objects, remove from list.
// export function onDeleMutationConfig<TRequest = any, TResponse = any>(
//   cacheKeyFn: (data: TRequest) => Array<any>,
//   fallback?: MutationHookOptions<TRequest, TResponse>,
// ) {
//   return async (data: TRequest): Promise<any> => {
//     const queryKey = cacheKeyFn(data)
//     await apiQueryClient.cancelQueries({queryKey})
//     const previous = apiQueryClient.getQueryData(queryKey)
//     apiQueryClient.setQueryData(queryKey, (old: TResponse | undefined) => {
//       if (old === undefined) return {} as TResponse
//       console.log('Merging old and desired Mutate', old, data, mergeFn(old, data))
//       return mergeFn(old, data)
//     })
//     if (options?.onMutate) options.onMutate(data)
//     return {previous}
//   }
// }

// export function makeDeleteMutationConfig<TRequest = any>(
//   cacheKeyFn: (data: TRequest) => Array<any>,
//   fallback?: MutationHookOptions<TRequest, object>,
// ) {
//   return {
//     ...fallback,
//     onMutate: onDeleMutationConfig(cacheKeyFn, fallback) 
//   }
// }
