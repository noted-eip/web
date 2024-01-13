import { Button,Stack, TextField, Typography } from '@mui/material'
import { getAnalytics, logEvent } from 'firebase/analytics'
import React, { RefObject, useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { useLocation, useNavigate } from 'react-router-dom'

import Notification from '../../components/notification/Notification'
import Authentication from '../../components/view/Authentication'
import { addAccountToDevelopmentContext, useDevelopmentContext } from '../../contexts/dev'
import { useNoAuthContext } from '../../contexts/noauth'
import { useAuthenticate, useSendValidationToken, useValidateAccount, ValidateAccountRequest } from '../../hooks/api/accounts'
import { FormatMessage, useOurIntl } from '../../i18n/TextComponent'
import { decodeToken } from '../../lib/api'
import { TOGGLE_DEV_FEATURES } from '../../lib/env'
import { V1AuthenticateResponse } from '../../protorepo/openapi/typescript-axios'

const ValidateAccountView: React.FC = () => {
  const analytics = getAnalytics()
  const navigate = useNavigate()
  const auth = useNoAuthContext()
  const location = useLocation()
  const [isEmailResend, setIsEmailResend] = React.useState(false)

  const { formatMessage } = useOurIntl()
  const { email, password } = location.state as { email: string, password: string }
  const [codes, setCodes] = useState(['', '', '', ''])
  const inputRefs = useRef<Array<RefObject<HTMLInputElement>>>(Array(4).fill(null).map(() => React.createRef()))
  
  const handleChange = (index: number, value: string) => {
    const newCodes = [...codes]
    newCodes[index] = value
    setCodes(newCodes)

    if (value !== '' && index < 3) {
      inputRefs.current[index + 1].current?.focus()
    }
  }

  const handleKeyDown = (index: number, event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Backspace' && index > 0 && !codes[index]) {
      inputRefs.current[index - 1].current?.focus()
    }
  }
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
    },
    onError: () => {
      // TODO: oui ca poiurrai etre une autre erreur peut etre
      toast.error(formatMessage({ id: 'RESETPWD.Token.badToken' }) as string)
      setCodes(['', '', '', ''])
      inputRefs.current.map((e) => {e.current?.blur()})
    },
  })

  useEffect(() => {
    const areAllNumbers = codes.every((element) => !isNaN(parseFloat(element)) && typeof parseFloat(element) === 'number')

    if (areAllNumbers) {
      validateAccountMutation.mutate({ body: ({ email: email, password: password, validationToken: codes.join('') }) } as ValidateAccountRequest)      
      setIsEmailResend(false)
    }
  }, [codes])

  return (
    <Authentication animName='login'>
      <form>
        <Stack direction='column' spacing={2}>
          <Typography variant='h4' align='center' fontWeight='bold'>
            <FormatMessage id='VALIDATION.title' />
          </Typography>
          <p className='text-lg leading-tight tracking-tight text-gray-900'>
            <FormatMessage id='VALIDATION.content' />
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'  }}>
            {codes.map((value, index) => (
              <TextField
                key={index}
                inputRef={inputRefs.current[index]}
                type='token'
                value={value}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                style={{
                  width: '2em',
                  marginRight: `${index !== 3 ? '8' : '0'}px`,
                  textAlign: 'center',
                  fontSize: '1.2em',
                  display: 'flex',
                  alignItems: 'center',
                }}
                inputProps={{
                  maxLength: 1,
                }}
              />
            ))}
          </div>
          <Typography variant='body2' align='center' color='textSecondary' mt={2}>
            {formatMessage({ id: 'VALIDATION.resend' })}
            <Button
              color='primary'
              size='small'
              onClick={() => {
                sendValidationEmailMutation.mutate({ body: ({ email: email, password: password }) } as ValidateAccountRequest)
                setIsEmailResend(true)
              }}
            >
              {formatMessage({ id: 'VALIDATION.resend_link' })}
            </Button>
          </Typography>
          {isEmailResend && 
           <Typography variant='body2' align='center' color='primary' mt={2}>
             {formatMessage({ id: 'RESETPWD.Token.tokenResend' })}
           </Typography>
          }
        </Stack>
      </form>
      <Notification />
    </Authentication>
  )
}

export default ValidateAccountView
