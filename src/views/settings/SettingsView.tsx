import React from 'react'
import ViewSkeleton from '../../components/view/ViewSkeleton'

const SettingsView: React.FC = () => {
  return <ViewSkeleton title='Settings' panels={['group-chat','group-activity']}>
    <div className='border-2 border-dashed border-gray-300 mb-lg xl:mb-xl h-[1024px] mx-lg xl:mx-xl w-full flex items-center justify-center text-gray-400'>View Body</div>
  </ViewSkeleton>
}

export default SettingsView
