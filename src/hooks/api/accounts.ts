import { useMutation, useQuery } from 'react-query'
import { useAuthContext } from '../../contexts/auth'
import { apiQueryClient, openapiClient } from '../../lib/api'
import { V1Account, V1AuthenticateRequest, V1AuthenticateResponse, V1CreateAccountRequest, V1CreateAccountResponse, V1GetAccountResponse, V1UpdateAccountResponse } from '../../protorepo/openapi/typescript-axios'
import { axiosRequestOptionsWithAuthorization, makeUpdateMutationConfig, MutationHookOptions, newAccountCacheKey, QueryHookOptions } from './helpers'

export type GetAccountRequest = {accountId: string};
export const useGetAccount = (req: GetAccountRequest, options?: QueryHookOptions<GetAccountRequest, V1GetAccountResponse>) => {
  const auth = useAuthContext()
  const queryKey = newAccountCacheKey(req.accountId)

  return useQuery({
    queryKey,
    queryFn: async () => {
      return (await openapiClient.accountsAPIGetAccount(req.accountId, undefined, await axiosRequestOptionsWithAuthorization(auth))).data
    },
    ...options,
  })
}

export type SearchAccountRequest = {email: string};
export const useSearchAccount = (req: SearchAccountRequest, options?: QueryHookOptions<SearchAccountRequest, V1GetAccountResponse>) => {
  const auth = useAuthContext()
  const queryKey = newAccountCacheKey(req.email)

  return useQuery({
    queryKey,
    queryFn: async () => {
      return (await openapiClient.accountsAPIGetAccount2(req, await axiosRequestOptionsWithAuthorization(auth))).data
    },
    ...options,
  })
}

export type CreateAccountRequest = {body: V1CreateAccountRequest};
export const useCreateAccount = (options?: MutationHookOptions<CreateAccountRequest, V1CreateAccountResponse>) => {
  return useMutation({ 
    mutationFn: async (req) => {
      return (await openapiClient.accountsAPICreateAccount(req.body, {})).data
    },
    ...options,
    onSuccess: async (data, variables, context) => {
      apiQueryClient.setQueryData(newAccountCacheKey(data.account.id), data)
      if (options?.onSuccess) options.onSuccess(data, variables, context)
    }
  })
}

export type UpdateAccountRequest = {accountId: string, body: V1Account};
export const useUpdateAccount = (options?: MutationHookOptions<UpdateAccountRequest, V1UpdateAccountResponse>) => {
  const authContext = useAuthContext()

  return useMutation(async (req: UpdateAccountRequest) => {
    return (await openapiClient.accountsAPIUpdateAccount(req.accountId, req.body, undefined, await axiosRequestOptionsWithAuthorization(authContext))).data
  },
  makeUpdateMutationConfig(
    (data) => newAccountCacheKey(data.accountId),
    (old, data) => { return {...old, account: {...old.account, ...data.body}}},
    options)
  )
}

export type DeleteAccountRequest =  {accountId: string};
export const useDeleteAccount = (options?: MutationHookOptions<DeleteAccountRequest, object>) => {
  const authContext = useAuthContext()

  return useMutation(async (req: DeleteAccountRequest) => {
    return (await openapiClient.accountsAPIDeleteAccount(req.accountId, await axiosRequestOptionsWithAuthorization(authContext))).data
  }, options)
}

export type AuthenticateRequest =  {body: V1AuthenticateRequest};
export const useAuthenticate = (options?: MutationHookOptions<AuthenticateRequest, V1AuthenticateResponse>) => {
  return useMutation(async (req: AuthenticateRequest) => {
    return (await openapiClient.accountsAPIAuthenticate(req.body, {})).data
  }, options)
}
