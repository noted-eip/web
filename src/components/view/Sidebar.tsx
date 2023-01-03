import { Cog6ToothIcon, Square2StackIcon, UserIcon } from '@heroicons/react/24/solid'
import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuthContext } from '../../contexts/auth'
import Input from '../form/Input'

export const Sidebar: React.FC = () => {
  const authContext = useAuthContext()
  const currentPath = useLocation().pathname

  const links = [
    { path: '/', icon: Square2StackIcon, title: 'Home' },
    { path: '/profile', icon: UserIcon, title: 'Profile' },
    { path: '/settings', icon: Cog6ToothIcon, title: 'Settings' },
  ]

  return <div className='border-r border-gray-300 h-screen hidden md:flex flex-col'>
    <div className='m-lg mt-xl xl:m-xl h-full relative'>
      <img className='h-[36px] w-[36px]' src='https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png' />
      <Input className='w-full lg:mt-lg xl:mt-xl hidden xl:block' placeholder='Search' type="text" />
      <div>
        {links.map((el, idx) => {
          return <Link to={el.path} key={`sidebar-nav-${idx}`} className={`flex first:mt-lg mt-sm hover:bg-gray-100  p-2 cursor-pointer rounded-md ${currentPath == el.path ? 'bg-gray-100' : ''}`}>
            <el.icon className='text-gray-400 h-5 w-5' />
            <span className='ml-xs text-sm font-medium text-gray-600 hidden xl:block'>{el.title}</span>
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