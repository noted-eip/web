import React from 'react'
import PanelSkeleton from '../components/view/PanelSkeleton'

const NoteRecommendationsPanel: React.FC = () => {
  return <PanelSkeleton>
    <div className='h-full'>
      <div className='border-2 border-dashed border-gray-300 h-full w-full flex items-center justify-center text-gray-400 overflow-scroll'>Recommendations Panel</div>
    </div>
  </PanelSkeleton>
}

export default NoteRecommendationsPanel
