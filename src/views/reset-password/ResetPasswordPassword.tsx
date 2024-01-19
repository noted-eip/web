import { VisibilityOffOutlined, VisibilityOutlined } from '@mui/icons-material'
import { FormControl, FormHelperText,IconButton, InputAdornment, InputLabel, OutlinedInput } from '@mui/material'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import React from 'react'
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

import Notification from '../../components/notification/Notification'
import Authentication from '../../components/view/Authentication'
import { useResetPasswordContext } from '../../hooks/api/accounts'
import { useUpdateAccountPassword } from '../../hooks/api/password'
import { FormatMessage } from '../../i18n/TextComponent'
import { validatePassword } from '../../lib/validators'

const ResetPasswordPassword: React.FC = () => {
  const navigate = useNavigate()
  const resetPasswordContext = useResetPasswordContext()
  const [password, setPassword] =  React.useState('')
  const [passwordValid, setPasswordValid] =  React.useState(false)
  const [showPassword, setShowPassword] =  React.useState(false)
  const [confirmPassword, setConfirmPassword] =  React.useState('')
  const [isResetPasswordValid, ] =  React.useState(resetPasswordContext.account?.account_id !== null 
    || resetPasswordContext.account?.auth_token !== null || resetPasswordContext.account?.reset_token !== null)
  const [showConfirmPassword, setShowConfirmPassword] =  React.useState(false)
  const updateAccountMutation = useUpdateAccountPassword({
    onSuccess: () => {
      resetPasswordContext.changeResetPassword(null)
      navigate('/') 
    },
    onError: (e) => {
      toast.error(e.response?.data.error as string)
    }
  })
  const formIsValid = () => {
    return password === confirmPassword && passwordValid
  }

  const handleClickShowPassword = () => setShowPassword((show) => !show)

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
  }

  const handleClickShowConfirmPassword = () => setShowConfirmPassword((show) => !show)

  const handleMouseDownConfirmPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
  }

  return (
    <Authentication animName='error'>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          updateAccountMutation.mutate({account_id: resetPasswordContext.account?.account_id as string, body: {password, token: resetPasswordContext.account?.reset_token as string}, header: resetPasswordContext.account?.auth_token as string})
        }}
      >
        <Stack direction='column' spacing={2}>
          <Typography variant='h4' align='center' fontWeight='bold'>
            <FormatMessage id='RESETPWD.Pwd.title' />
          </Typography>
          {!isResetPasswordValid && 
            <div className='leading-tight tracking-tight dark:text-white'>
              <span className='text-red-500'>Account Error</span>
            </div>}
          <p 
            className='text-lg leading-tight tracking-tight text-gray-900'>
            <FormatMessage id='RESETPWD.Pwd.desc' />
          </p>
          <FormControl
            variant='outlined'
            error={!passwordValid && password.length != 0}
          >
            <InputLabel
              htmlFor='outlined-adornment-password'
              sx={{ backgroundColor: 'white', padding: '0 4px', marginLeft: '8px', zIndex: 1 }}
            >
              <FormatMessage id='AUTH.pwd' />
            </InputLabel>
            <OutlinedInput
              sx={{ borderRadius: '16px' }}
              id='outlined-adornment-password'
              type={showPassword ? 'text' : 'password'}
              value={password}
              endAdornment={
                <InputAdornment position='end'>
                  <IconButton
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge='end'
                  >
                    {showPassword ? <VisibilityOffOutlined /> : <VisibilityOutlined />}
                  </IconButton>
                </InputAdornment>
              }
              onChange={(e) => {
                const val = e.target.value as string
                setPassword(val)
                setPasswordValid(validatePassword(val) === undefined)
              }}
              onBlur={() => {
                setPasswordValid(validatePassword(password) === undefined)
              }}
            />
            <FormHelperText id='outlined-weight-helper-text'><FormatMessage id='AUTH.error.pwd' /></FormHelperText>
          </FormControl>
          <FormControl
            variant='outlined'
            error={password !== confirmPassword && confirmPassword.length !== 0}
          >
            <InputLabel
              htmlFor='outlined-adornment-password'
              sx={{ backgroundColor: 'white', padding: '0 4px', marginLeft: '8px', zIndex: 1 }}
            >
              <FormatMessage id='RESETPWD.Pwd.form' />
            </InputLabel>
            <OutlinedInput
              sx={{ borderRadius: '16px' }}
              id='outlined-adornment-password'
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              endAdornment={
                <InputAdornment position='end'>
                  <IconButton
                    onClick={handleClickShowConfirmPassword}
                    onMouseDown={handleMouseDownConfirmPassword}
                    edge='end'
                  >
                    {showPassword ? <VisibilityOffOutlined /> : <VisibilityOutlined />}
                  </IconButton>
                </InputAdornment>
              }
              onChange={(e) => {
                setConfirmPassword(e.target.value as string)
              }}
            />
            {password !== confirmPassword && confirmPassword.length !== 0 && <FormHelperText id='outlined-weight-helper-text'><FormatMessage id='RESETPWD.Pwd.form2' /></FormHelperText>}
          </FormControl>
          <Button
            type='submit'
            sx={{ borderRadius: '16px' }}
            size='large'
            variant='contained'
            className='w-full'
            disabled={!formIsValid() || updateAccountMutation.isLoading || !isResetPasswordValid}
          >
            <FormatMessage id='SIGNIN.resetPwd' />
          </Button>
        </Stack>
      </form>
      <Notification />
    </Authentication>
  )
}

export default ResetPasswordPassword