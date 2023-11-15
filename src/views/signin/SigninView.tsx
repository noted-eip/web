import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import { useGoogleLogin } from '@react-oauth/google'
import { getAnalytics, logEvent } from 'firebase/analytics'
import React from 'react'
import { toast } from 'react-hot-toast'
import { Link, useNavigate } from 'react-router-dom'

import ContainerMd from '../../components/container/ContainerMd'
import OldInput from '../../components/form/OldInput'
import GoogleIcon from '../../components/icons/GoogleIcon'
import Notification from '../../components/notification/Notification'
import { addAccountToDevelopmentContext, useDevelopmentContext } from '../../contexts/dev'
import { useNoAuthContext } from '../../contexts/noauth'
import { useAuthenticate, useAuthenticateGoogle } from '../../hooks/api/accounts'
import { FormatMessage, useOurIntl } from '../../i18n/TextComponent'
import { decodeToken } from '../../lib/api'
import { TOGGLE_DEV_FEATURES } from '../../lib/env'
import { validateEmail } from '../../lib/validators'
import { V1AuthenticateGoogleResponse, V1AuthenticateResponse } from '../../protorepo/openapi/typescript-axios'

const SigninView: React.FC = () => {
  const { formatMessage } = useOurIntl()
  const analytics = getAnalytics()
  const navigate = useNavigate()
  const auth = useNoAuthContext()
  const [password, setPassword] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [emailValid, setEmailValid] = React.useState(false)
  const developmentContext = useDevelopmentContext()
  const authenticateMutation = useAuthenticate({
    onSuccess: (data: V1AuthenticateResponse) => {
      const tokenData = decodeToken(data.token)
      if (developmentContext !== undefined) {
        addAccountToDevelopmentContext(
          tokenData.aid,
          data.token,
          developmentContext.setAccounts
        )
      }
      auth.signin(data.token)
      if (!TOGGLE_DEV_FEATURES) {
        logEvent(analytics, 'login', {
          method: 'mail'
        })
      }
      navigate('/')
    },
    onError: (e) => {
      toast.error(e.response?.data.error as string)
    }
  })
  const authenticateGoogleMutation = useAuthenticateGoogle({
    onSuccess: (data: V1AuthenticateGoogleResponse) => {
      const tokenData = decodeToken(data.token)
      if (developmentContext !== undefined) {
        addAccountToDevelopmentContext(
          tokenData.aid,
          data.token,
          developmentContext.setAccounts
        )
      }
      auth.signin(data.token)
      if (!TOGGLE_DEV_FEATURES) {
        logEvent(analytics, 'login', {
          method: 'google'
        })
      }      
      navigate('/')
    },
  })
  const googleLogin = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      authenticateGoogleMutation.mutate({body: {clientAccessToken: tokenResponse.access_token}})
    }
  })

  const formIsValid = () => {
    return emailValid
  }

  return (
    <div className='flex h-screen w-screen items-center justify-center'>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          authenticateMutation.mutate({body: {email, password}})
        }}
      >
        <ContainerMd>
          <Stack direction='column' spacing={2}>
            <h2 className='mb-4 text-xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white md:text-2xl'>
              <FormatMessage id='SIGNIN.title' />
            </h2>
            <OldInput
              label={formatMessage({ id: 'AUTH.email' })}
              value={email}
              onChange={(e) => {
                const val = e.target.value as string
                setEmail(val)
                setEmailValid(validateEmail(val) === undefined)
              }}
              isInvalidBlur={!emailValid}
              errorMessage='Invalid email address'
            />
            <OldInput
              label={formatMessage({ id: 'AUTH.pwd' })}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
              }}
            />
            <Button
              variant='contained'
              className='w-full'
              disabled={!formIsValid() || authenticateMutation.isLoading}
            >
              <FormatMessage id='AUTH.login' />
            </Button>
            <Button 
              variant='outlined'
              className='w-full'
              onClick={() => googleLogin()}
              endIcon={<GoogleIcon />}
            >
              <FormatMessage id='SIGNIN.signinGoogle' />
            </Button>
            <Link to='/reset_password_email' className='mt-2 text-sm text-blue-500 underline'>
              <FormatMessage id='SIGNIN.resetPwd' />
            </Link>
          </Stack>
        </ContainerMd>
      </form>
      <Notification />
    </div>
  )
}

export default SigninView
