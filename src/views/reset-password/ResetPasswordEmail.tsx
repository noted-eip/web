import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import { getAnalytics, logEvent } from 'firebase/analytics'
import React from 'react'
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

import ContainerMd from '../../components/container/ContainerMd'
import OldInput from '../../components/form/OldInput'
import Notification from '../../components/notification/Notification'
import { useResetPasswordContext } from '../../hooks/api/accounts'
import { useForgetAccountPassword } from '../../hooks/api/password'
import { FormatMessage, useOurIntl } from '../../i18n/TextComponent'
import { TOGGLE_DEV_FEATURES } from '../../lib/env'
import { validateEmail } from '../../lib/validators'
import { V1ForgetAccountPasswordResponse }   from '../../protorepo/openapi/typescript-axios'


const ResetPasswordEmail: React.FC = () => {
  const { formatMessage } = useOurIntl()
  const navigate = useNavigate()
  const resetPasswordContext = useResetPasswordContext()
  const [email, setEmail] = React.useState('')
  const [emailValid, setEmailValid] = React.useState(false)
  const forgetAccountPasswordMutation = useForgetAccountPassword({
    onSuccess: (data: V1ForgetAccountPasswordResponse) => {
      resetPasswordContext.changeResetPassword({account_id: data.accountId, reset_token: null, auth_token: null})
      navigate('/reset_password_token')
    },
    onError: (e) => {
      toast.error(e.response?.data.error as string)
    }
  })
  
  const formIsValid = () => {
    return emailValid
  }

  const analytics = getAnalytics()
  
  if (!TOGGLE_DEV_FEATURES) {
    logEvent(analytics, 'page_view', {
      page_title: 'resetPasswordEmail'
    })
  }
  return (
    <div className='flex h-screen w-screen items-center justify-center'>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          forgetAccountPasswordMutation.mutate({body: {email}})
        }}
      >
        <ContainerMd>
          <Stack direction='column' spacing={2}>
            <h2 className='text-xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white md:text-2xl'>
              <FormatMessage id='RESETPWD.Email.title' />
            </h2>
            <div>
              <p 
                className='text-lg leading-tight tracking-tight text-gray-900'>
                <FormatMessage id='RESETPWD.Email.desc1' />
              </p>
              <p 
                className='text-sm leading-tight tracking-tight text-gray-500'>
                <FormatMessage id='RESETPWD.Email.desc2' />
              </p>
            </div>
            <OldInput
              label={formatMessage({ id: 'RESETPWD.Email.form' })}
              value={email}
              onChange={(e) => {
                const val = e.target.value as string
                setEmail(val)
                setEmailValid(validateEmail(val) === undefined)
              }}
              isInvalidBlur={!emailValid}
              errorMessage='Invalid email address'
            />
            <Button
              variant='contained'
              className='w-full'
              disabled={!formIsValid() || forgetAccountPasswordMutation.isLoading}
            >
              <FormatMessage id='RESETPWD.Email.button' />
            </Button>
          </Stack>
        </ContainerMd>
      </form>
      <Notification />
    </div>
  )
}

export default ResetPasswordEmail