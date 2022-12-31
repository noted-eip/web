import { CheckIcon, PlusIcon, UserPlusIcon, XMarkIcon } from '@heroicons/react/24/outline'
import React from 'react'
import { Outlet, useNavigate, useParams } from 'react-router-dom'
import ViewSkeleton from '../../components/view/ViewSkeleton'
import { useGroupContext } from '../../contexts/group'
import { useCreateGroup } from '../../hooks/api/groups'

const NoGroupEmptyState: React.FC = () => {
  const groupContext = useGroupContext()
  const createGroupQ = useCreateGroup({
    onSuccess: (data) => {
      groupContext.changeGroup(data.data.group.id)
    },
  })

  return <div className='flex w-full h-full flex-col items-center pt-12'>
    <UserPlusIcon className='h-12 w-12 text-gray-400 stroke-1' />
    <p className='font-medium text-gray-700 mt-4'>No Group</p>
    <p className='text-sm text-gray-500'>Create or join a group to start writing!</p>
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

const GroupView: React.FC = () => {
  const groupContext = useGroupContext()
  const routerParams = useParams()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    if (groupContext.groupID && !routerParams.groupId) {
      navigate(`/group/${groupContext.groupID}`)
    }  
    if (routerParams.groupId && routerParams.groupId !== groupContext.groupID) {
      groupContext.changeGroup(routerParams.groupId)
    }
    setIsLoading(false)
  })
  
  if (isLoading) {
    return <div></div>
  }

  return <ViewSkeleton title='Home' panels={['group-activity', 'group-chat']}>
    {
      groupContext.groupID ?
        <div className='mb-lg mx-lg xl:mb-xl xl:mx-xl w-full'>  
          <Outlet />
        </div>
        :
        <NoGroupEmptyState />
    }
  </ViewSkeleton>
}

export default GroupView
