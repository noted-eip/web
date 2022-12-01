import { AxiosResponse } from 'axios'
import React from 'react'
import { useMutation } from 'react-query'
import { useNavigate } from 'react-router-dom'
import OldInput from '../../components/form/OldInput'
import { useNoAuthContext } from '../../contexts/noauth'
import { createAccount } from '../../hooks/api/accounts'
import { authenticate } from '../../hooks/api/authenticate'
import { apiQueryClient } from '../../lib/api'
import { validateName, validateEmail, validatePassword } from '../../lib/validators'
import { AuthenticateResponse, CreateAccountResponse } from '../../types/api'

const SignupView: React.FC = () => {
  const navigate = useNavigate()
  const auth = useNoAuthContext()
  const [name, setName] = React.useState('')
  const [nameValid, setNameValid] = React.useState(false)
  const [password, setPassword] = React.useState('')
  const [passwordValid, setPasswordValid] = React.useState(false)
  const [email, setEmail] = React.useState('')
  const [emailValid, setEmailValid] = React.useState(false)

  const authenticateMutation = useMutation(authenticate, {
    onSuccess: (data: AxiosResponse<AuthenticateResponse, unknown>) => {
      auth.signin(data.data.token)
      navigate('/')
    }
  })
  const createAccountMutation = useMutation(createAccount, { 
    onSuccess: (data: AxiosResponse<CreateAccountResponse, unknown>) => {
      apiQueryClient.invalidateQueries(['accounts', data.data.account.id])
      authenticateMutation.mutate({email, password})
    }
  })
  
  const formIsValid = () => { return nameValid && passwordValid && emailValid }

  return (
    <div className='w-screen h-screen flex justify-center items-center'>
      <form className='grid gap-2 grid-cols-1' onSubmit={(e) => {
        e.preventDefault()
        createAccountMutation.mutate({email, password, name})
      }}>
        <OldInput
          label='Name'
          value={name}
          onChange={(e) => {
            const val = e.target.value as string
            setName(val)
            setNameValid(validateName(val) === undefined)
          }}
          isInvalidBlur={!nameValid}
          errorMessage='Invalid name'/>
        <OldInput 
          label='Email'
          value={email}
          onChange={(e) => {
            const val = e.target.value as string
            setEmail(val)
            setEmailValid(validateEmail(val) === undefined)
          }}
          isInvalidBlur={!emailValid}
          errorMessage='Invalid email address' />
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
          isInvalidBlur={!passwordValid} />
        <button
          className='bg-blue-600 text-white rounded py-2 mt-4 transform disabled:bg-gray-600'
          disabled={!formIsValid() || authenticateMutation.isLoading || createAccountMutation.isLoading}>
            Submit
        </button>
      </form>
    </div>
  )
}

export default SignupView
