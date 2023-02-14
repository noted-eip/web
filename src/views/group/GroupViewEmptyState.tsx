import {
  ArrowRightIcon, CheckIcon, PlusIcon, UserPlusIcon, XMarkIcon
} from '@heroicons/react/24/solid'
import React from 'react'
import { useAuthContext } from '../../contexts/auth'
import { useGroupContext } from '../../contexts/group'
import { useCreateGroup, useListGroups } from '../../hooks/api/groups'

const GroupViewEmptyState: React.FC = () => {
  const groupContext = useGroupContext()
  const authContext = useAuthContext()
  const listGroupsQ = useListGroups({ accountId: authContext.userID })
  const createGroupQ = useCreateGroup({
    onSuccess: (data) => {
      groupContext.changeGroup(data.group.id)
    },
  })

  return (
    <div className='flex h-full w-full flex-col items-center pt-12'>
      <UserPlusIcon className='h-12 w-12 stroke-1 text-gray-400' />
      <p className='mt-4 font-medium text-gray-700'>No Group</p>
      <p className='text-sm text-gray-500'>Create or join a group to start writing!</p>
      <div>
        {listGroupsQ.isSuccess &&
          listGroupsQ.data.groups?.map((el, idx) => (
            <div
              key={`group-view-no-group-list-${el.id}-${idx}`}
              className='mt-2 flex w-80 cursor-pointer items-center justify-between rounded border border-gray-200 p-2 first:mt-4'
              onClick={() => groupContext.changeGroup(el.id)}
            >
              <div className='flex items-center'>
                <div className='mr-2 h-6 w-6 rounded bg-gradient-to-br from-orange-300 to-red-300' />
                <span className='text-sm text-gray-700'>{el.name}</span>
              </div>
              <ArrowRightIcon className='h-6 w-6 cursor-pointer rounded-full stroke-2 p-1 text-gray-500 hover:bg-gray-50' />
            </div>
          ))}
      </div>
      <button
        onClick={() => {
          createGroupQ.mutate({body: {name: 'My Group', description: 'Created on ' + new Date().toDateString()}})
        }}
        className='mt-4 flex  items-center rounded-full bg-blue-600 p-2 px-4 text-sm text-white hover:bg-blue-700'
      >
        <PlusIcon className='mr-1 h-4 w-4 stroke-2' />
        {createGroupQ.isLoading ? 'Creating...' : 'Create group'}
      </button>
      {createGroupQ.isError && (
        <p className='mt-2 text-xs text-red-600'>Oops! There was an error</p>
      )}
      <p className='mt-6 font-medium text-gray-700'>Invites</p>
      <div className='mt-2 mb-4 text-sm text-gray-500'>
        Invites to groups will show up here.
      </div>
      <div className='grid w-80 gap-2'>
        <div className='flex w-full items-center justify-between rounded border border-gray-300 p-2 opacity-70'>
          <div className='flex items-center'>
            <div className='h-6 w-6 rounded bg-gradient-to-br from-pink-300 to-blue-300'></div>
            <div className='ml-2 h-3 w-44 rounded-sm bg-gradient-to-br from-gray-200 to-gray-300'></div>
          </div>
          <div className='flex items-center'>
            <div className='mr-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-200'>
              <XMarkIcon className='h-3 w-3 stroke-[3px] text-red-800' />
            </div>
            <div className='flex h-5 w-5 items-center justify-center rounded-full bg-green-200'>
              <CheckIcon className='h-3 w-3 stroke-[3px] text-green-800' />
            </div>
          </div>
        </div>
        <div className='flex w-full items-center justify-between rounded border border-gray-300 p-2 opacity-30'>
          <div className='flex items-center'>
            <div className='h-6 w-6 rounded bg-gradient-to-br from-orange-300 to-red-300'></div>
            <div className='ml-2 h-3 w-44 rounded-sm bg-gradient-to-br from-gray-200 to-gray-300'></div>
          </div>
          <div className='flex items-center'>
            <div className='mr-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-200'>
              <XMarkIcon className='h-3 w-3 stroke-[3px] text-red-800' />
            </div>
            <div className='flex h-5 w-5 items-center justify-center rounded-full bg-green-200'>
              <CheckIcon className='h-3 w-3 stroke-[3px] text-green-800' />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GroupViewEmptyState
