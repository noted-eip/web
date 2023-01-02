/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosError, AxiosResponse } from 'axios'
import { useMutation, UseMutationOptions, useQuery, UseQueryOptions } from 'react-query'
import { useAuthContext } from '../../contexts/auth'
import { apiQueryClient } from '../../lib/api'
import { API_BASE } from '../../lib/env'
import { APIError } from '../../types/api/error'

export type QueryHookParams<REQ = any, RES = any> = {
  req: REQ,
  options?: UseQueryOptions<AxiosResponse<RES, any>, AxiosError<APIError, unknown>, AxiosResponse<RES, any>, string>
}

export function newQueryHook<REQ = any, RES = any>(
  path: (req: REQ) => string,
  pathFields?: string[]
) {
  return (req: REQ, options?: UseQueryOptions<AxiosResponse<RES, any>, AxiosError<APIError, unknown>, AxiosResponse<RES, any>, string>) => {
    const auth = useAuthContext()
    return useQuery({
      ...options,
      queryKey: path(req),
      queryFn: async () => {
        const params = {...req}
  
        if (pathFields) {
          for (let index = 0; index < pathFields.length; index++) {
            params[pathFields[index]] = undefined
          }
        }
    
        return axios.get(`${API_BASE}/${path(req)}`, {
          headers: {
            'Authorization': `Bearer ${await auth.token()}`,
          },
          params,
        })
      }
    })
  }
}

export type MutationHookParams<REQ = any, RES = any> = {
  options?: UseMutationOptions<AxiosResponse<RES, unknown>, AxiosError<APIError, unknown>, REQ>,
}

export function newMutationHook<REQ = any, RES = any>(
  method: 'put' | 'post' | 'patch' | 'delete',
  path: (req: REQ) => string,
  pathFields?: string[],
  queryParameterFields?: string[],
) {
  return (options?: UseMutationOptions<AxiosResponse<RES, unknown>, AxiosError<APIError, unknown>, REQ>) => {
    const auth = useAuthContext()
    return useMutation(async (req: REQ) => {
      const params = {}
      const filteredReq = {...req}

      if (queryParameterFields) {
        for (let index = 0; index < queryParameterFields.length; index++) {
          params[queryParameterFields[index]] = req[queryParameterFields[index]]
          filteredReq[queryParameterFields[index]] = undefined
        }
      }

      if (pathFields) {
        for (let index = 0; index < pathFields.length; index++) {
          filteredReq[pathFields[index]] = undefined
        }
      }

      return axios.request({
        method,
        data: filteredReq,
        url: `${API_BASE}/${path(req)}`,
        params,
        headers: {
          'Authorization': `Bearer ${await auth.token()}`,
        }
      })
    }, {
      ...options,
      onMutate: async (variables) => {
        await apiQueryClient.cancelQueries({ queryKey: path(variables) })
      },
      onSuccess: (result, variables, context) => {
        const queryPath = path(variables).split('/')

        apiQueryClient.invalidateQueries({ queryKey: queryPath[0] })
        apiQueryClient.invalidateQueries({ queryKey: queryPath[1] })
        if (options?.onSuccess) {
          options.onSuccess(result, variables, context)
        }
      },
    })
  }
}
