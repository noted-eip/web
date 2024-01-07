import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import React from 'react'
import { useNavigate } from 'react-router-dom'

import Notification from '../../components/notification/Notification'
import Authentication from '../../components/view/Authentication'
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
  
  // Hook for receiving a reset password token with email
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
    <Authentication animName='error'>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          forgetAccountPasswordValidateTokenMutation.mutate({body: {accountId: resetPasswordContext.account?.account_id as string, token}})
        }}
      >
        <Stack direction='column' spacing={2}>
          {/* HEADER */}
          <Typography variant='h4' align='center' fontWeight='bold'>
            <FormatMessage id='RESETPWD.Token.title' />
          </Typography>
          {!isAccountIdValid && <div className='leading-tight tracking-tight'>
            <span className='text-red-500'>Account Error</span>
          </div>}
          <p className='text-lg leading-tight tracking-tight text-gray-900'>
            <FormatMessage id='RESETPWD.Token.desc' />
          </p>
          {/* BODY */}
          {/* token form */}
          <TextField
            id='outlined-token-input'
            label={formatMessage({ id: 'RESETPWD.Token.form' })}
            type='token'
            value={token}
            onChange={(e) => {
              setToken(e.target.value as string)
            }}
            error={!isTokenValid && token.length != 0}
            helperText={(!isTokenValid && token.length != 0) && 'Invalid token address'}
          />
          {/* FOOTER */}
          <Button
            type='submit'
            sx={{ borderRadius: '16px' }}
            size='large'
            variant='contained'
            className='w-full'
            disabled={!formIsValid() || forgetAccountPasswordValidateTokenMutation.isLoading || !isAccountIdValid}
          >
            <FormatMessage id='RESETPWD.Token.button' />
          </Button>
        </Stack>
      </form>
      <Notification />
    </Authentication>
  )
}

export default ResetPasswordEmail
