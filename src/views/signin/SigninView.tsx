import { AxiosResponse } from 'axios'
import React from 'react'
import { useMutation } from 'react-query'
import { useNavigate } from 'react-router-dom'
import OldInput from '../../components/form/OldInput'
import { useNoAuthContext } from '../../contexts/noauth'
import { authenticate } from '../../hooks/api/authenticate'
import { validateEmail } from '../../lib/validators'
import { AuthenticateResponse } from '../../types/api/accounts'

const SigninView: React.FC = () => {
  const navigate = useNavigate()
  const auth = useNoAuthContext()
  const [password, setPassword] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [emailValid, setEmailValid] = React.useState(false)

  const authenticateMutation = useMutation(authenticate, {
    onSuccess: (data: AxiosResponse<AuthenticateResponse, unknown>) => {
      auth.signin(data.data.token)
      navigate('/')
    }
  })
  
  const formIsValid = () => { return emailValid }

  return (
    <div className='w-screen h-screen flex justify-center items-center'>
      <form className='grid gap-2 grid-cols-1' onSubmit={(e) => {
        e.preventDefault()
        authenticateMutation.mutate({email, password})
      }}>
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
          value={password}
          onChange={(e) => { setPassword(e.target.value) }} />
        <button
          className='bg-blue-600 text-white rounded py-2 mt-4 transform disabled:bg-gray-600'
          disabled={!formIsValid() || authenticateMutation.isLoading}>
            Submit
        </button>
      </form>
    </div>
  )
}

export default SigninView
