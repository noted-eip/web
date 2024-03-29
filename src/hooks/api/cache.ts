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
  return ['groups/member', groupId, accountId]
}

export const newConversationCacheKey = (groupId: string, conversationId: string) => {
  return ['groups/conversation', groupId, conversationId]
}

// TODO: Encode pagination information.
export const newMessagesCacheKey = (groupId: string, conversationId: string) => {
  return ['groups/conversations/messages', groupId, conversationId]
}

export const newMessageCacheKey = (groupId: string, conversationId: string, messageId: string) => {
  return ['groups/conversations/message', groupId, conversationId, messageId]
}

// TODO: Encode pagination information.
export const newInvitesCacheKey = (options?: {senderAccountId?: string, recipientAccountId?: string, groupId?: string}) => {
  const ret: any[] = ['invites']
  options && ret.push(options)
  return ret
}

export const newInviteCacheKey = (groupId: string, inviteId: string) => {
  return ['groups/invite', groupId, inviteId]
}

export const newNoteCacheKey = (groupId: string, noteId: string) => {
  return ['groups/note', groupId, noteId]
}

export const newNotesCacheKey = (options?: { authorAccountId?: string, groupId?: string, limit?: number, offset?: number }) => {
  const ret: any[] = ['notes']
  options && ret.push(options)
  return ret
}

export const newActivitiesCacheKey = (groupId: string) => {
  return ['groups/activities', groupId]
}

export const newWidgetsCacheKey = (groupId: string, noteId: string) => {
  return ['groups/note/widgets', groupId, noteId]
}

export const newQuizsCacheKey = (groupId: string, noteId: string) => {
  return ['groups/note/quizs', groupId, noteId]
}

export const newWikipediaImageCacheKey = (imageUrl: string) => {
  return ['groups/note/widgets/wikipedia/img', imageUrl]
}


export const newBlockCommentCacheKey = (groupId: string, noteId: string, blockId: string) => {
  return ['groups/note/blocks/comments', groupId, noteId, blockId]
}
