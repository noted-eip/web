import React from 'react'
import { usePanelContext } from '../../contexts/panel'
import { panelMetadata } from '../../lib/panels'

export const Panel: React.FC = () => {
  const { activePanel } = usePanelContext()
  const activePanelComponent = panelMetadata[activePanel].component

  return <div className='h-screen !max-h-screen border-l border-gray-300 hidden lg:flex overflow-hidden'>
    {activePanelComponent({}, {})}
  </div>
}
