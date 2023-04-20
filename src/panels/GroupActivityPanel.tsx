import React from 'react'
import PanelSkeleton from '../components/view/PanelSkeleton'

const GroupActivityPanel: React.FC = () => {
  return (
    <PanelSkeleton>
      <div className='h-full'>
        <div className='flex h-full w-full items-center justify-center overflow-scroll border-2 border-dashed border-gray-300 text-gray-400'>

          <a href='#'
            className='block max-w-sm rounded-lg border border-gray-200 bg-white p-6 shadow hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700'>
            <h5 className='mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white'>Noteworthy technology
              acquisitions 2021</h5>
            <p className='font-normal text-gray-700 dark:text-gray-400'>Here are the biggest enterprise technology
              acquisitions of 2021 so far, in reverse chronological order.</p>
          </a>

        </div>
      </div>
    </PanelSkeleton>
  )
}

export default GroupActivityPanel
