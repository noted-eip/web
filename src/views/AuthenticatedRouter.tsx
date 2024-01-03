import React from 'react'
import { Route, Routes, useNavigate } from 'react-router-dom'

import Dashboard from '../components/view/Dashboard'
import { BlockContext } from '../contexts/block'
import { GroupContext } from '../contexts/group'
import TNoteContextProvider from '../contexts/note'
import { RecoModeContext } from '../contexts/recommendation'
import { LS_BLOCK_ID_KEY, LS_GROUP_ID_KEY, LS_RECO_MODE } from '../lib/constants'
import GroupView from './group/GroupView'
import GroupViewNotesTab from './group/GroupViewNotesTab'
import GroupViewSettingsTab from './group/GroupViewSettingsTab'
import GroupViewUpgradeTab from './group/GroupViewUpgradeTab'
import NoteView from './note/NoteView'
import NotFoundView from './notfound/NotFoundView'
import ProfileView from './profile/ProfileView'
import SettingsView from './settings/SettingsView'

// Describes routes that are available to authenticated users.
const AuthenticatedRouter: React.FC = () => {
  const navigate = useNavigate()
  const [groupID, setGroupID] = React.useState<string | null>(
    window.localStorage.getItem(LS_GROUP_ID_KEY)
  )

  const [recoMode, setRecoMode] = React.useState<string | null>(
    window.localStorage.getItem(LS_RECO_MODE)
  )

  const [blockId, setBlock] = React.useState<string | null>(null)

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

  const changeRecoMode = (val) => {
    setRecoMode(val)
    if (val === null) {
      window.localStorage.removeItem(LS_RECO_MODE)
    } else {
      window.localStorage.setItem(LS_RECO_MODE, val)
    }
  }

  const changeBlock = (val) => {
    setBlock(val)
    if (val !== null) {
      window.localStorage.setItem(LS_BLOCK_ID_KEY, val)
    }
  }

  return (
    <GroupContext.Provider value={{ groupId: groupID, changeGroup }}>
      <BlockContext.Provider value={{ blockId: blockId, changeBlock }}>
        <TNoteContextProvider>
          <RecoModeContext.Provider value={{ recoMode: recoMode, changeRecoMode }}>
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
                <Route path='group/:groupId/note/:noteId' element={<NoteView />} />
              </Route>
              <Route path='*' element={<NotFoundView />} />
            </Routes>
          </RecoModeContext.Provider>
        </TNoteContextProvider>
      </BlockContext.Provider>
    </GroupContext.Provider>
  )
}

export default AuthenticatedRouter
