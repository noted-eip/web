import React from 'react'

const DashboardHeader: React.FC<React.PropsWithChildren> = (props) => {
  return <div className='h-[36px] mt-xl lg:mx-lg xl:mx-xl flex items-center justify-between'>
    {props.children}
    <div className='flex items-center'>
      {/* <div className='bg-blue-200 h-6 px-2 rounded-full text-blue-600 flex items-center'>
        <span className='text-xs'>Synced</span>
        <CheckIcon className='ml-xxs h-3 w-3 text-blue-600 stroke-[2.5px]' />
      </div> */}
      <div className='ml-md lg:h-[40px] lg:w-[40px] xl:h-[48px] xl:w-[48px] bg-gray-100 rounded-full border border-gray-300'></div>
    </div>
  </div>
}

export default DashboardHeader
