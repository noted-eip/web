import React from 'react'
import { useNavigate } from 'react-router-dom'

import ContainerMd from '../../components/container/ContainerMd'
import OldInput from '../../components/form/OldInput'
import { useResetPasswordContext } from '../../hooks/api/accounts'
import { useUpdateAccountPassword } from '../../hooks/api/password'
import { FormatMessage, useOurIntl } from '../../i18n/TextComponent'
import { validatePassword } from '../../lib/validators'


const ResetPasswordPassword: React.FC = () => {
  const { formatMessage } = useOurIntl()
  const navigate = useNavigate()
  const resetPasswordContext = useResetPasswordContext()
  const [password, setPassword] = React.useState('')
  const [isResetPasswordValid, ] = React.useState(resetPasswordContext.account?.account_id !== null 
    || resetPasswordContext.account?.auth_token !== null || resetPasswordContext.account?.reset_token !== null)
  const [confirmPassword, setConfirmPassword] = React.useState('')
  const [passwordValid, setPasswordValid] = React.useState(false)
  const updateAccountMutation = useUpdateAccountPassword({
    onSuccess: () => {
      resetPasswordContext.changeResetPassword(null)
      navigate('/') 
    },
  })
  const formIsValid = () => {
    return password === confirmPassword && passwordValid
  }

  return (
    <div className='flex h-screen w-screen items-center justify-center'>
      <form className='grid basis-1/2 grid-cols-1 gap-2'
        onSubmit={(e) => {
          e.preventDefault()
          updateAccountMutation.mutate({account_id: resetPasswordContext.account?.account_id as string, body: {password, token: resetPasswordContext.account?.reset_token as string}, header: resetPasswordContext.account?.auth_token as string})
        }}
      >
        <ContainerMd>
          <h2 className='mb-1 text-xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white md:text-2xl'>
            <FormatMessage id='RESETPWD.Pwd.title' />
          </h2>
          {!isResetPasswordValid ? <div className='mb-4 leading-tight tracking-tight dark:text-white'>
            <span className='text-red-500'>Account Error</span>
          </div> : null}
          <p 
            className='mb-4 text-lg leading-tight tracking-tight text-gray-900'>
            <FormatMessage id='RESETPWD.Pwd.desc' />
          </p>
          <OldInput
            label={formatMessage({ id: 'AUTH.pwd' })}
            type='password'
            tooltip='6 characters, letters numbers and symbols'
            value={password}
            onChange={(e) => {
              const val = e.target.value as string
              setPassword(val)
              setPasswordValid(validatePassword(val) === undefined)
            }}
            isInvalidBlur={!passwordValid}
          />
          <OldInput
            label={formatMessage({ id: 'RESETPWD.Pwd.form' })}
            type='password'
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value)
            }}
            isInvalid={password !== confirmPassword && confirmPassword.length !== 0}
            errorMessage={'Not the same password'}
          />
          <button type='submit' className='mt-2 w-full rounded-lg bg-blue-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:bg-gray-600 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
            disabled={!formIsValid() || updateAccountMutation.isLoading || !isResetPasswordValid}
          >
            <FormatMessage id='SIGNIN.resetPwd' />
          </button>
        </ContainerMd>
      </form>
    </div>
  )
}

export default ResetPasswordPassword