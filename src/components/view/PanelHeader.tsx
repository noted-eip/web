import React from 'react'

import { usePanelContext } from '../../contexts/panel'
import { panelMetadata } from '../../lib/panels'

const PanelHeader: React.FC = () => {
  const { activePanel, setActivePanel, panels } = usePanelContext()

  return (
    <div className='mt-xl flex h-[36px] min-h-[36px] items-center justify-around lg:mx-lg lg:mb-lg xl:mx-xl xl:mb-xl'>
      {panels.map((panelKey, idx) => {
        const md = panelMetadata[panelKey]
        return (
          <div
            key={`panel-navigation-${panelKey}-${idx}`}
            className='flex items-center justify-center'
          >
            <div
              className={`flex h-8 cursor-pointer items-center rounded-full bg-gray-50 px-4 text-gray-600 transition-colors hover:border-gray-400 hover:bg-gray-100 hover:text-gray-700 ${
                activePanel === panelKey &&
                '!border-purple-500 !bg-purple-100 !text-purple-700'
              }`}
              onClick={() => setActivePanel(panelKey)}
            >
              <md.icon
                className={`mr-2 h-3 w-3 text-gray-500 ${
                  activePanel === panelKey && '!text-purple-700'
                }`}
              />
              <span className='text-xs'>{md.displayName}</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default PanelHeader
