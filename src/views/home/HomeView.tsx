import { Box, Container, Grid, Paper, styled,Typography } from '@mui/material'
import React from 'react'

import ViewSkeleton from '../../components/view/ViewSkeleton'
import { useListNotesInCurrentGroup } from '../../hooks/api/notes'
import { useOurIntl } from '../../i18n/TextComponent'
import { NotesListGridItem } from '../group/GroupViewNotesTab'

const HomeView: React.FC = () => {
  const { formatMessage } = useOurIntl()
  const Item = styled(Paper)(() => ({
    border: '1px solid #ccc',
    backgroundColor: '#98d6a9',
    textAlign: 'center',
    color: 'black',
  }))
  const listNotesQ = useListNotesInCurrentGroup({})
  // className='lg:px-lg lg:pb-lg xl:px-xl xl:pb-xl'
  return (<ViewSkeleton title={formatMessage({ id: 'GENERIC.home' })} panels={['group-activity']}>
    <Container sx={{ mt: 3 }} >
      <Box sx={{border: '1px solid #ccc' }}>
        <Typography variant='h4' gutterBottom>
        DERNIERE
        </Typography>
        <Grid
          sx={{
            overflowY: 'scroll',
            maxHeight: '400px'
          }}
          container
          spacing={2}
        >
          {/* <Container sx={{mt: 3}}>
      <Item sx={{overflowY: 'auto', maxHeight: '400px'}}>
        <Grid
          container
          spacing={2}> */}
          {listNotesQ.isSuccess ? (
            listNotesQ.data?.notes?.map((note, idx) => (
              <Grid
                item
                xs={8}
                lg={6}              
                xl={3}
                key={`group-view-notes-tab-grid-${note.id}-${idx}`}
              >
                <NotesListGridItem
                  note={note}
                />
              </Grid>
            ))
          ) : (
            <div className='skeleton h-48 w-full' />
          )}
          {/* </Grid>
      </Item>
    </Container> */}
        </Grid>
      </Box>
    </Container>
  </ViewSkeleton>)
}

export default HomeView
