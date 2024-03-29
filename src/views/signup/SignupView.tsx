import { VisibilityOffOutlined, VisibilityOutlined } from '@mui/icons-material'
import { FormControl, FormHelperText, IconButton,InputAdornment, InputLabel, OutlinedInput, TextField, Typography } from '@mui/material'
import { FormControlLabel } from '@mui/material'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import Stack from '@mui/material/Stack'
import { useGoogleLogin } from '@react-oauth/google'
import { getAnalytics, logEvent } from 'firebase/analytics'
import React from 'react'
import { toast } from 'react-hot-toast'
import { Link, useNavigate } from 'react-router-dom'

import GoogleIcon from '../../components/icons/GoogleIcon'
import Modals from '../../components/modals/Modal'
import Notification from '../../components/notification/Notification'
import Authentication from '../../components/view/Authentication'
import { addAccountToDevelopmentContext, useDevelopmentContext } from '../../contexts/dev'
import { useNoAuthContext } from '../../contexts/noauth'
import { useAuthenticate, useAuthenticateGoogle, useCreateAccount } from '../../hooks/api/accounts'
import { useModal } from '../../hooks/modals'
import { FormatMessage, useOurIntl } from '../../i18n/TextComponent'
import { beautifyError, decodeToken } from '../../lib/api'
import { TOGGLE_DEV_FEATURES } from '../../lib/env'
import { validateEmail, validateName, validatePassword } from '../../lib/validators'
import { V1AuthenticateGoogleResponse, V1AuthenticateResponse, V1CreateAccountResponse } from '../../protorepo/openapi/typescript-axios'

const SignupView: React.FC = () => {

  const { formatMessage } = useOurIntl()
  const analytics = getAnalytics()
  const navigate = useNavigate()
  const auth = useNoAuthContext()
  const {isShown, toggle} = useModal()
  const [name, setName] = React.useState('')
  const [nameValid, setNameValid] = React.useState(false)
  const [password, setPassword] = React.useState('')
  const [passwordValid, setPasswordValid] = React.useState(false)
  // const [cguAccept] = React.useState(false)
  const [email, setEmail] = React.useState('')
  const [emailValid, setEmailValid] = React.useState(false)
  const [cguIsChecked, setCguIsChecked] = React.useState(false)
  const [showPassword, setShowPassword] =  React.useState(false)
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
    },
    onError: (e) => {
      toast.error(beautifyError(e.response?.data.error, 'creation', formatMessage))
    }
  })
  const createAccountMutation = useCreateAccount({
    onSuccess: (data: V1CreateAccountResponse) => {
      navigate('/va lidate_account', {state: {email: data.account.email, password: password}})
    },
    onError: (e) => {
      toast.error(beautifyError(e.response?.data.error, 'creation', formatMessage))
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
        logEvent(analytics, 'sign_up', {
          method: 'google'
        })
      }
      navigate('/')
    },
    onError: (e) => {
      toast.error(beautifyError(e.response?.data.error, 'creation', formatMessage))
    }
  })
  const googleLogin = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      authenticateGoogleMutation.mutate({body: {clientAccessToken: tokenResponse.access_token}})
    }
  })

  const formIsValid = () => {
    return nameValid && passwordValid && emailValid && cguIsChecked
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
              label={formatMessage({ id: 'AUTH.pwd' })}
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
          <FormControlLabel
            control={
              <Checkbox
                onChange={() => setCguIsChecked((prev) => !prev)}
                checked={cguIsChecked}
                className='h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600'
              />
            }
            label={
              <span className='ml-4 text-sm font-medium text-gray-500'>
          I agree with the
                <Button
                  onClick={toggle}
                  type='button'
                  className='text-blue-600 hover:underline dark:text-blue-500'
                >
            terms and conditions
                </Button>
          .
              </span>
            }
          />
          <Modals headerText='Terms of Service' isShown={isShown} hide={toggle}/>
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
          <Link
            to='/signin'>
            <Typography variant='body1' color='primary' sx={{ textDecoration: 'underline' }}>
              <FormatMessage id='SIGNUP.wantSignIn' />
            </Typography>
          </Link>
        </Stack>
        <Notification />
      </form>
    </Authentication>        
  )
}

export default SignupView
