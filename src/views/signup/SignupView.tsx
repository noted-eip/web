import { AxiosResponse } from 'axios'
import React from 'react'
import { useMutation } from 'react-query'
import { useNavigate } from 'react-router-dom'
import OldInput from '../../components/form/OldInput'
import { addAccountToDevelopmentContext, useDevelopmentContext } from '../../contexts/dev'
import { useNoAuthContext } from '../../contexts/noauth'
import { createAccount } from '../../hooks/api/accounts'
import { authenticate } from '../../hooks/api/authenticate'
import { apiQueryClient, decodeToken } from '../../lib/api'
import { validateName, validateEmail, validatePassword } from '../../lib/validators'
import { AuthenticateResponse, CreateAccountResponse } from '../../types/api/accounts'

const SignupView: React.FC = () => {
  const navigate = useNavigate()
  const auth = useNoAuthContext()
  const [name, setName] = React.useState('')
  const [nameValid, setNameValid] = React.useState(false)
  const [password, setPassword] = React.useState('')
  const [passwordValid, setPasswordValid] = React.useState(false)
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

  const createAccountMutation = useMutation(createAccount, {
    onSuccess: (data: AxiosResponse<CreateAccountResponse, unknown>) => {
      apiQueryClient.invalidateQueries(['accounts', data.data.account.id])
      authenticateMutation.mutate({ email, password })
    },
  })

  const formIsValid = () => {
    return nameValid && passwordValid && emailValid
  }

  return (
    <div className='flex h-screen w-screen items-center justify-center'>
      <form
        className='grid grid-cols-1 gap-2'
        onSubmit={(e) => {
          e.preventDefault()
          createAccountMutation.mutate({ email, password, name })
        }}
      >
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
          className='mt-4 rounded bg-blue-600 py-2 text-white disabled:bg-gray-600'
          disabled={
            !formIsValid() ||
            authenticateMutation.isLoading ||
            createAccountMutation.isLoading
          }
        >
          Submit
        </button>
      </form>
    </div>
  )
}

export default SignupView
