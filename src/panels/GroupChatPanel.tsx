import React from 'react'
import PanelNavigation from '../components/view/PanelNavigation'

const GroupChatPanel: React.FC = () => {
  return <div className={'h-full'}>
    <PanelNavigation />
    <div className='flex lg:mx-lg xl:mx-xl '>
      <div className='border-2 border-dashed border-gray-300 h-[1000px] w-full flex items-center justify-center text-gray-400 mb-xl'>Chat Panel</div>
    </div>
  </div>
}

export default GroupChatPanel
