import React from 'react'

import { usePanelContext } from '../../contexts/panel'
import { panelMetadata } from '../../lib/panels'

export const Panel: React.FC = () => {
  const { activePanel } = usePanelContext()
  const activePanelComponent = panelMetadata[activePanel].component

  return (
    <div className='hidden h-screen !max-h-screen overflow-hidden border-l border-gray-300 lg:flex'>
      {activePanelComponent({}, {})}
    </div>
  )
}
