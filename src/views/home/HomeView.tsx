import React from 'react'
import ViewSkeleton from '../../components/view/ViewSkeleton'

const HomeView: React.FC = () => {
  return <ViewSkeleton title='Home' panels={['group-overview', 'group-chat','group-settings']}>
    <div className='border-2 border-dashed border-gray-300 mb-lg xl:mb-xl h-[1024px] mx-lg xl:mx-xl w-full flex items-center justify-center text-gray-400'>View Body</div>
  </ViewSkeleton>
}

export default HomeView
