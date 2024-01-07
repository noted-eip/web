import React from 'react'
import { Route, Routes } from 'react-router-dom'

import {
  AccountResetPassword,
  ResetPasswordContext
} from '../hooks/api/accounts'
import {
  LS_ACCOUNT_ID_KEY,
  LS_RESET_AUTH_TOKEN_KEY,
  LS_RESET_TOKEN_KEY
} from '../lib/constants'
import ValidateAccountView from '../views/validate-account/ValidateAccountVIew'
import NotFoundView from './notfound/NotFoundView'
import ResetPasswordEmail from './reset-password/ResetPasswordEmail'
import ResetPasswordPassword from './reset-password/ResetPasswordPassword'
import ResetPasswordToken from './reset-password/ResetPasswordToken'
import SigninView from './signin/SigninView'
import SignupView from './signup/SignupView'
import WelcomeView from './welcome/WelcomeView'

// Describes routes that are available to unauthenticated users.
const UnauthenticatedRouter: React.FC = () => {
  // Initialisation of data required to reset a password without the user being logged in 
  const [account, setAccount] = React.useState<AccountResetPassword | null>(
    {
      account_id: window.localStorage.getItem(LS_ACCOUNT_ID_KEY),
      reset_token: window.localStorage.getItem(LS_RESET_TOKEN_KEY),
      auth_token: window.localStorage.getItem(LS_RESET_AUTH_TOKEN_KEY)
    }
  )

  // Change reset password account function
  const changeResetPassword = (val: AccountResetPassword | null) => {
    setAccount(val)
    if (val === null) {
      // Remove stored reset password information from localStorage
      window.localStorage.removeItem(LS_RESET_TOKEN_KEY)
      window.localStorage.removeItem(LS_ACCOUNT_ID_KEY)
      window.localStorage.removeItem(LS_RESET_AUTH_TOKEN_KEY)
    } else {
      // Store reset password information in localStorage
      window.localStorage.setItem(LS_ACCOUNT_ID_KEY, val.account_id as string)
      window.localStorage.setItem(LS_RESET_TOKEN_KEY, val.reset_token as string)
      window.localStorage.setItem(LS_RESET_AUTH_TOKEN_KEY, val.auth_token as string)
    }
  }

  return (
    // Context provider for reset password functionality
    <ResetPasswordContext.Provider
      value={{ account: account, changeResetPassword: changeResetPassword }}
    >
      {/* Define routes for unauthenticated users */}
      <Routes>
        <Route path='/' element={<WelcomeView />}></Route>
        <Route path='/signin' element={<SigninView />}></Route>
        <Route path='/signup' element={<SignupView />}></Route>
        <Route path='/reset_password_email' element={<ResetPasswordEmail />}></Route>
        <Route path='/reset_password_token' element={<ResetPasswordToken />}></Route>
        <Route path='/reset_password_password' element={<ResetPasswordPassword />}></Route>
        <Route path='/validate_account' element={<ValidateAccountView />}></Route>
        <Route path='*' element={<NotFoundView />}></Route>
      </Routes>
    </ResetPasswordContext.Provider>
  )
}

export default UnauthenticatedRouter
