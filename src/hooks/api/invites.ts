import { SendInviteRequest, SendInviteResponse, GetInviteRequest, GetInviteResponse, ListInvitesRequest, ListInvitesResponse, AcceptInviteRequest, AcceptInviteResponse, DenyInviteRequest, DenyInviteResponse } from '../../types/api/invites'
import { newMutationHook, newQueryHook } from './helpers'

export const useSendInvite = newMutationHook<SendInviteRequest, SendInviteResponse>({
  method: 'post',
  path: () => 'invites'
})

export const useGetInvite = newQueryHook<GetInviteRequest, GetInviteResponse>(
  (req) => `invite/${req.invite_id}`,
  ['invite_id']
)

export const useAcceptInvite = newMutationHook<AcceptInviteRequest, AcceptInviteResponse>({
  method: 'post',
  path: (req) => `invites/${req.invite_id}/accept`,
  pathFields: ['invite_id']
})

export const useDenyInvite = newMutationHook<DenyInviteRequest, DenyInviteResponse>({
  method: 'post',
  path: (req) => `invites/${req.invite_id}/deny`,
  pathFields: ['invite_id']
})

export const useListInvites = newQueryHook<ListInvitesRequest, ListInvitesResponse>(
  () => 'invites',
)
