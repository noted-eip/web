import { useMutation, useQuery } from 'react-query'
import { useAuthContext } from '../../contexts/auth'
import { openapiClient } from '../../lib/api'
import { V1Account, V1AuthenticateRequest, V1AuthenticateResponse, V1CreateAccountRequest, V1CreateAccountResponse, V1GetAccountResponse } from '../../protorepo/openapi/typescript-axios'
import { axiosRequestOptionsWithAuthorization, MutationHookOptions, QueryHookOptions } from './helpers'

export type GetAccountRequest = {accountId: string, email?: string};
export const useGetAccount = (req: GetAccountRequest, options?: QueryHookOptions<GetAccountRequest, V1GetAccountResponse>) => {
  const auth = useAuthContext()
  return useQuery({
    queryKey: [],
    queryFn: async () => {
      return openapiClient.accountsAPIGetAccount(req.accountId, req.email, await axiosRequestOptionsWithAuthorization(auth))
    },
    ...options,
  })
}

export type CreateAccountRequest = {body: V1CreateAccountRequest};
export const useCreateAccount = (options?: MutationHookOptions<CreateAccountRequest, V1CreateAccountResponse>) => {
  return useMutation({
    mutationFn: async (req: {body: V1CreateAccountRequest}) => {
      return openapiClient.accountsAPICreateAccount(req.body, {})
    },
    ...options,
  })
}

export type UpdateAccountRequest = {accountId: string, body: V1Account};
export const useUpdateAccount = (options?: MutationHookOptions<UpdateAccountRequest, V1CreateAccountResponse>) => {
  const auth = useAuthContext()
  return useMutation({
    mutationFn: async (req: UpdateAccountRequest) => {
      return openapiClient.accountsAPIUpdateAccount(req.accountId, req.body, undefined, await axiosRequestOptionsWithAuthorization(auth))
    },
    ...options,
  })
}

export type DeleteAccountRequest =  {accountId: string};
export const useDeleteAccount = (options?: MutationHookOptions<DeleteAccountRequest, object>) => {
  const auth = useAuthContext()
  return useMutation({
    mutationFn: async (req: DeleteAccountRequest) => {
      return openapiClient.accountsAPIDeleteAccount(req.accountId, await axiosRequestOptionsWithAuthorization(auth))
    },
    ...options,
  })
}

export type AuthenticateRequest =  {body: V1AuthenticateRequest};
export const useAuthenticate = (options?: MutationHookOptions<AuthenticateRequest, V1AuthenticateResponse>) => {
  return useMutation({
    mutationFn: async (req: AuthenticateRequest) => {
      return openapiClient.accountsAPIAuthenticate(req.body, {})
    },
    ...options,
  })
}
