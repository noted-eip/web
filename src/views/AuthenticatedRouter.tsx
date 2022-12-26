import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Dashboard from '../components/view/Dashboard'
import { GroupContext } from '../contexts/group'
import { LS_GROUP_ID_KEY } from '../lib/constants'
import HomeView from './home/HomeView'
import ProfileView from './profile/ProfileView'
import SettingsView from './settings/SettingsView'

// Describes routes that are available to authenticated users.
const AuthenticatedRouter: React.FC = () => {
  const [groupID, setGroupID] = React.useState<string | null>(null)

  React.useEffect(() => {
    const lsGroupID = window.localStorage.getItem(LS_GROUP_ID_KEY)
    if (lsGroupID !== null) {
      setGroupID(groupID)
    }
  }, [])

  return (
    <GroupContext.Provider value={{groupID, changeGroup: (val) => {
      if (val === null) {
        window.localStorage.removeItem(LS_GROUP_ID_KEY)
      } else {
        window.localStorage.setItem(LS_GROUP_ID_KEY, val)
      }
      return setGroupID(val)
    }}}>
      <Routes>
        <Route path='/' element={<Dashboard />}>
          <Route path='' element={<HomeView />} />
          <Route path='profile' element={<ProfileView />} />
          <Route path='settings' element={<SettingsView />} />
          <Route path='*' element={<div>Not Found</div>} />
        </Route>
      </Routes>
    </GroupContext.Provider>
  )
}

export default AuthenticatedRouter
