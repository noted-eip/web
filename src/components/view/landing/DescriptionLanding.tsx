import React from 'react'
import noteLogo from '../../../assets/icon/note.svg'
import shareLogo from '../../../assets/icon/share.svg'
// import notedHome from '../../../assets/noted_front_page'

const DescriptionLanding: React.FC = () => {
  return (
    <div className='pt-20' id='description'>
      <div className='mx-auto max-w-7xl px-6 md:px-12 xl:px-6'>
        <div className='flex-row-reverse justify-between space-y-6 text-gray-600 md:flex md:gap-6 md:space-y-0 lg:items-center lg:gap-12'>
          <div className='md:5/12 lg:w-1/2'>
            <img
              src='.'
              alt='image'
              loading='lazy'
              width=''
              height=''
              className='w-full'
            />
          </div>
          <div className='md:7/12 lg:w-1/2'>
            <h2 className='text-3xl font-bold text-gray-900 dark:text-white md:text-4xl'>
            Noted
            </h2>
            <p className='my-8 text-gray-600 dark:text-gray-300'>
            Noted is an ergonomic workspace destined to university students.
            It is a web application where they can share their notes and organize them. <br /> <br />
            Noted’s strength is its unique editing mode which includes recommendations based on notes published by students.
            It will allow students to improve their notes by facilitating collaboration. 
            </p>
            <div className='space-y-4 divide-y divide-gray-100 dark:divide-gray-800'>
              <div className='mt-8 flex gap-4 md:items-center'>
                <div className='flex h-12 w-12 gap-4 rounded-full bg-indigo-100 dark:bg-indigo-900/20'>
                  <img src={noteLogo} alt='note logo' height='16.5px' width='20.5px' className='m-auto h-6 w-6 text-indigo-500 dark:text-indigo-400' />
                </div>
                <div className='w-5/6'>
                  <h4 className='text-lg font-semibold text-gray-700 dark:text-indigo-300'>Prendre des notes</h4>
                  <p className='text-gray-500 dark:text-gray-400'>{'Noted propose un mode d\'éditon de note plus de la recommendations'}.</p>
                </div> 
              </div> 
              <div className='flex gap-4 pt-4 md:items-center'>
                <div className='flex h-12 w-12 gap-4 rounded-full bg-teal-100 dark:bg-teal-900/20'>
                  <img src={shareLogo} alt='share logo' height='16.5px' width='20.5px' className='m-auto h-6 w-6 text-teal-600 dark:text-teal-400' />
                </div>
                <div className='w-5/6'>
                  <h4 className='text-lg font-semibold text-gray-700 dark:text-teal-300'>Partage tes notes</h4>
                  <p className='text-gray-500 dark:text-gray-400'>Asperiores nemo possimus nesciunt quam mollitia.</p>
                </div> 
              </div> 
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DescriptionLanding