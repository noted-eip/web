import { PencilIcon } from '@heroicons/react/24/solid'
import { ArrowPathIcon } from '@heroicons/react/24/outline'
import React from 'react'
import { useGroupContext } from '../../contexts/group'
import { useGetGroup, useUpdateGroup } from '../../hooks/api/groups'
import GroupViewMenu from './GroupViewMenu'
import useClickOutside from '../../hooks/click'

const GroupViewSettingsTab: React.FC = () => {
  const [editName, setEditName] = React.useState(false)
  const [editDescription, setEditDescription] = React.useState(false)
  const groupContext = useGroupContext()
  const getGroupQ = useGetGroup({ group_id: groupContext.groupID as string })
  const updateGroupQ = useUpdateGroup()
  const [newName, setNewName] = React.useState<string | undefined>(undefined)
  const [newDescription, setNewDescription] = React.useState<string | undefined>(undefined)
  const newNameInputRef = React.createRef<HTMLInputElement>()
  const newDescriptionInputRef = React.createRef<HTMLInputElement>()
  
  useClickOutside(newNameInputRef, () => {
    setEditName(false)
  })
  
  useClickOutside(newDescriptionInputRef, () => {
    setEditDescription(false)
  })

  React.useEffect(() => {
    if (newName === undefined || !editName) {
      setNewName(getGroupQ.isSuccess ? getGroupQ.data.data.group.name : '')
    }
    if (newDescription === undefined || !editDescription) {
      setNewDescription(getGroupQ.isSuccess ? getGroupQ.data.data.group.description : '')
    }
  }, [getGroupQ])

  const onChangeName = (e) => {
    e.preventDefault()
    updateGroupQ.mutate({ group: { id: groupContext.groupID as string, name: newName }, update_mask: {paths: ['name']} })
    setEditName(false)
  }

  const onChangeDescription = (e) => {
    e.preventDefault()
    updateGroupQ.mutate({ group: { id: groupContext.groupID as string, description: newDescription }, update_mask: {paths: ['description']} })
    setEditDescription(false)
  }
  
  return <div className='grid grid-rows-1 gap-4'>
    <GroupViewMenu activeTab={'settings'}>
      <div></div>
    </GroupViewMenu>

    <div className='w-full flex flex-col'>
      <div className='bg-gray-50 rounded-md p-4'>
        <div className='flex items-center'>
          <div className='group h-16 w-16 bg-gradient-to-br from-orange-300 to-red-300 rounded-md mr-4'>
            <div className='hidden group-hover:flex w-full h-full items-center justify-center bg-[rgba(255,255,255,0.2)] rounded-md cursor-pointer'>
              <ArrowPathIcon className='hidden group-hover:block h-6 w-6 stroke-2 text-gray-500' />
            </div>
          </div>
          <div className='flex flex-col'>
            {
              getGroupQ.isSuccess ?
                <React.Fragment>
                  <div className='group flex items-center h-8 cursor-pointer' onClick={() => {
                    setEditName(true)
                    setEditDescription(false)
                  }}>
                    {
                      editName ? 
                        <form onSubmit={onChangeName}>
                          <input ref={newNameInputRef} autoFocus className='rounded border-gray-200 font-medium -ml-[5px] w-48 px-1 py-0 bg-white' type="text"
                            value={newName} onChange={(e) => setNewName(e.target.value)} />
                          <button type='submit' />
                        </form>
                        :
                        <React.Fragment>
                          <p className='font-medium'>{getGroupQ.data?.data.group.name}</p>
                          <PencilIcon className='hidden group-hover:block h-4 w-4 stroke-2 text-gray-400 ml-2' />
                        </React.Fragment>
                        
                    }
                  </div>
                  <div className='group flex items-center h-6 cursor-pointer' onClick={() => {
                    setEditName(false)
                    setEditDescription(true)
                  }}>
                    {
                      editDescription ? 
                        <form onSubmit={onChangeDescription} className='flex items-center'>
                          <input ref={newDescriptionInputRef} autoFocus className='rounded text-gray-500 border-gray-200 text-sm px-1 py-0 -ml-[5px] w-72 bg-white' type="text"
                            value={newDescription} onChange={(e) => setNewDescription(e.target.value)} />
                          <button type='submit' />
                        </form>
                        :
                        <React.Fragment>
                          <p className='text-gray-500 text-sm cursor-pointer'>{getGroupQ.data?.data.group.description}</p>
                          <PencilIcon className='hidden group-hover:block h-4 w-4 stroke-2 text-gray-400 ml-2' />
                        </React.Fragment>
                    }
                  </div>
                </React.Fragment>
                :
                <React.Fragment>
                  <div className='skeleton w-48 h-6'>

                  </div>
                </React.Fragment>
            }
          </div>
        </div>
      </div>
    </div>
  </div>
}

export default GroupViewSettingsTab
