import React from 'react'
import PanelSkeleton from '../components/view/PanelSkeleton'

const NoteRecommendationsPanel: React.FC = () => {
  return (
    <PanelSkeleton>
      <div className='h-full'>
        <div className='flex h-full w-full items-center justify-center overflow-scroll border-2 border-dashed border-gray-300 text-gray-400'>
          Recommendations Panel
        </div>
      </div>
    </PanelSkeleton>
  )
}

export default NoteRecommendationsPanel
