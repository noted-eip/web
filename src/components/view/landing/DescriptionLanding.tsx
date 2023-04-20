import React from 'react'
import noteLogo from '../../../assets/icon/note.svg'
import shareLogo from '../../../assets/icon/share.svg'

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
            Noted c kwa
            </h2>
            <p className='my-8 text-gray-600 dark:text-gray-300'>
            Nobis minus voluptatibus pariatur dignissimos libero quaerat iure expedita at?
            Asperiores nemo possimus nesciunt dicta veniam aspernatur quam mollitia. <br /> <br /> Vitae error, quaerat officia delectus voluptatibus explicabo quo pariatur impedit, at reprehenderit aliquam a ipsum quas voluptatem. Quo pariatur asperiores eum amet.
            </p>
            <div className='space-y-4 divide-y divide-gray-100 dark:divide-gray-800'>
              <div className='mt-8 flex gap-4 md:items-center'>
                <div className='flex h-12 w-12 gap-4 rounded-full bg-indigo-100 dark:bg-indigo-900/20'>
                  <img src={noteLogo} alt='note logo' height='16.5px' width='20.5px' className='m-auto h-6 w-6 text-indigo-500 dark:text-indigo-400' />
                </div>
                <div className='w-5/6'>
                  <h4 className='text-lg font-semibold text-gray-700 dark:text-indigo-300'>Prend des notes</h4>
                  <p className='text-gray-500 dark:text-gray-400'>Asperiores nemo possimus nesciunt quam mollitia.</p>
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