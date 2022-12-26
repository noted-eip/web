import { PlusIcon, UserPlusIcon } from '@heroicons/react/24/outline'
import React from 'react'
import ViewSkeleton from '../../components/view/ViewSkeleton'
import { useGroupContext } from '../../contexts/group'

const NoGroupEmptyState: React.FC = () => {
  return <div className='flex w-full h-full flex-col items-center pt-12'>
    <UserPlusIcon className='h-12 w-12 text-gray-400 stroke-1' />
    <p className='font-medium text-gray-700 mt-4'>No Group</p>
    <p className='text-sm text-gray-500'>Create or join a group to start writing!</p>
    <button className='bg-blue-600 text-white px-4 p-2 rounded-full text-sm flex items-center mt-4'>
      <PlusIcon className='mr-1 h-4 w-4 stroke-2' />
      Create group
    </button>
    <p className='font-medium text-gray-700 mt-6'>Invites</p>
    <div className='text-gray-500 text-sm mt-2'>
      Invites to groups will show up here.
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
