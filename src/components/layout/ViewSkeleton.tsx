import { Cog6ToothIcon, CogIcon, EnvelopeIcon, HomeIcon, Square2StackIcon, UserIcon } from '@heroicons/react/24/solid'
import React from 'react'
import Input from '../form/Input'

type ViewSkeletonProps = {
  bodyComponent: JSX.Element;
  panelComponents: {key: string, component: JSX.Element}[]
}

// ViewSkeleton is the parent component of every single route.
const ViewSkeleton: React.FC<ViewSkeletonProps> = (props) => {
  return <div className='w-screen h-screen bg-white grid grid-cols-[216px_auto_400px]'>
    {/* Sidebar */}
    <div className='border-r border-gray-300 h-screen'>
      <div className='m-xl'>
        <img className='h-[36px] w-[36px]' src='https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png' />
        <Input className='w-full mt-lg' placeholder='Search' type="text" />
        <div className='flex hover:bg-gray-100 mt-lg p-2 cursor-pointer bg-gray-100 rounded-md'>
          <Square2StackIcon className='text-gray-400 h-5 w-5' />
          <span className='ml-xs text-sm font-medium text-gray-600'>Home</span>
        </div>
        <div className='flex hover:bg-gray-50 rounded-md mt-sm p-2 cursor-pointer'>
          <UserIcon className='text-gray-400 h-5 w-5' />
          <span className='ml-xs text-sm font-medium text-gray-600'>Profile</span>
        </div>
        <div className='flex hover:bg-gray-50 rounded-md mt-sm p-2 cursor-pointer'>
          <Cog6ToothIcon className='text-gray-400 h-5 w-5' />
          <span className='ml-xs text-sm font-medium text-gray-600'>Settings</span>
        </div>
      </div>
    </div>
    {/* Body */}
    <div className=''>
      {props.bodyComponent}
    </div>
    {/* Panel */}
    <div className='h-screen border-l border-gray-300'>
      <div className='h-[36px] flex w-full items-center mt-xl mx-xl'>
        <h2>Notifications</h2>
      </div>
    </div>
  </div>
}

export default ViewSkeleton
