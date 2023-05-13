import React from 'react'

import OldInput from '../../components/form/OldInput'
import { useAccountIdContext } from '../../hooks/api/accounts'
import { useForgetAccountPassword } from '../../hooks/api/password'
import { validateEmail } from '../../lib/validators'
import { V1ForgetAccountPasswordResponse } from '../../protorepo/openapi/typescript-axios'


const ResetPasswordEmail: React.FC = () => {
  const [email, setEmail] = React.useState('')
  const [emailValid, setEmailValid] = React.useState(false)
  const accountIdContext = useAccountIdContext()


  const forgetAccountPasswordMutation = useForgetAccountPassword({
    onSuccess: (data: V1ForgetAccountPasswordResponse) => {
      console.log('token send !')
      console.log(data)
      accountIdContext.changeAccountId(data.accountId)
    },
  })
  const formIsValid = () => {
    return emailValid
  }

  return (
    <form
      className='grid grid-cols-1 gap-2'
      onSubmit={(e) => {
        e.preventDefault()
        forgetAccountPasswordMutation.mutate({body: {email}})
      }}
    >
      <section className='bg-gray-50 dark:bg-gray-900'>
        <div className='mx-auto flex flex-col items-center justify-center px-6 py-8 md:h-screen lg:py-0'>
          <div className='w-full rounded-lg bg-white p-6 shadow dark:border dark:border-gray-700 dark:bg-gray-800 sm:max-w-md sm:p-8 md:mt-0'>
            <h2 className='mb-4 text-xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white md:text-2xl'>
              Change password
            </h2>
            <OldInput
              label='Your email'
              value={email}
              onChange={(e) => {
                const val = e.target.value as string
                setEmail(val)
                setEmailValid(validateEmail(val) === undefined)
              }}
              isInvalidBlur={!emailValid}
              errorMessage='Invalid email address'
            />
            <button className='mt-2 w-full rounded-lg bg-blue-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:bg-gray-600 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
              disabled={!formIsValid() || forgetAccountPasswordMutation.isLoading}
            >
              Send Email
            </button>
          </div>
        </div>
      </section>
    </form>
  )
}

export default ResetPasswordEmail