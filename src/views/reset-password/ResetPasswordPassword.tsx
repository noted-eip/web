import React from 'react'
import { useNavigate } from 'react-router-dom'

import OldInput from '../../components/form/OldInput'
import { useResetPasswordContext } from '../../hooks/api/accounts'
import { useUpdateAccountPassword } from '../../hooks/api/password'
import { V1UpdateAccountPasswordResponse } from '../../protorepo/openapi/typescript-axios'


const ResetPasswordPassword: React.FC = () => {
  const navigate = useNavigate()
  const [password, setPassword] = React.useState('')
  const [confirmPassword, setConfirmPassword] = React.useState('')
  const resetPasswordContext = useResetPasswordContext()
  // const [emailValid, setEmailValid] = React.useState(false)
  const updateAccountMutation = useUpdateAccountPassword({
    onSuccess: (data: V1UpdateAccountPasswordResponse) => {
      console.log(data)
      navigate('/') 
    },
  })
  const formIsValid = () => {
    return password !== confirmPassword && confirmPassword !== ''
  }


  return (
    <section className='bg-gray-50 dark:bg-gray-900'>
      <div className='mx-auto flex flex-col items-center justify-center px-6 py-8 md:h-screen lg:py-0'>
        <div className='w-full rounded-lg bg-white p-6 shadow dark:border dark:border-gray-700 dark:bg-gray-800 sm:max-w-md sm:p-8 md:mt-0'>
          <h2 className='mb-1 text-xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white md:text-2xl'>
              Change Password
          </h2>
          <form className='mt-4 space-y-4 md:space-y-5 lg:mt-5'
            onSubmit={(e) => {
              e.preventDefault()
              if (password !== confirmPassword)
                return
              if (resetPasswordContext.account_id === null)
                throw new Error('No data in resetPasswordContext')
              if (resetPasswordContext.reset_token === null)
                throw new Error('No data in resetPasswordContext')
              updateAccountMutation.mutate({account_id: resetPasswordContext.account_id as string, body: {password, token: resetPasswordContext.reset_token as string}})
            }}
          >
            <OldInput
              label='Password'
              type='password'
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
              }}
            />
            <OldInput
              label='Confirm Password'
              type='password'
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value)
              }}
              isInvalid={formIsValid()}
              errorMessage={'Not the same password'}
            />
            <button type='submit' className='mt-2 w-full rounded-lg bg-blue-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:bg-gray-600 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
              disabled={formIsValid() || updateAccountMutation.isLoading}
            >
              Reset password
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}

export default ResetPasswordPassword