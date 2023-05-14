import React from 'react'
import { useNavigate } from 'react-router-dom'

import ContainerMd from '../../components/container/ContainerMd'
import OldInput from '../../components/form/OldInput'
import { useResetPasswordContext } from '../../hooks/api/accounts'
import { useForgetAccountPasswordValidateToken } from '../../hooks/api/password'
import { V1ForgetAccountPasswordValidateTokenResponse } from '../../protorepo/openapi/typescript-axios'


const ResetPasswordEmail: React.FC = () => {
  const navigate = useNavigate()
  const resetPasswordContext = useResetPasswordContext()
  const [token, setToken] = React.useState('')
  const [isTokenValid, setIsTokenValid] = React.useState(true)
  const [isAccountIdValid, ] = React.useState(resetPasswordContext.account?.account_id !== null)
  const forgetAccountPasswordValidateTokenMutation = useForgetAccountPasswordValidateToken({
    onSuccess: (data: V1ForgetAccountPasswordValidateTokenResponse) => {
      resetPasswordContext.changeResetPassword({account_id: data.account.id, reset_token: data.resetToken, auth_token: data.authToken})
      navigate('/reset_password_password') 
    },
    onError: () => {
      setIsTokenValid(false)
    },
  })
  const formIsValid = () => {
    return token.length !== 0
  }

  return (
    <form
      className='grid grid-cols-1 gap-2'
      onSubmit={(e) => {
        e.preventDefault()
        forgetAccountPasswordValidateTokenMutation.mutate({body: {accountId: resetPasswordContext.account?.account_id as string, token}})
      }}
    >
      <ContainerMd>
        <h2 className='mb-4 text-xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white md:text-2xl'>
              Verification
        </h2>
        {!isAccountIdValid ? <div className='mb-4 leading-tight tracking-tight'>
          <span className='text-red-500'>Account Error</span>
        </div> : null}
        {!isTokenValid ? <div className='mb-4 leading-tight tracking-tight'>
          <span className='text-red-500'>Invalid token</span>
        </div> : null}
        <p 
          className='mb-4 text-lg leading-tight tracking-tight text-gray-900'>
              Enter the verification code we just sent you on your email address
        </p>
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
          disabled={!formIsValid() || forgetAccountPasswordValidateTokenMutation.isLoading || !isAccountIdValid}
        >
              Send token
        </button>
      </ContainerMd>
    </form>
      
  )
}

export default ResetPasswordEmail