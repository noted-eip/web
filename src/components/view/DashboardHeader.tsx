import { ChevronDownIcon } from '@heroicons/react/24/solid'
import React from 'react'

const GroupSelectInput: React.FC = () => {
  return <div className='flex items-center'>
    <div className='rounded border border-gray-300 text-sm flex cursor-pointer'>
      <div className='font-medium text-gray-800 flex items-center'>
        <img className='h-8 w-8 p-[1px] mr-[3px]' src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJjxQSevxZSdV9xXy7LWCvgmJTAKaeaF3Kj0GWU_FrypKqrlN3xZOD9r125HbaO9SauK0&usqp=CAU' />
    Noted 2022
      </div>
      <div className='border-l border-gray-300 flex items-center justify-center px-1 ml-2'>
        <ChevronDownIcon className='h-4 w-4 stroke-[10px] text-gray-500' />
      </div>
    </div>
  </div>
} 

const DashboardHeader: React.FC<React.PropsWithChildren> = (props) => {
  return <div className='pb-lg xl:pb-xl pt-xl px-lg xl:px-xl bg-white'>
    <div className='flex items-center justify-between max-h-[36px] h-[36px]'>
      {props.children}
      <GroupSelectInput />
    </div>
  </div>
}

export default DashboardHeader
