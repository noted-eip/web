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

  return <div>
    <DashboardHeader>
      <h1>Profile</h1>
    </DashboardHeader>
    <div className='flex'>
      <div className='border-2 border-dashed border-gray-300 h-48 m-lg xl:m-xl p-xl w-full flex items-center justify-center text-gray-400'>View Body</div>
    </div>
  </div>
}

export default ProfileView
