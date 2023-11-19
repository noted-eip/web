import { VisibilityOffOutlined, VisibilityOutlined } from '@mui/icons-material'
import { FormControl, FormHelperText, IconButton,InputAdornment, InputLabel, OutlinedInput, TextField, Typography } from '@mui/material'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import { useGoogleLogin } from '@react-oauth/google'
import { getAnalytics, logEvent } from 'firebase/analytics'
import React from 'react'
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

import GoogleIcon from '../../components/icons/GoogleIcon'
import Notification from '../../components/notification/Notification'
import Authentication from '../../components/view/Authentication'
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
  const [email, setEmail] = React.useState('')
  const [emailValid, setEmailValid] = React.useState(false)
  const [password, setPassword] = React.useState('')
  const [passwordValid, setPasswordValid] = React.useState(false)
  const [showPassword, setShowPassword] = React.useState(false)
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
  
  const handleClickShowPassword = () => setShowPassword((show) => !show)

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
  }

  return (
    <Authentication animName='login'>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          createAccountMutation.mutate({body: {name, email, password}}, )
        }}
      >
        <Stack direction='column' spacing={2}>
          <Typography variant='h4' align='center' fontWeight='bold'>
            <FormatMessage id='SIGNUP.title' />
          </Typography>
          <TextField
            id='outlined-name-input'
            label={formatMessage({ id: 'GENERIC.name' })}
            type='name'
            value={name}
            onChange={(e) => {
              const val = e.target.value as string
              setName(val)
              setNameValid(validateName(val) === undefined)
            }}
            onBlur={() => {
              setNameValid(validateName(name) === undefined)
            }}
            error={!nameValid && name.length != 0}
            helperText={(!nameValid && name.length != 0) && 'name must be 4'}
          />
          <TextField
            id='outlined-email-input'
            label={formatMessage({ id: 'AUTH.email' })}
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
            error={!emailValid && email.length != 0}
            helperText={(!emailValid && email.length != 0) && formatMessage({ id: 'AUTH.error.email' })}
          />
          <FormControl
            variant='outlined'
            error={!passwordValid && password.length != 0}
          >
            <InputLabel htmlFor='outlined-adornment-password'>
              <FormatMessage id='AUTH.pwd' />
            </InputLabel>
            <OutlinedInput
              sx={{ borderRadius: '16px' }}
              id='outlined-adornment-password'
              type={showPassword ? 'text' : 'password'}
              value={password}
              endAdornment={
                <InputAdornment position='end'>
                  <IconButton
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge='end'
                  >
                    {showPassword ? <VisibilityOffOutlined /> : <VisibilityOutlined />}
                  </IconButton>
                </InputAdornment>
              }
              onChange={(e) => {
                const val = e.target.value as string
                setPassword(val)
                setPasswordValid(validatePassword(val) === undefined)
              }}
              onBlur={() => {
                setPasswordValid(validatePassword(password) === undefined)
              }}
            />
            <FormHelperText id='outlined-weight-helper-text'><FormatMessage id='AUTH.error.pwd' /></FormHelperText>
          </FormControl>
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
            type='submit'
            sx={{ borderRadius: '16px' }}
            size='large'
            variant='contained'
            className='w-full'
            disabled={!formIsValid() || authenticateMutation.isLoading || createAccountMutation.isLoading}
          >
            <FormatMessage id='AUTH.register' />
          </Button>
          <Button 
            sx={{ borderRadius: '16px' }}
            size='large'
            variant='outlined'
            className='w-full'
            onClick={() => googleLogin()}
            endIcon={<GoogleIcon />}
          >
            <FormatMessage id='SIGNUP.signupGoogle' />
          </Button>
        </Stack>
        <Notification />
      </form>
    </Authentication>        
  )
}

export default SignupView
