import { ChevronRightIcon } from '@heroicons/react/24/outline'
import React from 'react'
import PanelSkeleton from '../components/view/PanelSkeleton'

const MembersMenu: React.FC = () => {
  const members = [
    {id: '1234', role: 'admin', email: 'edouard@epitech.com', name: 'Édouard', online: true, lastSeen: '2 hours ago', avatarUrl: 'https://avatars.githubusercontent.com/u/58398928?s=40&u=23c492131e2aaeebd06777874bd1a1ab950cdd7c&v=4'},
    {id: '1234', role: null, email: 'maxime@epitech.com', name: 'Maxime', online: false, lastSeen: '2 hours ago', avatarUrl: 'https://avatars.githubusercontent.com/u/61683870?s=40&u=14e2d9297bed88279fcba593f1ecd0d8ee728196&v=4'},
    {id: '1234', role: null, email: 'thomas@epitech.com', name: 'Thomas', online: false, lastSeen: 'Yesterday', avatarUrl: 'https://avatars.githubusercontent.com/u/58695101?s=40&u=0ab42103368360947951de967dd4ffdcb8b0ee5a&v=4'},
  ]

  return <div className='h-full'>
    <h3>MEMBERS</h3>
    <div className='mt-1 grid grid-cols-1 border border-gray-300 rounded-lg overflow-hidden'>
      {members.map((el, idx) => <div key={`members-${el.id}-{${idx}}`} className='h-12 hover:bg-gray-100 flex justify-between items-center px-2 cursor-pointer border-b last:border-none border-gray-300'>
        <div className='flex justify-center items-center'>
          <img src={el.avatarUrl} alt="" className='border border-gray-300 rounded-full bg-gray-300 h-8 w-8' />
          <p className='ml-2 text-sm text-gray-800'>{el.name}<span className='text-xs text-gray-500'> · {el.online ? <span className='text-green-600'>Active</span> : el.lastSeen}</span></p>
        </div>
        {el.role === 'admin' && <span className='px-2 rounded-full bg-purple-100 flex h-6 items-center text-purple-700 text-xs'>Admin</span>}
      </div>)}
      <div className='cursor-pointer h-6 text-xs text-gray-500 flex justify-center items-center'>See all members <ChevronRightIcon className='h-3 w-3 stroke-[2px] text-gray-500' /></div>
    </div>
  </div>
}

const GroupOverviewPanel: React.FC = () => {
  return <PanelSkeleton>
    <div className='h-full'>
      <MembersMenu />
    </div>
  </PanelSkeleton>
}

export default GroupOverviewPanel
