/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosError, AxiosResponse } from 'axios'
import { useMutation, UseMutationOptions, useQuery, UseQueryOptions } from 'react-query'
import { useAuthContext } from '../../contexts/auth'
import { apiQueryClient } from '../../lib/api'
import { API_BASE } from '../../lib/env'
import { APIError } from '../../types/api/error'

export type QueryHookOptions<RES = any> = UseQueryOptions<
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
