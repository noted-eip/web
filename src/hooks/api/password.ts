import { useMutation } from 'react-query'

import { openapiClient } from '../../lib/api'
import { AccountsAPIUpdateAccountPasswordRequest, V1ForgetAccountPasswordRequest, V1ForgetAccountPasswordResponse, V1ForgetAccountPasswordValidateTokenRequest, V1ForgetAccountPasswordValidateTokenResponse, V1UpdateAccountPasswordResponse } from '../../protorepo/openapi/typescript-axios'
import { MutationHookOptions } from './helpers'

export type ForgetAccountPasswordRequest = {body: V1ForgetAccountPasswordRequest}
export const useForgetAccountPassword = (options?: MutationHookOptions<ForgetAccountPasswordRequest, V1ForgetAccountPasswordResponse>) => {
  return useMutation(async (req: ForgetAccountPasswordRequest) => {
    return (await openapiClient.accountsAPIForgetAccountPassword(req.body, {})).data
  }, options)
}

export type ForgetAccountPasswordValidateTokenRequest = {body: V1ForgetAccountPasswordValidateTokenRequest}
export const useForgetAccountPasswordValidateToken = (options?: MutationHookOptions<ForgetAccountPasswordValidateTokenRequest, V1ForgetAccountPasswordValidateTokenResponse>) => {
  return useMutation(async (req: ForgetAccountPasswordValidateTokenRequest) => {
    return (await openapiClient.accountsAPIForgetAccountPasswordValidateToken(req.body, {})).data
  }, options)
}

export type TAccountsAPIUpdateAccountPasswordRequest = {account_id: string, body: AccountsAPIUpdateAccountPasswordRequest, header: string}
export const useUpdateAccountPassword = (options?: MutationHookOptions<TAccountsAPIUpdateAccountPasswordRequest, V1UpdateAccountPasswordResponse>) => {
  return useMutation(async (req: TAccountsAPIUpdateAccountPasswordRequest) => {
    return (await openapiClient.accountsAPIUpdateAccountPassword(req.account_id, req.body, {headers: {
      'Authorization': `Bearer ${req.header}`
    }})).data
  }, options)
}
