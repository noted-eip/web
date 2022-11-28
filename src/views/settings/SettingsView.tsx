import React from 'react'
import DashboardHeader from '../../components/view/DashboardHeader'
import { TPanelKey, usePanelContext } from '../../contexts/panel'

const SettingsView: React.FC = () => {
  const settingsViewPanels: TPanelKey[] = ['group-overview', 'group-chat', 'group-settings']
  const { activePanel, setActivePanel, panels, setPanels } = usePanelContext()

  React.useEffect(() => {
    if (settingsViewPanels !== panels) {
      setPanels(settingsViewPanels)
    }
    console.log(settingsViewPanels, activePanel, !settingsViewPanels.includes(activePanel))
    if (!settingsViewPanels.includes(activePanel)) {
      setActivePanel(settingsViewPanels[0])
    }
  }, [])

  return <div>
    <DashboardHeader>
      <h1>Settings</h1>
    </DashboardHeader>
    <div className='flex'>
      <div className='border-2 border-dashed border-gray-300 h-48 m-lg xl:m-xl p-xl w-full flex items-center justify-center text-gray-400'>View Body</div>
    </div>
  </div>
}

export default SettingsView
