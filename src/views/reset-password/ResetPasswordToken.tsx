import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import React from 'react'
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

import ContainerMd from '../../components/container/ContainerMd'
import OldInput from '../../components/form/OldInput'
import Notification from '../../components/notification/Notification'
import { useResetPasswordContext } from '../../hooks/api/accounts'
import { useForgetAccountPasswordValidateToken } from '../../hooks/api/password'
import { FormatMessage, useOurIntl } from '../../i18n/TextComponent'
import { V1ForgetAccountPasswordValidateTokenResponse } from '../../protorepo/openapi/typescript-axios'

const ResetPasswordEmail: React.FC = () => {
  const { formatMessage } = useOurIntl()
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
    onError: (e) => {
      setIsTokenValid(false)
      toast.error(e.response?.data.error as string)
    },
  })
  const formIsValid = () => {
    return token.length !== 0
  }

  return (
    <div className='flex h-screen w-screen items-center justify-center'>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          forgetAccountPasswordValidateTokenMutation.mutate({body: {accountId: resetPasswordContext.account?.account_id as string, token}})
        }}
      >
        <ContainerMd>
          <Stack direction='column' spacing={2}>
            <h2 className='text-xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white md:text-2xl'>
              <FormatMessage id='RESETPWD.Token.title' />
            </h2>
            {!isAccountIdValid && <div className='leading-tight tracking-tight'>
              <span className='text-red-500'>Account Error</span>
            </div>}
            {!isTokenValid && <div className='leading-tight tracking-tight'>
              <span className='text-red-500'>Invalid token</span>
            </div>}
            <p 
              className='text-lg leading-tight tracking-tight text-gray-900'>
              <FormatMessage id='RESETPWD.Token.desc' />
            </p>
            <OldInput
              label={formatMessage({ id: 'RESETPWD.Token.form' })}
              value={token}
              onChange={(e) => {
                setToken(e.target.value as string)
              }}
              errorMessage='Invalid token address'
            />
            <Button
              variant='contained'
              className='w-full'
              disabled={!formIsValid() || forgetAccountPasswordValidateTokenMutation.isLoading || !isAccountIdValid}
            >
              <FormatMessage id='RESETPWD.Token.button' />
            </Button>
          </Stack>
        </ContainerMd>
      </form>
      <Notification />
    </div>
  )
}

export default ResetPasswordEmail
