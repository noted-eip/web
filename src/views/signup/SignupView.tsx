import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import { useGoogleLogin } from '@react-oauth/google'
import { getAnalytics, logEvent } from 'firebase/analytics'
import React from 'react'
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

import ContainerMd from '../../components/container/ContainerMd'
import OldInput from '../../components/form/OldInput'
import GoogleIcon from '../../components/icons/GoogleIcon'
import Notification from '../../components/notification/Notification'
import { addAccountToDevelopmentContext, useDevelopmentContext } from '../../contexts/dev'
import { useNoAuthContext } from '../../contexts/noauth'
import { useAuthenticate, useAuthenticateGoogle, useCreateAccount } from '../../hooks/api/accounts'
import { FormatMessage, useOurIntl } from '../../i18n/TextComponent'
import { decodeToken } from '../../lib/api'
import { TOGGLE_DEV_FEATURES } from '../../lib/env'
import { validateEmail, validateName, validatePassword } from '../../lib/validators'
import { V1AuthenticateGoogleResponse, V1AuthenticateResponse } from '../../protorepo/openapi/typescript-axios'

const SignupView: React.FC = () => {
  const { formatMessage } = useOurIntl()
  const analytics = getAnalytics()
  const navigate = useNavigate()
  const auth = useNoAuthContext()
  const [name, setName] = React.useState('')
  const [nameValid, setNameValid] = React.useState(false)
  const [password, setPassword] = React.useState('')
  const [passwordValid, setPasswordValid] = React.useState(false)
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
        logEvent(analytics, 'sign_up', {
          method: 'mail'
        })
      }
      navigate('/')
    },
    onError: (e) => {
      toast.error(e.response?.data.error as string)
    }
  })
  const createAccountMutation = useCreateAccount({
    onSuccess: () => {
      authenticateMutation.mutate({body: {email, password}})
    },
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
        logEvent(analytics, 'sign_up', {
          method: 'google'
        })
      }
      navigate('/')
    },
  })
  const googleLogin = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      authenticateGoogleMutation.mutate({body: {clientAccessToken: tokenResponse.access_token}})
    },
  })

  const formIsValid = () => {
    return nameValid && passwordValid && emailValid
  }

  return (
    <div className='flex h-screen w-screen items-center justify-center'>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          createAccountMutation.mutate({body: {name, email, password}}, )
        }}
      >
        <ContainerMd>
          <h2 className='mb-4 text-xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white md:text-2xl'>
            <FormatMessage id='SIGNUP.title' />
          </h2>
          <Stack direction='column' spacing={2}>
            <OldInput
              label={formatMessage({ id: 'GENERIC.name' })}
              value={name}
              onChange={(e) => {
                const val = e.target.value as string
                setName(val)
                setNameValid(validateName(val) === undefined)
              }}
              isInvalidBlur={!nameValid}
              errorMessage='Invalid name'
            />
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
              tooltip='6 characters, letters numbers and symbols'
              value={password}
              onChange={(e) => {
                const val = e.target.value as string
                setPassword(val)
                setPasswordValid(validatePassword(val) === undefined)
              }}
              isInvalidBlur={!passwordValid}
            />
            
            <div className='relative my-5 mx-10'>
              <p className='text-sm italic text-gray-500'>
              Once registered, you can ask an early access to our mobile&apos;s
              app through your account&apos;s settings !
              </p>
              <p className='text-xs italic text-gray-400'>
              Only works for emails linked to a Google account.
              </p>
              <span className='absolute right-auto top-0 -left-2 -translate-y-1/2 -translate-x-1/2 -rotate-12 rounded-full bg-red-400 p-0.5 px-2 text-center text-xs font-medium leading-none text-white outline outline-red-100 dark:bg-blue-900 dark:text-blue-200'>
              BETA
              </span>
            </div>
            <Button
              variant='contained'
              className='w-full'
              disabled={
                !formIsValid() ||
                authenticateMutation.isLoading ||
                createAccountMutation.isLoading    
              }
            >
              <FormatMessage id='AUTH.register' />
            </Button>
            <Button 
              variant='outlined'
              className='w-full'
              onClick={() => googleLogin()}
              endIcon={<GoogleIcon />}
            >
              <FormatMessage id='SIGNUP.signupGoogle' />
            </Button>
          </Stack>
        </ContainerMd>
      </form>
      <Notification />
    </div>
  )
}

export default SignupView
