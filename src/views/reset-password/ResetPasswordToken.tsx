import React from 'react'
import { useNavigate } from 'react-router-dom'

import OldInput from '../../components/form/OldInput'
import { useResetPasswordContext } from '../../hooks/api/accounts'
import { useForgetAccountPasswordValidateToken } from '../../hooks/api/password'
import { V1ForgetAccountPasswordValidateTokenResponse } from '../../protorepo/openapi/typescript-axios'


const ResetPasswordEmail: React.FC = () => {
  const navigate = useNavigate()
  const resetPasswordContext = useResetPasswordContext()
  const [token, setToken] = React.useState('')
  const forgetAccountPasswordValidateTokenMutation = useForgetAccountPasswordValidateToken({
    onSuccess: (data: V1ForgetAccountPasswordValidateTokenResponse) => {
      console.log(data)
      // Must check if the token is validate or not
      resetPasswordContext.changeResetToken(data.resetToken)
      resetPasswordContext.changeAuthToken(data.authToken)
      navigate('/reset_password_password') 
    },
  })

  return (
    <form
      className='grid grid-cols-1 gap-2'
      onSubmit={(e) => {
        e.preventDefault()
        if (resetPasswordContext.account_id === null)
          throw new Error('No data in resetPasswordContext')
        forgetAccountPasswordValidateTokenMutation.mutate({body: {accountId: resetPasswordContext.account_id as string, token}})
      }}
    >
      <section className='bg-gray-50 dark:bg-gray-900'>
        <div className='mx-auto flex flex-col items-center justify-center px-6 py-8 md:h-screen lg:py-0'>
          <div className='w-full rounded-lg bg-white p-6 shadow dark:border dark:border-gray-700 dark:bg-gray-800 sm:max-w-md sm:p-8 md:mt-0'>
            <h2 className='mb-4 text-xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white md:text-2xl'>
              Change password
            </h2>
            <OldInput
              label='Your token'
              value={token}
              onChange={(e) => {
                const val = e.target.value as string
                setToken(val)
              }}
              errorMessage='Invalid token address'
            />
            <button type='submit' className='mt-2 w-full rounded-lg bg-blue-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:bg-gray-600 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
              disabled={forgetAccountPasswordValidateTokenMutation.isLoading}
            >
              Send token
            </button>
          </div>
        </div>
      </section>
    </form>
      
  )
}

export default ResetPasswordEmail