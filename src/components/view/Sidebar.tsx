import { Cog6ToothIcon, Square2StackIcon, UserIcon } from '@heroicons/react/24/solid'
import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuthContext } from '../../contexts/auth'
import { useListInvites } from '../../hooks/api/invites'
import Input from '../form/Input'

export const Sidebar: React.FC = () => {
  const authContext = useAuthContext()
  const currentPath = useLocation().pathname
  const listInvitesQ = useListInvites({ recipient_account_id: authContext.userID })

  const links = [
    { path: '/', icon: Square2StackIcon, title: 'Home', numNotifications: 0 },
    { path: '/profile', icon: UserIcon, title: 'Profile', numNotifications: listInvitesQ.isSuccess && listInvitesQ.data.data.invites ? listInvitesQ.data.data.invites.length : 0 },
    { path: '/settings', icon: Cog6ToothIcon, title: 'Settings', numNotifications: 0 },
  ]

  return <div className='border-r border-gray-300 h-screen hidden md:flex flex-col'>
    <div className='m-lg mt-xl xl:m-xl h-full relative'>
      <img className='h-[36px] w-[36px]' src='https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png' />
      <Input className='w-full lg:mt-lg xl:mt-xl hidden xl:block' placeholder='Search' type="text" />
      <div>
        {links.map((el, idx) => {
          return <Link to={el.path} key={`sidebar-nav-${idx}`} className={`flex justify-between first:mt-lg mt-sm hover:bg-gray-100  p-2 cursor-pointer rounded-md ${currentPath == el.path ? 'bg-gray-100' : ''}`}>
            <div className='flex items-center'>
              <el.icon className='text-gray-400 h-5 w-5' />
              <span className='ml-xs text-sm font-medium text-gray-600 hidden xl:block'>{el.title}</span>
            </div>
            {
              el.numNotifications > 0 &&<span className='text-xs text-purple-700 bg-purple-200 rounded-full p-1 h-5 w-5 font-medium flex items-center justify-center'>{el.numNotifications}</span>
            }
          </Link>
        })}
      </div>
      <div className='absolute bottom-0 text-center bg-gray-100 w-full text-sm font-medium text-gray-600 rounded-md p-1 cursor-pointer hover:bg-gray-200'
        onClick={() => authContext.logout()}>
        Logout
      </div>
    </div>
  </div>
}
