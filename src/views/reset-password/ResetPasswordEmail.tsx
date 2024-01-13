import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { getAnalytics, logEvent } from 'firebase/analytics'
import React from 'react'
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

import Notification from '../../components/notification/Notification'
import Authentication from '../../components/view/Authentication'
import { useResetPasswordContext } from '../../hooks/api/accounts'
import { useForgetAccountPassword } from '../../hooks/api/password'
import { FormatMessage, useOurIntl } from '../../i18n/TextComponent'
import { TOGGLE_DEV_FEATURES } from '../../lib/env'
import { validateEmail } from '../../lib/validators'
import { V1ForgetAccountPasswordResponse }   from '../../protorepo/openapi/typescript-axios'


const ResetPasswordEmail: React.FC = () => {
  const analytics = getAnalytics()
  const { formatMessage } = useOurIntl()
  const navigate = useNavigate()
  const resetPasswordContext = useResetPasswordContext()
  const [email, setEmail] = React.useState('')
  const [emailValid, setEmailValid] = React.useState(false)
  const forgetAccountPasswordMutation = useForgetAccountPassword({
    onSuccess: (data: V1ForgetAccountPasswordResponse) => {
      resetPasswordContext.changeResetPassword({account_id: data.accountId, reset_token: null, auth_token: null})
      navigate('/reset_password_token', { state: { email }})
    },
    onError: (e) => {
      toast.error(e.response?.data.error as string)
    }
  })
  
  const formIsValid = () => {
    return emailValid
  }
  
  if (!TOGGLE_DEV_FEATURES) {
    logEvent(analytics, 'page_view', {
      page_title: 'resetPasswordEmail'
    })
  }
  return (
    <Authentication animName='error'>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          forgetAccountPasswordMutation.mutate({body: {email}})
        }}
      >
        <Stack direction='column' spacing={2}>
          <Typography variant='h4' align='center' fontWeight='bold'>
            <FormatMessage id='RESETPWD.Email.title' />
          </Typography>
          <div>
            <p className='text-lg leading-tight tracking-tight text-gray-900'>
              <FormatMessage id='RESETPWD.Email.desc1' />
            </p>
            <p className='text-sm leading-tight tracking-tight text-gray-500'>
              <FormatMessage id='RESETPWD.Email.desc2' />
            </p>
          </div>
          <TextField
            id='outlined-email-input'
            label={formatMessage({ id: 'RESETPWD.Email.form' })}
            type='email'
            value={email}
            onChange={(e) => {
              const val = e.target.value as string
              setEmail(val)
              setEmailValid(validateEmail(val) === undefined)}
            }
            onBlur={() => {
              setEmailValid(validateEmail(email) === undefined)
            }}
            error={!emailValid || email.length === 0}
            helperText={(!emailValid || email.length === 0) && formatMessage({ id: 'AUTH.error.email' })}
          />
          <Button
            type='submit'
            sx={{ borderRadius: '16px' }}
            size='large'
            variant='contained'
            className='w-full'
            disabled={!formIsValid() || forgetAccountPasswordMutation.isLoading}
          >
            <FormatMessage id='RESETPWD.Email.button' />
          </Button>
        </Stack>
      </form>
      <Notification />
    </Authentication>
  )
}

export default ResetPasswordEmail