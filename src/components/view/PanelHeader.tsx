import React from 'react'

import { usePanelContext } from '../../contexts/panel'
import { FormatMessage } from '../../i18n/TextComponent'
import {LocaleTranslationKeys} from '../../i18n/types'
import { panelMetadata } from '../../lib/panels'
import RecommendationFilters from '../../views/recommendation/Filters'

const PanelHeader: React.FC = () => {
  const { activePanel, setActivePanel, panels } = usePanelContext()

  const recoPanelOn = panels.some(panel => {
    if (panel == 'note-recommendations') {
      return true
    }
    return false
  })

  return (
    <div className='mt-xl flex h-[36px] min-h-[36px] items-center justify-around lg:mx-lg lg:mb-lg xl:mx-xl xl:mb-xl'>
      {panels.map((panelKey, idx) => {
        // console.log(panelKey)
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
              <span className='text-xs'>
                <FormatMessage id={md.displayName as LocaleTranslationKeys}/>
              </span>
            </div>
          </div>
        )
      })}
      {
        recoPanelOn ? 
          <RecommendationFilters/> : 
          null
      }
      
    </div>
  )
}

export default PanelHeader
