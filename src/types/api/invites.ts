export type Invite = {
  id: string
  sender_account_id: string
  recipient_account_id: string
  group_id: string
}

export type SendInviteRequest = {
  group_id: string
  recipient_account_id: string
}

export type SendInviteResponse = {
  invite: Invite
}

export type GetInviteRequest = {
  invite_id: string
}

export type GetInviteResponse = {
  invite: Invite
}

export type AcceptInviteRequest = {
  invite_id: string
}

export type AcceptInviteResponse = unknown

export type DenyInviteRequest = {
  invite_id: string
}

export type DenyInviteResponse = unknown

export type ListInvitesRequest = {
  sender_account_id?: string
  recipient_account_id?: string
  group_id?: string
  offset?: number
  limit?: number
}

export type ListInvitesResponse = {
  invites: Invite[]
}
