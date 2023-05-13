import { format } from 'path'
import React from 'react'

import OldInput from '../../components/form/OldInput'
import { useForgetAccountPassword } from '../../hooks/api/password'
import { validateEmail } from '../../lib/validators'
import { V1ForgetAccountPasswordResponse } from '../../protorepo/openapi/typescript-axios'


const ResetPasswordEmail: React.FC = () => {
  const [email, setEmail] = React.useState('')
  const [emailValid, setEmailValid] = React.useState(false)


  const forgetPasswordMutation = useForgetAccountPassword({
    onSuccess: (data: V1ForgetAccountPasswordResponse) => {
      console.log('email send !')
      console.log(data)
    },
  })
  const formIsValid = () => {
    return emailValid
  }

  return (
    <div className='flex h-screen w-screen items-center justify-center'>
      <form
        className='grid grid-cols-1 gap-2'
        onSubmit={(e) => {
          e.preventDefault()
          // authenticateMutation.mutate({body: {email, password}})
        }}
      >
        {/* <section className='bg-gray-50 dark:bg-gray-900'>
        <div className='mx-auto flex flex-col items-center justify-center px-6 py-8 md:h-screen lg:py-0'>
          <div className='w-full rounded-lg bg-white p-6 shadow dark:border dark:border-gray-700 dark:bg-gray-800 sm:max-w-md sm:p-8 md:mt-0'> */}
        <h2 className='mb-4 text-xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white md:text-2xl'>
              Change Password
        </h2>
        {/* <div>
              <label htmlFor='email' className='mb-2 block text-sm font-medium text-gray-900 dark:text-white'>Your email</label>
              <input type='email' name='email' id='email' className='block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-blue-600 focus:ring-blue-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 sm:text-sm' placeholder='name@company.com' required={true} />
            </div> */}
        <OldInput
          label='Your email'
          value={email}
          onChange={(e) => {
            const val = e.target.value as string
            setEmail(val)
            setEmailValid(validateEmail(val) === undefined)
          }}
          isInvalidBlur={!emailValid}
          errorMessage='Invalid email address'
        />
        <button
          className='mt-4 rounded bg-blue-600 py-2 text-white disabled:bg-gray-600'
          disabled={!formIsValid() || forgetPasswordMutation.isLoading}
        >
          Submit
        </button>
        {/*    <button type='submit' className='w-full rounded-lg bg-blue-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'>Send email to reset password</button>
          </div>
         </div>
      </section> */}
      </form>
    </div>
  )
}

export default ResetPasswordEmail