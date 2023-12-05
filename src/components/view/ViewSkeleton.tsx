import React, { PropsWithChildren } from 'react'

import { TPanelKey, usePanelContext } from '../../contexts/panel'
import DashboardHeader from './DashboardHeader'

export type TViewSkeletonProps = {
  title?: string
  titleElement?: JSX.Element
  panels: TPanelKey[]
}

const ViewSkeleton: React.FC<PropsWithChildren & TViewSkeletonProps> = (props) => {
  const { activePanel, setActivePanel, panels, setPanels } = usePanelContext()

  React.useEffect(() => {
    if (props.panels !== panels) {
      setPanels(props.panels)
    }
    if (!props.panels.includes(activePanel)) {
      setActivePanel(props.panels[0])
    }
  }, [])

  return (
    <div className='flex h-screen !max-h-screen w-full flex-col'>
      <DashboardHeader>
        {
          props.titleElement ?
            props.titleElement
            :
            <h2>{props.title}</h2>
        }
      </DashboardHeader>
      <div className='flex h-full w-full overflow-y-scroll'>{props.children}</div>
    </div>
  )
}

export default ViewSkeleton
