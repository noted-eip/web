import React from 'react'

// TODO: what is the good type ?
const ContainerMd: React.FC<any> = ({ children }) => {
  return (<div>
    <div className='mx-auto flex flex-col items-center justify-center px-6 py-8 md:h-screen lg:py-0'>
      <div className='w-full rounded-lg border border-slate-300 bg-white p-6 shadow dark:border dark:border-gray-700 dark:bg-gray-800 sm:max-w-md sm:p-8 md:mt-0'>
        {children}
      </div>
    </div>
  </div>)
}

export default ContainerMd