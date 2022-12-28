import { BoltIcon, ChatBubbleLeftIcon, Cog6ToothIcon, UserIcon } from '@heroicons/react/24/solid'
import GroupActivityPanel from '../panels/GroupActivityPanel'
import GroupChatPanel from '../panels/GroupChatPanel'
import GroupOverviewPanel from '../panels/GroupOverviewPanel'
import GroupSettingsPanel from '../panels/GroupSettingsPanel'

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
  'group-settings': {
    displayName: 'Settings',
    icon: Cog6ToothIcon,
    component: GroupSettingsPanel,
  },
  'group-overview': {
    displayName: 'Overview',
    icon: UserIcon,
    component: GroupOverviewPanel,
  }
}
