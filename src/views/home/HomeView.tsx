import { CheckIcon, PlusIcon, UserPlusIcon, XMarkIcon } from '@heroicons/react/24/outline'
import React from 'react'
import ViewSkeleton from '../../components/view/ViewSkeleton'
import { useGroupContext } from '../../contexts/group'

const NoGroupEmptyState: React.FC = () => {
  return <div className='flex w-full h-full flex-col items-center pt-12'>
    <UserPlusIcon className='h-12 w-12 text-gray-400 stroke-1' />
    <p className='font-medium text-gray-700 mt-4'>No Group</p>
    <p className='text-sm text-gray-500'>Create or join a group to start writing!</p>
    <button className='bg-blue-600 text-white px-4 p-2 rounded-full text-sm flex items-center mt-4 hover:bg-blue-700'>
      <PlusIcon className='mr-1 h-4 w-4 stroke-2' />
      Create group
    </button>
    <p className='font-medium text-gray-700 mt-6'>Invites</p>
    <div className='text-gray-500 text-sm mt-2 mb-4'>
      Invites to groups will show up here.
    </div>
    <div className='w-80 grid gap-2'>
      <div className='opacity-60 rounded p-2 w-full border border-gray-300 flex items-center justify-between'>
        <div className='flex items-center'>
          <div className='h-6 w-6 bg-gradient-to-br from-pink-300 to-blue-300 rounded'></div>
          <div className='w-44 h-3 bg-gradient-to-br from-gray-200 to-gray-300 rounded-sm ml-2'></div>
        </div>
        <div className='flex items-center'>
          <div className='rounded-full h-5 w-5 bg-red-200 flex items-center justify-center mr-1'>
            <XMarkIcon className='h-3 w-3 text-red-800 stroke-[3px] cursor-pointer' />
          </div>
          <div className='rounded-full h-5 w-5 bg-green-200 flex items-center justify-center'>
            <CheckIcon className='h-3 w-3 text-green-800 stroke-[3px] cursor-pointer' />
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
            <XMarkIcon className='h-3 w-3 text-red-800 stroke-[3px] cursor-pointer' />
          </div>
          <div className='rounded-full h-5 w-5 bg-green-200 flex items-center justify-center'>
            <CheckIcon className='h-3 w-3 text-green-800 stroke-[3px] cursor-pointer' />
          </div>
        </div>
      </div>
    </div>
  </div>
}

const HomeView: React.FC = () => {
  const groupContext = useGroupContext()

  return <ViewSkeleton title='Home' panels={['group-overview', 'group-chat','group-settings']}>
    <div className='mb-lg xl:mb-xl mx-lg xl:mx-xl w-full flex items-center justify-center'>
      {groupContext.groupID === null ? <NoGroupEmptyState /> : <div>Full State</div>}
    </div>
  </ViewSkeleton>
}

export default HomeView
