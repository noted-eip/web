import {useLocation} from 'react-router-dom'
import React from 'react'
import {useGetNote} from '../../hooks/api/notes'
import {GetNoteRequest} from '../../types/api/notes'

const NotesViewEdit: React.FC = () => {
  const location = useLocation()
  // très moche
  const note_id: GetNoteRequest = {note_id: location.pathname.split('/')[4]}
  const getNoteQ = useGetNote(note_id)

  return (<div>
    {getNoteQ?.data && <><p>Title: {getNoteQ?.data?.data.note.title}</p>
      <p>created_at: {getNoteQ?.data?.data.note.created_at}</p>
      <p>modified_at: {getNoteQ?.data?.data.note.modified_at}</p>
      {getNoteQ?.data?.data.note.blocks?.map((e, idx) => {

        return (<div key={e.id}>
          {`BLOCK ${idx} `}
          {e.heading && `header: ${e.heading} `}
          {e.paragraph && `paragraph: ${e.paragraph} `}
          type: {e.type}
        </div>)
      })}
    </>}
  </div>)
}

export default NotesViewEdit