import React from 'react'
import { Route, Routes } from 'react-router-dom'

import { AccountIdContext } from '../hooks/api/accounts'
import { LS_ACCOUNT_ID_KEY, LS_RESET_TOKEN_KEY } from '../lib/constants'
import NotFoundView from './notfound/NotFoundView'
import ResetPasswordEmail from './reset-password/ResetPasswordEmail'
import ResetPasswordPassword from './reset-password/ResetPasswordPassword'
import ResetPasswordToken from './reset-password/ResetPasswordToken'
import SigninView from './signin/SigninView'
import SignupView from './signup/SignupView'
import WelcomeView from './welcome/WelcomeView'

// Describes routes that are available to unauthenticated users.
const UnauthenticatedRouter: React.FC = () => {
  const [accountId, setAccountId] = React.useState<string | null>(
    window.localStorage.getItem(LS_ACCOUNT_ID_KEY)
  )
  const [resetToken, setResetToken] = React.useState<string | null>(
    window.localStorage.getItem(LS_RESET_TOKEN_KEY)
  )
  const changeAccountId = (val) => {
    setAccountId(val)
    if (val === null) {
      window.localStorage.removeItem(LS_ACCOUNT_ID_KEY)
    } else {
      window.localStorage.setItem(LS_ACCOUNT_ID_KEY, val)
    }
  }
  const changeResetToken = (val) => {
    setAccountId(val)
    if (val === null) {
      window.localStorage.removeItem(LS_RESET_TOKEN_KEY)
    } else {
      window.localStorage.setItem(LS_RESET_TOKEN_KEY, val)
    }
  }

  return (
    <AccountIdContext.Provider value={{account_id: accountId, changeAccountId: changeAccountId, reset_token: resetToken, changeResetToken: changeResetToken}}>
      <Routes>
        <Route path='/' element={<WelcomeView />}></Route>
        <Route path='/signin' element={<SigninView />}></Route>
        <Route path='/signup' element={<SignupView />}></Route>
        <Route path='/reset_password_email' element={<ResetPasswordEmail />}></Route>
        <Route path='/reset_password_token' element={<ResetPasswordToken />}></Route>
        <Route path='/reset_password_password' element={<ResetPasswordPassword />}></Route>
        <Route path='*' element={<NotFoundView />}></Route>
      </Routes>
    </AccountIdContext.Provider>
  )
}

export default UnauthenticatedRouter
