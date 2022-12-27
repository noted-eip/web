/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosResponse } from 'axios'
import { useMutation, UseMutationOptions, useQuery, UseQueryOptions } from 'react-query'
import { useAuthContext } from '../../contexts/auth'
import { useGroupContext } from '../../contexts/group'
import { API_BASE } from '../../lib/env'
import { CreateGroupRequest, CreateGroupResponse, GetGroupRequest, GetGroupResponse } from '../../types/api/groups'

export const createGroup = async (req: CreateGroupRequest, token: string): Promise<AxiosResponse<CreateGroupResponse, unknown>> => {
  return axios.post(`${API_BASE}/groups`, req, {
    headers: {
      'Authorization': `Bearer ${token}`,
    }})
}

export const getGroup = async (req: GetGroupRequest, token: string): Promise<AxiosResponse<GetGroupResponse, unknown>> => {
  return axios.post(`${API_BASE}/groups/${req.group_id}`, req, {
    headers: {
      'Authorization': `Bearer ${token}`,
    }})
}

export const useCreateGroup = (options?: UseMutationOptions<AxiosResponse<CreateGroupResponse, unknown>, void, CreateGroupRequest>) => {
  const auth = useAuthContext()
  const group = useGroupContext()
  return useMutation(async (req: CreateGroupRequest) => {
    return createGroup(req, await auth.token())
  }, {
    onSuccess: (data, variables, context) => {
      group.changeGroup(data.data.group.id)
      if (options?.onSuccess) {
        options.onSuccess(data, variables, context)
      }
    }
  })
}

export const useGetCurrentGroup = async (options?: UseQueryOptions) => {
  const auth = useAuthContext()
  const group = useGroupContext()

  return useQuery({
    queryKey: `group/${group.groupID}`,
    queryFn: async () => getGroup({ group_id: group.groupID as string }, await auth.token()),
    ...options,
  })
}
