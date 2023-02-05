import React, { PropsWithChildren } from 'react'
import PanelHeader from './PanelHeader'

const PanelSkeleton: React.FC<PropsWithChildren> = (props) => {
  return (
    <div className={'flex h-full w-full flex-col'}>
      <PanelHeader />
      <div className='h-full overflow-y-scroll lg:px-lg lg:pb-lg xl:px-xl xl:pb-xl'>
        {props.children}
      </div>
    </div>
  )
}

export default PanelSkeleton
