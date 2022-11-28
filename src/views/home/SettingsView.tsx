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

  return <React.Fragment>
    <DashboardHeader>
      <h1>Settings</h1>
    </DashboardHeader>
  </React.Fragment>
}

export default SettingsView
