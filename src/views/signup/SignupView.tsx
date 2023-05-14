import React from 'react'
import { useNavigate } from 'react-router-dom'

import ContainerMd from '../../components/container/ContainerMd'
import OldInput from '../../components/form/OldInput'
import { addAccountToDevelopmentContext, useDevelopmentContext } from '../../contexts/dev'
import { useNoAuthContext } from '../../contexts/noauth'
import { useAuthenticate, useCreateAccount } from '../../hooks/api/accounts'
import { decodeToken } from '../../lib/api'
import { validateEmail, validateName, validatePassword } from '../../lib/validators'
import { V1AuthenticateResponse } from '../../protorepo/openapi/typescript-axios'

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
      navigate('/')
    },
  })
  const createAccountMutation = useCreateAccount({
    onSuccess: () => {
      authenticateMutation.mutate({body: {email, password}})
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
        </ContainerMd>
      </form>
    </div>
  )
}

export default SignupView
