import { ChevronDownIcon } from '@heroicons/react/24/solid'
import React from 'react'

const DashboardHeader: React.FC<React.PropsWithChildren> = (props) => {
  return <div className='shadow-[0_20px_7px_0px_rgba(255,255,255,1)] h-[60px] lg:px-lg xl:px-xl sticky top-0 pt-xl bg-white flex items-center justify-between'>
    {props.children}
    <div className='flex items-center'>
      <div className='rounded border border-gray-300 text-sm flex cursor-pointer'>
        <div className='font-medium text-gray-800 flex items-center'>
          <img className='h-8 w-8 p-[1px] mr-[3px]' src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJjxQSevxZSdV9xXy7LWCvgmJTAKaeaF3Kj0GWU_FrypKqrlN3xZOD9r125HbaO9SauK0&usqp=CAU' />
          Noted 2022
        </div>
        <div className='border-l border-gray-300 flex items-center justify-center px-1 ml-2'>
          <ChevronDownIcon className='h-4 w-4 stroke-[10px] text-gray-500' />
        </div>
      </div>
      {/* <div className='bg-blue-200 h-6 px-2 rounded-full text-blue-600 flex items-center'>
        <span className='text-xs'>Synced</span>
        <CheckIcon className='ml-xxs h-3 w-3 text-blue-600 stroke-[2.5px]' />
      </div> */}
      {/* <img src='https://avatars.githubusercontent.com/u/63368264?v=4' className='ml-md h-[40px] w-[40px] xl:h-[48px] xl:w-[48px] bg-gray-100 rounded-full shadow border border-white'></img> */}
    </div>
  </div>
}

export default DashboardHeader
