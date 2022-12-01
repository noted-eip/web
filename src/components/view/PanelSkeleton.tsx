import React, { PropsWithChildren } from 'react'
import PanelHeader from './PanelHeader'

const PanelSkeleton: React.FC<PropsWithChildren> = props => {
  return <div className={'flex flex-col h-full w-full'}>
    <PanelHeader />
    <div className='overflow-y-scroll h-full lg:px-lg xl:px-xl lg:pb-lg xl:pb-xl'>
      {props.children}
    </div>
  </div>
}

export default PanelSkeleton
