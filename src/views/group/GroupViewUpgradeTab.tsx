import React from 'react'
import { useGroupContext } from '../../contexts/group'
import { useGetGroup } from '../../hooks/api/groups'
import GroupViewMenu from './GroupViewMenu'

const GroupViewUpgradeTab: React.FC = () => {
  const groupContext = useGroupContext()
  const getGroupQ = useGetGroup({ group_id: groupContext.groupID as string })
  
  return <div className='grid grid-rows-1 gap-8'>
    <GroupViewMenu activeTab={'upgrade'}>
      {
        getGroupQ.isSuccess ?
          <div className='mr-4 flex bg-gray-100 h-7 rounded px-3'>      
            <div className='flex items-center'>
              <p className='text-sm font-medium mr-1'>{getGroupQ.data.data.group.name}</p> · <p className='ml-1 text-sm text-gray-600'>{getGroupQ.isSuccess && getGroupQ.data.data.group.description}</p>
            </div>
          </div>
          :
          <div className='skeleton w-56 h-7'></div>
      }
    </GroupViewMenu>
  </div>
}

export default GroupViewUpgradeTab
