/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosError, AxiosResponse } from 'axios'
import { useMutation, UseMutationOptions, useQuery, UseQueryOptions } from 'react-query'
import { useAuthContext } from '../../contexts/auth'
import { apiQueryClient } from '../../lib/api'
import { API_BASE } from '../../lib/env'
import { APIError } from '../../types/api/error'

export type QueryHookOptions<RES = any> = UseQueryOptions<AxiosResponse<RES, any>, AxiosError<APIError, unknown>, AxiosResponse<RES, any>, string>

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

export function newMutationHook<REQ = any, RES = any>(config: {
  method: 'put' | 'post' | 'patch' | 'delete',
  path: (req: REQ) => string,
  pathFields?: string[],
  queryParameterFields?: string[],
  invalidate?: (req: REQ) => string[]
}) {
  return (options?: UseMutationOptions<AxiosResponse<RES, unknown>, AxiosError<APIError, unknown>, REQ>) => {
    const auth = useAuthContext()
    return useMutation(async (req: REQ) => {
      const params = {}
      const filteredReq = {...req}

      if (config.queryParameterFields) {
        for (let index = 0; index < config.queryParameterFields.length; index++) {
          params[config.queryParameterFields[index]] = req[config.queryParameterFields[index]]
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
          'Authorization': `Bearer ${await auth.token()}`,
        }
      })
    }, {
      ...options,
      onMutate: async (variables) => {
        await apiQueryClient.cancelQueries({ queryKey: config.path(variables) })
      },
      onSuccess: (result, variables, context) => {
        const queryPath = config.path(variables)

        apiQueryClient.invalidateQueries({ queryKey: queryPath })
        apiQueryClient.invalidateQueries({ queryKey: queryPath.split('/')[0] })

        if (config.invalidate) {
          config.invalidate(variables).map((el) => apiQueryClient.invalidateQueries({ queryKey: el }))
        }

        if (options?.onSuccess) {
          options.onSuccess(result, variables, context)
        }
      },
    })
  }
}
