import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import HomeView from './home/HomeView'
import SigninView from './signin/SigninView'
import SignupView from './signup/SignupView'
import WelcomeView from './welcome/WelcomeView'

const Router: React.FC<{ isAuthenticated: boolean }> = props => {
  return (
    <BrowserRouter>
      {props.isAuthenticated ?
        // These routes are accessible only by authenticated users.
        <Routes>
          <Route path='/' element={<HomeView />}></Route>
        </Routes>
        :
        // These are the routes accessible for a user which is not logged in.
        <Routes>
          <Route path='/' element={<WelcomeView />}></Route>
          <Route path='/signin' element={<SigninView />}></Route>
          <Route path='/signup' element={<SignupView />}></Route>
        </Routes>
      }
    </BrowserRouter>
  )
}

export default Router
