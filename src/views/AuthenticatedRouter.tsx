import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Dashboard from '../components/view/Dashboard'
import HomeView from './home/HomeView'
import ProfileView from './home/ProfileView'
import SettingsView from './home/SettingsView'

// Describes routes that are available to authenticated users.
const AuthenticatedRouter: React.FC = () => {
  return (
    <Routes>
      <Route path='/' element={<Dashboard />}>
        <Route path='' element={<HomeView />} />
        <Route path='profile' element={<ProfileView />} />
        <Route path='settings' element={<SettingsView />} />
        <Route path='*' element={<div>Not Found</div>} />
      </Route>
    </Routes>
  )
}

export default AuthenticatedRouter
