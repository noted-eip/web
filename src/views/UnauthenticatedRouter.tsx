import React from 'react'
import { Route, Routes } from 'react-router-dom'

import NotFoundView from './notfound/NotFoundView'
import SigninView from './signin/SigninView'
import SignupView from './signup/SignupView'
import WelcomeView from './welcome/WelcomeView'
import ResetPasswordEmail from './reset-password/ResetPasswordEmail'
import ResetPasswordPassword from './reset-password/ResetPasswordPassword'

// Describes routes that are available to unauthenticated users.
const UnauthenticatedRouter: React.FC = () => {
  return (
    <Routes>
      <Route path='/' element={<WelcomeView />}></Route>
      <Route path='/signin' element={<SigninView />}></Route>
      <Route path='/signup' element={<SignupView />}></Route>
      <Route path='/reset_password_email' element={<ResetPasswordEmail />}></Route>
      <Route path='/reset_password_password' element={<ResetPasswordPassword />}></Route>
      <Route path='*' element={<NotFoundView />}></Route>
    </Routes>
  )
}

export default UnauthenticatedRouter
