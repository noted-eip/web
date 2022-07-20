import React from 'react'
import { Route, Routes } from 'react-router-dom'
import HomeView from './home/HomeView'

// Describes routes that are available to authenticated users.
const AuthenticatedRouter: React.FC = () => {
  return (
    <Routes>
      <Route path='/' element={<HomeView />}></Route>
    </Routes>
  )
}

export default AuthenticatedRouter
