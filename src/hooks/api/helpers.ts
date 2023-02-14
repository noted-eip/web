/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosError, AxiosRequestConfig } from 'axios'
import { UseMutationOptions, UseQueryOptions } from 'react-query'
import { TAuthContext } from '../../contexts/auth'
import { apiQueryClient } from '../../lib/api'
import { APIError } from '../../types/api/error'

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

export const newGroupsCacheKey = (accountId: string, limit?: string, offset?: string) => {
  return ['groups', { accountId, limit, offset }]
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

export const newInvitesCacheKey = (senderAccountId?: string, recipientAccountId?: string, groupId?: string, limit?: number, offset?: number) => {
  return ['invites', {senderAccountId, recipientAccountId, groupId, limit, offset}]
}

export const newInviteCacheKey = (groupId: string, inviteId: string) => {
  return ['groups/invites', groupId, inviteId]
}

export const newNoteCacheKey = (groupId: string, noteId: string) => {
  return ['groups/notes', groupId, noteId]
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
