import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import React, { RefObject } from 'react'
import toast from 'react-hot-toast'
import { FormattedMessage } from 'react-intl'
import { useLocation, useNavigate } from 'react-router-dom'

import Notification from '../../components/notification/Notification'
import Authentication from '../../components/view/Authentication'
import { useResetPasswordContext } from '../../hooks/api/accounts'
import { useForgetAccountPassword, useForgetAccountPasswordValidateToken } from '../../hooks/api/password'
import { FormatMessage, useOurIntl } from '../../i18n/TextComponent'
import { V1ForgetAccountPasswordResponse, V1ForgetAccountPasswordValidateTokenResponse } from '../../protorepo/openapi/typescript-axios'

const ResetPasswordEmail: React.FC = () => {
  const { formatMessage } = useOurIntl()
  const navigate = useNavigate()
  const resetPasswordContext = useResetPasswordContext()
  const [isAccountIdValid, ] =  React.useState(resetPasswordContext.account?.account_id !== null)
  const [isEmailResend, setIsEmailResend] =  React.useState(false)
  const location = useLocation()
  const email = location.state?.email || ''
  const [codes, setCodes] = React.useState(['', '', '', ''])
  const inputRefs = React.useRef<Array<RefObject<HTMLInputElement>>>(Array(4).fill(null).map(() => React.createRef()))
  
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
  
  const forgetAccountPasswordMutation = useForgetAccountPassword({
    onSuccess: (data: V1ForgetAccountPasswordResponse) => {
      resetPasswordContext.changeResetPassword({account_id: data.accountId, reset_token: null, auth_token: null})
    },
    onError: (e) => {
      toast.error(e.response?.data.error as string)
    }
  })

  const forgetAccountPasswordValidateTokenMutation = useForgetAccountPasswordValidateToken({
    onSuccess: (data: V1ForgetAccountPasswordValidateTokenResponse) => {
      resetPasswordContext.changeResetPassword({account_id: data.account.id, reset_token: data.resetToken, auth_token: data.authToken})
      navigate('/reset_password_password') 
    },
    onError: () => {
      toast.error(formatMessage({ id: 'RESETPWD.Token.badToken' }) as string)
      setCodes(['', '', '', ''])
      inputRefs.current.map((e) => {e.current?.blur()})
    },
  })

  React.useEffect(() => {
    const areAllNumbers = codes.every((element) => !isNaN(parseFloat(element)) && typeof parseFloat(element) === 'number')

    if (areAllNumbers) {
      forgetAccountPasswordValidateTokenMutation.mutate({body: {accountId: resetPasswordContext.account?.account_id as string, token: codes.join('')}})
      setIsEmailResend(false)
    }
  }, [codes])

  return (
    <Authentication animName='error'>
      <form>
        <Stack direction='column' spacing={2}>
          <Typography variant='h4' align='center' fontWeight='bold'>
            <FormatMessage id='RESETPWD.Token.title' />
          </Typography>
          {(!isAccountIdValid || email === '') && <div className='leading-tight tracking-tight'>
            <span className='text-red-500'>Account Error</span>
          </div>}
          <p className='text-lg leading-tight tracking-tight text-gray-900'>
            <FormatMessage id='RESETPWD.Token.desc' />
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
            {formatMessage({ id: 'RESETPWD.Token.noCode' })}
            <Button
              color='primary'
              size='small'
              onClick={() => {
                forgetAccountPasswordMutation.mutate({body: {email}})
                setIsEmailResend(true)
              }}
            >
              <FormattedMessage id='RESETPWD.Token.resend' />
            </Button>
          </Typography>
          {isEmailResend && 
           <Typography variant='body2' align='center' color='primary' mt={2}>
             <FormattedMessage id='RESETPWD.Token.tokenResend' />
           </Typography>
          }
        </Stack>
      </form>
      <Notification />
    </Authentication>
  )
}

export default ResetPasswordEmail
