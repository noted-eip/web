import { Group } from '@mui/icons-material'
import { Box, Container,Typography, useTheme } from '@mui/material'
import { grey } from '@mui/material/colors'
import React from 'react'
import { useNavigate } from 'react-router-dom'

import ViewSkeleton from '../../components/view/ViewSkeleton'
import { useAuthContext } from '../../contexts/auth'
import { useGroupContext } from '../../contexts/group'
import { useListGroups } from '../../hooks/api/groups'
import { useListNotes } from '../../hooks/api/notes'
import { FormatMessage, useOurIntl } from '../../i18n/TextComponent'
import { NotesListGridItemNoGroup } from '../notes/NotesView'

const HomeView: React.FC = () => {
  const { formatMessage } = useOurIntl()
  const authContext = useAuthContext()
  const theme = useTheme()
  const navigate = useNavigate()
  const groupContext = useGroupContext()
  const listNotesQ = useListNotes({authorAccountId: authContext.accountId, limit: 8})
  const listGroupsQ = useListGroups({accountId: authContext.accountId, limit: 8})

  return (<ViewSkeleton title={formatMessage({ id: 'GENERIC.home' })} panels={['group-activity-no-group']}>
    <Container sx={{ mt: 3 }} >
      <Box className='mb-4 rounded-3xl border border-gray-400'>
        <Typography variant='h5' gutterBottom
          sx={{ color: grey[800] }}
          style={{
            marginTop: '11.9px',
            marginLeft: '20px'
          }}>
          <FormatMessage id='HOME.lastGroups' />
        </Typography>
        <div className='m-4 grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-3 lg:grid-cols-3 lg:gap-4 xl:grid-cols-4'>
          {listGroupsQ.isSuccess ? (
            listGroupsQ.data?.groups?.map((group, idx) => {
              const handleViewGroup = () => {
                groupContext.changeGroup(group.id)
                navigate(`/group/${group.id}`)
              }
              return (<div
                className='flex h-24 w-full cursor-pointer flex-col items-center justify-center rounded-md border border-gray-100 bg-gray-50 p-2 transition-all hover:bg-gray-100 hover:shadow-inner'
                onClick={handleViewGroup}
                key={`group-view-notes-tab-grid-${group.id}-${idx}`}
              >
                <Group style={{ color: theme.palette.primary.main }} />
                <div className='w-full text-center'>
                  <div className='text-xs font-medium text-gray-800'>{group.name}</div>
                </div>
              </div>)
            })
          ) : (
            <div className='skeleton h-48 w-full' />
          )}
        </div>
      </Box>
      <Box className='rounded-3xl border border-gray-400'>
        <Typography variant='h5' gutterBottom
          sx={{ color: grey[800] }}
          style={{
            marginTop: '11.9px',
            marginLeft: '20px'
          }}>
          <FormatMessage id='HOME.lastNotes' />
        </Typography>
        <div className='m-4 grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-3 lg:grid-cols-3 lg:gap-4 xl:grid-cols-4'>
          {listNotesQ.isSuccess ? (
            listNotesQ.data?.notes?.map((note, idx) => (
              <NotesListGridItemNoGroup
                key={`group-view-notes-tab-grid-${note.id}-${idx}`}
                note={note}
              />
            ))
          ) : (
            <div className='skeleton h-48 w-full' />
          )}
        </div>
      </Box>
    </Container>
  </ViewSkeleton>)
}

export default HomeView
