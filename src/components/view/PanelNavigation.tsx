import React from 'react'
import { usePanelContext } from '../../contexts/panel'
import { panelMetadata } from '../../lib/panels'

const PanelNavigation: React.FC = () => {
  const { activePanel, setActivePanel, panels } = usePanelContext()

  return <div className='h-[36px] w-full grid grid-flow-col mb-lg'>
    {panels.map((panelKey, idx) => {
      const md = panelMetadata[panelKey]
      return <div key={`panel-navigation-${panelKey}-${idx}`} className='flex items-center justify-center'>
        <div className={`cursor-pointer h-8 px-4 rounded-full hover:border-gray-400 transition-colors bg-gray-50 hover:bg-gray-100 text-gray-600 hover:text-gray-700 flex items-center ${activePanel === panelKey && '!bg-purple-100 !text-purple-700 !border-purple-500'}`}
          onClick={() => {
            setActivePanel(panelKey)
          }}>
          <md.icon className={`h-3 w-3 mr-2 text-gray-500 ${activePanel === panelKey && '!text-purple-700'}`} />
          <span className='text-xs'>{md.displayName}</span>
        </div>
      </div>
    })}
  </div>
}

export default PanelNavigation
