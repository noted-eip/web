import { FolderIcon } from '@heroicons/react/24/solid'
import React from 'react'
import { useGroupContext } from '../../contexts/group'
import { useGetGroup } from '../../hooks/api/groups'
import GroupViewMenu from './GroupViewMenu'

const GroupViewNotesTab: React.FC = () => {
  const groupContext = useGroupContext()
  const getGroupQ = useGetGroup({ group_id: groupContext.groupID as string })

  return <div className='grid grid-rows-1 gap-8 w-full'>
    <GroupViewMenu activeTab={''}>
      {
        getGroupQ.isSuccess ?
          <div className='mr-4 flex bg-gray-100 h-7 rounded px-2'>      
            <div className='flex items-center'>
              <FolderIcon className='text-gray-500 h-4 w-4 mr-2' /><p className='text-sm text-gray-500 mr-1'>{getGroupQ.data.data.group.name}</p>
            </div>
          </div>
          :
          <div className='skeleton w-56 h-7'></div>
      }
    </GroupViewMenu>
  </div>
}

export default GroupViewNotesTab
