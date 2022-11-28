import React from 'react'
import DashboardHeader from '../../components/view/DashboardHeader'
import { TPanelKey, usePanelContext } from '../../contexts/panel'

const ProfileView: React.FC = () => {
  const profileViewPanels: TPanelKey[] = ['group-overview', 'group-chat','group-settings']
  const { activePanel, setActivePanel, panels, setPanels } = usePanelContext()

  React.useEffect(() => {
    if (profileViewPanels !== panels) {
      setPanels(profileViewPanels)
    }
    if (!profileViewPanels.includes(activePanel)) {
      setActivePanel(profileViewPanels[0])
    }
  }, [])

  return <React.Fragment>
    <DashboardHeader>
      <h1>Profile</h1>
    </DashboardHeader>
  </React.Fragment>
}

export default ProfileView
