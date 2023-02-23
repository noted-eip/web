import React from 'react'
import ViewSkeleton from '../../components/view/ViewSkeleton'
import NoteViewMetadataHeader from './NoteMetadataHeader'
import NoteViewEditor from './NoteViewEditor'
import NoteViewHeader from './NoteViewHeader'

const NoteView: React.FC = () => {
  return <ViewSkeleton titleElement={<NoteViewHeader />} panels={['group-chat', 'group-activity', 'note-recommendations']}>
    <div className='w-full'>
      <NoteViewMetadataHeader />
      <NoteViewEditor />
    </div>
  </ViewSkeleton>
}

export default NoteView
