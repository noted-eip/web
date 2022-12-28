import React from 'react'
import { useGroupContext } from '../../contexts/group'
import { useGetGroup, useUpdateGroup } from '../../hooks/api/groups'
import GroupViewMenu from './GroupViewMenu'

const GroupViewSettingsTab: React.FC = () => {
  const [newGroupName, setNewGroupName] = React.useState('')
  const groupContext = useGroupContext()
  const getGroupQ = useGetGroup({ group_id: groupContext.groupID as string })
  const updateGroupQ = useUpdateGroup()
  
  return <div className='grid grid-rows-1 gap-4'>
    <GroupViewMenu activeTab={'settings'}>
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
    <div className='w-full flex flex-col'>
      <label htmlFor='new-group-name-input'>Name</label>
      <input id='new-group-name-input' type="text" value={newGroupName} onChange={(e) => setNewGroupName(e.target.value)} />
      <button onClick={() => { updateGroupQ.mutate({ group: { id: groupContext.groupID as string, name: newGroupName }, update_mask: {paths: ['name'] }}) }}>
          Submit
      </button>
    </div>
  </div>
}

export default GroupViewSettingsTab
