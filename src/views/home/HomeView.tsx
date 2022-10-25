import React from 'react'
import ViewSkeleton from '../../components/layout/ViewSkeleton'
import GroupChatPanel from '../../panels/GroupChatPanel'
import GroupOverviewPanel from '../../panels/GroupOverviewPanel'
import GroupSettingsPanel from '../../panels/GroupSettingsPanel'
import { ChevronDownIcon, CheckIcon } from '@heroicons/react/24/outline'

const HomeComponent: React.FC = () => {
  return <div className='h-[36px] mt-xl mx-xl flex items-center justify-between'>
    <div className='cursor-pointer flex items-center rounded-full hover:bg-gray-100'>
      <img className='h-[36px] w-[36px] bg-gray-100 rounded-full border border-gray-300' src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJjxQSevxZSdV9xXy7LWCvgmJTAKaeaF3Kj0GWU_FrypKqrlN3xZOD9r125HbaO9SauK0&usqp=CAU' />
      <h1 className='ml-md'>Noted 2022</h1>
      <ChevronDownIcon className='ml-md h-4 w-4 stroke-[3px] text-gray-500 mr-md' />
    </div>
    <div className='flex items-center'>
      <div className='bg-blue-200 h-6 px-2 rounded-full text-blue-600 flex items-center'>
        <span className='text-xs'>Synced</span>
        <CheckIcon className='ml-xxs h-3 w-3 text-blue-600 stroke-[2.5px]' />
      </div>
      <div className='ml-md h-[48px] w-[48px] bg-gray-100 rounded-full border border-gray-300'></div>
    </div>
  </div>
}

const HomeView: React.FC = () => {
  return <ViewSkeleton bodyComponent={<HomeComponent />} panelComponents={[
    {key: 'overview', component: <GroupOverviewPanel key={'panel-comp-1'} />},
    {key: 'chat', component: <GroupChatPanel key={'panel-comp-1'} />},
    {key: 'settings', component: <GroupSettingsPanel key={'panel-comp-1'} />}
  ]} />
}

export default HomeView
