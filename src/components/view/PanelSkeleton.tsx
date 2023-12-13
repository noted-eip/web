import React, { PropsWithChildren } from 'react'

import PanelHeader from './PanelHeader'

const PanelSkeleton: React.FC<PropsWithChildren> = (props) => {
  return (
    <div className='flex h-full w-full flex-col'>
      <PanelHeader />
      {props.children}
    </div>
  )
}

export default PanelSkeleton
