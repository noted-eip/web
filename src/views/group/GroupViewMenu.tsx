import { RadioGroup } from '@headlessui/react'
import { FolderIcon, UserIcon, SparklesIcon } from '@heroicons/react/24/solid'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useGroupContext } from '../../contexts/group'

const GroupViewMenu: React.FC<React.PropsWithChildren & { activeTab: string }> = props => {
  const navigate = useNavigate()
  const groupContext = useGroupContext()
  const options = [
    {
      name: 'Notes',
      path: '',
      icon: FolderIcon,
    },
    {
      name: 'Settings',
      path: 'settings',
      icon: UserIcon,
    },
    {
      name: 'Upgrade',
      path: 'upgrade',
      icon: SparklesIcon,
    }
  ]

  return <div className='flex justify-between'>
    {props.children}
    <RadioGroup value={props.activeTab} onChange={(val) => navigate(`/group/${groupContext.groupID}/${val}`)} className='flex rounded border border-gray-300 overflow-hidden'>
      {
        options.map((el, idx) => <RadioGroup.Option key={`group-view-menu-tab-${el}-${idx}-option`}
          value={el.path}
          className={({checked}) => `${checked && 'bg-gray-100'} items-center flex px-2 py-1 border-r border-gray-200 last:border-none text-sm text-gray-700 cursor-pointer`} >
          <el.icon className='h-3 w-3 text-gray-500 mr-2' />
          {el.name}
        </RadioGroup.Option>)
      }
    </RadioGroup>
  </div>
}

export default GroupViewMenu
