import { BoltIcon, ChatBubbleLeftIcon, PencilIcon } from '@heroicons/react/24/solid'

import GroupActivityPanel from '../panels/GroupActivityPanel'
import GroupChatPanel from '../panels/GroupChatPanel'
import NoteRecommendationsPanel from '../panels/NoteRecommendationsPanel'

export const panelMetadata = {
  'group-chat': {
    displayName: 'Chat',
    icon: ChatBubbleLeftIcon,
    component: GroupChatPanel,
  },
  'group-activity': {
    displayName: 'Activity',
    icon: BoltIcon,
    component: GroupActivityPanel,
  },
  'note-recommendations': {
    displayName: 'Companion',
    icon: PencilIcon,
    component: NoteRecommendationsPanel,
  },
}
