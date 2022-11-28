import { Cog6ToothIcon, Square2StackIcon, UserIcon } from '@heroicons/react/24/solid'
import React from 'react'
import { Link, Outlet } from 'react-router-dom'
import { PanelContext, TPanelKey, usePanelContext } from '../../contexts/panel'
import GroupChatPanel from '../../panels/GroupChatPanel'
import GroupOverviewPanel from '../../panels/GroupOverviewPanel'
import GroupSettingsPanel from '../../panels/GroupSettingsPanel'
import Input from '../form/Input'

const Sidebar: React.FC = () => {
  const currentPath = ''

  const links = [
    {path: '/', icon: Square2StackIcon, title: 'Home'},
    {path: '/profile', icon: UserIcon, title: 'Profile'},
    {path: '/settings', icon: Cog6ToothIcon, title: 'Settings'},
  ]

  return <div className='border-r border-gray-300 h-screen'>
    <div className='m-xl'>
      <img className='h-[36px] w-[36px]' src='https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png' />
      <Input className='w-full mt-lg' placeholder='Search' type="text" />
      <div>
        {links.map((el, idx) => {
          return <Link to={el.path} key={`sidebar-nav-${idx}`} className={`flex first:mt-lg mt-sm hover:bg-gray-100  p-2 cursor-pointer rounded-md ${currentPath == el.path ? 'bg-gray-100' : ''}`}>
            <el.icon className='text-gray-400 h-5 w-5' />
            <span className='ml-xs text-sm font-medium text-gray-600'>{el.title}</span>
          </Link>
        })}
      </div>
    </div>
  </div>
}

const panels = [
  {key: 'group-overview', component: GroupOverviewPanel},
  {key: 'group-chat', component: GroupChatPanel},
  {key: 'group-settings', component: GroupSettingsPanel},
]

const Panel: React.FC = () => {
  const { activePanel: panel } = usePanelContext()

  return <div className='h-screen border-l border-gray-300'>
    {panels.map((el, idx) => <div key={`panel-${el.key}-${idx}`} className={`${panel == el.key ? '' : 'hidden'}`}><el.component /></div>)}
  </div>
}

// Dashboard is the parent component of most views in the application.
const Dashboard: React.FC = () => {
  const [activePanel, setActivePanel] = React.useState<TPanelKey>('group-overview')
  const [panels, setPanels] = React.useState<TPanelKey[]>([])

  return <PanelContext.Provider value={{activePanel, setActivePanel, panels, setPanels}}>
    <div className='w-screen h-screen bg-white grid grid-cols-[216px_auto_400px]'>
      <Sidebar />
      <Outlet />
      <Panel />
    </div>
  </PanelContext.Provider>
}

export default Dashboard
