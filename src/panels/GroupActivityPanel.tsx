import React from 'react'

import PanelSkeleton from '../components/view/PanelSkeleton'

const GroupActivityPanel: React.FC = () => {
  return (
    <PanelSkeleton>
      <div className='h-full'>
        <div className='flex h-full w-full items-center justify-center overflow-scroll border-2 border-dashed border-gray-300 text-gray-400'>
          Activity Panel
        </div>
      </div>
    </PanelSkeleton>
  )
}

export default GroupActivityPanel
