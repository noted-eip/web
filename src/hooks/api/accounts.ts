import React from 'react'
import { useMutation, useQuery } from 'react-query'

import { useAuthContext } from '../../contexts/auth'
import { apiQueryClient, openapiClient } from '../../lib/api'
import { V1Account, V1AuthenticateGoogleRequest, V1AuthenticateGoogleResponse, V1AuthenticateRequest, V1AuthenticateResponse, V1CreateAccountRequest, V1CreateAccountResponse, V1GetAccountResponse, V1RegisterUserToMobileBetaRequest, V1UpdateAccountResponse } from '../../protorepo/openapi/typescript-axios'
import { newAccountCacheKey, newRegisterToMobileBetaCacheKey } from './cache'
import { axiosRequestOptionsWithAuthorization,MutationHookOptions, QueryHookOptions } from './helpers'

export type AccountResetPassword = {
  account_id: string | null
  reset_token: string | null
  auth_token: string | null
}

type TResetPasswordContext = {
  account: AccountResetPassword | null
  changeResetPassword: React.Dispatch<AccountResetPassword | null>
}

export const ResetPasswordContext = React.createContext<TResetPasswordContext | undefined>(undefined)

export const useResetPasswordContext = () => {
  const context = React.useContext(ResetPasswordContext)
  if (context === undefined) {
    throw new Error('ResetPassword used outside of provider')
  }
  return context
}

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

export type RegisterToMobileBetaRequest = undefined;
export const useRegisterToMobileBeta = (options?: MutationHookOptions<RegisterToMobileBetaRequest, object>) => {
  const authContext = useAuthContext()
  const currentAccountId = authContext.accountId as string

  return useMutation(async () => {
    return (await openapiClient.accountsAPIRegisterToMobileBeta(currentAccountId, await axiosRequestOptionsWithAuthorization(authContext))).data
  }, options)
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

export type UpdateMyAccountRequest = {body: V1Account};
export const useUpdateMyAccount = (options?: MutationHookOptions<UpdateMyAccountRequest, V1UpdateAccountResponse>) => {
  const authContext = useAuthContext()
  const currentAccountId = authContext.accountId as string

  return useMutation(async (req: UpdateMyAccountRequest) => {
    return (await openapiClient.accountsAPIUpdateAccount(currentAccountId, req.body, await axiosRequestOptionsWithAuthorization(authContext))).data
  },
  {
    ...options,
    // Optimistically update to the new value.
    onMutate: async (data) => {
      const queryKey = newAccountCacheKey(currentAccountId)
      await apiQueryClient.cancelQueries({ queryKey })
      const previousAccount = apiQueryClient.getQueryData(queryKey) as V1GetAccountResponse | undefined

      // Update self.
      if (previousAccount) {
        // @ts-expect-error ulterior check ensure data is present.
        apiQueryClient.setQueryData(queryKey, (old: V1GetAccountResponse) => {
          return {account: {...old.account, ...data.body}}
        })
      }

      if (options?.onMutate) options.onMutate(data)
      return {previousAccount}
    },
    // Rollback to the previous value.
    onError: (error, data, context) => {
      apiQueryClient.setQueryData(newAccountCacheKey(currentAccountId), context?.previousAccount)

      if (options?.onError) options.onError(error, data, context)
    },
    // Set authoritative group state.
    onSuccess: async (data, variables, context) => {
      apiQueryClient.setQueryData(newAccountCacheKey(data.account.id), data)

      if (options?.onSuccess) options.onSuccess(data, variables, context)
    }
  })
}

export type DeleteMyAccountRequest = undefined;
export const useDeleteMyAccount = (options?: MutationHookOptions<DeleteMyAccountRequest, object>) => {
  const authContext = useAuthContext()
  const currentAccountId = authContext.accountId as string

  return useMutation(async () => {
    return (await openapiClient.accountsAPIDeleteAccount(currentAccountId, await axiosRequestOptionsWithAuthorization(authContext))).data
  },
  {
    ...options,
    // Log out the account.
    onSuccess: async (data, variables, context) => {
      authContext.logout()
      if (options?.onSuccess) options.onSuccess(data, variables, context)
    }
  })
}

export type AuthenticateRequest =  {body: V1AuthenticateRequest};
export const useAuthenticate = (options?: MutationHookOptions<AuthenticateRequest, V1AuthenticateResponse>) => {
  return useMutation(async (req: AuthenticateRequest) => {
    return (await openapiClient.accountsAPIAuthenticate(req.body, {})).data
  }, options)
}

export type AuthenticateRequestGoogle =  {body: V1AuthenticateGoogleRequest};
export const useAuthenticateGoogle = (options?: MutationHookOptions<AuthenticateRequestGoogle, V1AuthenticateGoogleResponse>) => {
  return useMutation(async (req: AuthenticateRequestGoogle) => {
    return (await openapiClient.accountsAPIAuthenticateGoogle(req.body, {})).data
  }, options)
}
