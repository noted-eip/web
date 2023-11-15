import React from 'react'
import { Route, Routes } from 'react-router-dom'

import { AccountResetPassword, ResetPasswordContext } from '../hooks/api/accounts'
import { LS_ACCOUNT_ID_KEY, LS_RESET_AUTH_TOKEN_KEY, LS_RESET_TOKEN_KEY } from '../lib/constants'
import NotFoundView from './notfound/NotFoundView'
import ResetPasswordEmail from './reset-password/ResetPasswordEmail'
import ResetPasswordPassword from './reset-password/ResetPasswordPassword'
import ResetPasswordToken from './reset-password/ResetPasswordToken'
import SigninView from './signin/SigninView'
import SignupView from './signup/SignupView'
import ValidateAccountView from './validate-account/ValidateAccountView'
import WelcomeView from './welcome/WelcomeView'

// Describes routes that are available to unauthenticated users.
const UnauthenticatedRouter: React.FC = () => {
  const [account, setAccount] = React.useState<AccountResetPassword | null>(
    {account_id: window.localStorage.getItem(LS_ACCOUNT_ID_KEY),
      reset_token: window.localStorage.getItem(LS_RESET_TOKEN_KEY),
      auth_token: window.localStorage.getItem(LS_RESET_AUTH_TOKEN_KEY)}
  )
  const changeResetPassword = (val) => {
    setAccount(val)
    if (val === null) {
      window.localStorage.removeItem(LS_RESET_TOKEN_KEY)
      window.localStorage.removeItem(LS_ACCOUNT_ID_KEY)
      window.localStorage.removeItem(LS_RESET_AUTH_TOKEN_KEY)
    } else {
      window.localStorage.setItem(LS_ACCOUNT_ID_KEY, val.account_id)
      window.localStorage.setItem(LS_RESET_TOKEN_KEY, val.reset_token)
      window.localStorage.setItem(LS_RESET_AUTH_TOKEN_KEY, val.auth_token)
    }
  }

  return (
    <ResetPasswordContext.Provider
      value={{account: account, changeResetPassword: changeResetPassword}}
    >
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
