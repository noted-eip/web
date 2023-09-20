import { RadioGroup } from '@headlessui/react'
import { FolderIcon, SparklesIcon, UserIcon } from '@heroicons/react/24/solid'
import React from 'react'
import { useNavigate } from 'react-router-dom'

import { useGroupContext } from '../../contexts/group'
import { useOurIntl } from '../../i18n/TextComponent'

const GroupViewMenu: React.FC<React.PropsWithChildren & { activeTab: string }> = (
  props
) => {
  const { formatMessage } = useOurIntl()
  const navigate = useNavigate()
  const groupContext = useGroupContext()
  const options = [
    {
      name: 'Notes',
      path: '',
      icon: FolderIcon,
    },
    {
      name: formatMessage({ id: 'GROUP.settings' }),
      path: 'settings',
      icon: UserIcon,
    },
    {
      name: formatMessage({ id: 'GROUP.upgrade' }),
      path: 'upgrade',
      icon: SparklesIcon,
    },
  ]

  return (
    <div className='flex items-center justify-between'>
      {props.children}
      <RadioGroup
        value={props.activeTab}
        onChange={(val) => navigate(`/group/${groupContext.groupId}/${val}`)}
        className='flex overflow-hidden rounded border border-gray-300'
      >
        {options.map((el, idx) => (
          <RadioGroup.Option
            key={`group-view-menu-tab-${el}-${idx}-option`}
            value={el.path}
            className={({ checked }) =>
              `${
                checked && 'bg-gray-100'
              } flex cursor-pointer items-center border-r border-gray-200 px-2 py-1 text-sm text-gray-700 last:border-none`
            }
          >
            <el.icon className='mr-2 h-3 w-3 text-gray-500' />
            {el.name}
          </RadioGroup.Option>
        ))}
      </RadioGroup>
    </div>
  )
}

export default GroupViewMenu
