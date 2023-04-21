import React from 'react'

import ViewSkeleton from '../../components/view/ViewSkeleton'
import { useGetNoteInCurrentGroup } from '../../hooks/api/notes'
import { useNoteIdFromUrl } from '../../hooks/url'
import NoteViewMetadataHeader from './NoteMetadataHeader'
import NoteViewEditor from './NoteViewEditor'
import NoteViewHeader from './NoteViewHeader'

function editorLoadingSkeleton(): React.ReactElement<unknown, string> | null {
  return <div className='m-lg grid gap-2 opacity-50 xl:m-xl'>
    <div className='skeleton mb-2 h-6 w-96' />
    <div className='skeleton h-4 w-full' />
    <div className='skeleton h-4 w-full' />
    <div className='skeleton h-4 w-full' />
    <div className='skeleton h-4 w-2/3 ' />
    <div className='skeleton mb-2 mt-6 h-6 w-96' />
    <div className='skeleton h-4 w-full' />
    <div className='skeleton h-32 w-full opacity-50' />
  </div>
}

const NoteView: React.FC = () => {
  const noteId = useNoteIdFromUrl()
  const noteQuery = useGetNoteInCurrentGroup({ noteId })

  return <ViewSkeleton titleElement={<NoteViewHeader />} panels={['group-chat', 'group-activity', 'note-recommendations']}>
    <div className='w-full'>
      <NoteViewMetadataHeader />
      {
        noteQuery.data ?
          <NoteViewEditor note={noteQuery.data.note} />
          :
          editorLoadingSkeleton()
      }
    </div>
  </ViewSkeleton>
}

export default NoteView