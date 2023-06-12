import React from 'react'
import { useNavigate } from 'react-router-dom'

import ContainerMd from '../../components/container/ContainerMd'
import OldInput from '../../components/form/OldInput'
import { useResetPasswordContext } from '../../hooks/api/accounts'
import { useForgetAccountPassword } from '../../hooks/api/password'
import { FormatMessage, useOurIntl } from '../../i18n/TextComponent'
import { validateEmail } from '../../lib/validators'
import { V1ForgetAccountPasswordResponse } from '../../protorepo/openapi/typescript-axios'


const ResetPasswordEmail: React.FC = () => {
  const { formatMessage } = useOurIntl()
  const navigate = useNavigate()
  const resetPasswordContext = useResetPasswordContext()
  const [email, setEmail] = React.useState('')
  const [emailValid, setEmailValid] = React.useState(false)
  const forgetAccountPasswordMutation = useForgetAccountPassword({
    onSuccess: (data: V1ForgetAccountPasswordResponse) => {
      resetPasswordContext.changeResetPassword({account_id: data.accountId, reset_token: null, auth_token: null})
      navigate('/reset_password_token')
    },
  })
  const formIsValid = () => {
    return emailValid
  }

  return (
    <div className='flex h-screen w-screen items-center justify-center'>
      <form
        className='grid basis-1/2 grid-cols-1 gap-2'
        onSubmit={(e) => {
          e.preventDefault()
          forgetAccountPasswordMutation.mutate({body: {email}})
        }}
      >
        <ContainerMd>
          <h2 className='mb-4 text-xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white md:text-2xl'>
            <FormatMessage id='RESETPWD.Email.title' />
          </h2>
          <p 
            className='mb-2 text-lg leading-tight tracking-tight text-gray-900'>
            <FormatMessage id='RESETPWD.Email.desc1' />
          </p>
          <p 
            className='mb-4 text-sm leading-tight tracking-tight text-gray-500'>
            <FormatMessage id='RESETPWD.Email.desc2' />
          </p>
          <OldInput
            label={formatMessage({ id: 'RESETPWD.Email.form' })}
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
            <FormatMessage id='RESETPWD.Email.button' />
          </button>
        </ContainerMd>
      </form>
    </div>
  )
}

export default ResetPasswordEmail