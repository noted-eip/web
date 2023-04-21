import React from 'react'
import PanelSkeleton from '../components/view/PanelSkeleton'

const GroupActivityPanel: React.FC = () => {
  return (
    <PanelSkeleton>
      <div className='h-full'>
        Activity panel
      </div>
    </PanelSkeleton>
  )
}

export default GroupActivityPanel
