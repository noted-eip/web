import React from 'react'


const ResetPasswordPassword: React.FC = () => {
  return (
    <section className='bg-gray-50 dark:bg-gray-900'>
      <div className='mx-auto flex flex-col items-center justify-center px-6 py-8 md:h-screen lg:py-0'>
        <div className='w-full rounded-lg bg-white p-6 shadow dark:border dark:border-gray-700 dark:bg-gray-800 sm:max-w-md sm:p-8 md:mt-0'>
          <h2 className='mb-1 text-xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white md:text-2xl'>
              Change Password
          </h2>
          <form className='mt-4 space-y-4 md:space-y-5 lg:mt-5' action='#'>
            <div>
              <label htmlFor='password' className='mb-2 block text-sm font-medium text-gray-900 dark:text-white'>New Password</label>
              <input type='password' name='password' id='password' placeholder='••••••••' className='block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-blue-600 focus:ring-blue-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 sm:text-sm' required={true} />
            </div>
            <div>
              <label htmlFor='confirm-password' className='mb-2 block text-sm font-medium text-gray-900 dark:text-white'>Confirm password</label>
              <input type='confirm-password' name='confirm-password' id='confirm-password' placeholder='••••••••' className='block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-blue-600 focus:ring-blue-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 sm:text-sm' required={true} />
            </div>
            <button type='submit' className='w-full rounded-lg bg-blue-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'>Reset password</button>
          </form>
        </div>
      </div>
    </section>
  )
}

export default ResetPasswordPassword