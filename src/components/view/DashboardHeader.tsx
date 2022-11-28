import { CheckIcon } from '@heroicons/react/24/solid'
import React from 'react'

const DashboardHeader: React.FC<React.PropsWithChildren> = (props) => {
  return <div className='h-[36px] mt-xl mx-xl flex items-center justify-between'>
    {props.children}
    <div className='flex items-center'>
      <div className='bg-blue-200 h-6 px-2 rounded-full text-blue-600 flex items-center'>
        <span className='text-xs'>Synced</span>
        <CheckIcon className='ml-xxs h-3 w-3 text-blue-600 stroke-[2.5px]' />
      </div>
      <div className='ml-md h-[48px] w-[48px] bg-gray-100 rounded-full border border-gray-300'></div>
    </div>
  </div>
}

export default DashboardHeader
