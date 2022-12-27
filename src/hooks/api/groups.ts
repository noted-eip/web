/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosResponse } from 'axios'
import { useMutation, UseMutationOptions, useQuery, UseQueryOptions } from 'react-query'
import { useAuthContext } from '../../contexts/auth'
import { API_BASE } from '../../lib/env'
import { CreateGroupRequest, CreateGroupResponse, GetGroupRequest, GetGroupResponse, UpdateGroupRequest, UpdateGroupResponse } from '../../types/api/groups'

function newQueryHook<REQ = any, RES = any>(path: (req: REQ) => string) {
  return (req: REQ, options?: UseQueryOptions<AxiosResponse<RES, any>, unknown, AxiosResponse<RES, any>, string>) => {
    const auth = useAuthContext()
    return useQuery({
      ...options,
      queryKey: path(req),
      queryFn: async () => {
        return axios.get(`${API_BASE}/${path(req)}`, {
          headers: {
            'Authorization': `Bearer ${await auth.token()}`,
          }
        })
      }
    })
  }
}

function newMutationHook<REQ = any, RES = any>(method: 'put' | 'post' | 'patch' | 'delete', path: (req: REQ) => string) {
  return (options?: UseMutationOptions<AxiosResponse<RES, unknown>, void, REQ>) => {
    const auth = useAuthContext()
    return useMutation(async (req: REQ) => {
      // TODO: Split the request field to allow for query parameters and 
      // prevent sending unecessary data.
      return axios.request({
        method,
        data: req,
        url: `${API_BASE}/${path(req)}`,
        headers: {
          'Authorization': `Bearer ${await auth.token()}`,
        }
      })
    }, {
      ...options,
    })
  }
}

export const useUpdateGroup = newMutationHook<UpdateGroupRequest, UpdateGroupResponse>('patch', (req) => `groups/${req.group_id}`)

export const useCreateGroup = newMutationHook<CreateGroupRequest, CreateGroupResponse>('post', () => 'groups')

export const useGetGroup = newQueryHook<GetGroupRequest, GetGroupResponse>((req) => `groups/${req.group_id}`)

// export const useCreateGroup = (options?: UseMutationOptions<AxiosResponse<CreateGroupResponse, unknown>, void, CreateGroupRequest>) => {
//   const auth = useAuthContext()
//   const group = useGroupContext()
//   return useMutation(async (req: CreateGroupRequest) => {
//     return get(req, .token())
//   }, {
//     onSuccess: (data, variables, context) => {
//       group.changeGroup(data.data.group.id)
//       if (options?.onSuccess) {
//         options.onSuccess(data, variables, context)
//       }
//     }
//   })
// }

// export const useGetCurrentGroup = async (options?: UseQueryOptions) => {
//   const auth = useAuthContext()
//   const group = useGroupContext()

//   return useQuery({
//     queryKey: `group/${group.groupID}`,
//     queryFn: async () => getGroup({ group_id: group.groupID as string }, await auth.token()),
//     ...options,
//   })
// }

// export const getGroup = async (req: GetGroupRequest, token: string): Promise<AxiosResponse<GetGroupResponse, unknown>> => {
//   return axios.post(`${API_BASE}/groups/${req.group_id}`, req, {
//     headers: {
//       'Authorization': `Bearer ${token}`,
//     }})
// }
