import React from 'react'
import { Route, Routes, useNavigate } from 'react-router-dom'

import Dashboard from '../components/view/Dashboard'
import { BlockContext } from '../contexts/block'
import { GroupContext } from '../contexts/group'
import { RecoModeContext } from '../contexts/recommendation'
import { LS_BLOCK_ID_KEY, LS_GROUP_ID_KEY, LS_RECO_MODE } from '../lib/constants'
import GroupList from './group/GroupList'
import GroupView from './group/GroupView'
import GroupViewNotesTab from './group/GroupViewNotesTab'
import GroupViewSettingsTab from './group/GroupViewSettingsTab'
import HomeView from './home/HomeView'
import NoteView from './note/NoteView'
import NotesView from './notes/NotesView'
import NotFoundView from './notfound/NotFoundView'
import ProfileView from './profile/ProfileView'

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
        <RecoModeContext.Provider value={{ recoMode: recoMode, changeRecoMode }}>
          <Routes>
            <Route path='/' element={<Dashboard />}>
              <Route path='' element={<HomeView />} />
              <Route path='home' element={<HomeView />} />
              <Route path='groups' element={<GroupList />} />
              <Route path='group/:groupId' element={<GroupView />}>
                <Route path='' element={<GroupViewNotesTab />} />
                <Route path='settings' element={<GroupViewSettingsTab />} />
              </Route>
              <Route path='group/:groupId/note/:noteId' element={<NoteView />} />
              <Route path='notes' element={<NotesView />} />
              <Route path='profile' element={<ProfileView />} />
            </Route>
            <Route path='*' element={<NotFoundView />} />
          </Routes>
        </RecoModeContext.Provider>
      </BlockContext.Provider>
    </GroupContext.Provider>
  )
}

export default AuthenticatedRouter
