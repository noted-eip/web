import { useMutation } from 'react-query'

import { openapiClient } from '../../lib/api'
import { V1ForgetAccountPasswordRequest, V1ForgetAccountPasswordResponse } from '../../protorepo/openapi/typescript-axios'
import { MutationHookOptions } from './helpers'

export type ForgetAccountPasswordRequest = {body: V1ForgetAccountPasswordRequest}
export const useForgetAccountPassword = (options?: MutationHookOptions<ForgetAccountPasswordRequest, V1ForgetAccountPasswordResponse>) => {
  return useMutation(async (req: ForgetAccountPasswordRequest) => {
    console.log('jenvoie')
    return (await openapiClient.accountsAPIForgetAccountPassword(req.body, {})).data
  }, options)
}