/* eslint-disable @typescript-eslint/no-explicit-any */
export const newAccountCacheKey = (accountIdOrEmail: string) => {
  return ['accounts', accountIdOrEmail]
}

export const newGroupCacheKey = (groupId: string) => {
  return ['groups', groupId]
}

// TODO: Encode pagination information.
// TODO: Encode options information.
export const newGroupsCacheKey = (options?: {accountId?: string}) => {
  const ret: any[] = ['groups']
  options && ret.push(options)
  return ret
}

export const newMemberCacheKey = (groupId: string, accountId: string) => {
  return ['groups/members', groupId, accountId]
}

export const newConversationCacheKey = (groupId: string, conversationId: string) => {
  return ['groups/conversations', groupId, conversationId]
}

export const newMessagesCacheKey = (groupId: string, conversationId: string) => {
  return ['groups/conversations/messages', groupId, conversationId]
}

export const newMessageCacheKey = (groupId: string, conversationId: string, messageId: string) => {
  return ['groups/conversations/messages', groupId, conversationId, messageId]
}

// TODO: Encode pagination information.
export const newInvitesCacheKey = (options?: {senderAccountId?: string, recipientAccountId?: string, groupId?: string}) => {
  const ret: any[] = ['invites']
  options && ret.push(options)
  return ret
}

export const newInviteCacheKey = (groupId: string, inviteId: string) => {
  return ['groups/invites', groupId, inviteId]
}

export const newNoteCacheKey = (groupId: string, noteId: string) => {
  return ['groups/notes', groupId, noteId]
}
