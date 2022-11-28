import React from 'react'
import PanelNavigation from '../components/view/PanelNavigation'

const GroupChatPanel: React.FC = () => {
  return <div className={'mt-xl lg:mx-lg xl:mx-xl h-full'}>
    <PanelNavigation />
    <div className='flex'>
      <div className='border-2 border-dashed border-gray-300 h-48 w-full flex items-center justify-center text-gray-400'>Chat Panel</div>
    </div>
  </div>
}

export default GroupChatPanel
