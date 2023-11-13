import { getAnalytics, logEvent } from 'firebase/analytics'
import React from 'react'
import toast from 'react-hot-toast'
import { useLocation, useNavigate } from 'react-router-dom'

import ContainerMd from '../../components/container/ContainerMd'
import OldInput from '../../components/form/OldInput'
import { addAccountToDevelopmentContext, useDevelopmentContext } from '../../contexts/dev'
import { useNoAuthContext } from '../../contexts/noauth'
import { useAuthenticate, useSendValidationToken, useValidateAccount, ValidateAccountRequest } from '../../hooks/api/accounts'
import { FormatMessage, useOurIntl } from '../../i18n/TextComponent'
import { decodeToken } from '../../lib/api'
import { TOGGLE_DEV_FEATURES } from '../../lib/env'
import { validateCode } from '../../lib/validators'
import { V1AuthenticateResponse } from '../../protorepo/openapi/typescript-axios'

const ValidateAccountView: React.FC = () => {
  const analytics = getAnalytics()
  const navigate = useNavigate()
  const auth = useNoAuthContext()
  const location = useLocation()

  const { email, password } = location.state as { email: string, password: string }

  const developmentContext = useDevelopmentContext()

  const sendValidationEmailMutation = useSendValidationToken()

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
        logEvent(analytics, 'login', {
          method: 'mail'
        })
      }
      navigate('/')
    },
    onError: (e) => {
      toast.error(e.response?.data.error as string)
    }
  })

  const validateAccountMutation = useValidateAccount({
    onSuccess: () => {
      authenticateMutation.mutate({ body: { email, password } })
    }
  })

  const { formatMessage } = useOurIntl()
  const [code, setCode] = React.useState('')
  const [codeValid, setCodeValid] = React.useState(false)

  return (
    <div className='flex h-screen w-screen items-center justify-center'>
      <ContainerMd>
        <h2 className='mb-4 text-xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white md:text-2xl'>
          <FormatMessage id='VALIDATION.title' />
        </h2>
        <OldInput
          label={formatMessage({ id: 'VALIDATION.content' })}
          placeholder={formatMessage({ id: 'VALIDATION.placeholder' })}
          onChange={(e) => {
            const val = e.target.value as string
            setCode(val)
            setCodeValid(validateCode(val) === undefined)
          }}
          isInvalidBlur={!codeValid}
          errorMessage='Invalid code'
        />
        <div className='my-4 mx-2 flex flex-row'>
          <label className='mr-1 text-sm leading-tight tracking-tight text-gray-900 dark:text-white'>
            <FormatMessage id='VALIDATION.resend' />
          </label>
          <label className='cursor-pointer text-sm  font-semibold leading-tight tracking-tight text-gray-900 underline dark:text-white'
            onClick={() => {
              sendValidationEmailMutation.mutate({ body: ({ email: email, password: password }) } as ValidateAccountRequest)
            }}
          >
            <FormatMessage id='VALIDATION.resend_link' />

          </label>
        </div>
        <button
          className='my-2 mt-4 w-full rounded-lg bg-blue-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:bg-gray-600 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
          disabled={
            !codeValid
          }
          onClick={() => validateAccountMutation.mutate({ body: ({ email: email, password: password, validationToken: code }) } as ValidateAccountRequest)}
        ><FormatMessage id='VALIDATION.button' /></button>

      </ContainerMd>
    </div>
  )
}

export default ValidateAccountView
