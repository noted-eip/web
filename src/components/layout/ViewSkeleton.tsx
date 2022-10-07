import React from 'react'

// ViewSkeleton is the parent component of every single route.
const ViewSkeleton: React.FC<React.PropsWithChildren> = (props) => {
  return <div className='flex flex-row w-full h-full bg-white dark:bg-slate-800'>
    {props.children}    
  </div>
}

export default ViewSkeleton
