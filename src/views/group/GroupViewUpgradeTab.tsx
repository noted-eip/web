import React from 'react'
import { useGroupContext } from '../../contexts/group'
import { useGetGroup } from '../../hooks/api/groups'
import GroupViewMenu from './GroupViewMenu'

const GroupViewUpgradeTab: React.FC = () => {
  const groupContext = useGroupContext()
  const getGroupQ = useGetGroup({ groupId: groupContext.groupId as string })

  return (
    <div className='grid grid-rows-1 gap-8'>
      <GroupViewMenu activeTab={'upgrade'}>
        {getGroupQ.isSuccess ? (
          <div className='mr-4 flex h-7 rounded bg-gray-100 px-3'>
            <div className='flex items-center'>
              <p className='mr-1 text-sm font-medium'>{getGroupQ.data.group.name}</p>{' '}
              ·{' '}
              <p className='ml-1 text-sm text-gray-600'>
                {getGroupQ.isSuccess && getGroupQ.data.group.description}
              </p>
            </div>
          </div>
        ) : (
          <div className='skeleton h-7 w-56'></div>
        )}
      </GroupViewMenu>
    </div>
  )
}

export default GroupViewUpgradeTab
