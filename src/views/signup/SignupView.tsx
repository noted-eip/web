import { useGoogleLogin } from '@react-oauth/google'
import { getAnalytics, logEvent } from 'firebase/analytics'
import React from 'react'
import { useNavigate } from 'react-router-dom'

import ContainerMd from '../../components/container/ContainerMd'
import OldInput from '../../components/form/OldInput'
import { addAccountToDevelopmentContext, useDevelopmentContext } from '../../contexts/dev'
import { useNoAuthContext } from '../../contexts/noauth'
import { useAuthenticate, useAuthenticateGoogle, useCreateAccount } from '../../hooks/api/accounts'
import { decodeToken } from '../../lib/api'
import { validateEmail, validateName, validatePassword } from '../../lib/validators'
import { V1AuthenticateGoogleResponse, V1AuthenticateResponse } from '../../protorepo/openapi/typescript-axios'

const SignupView: React.FC = () => {
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
      logEvent(analytics, 'sign_up', {
        method: 'mail'
      })
      navigate('/')
    },
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
      logEvent(analytics, 'sign_up', {
        method: 'google'
      })
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
        className='grid basis-1/2 grid-cols-1 gap-2'
        onSubmit={(e) => {
          e.preventDefault()
          createAccountMutation.mutate({body: {name, email, password}}, )
        }}
      >
        <ContainerMd>
          <h2 className='mb-4 text-xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white md:text-2xl'>
              Create an account
          </h2>
          <OldInput
            label='Name'
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
            label='Email'
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
            label='Password'
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
          <button
            className='my-2 w-full rounded-lg bg-blue-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:bg-gray-600 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
            disabled={
              !formIsValid() ||
            authenticateMutation.isLoading ||
            createAccountMutation.isLoading
            }
          >
          Submit
          </button>
          <div style={{cursor: 'pointer'}} className='flex items-center justify-center rounded border border-gray-500 bg-white px-3 py-2 text-sm font-medium text-gray-800 dark:border-gray-500 dark:bg-gray-400'
            onClick={() => googleLogin()}>
            <p className='mr-2 dark:text-gray-400'>Sign up with Google</p>
            <svg
              className='h-5 w-5'
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              width='24'
              height='24'
            >
              <g transform='matrix(1, 0, 0, 1, 27.009001, -39.238998)'>
                <path
                  fill='#4285F4'
                  d='M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z'
                />
                <path
                  fill='#34A853'
                  d='M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z'
                />
                <path
                  fill='#FBBC05'
                  d='M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z'
                />
                <path
                  fill='#EA4335'
                  d='M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z'
                />
              </g>
            </svg>
          </div>
        </ContainerMd>
      </form>
    </div>
  )
}

export default SignupView
