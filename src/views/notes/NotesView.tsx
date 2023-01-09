import React from 'react'
import ViewSkeleton from '../../components/view/ViewSkeleton'
import NotesViewEdit from './NotesViewEdit'

const NotesView: React.FC = () => {
  return <ViewSkeleton title='Note' panels={['group-chat','group-activity']}>
    {
      <div className='mb-lg mx-lg xl:mb-xl xl:mx-xl w-full'>
        <NotesViewEdit />
      </div>
    }
  </ViewSkeleton>
}

export default NotesView