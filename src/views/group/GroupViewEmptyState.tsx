import React from 'react'
import { UserPlusIcon, ArrowRightIcon, PlusIcon, XMarkIcon, CheckIcon } from '@heroicons/react/24/solid'
import { useAuthContext } from '../../contexts/auth'
import { useGroupContext } from '../../contexts/group'
import { useListGroups, useCreateGroup } from '../../hooks/api/groups'

const GroupViewEmptyState: React.FC = () => {
  const groupContext = useGroupContext()
  const authContext = useAuthContext()
  const listGroupsQ = useListGroups({ account_id: authContext.userID })
  const createGroupQ = useCreateGroup({
    onSuccess: (data) => {
      groupContext.changeGroup(data.data.group.id)
    },
  })
  
  return <div className='flex w-full h-full flex-col items-center pt-12'>
    <UserPlusIcon className='h-12 w-12 text-gray-400 stroke-1' />
    <p className='font-medium text-gray-700 mt-4'>No Group</p>
    <p className='text-sm text-gray-500'>Create or join a group to start writing!</p>
    <div>
      {
        listGroupsQ.isSuccess && listGroupsQ.data.data.groups?.map((el, idx) => <div key={`group-view-no-group-list-${el.id}-${idx}`}
          className='flex items-center justify-between p-2 w-80 border border-gray-200 cursor-pointer rounded mt-2 first:mt-4'
          onClick={() => groupContext.changeGroup(el.id)}>
          <div className='flex items-center'>
            <div className='h-6 w-6 bg-gradient-to-br from-orange-300 to-red-300 rounded mr-2'/>
            <span className='text-gray-700 text-sm'>{el.name}</span>
          </div>
          <ArrowRightIcon className='w-6 h-6 p-1 stroke-2 text-gray-500 hover:bg-gray-50 rounded-full cursor-pointer' />
        </div>) 
      }
    </div>
    <button onClick={() => { createGroupQ.mutate({
      name: 'My Group',
      description: 'Created on ' + (new Date()).toDateString()
    }) }} className='bg-blue-600 text-white px-4 p-2 rounded-full text-sm flex items-center mt-4 hover:bg-blue-700'>
      <PlusIcon className='mr-1 h-4 w-4 stroke-2' />
      {createGroupQ.isLoading ? 'Creating...' : 'Create group'}
    </button>
    {createGroupQ.isError && <p className='text-xs mt-2 text-red-600'>Oops! There was an error</p>}
    <p className='font-medium text-gray-700 mt-6'>Invites</p>
    <div className='text-gray-500 text-sm mt-2 mb-4'>
        Invites to groups will show up here.
    </div>
    <div className='w-80 grid gap-2'>
      <div className='opacity-70 rounded p-2 w-full border border-gray-300 flex items-center justify-between'>
        <div className='flex items-center'>
          <div className='h-6 w-6 bg-gradient-to-br from-pink-300 to-blue-300 rounded'></div>
          <div className='w-44 h-3 bg-gradient-to-br from-gray-200 to-gray-300 rounded-sm ml-2'></div>
        </div>
        <div className='flex items-center'>
          <div className='rounded-full h-5 w-5 bg-red-200 flex items-center justify-center mr-1'>
            <XMarkIcon className='h-3 w-3 text-red-800 stroke-[3px]' />
          </div>
          <div className='rounded-full h-5 w-5 bg-green-200 flex items-center justify-center'>
            <CheckIcon className='h-3 w-3 text-green-800 stroke-[3px]' />
          </div>
        </div>
      </div>
      <div className='opacity-30 rounded p-2 w-full border border-gray-300 flex items-center justify-between'>
        <div className='flex items-center'>
          <div className='h-6 w-6 bg-gradient-to-br from-orange-300 to-red-300 rounded'></div>
          <div className='w-44 h-3 bg-gradient-to-br from-gray-200 to-gray-300 rounded-sm ml-2'></div>
        </div>
        <div className='flex items-center'>
          <div className='rounded-full h-5 w-5 bg-red-200 flex items-center justify-center mr-1'>
            <XMarkIcon className='h-3 w-3 text-red-800 stroke-[3px]' />
          </div>
          <div className='rounded-full h-5 w-5 bg-green-200 flex items-center justify-center'>
            <CheckIcon className='h-3 w-3 text-green-800 stroke-[3px]' />
          </div>
        </div>
      </div>
    </div>
  </div>
}

export default GroupViewEmptyState
