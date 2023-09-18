import { getAnalytics, logEvent } from 'firebase/analytics'
import React from 'react'

import ViewSkeleton from '../../components/view/ViewSkeleton'

const SettingsView: React.FC = () => {
  const analytics = getAnalytics()
  
  logEvent(analytics, 'page_view', {
    page_title: 'settings'
  })
  return (
    <ViewSkeleton title='Settings' panels={['group-chat', 'group-activity']}>
      <div className='mx-lg mb-lg flex h-[1024px] w-full items-center justify-center border-2 border-dashed border-gray-300 text-gray-400 xl:mx-xl xl:mb-xl'>
        View Body
      </div>
    </ViewSkeleton>
  )
}

export default SettingsView
