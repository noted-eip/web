import React from 'react'
import { Outlet } from 'react-router-dom'

import { PanelContext, TPanelKey } from '../../contexts/panel'
import { Panel } from './Panel'
import { Sidebar } from './Sidebar'

// Dashboard is the parent component of most views in the application.
const Dashboard: React.FC = () => {
  const [activePanel, setActivePanel] = React.useState<TPanelKey>('group-activity')
  const [panels, setPanels] = React.useState<TPanelKey[]>([])

  return (
    <PanelContext.Provider value={{ activePanel, setActivePanel, panels, setPanels }}>
      <div className='grid h-screen w-screen grid-cols-[auto] bg-white md:grid-cols-[68px_auto] lg:grid-cols-[68px_auto_386px] xl:grid-cols-[216px_auto_400px]'>
        <Sidebar />
        <Outlet />
        <Panel />
      </div>
    </PanelContext.Provider>
  )
}

export default Dashboard
