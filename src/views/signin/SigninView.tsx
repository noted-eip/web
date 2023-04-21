import { AxiosResponse } from 'axios'
import React from 'react'
import { useMutation } from 'react-query'
import { Link, useNavigate } from 'react-router-dom'
import OldInput from '../../components/form/OldInput'
import { addAccountToDevelopmentContext, useDevelopmentContext } from '../../contexts/dev'
import { useNoAuthContext } from '../../contexts/noauth'
import { authenticate } from '../../hooks/api/authenticate'
import { decodeToken } from '../../lib/api'
import { validateEmail } from '../../lib/validators'
import { AuthenticateResponse } from '../../types/api/accounts'
import GoogleButton from '../../components/view/landing/GoogleButton'

const SigninView: React.FC = () => {
  const navigate = useNavigate()
  const auth = useNoAuthContext()
  const [password, setPassword] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [emailValid, setEmailValid] = React.useState(false)
  const developmentContext = useDevelopmentContext()

  const authenticateMutation = useMutation(authenticate, {
    onSuccess: (data: AxiosResponse<AuthenticateResponse, unknown>) => {
      const tokenData = decodeToken(data.data.token)
      if (developmentContext !== undefined) {
        addAccountToDevelopmentContext(
          tokenData.uid,
          data.data.token,
          developmentContext.setAccounts
        )
      }
      auth.signin(data.data.token)
      navigate('/')
    },
  })

  const formIsValid = () => {
    return emailValid
  }

  return (
    <div className='flex h-screen w-screen items-center justify-center'>
      <form
        className='grid grid-cols-1 gap-2'
        onSubmit={(e) => {
          e.preventDefault()
          authenticateMutation.mutate({ email, password })
        }}
      >
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
          value={password}
          onChange={(e) => {
            setPassword(e.target.value)
          }}
        />
        <button
          className='mt-4 rounded bg-blue-600 py-2 text-white disabled:bg-gray-600'
          disabled={!formIsValid() || authenticateMutation.isLoading}
        >
          Submit
        </button>
        <GoogleButton />
        <Link to='/reset_password_email' className='text-sm text-blue-500 underline'> Reset password </Link>
      </form>
    </div>
  )
}

export default SigninView
