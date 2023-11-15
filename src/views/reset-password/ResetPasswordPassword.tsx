import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import React from 'react'
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

import ContainerMd from '../../components/container/ContainerMd'
import OldInput from '../../components/form/OldInput'
import Notification from '../../components/notification/Notification'
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
    onError: (e) => {
      toast.error(e.response?.data.error as string)
    }
  })
  const formIsValid = () => {
    return password === confirmPassword && passwordValid
  }

  return (
    <div className='flex h-screen w-screen items-center justify-center'>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          updateAccountMutation.mutate({account_id: resetPasswordContext.account?.account_id as string, body: {password, token: resetPasswordContext.account?.reset_token as string}, header: resetPasswordContext.account?.auth_token as string})
        }}
      >
        <ContainerMd>
          <Stack direction='column' spacing={2}>
            <h2 className='text-xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white md:text-2xl'>
              <FormatMessage id='RESETPWD.Pwd.title' />
            </h2>
            {!isResetPasswordValid && 
            <div className='leading-tight tracking-tight dark:text-white'>
              <span className='text-red-500'>Account Error</span>
            </div>}
            <p 
              className='text-lg leading-tight tracking-tight text-gray-900'>
              <FormatMessage id='RESETPWD.Pwd.desc' />
            </p>
            <OldInput
              label={formatMessage({ id: 'AUTH.pwd' })}
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
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value)
              }}
              isInvalid={password !== confirmPassword && confirmPassword.length !== 0}
              errorMessage={'Not the same password'}
            />
            <Button
              variant='contained'
              className='w-full'
              disabled={!formIsValid() || updateAccountMutation.isLoading || !isResetPasswordValid}
            >
              <FormatMessage id='SIGNIN.resetPwd' />
            </Button>
          </Stack>
        </ContainerMd>
      </form>
      <Notification />
    </div>
  )
}

export default ResetPasswordPassword