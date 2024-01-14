import Lottie from 'lottie-react'
import React from 'react'

import emptyAnim from '../assets/animations/empty-box.json'
import PanelSkeleton from '../components/view/PanelSkeleton'
import { FormatMessage } from '../i18n/TextComponent'

const ActivityListNoGroup: React.FC = () => {
  return (
    <div className='flex h-full items-center justify-center lg:px-lg lg:pb-lg xl:px-xl xl:pb-xl'>
      <div className='my-4 space-y-2 text-center'>
        <FormatMessage id='PANEL.activity.noGroup' />
        <Lottie
          animationData={emptyAnim}
          loop
          autoplay
          className='h-full w-full'
        />
      </div>
    </div>
  )
}

const GroupActivityNotesPanel: React.FC = () => {
  return (
    <PanelSkeleton>
      <ActivityListNoGroup />
    </PanelSkeleton>
  )
}

export default GroupActivityNotesPanel
