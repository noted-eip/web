import React from 'react'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import DashboardHeader from '../../components/view/DashboardHeader'
import { TPanelKey, usePanelContext } from '../../contexts/panel'

const HomeView: React.FC = () => {
  const homeViewPanels: TPanelKey[] = ['group-overview', 'group-chat','group-settings']
  const { activePanel, setActivePanel, panels, setPanels } = usePanelContext()

  React.useEffect(() => {
    if (homeViewPanels !== panels) {
      setPanels(homeViewPanels)
    }
    if (!homeViewPanels.includes(activePanel)) {
      setActivePanel(homeViewPanels[0])
    }
  }, [])

  return <div>
    <DashboardHeader>
      {/* <div className='cursor-pointer flex items-center rounded-full hover:bg-gray-100'>
        <img className='h-[36px] w-[36px] bg-gray-100 rounded-full border border-gray-300' src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJjxQSevxZSdV9xXy7LWCvgmJTAKaeaF3Kj0GWU_FrypKqrlN3xZOD9r125HbaO9SauK0&usqp=CAU' />
        <h1 className='ml-md'>Noted 2022</h1>
        <ChevronDownIcon className='ml-md h-4 w-4 stroke-[3px] text-gray-500 mr-md' />
      </div> */}
      <h2>Home</h2>
    </DashboardHeader>
    <div className='flex'>
      <div className='border-2 border-dashed border-gray-300 h-48 m-lg xl:m-xl p-xl w-full flex items-center justify-center text-gray-400'>View Body</div>
    </div>
  </div>
  
}

export default HomeView
