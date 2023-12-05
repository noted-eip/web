import React, { PropsWithChildren } from 'react'

import { TPanelKey, usePanelContext } from '../../contexts/panel'

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
      <div className='bg-white px-lg pb-lg pt-xl xl:px-xl xl:pb-xl'>
        <div className='flex h-[36px] max-h-[36px] items-center justify-between'>
          { props.titleElement ? props.titleElement : <h2>{props.title}</h2> }
        </div>
      </div>
      <div className='flex h-full w-full overflow-y-scroll'>{props.children}</div>
    </div>
  )
}

export default ViewSkeleton
