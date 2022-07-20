import React from 'react'
import { Route, Routes } from 'react-router-dom'
import SigninView from './signin/SigninView'
import SignupView from './signup/SignupView'
import WelcomeView from './welcome/WelcomeView'

// Describes routes that are available to unauthenticated users.
const UnauthenticatedRouter: React.FC = () => {
  return (
    <Routes>
      <Route path='/' element={<WelcomeView />}></Route>
      <Route path='/signin' element={<SigninView />}></Route>
      <Route path='/signup' element={<SignupView />}></Route>
    </Routes>
  )
}

export default UnauthenticatedRouter
