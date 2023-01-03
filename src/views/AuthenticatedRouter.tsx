import React from 'react'
import { Route, Routes, useNavigate } from 'react-router-dom'
import ErrorBoundary from '../components/eboundary/ErrorBoundary'
import Dashboard from '../components/view/Dashboard'
import { GroupContext } from '../contexts/group'
import { LS_GROUP_ID_KEY } from '../lib/constants'
import GroupView from './group/GroupView'
import GroupViewNotesTab from './group/GroupViewNotesTab'
import GroupViewSettingsTab from './group/GroupViewSettingsTab'
import GroupViewUpgradeTab from './group/GroupViewUpgradeTab'
import NotFoundView from './notfound/NotFoundView'
import ProfileView from './profile/ProfileView'
import SettingsView from './settings/SettingsView'

// Describes routes that are available to authenticated users.
const AuthenticatedRouter: React.FC = () => {
  const navigate = useNavigate()
  const [groupID, setGroupID] = React.useState<string | null>(window.localStorage.getItem(LS_GROUP_ID_KEY))

  const changeGroup = (val) => {
    setGroupID(val)
    if (val === null) {
      window.localStorage.removeItem(LS_GROUP_ID_KEY)
      navigate('/')
    } else {
      window.localStorage.setItem(LS_GROUP_ID_KEY, val)
      navigate(`/group/${val}`)
    }
  }

  return (
    <GroupContext.Provider value={{groupID, changeGroup}}>
      <Routes>
        <Route path='/' element={<Dashboard />}>
          <Route path='' element={<GroupView />} />
          <Route path='group/:groupId' element={<GroupView />}>
            <Route path='' element={<GroupViewNotesTab />} />
            <Route path='settings' element={<GroupViewSettingsTab />} />
            <Route path='upgrade' element={<GroupViewUpgradeTab />} />
          </Route>
          <Route path='profile' element={<ProfileView />} />
          <Route path='settings' element={<SettingsView />} />
        </Route>
        <Route path='*' element={<NotFoundView />} />
      </Routes>
    </GroupContext.Provider>
  )
}


export default AuthenticatedRouter
