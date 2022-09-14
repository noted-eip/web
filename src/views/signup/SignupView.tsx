import React from 'react'
import Input from '../../components/form/Input'
import { useCreateAccount } from '../../hooks/api/accounts'
import { validateName, validateEmail, validatePassword } from '../../lib/validators'

const SignupView: React.FC = () => {
  const createAccountMutation = useCreateAccount()
  const [name, setName] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [email, setEmail] = React.useState('')

  return (
    <div className='w-screen h-screen flex justify-center items-center'>
      <form className='grid gap-2 grid-cols-1' onSubmit={(e) => {
        e.preventDefault()
        createAccountMutation.mutate({email, password, name})
      }}>
        <Input label='Name' value={name} onChange={(e) => setName(e.target.value as string)} isInvalidBlur={!!validateName(name)} errorMessage={validateName(name)} />
        <Input label='Email' value={email} onChange={(e) => setEmail(e.target.value as string)} isInvalidBlur={!!validateEmail(email)} errorMessage={validateEmail(email)} />
        <Input label='Password' type='password' value={password} onChange={(e) => setPassword(e.target.value as string)} isInvalidBlur={!!validatePassword(password)} errorMessage={validatePassword(password)} />
        <button className='bg-blue-600 text-white rounded py-2'>Submit</button>
      </form>
    </div>
  )
}

export default SignupView
