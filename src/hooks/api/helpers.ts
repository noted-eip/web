/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosError, AxiosRequestConfig } from 'axios'
import { UseMutationOptions, UseQueryOptions } from 'react-query'

import { TAuthContext } from '../../contexts/auth'
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
