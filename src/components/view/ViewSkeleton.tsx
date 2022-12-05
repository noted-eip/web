import React, { PropsWithChildren } from 'react'
import { TPanelKey, usePanelContext } from '../../contexts/panel'
import DashboardHeader from './DashboardHeader'

export type TViewSkeletonProps = {
    title: string
    panels: TPanelKey[]
}

const ViewSkeleton: React.FC<PropsWithChildren & TViewSkeletonProps> = props => {
  const { activePanel, setActivePanel, panels, setPanels } = usePanelContext()

  React.useEffect(() => {
    if (props.panels !== panels) {
      setPanels(props.panels)
    }
    if (!props.panels.includes(activePanel)) {
      setActivePanel(props.panels[0])
    }
  }, [])

  return <div className='flex flex-col h-screen w-full !max-h-screen overflow-hidden'>
    <DashboardHeader>
      <h2>{props.title}</h2>
    </DashboardHeader>
    <div className='flex overflow-y-scroll h-full w-full'>
      {props.children}
    </div>
  </div>
}

export default ViewSkeleton
