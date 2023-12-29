import React from 'react'

export type TPanelKey = 'group-activity' | 'note-recommendations' | 'note-quizs'

export type TPanelContext = {
  activePanel: TPanelKey
  setActivePanel: React.Dispatch<TPanelKey>
  panels: TPanelKey[]
  setPanels: React.Dispatch<TPanelKey[]>
}

export const PanelContext = React.createContext<TPanelContext | undefined>(undefined)

// Decide which panel shows up in the panel view.
export const usePanelContext = () => {
  const context = React.useContext(PanelContext)
  if (context === undefined) {
    throw new Error('PanelContext used outside of provider')
  }
  return context
}
